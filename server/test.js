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
  assert.equal(r.body.founder, true);
  const alice = r.body;
  ok('register returns 201 with token + userId; the first account holds the pen');

  r = await req('POST', '/api/register', { body: { name: 'alice', passcode: 'other' } });
  assert.equal(r.status, 409);
  ok('duplicate name (case-insensitive) rejected with 409');

  r = await req('POST', '/api/register', { body: { name: 'Bob', passcode: 'abc' } });
  assert.equal(r.status, 400);
  ok('short passcode rejected with 400');

  r = await req('POST', '/api/register', { body: { name: 'Bob', passcode: 'beans' } });
  assert.equal(r.status, 201); assert.equal(r.body.founder, false);
  const bob = r.body;
  ok('second user registers, without the pen');

  // login
  r = await req('POST', '/api/login', { body: { name: 'ALICE', passcode: 'coffee' } });
  assert.equal(r.status, 200); assert.equal(r.body.userId, alice.userId);
  assert.equal(r.body.founder, true);
  ok('login works, name case-insensitive, same userId, founder flag carried');

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
  assert.equal(dirA.founder, true);
  assert.equal(r.body.users.find(u => u.id === bob.userId).founder, false);
  ok('directory lists users with rev, counts and who holds the pen');

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

  // ---- the café Register: one shared document, read by every keeper,
  //      written — for now — only by the founder's pen ----
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
  assert.equal(r.status, 403); assert.equal(r.body.error, 'pen-held');
  ok('a non-founder CANNOT write the Register (403 pen-held)');

  r = await req('GET', '/api/cafes', { token: bob.token });
  assert.equal(r.status, 200); assert.equal(r.body.rev, 1);
  assert.equal(r.body.register.entries[0].city, 'alice');
  ok('a non-founder still READS the Register, unchanged by the refused push');

  r = await req('PUT', '/api/cafes', { token: alice.token, body: { baseRev: 1, register: REGDOC('alice2') } });
  assert.equal(r.status, 200); assert.equal(r.body.rev, 2);
  ok("the founder's second push advances to rev 2");

  r = await req('GET', '/api/cafes?meta=1', { token: alice.token });
  assert.equal(r.status, 200); assert.equal(r.body.rev, 2); assert.equal(r.body.register, undefined);
  ok('Register meta poll returns rev without the blob');

  r = await req('PUT', '/api/cafes', { token: alice.token, body: { baseRev: 0, register: REGDOC('stale') } });
  assert.equal(r.status, 409); assert.equal(r.body.error, 'conflict'); assert.equal(r.body.rev, 2);
  assert.equal(r.body.register.entries[0].city, 'alice2');
  ok('stale Register baseRev rejected with 409 carrying the server copy');

  r = await req('PUT', '/api/cafes', { token: alice.token, body: { baseRev: 2, register: { nope: true } } });
  assert.equal(r.status, 400);
  ok('malformed Register rejected with 400');

  // ---- the catalog: one shared document per spine kind, read by every
  //      keeper, written — for now — only by the founder's pen ----
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
  assert.equal(r.status, 403); assert.equal(r.body.error, 'pen-held');
  ok('a non-founder CANNOT write the catalog (403 pen-held, like the Register)');

  r = await req('GET', '/api/catalog/lots', { token: bob.token });
  assert.equal(r.status, 200); assert.equal(r.body.rev, 1);
  assert.equal(r.body.catalog.entries[0].firstBy, 'alice');
  ok('a non-founder still READS the catalog, unchanged by the refused push');

  r = await req('PUT', '/api/catalog/lots', { token: alice.token, body: { baseRev: 1, catalog: CATDOC('alice2') } });
  assert.equal(r.status, 200); assert.equal(r.body.rev, 2);
  ok("the founder's second catalog push advances to rev 2");

  r = await req('GET', '/api/catalog/lots?meta=1', { token: alice.token });
  assert.equal(r.status, 200); assert.equal(r.body.rev, 2); assert.equal(r.body.catalog, undefined);
  ok('catalog meta poll returns rev without the blob');

  r = await req('PUT', '/api/catalog/lots', { token: alice.token, body: { baseRev: 0, catalog: CATDOC('stale') } });
  assert.equal(r.status, 409); assert.equal(r.body.error, 'conflict'); assert.equal(r.body.rev, 2);
  assert.equal(r.body.catalog.entries[0].firstBy, 'alice2');
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

  // ---- the published atlas: a copy, not a switch (docs/READER.md) ----
  // The record the snapshot will be minted from: two greens, two roasts, a
  // café, and two pours — one of each pointing at the green we later hold back.
  r = await req('PUT', '/api/catalog/lots', {
    token: alice.token, body: { baseRev: 2, catalog: { version: 1, deleted: [], entries: [
      { id: 'lot-1', _key: 'fp:ethiopia|guji', country: 'Ethiopia' },
      { id: 'lot-2', _key: 'fp:colombia|huila', country: 'Colombia' }] } },
  });
  assert.equal(r.status, 200);
  r = await req('PUT', '/api/catalog/roasts', {
    token: alice.token, body: { baseRev: 0, catalog: { version: 1, deleted: [], entries: [
      { id: 'roast-1', lotRef: 'lot-1', roasterRef: 'r-1' },
      { id: 'roast-2', lotRef: 'lot-2', roasterRef: 'r-1' }] } },
  });
  assert.equal(r.status, 200);
  const withPours = LEDGER('alice3');
  withPours.pours = [
    { id: 'pour:cup-1', lotRef: 'lot-1', roasterRef: 'r-1', shop: 'Kumquat', at: '2026-06-01T00:00:00Z', by: 'Alice', cupRef: 'cup-1' },
    { id: 'pour:cup-2', lotRef: 'lot-2', roasterRef: 'r-1', shop: 'Kumquat', at: '2026-06-02T00:00:00Z', by: 'Alice', cupRef: 'cup-2' },
  ];
  r = await req('PUT', `/api/ledgers/${alice.userId}`, { token: alice.token, body: { baseRev: 2, ledger: withPours } });
  assert.equal(r.status, 200); assert.equal(r.body.rev, 3);

  r = await req('GET', '/api/public');
  assert.equal(r.status, 404); assert.equal(r.body.error, 'not-published');
  ok('nothing published yet answers 404 not-published — never an empty atlas');

  r = await req('POST', '/api/publish', { body: { held: [] } });
  assert.equal(r.status, 401);
  ok('publish requires auth');

  r = await req('POST', '/api/publish', { token: bob.token, body: { held: [] } });
  assert.equal(r.status, 403); assert.equal(r.body.error, 'pen-held');
  ok('a non-founder CANNOT publish (403 pen-held)');

  r = await req('POST', '/api/publish', { token: alice.token, body: { held: 'lot-1' } });
  assert.equal(r.status, 400);
  ok('a held list that is not an array of refs is rejected with 400');

  r = await req('POST', '/api/publish', { token: alice.token, body: {} });
  assert.equal(r.status, 200); assert.equal(r.body.rev, 1);
  assert.deepEqual(r.body.counts, { greens: 2, roasters: 0, roasts: 2, bars: 1, pours: 2, held: 0 });
  ok('the founder publishes: rev 1, and the counts state what left');

  r = await req('GET', '/api/public?meta=1');
  assert.equal(r.status, 200); assert.equal(r.body.rev, 1); assert.equal(r.body.atlas, undefined);
  assert.equal(r.body.counts.greens, 2); assert.ok(r.body.publishedAt);
  ok('a reader polls ?meta=1 unauthenticated — rev, date and counts, no atlas');

  r = await req('GET', '/api/public');
  assert.equal(r.status, 200); assert.equal(r.body.publishedBy, 'Alice');
  assert.equal(r.body.atlas.catalog.lots.entries.length, 2);
  assert.equal(r.body.atlas.register.entries[0].name, 'Kumquat');
  assert.equal(r.body.atlas.pours.length, 2);
  ok('a reader reads the whole atlas unauthenticated, and it names the hand that published it');

  // L1/L2: the shared documents and the pours, and nothing else — no ledger,
  // no cup, and every pour with its link to a private reading cut.
  assert.deepEqual(Object.keys(r.body.atlas).sort(), ['catalog', 'pours', 'register']);
  assert.ok(r.body.atlas.pours.every(p => p.cupRef === undefined));
  assert.ok(r.body.atlas.pours.every(p => p.shop && p.at && p.by));
  ok('a pour publishes and its cup never does — cupRef cut, the sighting whole');

  // the ETag: a reader who holds this revision already never pulls it twice
  let raw = await fetch(BASE + '/api/public');
  const etag = raw.headers.get('etag');
  assert.ok(etag && /carta-atlas-1/.test(etag));
  raw = await fetch(BASE + '/api/public', { headers: { 'If-None-Match': etag } });
  assert.equal(raw.status, 304);
  ok('the full read carries an ETag on the rev; a repeat read is a 304');

  // L4: holding a green holds its roasts and its pours with it
  r = await req('POST', '/api/publish', { token: alice.token, body: { held: ['lot-1'] } });
  assert.equal(r.status, 200); assert.equal(r.body.rev, 2);
  assert.deepEqual(r.body.counts, { greens: 1, roasters: 0, roasts: 1, bars: 1, pours: 1, held: 1 });
  assert.deepEqual(r.body.held, ['lot-1']);
  ok('a hold subtracts the green at publish time, and its roasts and pours with it');

  r = await req('GET', '/api/public');
  assert.equal(r.status, 200); assert.equal(r.body.rev, 2);
  assert.deepEqual(r.body.atlas.catalog.lots.entries.map(e => e.id), ['lot-2']);
  assert.deepEqual(r.body.atlas.catalog.roasts.entries.map(e => e.id), ['roast-2']);
  assert.deepEqual(r.body.atlas.pours.map(p => p.lotRef), ['lot-2']);
  ok('the held green, its roast and its pour are absent from the published copy');

  // the record itself is untouched — a hold is a subtraction from the SNAPSHOT
  r = await req('GET', '/api/catalog/lots', { token: alice.token });
  assert.equal(r.body.catalog.entries.length, 2);
  ok('the shared record still holds the green — a hold subtracts from the copy, never the record');

  // L8: adding the reader loosened nothing. Every other endpoint still 401s.
  for (const [method, p] of [['GET', '/api/users'], ['GET', `/api/ledgers/${alice.userId}`],
    ['GET', '/api/cafes'], ['GET', '/api/catalog/lots'], ['PUT', '/api/cafes'],
    ['PUT', '/api/catalog/lots'], ['PUT', `/api/ledgers/${alice.userId}`], ['POST', '/api/publish']]) {
    const u = await req(method, p, { body: method === 'GET' ? undefined : {} });
    assert.equal(u.status, 401, `${method} ${p} should still require auth`);
  }
  ok('GET /api/public is the ONLY unauthenticated data endpoint — every other one still 401s');

  // ---- registration code gate + founder migration (separate server instance) ----
  DATA2 = fs.mkdtempSync(path.join(os.tmpdir(), 'carta-sync-test2-'));
  // A users.json from before the founder role: two accounts, no flags. The
  // server must promote the earliest on boot, so an existing group keeps a pen.
  const oldSalt = '00'.repeat(16);
  const oldUser = (id, name, createdAt) => ({
    id, name, nameLower: name.toLowerCase(), salt: oldSalt,
    hash: require('node:crypto').scryptSync('beans', oldSalt, 64).toString('hex'), createdAt,
  });
  fs.writeFileSync(path.join(DATA2, 'users.json'), JSON.stringify({
    version: 1, users: [oldUser('b'.repeat(16), 'Late', '2026-02-01T00:00:00Z'), oldUser('a'.repeat(16), 'Early', '2026-01-01T00:00:00Z')], tokens: {},
  }));
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
  assert.equal(r2.status, 200); assert.equal(r2.body.founder, false);
  ok('login is not gated by the registration code');

  r2 = await req2('POST', '/api/login', { name: 'Early', passcode: 'beans' });
  assert.equal(r2.status, 200); assert.equal(r2.body.founder, true);
  const late = await req2('POST', '/api/login', { name: 'Late', passcode: 'beans' });
  assert.equal(late.status, 200); assert.equal(late.body.founder, false);
  ok('a pre-founder users.json promotes its earliest account to the pen on boot');

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
