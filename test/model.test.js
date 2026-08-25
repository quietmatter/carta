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

const OPEN = '/* ==== pure ==== *';
const CLOSE = '/* ==== /pure ==== */';
// Five files carry a pure block since Phase 29 (ARCHITECTURE.md §1).
// They are evaluated in the browser's own <head> order — map, plate, shot,
// ask, then index.html — because the seams run that way: parseVisualizerShot
// (now in carta-shot.js) reads the plate's shotCurve/shotPours, and
// index.html's own parseCfSearch/parseMenuOCR read the ask's
// extractJSON/askStr. Everything
// lands in one evaluated source, so function declarations hoist across the
// whole of it; the order is what keeps top-level const initializers honest.
// carta-map.js leads because it is first in that <head>, and its own landKey
// and cityKey read index.html's fold() — which hoists back the other way.
const slice = file => {
  const src = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
  const openAt = src.indexOf(OPEN);
  const closeAt = src.indexOf(CLOSE);
  if (openAt === -1 || closeAt === -1 || closeAt < openAt) {
    throw new Error(`pure-block markers not found in ${file} — did they move?`);
  }
  return src.slice(openAt, closeAt + CLOSE.length);
};
const pureSrc = ['carta-map.js', 'carta-plate.js', 'carta-shot.js', 'carta-ask.js', 'index.html']
  .map(slice).join('\n');

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(pureSrc + `
;globalThis.__m = { tasteModel, briefPlainText, briefPageHTML, matchNodes, joinAlias,
  putAwayCore, restoreCore, fold, lev, esc, coffeeLabel, importClassicMap,
  askPromptText, parseAskJSON, matchFigure, hoodOf, cleanHood, cityOf, dedupeHits, parseMapLink,
  projectFlat, convexHull, cityShapeHull, roundedHullPath, cityShapePath, menuOCRPrompt, parseMenuOCR, extractJSON,
  ROAST_LEVELS, parseRoastLevel, doorParse, originPin, meanPin, namesBack, cfSearchPrompt, parseCfSearch,
  parseVisualizerShot, normalizeRoastLevel, matchSetupByGrinder, brewerOf, setupCandidatesFromShots,
  shotCurve, shotFigures, platePaths, shotAt, shotTempGoal,
  shotPours, shotMethod, shotPhase, mmss, shotPreinfusion, shotStartedAt, tsToMs,
  LANDS, LAND_TOPO, LAND_OFF_BELT, CITY_RINGS, CITY_ARCS, CITY_Q,
  landPts, landRingsRaw, landTopoRaw, landKey, landAnchor, sealBands,
  cityKey, cityRingsRaw, cityArcsRaw, cityWindow, ringsInWindow, arcsInWindow, plateGround };
`, sandbox);
const M = sandbox.__m;

let n = 0;
const ok = name => console.log(`PASS  ${++n}. ${name}`);
// doorParse returns origin and roast level too; most assertions only care
// about the two fields the door files a coffee under
const pick = r => ({ roaster: r.roaster, name: r.name });

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

// ---- a figure the model wrote, resolved back to the item it echoed ----
const tmFix = M.tasteModel(ledger());
assert.equal(M.matchFigure('Washed 8.0/9, n=3', tmFix).kind, 'processes');
assert.equal(M.matchFigure('Washed 8.0/9, n=3', tmFix).value, 'Washed');
assert.equal(M.matchFigure('Ethiopia, n=3', tmFix).kind, 'origins');
assert.equal(M.matchFigure("Sey's avg 8.7 over 3 cups", tmFix).kind, 'anchor', 'a roaster resolves to its anchor sheet, not to a vector bucket');
assert.equal(M.matchFigure('Light (8.7/9, n=3)', tmFix).kind, 'roast');
ok('matchFigure resolves a model-written figure to the taste-model item the brief echoed to it');

assert.equal(M.matchFigure('your love of Guatemalan naturals', tmFix), null, 'a figure the record cannot produce never becomes a door — this is the honesty gate on the way back');
assert.equal(M.matchFigure('', tmFix), null);
assert.equal(M.matchFigure('Washed', null), null, 'no taste model, no doors');
assert.equal(M.matchFigure('anything', { bar: {}, vector: {} }), null, 'an empty model resolves nothing and never throws');
ok('matchFigure refuses anything the record cannot open, and never throws doing it');

const tmLong = M.tasteModel({
  coffees: [{ id: 'x1', roaster: 'R', name: 'A', origin: { country: 'Kenya', process: 'Anaerobic washed' } }],
  cups: [{ id: 'y1', kind: 'bar', coffeeRef: 'x1', score: 9, descriptors: ['tea'] }], places: [],
});
assert.equal(M.matchFigure('Anaerobic washed 9.0/9, n=1', tmLong).value, 'Anaerobic washed', 'longest match wins — the specific process is never read as the generic one inside it');
assert.equal(M.matchFigure('a cleaner, sweeter cup', tmLong), null, '"tea" must not be found inside "cleaner" — figures match on whole words');
ok('matchFigure matches the longest whole-word figure, so a specific process is never flattened into a generic one');

// ---- reading a neighborhood off a place lookup (Phase 15) ----
// the five below are the verbatim address objects Nominatim returned for
// "Blue Bottle Coffee, Los Angeles" — the real shape this has to survive
assert.equal(M.hoodOf({ road: 'Ventura Freeway', suburb: 'Warner Center', city: 'Los Angeles' }), 'Warner Center');
assert.equal(M.hoodOf({ road: 'Mateo Street', quarter: 'Arts District', suburb: 'Downtown', city: 'Los Angeles' }), 'Arts District',
  'the finer name wins — a keeper says Arts District, not Downtown');
assert.equal(M.hoodOf({ suburb: 'Studio City Neighborhood Council District', city: 'Los Angeles' }), 'Studio City',
  'the administrative wording is trimmed, so the field reads the way a keeper would say it');
assert.equal(M.hoodOf({ quarter: 'Los Feliz Neighborhood Council District', suburb: 'Los Feliz' }), 'Los Feliz',
  'a council-district name that cleans to the same place as the suburb is no worse than it');
assert.equal(M.hoodOf({ neighbourhood: 'Kreuzberg', suburb: 'Friedrichshain-Kreuzberg' }), 'Kreuzberg');
ok('hoodOf reads the name a keeper would actually say off OSM\'s four inconsistent area keys');

assert.equal(M.hoodOf({ road: 'Only a road', city: 'Lisbon' }), '', 'no area stated is a blank, never a guess from the road or the city');
assert.equal(M.hoodOf(null), '');
assert.equal(M.hoodOf('not an object'), '');
assert.equal(M.cleanHood('  Downtown Council District '), 'Downtown');
ok('hoodOf states nothing where the lookup states nothing, and never throws');

const hits = [
  { lat: 34.10, lon: -118.28, hood: 'Los Feliz' },
  { lat: 34.04, lon: -118.23, hood: 'Arts District' },
  { lat: 34.101, lon: -118.281, hood: 'los feliz' },
];
assert.equal(M.dedupeHits(hits).length, 2, 'the same area twice is one café, not a choice to put to the keeper');
assert.deepEqual(M.dedupeHits(hits).map(h => h.hood), ['Los Feliz', 'Arts District']);
assert.equal(M.dedupeHits([{ lat: 1.00001, lon: 2.00001, hood: '' }, { lat: 1.00002, lon: 2.00002, hood: '' }]).length, 1,
  'with no area stated on either, the same corner is still the same café');
assert.deepEqual(M.dedupeHits([]), []);
assert.deepEqual(M.dedupeHits(null), []);
ok('dedupeHits collapses one café returned twice, so only a real branch ever becomes a question');

// ---- reading the real city off a place lookup — the city-field bug ----
// a café pasted into the door with a street address in the City field ends up
// with p.city holding that address forever unless the confirmed lookup can
// correct it — the same treatment Phase 15 already gave the neighborhood.
assert.equal(M.cityOf({ road: 'Mateo Street', quarter: 'Arts District', suburb: 'Downtown', city: 'Los Angeles' }), 'Los Angeles');
assert.equal(M.cityOf({ town: 'Ojai', county: 'Ventura County' }), 'Ojai', 'a town is a city here — Nominatim only states one of the two');
assert.equal(M.cityOf({ village: 'Little Compton' }), 'Little Compton');
assert.equal(M.cityOf({ county: 'Ventura County' }), '', 'a county alone is not a city — leave it blank rather than guess one level too coarse');
assert.equal(M.cityOf(null), '');
ok('cityOf reads the real city off a confirmed address, the same way hoodOf reads the neighborhood');


