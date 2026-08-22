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

*Phases 8–20 are all shipped, Phase 19 landed after Phase 20 rather than
before it (Phase 19's own entry below has the account of why). Carta 7
stands at
**v7.22.0, `index.html` 4,854 lines + `carta-map.js` 535 lines, 74/74 pure
tests** — back inside the 5,000-line band, the debt Phase 18 opened and
Phase 20 knowingly deepened now paid down (`ARCHITECTURE.md` §1). Full prose
for each is in `LOGBOOK.md`, cited here, not repeated.*

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

### Phase 15 — the pin, corrected

**Shipped — v7.16.0.**

**The joy it serves:** the map fills in — and stops quietly lying while it
does. A passport whose city layer pins your café to a branch you have never
been to is worse than an empty one, because it looks finished.

**The bug it closes, stated plainly.** `saveCafeCup` minted a place with a
name and a city and nothing else. `geocodeCityPlaces` looked it up as
`geocodeCafe(name, '', city)`, and `geocodeCafe` asked Nominatim for
`limit=1`. So a café with several branches in one city got whichever the
lookup ranked first — arbitrarily. Worse, `p.geocoded` was stamped whether or
not anything came back and was never retried, and no surface in the app could
edit a pin. **A wrong pin was permanent, and silent.** Meanwhile `places`
already carried a `neighborhood` field, already rendered on the café page and
in list rows, that nothing in Carta 7 ever filled — only the classic importer.

**What ships.** The same one call asks for five results with `addressdetails`
and reads the area off each. One match: placed silently, and the neighborhood
it was found in is kept, which fills the field that was already being
displayed. Several matches: **Carta does not choose.** The branches are held
on the record, the café asks once with the real neighborhoods as chips, and
one tap places it with an undo. Any café can be looked up again, which is the
correction path Phase 7 never built. `hoodOf` reads the name a keeper would
actually say off OSM's four inconsistent area keys — trimming "Neighborhood
Council District" and preferring Arts District over Downtown — and
`dedupeHits` collapses one café returned twice so only a real branch ever
becomes a question. Both pure, both tested against the verbatim addresses
Nominatim returns for "Blue Bottle Coffee, Los Angeles".

**Explicitly not in it: the model.** The founder's proposal was to let the
ask reconcile the corpus while it was already spending tokens. Two reasons it
didn't. First, most of it needed no model at all — the lookup already knew
the branches and Carta was discarding them, and the neighborhood field
already existed. Second, and the part that would not have worked: **the model
cannot know which branch the keeper visited.** It knows which exist. A model
guess rendered as a pin is Carta pinning a hallucination — the one thing the
ask was built not to do. So the question goes to the only party that holds
the answer, once, in one tap. The ask's ride-along is **parked, not refused**:
revisit it for the cafés a lookup cannot find at all, with real evidence of
how many those are, the way Phase 14 was tuned.

**The tripwires, screened.** Auto-reconcile as proposed would have been a
silent merge and *"the gentle join offers, never merges"* is a stated
invariant — so this offers, with a cheap undo, exactly as a name join does.
No resolver: nothing here adjudicates whether two records are the same café.
It fills one empty field on one record from a confirmed lookup, which is what
`geocodeCafe` already did, minus the guessing. **The band was amended** to
3–4,800 in `ARCHITECTURE.md` §1 — the phase Phase 14 said would have to make
that argument, making it.

**Done when — met:** a café with two branches in one city asks instead of
guessing, a café with one is placed without a word and knows its
neighborhood, and no pin in the app is permanent any more.

**Patch, v7.16.1 — the city was the same bug one field over.** A café first
added by pasting a street address into the City field (rather than a real
city) stayed filed under that address permanently: `knownCities()` and the
Atlas group by whatever was typed, and placing the pin correctly did nothing
to it, because `settlePlace` only ever touched `lat`/`lon`/`neighborhood`.
Confirmed lookups state the real city too and Carta was throwing that away
exactly the way it threw away the neighborhood before this phase. `cityOf`
(pure, tested, same shape as `hoodOf`) reads it off `city`/`town`/`village`;
`settlePlace` now corrects `city` from a confirmed hit the same way it
corrects `neighborhood` — silent where nothing changed, named in the toast
where it did. One more thing this needed and almost didn't get: a city
chapter left open on the garbage name it was opened under would silently
empty out from under the keeper as its one café corrected away underneath
it — fixed by following the chapter to the real name rather than leaving a
stale title over an empty list.

### Phase 16 — the pin, in your own hand

**Shipped — v7.17.0.**

**The joy it serves:** the hunt, closed at the one point Phase 15 couldn't
reach — a real café that Google or Apple Maps already has, that OSM's search
index simply hasn't been told about yet.

**Where this came from.** Scoping the gap between OpenStreetMap and the
commercial map providers surfaced a hard finding before any code: Google's
Places API lets a `place_id` be cached indefinitely but restricts coordinates
to a 30-day cache and forbids storing an address at all without a live,
attributed re-fetch; Foursquare's free tier carries the same shape and a
2026 allowance of 500 calls a month. Neither is a fit for a ledger that keeps
a confirmed position forever, offline, and neither is keyless. Bolting one on
would have meant either quietly breaking its terms or re-fetching from a paid
API every time a café screen renders — trading offline-first for freshness.
**Declined**, on that finding alone.

**What ships instead — the same keyless door, asked backwards.** OSM's
*search* index can miss a café that opened last month; its map of streets and
neighborhoods essentially never does, because those are mapped at a
different, far more complete grain than individual small businesses. So
where a name search has nothing to offer — unplaced, or none of the branches
on the table is the real one — Carta now takes a link instead. Paste whatever
Google or Apple Maps already handed the keeper's phone (the actual pin
`!3d…!4d…`, not just the last viewport center; `ll=` or `coordinate=`; OSM's
own permalink; or a bare typed pair) and `parseMapLink` reads the coordinate
straight out of it, pure and tested against the real URL shapes each
provider actually produces. `reverseGeocode` then asks the same Nominatim
door the forward search already uses — not "where is this name" but "what's
at this coordinate" — to fill in the real neighborhood and city exactly the
way a search result already does. `settlePlace` needed no change at all: a
reverse hit and a forward hit are the same shape.

