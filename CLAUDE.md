# CLAUDE.md

Guidance for AI assistants working in this repository.

## Model & effort recommendation

At the start of every new message, before doing any other work, briefly state
which model (Sonnet/Opus/Fable) and effort level (low/medium/high/max) you'd
recommend for that specific task, with one line of reasoning. Base this on
task complexity — routine/mechanical work warrants a smaller model and lower
effort, while subtle bugs, unfamiliar domains, or architectural decisions
warrant a larger model and higher effort. This is a recommendation only —
don't switch models or effort yourself; run `/model` or `/effort` if you want
to act on it.

## Start here

Run the **outfitter** (`.claude/skills/outfitter/`) at the start of a Carta
session. It holds the route (`docs/ROADMAP.md`), the logbook
(`docs/LOGBOOK.md`) and the four-question test every feature goes through. It
is a hobby project with a real design record; the record is the point.

## What Carta is

Carta is a **coffee journal and a hunting instrument** — the cup you made, the
cup you were served, and whether either was worth finding again. It is a
single-page, offline-first PWA: `index.html` with all CSS and JS inline, plus
four sibling scripts beside it, no build step, no accounts, no server.

**Carta 7 is a fresh start** (`docs/PIVOT.md` — the fourth turn). The app that
came before it, Carta 6.18.x, is frozen whole at `classic/index.html`. They
are two different apps in one repo, and the distinction matters constantly:

1. **Carta 7** (`index.html`, ~4,750 lines, plus four siblings loaded from
   its `<head>`: `carta-map.js` (Phase 19), `carta-plate.js` (v7.31.0),
   `carta-shot.js` and `carta-ask.js` (both v7.34.0)) — the product. Every
   phase of `docs/ROADMAP.md` ships here.
2. **Classic** (`classic/index.html`, ~12,500 lines) — **frozen. No fixes, no
   features, lights on.** Its own architecture map is `classic/CLAUDE.md`;
   read that only if you are working on classic by explicit request. The one
   live seam between them is Carta 7's importer, a one-way read of classic's
   JSON export.
3. **`server/`** — classic's optional sync server. **Dormant.** Not part of
   Carta 7, not deleted; it returns only if the roadmap's horizon item does.

There is **no build system, no bundler and no package manager for the app.**
Do not add one. The one automated test is `test/model.test.js` (below).

## The design record (`docs/`)

Reference, never runtime. The four that govern current work:

- **`PIVOT.md`** — the thesis. Record + hunt, the seven joys, and §10's list
  of what the fourth turn deliberately left behind.
- **`ROADMAP.md`** — the route. Phases, adopted decisions, and five tripwires
  read at every phase gate. **Phases 1–20 shipped.** Phase 20 landed ahead of
  Phase 19 — a founder-level call, made knowing it deepened the line-band
  debt Phase 18 landed rather than paying it down — and **Phase 19 then paid
  that debt**, splitting the map layer out into `carta-map.js`.
- **`ARCHITECTURE.md`** — the kit. Stack laws, storage, the data model, the
  taste model, network posture, and §10's list of what is deliberately not
  built. **Amend it deliberately** — an unamended law that quietly stopped
  being true is the failure mode this document exists to prevent.
- **`LOGBOOK.md`** — where the trip actually is. Append-only, newest first,
  kept by the outfitter. Add an entry when a phase or a landmark lands.

`VOICE.md` is the standard every user-facing string screens against, in both
apps. `MARKET.md` is play, not strategy. `SUBBRAND.md` governs the token layer
inherited from Quiet Matter. Everything else in `docs/` — `RESOLVER.md`,
`GEOCODE.md`, `MAPPING.md`, `CORRECTIONS.md`, `READER.md`, `SURFACES.md`,
`VISION.md`, `SCHEMA.md`, `PLATFORM.md`, `LOT_IDENTITY.md`, `MODEL_QA.md`,
`ECOSYSTEM.md`, `COMMERCE.md`, `CHARTS.md`, `CONSTITUENTS.md`,
`NORTH_STAR.md` — is the **third turn's** record: accurate about classic,
superseded for Carta 7. `DESIGN_BRIEF.md` + `redesign-concept/` are the
commission Phase 12 built.

