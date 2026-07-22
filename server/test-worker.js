#!/usr/bin/env node
'use strict';
/* Endpoint tests for the Cloudflare Workers port. Zero deps:
 *   node server/test-worker.js
 * worker.mjs uses only Web APIs + node:crypto, so it runs in plain Node 18+;
 * the Durable Object storage API is mocked in memory — no wrangler needed.
 * The endpoint matrix mirrors test.js, plus chunked-storage cases. */

const assert = require('node:assert');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

// In-memory stand-in for the Durable Object storage key-value API — just the
// surface worker.mjs uses: get (single/multi), put (single/multi), delete (multi).
class MemStorage {
  constructor() { this.map = new Map(); }
  async get(k) {
    if (Array.isArray(k)) {
      const out = new Map();
      for (const key of k) if (this.map.has(key)) out.set(key, this.map.get(key));
      return out;
    }
    return this.map.has(k) ? this.map.get(k) : undefined;
  }
  async put(k, v) {
    if (typeof k === 'object') { for (const [key, val] of Object.entries(k)) this.map.set(key, val); }
    else this.map.set(k, v);
  }
  async delete(keys) { for (const k of [].concat(keys)) this.map.delete(k); }
}

let n = 0;
const ok = name => console.log(`PASS  ${++n}. ${name}`);

const LEDGER = who => ({
  version: 1, setups: [], deleted: [],
  bags: [{ id: 'bag-' + who, createdAt: '2026-01-01T00:00:00Z', roaster: who }],
  brews: [], cups: [], cafeFavs: [], createdAt: '2026-01-01T00:00:00Z',
});

