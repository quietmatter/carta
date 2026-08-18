# The logbook

*The trail register of Carta's fourth turn, kept by the outfitter
(`.claude/skills/outfitter/`). Append-only; newest entry first. A few lines
per entry: what shipped or moved, decisions, parked items, anything for
Lotmark's desk. Old entries are never rewritten.*

---

## 2026-08-18 — Phase 4 shipped: the bridge

- **Shipped:** take-it-home — coffees carry `home` (true the moment you brew
  one, since beans-in-hand is the definition; false for a café-only taste),
  the Shelf now filters to it, and **Take it home** on a cup or a coffee's
  own page is the one-tap bridge from a café pour to the shelf. Photos on
  cups (`PIVOT.md` decision #1) — one, optional forever, restrained: resized
  and recompressed to a JPEG data-URI on the device, kept outside the ledger
  in `carta7.photos.v1`. Menu capture with no OCR dependency — type a café's
  menu one line per coffee from its own new sheet (cafés are tappable from a
  city chapter now), optionally holding a photo up as reference while
  typing; the photo is genuinely never saved, confirmed directly against
  `localStorage`, not just documented. A menu line logs a cup on the spot
  (café already known, straight to the score step) or links to an existing
  shelf coffee. PR #78.
- **Verified:** by hand in a real browser (photo capture and thumbnails on
  both café and home cups, the take-it-home gate on the Shelf, the full
  menu-capture-to-logged-cup walk, "already got it" linking) and by
  inspecting `localStorage` after a menu capture to confirm the photo left
  no trace anywhere.
- **Next:** either the rest of Phase 3 (geocoding + the live street layer,
  now that a menu's own "at this café" context makes a place worth pinning),
  or Phase 5 — the cards.
- **For Lotmark's desk:** nothing new this entry.

## 2026-08-18 — Phase 3 shipped (in part): the passport and its chapters

- **Shipped:** the passport — a world frame drawn from `LANDS` (Natural
  Earth outlines, 65 countries, ~8KB) ported verbatim from classic, tasted
  countries washed and tappable, untasted ones a hairline invitation;
  highland contours (`LAND_TOPO`, 48 countries, ~20KB) ported and wired
  through classic's own `TOPO_KM` gate, honestly withheld at true world
  width rather than drawn illegibly — a faithful port of the rule, not a
  cut. Country and city chapters, as typography per `ROADMAP.md`'s own
  framing: a country's coffees by region, a city's cafés with their
  average score, reached via a new one-level page overlay (`pageView`) in
  the router. `passportSVG()` is new and purpose-built for a single
  always-on world frame, not a port of classic's general-purpose
  `plotSVG` (which carries lens laws, rung gating and scene clustering —
  the "law" `ARCHITECTURE.md` §1's porting rule excludes). Country lookup
  goes through `fold()` + a ported `LAND_AKA` alias table, not classic's
  `normPlace`/`genFold`. PR #77.
- **Not shipped, and not silently dropped:** the city frame's live street
  layer (MapLibre + OpenFreeMap) from `ARCHITECTURE.md`'s "maps" list.
  It needs place geocoding (lat/lon) to plot anything, and nothing in
  Carta 7 captures coordinates yet — building geocoding as a side effect
  of a map feature felt backwards. The city chapter ships as the
  spec's own sanctioned degrade (§7: "the drawn plot") in the meantime —
  a typographic reading of your cafés there, no map.
- **Verified:** by hand in a real browser and by decode-correctness
  checks against the ported data directly in Node (country/topo counts,
  a sample decode, the world bbox confirming the contour gate fires
  correctly) before any UI was wired to it. Screenshotted in both paper
  and dusk.
- **Next:** either the city frame's geocoding + live street layer (the
  rest of Phase 3), or Phase 4 — the bridge — depending which the
  founder would rather walk into next.
- **For Lotmark's desk:** nothing new this entry.

## 2026-08-18 — Phase 2 shipped: the brief

- **Shipped:** `tasteModel(ledger)` per `ARCHITECTURE.md` §5 — the bar (a
  floor, anchors at avg≥8/n≥2, your 9s as evidence) and the vector
  (processes/origins/descriptors, each bucketed with weight + n + evidence
  refs), plus `scope(place|city|country|route)` for exclusions. `brief()`
  renders a plain-text cut (~1,500 chars, bounded, "already had" inline) and
  a self-contained page embedding `carta.brief/v1`. Scout replaced its
  Phase 1 stub with the real room; café cups can now carry a city. The taste
  model, the brief, and the join/put-away primitives moved into a
  `/* ==== pure ==== */` block per §9, with `test/model.test.js` (22 cases,
  the `server/test.js` pattern) slicing it straight out of `index.html`.
  PR #76.
- **Verified:** by hand in a real browser — three café cups across two
  cities plus a home cup, Scout showing the right floor and anchor, a
  Portland-scoped brief correctly excluding the Seattle coffee, Copy landing
  on the clipboard, Download producing a page carrying the machine block.
- **Decision, not reopened, just made concrete:** `vector.roast` from
  §5's shape has no data source in the Phase 1 ledger (no roast-level
  field survived the cut from classic) — the vector ships as
  `{processes, origins, descriptors}` and stays that way until something
  in the record actually states a roast character. Not a reopening of
  the data model; just declining to invent a field to fill a slot.
- **Next:** Phase 3 — the atlas.
- **For Lotmark's desk:** nothing new this entry.

## 2026-08-18 — Phase 1 shipped: the skeleton stands

- **Shipped:** a new `index.html` built clean per `ARCHITECTURE.md` — the
  token layer (ported), the journal, the shelf, the door (paste-or-type → a
  coffee card, gentle join on roaster/place names, no adjudication), the
  dial-in loop (Setups + the dial component + a stopwatch, ported), put-away
  + undo. Scout and Atlas sit on the tab bar as named stubs. Classic (Carta
  6.18.x) moved whole to `classic/index.html` via `git mv` — untouched but
  for relative asset paths and dropping its own manifest link
  (`ARCHITECTURE.md` §2); its README travelled with it. Root `README.md`
  rewritten for Carta 7's current state. PR #75.
- **Verified:** the phase's done-when bar, by hand in a real browser — a
  café cup logged through the door in a few taps, a home brew through the
  dial-in loop (first Setup writing itself, a second brew reusing it
  silently and carrying the last grind forward), both reading back in the
  Journal, both coffees on the Shelf; put-away + undo on a coffee.
- **Scope cuts, noted for the record, not decisions:** no roaster/site brand
  read yet (no network calls at all in this phase — offline by construction,
  matches the "no maps" cut); the gentle-join near-match prompt only fires
  in the door and the café-cup flow, not the Shelf's direct "＋ Add a
  coffee" form (which joins on an exact fold match only, silently) — a
  reasonable frequency-based cut, not a law; no "What's New" sheet wired yet
  (APP_VERSION/CHANGELOG constants exist as data for the next bump).
- **Next:** Phase 2 — the taste model and the brief.
- **For Lotmark's desk:** nothing new this entry.

## 2026-08-18 — the boundary carried to Lotmark's side

- **Carried across:** the Phase 0 desk item — Lotmark's counterpart agent
  learning the mirror-image boundary — landed as lotmark PR #186:
  `docs/carta.md` (the charter), a `CLAUDE.md` Carta section, and the
  `/ceo-brief` skill's *Carta desk* (reads this logbook's "For Lotmark's
  desk" list every run; refers consumer/taste-side ideas back here as
  one-line `Carta-scope, referred` entries).
