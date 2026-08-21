# CARTA 7 — the technical architecture

*The fourth turn's build, specified. `PIVOT.md` argued the what;
`ROADMAP.md` orders the when; this is the how. It was written to be enough
to start Phase 1 from this document and the classic file alone, and it is
kept current as the phases land — read through Phase 12. Where a section
describes what was planned and what was built, it says both; the plan is
part of the record.*

## 1. The stack laws (unchanged, and why)

Carta 7 is built exactly the way classic was, smaller:

- **One file.** `index.html`, all CSS and JS inline, self-contained. Target
  **3–4,800 lines / ≤ 500 KB** including map data — a file one person can
  read whole. (Classic reached 12,480 lines; the size was the third turn's
  cost, not the stack's.) At Phase 15 it stands at **4,601 lines / 376 KB**.

  *The line band was 3–4,000 through Phase 12, 3–4,500 through Phase 14, and
  is amended here, at Phase 15, to **3–4,800**.* Phase 14 wrote the warning
  a phase early: it budgeted ~4,510, landed at 4,486, declined the amendment
  it had been given, and recorded that fourteen lines were left and the next
  surface of any size would have to make this argument. Phase 15 is that
  surface, so here is the argument.

  The band's stated purpose is a file one person can read whole, and the
  ceiling that actually guards the drop-it-on-a-static-host promise is the
  byte one — still **500 KB**, still never moved, with the file at 376 KB
  and 75% of it. Phase 15 spends its lines on a correction path that did not
  exist: a café placed by a single best guess, wrongly and permanently, with
  nothing in the app that could say otherwise. Ninety lines to stop the atlas
  quietly lying is the cheapest honest thing in the file.

  **4,800 is a ceiling, not an allowance**, and the same rule carries: the
  next phase past it makes its argument here first. The reading Phase 13 set
  down still stands — if a phase ever needs 5,000, the honest conclusion is
  that the one-file law itself has come due, not that the band needs raising
  a fourth time. That is now two hundred lines away, which is close enough
  that Phase 16 should treat it as a real question rather than a distant one.

  *The line band was 3–4,000 through Phase 12 and is amended here, at Phase
  13, rather than quietly exceeded.* The argument: the band's stated purpose
  is a file one person can read whole, and the ceiling that actually guards
  the drop-it-on-a-static-host promise is the byte one — still 500 KB, still
  untouched, and the file sits at 71% of it. Phase 13 added fourteen
  surfaces to an app that had nine; 867 lines for that is roughly 60 lines a
  screen in a house style whose views are multi-line template literals, and
  compressing them to hold a number would satisfy the letter of "readable
  whole" by working against its point. **4,500 is a ceiling, not an
  allowance.** The next phase that wants past it does what this one did:
  makes the argument here first. If a phase ever needs 5,000, the honest
  reading is that the one-file law itself has come due, not the band.
- **Zero dependencies, zero build.** Vanilla JS, global functions, inline
  `onclick` handlers, string-templating into `innerHTML`, `esc()`/`jsq()`
  discipline. No bundler, no framework, no npm for the app — the single
  droppable file is brand, not accident.
- **Vendored, exactly twice** *(amended at Phase 12 — `ROADMAP.md` tripwire
  2, moved in the open rather than slipped past)*. The passport's projection
  needs real spherical geometry, and freehanding one is the kind of "small"
  maths that is wrong in ways nobody sees. So `d3-array` 3.2.4 and `d3-geo`
  3.1.1 (ISC, Mike Bostock) are **pasted into the file verbatim from their
  dist builds** — 54 KB, the two modules `geoEquirectangular` / `geoPath`
  and their fit/bounds/centroid actually need; full d3 is 280 KB for three
  calls. This costs the law nothing it was protecting: no npm, no build, no
  lockfile, no fetch, no version resolution, and the file is still one file
  you can drop on a static host. Upgrading is re-pasting a dist file.
  What it *does* cost is auditability-by-reading, which is why the number is
  two and the bar for a third is a deliberate amendment here, not a
  judgement call in a PR.
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
index.html            Carta 7 — the app
CLAUDE.md             the working guide to this file (Carta 7)
test/model.test.js    the pure-block harness (§9)
classic/index.html    Carta 6.18.x, frozen whole (it is self-contained;
                      freezing it was one `git mv`)
classic/CLAUDE.md     the third turn's architecture map, kept for the record
classic/README.md     classic's own user documentation, travelled with it
fonts/  manifest.json  icon-*.svg  CNAME     as before
docs/                 the design record, both eras
server/               dormant — kept for the record and the horizon's
                      backup option; not part of 7.x, not deleted
```

PWA notes: `manifest.json` keeps scope `/carta/`; classic gets no manifest
of its own (it's a page, not an install target). It carries one `shortcuts`
entry (Phase 10) pointing at `?open=door`. Version identity restarted at
`APP_VERSION = '7.0.0'` with a fresh `CHANGELOG` whose first entry names the
turn; Phase 12 is `7.13.0`, Phase 13 is `7.14.0`.

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

## 4. The data model (seven objects, as shipped)

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
                       process?, altitude?, mill? },   // story fields, free text
                                                        // altitude specified from the turn's
                                                        // start, first offered a field at
                                                        // Phase 13; mill added there, and the
                                                        // road's Milled station reads it
              roastLevel?,                            // Act Two, Phase 9 — light..dark,
                                                        // optional, same law as process/origin:
                                                        // never a rung, never required (§4 below)
              roastDate?, notes?, site?, palette?, archived? }],
  places:  [{ id, createdAt, name, aka?[], city?, lat?, lon?,
              neighborhood?, geocoded?,           // both stated only by a real lookup
              branches?:[{ lat, lon, hood }],     // Phase 15 — several of it in one city,
              roasterRefs?, notes?, site?,        //   unanswered until the keeper says which
              palette?, archived? }],
  roasters:[{ id, createdAt, name, aka?[], city?, story?, site?,
              palette?, archived? }],
  setups:  [{ ...classic's shape, unchanged }],
  brews:   [{ ...classic's shape minus roastRef/lotRef; keeps coffeeRef }],
  menus:   [{ id, createdAt, placeRef, at,
              items:[{ text,                           // the line as printed
                       roaster?, name?, roastLevel?,   // parsed, editable
                       coffeeRef? }] }],               // set when tasted/taken home
  asks:    [{ id, createdAt, kind, destination,        // Phase 7 — the ask's history
              question, reach, model, read,            // reach + read: Phase 14
              findings:[{ id, name, neighborhood, city, why,
                          verdict, fit:[], order,      // Phase 14 — what it's best FOR,
                          travel, stale,               //   read off the brief, and how far
                          lat, lon, grounded,          // grounded === a real place lookup confirmed it
                          status, placeRef }],         // status: been | booked | skip
              mentions:[{ ...same shape, instead }],   // named, and talked out of
              plan:{ move, routes:[{ if, order:[] }],  // what it would actually do
                     wildcard:{ ...same shape } } }],  // outside the ranking
  prefs:   { tempUnit, askKey, askModel,               // the key lives here and nowhere else
             exportedAt, autoExport, ... }
}
```

Fields the phases added after this section was first written, all optional,
none of them new objects: `coffees.roastLevel` (Phase 9), `coffees.home` +
`coffees.homeAt` (Phase 11 — stamped only by the café-to-shelf bridge, so
"taken home, not brewed yet" can never fire on a coffee that started at
home), `prefs.exportedAt` / `prefs.autoExport` (Phase 8), `origin.mill`
(Phase 13, read by the country road's Milled station). `asks` is the one
collection the original six missed; it is the record of what was asked and
what came back. **Phase 14 widened it and broke nothing:** every field it
added is optional, so an ask stored under the Phase 7 shape still opens and
still reads — the screen draws a part only where the model filled it. The
three places an ask can name a café — `findings`, `mentions`, `plan.wildcard`
— all carry the same `grounded`/`status`/`placeRef` trio, so a mention is as
markable, and as un-pinnable-when-unconfirmed, as a finding.

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
inspectable on a page of its own, because *a recommendation never travels
without its reasons* starts with the model itself. That page was the Scout
room; since Phase 12 it is **Your taste**, a screen off the Atlas (Scout is
not a room any more — what it argued is geography). `vector.roast` was an
empty slot until Phase 9 gave it a field to read; it now leads the vector.

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

As built, after Phase 12 re-cut the rooms. `CLAUDE.md` is the working map
with the function names; this is the shape:

```
tokens/style     the QM-inherited layer + Carta overrides (ported)
                 + "the rooms" — the redesign's own furniture (.shdr,
                   .shead, .lrow, the three-room bar and the door)
map layer        <carta-belt> · <carta-plot> · <carta-streets>, three light-DOM
                 custom elements above the app's own script, with d3-array +
                 d3-geo vendored beside them (§1). Leaflet injected at runtime.
store            load/save, carta7.v1, live(), put-away, photos key
domain           uid, dates, °C, rest window, ROAST_LEVELS, fold, matchNodes
                 — inside the /* ==== pure ==== */ markers (§9)
taste            tasteModel(), briefPlainText(), the pages — pure, then
                 tasteModelMemo() outside the markers, dirtied by save()
router           three rooms (atlas|journal|shelf) + one screen overlay:
                 go()/openScreen()/closePage(), SCREENS, ROOM_OF, the door
                 on the bar rather than a masthead
views            vAtlas (home: the passport + your cities), vJournal, vShelf,
                 vTaste, and the screens — the walk down from a country
                 (vCountryChapter → vRegionChapter → vProducerPage), the
                 places (vCityChapter, vCafe, vCup, vMenu), the argument
                 (vTaste → vBrief → vAsk → vAskResult), and what the keeper
                 owns (vRecord → vSetups → vSetup), plus vBrew
door             paste-or-type → card; no adjudication, no propose
menus            one screen (vMenu): the lines as printed, and the box to add
                 to them — a photo held up as reference, or read through the
                 ask's channel
cards            card renderer + carta.card/v1 embed; the exports; import back
ask              askPromptText/callModel/geocodeCafe grounding, the findings
sheets/dials     ported plumbing
boot             migrate-nothing boot; ?open=door; importer entry; welcome
```

Porting rule: **port craft, not law.** `LANDS`, `landTopo`, the dial, the
sheet plumbing, the token layer come over as code; the evidence gates,
`RUNG`, holds, lens machinery, and every `penGuard`/`readOnly` path do not
come with them. Classic's `plotSVG` was *not* ported in the end — it carried
exactly the law this rule excludes (rung gating, lens, scene clustering), so
Phase 3 wrote `passportSVG()` purpose-built instead. Phase 12 took the app's
own passport off it and onto `<carta-belt>`; `passportSVG()` stays, because a
**card** is a standalone page and cannot carry a custom element that needs
the app's script. Two drawings of one frame is deliberate: the interactive
one and the one that travels.

## 7. Network posture (the whole of it)

| Touch | When | Degrades to |
|---|---|---|
| Geocode (Nominatim) | placing a café; grounding an ask's answer | typed city, drawn plot |
| Leaflet + tiles (unpkg, OpenStreetMap) | a street surface mounts | the drawn plot, one line, Retry |
| **The ask** (BYO-key, `api.anthropic.com`) | the keeper taps "Ask" or "Read it for me" | **the brief, copied** |

The geocode row is unchanged in posture and was sharpened at Phase 15: the
same one call now asks for five results with their address details instead of
one bare hit. A café the lookup knows exactly one of is placed silently and
keeps the neighborhood it was found in. Where it knows several, **Carta does
not choose** — the branches are held on the record and the café asks once,
with the real neighborhoods to pick from, because which branch the keeper sat
in is not a fact any lookup or model holds. Same grounding rule, one rung
more honest: a pin is drawn from a confirmed position or not at all, and now
it can also be taken back.

That is the whole list, and **Phase 14 deliberately kept it that way.** The
obvious way to make the ask's answers sharper is to let the model search —
the chat transcript the phase was tuned against owed its best lines to a live
menu read. That would have been a fourth row here, and it was declined: the
ask stays on training knowledge, and the prompt instead forbids stating any
menu as fact and makes the model mark every café whose fit depends on one
that turns over. What the screen shows is what Carta can stand behind. If
search is ever wanted, it is a row in this table first, not a flag in the
request.

Two notes on what the table no longer says:

- **The brand read (Microlink) was never built.** Carta 7 makes no call on
  saving a roaster or a place. Palettes exist on records only because the
  classic importer carries the ones classic already read. Building it would
  be a new row here, deliberately added.
- **MapLibre + OpenFreeMap left at Phase 12**, replaced by Leaflet over
  OpenStreetMap's own tiles. The posture is unchanged and is the point:
  Leaflet is injected at runtime, never bundled, and a surface that cannot
  reach it hides itself so the drawn plot underneath simply stands. The
  passport asks for nothing at all — its outlines are in the file and its
  projection is vendored (§1), so the app's *home screen* is now the one
  map surface with no network story to tell.

Everything else — the model, the brief, the passport, the cards — is offline
by construction. The ask is the **one sanctioned outbound question**, and its
second use (menu-photo OCR) goes through the same channel, same posture:
keeper-initiated, keyed by the keeper, the key on the device and nowhere
else, degrading to a manual path, never required. Grounding rule: a café
named in an answer is drawn only after a real place lookup confirms it
exists — Carta never pins a hallucination; what can't be confirmed is
listed, not plotted.

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
basics classic has, no accounts, no server in 7.x (the dormant one returns
only as the horizon's dumb backup), no analytics of any kind, no OCR
dependency (the ask's own channel does that job, or nothing does), no
embedding/vector machinery in the taste model (counts and means with
evidence beat opaque similarity for a corpus of hundreds — and they can be
*read*). Each of these is a door we know the address of; not opening them is
the architecture.

**The one amendment so far**, recorded here because a list of refusals is
worth nothing if it quietly stops being true: Phase 12 vendored `d3-array`
and `d3-geo` inline (§1). That is not a bundler, a build step or an npm
dependency — it is two dist files pasted into the page — but it *is* 54 KB
of code nobody in this repo wrote, and pretending otherwise would be the
first crack. The count is two. A third needs an argument made here, in
writing, before it is made in a PR.
