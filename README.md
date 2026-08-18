# Carta

A coffee brewing journal — the cup you made, the cup you were served, and
whether either was worth finding again.

**Carta 7 is a fresh start** (`docs/PIVOT.md`), rebuilt smaller and simpler
than the app that came before it. It ships in phases (`docs/ROADMAP.md`); this
is **Phase 1 — the skeleton**.

## What's here right now

- **The journal.** Every cup, newest first — a café cup or a home brew, its
  score, what you found.
- **The shelf.** Every coffee you've got. Tap one to dial it in, or add what's
  not logged yet.
- **The door** (＋ A cup, on every screen). Paste the bag or just type it —
  "Sey's — Ethiopia Gedeb" — and Carta reads a roaster and a coffee out of it.
  Type a roaster you've named before and it offers to join them rather than
  mint a second one; nothing is guessed or merged silently.
- **The dial-in loop.** Grind, dose, water, temperature and time as tap-hold
  dials that carry forward from your last brew on that Setup, plus a stopwatch.
  A brew always needs a Setup (the grinder + brewer pairing your grind number
  is scaled to) — the first one writes itself from two words.
- **Put away, and undo.** Nothing is deleted outright. Put a cup or a coffee
  away and it leaves the working list but stays on file, one tap from back.

**Scout** and **Atlas** are on the tab bar as a preview of what's coming —
the taste model and the brief (Phase 2), then the map (Phase 3). Menus,
photos, shareable cards and the classic importer are later phases too; see
`docs/ROADMAP.md` for the order and why.

## Classic

Carta 6.18.x — the previous, much larger app, with cafés, the resolver, the
shared atlas, sync and everything else it grew over its run — is frozen
whole at [`classic/index.html`](classic/index.html). It keeps working exactly
as before; nothing there was touched by the rebuild. See
[`classic/README.md`](classic/README.md) for its full documentation. A
migration from classic's export into Carta 7's ledger is Phase 6.

## The stack

One file, `index.html` — all CSS and JS inline, self-contained, zero
dependencies, zero build. Everything lives in this browser's `localStorage`
(`carta7.v1`). No account, no server, fully offline. See
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the full technical spec and
[`docs/ROADMAP.md`](docs/ROADMAP.md) for the build order.

## Running it

Open `index.html` in a browser, or serve the repo statically:

```
python3 -m http.server
```

No build step. It's deployed to GitHub Pages under `/carta/` (see
`manifest.json`).

## Appearance

A serif for what you tasted, a sans for what you measured, one ember signal
for the current action and the cup's score — the Quiet Matter token layer,
inherited (`docs/SUBBRAND.md`). Paper by day, dusk by night, following the
device's own light/dark setting automatically. Typefaces (Spectral, Libre
Franklin) are self-hosted from `fonts/` — nothing loads from a third party.

## Files

| Path | Purpose |
|---|---|
| `index.html` | Carta 7 — the current app. |
| `classic/index.html` | Carta 6.18.x, frozen. See `classic/README.md`. |
| `fonts/` | Self-hosted typefaces (Spectral, Libre Franklin; woff2). |
| `manifest.json`, `icon-*.svg` | PWA metadata and homescreen icons. |
| `server/` | The optional sync server — dormant in 7.0, kept for the record. |
| `docs/` | The design record: the pivot, the roadmap, the architecture, the voice standard, and classic's own design history. |

## Installing on a phone

Open the page in Safari or Chrome, then "Add to Home Screen" — it installs as
a standalone app and works offline from then on.

## Your data

Everything is stored locally in this browser (`localStorage`). There is no
server and no account in 7.0 — if you clear browser data, the record is gone.
An export/import path is on the roadmap; for now, back up by not clearing
site data on the device you keep it on.

---

Made for people who actually like keeping records.
