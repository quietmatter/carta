# CARTA — charts: the atlas at more than one altitude

*The geography pass. `VISION.md` step 4 commissioned "the two surfaces" — the graph
drawn geographically — and it was built as one drawing: producers at origin,
roasters in their cities, bars on their streets, one projection over all of them.
That assumption is what fails. This document states why it fails before a second
city is added, what a chart actually is, and how the atlas holds a region without
lying about any point in it.*

*Nothing here is committed to `index.html`. It is the map an implementer builds
from, and the place to break the model before code does.*

## The finding: the map is already broken

The request that prompted this pass was *"my records span Southern California and
the map has stopped being useful."* The record does not support that diagnosis.
The map stopped being useful at one city, and a second city only made it visible.

`mapProject` (1884) scales both axes by a single isotropic span — the larger of the
latitude and longitude extents. The shipped demo scene (`devSeedChart`, 3285)
already contains Ethiopian producers near 38 °E alongside Los Angeles roasters near
−118 °W. That is a longitude span of about 157°, so:

- the whole Los Angeles scene — five roasters and a bar across 0.083° of longitude —
  projects to about **0.03% of the box width**;
- all six pins land on one pixel, with six `white-space:nowrap` labels stacked on
  top of one another (332);
- the live layer is no rescue: `smapView` (1987) fits the raw bounding box of every
  node and `smapBoot` (2036) sets `maxZoom:15` with **no `minZoom`**, so the atlas
  opens at world zoom, where the same scene is again one pixel.

Adding San Diego, Santa Barbara and the Coachella Valley does not cause this. It
changes the number from 0.03% to about 1.3% — four dots and a pile of overlapping
text instead of one dot. The failure is the same failure.

**One projection cannot hold a front door and a country.** Everything below follows
from that sentence.

## Three defects, named

**1 · One frame for facts four orders of magnitude apart.** A venue's coordinate is
a street address. A roaster's is a city centroid. A producer's is a regional
centroid — deliberately coarse, and correctly so (`atlasGeoFill`, 5528, never
geocodes a station name). Drawing them on one continuous projection asks a single
scale to serve a 10 m fact and a 200 km fact.

**2 · The chart is a string, not a place.** `CHART1={id:'la',name:'Los Angeles',…}`
(2963) is a constant, and `authorRoast` (2978) stamps `chart:'la'` on every authored
record **unconditionally** — the city the curator typed is never read when deciding
membership. A Palm Springs roaster authored today lands inside "Chart No. 1 · Los
Angeles", under the header *"One city, one origin-season, charted by hand."* There
is no filter, no grouping, and no way to make a second chart short of editing the
constant. Meanwhile the Atlas tab's own scope (`atlasLotIds`, 3127) has no city
filter at all and was always multi-city capable. **The label is the lie, not the
data.**

**3 · Grain is computed and thrown away.** `atlasGraph` stamps every node with a
`grain` — `street` · `city` · `region` · `country` (3142–3144). Nothing reads it.
Pin appearance keys off `atlasCls[n.kind]` alone (3165), so a region centroid and a
front-door pin render identically. The CSS comment at 354 already describes the
intended treatment — *"a coarse origin (hollow)"* — and the code never got there.
The legend offers only a global count of nodes with no coordinate, and despite the
copy at 3212 claiming a node without a coordinate *lists rather than lies*, **nothing
lists them.**

### The defect worth fixing before any of this

The roaster-city inputs are prefilled `value="${esc(CHART1.name)}"` (3002, 3040) and
the country input is prefilled with the literal string `Ethiopia` (3006). A curator
adding a Santa Barbara roaster who does not clear the field gets a roaster geocoded
to Los Angeles — 150 km from where it is. Because `atlasGeoFill` is blanks-only
(`rn.lat==null`, 5532) and **no surface in the app edits a roaster's or producer's
coordinates**, that wrong pin is permanent.

This is a fabricated fact with a convenience defence, which is the exact shape the
laws refuse: *never print a number that lied to get there.* A blank field is honest.
A prefilled wrong one is not. Remove all three prefills.

## What a chart is