## Repository layout

```
index.html            Carta 7 — the app, inline <style> and <script>
carta-map.js          Carta 7's map layer, split out at Phase 19 (loaded from index.html's <head>)
carta-plate.js        The plate — a brew's curve, both arms, split out at v7.31.0 (same <head>)
carta-shot.js         The Visualizer read — account, calls, pickers, a shot's four screens (v7.34.0)
carta-ask.js          The argument — vTaste→vBrief→vAsk→vAsking→vAskResult, and the keyed channel (v7.34.0)
test/model.test.js    The pure-block harness (zero deps, plain Node)
classic/index.html    Carta 6.18.x, frozen whole
classic/CLAUDE.md     The third turn's architecture map, kept for the record
classic/README.md     Classic's own user documentation
fonts/                Self-hosted typefaces (Spectral + Libre Franklin, woff2)
manifest.json         PWA metadata; scope /carta/, one shortcut → ?open=door
icon-192.svg          App icons
icon-512.svg
README.md             User-facing docs for Carta 7
CNAME                 GitHub Pages custom domain
docs/                 The design record (above)
.claude/skills/       The outfitter
server/               Classic's sync server — dormant
```

## The app (`index.html`)

### Editing conventions

- **Everything is inline.** Edit the `<style>` and `<script>` blocks in place.
  No external `<script src>` / `<link>` to CDNs at load time — the whole point
  is a handful of files you can drop on a static host with nothing in between.
  The four siblings are plain local `<script src>` tags in the `<head>`, each
  carrying `?v=<APP_VERSION>`; that is the only exception and it is not one
  you extend without amending `ARCHITECTURE.md` §1.
- The JS is **terse, dense, single-quote style** — many one-line helpers,
  multi-statement lines. Match it; don't reformat existing code. Section
  dividers look like `/* ============ store ============ */`.
- **Vanilla, module-free JS with global functions.** UI wires up through
  inline `onclick="fnName(...)"`, so most functions are intentionally global.
  Rendering is string-templating into `innerHTML`.
- **Always escape user data** with `esc(...)`; for values interpolated into
  inline `onclick` arguments use `jsq(...)`.
- After mutating state the pattern is `save(); ...; render()` (or `go(tab)`).
  `save()` also dirties the taste model's memo, so a derived read is never
  stale.
- Comments explain **why** (design intent, platform quirks like iOS PWA
  behavior), not what.

### Architecture map (by section, in script order)

- **tokens / style** — the Quiet Matter token layer inherited from classic
  (`docs/SUBBRAND.md` governs it), paper and dusk themes following the device,
  the dial's scale exception, the sheet, the settle animation, and **the
  rooms** — Phase 12's own furniture: `.shdr` (a screen's sticky header),
  `.shead` (a ruled section head: the label, and what the section amounts to),
  `.lrow` (the list row — title leads, meta off the faintest ink, the score set
  big enough to be the answer), the three-room bar and the door beside it.
  Phase 13 added the furniture the chapters needed: `.road` (the six stations
  and the rail that runs dashed across a gap), `.led` (the ledger box, where a
  silent field reads `unread` rather than blank), `.fig` (a figure that carries
  its reasons — dotted-underlined, tappable), `.band` (a stated altitude range
  drawn against the atlas's own span), `.pick` (a chip that picks a scope, a
  kind of ask, a mark) and `.pickzone` (the file a sheet is waiting for). Phase
  20 moved the ask to the Atlas's own hero and gave its wait a screen of its
  own: `.askfield` (the field standing on the passport's fade, handing its own
  taps back through a `pointer-events:none` parent), `.asktrust` (the one line
  under it, said before anything leaves), `button.led` (the same ledger box,
  now also a door onto the brief it was read from), and `.think` (the wait's
  narrated hairline — a `.rule` that fills as the call actually progresses, a
  breathing ember tip, and `.settle` for an answer that writes itself in
  rather than arriving flat). All still, correctly, under
  `prefers-reduced-motion`.
