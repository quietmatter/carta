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
single-page, offline-first PWA: one self-contained `index.html`, all CSS and
JS inline, no build step, no accounts, no server.

**Carta 7 is a fresh start** (`docs/PIVOT.md` — the fourth turn). The app that
came before it, Carta 6.18.x, is frozen whole at `classic/index.html`. They
are two different apps in one repo, and the distinction matters constantly:

1. **Carta 7** (`index.html`, ~3,400 lines) — the product. Every phase of
   `docs/ROADMAP.md` ships here.
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
  read at every phase gate. **Phases 1–14 shipped**; Phase 15 is unwritten.
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
index.html            Carta 7 — the entire app, inline <style> and <script>
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
  is a single file you can drop on a static host.
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
  kind of ask, a mark) and `.pickzone` (the file a sheet is waiting for).
- **the map layer** — three light-DOM custom elements defined above the app's
  own script, so page tokens (`var(--ink)`) resolve inside them. Taps leave as
  bubbling events (`carta:country-tap`, `carta:pin-tap`).
  - `<carta-belt>` — **the passport**, the app's home surface. Draws the
    `LANDS` outlines already in this file, fitted to the box. **No fetch, no
    tile, nothing to be offline from.**
  - `<carta-plot>` — the drawn plot: a handful of points fit to a box, offline.
  - `<carta-streets>` — a city or a single café: **Leaflet + OpenStreetMap
    tiles, injected at runtime** from unpkg. Unreachable, it hides itself and
    the drawn plot underneath simply stands.
  - Beside them, `d3-array` + `d3-geo` **vendored verbatim** — the projection
    the passport needs. See the invariants; this is an amendment, not a habit.
- **store** — `localStorage` under one key, `carta7.v1`. `D` is the ledger,
  `load()`/`save()`, `live(coll)` filters put-away records, `putAway`/`restore`
  with undo. Photos live in a **separate key** `carta7.photos.v1`
  (`{cupId: dataUri}`) so the ledger stays light enough to export as text;
  `compressPhoto` shrinks on the device.
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
- **views** — `vAtlas` (home: the passport full-bleed and sticky, tasted
  countries inked with the keeper's own spelling and tappable, cities
  underneath with their own plots), `vJournal` (every cup newest first, opening
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
  - **the argument** — `vTaste` → `vBrief` → `vAsk` → `vAskResult`. The first
    three are `BARELESS`: one argument read in three sittings, so the bar
    would only offer a way to lose your place. `vAskResult` is a destination
    and keeps it.
  - **what the keeper owns** — `vRecord` (the ledger, the backup, imports,
    cards, the instrument, classic) → `vSetups` → `vSetup` (the grind history
    that is only true on one Setup, which is why it never leaves that page).
  Plus `vBrew`. **Every figure on all of them is derived from `D`** — the
  counts, the road's stations, the altitude band, the taste argument, the
  brief's four parts. A screen that needs a number the ledger cannot defend
  states `unread` instead, and its empty state is designed with its full one.
- **the door** (`openDoor`/`paintDoor`/`doorParse`) — paste the bag or type it;
  Carta reads a roaster and a coffee out of it, offers the gentle join, and
  asks where the cup was in the same step. Opening it from a café skips that
  question. **No adjudication, no propose, no resolver** — that is the third
  turn's machinery and it stayed there.
- **the cup paths** — `openCafeCup`/`saveCafeCup` (the bar path) and
  `openSetupForm`/`openBrewFlow`/`saveBrewFlow`/`openImpression`/`saveHomeCup`
  (the home path, through the dials and the timer). A brew always needs a
  Setup.
- **menus** — one screen, `vMenu`: what they're pouring, and the box to add to
  it. `openMenuScreen(menuId, placeId)` opens either an existing menu or a
  fresh capture; `saveMenuCapture` appends to the menu you are standing on
  rather than minting a second one. **Read it for me** sends that photo once
  through the ask's own channel and keeps it nowhere; the slot repaints itself
  instead of re-rendering, so a repaint never eats what has been typed beside
  it.
- **the ask** — `vAsk` → `askPromptText` (the brief, verbatim) → `callModel`
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
  model's own order, in plain ink — never the ember.**
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

- **One file, no build.** Vanilla JS, inline everything, nothing fetched at
  load. `docs/ARCHITECTURE.md` §1 sets the band: **3–4,500 lines / ≤ 500 KB**
  (the line half was raised from 4,000 at Phase 13, with the argument written
  into §1 — the byte ceiling has never moved and is the one that guards the
  drop-it-on-a-static-host promise).
- **Vendoring is amended, not assumed.** `d3-array` + `d3-geo` are pasted into
  the file verbatim (Phase 12, `ARCHITECTURE.md` §1 and §10). The count is
  **two**. A third needs an argument written into §10 before it is written
  into the file — the tooling-creep tripwire (`ROADMAP.md`) is what this rule
  is guarding.
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
node test/model.test.js        # zero deps, plain Node, 58 cases
```

It slices the `/* ==== pure ==== */ … /* ==== /pure ==== */` region straight
out of `index.html` and evaluates it against fixture ledgers — no DOM, no
`localStorage`. **If you touch `tasteModel`, `brief*`, `matchNodes`,
`joinAlias`, `putAwayCore`, `restoreCore`, `matchFigure`, `parseRoastLevel` or
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