`SEQUENCE.md` defines a chart as *"a city whose scene is dense enough to close the
loop locally."* Held against a real record it needs one amendment: **the unit is not
administrative, it is a catchment** — the ground a keeper actually moves through.
Southern California is not eight failed charts. It is one chart containing several
scenes of very different density, and the specialty scene in Santa Barbara is real
even though it would never clear a per-city bar on its own.

So the model gains one term and redefines the other:

- **A scene** is a cluster of located nodes — roasters and bars — close enough to
  walk or to visit in one outing. Derived, never authored.
- **A chart** is one or more scenes under one name. Named by the keeper; membership
  derived from the scenes it contains.

### A chart is a resolution, not a key

This is the load-bearing decision, and it is the one the repository has already made
twice. `RESOLVER.md` §7: *identity is a resolution, not a key.* `LOT_IDENTITY.md`:
*identity is compiled and confidence-graded.* The reach is *compiled, never picked.*
Geography gets the same posture:

```
scenesOf()   →  single-link cluster of located roaster+venue nodes,
                joined under a distance threshold (~40 km)
chartsOf()   →  scenes, grouped and named by the keeper (prefs.charts);
                every ungrouped scene is its own chart until named
```

Membership is a **function over coordinates, evaluated at read time.** Fix a
coordinate and membership corrects itself. A stored `chart:'la'` tag cannot do that —
it is a key, and it rots the moment the coordinate it was guessed from is corrected.
`CHART1` retires into the first derived chart; `authorRoast` stops stamping a
constant.

### Where charts live

**In `prefs`, not the catalog.** Both servers whitelist exactly eight catalog kinds
(`server.js:122`, `worker.mjs:46`); a shared `charts` document would mean an API
change in two servers plus cases in two test suites, for a scope that is a *reading
convenience*, not a fact about coffee. Scenes are derived from catalog coordinates,
which are already shared and already synced. Only the grouping and the names are the
keeper's, and `prefs` is exactly where the matching's own bookkeeping already lives.

No new catalog kind. No server change. No new sync document.

## The two frames

**Stop drawing one map.** The road has two halves that no single projection serves,
and the lot page already narrates them as separate stages (grown → processed →
milled → roasted → poured). The map should mirror the page.

- **The chart frame** — what you can walk. Roasters and bars, street tiles behind,
  edges drawn. This is the surface that answers *where do I go.*
- **The origin frame** — where the green came from. Producers and processors at
  region or country grain, no street layer, coarse marks stated as coarse. This is
  the surface that answers *where is this from.*

The two are connected in words, not in geometry: *"Konga, Yirgacheffe — four hands
in Los Angeles."* A straight Mercator line from Ethiopia to California was never
information. The green travelled by sea, through an importer that is not on the map,
to a port that is not on the map. Drawing it as a dashed segment across the Pacific
is decoration that reads as data — the thing the laws exist to prevent.

## The altitude ladder

Three altitudes, one gesture, and a mark means something different at each. This is
what the request for *"multiple charts, or an expanded chart, or ones you can turn on
and off"* resolves to: **all three, because they are the same mechanism seen from
different heights.**

| Altitude | What a mark is | What it carries |
|---|---|---|
| **Region** | one scene | its name and its counts — *Los Angeles · 14 roasters · 6 bars* |
| **Scene** | one node, at its own grain | street tiles, the road drawn, pins tappable |
| **Place** | one node's locator | already built — `placeMapHTML`, 5330 |

A scene mark sits at its cluster's centroid and is **labelled as a scene**, which is
honest: a scene genuinely is an area, not a point. This is the geographic twin of a
`station-season` lot — *a legitimate terminal node at a coarse grain, never a
half-filled precise one* (`LOT_IDENTITY.md`). It is clustering that admits what it
is, rather than clustering that pretends to be a location.

## The lenses

The `.lens` chip row already exists (223–224), and so does city-lens machinery
(`cityLens`/`inLens`/`circleCities`, 6615–6643) — currently `LEGACY_ON`-gated and
wired to the retired circle and discover surfaces, never to `atlasGraph`. Rewire it;
do not rebuild it. (Note `circleCities` buckets on the raw trimmed string rather than
`normName`, so casing variants produce duplicate chips — fold before it ships.)

