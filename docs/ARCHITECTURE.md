# CARTA 7 — the technical architecture

*The fourth turn's build, specified. `PIVOT.md` argued the what;
`ROADMAP.md` orders the when; this is the how. It is written to be enough:
a competent session should be able to start Phase 1 from this document and
the classic file alone.*

## 1. The stack laws (unchanged, and why)

Carta 7 is built exactly the way classic was, smaller:

- **One file.** `index.html`, all CSS and JS inline, self-contained. Target
  **3–4,000 lines / ≤ 500 KB** including map data — a file one person can
  read whole. (Classic reached 12,480 lines; the size was the third turn's
  cost, not the stack's.)
- **Zero dependencies, zero build.** Vanilla JS, global functions, inline
  `onclick` handlers, string-templating into `innerHTML`, `esc()`/`jsq()`
  discipline. No bundler, no framework, no npm for the app — the single
  droppable file is brand, not accident.
- **Offline-first, localStorage.** The device is the source of truth. Every
  network touch is a progressive enhancement that degrades to nothing.
- **The terse house style.** Single quotes, dense one-line helpers, section
  banners `/* ============ name ============ */`. Comments explain *why*.
- **Carried over from classic wholesale:** the Quiet Matter token layer
  (`SUBBRAND.md` governs it), the fonts, paper/dusk themes, the tuck, the
  motion charter, the sheet plumbing, the dial component, °C canon,
  descriptors, the 1–9.

## 2. Repository layout after the turn

```
index.html            Carta 7 — the new app
classic/index.html    Carta 6.18.x, frozen whole (it is self-contained;
                      freezing it is one `git mv`)
fonts/  manifest.json  icon-*.svg  CNAME     as today
docs/                 the design record, both eras
server/               dormant — kept for the record and the horizon's
                      backup option; not part of 7.0, not deleted
```

PWA notes: `manifest.json` keeps scope `/carta/`; classic gets no manifest
of its own (it's a page, not an install target). Version identity restarts
at `APP_VERSION = '7.0.0'` with a fresh `CHANGELOG` whose first entry names
the turn.

## 3. Storage

- **`carta7.v1`** — the whole ledger, one key, one keeper. No per-user
  registry, no multi-user. `D` is the ledger; `load()`/`save()` as today.
- **Prefs live inside the ledger** (`D.prefs`) — no second key to sync or
  forget. Device-frills (tuck postures, ground toggle) may keep their own
  keys as classic did; they are furniture, not record.
- **Photos** are the one storage-budget risk: stored as compressed JPEG
  data-URIs, longest edge ~1,000 px, target ≤ 150 KB each, in a separate
  key **`carta7.photos.v1`** (`{cupId: dataUri}`) so the ledger itself
  stays light enough to export, diff, and back up as text. The export can
  include or omit them (two buttons, sizes stated).
- Classic's keys are never touched. Import reads them (or an export file);
  it never writes them.
- **Act Two, Phase 8 (durability):** the storage laws above don't change —
  still one key, still one device, still no sync. What Phase 8 adds sits
  entirely in front of them: a quota guard that warns before a photo save
  fails instead of after, and a factual "last exported" read stated on the
  Shelf. Neither is a new key, and neither is sync.

## 4. The data model (the six objects, specified)

Every record: `id` (uid), `createdAt`; edits stamp `updatedAt`. Put-away is
`archived: true` + `archivedAt` — one flag, one filter helper (`live(coll)`),
undo is unsetting it. No strike bodies, no tombstone grammar: with one
device and no merge, deletion is honest again — but stays two-step
(put away → erase from one room) per the surviving law.

```
D = {
  cups:    [{ id, createdAt, at, kind:'bar'|'home',
              placeRef?, coffeeRef?, brewRef?,        // home cups carry brewRef
              score,                                   // 1–9
              line, descriptors?[], photo?:true }],    // photo body in carta7.photos.v1
  coffees: [{ id, createdAt, roaster,                  // display string
              roasterRef?, name,
              origin:{ country?, region?, farm?, producer?, variety?,
                       process?, altitude? },          // story fields, free text
              roastLevel?,                            // Act Two, Phase 9 — light..dark,
                                                        // optional, same law as process/origin:
                                                        // never a rung, never required (§4 below)
              roastDate?, notes?, site?, palette?, archived? }],
  places:  [{ id, createdAt, name, aka?[], city?, lat?, lon?,
              roasterRefs?[], notes?, site?, palette?, archived? }],
  roasters:[{ id, createdAt, name, aka?[], city?, story?, site?,
              palette?, archived? }],
  setups:  [{ ...classic's shape, unchanged }],
  brews:   [{ ...classic's shape minus roastRef/lotRef; keeps coffeeRef }],
  menus:   [{ id, createdAt, placeRef, at,
              items:[{ text,                           // the line as printed
                       roaster?, name?, origin?,       // parsed, editable
                       coffeeRef? }] }],               // set when tasted/taken home
  prefs:   { tempUnit, ...; scout:{ skips, leans } }   // matchOf's surviving bookkeeping
}
```

**The gentle join** (replaces the catalog, the resolver, and the fold):
roasters and places are the graph's nodes, so each carries `aka[]` — other
spellings folded into it. `findNode(coll, name)` matches on
name-or-aka with classic's `normPlace`-grade folding (case, diacritics,
punctuation — never doubled letters, never aliases). When a new entry's
name is *near* an existing node, the form offers "Same as Sey (from
March)?" — accept: the string joins `aka[]` and the ref points at the
node; decline: a new node. Undo a join = remove the alias, re-point its
refs to a fresh node — one small function, cheap because nothing merged
bodies. **Origin story fields never join** — Huila spelled three ways is
three strings on three cards, and only the atlas's *display* folds them
(`foldNames`-style, presentation only), stating what it folded.

