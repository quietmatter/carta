# CARTA — the surfaces, and the graph under them

*The architecture pass. `VISION.md` argues the lot belongs at the centre and
`SCHEMA.md` gives it a shape; this document asks the harder question — whether the
app a keeper actually touches lets that graph fill, and what to cut so it does.
It supersedes the earlier intake pass and absorbs its findings.*

*The prototype is `redesign-concept/STREAMLINED.html` — a working surface, real
tokens, real faces, and a real parser. Read the file before changing anything here.*

## What the audit refuted

The obvious thesis was that CARTA is two apps sharing a file: a journal spine
(bags · brews · cups, flat text) and an atlas spine (lots · roasters · roasts,
nodes), disagreeing with each other. **That is wrong, and worth saying plainly.**

`catRetire` (1282) ships and runs unconditionally on every boot (7619). It strikes
the flat roaster, the six origin fields and the roast date off bags and cups once a
node stands. Of every live surface in the file, **three** still read raw flat text.
The read layer is converged; the spine is real and well made.

The complaint underneath the thesis is still true. The cause is different.

## What is actually wrong

**1 · The easy path produces no graph at all.**

The bag form's origin fields sit inside a `<details>` that is closed for every new
bag (4814). Type nothing, and `lotWorthy` (893) is false, so `catStampLot` returns
null **and deletes `lotRef`** (1337).

Not a thin lot. Not a private singleton. **No node.** A bag logged exactly the way
the form invites is invisible to the atlas. The much-discussed two-of-six threshold
in `lotKeyOf` (794) is the *second* gate; almost nothing reaches it.

This one fact explains the whole complaint. The graph is not broken. It is starved,
because the only door most records come through drops them before they arrive.

**2 · Six edges are unfinished or dead.**

| Edge or kind | State |
|---|---|
| `pour.roastRef` | **always null** for café cups — the availability branch never closes |
| lot → brews | **no path.** Brews carry `roastRef`, never `lotRef`; the corpus branch is unreachable from a green |
| `venues` | **not a catalog kind.** `pour.venueRef` points into `REG`, off-spine |
| `gear` | **write-only.** Four upserts, zero reads; `vSetups` (3456) reads flat strings |
| `processors` · `aggregators` · `blends` | declared in `CAT_KINDS`, synced by both servers, **never written** |
| `D.authored` | `catRetire` never sweeps it (1296) — flat text and nodes, forever |

**3 · Every reverse edge is a scan.** Fourteen scan functions. The only stored
back-reference — the bind sighting — is written on the auto and confirmed rungs
only, never on `floor`, where ordinary records land.

**4 · `catNorm` is trim-and-lowercase** (1828). *Yirgacheffe* and *Yirgachefe* fork
at the key level; only the τ=0.90 scorer can rescue them, and only if it runs.

**5 · Non-founders are pull-only** (`syncCatalog`, 6348). A normal keeper's lot node
never leaves the device. Irrelevant to a solo founder today; fatal to the thesis the
moment a second keeper exists.

## The four moves

### 1 · One door, and it is a paste field

You never hold a lot. You hold a *roast* of one — a bag, a line on a menu. So the
door authors a coffee, and the lot resolves behind it.

**Paste → confirm → bind.** Three screens, one textarea, a row of chips, one tap.

The parse runs on the device against vocabularies the build already carries:
`PLACE_ALIASES` and `normPlace` for transliteration and naming tier, `procFamily`
for the process family, `SCARCE_VARIETIES` for the variety set, `HARDID_SCHEMES`
and `hardIdRefusal` for printed codes, then `lotIdentity` → `scoreLot` →
`resolveLot` at the thresholds already tuned (τ_auto 0.90 · τ_propose 0.55). It
needs an origin-country list of about thirty strings and two regular expressions.
**The door is a new front end on machinery that is already built** — the one rule
this repository never breaks.

The confirm step carries the sentence that teaches the entire model:

> *Green lot — the finest grain the trade can prove.*
> *Two facts stand — this green can meet another keeper's record.*

or, honestly, when it does not:

> *One fact stands. It needs two to collide with another record; at one, it forks
> to a green only you can ever see.*

That is `lotIdentity`'s grain rule and `lotKeyOf`'s threshold, said out loud, at the
only moment a keeper can act on them. Nothing else in the app buys as much for as
little.

