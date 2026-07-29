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
icon-192.svg          App icons (the manifest references these SVGs at those sizes)
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
- **the reader + the published atlas** (`docs/READER.md`) — the person who keeps
  nothing opens CARTA, reads the atlas as the founder published it, and never
  signs in. `reader()` is true when the device holds a published copy
  (`carta.public.v1`, `PUB`), holds no record of its own (`keptSomething`), and
  is not signed in; signing in, keeping a first cup, or taking the door out
  (`startKeeping` → `prefs.keeping`) all end it. Predicates that learned it:
  `depth()` → 1, `tabsFor` (Atlas · Desk — the Record is a reader's own overlay
  and would be a nag with a tab), `isAdmin()` → false, `save()` (prefs only),
  `needsWelcome()` (an `#atlas=` arrival skips it), `go('trace')` → the Atlas,
  the masthead door, and `readerGuard()` — which should never fire, and exists
  for exactly that reason. The copy arrives by an `#atlas=` link, the
  `PUBLIC_ATLAS` build constant, or `openNameAtlas`; `pubSync` rides sync's
  three moments unauthenticated (`?meta=1`, full pull only when the rev moved).
  Surfaces: `pubHeadHTML` (the Atlas head — the copy stating itself),
  `deskCopyHTML` (*This copy*), `openStartKeeping`, `atlasData`/
  `renderAtlasHtml`/`downloadAtlas` (`carta.atlas/v1`, the reader's copy to
  carry away, sharing `EXPORT_CSS` with the ledger export).
  **The published layer is a READ layer, never a merge** (L6): `CAT`/`REG` hold
  the own documents and only those; `catAll(kind)`/`regAll()` lay the copy
  underneath at read time, own first. With no copy on the device `catAll`
  returns the own array *itself*, so a keeper's app is unchanged;
  `catWritable(kind,id)` is the write door, adopting an underneath-only node as
  a thin own node **carrying its id** so the two never read as two greens.
  `catOwn(kind,node)` / `lotOwn(lot)` are the same door for a node handed in as
  an **object** — what every catalog write primitive calls before it writes,
  because `catAll` hands back a layered read (the copy's own object, or a
  `catLayer` of it) and a write onto that is spent on something no save sees:
  it survives the paint and is gone at the next boot. The pair is deliberate —
  the **decision reads the layered node** (a height the copy already states is a
  disagreement to *carry*, not a blank to fill) and only the **write** lands on
  the own node. `lotBind`, `lotAddHardIds`, `lotAddCaliber`, `lotSetRarity`,
  `lotSetAltitude`, `repointRoast`, `roastRepointNode`, `reverseBind` and the
  door's `doorStampActors`/`doorStampAltitude` all pass through it; `caliberWithdraw`
  reads **own entries only**, because a cupping the copy carries was signed by
  another hand and is not ours to strike.
- **the hold** (`docs/READER.md` L4, F1–F3) — the strike's grammar pointed
  outward: `{id:'hold:<ref>', ref, kind, at, by, releasedAt?}` in `D.holds`,
  liveness `at > releasedAt`, merged by `mergeHolds` (the `mergeStruck`
  construction). It changes nothing locally — the subtraction happens to the
  *snapshot*, at publish time, on the server — which is why releasing is free.
  `holdGreen`/`releaseHold`/`heldRefs`/`holdCarries`; `openPublish` (the counts
  as consent), `openHeldList`, `openHoldGreen`. In ink, never in red.
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
- **the reach, set down (6.6.0)** — the old café depth classification
  (○ Counter · ◎ House · ◉ Roastery · ● Origin) is removed: it was a second,
  parallel classification that applied to one node kind, was attested rather
  than derived from the graph, and the road answers the same question on every
  page from the record itself. Its *record* is untouched: reach `sightings`
  stay on Register entries — signed, dated, append-only, merged by id in sync
  (`mergeSightings`), seeded by `catUpsert` — unread and unrendered for one
  version; erasure, if ever, is a later, deliberate step. The liveness
  primitives the reach taught the app (`sightStruck`/`sightStanding`/
  `sightStandingAt`/`bySight`) live in the catalog section now — `compile()`
  and the bind lines read them. Do not re-render the reach without a design
  pass; do not delete the sightings data.
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
  `doorOn` (`vDoor`, a screen not a sheet), `placeView` (a café's page, kind
  `place`), `pageView` (`{kind,id}`, kinds `lot`/`roaster`/`producer`/`processor`/
  `region`/`country`/`city`/`place`/`setup`/`process`/`variety` — every one rendered by
  `nodePage(kind,id)`), `discOn` (`vDiscover`), `curateOn` (`vCurate`). The screen-settle animation
  (`.ca-screen`) plays only when the screen key changes, never on a repaint.
  Overlays walk into each other, so back is a shallow stack: `pageStack` +
  `pagePush()` (called through `nav(kind,id)` — the one navigation dispatcher;
  `openLotPage`/`openRoasterPage`/`openPlace` remain the doors with their own
  guards) and `pageBack()`, which restores a page, a place or the chart.
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
  growers and the Register (`atlasSearchIndex`); the **interlude**
  (`readSeason`/`seasonState` — "Read the season for me" composes once on a
  tap, reasons via `seasonReasons()`, instant under reduced motion, never
  auto-played); the unified map at atlas scope (`mapHTML('atlas','',lots)` —
  see *the map*, below); the facets ("Cut the atlas"); the greens.