// ---- the city's own shape (Phase 18) ----
assert.deepEqual(M.convexHull([]), []);
assert.deepEqual(M.convexHull([{x:1,y:1}]), [{x:1,y:1}]);
assert.equal(M.convexHull([{x:0,y:0},{x:0,y:0},{x:1,y:1}]).length, 2, 'a duplicate point collapses before hulling');
{
  const square = [{x:0,y:0},{x:2,y:0},{x:2,y:2},{x:0,y:2},{x:1,y:1}]; // one point strictly inside
  const hull = M.convexHull(square);
  assert.equal(hull.length, 4, 'an interior point never survives onto the hull');
  assert.ok(!hull.some(p => p.x === 1 && p.y === 1));
}
{
  const line = [{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:3,y:0}]; // perfectly collinear
  const hull = M.convexHull(line);
  assert.ok(hull.length <= 2, 'collinear points never produce a fake 2D hull — the middle ones drop out');
}
ok('convexHull returns the true boundary — interior and collinear points never survive it');

{
  const path = M.roundedHullPath([{x:0,y:0},{x:10,y:0},{x:10,y:10},{x:0,y:10}]);
  assert.ok(path.startsWith('M ') && path.trim().endsWith('Z'), 'a valid path always opens with a move and closes formally');
  assert.ok(/Q /.test(path), 'every corner is softened with a curve, never left as a sharp joint');
}
assert.equal(M.roundedHullPath([{x:0,y:0},{x:1,y:1}]), '', 'fewer than three points has no corners to round — refuses rather than drawing a fake shape');
assert.equal(M.roundedHullPath([]), '');
ok('roundedHullPath softens every real corner and refuses a degenerate hull rather than faking one');

// a single café must still produce a real, closed, drawable shape — the
// whole point of inflating before hulling was never having a special case
let shape = M.cityShapePath([{lat: 34.10, lon: -118.29}]);
assert.ok(shape && shape.path.startsWith('M ') && shape.path.endsWith('Z'));
ok('cityShapePath draws a real closed shape for a single café, not a dot or a blank');

// two cafés, and a spread cluster — same pipeline, both real shapes
shape = M.cityShapePath([{lat: 34.10, lon: -118.29}, {lat: 34.04, lon: -118.23}]);
assert.ok(shape && shape.path.startsWith('M '));
shape = M.cityShapePath([
  {lat: 34.10, lon: -118.29}, {lat: 34.04, lon: -118.23}, {lat: 33.98, lon: -118.22},
  {lat: 34.06, lon: -118.40}, {lat: 34.02, lon: -118.30},
]);
assert.ok(shape && shape.path.startsWith('M '));
assert.ok(/^-?[\d.]+ -?[\d.]+ [\d.]+ [\d.]+$/.test(shape.viewBox), 'the viewBox is four plain numbers, always drawable as-is');
ok('cityShapePath handles two cafés and a spread cluster through the same pipeline, no special-casing either');

assert.equal(M.cityShapePath([]), null, 'no cafés, no shape — never a fabricated outline for a city with nothing on the record');
ok('cityShapePath refuses to draw anything for an empty city');

// dedupeHits must key on city too — a garbage city query can genuinely pull
// candidates from different real cities that happen to share a hood name
const crossCity = [
  { lat: 34.10, lon: -118.28, hood: 'Downtown', city: 'Los Angeles' },
  { lat: 37.77, lon: -122.42, hood: 'Downtown', city: 'San Francisco' },
];
assert.equal(M.dedupeHits(crossCity).length, 2, 'the same hood name in two different real cities is two branches, not one');
ok('dedupeHits keys on city as well as hood, so cross-city collisions never collapse into one');

// ---- reading a pin off a link the keeper already has (Phase 16) ----
// real shapes, not invented ones: a Google Maps place URL, an Apple Maps
// share link (both forms), OSM's own permalink, and a bare typed pair
const GMAPS='https://www.google.com/maps/place/Maru+Coffee/@34.1024,-118.2872,17z/data=!3m1!4b1!4m6!3m5!1s0x80c2c:0xabc!8m2!3d34.10245!4d-118.28715!16s%2Fg%2F11c';
let r=M.parseMapLink(GMAPS);
assert.ok(r&&Math.abs(r.lat-34.10245)<1e-9&&Math.abs(r.lon-(-118.28715))<1e-9,
  'the !3d/!4d marker (the actual pin) wins over @lat,lon (only the last viewport center)');
ok('parseMapLink prefers a Google Maps place URL\'s actual pin over its viewport center');

r=M.parseMapLink('https://www.google.com/maps/@34.1024,-118.2872,17z');
assert.ok(r&&r.lat===34.1024&&r.lon===-118.2872, 'falls back to @lat,lon when no !3d/!4d marker is present');
r=M.parseMapLink('https://maps.apple.com/?ll=34.101,-118.287&q=Maru+Coffee');
assert.deepEqual(r,{lat:34.101,lon:-118.287});
r=M.parseMapLink('https://maps.apple.com/place?coordinate=34.101,-118.287&name=Maru');
assert.deepEqual(r,{lat:34.101,lon:-118.287},'Apple\'s newer place-link shape uses coordinate=, not ll=');
r=M.parseMapLink('https://www.openstreetmap.org/#map=17/34.10245/-118.28715');
assert.ok(r&&r.lat===34.10245&&r.lon===-118.28715);
r=M.parseMapLink('34.101, -118.287');
assert.deepEqual(r,{lat:34.101,lon:-118.287},'a bare typed pair works with no link around it at all');
r=M.parseMapLink('  -34.6,  -58.4  ');
assert.deepEqual(r,{lat:-34.6,lon:-58.4},'negative latitude, negative longitude — both hemispheres');
ok('parseMapLink reads Google, Apple (both share-link shapes), OSM\'s own permalink, and a bare pair');

assert.equal(M.parseMapLink('https://maps.app.goo.gl/aBcD3fG'),null,
  'a shortened share link carries no coordinates in the text at all — nothing to read without following a redirect Carta will not make');
assert.equal(M.parseMapLink('Maru Coffee, 1936 Hillhurst Ave'),null,'a plain address is not a coordinate — this door reads pins, not names');
assert.equal(M.parseMapLink('@200,-118.28'),null,'a latitude outside ±90 is not a real coordinate, whatever it looks like');
assert.equal(M.parseMapLink(''),null);
assert.equal(M.parseMapLink(null),null);
ok('parseMapLink refuses what it cannot actually read as a coordinate, and never throws doing it');

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

// ---- searching for a coffee's own origin facts (ROADMAP.md Phase 22) ----
const searchPrompt = M.cfSearchPrompt({ roaster: "Sey's", coffee: 'Ethiopia Gedeb', country: 'Ethiopia' }, ['region', 'process']);
assert.ok(searchPrompt.includes('Ethiopia Gedeb') && searchPrompt.includes("Sey's"), 'the prompt states what the keeper already typed');
assert.ok(searchPrompt.includes('region, process'), 'the prompt names exactly the blank fields asked for, nothing else');
assert.ok(/never guess/i.test(searchPrompt), 'the honesty gate is stated in the prompt itself, not left to the model to assume');
ok("cfSearchPrompt states what's already known and asks for only the fields still blank");

let found = M.parseCfSearch('{"region":{"value":"Gedeb, Yirgacheffe","source":"the roaster\'s own product page"},"process":{"value":"Washed"}}', ['region', 'process']);
assert.equal(found.region.value, 'Gedeb, Yirgacheffe');
assert.equal(found.region.source, "the roaster's own product page");
ok('parseCfSearch reads a verified field with its source straight');

found = M.parseCfSearch('{"region":{"value":"Gedeb"},"altitude":{"value":"1,900m"}}', ['region', 'process']);
assert.ok(!found.altitude, 'a field the caller never asked for is dropped even if the model volunteers it');
assert.ok(found.region, 'a field that was asked for still comes through');
ok('parseCfSearch only ever fills the fields it was told were blank — never a field outside that list');

found = M.parseCfSearch('{"region":"Gedeb","process":{"value":""}}', ['region', 'process']);
assert.deepEqual(found, {}, 'neither a bare string nor an empty value counts as a verified field');
ok('parseCfSearch refuses a field with no real value or the wrong shape, rather than guessing at it');

found = M.parseCfSearch("I couldn't verify anything about this coffee.", ['region']);
assert.deepEqual(found, {});
ok('parseCfSearch degrades to nothing, never throws, on a non-JSON answer — never invents a fact');

