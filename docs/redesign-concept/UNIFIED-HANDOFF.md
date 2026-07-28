# One page grammar — the handoff

**The prototype:** [`UNIFIED.html`](UNIFIED.html). Open it in a browser; no build, no
server, no network. It carries a small demo graph and it is *live* — the door
writes into that graph, so every drill-down you walk after a bind is real.

This is the commission answered: the farm, the country, the region, the grower,
the roaster, the bar and the Setup all read as one app; the café cup enters
through the same door as everything else; and nothing on file ever has to be
typed twice.

---

## 1. The thesis, in one function

```js
function scopeGreens(kind, id)   // → the greens this node holds
```

A country, a region, a grower, a green, a roaster, a bar, a city, a Setup, a
process, a variety — **every one of them is a scope over the same set of
greens.** Once a page knows its green set, every question it asks is the same
question, answered by the same component:

| the question | the component | at lot scope | at set scope |
|---|---|---|---|
| how far does the record follow it? | the road | six stations | six counts |
| how high did it grow? | the terrace | one band vs. the atlas | the span, with each band inside it |
| where did it grow? | the drawn plot | — | coarse marks, hollow |
| who carried it? | `.rowlink` list | the hands | the hands |
| where does it pour? | `.rowlink` list | the bars | the bars |
| what did you find? | the overlay | your cups | your cups |

**That is the whole unification.** These pages read as one app not because they
were styled alike but because they are one page pointed at different slices of
one graph. Add a kind to `scopeGreens` and it inherits the entire page for free
— that is the test for whether a future node belongs here at all.

## 2. The five questions

Every node page answers these, in this order, always:

1. **What is it?** — back · crumb · eyebrow · display · lede · identity card
2. **How far does the record follow it?** — the road
3. **What can it prove?** — the resolution readout (`.res`)
4. **Where does it sit, and what does it hold?** — up · across · down
5. **What did you find?** — your overlay

A kind may have nothing to say for a question. It says *unread*. It never drops
the question and it never reorders them. `spec(kind,id)` supplies only the
**nouns** — what to call it, what its identity rows are, what is above it, what
is below it. The order, the components and the cross-cuts are shared code.

## 3. Drill down, drill up, from anywhere

`.rowlink` is the only navigation primitive, and every name anywhere is one.
The stack is shallow and names its destination (`← The grower`), and a room
chosen from the bar clears it.

The walk the commission asked for, working in the prototype today:

```
Atlas → Ethiopia → its regions → Guji → its growers → Suke Quto → its greens
      → a green → its hands → Sey → its greens → …
Ethiopia → “Bars pouring from here” → Halfpence → Los Angeles → its hands …
```

Three cross-cut sections are derived from the scope alone and therefore appear
on *every* page that has them: **the greens**, **the hands that roast from
here**, **bars pouring from here**. That is why "every café serving coffee from
this country" is a walk and not a feature — it is the same section the green
page draws, at a coarser scope.

`crumbHTML` states the walk up in the header (`Ethiopia › Guji`), so a page
reached by search is as navigable as one reached by drilling.

**New kind: the city.** A bar and a roaster both sit in one, and neither could
be drilled up from. `scopeGreens('city')` is what pours there plus what is
roasted there — the scene, derived, never stored.

## 4. What is removed

**The café reach tier system** — `○ Counter · ◎ House · ◉ Roastery · ● Origin`,
`REACH`, `reachCompile`, `reachWhy`, `reachHistory`, `reachContested`,
`reachBadge`, `regSight`, `reachWithdraw`, the sighting chips in the cup form,
the depth lens in Find, the three primer sheets (~42 sites in `index.html`).

It was a **second, parallel classification** of depth that applied to one node
kind only, was attested rather than derived from the graph, and had no meaning
on any other page. The road already answers "how deep does this go" for every
node, from the record itself, with the same drawing everywhere. A café now
reads at venue scope exactly as a country reads at country scope.

What replaces it, with no loss:

| the reach said | the graph says |
|---|---|
| ◉ Roastery — they roast | the Roasted station, filled, naming the hand |
| ● Origin — they name the farm | the Grown station, filled, naming the grower |
| ◎ House — a named roaster | the hands section, with counts |
| ○ Counter — nothing named | the road, running short, and saying so |
| "unread" | *unread* — the same word, now on six stations instead of one badge |

