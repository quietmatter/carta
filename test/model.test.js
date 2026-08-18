#!/usr/bin/env node
'use strict';
/* Tests for the taste model + the brief (ARCHITECTURE.md §5, §9). Zero deps:
 *   node test/model.test.js
 * Slices the /* ==== pure ==== *\/ ... /* ==== /pure ==== *\/ region straight
 * out of index.html and evaluates it — no DOM, no localStorage, so a fixture
 * ledger is the only input a test needs. If this test can't find the region,
 * the markers moved or were removed from index.html; fix the markers, not
 * this file. */

const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert');
const vm = require('node:vm');

const HTML = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const OPEN = '/* ==== pure ==== *';
const CLOSE = '/* ==== /pure ==== */';
const openAt = HTML.indexOf(OPEN);
const closeAt = HTML.indexOf(CLOSE);
if (openAt === -1 || closeAt === -1 || closeAt < openAt) {
  throw new Error('pure-block markers not found in index.html — did they move?');
}
const pureSrc = HTML.slice(openAt, closeAt + CLOSE.length);

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(pureSrc + `
;globalThis.__m = { tasteModel, briefPlainText, briefPageHTML, matchNodes, joinAlias,
  putAwayCore, restoreCore, fold, lev, esc, coffeeLabel };
`, sandbox);
const M = sandbox.__m;

let n = 0;
const ok = name => console.log(`PASS  ${++n}. ${name}`);

// ---- fixture ledger: two roasters, two cities, home + café cups ----
const ledger = () => ({
  coffees: [
    { id: 'c1', roaster: "Sey's", roasterRef: 'r1', name: 'Gedeb', origin: { country: 'Ethiopia', process: 'Washed' } },
    { id: 'c2', roaster: "Sey's", roasterRef: 'r1', name: 'Yirg', origin: { country: 'Ethiopia', process: 'Natural' } },
    { id: 'c3', roaster: 'Onyx', roasterRef: 'r2', name: 'Pink Bourbon', origin: { country: 'Colombia', process: 'Washed' } },
  ],
  places: [
    { id: 'p1', name: 'Halfpence', city: 'Portland' },
    { id: 'p2', name: 'Push x Pull', city: 'Seattle' },
  ],
  cups: [
    { id: 'u1', kind: 'bar', coffeeRef: 'c1', placeRef: 'p1', score: 9, descriptors: ['floral', 'citrus'] },
    { id: 'u2', kind: 'bar', coffeeRef: 'c2', placeRef: 'p1', score: 8, descriptors: ['citrus'] },
    { id: 'u3', kind: 'bar', coffeeRef: 'c3', placeRef: 'p2', score: 6, descriptors: ['nutty'] },
    { id: 'u4', kind: 'home', coffeeRef: 'c1', score: 9, descriptors: ['floral'] },
  ],
});

// ---- the bar: floor + anchors ----
let tm = M.tasteModel(ledger());
assert.equal(tm.bar.floor, 8, 'floor is the median of café-only scores [9,8,6] -> 8');
ok("the bar's floor is the median of café cup scores");

assert.equal(tm.bar.anchors.length, 1);
assert.equal(tm.bar.anchors[0].name, "Sey's");
assert.ok(Math.abs(tm.bar.anchors[0].avg - (9 + 8 + 9) / 3) < 1e-9);
assert.equal(tm.bar.anchors[0].n, 3);
ok('an anchor is a roaster averaging >=8 over >=2 cups, home and café pooled');

assert.equal(tm.bar.anchors.find(a => a.name === 'Onyx'), undefined);
ok("a roaster with n<2 (Onyx, one cup) never earns an anchor even at a high score");

assert.deepEqual(new Set(tm.bar.nines), new Set(['u1', 'u4']));
ok('nines lists exactly the cupRefs scoring 9 — the evidence, not just a count');

// ---- the vector: every value carries weight + n ----
const washed = tm.vector.processes.find(p => p.value === 'Washed');
assert.ok(washed && washed.n === 3 && Math.abs(washed.weight - 8) < 1e-9);
ok('vector.processes buckets by origin.process across every cup on that coffee, home and café alike');

const ethiopia = tm.vector.origins.find(o => o.value === 'Ethiopia');
assert.ok(ethiopia && ethiopia.n === 3);
ok('vector.origins buckets by origin.country');

const floral = tm.vector.descriptors.find(d => d.value === 'floral');
assert.ok(floral && floral.n === 2 && Math.abs(floral.weight - 9) < 1e-9);
ok('vector.descriptors buckets a cup under every descriptor it carries (multi-bucket)');

// ---- scope: had + knownRoasters, city-scoped, fold-insensitive ----
let scoped = tm.scope('city', 'Portland');
assert.deepEqual(new Set(scoped.had), new Set(["Sey's — Gedeb", "Sey's — Yirg"]));
assert.deepEqual(scoped.knownRoasters, ["Sey's"]);
ok('scope(city) excludes cups at a café in a different city');

scoped = tm.scope('city', 'PORTLAND');
assert.deepEqual(new Set(scoped.had), new Set(["Sey's — Gedeb", "Sey's — Yirg"]));
ok('scope(city) matches through fold() — case doesn\'t split one city into two');