- **the one page** (`UNIFIED.html`, the thesis in one function) —
  `scopeGreens(kind,id)` resolves every node kind to the set of greens it
  holds, over the live catalog: `country`/`region`/`producer`/`processor`/`lot`/
  `roaster`/`place`/`city`/`setup`/`process`/`variety`. `nodePage(kind,id)` is the one
  renderer; `spec(kind,id)` supplies only the **nouns** (eyebrow, title, lede,
  identity rows, up/down sections, seal) plus an `extras` hook
  (`postRes`/`postHeight`/`tail`) that carries the app-only surfaces the
  prototype's demo graph never held — the standing, the corpus, the
  corrections fold, the claim block, the matching's why-this. The five
  questions, in order, always: what is it (back · crumb · eyebrow · display ·
  lede) · the road · the readout (`nodeResHTML`) · identity · the map · the
  terrace · up/down + the cross-cuts (the greens, the hands, the bars, how
  you brew it — derived from the scope alone, `OWN_GREENS` + `spec.covers`
  stop a question being answered twice) · your overlay · the act row · seal.
  `rowlink(kind,id,t,m,right)` is the one navigation primitive (t/m arrive
  pre-escaped); `crumbHTML` states the walk up for the administrative kinds,
  derived from the node, never the stack. Edge helpers: `handsIn`/`barsIn`/
  `poursIn`/`cupsIn`/`brewsIn`. A kind with nothing to say for a question
  says *unread* — it never drops the question and never reorders them.
  `openBatchPage` keeps its sheet; `openSetupForm` stays the Setup's edit
  surface.
- **the green picker** — `greenPickHTML(prefix)`/`repaintGreenPick`/`pickGreen`/
  `bindPicked`, on the bag form and the café cup. Every other entry surface
  *derives* its green from what was typed; this one lets the keeper **name** one
  that already stands, which is the only way two keepers at one bar can land on
  one green when the words differ. It searches `catAll('lots')`, not
  `atlasLots()` — `atlasLotIds` returns only *anchored* greens, and a picker
  offering fewer than `bestCandidate` already considers would misstate the
  atlas. A pick writes a **confirmed** sighting through `bindRecordTo`, i.e.
  rung 1, so no later amend can re-key the record off it; it resolves through
  `catWritable` first, because `lotBind` writes onto the object it is handed and
  a published-layer node is not ours to write (READER.md §8). A named green has
  already answered the "same green?" question, so `bindPicked` returns
  `{action:'auto'}` and the propose never follows it.
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
  arc, with put-away/restore), `vSetups` (rowlinks into the Setup pages — live, then the retired), `vTrace`
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
- **the door** (`SURFACES.md` §1) — the paste-first way in, from any room:
  `openDoor(fromKind,fromId)` → paste → confirm → bind, a screen. The room
  shapes the bind, never constrains it (`doorFrom`): from a bar's page the
  targets read *Poured here · On my shelf · Just noting it* with the venue
  already bound; elsewhere the four. The pour bind settles everything about
  the coffee upstream and hands it whole to the cup form via `cafeBound` —
  `saveCup` stamps the same spine a bag walks (`catStamp*`,
  `doorStampActors`, `doorStampAltitude`), so a cup out keeps every fact a
  bag keeps. Every origin field in the door and the bag form carries a
  **prefill rail** (`NARROW`/`known`/`sugField`/`repaintSug` — what the record
  already holds, with counts, one tap to fill; narrows to what's chosen on
  the same screen, suggests never constrains, widens rather than vanishing;
  painted only after the inputs exist). `doorParse` reads the text on the device against
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
  typed forms stay as the fallback and the edit surface — and no longer a poorer
  one: they ask for the harvest, the height and the hard ID too, and stamp them
  through the same `doorStampActors`/`doorStampAltitude`. The door also **keeps**
  the printed code it reads (`hardIdRow('d_hid')`, `readHardIds` in `doorBind`),
  and **pre-binds from a green's page**: `openDoor('lot',id)` seeds `doorParsed`
  via `doorFromLot`, opens at step 2, and `doorBind` calls `bindRecordTo` rather
  than trusting the key — `doorFields` drops the lot name, so the key alone could
  land the record on a neighbouring green. `doorRepaste()` is the way out.
