# CARTA redesign — next prompt (three closers before shipping: ledger import, a download guarantee, welcome branching)

Paste everything below into a new conversation with this project attached.

---

You are continuing the **CARTA app redesign concept** — a working prototype at `CARTA Redesign.dc.html`, styled entirely by the CARTA design system (design-system project `2b64d400-c5ec-494b-9f5b-52e63121a92f`; local copies in `carta/fonts.css`, `carta/tokens.css`, `carta/components.css`). **Read the prototype before changing anything** — the handoff can lag it; trust the file. See `HANDOFF.md` for the full state (Act I–III + the ledger export are landed and flow end-to-end). Source docs live in repo `quietmatter/carta` on `main` — `NORTH_STAR.md`, `VISION.md`, `PLATFORM.md`, `VOICE.md`. **Invoke the `/goal` skill first.**

These three are the loose ends that stand between "coherent prototype" and "ready to put in front of people" — not new acts, just closing what's already implied. Do all three as **targeted edits, no fork**. Each honours the laws: the record is the reader's; never a number that lied; unread is a state; authority scoped to your own link; quiet, declarative voice, no exclamation, no gamification. Ship each with its primer entry in voice the same pass (established rule).

## 1 · Ledger import — the twin of export (closes no-lock-in)

**Why:** export lets the reader walk away with their record; import proves the schema is genuinely open and there is no lock-in. The strongest single validation of the `carta.ledger/v1` format.

**Where:** the More screen, in the **"The record leaves with you"** card, directly beneath the existing export button — a quiet second action, e.g. **"Bring a ledger back"** (an underline/quiet button that opens a hidden `<input type="file" accept=".html,.json,text/html,application/json">`).

**Behaviour (concept-honest, not a live merge):** read the chosen file; pull the embedded `<script type="application/json" id="carta-ledger">` block (or accept a raw JSON export if you add one), `JSON.parse` it, and **validate `schema === 'carta.ledger/v1'`**. On a match, open a **bottom sheet** (reuse the primer/confirm sheet pattern and z-layering) that *reads the record back* — a calm summary in voice: "A record, read back — {n} readings · {n} on the shelf · {n} cups out · kept since {reader.keeping_since}", then the reading list rendered from the file. State plainly that this is *the reader's own overlay, reconstituted — never merged into the shared page, never averaged into anything*. This shows the file is legible and portable without pretending the prototype has a real datastore.

**Guard rails, in voice:** a non-matching or unparseable file gets a quiet decline in the sheet ("This isn't a CARTA ledger, or it's from a newer record than this one reads." — never a red error bark). If `schema` is a higher version, say so and stop. Never throw to console; swallow and surface calmly.

**Primer:** add `PR.readback` (term e.g. "Read back" / "The record, returned") explaining that a record leaves and returns whole, offline, no account required — and reach it from a dotted tap in the sheet or the card. Auto-wired via the existing `ex` map.

## 2 · The download guarantee — the file always reaches the reader

**Why:** `downloadLedger` currently builds a Blob and fires an `<a download>`. In a sandboxed frame without download permission that click can silently no-op, so "it downloads" isn't guaranteed. The file is correct; the *delivery* isn't certain.

**Fix — make retrieval a user-initiated, always-available act rather than a fire-and-forget:** after building the blob, keep the object URL in state (e.g. `state.exported = { url, filename }`) and **reveal a small persistent panel** under the export button: "Your ledger is ready — `{filename}`", carrying a **real `<a href={url} download={filename}>Save the file</a>`** (a genuine anchor the reader clicks — allowed even where programmatic downloads are blocked) and a quiet **"Read it now"** that opens the blob URL in a new tab (`target="_blank" rel="noopener"`). Keep the initial auto-download attempt as a convenience, but the panel is the guarantee. Revoke the previous URL when replacing it or on unmount. Make the toast honest — announce the ledger is *ready*, not that it "left", since the reader takes the last step. Stay quiet; no celebration.

## 3 · Welcome branching — the three doors lead somewhere

**Why:** the arrival overlay's three paths (`wc-item` buttons: *I read, mostly · Someone else makes it · I make my own*) all currently call `closeWelcome` and land on the same screen. The copy promises three different beginnings; honour it.

**Fix — each door closes the welcome and opens its room** (keep the existing copy verbatim; just wire destinations via `go(...)` / `openCafe(...)` then clear `state.welcome`):
- **I read, mostly** → the Atlas (`go('atlas')`) — "the atlas opens; keep nothing."
- **Someone else makes it** → a bar (`openCafe('halfpence')`) — "a bar and one tap is a whole record."
- **I make my own** → the instrument (`go('brew')`) — "begin from the last cup."

"Rooms open when you ask; nothing is ever taken away" — so this only sets the *first* screen; every tab stays reachable. No new persistence needed (the `showWelcome` tweak/prop is unchanged).

## Architecture you'll touch

Single DC, one screen-state machine (`state.screen`; `go(s)` resets scroll). **Export lives in two class methods** beside `openLot`/`openRoaster`/`openCafe`: `downloadLedger(data)` and `renderLedgerHtml(d)` (its script tags are built from string fragments so the DC's own script tag can't close early — do the same in any new string-built HTML). `ledgerData` is assembled once in `renderVals` from `READINGS` + `RECORD` + `LOT_PAGES` overlays + `CAFES` cups + `s.signed`/`s.corrections`. **Primers**: `PR` map (term → {t,b}); `ex.<key>` opens the primer sheet, auto-generated from `PR` keys. **Sheets**: confirm z-38 · claim z-42/44 · primer z-40/50 — reuse these layers for the import read-back sheet. **Welcome**: `state.welcome`, `closeWelcome`, the three `wc-item` buttons in the welcome overlay. More screen card to extend: **"The record leaves with you"**.

## Working rules

Design-system `var(--*)` tokens + inline styles inside the app; a file the app *writes out* to stand alone (the export) inlines real token hexes — that's the sanctioned exception, not licence to hardcode colour in the app. Small targeted edits, no fork. Reuse existing sheet/card/button components (`btn-quiet`, `card`, `kv`, the primer sheet) — invent nothing new visually. Every new term ships its primer in voice, same pass. When you read any record back in, keep it the reader's overlay only — never merge into or average against the shared page. Test both themes and the 480px column, and re-run the export→import round trip end-to-end, before calling anything done. Update `HANDOFF.md` when finished.
