# CLAUDE.md

Guidance for AI assistants working in this repository.

## What CARTA is

CARTA is a **coffee brewing journal** — a single-page, offline-first PWA for
tracking coffee setups, bags, brews, and cups over time. It ships as a
self-contained `index.html` (all CSS + JS inline, no build step, no external
dependencies) plus an **optional** tiny sync server under `server/`.

Two independent pieces live here:

1. **The app** (`index.html`) — runs entirely in the browser, stores everything
   in `localStorage`. This is the product. It works with zero backend.
2. **The sync server** (`server/`) — an optional, zero-dependency Node.js server
   that lets a small group sync ledgers across devices and view (never edit)
   each other's records.

There is **no build system, no bundler, no package manager for the app itself,
and no test runner for the frontend.** Do not add one unless explicitly asked.

## Repository layout

```
index.html            The entire app — inline <style> and <script>
fonts/                Self-hosted typefaces (Spectral + Libre Franklin, woff2 subsets)
manifest.json         PWA metadata (homescreen install); scope is /carta/
icon-192.svg          App icons (manifest references .png variants at those sizes)
icon-512.svg
README.md             User-facing app docs
CNAME                 GitHub Pages custom domain
docs/                 The design record — reference, never runtime (see docs/README.md)
  VOICE.md            The voice standard every user-facing string screens against
  NORTH_STAR.md, VISION.md, RESOLVER.md, SCHEMA.md, …   the thesis + specs
  CORRECTIONS.md      The grammar for amending a record and setting one down
  DESIGN_BRIEF.md     The redesign commission
  redesign-concept/   The Claude Design prototype (CARTA Redesign.dc.html) — THE
                      reference file for the app's surfaces — plus its handoff
  design-system/      The Carta design system: tokens, components, foundations
server/
  server.js           The sync server — one file, zero deps, JSON-on-disk storage
  worker.mjs          The same server as a Cloudflare Worker — one Durable Object, chunked storage
  wrangler.toml       Workers deploy config (npx wrangler deploy; nothing installed into the repo)
  test.js             Zero-dep endpoint tests (spawns server on ephemeral port + temp dir)
  test-worker.js      Same matrix against worker.mjs, run in plain Node with a storage mock
  package.json        npm start / npm test scripts; engines: node >=18
  README.md           Server deployment + API docs
  Dockerfile          node:22-alpine, non-root, /data volume, /health healthcheck
  docker-compose.yml  Docker deploy
  fly.toml            fly.io deploy (TLS terminated by fly)
  Caddyfile.example   TLS reverse-proxy example
  carta-sync.service.example   systemd unit example
```

## The app (`index.html`)

### Editing conventions

- **Everything is inline in `index.html`.** Edit the `<style>` and `<script>`
  blocks in place. Keep the file self-contained — no external `<script src>` /
  `<link>` to CDNs. The whole point is a single file you can drop on GitHub
  Pages.
- The JS is written in a **terse, dense, single-quote style** with many
  one-line helper functions and multi-statement lines. Match it — don't
  reformat existing code into a different style. Section dividers look like
  `/* ============ store ============ */`.
- It's **vanilla ES-modules-free JavaScript** using global functions. UI wires
  up through inline `onclick="fnName(...)"` handlers, so most functions are
  intentionally global. Rendering is string-templating into `innerHTML`.
- **Always escape user data** rendered into HTML with `esc(...)`. For values
  interpolated into inline `onclick` string arguments, use `jsq(...)`.
- After mutating state, the pattern is `save(); ...; render()` (or `go(tab)`).
  `render()` re-renders the current tab; `go(tab)` switches tab and renders.

### Architecture map (by section, in script order)

- **store** — `localStorage` persistence. Per-user data lives under
  `carta.v1.<userId>`; the user registry under `carta.users`. `D` is the active
  ledger object; `load()` / `save()` read/write it. `blank` is the empty ledger
  shape. `readOnly()` / `guard()` block writes when viewing another user's
  ledger.
- **the pen** — who may write the *shared* record (the Register + the catalog),
  temporarily one hand: the founder's. `isAdmin()` answers it (the server's
  `SYNC.founder` flag when synced; else the device-local claim in
  `carta.pen.v1`, taken up under the Desk → The pen); `penGuard()` fronts
  every deliberate shared-record write — reach amend/withdraw, the café entry
  editor, the claim ceremony, the standing, merge/split, propose-a-sighting,
  curator ingestion. Both servers enforce it too: `PUT /api/cafes` and
  `PUT /api/catalog/:kind` are founder-only (403 `pen-held`; the first account
  registered is the founder) and the client pulls shared docs for everyone but
  pushes only as the founder. **The founder's desk** (`openDesk`, the
  Desk → The pen — distinct from the Desk room on the bar) is the one door for
  entering the shared record cleanly.
  Everyone always writes their own ledger; implicit write-path stamps
  (`catStamp*`, `regUpsert` blank-fills) still run locally and simply never
  leave a non-founder device. Temporary — group curation returns with the
  proposed→stood moderation ceremony.
