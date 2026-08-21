# CARTA 7 — the roadmap

*The fourth turn's build order. `PIVOT.md` is the thesis; this is the route.
It is a hobby's roadmap, so it carries no dates — phases are ordered by
joy-per-effort, every phase ends with something shippable and fun, and the
only deadline is that the founder still wants to open the app. The outfitter
(`.claude/skills/outfitter/`) holds this document in every session and keeps
the logbook (`LOGBOOK.md`) of where the trip actually is.*

## How this roadmap works (a hobby's operating principles)

- **Every phase ends shippable.** No phase leaves the app broken or the
  branch unmergeable. If a phase stalls, what shipped before it still stands.
- **Joy-per-effort ordering — now read as joy-per-effort-and-urgency.** Act
  One ordered by delight-for-least-machinery alone, which was right when
  nothing existed yet. Act Two adds a second axis: a small fix to an
  *irreversible* risk (§0's finding) outranks a larger fix to a merely
  missing delight. Effort still breaks ties.
- **The parked list, not scope creep.** A good idea mid-phase goes to the
  logbook's parked list, never into the current phase. Parked is a
  compliment; it means the idea deserved better than being rushed.
- **No phase may add a proof.** The tripwire against third-turn relapse: the
  moment a feature needs a resolver, a merge law, a shared document, or an
  evidence gate, it is Lotmark's feature. Record it for Lotmark's desk and
  keep walking.
- **Decisions decided stay decided** until deliberately reopened. Reopening
  one is a logbook entry, not a mood — §5 reopens exactly one, by name.

## Act One — complete

Phases 1–7 shipped as designed, plus one horizon item (OCR for menus) that
turned out ripe early. Act One closed at **v7.8.1, 2,477 lines, 43/43 pure
tests** — the journal, the shelf, the dial-in loop, the brief, the passport
and its chapters, the city frame's street layer, take-it-home, photos, menu
capture with OCR, the card renderer, the classic importer, and the ask
(BYO-key, grounded, pinned). Full prose for every phase is the permanent
record in `LOGBOOK.md` — cited here, not repeated:

|Phase|Shipped|
|---|---|
|1 — the skeleton|Journal, Shelf, door, dial-in loop. Classic moved to `classic/`.|
|2 — the brief|`tasteModel()`, the bar/vector/anchors, `carta.brief/v1`, `test/model.test.js` born.|
|3 — the atlas|The passport (`LANDS`, `LAND_TOPO`), country/city chapters; the street layer finished later, same phase.|
|4 — the bridge|Take-it-home, photos on cups, menu capture (no OCR yet).|
|5 — the cards|`carta.card/v1`, the share sheet, cards import back in.|
|6 — the migration|`importClassicMap`, additive and re-runnable; classic linked from the Shelf.|
|7 — the scout, stage two|The ask, BYO-key, grounded against Nominatim before any pin is drawn.|
|off-horizon — OCR|**Read it for me** on the menu sheet, via the same BYO-key channel the ask uses.|

This is a genuinely complete first draft of the fourth turn's thesis — every
named joy in `PIVOT.md` has a surface. Act Two is not "what's missing from
the pitch." It's what only becomes visible once the pitch is built and used.

## §0 — Where Act Two comes from (read this before the phases)

Two findings, from reading the shipped code and the shipped market framing
against each other, not from the original brainstorm:

1. **The taste model has no opinion about roast.** `tasteModel()`'s vector
   is `{processes, origins, descriptors}` — no roast axis, because no
   `roastLevel` field survived Phase 1's cut from classic (Phase 2's logbook
   entry names this as a declined-not-reopened gap). Meanwhile
   `MARKET.md` §3 states the app's own identity sentence as *"the absolute
   best light roast in the world."* The founding obsession and the model
   that's supposed to encode it don't currently touch. This is the sharpest
   gap in the product, and it's cheap to close.
