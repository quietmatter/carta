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
  `vXxx()` view function returning an HTML string.
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
  `crossContext`.
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
  Setup** — each Setup's grind dial moves the way that grinder does.
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
- **cups** — a tasting. `kind` is `home` (linked to a `brewId`/`bagId`) or
  `cafe` (with `shop`, `city`, `style`, `drink`, `roaster`, `origin`, `price`,
  `again`, plus optional structured traceability aligned to bags —
  `originCountry`, `originRegion`, `producer`, `variety`, `lot`, `process`).
  `hedonic` (1–9), `descriptors[]`, `notes`. A café cup may also carry the beans'
  brand read from the roaster's website: its `site` and a `palette`
  (`readBrand`), which tints the cup's row and detail. A legacy `photo` may
  linger on older cups but is inert.
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
  and location (`address`, `lat`, `lon`, from the optional online
  lookup). A legacy `photo` may linger on older records (branding photos are no
  longer captured or rendered) but is otherwise inert. Merged in sync like
  any other collection.
- **cafeFavs** — favorited café shop names.
- **deleted** — tombstones so removed records stay removed across a sync merge.
- **prefs** — per-user preferences (`tempUnit`, `hideTimer`, …) via
  `getPref`/`setPref`.

Outside the ledger, the device keeps **the Register** (`carta.register.v1`):
`{version, rev, dirty, entries, deleted}` where each entry is a canonical café
— `id`, `name`, `city`, `address`, `lat`/`lon`, `palette`/`accent`,
`notes`, provenance (`firstBy`/`firstAt`, `by`/`updatedAt`), and `sightings`
(the reach: `{id, by, at, bag?, seen?[], withdrawnAt?, supersededAt?}` — signed
lines that only ever accumulate; strikes add a date, nothing is removed, and
`mergeRegister` unions them by id so sync never loses a line). It is shared by
all users on the device and synced as one group-writable document.

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
- **Keep the app dependency-free and single-file.** Same for the server
  (zero deps). This is a core design property, not an accident. The app makes only
  two network calls, both *optional* progressive enhancements that degrade offline:
  the café address lookup (OpenStreetMap Nominatim → manual text) and the brand
  read (`readBrand`: Microlink → the site's palette, name and description), shared
  by cafés, bags and café cups — each reads its brand from a website the same way.
  Each is keyless and bundles nothing, and must stay that way (no map tiles, no
  embedded library, no design-system SDK); the brand read keeps only the derived
  palette and the words, never a hotlinked image or a captured photo.
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