// ---- parseVisualizerShot (ROADMAP.md Phases 24-25): a real shot payload's shape ----
let shot = M.parseVisualizerShot({
  duration: 25.649, bean_weight: '18.0', drink_weight: '36.7', grinder_setting: '135.0',
  bean_brand: 'District Roasters', bean_type: 'Ethiopia | Yirgacheffe Gargari Gutity Natural',
  roast_date: '2026-07-01T00:00:00Z', roast_level: 'Medium Light', grinder_model: 'Niche Zero',
});
assert.equal(shot.dose, 18);
assert.equal(shot.water, 36.7);
assert.equal(shot.time, 26, 'duration rounds to the nearest second, the unit timeSec is stored in');
assert.equal(shot.grind, 135);
assert.equal(shot.roaster, 'District Roasters');
assert.equal(shot.coffeeName, 'Ethiopia | Yirgacheffe Gargari Gutity Natural');
assert.equal(shot.roastDate, '2026-07-01', 'a stray timestamp is trimmed to the leading date, never stored whole');
assert.equal(shot.roastLevel, 'Medium-light');
assert.equal(shot.grinderModel, 'Niche Zero');
assert.equal(shot.label, 'District Roasters — Ethiopia | Yirgacheffe Gargari Gutity Natural');
ok("parseVisualizerShot reads a real shot's numbers and its coffee's own identity fields alike");

shot = M.parseVisualizerShot({ duration: 20, bean_weight: '18.0', drink_weight: '36.0' });
assert.equal(shot.label, 'Untitled shot', 'a shot with no stated coffee is labeled honestly, never blank');
assert.equal(shot.roaster, '');
assert.equal(shot.coffeeName, '');
ok('parseVisualizerShot falls back to an honest label when the shot names no coffee');

shot = M.parseVisualizerShot({ bean_weight: '', grinder_setting: null, duration: 'not a number', roast_date: 'not a date' });
assert.equal(shot.dose, null);
assert.equal(shot.grind, null);
assert.equal(shot.time, null, 'an unparseable duration is null, never NaN or a guessed number');
assert.equal(shot.roastDate, '', 'a roast_date with no leading YYYY-MM-DD is left blank, never guessed');
ok('parseVisualizerShot refuses to guess a field the shot left blank or unparseable');

assert.deepEqual(M.parseVisualizerShot(), { method: '', pours: [], dose: null, water: null,
  time: null, grind: null, roaster: '', coffeeName: '', roastDate: '', roastLevel: '',
  grinderModel: '', timeExact: null, tempC: null, preinfusionSec: null, preinfusionBar: null,
  machine: '', at: null, brewer: '', profile: '', curve: null, label: 'Untitled shot' });
ok('parseVisualizerShot never throws on a missing payload');

// ---- the plate (ROADMAP.md Phase 26): platePaths/shotFigures/shotCurve/shotAt ----
const curvedPayload = {
  espresso_elapsed: [0, 1, 2, 3, 4], espresso_pressure: [0, 4, 9, 8.5, 6],
  espresso_flow: [0, 0.5, 1.8, 2, 1.9], espresso_weight: [0, 0, 5, 20, 36],
};
const curve = M.shotCurve(curvedPayload);
assert.ok(curve && curve.t.length === 5 && curve.p.length === 5, 'a shot with real series reads a curve of matching-length arrays');
assert.equal(curve.p[2], 9);
assert.equal(curve.f[2], 1.8);
assert.equal(curve.w[4], 36);
ok('shotCurve reads pressure, flow and weight against elapsed seconds when the file carries them');

assert.equal(M.shotCurve({}), null, 'a shot with no series at all reads no curve, not an empty one');
ok('shotCurve refuses to fabricate a curve out of a payload that carries none');

const msCurve = M.shotCurve({ espresso_elapsed: [0, 700, 1400], espresso_pressure: [0, 9, 6] });
assert.ok(msCurve.t[1] < 1, 'elapsed stated in milliseconds (a "shot" over 600s) is converted to seconds, never trusted raw');
ok('shotCurve normalizes millisecond-elapsed series down to seconds');

// the real shape (confirmed against a live shot, v7.28.2): elapsed sits at
// the top of the response, the value series live nested under `data` — a
// split no fixture until now actually exercised, and the split a flat
// payload's own shape can't catch even by accident
const splitPayload = {
  timeframe: ['0.067', '0.134', '0.200', '0.277', '0.334'],
  data: { espresso_pressure: ['0.0', '2.1', '9.0', '8.6', '6.0'],
    espresso_weight: ['0.0', '0.0', '5.0', '20.0', '36.0'], espresso_flow: null },
};
const splitCurve = M.shotCurve(splitPayload);
assert.ok(splitCurve, 'a shot whose elapsed series is top-level and whose value series are nested under `data` must still read a curve');
assert.equal(splitCurve.p[2], 9);
assert.equal(splitCurve.w[4], 36);
assert.equal(splitCurve.f, null, 'a null value series (no flow sensor on this shot) reads null, not a crash');
ok('shotCurve reads the elapsed series and the value series from different containers when the file splits them, exactly as Visualizer itself does');

// a machine with no flow sensor: Visualizer computes flow off the scale
// instead (confirmed by integrating a live shot's own espresso_flow_weight
// against its final cup weight, v7.28.3) — read as a fallback, not left
// blank, and its own natural way of running a few samples short of the
// clock must draw a shorter line rather than being dropped whole
const noSensorPayload = {
  timeframe: ['0.0', '1.0', '2.0', '3.0', '4.0', '5.0'],
  data: { espresso_pressure: ['0.0', '4.0', '9.0', '8.5', '6.0', '5.0'], espresso_flow: null,
    espresso_flow_weight: ['0.0', '0.5', '1.8', '2.0'] },
};
const noSensorCurve = M.shotCurve(noSensorPayload);
assert.ok(noSensorCurve.f, 'espresso_flow_weight is read as flow when the sensor-based key is null');
assert.equal(noSensorCurve.f.length, 4, 'a flow series that runs shorter than the clock is kept at its own length, not dropped for the mismatch');
assert.equal(noSensorCurve.f[2], 1.8);
assert.equal(noSensorCurve.p.length, 6, 'pressure, which does cover the full clock, is untouched by flow running short');
ok('shotCurve falls back to espresso_flow_weight for flow, and keeps a shorter-than-the-clock series rather than rejecting it');

const withCurve = { curve, dose: 18, water: null, timeExact: null, time: null };
let at = M.shotAt(withCurve, 2);
assert.equal(at.bar, 9, 'shotAt reads the exact sample at a scrub position on the curve');
ok('shotAt reads the curve sample nearest a given elapsed second');

assert.equal(M.shotAt({ curve: null }, 2), null, 'shotAt on a curveless shot refuses to fabricate a reading');
ok('shotAt never throws or fakes a reading on a null curve');

const figs = M.shotFigures(withCurve);
assert.equal(figs.peak, 9, 'the peak figure is read off the curve itself, not a stated scalar');
assert.equal(figs.yield, 36, 'yield falls back to the curve\'s last weight sample when the shot states no water figure');
assert.equal(figs.dose, 18);
assert.ok(Math.abs(figs.ratio - 36 / 18) < 1e-9);
ok('shotFigures derives peak/yield/ratio off the curve where the shot itself states no scalar');

assert.deepEqual(M.shotFigures({ curve: null, dose: null, water: null, timeExact: null, time: null }),
  { method: 'espresso', peak: null, peakAt: null, total: null, dose: null, yield: null, ratio: null });
ok('shotFigures reads every figure null rather than guessed when neither the shot nor a curve states it');

const paths = M.platePaths(withCurve, { w: 200, h: 100, base: 90, top: 10 });
assert.ok(paths && typeof paths.pressure === 'string' && paths.pressure.length > 0);
ok('platePaths draws a real path string for a curve, at whatever box it is given');

assert.equal(M.platePaths({ curve: null }, { w: 200, h: 100, base: 90, top: 10 }), null,
  'a curveless shot draws no plate at all, rather than an empty one');
ok('platePaths refuses to draw anything for a shot with no curve');

// ---- normalizeRoastLevel (ROADMAP.md Phase 25): Visualizer's own field needs no "roast" adjacency ----
assert.equal(M.normalizeRoastLevel('Medium'), 'Medium');
assert.equal(M.normalizeRoastLevel('medium-light'), 'Medium-light');
assert.equal(M.normalizeRoastLevel('Medium Dark'), 'Medium-dark');
assert.equal(M.normalizeRoastLevel('City+'), '', 'a roast-shop term Carta\'s own scale has no word for is left blank, never guessed');
assert.equal(M.normalizeRoastLevel(''), '');
ok("normalizeRoastLevel reads Visualizer's own roast_level onto Carta's five words, or leaves it blank");

