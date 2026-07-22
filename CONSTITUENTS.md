# CARTA — a product for every hand

*The constituents pass. `ECOSYSTEM.md` argues the graph is the product and
every surface a reading of it. This document designs the readings — one
product per constituency, seven in all, from the cherry to the cup. Each is
specified the same way: who stands here, what they write into the graph, what
the graph returns to them, the surface they work at, what it costs them
(`COMMERCE.md` carries the prices), and the refusal that keeps their product
honest. The shared law from `ECOSYSTEM.md` holds throughout: each constituent
writes the facts born at its own node, and reads the whole road.*

## The shape every desk shares

Four of the seven products are **desks** — working surfaces for the trade,
named for the piece of furniture in a counting-house, not a dashboard. Every
desk is the same skeleton wearing different facts:

- **Your page, signed.** The constituent's canonical node in the graph —
  roaster, venue, station, importer — already exists or is drafted the day
  they arrive, compiled from bags and sightings. Signing the page
  (`PLATFORM.md`) makes their attestations first-party *within their own
  link*. The pitch is never "join our platform"; it is "this page about you
  already exists, and it is already almost right — hold the pen yourself."
- **The ledger view.** Their own entities, editable: offerings, menus, lots,
  models. Writing here is bookkeeping, not marketing — the desk asks for the
  facts they already know and refuses the ones they don't.
- **The road view.** The whole chain, read from their seat: upstream to
  where their coffee came from, downstream to where it went and how it read.
- **The door.** Where commerce attaches (`COMMERCE.md`) — a link out to
  their own counter, never a checkout inside CARTA.

Desks are quiet. No engagement graphs, no growth nudges, no red badges. A
desk that has nothing new to say says nothing.

---

## 1 · The Origin Desk — producer and processor

**Who stands here.** The grower and the mill: farm, estate, smallholder
group, washing station, wet mill, dry mill. Often two actors, deliberately
served by one desk — at origin the producer and processor are entangled
(`MODEL_QA.md` pulled them apart in the model precisely so this desk can
join them honestly), and the person at the keyboard is usually the station
manager, the co-op's officer, or an agronomist working for either.

**What they write.** The birth certificates of the entire graph:

- The **harvest**, as it happens: cherry intake by day, the day-lots
  separated, the outturns or export lots cut from them — each a lot node
  born at `grain: green-lot` or `station-season`, with the split/merge
  lineage recorded *forward* instead of reconstructed backward.
- **Processing, in stages** — fermentation, drying, finishing — attested by
  the mill that ran them, while the parchment is still on the beds.
- **The producers behind a lot** — the smallholder roll a station lot
  gathers, at whatever resolution the station actually keeps. Names when
  consented, counts when not; never invented.
- Altitude, plots, varieties as planted — the facts every downstream bag
  currently paraphrases.

**What the graph returns.** The thing origin has never had: **sight of the
road after the container ships.** Which importers carried their lots; which
roasters bought them, in which cities, under which offering names; how the
roasts read on the overlay; which lots earned standing and where the auction
lots cleared. A station's page becomes its portfolio across seasons — its
outturns, its resolved lots, the roasters who return year after year — which
is to say: **marketing it never had a budget for, compiled from facts it
merely had to keep.** And demand, visible early: keepers following a station
get its new harvest surfaced when the first roast of it appears.

**The surface.** Phone-first, offline-first — harvest happens where
connectivity doesn't. The Origin Desk is a PWA in the existing mould: writes
queue locally, sync when the signal comes. Entry is table-shaped and terse
(day, kilos, bed, lot cut), built for a manager standing at a weighbridge,
not an office. Where a station already keeps records in a spreadsheet or a
wet-mill system, the desk ingests the export rather than demanding re-entry.

**What it costs.** Nothing, forever. The deliberate asymmetry of the whole
commercial design (`COMMERCE.md`): value flows upstream free of charge,
because the graph's legitimacy rests on origin holding the pen, and origin
is the constituency least able and least obliged to pay for it.