**Explicitly not in it:** no map-tap or drag-to-pin interaction — real added
surface for a small phase, and the clipboard already holds the link on any
phone that found the place on a map at all; no storage of the raw pasted
text, only the parsed coordinate; a shortened share link (`maps.app.goo.gl/…`)
carries no coordinate in its own text, and Carta says so rather than
following the redirect, since that would be a network request this phase
never asked for. And nothing here touches the ask's own grounding — a
café the ask names is still confirmed only by the ask's own forward search;
this door opens only from a keeper's own place record.

**Tripwires, screened.** No new network row, no key, no server: the same
Nominatim touch asked a different question, recorded as a refinement to
§7's existing geocode row rather than a new one. No resolver — a pasted
coordinate is the keeper vouching for a position, the same trust level as
typing an address, if anything a stronger one since it is copied from a map
that already confirmed the place exists. `ARCHITECTURE.md` §1 needed no
amendment: budgeted at ~90 lines against ~157 free, landed inside 4,800.

**Done when — met:** a café absent from OSM's own search can still be placed
exactly, with a real neighborhood filled wherever Nominatim's reverse lookup
can supply one, using nothing but a link already on the keeper's clipboard.

**Parked for Lotmark's desk:** Overture Maps' Places theme (CDLA Permissive
2.0, no caching restriction, sourced from Meta + Microsoft data, refreshed
monthly) is the one place-data source actually license-compatible with
"store it forever" — but it ships as a bulk dataset, not a live lookup API,
so using it means standing up a query service, which is a server and not
Carta's to build. It is a plausible source for the "published atlas, keyless,
readBrand-posture" `ARCHITECTURE.md` §7 already names as Lotmark's future
interchange with Carta. Logged for that desk, not built here.

**Patch, v7.19.1 — the box that vanished on success.** A café placed by
pasting a link had no way back to that same box afterward: "not right?" in
the placed state only reran the plain name search, which is exactly the
search that had already failed for this café once. The map-link box is on
the page in every state now, placed included — the one line the other two
states already had. `pastePlaceLink` needed no change: it already reads
whatever the place currently holds before overwriting it, so a corrected
paste undoes back to the first placement, not to nothing.