Also removed: the café page's bespoke banner/palette hero and its `kvs`
grab-bag, and `openProducerPage`'s **sheet** (a grower was the only node in the
graph that opened as a modal — it is a page now, like everything else).

## 5. One door, every room

The café cup does **not** get its own origin form. `openCafe`'s parallel
country / region / producer / variety / lot / process block is deleted. The cup
out is the same three steps as everything else — **paste → confirm → bind** —
and the only thing a room changes is which bind target is offered first and
which fields arrive filled:

- from the Atlas → `On my shelf · Poured at a bar · Brewed it just now · Just noting it`
- from a bar page → `Poured here · On my shelf · Just noting it`, the venue already bound

`bindPour(greenId, o)` adds exactly one edge — a pour and a reading over it.
Everything about the *coffee* was settled upstream, by the same code that
settles it for a bag. One vocabulary, one resolution readout, one collision
threshold, one place to fix a parse bug.

The bind honours the ≥2-of-6 law the readout states one screen earlier: two
shared facts and the paste folds onto the green already on the atlas rather than
minting a twin; below two it forks, because a thin record must never be allowed
to swallow a well-named one.

## 6. Never type a country twice

Every origin field carries a **prefill rail**: what the record already holds,
ranked by how often it holds it, with counts, one tap to fill.

```js
const NARROW = { region:'country', producer:'region', variety:'country', process:'country' };
```

The rail **narrows to what has already been chosen on this screen** and says so
— pick Colombia and the region rail reads *on file in Colombia · Huila 1*, not a
global list. Pick Ethiopia and the same rail reads *Guji 2 · Bench Maji 1*.
Nothing already in the record is ever typed a second time.

Two rules the rails must keep:

- **A rail suggests; it never constrains.** The field stays free text — a green
  from a country you have never recorded must still be enterable.
- **A rail that would come back empty widens rather than disappearing.** A
  country with nothing recorded under it yet offers the wider list; an empty
  rail teaches the keeper the feature is broken.

Rails are painted after the inputs exist (`repaintSug()` from `render()`), never
while the template is being built — a rail that read the DOM mid-build would
always miss the values on its own screen.

---

## The delta against `index.html`

Ordered so each step is shippable on its own.

| # | change | touches |
|---|---|---|
| 1 | `scopeGreens(kind,id)` + the shared `nodePage` renderer; port `vLotPage` onto it first (it is already closest) | new section beside *the pages* |
| 2 | `vRoasterPage`, `vPlatePage` onto `nodePage` | ~180 lines deleted |
| 3 | `openProducerPage` sheet → a page; add `region`, `country`, `city` kinds | `pageView` kinds, `PAGE_BACK` |
| 4 | `vPlace` onto `nodePage`; delete the reach (~42 sites) and the banner hero | `vPlace`, *the reach* section |
| 5 | `vSetups` card → a Setup page (`kind:'setup'`); the list stays a list of `.rowlink`s | `vSetups`, `openSetupForm` stays as the edit surface |
| 6 | the cross-cut sections + `crumbHTML` — the drill-up/down the commission asked for | `nodePage` |
| 7 | `openCafe`'s origin block deleted; `doorBind('pour')` becomes the one way in | `openCafe`, `doorBind` |
| 8 | the prefill rails on every origin field, in the door **and** in `openBagForm` (the typed fallback must not be poorer than the door) | `sugField`, `known`, `NARROW` |

**Invariants this does not touch.** Grind stays per-Setup and never crosses
grinders (the Setup page is precisely the scope a grind number is true inside).
Height still places and never ranks — no facet cuts by it, no page sorts by it,
and `scopeGreens` has no altitude branch. The strike still splices a record out
of its live collection, so `scopeGreens` reads live collections and needs no
filter of its own. The pen still gates every write to the shared record. The
road still draws unread as unread.

**One thing to decide before build.** The reach's *sightings* are signed,
append-only lines on Register entries, and merged by id in sync. Removing the
reach's **reading** does not require removing its **record**. Recommendation:
strike the compile and every surface, leave `sightings` on the entry unread and
unrendered for one version, and erase in the version after — a keeper who
attested a fact should not find it gone the morning of the upgrade. The
`CHANGELOG` entry should say so in as many words.