**The refusal.** CARTA never brokers green, never lists prices at origin,
never rates producers. The standing describes lots, not people. And no
station is ever pressured to disclose below its own floor — a smallholder
roll kept private is a `station-season` lot with honest scope, not a gap.

---

## 2 · The Import Desk — aggregator, exporter, importer

**Who stands here.** The organisations that pool and move green: co-ops,
unions, exporters, importers. The trade's connective tissue, and the actor
that most often *already holds* the traceability the consumer bag drops.

**What they write.**

- **The offer sheet, as graph entries.** Each offered lot enters as (or
  binds to) a lot node — station, producers, variety set, process stages,
  harvest, and the hard IDs where they exist (outturn, auction code, ICO
  mark, the identifiers `LOT_IDENTITY.md` catalogued). An importer's
  offer list, published through the desk, is a page of *pre-resolved* lots.
- **The splits.** Who bought which cut of a lot — the sub-portion-and-rebrand
  event that today destroys identity becomes a recorded split: one lot,
  five roasters, five forward edges. The single highest-value write in the
  entire graph, because it is the line the resolver can never reconstruct
  with certainty from downstream.
- Warehouse arrival and spot status — the availability facts a roaster's
  buyer actually checks.

**What the graph returns.** Their traceability work becomes a **selling
feature that travels.** Every roaster who buys through a desk-published lot
inherits full provenance with zero effort — "buy this and your bag's page
writes itself" is a pitch importers can carry to roasters on CARTA's behalf.
Plus demand read at green level: which origins, processes, and score bands
are being followed, dialed in, and re-bought downstream — a season ahead of
the purchase order.

**The surface.** Web desk. Offer-sheet import (CSV and the formats the trade
actually mails around), bulk lot drafting through the same ingestion
pipeline the curator uses, a split ledger per lot.

**What it costs.** A desk subscription (`COMMERCE.md`). The offer sheet is
publishable free, in full — writing facts is never tolled; the split ledger
analytics and the demand read ride the paid desk.

**The refusal.** The Import Desk is not a marketplace. No transaction runs
through CARTA, no lot is rankable by price, and an importer's warehouse SKU
never becomes an identity (`LOT_IDENTITY.md`'s false friends stay
firewalled). Algrano and its kin broker relationships; CARTA keeps the
record both sides settle against, and partners rather than competes.

---

## 3 · The Roast Desk — the roaster

**Who stands here.** The roastery: the actor the whole second branch of the
atlas already revolves around, and the wedge constituency for the entire
ecosystem (`SEQUENCE.md`).

**What they write.**

- **Offerings, as roasts.** Each offering binds to its lot (or blend) and
  carries the facts only the roaster knows first-party: offering name,
  roast level in their own words, roast dates as batches ship, their notes
  — marked as a reading, never fact.
- **Blends, with dated compositions** — rotation recorded as it happens, the
  way `VISION.md` demands and no roaster's own website ever manages.
- **Their buying** — confirming the upstream bind: "yes, this is Nine's
  Gedeb lot, we took twelve boxes of it." One tap on an importer-published
  split; the propose-and-confirm ladder with the strongest possible
  confirmer at the desk.
- Their door: where the coffee is sold — their own checkout, their bar,
  the cafés that carry them.

**What the graph returns.** Three things roasters cannot buy today at any
price:

- **The page nothing else can render:** *four roasters, one washing station,
  four readings of the same green* — with their roast on it. Proof of
  sourcing quality that is compiled, third-party, and impossible to fake,
  which is exactly why it persuades.
- **The brew corpus on their own coffees** (`VISION.md`): how people
  actually dial their roasts in, on which gear, where the reads cluster —
  the most-requested, never-available dataset in roasting, returned at
  exact-match honesty only.
- **Re-encounter demand:** how many keepers logged their coffee, followed
  it, re-bought it when the next roast date appeared; which cities pour
  them and how the pours read. Wholesale leads compiled from facts — a
  venue whose crowd loves washed Ethiopia is visible to the roaster who
  sells one.

