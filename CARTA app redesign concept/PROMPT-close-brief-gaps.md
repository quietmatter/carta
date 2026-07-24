# CARTA redesign — next prompt (closing the brief: the voice pass, a motion charter, the two signature moments, the home cup end-to-end)

Paste everything below into a new conversation with this project attached.

---

You are continuing the **CARTA app redesign concept** — a working prototype at `CARTA Redesign.dc.html`, styled entirely by the CARTA design system (design-system project `2b64d400-c5ec-494b-9f5b-52e63121a92f`; local copies in `carta/fonts.css`, `carta/tokens.css`, `carta/components.css`). **Read the prototype before changing anything** — the handoff can lag it; trust the file. See `HANDOFF.md` for the full state (Act I–III, the ledger export/import/read-back, the download guarantee and welcome branching are all landed and flow end-to-end). The commission this prototype answers is `DESIGN_BRIEF.md`; source docs live in repo `quietmatter/carta` on `main` — `DESIGN_BRIEF.md`, `NORTH_STAR.md`, `VISION.md`, `MODEL_QA.md`, `VOICE.md`. **Invoke the `/goal` skill first.**

The prototype already meets most of the brief — every core surface is composed, the model is honest to `MODEL_QA.md` (quality and traceability kept as separate axes, caliber as a CVA record, the splittable lot, one-green-many-hands), and it ships its principles and a migration note. **These four are the deliverables the brief still names and the prototype hasn't closed.** Do all four as **targeted edits, no fork** — add screens/sheets/sections to the existing DC. Each honours the laws: the record is the reader's; never a number that lied; unread is a state; authority scoped to your own link; one ember per screen; quiet, declarative voice, no exclamation, no gamification, no emoji. Every new term ships its `PR` primer in voice the same pass (established rule).

## 1 · The voice pass — write down the voice the prototype already speaks (brief §2)

**Why:** the brief permits the voice to move and requires that *if it moves, `VOICE.md` is rewritten to match — the gate must still exist.* The voice has moved: `VOICE.md` still documents the journal era (Setup · Trace · Ledger · Field; "a rumour"; "one cup, two contexts"), while the prototype speaks the ecosystem register — *the record · the atlas · the standing · the road · hold the pen · one green, many hands · the reader's overlay.* The standard and the shipped copy have diverged.

**Deliverable A — the rewritten standard.** Write `VOICE-redesign.md` into **this project** (the next hand pushes it to the repo as `VOICE.md`; don't assume repo write access). Keep `VOICE.md`'s spine — honesty over completeness, address the user not the market, refusals owned plainly, sentence case, terse, typographic numbers, no emoji, the seal used sparingly — and re-cut the persona and motifs to the keeper-of-records-of-a-trade the app now is. Retire dead motifs (Field, the journal-only "rumour" frame), name the live ones (the overlay vs. the shared page; *carried, not resolved*; *unread is a state*; *the pen*; *compiled, never picked*). **The gate section must survive** — a screenable checklist, even if its lines change.

**Deliverable B — the copy deck, in-app.** Extend the **Redesign notes** screen (`isNotes`) with a compact **The voice** section: the one-sentence identity, the gate as a short list, and one exemplary line per recurring string class the brief names — navigation, empty state, refusal, confirmation, onboarding, the seal — each drawn verbatim from a real surface in the prototype so the deck and the app can't drift again.

**Done when:** every line in the deck passes its own gate read aloud, and nothing in `VOICE-redesign.md` still describes a surface the redesign removed.

## 2 · A motion charter — define what moves, how slowly, and why (brief §3, §"quiet luxury" rule 4)

**Why:** the brief calls motion *currently minimal* and asks for a defined language, citing the numbers to adopt — UI motion under ~300ms, ease-out on anything entering or leaving, custom curves over the built-in easings, and *the more often a control is used, the less it animates.* Reduced-motion is a first-class path, not a fallback. Motion tokens are a **sanctioned token extension** under the brief ("argued, not smuggled").

**Build:** declare a small motion token set as CSS custom properties in the `<helmet>` block (the sanctioned place, beside `@font-face`/`@keyframes`/resets) — e.g. a fast/base/considered duration triple and one shared ease-out curve — and reference them **inline** on transitions (`transition: transform var(--mo-base) var(--mo-ease)`), so the inline-styles law holds. Apply them consistently to what already moves (the sheet rise, the welcome `wc-rise`, tab/screen changes) and nothing that shouldn't. Physical, brief, few: a sheet rises and settles; a surface doesn't bounce or pulse. **Wrap every motion in `@media (prefers-reduced-motion: reduce)`** that drops it to an instant, composed state — verify the reduced path renders the same end frame with no movement.

**Document:** a **Motion** subsection in Redesign notes — the tokens, the one rule (*used more, moves less*), and reduced-motion as first-class. No `PR` primer needed (this is foundation, not a user-facing term).

**Done when:** every transition in the app reads from the token set, none exceeds the considered duration, and toggling OS reduce-motion visibly stills the interlude and the sheets while leaving every screen legible.

## 3 · The two signature moments — the interlude and What's New (brief §6)

**Why:** the brief's signature moments are arrival, the interlude, the What's New sheet, and the export. Arrival (welcome) and export are landed; these two are not. They are the brief's one sanctioned exception to "slow motion, or none" — *one considered moment, honouring reduced motion.*

**3a · The matching interlude.** When the reader asks the atlas to read the season for them — a single entry point on **Today** or above the Atlas map (e.g. *"Read the season for me"*) — play one considered moment before the ranked map settles: the pins arrive and the season's line draws over roughly a second, once per session (guard with a state flag; don't replay on every visit). Land on the existing drawn-plot Atlas map with its pins tappable. Under reduce-motion, show the composed map immediately, no animation. It is a reading being composed, never a loading spinner and never a score reveal — the ember stays reserved.
**Primer:** `PR.interlude` — *why the map pauses to compose itself, and that ranking is always by your taste, shown with its reasons.*