- **the map layer** — three light-DOM custom elements, split out at Phase 19
  into `carta-map.js` (loaded from `index.html`'s `<head>`, before the app's
  own script, which reads its published `LANDS`/decoders as plain globals —
  see `ARCHITECTURE.md` §1 for the seam). Light DOM so page tokens
  (`var(--ink)`) resolve inside them. Taps leave as bubbling events
  (`carta:country-tap`, `carta:pin-tap`).
  - `<carta-belt>` — **the passport**, the app's home surface. Draws the
    `LANDS` outlines the file already carries, fitted to the box. **No
    fetch, no tile, nothing to be offline from.** One SVG unit is one CSS
    pixel, so its type is drawn at the size it is read at (Phase 18 — the fixed 1,000-unit
    box was what made it illegible on a phone). `topo="on"` inks `LAND_TOPO`'s
    1,000/2,000/3,000 m contours over a country's own fill; `marks="[…]"`
    stands its regions on the ground their farms were placed on.
  - `<carta-plot>` — the drawn plot: a handful of points fit to a box, offline.
  - `<carta-streets>` — a city or a single café: **Leaflet + OpenStreetMap
    tiles, injected at runtime** from unpkg. Unreachable, it hides itself and
    the drawn plot underneath simply stands. (Phase 17 tried a `thumb="on"`
    mode here — a gated, cap'd live mount for list rows — and took it back
    out the same day: too much map for a 44×60px row, however carefully
    fetched. This element is unchanged from before that phase.)
    `terrain="on"` (Phase 18) swaps in OpenTopoMap for a region or a farm
    (same §7 row, one different URL — never inverted for dusk, since an
    inverted hillshade reads as valleys where the mountains are); `names="on"`
    labels a pin where the name is the point. **`labels` is not that option**
    — the city already passes it for the drawn plot, and its street pins stay
    unlabelled.
  - Beside them, `d3-array` + `d3-geo` **vendored verbatim** — the projection
    the passport needs. See the invariants; this is an amendment, not a habit.
- **store** — `localStorage` under one key, `carta7.v1`. `D` is the ledger,
  `load()`/`save()`, `live(coll)` filters put-away records, `putAway`/`restore`
  with undo. Photos live in a **separate key** `carta7.photos.v1`
  (`{cupId: dataUri}`) so the ledger stays light enough to export as text;
  `compressPhoto` shrinks on the device. Two more keys sit outside the ledger
  for the same reason, and the difference between them matters:
  `carta7.shots.v1` holds the **curve** a written cup redraws (400 samples),
  and `carta7.shotsread.v1` (v7.33.0) holds the whole **shot** for any brew
  actually opened, so its plate is reviewable later rather than only on the
  way to writing the cup. The second is a **cache, not a record** — 20
  entries at 150 samples, never exported, dropped on *Not mine*, cleared by
  signing out of Visualizer. `docs/ARCHITECTURE.md` §3 has the measurements
  behind both caps.
- **domain** — `uid`, `esc`/`jsq`, dates and `fmtWhen`, `restState` (the rest
  window), °C/°F, `fmtTime`/`parseTime`, `DESCRIPTORS`, `fold`/`lev`/
  `matchNodes`/`joinAlias` (the gentle join), `ROAST_LEVELS`/`parseRoastLevel`,
  `putAwayCore`/`restoreCore`, the small aggregations.
- **taste** — `tasteModel(ledger)`: the bar (a floor, the anchors, your 9s as
  evidence) and the vector (roast · processes · origins · descriptors), every
  figure carrying its `n` and its evidence refs. `briefPlainText` is the chat-
  sized cut, `briefPageHTML` the keepable page with its `carta.brief/v1` block.
  `importClassicMap` and the ask's prompt/parse helpers live here too — all
  pure. Outside the markers, `tasteModelMemo()` memoizes it, dirtied by
  `save()`. **This block is the tested one** (see Running & testing).
- **the gentle join** — `matchNode`/`resolveRoaster`/`mintRoasterIfNeeded`, the
  thin ledger-coupled wrappers over the pure `matchNodes`. Roasters and places
  carry `aka[]`; a near match *offers* to join and never merges silently.
  **Origin story fields never join.**