**The surface.** Web desk, with the offering flow built to be **lighter than
updating their own website** — ingest from their existing store page (the
pipeline already reads offering pages), confirm, done. A batch's roast date
is one tap from the roasting log they already keep; where they run Cropster,
the desk imports the conclusion (a batch exists, dated) and refuses the
telemetry (see the refusal).

**What it costs.** The signed page and offerings are free — the graph needs
their facts more than their fee. The desk subscription carries the corpus
view, the demand read, and the door analytics (`COMMERCE.md`).

**The refusal.** CARTA does not model the roastery's production — curves,
charge temps, development ratios are another trade's ledger (Cropster's),
and the desk imports conclusions, never instruments. And the desk never
scores roasters: the standing belongs to coffees, the overlay to keepers.
A roaster's page carries the shape of its readings, never a grade.

---

## 4 · The Venue Desk — the café

**Who stands here.** The bar that pours: multi-roaster café, roaster's own
bar, the shop with one blend and no story. The Venue node already exists —
it is the Register, the app's oldest proof.

**What they write.**

- **The menu, as pours.** What is on the bar this week: roast → venue edges,
  dated, each one an availability record the atlas's first branch is built
  from. Published from the desk, these stop being keeper sightings and
  become the venue's own word — first-party availability.
- The counter facts venue legibility compiles from: roaster named, lot named,
  brew methods offered, the story told or not told.
- Their door: hours, the pin, the site — the Register entry, held by its
  own subject at last.

**What the graph returns.** **Footfall with intent.** The atlas sends the
exact reader a specialty bar wants — the traveller who searches "where is
this lot pouring," the local whose overlay matches what the venue pours,
the keeper following a roaster the venue just put on bar. Every discovery
placement is earned by legibility: a venue that publishes its menu is
findable by every coffee on it; a venue that doesn't, isn't. The desk also
returns the venue's own read: how its pours land on the overlay, which
coffees bring people back — the return-rate instinct of `NORTH_STAR.md`,
handed to the bar.

**The surface.** Phone-first desk — menus change at the bar, not at a desk.
Updating the board and updating CARTA should be the same gesture: type the
coffee, the resolver binds it to its roast (the roaster already published
it; the venue just confirms), on bar / off bar is one switch.

**What it costs.** Page, menu, and pin are free — availability is the
atlas's bloodstream and is never tolled. The subscription carries the
venue's analytics and multi-location tooling (`COMMERCE.md`).

**The refusal.** No venue ratings, no stars, no review stream. A venue's
legibility stays a description, never a score; the 1–9 stays the
keeper's own. And placement in discovery is compiled from taste-match and
legibility — a venue can earn its way up, and can never pay its way up.

---

## 5 · The Gear Registry — the equipment maker

**Who stands here.** The makers of the instruments the last metre of the
road runs on: grinders, brewers, machines, scales.

**What they write.**