// ---- matchSetupByGrinder (ROADMAP.md Phase 25, widened v7.34.2): silent only on an exact grinder+brewer fold match ----
const setups = [{ id: 's1', grinder: 'Niche Zero' }, { id: 's2', grinder: 'Baratza Encore' }];
assert.equal(M.matchSetupByGrinder(setups, 'niche zero'), 's1', 'case/diacritics-only difference still joins silently — a brewer-less Setup joins on the grinder alone');
assert.equal(M.matchSetupByGrinder(setups, 'Niche Zeroo'), null, 'a near-but-not-exact grinder name is never silently assumed');
assert.equal(M.matchSetupByGrinder(setups, ''), null);
assert.equal(M.matchSetupByGrinder([], 'Niche Zero'), null);
const gearSetups = [{ id: 's1', grinder: 'Niche Zero', brewer: 'Slayer' }];
assert.equal(M.matchSetupByGrinder(gearSetups, 'Niche Zero', 'Slayer'), 's1', 'same grinder and same brewer — still joins silently');
assert.equal(M.matchSetupByGrinder(gearSetups, 'Niche Zero', 'Kalita Wave 185'), null, 'same grinder, a different stated brewer — no longer the same Setup, the collision this widening fixes');
assert.equal(M.matchSetupByGrinder(setups, 'Niche Zero', 'Kalita Wave 185'), null, 'a Setup that never named a brewer no longer silently absorbs every brewer sharing its grinder');
ok("matchSetupByGrinder joins a Setup only on an exact grinder-and-brewer match, and never invents a join for less");

// ---- brewerOf (Phase 26 v7.31.1): whichever of the two fields a shot actually filled in ----
assert.equal(M.brewerOf({ brewer: 'Kalita Wave 185', machine: '' }), 'Kalita Wave 185');
assert.equal(M.brewerOf({ brewer: '', machine: 'Slayer' }), 'Slayer', 'a writer with no dedicated brewer field, read off machine instead');
assert.equal(M.brewerOf({ brewer: '', machine: '' }), '');
assert.equal(M.brewerOf(null), '');
ok("brewerOf reads whichever of brewer or machine a shot's own file actually stated");

// ---- setupCandidatesFromShots (Phase 26 amendment, v7.32.0): what a keeper's own shots say a Setup could be ----
const knownSetups = [{ id: 's1', grinder: 'Niche Zero' }];
const shots = [
  { grinderModel: 'Niche Zero', brewer: '', machine: '' },                    // already on the record — excluded
  { grinderModel: 'EG-1', brewer: '', machine: 'Slayer' },                    // brewer read off machine
  { grinderModel: 'eg-1', brewer: '', machine: 'slayer' },                    // same pair, fold-only difference — deduped
  { grinderModel: '', brewer: 'Kalita Wave 185', machine: '' },               // brewer-only, no grinder at all
  { grinderModel: '', brewer: '', machine: '' },                              // nothing stated — not a candidate
];
const candidates = M.setupCandidatesFromShots(shots, knownSetups);
assert.equal(candidates.length, 2, 'the Setup already on the record and the empty shot are both left out');
assert.deepEqual(candidates[0], { grinder: 'EG-1', brewer: 'Slayer', name: 'EG-1 · Slayer' });
assert.deepEqual(candidates[1], { grinder: '', brewer: 'Kalita Wave 185', name: 'Kalita Wave 185' });
assert.equal(M.setupCandidatesFromShots([], knownSetups).length, 0);
assert.equal(M.setupCandidatesFromShots(shots, []).length, 3, 'with no Setup on the record yet, the Niche Zero shot candidates too');
// v7.34.2: a shot sharing a grinder with an existing Setup but naming a different
// brewer used to be silently excluded here too (matchSetupByGrinder matched on the
// grinder alone) — the exact collision a keeper hit when a pour-over shared a burr
// with their legacy espresso Setup. It now correctly still candidates.
const espressoSetup = [{ id: 's1', grinder: 'Niche Zero', brewer: 'Slayer' }];
const pourOverOnSameGrinder = [{ grinderModel: 'Niche Zero', brewer: 'Kalita Wave 185', machine: '' }];
const stillCandidates = M.setupCandidatesFromShots(pourOverOnSameGrinder, espressoSetup);
assert.equal(stillCandidates.length, 1, 'a different brewer on a shared grinder is a genuinely new Setup, not a repeat');
assert.deepEqual(stillCandidates[0], { grinder: 'Niche Zero', brewer: 'Kalita Wave 185', name: 'Niche Zero · Kalita Wave 185' });
ok("setupCandidatesFromShots reads a grinder-and-brewer pair off recent shots, deduped and never repeating a Setup already on the record");

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

// ---- originPin / meanPin / namesBack: where a green actually grew ----
assert.deepEqual(M.originPin({ lat: 6.15, lon: 38.2 }), { lat: 6.15, lon: 38.2 });
assert.equal(M.originPin({ country: 'Ethiopia' }), null, 'an origin with no coordinate is unplaced, not 0,0');
assert.equal(M.originPin({}), null);
assert.equal(M.originPin(undefined), null, 'never throws on a coffee with no origin at all');
assert.equal(M.originPin({ lat: 'x', lon: 3 }), null, 'a non-numeric coordinate is no coordinate');
assert.equal(M.originPin({ lat: 91, lon: 0 }), null, 'out of range is refused rather than drawn off the frame');
assert.equal(M.originPin({ lat: 0, lon: 0 }), null, 'null island is the shape of a bug, never a farm');
ok('originPin states a position only where the record actually holds one — every other case is unplaced');

assert.deepEqual(M.meanPin([{ lat: 2, lon: 4 }, { lat: 4, lon: 8 }]), { lat: 3, lon: 6 });
assert.equal(M.meanPin([]), null, 'a region with no placed farm has no position — it is listed, never plotted');
assert.equal(M.meanPin([null, null]), null, 'unplaced farms drop out rather than averaging as zero');
assert.deepEqual(M.meanPin([null, { lat: 5, lon: 5 }]), { lat: 5, lon: 5 });
ok('meanPin stands a region on its own placed farms, and nowhere at all when it has none');

assert.equal(M.namesBack({ name: 'Konga' }, 'Konga'), true);
assert.equal(M.namesBack({ name: 'Konga Coffee Washing Station' }, 'Konga'), true, 'the lookup naming more than was asked still names it back');
assert.equal(M.namesBack({ name: 'Finca El Injerto' }, 'El Injerto'), true);
assert.equal(M.namesBack({ name: 'Yirgacheffe' }, 'Konga'), false, 'the region a farm sits in is NOT the farm — this is the whole gate');
assert.equal(M.namesBack({ name: 'Huila' }, 'El Paraiso'), false);
assert.equal(M.namesBack({ name: '' }, 'Konga'), false, 'a hit with no name confirms nothing');
assert.equal(M.namesBack(null, 'Konga'), false, 'never throws on a missing hit');
assert.equal(M.namesBack({ name: 'Konga' }, ''), false);
ok('namesBack refuses a lookup that answered with the region instead of the farm — Carta never pins a hallucination');

// ---- shotTempGoal (Phase 26 patch): the water, as the machine was told to
// hold it. Visualizer's own page states a "basket temp goal"; the file states
// it as a series beside pressure rather than as a scalar, which is why the
// plate's ledger read `unread` for the water on every shot ever opened. A goal
// is a stated setting, so reading it is not the inference the honesty gate
// forbids — but a goal that genuinely moves through the shot states no single
// figure, and that case still reads `unread`.
assert.equal(M.shotTempGoal({ espresso_temperature_goal: 92.5 }), 92.5, 'a scalar goal is taken as stated');
assert.equal(M.shotTempGoal({ data: { espresso_temperature_goal: [0, 92.5, 92.5, 92.4, 92.6, 0] } }), 92.5,
  "a flat goal series under `data` — the shape Visualizer's own file uses — states one figure");
assert.equal(M.shotTempGoal({ espresso_temperature_basket: [93.1, 93.0, 93.2, 93.1] }), 93.1,
  'the measured basket, where the goal itself was never written');
assert.equal(M.shotTempGoal({ data: { espresso_temperature_goal: [80, 84, 88, 92, 94] } }), null,
  'a goal that ramps through the shot names no single temperature — unread, not an average');
assert.equal(M.shotTempGoal({ espresso_temperature_goal: [92.5, 92.5] }), null,
  'two samples is not a series to read a setting off');
assert.equal(M.shotTempGoal({ espresso_temperature_goal: 0 }), null, "a sensor's zero is not a brew temperature");
assert.equal(M.shotTempGoal({ espresso_temperature_goal: 198 }), null, 'a Fahrenheit reading is refused rather than stored as °C');
assert.equal(M.shotTempGoal({}), null);
assert.equal(M.shotTempGoal(null), null, 'never throws on a payload that isn\'t one');
ok('shotTempGoal reads the basket temp goal Visualizer states, and refuses every reading that would be a guess');

assert.equal(M.parseVisualizerShot({ duration: 20, data: { espresso_temperature_goal: [92, 92, 92, 92] } }).tempC, 92,
  'the shot carries the goal through as its own tempC');
assert.equal(M.parseVisualizerShot({ duration: 20 }).tempC, null, 'a file silent on temperature still reads unread');
ok('parseVisualizerShot carries the stated water temperature onto the shot, or leaves it unread');