- **the grammar** — `docs/redesign-concept/STREAMLINED.html` is the reference
  file for how a CARTA screen is built, and its component layer is now the
  app's. Use these, not a one-off: `.eyebrow` (quiet label — never the ember),
  `.display` (the screen's one big serif line, its `<em>` italic), `.lede` (the
  sentence under it), `h2` / `.section-head` (a tracked label under a hairline),
  `.rowlink` (`<span><span class="t">…</span><br><span class="m">…</span></span>`
  + `<span class="go">→</span>` — the one navigation primitive), `.card` + `.kv`
  (a sunk block of key/value rows), `.note` (an aside after a block: a hairline,
  then the keeper's voice), `.back` (a back that names where it goes), `.res` +
  `.meter` (the resolution readout — the door before a bind, a green's page
  about itself), `.road6`/`.aggrow` (the road at lot and facet scope), `.chip`
  (`.on` is a firmer line, **never** a fill), `.btnrow` (two actions side by
  side). Figure/ground: the app column is `--surface-card` (the leaf), so a
  `.card` is `--surface-page` and reads sunk into it. Buttons speak in sentence
  case. Screens open in one order — back · eyebrow · display · lede · the
  reading · the sections · the note.
- **the shutter** — `LEGACY_ON=false` (router section) temporarily hides
  pre-redesign surfaces the prototype (`docs/redesign-concept/`) does not
  carry: the matching's cold-start, worth-the-walk and discover-map door on
  the Atlas, the circle stream, taste affinity, beans worth chasing, the
  cross-context read, the Desk's by-roaster/by-lot folds and quick start. Nothing
  is deleted — flip the flag and every one answers again. The Record's
  bookkeeping (wants, skips, leans) stays visible regardless.
- **the strike** (`docs/CORRECTIONS.md`) — how a record is unmade. Three verbs
  beyond making: **amend** (reopen its own form), **put away / retire** (it
  leaves the working surfaces, the record stays whole — a finished bag, a
  grinder you sold), **withdraw** (struck from the record). One irreversible
  door, **erase**, in one room. A strike is *itself a record* —
  `{id:'strike:<ref>', ref, coll, at, by, rec, via, restoredAt}` in `D.struck` —
  and the withdrawn body is **spliced out of its live collection** while the
  strike stands. That is the point: a struck bag is not in `D.bags`, so it
  cannot leak into a count, a plate, a map or an export because a read path
  forgot a filter; the ~160 direct ledger reads were never touched. Both the
  strike and the restore are **additions** to one entry (`at` / `restoredAt`,
  each nudged by `afterIso` so ties can't form), because an id-union merge only
  propagates additions — liveness derives as `at > restoredAt`, monotone and
  order-free, exactly like `mergeSightings`. `strike`/`unstrike`/`eraseStruck`
  are the model; `strikeDeps` is the cascade (a coffee carries its brews and
  their cups; a brew carries its cup; a café cup carries its Pour; **a Setup
  never cascades** — it is a tool, not an event, so a Setup with brews retires
  instead), `strikeFollows` names it in full before the tap. UI: `openCorrect`
  (one sheet, every kind), `struckRoomHTML` (Desk → *What you set down*, the row
  appearing only once filled), `openStruckItem`, `openEraseAll`, `openBrewList`
  (a coffee's brews — the surface that did not exist), `openCorrectPlace` +
  `regWithdraw`/`regRestore` (the Register entry, pen-gated and struck on the
  shared document). `mergeStruck` in the sync; `regLive`/`regEntries` are the
  Register's read door (`regFind` is the identity door — `regUpsert` must reach
  a struck entry so a later sighting reuses its id).
  **No browser dialogs.** `confirm()` is gone from the app entirely.
- **the Register** — the shared café ledger ("Jane's Fighting Ships, for
  cafés"): one canonical entry per café, stored *outside* the per-user keys
  under `carta.register.v1` (`REG`), shared by every user of the device and —
  via `/api/cafes` — every keeper on a sync server. `regByName` looks a café
  up; `regUpsert` writes (sparse by default: sightings fill blanks, never
  erase; `{full:true}` for the café editor); `regSeed` sweeps every readable
  ledger into it at boot/import/refresh. Entries carry provenance
  (`firstBy`/`firstAt`, `by`/`updatedAt`).
- **the reach** — a café classification of depth (○ Counter · ◎ House ·
  ◉ Roastery · ● Origin) compiled from signed `sightings` on Register entries.
  Keepers attest *facts* (`bag`: unnamed/roaster/lot/farm; `seen`: inhouse/
  methods/answers/story), never depths; `reachCompile` derives the reading (the
  deepest fact standing; per fact the newest standing sighting carries).
  `regSight` enters a line, `reachWithdraw` strikes one (no confirm — nothing
  erases), amend supersedes your own line via `{supersede}`. UI: `reachBadge`
  (mark pref `reachMark`), `openReachPrimer`/`openReachAmend`/`openReachRecord`
  sheets, a depth lens in Find, sighting rows in the Record tab.
- **domain** — pure helpers: roast levels + accent color, rest-window math
  (`restWindow`/`restState`/`daysOff`), temperature conversion (`c2f`/`f2c`),
  time parse/format (`parseTime`/`fmtTime`), descriptor/café constants, small
  aggregations (`modeOf`, `avgHedonic`, `shopAgg`).
- **version tracker** — `APP_VERSION`, `CHANGELOG`, and the "What's New" sheet
  shown to returning users on a version bump. **Bump `APP_VERSION` and prepend a
  `CHANGELOG` entry when you ship a user-visible change.**
- **router** — three rooms, always on the bar: **Atlas · Record · Desk**
  (`tabsFor`, tab ids `atlas`/`trace`/`ledger`), and one door — `＋ A coffee`
  on the masthead of every screen. Today, Home and Café became channels, not
  rooms — `TAB_ALIAS` keeps the old ids (`today`/`field`/`cafes`/`circle`)
  answering, all pointing at the Atlas. `go()`, `render()`; each tab has a
  `vXxx()` view returning an HTML string. `screenSub()` names the screen in the
  masthead's second line (the prototype's `SUBS`). Overlays over the tab:
  `doorOn` (`vDoor`, a screen not a sheet), `placeView` (a café's page),
  `pageView` (`{kind:'lot'|'roaster'|'plate',id}` → `vLotPage`/`vRoasterPage`/
  `vPlatePage`), `discOn` (`vDiscover`), `curateOn` (`vCurate`). The screen-settle animation
  (`.ca-screen`) plays only when the screen key changes, never on a repaint.
  Overlays walk into each other, so back is a shallow stack: `pageStack` +
  `pagePush()` (called by `openLotPage`/`openRoasterPage`/`openPlate`/
  `openPlace`) and `pageBack()`, which restores a page, a place or the chart.
  `go()` clears it — a room chosen from the bar is a fresh walk.
- **the coffee in hand + the matching** — `inHandHTML()` heads the Atlas (the
  coffee in your hands, its road, *Open the green* / *Brew it*, *or start from
  the shelf*); `nearTaste()` is the reading over the atlas argued by the
  keeper's own record, and it surfaces on the **Record** (a keeper's overlay
  belongs there), always with its reasons. `vToday` is retired. The matching
  engine is unchanged: `matchOf(shop)` scores an unkept place per
  spec v1 (trait 60 · proximity 20 · circle 20) and always returns its
  `signals` — a score is never shown without reasons. The signal
  (`signalTraits`) is argued by kept places' tags/reach facts plus the three
  cafés a new keeper names (`prefs.signal` — the cold-start now lives on the
  Atlas); `discCands()` ranks candidates; `vDiscover` remains the full
  map/list reading, reached from the Atlas. Until three café cups are kept the
  read speaks in bands (`lowConf`), not numbers. Saves stamp `prefs.wantAt`
  and age into a gentle ask on the Record (`recordKeepingHTML`); skips
  (`prefs.placeSkips`) step a place back 14 days and fade by 21; "fewer like
  it" leans (`prefs.traitLeans`) tip a kind down on the same curve, capped in
  effect at three.
- **the Atlas tab** — the reading room (`vAtlas`): search over lots, roasters,
  growers and the Register (`atlasSearchIndex`); the chart hero; the two-frame
  map over the whole anchored scene (`atlasLotIds` → `atlasFrames`); the
  **interlude** (`readSeason`/`seasonState` — "Read the season for me"
  composes once on a tap, the season line drawn through taste-ranked pins,
  reasons via `seasonReasons()`, instant under reduced motion, never
  auto-played); the season's lots with standing chips (`atlasLotCard`); the
  hands; the matching's worth-the-walk; the stream; *Propose a sighting*; the
  Chart No. 1 curator door.
- **the pages** — `openLotPage`/`openRoasterPage` set `pageView` and render
  full screens (`vLotPage`/`vRoasterPage`), not sheets. The lot page: the
  road (grown → processed → milled → roasted → poured, only stages the record
  holds), identity columns with primer taps, the standing (three axes, unread
  until their own evidence stands), availability (pours), the roasts by hand,
  the corpus (own brews — grind shown only within one Setup), your overlay,
  and a Corrections & identity fold (binds, merge/split, the standing entry).
  Its `pageHero` title names the green and its variety only — the origin line
  under it already carries the place. The roaster page carries the same
  reading at its own scope (the aggregate road across its greens, the origin
  plot). `openBatchPage` keeps its sheet.
- **the primers** — the `PR` map (term → `{t,b}`) and `openPrimer(key)`, a
  second sheet layer (`#primer`, stacks above any open sheet). Every new
  badge/chip/term ships its primer in voice the same pass; `exBtn()` renders
  the dotted tap.
- **Act III · the signed page** — the claim ceremony (`openClaim` →
  `renderClaim`, three steps: the record as it stands → proof of control →
  scoped signing) writes `signed{by,at,site}` onto the Register entry (café)
  or the roaster's catalog node; corrections (`penFacts`) are first-party
  lines shown in the *Your facts* card (`penCardHTML`), scoped and
  supersedable. `claimBlock()` renders the offer or the pen on café and
  roaster pages. Signing never touches the reader's overlay.
- **propose a sighting** — `openProposeSighting` → `proposeLook`: a shared
  printed code binds outright, the fingerprint scorer (`scoreLot`) asks, a
  same-name-different-process guard refuses to merge on the string, and
  nothing-like-it forks a new lot. The sighting lands as an authored line
  (`proposeRec`) bound via `bindRecordTo` or forked onto its own green.
- **views** — `vAtlas`, `vBags` (the shelf — the Coffee step of the home-cup
  arc, with put-away/restore), `vSetups` (live Setups, then the retired), `vTrace`
  (Record), `vDesk` + its `deskSection(k)` panels (`deskAtlasHTML`/
  `deskRecordHTML`/`struckRoomHTML`/`deskPrefsHTML`/`deskManualHTML`, plus
  `vAdminSection`/`vSyncSection`/`vUsersSection`),
  `vDoor`, plus the page overlays and detail sheets. `vToday`/`vMore`/`vField`/
  `vCafes`/`vCircle` are retired; their work lives on the Atlas, the Record,
  the Desk and the pages. **The Desk opens one section at a time** (`deskOpen`)
  — rows, not screens; the shelf and the Setups are rooms of their
  own, so `deskGo` navigates to them rather than nesting them. `DESK_ROWS` is
  filtered per state — *What you set down* appears only once something is (an
  empty drawer is not a row), so the lede counts the rows it actually drew.
- **sheet plumbing** — bottom-sheet modal (`openSheet`/`closeSheet`) with
  drag-to-dismiss.
- **dial component** — the tap / hold-to-accelerate / tap-to-type numeric dials
  used in the brew form (`dial`, `nudge`, `holdStart`, `editDial`). Grind dials
  are per-Setup scaled; temp dial has a °C/°F corner toggle.
- **segmented / hedonic / descriptors** — selection-control state.
- **forms** — `openBagForm`/`saveBag`, `openSetupForm`/`saveSetup`.
- **the door** (`SURFACES.md` §1) — the paste-first way in: `openDoor` → paste →
  confirm → bind, one sheet. `doorParse` reads the text on the device against
  vocabularies the build already carries (`DOOR_COUNTRIES`/`DOOR_REGIONS`/
  `DOOR_VARIETIES` fold in `PLACE_ALIASES`; farm vs station split by
  `DOOR_FARM_RE`/`DOOR_STATION_RE`, never guessed); `doorResolve` says
  `lotIdentity`'s grain and `lotKeyOf`'s ≥2-of-6 threshold out loud; facts are
  strikeable chips (struck, never deleted). `doorBind` is the only branch —
  shelf/brew mint a bag through the same `catStamp*` + retirement path `saveBag`
  walks, pour hands off to `openCafe` prefilled, noting lands a chart-less
  `authored` record and opens the lot page. `doorStampActors` is the origin-actor
  split: tags the producer node's `producerKind` and gives **processors** their
  first write path (`lot.processorRefs`, blanks-only). `doorStampAltitude` lands the
  **height** on the green (`lotSetAltitude`) — the paste's altitude was always read
  and always shown as a strikeable chip, but the bind used to spend it as a sentence
  in `notes` where nothing could read it back; harvest still goes there, having no
  column yet. The bind step also takes
  the **roast date** (`doorRoasted`) — the one fact a paste can never carry and
  the rest window can't read without; asked once, optional, never invented. The
  typed forms stay as the fallback and the edit surface.
- **the road + the plate** (`SURFACES.md` §2) — one reading, aggregated:
  `lotRoadStations`/`road6HTML` draw the six honest stations (grown → processed →
  milled → roasted → poured → read; hollow marks, dashed connectors — the gap is
  the product) on the lot page and the Atlas's coffee-in-hand; `aggRoadHTML` counts
  them across a set of greens. A plate is `pageView={kind:'plate',fk,fv}` →
  `vPlatePage` (`openPlate`, facets from `plateFacets` under Atlas → "Cut the
  atlas") — a query over lots, never a stored collection, and one law: unread on
  a facet is counted, never silently hidden. **One reading, five scopes**: the
  road counts at lot, facet (`vPlatePage`), roaster (`vRoasterPage`), grower
  (`openProducerPage`) and venue (`vPlace`, over `poursHere`) scope, and the plot
  is `originFrameHTML(atlasGraph(ids),{heading,minMarks})` — the origin frame
  factored out of `atlasFrames` and pointed at any slice. `minMarks:2` keeps a
  one-dot box off the narrow scopes; the hand-off sentence says it better. Each
  station's label is terse by design (the region, not "region, country"; the
  process family sentence-cased via `sentence()`) and clamps to two lines with
  the whole text on the mark — the page states it in full a line below.
- **the terrace** (`SURFACES.md` §2, the atlas's *second projection*) — the map is
  a **plan** and answers where a coffee came from; it cannot answer how high, so
  the terrace is a **section** and does. `terraceHTML({band,inner,others,label,draw})`
  draws a scale (`terrScale` — a 200/400 m contour interval, a 600 m minimum span so
  one green never fills the frame and implies a range it never stated) and places
  marks on it; `altReading(band,others)` states the comparison the only honest way
  two *ranges* can be compared — wholly below, wholly above, or overlapping, never a
  midpoint standing in for a band — always with its denominator, and the greens that
  state no height counted out loud beside it. `aggTerraceHTML(lotIds,heading,tail)`
  is the set scope (the span, with each green's band inside it), on the plate, the
  roaster and the grower; the lot page draws its own band against every other green
  the atlas holds one for. Three ink weights carry the drawing: **dotted** is the
  ground, a **hairline** is another green, the **sunk zone** is this one — *dashed
  is deliberately unused here*, because in this app a dashed line means coarse (the
  road's gap, a centroid pin) and a height another green actually stated is held.
  A stated range draws as a band and a single figure as one rule (`.pt`): the
  geometry never widens a point or narrows a range. Monochrome, never the ember,
  and it never ranks. The datum is `lot.altitudeMasl` — see *the height*, below.
- **brew flow** — `openBrew` → `saveBrew` → `openImpression` → `saveCup`.
- **café** — logging café cups (`openCafe`/`saveCafeCup`, with optional
  structured traceability), the café passport (`shopAgg`, `vCafes`, favorites),
  and per-café profiles (`openCafeProfile`: a signature colour — pulled from the
  café's website via `siteLookup` (`paletteFromColors`) — from which
  `cafeColors`/`cafeVars` build a whole themed surface — the café's detail page
  and every cup in it wear that palette. The same `siteLookup` read also fills
  the rest of the entry from the site: its description (`siteLine`) becomes the
  café's note, the name it states (`siteName`) is surfaced, and it chains
  `geoLookup` (OpenStreetMap Nominatim) so the address surfaces too — filling
  blanks only, never overwriting typed values). The home-vs-café comparison is
  `crossContext`. A café's own page opens on a banner (`cafeBannerGrad`) — a
  gradient drawn from its derived hue, or a neutral roast tone unread — never
  the app's ember, which stays reserved for the current action and the score.
  Find's search plots pinned results on a map (`mapProject`/`mapHTML`): real
  lat/lon scaled to fit the box, filled dot for a place you keep, dashed for
  one you don't. The drawn plot is the floor; the **street map** section lays
  real streets behind it when tiles can be fetched (see below).
- **street map** — the live layer behind every map surface. MapLibre GL +
  OpenFreeMap vector tiles (OpenStreetMap data), lazy-loaded from CDN only when
  a `[data-smap]` surface is on screen and the network answers; the style
  (`smapStyle`) repaints every OSM layer in CARTA's theme tokens (`smapInk`),
  both paper and dusk. The drawn plot renders first and stands alone offline —
  streets fade in (`.smap-live.in`) only once tiles land; a quiet note with
  Retry appears on the tall discover map when they can't (`smapNote`). Surfaces
  register configs via `smapReg`/`_smapCfg`; `render()` destroys live maps
  (`smapDestroy`) before repainting and re-mounts after (`smapMount`); cameras
  persist across repaints (`_smapCam`). Pins are HTML markers wearing the same
  `.pin` classes as the drawn plot. The café-page locator (`placeMapHTML`)
  tints only its pin to the café's hue (near-neutral floors to the ember);
  the basemap never moves. Edges (lot → roast → bar) draw as a GeoJSON line
  layer over the tiles (`smapEdges`, monochrome, re-added on restyle) with the
  drawn-plot SVG (`svg.atlas-edges`) as the offline floor.
- **the atlas map** — the lot-keyed graph drawn geographically (VISION step 4),
  in **two frames** (`CHARTS.md`: one projection cannot hold a front door and a
  country). `atlasGraph` walks the greens into nodes — producers at a coarse
  origin, roasters in their cities, venues on their streets — and edges (each
  grower→roaster, each pour's roaster→venue), carrying `city`, `grain`, and
  `listed` (the coordinate-less, **by name**). **Scenes and charts are derived,
  never stored**: `scenesOf` single-link-clusters located roasters+venues under
  `SCENE_KM` (~40 km); `chartsOf` groups scenes under keeper-given names
  (`prefs.charts`, `openChartName` — every ungrouped scene is its own chart);
  the old `chart:'la'` stamp is retired unread, `CHART1` surviving only as the
  LA roster guide. `atlasState` is the one resolution both layers read;
  `atlasFrames` renders: the **chart frame** (`atlasCls` pins, street tiles,
  roaster→venue edges only, the altitude ladder — region altitude draws scene
  marks carrying counts, tap to drill; scene altitude draws pins at their own
  grain) and the **origin frame** (producers at region/country grain, drawn
  plot only — no street layer — coarse marks hollow+dashed via `grainCoarse`,
  the hand-off to the chart stated in words, never a line across the sea).
  Lenses (`atlasLens`/`atlasLensSet` — scenes, kinds, the road, kept) narrow,
  never sort, and say what they hid. `mapProject` takes an explicit bbox;
  `mapMerge` folds pins the plot can't separate into one counted mark — and,
  given a `sameKey`, marks that *read* the same too (two region centroids
  labelled alike are one coarse mark; drawing them apart claims a precision the
  grain never had). An actor already drawn as a located producer is not also
  listed for want of a coordinate;
  `smapView` derives a `minZoom` camera floor; the camera keys on the chart
  (`atlas|<chart>|<scene>`), not the pins. Every mark taps its 4a page
  (`openProducerPage`/`openRoasterPage`/`openPlace`), so map and pages are one
  walk. Coordinates are honest and additive: a venue's real Register point, a
  roaster's `city` point, a producer's `region`/`country` centroid, each with a
  `geoGrain` — **never a farm-precise pin**; a node with no coordinate lists
  rather than lies. Filled from the optional keyless lookup (`geoOne` — which
  refuses an ambiguous name rather than taking `list[0]` blindly) at author
  time through `atlasGeoFill` (blanks-only, online-only, offline-degrading —
  the demo `devSeedChart` stamps demo coordinates directly, never the network);
  corrected through `openGeoFix` (pen-gated, on roaster/producer pages —
  candidates offered, unpin allowed, `{full:true}` overwrite). Renders
  read-only for a stranger; the drawn plot is the floor, the street tiles the
  enhancement. `vCurate` keeps its **Map / List** toggle (`atlasView`).
- **the standing** — a coffee's rarity and caliber, compiled from sourced facts
  (VISION step 5), reborn from the old café reach onto the coffee it always
  belonged on. Three independent axes, never merged into one verdict:
  **caliber** (`lotAddCaliber`, appended to a lot's `caliber[]`, struck-not-
  deleted) admits a score only through the source ladder (`CALIBER_TIERS`,
  1a competition · 1b estate auction · 2 named cupper/lab · 3 credentialed
  keeper), enforced at save by `caliberResolveTier` — an unnamed source
  downgrades silently to tier 4, CARTA's one poison line: recorded as a claim,
  never admitted as the read; **rarity** (`lotSetRarity`, blanks-only —
  `sizeKg`/`sizeBags`/`auctionPrice`/`scarceVariety`) reuses `lotHands` for
  "how narrowly carried," never a new field; **traceability** is the existing
  `grain` (see *the grain* below), reused, not reinvented. `lotTier(lot)` folds all
  three into the compiled read — named apart from `compile()`'s own
  `standing` key (the identity sightings array) to avoid colliding with it.
  Surfaces on `openLotPage` beside the grain/identity lines, monochrome, each
  axis reading *unread* until its own evidence stands; `openLotStanding`/
  `saveLotStanding` are the entry sheet, gated by `readOnly()` exactly like
  the page's other corrections. `devSeedChart` demonstrates both a real
  sourced reading and an unnamed claim, clearly demo-labeled.
- **the grain** — how finely a green's origin is proven: **one spatial ladder,
  five rungs** (`country` · `region` · `station` · `farm` · `green-lot`), derived
  in `lotIdentity` and read through `GRAIN_READ`/`grainRead`, `DOOR_GRAIN` and
  `grainPrimerKey`. A record rests on the **coarsest rung it can prove** — the
  ladder reads evidence, never field-presence. `green-lot` needs a lot identity
  (a printed lot name or a hard-ID), not a mere producer name; `farm` and
  `station` are told apart by `actorKind` — the door's tag (`producerKind`), the
  lot's `processorRefs` edge, or the shared `FARM_RE`/`STATION_RE` vocabulary,
  the mill tested first. **An unmatched name buys no rung** (SURFACES' law:
  never guessed into a tier). The **season is not a rung** (MODEL_QA A5) — the
  harvest is its own column, `fingerprint.harvest.year`, read by `harvestYear`
  and weighted 0.18 by the scorer. Grain is a rule's output, not an attestation,
  so `lotRederive` writes it **through** on every re-derivation (blanks-only
  would freeze the first guess); the year fills blanks only. The two pre-6.1
  values (`station-season`, `region-grade`) stay readable for an unswept record.
- **users** — multi-user management (add/switch/view/delete), read-only viewing
  of other users' ledgers.
- **export / import** — two copies. The **ledger export** (`ledgerData` →
  `renderLedgerHtml` → `downloadLedger`): one self-contained HTML page on
  CARTA paper stock, the reader's overlay only, real token hexes inlined (the
  one sanctioned place tokens resolve to literals), the machine-readable
  record embedded as `carta.ledger/v1` JSON; a persistent save panel
  (`exportedFile`) guarantees delivery, and `readLedgerFile`/`parseLedger`/
  `openReadback` read a ledger back — validated, read aloud, never merged
  (any string-built HTML must guard its `</`+`script>`). The **working copy**
  (`exportJSON`) stays the full-fidelity JSON backup; import as a new user or
  replace.
- **sync** — optional server sync (see below).
- **quick start / what's new / welcome / boot** — onboarding guide, changelog
  sheet, the one-screen welcome (three doors — *I read, mostly* → Atlas ·
  *Someone else makes it* → Atlas · *I make my own* → Atlas, the coffee in
  hand; sets depth, never closes an open room), and the boot sequence at the
  bottom of the script.
- **the motion charter** — `--mo-fast/base/considered/ease` tokens in the
  `<style>` block; `ca-settle`/`ca-pins-in`/`ca-draw` keyframes; *used more,
  moves less*; `prefers-reduced-motion` stills everything to its end frame
  and `reducedMotion()` short-circuits the interlude in JS.

### Data model

The ledger (`D`) is a plain object with these arrays. Records carry an `id`
(`uid()`) and `createdAt` ISO string; edited records also get `updatedAt`.

- **setups** — a grinder + brewer combination. Key fields: `name`, `grinder`,
  `brewer`, `basket`, `papers`, `water`, and the grinder's real scale
  (`grindMin`, `grindMax`, `grindStep`). **Grind is only comparable within one
  Setup** — each Setup's grind dial moves the way that grinder does. Also carries
  `grinderRef`/`brewerRef` — refs into the canonical **Gear** catalog (the shared
  grinder/brewer model). The grind scale stays per-Setup, untouched; Gear is what
  transfers, the Setup is how one keeper's dial moves. `archived` **retires** a
  Setup (`retireSetup`) — it leaves the brew form's picker while every brew read
  against it stays exactly as readable. The picker still offers a retired Setup
  when *that* brew was pulled on it, so an amend can never silently re-point a
  grind to a different grinder.
- **bags** — a bag of coffee: `roaster`, `name`, origin fields (`originCountry`,
  `originRegion`, `producer`, `variety`, `process`, `lot`), `roastDate`,
  `roastLevel` (index into `ROAST_LEVELS`), `price`, `archived`, plus its `site`
  (the roaster's/bag's website) and a `palette` **read from that site**
  (`readBrand` → `paletteFromColors`) → `{h,s,l,brand,dark}`, which themes the
  bag's detail page and its shelf row via `cafeColors`/`cafeVars`. A legacy
  `photo` may linger on older records but is inert (branding photos are retired —
  no picture is captured or stored).
- **brews** — one brew: `bagId`, `setupId`, `technique`, `grind`, `doseG`,
  `waterG`, `tempC` (stored canonically in °C), `timeSec`, `instrumentation`.
  Also carries `roastRef` and `lotRef` — the spine edges brew → **Roast** and
  brew → **Lot**, stamped through its bag (`brewStampRoast`/`brewRepoint`), so
  a green's corpus stands even after the bag is gone.
- **cups** — a tasting. `kind` is `home` (linked to a `brewId`/`bagId`) or
  `cafe` (with `shop`, `city`, `style`, `drink`, `roaster`, `origin`, `price`,
  `again`, plus optional structured traceability aligned to bags —
  `originCountry`, `originRegion`, `producer`, `variety`, `lot`, `process`).
  `hedonic` (1–9), `descriptors[]`, `notes`. A café cup may also carry the beans'
  brand read from the roaster's website: its `site` and a `palette`
  (`readBrand`), which tints the cup's row and detail. A legacy `photo` may
  linger on older cups but is inert. A cup is a **Reading over a Preparation**:
  `prepKind` is `brew` (home — `brewRef` = the brew) or `pour` (café — `pourRef`
  → a Pour). Refs into the catalog spine (`roasterRef`/`lotRef`) sit beside the
  flat text, which retires onto the node once one stands.
- **pours** — the café availability edge: a green seen at a venue, dated and
  signed, its recipe unknown and never invented. `{id, roastRef, roasterRef,
  lotRef, venueRef, shop, at, by, cupRef}`, id keyed deterministically
  (`pour:<cupId>`) so every device and every re-derivation lands the same record.
  `roastRef` resolves (`pourRoast`) to the one standing roast of that roaster on
  that green — two candidates and it stays null, resolved never guessed.
  A local projection of café cups (`cupPrepRepoint`/`catStampPour`), merged by id
  in sync; a removed café cup tombstones its pour.
- **cafes** — per-café profiles keyed by shop name (`saveCafeProfile` writes
  them; reads via `cafeProfile` resolve **Register-first**, falling back to
  this per-user copy, which remains for export/sync back-compat and to seed
  Registers elsewhere): the café's `site` (its website); a
  `palette` **derived from the site's declared colours** (`paletteFromColors`)
  → `{h,s,l,brand,dark}`, theming the whole café
  surface via `cafeColors`/`cafeVars` — only the palette is kept, never a hotlinked
  logo, so the record stays self-contained and offline; a legacy `accent` string
  kept for back-compat (old records with only `accent` are re-themed through
  `palOf`); `notes` (the café's line, often filled from the site's description);
  location (`address`, `lat`, `lon`, from the optional online lookup) and
  `neighborhood` (filled from that same lookup when it names one — blanks
  only, typed wins); and `tags[]`, freely typed. A legacy `photo` may linger
  on older records (branding photos are no longer captured or rendered) but
  is otherwise inert. Merged in sync like any other collection.
- **cafeFavs** — favorited café shop names.
- **authored** — the curator's directly-authored roasts (Act II ingestion). A
  bag-shaped record — `roaster`, origin fields, `hardIds`, a roast
  (`name`/`roastLevel`/`roastDate`), plus `chart` and `curator` — but **no brew,
  no shelf, no cup**: it carries no `kind`, so every shared bind/repoint path
  treats it as a bag (it has a roast). `authorRoast` seeds roaster+lot+roast
  catalog nodes through the same `catStamp*` machinery and runs `resolveLot`
  exactly as a bag's origin does, so the atlas fills pre-adjudicated. Swept by
  `catSeed`/`catRepoint` like a bag; merged in sync like any collection.
- **struck** — the strikes (see *the strike* above): one entry per set-down
  record, carrying the withdrawn body whole. Merged by `mergeStruck` (max `at`,
  max `restoredAt`, independently); `mergeLedgers` then subtracts every actively
  struck ref — and its carried pour — from the live collections. That
  subtraction is **derived every merge, never written as a tombstone**: a strike
  must stay undoable, and a tombstone is the one thing that cannot be taken
  back.
- **deleted** — tombstones so *erased* records stay erased across a sync merge.
  Written only by `eraseStruck` (and `deleteUser`'s whole-ledger removal).
- **prefs** — per-user preferences (`tempUnit`, `hideTimer`, …) via
  `getPref`/`setPref`. The matching's bookkeeping lives here too: `signal`
  (the three named cafés), `wantAt`/`wantAsk` (save dates and aging asks),
  `placeSkips`, `traitLeans`, `findSess` (the map session), `gradSeen`, and
  `charts` (the keeper's scene groupings — `[{name, sceneKeys}]`, a reading
  convenience over derived scenes, never a synced fact about coffee). Sync
  merges prefs shallowly, local key wins — never wipe them in a merge.

Outside the ledger, the device keeps **the Register** (`carta.register.v1`):
`{version, rev, dirty, entries, deleted}` where each entry is a canonical café
— `id`, `name`, `city`, `neighborhood`, `address`, `lat`/`lon`, `palette`/`accent`,
`notes`, `tags[]`, provenance (`firstBy`/`firstAt`, `by`/`updatedAt`), and `sightings`
(the reach: `{id, by, at, bag?, seen?[], withdrawnAt?, supersededAt?}` — signed
lines that only ever accumulate; strikes add a date, nothing is removed, and
`mergeRegister` unions them by id so sync never loses a line). It is shared by
all users on the device and synced as one shared document (founder-writable
for now — see *the pen* above).

Beside the Register the device keeps **the catalog** (`carta.catalog.<kind>.v1`) —
the spine upstream of the café, the Register's envelope generalised to eight kinds
(`producers`, `processors`, `aggregators`, `lots`, `blends`, `roasters`, `roasts`,
`gear`). `loadReg`/`saveReg`/`mergeRegister` became `loadDoc(kind)`/`saveDoc`/
`mergeCatalog`; `regUpsert` became `catUpsert(kind, key, …)` (same sparse-fill,
blanks-only law); `reachCompile` became `compile(entry)` (fold sightings into a
reading). Each doc is one shared rev/409 document at `/api/catalog/:kind`
(both servers; founder-writable for now — see *the pen*). The **lot** carries its identity columns — `grain`, `scope`,
`hardIds[]`, `fingerprint{}`, `lineage{}`, `processingBatchRef` — beside its flat
origin (the read/retirement surface), never over it. It also carries **the
standing** (VISION step 5) — `caliber[]` (append-only records, each
`{score,protocol,cupper,event,date,tier,src,by,at,withdrawnAt?}`) and blanks-only
rarity fields (`sizeKg`/`sizeBags`/`auctionPrice`/`scarceVariety`) — additive
beside identity, never touching `lotKeyOf`/the resolver/thresholds; see *the
standing* above. It also carries **the height** — `altitudeMasl:[min,max]` (min ===
max when one figure was stated) with its provenance (`altitudeSrc`/`altitudeBy`/
`altitudeAt`), plus `altitudeAlt[]`, the bands that *disagree*. `altValid` bounds it
to the coffee belt (200–3,000 m); `altParse(text)` reads it off a paste as numbers —
the door's chip is built from those, so display and record can never diverge, and a
thousands separator is part of the figure (a bare `\b\d{3,4}` read "1,930 masl" as
930, a number no page ever said). `lotSetAltitude` is blanks-only exactly like
`lotSetRarity`: the first band stands and a second is *carried, not resolved* —
appended with its author, surfaced on the lot page beside the standing one, and
unioned across devices by `mergeById` in `mergeCatalog` as `hardIds` are. **Height
is not identity and never becomes it**: outside `lotKeyOf`, outside the fingerprint,
never a coordinate, and not a fourth standing axis — it is a growing condition, so
nothing sorts or facets by it. The band the lot carries is what the *lot* was sold
as; a producer's own range is a different fact for the producer's desk
(`PLATFORM.md`'s scope table), and the two disagreeing is the divergence case, not
an error to fix. Migration seeds the catalog
from every readable ledger (`catSeed`/`catSeedGear`), re-points the ledger onto it
(`catRepoint`/`gearRepoint`/`brewRepoint`/`cupPrepRepoint`, additive + reversible),
then retires the flat text once a node stands (`catRetire`, the one irreversible
step). Write-path stamps (`catStamp*`) author nodes at save, not next boot.

A record binds to its lot through the resolver's ladder (`docs/RESOLVER.md`, the step-2
spec), strongest rung first. The **hard-ID rung** is built: a namespaced
`{scheme,value}` printed lot code (kenya-outturn · coe · best-of-panama ·
gesha-village · ninety-plus · esmeralda · ico), entered on a bag/café-cup origin
section (`hardIdRow`/`readHardIds`), normalised per scheme (`normHardId`) and
firewalled at entry against the false friends — a bare grade, a warehouse SKU, a
per-sale seat (`hardIdRefusal`). A shared token binds to the standing lot outright
via `lotBindKey`/`lotByHardId`, **ahead of `lotKeyOf`** — the timid fingerprint
(collapse only on ≥2 shared tokens, else fork) that stays the offline floor. Tokens
accumulate on the lot append-only (`lotAddHardIds` — signed, dated, struck-not-
deleted, a *documented* rung), unioned across devices by `mergeHardIds` in
`mergeCatalog` exactly as sightings are. Wired through `catStampLot`/`catSeed`/
`catRefsFor`, reversible and offline-first. The fuzzy scorer, propose-and-confirm and
merge/split are designed in `docs/RESOLVER.md` and built next; `compile(entry)` waits for
those passes. The **lot page** (`openLotPage`, drilled into from a bag or the by-lot
fold) lists the roasts referencing one green, each named by its roaster — the "same
green, many hands" surface — and names the documented rung when a lot is
hard-ID-bound. `devSeed()` (`#seed-lot`) and `devSeedOutturn()` (`#seed-outturn`, the
hard-ID bind end to end) are demo fixtures, never UI affordances.

**Curator ingestion (Act II, step 3).** A keeper-curator authors the spine
*directly* — a roaster, a green and a roast onto the atlas without logging a cup
(`authorRoast` → `catStampRoaster`/`catStampLot`/`catStampRoast`, an `authored`
ledger record, no bag/cup). Every authored green runs `resolveLot` exactly as a
bag's origin does: a sure read auto-binds (`derived`), a lone propose asks inline
(`openLotPropose`), a tie (band ≥ 2) **forks to the review queue** rather than
guessing. The **review queue** (`reviewQueue`/`queueCandidates`/`openReviewItem`)
is *derived, never stored* — own records with a standing propose-band green
neither confirmed nor kept apart (`rec.lotApart`); working an item reuses the
propose sheet ranked for ties, `queueConfirm` binds one and leaves the rest
apart, `queueApart` forks (the safe default). The **Chart No. 1** view (`vCurate`,
`curateOn`, reached from the Desk → "Add to the atlas" → "The chart") reads one city's authored
roasters, greens and same-green cases, reusing `openLotPage`, and draws them
geographically in a **Map / List** toggle (step 4, "the map" — see *the atlas
map* above). `devSeedChart()` (`#seed-chart`) is the marked-demo fixture, and
draws the LA scene end to end (demo coordinates). LLM/site-assisted extraction and
the `proposed`→`stood` moderation ceremony are deferred; the standing (step 5),
the brew corpus (step 6) and discovery (step 7) follow.

### Invariants to preserve

- **The shared record is single-pen for now.** Every deliberate write to the
  Register or the catalog goes through `penGuard()`, its affordance hidden
  behind `isAdmin()`, and both servers refuse a non-founder PUT. A keeper's own
  ledger is never gated — reading everything and writing your own record are
  untouchable. When restoring group curation, lift the gate deliberately
  (server + client + UI together), never piecemeal.
- **The shutter hides, never deletes.** `LEGACY_ON` gates pre-redesign surfaces;
  restoring one is a flag flip, not a rewrite. Don't build new work behind it.
- **Temperature is stored canonically in °C** (`tempC`); the °C/°F switch is a
  display preference (`tempUnit`) remembered per user. Don't store °F.
- **A brew requires a Setup** — `saveBrew` refuses without one.
- **Grind values are only meaningful within a single Setup.** Never compare or
  aggregate grind across Setups.
- **Existing single-user data migrates automatically** to the per-user key on
  first boot — don't break that migration path.
- **Nothing is erased by an ordinary act.** Removal is two-stage: *set down*
  (instant, reversible, in reach of the record itself) then *erase* (deliberate,
  gathered, one room). Never add a delete that skips the first stage. A struck
  record leaves its live collection whole — never invent a parallel "hidden"
  flag that read paths must remember to filter.
- **Red is spent once.** `--danger` / `.btn-danger` belongs to *erase* and the
  two whole-record destructions (delete a keeper, replace a ledger on import)
  and nowhere else. A reversible act in red reads as destruction and teaches the
  keeper to fear a correction. VOICE.md: guard rails stay in ink, never in red.
- **No `confirm()`, ever.** A browser dialog speaks in the operating system's
  voice, breaks the paper, and cannot say anything true about the record. State
  the consequence in a sheet.
- **Erasures** must record tombstones (`deleted`) so sync doesn't resurrect
  them; **strikes must not** — a tombstone would make the restore impossible.
- **A café's identity lives in the Register; cups stay per-user.** Café reads
  resolve Register-first (`cafeProfile`); café writes go through `regUpsert`
  *and* the per-user `D.cafes` copy. A sighting fills blanks, never erases —
  don't let a sparse write strip a rich entry. New Register **reads** go through
  `regEntries()`/`regByName`, never raw `REG.entries` — only the identity door
  (`regFind`) and the merge see struck entries.
- **The reach is compiled, never picked.** Keepers attest facts; the depth
  follows from `reachCompile`. Reach sightings are append-only — withdraw and
  supersede strike a line with a date, never delete it — and `unread` is a
  state, never a default to ○ Counter. Depth is a filter in Find, never a sort
  key. Badges stay monochrome: never the ember, never a fill.
- **The grain is never rounded up.** A green rests on the coarsest rung it can
  prove. A rung is promoted by evidence, never by a field merely being non-empty,
  and never by a name the record cannot classify. If a new rung is added, its
  label, its `GRAIN_READ` gloss, its `DOOR_GRAIN` line and its primer must all
  say the same thing — the copy promises this on every surface it appears.
  The ladder is **spatial only**: harvest, process and variety are their own
  columns and never become rungs (MODEL_QA A5) — and so is height, which is not
  even a column of identity (below).
- **Height places, it never ranks.** `altitudeMasl` is additive beside identity and
  stays there — never in `lotKeyOf`, never in the fingerprint, never a coordinate,
  never a standing axis, never a rung of the grain, and never a facet you can cut
  the atlas by (banding greens by height *is* a ranking, whatever it is called). A
  stated range renders as a band and a single figure as one rule; never widen a
  point or narrow a range to make a drawing tidier. Two heights that disagree are
  carried, not resolved — the first band stands and the later one is appended,
  never overwritten.
- **A match score never travels without its reasons.** Anywhere a score or
  band shows, "Why this" (the `signals` from `matchOf`) must be reachable.
  Location is consent-gated and ephemeral (`myGeo`, in memory only — never
  stored, never synced); proximity contributes 0 until the keeper taps "Near
  you". A skip fades on its own and is never a veto; nothing the matching
  writes is hidden from the Record.

## The sync server (`server/`)

- **Zero dependencies, one file.** Pure Node.js `node:` built-ins (http, fs,
  path, crypto). Do not add npm dependencies — keep `npm install` unnecessary.
- **Two homes, one API.** `server.js` (Node process, JSON files on disk) and
  `worker.mjs` (Cloudflare Worker, one SQLite-backed Durable Object, documents
  chunked under the 2 MB value cap) implement the identical API and protocol.
  An API change must land in both, with both test scripts kept passing.
  `worker.mjs` uses only Web APIs + `node:crypto`, so it runs — and is tested —
  in plain Node; wrangler is deploy tooling only, never a dependency.
- Storage is JSON on disk: `users.json` (accounts + tokens, held in memory) and
  `ledgers/<id>.json` (one per user, read on demand). Writes are atomic (temp
  file + rename).
- **Auth model — "trust your friends."** Register with name + passcode
  (scrypt-hashed, per-user salt, timing-safe login, rate-limited). Every
  authenticated user can **read** every ledger; only the owner can **write**
  theirs. This is for a household/small group, not a hardened public service.
- **Sync protocol** — optimistic concurrency by revision number. Client polls
  `GET /api/ledgers/:id?meta=1`; pulls + merges (union by record id) when the
  server rev is newer; pushes `PUT {baseRev, ledger}`. A `baseRev` mismatch
  returns **409** carrying the server's copy — the client merges and retries.
  Revisions only increment.
- **The café Register** — one shared document at `GET/PUT /api/cafes` (the
  `/api/register` path was taken by sign-up), same rev/409 protocol, readable
  by every authenticated user but **written only by the founder for now** (the
  first account registered; a non-founder PUT gets `403 pen-held` and the
  client quietly stops pushing).
  The client merge (`mergeRegister`) unions by entry id (newer `updatedAt`
  wins; ties break by substance, then bytes, so both sides converge) and
  collapses same-name entries born on different devices, keeping the earliest
  provenance. Older servers 404 the endpoint; the client skips it and the
  Register stays device-local.
- **Offline-first.** `localStorage` is always the source of truth; sync is
  additive. The app syncs on boot, on `online`, and on `visibilitychange` to
  visible (iOS PWAs get no background time — that's the heartbeat).

See `server/README.md` for the full API table and deployment options.

## Running & testing

**The app:** open `index.html` in a browser, or serve the repo statically
(e.g. `python3 -m http.server`) and visit it. No build. It's deployed to GitHub
Pages under `/carta/` (hence the manifest `scope`/`start_url`).

**The server:**

```bash
node server/server.js          # starts on :8787 (PORT env to change), data in ./data
cd server && npm start         # same
cd server && npm test          # both suites: node test.js + node test-worker.js
cd server && npx wrangler deploy   # the serverless variant (worker.mjs) to Cloudflare
```

The test scripts are the frontend-less part's safety net. **If you change
`server/server.js` or `server/worker.mjs`, run `node server/test.js` and
`node server/test-worker.js` and keep both passing**; add cases for new
endpoints or behaviors — to both suites, since the two servers must stay
in lockstep. There is no automated test harness for the app
itself — verify frontend changes by loading the page.

### HTTPS constraint (server)

The app is served over HTTPS, so browsers block calls to an `http://` server
(mixed content). The sync server therefore **must be reachable over HTTPS** in
production — behind fly.io, Caddy, nginx, or Tailscale Funnel. `http://localhost`
is the one exception browsers allow, so local dev needs no TLS.

## Conventions & workflow

- **Match the existing terse code style.** The frontend deliberately favors
  compact, single-line helpers and inline handlers. The server is idiomatic,
  commented Node with clear section banners.
- **Keep the app bundle-free and single-file.** Same for the server
  (zero deps). This is a core design property, not an accident. The app ships
  nothing but itself; its network reads are *optional* progressive enhancements
  that degrade offline: the café address lookup (OpenStreetMap Nominatim →
  manual text), the brand read (`readBrand`: Microlink → the site's palette,
  name and description), and the street map (MapLibre GL + OpenFreeMap vector
  tiles, lazy-loaded at runtime → the drawn plot). Each is keyless, accountless
  and bundles nothing into the file, and must stay that way (no design-system
  SDK, no tracking, no API keys); the brand read keeps only the derived palette
  and the words, never a hotlinked image or a captured photo. The street map is
  an enhancement, never a dependency: the drawn plot (`mapHTML`) always renders
  first from stored lat/lon, stands alone offline, and every map surface must
  keep working — pins, taps, ranking — with zero tiles. Never let a surface
  *require* the street layer.
- **Match the brand voice.** `docs/VOICE.md` is the standard for every user-facing
  string — sentence case, terse, honest, no emoji, the record-keeper persona.
  Screen new copy against its gate before shipping.
- **Bump `APP_VERSION` + add a `CHANGELOG` entry** in `index.html` for
  user-visible changes so returning users see "What's New."
- **Update docs when behavior changes** — `README.md` (app) and
  `server/README.md` (server + API table).
- Comments in this codebase explain *why* (design intent, platform quirks like
  iOS PWA behavior), not *what*. Follow that.

## Git & PRs

- Develop on the assigned feature branch; commit with clear messages; push with
  `git push -u origin <branch>`.
- Open a **draft PR** for the branch when work is pushed if none is open yet.
- History shows one squash-merged PR per feature (see `git log --oneline`).