- **The canonical catalog.** Their models as Gear nodes — held by the
  maker instead of compiled from keepers' free text: model, variants, burr
  sets, the drivetrain differences that make one model's grind numbers two
  populations (`VISION.md`'s honest whisper, kept).
- **Grind-scale definitions** per model — min, max, step, detents — so every
  keeper's Setup starts right instead of hand-entered.
- **Presets as proposals:** a maker may publish starting recipes for a
  model, carried as the maker's reading — never as the corpus's finding.

**What the graph returns.** The **observational corpus no lab can build**:
how their machines are actually used across thousands of real counters —
which methods, which ratios, where the dial actually lives against its
range, how readings distribute on their gear versus the method cluster at
large. R&D telemetry without surveillance, because it is aggregate-only,
floored (`PLATFORM.md`), and derived from what keepers chose to record.

**The instruments programme.** The deeper product is certification:
**instrument of record** — a device class whose hardware writes honest
brews into a keeper's ledger with consent (a scale writes mass and time; a
grinder writes its own setting; nothing writes what it didn't measure).
Certification is a published honesty standard, not a partnership tier: no
invented precision, no cloud detour, the keeper's ledger stays the keeper's.
The mark is monochrome, of course.

**What it costs.** The registry is free — canonical Gear makes the corpus
honest, which serves keepers first. Certification and the integration API
carry fees (`COMMERCE.md`).

**The refusal.** The corpus is never exclusive, never sold raw, and never
ranks makers. No "top grinders" chart, ever — the corpus describes use, not
merit, and a maker's fee buys integration, never standing.

---

## 6 · The keeper — the home barista

**Who stands here.** The person the whole record began with. Their product
is the existing app, and the third turn changes it less than any other
constituency — by design. The instrument stays quiet; the road grows legible
behind it.

**What they write.** Exactly what they write today: Setups, bags, brews,
readings — now referencing the spine (`SCHEMA.md`), so every private line
quietly enriches the shared road's overlay without a single new obligation.

**What the graph returns, newly:**

- **The bag becomes a road.** The bag on the shelf opens onto its lot — the
  station, the siblings, the other hands that roasted the same green, where
  it pours nearby.
- **The dial-in floor.** A new bag arrives with the corpus's honest read for
  their exact gear — a distribution and a calibrate-to-your-zero note,
  never one authoritative number.
- **Continuity of taste across seasons.** "The station you loved has a new
  harvest; the first roasts just appeared" — the through-line of *you*,
  running along the through-line of the road. Follow is a quiet mark on any
  node, surfaced in Today; never a feed.
- **The door, when they want it.** A finished bag's page shows where the
  next one is sold — the roaster's own counter, one link away
  (`COMMERCE.md`). Put away a bag and the reorder is one tap, at the
  seller's till, never CARTA's.

**What it costs.** Nothing, and the record stays offline-first, exportable,
theirs — the trust floor the entire ecosystem stands on. The one paid
object a keeper is ever offered is the **Folio** (`COMMERCE.md`): a bound,
printed year of their own record. Optional, physical, and very much in
character.

**The refusal.** The keeper is never the product. No reading is ever sold,
surfaced to a desk individually, or used to target anything. A roaster sees
that forty keepers loved its washed Gedeb; it never sees who.

---

## 7 · The reader — the consumer

**Who stands here.** The person who just wants a good cup and maybe, once,
the story behind one. No account, no logging, ever — Find's founding
promise, kept and widened.

**The surface: the atlas, and the scan.** The public face of the whole
graph: every page readable, the map walkable, no login wall. And one
gesture that makes the ecosystem tangible in a grocery aisle: **scan the
bag** — code where roasters print one, the resolver's fingerprint where
they don't — and the road unrolls: the station, the hands, the standing
with its evidence, where it pours near you, what it costs at the door.
The same gesture works on a café menu. Thirty seconds from shelf to story.

**What they return to the graph.** Nothing, and that is fine — readers are
the demand the whole chain wants to see. The one soft path: a reader who
scans three bags is quietly offered the first room of the keeper's app.
The ladder from reading to keeping stays gradual, exactly as the app
already opens (`README.md`), and no reader is ever nagged up it.

**The refusal.** The atlas never editorialises. No "best coffees," no
ranked cities, no tastemaker lists. Pages, evidence, and the reader's own
legs.

---

## The seven, in one table

| Constituent | Writes (their link) | Reads (the road) | Pays |
|---|---|---|---|
| Origin Desk | harvests, lots, processing, producers | where its coffee went, how it read | never |
| Import Desk | offers, splits, hard IDs | demand at green level | desk |
| Roast Desk | roasts, blends, buying, doors | same-green page, corpus, re-buys | desk |
| Venue Desk | menus as pours, counter facts | matched footfall, return reads | desk |
| Gear Registry | models, scales, presets | usage corpus, certification | programme |
| Keeper | brews, readings — as today | the road behind every bag | never (the Folio is optional) |
| Reader | nothing | everything public | never |

The chain pays where it profits, holds the pen where it stands, and reads
the whole road from every seat. That is the entire design.

*We do not sell coffee. We keep the record — one link per hand, the road
for everyone.*
