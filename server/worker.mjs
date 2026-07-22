/* ============================================================
 * CARTA sync server — Cloudflare Workers port. Zero dependencies, one file.
 *
 *   cd server && npx wrangler deploy      (see wrangler.toml)
 *
 * Same API as server.js, different home: instead of a Node process with JSON
 * files on disk, everything runs in one SQLite-backed Durable Object on
 * Cloudflare's free plan — always on, HTTPS included, no machine to keep
 * awake. The single object serializes every request, so the rev/409
 * optimistic-concurrency protocol holds without locks.
 *
 * Storage (Durable Object key-value API, strongly consistent):
 *   users            accounts array (same shape as users.json)
 *   tokens           token -> {userId, createdAt}
 *   L:<id>:meta      {rev, updatedAt, chunks, counts} per ledger
 *   L:<id>:<n>       ledger JSON, sliced into chunks (see CHUNK below)
 *   R:meta / R:<n>   the shared café Register, same layout
 *   C:<kind>:meta / C:<kind>:<n>   the catalog (the spine), one doc per kind
 *
 * Ledgers embed photos as base64 and run to many MB; the storage API caps
 * key+value at 2 MB, so document JSON is stored as string chunks and joined
 * on read. Meta + chunks are written in one put() so a document can't tear.
 *
 * Config (wrangler.toml [vars] / secrets):
 *   CARTA_MAX_BODY        max request body in bytes (default 20 MB)
 *   CARTA_REGISTER_CODE   shared sign-up secret — set with `wrangler secret put`
 *
 * Auth model is unchanged from server.js: trust-your-friends, scrypt-hashed
 * passcodes, every keeper reads every ledger, only the owner writes theirs,
 * the café Register and the catalog (the spine) are group-writable. Not a
 * hardened public service.
 * ============================================================ */

import { scrypt, randomBytes, timingSafeEqual, createHash } from 'node:crypto';
import { Buffer } from 'node:buffer';

// Chars per stored chunk. Chunks are ASCII-dominated JSON (base64 photos),
// so 1M chars stays well under the 2 MB key+value cap even after overhead.
const CHUNK = 1_000_000;
// The storage API takes at most 128 keys per get()/put() — batch above that.
const BATCH = 128;
// The spine kinds, whitelisted so a stray path can't mint an arbitrary document.
// An unknown kind 404s and the client keeps it device-local, as with an old server.
const CATALOG_KINDS = ['producers', 'processors', 'aggregators', 'lots', 'blends', 'roasters', 'roasts', 'gear'];

const HEADERS = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
const json = (status, body) => new Response(JSON.stringify(body), { status, headers: HEADERS });
const err = (status, code, message) => json(status, { error: code, message });
// Splice a pre-serialized document into a small meta object without
// re-parsing megabytes of JSON: {"rev":1,...} -> {"rev":1,...,"ledger":<raw>}.
const jsonWith = (status, meta, key, raw) =>
  new Response(JSON.stringify(meta).slice(0, -1) + `,"${key}":${raw ?? 'null'}}`, { status, headers: HEADERS });

const iso = () => new Date().toISOString();
const randHex = n => randomBytes(n).toString('hex');
const kdf = (passcode, salt) => new Promise((res, rej) =>
  scrypt(String(passcode), salt, 64, (e, k) => e ? rej(e) : res(k.toString('hex'))));
function counts(ledger) {
  const n = k => (ledger && Array.isArray(ledger[k]) ? ledger[k].length : 0);
  return { setups: n('setups'), bags: n('bags'), brews: n('brews'), cups: n('cups') };
}

export class CartaStore {
  constructor(ctx, env) {
    this.s = ctx.storage;
    this.maxBody = Number(env.CARTA_MAX_BODY) || 20 * 1024 * 1024;
    this.registerCode = env.CARTA_REGISTER_CODE || '';
    this.boot = Date.now();
    // Naive rate limit, in memory: resets when the object hibernates, which
    // only makes it more forgiving — acceptable for its purpose.
    this.hits = new Map(); // ip -> [timestamps]
  }

