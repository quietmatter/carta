# CARTA — the way in

*The intake pass. Every other document in this record designs what the atlas holds;
this one designs how a fact gets into it, and what the app is allowed to ask for
before it has given anything back. It also answers the flow question — what a keeper
does on a Tuesday, and how a screen earns its text.*

*Nothing here is committed to `index.html`.*

## The finding: the minimum is already tiny, and invisible

The instinct that the forms ask too much is right about the feeling and wrong about
the cause. Measured against the shipped build:

- A **bag** saves with one field. `saveBag` (4859) refuses only if *both* roaster and
  coffee are blank: *"Name the coffee — everything else is optional."*
- A **café cup** saves with a place **or** a score — one tap.
- A **brew**, in steady state, needs **zero typed characters.** Every dial is seeded
  from `lastBrewFor` (4992); technique carries a datalist of your own prior
  techniques.
- The **welcome** asks nothing at all: three doors, one tap, nothing typed.

So the honest minimum is two fields and six taps for a complete home record. The
problem is not the size of the ask. It is that **nothing tells you what any answer
buys**, and the one answer that matters most is hidden.

### The threshold nobody is shown

`lotKeyOf` (794–797) is the resolver's offline floor. It collapses a record onto a
shared green only when the origin carries **two of six** tokens — country, region,
producer, variety, process, lot. Fewer than two and it returns `'lot:'+fallbackId`:
a private singleton green that can never collide with another keeper's record. The
comment says it plainly — *too thin to trust → fork.*

Those six fields live behind a collapsed `<details>` labelled *"Add the rest — origin,
roast date, price — now or later"* that defaults shut on every new bag (4814).

**So the app accepts a one-field record and quietly files it where it can never join
the atlas.** A keeper doing exactly what the form invited them to do produces a
ledger of private singletons and then finds the Atlas empty. That is the friction —
not too many fields, but no signal about which two of them are load-bearing.

The rest of the inventory, for scale: 29 distinct inputs across bag → brew → cup, 40
counting the Setup editor, 22 on the café cup. Seven datalists in the entire
application. `f_roaster` — the bag form's Roaster — has none, although `roasterList()`
(1822) already exists and is already wired into the café-cup form four hundred lines
away.

## The principle

`VOICE.md`: *"Resolution comes as it is. Identity resolves as finely as the trade can
prove and no finer. Structure earns its place; free text holds until it does."*

`NORTH_STAR.md`'s supporting measures are **median time to record a Cup** and **share
of records with only the honest minimum.** Total fields completed is named a
non-measure.

Together they give the rule: **never widen a form. Narrow what is asked at each
moment, and say what each answer buys.** A field that cannot state what it buys does
not belong on the surface where it is asked.

## Three tiers, and only one of them happens at the counter

### Tier 0 — the counter *(two fields, under ten seconds)*

Roaster and coffee, as printed on the bag. Both with datalists off the catalog.
Nothing else, ever, at this moment.

The record is created immediately at whatever grain those two strings support —
usually none — and **it says so**, in the state the app already has a word for:

> *unread — this green stands alone until it's told more.*

That is not a nag. `unread` is a state, never a low default, and it is already how
the reach, the standing and the traceability grain all read when their evidence is
absent. The bag simply joins them.

### Tier 1 — the reading *(exists; leave it alone)*

Hedonic 1–9, descriptors, one honest line. It is the best-designed surface in the
app: no default on the hedonic so it cannot be answered accidentally, a skip path
that keeps the brew and nulls the reading, and the same three controls on both the
home cup and the cup out so one preference reads across both.

### Tier 2 — the desk *(deliberate, later, from the lot page)*

Origin, process, variety, harvest, hard IDs, standing. Move these **off the bag form
entirely** and onto the lot page, where the Corrections & identity fold already lives.

