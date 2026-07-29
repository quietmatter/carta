# CARTA — the map, unified: one drawing, every scope

*The mapping pass. `CHARTS.md` broke the model — one projection cannot hold a
front door and a country — and specified scenes, charts, two frames, an
altitude ladder and a set of lenses. `UNIFIED.html` then answered a different
commission: every node in the graph is one scope over one set of greens, drawn
by one renderer answering the same five questions. This document holds those two
findings against each other and states what the map becomes when the second one
is true. It also folds in `READER.md` — the published atlas — because the map is
where a reader and a keeper differ most visibly, and where the difference is
smallest in code.*

*The prototype is `redesign-concept/UNIFIED.html`, and it is live: every surface
below is drawn there, from a demo graph carrying the awkward cases on purpose.
Read it beside this.*

---

## The finding: the unified prototype has a map only one page can draw

The one-page grammar landed everywhere except the plan. `plotHTML` drew region
centroids, only for a scope holding more than one green, only on a node page,
and never for a roaster, a bar, a city or a Setup. The Atlas — the reading room,
the surface a map is *for* — had none at all.

So the app that had just proved "one page, every scope" still had a map that was
a feature of one page. Held against the thesis in the handoff — *add a kind to
`scopeGreens` and it inherits the entire page for free* — the map was the one
component that did not come with it.

That is the whole gap, and it is not a rendering gap. `CHARTS.md`'s three named
defects were still unfixed underneath it: one frame for facts four orders of
magnitude apart, a chart that is a string rather than a place, and a grain that
is computed and thrown away.

## The thesis: the marks of a scope are `scopeGreens`, pointed at coordinates

```js
originMarks(gs)   // where these greens grew
chartMarks(gs)    // who carries them, and where you can walk to it
```

A scope resolves to a set of **marks** exactly as it resolves to a set of
greens. Both functions take the green set and nothing else — no kind, no id, no
special case — which is why every page gets the map for free, including the ones
that did not have one and the ones that do not exist yet.

**A mark is a `.rowlink` that happens to have a position.** Tap it and you are on
that node's page, which is this page again at another scope. The map is not a
separate mode of navigation beside the lists; it is the same navigation, drawn.

This is what makes the map unified rather than merely consistent. It is not
styled like the rest of the app — it is *made of* the rest of the app.

### Where it sits in the five questions

Question 4 is *where does it sit, and what does it hold?* — and the map is the
first half of that sentence, so it opens the section, before the `up` and `down`
lists that are the second half.

It also moves ahead of the terrace, which the prototype drew first. **A plan
comes before a section.** The map answers *where*, the terrace answers *how
high*, and neither answers the other; drawing the section first asked the reader
to hold an altitude for a place they had not been shown.

## The map has no zoom. The walk is the zoom.

`CHARTS.md` asked for three altitudes — a region of scenes, a scene of nodes,
one node's locator — and read as a request for a control: something to pinch, a
lens to switch, a camera to remember. Under the one-page grammar it is none of
those. **The three altitudes are the scope stack the keeper is already standing
in.**

| The scope you are on | What a mark is |
|---|---|
| the Atlas, a country, a plate | a scene, or a country |
| a city, a roaster, a bar | a node, at its own grain |
| one green | its origin, and the hands carrying it |

Drilling down *is* zooming in, and it is the same gesture as every other
drill-down in the app: a `.rowlink`, a shallow stack, a back that names where it
goes. The back button is the zoom-out.

This deletes work rather than adding it. No camera to persist across repaints,
no `smapCamKey` to invalidate when a coordinate is corrected, no zoom state to
reconcile with the page stack, no third navigation idiom for the keeper to
learn. The one thing a camera bought — *return me to where I was looking* — the
page stack already buys, and buys correctly.

**The rule, in one line:** a frame holding more than one scene draws scenes; a
frame holding one draws its nodes.

### The origin frame climbs a different ladder, for a good reason

A scene is a **catchment** — derived by distance, because that is what "close
enough to visit in one outing" means. Origin grain is **administrative** —
country, region — because that is the ladder the record actually proves things
on (`the grain`, five rungs).

