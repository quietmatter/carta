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
- **router** — `TABS`, current `tab`, `go()`, `render()`. Each tab has a
  `vXxx()` view function returning an HTML string. `discOn` overlays the
  discover surface (`vDiscover`) the way `placeView` overlays a café's page.
- **today + the matching** — the Today tab (`vToday`, the first tab and the
  landing surface) and the matching engine behind it. `matchOf(shop)` scores an
  unkept place per spec v1 (trait 60 · proximity 20 · circle 20) and always
  returns its `signals` — a score is never shown without reasons. The signal
  (`signalTraits`) is argued by kept places' tags/reach facts plus the three
  cafés a new keeper names (`prefs.signal`, the cold-start on Today);
  `discCands()` ranks candidates; `vDiscover` is the map/list surface (ranked
  pins over `mapProject`, card drawer, tune, a once-per-visit matching
  interlude honoring reduced motion). Until three café cups are kept the read
  speaks in bands (`lowConf`), not numbers. Saves stamp `prefs.wantAt` and age
  into a gentle ask on the Record (`recordKeepingHTML`); skips
  (`prefs.placeSkips`) step a place back 14 days and fade by 21; "fewer like
  it" leans (`prefs.traitLeans`) tip a kind down on the same curve, capped in
  effect at three. A week-old map session (`prefs.findSess`) steps back from a
  resume card to a plain suggestion.
- **views** — `vField` (log/home), `vBags`, `vSetups`, `vTrace`, `vCafes`,
  `vLedger`, plus detail sheets.
- **sheet plumbing** — bottom-sheet modal (`openSheet`/`closeSheet`) with
  drag-to-dismiss.
- **dial component** — the tap / hold-to-accelerate / tap-to-type numeric dials
  used in the brew form (`dial`, `nudge`, `holdStart`, `editDial`). Grind dials
  are per-Setup scaled; temp dial has a °C/°F corner toggle.
