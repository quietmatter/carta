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
index.html            The entire app — inline <style> (lines ~12–255) and <script> (~269–1694)
manifest.json         PWA metadata (homescreen install); scope is /carta/
icon-192.svg          App icons (manifest references .png variants at those sizes)
icon-512.svg
README.md             User-facing app docs
server/
  server.js           The sync server — one file, zero deps, JSON-on-disk storage
  test.js             Zero-dep endpoint tests (spawns server on ephemeral port + temp dir)
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
- **café** — logging café cups (`openCafe`/`saveCafeCup`) and the café passport
  (`shopAgg`, `vCafes`, favorites).
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
- **bags** — a bag of coffee: `roaster`, `name`, origin fields, `process`,
  `roastDate`, `roastLevel` (index into `ROAST_LEVELS`), `price`, `photo`,
  `archived`.
- **brews** — one brew: `bagId`, `setupId`, `technique`, `grind`, `doseG`,
  `waterG`, `tempC` (stored canonically in °C), `timeSec`, `instrumentation`.
- **cups** — a tasting. `kind` is `home` (linked to a `brewId`/`bagId`) or
  `cafe` (with `shop`, `city`, `style`, `drink`, `roaster`, `origin`, `again`).
  `hedonic` (1–9), `descriptors[]`, `notes`.
- **cafeFavs** — favorited café shop names.
- **deleted** — tombstones so removed records stay removed across a sync merge.
- **prefs** — per-user preferences (`tempUnit`, `hideTimer`, …) via
  `getPref`/`setPref`.

### Invariants to preserve

- **Temperature is stored canonically in °C** (`tempC`); the °C/°F switch is a
  display preference (`tempUnit`) remembered per user. Don't store °F.
- **A brew requires a Setup** — `saveBrew` refuses without one.
- **Grind values are only meaningful within a single Setup.** Never compare or
  aggregate grind across Setups.
- **Existing single-user data migrates automatically** to the per-user key on
  first boot — don't break that migration path.
- Deletions must record tombstones (`deleted`) so sync doesn't resurrect them.

## The sync server (`server/`)

- **Zero dependencies, one file.** Pure Node.js `node:` built-ins (http, fs,
  path, crypto). Do not add npm dependencies — keep `npm install` unnecessary.
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
cd server && npm test          # or: node server/test.js — endpoint/auth/conflict tests
```

The test script is the frontend-less part's safety net. **If you change
`server/server.js`, run `node server/test.js` and keep it passing**; add cases
for new endpoints or behaviors. There is no automated test harness for the app
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
  (zero deps). This is a core design property, not an accident.
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