(async () => {
  const { default: worker, CartaStore } = await import(pathToFileURL(path.join(__dirname, 'worker.mjs')));

  // One "deployment" = one storage + one object instance behind the pass-through worker.
  function makeApp(vars = {}) {
    const storage = new MemStorage();
    let instance = null;
    const env = { ...vars, STORE: { idFromName: () => 'carta', get: () => ({ fetch: r => instance.fetch(r) }) } };
    instance = new CartaStore({ storage }, env);
    const req = (method, p, { token, body } = {}) =>
      worker.fetch(new Request('https://carta.test' + p, {
        method,
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) },
        body: body === undefined ? undefined : JSON.stringify(body),
      }), env).then(async r => ({ status: r.status, body: await r.json().catch(() => null) }));
    return { req, storage };
  }

  const { req, storage } = makeApp({ CARTA_MAX_BODY: String(64 * 1024) });

  // health probe (unauthenticated)
  let r = await req('GET', '/health');
  assert.equal(r.status, 200); assert.equal(r.body.ok, true); assert.equal(typeof r.body.uptime, 'number');
  ok('health probe returns 200 without auth');

  // register
  r = await req('POST', '/api/register', { body: { name: 'Alice', passcode: 'coffee' } });
  assert.equal(r.status, 201); assert.ok(r.body.token && r.body.userId);
  const alice = r.body;
  ok('register returns 201 with token + userId');

  r = await req('POST', '/api/register', { body: { name: 'alice', passcode: 'other' } });
  assert.equal(r.status, 409);
  ok('duplicate name (case-insensitive) rejected with 409');

  r = await req('POST', '/api/register', { body: { name: 'Bob', passcode: 'abc' } });
  assert.equal(r.status, 400);
  ok('short passcode rejected with 400');

  r = await req('POST', '/api/register', { body: { name: 'Bob', passcode: 'beans' } });
  assert.equal(r.status, 201);
  const bob = r.body;
  ok('second user registers');

  // login
  r = await req('POST', '/api/login', { body: { name: 'ALICE', passcode: 'coffee' } });
  assert.equal(r.status, 200); assert.equal(r.body.userId, alice.userId);
  ok('login works, name case-insensitive, same userId');

  r = await req('POST', '/api/login', { body: { name: 'Alice', passcode: 'wrong' } });
  assert.equal(r.status, 401);
  const wrongPass = r.body;
  r = await req('POST', '/api/login', { body: { name: 'Nobody', passcode: 'coffee' } });
  assert.equal(r.status, 401);
  assert.deepEqual(r.body.error, wrongPass.error);
  ok('bad passcode and unknown name both 401, indistinguishable');

  // auth required
  r = await req('GET', '/api/users');
  assert.equal(r.status, 401);
  r = await req('GET', '/api/users', { token: 'f'.repeat(64) });
  assert.equal(r.status, 401);
  ok('endpoints reject missing/garbage tokens');

  // push / pull
  r = await req('GET', `/api/ledgers/${alice.userId}`, { token: alice.token });
  assert.equal(r.status, 200); assert.equal(r.body.rev, 0); assert.equal(r.body.ledger, null);
  ok('unpushed ledger reads as rev 0 / null');

  r = await req('PUT', `/api/ledgers/${alice.userId}`, { token: alice.token, body: { baseRev: 0, ledger: LEDGER('alice') } });
  assert.equal(r.status, 200); assert.equal(r.body.rev, 1);
  ok('first push accepted, rev 1');

  r = await req('GET', `/api/ledgers/${alice.userId}`, { token: bob.token });
  assert.equal(r.status, 200); assert.equal(r.body.rev, 1);
  assert.equal(r.body.ledger.bags[0].id, 'bag-alice');
  ok("another authenticated user can READ alice's ledger");

  r = await req('GET', `/api/ledgers/${alice.userId}?meta=1`, { token: bob.token });
  assert.equal(r.status, 200); assert.equal(r.body.rev, 1); assert.equal(r.body.ledger, undefined);
  ok('meta poll returns rev without the blob');

  // authz: write is owner-only
  r = await req('PUT', `/api/ledgers/${alice.userId}`, { token: bob.token, body: { baseRev: 1, ledger: LEDGER('evil') } });
  assert.equal(r.status, 403);
  ok("bob cannot WRITE alice's ledger (403)");

  // conflict
  r = await req('PUT', `/api/ledgers/${alice.userId}`, { token: alice.token, body: { baseRev: 0, ledger: LEDGER('stale') } });
  assert.equal(r.status, 409); assert.equal(r.body.error, 'conflict'); assert.equal(r.body.rev, 1);
  assert.equal(r.body.ledger.bags[0].id, 'bag-alice');
  ok('stale baseRev rejected with 409 carrying the server ledger');

  r = await req('PUT', `/api/ledgers/${alice.userId}`, { token: alice.token, body: { baseRev: 1, ledger: LEDGER('alice2') } });
  assert.equal(r.status, 200); assert.equal(r.body.rev, 2);
  ok('push with correct baseRev advances to rev 2');

  // users directory
  r = await req('GET', '/api/users', { token: bob.token });
  assert.equal(r.status, 200);
  const dirA = r.body.users.find(u => u.id === alice.userId);
  assert.equal(dirA.rev, 2); assert.equal(dirA.counts.bags, 1); assert.equal(dirA.name, 'Alice');
  const dirB = r.body.users.find(u => u.id === bob.userId);
  assert.equal(dirB.rev, 0); assert.equal(dirB.counts.bags, 0);
  ok('directory lists users with rev and counts (zeros before first push)');

  // validation + limits
  r = await req('PUT', `/api/ledgers/${alice.userId}`, { token: alice.token, body: { baseRev: 2, ledger: { nope: true } } });
  assert.equal(r.status, 400);
  ok('malformed ledger rejected with 400');

  const fat = LEDGER('fat'); fat.bags[0].photo = 'x'.repeat(80 * 1024);
  r = await req('PUT', `/api/ledgers/${alice.userId}`, { token: alice.token, body: { baseRev: 2, ledger: fat } });
  assert.equal(r.status, 413);
  ok('oversized body rejected with 413');

  r = await req('GET', `/api/ledgers/${'0'.repeat(16)}`, { token: alice.token });
  assert.equal(r.status, 404);
  ok('unknown user id is 404');

  // ---- the café Register: one shared document, writable by every keeper ----
  const REGDOC = who => ({
    version: 1, deleted: [],
    entries: [{ id: 'cafe-1', name: 'Kumquat', city: who, firstBy: who, updatedAt: '2026-01-01T00:00:00Z' }],
  });

  r = await req('GET', '/api/cafes');
  assert.equal(r.status, 401);
  ok('Register requires auth');

  r = await req('GET', '/api/cafes', { token: alice.token });
  assert.equal(r.status, 200); assert.equal(r.body.rev, 0); assert.equal(r.body.register, null);
  ok('unpushed Register reads as rev 0 / null');

  r = await req('PUT', '/api/cafes', { token: alice.token, body: { baseRev: 0, register: REGDOC('alice') } });
  assert.equal(r.status, 200); assert.equal(r.body.rev, 1);
  ok('first Register push accepted, rev 1');

  r = await req('PUT', '/api/cafes', { token: bob.token, body: { baseRev: 1, register: REGDOC('bob') } });
  assert.equal(r.status, 200); assert.equal(r.body.rev, 2);
  ok('another keeper CAN write the Register (shared, unlike ledgers)');

  r = await req('GET', '/api/cafes', { token: alice.token });
  assert.equal(r.status, 200); assert.equal(r.body.updatedBy, 'Bob');
  ok('Register read carries updatedBy');

  r = await req('GET', '/api/cafes?meta=1', { token: alice.token });
  assert.equal(r.status, 200); assert.equal(r.body.rev, 2); assert.equal(r.body.register, undefined);
  ok('Register meta poll returns rev without the blob');

  r = await req('PUT', '/api/cafes', { token: alice.token, body: { baseRev: 0, register: REGDOC('stale') } });
  assert.equal(r.status, 409); assert.equal(r.body.error, 'conflict'); assert.equal(r.body.rev, 2);
  assert.equal(r.body.register.entries[0].city, 'bob');
  ok('stale Register baseRev rejected with 409 carrying the server copy');

  r = await req('PUT', '/api/cafes', { token: alice.token, body: { baseRev: 2, register: { nope: true } } });
  assert.equal(r.status, 400);
  ok('malformed Register rejected with 400');

  // ---- the catalog: one shared, group-writable document per spine kind ----
  const CATDOC = who => ({
    version: 1, deleted: [],
    entries: [{ id: 'lot-1', _key: 'fp:ethiopia|guji', kind: 'lot', country: 'Ethiopia', firstBy: who, updatedAt: '2026-01-01T00:00:00Z' }],
  });

  r = await req('GET', '/api/catalog/lots');
  assert.equal(r.status, 401);
  ok('catalog requires auth');

  r = await req('GET', '/api/catalog/lots', { token: alice.token });
  assert.equal(r.status, 200); assert.equal(r.body.rev, 0); assert.equal(r.body.catalog, null);
  ok('unpushed catalog kind reads as rev 0 / null');

  r = await req('PUT', '/api/catalog/lots', { token: alice.token, body: { baseRev: 0, catalog: CATDOC('alice') } });
  assert.equal(r.status, 200); assert.equal(r.body.rev, 1);
  ok('first catalog push accepted, rev 1');

  r = await req('PUT', '/api/catalog/lots', { token: bob.token, body: { baseRev: 1, catalog: CATDOC('bob') } });
  assert.equal(r.status, 200); assert.equal(r.body.rev, 2);
  ok('another keeper CAN write the catalog (shared, like the Register)');

  r = await req('GET', '/api/catalog/lots', { token: alice.token });
  assert.equal(r.status, 200); assert.equal(r.body.updatedBy, 'Bob');
  ok('catalog read carries updatedBy');

  r = await req('GET', '/api/catalog/lots?meta=1', { token: alice.token });
  assert.equal(r.status, 200); assert.equal(r.body.rev, 2); assert.equal(r.body.catalog, undefined);
  ok('catalog meta poll returns rev without the blob');

  r = await req('PUT', '/api/catalog/lots', { token: alice.token, body: { baseRev: 0, catalog: CATDOC('stale') } });
  assert.equal(r.status, 409); assert.equal(r.body.error, 'conflict'); assert.equal(r.body.rev, 2);
  assert.equal(r.body.catalog.entries[0].firstBy, 'bob');
  ok('stale catalog baseRev rejected with 409 carrying the server copy');

  r = await req('PUT', '/api/catalog/lots', { token: alice.token, body: { baseRev: 2, catalog: { nope: true } } });
  assert.equal(r.status, 400);
  ok('malformed catalog rejected with 400');

  r = await req('GET', '/api/catalog/roasters', { token: alice.token });
  assert.equal(r.status, 200); assert.equal(r.body.rev, 0);
  ok('a second kind is an independent document at rev 0');

  r = await req('GET', '/api/catalog/wombats', { token: alice.token });
  assert.equal(r.status, 404);
  ok('an unknown catalog kind is 404 (whitelisted — old clients degrade cleanly)');

  // ---- chunked storage: photo-heavy ledgers span multiple storage values ----
  const big = makeApp(); // default 20 MB body cap
  r = await big.req('POST', '/api/register', { body: { name: 'Carol', passcode: 'beans' } });
  const carol = r.body;
  const heavy = LEDGER('carol');
  heavy.bags[0].photo = 'p'.repeat(2_500_000); // ~2.5 MB of "base64" — 3 chunks at 1M chars
  r = await big.req('PUT', `/api/ledgers/${carol.userId}`, { token: carol.token, body: { baseRev: 0, ledger: heavy } });
  assert.equal(r.status, 200); assert.equal(r.body.rev, 1);
  const chunkKeys = [...big.storage.map.keys()].filter(k => /^L:.*:\d+$/.test(k));
  assert.ok(chunkKeys.length >= 3, `expected >=3 chunks, got ${chunkKeys.length}`);
  ok('large ledger is stored across multiple chunks');

  r = await big.req('GET', `/api/ledgers/${carol.userId}`, { token: carol.token });
  assert.equal(r.status, 200);
  assert.equal(r.body.ledger.bags[0].photo, heavy.bags[0].photo);
  ok('large ledger reads back byte-identical');

  r = await big.req('PUT', `/api/ledgers/${carol.userId}`, { token: carol.token, body: { baseRev: 1, ledger: LEDGER('carol2') } });
  assert.equal(r.status, 200); assert.equal(r.body.rev, 2);
  const after = [...big.storage.map.keys()].filter(k => /^L:.*:\d+$/.test(k));
  assert.equal(after.length, 1);
  r = await big.req('GET', `/api/ledgers/${carol.userId}`, { token: carol.token });
  assert.equal(r.body.ledger.bags[0].id, 'bag-carol2');
  ok('shrinking a ledger deletes the stale chunks');

  // ---- registration code gate (separate deployment) ----
  const gated = makeApp({ CARTA_REGISTER_CODE: 'letmein' });

  r = await gated.req('POST', '/api/register', { body: { name: 'Gated', passcode: 'beans' } });
  assert.equal(r.status, 403); assert.equal(r.body.error, 'bad-register-code');
  ok('registration without the code is rejected (403)');

  r = await gated.req('POST', '/api/register', { body: { name: 'Gated', passcode: 'beans', registerCode: 'nope' } });
  assert.equal(r.status, 403);
  ok('registration with the wrong code is rejected (403)');

  r = await gated.req('POST', '/api/register', { body: { name: 'Gated', passcode: 'beans', registerCode: 'letmein' } });
  assert.equal(r.status, 201); assert.ok(r.body.token);
  ok('registration with the correct code succeeds (201)');

  r = await gated.req('POST', '/api/login', { body: { name: 'Gated', passcode: 'beans' } });
  assert.equal(r.status, 200);
  ok('login is not gated by the registration code');

  // every stored value fits the Durable Object 2 MB key+value cap
  for (const [k, v] of storage.map) if (typeof v === 'string') assert.ok(k.length + v.length <= 2 * 1024 * 1024);
  for (const [k, v] of big.storage.map) if (typeof v === 'string') assert.ok(k.length + v.length <= 2 * 1024 * 1024);
  ok('no stored value exceeds the 2 MB storage cap');

  console.log(`\nALL ${n} WORKER TESTS PASSED`);
  process.exit(0);
})().catch(e => {
  console.error('\nFAIL:', e.message);
  process.exit(1);
});