- **router** — **three rooms** on the bar: **Atlas · Journal · Shelf**
  (`TABS`), with **＋ A cup** beside them — the door, reachable from every
  room. `go(tab)` switches room; `openScreen(kind,id,extra)` opens the one
  screen overlay and `closePage()` closes it; `SCREENS` maps a kind to its
  view, `ROOM_OF` says which room a screen belongs to, `BARELESS` names the
  screens that hide the bar. The settle animation plays on a screen change,
  never on a repaint. `render()` is the single paint.
- **views** — `vAtlas` (home: the passport full-bleed and sticky, the ask's
  own field standing on its fade since Phase 20, tasted countries inked with
  the keeper's own spelling and tappable, cities underneath with their own
  plots), `vJournal` (every cup newest first, opening
  with the last brew and one tap to begin the next from it), `vShelf` (the
  coffees you've got, and the door to the record), `vTaste` (**Your taste** —
  what the Scout room used to argue, folded into the Atlas), and the screens.
  Phase 13 grouped the screens into four walks:
  - **down from a country** — `vCountryChapter` (the road: six stations,
    filled where the record reaches them and dashed across the gaps; then
    regions, growers, roasters, pours) → `vRegionChapter` (a scope on the
    same greens, with the altitude band) → `vProducerPage` (the farm ledger,
    where `unread` is designed rather than blank). All three read off
    `origin`; none is a record of its own, so each carries the country it was
    read in and hands it back on the way out.
  - **the places** — `vCityChapter` (streets, with the list on a sheet at
    three detents), `vCafe`, `vCup`, `vMenu`.
  - **the argument** — `vTaste` → `vBrief` → `vAsk` → `vAsking` → `vAskResult`.
    The first four are `BARELESS`: one argument read in a sitting apiece, so
    the bar would only offer a way to lose your place — `vAsking` most of
    all, since while the ask is out there is exactly one thing to do with the
    screen, and it's on it (Cancel). `vAskResult` is a destination and keeps
    the bar.
  - **what the keeper owns** — `vRecord` (the ledger, the backup, imports,
    cards, the instrument, classic) → `vSetups` → `vSetup` (the grind history
    that is only true on one Setup, which is why it never leaves that page).
  Plus `vBrew`. **Every figure on all of them is derived from `D`** — the
  counts, the road's stations, the altitude band, the taste argument, the
  brief's four parts. A screen that needs a number the ledger cannot defend
  states `unread` instead, and its empty state is designed with its full one.
- **Visualizer** — **lives in `carta-shot.js` since v7.34.0**: the account and
  its auth, `callVisualizer`/`fetchVisualizerShots`, both pickers, the Setup
  import, the shot the Atlas offers unasked (`vizCheckOnOpen`/`waitingShot`/
  `ensureShotCurve`) and a shot's own four screens (`vShot`, `vTasteHome`,
  `vShots`, plus `openSetupImport`). Its pure half reads the file itself. The
  two shot stores stay in `index.html`'s store block — they are localStorage
  plumbing, and the store is documented as one place.
- **the door** (`openDoor`/`paintDoor`/`doorParse`) — paste the bag or type it;
  Carta reads a roaster and a coffee out of it, offers the gentle join, and
  asks where the cup was in the same step. Opening it from a café skips that
  question. **No adjudication, no propose, no resolver** — that is the third
  turn's machinery and it stayed there. Phase 25 added a third way in,
  `doorPull`/`doorPullPicked`/`doorPullResolveCoffee`/`doorPullJoin`/
  `doorPullFinish`: **Pull it from Visualizer** (hidden from a café-context
  door — a synced shot is always a home brew) reads a shot's own roaster and
  coffee, gentle-joins each against the shelf exactly as typed entry does,
  and lands straight on `openImpression` — the coffee and the brew both
  minted from the shot, only the taste still typed. The Setup gets a
  narrower version of the same match, silent-only, no ask
  (`matchSetupByGrinder`, `resolveOrMintSetupForShot` — see
  `ARCHITECTURE.md` §4). Amended v7.32.0: the silent mint now carries the
  brewer or machine beside the grinder too, not the grinder alone.
