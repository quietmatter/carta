#!/usr/bin/env node
'use strict';
/* Endpoint tests for the CARTA sync server. Zero deps:
 *   node server/test.js
 * Spawns the server on an ephemeral port with a temp data dir. */

const { spawn } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const assert = require('node:assert');

const PORT = 18000 + Math.floor(Math.random() * 2000);
const DATA = fs.mkdtempSync(path.join(os.tmpdir(), 'carta-sync-test-'));
const BASE = `http://127.0.0.1:${PORT}`;

const srv = spawn(process.execPath, [path.join(__dirname, 'server.js')], {
  env: { ...process.env, PORT: String(PORT), CARTA_DATA: DATA, CARTA_MAX_BODY: String(64 * 1024) },
  stdio: ['ignore', 'pipe', 'inherit'],
});

function req(method, p, { token, body } = {}) {
  return fetch(BASE + p, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: 'Bearer ' + token } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  }).then(async r => ({ status: r.status, body: await r.json().catch(() => null) }));
}

const LEDGER = who => ({
  version: 1, setups: [], deleted: [],
  bags: [{ id: 'bag-' + who, createdAt: '2026-01-01T00:00:00Z', roaster: who }],
  brews: [], cups: [], cafeFavs: [], createdAt: '2026-01-01T00:00:00Z',
});

async function waitUp() {
  for (let i = 0; i < 50; i++) {
    try { await fetch(BASE + '/api/users'); return; } catch (e) { await new Promise(r => setTimeout(r, 100)); }
  }
  throw new Error('server never came up');
}

let n = 0;
const ok = name => console.log(`PASS  ${++n}. ${name}`);

// Second server instance (registration-code gate) — declared here so the
// failure handler can clean it up too.
let srv2 = null, DATA2 = null;

(async () => {
  await waitUp();

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
  ok('directory lists users with rev and counts');

  // validation + limits
  r = await req('PUT', `/api/ledgers/${alice.userId}`, { token: alice.token, body: { baseRev: 2, ledger: { nope: true } } });
  assert.equal(r.status, 400);
  ok('malformed ledger rejected with 400');

  const fat = LEDGER('fat'); fat.bags[0].photo = 'x'.repeat(80 * 1024);
  r = await req('PUT', `/api/ledgers/${alice.userId}`, { token: alice.token, body: { baseRev: 2, ledger: fat } })
    .catch(() => ({ status: 413 })); // server may destroy the socket mid-body
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

  // ---- registration code gate (separate server instance) ----
  DATA2 = fs.mkdtempSync(path.join(os.tmpdir(), 'carta-sync-test2-'));
  const BASE2 = `http://127.0.0.1:${PORT + 1}`;
  srv2 = spawn(process.execPath, [path.join(__dirname, 'server.js')], {
    env: { ...process.env, PORT: String(PORT + 1), CARTA_DATA: DATA2, CARTA_REGISTER_CODE: 'letmein' },
    stdio: ['ignore', 'pipe', 'inherit'],
  });
  const req2 = (method, p, body) => fetch(BASE2 + p, {
    method, headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  }).then(async res => ({ status: res.status, body: await res.json().catch(() => null) }));
  for (let i = 0; i < 50; i++) { try { await fetch(BASE2 + '/health'); break; } catch (e) { await new Promise(r => setTimeout(r, 100)); } }

  let r2 = await req2('POST', '/api/register', { name: 'Gated', passcode: 'beans' });
  assert.equal(r2.status, 403); assert.equal(r2.body.error, 'bad-register-code');
  ok('registration without the code is rejected (403)');

  r2 = await req2('POST', '/api/register', { name: 'Gated', passcode: 'beans', registerCode: 'nope' });
  assert.equal(r2.status, 403);
  ok('registration with the wrong code is rejected (403)');

  r2 = await req2('POST', '/api/register', { name: 'Gated', passcode: 'beans', registerCode: 'letmein' });
  assert.equal(r2.status, 201); assert.ok(r2.body.token);
  ok('registration with the correct code succeeds (201)');

  r2 = await req2('POST', '/api/login', { name: 'Gated', passcode: 'beans' });
  assert.equal(r2.status, 200);
  ok('login is not gated by the registration code');

  srv2.kill(); srv2 = null;
  fs.rmSync(DATA2, { recursive: true, force: true }); DATA2 = null;

  // no temp files left behind
  const leftovers = fs.readdirSync(DATA).concat(fs.readdirSync(path.join(DATA, 'ledgers')))
    .filter(f => f.includes('.tmp.'));
  assert.deepEqual(leftovers, []);
  ok('no .tmp files left on disk');

  console.log(`\nALL ${n} SERVER TESTS PASSED`);
  srv.kill(); fs.rmSync(DATA, { recursive: true, force: true });
  process.exit(0);
})().catch(e => {
  console.error('\nFAIL:', e.message);
  srv.kill(); fs.rmSync(DATA, { recursive: true, force: true });
  if (srv2) srv2.kill();
  if (DATA2) fs.rmSync(DATA2, { recursive: true, force: true });
  process.exit(1);
});