The bind is the only branch: **on my shelf · poured at a bar · brewed it · just
noting it.** One paste mints a lot, a roaster and a roast; the tap adds one edge.

### 2 · One reading, five scopes

Every page in CARTA becomes the same three-part component, pointed at a different
slice of one graph:

- **the road** — six stations, grown → processed → milled → roasted → poured → read.
  A filled mark is a station the record holds; a hollow one is a station it does
  not, and the connector across a gap is dashed. **The gap is the product.** It is
  not a blank to fill; it is the record stating what it has not been told.
- **the plot** — where, at honest grain (`CHARTS.md`).
- **the hands** — the list.

Scoped to a **lot**, a **roaster**, a **producer**, a **venue**, or a **facet**.

A facet-scoped page is a **plate** — an atlas is a bound set of them, and *Chart
No. 1* already uses the convention. *Colombia, in seven greens* is a plate: the
aggregate road across every Colombian green in the record, the origin plot, the
roasters who bought them, the bars pouring them, the greens themselves.

The aggregate road is the reading that does not exist today and cannot be got any
other way — it counts, per station, how many of a facet's lots reach that far. A
record strong at both ends and thin in the middle is telling you exactly where the
road goes dark.

**One component, five scopes.** The lot page and the plate are the same code.

### 3 · Three rooms

**Atlas · Record · Desk.** Today dissolves: *the coffee in hand* is the first line
of the Atlas, and the brew ritual rides off the coffee's own page, where it belongs.
Record is the overlay — your cups, and your plates. Desk is everything that is not a
cup, in rows rather than screens.

Density is not distributed evenly. **The lot page is the only place the app is
allowed to be long**; the instrument surfaces are near-wordless; everything between
gets one sentence. One ember per screen, and the inline teaching deleted in favour
of the primers that already carry it.

### 4 · What goes

| Surface | Fields | Becomes |
|---|---|---|
| Bag form | 16 | the door |
| `openAuthorRoast` | 13 | the door |
| `openAuthorRoaster` | 3 | the door |
| `openProposeSighting` | 4 | the door |
| `openDeskCafe` | 1 | the door |
| Café cup traceability fold | 14 | pick a roast, or paste |
| **Total** | **51** | **one textarea, chips, one tap** |

Also retired: `D.authored` (a roast node with no binding is the same thing, better);
the `D.cafes` / Register dual write (5497–5498); `D.setups`' free-text grinder and
brewer once `gear` is read rather than only written.

## Where the farm went

`SCHEMA.md` keeps three origin actors apart on purpose — **Producer** (`kind: farm ·
estate · smallholder · group`), **Processor**, **Aggregator** — because one washing
station gathers cherry from hundreds of growers, which is why a lot can carry
hundreds of producers.

In the build, a producer node is written as `{name, country, region}` with no `kind`;
`processors` has no write path; and the single input is labelled *"Producer /
station"*. `devSeedChart` files `Konga washing station` as a grower (3325).

The parser splits them at the door, by vocabulary — *finca · hacienda · fazenda ·
estate · farm* against *washing station · wet mill · beneficio · cooperative* — and
an unmatched name stays unclassified rather than being guessed into a tier. Nothing
is forced: at the counter a bag often gives one name and does not say which actor it
is, and demanding that call is the invented precision the record refuses.

## Sequence

1. **The door.** Nothing else matters while the common path mints no node.
2. **Close `pour.roastRef` and add `lot ← brews`.** Two edges; they light branches 1
   and 3 of the lot page.
3. **The reading, as one component.** Then the plate is nearly free.
4. **Delete the 51 fields** the door replaced, and the surfaces around them.
5. **The origin actors** — `kind` on the producer, a write path for `processors`.
6. **Decide on `aggregators` and `blends`:** build them or drop them from
   `CAT_KINDS`. A whitelisted, synced, never-written collection is debt in two
   servers and two test suites.

## What this does not change

No new catalog kind, no new endpoint, no dependency, no build step. The parse is
local; the door works with the network off. Every existing record reads unchanged —
the door adds a way in, and the deletions only remove ways to say the same thing.
The shared record stays single-pen.

*One green, many hands — and one door, so the graph can fill.*