- **the cup paths** — `openCafeCup`/`saveCafeCup` (the bar path) and
  `openSetupForm`/`openBrewFlow`/`saveBrewFlow`/`openImpression`/`saveHomeCup`
  (the home path, through the dials and the timer). A brew always needs a
  Setup. **Adding one leads with Visualizer now (v7.32.0):** `openSetupCreate`
  is the one decision behind every "＋ A new Setup" button — `openSetupImport`
  when there's an account to read (reusing the same `fetchVisualizerShots`
  the pickers already call, `setupCandidatesFromShots` deduping the
  grinder/brewer pairs it finds against what's already on the record), the
  unchanged blank `openSetupForm` when there isn't or the keeper asks for it
  by name ("Type it in instead", always one tap away).
- **the coffee form** (`openCoffeeForm`) — autosaves once named (Phase 21):
  the coffee mints itself into `D.coffees` the moment a roaster or name is
  typed, the same move the menu capture already makes for its own coffee,
  and every field after that writes straight into the record on each
  keystroke (`cfAutosave`), debounced only on the `localStorage` write
  itself. `closeSheet()` flushes it (`cfFlush`) no matter how the sheet
  closes — swipe, backdrop tap, Done — so nothing typed is ever lost to a
  dismissal the way it used to be. **Search for more** (`cfSearchMore`,
  Phase 22) is a second, keeper-tapped button beside it: one call through
  `callModel` — now carrying an optional `tools` argument so the ask's own
  channel could be handed Anthropic's web-search tool without the ask
  itself gaining it — fills in only the origin fields still blank, each
  named to its source, never touching a field already typed and never
  running as a sweep across the shelf.
- **menus** — one screen, `vMenu`: what they're pouring, and the box to add to
  it. `openMenuScreen(menuId, placeId)` opens either an existing menu or a
  fresh capture; `saveMenuCapture` appends to the menu you are standing on
  rather than minting a second one. **Read it for me** sends that photo once
  through the ask's own channel and keeps it nowhere; the slot repaints itself
  instead of re-rendering, so a repaint never eats what has been typed beside
  it.
