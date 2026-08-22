# CARTA 7 — the technical architecture

*The fourth turn's build, specified. `PIVOT.md` argued the what;
`ROADMAP.md` orders the when; this is the how. It was written to be enough
to start Phase 1 from this document and the classic file alone, and it is
kept current as the phases land — read through Phase 12. Where a section
describes what was planned and what was built, it says both; the plan is
part of the record.*

## 1. The stack laws (unchanged, and why)

Carta 7 is built exactly the way classic was, smaller:

- **Two files, not one, since Phase 19.** `index.html`, all CSS and JS
  inline, self-contained, was the whole app through Phase 20. Target
  **3–5,000 lines / ≤ 500 KB** for it — a file one person can read whole.
  (Classic reached 12,480 lines; the size was the third turn's cost, not the
  stack's.) Phase 20 landed it at **5,380 lines / 429.5 KB — 380 over the
  ceiling**, an acknowledged debt against that ceiling (the run of amendments
  and overages is kept below as the record of how it got there). **Phase 19
  paid that debt down**, moving the map layer out into its own file,
  `carta-map.js`, loaded from `index.html`'s own `<head>` with a plain
  `<script src>` — no bundler, no build, still two files you drop on a static
  host. `index.html` now stands at **4,854 lines / 321.5 KB**, comfortably
  inside the band with real room again; `carta-map.js` holds the map layer
  proper at **535 lines / 108.4 KB**. Combined, the app is the same size it
  was — the debt was paid by moving lines, not cutting them.

  *The line band's history: 3–4,000 through Phase 12, 3–4,500 through
  Phase 14, 3–4,800 through Phase 16, and amended here, at Phase 17, to
  **3–5,000**.* Each of the first three amendments was made with an argument
  written in at the time, the way this one is. What makes this one different
  is that both of the prior two named 5,000 specifically, and named it the
  same way: not as a number to negotiate but as the point past which "raise
  the band again" stops being the honest answer, and "the one-file law itself
  has come due" starts being it. Phase 17 reaches that number.

  **This is a reopened decision, not a fourth routine bump — recorded as one
  on purpose** (`ROADMAP.md`'s own rule: a decided thing stays decided until
  it is deliberately reopened, and reopening it is a logbook entry, not a
  mood). The founder chose to amend rather than split the phase or trim
  the file first, with the 5,000-line reading in front of them, not around
  it. The byte ceiling is the one that was never touched across all four
  amendments and is the one that actually guards the drop-it-on-a-static-host
  promise — still **500 KB**, with the file at 392 KB. If a future phase
  needs to go past 5,000 in turn, it does not get to treat this crossing as
  precedent for a fifth quiet one; it re-earns the argument from here, same
  as every phase before it had to.

  Phase 17 itself shipped twice in one sitting, and both drafts are worth
  recording. The first spent its lines on tile-server citizenship — a live
  Leaflet map, gated to boot only while a thumbnail was actually on screen —
  for the one offline-first surface that never had it. It worked, and it
  still wasn't right: a moving map with individually tappable pins is more
  than a 44×60px row can read, whatever discipline governs how it's fetched.
  The correction dropped the live map and the network touch entirely — a
  city's thumbnail is a single soft shape now (§7), computed once from the
  same lat/lon already on the ledger, no fetch of any kind. It reads as the
  first draft's replacement, not a second amendment; the line count above is
  the corrected version's, and §7's geocode table no longer carries a
  thumbnail row, because there is nothing left there to be a citizen of.

  **Phase 18 is the first phase to land over the ceiling, and it says so
  rather than quietly sitting there.** It merges into a `main` that Phase 17's
  correction left at 4,824 and adds 219 lines of ground — contours, region
  marks, farm positions and the terrain surface — landing at **5,043 / 5,000**.
  The byte ceiling is untouched and comfortable, at 407 of 500 KB.

  Under the rule written directly above, that is not a fifth amendment to ask
  for: **it is the split coming due.** `index.html` + `carta-map.js` — the
  three custom elements, the vendored d3, `LANDS` and `LAND_TOPO`: roughly
  1,900 lines that are the map layer rather than the app. Two static files is
  still no build, no bundler, no npm, and still something you drop on a host;
  it is only no longer *one file*, which is a brand cost to pay in the open.
  Both of the last two amendments named 5,000 as the number where the
  one-file law comes due, and two independent sessions reached it on the same
  afternoon. **This overage is recorded here as an open debt, not a
  precedent**, and the line above states the true figure rather than a
  comfortable one.

  **The founder's call, made on this PR: land Phase 18 over the ceiling, and
  make the split its own next phase** — the alternative offered was splitting
  first and landing on top, and the reason not to was that the split is a
  change to the headline invariant and deserves its own PR rather than riding
  in on a feature's. So **Phase 19 is the split**, and it is written into
  `ROADMAP.md` as such rather than left to be rediscovered. Until it lands the
  band is *overdrawn, not amended*: 5,000 is still the number, 5,043 is still
  a debt against it, and **nothing new goes into `index.html` before the split
  does.** A phase that adds to this file in the meantime is not spending
  headroom — there is none — it is deepening a debt the project has already
  agreed to pay.

  **One exception was made, in the open, before the split landed.** A small
  fix (a missing correction box on an already-placed café, six lines) came due
  for merge the same week the rule above was written. Holding it would have
  meant a keeper living with a known bug until Phase 19 shipped, for a fix
  with nothing to do with the map layer the split is extracting. The founder's
  call: let it through, and say so here rather than let a quiet six lines look
  like a second precedent. That is what moved the count from 5,043 to
  **5,049 / 409 KB**. The rule stands for everything else — this is the one
  named exception, not a reopening of it.

  **Phase 20 landed anyway, before Phase 19 did — the debt deepened again, by
  an explicit call, not an accident.** It merged into this same rule,
  mid-flight: the ask redesign (a new front-door composer, a narrated wait
  screen, a settle-in animation) was already built against the pre-Phase-18
  file when Phase 18, this rule, and the patch above all landed on `main`
  first. Put to the founder directly rather than assumed — land the feature
  anyway, deepening the debt Phase 19 exists to pay, or hold it until the
  split ships — the call was to land it. `index.html` is now **5,380 lines
  against the still-unmoved 5,000**, up from 5,049; bytes remain comfortable
  at 429.5 of 500 KB. This is not a precedent for a phase after it to add
  more on the same reasoning — the rule stands exactly as Phase 18 wrote it,
  and Phase 19 is still the fix. What changed, twice now, is only that the
  debt it will pay is larger than when it was scheduled.

  **Phase 19 shipped, paying the debt down exactly as scheduled.** The three
  custom elements (`<carta-belt>`, `<carta-plot>`, `<carta-streets>`), the
  vendored `d3-array` + `d3-geo`, and the ground data (`LANDS`, `LAND_TOPO`,
  `LAND_AKA`) with its decoders (`landRingsRaw`, `landTopoRaw`, `landKey`,
  `landAnchor`) all moved into `carta-map.js` — the shape this section named
  in advance, unchanged. The one real design question was the seam: the app's
  own `passportSVG`, `tastedCountryMap`, `landKey` callers and the country/
  region/city chapters all read `LANDS` and the decoders as plain globals,
  the same way `CARTA_LAND_NAMES` already flows the other way (`carta-map.js`
  reads it off `window`, guarded, since it's ledger-derived and stays app-side).
  `carta-map.js` publishes its handful — `LANDS`, `landRingsRaw`,
  `landTopoRaw`, `landKey`, `landAnchor` — on `window` explicitly, as this
  section anticipated, even though classic scripts sharing one page already
  share a global scope; the explicit publish documents the seam rather than
  relying on that alone. Nothing else changed: no rewrite, no rename, no
  restyle — the diff is a move plus that seam, verified by loading the
  passport, a tasted country's contours and a city's drawn shape in both
  paper and dusk, and by the pure harness (still 74/74, sliced out of
  `index.html` exactly as before, since none of the tested functions lived in
  the moved region). `index.html` is back inside the band, per the figures
  above — the debt this section tracked since Phase 18 is closed.

  **Phase 24 is the first small re-crossing since that debt closed.** The
  Visualizer picker (settings sheet, `callVisualizer`, `parseVisualizerShot`,
  `openVisualizerPicker`) added real lines, and a genuine bug was fixed in
  the same pass — a dead, fully-shadowed `openBrewFlow` from before Phase 13
  moved the brew flow into its own screen, still sitting in the file and
  silently overwritten by the real one, deleted on sight (42 lines, no
  behavior change: nothing could have called the dead one). Comments and
  code were tightened on the way in rather than left at their first draft's
  length. `index.html` still lands at **5,012 lines / 333.9 KB** — 12 over
  the line ceiling, bytes comfortable. Recorded here rather than silently
  crossed, per this section's own rule, and named for what it is: eleven
  lines, not the kind of debt Phase 18 or 20 left — a further trim was
  possible only by cutting into the feature itself or fighting the file's
  own established density, and eleven lines wasn't judged worth either.
- **Zero dependencies, zero build.** Vanilla JS, global functions, inline
  `onclick` handlers, string-templating into `innerHTML`, `esc()`/`jsq()`
  discipline. No bundler, no framework, no npm for the app — the single
  droppable file is brand, not accident.
- **Vendored, exactly twice** *(amended at Phase 12 — `ROADMAP.md` tripwire
  2, moved in the open rather than slipped past)*. The passport's projection
  needs real spherical geometry, and freehanding one is the kind of "small"
  maths that is wrong in ways nobody sees. So `d3-array` 3.2.4 and `d3-geo`
  3.1.1 (ISC, Mike Bostock) are **pasted in verbatim from their dist builds**
  — 54 KB, the two modules `geoEquirectangular` / `geoPath`
  and their fit/bounds/centroid actually need; full d3 is 280 KB for three
  calls. This costs the law nothing it was protecting: no npm, no build, no
  lockfile, no fetch, no version resolution, and the file is still one file
  you can drop on a static host. Upgrading is re-pasting a dist file. Since
  Phase 19, both live in `carta-map.js` rather than `index.html` — the count
  is still two, unchanged by the move.
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
                       process?, altitude?, mill?,     // story fields, free text
                       lat?, lon?, geocoded? },        // Phase 18 — where the farm
                                                        // actually is. Stated only by a
                                                        // lookup that named the farm back
                                                        // or a pin the keeper pasted;
                                                        // `geocoded` means asked-once, not
                                                        // found. A REGION never gets one:
                                                        // it is the mean of its placed
                                                        // farms, recomputed on read
                                                        // altitude specified from the turn's
                                                        // start, first offered a field at
                                                        // Phase 13; mill added there, and the
                                                        // road's Milled station reads it
              roastLevel?,                            // Act Two, Phase 9 — light..dark,
                                                        // optional, same law as process/origin:
                                                        // never a rung, never required (§4 below)
              roastDate?, notes?, site?, palette?, archived? }],
  places:  [{ id, createdAt, name, aka?[], city?, lat?, lon?,
              neighborhood?, geocoded?,           // both stated only by a real lookup;
                                                   //   Phase 15's patch also lets `city` itself
                                                   //   be corrected the same way — a café pasted
                                                   //   in with a street address in the City field
                                                   //   is not stuck under it forever
              branches?:[{ lat, lon, hood, city }],// Phase 15 — several of it in one city,
              roasterRefs?, notes?, site?,         //   unanswered until the keeper says which
              palette?, archived? }],              // Phase 16 settles the same way from a
                                                    //   pasted map link when search finds nothing
                                                    //   — no new field, same lat/lon/neighborhood
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
(Phase 13, read by the country road's Milled station), `origin.lat` /
`origin.lon` / `origin.geocoded` (Phase 18 — the same optional, never-required
law as every other origin field; a coffee without them is unplaced, which is
most coffees and is drawn as a fact rather than a gap). `asks` is the one
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
                 belt: topo="on" (LAND_TOPO's contours) + marks="[…]" (the
                 regions, on their farms' ground); streets: terrain="on"
                 (the §7 tile row) + names="on" (a pin whose name is the point).
                 One SVG unit is one CSS pixel — the belt is drawn at the size
                 it is read at, which is what makes it legible on a phone.
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
| Geocode (Nominatim) | placing a café; grounding an ask's answer; reading a pasted map link's real address (Phase 16) | typed city, drawn plot |
| Leaflet + tiles (unpkg, OpenStreetMap) | a street surface mounts | the drawn plot, one line, Retry |
| Leaflet + **terrain tiles** (OpenTopoMap, CC-BY-SA) | a region or a farm surface mounts (Phase 18) | the drawn plot, one line, Retry |
| **The ask** (BYO-key, `api.anthropic.com`) | the keeper taps "Ask" or "Read it for me" | **the brief, copied** |
| **Search for more** (BYO-key, same `api.anthropic.com` row, Anthropic's server-side web-search tool) | the keeper taps "Search for more" on one coffee (Phase 22) | the field stays blank, typed in by hand |
| **Pull from Visualizer** (BYO Basic Auth, `visualizer.coffee/api/shots`) | the keeper taps "Pull from Visualizer" on one brew (Phase 24) | the dials stay exactly as manual as they always were |

**The Visualizer row's auth is the keeper's real account login, not a
scoped key — named plainly rather than softened, and worth recording why.**
Visualizer's own API docs recommend OAuth for "public applications,
distributed integrations, and any workflow exposed to other users" — which
this is, by Phase 25's own design — specifically to avoid third-party apps
collecting a keeper's password. Carta uses Basic Auth (email + password)
anyway, because OAuth's Authorization Code flow needs a fixed, pre-registered
redirect URL and, for a public client with no server, a way to complete the
exchange without a client secret (PKCE) that was never confirmed available.
A static file dropped on any host, or opened straight from `file://`, has
neither a fixed URL nor anywhere safe to hold a secret even if it did. Basic
Auth is the option that actually works from anywhere, at the cost of the
real account password living in `localStorage` rather than a revocable
scoped token — stated in `openVisualizerKey()`'s own copy, not euphemised,
and put to the founder directly before building against it (this doc
originally read "a separate secret token, not the account password," taken
from a search summary never checked against the primary source; the
correction is recorded here rather than quietly overwritten).

The geocode row is unchanged in posture and was sharpened at Phase 15: the
same one call now asks for five results with their address details instead of
one bare hit. A café the lookup knows exactly one of is placed silently and
keeps the neighborhood it was found in. Where it knows several, **Carta does
not choose** — the branches are held on the record and the café asks once,
with the real neighborhoods to pick from, because which branch the keeper sat
in is not a fact any lookup or model holds. Same grounding rule, one rung
more honest: a pin is drawn from a confirmed position or not at all, and now
it can also be taken back.

**Phase 17 tried a fourth touch here and took it back out the same day.**
The first draft gave the Atlas's city thumbnails their own gated Leaflet
mount — booted only while a row was on screen, torn down the moment it
scrolled off, capped and citizenship-minded about OSM's tile policy. It
worked exactly as designed and was still the wrong shape for a 44×60px row:
a live, individually-tappable street map is more than a glance can use, no
matter how carefully it's fetched. The correction — `ROADMAP.md`'s Phase 17
entry has the full account — removed the touch entirely rather than tuning
it: a thumbnail draws a shape now, computed once from the ledger's own
coordinates, nothing fetched. So this table is exactly as short as it
was through Phase 16; the fourth row was tried, and the honest outcome was
that it didn't belong here, not that it needed refining.

The terrain row is **the same row asked for a different picture**, added at
Phase 18 and written down rather than slipped in: the same Leaflet, injected
the same way, the same degrade to the drawn plot, one different tile URL. It
exists because the contours the file already carries are cut against whole
countries — 199 points for all of Colombia — which is honest at a country's
own frame and a lie at a region's. Where the file cannot draw real ground, it
asks for it or shows none; it does not draw a coarse thing and call it
terrain. The tiles are never inverted for dusk (an inverted hillshade reads as
valleys where the mountains are) and Leaflet's own emoji attribution prefix is
cleared, but OpenTopoMap's CC-BY-SA credit is not.

That was the whole list through Phase 21, and **Phase 14 deliberately kept
it that way** for the ask specifically. The obvious way to make the ask's
answers sharper is to let the model search — the chat transcript the phase
was tuned against owed its best lines to a live menu read. That would have
been a fourth row here, and it was declined: the ask stays on training
knowledge, and the prompt instead forbids stating any menu as fact and
makes the model mark every café whose fit depends on one that turns over.
What the screen shows is what Carta can stand behind. **That decision
stands, unreopened** — `callAskModel` still calls `callModel` with no
`tools` argument, so the ask itself still searches nothing.

**Phase 22 is search, wanted for a different reason, added as its own row
rather than a flag.** A coffee's origin story — region, process, altitude —
is a fact to verify, not a recommendation to argue; the honesty risk the
ask's decision was guarding against (stating a café's menu as settled when
it turns over weekly) doesn't apply to a roaster's own product page. So
when "Search for more" was built, it got its own named row above rather
than quietly flipping a flag on the shared `callModel` — exactly what this
section asked for the day it declined the ask's own case. The two calls
share nothing but the HTTP function: `callModel` gained an optional `tools`
argument, only `cfSearchMore`'s own call passes it, and the prompt itself
repeats the same honesty gate in its own words — no source, no value,
never a guess.

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
by construction. The ask is the **one sanctioned channel for an outbound
question**, and every other use of it — menu-photo OCR, and now Phase 22's
coffee search — goes through the same posture: keeper-initiated, keyed by
the keeper, the key on the device and nowhere else, degrading to a manual
path, never required. Grounding rule: a café named in an answer is drawn
only after a real place lookup confirms it exists — Carta never pins a
hallucination; what can't be confirmed is listed, not plotted. The same
honesty discipline governs Phase 22's own answers: a fact with no real
source is left out, not stated.

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
  ranking, scope exclusions, brief size bounds, join/undo round-trips, and
  from Phase 18 the ground helpers: `originPin`, `meanPin`, and `namesBack`,
  the gate that keeps a lookup's region-shaped answer from being pinned as a
  farm). **69 cases.**
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
writing, before it is made in a PR. **Phase 18 did not make it two and a
half:** region-scale relief could have been had by vendoring finer contour
data, and was not — it asks a tile server for it instead, on the row §7
already had, and draws nothing at all when it can't. Elevation data in the
file is still exactly `LAND_TOPO`, cut against whole countries.

**What Phase 18 also declined:** a `regions` collection. Regions are the
obvious place to hang a coordinate, and giving them one would mean matching
region names to nodes — the gentle join, applied to an origin story field,
which §4 says never happens. A region stands on the mean of its own placed
farms and stands nowhere when it has none.
