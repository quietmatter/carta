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
  putAwayCore, restoreCore, fold, lev, esc, coffeeLabel, importClassicMap,
  askPromptText, parseAskJSON, menuOCRPrompt, parseMenuOCR, extractJSON,
  ROAST_LEVELS, parseRoastLevel };
`, sandbox);
const M = sandbox.__m;

let n = 0;
const ok = name => console.log(`PASS  ${++n}. ${name}`);

// ---- fixture ledger: two roasters, two cities, home + café cups ----
const ledger = () => ({
  coffees: [
    { id: 'c1', roaster: "Sey's", roasterRef: 'r1', name: 'Gedeb', origin: { country: 'Ethiopia', process: 'Washed' }, roastLevel: 'Light' },
    { id: 'c2', roaster: "Sey's", roasterRef: 'r1', name: 'Yirg', origin: { country: 'Ethiopia', process: 'Natural' }, roastLevel: 'Light' },
    { id: 'c3', roaster: 'Onyx', roasterRef: 'r2', name: 'Pink Bourbon', origin: { country: 'Colombia', process: 'Washed' }, roastLevel: 'Medium-dark' },
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

const light = tm.vector.roast.find(r => r.value === 'Light');
assert.ok(light && light.n === 3 && Math.abs(light.weight - (9 + 8 + 9) / 3) < 1e-9);
assert.equal(tm.vector.roast[0].value, 'Light', 'Light (weight ~8.67, n=3) outranks Medium-dark (weight 6, n=1)');
ok('vector.roast buckets by Coffee.roastLevel, ranked the same way processes/origins are (ROADMAP.md Phase 9)');

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

assert.ok(text.includes('Roast levels I rate highest:'));
assert.ok(text.includes('Light (8.7/9, n=3)'), 'the clause carries the same weight+n evidence every other vector line does');
assert.ok(text.indexOf('Roast levels') < text.indexOf('Processes I rate'), 'roast leads the vector, ahead of process (ROADMAP.md §0: the founding claim, sharpened first)');
ok('briefPlainText gains the roast clause for free — askPromptText embeds this same text, so the ask inherits it too');

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

// ---- the classic importer: a synthetic classic export, mapped onto Carta 7 ----
const emptyLedger = () => ({ roasters: [], places: [], coffees: [], cups: [], setups: [], brews: [] });

const classicExport = {
  setups: [
    { id: 'cs1', createdAt: '2025-01-01T00:00:00Z', name: 'Home V60', grinder: 'Comandante', brewer: 'V60',
      grindMin: 0, grindMax: 40, grindStep: 1 },
  ],
  bags: [
    // flat fields only — no catalog refs
    { id: 'cb1', createdAt: '2025-01-02T00:00:00Z', roaster: "Sey's", name: 'Ethiopia Gedeb',
      originCountry: 'Ethiopia', originRegion: 'Gedeb', producer: 'Worka Cooperative', variety: 'Heirloom',
      process: 'Washed', roastDate: '2025-01-01', notes: 'Bright, jammy.', archived: false },
    // flat fields RETIRED (blank) — must read through the catalog node instead
    { id: 'cb2', createdAt: '2025-02-01T00:00:00Z', roaster: '', name: '', roasterRef: 'r1', lotRef: 'l1',
      roastRef: 'ro1', originCountry: '', originRegion: '', producer: '', variety: '', process: '',
      roastDate: '', archived: true, updatedAt: '2025-02-05T00:00:00Z' },
  ],
  authored: [
    { id: 'ca1', createdAt: '2025-03-01T00:00:00Z', roaster: 'Onyx', origin: {}, originCountry: 'Colombia',
      originRegion: 'Huila', variety: 'Castillo', process: 'Natural',
      roast: { name: 'Colombia Pink Bourbon', roastDate: '2025-03-01' } },
  ],
  brews: [
    { id: 'cr1', createdAt: '2025-01-03T00:00:00Z', bagId: 'cb1', setupId: 'cs1', technique: 'V60',
      grind: 22, doseG: 18, waterG: 300, tempC: 94, timeSec: 180, instrumentation: 'measured' },
    // orphan brew — its bag isn't in this export at all; must be skipped, not throw
    { id: 'cr-orphan', createdAt: '2025-01-04T00:00:00Z', bagId: 'nonexistent-bag', setupId: 'cs1' },
  ],
  cups: [
    { id: 'cc1', createdAt: '2025-01-03T00:10:00Z', kind: 'home', bagId: 'cb1', brewId: 'cr1',
      hedonic: 9, descriptors: ['floral', 'citrus'], notes: 'Best cup yet.' },
    { id: 'cc2', createdAt: '2025-01-10T00:00:00Z', kind: 'cafe', shop: 'Halfpence', city: 'Portland',
      drink: 'Pour over', roaster: "Sey's", hedonic: 8, descriptors: ['citrus'], notes: '' },
  ],
  catalog: {
    roasters: { entries: [{ id: 'r1', name: "Sey's" }] },
    lots: { entries: [{ id: 'l1', country: 'Ethiopia', region: 'Yirgacheffe', locality: 'Gedeb town',
      producer: 'Worka Cooperative', variety: 'Heirloom', process: 'Washed' }] },
    roasts: { entries: [{ id: 'ro1', level: 'Light', roastDate: '2025-02-01' }] },
  },
};

let out = M.importClassicMap(classicExport, emptyLedger());
assert.equal(out.newSetups.length, 1);
assert.equal(out.newCoffees.length, 4, 'cb1, cb2, ca1, and cc2\'s minted café coffee');
assert.equal(out.newCups.length, 2);
assert.equal(out.newBrews.length, 1, 'the orphan brew (unknown bagId) must be silently skipped, not thrown');
ok('importClassicMap maps setups, bags, authored, cups and brews from a synthetic classic export');

const bag1Coffee = out.newCoffees.find(c => c.sourceId === 'classic:bag:cb1');
assert.equal(bag1Coffee.roaster, "Sey's");
assert.equal(bag1Coffee.origin.country, 'Ethiopia');
assert.equal(bag1Coffee.origin.farm, 'Worka Cooperative');
assert.equal(bag1Coffee.home, true);
assert.equal(bag1Coffee.archived, false);
ok('a bag with only flat fields maps them straight across, and lands home:true');

const bag2Coffee = out.newCoffees.find(c => c.sourceId === 'classic:bag:cb2');
assert.equal(bag2Coffee.roaster, "Sey's", 'roaster must read through roasterRef once the flat field is retired');
assert.equal(bag2Coffee.origin.country, 'Ethiopia', 'origin must read through lotRef once flat fields are retired');
assert.equal(bag2Coffee.origin.region, 'Gedeb town, Yirgacheffe', 'locality folds in ahead of region');
assert.equal(bag2Coffee.roastDate, '2025-02-01', 'roast date must read through roastRef');
assert.equal(bag2Coffee.archived, true);
ok('a bag with retired flat fields reads roaster/origin/roast NODE-FIRST, exactly as classic itself does');

const authoredCoffee = out.newCoffees.find(c => c.sourceId === 'classic:authored:ca1');
assert.equal(authoredCoffee.name, 'Colombia Pink Bourbon');
assert.equal(authoredCoffee.home, false, 'an authored record was never on classic\'s own shelf');
ok('authored records become coffees too, but never home:true');

const cafeCoffee = out.newCoffees.find(c => c.sourceId === 'classic:cup:cc2:coffee');
assert.ok(cafeCoffee, 'a café cup with no bag behind it still mints its own coffee');
assert.equal(cafeCoffee.home, false);
const cafeCup = out.newCups.find(c => c.sourceId === 'classic:cup:cc2');
assert.equal(cafeCup.kind, 'bar');
assert.equal(cafeCup.coffeeRef, cafeCoffee.id);
const halfpence = out.newPlaces.find(p => p.name === 'Halfpence');
assert.ok(halfpence && halfpence.city === 'Portland');
assert.equal(cafeCup.placeRef, halfpence.id);
ok('a café cup mints its coffee and joins/mints its place, city carried from the cup');

// classic's café Register carries the confirmed position, the neighborhood and the
// palette — a cup alone never did, and its own city string can be blank even when
// the Register entry isn't (ARCHITECTURE.md §8 promises the profile crosses too)
const registerExport = {
  ...classicExport,
  cups: [
    ...classicExport.cups,
    { id: 'cc3', createdAt: '2025-01-11T00:00:00Z', kind: 'cafe', shop: 'Halfpence', city: '',
      drink: 'Espresso', roaster: "Sey's", hedonic: 7, descriptors: [], notes: '' },
  ],
  cafes: [
    { id: 'reg1', name: 'Halfpence', city: 'Portland', neighborhood: 'Alberta Arts',
      lat: 45.5581, lon: -122.6295, palette: { h: 20, s: 40, l: 50, brand: 'hsl(20,40%,50%)', dark: false } },
  ],
};
const regOut = M.importClassicMap(registerExport, emptyLedger());
const halfpenceReg = regOut.newPlaces.find(p => p.name === 'Halfpence');
assert.ok(halfpenceReg, 'one place, joined across both cups even though the second cup\'s own city is blank');
assert.equal(halfpenceReg.city, 'Portland', 'the blank cup city must not overwrite what the Register already knew');
assert.equal(halfpenceReg.lat, 45.5581);
assert.equal(halfpenceReg.lon, -122.6295);
assert.equal(halfpenceReg.geocoded, true, 'a position carried from classic needs no re-geocoding');
assert.equal(halfpenceReg.neighborhood, 'Alberta Arts');
assert.equal(halfpenceReg.palette.brand, 'hsl(20,40%,50%)');
const cc3Cup = regOut.newCups.find(c => c.sourceId === 'classic:cup:cc3');
assert.equal(cc3Cup.placeRef, halfpenceReg.id, 'the blank-city cup still joins the same place as the first');
ok('joinPlace reads the café Register by name and carries its position, neighborhood and palette — blanks-only, never overwriting a typed city');

const homeCup = out.newCups.find(c => c.sourceId === 'classic:cup:cc1');
assert.equal(homeCup.kind, 'home');
assert.equal(homeCup.coffeeRef, bag1Coffee.id);
assert.equal(homeCup.brewRef, out.newBrews[0].id);
assert.equal(homeCup.score, 9);
assert.deepEqual(homeCup.descriptors, ['floral', 'citrus']);
ok('a home cup resolves its coffeeRef through the bag mapping and its brewRef through the brew mapping');

// idempotency: merge the first run's output into `existing`, map the SAME export again — nothing new
const merged = {
  roasters: out.newRoasters, places: out.newPlaces, coffees: out.newCoffees,
  cups: out.newCups, setups: out.newSetups, brews: out.newBrews,
};
const second = M.importClassicMap(classicExport, merged);
assert.equal(second.newCoffees.length, 0);
assert.equal(second.newCups.length, 0);
assert.equal(second.newSetups.length, 0);
assert.equal(second.newBrews.length, 0);
assert.equal(second.newPlaces.length, 0);
assert.equal(second.newRoasters.length, 0);
ok('importClassicMap is idempotent — re-mapping the same export against its own prior output adds nothing');

// gentle join still applies within the import: two cups at the same café must join to one place
const twoCupExport = { ...classicExport, bags: [], authored: [], brews: [],
  cups: [
    { id: 'x1', createdAt: '2025-01-01T00:00:00Z', kind: 'cafe', shop: 'Halfpence', city: 'Portland', hedonic: 9 },
    { id: 'x2', createdAt: '2025-01-02T00:00:00Z', kind: 'cafe', shop: "HALFPENCE", hedonic: 7 },
  ] };
out = M.importClassicMap(twoCupExport, emptyLedger());
assert.equal(out.newPlaces.length, 1, 'the same café, cased differently, must join to one place via fold()');
ok('the gentle join applies within a single import pass, not just against pre-existing records');

// ---- the ask (ROADMAP.md Phase 7): the prompt text, and the parse of what comes back ----
const promptCity = M.askPromptText('MY COFFEE TASTE (from Carta)\n...', 'city', 'Lisbon', 'Three days, mostly on foot');
assert.ok(promptCity.includes('MY COFFEE TASTE'), 'the prompt carries the brief text verbatim');
assert.ok(promptCity.includes("asking about the city: Lisbon"), 'the scope kind names itself in the prompt');
assert.ok(promptCity.includes('Three days, mostly on foot'), 'the optional question rides along');
assert.ok(promptCity.includes('ONLY a JSON object') && promptCity.includes('"cafes"'), 'the model is told exactly what shape to answer in');
ok('askPromptText embeds the brief, the scope, and the question into one prompt asking for strict JSON');

const promptFriend = M.askPromptText('brief', 'friend', 'she likes what I like but darker', '');
assert.ok(promptFriend.includes('on behalf of a friend'), 'friend scope reads as a delegated ask, not a city');
ok('askPromptText phrases a friend-scoped ask differently from a place-scoped one');

let parsed = M.parseAskJSON('{"cafes":[{"name":"Copper Bean","neighborhood":"Alfama","city":"Lisbon","why":"washed process, like your anchors"}]}');
assert.equal(parsed.ok, true);
assert.equal(parsed.findings.length, 1);
assert.equal(parsed.findings[0].name, 'Copper Bean');
assert.equal(parsed.findings[0].neighborhood, 'Alfama');
ok('parseAskJSON reads a clean JSON answer straight');

parsed = M.parseAskJSON('Sure, here you go:\n```json\n{"cafes":[{"name":"Fabrica","city":"Lisbon","why":"anchor roaster on the menu"}]}\n```\nEnjoy!');
assert.equal(parsed.findings.length, 1);
assert.equal(parsed.findings[0].name, 'Fabrica');
ok('parseAskJSON reads the JSON out of a markdown-fenced answer with prose around it');

parsed = M.parseAskJSON('{"cafes":[{"name":"Real Place","why":"good"},{"neighborhood":"no name here","why":"skip me"}]}');
assert.equal(parsed.findings.length, 1, 'an entry with no name is never a suggestion Carta can ground or draw');
assert.equal(parsed.findings[0].name, 'Real Place');
ok('parseAskJSON drops any entry the model names nothing for');

parsed = M.parseAskJSON('I don\'t have enough information to recommend anything specific here.');
assert.equal(parsed.ok, false);
assert.deepEqual(parsed.findings, []);
ok('parseAskJSON degrades to empty, never throws, on a non-JSON answer');

parsed = M.parseAskJSON('{"cafes": [ this is not valid json');
assert.equal(parsed.ok, false);
assert.deepEqual(parsed.findings, []);
ok('parseAskJSON degrades to empty, never throws, on truncated or malformed JSON');

// ---- Phase 14: the ask asks for an argument, and holds its own caps ----
const promptNear = M.askPromptText('brief', 'near', 'Huntington Park', '', 'a short drive');
assert.ok(promptNear.includes("within reach of it: Huntington Park"), 'a centroid ask reads as a starting point, not as a city');
assert.ok(promptNear.includes("How far I'll actually go: a short drive"), 'the reach rides in the prompt — it is what makes an honest distance answerable');
ok('askPromptText carries a centroid and the reach the keeper stated');

const promptRich = M.askPromptText('brief', 'city', 'Lisbon', '', '');
assert.ok(!promptRich.includes("How far I'll actually go"), 'no reach stated, no reach clause invented');
['"read"', '"verdict"', '"fit"', '"order"', '"travel"', '"stale"', '"mentions"', '"plan"', '"routes"', '"wildcard"']
  .forEach(k => assert.ok(promptRich.includes(k), `the prompt names ${k} — a field the model is never asked for is a field it never fills`));
assert.ok(promptRich.includes('ONE sentence'), 'the one-sentence discipline is stated, not hoped for — this is read as chips, not prose');
assert.ok(/no live access to any menu/.test(promptRich), 'Carta makes no search, so the prompt forbids stating a menu as fact');
assert.ok(promptRich.includes('At most 8 cafés, 4 mentions, 3 fit strings each, 4 routes'), 'the caps are stated in the same numbers the parse enforces');
ok('askPromptText asks for the four parts, one sentence each, and rules out what Carta cannot know');

const full = JSON.stringify({
  read: 'The shops that fit you sit north, not next door.',
  cafes: [{ name: 'Mad Lab', neighborhood: 'DTLA', city: 'Los Angeles', verdict: 'Best match overall',
    why: 'Their co-ferment program is your 9s.', fit: ['Alchemy fermentation 9.0/9, n=3', 'tropical', 'stone fruit', 'dropped'],
    order: 'Whatever rare coffee is on pour-over', travel: '15 min north', stale: true }],
  mentions: [{ name: "Cruzita's", city: 'Huntington Park', instead: 'Café de olla, not a filter bar.' }],
  plan: { move: 'Go to Mad Lab and ask what is on pour-over.',
    routes: [{ if: 'you want the best cup', order: ['Cognoscenti', 'Maru', 'Mad Lab'] }],
    wildcard: { name: 'Endorffeine', city: 'Los Angeles', why: 'Precision rather than fermentation.' } },
});
parsed = M.parseAskJSON(full);
assert.equal(parsed.read, 'The shops that fit you sit north, not next door.');
assert.equal(parsed.findings[0].verdict, 'Best match overall');
assert.equal(parsed.findings[0].stale, true);
assert.deepEqual(parsed.findings[0].fit, ['Alchemy fermentation 9.0/9, n=3', 'tropical', 'stone fruit'], 'three figures is the cap, and the parse holds it whatever the prompt asked');
assert.equal(parsed.mentions[0].instead, 'Café de olla, not a filter bar.');
assert.deepEqual(parsed.plan.routes[0].order, ['Cognoscenti', 'Maru', 'Mad Lab']);
assert.equal(parsed.plan.wildcard.name, 'Endorffeine');
ok('parseAskJSON reads all four parts of a full answer, and caps the evidence list itself');

parsed = M.parseAskJSON('{"cafes":[{"name":"Copper Bean","why":"washed process, like your anchors"}]}');
assert.equal(parsed.ok, true);
assert.equal(parsed.findings[0].name, 'Copper Bean');
assert.equal(parsed.findings[0].why, 'washed process, like your anchors');
assert.deepEqual([parsed.findings[0].verdict, parsed.findings[0].order, parsed.findings[0].travel], ['', '', '']);
assert.deepEqual(parsed.findings[0].fit, []);
assert.deepEqual([parsed.read, parsed.mentions, parsed.plan], ['', [], null]);
ok('parseAskJSON still reads the old four-field shape — every ask already on the record must open');

parsed = M.parseAskJSON(JSON.stringify({ cafes: [], mentions: [{ city: 'nowhere' }], plan: { routes: [{ if: 'no order given' }], wildcard: { why: 'no name' } } }));
assert.deepEqual(parsed.mentions, [], 'a mention with no name is a place Carta cannot ground or draw');
assert.equal(parsed.plan, null, 'a plan that said nothing usable is no plan, not an empty box on the screen');
ok('parseAskJSON drops the unusable rather than drawing an empty one');

parsed = M.parseAskJSON(JSON.stringify({ cafes: Array.from({ length: 12 }, (_, i) => ({ name: 'Café ' + i })) }));
assert.equal(parsed.findings.length, 8, 'the cap is enforced here, not trusted to the prompt');
parsed = M.parseAskJSON(JSON.stringify({ cafes: [{ name: 'X', verdict: 'a verdict far longer than any chip could ever hold on a phone screen' }] }));
assert.ok(parsed.findings[0].verdict.length <= 40 && parsed.findings[0].verdict.endsWith('…'), 'an over-long verdict is trimmed to chip length, never passed through to overflow the row');
ok('parseAskJSON holds every cap the prompt states, and trims rather than overflows');

// ---- the menu's OCR (horizon list): the prompt, and the parse of what comes back ----
const ocrPrompt = M.menuOCRPrompt();
assert.ok(ocrPrompt.includes('ONLY a JSON object') && ocrPrompt.includes('"lines"'), 'the model is told exactly what shape to answer in');
assert.ok(ocrPrompt.includes('Roaster') && ocrPrompt.includes('Coffee'), 'the prompt states the same line shape a keeper types by hand');
ok('menuOCRPrompt asks for strict JSON in the shape the menu textarea already expects');

let ocr = M.parseMenuOCR('{"lines":["Sey\'s — Ethiopia Gedeb, washed","Onyx — Colombia Pink Bourbon, washed"]}');
assert.equal(ocr.ok, true);
assert.equal(ocr.lines.length, 2);
assert.equal(ocr.lines[0], "Sey's — Ethiopia Gedeb, washed");
ok('parseMenuOCR reads a clean JSON answer straight');

ocr = M.parseMenuOCR('Here\'s what I found:\n```json\n{"lines":["Fabrica — Kenya Kiamabara"]}\n```');
assert.equal(ocr.lines.length, 1);
assert.equal(ocr.lines[0], 'Fabrica — Kenya Kiamabara');
ok('parseMenuOCR reads the JSON out of a markdown-fenced answer with prose around it');

ocr = M.parseMenuOCR('{"lines":["Real Coffee","",null,"  ","Another Coffee  "]}');
assert.deepEqual(ocr.lines, ['Real Coffee', 'Another Coffee'], 'blank/null entries never become blank menu lines');
ok('parseMenuOCR drops blank or null entries and trims what survives');

ocr = M.parseMenuOCR("Sorry, I can't quite make out this photo.");
assert.equal(ocr.ok, false);
assert.deepEqual(ocr.lines, []);
ok('parseMenuOCR degrades to empty, never throws, on a non-JSON answer — never invents a line');

// extractJSON is the shared door both parseAskJSON and parseMenuOCR read through
assert.deepEqual(M.extractJSON('{"a":1}'), { a: 1 });
assert.equal(M.extractJSON('not json at all'), null);
ok('extractJSON is the one shape-reading door shared by every "ask the model for JSON" caller');

// ---- parseRoastLevel (ROADMAP.md Phase 9): the door/menu-capture parsing ----
assert.equal(M.parseRoastLevel("Sey's — Ethiopia Gedeb, light roast"), 'Light');
assert.equal(M.parseRoastLevel('Roast: Medium-Light'), 'Medium-light', 'reads either ordering, "<level> roast" or "roast: <level>"');
assert.equal(M.parseRoastLevel('A DARK ROAST from a favorite roaster'), 'Dark', 'case-insensitive, via the same fold() every other parser reads through');
assert.equal(M.parseRoastLevel('Medium roast, washed, Huila'), 'Medium');
assert.equal(M.parseRoastLevel('medium-dark roast'), 'Medium-dark', 'the compound level checked before the bare "medium" so it never gets shadowed');
ok('parseRoastLevel reads a stated level off a pasted bag or a menu line, either word order, case-insensitive');

assert.equal(M.parseRoastLevel("Sey's — Ethiopia Gedeb, washed"), '', 'no roast word at all — the ordinary case for a door paste or a menu line');
assert.equal(M.parseRoastLevel('Light, floral, citrus — a bright cup'), '', 'a tasting note is not a roast level: "light" alone, with no adjacent "roast", must not match');
assert.equal(M.parseRoastLevel('Dark chocolate and stone fruit'), '', 'same refusal for "dark" as a flavor word, not a roast word');
assert.equal(M.parseRoastLevel(''), '');
assert.equal(M.parseRoastLevel(undefined), '', 'never throws on a missing line');
ok('parseRoastLevel refuses everywhere the word "roast" isn\'t adjacent — never mistakes a tasting note for a roast level');

assert.deepEqual(M.ROAST_LEVELS, ['Light', 'Medium-light', 'Medium', 'Medium-dark', 'Dark']);
ok('ROAST_LEVELS is the fixed short scale the phase names — no rung, no ladder, just five words (ROADMAP.md\'s own tripwire)');

console.log(`\nALL ${n} MODEL TESTS PASSED`);