// ---- the second method (SPEC-phase26-pourover.md §8): a gravimetric file has
// no pressure array at all, and that absence is what states the method. Every
// figure below is read off the pours rather than assumed from the clock.
const pourPayload = (() => {
  const P = [{s:0,e:8,a:0,b:45},{s:42,e:62,a:45,b:130},{s:80,e:96,a:130,b:190},{s:116,e:132,a:190,b:250}];
  const at = t => { let w = 0; for (const p of P) { if (t >= p.e) w = p.b; else if (t > p.s) { const u=(t-p.s)/(p.e-p.s); w = p.a+(p.b-p.a)*u*u*(3-2*u); break } } return w };
  const t = [], wi = [], cup = [];
  let c = 0;
  for (let i = 0; i <= 1840; i++) {
    const x = +(i/10).toFixed(1);
    t.push(x); wi.push(+at(x).toFixed(2));
    if (x > 26) c += (Math.max(0, at(x) - 31.5) - c) * 0.01;
    cup.push(+c.toFixed(2));
  }
  return { duration: 184, bean_weight: '15.0', drink_weight: '218', timeframe: t,
    data: { espresso_water_dispensed: wi, espresso_weight: cup } };
})();

const pourCurve = M.shotCurve(pourPayload);
assert.equal(pourCurve.method, 'pourover', 'no pressure array means a scale wrote this, and a scale means a filter brew');
assert.equal(pourCurve.p, null);
assert.ok(pourCurve.wIn && pourCurve.wIn.length > 100, 'the water going in is the series the staircase is drawn from');
assert.equal(M.shotCurve({ espresso_elapsed: [0,1,2], espresso_pressure: [0,9,6] }).method, 'espresso',
  'a machine that states pressure is still an espresso, unchanged by any of this');
ok('shotCurve reads the method off the file itself — the absence of pressure, never a brewer\'s name');

const pours = M.shotPours(pourCurve);
assert.equal(pours.length, 4, 'four pours, and the flat runs between them are not pours');
assert.equal(Math.round(pours[0].added), 45);
assert.equal(Math.round(pours[1].added), 85);
assert.ok(pours[0].at <= 0.5, 'the bloom starts when the water actually starts moving, which reads 0:00');
assert.equal(M.mmss(pours[0].at), '0:00');
assert.equal(Math.round(pours[1].at), 42);
assert.ok(Math.abs(pours[0].then - 34) <= 1.5, 'the wait after the bloom is the gap to the next pour');
assert.ok(Math.abs(pours[3].then - 52) <= 1.5, 'the last wait is the drawdown — nothing was added after it');
ok('shotPours reads a staircase back into the pours it was made of, and the waits between them');

const pourFigs = M.shotFigures({ curve: pourCurve, dose: 15, water: 250, timeExact: 184 });
assert.equal(pourFigs.method, 'pourover');
assert.ok(Math.abs(pourFigs.bloom - 42) <= 1, 'the bloom is the whole bloom phase — first drop to second pour, not the pour that starts it');
assert.ok(Math.abs(pourFigs.drawdown - 52) <= 1.5);
assert.equal(pourFigs.total, 184);
assert.equal(pourFigs.ratio.toFixed(1), '16.7', 'a filter brew is argued in the water it took, not what landed in the cup');
assert.equal(pourFigs.peak, undefined, 'there is no peak bar on a brew with no pressure, and none is invented');
ok('shotFigures returns the pour-over arm — bloom, ratio, drawdown, total — off the pours themselves');

// the two the spec names as the ones that would fail invisibly
const onePourCurve = M.shotCurve({ timeframe: [0,2,4,6,8,10,20,40,60,80],
  data: { espresso_water_dispensed: [0,40,90,140,190,250,250,250,250,250] } });
const onePour = M.shotPours(onePourCurve);
assert.equal(onePour.length, 1, 'a brew poured in one go is one pour, not one pour and a phantom');
assert.equal(M.shotFigures({ curve: onePourCurve, dose: 15, timeExact: 80 }).bloom, null,
  'no second pour means no bloom phase to state — null, never the one wait it does have');
assert.ok(M.shotFigures({ curve: onePourCurve, dose: 15, timeExact: 80 }).drawdown > 60,
  'its one wait is still the drawdown, because nothing was added after it');
ok('shotFigures states no bloom on a brew poured in one go rather than calling its only wait one');

// a file that stops the moment the last pour ends states a drawdown of nothing.
// That is what the file says; it is not detectable as truncated from the file
// alone, and inventing an ending for it is what `unread` exists to prevent.
const cutCurve = M.shotCurve({ timeframe: [0,2,4,6,40,42,44,46],
  data: { espresso_water_dispensed: [0,20,45,45,45,140,250,250] } });
const cut = M.shotPours(cutCurve);
assert.equal(cut[cut.length-1].then, 2,
  'a file ending two seconds after its last pour states a two-second drawdown — what it recorded, not what a bed would really have taken');
ok('shotPours reports a truncated drawdown as the file stated it rather than extrapolating an ending');

const pourPlate = M.platePaths({ curve: pourCurve }, { w: 390, h: 176, base: 166, top: 18, topBand: 20 });
assert.equal(pourPlate.method, 'pourover');
assert.equal(pourPlate.pressure, undefined, 'no pressure line, because there is no pressure');
assert.ok(pourPlate.water && pourPlate.water.startsWith('M'), 'the staircase is the path drawn');
assert.equal(pourPlate.bands.length, 4, 'one band per pour; the gaps are drawn by being left empty');
assert.equal(pourPlate.bands[0].label, 'BLOOM 45');
assert.equal(pourPlate.bands[1].label, '+85');
assert.deepEqual(pourPlate.grid.map(g => g.g), [50, 150, 250], 'the grid is grams off the water actually added, not an invented scale');
assert.deepEqual(pourPlate.ticks.map(t => t.label), ['1:00', '2:00', '3:00'], 'a three-minute brew is ticked in minutes');
assert.equal(M.platePaths({ curve: null }, { w: 390, h: 176, base: 166, top: 18 }), null);
ok('platePaths draws the pour-over arm — staircase, bands, gram grid, minute ticks — and refuses a brew with no curve');

assert.equal(M.shotPhase(pours, 20, 184), 'blooming');
assert.equal(M.shotPhase(pours, 50, 184), 'pouring pour 2');
assert.equal(M.shotPhase(pours, 104, 184), 'drawing down', 'every gap after the bloom is the bed letting go, not only the last');
assert.equal(M.shotPhase(pours, 160, 184), 'drawing down');
assert.equal(M.shotPhase(pours, 184, 184), 'in the cup');
assert.equal(M.shotPhase([], 10, 100), '', 'a brew with no pours names no phase rather than guessing one');
const pourAt = M.shotAt({ curve: pourCurve }, 50);
assert.equal(pourAt.phase, 'pouring pour 2');
assert.equal(pourAt.bar, null, 'a scrub over a filter brew reads no pressure, because none was recorded');
ok('shotAt names what was happening at a given second, read off the pours rather than the clock');

const pourShot = M.parseVisualizerShot(pourPayload);
assert.equal(pourShot.method, 'pourover');
assert.equal(pourShot.pours.length, 4);
assert.equal(pourShot.water, 250, "a filter brew's yield is the water it took — drink_weight is what landed in the cup, and they differ");
assert.equal(M.shotMethod({ method: 'pourover' }), 'pourover');
assert.equal(M.shotMethod({}), 'espresso', 'an unstated method is an espresso, which is what every brew before this phase was');
ok('parseVisualizerShot reads a gravimetric file into the pour-over arm, yield included');

assert.equal(M.mmss(184), '3:04');
assert.equal(M.mmss(42), '0:42');
assert.equal(M.mmss(0), '0:00');
ok('mmss states a filter brew\'s minutes the way a filter brew is actually read');

// ---- v7.31.1: the method was being read off the wrong thing. Visualizer
// normalises every upload into one DE1-shaped schema, so a brew logged from a
// scale arrives CARRYING an espresso_pressure series that is flat at zero —
// and "the key exists" was being taken for "a machine wrote this". Reported
// from a real ledger: a 3:20 Kalita brew filed as an espresso, its water null.
const flatPressure = (() => {
  const P = [{s:0,e:9,a:0,b:45},{s:38,e:62,a:45,b:120},{s:88,e:110,a:120,b:180},{s:132,e:152,a:180,b:225}];
  const at = t => { let w=0; for (const p of P) { if (t>=p.e) w=p.b; else if (t>p.s) { const u=(t-p.s)/(p.e-p.s); w=p.a+(p.b-p.a)*u*u*(3-2*u); break } } return w };
  const t=[], pres=[], wt=[];
  for (let i=0;i<=2000;i++){ const x=+(i/10).toFixed(1); t.push(x); pres.push(0); wt.push(+(at(x)+Math.sin(x*7)*0.05).toFixed(2)) }
  return { duration: 200, bean_weight: '14.9', bean_brand: 'Sey', bean_type: 'Ethiopia Gedeb washed',
    grinder_model: 'Lido OG', grinder_setting: '1450', machine: 'Kalita Wave 185',
    timeframe: t, data: { espresso_pressure: pres, espresso_weight: wt } };
})();