## 5. The taste model and the brief

**`tasteModel()`** is a pure derivation over the ledger — computed, memoized
on write, **never stored** (classic's `reviewQueue` pattern: derived state
cannot corrupt). Shape:

```
{ bar:     { floor,                       // score below which a café isn't worth the walk
             anchors:[{roasterRef, avg, n}],   // houses scoring ≥8 with n≥2
             nines:[cupRefs] },           // what earns your 9s, as evidence
  vector:  { roast, processes[], origins[], descriptors[] },  // each with weight + n
  scope(place|city|country|route) -> { had:[...], knownRoasters:[...] } }
```

Every figure carries its `n` and its evidence refs — the model is
inspectable on a page of its own (the Scout room's "Your taste, as the
record argues it"), because *a recommendation never travels without its
reasons* starts with the model itself.

**The brief** (`brief(scope)`) renders three forms from one derivation:

1. a page on Carta paper (Spectral display, the bar, the vector, the
   anchors, the evidence — shareable as the friend-brief with a taste cut);
2. an embedded machine block, **`carta.brief/v1`** — classic's
   ledger-export trick: JSON in a `<script type="application/json">`
   island, `</script>`-escaped;
3. a plain-text cut sized for a chat box (~1,500 chars), the highest-value
   ~dozen facts, scope exclusions inline ("already had: …").

The brief is **strictly offline** — no call, no key, no telemetry. It is
also the interchange format: stage two sends it; Lotmark may one day read
it; it changes by version, never silently.

## 6. The section map of the new file (in script order)

```
tokens/style     the QM-inherited layer + Carta overrides (ported)
store            load/save, carta7.v1, live(), put-away, photos key
domain           uid, dates, °C, rest window, roast levels, fold, findNode
taste            tasteModel(), brief() — pure, memoized, tested (§9)
router           four rooms (journal|scout|atlas|shelf) + page overlays,
                 go()/render(), pageStack, the door on every masthead
maps             plotSVG (slimmed: no rungs, no held, no lens law),
                 LANDS + landRings, LAND_TOPO + landTopo, passport frame,
                 chapter frame, city frame (smap* street layer, café scope)
views            vJournal, vScout, vAtlas, vShelf; node pages as story
                 pages (country/region/roaster/place/coffee)
door             paste-or-type → card; no adjudication, no propose
menus            capture (paste → items; assisted transcription), menu page
cards            card renderer + carta.card/v1 embed; the exports
sheets/dials     ported plumbing
boot             migrate-nothing boot; importer entry; welcome
```

Porting rule: **port craft, not law.** `plotSVG`, `LANDS`, `landTopo`, the
street-layer theming, the palette engines, the dial, the tuck come over as
code; the evidence gates, `RUNG`, holds, lens machinery, and every
`penGuard`/`readOnly` path do not come with them.

## 7. Network posture (the whole of it)

| Touch | When | Degrades to |
|---|---|---|
| Brand read (Microlink) | saving a roaster/place with a site | no palette |
| Geocode (Nominatim) | placing a café | typed city, drawn map |
| Street tiles (OpenFreeMap) | city frame on screen | the drawn plot |
| **The ask** (BYO-key, stage 2) | the keeper taps "Ask" | **the brief, copied** |

Everything else — the model, the brief, the atlas, the cards — is offline
by construction. The ask is the **one sanctioned outbound question**, and
later uses (menu-photo OCR on the horizon) go through the same channel,
same posture: keeper-initiated, keyed by the keeper, degrading to a manual
path, never required. Grounding rule for stage 2: a café named in an answer
is drawn only after a real place lookup confirms it exists — Carta never
pins a hallucination.

## 8. Migration (classic → 7)

One importer, reading classic's working-copy JSON export (or the live
classic keys on the same device):

| classic | Carta 7 |
|---|---|
| `cups` | `cups` (café → `kind:'bar'`; hedonic → `score`) |
| `bags` + `authored` | `coffees` (flat origin read back; catalog nodes flatten to story fields; palette kept) |
| `cafes` + Register entries | `places` (palette, site, lat/lon, notes kept) |
| catalog `roasters` | `roasters` (name, site, palette; `aka` seeded from the fold's gathered spellings) |
| `setups`, `brews` | as-is (spine refs dropped; `bagId` → `coffeeRef`) |
| `pours`, `holds`, `struck`, sightings, standing, hard-IDs | **not imported** — they are the trade's record; the export file still holds them, nothing is lost |

The importer is additive and re-runnable (id-stable), and reports what it
carried and what it left, in words, before it writes.

## 9. Testing (small, and honest about what it covers)

Classic's stance — no frontend harness — nearly holds, with one upgrade:
the taste model is the one piece of real *logic* whose wrongness would be
invisible (a bad brief just looks like a mediocre brief). So:

- Pure functions (`domain`, `taste`) live between `/* ==== pure ==== */`
  markers in the file. **`test/model.test.js`** — zero-dep, plain Node,
  the `server/test.js` pattern — slices that region out of `index.html`,
  evaluates it, and asserts on fixture ledgers (the bar's floor, anchor
  ranking, scope exclusions, brief size bounds, join/undo round-trips).
- Everything painted stays verified by loading the page, as ever.

## 10. What is deliberately not built

No framework, no bundler, no TypeScript, no service worker beyond the PWA
basics classic has, no accounts, no server in 7.0 (the dormant one returns
only as the horizon's dumb backup), no analytics of any kind, no OCR
dependency, no embedding/vector machinery in the taste model (counts and
means with evidence beat opaque similarity for a corpus of hundreds — and
they can be *read*). Each of these is a door we know the address of; not
opening them is the architecture.
