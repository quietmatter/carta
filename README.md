# Carta

A coffee brewing journal — the cup you made, the cup you were served, and
whether either was worth finding again.

**Carta 7 is a fresh start** (`docs/PIVOT.md`), rebuilt smaller and simpler
than the app that came before it. It ships in phases (`docs/ROADMAP.md`); this
is **Phase 7 — the scout, stage two**.

## What's here right now

- **The journal.** Every cup, newest first — a café cup or a home brew, its
  score, what you found.
- **The shelf.** Every coffee you've actually got — a home brew lands here on
  its own; a café coffee joins it only once you say **Take it home**, one tap
  from the cup. Tap a coffee to dial it in, or add what's not logged yet.
- **The door** (＋ A cup, on every screen). Paste the bag or just type it —
  "Sey's — Ethiopia Gedeb" — and Carta reads a roaster and a coffee out of it.
  Type a roaster you've named before and it offers to join them rather than
  mint a second one; nothing is guessed or merged silently. A café cup can
  also carry a city, so the brief (below) can scope to one.
- **The dial-in loop.** Grind, dose, water, temperature and time as tap-hold
  dials that carry forward from your last brew on that Setup, plus a stopwatch.
  A brew always needs a Setup (the grinder + brewer pairing your grind number
  is scaled to) — the first one writes itself from two words.
- **Put away, and undo.** Nothing is deleted outright. Put a cup or a coffee
  away and it leaves the working list but stays on file, one tap from back.
- **Scout: your taste, argued.** A pure derivation over the record — the bar
  (a floor for judging a café, the roasters you keep reaching for), the
  vector (the processes, origins and descriptors that earn your scores) —
  every figure carrying its own evidence, never a number without its reasons.
- **The brief.** Scout prepares it: a plain-text cut sized for pasting into
  an AI chat, and a self-contained page to keep, both scoped to a city if
  you've logged one there — "already had" excludes what you've already
  found, so the answer isn't a rehash. Strictly offline; nothing here makes
  a network call.
- **The ask.** Scout can send the brief on your own behalf — a city, a
  neighborhood, a country, a route, or a friend's taste, plus anything else
  worth knowing — to a model you bring your own key for. This is the one
  thing in Carta that calls out, and only when you tap **Ask Carta**; the
  key lives on this device and nowhere else. Every café it names is checked
  against a real place lookup before it's ever drawn as a pin — what can't
  be confirmed is listed, never guessed onto the map. No key, or the call
  fails, and Carta falls back to the same plain-text brief, copied. **Been
  · Booked · Skip** on each result feeds back into your record — a café you
  mark Been or Booked is on file the next time you type its name.
- **The passport.** The Atlas opens on a world frame — every country your
  record can trace, drawn from an offline outline file (no map tiles, no
  network): tasted countries washed and tappable, untasted ones a hairline
  invitation. Tap a country, or a city from your own list, for its
  **chapter** — the coffees you've had from there, grouped by region, or the
  cafés you've been to and how they've scored — typography, not another map.
  The footer says it plainly: the map remembers what the bags said.
- **A photo on a cup.** One, optional, forever — never a hero, a small
  square next to the cup in the Journal and a modest image on its own page.
  Compressed on the device to a reasonable size; nothing leaves it.
- **The menu.** From a café's page (tap it from a city chapter), capture what
  it's pouring — type each line, or hold a photo up as reference while you
  do (never sent anywhere, never saved — no OCR, no dependency). Tap a line
  to log a cup on the spot, prefilled with the café already known, or to
  point it at a coffee already on your shelf.
- **The cards.** A coffee, a café, the passport, or the year — each renders
  as a self-contained page on Carta paper with a live preview before it
  goes anywhere. **Share** hits the OS share sheet where the browser offers
  one (a text, AirDrop, anywhere) and falls back to a plain download
  everywhere else — the actual point being a friend on the other end, not a
  file in your own Downloads. A coffee or a café card carries its own data
  back in (`carta.card/v1`): open one on another Carta and **Import a card**
  (on the Shelf) is one tap to add it — no account, no server, no touching
  the sender's record.

- **The migration.** From the Shelf, **Import from classic** reads classic's
  own JSON export (Desk → Export → the working copy) straight into Carta 7's
  ledger — roasters, cafés, coffees, brews and cups, mapped node-first so a
  bag or cup whose flat fields were long since retired in favor of a catalog
  node still reads correctly, exactly as classic itself reads them. Roaster
  and café names run through the same gentle join the door uses. Every
  imported record is stamped with where it came from, so reading the same
  export again — on this device or another — adds nothing a second time.
  Nothing is deleted or altered on the classic side; it's a one-way read.

The city chapter's own live street layer (from Phase 3, per
`docs/ARCHITECTURE.md`) still waits — a fast-follow, not dropped. The ask's
results draw on a much smaller frame of their own: a plain box fit to the
handful of pins one ask returns, not the city itself.

## Classic

Carta 6.18.x — the previous, much larger app, with cafés, the resolver, the
shared atlas, sync and everything else it grew over its run — is frozen
whole at [`classic/index.html`](classic/index.html), one tap away from the
Shelf (**Open classic**). It keeps working exactly as before; nothing there
was touched by the rebuild. See [`classic/README.md`](classic/README.md) for
its full documentation. Bring a record across with **Import from classic**,
above — classic itself stays on, a museum with the lights still on, for as
long as you want it.

## The stack

One file, `index.html` — all CSS and JS inline, self-contained, zero
dependencies, zero build. Everything lives in this browser's `localStorage`
(`carta7.v1`). No account, no server — the ask (above) is the one deliberate,
keeper-initiated exception to offline, and it's opt-in: bring your own key or
never touch it. See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the
full technical spec and [`docs/ROADMAP.md`](docs/ROADMAP.md) for the build
order.

## Running it

Open `index.html` in a browser, or serve the repo statically:

```
python3 -m http.server
```

No build step. It's deployed to GitHub Pages under `/carta/` (see
`manifest.json`).

The taste model is the one piece of real logic in the app, so it's the one
thing with a test:

```
node test/model.test.js
```

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
| `test/model.test.js` | Zero-dep test for the taste model + the brief. |
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