The reason is not screen real estate. It is authority. Origin facts are *facts about
the coffee* — shared, compiled, correctable by anyone, governed by the pen. A bag is
*your record of your shelf.* The current bag form asks a keeper to author the shared
spine as a side effect of noting what they bought. Those are two different jobs at
two different altitudes, and collapsing them is why the form reads as a wall of
empty boxes: most of it is not about your bag at all.

## The two doors that make Tier 2 cheap

### The paste door

One textarea: paste the roaster's product copy. Parse it locally and
deterministically —

- country against the origin list the app already carries;
- process against the resolver's own process-family vocabulary;
- variety against a variety list plus `SCARCE_VARIETIES` (1138);
- altitude and harvest year by regex.

Every hit is **proposed as a chip the keeper confirms or strikes.** Nothing is written
unconfirmed.

This is `proposeLook`'s ceremony (4362) pointed at a blob instead of four fields, and
it is keyless, accountless, offline, and bundles nothing — it clears the bar
`CLAUDE.md` sets for a network read, because it does not even need the network. The
LLM-assisted version is already sanctioned as `VISION.md` step 3; it becomes the
*online upgrade* of a door that works without it, which is the same posture as the
brand read and the street map.

### The gap card

Replace empty fields with a card that states what the record knows and what it is
missing — each missing fact a door, never a blank:

```
This green resolves to:  region · grade — the ECX floor
  → name the station, and it resolves a step finer
  → two of six origin facts, and it can meet another keeper's record
```

That third line is the highest-leverage sentence available anywhere in the app. It is
the `lotKeyOf` threshold, said out loud, at the only moment it is actionable. It
turns a form into a page with obvious next moves, and it is exactly *unread is a
state, never a low default* applied to intake.

## The autocomplete debt

This is not a convenience item. Under a timid resolver, **every un-suggested origin
field is a fork risk**: a typo, a transliteration or a naming-tier mismatch forks a
green that should have collided, and over-splitting is only correctable by hand
(`RESOLVER.md` §7). Autocomplete is identity infrastructure.

| Field | Source that already exists |
|---|---|
| `f_roaster` (bag) | `roasterList()` 1822 — already wired into the café form |
| country · region · producer · variety · process (bag **and** café cup) | the `lots` catalog's own fingerprints |
| process | the resolver's process-family vocabulary |
| roaster city | the roaster nodes' own cities |

Six free-text origin fields, typed cold, on every record, with no suggestion source
between them — that is where the form *feels* endless, and it is also where the atlas
quietly fragments.

## The model gap: where is the farm

The question is fair and the answer is that the farm exists in the design and not in
the build.

`SCHEMA.md` specifies three distinct origin actors, and insists on the distinction:
**Producer** (grows cherry — `kind: farm | estate | smallholder | group`),
**Processor** (the washing station or mill — *"not the same as the producer"*), and
**Aggregator** (co-op, union, exporter). `VISION.md` states the reason: one processor
gathers cherry from hundreds of growers, which is precisely why a single lot can
carry hundreds of producers.

In `index.html`:

- a producer node is written as `{name, country, region}` and later `{lat, lon,
  geoGrain}` (1180, 5537). **There is no `kind` field**, so *farm* versus *estate*
  versus *smallholder* is not recorded;
- `processors`, `aggregators` and `blends` are declared catalog kinds — whitelisted
  in both servers, merged, synced — with **zero read paths and zero write paths.**
  They are empty tables;
- the input that feeds all of this is labelled **"Producer / station"** — one field
  for the two actors the model exists to keep apart. `devSeedChart` shows the
  consequence in the shipped demo: `catUpsert('producers', 'Konga washing station')`
  (3325) files a washing station as a grower.

So: the farm is not missing from the design, it is missing from the record, and the
one field that should capture it is currently collapsing the very distinction the lot
model was rebuilt around.