- **the ask** — **lives in `carta-ask.js` since v7.34.0**, whole: the walk, the
  channel, and the reply-reading helpers three features share. Everything below
  describes that file, not `index.html`. `vAsk` → `askPromptText` (the brief, verbatim) → `callModel`
  (BYO-key, `api.anthropic.com`, `claude-opus-5` at `ASK_MAX_TOKENS`) →
  `parseAskJSON` → `groundNamed` **grounding every café before it is drawn**,
  paced a second apart → `vAskResult`. Phase 14 made the answer an argument
  rather than a list: a `read` of the ground, findings **ranked** each with a
  `verdict` (what it's best FOR), the `fit` figures off the brief, an `order`
  and an honest `travel`, `mentions` named only to be talked out of, and a
  `plan` — the move, the conditional routes, one wildcard. Scope gained
  `near` (a centroid) and `ASK_REACH` (how far you'll go). **Carta makes no
  search**, so the prompt forbids stating a menu as fact and the model marks
  what rotates (`stale`). The caps are held in `parseAskJSON`, not trusted to
  the prompt, and **every Phase 14 field is optional** so a Phase 7 ask still
  opens. Findings, mentions and the wildcard all carry the same
  `grounded`/`status`/`placeRef` trio — `askNamed(ask)` is the one list they
  read through. `matchFigure` (pure, tested) resolves a model-written `fit`
  string back to the taste-model item the brief echoed to it, so **only a
  figure the record can actually open becomes a `.fig`** — landing on the
  same `evidenceSheet` *Your taste* opens. What can't be resolved stays flat
  text; that is the honesty gate on the answer's return leg. The screen states
  the key it would use and its degrade before the button is tapped;
  `askDraft` holds what has been typed across a chip tap. **The rank is the
  model's own order, in plain ink — never the ember.** Phase 20 moved the
  question itself onto the Atlas's hero (`askFromHome` hands off to the same
  composer rather than firing the call directly) and gave the composer a
  ledger of its own before anything leaves (`askLedgerRowsHTML`, live off
  `tasteModelMemo()`, a door onto the brief via `openAskBrief`). The wait is a
  screen of its own now (`vAsking`, `askBegin`/`askSay`/`askPlace`, painted in
  place by `paintAsking` rather than re-rendered, so a repaint never remounts
  the plot or replays a line already read) — narrating the record's own
  figures, the call, then each name as `groundNamed`'s new `onPlaced` callback
  lands it on the wait's plot. **Cancel is a real cancel**: `cancelAsk` aborts
  the in-flight fetch via `AbortController` and the grounding loop checks
  `_askCancel` every iteration, and `runAsk` holds the record write itself
  until after its own final cancel check, so nothing lands in `D.asks` on any
  cancelled path. The answer settles in on arrival (`_askSettle`, `.settle`),
  never on a re-render from marking a finding.
- **cards** — `coffeeCardHTML` / `placeCardHTML` / `passportCardHTML` /
  `yearCardHTML`, each a self-contained page on Carta paper with a live
  preview, shared through the OS share sheet or downloaded. A coffee or café
  card carries its data back in (`carta.card/v1`); `openImportCard` reads one.
  `passportSVG()` survives here because a card is a standalone page and cannot
  carry a custom element that needs the app's script.
- **backup** — `exportLedgerJSON`, the record page's "last backed up" readout,
  `maybeAutoExport` (opt-in, off by default, checked on a real tab switch so
  the download has a gesture behind it), `lowStorageNoteHTML`.
- **the classic import** — `openClassicImport` → `importClassicMap` (pure,
  tested) → `applyClassicImport`. Additive, re-runnable, id-stable, one-way.
- **sheets / dials / toast / timer** — plumbing ported wholesale from classic.
  `toast(msg, actionFn, actionLabel)` is the app's one "fact + one action"
  shape; undo rides it, and so does Phase 11's new-ground note.
- **version** — `APP_VERSION` + `CHANGELOG`, and the What's New sheet.
- **boot** — theme, `?open=door` (the PWA shortcut), the welcome, the render.

### Data model

The ledger `D` is a plain object under `carta7.v1`. Every record carries `id`
(`uid()`) and `createdAt`; edits stamp `updatedAt`. Put-away is
`archived:true` + `archivedAt`, filtered by `live(coll)`, undone by unsetting
it. `docs/ARCHITECTURE.md` §4 has the field-level shape; the collections are:

- **cups** — `kind:'bar'|'home'`, `score` (1–9), `line`, `descriptors[]`,
  `placeRef`/`coffeeRef`/`brewRef`, `photo` (body in `carta7.photos.v1`).
- **coffees** — `roaster` + `roasterRef`, `name`, `origin{}` (free-text story
  fields), `roastLevel`, `roastDate`, and `home`/`homeAt` when a café coffee
  crossed the bridge onto the shelf.
- **places** / **roasters** — the graph's two node kinds, each with `aka[]`.
- **setups** / **brews** — classic's shapes, minus the spine refs.
- **menus** — a café's lines as printed, parsed and editable.
- **asks** — the ask's history: kind, destination, question, model, and
  `findings[]` each with `grounded`, `status` and `placeRef`.
- **prefs** — `tempUnit`, `askKey`/`askModel`, `exportedAt`/`autoExport`, …
  via `getPref`/`setPref`. Prefs live **inside** the ledger.

### Invariants to preserve

- **Five files, no build.** Vanilla JS, inline everything, nothing fetched at
  load beyond the four siblings themselves. **Their `<script
  src>` tags carry `?v=<APP_VERSION>` and that must be bumped with it** — a
  sibling script is an ordinary cached subresource while `index.html` is the
  revalidated navigation document, so without it a keeper can run a new
  `index.html` against an old sibling. That is not hypothetical: it shipped at
  v7.31.1 and read to the keeper as "your Visualizer account is empty".
  `PLATE_VERSION` is checked at boot and says so out loud if the tag is ever
  forgotten. The count was
  two from Phase 19 and became three at v7.31.0, when the plate's second arm
  forced the gate `SPEC-phase26-pourover.md` §8 had set. **The law was never
  really about the number** — it is *no bundler, no npm, nothing between the
  source and the host* — but a fourth file still needs the same argument
  written into `ARCHITECTURE.md` §1 that the third one got. `docs/ARCHITECTURE.md` §1 sets the band
  for `index.html`: **3–5,000 lines / ≤ 500 KB** (raised from 4,000 at Phase
  13, 4,500 at Phase 15, 4,800 at Phase 16, each with the argument written
  into §1 — the byte ceiling has never moved and is the one that guards the
  drop-it-on-a-static-host promise. Phase 17's amendment to 5,000 is recorded
  as a **reopened decision**, not a routine fourth bump: both of the prior
  two amendments had named 5,000 by name as the point past which the
  one-file law itself, not the band, is what's come due — see §1's own
  account of it).
  **The band went overdrawn, not amended, twice — and Phase 19 then paid it
  down.** Phase 18 landed at 5,043 of 5,000 (bytes fine, 407 of 500 KB),
  recorded as an open debt rather than a fifth amendment, by the founder's
  own call — land over, and give the split its own phase. One small bugfix
  (a Phase 16 patch, six lines) was let through anyway before the split
  shipped, as a named exception, at 5,049/409 KB. Phase 20 then landed before
  Phase 19 did too, knowingly deepening the debt further — put to the
  founder directly, the same way every prior line-band call was — to
  5,380/5,000 (429.5 of 500 KB). **Phase 19 has now shipped**: the map layer
  (the three custom elements, the vendored d3, `LANDS`/`LAND_TOPO`/`LAND_AKA`
  and their decoders) moved out into `carta-map.js`, loaded from
  `index.html`'s `<head>` with a plain `<script src>` — no bundler, no
  build, still two files you drop on a static host. `index.html` now stands
  at **4,854 lines / 321.5 KB**, comfortably back inside the band;
  `carta-map.js` holds **535 lines / 108.4 KB**. The debt is closed; see
  `ARCHITECTURE.md` §1 for the seam (`window`-published globals) and the
  full run of amendments and overages.
- **Vendoring is amended, not assumed.** `d3-array` + `d3-geo` are pasted in
  verbatim (Phase 12, `ARCHITECTURE.md` §1 and §10; living in `carta-map.js`
  since Phase 19, not `index.html`). The count is **two**. A third needs an
  argument written into §10 before it is written into either file — the
  tooling-creep tripwire (`ROADMAP.md`) is what this rule is guarding.
- **Offline-first; every network touch degrades to nothing.** The whole list is
  `ARCHITECTURE.md` §7: Nominatim (placing a café, grounding an ask), Leaflet +
  OSM tiles (a street surface), and the ask itself. Each is keyless or
  keyed-by-the-keeper, and each has a stated fallback. **Never let a surface
  require the street layer** — the drawn plot renders first and stands alone.
  The passport asks for nothing at all.
- **The ask is the one sanctioned outbound question.** Keeper-initiated,
  BYO-key, the key on the device and nowhere else, degrading to the brief
  copied to the clipboard. **A café is drawn only after a real place lookup
  confirms it** — what can't be confirmed is listed, never pinned. Carta never
  pins a hallucination.
- **A recommendation never travels without its reasons.** Every figure the
  taste model states carries its `n` and its evidence. A score with no way to
  reach its reasons is a bug.
- **No proofs.** The moment a feature wants a resolver, a rung, a merge law, a
  shared document or an evidence gate, it is **Lotmark's** feature — log it in
  `LOGBOOK.md` under *For Lotmark's desk* and don't build it here. This is the
  third-turn relapse tripwire, and it is why `classic/` is 12,500 lines.
- **The gentle join offers, never merges.** Roasters and places join by
  `aka[]` with a confirmation and a cheap undo; origin story fields never join
  at all — only the atlas's *display* folds them, and it says what it folded.
- **No gamification, no feed.** `MARKET.md` §4 rules it out by name. The test
  for any return-nudging surface: does it state a fact, or score one? A
  streak, a badge, a percent-complete or a red dot is the tripwire firing.
- **Nothing is deleted outright.** Put away → undo; erase is separate and
  deliberate.
- **Temperature is stored canonically in °C**; the °C/°F switch is a display
  preference. **Grind is only comparable within one Setup**, and a brew
  requires a Setup.
- **Classic is frozen.** Don't fix it, don't feature it, don't refactor it.

## Running & testing

**The app:** open `index.html` in a browser, or serve the repo statically
(`python3 -m http.server`) and visit it. No build. Deployed to GitHub Pages
under `/carta/` (hence the manifest `scope`/`start_url`).

**The one harness** — the taste model is the only piece of real logic whose
wrongness would be invisible (a bad brief just looks like a mediocre brief),
so it is tested even though nothing else is:

```bash
node test/model.test.js        # zero deps, plain Node, 121 cases
```

It slices the `/* ==== pure ==== */ … /* ==== /pure ==== */` region out of
**all four** of `carta-plate.js`, `carta-shot.js`, `carta-ask.js` and
`index.html` (in that order — the browser's own `<head>` order, because
`parseVisualizerShot` reads the plate's globals and `index.html`'s own
`parseCfSearch`/`parseMenuOCR` read the ask's `extractJSON`/`askStr`) and
evaluates them against fixture ledgers — no DOM, no `localStorage`. **If you touch `tasteModel`, `brief*`, `matchNodes`,
`joinAlias`, `putAwayCore`, `restoreCore`, `matchFigure`, `hoodOf`, `cityOf`, `dedupeHits`,
`parseMapLink`, `convexHull`, `roundedHullPath`, `cityShapePath`, `parseRoastLevel`,
`originPin`, `meanPin`, `namesBack`, `cfSearchPrompt`, `parseCfSearch`,
`parseVisualizerShot`, `normalizeRoastLevel`, `matchSetupByGrinder`, `brewerOf`, `setupCandidatesFromShots`
(those five live in `carta-plate.js`'s sibling `carta-shot.js` since v7.34.0),
`askPromptText`, `parseAskJSON`, `matchFigure` (in `carta-ask.js` since v7.34.0),
`shotCurve`, `shotPours`, `shotFigures`, `shotMethod`, `platePaths`,
`shotAt`, `shotPhase`, `shotPreinfusion` (the last eight live in
`carta-plate.js`), `doorParse` or
`importClassicMap`, run it and keep it passing**; add cases for new behavior.

Anything reaching for `D` or `document` **does not belong inside the markers**
— move it outside, next to its coupled wrapper, the way `matchNode`/`putAway`
wrap `matchNodes`/`putAwayCore`.

Everything else painted by `index.html` — and all of `classic/` — has no
automated harness. **Verify by loading the page**, in both paper and dusk. A
syntax check (`node --check` on the extracted script, or simply opening the
file) has caught something in nearly every phase; do it before browser
testing, not after.

`server/` is dormant. If it is ever woken, `classic/CLAUDE.md` carries its
rules — chiefly that `server.js` and `worker.mjs` change together and both
test suites stay passing.

## Conventions & workflow

- **Match the terse house style.** Compact one-line helpers, inline handlers,
  section banners.
- **Match the brand voice.** `docs/VOICE.md` is the standard for every
  user-facing string — sentence case, terse, honest, no emoji, the
  record-keeper persona. Screen new copy against its gate before shipping.
- **Bump `APP_VERSION` + prepend a `CHANGELOG` entry** in `index.html` for any
  user-visible change, so returning users see What's New.
- **Update the docs when behavior changes** — `README.md` for what shipped,
  `docs/ARCHITECTURE.md` when a law or a shape moves, `docs/ROADMAP.md` when a
  phase lands, and `docs/LOGBOOK.md` at every landmark. A design record that
  drifts out of step with the file is worse than none.
- **Park good ideas, don't absorb them.** An idea that lands mid-phase goes to
  the logbook's parked list, never into the current phase. Parking is a
  compliment.

## Git & PRs

- Develop on the assigned feature branch; commit with clear messages; push with
  `git push -u origin <branch>`.
- Open a **draft PR** for the branch when work is pushed if none is open yet.
- History shows one squash-merged PR per feature (see `git log --oneline`).