const flatCurve = M.shotCurve(flatPressure);
assert.equal(flatCurve.method, 'pourover',
  'a pressure series that never rose is not an espresso, however present the key is');
assert.equal(flatCurve.p, null, 'and a flat-zero pressure line is dropped rather than inked along the axis');
assert.ok(flatCurve.wIn && flatCurve.wIn.length > 100, "the scale's own weight becomes the staircase when nothing else states the water");
ok('shotCurve reads the method off whether pressure was APPLIED, not off whether a pressure key exists');

// a lever pulls at five bar, not nine — the threshold has to clear it
const lever = M.shotCurve({ timeframe: [0,1,2,3,4,5,6], data: { espresso_pressure: [0,3.2,5,5,4.4,3,2.1] } });
assert.equal(lever.method, 'espresso', "a lever's gentler pull is still an espresso");
const trickle = M.shotCurve({ timeframe: [0,1,2,3,4,5,6], data: { espresso_pressure: [0,0.3,0.8,1.1,0.9,0.4,0.1], espresso_weight: [0,10,40,90,150,200,225] } });
assert.equal(trickle.method, 'pourover', 'a series that peaks under two bar never had pressure applied to it');
ok('the pressure threshold clears a lever shot and still refuses a trickle');

const flatShot = M.parseVisualizerShot(flatPressure);
assert.equal(flatShot.method, 'pourover');
assert.ok(Math.abs(flatShot.water - 225) <= 0.2,
  'the water is the high-water mark of the scale (225.1 here — its own noise crest), not its last wobbling sample');
assert.equal(flatShot.machine, 'Kalita Wave 185', 'the machine is a field Visualizer states and Carta now reads');
assert.equal(flatShot.pours.length, 4);
assert.equal(M.shotFigures(flatShot).ratio.toFixed(1), '15.1');
ok('parseVisualizerShot recovers the real reported case — method, water and machine all read back');

// ---- pre-infusion, off the curve (v7.31.1). Visualizer states `preinfusion`
// on some files and not others; the pressure line has always said it anyway.
const piProfile = (() => {
  const bar = t => {
    if (t < 0.6) return 0.4*t/0.6;
    if (t < 4.2) return 0.4+2.5*Math.pow((t-0.6)/3.6, 0.75);
    if (t < 5.4) return 2.9-0.2*Math.sin(Math.PI*(t-4.2)/1.2);
    if (t < 8.6) return 2.9+6.22*Math.pow((t-5.4)/3.2, 0.85);
    if (t < 24) return 9.12-3.07*Math.pow((t-8.6)/15.4, 1.15);
    if (t < 27.4) return 6.05-1.45*((t-24)/3.4);
    return Math.max(0, 4.6*(1-(t-27.4)/0.7));
  };
  const t=[], p=[];
  for (let i=0;i<=274;i++){ const x=i/10; t.push(x); p.push(+bar(x).toFixed(2)) }
  return { timeframe: t, data: { espresso_pressure: p } };
})();
assert.deepEqual(M.shotPreinfusion(M.shotCurve(piProfile)), { sec: 4.2, bar: 2.9 },
  "the design board states 4.2 s at 2.9 bar for this profile, and the curve alone says the same");

const straight = { timeframe: [], data: { espresso_pressure: [] } };
for (let i=0;i<=274;i++){ straight.timeframe.push(i/10); straight.data.espresso_pressure.push(+Math.min(9, i/10*3).toFixed(2)) }
assert.equal(M.shotPreinfusion(M.shotCurve(straight)), null,
  'a profile that ramps straight to nine bar has no pre-infusion, and null is not zero');

const noisy = { timeframe: [], data: { espresso_pressure: [] } };
for (let i=0;i<=274;i++){ const x=i/10; noisy.timeframe.push(x); noisy.data.espresso_pressure.push(+Math.max(0, Math.min(9, x*3+Math.sin(x*40)*0.08)).toFixed(2)) }
assert.equal(M.shotPreinfusion(M.shotCurve(noisy)), null, 'noise on the way up is not a hold');
assert.equal(M.shotPreinfusion(flatCurve), null, 'a brew with no pressure has no pre-infusion to state');
assert.equal(M.shotPreinfusion(null), null);
ok('shotPreinfusion reads the plateau off the pressure line, and states nothing where there is no plateau');

const piShot = M.parseVisualizerShot(piProfile);
assert.equal(piShot.preinfusionSec, 4.2);
assert.equal(piShot.preinfusionBar, 2.9);
assert.equal(M.parseVisualizerShot({ ...piProfile, preinfusion: '3.5' }).preinfusionSec, 3.5,
  'a figure the file states outright still wins over the one read off the curve');
ok('parseVisualizerShot states pre-infusion with the pressure it held, preferring the file where it says so');

// ---- doorParse (v7.31.2). Rewritten from a real ledger: a keeper pasted a
// bag four times in three minutes, leaving a half-finished coffee behind on
// each attempt, because the reader never looked at newlines — and a pasted bag
// is multi-line by definition. Two of those coffees ended up named after the
// bag's own labels ("Country: Colombia", "Processing: Infused co-ferment").
const bagPaste = 'Necessity Coffee\nColombia Risarada Infused co-ferment sequential washed\nCountry: Colombia\nProcessing: Infused co-ferment';
let bag = M.doorParse(bagPaste);
assert.equal(bag.roaster, 'Necessity Coffee', 'the first unlabelled line of a bag is whose it is');
assert.equal(bag.name, 'Colombia Risarada Infused co-ferment sequential washed');
assert.deepEqual(bag.o, { country: 'Colombia', process: 'Infused co-ferment' },
  "the bag's own labelled lines fill the fields the confirm step has always had");
ok('doorParse reads a multi-line bag into a roaster, a coffee and the origin it stated — the exact reported paste');

// the app's own placeholder states the convention: the dash divides, and the
// comma belongs to the name. Splitting on the comma was only ever rejoined
// afterwards, so it bought nothing and cost this:
assert.deepEqual(pick(M.doorParse("Sey's — Ethiopia Gedeb, washed")), { roaster: "Sey's", name: 'Ethiopia Gedeb, washed' });
assert.deepEqual(pick(M.doorParse('Ethiopia Gedeb, washed')), { roaster: '', name: 'Ethiopia Gedeb, washed' },
  'a line with no roaster in it files no roaster — the comma is part of the name, not a divider');
assert.deepEqual(pick(M.doorParse('Sey, Coffee Roasters — Ethiopia Gedeb')), { roaster: 'Sey, Coffee Roasters', name: 'Ethiopia Gedeb' },
  "a roaster with a comma in its own name survives the dash");
assert.deepEqual(pick(M.doorParse('Onyx — Geisha Sun-Dried')), { roaster: 'Onyx', name: 'Geisha Sun-Dried' },
  'a hyphen inside a word is not a divider — only a spaced dash is');
ok('doorParse divides on the dash and leaves the comma to the name, as the door\'s own placeholder says');

assert.deepEqual(pick(M.doorParse('Ethiopia Gedeb\nWashed\nRoaster: Sey')), { roaster: 'Sey', name: 'Ethiopia Gedeb, Washed' },
  'where a label already named the roaster, every loose line belongs to the coffee');
assert.deepEqual(pick(M.doorParse("Sey's — Ethiopia Gedeb\nWashed")), { roaster: "Sey's", name: 'Ethiopia Gedeb, Washed' },
  'a dash on the first line still divides it, and the lines under it read on');
ok('doorParse never lets a labelled roaster swallow the coffee\'s own name');

assert.equal(M.doorParse('Necessity Coffee\nGesha\nTasting notes: peach, jasmine').name, 'Gesha, Tasting notes: peach, jasmine',
  'a label Carta does not know stays an ordinary line rather than inventing a field for itself');
assert.deepEqual(M.doorParse('Country: Colombia').o, { country: 'Colombia' });
assert.equal(M.doorParse('Country: Colombia').name, '', 'a paste that named no coffee does not invent one');
assert.deepEqual(pick(M.doorParse('Saint Frank Honduras DRD Geisha')), { roaster: '', name: 'Saint Frank Honduras DRD Geisha' },
  'one bare line is a coffee with no roaster stated, which is what it honestly is');