So the origin frame rolls up the ladder it already has: **the Atlas draws
countries; walk into a country and the same frame draws its regions.** Same
rule, different units, and neither unit is invented for the map.

The alternative — distance-clustering origins the way scenes cluster venues —
was tried in the prototype and is wrong twice over. It folded Guji, Bench Maji,
Nyeri and two country marks into *"4 here"* at world scale, which reports
nothing; and a distance cluster across a border would have been a place with no
name, on a ladder where every rung has one.

## Two frames, joined in words

Unchanged from `CHARTS.md`, and now drawn at every scope rather than one:

- **The origin frame** — where the greens grew. Coarse marks, admitted as
  coarse. No street layer, ever.
- **The chart frame** — who carries them. Hands at their cities, bars at their
  doors, pours drawn as edges, street tiles behind when they can be had.

Between them sits a sentence, not a line:

> *Ethiopia, Colombia and one more — carried by five hands into three bars. No
> line joins these two frames. The green crossed an ocean in a ship, through an
> importer who is on no map here; a segment drawn over that water would be
> decoration reading as data.*

The sentence is generated from the same two mark sets it stands between, so it
cannot drift from what is drawn above and below it.

**The chart frame draws what the scope holds, not what is near the page.** A
city page shows the hands feeding that city wherever they sit — that is how you
learn Brooklyn feeds Los Angeles, and it is why the heading reads *where they
are carried* rather than *near you*. A scope is a set of greens; it was never a
radius.

## Four laws for a mark

**M1 · A mark is never finer than what it rests on.**
The drawn rung is the coarser of two: the rung the *grain* proves, and the rung
the *coordinate* has. A green that can prove only its country is drawn at the
country's centroid **even when a region centroid is at hand**. Rounding a mark up
is the same lie as rounding the grain up — told in ink instead of in words.

This is `CHARTS.md`'s third defect closed. Grain was computed and thrown away;
here it is the geometry.

**M2 · What cannot be placed lists rather than lies — and the fall is stated.**
Every frame carries its *listed, not drawn*: named, counted, tappable. A region
the record names but holds no centroid for does not silently become the country
it sits in — it draws at the country **and** lists, with the drop named
(*"no centroid on file — drawn at the country instead"*). The claim in
`CHARTS.md` that a node without a coordinate *lists rather than lies* was true of
the copy and false of the code. It is now true of both.

**M3 · Marks the plot cannot separate are folded and counted; marks that *read*
the same are folded however far apart they are.**
Two centroids labelled alike are one mark, because drawing them apart claims a
precision the grain never had. A fold is tappable and opens its members as rows
— the drawing never becomes the only way to reach a node.

**M4 · A cluster of one is not a scene.**
One bar is a front door. Drawing it as a dashed area mark would claim a spread
the record never had, which is the exact failure mode a scene mark exists to
avoid. A scene admits it is an area; a node must not be made to.

### The ink, and only the ink

Monochrome throughout, and the ember is never spent here — it belongs to the
current action and the score.

| | |
|---|---|
| filled | the coordinate is as fine as the mark claims |
| hollow | a centroid — an area standing in for a point |
| dashed | coarser still, and admitting it |
| a square | a street address · a circle, a centroid · a dashed square, a scene |
| a ring | your overlay |

**The key is derived from what was drawn**, never from what the frame could
draw. A legend naming a mark that is not on the plot is the same untruth as a
mark naming a place the record cannot prove, told at one remove.

### The box follows the ground

One scale on both axes — two would bake a distortion into every reading — and
the *box* is sized from the bbox rather than the ground being stretched to fill
a fixed box. A wide, shallow scene gets a wide, shallow plot instead of a field
of dead paper; a lone mark gets a small frame, because a plot should claim no
more paper than the ground it is reporting on. A minimum span keeps a single
mark from implying a zoom the record never earned.

## The lenses

Growers · Hands · Bars · The road · Yours. The two inherited laws hold, and the
second one is drawn: **a lens narrows, never sorts, never promotes**, and **a
lens that hides says what it hid** — *3 marks hidden by the lens — show
everything.*