**3b · The What's New sheet.** Mirror the app's version-tracker pattern (`APP_VERSION` + `CHANGELOG` → a sheet shown once on a version bump) as the redesign's own, in the new voice. A bottom sheet at the confirm/primer layer, opened on a version flag and replayable from **More → The manual**, listing what this redesign changed as dated entries at the precision actually known (per the voice — no invented dates). Quiet, declarative, no celebration.
**Primer:** none needed; the sheet is self-explaining. Add a **What changed** entry point under More → The manual beside *Replay the welcome*.

**Done when:** both play once and are replayable, both still under the considered duration, both silent under reduce-motion, and neither spends a second ember.

## 4 · The home cup, end to end — Coffee → Preparation → Cup for the cup you make (brief §5)

**Why:** the brief names *the brew flow end to end* and *a bag page / the shelf* as key screens to compose. The café cup out already runs the full shape (`isCuplog` → "Keep the cup"); the Brew screen holds the dials but the home side doesn't yet close into a kept cup, and there's no shelf to begin from. The two screens must be *the same shape* (`VOICE.md`, this release): **Coffee → Preparation → Cup.**

**Build the arc off the instrument (Today → Brew), no new tab** — the redesign made Home a channel, not a room, so this is a flow, not a fifth tab:
- **Coffee — the shelf.** A lightweight surface to pick the bag in hand (reuse the `card`/`kv` vocabulary; the coffee resolves to its lot exactly as the atlas resolves a sighting — the shelf row can carry its resolution grain). Beginning from the last cup stays the fast path; the shelf is the deliberate door.
- **Preparation — the brew.** The dials already exist (grind/temp/dose/water, the timer). Leave them; just make the flow continue past them.
- **Cup — the impression.** Close the brew into a kept cup with the **same** hedonic 1–9 + descriptors + one honest line the café cup uses, so a cup in and a cup out are comparable. This joins the reader's overlay, never the shared page (say so, as the café cup does).

**The Setup editor is a reasoned call, not an assumption:** compose it minimally (grinder + brewer + the grind scale that makes a Setup's grind comparable only within itself) **or** argue in Redesign notes why it stays folded — but make the call explicitly; don't leave it unspoken. Grind is only ever comparable within one Setup — never surface a grind number as if it crossed grinders.
**Primer:** reuse/extend the existing hedonic and overlay primers; add `PR.setup` only if you compose the Setup editor (*why grind lives per-Setup and never travels*).

**Done when:** a home cup can be logged start to finish and lands in the record beside a café cup in the same shape, both reading as one preference on the Record.

## Architecture you'll touch

Single DC, one screen-state machine — `state.screen` ∈ today · atlas · lot · roaster · cafe · cuplog · propose · brew · record · more · notes; `go(s)` resets scroll; `data-screen-label` on every wrapper. **Primers**: `PR` map (term → {t,b}); `ex.<key>` opens the primer sheet, auto-generated from `PR` keys — a new `PR` entry wires its `ex` for free. **Sheets — fixed layers, kept distinct:** confirm/read-back z-36/38 · claim z-42/44 · primer z-40/50 (stacks above any) · welcome z-120; put the What's New sheet on the confirm layer (its own `state.whatsnew`) so a primer still stacks above it. **Brew** holds the dials (`grind`/`temp`/`dose`/`water`, `secs`/`running`); the café Cup lives in `isCuplog` (`cupScore`/`cupDescs`/`cupDrink`/`cupLine` → `saveCup`) — reuse that Cup vocabulary for the home impression. **Redesign notes** (`isNotes`) is the home for the voice deck and the motion charter. **Tweaks props**: `theme`, `showWelcome` — you may add one to force-preview reduce-motion, but the OS `prefers-reduced-motion` query is the real path. Motion is the one thing that legitimately needs `<helmet>` CSS (tokens as custom properties + `@keyframes` + the reduce-motion media query); everything else stays inline.

## Working rules

Design-system `var(--*)` tokens + inline styles inside the app; the one sanctioned non-inline CSS is the motion layer in `<helmet>` (tokens, keyframes, reduce-motion) — argued by the brief, not smuggled. A file the app *writes out* to stand alone (the export) inlines real token hexes; that's the sanctioned exception, not licence to hardcode colour in the app. Small targeted edits, no fork. Reuse existing components (`btn-quiet`/`btn-graphite`/`btn-primary`, `card`, `kv`, `seg`, the primer/confirm sheet, the hedonic and descriptor controls) — invent nothing new visually. Every new term ships its `PR` primer in voice, same pass. Keep one ember per screen and the score/overlay as the reader's own — never merge or average into the shared page. Hold each surface to the brief's judgement gate: would a Sey or Coffee Collective devotee assume this costs money and respects them; does it work at 7am, in dusk, offline; read the copy aloud; is the ember spent exactly once; could the number defend how it got there; is the empty state as designed as the full one. Test both themes and the 480px column before calling anything done. Update `HANDOFF.md` when finished.