- **Protocol now live both ways:** items under "For Lotmark's desk" below
  are read by Lotmark's daily brief; Lotmark's briefs refer Carta-shaped
  ideas here for the outfitter to author.
- **For Lotmark's desk:** nothing new this entry (the standing items from
  Phase 0 remain: honor `carta.brief/v1`; the published atlas read).

## 2026-08-18 — the turn recorded; Phase 0 complete

- **Shipped:** the fourth-turn suite — `PIVOT.md` (approved by the founder,
  including the scout revision), `ROADMAP.md`, `ARCHITECTURE.md`,
  `MARKET.md`; the outfitter installed at `.claude/skills/outfitter/`; the
  third-turn `/goal` skill (`docs/SKILL.md`) superseded and kept for the
  record. PR #73.
- **Decisions adopted** (`ROADMAP.md`): photos return (one per cup,
  optional); the 1–9 stays; AI posture brief → BYO-key → concierge; gentle
  joins (`aka[]`) on roasters/places only; menus personal in v1; four rooms
  (Journal · Scout · Atlas · Shelf); ships as Carta 7.0.
- **Next:** Phase 1, the skeleton — new `index.html` per
  `ARCHITECTURE.md`, classic moved whole to `classic/`.
- **Parked:** OCR for menu photos (horizon, via the sanctioned ask
  channel); community menus; sync-as-backup; concierge tier.
- **For Lotmark's desk:** the trade-side machinery leaving Carta is
  Lotmark's inheritance — resolver/ladder, lot identity, hard-IDs,
  standing, catalog spine, pen/publishing (see `PIVOT.md` §10). Two
  interchange formats to honor from the Lotmark side eventually:
  `carta.brief/v1` (read) and a published atlas of roasters/bars/menus
  (write) — the corpus × atlas loop in `PIVOT.md` §7.5.