One ordering detail matters: **the lens narrows before the scenes are derived.**
A hidden bar must not still shape the cluster it was hidden from, or turning a
lens off would move marks that stayed on.

## The overlay is a ring — which is how the published atlas folds in

Here the two documents meet, and the meeting is one line of design.

On a keeper's map, **your overlay is a ring around a mark you keep.** Not a fill,
not a second colour, not a filled-vs-dashed distinction between kept and unkept
places — a ring, added on top of a mark that was already complete without it.

That single decision is what makes `READER.md` almost free:

> **The published atlas is this map with the overlay off.**

Not a second map, not a reduced map, not a map with a different renderer. The
same component, the same frames, the same marks, the same folds — minus one ring
and one lens chip.

The alternative shape is instructive. Had *kept* been the map's primary
distinction — filled for a place you keep, dashed for one you do not, which is
what `index.html`'s café plot does today — then a reader's map would render
**entirely dashed**: an atlas of absences, the record quietly telling a stranger
that they keep nothing, in a drawing that is supposed to be about coffee.

This is the map's version of `READER.md` L7, and it is the same argument. The
road's sixth station is *Read* — the keeper's own cups — and a reader's road
draws **five stations, not six-with-one-unread**, because an absent reader is
not a gap in the record. The ring is the sixth station of the map. It comes off
the same way, for the same reason, and what is left is whole.

| | keeper | reader |
|---|---|---|
| the two frames, marks, folds, listed | ✓ | ✓ |
| scenes, the walk-as-zoom | ✓ | ✓ |
| the road drawn as edges | ✓ | ✓ |
| the ring on what you keep | ✓ | **absent** |
| the *Yours* lens | ✓ | **absent** |
| a held green | drawn faint, counted | **not there** |

### The hold, seen on the founder's own map

`READER.md` L4 makes a hold a dated, reversible, additive entry, subtracted from
the snapshot at publish time, carrying its roasts and pours with it. On the
reader's map that is simply absence — the correct outcome, and nothing to draw.

On the **founder's** map a held mark draws, **faint and counted**:

> *One green is held back from the published copy — drawn faint here, absent
> there. Its roasts and its pours are held with it.*

Consent should be visible in the units it will be read in. The Desk states the
counts before you publish; the map states which places those counts were. A
founder who holds a green back should be able to *see the hole they are making*
— and it is a hole in a place, which is a thing only a map can show.

Never in red. A hold is reversible, and red is spent once.

## What this answers in `CHARTS.md`, and what it retires

| `CHARTS.md` asked for | here |
|---|---|
| the two frames | built, at every scope |
| grain rendered — coarse hollow, precise filled | built, and load-bearing (M1) |
| `mapProject` given an explicit bbox, aspect-corrected | built; the box also follows the ground |
| pins merged below a minimum separation, into a counted mark | built (M3), plus the `sameKey` fold |
| a node without a coordinate lists rather than lies | built (M2), plus the fall stated |
| scenes — derived, single-link, ~40 km, never stored | built |
| the altitude ladder — region · scene · place | **retired as a control.** The walk is the zoom |
| the scenes lens (multi-select chips) | **retired.** Drilling into a scene is walking into it |
| camera floor, camera memory, `smapCamKey` on the chart | **retired.** There is no camera to remember |
| charts — scenes grouped and named by the keeper (`prefs.charts`) | **deferred**, and the case for it is weaker: a named grouping was a way to steer a camera that no longer exists |
| the lenses — kinds, the road, kept · all | built |
| facets on the list, `unread` always counted | unchanged, still the next surface |

Retiring the chart-as-a-keeper-grouping is the one judgement call worth marking.
`CHARTS.md` reached for it to answer *"multiple charts, or an expanded chart, or
ones you can turn on and off."* Under the walk-as-zoom that request is answered
by the graph itself — a country page, a city page, a plate — and a named
grouping would be a fourth way to slice the atlas beside scopes, plates and
lenses. It is worth building only if a keeper asks for a name the graph cannot
already give them; the note in `CHARTS.md` about it living in `prefs` and needing
no server change stands, unchanged, for the day that happens.