2. **There is no backup discipline beyond a toast.** `save()`'s only
   response to a full quota is `toast('Could not save — is storage full?')`
   — after the fact, no warning, no reminder to export. Carta is one
   device, one `localStorage` key, zero sync, by design (`ARCHITECTURE.md`
   §3) — which is the right architecture for a hobby, but it means the
   entire journal's durability rests on a habit nobody's been asked to
   form. A lost or wiped phone is not a multi-device inconvenience; it's
   the whole record, gone. The old horizon list filed this under
   "sync-as-backup, gated on felt multi-device pain" — conflating two
   different problems. §5 splits them.

Neither finding changes a joy or a law. Both change what ships next.

## The phases (Act Two)

*Phases 8–14 are shipped. Carta 7 stands at
**v7.15.0, 4,486 lines, 58/58 pure tests**. Full prose for each is in
`LOGBOOK.md`, cited here, not repeated.*

### Phase 8 — durability, without a server

**Shipped — v7.10.0, PR #91.**

**The risk it closes:** the one Act One left open by design and never
named plainly — a full local ledger is one lost phone from zero, and
nothing in the app currently says so.

**What ships:** a quiet, factual export reminder — the Shelf states "last
exported — <n> weeks ago" the way a coffee's page already states "last
brewed — <n> days ago" (same voice, no urgency theater). A storage-quota
guard that warns *before* a photo save silently fails, not after
(`savePhotos()`'s catch today is the last line of defense, not the first).
Optionally, a periodic auto-download of the JSON export to the device's own
Downloads, opt-in, off by default — durability offered, never forced.
**Explicitly not in it:** any server, any account, any sync protocol — the
old "sync-as-backup" horizon item survives unchanged and ungated-by-this;
this phase is the zero-infrastructure floor under it, not a replacement.

**Done when:** the founder could hand the phone to a stranger tomorrow and
know, from the app alone, how stale the last safety copy is — without
having to remember to check.

### Phase 9 — the vector completed: roast joins the model

**Shipped — v7.11.0, PR #93.**

**The joy it serves:** the hunt, sharpened at its foundation — §0's first
finding, closed.

**What ships:** `roastLevel` on Coffee (a short scale — reuse classic's
`ROAST_LEVELS` concept, simplified to what a menu or bag actually states:
light / medium-light / medium / medium-dark / dark), optional everywhere,
never required. The door and menu-capture parsing pick it up where a line
states it plainly, the way process and origin already are. `tasteModel()`
grows a fourth vector bucket, `roast`, built the same way `processes` is —
bucketed, weighted, carrying its `n`. The brief and the ask's prompt gain
one clause each, so "I rate light roasts highest, n=14" is a sentence the
model actually has evidence for, not an assumption baked into the prompt
copy. **Explicitly not in it:** a rung, a ladder, a required field — roast
stays exactly as free-text-optional as process and origin already are; the
tripwire this phase must not trip is inventing a second identity system
next to the one `ARCHITECTURE.md` §4 already drew a line under.

**Done when:** a brief can truthfully say what roast character earns your
9s, with a number behind it — and MARKET.md's identity sentence stops being
aspirational copy the model can't back up.

### Phase 10 — quick capture (a door with no detour)

**Shipped — v7.11.1, PR #94.** With one gap named rather than papered over:
`manifest.json`'s `shortcuts` array has no iOS implementation at all, so the
phase's own long-press bar is met on Android, ChromeOS and desktop only.

**The joy it serves:** the cup, caught — Phase 1's own bar, "under twenty
seconds," tightened now that real use has shown where the seconds go.

**What ships:** a PWA app-shortcut (`manifest.json`'s standard `shortcuts`
array — zero dependency, zero new surface) that opens straight to the door
from the home screen or long-press, skipping the Journal entirely. Nothing
else changes; this is the smallest possible cut at the biggest source of
friction in the most-used loop. **Explicitly not in it:** a widget, a lock
screen surface, anything needing a native shell — Carta stays a web app.

**Done when:** logging a bar cup starts from a long-press on the home
screen, not from opening the app and tapping into it.

### Phase 11 — the return loop, without gamification

**Shipped — v7.12.0, PR #96.** The fifth tripwire's first real test, and it
held: two surfaces, both facts, neither a score.

**The joy it serves:** the map fills in, and take-it-home — both stated
back to the keeper as facts, so the app itself becomes a small reason to
return, on `MARKET.md`'s own terms (no streaks, no badges, no feed).

**What ships:** two quiet surfaces, both facts-not-scores, matching the
"last brewed — <n> days" pattern already live on a coffee's page. First, a
one-time, dry acknowledgment the moment a *new* country or city lands on
the passport — not a badge, a single sentence plus an offer to share the
passport card right then, while the win is fresh, instead of making the
keeper go dig for it later. Second, on a shelf coffee taken home a while
ago with no home brew logged yet, one quiet line — "taken home, not brewed
yet" — a fact the shelf already knows and currently says nothing about.
**Explicitly not in it:** a streak, a badge, a push notification, a percent-
complete anything — this phase exists specifically to test whether Carta
can nudge return without the gamification `MARKET.md` §4 rules out by name.
If a proposed surface reads as a score, cut it, don't soften it.

**Done when:** a new passport country produces an unprompted "I should send
this to someone," and a stale take-home actually gets brewed because the
app said one plain sentence, not because it applied pressure.

### Phase 12 — the map in front (the redesign)

**Shipped — v7.13.0, PR #98.** Not the phase this slot originally held: the
founder commissioned a redesign (`DESIGN_BRIEF.md`, drawn in
`docs/redesign-concept/`) and it landed here, so the scout-tuning phase this
number used to name moved down — it is **Phase 14** below, having been Phase
13 until this commission's own second half took that number too. The route
bent; nothing was dropped.

**The joy it serves:** the map fills in — promoted from a room you visit to
the thing the app *is* when you open it.

**What shipped:** the Atlas is home, the passport full-bleed and sticky —
tasted countries inked with the keeper's own spelling written across them,
each tappable into its chapter, cities reading underneath with their own
drawn plots. **Four rooms became three** — Atlas · Journal · Shelf — with
**＋ A cup** beside them on the bar; the app header is gone and the door is
reachable from every room rather than the top of one. **Scout dissolved into
the Atlas** as *Your taste* — the bar, the vector, the brief, the ask and the
year all still argue, still with their reasons. A country, a city, a café, a
cup, your taste and the dials became **screens, not sheets**. The door asks
one question fewer. The Journal opens with the last cup you brewed.

**The map layer, re-cut:** MapLibre + OpenFreeMap are gone. Three inline
custom elements replace them — `<carta-belt>` (the passport), `<carta-plot>`
(the drawn plot) and `<carta-streets>` (Leaflet + OpenStreetMap, injected at
runtime the way MapLibre always was, hiding itself when unreachable so the
drawn plot underneath simply stands). The passport needs **no network at
all**: its outlines are `LANDS`, already in the file, and its projection is
`d3-array` + `d3-geo` **vendored inline verbatim** — the one deliberate
amendment to the kit's dependency law, recorded in `ARCHITECTURE.md` §1 and
§10, not slipped past it.

**The ledger is untouched:** same store, same keys, no migration, no schema
change. The file stands at 3,420 lines / 295 KB — inside §1's own band.

**Done when — met:** the app opens on the map, the door is one tap from
anywhere, and everything the four rooms argued still argues.

### Phase 13 — the rest of the app (the redesign, completed)

**Shipped — v7.14.0.** The same commission as Phase 12 (`DESIGN_BRIEF.md`,
drawn in `docs/redesign-concept/`), finishing. Phase 12's prototype covered
Today, the Atlas, a lot, a roaster, a café, the cup log, the brew, the shelf,
the record and the welcome; the shipped app has a good deal more than that,
and the surfaces it missed were still speaking the third turn's language. So
this number was the scout's, again, and again the route bent — the
scout-tuning phase is **Phase 14** below. Nothing was dropped.

**The joy it serves:** the road is the thing worth reading. A country was a
shape with a list under it; the atlas only actually opens if the ground under
a cup does.

**What shipped — fourteen surfaces.** The **country chapter** states how far
the record follows that ground — grown, processed, milled, roasted, poured,
read — as six stations, filled where the record reaches them and dashed
across the gaps, then opens downward into its regions, the hands that grew
it, the roasters working from it and the rooms it pours in. **A region** and
**a producer** are pages now (both new), walked down to from the country and
back up from any coffee; a farm's page designs `unread` as a first-class
state rather than a blank. **Your taste** dropped its meters: the argument
runs as prose, every figure in it dotted-underlined and tappable into the
cups it was read from. **The brief** was promoted from a sheet with a wall of
text in it to a screen that states what goes out in four named parts before
it ever shows the raw characters, which fold away behind a disclosure. **The
ask** names the key it would use as a fact on the page and states its degrade
under the button; **what Carta found** is its own page on its own streets.
**A café's menu** is one screen at the counter instead of two sheets that
never met. **Your record** — the ledger, the backup, what reads in, what
sends out, the instrument, classic — has a page of its own, and **a Setup**
finally keeps the grind history that is only ever true on it. The city's
sheet gained a third detent, because a city is a place before it is a list.

**Two fields, both optional, both stated only where a bag states them:**
`origin.altitude` — specified in `ARCHITECTURE.md` §4 since the turn began
and never actually offered anywhere — now has a field and draws the region's
altitude band. `origin.mill` is new, and is what the road's Milled station
was always waiting on: hollow until a bag names one, which is the point that
station makes.

**The ledger is untouched:** same store, same keys, no migration, no schema
change. Two optional fields on a shape that was always free text.

**The band moved, in the open:** the file stands at **4,287 lines / 355 KB**
against the 3–4,000 lines §1 stated through Phase 12, so §1 now reads
**3–4,500**. The byte ceiling — the one that actually
guards the drop-on-a-static-host promise — is untouched at 71% of 500 KB.
`ARCHITECTURE.md` §1 carries the amendment and its argument; this is the
tooling-creep tripwire's neighbour and it gets the same treatment: moved
deliberately, written down, not slipped past.

**Done when — met:** every surface the prototype named is built from the
ledger rather than from fixtures, the empty state of each is designed
alongside the full one, and no figure on any of them is printed without a way
to reach its reasons.

### Phase 14 — the scout, tuned on real asks

**Shipped — v7.15.0.**

**The joy it serves:** the hunt, refined with the one input Act One
couldn't have — actual asks, actually made, in actual cities.

**What ships:** deliberately last, and deliberately unspecified beyond its
inputs — this phase reads the asks the record has actually accumulated
since Phase 7 shipped (`D.asks`: grounded/ungrounded ratio, how often
Been/Booked/Skip gets used, how often a result's café was already known)
and proposes its own scope from what that usage shows: more candidates per
ask where the model offers them, sharper exclusions now that Phase 9's
roast axis is feeding the prompt, whatever the real pattern turns out to
be. (Scout is a room no longer — Phase 12 folded it into the Atlas as
*Your taste* — but the ask, its findings and their history are all still
there, which is what this phase needs.) **Explicitly
not in it:** building this from imagination the way Phase 7 had to — the
whole point of ordering it last is that guessing here, before the data
exists, is exactly the mistake §0 was written to stop making.

**Done when — met:** a change is proposed, cited against actual ask history,
not against a hypothetical.

**What the citation turned out to be.** Not the shape §0 guessed at. The
founder's real usage pattern was *leaving* — pasting `briefPlainText` into a
chat with a frontier model, because that came back better than the ask did.
The evidence was that transcript set beside the ask's own output: one prompt,
one answer, and every difference between them a difference in what had been
asked for. Four, in the order they mattered:

1. **The model, and its room.** `ASK_MODEL_DEFAULT` was Haiku 4.5 at
   `max_tokens: 1024`. The answers read generic because a small model given a
   thin prompt and a fifth of the necessary room produces generic answers.
   Now `claude-opus-5` at 8,000, with the `askModel` pref unchanged so the
   keeper can go back.
2. **The shape asked for.** `{cafes:[{name,neighborhood,city,why}]}` has one
   free-text slot, and one free-text slot gets one generic sentence. The
   answer is four parts now: how the ground lies, the cafés ranked with what
   each is *best for*, the places that are close but aren't the pick, and
   what Carta would actually do — the strongest move plus the order to walk
   them in depending on what you're after.
3. **The scope.** The real ask was *"Huntington Park as the centroid"*.
   `ASK_KINDS` gained **near a point**, and a **reach** chip — on foot / a
   short drive / worth driving for — which is what makes "worth driving for"
   an answer rather than a dodge.
4. **The screen.** One flat row shape had nowhere to put any of it.

**What it refused.** Web search, which is where the transcript's most vivid
lines came from ("they're actively selling a Tropical Co-ferment from Finca
Monteblanco"). Carta makes no search, so asking for that shape would have
been asking for invention. The prompt asks for the half that keeps — a
program, a posture, what to ask for at the counter — and marks anything
menu-dependent as rotating. `ARCHITECTURE.md` §7's table gained no row.

**The tripwires, screened.** The rank is the model's own order, held in plain
ink and never in the ember (that is a score you gave a cup, and nothing here
has been drunk). No resolver, no rung, no gate. Every figure a finding leans
on is stated beside it — and **resolved back against the record**, so a figure
Carta can open is a door onto its own cups and one it can't is plain text
(`matchFigure`, pure and tested). The line band was **not** amended: budgeted
at ~4,510, landed at 4,486, fourteen lines inside the 4,500 Phase 13 set.

## The horizon (unscheduled, revisited)

- **True multi-device sync** — the tiny server returns as a dumb, one-owner
  backup, still and only if multi-device pain is *felt in practice*. Kept
  exactly as before; Phase 8 answers the durability question this used to
  carry alone, so this item now names only what it was always meant to:
  syncing between two devices you actually use, not backing up one.
- **The Lotmark loop** — the keyless enrichment read of Lotmark's published
  atlas; corpus × atlas × freshness. Still gated on Lotmark publishing one.
- **Community menus** — still gated on Lotmark's infrastructure.
- **The concierge tier** — still gated on outside demand; still the
  business-creep tripwire by construction if reached for early.

## The tripwires (read at every phase gate)

1. **Third-turn relapse.** Resolver, rungs, merge law, shared document,
   evidence gate → it's Lotmark's. Log it, don't build it. (Phase 9's
   `roastLevel` is a plain optional field, same as `process` — if it ever
   grows a scale, a rung, or a required tier, that's this tripwire firing.)
2. **Tooling creep.** A bundler, a framework, a dependency → re-read
   `ARCHITECTURE.md` §1. The kit stays light. (Phase 10's shortcut is a
   JSON array in a manifest that already exists — if it ever needs a
   native wrapper, stop. Phase 12's vendored `d3-array` + `d3-geo` are the
   one time this line has moved: 54 KB pasted into the file, no npm, no
   build, no fetch, and amended into `ARCHITECTURE.md` §1 and §10 in the
   open. A *second* vendoring is this tripwire firing — the amendment
   named two modules, not a habit.)
3. **The scout before the journal.** If scout work is outpacing journal
   joy, stop — the corpus is the fuel, and an empty journal scouts
   nothing. (This is why Phase 14 is ordered last and gated on real
   history existing to tune against.)
4. **Business creep.** `MARKET.md` is play. If a decision starts from
   revenue, re-rank it by joy and see if it survives.
5. **Gamification creep — new this act.** Phase 11 is the first phase
   built to nudge return at all, which is exactly the territory
   `MARKET.md` §4 rules out by name. The test for anything in that phase:
   does it state a fact, or does it score one? A percent-complete, a
   streak, a badge, a red dot — any of it is this tripwire firing, however
   small.