- **the road + the plate** (`SURFACES.md` §2) — one reading, aggregated:
  `lotRoadStations`/`road6HTML` draw the six honest stations (grown → processed →
  milled → roasted → poured → read; hollow marks, dashed connectors — the gap is
  the product) on the lot page and the Atlas's coffee-in-hand; `aggRoadHTML` counts
  them across a set of greens. Each drawing **states itself** — `roadReading` is to
  the road what `altReading` is to the terrace (how many stations stand, of how many,
  and which are silent), and `aggRoadReading(lotIds,tail)` is the set-scope line,
  shaped like `aggTerraceHTML`'s tail and replacing the four hand-written ones that
  used to follow each `aggRoadHTML`. It also carries the page's two self-warnings —
  **lopsided** (half the set resting on `grain==='country'` or unread; asked of the
  grain, *never* of the road's Grown mark, which a bare country already fills, so a
  station-based test would have fired essentially never) and **thin** (`n<3`) —
  and says nothing when a set earns neither. A plate is a page kind now —
  `process` and `variety` are scopes like any other (`specFacet`; `openPlate`
  shims the old facet keys, a country facet is the country page), facets from
  `plateFacets` under Atlas → "Cut the atlas" — a query over lots, never a
  stored collection, and one law: unread on a facet is counted, never silently
  hidden (`specFacet` states it in `extras.postRes`). **One reading, every
  scope**: the road, the map and the terrace count at whatever scope
  `scopeGreens` resolves. Each
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
- **café** — logging café cups (`openCafe`/`saveCafeCup` — the reading *and*
  the coffee, through the **shared origin block** the bag form uses:
  `originFieldsHTML(prefix,o,hardId,extra)` / `readOriginFields(prefix)` emit and
  read the six tokens, the harvest, the height and the hard-ID row for `f_` and
  `c_` alike, so there is one vocabulary and one place to fix a parse bug.
  `cafeBound` is now a *prefill* — the door's facts land in the fields, editable
  — not a banner over a form that had none. `openCafe` prefills node-first
  (`lotRead` + `originExtras`), which is what stops an amend re-keying the cup:
  `saveCup` retires the flat origin once a green stands, and a form that did not
  read it back wrote blanks, fell through `lotKeyOf` to `lot:<cupId>` and forked
  the cup off its green), the café passport
  (`shopAgg`, `vCafes`, favorites),
  and per-café profiles (`openCafeProfile`: a signature colour — pulled from the
  café's website via `siteLookup` (`paletteFromColors`) — from which
  `cafeColors`/`cafeVars` build a whole themed surface — the café's detail page
  and every cup in it wear that palette. The same `siteLookup` read also fills
  the rest of the entry from the site: its description (`siteLine`) becomes the
  café's note, the name it states (`siteName`) is surfaced, and it chains
  `geoLookup` (OpenStreetMap Nominatim) so the address surfaces too — filling
  blanks only, never overwriting typed values). The home-vs-café comparison is
  `crossContext`. A café's own page is `nodePage('place',shop)` — the banner
  hero and the kvs grab-bag are gone; the palette survives only on the street
  locator's pin (`placeMapHTML`).
  Find's search plots pinned results on a map (`mapProject`/`findMapHTML`): real
  lat/lon scaled to fit the box, filled dot for a place you keep, dashed for
  one you don't. The drawn plot is the floor; the **street map** section lays
  real streets behind it when tiles can be fetched (see below).