## What this does not change

No new catalog kind, no new endpoint, no new synced document, no dependency, no
build step. Clustering, bounding boxes and folds are local math over local
entries.

**The street layer stays an enhancement, never a dependency.** The drawn plot
renders first from stored coordinates, stands alone offline, and every mark,
tap, fold and count works with zero tiles. The prototype ships no tiles at all
and says so — which is the honest demonstration that nothing requires them.

**Height still places and never ranks.** `scopeGreens` has no altitude branch and
neither does any mark: nothing on the map is positioned, sized, ordered or
shaded by how high it grew. The terrace remains the only surface that reads a
band, and it is a section, not a plan.

**Coordinates stay honest and additive** — a venue's real point, a roaster's city
point, a producer's region or country centroid, each with its grain, never a
farm-precise pin. CARTA does not geocode a grower's name, and M1 is what makes
that refusal visible instead of merely true.

**The pen still gates every write**, the strike still splices a record out of its
live collection (so mark-building reads live collections and needs no filter of
its own), and `unread` is still drawn as `unread`.

## The delta against `index.html`

Ordered so each step is shippable alone. Steps 1–4 are the map; 5–7 are the
published atlas over it.

| # | change | touches | |
|---|---|---|---|
| 1 | `originMarks` / `chartMarks` off the green set; `plotSVG` with an explicit bbox, one scale, a ground-sized box, the fold and the derived key | replaces `mapProject`/`mapHTML`'s per-surface shapes | **built** (6.6.0) |
| 2 | M1 and M2 — the grain decides the rung; the listed strip; the fall stated | reads the grain ladder that already exists | **built** (6.6.0) |
| 3 | `clusters`/`sceneMark`, and the walk-as-zoom rule. Delete `smapCamKey`, the camera store and the scenes lens | `atlasFrames`, `_smapCam`, `smapView` | **built** (6.6.0) |
| 4 | one `mapHTML(k,id,gs)` on every node page and the Atlas, in question 4, ahead of the terrace | `nodePage`, `vAtlas` | **built** (6.6.0) |
| 5 | the ring — `markKept`, and the *Yours* lens | new, small | **built** (6.7.0) |
| 6 | `reader()` and its predicates; the ring and the lens absent; the road's five stations | `READER.md` §5 | **built** (6.7.0) |
| 7 | the hold: faint marks and their count on the founder's map, beside the Desk's publish counts | `READER.md` F1–F3 | **built** (6.7.0) |

Steps 1–4 give every page in the app one honest map. 5–7 give a stranger the
same map, and give the founder the ability to see what they are not sending.

### As built (6.7.0)

The ring is `markKept(greens)` — derived from the greens a mark already carries,
so it arrives at every scope for free, exactly as the road and the terrace do.
`keptLots()` is the keeper's own set (a bag or a cup on that green); a bar is
also yours if you have drunk there or saved it. A fold wears the ring if **any**
member is yours; a scene wears it if any node inside it is. The ring never
replaces the mark's own geometry — `plotSVG` draws the body first and adds the
ring over it, which is what makes taking it off leave the drawing whole.

The *Yours* lens defaults **off**. A lens narrows, and a map that opens narrowed
hides the atlas behind the overlay. It narrows before the scenes derive, like
every other lens, and it says what it hid.

The hold draws `.mk-held` (faint) when **every** green a mark carries is held —
a mark carrying one held green and three standing ones is not a held mark — and
the count is stated in words below the frames, with the door to release it.
Both the ring and the lens are absent under `reader()`, which is the claim this
document makes about the published atlas, now true in code: the walk asserts
that a reader's map draws both frames, the folds, the listed strip and the
derived key, and differs from a keeper's by exactly one ring and one chip.

---

*One projection cannot hold a front door and a country. One drawing can hold
every scope, so long as it says at every mark how coarsely it knows where
anything is — and so long as what it knows about you comes off cleanly, leaving
the atlas whole.*
