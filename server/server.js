#!/usr/bin/env node
'use strict';
/* ============================================================
 * CARTA sync server — zero dependencies, one file.
 *
 *   node server/server.js
 *
 * Env:
 *   PORT            listen port                 (default 8787)
 *   CARTA_DATA      data directory              (default ./data, relative to cwd)
 *   CARTA_MAX_BODY  max request body in bytes   (default 20 MB — ledgers embed photos)
 *
 * Storage:
 *   <data>/users.json          users + tokens (small, held in memory)
 *   <data>/ledgers/<id>.json   {rev, updatedAt, ledger} per user (read on demand)
 *
 * Auth model: name + passcode per user. Every authenticated user can READ
 * every ledger — seeing each other's records is the point. Only the owner
 * can WRITE their own. This is trust-your-friends auth for a small group,
 * not a hardened public service. See server/README.md.
 * ============================================================ */

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const PORT = Number(process.env.PORT) || 8787;
const DATA = path.resolve(process.env.CARTA_DATA || './data');
const MAX_BODY = Number(process.env.CARTA_MAX_BODY) || 20 * 1024 * 1024;
const LEDGERS = path.join(DATA, 'ledgers');
const USERS_FILE = path.join(DATA, 'users.json');

fs.mkdirSync(LEDGERS, { recursive: true });

/* ---------- atomic JSON files ---------- */
function writeJSON(file, obj) {
  const tmp = file + '.tmp.' + process.pid;
  fs.writeFileSync(tmp, JSON.stringify(obj));
  fs.renameSync(tmp, file);
}
function readJSON(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { return null; }
}

/* ---------- users + tokens (in memory, persisted on change) ---------- */
const db = readJSON(USERS_FILE) || { version: 1, users: [], tokens: {} };
function saveDB() { writeJSON(USERS_FILE, db); }
const userById = id => db.users.find(u => u.id === id);
const userByName = name => db.users.find(u => u.nameLower === String(name).trim().toLowerCase());

/* ---------- auth ---------- */
function hashPass(passcode, salt) {
  return crypto.scryptSync(String(passcode), salt, 64).toString('hex');
}
function makeToken(userId) {
  const token = crypto.randomBytes(32).toString('hex');
  db.tokens[token] = { userId, createdAt: new Date().toISOString() };
  saveDB();
  return token;
}
function authUser(req) {
  const h = req.headers.authorization || '';
  const m = /^Bearer\s+([a-f0-9]{64})$/i.exec(h);
  if (!m) return null;
  const t = db.tokens[m[1]];
  return t ? userById(t.userId) : null;
}

/* ---------- naive rate limit on register/login ---------- */
const hits = new Map(); // ip -> [timestamps]
function limited(ip) {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter(t => now - t < 10 * 60 * 1000);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > 20;
}

/* ---------- ledgers ---------- */
const ledgerFile = id => path.join(LEDGERS, id + '.json');
function readLedger(id) {
  return readJSON(ledgerFile(id)) || { rev: 0, updatedAt: null, ledger: null };
}
function counts(ledger) {
  const n = k => (ledger && Array.isArray(ledger[k]) ? ledger[k].length : 0);
  return { setups: n('setups'), bags: n('bags'), brews: n('brews'), cups: n('cups') };
}

/* ---------- http plumbing ---------- */
function send(res, status, body) {
  const buf = Buffer.from(JSON.stringify(body));
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': buf.length,
    'Access-Control-Allow-Origin': '*',
  });
  res.end(buf);
}
const err = (res, status, code, message) => send(res, status, { error: code, message });

