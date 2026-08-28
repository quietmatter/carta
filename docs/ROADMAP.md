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

*Phases 8–26 are all shipped, Phase 19 landed after Phase 20 rather than
before it (Phase 19's own entry below has the account of why). Carta 7
stands at **v7.28.0, `index.html` 5,800 lines + `carta-map.js` 535 lines,
94/94 pure tests** — 800 lines over the 5,000-line band, disclosed in
Phase 26's own entry and in `docs/ARCHITECTURE.md` §1. Full prose for each
is in `LOGBOOK.md`, cited here, not repeated.*

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

### Phase 21 — the coffee is the draft

**Shipped — v7.23.0.**

**The joy it serves:** #1 (the cup, caught) and #3 (take it home) —
protecting work already done, the same durability register as Phase 8. Not
a new surface; a fix to one that already lost what you put into it.

**The risk it closed.** `openSheet`/`closeSheet` held no state of their
own: a swipe-dismiss or a tap on the dimmed backdrop calls `closeSheet()`,
which did `s.innerHTML=''` unconditionally. Every field in the coffee form
was plain DOM state until "Save" was pressed — dismiss the sheet first, and
it was gone. Reported directly, and it matches how the founder actually
adds a coffee: read the menu, order, type what's known while sipping, get
pulled away before finishing, meaning to come back once there's time to
look the rest up. The return trip started from zero, because the sheet
never remembered it had been open.

**What it does.** No shadow "draft" object living alongside the real
record — that's a second, unsynced copy of the same fact, exactly the kind
of parallel state `ARCHITECTURE.md`'s invariants exist to prevent. Instead
the coffee becomes the record the moment it has enough to exist, the same
move the menu capture already makes (a line's coffee is minted, and the
menu item points at it, before its cup form even opens, "so the link
survives whether or not the cup itself gets finished"). Concretely:
- `openCoffeeForm`'s fields call `cfAutosave()` on every `oninput`. Nothing
  is minted into `D.coffees` until the same gate `saveCoffeeForm` used to
  enforce before its one final Save is met — a roaster or a name typed. An
  empty sheet swiped shut still leaves nothing behind.
- Once minted, every field writes straight into the real record on each
  keystroke; only the `save()` call itself (the localStorage write) is
  debounced 400ms, so rapid typing doesn't thrash storage — the in-memory
  write a swipe can't lose already happened by then regardless. `closeSheet`
  now calls `cfFlush()` unconditionally (a no-op for every other sheet in
  the app, since it only does anything when the coffee form's own autosave
  is live) — a final `save()`, then a `render()` so the Shelf behind
  reflects it immediately, however the sheet closed.
- The gentle join still fires once: `cfRoasterSettled()` runs `resolveRoaster`
  on the roaster field's `blur`, not on every keystroke, exactly as
  `saveCoffeeForm`'s single call used to. "New ground" (Phase 12) is the
  same — `cfCountrySettled()` fires it once, on the country field's blur,
  never mid-keystroke.
- The button beside the form is **Done**, not Save — closing the sheet is
  now literally all that's left for it to do. The empty state this leans on
  was already designed: the form's own note ("A field left blank is
  unread, not wrong") needed only one added sentence ("Everything above
  saves as you type"), no new copy invented.

**What it must not become, and didn't.** No staging schema, no
"unpublished" flag, no second copy of a coffee reconciled into the real one
later. And it stays scoped to the coffee form specifically — the one that
actually lost work — not a blanket "autosave every sheet"; the café-cup and
Setup forms are untouched, and if they're ever felt to have the same
problem, that's its own phase.

**Done when — met:** typing a roaster or name into the coffee form, then
swiping the sheet away, tapping the backdrop, or reloading the page mid-sit,
leaves that coffee on the Shelf with whatever was typed. Reopening it picks
up exactly there, never blank — checked directly (Playwright, both open
paths) against a fresh `D.coffees` mint via a backdrop tap, an edit to an
already-existing coffee closed the same way, roaster-resolution firing on
blur, and an empty form swiped shut minting nothing.

### Phase 22 — search, on your own key

**Shipped — v7.24.0.**

**The joy it serves:** #1 and #3, same as Phase 21 — the part of adding a
coffee that used to mean a separate sitting later, at home, typing roaster
names into a search bar by hand to find the region, process and altitude a
café's menu never states.

**The tripwire, screened once.** Cross-source entity matching and
corpus-wide "correction" — search other sites, match a coffee across
roasters and importers, reconcile what they disagree on, then update what's
already on the shelf — is `docs/RESOLVER.md`'s own machinery: a fingerprint
scorer, propose-and-confirm, merge and split. That's Lotmark's ladder, not
Carta's (`ROADMAP.md` tripwire 1), and it's exactly why `classic/` reached
12,500 lines. This phase stayed on Carta's side of that line: one BYO-key
model call, keeper-summoned, scoped to the one coffee open in the form
right now, its answer landing as an editable suggestion — never a sweep
across the shelf, never a comparison between two of the keeper's own
coffees, never a silent overwrite.

**What it does.** A button on `openCoffeeForm`, beside Done — **Search for
more** — hidden until the same gate Phase 21 mints on is met (a roaster or
a name typed; visible immediately when editing an already-minted coffee,
unhidden the moment `cfAutosave` mints a new one). One call, through the
same channel the ask and the menu OCR already use (`callModel`, `POST
api.anthropic.com/v1/messages`, BYO-key) — not a new network citizen,
`callModel` only gained an optional `tools` argument so the same row could
be asked to use Anthropic's server-side web-search tool
(`web_search_20260209`). The prompt (`cfSearchPrompt`, pure and tested)
states what's already on the form and asks for real values for only the
fields still blank — country, region, farm, producer, variety, process,
altitude, mill — each one required to name an actual source or be left
out entirely; the parser (`parseCfSearch`, pure and tested) restricts the
model's answer to exactly the blank keys it was asked about, so even a
model that volunteers a value for an already-filled field can't touch it.
Whatever comes back fills the matching input directly — a plain, already-
editable field, accept it by leaving it, correct it by typing over it, the
same as any autofill anywhere else in the app. Nothing needs a separate
"confirm the suggestion" step, because after Phase 21 an input field
already is that step.

One deviation from the original write-up: rather than one attribution line
under every individual field, the result lands as a single status line
below the button ("Filled from search: Region (Sey's own product page),
Process (an importer listing). Couldn't verify Altitude, Mill — left
blank.") — simpler to build, and it reads as one settled fact rather than
several fragmented notes. The source is still named per field, just
gathered in one place rather than scattered under eight inputs.

Re-openable per coffee, one at a time, from the Shelf — the same button on
the same form, whether the coffee was minted five minutes or five weeks
ago. Not a batch job: no "search all" over the shelf, no background sweep,
no field changed on a coffee the keeper hasn't opened. A coffee with every
field already filled short-circuits before spending a call at all
("Every field here is already filled in.").

**What it must not become, and didn't.** Anything that runs without the
keeper opening that one coffee and pressing that one button. Anything that
compares two of the keeper's own coffees to each other, or writes a
confidence or grain onto a field — that is the resolver's ladder
(`RESOLVER.md` §6), not this.

**Done when — met:** opening any coffee — freshly minted or long since put
on the shelf — and pressing "Search for more" fills in whatever origin
fields are still blank, sourced and editable, without touching a field
already typed, and without any call happening unless that button was
pressed. Verified with Playwright against a stubbed `fetch`: the request
actually carries the web-search tool; a field already typed survives even
when the (adversarially malformed) mock response tries to overwrite it; no
key set opens the key sheet instead of calling out; an all-filled coffee
never reaches the network at all. `cfSearchPrompt`/`parseCfSearch` are
pure and now in `test/model.test.js` (79/79 pure tests).

### Phase 23 — the cup, compared

**Shipped — v7.25.0.**

**The joy it serves:** #3 (take it home) and #2 (the hunt) — a coffee's own
page (`openCoffeeDetail`) used to state "Cups so far: 4" and nothing else.
It showed none of the cups behind that number: not the home pulls, not the
café cups, not where each café one was drunk. The comparison the founder
actually wants — *does my own pull of this coffee compare to the one I had
at the café it came from* — was already structurally there (every cup
carries the same `coffeeRef`); it had simply never been drawn.

**What it does.** The bare count is now an actual list (`coffeeCupRowHTML`):
every cup of this coffee, newest first, each stating its kind (home or
café) via the same lead the Journal's own rows already use — a photo if
the cup has one, `home`/`out` otherwise — and its score. A café cup states
the place itself as its title, neighborhood or city as its meta. A home
brew states its Setup (name, or grinder · brewer) and technique instead.
Tapping any row opens that cup's own screen (`openCupDetail` → `vCup`),
which already carries a café cup the rest of the way to the café's own
page (its ledger's "Café" row, and the streets button beneath it) — so
"reachable from the coffee's own page" needed no new door, just the one
`vCup` already opens. No new data, no new model, no resolver — this is the
taste model's own "a figure travels with its reasons" turned toward one
coffee instead of one figure.

**What it must not become, and didn't.** An average, a rank, or a score
comparing the keeper's own cups against anyone else's — every figure here
stays this one keeper's own cups, read back, nothing computed across them.

**Done when — met:** opening any coffee shows every cup of it, home and
café both, each linked through to where it happened — verified directly
(Playwright): a coffee with a home cup and a café cup lists both correctly
in both themes; tapping a café cup's row lands on a screen that names the
café; a coffee with no cups states "No cups yet" and renders no rows. 79/79
pure tests unaffected (nothing touched lived inside the tested region).

### Phase 24 — pulled, not typed (shipped — v7.26.0)

*Phases 24 and 25 are one idea in two steps. **24 is the connection**, built
where the coffee is already chosen and nothing has to be matched — the
smallest place the integration can be proven end to end. **25 moves the
entrance to the door**, which is where this actually belongs; see §"where
the pull belongs" under Phase 25 for the architecture, decided before 24
was built so 24 doesn't get built into a corner.*

**The joy it serves:** #4 (the dial-in) — dose, yield, time and grind are
often already captured by the keeper's own gear (an espresso machine's own
control app, a Bluetooth scale's own app) the moment the shot or pour
finishes. Retyping them into Carta's dial-in screen is pure friction for
anyone whose equipment already recorded the numbers once.

**A correction made before building, not after.** Scoping this phase first
said "auth is a separate secret token, not the account password," taken
from a search summary and never checked against the primary source. Before
writing any code, the actual OpenAPI spec at `apidocs.visualizer.coffee`
was fetched directly: Basic Auth genuinely is the real email and password,
and Visualizer's own docs recommend OAuth *instead*, by name, for "public
applications, distributed integrations, and any workflow exposed to other
users" — precisely to avoid a third-party app collecting a keeper's
password. Put to the founder directly with both options (Basic Auth now,
accepting the real-password tradeoff, vs. OAuth's Authorization Code flow,
which needs a fixed pre-registered redirect URL and a safe place for a
client secret — neither of which a static, buildless app dropped on any
host or opened from `file://` can offer). The founder's call: **Basic Auth
now.** `openVisualizerKey()`'s own copy states this plainly — the real
account login, not a scoped key, kept on-device, sent only to
`visualizer.coffee` — and `docs/ARCHITECTURE.md` §7 carries the full
reasoning and the correction itself, named rather than quietly overwritten.

**What research found, and what it settled** (confirmed directly against
the live API, not summarized secondhand):
- **CORS is wide open** (`access-control-allow-origin: *`) — a plain
  browser `fetch` reaches it, same as the ask reaches `api.anthropic.com`.
  No server, no proxy; the "no server" invariant holds.
- **The list endpoint takes `?page=&items=`, not `?limit=`** — confirmed
  against the Postman-documented collection; a guessed `?limit=` param is
  silently ignored.
- **`?essentials=true` on a shot's detail route returns metadata without
  the curve arrays** — confirmed by diffing against the same shot ID's
  full, non-essentials response.
- **A live shot's actual fields** confirm the mapping onto Carta's own brew
  fields: `bean_weight`→dose, `drink_weight`→water/yield, `duration`→time
  (rounded to the second), `grinder_setting`→grind, `bean_brand`/
  `bean_type` line up as the picker's label.
- **No scalar temperature field exists anywhere** — only curve arrays
  (`espresso_temperature_goal`/`_basket`/`_mix`). The scoping guess that one
  "almost certainly exists" was wrong; the temp dial stays exactly as
  manual as it always was rather than inventing a derived number from a
  curve.
- **Pourover coverage is confirmed possible, still not confirmed in
  shape** — BOOKOO N syncs pours to Visualizer, per the founder directly,
  but a real synced pour's field names haven't been inspected. Not built
  in this pass; espresso-shaped fields only.

**What it does.** A **Pull from Visualizer** button inside `vBrew`, beside
the existing dials — keeper-summoned, one brew at a time, never required.
Tapping it lists the keeper's own 8 most recent shots (`parseVisualizerShot`
reading each one's essentials payload), labeled by roaster/coffee or an
honest "Untitled shot" when the shot names none; picking one fills the
dose/water/time/grind dials via `setDial`'s existing surgical redraw —
landing in the same already-editable dial state manual entry writes to,
accept it by leaving it, correct it by turning the dial, exactly Phase 22's
"an input field already is the confirm step" posture. **No link-out to
Visualizer's own graph was built** — no confirmed public URL pattern for a
shot's own page was found during research, and guessing one risked a
broken link, so it was left out rather than shipped wrong. Manual entry
stays exactly as it is today — the fallback the founder asked for,
unchanged, never gated behind having a Visualizer account at all.

**What it must not become, and didn't.** Matching a pulled shot's
`bean_brand`/`bean_type` against the keeper's own coffees is **Phase 25's
job, not this one** — here the coffee is whichever one `vBrew` is already
open on, so nothing needs deciding. No "browse all my shots" screen either.
It stays BYO-Basic-Auth, keeper-owned, on-device — no Carta-run account, no
server holding anyone's Visualizer credentials, same posture as the ask.

**A bug found and fixed on the way in.** A second, fully-shadowed
`openBrewFlow` — dead since Phase 13 moved the brew flow into its own
screen, silently overwritten by the real definition and unreachable by
anything — was still sitting in the file. Deleted on sight (42 lines, no
behavior change: nothing could have called the dead one). Named here
because it's the kind of latent bug that only stops being invisible when
someone happens to edit "the wrong one."

**The line band, disclosed rather than crossed quietly.** `index.html`
lands at 5,012 lines / 333.9 KB — 12 over the 5,000-line ceiling Phase 19
closed the debt on, bytes comfortable at 333.9 of 500 KB. Comments and code
were tightened on the way in before this was accepted; a further trim was
possible only by cutting into the feature itself or fighting the file's
established density, and eleven lines wasn't judged worth either. See
`docs/ARCHITECTURE.md` §1 for the full account.

**Done when — met:** dialing in a brew, pressing "Pull from Visualizer,"
and picking a recent shot fills the dose/water/time/grind dials with real
numbers instead of typed ones, every dial still turnable by hand exactly
as before the button existed — verified directly: the button opens the
account sheet first when no credentials are set; a saved Basic Auth header
reaches `visualizer.coffee` and a picked shot's numbers land in the right
dials via `setDial`; a wrong password's 401 and an empty shot list both
degrade to a stated message rather than a silent failure. 83/83 pure tests
passing, including four new `parseVisualizerShot` cases (a real shot's
shape, an honest "Untitled shot" fallback, refusing to guess a blank or
unparseable field, and never throwing on a missing payload).

### Phase 25 — the pull, at the door (shipped — v7.27.0)

**The joy it serves:** #1 (the cup, caught) — the same joy the door was
built for, extended to a keeper whose gear already wrote most of the entry
down. Phase 24 makes the pull *work*; this puts it where it belongs.

**Where the pull belongs — the architecture, stated before either phase is
built.** Carta's home path mints three records in sequence: **coffee**
(what it is) → **brew** (how it was made) → **cup** (what it tasted like).
Read the live shot payload against that and the shape falls out:
`bean_brand`/`bean_type`/`roast_date`/`roast_level` **is** the coffee
record; `bean_weight`/`drink_weight`/`duration`/`grinder_setting` **is**
the brew record. A synced shot arrives carrying **two of the three already
filled in.**

The one thing it cannot carry is Carta's own reading — the 1–9, the
descriptors, the one honest line. (A shot does carry `espresso_enjoyment`,
on Visualizer's own scale. **It is never mapped onto Carta's 1–9**: a
converted figure could not state its reasons, and the whole taste model
rests on figures that can. The keeper's own reading is typed, always.)

So the pull does not belong inside the dial-in screen as a field-filler —
that is Phase 24's scaffolding, not its home. It belongs at **the door**,
where it **replaces the first two steps of the home path and lands
directly on `openImpression`**: the machine knows what it was and how it
was made; Carta asks only what it can't know. That is a *shorter* path
than typing one, ending on a screen that doesn't change at all.

**Why the door and not "add a coffee".** `openCoffeeForm` is a *shelf*
operation — it mints a thing you own, with no cup attached; it answers
"what's on my shelf". A synced shot is not a shelf entry, it is an
**event**. The door (`＋ A cup`) is the app's event entrance, already
reachable from every room, and it already does exactly this work:
`doorParse` reads a roaster and a coffee out of pasted text, then offers
the gentle join. A pull reads a roaster and a coffee out of a shot's JSON
and offers the same gentle join. **Same operation, different source** — so
this is one more branch on a screen that already does it, not a new
subsystem.

**What it does.** The door's first step gains a third way in beside paste
and type: **Pull it from Visualizer**. Picking a shot resolves its coffee,
mints the brew from its numbers, and opens `openImpression` — the door's
"where's this cup?" step is skipped, because a synced shot is a home brew
by definition. Everything downstream is untouched, including *"Skip — the
brew still counts"*, which is what makes high-volume pulling honest: pull,
skip, pull, skip, score the one that mattered.

**The matching this un-parks, and why it is still not a resolver.** Phase
24 never had to decide which coffee a shot was; entering from the door,
Carta must. That is the gentle join doing one more field's work, not a
ladder: the roaster goes through `matchNode('roasters', …)` exactly as the
paste path already does, and the coffee name is matched against **that
roaster's own coffees** through the same pure, tested `matchNodes` — an
exact spelling joins silently, a near one **asks once**, everything else
is new. No score, no rung, no confidence written to a field, no merge
without a tap. If it ever wants more than that, it is Lotmark's
(`RESOLVER.md`), and the answer here is no.

The Setup gets the same treatment, not a new mechanism: a shot's
`grinder_model` is *offered* against the keeper's existing Setups, falling
back to the current one. A brew still requires a Setup — that invariant
does not bend for a pulled shot. **Matched silently, though, not asked** —
unlike the roaster and the coffee, a Setup never gets a "same one?" sheet:
`matchSetupByGrinder` joins only on an exact fold match on the Setup's own
grinder name (`ARCHITECTURE.md` §4's gentle join, minus the asking), and
anything else falls to whichever Setup is already current — the same
fallback `vBrew` itself uses for a coffee with no brew of its own yet. A
keeper with no Setup at all mints one from the shot's own grinder name,
same as the dial-in screen already does when it finds none.

**One judgment call, made and named rather than silently decided:** the
door hides "Pull it from Visualizer" when it was opened from inside a café
(`openDoorAt`'s preset) — a synced shot is a home brew by definition, and
offering a home-only path on a screen already answering "at this café"
would be a button that could never do anything honest there.

**What this does to the manual path — re-roled, not deprecated.** The
dial-in screen fuses two jobs today, and a pull only eats one of them:
*recording* the numbers (gone, for synced gear) and *planning* — "begin
from the last cup, change one thing" — which happens **before** any shot
exists and no sync can take. That is joy #4, the north star, and it
survives untouched: Carta stays the only place that knows your 9 was at
grind 135 and you are about to pull at 140. The dials stop being a
data-entry form and become a reference and a planning surface. Three cases
keep the typed path fully alive besides: no synced gear at all, a hand
pourover on a scale that syncs nothing, and correcting a pulled brew whose
grind number is on the keeper's own scale. **Nothing about the manual path
is removed, gated, or hidden behind having an account.**

**What it must not become.** A batch importer. One event at a time is the
door's whole discipline, and a "sync all my shots" sweep would mass-mint
coffees never tasted and cups never read — the same shape Phase 22
refused for the shelf. Parked, not built.

**The line band, disclosed rather than crossed quietly.** This phase's
matching logic (the door's three new steps, the roaster/coffee gentle join
reused at the door, the Setup resolution, and the shared shot-fetching
helper now used by both pickers) is real new surface, not a small patch —
`index.html` lands at **5,141 lines / 341.0 KB**, 141 over the 5,000-line
ceiling Phase 19 closed the debt on, bytes still comfortable at 341.0 of
500 KB. Comments were tightened and two near-identical join sheets (roaster,
coffee) were folded into one before this was accepted, the same discipline
Phase 24 used; a further trim was possible only by cutting into the
matching logic itself, which wasn't judged worth it for a phase this shape
of new. Bigger than Phase 24's 12-line remainder because this phase is a
bigger phase — a whole new entry path with its own matching, not one
button on an existing screen.

**A finding, surfaced rather than folded into this phase's own scope.**
While bumping `APP_VERSION` and prepending this phase's own `CHANGELOG`
entry, no code anywhere in `index.html` was found reading either constant
back out — the What's New sheet `CLAUDE.md`'s own "version" section names
does not exist in the shipped file. Every changelog entry since v7.0.0 has
been written faithfully and shown to no one. Not fixed here — building
that sheet is its own small feature, not a Phase 25 concern, and grafting
it into this phase's diff would bury a real gap inside an unrelated one.
Logged plainly in `LOGBOOK.md` for the founder to pick up.

**Done when — met:** a keeper with synced gear opens `＋ A cup`, taps "Pull
it from Visualizer", picks the shot they just pulled, is asked once about
the coffee if Carta isn't sure, and lands on "What was in the cup?" with
the coffee and the brew already right — having typed nothing but the
taste. Verified directly: the button is absent from a café-context door;
an exact-spelling roaster or coffee joins with no question asked, a near
spelling asks once each, and declining either still finishes the pull as
its own new record; a Setup matches silently or falls back to the current
one, and a ledger with no Setup at all mints one from the shot's own
grinder name; a shot with no matching Setup and no grinder name refuses
with the same message manual entry already uses. 85/85 pure tests passing,
including new `parseVisualizerShot` coverage for the roaster/coffee/roast
fields and dedicated `normalizeRoastLevel`/`matchSetupByGrinder` cases.

### Phase 26 — the shot comes to you (shipped — v7.28.0)

**The joy it serves:** #1 (the cup, caught), taken further than Phase 25's
door. Where the pull asked the keeper to go looking for the shot they just
pulled, this phase has Carta go looking instead — the cup the keeper is
about to forget to log stands on the Atlas before they ask for it.

**What ships.** Turned on once, opt-in, in the shot screen's own settings
row (`prefs.vizWatch`, off by default), Carta checks once per app open —
after the first paint, never before it, guarded by `_vizChecked` against a
later `render()` re-firing it — for the most recent shot on the keeper's
Visualizer account. Unlogged, it takes the Atlas's own hero: the ask that
usually stands there steps down one slab into the lift, and the shot waits
as a stated fact with the cup already attached to it — "Poured 11 minutes
ago," never a badge, a dot or a count. Write the cup or say *Not mine* and
both reverse: the hero returns to its ordinary Phase 20 shape and the ask
climbs back to the top. A shot draws as a **plate** rather than a row of
dials — pressure in body ink, flow dashed beside it, what actually landed
in the cup as an 8% fill underneath, peak/ratio/time stated big and
whatever the file never said reading `unread` rather than guessed. Drag
across it and the readout follows the scrub, at three sizes: full-bleed and
scrubbable on the shot's own screen, a hairline on the cup once it's
written, a 44px thumb on every row in the new Journal-adjacent **Shots**
list. Typing a brew by hand is untouched, one door back in the Journal, for
a pour-over that leaves no shot file at all — nothing about the manual path
moved.

**The gentle join is Phase 25's, reused, not rebuilt.** An unprompted shot
runs through exactly the same `matchNode`/`matchNodes`/`matchSetupByGrinder`
chain the door already uses: an exact roaster or coffee spelling joins
silently, a near one asks once, anything else is minted new; a Setup
matches only on an exact grinder-name fold or falls back to whichever is
current. No new matching logic was written for the hero surface — station
05 (the join) appears only when it's actually owed.

**The tripwires, read at the gate:**

- **No gamification / no feed** — held. The hero states a fact with a cup
  attached to it and expires the moment that cup is written; nothing on the
  bar changes, and nothing counts or scores. Verified by test.
- **Third-turn relapse (no proofs)** — held. The join offers, never merges;
  *Not mine* leaves both records untouched and survives a re-open via
  `prefs.vizDismissed`.
- **Tooling creep** — held. No vendored library added; the count stays at
  two.
- **The one-file law** — **fired, and disclosed rather than amended.**
  `index.html` lands at **5,800 lines / 383.4 KB**, up from Phase 25's
  5,141 — 800 lines over the 5,000-line ceiling Phase 19 closed the debt
  on, bytes comfortable at 383.4 of 500 KB. The plate's own pure geometry
  (`platePaths`/`shotFigures`/`shotCurve`/`shotAt`, ~135 lines with their
  string-templating callers) was the named candidate to move into
  `carta-map.js` at this gate, the way the map layer itself moved at
  Phase 19; it stayed inline instead, by the founder's own call, because
  this phase's build had no `carta-map.js` to append to and no way to
  verify the seam without one. See `docs/ARCHITECTURE.md` §1 for the full
  account and the standing candidate for whichever phase next touches that
  file.
- **Offline-first** — held. Watch off makes zero calls; unreachable, the
  Atlas paints its ordinary hero and says nothing. A curve that never made
  it to the device simply doesn't draw — the cup, its score and its recipe
  stand alone regardless.

**Adopted decision to record: the curve keeps out of the ledger.** A shot's
three series are ~3 KB of numbers; putting them in `carta7.v1` would stop a
backup being a thing you can read as text, the same ruling `ARCHITECTURE.md`
§3 already made once for photos. They live instead in a separate key,
`carta7.shots.v1`, written only when a brew is minted from a shot and
thinned to at most 400 samples. The ledger itself still moves exactly two
fields (`cups.vizShotId`, `brews.vizShotId`) and two prefs
(`prefs.vizWatch`, `prefs.vizDismissed`) — nothing else.

**Adopted decision to record: `unread` reaches further than a first read
suggests.** Visualizer's essentials payload has no confirmed scalar for
water temperature or preinfusion time. Deriving "preinfusion" from where
the pressure curve first crosses 4 bar would be an interpretation, not a
reading — so both stay `unread` on the plate's ledger wherever the file is
silent, which is most of the time, and light up on their own the day a shot
file actually states either.

**Parked, not built:** a scalar temperature field (there is still no
confirmed reading, only a curve); the drift a shot shows against the
keeper's last cup on the same coffee, or against every 8 they've scored;
any card, share or export of a plate.

**Done when — met:** watch on, a shot with no matching cup takes the
Atlas's hero and the ask steps down; writing the cup or dismissing it both
reverse the hero, in either order; the plate scrubs to the dragged
position and states `unread` for whatever the file didn't say; a written
cup keeps its plate at a hairline and its foot rule reads off the ledger,
not the plate's own tenth-of-a-second reading; the Shots list carries every
recent shot with its own thumb curve, *New* marked against one already
scored; watch off makes no call at all. Verified end to end in headless
Chromium, paper and dusk, Visualizer stubbed, plus the branches (*Not
mine* surviving a re-open, Undo handing back what was typed, a curveless
shot reading its stated figures and drawing nothing, the curve surviving a
reload with the network cut) and the regressions (Phase 25's door, Phase
24's dial-in picker, a typed brew's impression sheet). 94/94 pure tests
passing, including new `shotCurve`/`shotFigures`/`platePaths`/`shotAt`
coverage.

**Patch, v7.28.1 — the plate was drawing nothing, for everyone.** Every
call this phase made for a shot's own data used `?essentials=true`, and
that flag was already known, from Phase 24's own research above, to omit
the curve arrays entirely — the field-name mapping had been checked
against a live shot, but the `essentials`-vs-full response shape never was
for this phase's own new fields. `shot.curve` was `null` on every path, so
the plate always fell back to its own "came without its curve" state, no
matter what Visualizer itself showed. Fixed by adding the one fetch this
phase's own copy already promised ("only the one you pick is read in
full," `vShots`' own note) but never actually made: opening a shot, or
picking one at the door, now triggers a second, real `/download` for that
one shot, cached per id so it is never fetched twice in a sitting; the
cheap list and watch calls are untouched. `docs/ARCHITECTURE.md` §7 has
the corrected network-posture row and the full account.

**Patch, v7.28.2 — the fetch was right; the read was still wrong.** The
keeper who reported the original bug tried v7.28.1 and reported it still
wasn't working — sending a backup export in for debugging. That file
couldn't carry the answer itself (curves live outside the ledger, in
`carta7.shots.v1`), so the actual live `/download` response for the
keeper's own shot was fetched directly and diffed. The finding: Visualizer
splits a shot's curve across two containers, not one — elapsed seconds at
the top of the response, pressure/flow/weight nested under `data` —
and `shotCurve` had only ever searched a single container per call, an
assumption never actually checked against a live payload since Phase 26
shipped. Every fixture written for `shotCurve`, including the new one
added for v7.28.1, used a flat shape that happened not to exercise the
split, so the pure harness stayed green through both bugs. Fixed by
hunting every key across both containers; verified directly against the
keeper's own shot (1,081 real samples, pressure and weight both correct)
rather than against another invented stub. What read at the time as "no
flow sensor on that particular one" was itself wrong — see v7.28.3 below.
`docs/ARCHITECTURE.md` §7 and `docs/LOGBOOK.md`'s v7.28.2 entry have the
full account.

**Patch, v7.28.3 — the flow was there too; reading it wrong made it look
absent.** The same keeper reported flow ("the ml/s") still missing after
v7.28.2. Their shot's `espresso_flow` genuinely is `null` — no direct
sensor — but a second field, `espresso_flow_weight`, carries real numbers
24 samples shorter than the rest of the curve; integrating it against
elapsed time reproduces the shot's own logged final weight almost exactly,
confirming Visualizer computes flow off the scale when a machine has no
flow meter of its own, which is most of them. Two compounding bugs:
`shotCurve` never tried that key, and its own length guard would have
rejected the array anyway for running short of the clock, on the
assumption a mismatch meant garbage rather than a reading that simply
stops a beat early. Fixed by adding the fallback key and dropping the
length rejection — the plate's own line-drawing already maps over
whatever series it's given, so a shorter one draws a shorter line, not a
crash or a stretch. 96/96 pure tests passing. `docs/ARCHITECTURE.md` §7
and `docs/LOGBOOK.md`'s v7.28.3 entry have the full account.

### Phase 31 — the second split (shipped — v7.38.0)

**The joy it serves:** none directly, and — like Phase 19, the only other
phase in this turn whose whole job was to pay a debt — that is the honest
framing. The joy it protects is *a file one person can read whole*, which is
the thing the line band was a proxy for all along.

**Why now.** Phase 30 carried the debt out at 891 lines over. Four small
keeper-reported fixes then landed on top of it in a single day (v7.37.4
through v7.37.7 — the manifest 404, the iOS standalone bottom edge, the
dismissal that didn't hold, the leaf on a short phone), none of which should
have had to stop for a band, and none of which had anywhere to go but into
the overdraft. That took it to **5,956 / 5,000**. Bytes were comfortable at
421.7 of 500 KB, which is why this was a debt and not an emergency.

**What it did.** Moved the Atlas out of `index.html` into **`carta-atlas.js`**,
loaded from the `<head>` with a plain `<script src>` and a `?v=` tag, the
same mechanism as the four siblings before it:

- the door itself — `vAtlas`, the plate, its one leaf and the ladder's five
  states, the sheet that pulls up under it, and the ask's own field
- the four walks Phase 13 drew — `vCountryChapter` → `vRegionChapter` →
  `vProducerPage`, and `vCityChapter`
- the ground helpers all of them read the record through — the greens, the
  road's six stations, the altitude band, the farm pins

1,196 lines that are the record *read against geography* rather than the
record. `index.html` comes back to **4,853 lines / 346.8 KB** — inside the
band with real room, within two lines of where Phase 19 left it. Combined,
the app is the same size it was: this phase moved lines, it didn't cut
anything. **Not a build step:** no bundler, no npm, no lockfile, no
transpile. Six static files, all droppable on a host.

**A named cut was not taken, in the open.** `ARCHITECTURE.md` §1 had named
the room-sized views (`vJournal`, `vShelf`, `vRecord`) as the obvious cut.
Measuring beat reading: the Atlas is one contiguous 1,126-line slab under its
own banner, the rooms are two scattered runs that together clear the band by
less; and the Atlas sits directly on top of `carta-map.js`, which is Phase
19's seam applied one storey up. §1 carries the full argument and the change
of mind.

**The one real problem, solved.** `index.html` was writing *into* the slab's
own state from two of its hottest paths — `save()` clearing the city-lead
memo, `render()` closing the Atlas sheet on arrival. A bare cross-file write
to a global `let` does work, and is the opposite of a documented seam. Both
became calls the file owns (`clearCityLead`, `resetAtlasSheet`), the same
shape `carta-shot.js` uses for `snoozeWaitingShot`. Five voice helpers went
the other way, into the domain block, because four files call them and they
were only under the Atlas banner by accident.

**A gap in the boot guard, found by extending it.** The guard's own comment
claimed it checked every sibling; `carta-map.js` had never had a
`MAP_VERSION` to check. It has one now, and all five siblings are checked.

**What it didn't become.** A refactor with opinions. Nothing was rewritten,
renamed or "improved" on the way across — the diff is a move, the seam, and
the harness that holds it.

**Done when — met:** `index.html` is back inside the band; `carta-atlas.js`
stands beside it; all six files agree on one version at boot; the pure
harness still slices five files and passes (139/139, untouched — nothing in
the moved slab was ever in a pure block); `verify-door.js` (59) and
`verify-v7.35.js` (40) both pass unchanged; and **`test/verify-split.js`**
(12) walks all four chapter screens — which nothing had ever opened
automatically before, and which is exactly how a split breaks a screen
quietly — plus the published seam and both new seam calls.

### Phase 30 — the front door (shipped — v7.37.0)

*From the Claude Design handoff `CARTA Front Door Redesign`. The commission:
make the door sleeker, more intuitive and far less text-dense; decide what
earns a place on it and what belongs a tab away; and let the detail — the
seals, the maps, the brew plates — reveal itself rather than being laid out up
front.*

**The idea.** The old Atlas was a sticky map with a question on it and ~2,270 px
of card below — asks, cities, a Visualizer pitch, a chip list, a share button,
all present at once whatever the app was opened for. The new door is **the
plate, one leaf and one pull.**

**The ladder.** `vAtlas` picks exactly one leaf; first true branch wins, and
the rest of the screen is identical between states.

| # | State | Condition | The leaf holds |
|---|---|---|---|
| 01 | First open | no cups, no coffees | the question, over an uninked belt |
| 02 | Nothing live | default | the question |
| 03 | A brew waiting | `waitingShot()` | that brew, its curve, its figures, **Write the cup →** |
| 04 | A bag resting | no waiting shot, a coffee on the shelf with a brew behind it | that coffee, its best so far, **Brew it →** |

05 is not a branch — it is any of the above with the sheet pulled up. Priority
is **03 > 04 > 02**: a brew expires, a bag does not, the question never does.

**What left the door, and where it went.** `welcomeHTML` deleted (state 01
says it in one display line and one italic line). "What Carta found" and
"Your cities" became rows and compact rows on the risen sheet. `atHomeSlabHTML`
moved to the **Shelf** — it is about your machine and your brews, and nothing
about it is geography. "Tasted so far" and Share became two of the three
one-line doors. `asktrustHTML` moved into the **ask composer**: the door states
what leaves the device at the moment something does, not one screen before.
**Nothing left the app** — it moved one pull and one tap further in.

**One field, two doors.** The field takes a place *or* a bag and the door's own
parser decides which (`doorParse` first; a roaster, a roast level or any origin
field means a bag). This is why the button lost its label and became **→** — it
cannot say "Ask" any more, because it does not always ask.

**The ember, counted.** *The ember marks the standing door; ink marks the
action in hand.* The field's `→`, both leaf actions and the waiting mark took
the sanctioned ink fill (`.btn-graphite`, back-ported from the design system),
so every state shows exactly **one** ember above the fold — `nav.tabs
button.door`. The v7.30.0 call on that door is untouched and was not reopened.

**The passport became a plate.** `<carta-atlas>` and `WORLD` folded into
`carta-map.js` — see `ARCHITECTURE.md` §1. Encoded, never fetched.

**Also in this phase:** the app icon and favicon from the same design project —
the seal cut by the belt, replacing a steaming cup drawn in five colours that
were never in the token layer.

**Done when** — all five states open; exactly one `#a63f2b` above the fold in
each; the plate draws with the network off; the settle, the breath, the
plate's draw-on and the sheet's travel all stop under
`prefers-reduced-motion`; dusk inverts through the roles with nothing
hard-coded; 320 px holds; a tasted country on the plate opens its chapter; the
pulled-up sheet closes behind every way of leaving the Atlas, not only the tab
bar. `test/verify-door.js` asserts every one of these (48 checks).

**Fixed after merge, same phase:** the initial PR (#138) shipped without two
of the above — `<carta-atlas>` drew a tasted country with no tap behind it
(sharing geometry with `<carta-belt>` isn't sharing its click wiring), and the
pulled-up sheet only reset on `go()`, not on `goBack()` (the ordinary `←` and
the phone's own back gesture). Both found by re-auditing the merged door
against the mockup rather than assuming the merge closed the phase; see
`ARCHITECTURE.md` §1 and `LOGBOOK.md`'s v7.37.3 entry.

**Open, carried out of this phase — now closed.** `index.html` left this
phase 891 lines over the band, and four keeper-reported fixes then took it to
956. **Phase 31 paid it**, on Phase 19's own seam and as a phase of its own,
exactly as this note said it should be. See `ARCHITECTURE.md` §1.

### Phase 29 — ground for every listing (shipped — v7.36.0)

*Phases 27 (photos retired) and 28 (the listing card and its seal) shipped
without sections of their own here; both are in `docs/LOGBOOK.md` and
`docs/ARCHITECTURE.md`, and this phase does not backfill them.*

**Where it came from.** The Carta listing redesign went live at Phase 28 and
was QC'd against its own mockup, which closed one gap and named several
others: a city row could draw its country but not its own ground, the
highlands sat in the file unspent above thumbnail size, and the belt stopped
at the countries that grow coffee, so every city in a consumer country said
*no outline on file* forever. The design work that followed is in
`CARTA Map Spec.dc.html` — six phases, five of them shipped here.

- **A · the belt reaches the consumer countries.** Denmark, Germany, Norway
  and Japan, cut from Natural Earth 1:110m through the belt's own simplifier
  (≤ 4.4 points per degree of extent, the density its existing sixty-five sit
  at), quantised to 0.05° and encoded with the same varint. **+474 b**, worst
  deviation 16 km. Rings are kept at ≥ 1/100 of the main shape's area *and*
  only where their latitude **and** longitude bands meet it — which keeps
  Zealand, Hokkaidō, Kyūshū and Shikoku, and drops Svalbard. They are ground
  for a seal, not countries on the passport: `LAND_OFF_BELT` holds them off
  the printed frame and `<carta-belt>`'s own `BELT_SET` already did.
- **B · the seal spends `LAND_TOPO` above 64 px.** `sealHTML(key, at, px)`
  takes the width it is drawn at: under 64 px the outline alone, because a
  0.05° contour at row width is four dots; at 64 and above the bands the
  width can hold, coarsest first, because the highest ground is the simplest
  shape and a seal showing one contour should show the right one. No call
  site passes a surface name, and the 36 px row seals are byte-identical to
  what shipped before it (verified by diff, not by eye).
- **C · the city plate.** A seal with a window: a box of *span* kilometres
  centred on the city, drawing only what closes inside it. One test at draw
  time, no city-by-city exceptions — a ring the frame would cut is a chord,
  not ground. Where nothing closes but the belt still knows the country, the
  row falls back to the country seal (Copenhagen's Denmark, Anchorage's
  Alaska); where it knows neither, the plate draws the record's own cafés at
  their own coordinates and the fact row states the fall. Marks are stated as
  a diameter in drawn pixels and converted into the window's kilometres, so a
  plate reads the same at 36 px and 168.
- **D · the city table.** `CITY_RINGS` and `CITY_ARCS`, keyed by city and
  quantised ten times finer than the belt, read by `landPts(s, q)` — one
  decoder, one new argument. Kept apart because their ink differs: a ring is
  filled and hairlined, an arc is stroked and never closed, since an open
  coast has no inside. **+76 b**: Los Angeles (1 → 12 vertices, the coast at
  Santa Monica Bay and the turn at Palos Verdes, 45 b) and Līhu‘e (6 → 8,
  31 b). A key is adopted only on two offline tests, and the second is what
  makes the first safe — **more vertices in the window, and every point the
  record holds there still on land.** Honolulu passes the first and fails the
  second on this source, gaining four vertices while losing the shore the
  city stands on, so it is **not shipped**; its strings are below, rejected,
  so the next source can be measured against the same failure.
- **E · Alaska is its own key.** It shipped as the USA entry's second ring,
  and a ring 5° of longitude clear of the main shape is the same object
  Svalbard is: it widened the frame to 7,479 × 5,137 km and left a Portland
  pin adrift at 45 % across. Split at the `;`, the contiguous frame is
  5,074 × 2,694 km, Portland lands on the coast, and an Anchorage row draws
  Alaska. **−1 b** — the separator. The printed passport is unchanged: the
  same 84 subpaths in the same frame, verified by diff.
- **F · elevation and true 1:10m city coastlines — not built.** It has no
  source in the repo and the spec defers it. The honest ceiling on what did
  ship: the city sources carry roughly 15 km of detail in-window, so a plate
  is truthful at 190 km and 110 km and no further.

**Done when, as assertions.** Every clause above is a case in
`test/model.test.js` (124–139), which slices a new pure block out of
`carta-map.js` — the harness's fifth file, evaluated first because that is
the browser's own `<head>` order. Round-trip, byte counts, the bbox
assertion, both adoption tests, and the two frames. 139/139 passing.

**Rejected, kept for the record.** Honolulu at 0.005°, which gains vertices
and loses the shore:

```
"honolulu" rings: 'nq9BkpInBpB7CAcuBoDD;r29BovIsB_CV1B1CH5BwD0BCmCsB'
"honolulu" arcs:  '1m9BwlIqBsB'
```

A second string was dropped rather than shipped: the generator emitted a
two-point `CITY_ARCS['lihue']` fragment 127 km from the city, which fails the
plate's own ≥ 4-vertices-in-window rule and falls outside every window the
plate opens. Dropping it is enforcing the rule, not deviating from it, and it
is why Phase D costs 76 b rather than the spec's stated 86.

**Open, and named as the author's rather than the data's.** The 190 km and
110 km spans were chosen by eye and want testing against real records; the
64 px threshold was measured on Ethiopia and Kenya, whose contours are dense,
and a country with two contour marks may deserve a lower bar; and Los Angeles
has no relief on file, which is the one thing that would make its plate about
Los Angeles rather than about the sea to its west.

### Phase 31 — the ask at the front door (parts one to three — v7.39.0, v7.40.0, v7.41.0)

*From the Claude Design handoff `Ask Carta at the Front Door`. The commission:
move the ask off its three screens of its own and onto the door's own
furniture — compose on a leaf over the plate, wait on the plate itself, and
land as a leaf, a new rung on the door's ladder. Nothing new in the design
language: the leaf, the plate, the pull, the fact row, the chip and the ember
are all already in the app.*

**Two of the four screens shipped at v7.39.0**, behind the second split
(above), which took v7.38.0 and moved the door this phase adds a rung to.
The wait and the rung are
decision-free redraws of what the app already holds. The composer leaf and the
answer-on-the-plate are not — each turns out to need a founder call the
handoff does not make, and both are held for those calls rather than guessed
at. The full account is in `LOGBOOK.md`; the short version is below.

**The wait, on the plate (frames `1e`/`1f`).** `vAsking` was a padded page: a
rule, a column of lines, and a 200 px pin box at the foot that only filled
once the placings began — the map was the last thing on the screen and the
first thing the answer needed. It is the plate now, full bleed, `main.fixed`
like the door itself. The plate is the belt the ask was asked from while
nothing is placed, and reframes to `<carta-plot>` as the first address
confirms, so the answer is half drawn before it is read. The rule moves to
`top:78` and states the reach until it has a count and the count after that;
the narration reads up out of a scrim that shrinks once the placings begin.
**The ember budget is the rule's fill and its tip, and nothing else** — the
live line's mark drops to ink, because the thing that is moving is the rule.
Cancel is unchanged and still a real cancel on every path.

**03b · an answer unread (frames `1g`/`1h`).** The ask used to push its answer
page up the moment the last name landed. It does not any more: the answer
**waits on the door**, on the bag leaf's own geometry — the name the model
argued first, what it is best for, where it is and how far you said you would
go, and the page one tap below. The ladder becomes **03 > 03b > 04 > 02**: you
asked for it, so it sits above the shelf; a brew expires and an answer does
not, so it sits under the brew. *Not now* drops it a rung and is **written
down**, unlike the waiting brew's session-only snooze — a brew put down is
nearly gone by the next open, and an answer offered again on every open for
the life of the record is a nag. It stays under *What Carta found*, one pull
below.

**Two fixes the design surfaced rather than asked for.**

- `<carta-plot>` drew a label above every dot unconditionally. The design is
  the first surface to ask for `labels="on"` on a real city, where a plot
  fitted to its box lands two cafés two streets apart two dots apart, and
  four names over that became a smear. It places against what is already on
  the plate now and drops what will not fit — the rule `<carta-atlas>`
  already keeps for a country's name, and the halo the rest of the layer
  already paints its type with.
- The boot guard checked three of the four siblings — `carta-map.js`
  published no version to check against, so the comment saying "five files
  means five chances" had been enforcing three for four versions. Found here
  and fixed on the second split's own branch at the same time, independently;
  `MAP_VERSION` is published and checked, and the merge kept one of the two.
  See `ARCHITECTURE.md` §1.

**Held for a founder call, with the reasoning written down rather than
guessed at.** The composer leaf needs a *read-as* line ("Read as a city,
nothing on the record there yet") where the app has no destination parser and
no keyless way to get one; it also drops the six kind chips and the free-text
question, both of which are reachable capability today. The answer on the
plate needs `<carta-city>` (a sixth file, and the argument `ARCHITECTURE.md`
§1 requires for one), a quarter table the handoff ships hardcoded for Los
Angeles alone, a distance anchor the record does not define, and — the one
that matters most — it has no place on it for the verdicts, the fit figures,
the mentions, the plan or the been/booked/skip marks, which is the
*recommendation never travels without its reasons* invariant. Each is written
up with options in `LOGBOOK.md`.

**Part two shipped at v7.40.0 — the handoff's own turn 3.** The commission
came back with four new frames that answer the first and largest of the five
held calls by drawing it, and drawing the recommendation that had been made:
`3a` recasts `2a`'s six rows as an **index**, `3b` puts the answer's own
material **under the pull**, and `3c`/`3d` give one finding its whole
argument on its own streets. `2a` and `2c` stay in the file as the argument
for the change and are marked *do not build*.

**What makes an index legal.** Nothing was cut. *A recommendation never
travels without its reasons* is satisfied one level down rather than all at
once: the verdict, the why, what to order, the rotates warning, the fit
figures and the three marks are on the finding's own page; the plan, the near
misses and the café that came back named and nowhere are under the answer's
pull. Every figure the record can defend still resolves through `matchFigure`
and still opens the very cups it was read from.

**The geometry is the handoff's, and reproduces itself.** `ansPlateH` =
`max(416, top + 18)` yields the handoff's stated 416 at the resting stop and
its stated 472 at the low one; the headline at `top − 238` lands on its
stated 160. A finding reuses the composer's 140/122 rather than inventing a
second geometry, exactly as the handoff asks.

**Still held, and unchanged.** Three of the five calls remain open, and the
composer (`1d`/`1i`) is untouched because turn 3 did not change it: the
*read-as* line and where the kind chips and the free-text question go (calls
two and five), and where `<carta-city>` lives (call three). The answer's
plate and a finding's underlay are the app's own `<carta-plot>` in the
meantime — the law holds and nothing is invented, but the plate is thin where
the handoff draws grid, reach rings and quarter names, and that is now the
argument for taking call three rather than a theory about it. The distance
anchor (call four) is taken as recommended and stated: the mean of what the
ask itself placed, no distance drawn at all from a single point.

**Part three shipped at v7.41.0 — turn 4, and it is one line.** The handoff came
back with no new screens and one new section, §B2, replacing a single line of §B.
Turn 1 had drawn "Read as a city, nothing on the record there yet"; turn 4 says
that line *was* the gap. **Nothing on the device knows what "Lisbon" is** —
`askScopeOf` matches a city only where `knownCities()` already names it, and takes
a country at the keeper's own word — so the kind is only ever the keeper's own
setting said back, "asked as a city", never "read as a city". The line counts what
the record has and never reports what a name *is*.

The composer moved onto its leaf at the same time (§B, `1d`/`1i`): a 140px strip
of the door's own plate with the leaf over it, and `ask` left `BARELESS` because
the bar stays. Six read-as states ship, two of them earned by the record's own
shapes — a city can be on the record with a café and no scored cup, and a country
scope matches the *coffee's origin* rather than where the cup was drunk, so it
must never say "cups read there".

**Gap 5 is closed by instruction rather than by design.** Turn 4 states that the
kind sheet is not designed in this bundle and says to wire *read it as* to the
shipping chip group in place. That is what shipped, marked interim: the six kinds
and the free-text question are one tap from the leaf, so nothing reachable before
stopped being reachable.

**One call is left: `<carta-city>`.** Unchanged — it needs a home, and `CITY_ARCS`
still holds one key.

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