### Phase 17 — the thumbnail, twice

**Shipped — v7.19.0, in two drafts the same day. Both are kept in the
record, because the second only makes sense next to the first.**

**The joy it serves:** the map fills in, at a surface Phase 12 built and
never finished — the Atlas's city thumbnails have shown bare pins in an
empty box since the day they shipped, the one place in the app that draws a
map and never asked for its shape.

**Draft one — a live map, gated carefully.** Checked before writing code,
the way Phase 16 was: OpenStreetMap's tile usage policy states no hard rate
number, but is explicit that "capacity is limited," usage that "degrades the
service" can be blocked without notice, and tiles are for "the current
viewport." So `<carta-streets>` gained a `thumb="on"` mode — one shared
`IntersectionObserver` booting Leaflet only once a row was actually visible,
tearing it down the instant it scrolled off, under a small concurrency cap.
Three real bugs surfaced testing it end-to-end in a browser rather than
trusting the design on paper (an opaque background hiding the plot before
boot; the same background never clearing after teardown; Leaflet's
attribution control coming out as illegible clipped text at 44×60px) — all
fixed, all shipped as v7.18.0.

**It worked exactly as designed, and it was still wrong.** The founder's
verdict, read the same day: *"a city should be drawn with a shape, and
that's it — we don't need pins on the thumbnail and the leaflet map, it's
too much."* Every citizenship discipline in draft one was aimed at *how*
tiles get fetched; the actual problem was that a live, individually-tappable
street map was never the right thing to put in a 44×60px row, however
carefully it's fetched. Good engineering in service of the wrong shape.