The honest set:

- **Scenes** — multi-select chips, one per scene in the chart.
- **Kinds** — Roasters · Bars in the chart frame; Growers in the origin frame.
- **The road** — edges on or off. Edges are the densest ink on the surface; at thirty
  nodes they are noise.
- **Kept · All** — your overlay against the whole atlas.

Two laws for every lens, inherited unchanged:

- **A lens narrows. It never sorts and never promotes.** Depth was a filter in Find
  and never a sort key; scenes are the same.
- **A lens that hides says what it hid** — *4 scenes · 2 shown*. Silent filtering is
  how a sparse record disappears without anyone noticing it was sparse.

## Facets — filtering by region, variety, process

There are none today. `atlasSearchIndex` (3700) is a search index over lots,
roasters, producers and the Register; city appears in it as a search key and a
subtitle, never as a filter. This is the correct next surface, and it belongs on the
**list**, not the map.

Facet over the fields the lot already carries, and nothing else: country · region ·
process family · variety · harvest year · grain · the three standing axes. Every one
of them is already normalised — the resolver's fingerprint (`RESOLVER.md` §2–3) folds
transliteration and reconciles the naming tier before it proposes a match. **Faceting
is the dividend for having built the resolver**, not new work.

One law, and it is the one that separates this from every other filter UI: **a facet
must never silently hide `unread`.** A record that does not state its variety is not
a record that fails the *gesha* filter; it is a record the atlas has not been told
about. Show it: *12 lots · 5 unread on this facet.* Hiding sparse records behind a
facet is the same lie as inventing precision — it just tells it by omission.

## The mechanical fixes

| What | Where | Change |
|---|---|---|
| Prefilled city / country | 3002, 3040, 3006 | delete — a default that fabricates a fact is worse than a blank |
| Projection | `mapProject` 1884 | take an explicit bbox; aspect-correct (58 pts of width against 70 of height is a baked-in distortion); merge pins closer than a minimum separation into one mark carrying a count |
| Camera floor | `smapBoot` 2036 | add `minZoom`; scale `maxBounds` padding to the extent (≈15% of span, floored) instead of a flat ±3° — the discover map uses ±0.25° (7258) |
| Camera memory | `smapCamKey` 1986 | key on the chart, not on every node's coordinates — today geocoding one roaster orphans the remembered camera and throws away the keeper's pan |
| Geocode honesty | `geoOne` 5518 | qualify the query with the scene's region and country, or bias by `viewbox` off the existing nodes; stop taking `list[0]` blindly when candidates disagree — `geoChoose` (5553) already knows how to offer five |
| Coordinate correction | — | generalise `geoChoose`/`geoUnpin` (5553–5559) to roasters and producers; today a wrong coordinate is permanent |
| Grain, rendered | 3142–3144, 354 | coarse marks hollow or dashed, precise marks filled; monochrome, a lens never a rank. Ships its primer the same pass |
| Venue identity | `regByName` 671 | key by name **and** scene — two bars with one name in two cities currently merge into one node at one coordinate |

## Sequence

Each step is worth shipping alone, and none of them requires the next.

1. **The honesty pass.** Remove the three prefills. Render grain. Give `mapProject`
   a bbox and an aspect correction, `smapBoot` a `minZoom`. *This alone makes the
   existing single-chart map read.*
2. **Scenes.** `scenesOf()`, the lens row rewired off the shutter, the counts stated.
   Retire the `chart:'la'` stamp.
3. **The two frames.** Split the origin frame out of the chart frame; state the
   hand-off in words.
4. **Facets.** Over the fingerprint fields, on the list, `unread` always counted.

## What this does not change

Offline behaviour is untouched — clustering, bounding boxes and facets are local
math over local entries, and the drawn plot remains the floor with street tiles the
enhancement. No new catalog kind, no new endpoint, no new synced document, no
dependency. The shared record stays single-pen; a chart is a reading convenience and
is never a fact anyone has to agree with.

*We do not sell coffee. We keep the record — and a chart that says how coarsely it
knows where anything is.*