- **street map** — the live tile layer. MapLibre GL + OpenFreeMap vector tiles
  (OpenStreetMap data), lazy-loaded from CDN only when a `[data-smap]` surface is
  on screen and the network answers; the style (`smapStyle`) repaints every OSM
  layer in CARTA's theme tokens (`smapInk`), both paper and dusk. The drawn plot
  renders first and stands alone offline — streets fade in (`.smap-live.in`) only
  once tiles land; a quiet note with Retry appears on the tall discover map when
  they can't (`smapNote`). Surfaces register configs via `smapReg`/`_smapCfg`;
  `render()` destroys live maps (`smapDestroy`) before repainting and re-mounts
  after (`smapMount`). **Two modes.** On the café surfaces — Find's café map, the
  café-page locator (`placeMapHTML`), the legacy discover map — the live layer
  **takes over**: the drawn pins are removed and HTML markers wearing the same
  `.pin` classes replace them, pannable, the camera persisting across repaints
  (`_smapCam`, written only by a surface that passes a `camKey`). Behind the
  unified map's **chart frame** it is **ground** (`cfg.behind`, 6.8.0): the tiles
  are inserted *under* the SVG, nothing hands over, no markers are added, the box
  takes `.streets` so the frame's labels pick up a paper halo, and the style runs
  its `quiet` variant (no admin boundary, no city labels — the marks carry the
  names, and the ember is never spent on the map). See *the map* below for the
  laws that gate it. The café-page locator tints only its pin to the café's hue
  (near-neutral floors to the ember); the basemap never moves. Edges
  (lot → roast → bar) draw as a GeoJSON line layer over the tiles (`smapEdges`,
  monochrome, re-added on restyle) with the drawn-plot SVG (`svg.atlas-edges`) as
  the offline floor.