function readBody(req, res, cb) {
  let size = 0;
  const chunks = [];
  let done = false;
  req.on('data', c => {
    if (done) return;
    size += c.length;
    if (size > MAX_BODY) {
      done = true;
      err(res, 413, 'too-large', `Body exceeds ${MAX_BODY} bytes`);
      req.destroy();
      return;
    }
    chunks.push(c);
  });
  req.on('end', () => {
    if (done) return;
    done = true;
    let parsed;
    try { parsed = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'); }
    catch (e) { return err(res, 400, 'bad-json', 'Body is not valid JSON'); }
    cb(parsed);
  });
  req.on('error', () => { done = true; });
}

/* ---------- handlers ---------- */
function handleRegister(req, res, ip) {
  if (limited(ip)) return err(res, 429, 'rate-limited', 'Too many attempts — try later');
  readBody(req, res, body => {
    const name = String(body.name || '').trim();
    const passcode = String(body.passcode || '');
    if (!name || name.length > 40) return err(res, 400, 'bad-input', 'Name must be 1–40 characters');
    if (passcode.length < 4) return err(res, 400, 'bad-input', 'Passcode must be at least 4 characters');
    if (userByName(name)) return err(res, 409, 'name-taken', 'That name is already registered — sign in instead');
    const salt = crypto.randomBytes(16).toString('hex');
    const user = {
      id: crypto.randomBytes(8).toString('hex'),
      name, nameLower: name.toLowerCase(),
      salt, hash: hashPass(passcode, salt),
      createdAt: new Date().toISOString(),
    };
    db.users.push(user);
    const token = makeToken(user.id); // saveDB() inside
    send(res, 201, { token, userId: user.id, name: user.name });
  });
}

function handleLogin(req, res, ip) {
  if (limited(ip)) return err(res, 429, 'rate-limited', 'Too many attempts — try later');
  readBody(req, res, body => {
    const u = userByName(body.name || '');
    // Same work + same answer whether the name exists or the passcode is wrong.
    const salt = u ? u.salt : crypto.randomBytes(16).toString('hex');
    const candidate = hashPass(body.passcode || '', salt);
    const ok = u && crypto.timingSafeEqual(Buffer.from(candidate, 'hex'), Buffer.from(u.hash, 'hex'));
    if (!ok) return err(res, 401, 'bad-credentials', 'Wrong name or passcode');
    send(res, 200, { token: makeToken(u.id), userId: u.id, name: u.name });
  });
}

function handleUsers(res) {
  send(res, 200, {
    users: db.users.map(u => {
      const l = readLedger(u.id);
      return { id: u.id, name: u.name, rev: l.rev, updatedAt: l.updatedAt, counts: counts(l.ledger) };
    }),
  });
}

function handleGetLedger(res, id, metaOnly) {
  if (!userById(id)) return err(res, 404, 'no-user', 'No such user');
  const l = readLedger(id);
  send(res, 200, metaOnly ? { rev: l.rev, updatedAt: l.updatedAt } : l);
}

function handlePutLedger(req, res, auth, id) {
  if (auth.id !== id) return err(res, 403, 'not-owner', 'You can only write your own ledger');
  readBody(req, res, body => {
    if (typeof body.baseRev !== 'number' || !body.ledger || typeof body.ledger !== 'object' ||
        !Array.isArray(body.ledger.bags) || !Array.isArray(body.ledger.brews))
      return err(res, 400, 'bad-input', 'Expected {baseRev, ledger} with bags and brews arrays');
    const cur = readLedger(id);
    if (body.baseRev !== cur.rev)
      return send(res, 409, { error: 'conflict', message: 'Ledger changed since your base revision', rev: cur.rev, updatedAt: cur.updatedAt, ledger: cur.ledger });
    const next = { rev: cur.rev + 1, updatedAt: new Date().toISOString(), ledger: body.ledger };
    writeJSON(ledgerFile(id), next);
    send(res, 200, { rev: next.rev, updatedAt: next.updatedAt });
  });
}

/* ---------- router ---------- */
const server = http.createServer((req, res) => {
  const ip = req.socket.remoteAddress || '?';
  const u = new URL(req.url, 'http://x');
  const p = u.pathname;

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    });
    return res.end();
  }

  if (req.method === 'POST' && p === '/api/register') return handleRegister(req, res, ip);
  if (req.method === 'POST' && p === '/api/login') return handleLogin(req, res, ip);

  // Everything below requires auth.
  const auth = authUser(req);
  if (!auth) return err(res, 401, 'unauthorized', 'Missing or invalid token');

  if (req.method === 'GET' && p === '/api/users') return handleUsers(res);

  const m = /^\/api\/ledgers\/([a-f0-9]{16})$/.exec(p);
  if (m) {
    if (req.method === 'GET') return handleGetLedger(res, m[1], u.searchParams.get('meta') === '1');
    if (req.method === 'PUT') return handlePutLedger(req, res, auth, m[1]);
  }

  return err(res, 404, 'not-found', 'No such endpoint');
});

server.listen(PORT, () => {
  console.log(`CARTA sync server listening on :${PORT}`);
  console.log(`  data: ${DATA}`);
  console.log(`  users: ${db.users.length}`);
});