  /* ---------- storage helpers ---------- */
  async users() { return (await this.s.get('users')) || []; }
  async tokens() { return (await this.s.get('tokens')) || {}; }
  async getMany(keys) {
    const out = new Map();
    for (let i = 0; i < keys.length; i += BATCH) {
      for (const [k, v] of await this.s.get(keys.slice(i, i + BATCH))) out.set(k, v);
    }
    return out;
  }
  async getMeta(prefix) { return (await this.s.get(prefix + ':meta')) || { rev: 0, updatedAt: null, chunks: 0 }; }
  async readRaw(prefix, meta) {
    if (!meta.chunks) return null;
    const keys = Array.from({ length: meta.chunks }, (_, i) => `${prefix}:${i}`);
    const got = await this.getMany(keys);
    return keys.map(k => got.get(k)).join('');
  }
  async writeDoc(prefix, meta, raw, prevChunks) {
    const entries = {};
    let n = 0;
    for (let i = 0; i < raw.length; i += CHUNK) entries[`${prefix}:${n++}`] = raw.slice(i, i + CHUNK);
    entries[prefix + ':meta'] = { ...meta, chunks: n }; // meta rides the same put — atomic at default sizes
    const keys = Object.keys(entries);
    for (let i = 0; i < keys.length; i += BATCH)
      await this.s.put(Object.fromEntries(keys.slice(i, i + BATCH).map(k => [k, entries[k]])));
    if (prevChunks > n)
      await this.s.delete(Array.from({ length: prevChunks - n }, (_, i) => `${prefix}:${n + i}`));
  }

  /* ---------- auth ---------- */
  registerCodeOk(supplied) {
    if (!this.registerCode) return true;
    const a = createHash('sha256').update(String(supplied || '')).digest();
    const b = createHash('sha256').update(this.registerCode).digest();
    return timingSafeEqual(a, b);
  }
  async auth(request) {
    const m = /^Bearer\s+([a-f0-9]{64})$/i.exec(request.headers.get('authorization') || '');
    if (!m) return null;
    const t = (await this.tokens())[m[1]];
    return t ? (await this.users()).find(u => u.id === t.userId) : null;
  }
  limited(ip) {
    const now = Date.now();
    const arr = (this.hits.get(ip) || []).filter(t => now - t < 10 * 60 * 1000);
    arr.push(now);
    this.hits.set(ip, arr);
    return arr.length > 20;
  }
  // Body reader: returns the parsed object, or a ready error Response.
  async body(request) {
    const raw = await request.text();
    if (raw.length > this.maxBody) return err(413, 'too-large', `Body exceeds ${this.maxBody} bytes`);
    try { return JSON.parse(raw || '{}'); } catch (e) { return err(400, 'bad-json', 'Body is not valid JSON'); }
  }

  /* ---------- handlers ---------- */
  async handleRegister(request, ip) {
    if (this.limited(ip)) return err(429, 'rate-limited', 'Too many attempts — try later');
    const body = await this.body(request);
    if (body instanceof Response) return body;
    // Checked before anything else so a caller without the code can't even
    // probe which names are taken (409).
    if (!this.registerCodeOk(body.registerCode))
      return err(403, 'bad-register-code', 'A valid registration code is required to sign up');
    const name = String(body.name || '').trim();
    const passcode = String(body.passcode || '');
    if (!name || name.length > 40) return err(400, 'bad-input', 'Name must be 1–40 characters');
    if (passcode.length < 4) return err(400, 'bad-input', 'Passcode must be at least 4 characters');
    const users = await this.users();
    if (users.find(u => u.nameLower === name.toLowerCase()))
      return err(409, 'name-taken', 'That name is already registered — sign in instead');
    const salt = randHex(16);
    const user = {
      id: randHex(8),
      name, nameLower: name.toLowerCase(),
      salt, hash: await kdf(passcode, salt),
      createdAt: iso(),
    };
    users.push(user);
    const token = randHex(32);
    const tokens = await this.tokens();
    tokens[token] = { userId: user.id, createdAt: iso() };
    await this.s.put({ users, tokens });
    return json(201, { token, userId: user.id, name: user.name });
  }