- **the map** (`docs/MAPPING.md` — one component, every scope) — the marks of
  a scope ARE `scopeGreens`, pointed at coordinates: `originMarks(gs)` /
  `chartMarks(gs)` take the green set and nothing else, so every page inherits
  the plan the way it inherits the road, and a mark is a `.rowlink` that
  happens to have a position (tap → `nav`, same as any name). **The map has no
  zoom — the walk is the zoom**: `clusters` (single-link, `SCENE_KM`) derives
  scenes at read time, a frame holding more than one scene draws scenes
  (`sceneMark`, tap → the city page), a frame holding one draws its nodes, and
  the back button is the zoom-out — no camera, no scene chips, no stored
  charts. Four laws (M1–M4): a mark is never finer than what it rests on (the
  `RUNG` ladder gates the claim — a country-grain green draws at country grain
  even when a region pin is at hand); what cannot be placed lists rather than
  lies, the fall stated (`listedHTML`); folds are counted, and marks that
  *read* the same fold however far apart (`plotSVG`, `mapPick`/`foldHTML` keep
  every fold member reachable as a rowlink); a cluster of one is not a scene.
  `originRollup` climbs the administrative ladder (regions roll to countries
  when the scope crosses more than one); `chartEdges` draws the pours; the key
  (`keyFor`) is derived from what was drawn, never what the frame could draw;
  one scale on both axes and the box follows the ground; the two frames are
  joined in words (`.handoff`), never a line across the sea. `mapLens`
  narrows before scenes derive and says what it hid. **Your overlay is a ring**
  (`markKept`/`keptLots`/`keptShop`) — added on top of a mark that was already
  complete, never a fill and never a filled-vs-dashed kept/unkept split, because
  that would draw a stranger's atlas entirely faint. That one decision is what
  makes the published atlas *this map minus one ring and one chip*: the ring and
  the *Yours* lens (default off, narrows before the scenes derive) are both
  absent under `reader()`. A **held** green draws faint (`markHeld`, `.mk-held`)
  and is counted in words below the frames — on the founder's map only, never in
  red. The whole drawing is SVG and stands with no tiles at all — and **the
  street layer is laid under it, never instead of it** (6.8.0): `plotSVG` returns
  the `ground` its own projection drew (the box's corners, inverted back to
  lat/lon) and registers a `behind` tile surface fitted to exactly that, so a mark
  and the road beneath it cannot disagree. Two gates, both refusals: **never
  behind the origin frame** (a centroid over a named road reads as an address —
  M1's lie in ink), and **never wider than `STREET_KM`** (`SCENE_KM*3`, one ground
  you could cross in a morning; above it the frame says so and stays a drawing).
  Non-interactive and camera-less — the walk is still the zoom. Coordinates stay honest and additive
  (producer **and processor** pins at `geoGrain` region/country via `atlasGeoFill`,
  corrected through `openGeoFix`); `mapProject`/`mapMerge` survive for Find's café map.
  **The origin frame has a ground too, and it is drawn, not fetched** (6.10.0):
  `LANDS` carries 65 country outlines (Natural Earth 1:110m, public domain,
  simplified against each country's own span, quantised to a twentieth of a degree
  and delta-encoded — under 9 KB), decoded by `landRings` and gathered per scope by
  `landsOf`. `plotSVG` takes them as `o.lands`, **fits the box to hold them whole**
  and draws them under everything as `.land` — paper, a hairline,
  `pointer-events:none`. This is the answer to the street layer's one refusal: a
  centroid may not sit over a named road, but it may sit inside the outline of the
  country it is a centroid of. Consequences, all deliberate: the origin frame does
  not zoom on the walk down (the marks narrow, the ground stays — there is nothing
  finer under a centroid to walk closer to); the ground needs no network, so it
  draws for a scope holding not one coordinate; a country the record names and
  `LANDS` has no shape for is counted in words (`landsOf().unread`), never guessed;
  the key names it as ground, and `openPrimer('ground')` says why. **Never a region
  polygon** — coffee's regions are sometimes an admin-1 (Huila) and sometimes a
  catchment nobody has drawn (Yirgacheffe), and matching a name to a shape is
  exactly the guess the resolver refuses everywhere else.
  **The highlands** (`LAND_TOPO`, `landTopo`) are the same ground read for its
  *shape*: contours at 1,000 / 2,000 / 3,000 m, cut at build time from the
  public-domain Terrarium elevation tiles at ~5 km, masked to each country's own
  drawn outline, encoded exactly like `LANDS` (`landPts` reads both) — 48 countries
  in ~20 KB. Drawn `.topo t1/t2/t3` over the land's fill and under everything else:
  dotted, monochrome, `pointer-events:none`, weight rising with height because that
  is how a contour is read and for no other reason. Withheld above `TOPO_KM` (4,500
  km — STREET_KM's refusal one scale up: a contour that cannot be a line is texture
  pretending to be information), and the frame says which case it is.
  **It is a plan, the terrace is a section, and they answer different questions**:
  the contour is *terrain*, never a green's stated `altitudeMasl`, never a grade,
  never a facet — a mark inside the two-thousand line is not a finer coffee.
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
- **holds** — the greens kept out of the published copy (see *the hold* above):
  `{id:'hold:<ref>', ref, kind, at, by, releasedAt?}`, merged by `mergeHolds`
  (max `at`, max `releasedAt`, independently). Subtracts nothing locally — the
  server applies it to the snapshot at publish time.
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
(the reach: `{id, by, at, bag?, seen?[], withdrawnAt?, restoredAt?, supersededAt?}`
— signed lines that only ever accumulate; a strike, a restore and a supersede each
add a date, nothing is removed, and `mergeRegister` unions them by id so sync never
loses a line. `mergeSightings` takes the **max** of `withdrawnAt` and of
`restoredAt` independently — the `mergeStruck` construction, because liveness is
`withdrawnAt > restoredAt` and an earliest-strike rule would let a stale withdrawal
outrank the restore that undid it — and the **earliest** `supersededAt`, which has
no undo). It is shared by
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
- **An amend is a first-class write.** Every stamp a create runs, an amend runs
  too — `catStampLot`, the actor/height stamps, and the inline propose
  (`openLotPropose`). A form that reads its own record back node-first is what
  makes that safe; one that does not will silently re-key on the second save.
  `bindApart` records a rejection, so a pair is never re-proposed.
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
- **The reach is set down; its record is not.** The depth tiers and every
  reach surface are removed (6.6.0), but reach `sightings` on Register entries
  are append-only, merged by id in sync, and stay on file — unread and
  unrendered. Never delete them in a merge, never strip them from an entry,
  and never re-render the reading without a design pass. Erasing the record,
  if ever, is its own deliberate version.
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
- **The ground never reads finer than the mark above it.** Streets go behind the
  chart frame only (a bar has a door); the origin frame gets the country outline
  only (a centroid has none). Never lay a street under an origin mark, never add
  a region or admin-1 polygon (a region name matched to a shape is a guess), and
  never let anything on the land be tapped, counted, sorted or totalled — it is
  paper, and the moment it enters a count it has become a record it never was.
  A country `LANDS` has no outline for is named in words, never approximated by
  a neighbour or a bounding box. The **contours are terrain, not a reading**: they
  are drawn from an elevation model and never from `altitudeMasl`, they never
  become a band, a facet, a sort or a fourth standing axis, and no copy may imply
  a coffee is finer for sitting above a line. *Height places, it never ranks*
  holds on the plan exactly as it holds on the terrace.
