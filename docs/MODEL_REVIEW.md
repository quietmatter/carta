# CARTA — the model, read back against the build

*A code-vs-model audit of `VISION.md` — the lot-centric model, second draft,
industry-checked — against the app as it stands at `APP_VERSION 6.1.0`. The rule,
borrowed from `MODEL_QA.md`: no drift is called a defect until it is shown at a
line number, and each one names which side is wrong — the code, the model, or both.*

`MODEL_QA.md` checked the model against the trade. This checks it against itself.

## The verdict

**The model held. The build drifted, and it drifted at the ladder.**

Steps 1–5 of `VISION.md`'s seven-step sequence are substantially shipped, and the
hardest of them is the most solid: the identity machinery is real, not stubbed. What
went wrong went wrong quietly, in the one place the app talks about most — how
finely a coffee's origin is proven. **Every green in the record was rounded up by
exactly one rung, on every surface, under copy that promised the opposite.**

Two findings are fixed in this release. Six are recorded here and sequenced.

## What is genuinely built

Worth stating first, so the findings are read in proportion. `resolveLot`'s four
rungs, `scoreFP` with its country gate and Jaccard variety set, `lotKeyOf`'s
≥2-of-6 floor, `lotByHardId` across seven schemes, `openLotPropose`, a
derived-never-stored `reviewQueue` with `lotApart` memory, merge with full
downstream re-point (`lotRepointOwn` — bags, café cups, pours *and* orphan catalog
roasts), a merge guard that refuses a bare string coincidence, `splitLot` with
tombstone revival, and `lineage{}` written on both sides. `CALIBER_TIERS`
1a/1b/2/3/4 is enforced at the **write path** (`caliberResolveTier`), not merely in
the UI — an unattributed score is downgraded on save. `lotTier` genuinely never
folds the three axes into one number.

That is `LOT_IDENTITY.md` and most of `RESOLVER.md`, built.

## The findings

### F1 · The grain was rounded up by one rung, everywhere — CODE WRONG *(fixed)*

`lotIdentity()` derived the resolution grain from **field presence**, not evidence:

```js
const grain=(regSubstance(o.producer)||regSubstance(o.lot))?'green-lot'
  :regSubstance(o.originRegion)?'station-season'
  :regSubstance(o.originCountry)?'region-grade':null;
```

Each rung fired one notch finer than the fact that triggered it:

| the record held | it printed | the primer claimed |
|---|---|---|
| a country | `region-grade` | *"the trail proves only to a region and a country"* |
| a region | `station-season` | *"the trail proves to the washing station and the harvest"* |
| a producer *name* | `green-lot` | *"one identity the trade bought and sold it under"* |

Not one of those claims was supported by what promoted it. And the same primer that
over-claimed closed with *"A finer claim would be invented. The grain is stated,
never rounded up."*

This broke a named brand goal — `VOICE.md` #5, *"Resolution comes as it is… State
the grain; never round it up"* — and the commission's own law, *never print a number
that lied to get there*.

**It was also inverted for the exact case it was built to serve.** The door has told
a finca from a washing station since v5.2.0 (`producerKind`), and gives the station
its own processor node. `lotIdentity` read neither. The app's own demo fixture
proved it: `devSeedChart`'s Konga washing station rendered as **"green lot — the
finest grain"**, while a green knowing only *Ethiopia, Yirgacheffe* rendered as
**"washing station · season."** Exactly backwards.

**Fixed.** Five rungs — `country · region · station · farm · green-lot` — each
promoted by evidence. `green-lot` now requires a lot *identity* (a printed lot name
or a hard-ID), not a name. `farm` and `station` are told apart by `actorKind`: the
door's tag, the lot's `processorRefs` edge, or the shared `FARM_RE`/`STATION_RE`
vocabulary, the mill tested first — because a "co-op farm" pools whatever it is
called. **An unmatched name buys no rung** (`SURFACES.md`'s law: never guessed into
a tier; `MODEL_QA` A2 found one station name standing for 3,000 households).

Grain is a rule's output, not an attestation, so `catUpsert`'s blanks-only law would
have frozen every green at its first guess. `lotRederive` writes it **through** —
`catStampRoast`'s `level` precedent.

### F2 · The season was still a rung — MODEL AND CODE, unsettled *(fixed)*

`MODEL_QA` **A5** ruled the ladder QUALIFIED with one instruction: *"one
spatial-granularity ladder; process / variety / season as independent attributes."*
`VISION.md` absorbed the *ladder* — it printed `country → region → washing-station →
farm → lot → micro` — but kept naming the middle value `station-`**`season`** in the
same bullet, and the code shipped that name. The correction was written down and
never landed.

**Fixed.** The rung is `station`. The harvest is a column.

### F3 · Two crop years of one farm could fold into one green — CODE WRONG *(fixed)*