  async handleLogin(request, ip) {
    if (this.limited(ip)) return err(429, 'rate-limited', 'Too many attempts — try later');
    const body = await this.body(request);
    if (body instanceof Response) return body;
    const u = (await this.users()).find(x => x.nameLower === String(body.name || '').trim().toLowerCase());
    // Same work + same answer whether the name exists or the passcode is wrong.
    const salt = u ? u.salt : randHex(16);
    const candidate = await kdf(body.passcode || '', salt);
    const ok = u && timingSafeEqual(Buffer.from(candidate, 'hex'), Buffer.from(u.hash, 'hex'));
    if (!ok) return err(401, 'bad-credentials', 'Wrong name or passcode');
    const token = randHex(32);
    const tokens = await this.tokens();
    tokens[token] = { userId: u.id, createdAt: iso() };
    await this.s.put('tokens', tokens);
    return json(200, { token, userId: u.id, name: u.name });
  }

  async handleUsers() {
    const users = await this.users();
    // Counts are stamped into each ledger's meta at PUT time, so the
    // directory never has to load the photo-heavy blobs.
    const metas = await this.getMany(users.map(u => `L:${u.id}:meta`));
    return json(200, {
      users: users.map(u => {
        const m = metas.get(`L:${u.id}:meta`) || { rev: 0, updatedAt: null };
        return { id: u.id, name: u.name, rev: m.rev, updatedAt: m.updatedAt, counts: m.counts || counts(null) };
      }),
    });
  }

  async handleGetLedger(id, metaOnly) {
    if (!(await this.users()).find(u => u.id === id)) return err(404, 'no-user', 'No such user');
    const meta = await this.getMeta('L:' + id);
    if (metaOnly) return json(200, { rev: meta.rev, updatedAt: meta.updatedAt });
    return jsonWith(200, { rev: meta.rev, updatedAt: meta.updatedAt }, 'ledger', await this.readRaw('L:' + id, meta));
  }

  async handlePutLedger(request, auth, id) {
    if (auth.id !== id) return err(403, 'not-owner', 'You can only write your own ledger');
    const body = await this.body(request);
    if (body instanceof Response) return body;
    if (typeof body.baseRev !== 'number' || !body.ledger || typeof body.ledger !== 'object' ||
        !Array.isArray(body.ledger.bags) || !Array.isArray(body.ledger.brews))
      return err(400, 'bad-input', 'Expected {baseRev, ledger} with bags and brews arrays');
    const meta = await this.getMeta('L:' + id);
    if (body.baseRev !== meta.rev)
      return jsonWith(409, { error: 'conflict', message: 'Ledger changed since your base revision', rev: meta.rev, updatedAt: meta.updatedAt }, 'ledger', await this.readRaw('L:' + id, meta));
    const next = { rev: meta.rev + 1, updatedAt: iso(), counts: counts(body.ledger) };
    await this.writeDoc('L:' + id, next, JSON.stringify(body.ledger), meta.chunks || 0);
    return json(200, { rev: next.rev, updatedAt: next.updatedAt });
  }

  async handleGetRegister(metaOnly) {
    const meta = await this.getMeta('R');
    if (metaOnly) return json(200, { rev: meta.rev, updatedAt: meta.updatedAt });
    const m = { rev: meta.rev, updatedAt: meta.updatedAt };
    if (meta.updatedBy) m.updatedBy = meta.updatedBy;
    return jsonWith(200, m, 'register', await this.readRaw('R', meta));
  }

  // Unlike ledgers, the Register is writable by every authenticated user — the
  // group maintains it together. Same optimistic concurrency: a stale baseRev
  // gets a 409 carrying the server copy to merge against.
  async handlePutRegister(request, auth) {
    const body = await this.body(request);
    if (body instanceof Response) return body;
    if (typeof body.baseRev !== 'number' || !body.register || typeof body.register !== 'object' ||
        !Array.isArray(body.register.entries))
      return err(400, 'bad-input', 'Expected {baseRev, register} with an entries array');
    const meta = await this.getMeta('R');
    if (body.baseRev !== meta.rev)
      return jsonWith(409, { error: 'conflict', message: 'Register changed since your base revision', rev: meta.rev, updatedAt: meta.updatedAt }, 'register', await this.readRaw('R', meta));
    const next = { rev: meta.rev + 1, updatedAt: iso(), updatedBy: auth.name };
    await this.writeDoc('R', next, JSON.stringify(body.register), meta.chunks || 0);
    return json(200, { rev: next.rev, updatedAt: next.updatedAt });
  }