- **segmented / hedonic / descriptors** — selection-control state.
- **forms** — `openBagForm`/`saveBag`, `openSetupForm`/`saveSetup`.
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
  folded into `vCurate` as a **Map / List** toggle (`atlasView`/`atlasSetView`,
  Map by default when a scene exists). `atlasGraph` walks the chart's greens
  (`chartRecs` → `lotRows`) into nodes — producers at a coarse origin, roasters
  in their cities, venues on their streets — and edges (each grower→roaster,
  each pour's roaster→venue). `atlasMapHTML` renders the drawn plot + registers
  the live config (`_smapCfg.atlasmap`, `atlasMarks`); every pin taps its 4a
  page (`openProducerPage`/`openRoasterPage`/`openPlace`), so map and pages are
  one walk. Coordinates are honest and additive: a venue's real Register point,
  a roaster's `city` point, a producer's `region`/`country` centroid, each with
  a `geoGrain` — **never a farm-precise pin**; a node with no coordinate lists
  rather than lies. Filled from the optional keyless `geoLookup` (via `geoOne`)
  at author time through `atlasGeoFill` (blanks-only, online-only,
  offline-degrading — the demo `devSeedChart` stamps demo coordinates directly,
  never the network). Renders read-only for a stranger; the drawn plot is the
  floor, the street tiles the enhancement.
- **users** — multi-user management (add/switch/view/delete), read-only viewing
  of other users' ledgers.
- **export / import** — JSON export (stamped with the user's name); import as a
  new user or replace.
- **sync** — optional server sync (see below).
- **quick start / what's new / boot** — onboarding guide, changelog sheet, and
  the boot sequence at the bottom of the script.

### Data model

The ledger (`D`) is a plain object with these arrays. Records carry an `id`
(`uid()`) and `createdAt` ISO string; edited records also get `updatedAt`.

- **setups** — a grinder + brewer combination. Key fields: `name`, `grinder`,
  `brewer`, `basket`, `papers`, `water`, and the grinder's real scale
  (`grindMin`, `grindMax`, `grindStep`). **Grind is only comparable within one
  Setup** — each Setup's grind dial moves the way that grinder does. Also carries
  `grinderRef`/`brewerRef` — refs into the canonical **Gear** catalog (the shared
  grinder/brewer model). The grind scale stays per-Setup, untouched; Gear is what
  transfers, the Setup is how one keeper's dial moves.
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
  Also carries `roastRef` — the spine edge brew → **Roast**, read through its bag.
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
- **deleted** — tombstones so removed records stay removed across a sync merge.
- **prefs** — per-user preferences (`tempUnit`, `hideTimer`, …) via
  `getPref`/`setPref`. The matching's bookkeeping lives here too: `signal`
  (the three named cafés), `wantAt`/`wantAsk` (save dates and aging asks),
  `placeSkips`, `traitLeans`, `findSess` (the map session), `gradSeen`. Sync
  merges prefs shallowly, local key wins — never wipe them in a merge.

Outside the ledger, the device keeps **the Register** (`carta.register.v1`):
`{version, rev, dirty, entries, deleted}` where each entry is a canonical café
— `id`, `name`, `city`, `neighborhood`, `address`, `lat`/`lon`, `palette`/`accent`,
`notes`, `tags[]`, provenance (`firstBy`/`firstAt`, `by`/`updatedAt`), and `sightings`
(the reach: `{id, by, at, bag?, seen?[], withdrawnAt?, supersededAt?}` — signed
lines that only ever accumulate; strikes add a date, nothing is removed, and
`mergeRegister` unions them by id so sync never loses a line). It is shared by
all users on the device and synced as one group-writable document.

Beside the Register the device keeps **the catalog** (`carta.catalog.<kind>.v1`) —
the spine upstream of the café, the Register's envelope generalised to eight kinds
(`producers`, `processors`, `aggregators`, `lots`, `blends`, `roasters`, `roasts`,
`gear`). `loadReg`/`saveReg`/`mergeRegister` became `loadDoc(kind)`/`saveDoc`/
`mergeCatalog`; `regUpsert` became `catUpsert(kind, key, …)` (same sparse-fill,
blanks-only law); `reachCompile` became `compile(entry)` (fold sightings into a
reading). Each doc is one group-writable rev/409 document at `/api/catalog/:kind`
(both servers). The **lot** carries its identity columns — `grain`, `scope`,
`hardIds[]`, `fingerprint{}`, `lineage{}`, `processingBatchRef` — beside its flat
origin (the read/retirement surface), never over it. Migration seeds the catalog
from every readable ledger (`catSeed`/`catSeedGear`), re-points the ledger onto it
(`catRepoint`/`gearRepoint`/`brewRepoint`/`cupPrepRepoint`, additive + reversible),
then retires the flat text once a node stands (`catRetire`, the one irreversible
step). Write-path stamps (`catStamp*`) author nodes at save, not next boot.

A record binds to its lot through the resolver's ladder (`RESOLVER.md`, the step-2
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
merge/split are designed in `RESOLVER.md` and built next; `compile(entry)` waits for
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
`curateOn`, reached from `vMore` → "Curate the atlas") reads one city's authored
roasters, greens and same-green cases, reusing `openLotPage`, and draws them
geographically in a **Map / List** toggle (step 4, "the map" — see *the atlas
map* above). `devSeedChart()` (`#seed-chart`) is the marked-demo fixture, and
draws the LA scene end to end (demo coordinates). LLM/site-assisted extraction and
the `proposed`→`stood` moderation ceremony are deferred; the standing (step 5),
the brew corpus (step 6) and discovery (step 7) follow.

### Invariants to preserve

- **Temperature is stored canonically in °C** (`tempC`); the °C/°F switch is a
  display preference (`tempUnit`) remembered per user. Don't store °F.
- **A brew requires a Setup** — `saveBrew` refuses without one.
- **Grind values are only meaningful within a single Setup.** Never compare or
  aggregate grind across Setups.
- **Existing single-user data migrates automatically** to the per-user key on
  first boot — don't break that migration path.
- Deletions must record tombstones (`deleted`) so sync doesn't resurrect them.
- **A café's identity lives in the Register; cups stay per-user.** Café reads
  resolve Register-first (`cafeProfile`); café writes go through `regUpsert`
  *and* the per-user `D.cafes` copy. A sighting fills blanks, never erases —
  don't let a sparse write strip a rich entry.
- **The reach is compiled, never picked.** Keepers attest facts; the depth
  follows from `reachCompile`. Reach sightings are append-only — withdraw and
  supersede strike a line with a date, never delete it — and `unread` is a
  state, never a default to ○ Counter. Depth is a filter in Find, never a sort
  key. Badges stay monochrome: never the ember, never a fill.
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
  `/api/register` path was taken by sign-up), same rev/409 protocol, but
  **writable by any authenticated user** — the group maintains it together.
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
- **Match the brand voice.** `VOICE.md` is the standard for every user-facing
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