**The fix is small and belongs with Tier 2.** Split the field in two on the lot page —
*Grower* and *Washing station / mill* — give the producer its `kind`, and give
`processors` the `catStampProcessor` it never got. Both fields stay optional and both
read `unread` when absent. Do **not** split it on the bag form; at the counter the bag
usually says one name and does not say which actor it is, and forcing that call is
exactly the invented precision the record refuses. One name, unclassified, is an
honest Tier 0 fact; classifying it is desk work.

## The flow, stated once

The redesign distilled fourteen surfaces into four rooms and that was right. What it
did not do is state the **loop** — and without the loop, four rooms read as four
piles of text.

### One question per room

Each room should say what it is in one line, at the top, always:

| Room | The one question |
|---|---|
| **Today** | the coffee in hand — *what are you drinking, and did you keep it?* |
| **Atlas** | the coffee in the world — *what is this green, and who else has it?* |
| **Record** | what you have kept — *what do you love, and does it travel?* |
| **More** | the desk — everything that is not a cup |

### The rule: one screen, one sentence, one action

A screen states what it is in one line, offers **one** primary action in the ember,
and pushes everything else behind a fold or onto a page. It is measurable, which is
the point: *if a screen carries two ember elements, or three paragraphs above the
fold, it fails.* The ember-once law already exists and is enforced; this extends the
same discipline to prose.

### Density belongs to the lot page, and nowhere else

The current build has roughly uniform text density across every surface, and that —
not the volume of text — is the hierarchy failure. Nothing is quiet, so nothing reads
as important.

- **The lot page is where the app is allowed to be long.** It is the thing worth
  reading — the road, the hands, the standing, the corpus. Editorial density is
  earned there.
- **The instrument surfaces should be near-wordless.** Today, the shelf, the brew,
  the impression. Wet hands, seven in the morning.
- **Everything between them gets one sentence.**

### Delete the inline explanations; keep the primers

The `PR` map and `openPrimer` are the right mechanism, and the law is already
written: *every new badge, chip, term or state ships its primer in voice the same
pass.* The surfaces currently do both — they explain a term inline **and** carry its
primer one tap away. Deleting the inline half costs nothing, because the explanation
is still there for anyone who reaches for it, and it removes a large share of the
text without removing a single fact.

That is the cheapest available hierarchy win in the app: **no new design, no new
component, only the removal of duplicated teaching.**

### What "lot-centred" means, said where it can be felt

The turn to the lot is stated in the docs and never stated to the keeper. It needs
one sentence and one gesture, not a tour:

- the sentence, on the Atlas: *one green, many hands — the coffee, not the café;*
- the gesture: **every surface answers "what green is this?" in one tap.** A bag row,
  a cup, a brew, a pour, a roaster's page — each is one tap from the lot. Where that
  tap does not exist, the surface is not yet lot-centred, and that is a checklist, not
  a redesign.

## Sequence

Ordered so each step is worth shipping alone.

1. **Say what the answers buy.** The gap card on the bag and the lot page; the
   `lotKeyOf` threshold made visible; `unread` said out loud on a thin green.
2. **Pay the autocomplete debt.** Datalists on `f_roaster` and on all six origin
   fields, sourced from the catalog. Highest ratio of atlas quality to work.
3. **Move Tier 2 to the desk.** Origin, hard IDs and standing leave the bag form for
   the lot page; the bag form becomes two fields, a roast level and a fold.
4. **The paste door**, offline and deterministic; the LLM upgrade after.
5. **The hierarchy pass.** One sentence per room, one ember per screen, inline
   teaching deleted in favour of primers, density concentrated on the lot page.
6. **The origin actors.** Split grower from station on the lot page, give the
   producer its `kind`, write `processors` for the first time.

## What this does not change

No field is deleted from the record — Tier 2 moves, it does not disappear, and every
existing record reads unchanged. No form becomes required where it was optional. The
brew flow and the impression are untouched. Nothing here needs a dependency, a build
step, or a server change.

*Honesty over completeness. A sparse record rendered honestly beats a full one
padded — and a record that says which blank matters beats both.*