assert.deepEqual(pick(M.doorParse('')), { roaster: '', name: '' });
assert.deepEqual(pick(M.doorParse(null)), { roaster: '', name: '' }, 'never throws on nothing');
ok('doorParse refuses to guess: unknown labels stay text, and an unnamed coffee stays unnamed');

assert.equal(M.doorParse('Sey\nEthiopia Gedeb\nRoast: light').roastLevel, 'Light',
  'a stated roast level is read off its own label');
assert.equal(M.doorParse("Sey's — Ethiopia Gedeb, medium roast").roastLevel, 'Medium',
  'and off the body of the paste where no label states it, exactly as before');
assert.deepEqual(M.doorParse('Sey\nGedeb\nAltitude: 1,900 - 2,100 m\nVariety: Heirloom\nProducer: Tesfaye').o,
  { altitude: '1,900 - 2,100 m', variety: 'Heirloom', producer: 'Tesfaye' },
  'altitude keeps its own dashes and commas — a labelled value is taken whole');
ok('doorParse carries roast level and every origin field the bag actually stated');

// ---- v7.31.3: the watch reads a shot twice — once cheaply (no curve at all)
// and once in full — and the method must come from the second, not be guessed
// at by the first. It used to come back 'espresso' from a parse with nothing
// to read it off, and 'espresso' is neither null nor empty, so the fill-in
// that follows refused to correct it: the Atlas drew a pour-over through the
// espresso arm, with no pressure series to draw. The Journal was unaffected,
// because its list fetches the whole file — which is the split as reported.
const essentialsOnly = { duration: 200, bean_weight: '14.9', bean_brand: 'Sey', bean_type: 'Ethiopia Gedeb washed' };
const cheap = M.parseVisualizerShot(essentialsOnly);
assert.equal(cheap.curve, null, 'the cheap call carries no curve — this is the whole shape of the problem');
assert.equal(cheap.method, '', "a parse with no curve in front of it does not know the method, and says so rather than guessing espresso");
assert.equal(M.shotMethod(cheap), 'espresso',
  'the default still reads espresso at the point of use — it just stopped being written down as a fact');
assert.equal(M.shotMethod({ ...cheap, curve: M.shotCurve(flatPressure) }), 'pourover',
  'and the moment a curve is in hand, the curve is what answers');
ok('parseVisualizerShot leaves the method blank where no curve states it, so a later full read can correct it');

// ---- v7.31.4: the date. Until now the only timestamp Carta had was `clock`
// off the LIST row, which is the record's own — for anything filed after the
// fact (a scale-synced filter brew) that is when it reached Visualizer, not
// when it was poured. Reported: a brew showing its upload date.
const DAY = 864e5;
const threeDaysAgo = new Date(Date.now() - 3 * DAY).toISOString();
assert.equal(M.shotStartedAt({ start_time: threeDaysAgo }), threeDaysAgo,
  "the file's own start is preferred over anything that looks like a record timestamp");
assert.equal(M.shotStartedAt({ start_time: threeDaysAgo, clock: Math.floor(Date.now() / 1000) }), threeDaysAgo,
  'and it wins even when an upload-shaped clock sits right beside it');
assert.equal(M.shotStartedAt({ clock: Math.floor((Date.now() - DAY) / 1000) }).slice(0, 10),
  new Date(Date.now() - DAY).toISOString().slice(0, 10),
  'where the file states nothing better, clock still stands — this is never worse than what it replaces');
assert.equal(M.shotStartedAt({ data: { start_time: threeDaysAgo } }), threeDaysAgo,
  'hunted in both containers, the way every series already is');
assert.equal(M.shotStartedAt({}), null, 'a file that dates itself nowhere says nothing rather than today');
assert.equal(M.shotStartedAt(null), null);
ok('shotStartedAt reads when a brew was poured, not when its record was made');

// what keeps a duration, an elapsed second or a dose from being read as a date
assert.equal(M.tsToMs(27.4), null, "a shot's own length is not a date");
assert.equal(M.tsToMs(200), null, 'nor is three minutes twenty');
assert.equal(M.tsToMs(18.2), null, 'nor is a dose');
assert.equal(M.tsToMs([1, 2, 3]), null, 'nor is a series');
assert.equal(M.tsToMs('not a date'), null);
assert.equal(M.tsToMs(0), null);
assert.equal(M.tsToMs(Math.floor(Date.now() / 1000) + 90 * DAY / 1000), null,
  'nor is something three months from now — a coffee is not brewed the week after next');
const secs = Math.floor((Date.now() - DAY) / 1000);
assert.equal(M.tsToMs(secs), secs * 1000, 'epoch seconds');
assert.equal(M.tsToMs(secs * 1000), secs * 1000, 'and epoch milliseconds, told apart by magnitude');
assert.equal(M.tsToMs(String(secs)), secs * 1000, 'a numeric string reads as the number it is');
ok('tsToMs refuses everything that is not plausibly a date, which is what stops a duration passing for one');

const dated = M.parseVisualizerShot({ duration: 200, start_time: threeDaysAgo });
assert.equal(dated.at, threeDaysAgo, 'the shot carries when it was poured');
assert.equal(M.parseVisualizerShot({ duration: 200 }).at, null);
ok('parseVisualizerShot carries the pour\'s own date, or none at all');

/* ---- the map layer (Phase 29) --------------------------------------------
   Every phase of the map spec carries a "done when" clause, and each one was
   written as a real assertion rather than a sentiment. These are them. The
   geometry is the app's own — decoded through the app's own reader, never a
   shape baked at authoring time — so a string that stops round-tripping, a
   ring that stops closing inside its window or a city key that stops putting
   the record's own cafés on land fails here rather than on a keeper's screen.
   ------------------------------------------------------------------------ */

// even-odd across every ring, the same test landAt makes in index.html. It
// lives here rather than being imported because landAt reads the whole belt
// and these tests are about one shape at a time.
const inRings = (at, rings) => {
  let hit = false;
  for (const r of rings || []) for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const a = r[i], b = r[j];
    if ((a.lat > at.lat) !== (b.lat > at.lat) &&
      at.lon < (b.lon - a.lon) * (at.lat - a.lat) / (b.lat - a.lat) + a.lon) hit = !hit;
  }
  return hit;
};
const KMX = (lon, la0) => lon * 111.32 * Math.cos(la0 * Math.PI / 180), KMY = la => la * 111.32;
// how far outside a shape a point falls, in kilometres, measured to the nearest
// drawn edge — the figure that says a café is in the sea rather than on land
const offshoreKm = (at, rings) => {
  let best = Infinity;
  for (const r of rings || []) for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const ax = KMX(r[i].lon, at.lat), ay = KMY(r[i].lat), bx = KMX(r[j].lon, at.lat), by = KMY(r[j].lat);
    const px = KMX(at.lon, at.lat), py = KMY(at.lat), dx = bx - ax, dy = by - ay, L = dx * dx + dy * dy;
    const t = L ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / L)) : 0;
    best = Math.min(best, Math.hypot(px - (ax + t * dx), py - (ay + t * dy)));
  }
  return best;
};
const bboxIn = (ring, w) => ring.every(p => p.lon >= w.lon0 && p.lon <= w.lon1 && p.lat >= w.lat0 && p.lat <= w.lat1);

// real coordinates, the way MAPPING.md wants them — the records these cities
// carry in the design document are invented, but the places are not
const AT = {
  lihue: { lat: 21.9811, lon: -159.3711 }, kapaa: { lat: 22.0752, lon: -159.3190 },
  koloa: { lat: 21.9067, lon: -159.4700 }, waimea: { lat: 21.9575, lon: -159.6690 },
  losAngeles: { lat: 34.0522, lon: -118.2437 }, honolulu: { lat: 21.3069, lon: -157.8583 },
  copenhagen: { lat: 55.6761, lon: 12.5683 }, berlin: { lat: 52.5200, lon: 13.4050 },
  oslo: { lat: 59.9139, lon: 10.7522 }, tokyo: { lat: 35.6762, lon: 139.6503 },
  portland: { lat: 45.5152, lon: -122.6784 }, anchorage: { lat: 61.2181, lon: -149.9003 },
};

// ---- Phase A: the belt reaches the countries the record drinks in ----
[['denmark', 2, 19, 53], ['germany', 1, 38, 96], ['norway', 1, 48, 144], ['japan', 3, 64, 181]]
  .forEach(([k, rings, pts, bytes]) => {
    assert.equal(M.LANDS[k].length, bytes, `${k} is ${bytes} b`);
    const rs = M.landRingsRaw(k);
    assert.equal(rs.length, rings, `${k} decodes to ${rings} ring(s)`);
    assert.equal(rs.reduce((a, r) => a + r.length, 0), pts, `${k} decodes to ${pts} points`);
  });
ok('every belt addition round-trips through landPts to the counts it was written from');