- **A station is a processor, never a grower.** They are two actors, two catalog
  kinds and two pages: `producerRefs` and `processorRefs` never stand in for one
  another, `growersOf` refuses to count a station-tagged producer, and a station
  page never reads as a farm — what leaves a washing station is as many lots as
  arrived, never one blurred producer.
- **Coverage counts, it never grades.** A station count is what the record holds —
  never a measure of the coffee, the grower or the roaster. Four of six is not a
  lesser green than six of six; it is a green the record has been told less about.
  Nothing sorts or facets by it, it never merges into the standing, and no copy may
  imply a coffee is diminished by it. Where a set-scope reading could be mistaken for
  a difference between the coffees, the page says so itself — and stays quiet when
  the set earns no warning, because a warning that always fires teaches the keeper to
  stop reading them.
- **Age is stated, never decayed.** A cupping, a sighting, a pour is a *fact* —
  dated and signed by the hand that made it — and a fact is not less true for having
  been true a while. Surface how old the newest standing evidence is (`vLotPage`'s
  standing note, `STANDING_STALE_MS`); never discount a reading toward neutral for
  age, never let a date move a score, an axis or an order. The trade's habit of
  fading old evidence to keep a number looking current is the precise thing CARTA
  refuses, and it refuses it in the open, on the page.
- **Publishing is a copy, not a switch.** Never open the shared documents to
  unauthenticated GET — it is one line in the router and it is wrong: every
  keystroke would become public the instant it was written, with no act, no date
  and no way to hold anything back. A snapshot carries a revision and a
  published date so the reader's copy states its own age. `GET /api/public` is
  the **only** unauthenticated data endpoint; both suites assert every other one
  still 401s, and that assertion must survive any future endpoint.
- **A pour publishes; its cup never does.** The one exception to "the published
  atlas is the shared documents and nothing else", and it earns it: a pour is a
  fact about the world, a reading is not. It travels with `cupRef` cut. No
  endpoint carries a cup, so no read path can leak one by forgetting a filter.
- **A hold subtracts from the copy, never from the record.** It is additive and
  reversible like a strike, it never becomes a flag a read path must remember to
  check, and it carries the green's roasts and pours with it. Never in red.
- **The published copy is never merged and never pushed.** `PUB` lives under its
  own key; `CAT`/`REG` hold the own documents only; `catUpsert`/`regUpsert`
  always write own. If it merged, the day a reader started keeping their record
  and the founder's would be indistinguishable.
- **A write never lands on a layered read.** `catAll`/`catNode`/`catByKey` are
  *read* doors — with a published copy on the device they hand back the copy's
  object or a `catLayer` of it, and a field set on that is lost at the next boot
  with nothing said. Every catalog write resolves its own node first
  (`catOwn`/`lotOwn`/`catWritable`), and the decision that *guards* the write
  keeps reading the layered node, so blanks-only stays honest: a value the copy
  already states is a disagreement to carry or a blank already filled — never a
  gap the keeper's figure quietly overwrites. A new write path that takes a node
  as an argument must pass it through the door; the failure is silent, which is
  exactly why it is a law and not a habit.
- **A reader's road is five stations, and their map has no ring.** The sixth
  station is the keeper's own cups and the ring is the keeper's own overlay —
  both come off cleanly, and what is left is whole. An absent reader is not a
  gap in the record, so never render one as `unread`.
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
- **The published atlas** — `GET /api/public[?meta=1]`, **unauthenticated**, and
  `POST /api/publish`, founder-only. The snapshot is minted server-side from the
  shared documents the server already holds (the device sends only `{held}`),
  with pours gathered from every ledger and `cupRef` cut. Nothing published yet
  answers `404 not-published`, never an empty atlas. The full read carries a
  strong `ETag` on the rev. See `docs/READER.md` §4.
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