The model's central guarantee: *"two genuinely different lots must never collapse
into one"*, and *"next season it is a different lot."* The scorer weights
`harvest.year` at **0.18**, the third-heaviest column, with ±1 partial credit. But
`lotIdentity` hardcoded `harvest:{crop:null,year:null,hemisphere:null}` and
**nothing anywhere wrote it**. Blank-on-both is correctly neutral, so two records of
one farm differing only by crop year scored head+region+variety+process = **1.0**,
cleared τ_auto (0.90), and auto-bound.

The year was not missing. **The door had been parsing it since v5.2.0** and dropping
it into a prose aside — *"2024 harvest"* — on the way past. The comment justifying
the stub (*"harvest… stay unread because flat text carries no channel to read them
from"*) was true when written and had been false for two releases.

**Fixed.** `harvestYear` lifts it onto `fingerprint.harvest.year` at entry; the
green's page states it as its own column. Measured after the change:

| two records of one farm | score | posture |
|---|---|---|
| same crop year | 1.00 | auto-binds |
| adjacent years (2024 / 2025) | 0.92 | **still auto-binds** — see F4 |
| two years apart | 0.81 | proposes |
| a year meeting a lot that has none | 0.81 | proposes, then `lotRederive` fills the blank |

**And the score alone was not enough — the key had to see it too.** Scoring the two
harvests apart changed nothing at first: `bestCandidate` deliberately skips the lot
sharing a record's floor key (*"never itself, its own floor"*), and `lotKeyOf` reads
only the six flat tokens. So the second harvest was excluded from its own candidate
set and landed on the first one's node anyway, silently, with the scorer never
consulted.

The general law this exposes is worth keeping: **any column the floor key cannot see
is a column the scorer never gets to rule on.** The key is not merely a fallback
beneath the ladder — it is a filter above it.

`lotKeyOf` now **appends** the crop year when a record states one. Appended, never
inserted: a record naming no year keys byte-for-byte as it always did, so nothing
standing is re-keyed and there is no migration. It does not count toward the ≥2-of-6
threshold — it discriminates between greens, it does not make a thin record
substantial.

### F4 · The ±1 crop-year partial keeps adjacent years auto-binding — OPEN, a tuning call

Falling out of F3, and stated rather than silently fixed. `scoreFP` gives a ±1 year
gap 0.6 credit, deliberately: the trade labels one harvest two ways (2024, 2024/25),
so a hard year equality would over-split. The consequence, now measurable, is that
**2024 and 2025 score 0.92 and auto-bind** when every other column matches. A
partial of ≤0.4 would push that pair to propose.

`RESOLVER.md` decision #3 says the thresholds are *"POSTURES to tune against real
records once enough lots stand to measure a false-merge rate, not fabricated
precision."* Retuning them on one synthetic pair would be exactly the fabricated
precision it warns against. So this is filed as the first real measurement, not a
change. **Do not retune until a false-merge rate can be measured.**

### F5 · `PR.region` was unreachable from any green — CODE WRONG *(fixed)*

`grainPrimerKey` keyed `'region'` against a ladder that only ever emitted
`'region-grade'`, so every region-grade green fell through the `||'resolution'`
default and opened the **station-season** primer — over-claiming a second time, on
the tap meant to explain the first. The correctly-written `PR.region` was dead code.

**Fixed**, and every rung now reaches its own primer.

### F6 · Roast level is a normalised scale on the shared node — CODE WRONG *(open)*

`MODEL_QA` **A10** and `VISION.md` both say it plainly: roast level is *"a free
descriptor the roaster used — never a normalised scale, because one roaster's medium
is another's dark."* The code carries `ROAST_LEVELS` — a fixed five-point scale
stored as an **index** — and `catStampRoast` writes it *through* onto the **shared**
roast node as `level`.

A keeper's own bag wearing their own reading is fine; that reading becoming the
shared record's roast level, comparable across roasters, is the thing the model
refuses. This is the same class of error as F1: a normalisation nobody can stand
behind, printed as fact.

Not fixed here — 41 call sites, and the level also drives the accent colour and the
rest-window read, so it needs its own pass. The shape of the fix: keep the keeper's
index local, carry the roaster's **own word** onto the node, and let the node read
*unread* when no roaster stated one.

### F7 · The barista firewall is a comment, not a mechanism — CODE WRONG *(open)*

`VISION.md` firewalls WBC and Brewers Cup scores out of caliber: they judge the
competitor, not the coffee. The code's firewall is the *absence of a tier* plus a
comment saying so. There is no detection and no refusal: a keeper entering
"WBC 2024 Finals" as the event with source *Competition* gets a fully admissible
**tier 1a**. `caliberResolveTier` checks only that an event string is non-empty.

### F8 · Rarity is write-once; caliber is correctable — CODE WRONG *(open)*

Caliber is append-only and strikeable — a mistyped score is withdrawn, never erased,
exactly as the sighting law requires. Rarity is not: `lotSetRarity` writes
`sizeKg`/`sizeBags`/`auctionPrice`/`scarceVariety` blanks-only with no withdraw
path, so **a mistyped lot size can never be corrected by anyone**. That contradicts
the constitution's *nothing is lost in a correction*. Rarity should carry the same
append-and-strike shape as caliber.

Related, smaller: `lotRarityStanding` reads *sourced* from `hands>=2` alone, so a
green two roasters happen to carry reads as having sourced rarity on what is really
a popularity count.

### F9 · The corpus medians espresso with filter — CODE WRONG *(open)*

`MODEL_QA` **A11/A12** asked for three things: grind as a distribution with
*calibrate to your own zero*, a **method-cluster** layer above the exact model, and
**espresso as its own corpus**. The first is honoured in spirit — grind is scoped to
one Setup, refused across Setups, and the copy says so. The other two are not built:
a 1:2 espresso and a 1:16 V60 on one green go into the same `ratios` array and
produce one meaningless median.

The precondition is unmet and the model should say so: a method cluster needs Gear
**classified**, and `catStampGear` puts the whole free-text string into `model`,
leaving `maker` and `methodClass` unread. **The corpus (sequence step 6) is blocked
on classifying Gear, not on the corpus itself.**

### F10 · `blends` and `aggregators` are drawn, not built — MODEL WRONG *(fixed in the model)*

Both are declared in `CAT_KINDS`, allocated at boot, merged in sync and pushed to the
server — with **zero write paths**. `SURFACES.md`'s own sequence step 6 asks to
settle them: *"build them or drop them from `CAT_KINDS`."*

The answer is neither, and the model was wrong to draw them as though built.
`MODEL_QA` **A9** confirmed the blend outright, and `CONSTITUENTS.md` says who
writes both: a blend's dated composition is a **Roast Desk** fact, an aggregator's
pooling an **Import Desk** fact. Neither hand has a desk yet. Authoring a blend on a
roaster's behalf would be guessing at someone's recipe — the precise thing scoped
authority forbids.

**Fixed in the model**, not the code: `VISION.md` now carries a *What of this is
standing* table, so a drawn entity cannot read as a built one. The documents stay in
`CAT_KINDS` — they cost an empty envelope and they keep the sync shape stable for
the desks that will fill them.

### F11 · Fields with no desk — MODEL INCOMPLETE *(fixed in the model)*

`sourcingChannel` has no write path anywhere in the app. `intermediary` is weighted
0.05 by a scorer that can never see it. `scope` is promised in a code comment and
absent from the struct. These read as unfinished work; they are not.

Per the ecosystem turn's law — *each constituent writes the facts born at its own
node* — all three are born upstream of anyone who can paste a bag: sourcing channel
and intermediary at the **Import Desk**, scope at the **Origin Desk**. A keeper
three links downstream cannot know them, and asking would invite a guess.

**Fixed in the model**: `VISION.md` gains *Where each fact is born*. A field with no
desk is not missing data — it is a fact the record has not yet earned the right to
hold.

### F12 · The gate was an admission bar the code never built — MODEL WRONG *(fixed in the model)*

`VISION.md` §*The gate* described quality-and-traceability as a bar that **admits**
coffee, bounding the atlas *"small enough for one keeper to seed and moderate."*
Nothing in the app implements one, and nothing should: a bar that excludes on
absence contradicts *unread is a state, never a verdict*, and the bounding job
passed to real machinery — the pen, and `SEQUENCE.md`'s *charts, not campaigns*.

The correction that mattered — `MODEL_QA` **A13**, quality is not traceability —
stands untouched, and the two signals already live as two of the standing's three
axes. **Fixed in the model**: the section is now *The two signals*, and it narrows
rather than admits.

## The sequence — what is left, in order

Ordered by *how false a thing the record currently prints*, which is the same order
`VOICE.md` would pick.

1. **Roast level stops being a scale on the shared node** (F6). The last surviving
   normalisation nobody can stand behind. Local index stays; the node carries the
   roaster's own word, or reads unread.
2. **Rarity becomes correctable** (F8). Append-and-strike, exactly as caliber. A
   record that cannot be corrected is not a record.
3. **The barista firewall becomes a mechanism** (F7). Detection and a refusal at the
   write path, in the shape `hardIdRefusal` already uses for false-friend codes.
4. **Classify Gear** (F9, and the unblocking of sequence step 6). Split `maker` from
   `model`, read `methodClass` — then espresso separates from filter and the method
   cluster becomes possible. `CONSTITUENTS.md` gives this to the **Gear Registry**;
   until then a conservative on-device classification is honest, because it is
   reversible and says what it could not classify.
5. **Measure the false-merge rate** (F4). Enough standing greens to count, then tune
   τ and the ±1 partial against real records — never before.

Steps 1–3 are corrections. Steps 4–5 are the road to the brew corpus.

## What held

- **The lot as the centre.** Nothing in the build argued against it.
- **Identity is compiled, never keyed.** The hardest joint, and the best-built one.
- **Compiled, never picked — and always showing its evidence.** The caliber source
  ladder is enforced where it counts, at the write path.
- **`lotTier` never folds its three axes into one number.** The restraint held
  under the pressure to print a verdict.
- **Unread is a state.** Said on every surface, and meant — which is exactly why the
  grain's over-claim stood out as the one place the record was not keeping its word.

*We do not sell coffee. We keep the record — and we read it back against itself
before we trust it.*