assert.equal(Object.keys(M.LANDS).length, 70, 'sixty-five countries, four added, and Alaska split out');
assert.equal(Object.values(M.LANDS).join('').length, 7745,
  '7,272 b + 474 for the four, less the one separator Phase E dropped');
assert.deepEqual(Object.keys(M.LANDS), Object.keys(M.LANDS).slice().sort(), 'the belt stays alphabetical');
ok('the belt reads 7,745 b over seventy keys, in order');

['copenhagen', 'berlin', 'oslo', 'tokyo'].forEach(c => {
  const k = { copenhagen: 'denmark', berlin: 'germany', oslo: 'norway', tokyo: 'japan' }[c];
  assert.ok(inRings(AT[c], M.landRingsRaw(k)), `${c} falls inside ${k}'s outline`);
});
ok('a city in the four new countries lands on ground the belt can name — no row states the fall');

// the passport is where coffee is GROWN, so the four stay off it
['denmark', 'germany', 'norway', 'japan'].forEach(k =>
  assert.ok(M.LAND_OFF_BELT[k], `${k} is off the growing-world passport`));
assert.ok(!M.LAND_OFF_BELT['alaska'] && !M.LAND_OFF_BELT['ethiopia'],
  'Alaska is drawn exactly as it was, and a growing country is never off the frame');
ok('the four are ground for a seal, not countries on the passport');

// ---- Phase B: the seal spends LAND_TOPO above 64 px ----
assert.deepEqual(M.sealBands(36), [], 'the row keeps the outline alone');
assert.deepEqual(M.sealBands(63), [], 'and does right up to the threshold');
assert.deepEqual(M.sealBands(104), [2, 1], 'the cup sheet takes 3,000 then 2,000 m');
assert.deepEqual(M.sealBands(168), [2, 1, 0], 'the chapter takes all three');
assert.deepEqual(M.sealBands(), [], 'a call with no width is a row');
ok('one threshold, coarsest band first, and nothing branches on the surface');

[['ethiopia', 3], ['kenya', 3]].forEach(([k, levels]) => {
  const lv = M.landTopoRaw(k);
  assert.equal(lv.length, levels, `${k} carries all three contour levels`);
  M.sealBands(104).forEach(b => assert.ok(lv[b].length, `${k} has ground to draw at band ${b}`));
});
assert.equal(M.landTopoRaw('kenya')[2].length, 2,
  "Kenya's 3,000 m band is two marks on the whole country — and they are the two mountains");
ok('Ethiopia and Kenya both ladder, which is why 64 px was measured on them');

// ---- Phase C: the plate, on the closes-inside-the-window rule ----
[190, 110].forEach(span => {
  const g = M.plateGround('Līhu‘e', 'hawai', AT.lihue, span);
  assert.equal(g.rings.length, 1, `Kaua‘i closes inside a ${span} km window`);
  assert.ok(g.rings.every(r => bboxIn(r, g.w)), `every drawn ring's bbox is inside the ${span} km window`);
});
ok('Kaua‘i draws ground at 190 km and at 110 km, and passes the bbox assertion');

const la = M.plateGround('Los Angeles', 'united states of america', AT.losAngeles, 190);
assert.equal(la.rings.length, 0, 'a coastline running Mexico to Canada is a chord, not ground');
assert.equal(la.arcs.length, 1, 'so the city table\'s open coast is what Los Angeles draws');
ok('Los Angeles draws no ring — the frame would cut every one of them');

['copenhagen', 'berlin', 'oslo', 'tokyo'].forEach(c => {
  const k = { copenhagen: 'denmark', berlin: 'germany', oslo: 'norway', tokyo: 'japan' }[c];
  const g = M.plateGround(c, k, AT[c], 190);
  assert.equal(g.rings.length + g.arcs.length, 0, `${c}'s window holds nothing that closes`);
});
ok('where nothing closes the plate draws the record instead, and the fact row says why');

// Honolulu needs no city key to draw: O‘ahu already closes inside the window
const hon = M.plateGround('Honolulu', 'hawai', AT.honolulu, 190);
assert.equal(hon.rings.length, 1, 'the belt\'s O‘ahu closes inside a 190 km window');
assert.equal(M.cityRingsRaw('Honolulu'), null, 'and Honolulu has no city key to fall forward to');
ok('a city with no key falls back to LANDS, and nothing else in the reader changes');

// ---- Phase D: the city table ----
assert.equal(M.cityKey('Līhu‘e'), 'lihue', 'an ‘okina is a letter, not a separator');
assert.equal(M.cityKey('Los Angeles'), 'los angeles');
assert.equal(M.landPts(M.CITY_ARCS['los angeles'], M.CITY_Q).length, 12, 'the divisor is the only change');
assert.equal(M.landPts(M.CITY_ARCS['los angeles']).length, 12, 'and the belt is still the default');
ok('landPts takes a divisor: 20 for the belt, 200 for the city table');

// test one: more vertices in the window than the belt has
const win = M.cityWindow(AT.losAngeles, 190);
const beltLA = M.landRingsRaw('united states of america')[0]
  .filter(p => p.lon >= win.lon0 && p.lon <= win.lon1 && p.lat >= win.lat0 && p.lat <= win.lat1);
assert.equal(beltLA.length, 1, 'the belt puts one vertex in the Los Angeles window');
assert.ok(la.arcs[0].length > beltLA.length, 'and the city table puts twelve');
const beltKauai = M.ringsInWindow(M.landRingsRaw('hawai'), M.cityWindow(AT.lihue, 190));
assert.equal(beltKauai[0].length, 6, "the belt's Kaua‘i is a six-point hexagon");
assert.equal(M.cityRingsRaw('Līhu‘e')[0].length, 8, 'and the city table makes it eight');
ok('adoption test one — a key adds vertices inside the window');

// test two, the one that makes the first safe: every point the record holds in
// that window still lands on land. A coarser outline can look like the right
// island and still put your cafés in the sea, and no byte count would show it.
const four = ['lihue', 'kapaa', 'koloa', 'waimea'];
const onBelt = four.filter(c => inRings(AT[c], beltKauai));
const onCity = four.filter(c => inRings(AT[c], M.cityRingsRaw('Līhu‘e')));
assert.equal(onBelt.length, 1, "the belt's ring holds one of the four cafés — the rest are in the sea");
assert.equal(onCity.length, 4, 'the city ring holds all four');
assert.ok(offshoreKm(AT.kapaa, beltKauai) > 3 && offshoreKm(AT.waimea, beltKauai) > 3,
  'Kapa‘a and Waimea sit over three kilometres off the belt\'s coast');
ok('adoption test two — every point the record holds in the window lands on land');

assert.ok(!M.CITY_RINGS['honolulu'] && !M.CITY_ARCS['honolulu'],
  'Honolulu failed test two on this source and is not shipped');
assert.equal(Object.values(M.CITY_RINGS).join('').length + Object.values(M.CITY_ARCS).join('').length, 76,
  'the whole city table is 76 b — 31 for Kaua‘i, 45 for the Los Angeles coast');
ok('the generator refuses to write a rejected key, and the table costs 76 bytes');

// ---- Phase E: the USA entry ----
assert.equal(M.landRingsRaw('united states of america').length, 1, 'the USA entry is the contiguous states');
assert.equal(M.landRingsRaw('united states of america')[0].length, 75);
assert.equal(M.landRingsRaw('alaska').length, 1, 'and Alaska is its own key');
assert.equal(M.landRingsRaw('alaska')[0].length, 60);
assert.equal(M.LANDS['united states of america'].length + M.LANDS['alaska'].length, 427,
  'the same bytes, less the separator between them');
ok('Alaska is split out of the USA entry at its second ring, for no new bytes');

assert.ok(inRings(AT.portland, M.landRingsRaw('united states of america')), 'Portland is on the contiguous shape');
assert.ok(!inRings(AT.portland, M.landRingsRaw('alaska')));
assert.ok(inRings(AT.anchorage, M.landRingsRaw('alaska')), 'an Anchorage row draws Alaska');
assert.ok(!inRings(AT.anchorage, M.landRingsRaw('united states of america')));
const usa = M.landRingsRaw('united states of america')[0];
const la0 = usa.reduce((a, p) => a + p.lat, 0) / usa.length;
const w = Math.max(...usa.map(p => KMX(p.lon, la0))) - Math.min(...usa.map(p => KMX(p.lon, la0)));
const h = Math.max(...usa.map(p => KMY(p.lat))) - Math.min(...usa.map(p => KMY(p.lat)));
assert.ok(Math.abs(w - 5074) < 3 && Math.abs(h - 2694) < 3,
  `the frame is 5,074 x 2,694 km, not 7,479 x 5,137 — got ${Math.round(w)} x ${Math.round(h)}`);
ok('the frame closes to the contiguous states, and the pin lands where the shape says it does');

console.log(`\nALL ${n} MODEL TESTS PASSED`);