  async handleGetCatalog(kind, metaOnly) {
    const meta = await this.getMeta('C:' + kind);
    if (metaOnly) return json(200, { rev: meta.rev, updatedAt: meta.updatedAt });
    const m = { rev: meta.rev, updatedAt: meta.updatedAt };
    if (meta.updatedBy) m.updatedBy = meta.updatedBy;
    return jsonWith(200, m, 'catalog', await this.readRaw('C:' + kind, meta));
  }

  // A catalog kind, like the café Register, is group-writable — the whole party
  // keeps the shared spine together. Same optimistic concurrency: a stale baseRev
  // gets a 409 carrying the server copy to merge against.
  async handlePutCatalog(request, auth, kind) {
    const body = await this.body(request);
    if (body instanceof Response) return body;
    if (typeof body.baseRev !== 'number' || !body.catalog || typeof body.catalog !== 'object' ||
        !Array.isArray(body.catalog.entries))
      return err(400, 'bad-input', 'Expected {baseRev, catalog} with an entries array');
    const meta = await this.getMeta('C:' + kind);
    if (body.baseRev !== meta.rev)
      return jsonWith(409, { error: 'conflict', message: 'Catalog changed since your base revision', rev: meta.rev, updatedAt: meta.updatedAt }, 'catalog', await this.readRaw('C:' + kind, meta));
    const next = { rev: meta.rev + 1, updatedAt: iso(), updatedBy: auth.name };
    await this.writeDoc('C:' + kind, next, JSON.stringify(body.catalog), meta.chunks || 0);
    return json(200, { rev: next.rev, updatedAt: next.updatedAt });
  }

  /* ---------- router ---------- */
  async fetch(request) {
    const url = new URL(request.url);
    const p = url.pathname;
    const ip = request.headers.get('cf-connecting-ip') || '?';

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // Unauthenticated liveness probe. Uptime is this object's — it hibernates
    // when idle, so the number resets; the point is "alive", not "for how long".
    if (request.method === 'GET' && (p === '/health' || p === '/api/health'))
      return json(200, { ok: true, users: (await this.users()).length, uptime: Math.round((Date.now() - this.boot) / 1000) });

    if (request.method === 'POST' && p === '/api/register') return this.handleRegister(request, ip);
    if (request.method === 'POST' && p === '/api/login') return this.handleLogin(request, ip);

    // Everything below requires auth.
    const auth = await this.auth(request);
    if (!auth) return err(401, 'unauthorized', 'Missing or invalid token');

    if (request.method === 'GET' && p === '/api/users') return this.handleUsers();

    // /api/cafes is the café Register ("register" was taken by sign-up).
    if (p === '/api/cafes') {
      if (request.method === 'GET') return this.handleGetRegister(url.searchParams.get('meta') === '1');
      if (request.method === 'PUT') return this.handlePutRegister(request, auth);
    }

    // /api/catalog/<kind> — the spine, one shared document per whitelisted kind.
    const cm = /^\/api\/catalog\/([a-z]+)$/.exec(p);
    if (cm && CATALOG_KINDS.includes(cm[1])) {
      if (request.method === 'GET') return this.handleGetCatalog(cm[1], url.searchParams.get('meta') === '1');
      if (request.method === 'PUT') return this.handlePutCatalog(request, auth, cm[1]);
    }

    const m = /^\/api\/ledgers\/([a-f0-9]{16})$/.exec(p);
    if (m) {
      if (request.method === 'GET') return this.handleGetLedger(m[1], url.searchParams.get('meta') === '1');
      if (request.method === 'PUT') return this.handlePutLedger(request, auth, m[1]);
    }

    return err(404, 'not-found', 'No such endpoint');
  }
}

// The Worker itself is a pass-through: every request goes to the one named
// object, whose single-threaded execution is what makes revisions race-free.
export default {
  fetch(request, env) {
    return env.STORE.get(env.STORE.idFromName('carta')).fetch(request);
  },
};