scoped = tm.scope('city', 'Nowhere');
assert.deepEqual(scoped.had, []);
assert.deepEqual(scoped.knownRoasters, []);
ok('scope(city) for an unknown city returns empty, never throws');

scoped = tm.scope('country', 'ethiopia');
assert.deepEqual(new Set(scoped.had), new Set(["Sey's — Gedeb", "Sey's — Yirg"]));
ok('scope(country) reads every cup on a coffee from that country, home cups included');

// ---- an empty ledger never fakes a reading ----
tm = M.tasteModel({ coffees: [], places: [], cups: [] });
assert.equal(tm.bar.floor, null);
assert.deepEqual(tm.bar.anchors, []);
assert.deepEqual(tm.bar.nines, []);
ok('an empty ledger reads as unread (null floor, no anchors) — never a faked default');

// ---- the brief: plain-text cut, bounded, with scope exclusions inline ----
tm = M.tasteModel(ledger());
let text = M.briefPlainText(ledger(), 'city', 'Portland', tm);
assert.ok(text.includes("Already had in Portland"));
assert.ok(text.includes("Sey's — Gedeb"));
assert.ok(!text.includes('Pink Bourbon'), 'a Seattle cup must not leak into a Portland brief\'s exclusions');
assert.ok(text.length <= 1500);
ok('briefPlainText states scope exclusions inline ("already had") and stays scoped');

// a ledger with enough vector spread to blow past 1500 chars unbounded
const bigLedger = { coffees: [], places: [], cups: [] };
for (let i = 0; i < 60; i++) {
  const id = 'bc' + i;
  bigLedger.coffees.push({ id, roaster: 'Roaster number ' + i + ' of the fixture', name: 'Coffee ' + i,
    origin: { country: 'Country-' + i, process: 'Process-variant-name-' + i } });
  bigLedger.cups.push({ id: 'bu' + i, kind: 'bar', coffeeRef: id, placeRef: null, score: 9,
    descriptors: ['descriptor-' + i] });
}
text = M.briefPlainText(bigLedger, null, null, M.tasteModel(bigLedger));
assert.ok(text.length <= 1500, `brief must stay within its size bound, got ${text.length}`);
ok('briefPlainText hard-bounds at 1500 characters however large the vector gets');

// the machine block embeds carta.brief/v1 and survives a </script> in the record
const trickyLedger = ledger();
trickyLedger.coffees[0].name = 'Weird</script><script>alert(1)</script>Name';
const page = M.briefPageHTML(trickyLedger, 'city', 'Portland');
assert.ok(page.includes('"version":"carta.brief/v1"'));
const island = page.slice(page.indexOf('id="carta-brief"'));
assert.ok(!island.includes('</script><script>alert'), 'the raw </script> from the record must not survive into the page unescaped');
assert.ok(island.includes('<\\/script'), 'the escaped form must be present in the embedded JSON island');
ok('briefPageHTML escapes </script> inside the embedded carta.brief/v1 machine block');

// ---- the gentle join: exact fold, near match, join/undo round-trip ----
const roaster = { id: 'r1', name: "Sey's", aka: [] };
let m = M.matchNodes([roaster], "SEY'S");
assert.equal(m.exact, roaster);
assert.equal(m.near, null);
ok('matchNodes finds an exact match through fold() (case-insensitive)');

m = M.matchNodes([roaster], "Say's");
assert.equal(m.exact, null);
assert.equal(m.near, roaster);
ok('matchNodes offers a near match (small edit distance) rather than joining or forking silently');

M.joinAlias(roaster, "Say's");
assert.deepEqual(roaster.aka, ["Say's"]);
m = M.matchNodes([roaster], "Say's");
assert.equal(m.exact, roaster, 'the joined spelling must now match exactly, via aka[]');
ok('joinAlias adds the accepted spelling to aka[], and a later match on it joins outright');

M.joinAlias(roaster, "Say's"); // joining the same spelling twice must not duplicate it
assert.deepEqual(roaster.aka, ["Say's"]);
ok('joinAlias never duplicates an alias already carried');

// ---- put-away / restore: a round trip on an explicit ledger, no DOM ----
const l2 = { cups: [{ id: 'x1', archived: false }] };
assert.equal(M.putAwayCore(l2, 'cups', 'x1', '2026-01-01T00:00:00.000Z'), true);
assert.equal(l2.cups[0].archived, true);
assert.equal(l2.cups[0].archivedAt, '2026-01-01T00:00:00.000Z');
ok('putAwayCore archives a record and stamps archivedAt');

assert.equal(M.restoreCore(l2, 'cups', 'x1'), true);
assert.equal(l2.cups[0].archived, false);
assert.equal(l2.cups[0].archivedAt, null);
ok('restoreCore is the exact undo — archived false, archivedAt cleared');

assert.equal(M.putAwayCore(l2, 'cups', 'missing', 'now'), false);
assert.equal(M.restoreCore(l2, 'cups', 'missing'), false);
ok('put-away/restore on a missing id is a no-op that reports failure, never throws');

console.log(`\nALL ${n} MODEL TESTS PASSED`);