**Draft two — no map, no pins, a shape.** Every café's own footprint —
literally, its own lat/lon — folded into one soft silhouette: each point
first given a small round territory of its own (so a single café reads as
*a place*, not a dot), then the convex hull of all of those territories
together, corners softened into one continuous curve. One café, two close
together, two cities apart, a tight cluster, a whole spread city, a
perfectly straight row of them — one pipeline handles all of it with no
special case, because the inflate-then-hull step is what turns a single
point or a degenerate line into a real 2D shape before the hull is even
computed. `convexHull` (Andrew's monotone chain) and `roundedHullPath`
(quadratic-Bezier corner cuts, capped so they never eat more of an edge than
exists) are pure and tested — fixture point sets covering duplicates,
interior points, dead-straight rows, a single café, and a full spread city.
Rendered as a plain inline `<svg>`, styled in the same soft ink-wash the
passport and the export cards already use (`fill:var(--ink)` at low opacity,
a thin stroke) — no custom element, no lifecycle, no network, nothing to
gate or tear down, because there is nothing running.

**Everything draft one built for network citizenship, draft two simply
removed.** No `IntersectionObserver`, no concurrency cap, no attribution
workaround, no tile row in `ARCHITECTURE.md` §7 — the full-screen city
chapter and café page keep their real Leaflet streets exactly as they were
before either draft; only the thumbnail changed, and it no longer touches
the network at all.

**The line band, reopened at draft one and left that way.** `main` stood at
4,716/4,800 when this phase was scoped — 84 free — and both of the prior two
amendments (Phase 14, Phase 15) had explicitly named **5,000** as the number
past which raising the band again stops being honest and "the one-file law
itself has come due" starts being it. Put to the founder directly; the
answer was to amend to 5,000 now, recorded in `ARCHITECTURE.md` §1 as a
**reopened decision**, not a routine bump. That decision doesn't get undone
just because draft two happened to need fewer lines than draft one did —
it was made on the project's trajectory, not on one phase's byte count.
Final tally: **4,824/5,000**, byte ceiling untouched at 391/500 KB.

**Tripwires, both times.** Draft one recorded a genuinely new class of touch
(a live map inside a scrolling list) as its own §7 row rather than folding it
in silently. Draft two removed that row again rather than leaving a stale
citizenship note for a touch that no longer exists. Neither a resolver, a
gamified mark, nor a new dependency at any point. No proof of anything
either — the shape is read off the same lat/lon the record already keeps,
never a rank, never a score dressed as geography.

**Done when — met:** a city's thumbnail shows the true, particular shape of
where the record actually reaches in it — instantly, offline, from the
ledger alone — and never asks a map server, a pin, or a tile for any of it.

### Phase 18 — the ground, and what grew on it

**Shipped — v7.19.0.**

**The joy it serves:** the record and the hunt at once — *where a coffee came
from*, drawn as ground rather than as a name. Altitude is most of the reason a
green from up there tastes the way it does, and until this phase the app held
altitudes as text and drew countries as flat silhouettes.

**Where this came from.** The founder, reading the Atlas on a phone: the map
is unreadable at that size, a country you tap into has no definition, and a
region is a list rather than a place. Four asks, in one sentence.

**What shipped.**

- **The passport at phone scale.** `carta-belt` drew into a fixed 1,000-unit
  viewBox whatever the box actually was, so on a 390 px phone an 11 px country
  name rendered at ~4 px and every hairline vanished. One SVG unit is one CSS
  pixel now. The tasted frame also inset itself to 20–80% of the box, throwing
  away 40% of a width a phone has none to spare of; it takes the width it has.
  Labels gained the halo in their width estimate and a real edge margin — a
  name that would run off the frame is **dropped, never clipped**, and the
  chips underneath still name every country.
- **A country shows its highlands.** `LAND_TOPO` — contours at 1,000 / 2,000 /
  3,000 m for 48 countries — has been in the file since Phase 3 and only the
  printed card ever drew it. `topo="on"` inks it back over a country's own
  fill. Nothing was added to the file to do this.
- **Its regions stand on it.** A region is marked where the record can place
  it, tappable into its chapter. A region with nothing placed is listed and
  never plotted — the ask's own rule, one scale down.
- **A region opens onto real terrain.** OpenTopoMap over the Leaflet layer
  that already ships (`ARCHITECTURE.md` §7 — a second tile URL on an existing
  row, put to the founder before it was written), with a pin on every farm the
  record can place, and the same on a farm's own page. Offline, it steps aside
  and the drawn plot stands.
- **A farm has a position.** `origin.lat`/`lon`/`geocoded` — two more optional
  story fields, stated by a lookup that names the farm back or a pin the keeper
  pastes, and takeable back with undo.

**What it declined.** A `regions` collection (a coordinate on a region means
matching region names to nodes — the gentle join applied to an origin story
field, which §4 rules out; a region is the mean of its placed farms instead).
Vendoring finer contour data for region-scale relief (**tripwire 2** — the
count stays two; where the file can't draw real ground it asks for it, and
draws nothing when it can't). Trusting a farm lookup: Nominatim answers
*something* for almost any query, and for an unknown farm that something is
the region around it — `namesBack` refuses it, so most smallholder farms stay
honestly unplaced rather than quietly pinned in the same wrong spot.

**The band, and what it means for the next phase.** This phase was built
against `main` at 4,716 lines and asked the founder the band question itself,
before a line was written — three real answers on the table (raise it, ship
only the country half, or split the map layer). While it was in flight, Phase
17 landed and **asked the same question and got the same answer**: the band
stands amended once, at Phase 17, to **3–5,000**. Phase 18 therefore makes no
amendment of its own; it spends what that one left, and nearly all of it,
landing — after Phase 17's second, larger correction moved the floor — at
**5,043 lines / 407 KB, over it.**

Then Phase 17 shipped a second time the same day — its correction traded the
live thumbnail for a drawn city shape and left `main` at 4,824 rather than
4,774. Phase 18's 219 lines land on top of that at **5,043 / 5,000: over.**

That is not a request for a fifth amendment. §1 records the overage as an
**open debt** and says what both prior amendments already said would happen at
this number: **the next move is the split.** Two independent sessions reached
5,000 in one afternoon; the one-file law has come due exactly as Phases 13 and
15 predicted. The byte ceiling is untouched and comfortable at 407 of 500 KB,
which is the point it was always making: bytes were never the problem.

**The founder's call, made on the PR:** land Phase 18 over the ceiling with
the debt recorded, and give the split a phase of its own rather than bundling
it into a feature's PR. That phase is next, and it is written below rather
than left to be rediscovered.

### Phase 19 — the split

**Shipped — v7.22.0.** Landed after Phase 20, not before it: Phase 20 was
already built against the pre-split file when the two collided on `main`,
and the founder's call at that point was to land Phase 20 anyway and let
this phase pay a larger debt than it was scheduled against (`LOGBOOK.md`'s
Phase 20 entry and `ARCHITECTURE.md` §1 carry the full account).

**The joy it serves:** none directly, and that was the honest framing going
in. This is the first phase in the fourth turn whose whole job was to pay a
debt, scheduled because §1's own rule scheduled it, not because a surface
wanted it. The joy it protects is *a file one person can read whole* — the
thing the line band was a proxy for all along.

**What it did.** Moved the map layer out of `index.html` into
**`carta-map.js`**, loaded from the `<head>` with a plain `<script src>`:

- the three custom elements (`<carta-belt>`, `<carta-plot>`, `<carta-streets>`)
- the vendored `d3-array` + `d3-geo` (§1 — the count stays two)
- `LANDS`, `LAND_TOPO`, `LAND_AKA` and their decoders
  (`landRingsRaw`, `landTopoRaw`, `landKey`, `landAnchor`)

535 lines that are the map layer rather than the app. `index.html` came back
to **4,854 lines / 321.5 KB** — inside the band with real room again, and the
band itself stays 3–5,000 for the app file. `carta-map.js` is **535 lines /
108.4 KB**. Combined, the app is the same size it always was — this phase
moved lines, it didn't cut anything. **Not a build step:** no bundler, no
npm, no lockfile, no transpile. Two static files, both droppable on a host,
which is the promise the byte ceiling was always guarding.

**The one real problem, solved.** The app script and the map layer were
mutually coupled: the elements call `landRingsRaw`, `landTopoRaw`, and their
own private `BELT`/`AKA`/`fold` (self-contained in the elements' own closure,
untouched by the split), while the app's own `passportSVG`,
`tastedCountryMap`, `landKey` and `landAnchor` read `LANDS`/`LAND_TOPO`
straight. The shape this section predicted is the shape it shipped:
`carta-map.js` owns the ground data, the decoders and the elements, and
publishes the handful the app reads — `LANDS`, `landRingsRaw`, `landTopoRaw`,
`landKey`, `landAnchor` — on `window`, the same way `CARTA_LAND_NAMES`
already goes the other way. (Classic scripts sharing one page already share
a global scope, so the bare identifiers would have resolved either way; the
explicit `window` publish was kept anyway; it documents the seam rather than
relying on that alone, and costs nothing.)

**What it didn't become.** A refactor with opinions. Nothing was rewritten,
renamed, restyled or "improved" on the way across — the diff reads as a move
plus the seam, verified against every browser check from Phases 12–18 and
Phase 20's own front-door composer, unchanged.

**Done when — met:** `index.html` is back inside the band on its own,
`carta-map.js` stands beside it, the pure harness still slices its region
out of `index.html` and passes (74/74), and the passport, the country
contours, the city shape and the street surfaces all render in paper and
dusk exactly as they did before — checked by loading the app, seeding a
tasted country, and opening its chapter to confirm the topo contours draw.

### Phase 20 — Ask Carta, at the front door

**Shipped — v7.21.0. Landed ahead of Phase 19, deliberately — see below.**

**The joy it serves:** the hunt — specifically, the distance between wanting
to ask and actually asking. The ask was a button at the bottom of the Atlas,
under everything the record had already done; reaching it meant scrolling
past the passport, the cities and the tasted countries first. It is the
first thing the Atlas says now.

**What ships:** the passport stays the ground — it is the argument every ask
is made from — and the question sits directly on it: one field in the hero,
one word to send it (`.askfield`). What Carta has already found moves from
a scroll away to directly under the fold, one tap from being reopened,
because an answer you can't get back to is a receipt, not a record. The
composer states what goes out with the ask as a ledger before anything
leaves — the bar, the scores, what's excluded by name, the scope — each row
read live off the record as it stands, `unread` wherever the record is
silent, and the whole block is a door onto the brief itself if you want
every character of it (`askLedgerRowsHTML`, `openAskBrief`). The wait — the
one call Carta makes, which used to run silently under the button that
started it — is a screen of its own now (`vAsking`), narrating the work
rather than performing patience: the record read back in its own counted
figures, the bar you hold, the call itself, then each name placed one at a
time as its address confirms, landing on the wait's own plot as it lands.
One hairline carries the progress, allotted in advance so it never runs
backwards when the answer turns out to name eight places instead of five.
Cancel is a real cancel — the fetch aborts via `AbortController`, the
grounding loop stops at the name it's on, and nothing is written to the
ledger. A failed call states the model's own reason where the wait was,
with both doors on it: back to the ask, or copy the brief. The answer
settles in on arrival, one row at a time in the order it was argued, rather
than landing as a wall — marking a finding afterward re-reads the same
screen and does not replay the settle. Reduced motion stills all of it.

**The tripwires, screened.** No new network row: the wait narrates the same
three touches the ask already made (the model call, the geocode pass) —
nothing here calls out that didn't before. No gamification — the settle is
a writing-in animation, not a score, and it plays once, never as a return
nudge. No resolver, no proof: the ledger states what the record already
holds: the same figures `briefPlainText` was already sending, just read
aloud before the key is spent. **Cancel's honesty caught a real bug on the
way in.** The draft this phase started from wrote the ask to `D.asks` and
saved it *before* its last pacing beat, so a cancel landing in that final
~900ms window would abort nothing — the answer was already fully grounded
and already on the record, contradicting "nothing is written down" stated
as this phase's own invariant. Fixed by moving the write after that beat's
own cancel check, so every `_askCancel` branch in `runAsk`, including the
last one, returns before `D.asks.unshift` runs.

**Landed into a debt already owed, and made it larger — on purpose.** This
phase was built against the file before Phase 18 and Phase 19 existed on
`main`; both merged first, and with them the rule Phase 18 wrote directly
into `ARCHITECTURE.md` §1: *nothing new goes into `index.html` before the
split does.* This phase's own furniture (the front-door composer, the
narrated wait screen, the settle-in animation) doesn't fit that rule — it
adds to the very file the rule says not to touch. Put to the founder
directly rather than assumed: hold this work until Phase 19 ships, or land
it now and knowingly deepen the debt Phase 19 exists to pay down. The call
was to land it. `index.html` stands at **5,374 lines against the still-
unamended 5,000** (up from Phase 18's 5,043), bytes comfortable at
428.7/500 KB. Recorded in `ARCHITECTURE.md` §1 as a second, larger debt
against the same ceiling — not a fresh amendment, and not a precedent for
the next phase to add more without asking the same question again.

**Done when — met:** the ask is reachable from the Atlas in one tap and one
field, states what it's about to send before the key is spent, narrates its
one network call rather than hiding it, and a cancelled ask leaves nothing
behind.

### Phase 21 — the coffee is the draft (scheduled, not yet built)

**The joy it serves:** #1 (the cup, caught) and #3 (take it home) —
protecting work already done, the same durability register as Phase 8. Not
a new surface; a fix to one that already loses what you put into it.

**The risk it closes.** `openSheet`/`closeSheet` hold no state of their
own: a swipe-dismiss or a tap on the dimmed backdrop calls `closeSheet()`,
which does `s.innerHTML=''` unconditionally. Every field in the coffee form
(`openCoffeeForm` / `saveCoffeeForm`) is plain DOM state until "Save" is
pressed — dismiss the sheet first, and it's gone. Reported directly, and it
matches how the founder actually adds a coffee: read the menu, order,
type what's known while sipping, get pulled away before finishing, meaning
to come back once there's time to look the rest up. Today that return trip
starts from zero, because the sheet doesn't remember it was ever open.

**What it does.** No shadow "draft" object living alongside the real
record — that's a second, unsynced copy of the same fact, exactly the kind
of parallel state `ARCHITECTURE.md`'s invariants exist to prevent. Instead
the coffee becomes the record the moment it has enough to exist, the same
move the menu capture already makes (a line's coffee is minted, and the
menu item points at it, before its cup form even opens, "so the link
survives whether or not the cup itself gets finished"). Concretely:
- The coffee form's fields autosave (debounced) into `D.coffees` once the
  same gate `saveCoffeeForm` already enforces is met — a roaster or a name
  typed. Nothing is minted before that; an empty sheet swiped shut leaves
  nothing behind, same as today.
- Once minted, every further keystroke lands the way `save()` already
  lands everything else in this app. A swipe, a backdrop tap, the phone
  put away mid-sip: whatever was typed is on the Shelf, not lost. Reopening
  that coffee later (`openCoffeeForm(id)`) continues from exactly what's
  there — no separate "resume the draft" screen, because there's no
  separate draft.
- The gentle join still fires once, on the roaster field settling, not on
  every keystroke — unchanged from `saveCoffeeForm`'s single call today.
- "Save" stops being the only thing that persists and becomes what it
  already reads as: *I'm done here for now.* The empty state this leans on
  is already designed — the form's own note ("A field left blank is
  unread, not wrong") was written for exactly this shape and needs no new
  copy.

**What it must not become.** A staging schema, an "unpublished" flag, or a
second copy of a coffee reconciled into the real one later — any of those
is new machinery for a problem the record already solves by being allowed
to stay sparse. And it stays scoped to the coffee form specifically — the
one that actually loses work today — not a blanket "autosave every sheet";
if the café-cup or Setup forms are ever felt to have the same problem,
that's its own phase, not assumed here.

**Done when:** typing a roaster or name into the coffee form, then swiping
the sheet away (or backgrounding the app, or force-closing it), leaves that
coffee on the Shelf with whatever was typed. Reopening it picks up exactly
there, never blank.

### Phase 22 — search, on your own key (scheduled, not yet built)

**The joy it serves:** #1 and #3, same as Phase 21 — the part of adding a
coffee that today means a separate sitting later, at home, typing roaster
names into a search bar by hand to find the region, process and altitude a
café's menu never states.

**The tripwire, screened once.** Cross-source entity matching and
corpus-wide "correction" — search other sites, match a coffee across
roasters and importers, reconcile what they disagree on, then update what's
already on the shelf — is `docs/RESOLVER.md`'s own machinery: a fingerprint
scorer, propose-and-confirm, merge and split. That's Lotmark's ladder, not
Carta's (`ROADMAP.md` tripwire 1), and it's exactly why `classic/` reached
12,500 lines. This phase is the cut that stays on Carta's side of that
line: one BYO-key model call, keeper-summoned, scoped to the one coffee
open in the form right now, its answer landing as an editable suggestion —
never a sweep across the shelf, never a comparison between two of the
keeper's own coffees, never a silent overwrite.

**What it does.** A button on `openCoffeeForm`, beside Save — **Search for
more** — live once the same gate Phase 21 mints on is met (a roaster or a
name typed). One call, through the same channel the ask and the menu OCR
already use (`ARCHITECTURE.md` §7's one sanctioned exception, BYO-key,
`callModel`/`api.anthropic.com`) — not a new network citizen, the same row
asked to use its search tool. The model gets what's already in the form and
comes back with values for the fields still blank — region, process,
variety, altitude, mill — each landing in a plain, already-editable input,
with one line under it saying where it came from. Accept it by leaving it,
correct it by typing over it, the same as any autofill anywhere else in the
app. Nothing needs a separate "confirm the suggestion" step, because after
Phase 21 an input field already is that step — whatever's typed (or left
as suggested) is what's on the record.

Re-openable per coffee, one at a time, from the Shelf — the same button on
the same form, whether the coffee was minted five minutes or five weeks
ago. Explicitly not a batch job: no "search all" over the shelf, no
background sweep, no field changed on a coffee the keeper hasn't opened.

**What it must not become.** Anything that runs without the keeper opening
that one coffee and pressing that one button. Anything that compares two
of the keeper's own coffees to each other, or writes a confidence or grain
onto a field — that is the resolver's ladder (`RESOLVER.md` §6), not this.

**Done when:** opening any coffee — freshly minted or long since put on
the shelf — and pressing "Search for more" fills in whatever origin fields
are still blank, sourced and editable, without touching a field already
typed, and without any call happening unless that button was pressed.

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
   `ARCHITECTURE.md` §1. The kit stays light. (Phase 18 is the worked
   example of this firing and being obeyed: region relief wanted finer
   contour data vendored into the file, and got a tile URL on an existing
   network row instead — the count is still two.) (Phase 10's shortcut is a
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
