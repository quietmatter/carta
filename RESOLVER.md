# CARTA — the resolver, as contracts

*The step-2 build spec. `VISION.md` put the lot at the centre; `LOT_IDENTITY.md`
spiked whether the lot can be found twice and found it tractable — *a resolution,
not a key*; `SCHEMA.md` turned the spine into storable shapes and left the
resolver's scoring, normalisation, propose-and-confirm and merge/split explicitly
open. This is where those open pieces become contracts: the whole identity ladder
designed on paper, strongest rung first, so the rest of step 2 can be built from it
without re-deciding its semantics.*

*What ships this session is only the **hard-ID rung** — the deterministic slice,
§1, shippable alone. §2–§7 are designed here and built next. The rule the whole
pass obeys, inherited from every prior doc: **invent no new machinery — extend the
sighting and compile.** The resolver reads columns and writes sightings; there is
no identity cell. Over-splitting is a correctable sighting; over-merging is the
failure this document exists to prevent, and every threshold below is tuned to
refuse it first.*

The ladder, walked strongest rung first, and the map of this document:

1. **A shared hard-ID** — deterministic, `{scheme,value}`, a match binds outright. **(built this session)**
2. **Normalisation** — fold transliteration, reconcile the naming tier, before any score.
3. **The fingerprint scorer** — a cluster of traceable facts; auto-bind · propose · fork.
4. **Propose-and-confirm** — the keeper adjudicates; a confirm writes a binding sighting, a reject forks.
5. **Merge & split** — re-parent downstream, preserve provenance, guard both directions.
6. **Grain & confidence in the UI** — evidence and grain on one tap; station-season a real terminal node.
7. **Coexistence & reversibility** — the resolver and the shipped `lotKeyOf`; every bind append-only.

Open decisions that are genuinely yours to settle are marked **▸ QUESTION** inline,
and gathered at the end. Nothing downstream of a marked question is frozen until you
settle it.

---

## The write it all reduces to — the binding sighting

Before the rungs, the one shape they all write. `SCHEMA.md` gave the catalog
sighting its bones and `PLATFORM.md` its rungs; the resolver writes exactly one new
*kind* of sighting — a **binding**: a signed, dated line on a **lot** that says
*this record resolves here, at this confidence*.

```js
// a binding sighting — lives on lot.sightings[], compiled by compile(entry)
{
  id, by, at,                       // signed line — as every sighting
  bind: { ref, kind },              // the record bound: {ref:<bagId|cupId>, kind:'bag'|'cup'}
  rung: 'documented'|'first-party'|'confirmed'|'stated'|'derived',
  via:  'hard-id'|'fingerprint'|'keeper'|'merge'|'split',   // which rung wrote it
  evidence: { scheme?, value?, score?, fields?[] },         // why it bound (shown on one tap)
  withdrawnAt?, supersededAt?        // struck, never removed — a wrong bind is corrected by a later line
}
```

- A **hard-ID bind** writes `rung:'documented'`, `via:'hard-id'`, `evidence:{scheme,value}`.
- A **fingerprint auto-bind** writes `rung:'derived'`, `via:'fingerprint'`, `evidence:{score,fields}`.
- A **confirm** (the keeper says yes to a proposal) writes `rung:'confirmed'`, `via:'keeper'`.
- A **reject** writes nothing on the old lot and a fresh binding on the forked one.

`compile(entry)` (already in the app, waiting) folds these: the lot's bound records
are the standing binds; its identity confidence is the strongest standing rung. This
is the single mechanism §2–§5 all reduce to — **they differ only in what evidence
they gather before writing the same line.**

**▸ QUESTION — the binding sighting's home.** This session's hard-ID rung takes a
lighter path (an append-only `hardIds[]` *column*, §1) rather than a full
`bind`-sighting, because a hard-ID is a *set-union on the lot*, not a per-record
newest-wins field, and because it must be readable by the resolver as an O(1)
column (schema wrote `hardIds:[{scheme,value}]`). The record→lot edge is already
carried by the ledger's `lotRef`. **Do you want the fuzzy rungs (§3–§5) to also
stay column-and-ref, with the `bind` sighting reserved only for the confirm/reject
*decision* — or should every bind, hard-ID included, become a sighting so
`compile` is the one identity fold?** The doc below assumes the former (lighter)
reading, and notes where the heavier one would differ. Settling this fixes the
write-path for §3 onward.

---

## §1 — The hard-ID layer *(built this session)*

The clean minority. Four channels in the trade mint an identifier public and stable
enough that two roasters' offerings adjudicate to *literally the same green*
(`LOT_IDENTITY.md`). Where both records carry one, identity is deterministic — no
score, no proposal, no keeper decision. A shared token **binds outright, ahead of
any fingerprint fork.**

### The scheme registry

`hardIds` is a **namespaced, multi-valued** attribute: zero-or-many per lot, each a
`{scheme, value}` in a fixed registry. Never assume one; never assume any.

| scheme | what it names | format seen on the bag | keyed with |
|---|---|---|---|
| `kenya-outturn` | the closest thing to a true green-lot key | `00AA0000` — week · dry-mill · batch (`17KF0001`) | **its grade** — one outturn splits AA/AB/PB |
| `coe` | a Cup of Excellence auction lot | `program · country · year · rank` (`ETH 2024 #7`, `#1a/#1b` splits) | rank + year |
| `best-of-panama` | a BoP auction lot | `estate · variety · lot#` | lot# + year |
| `gesha-village` | a Gesha Village estate-auction lot | `lot#` (a `GVA.` prefix some years) | lot# |
| `ninety-plus` | a Ninety Plus branded lot | `Perci Lot 50`, `Gesha Lot 23188` | lot name/number |
| `esmeralda` | a Hacienda La Esmeralda Special lot | auction `lot#` | lot# + year |
| `ico` | the ICO mark on the export bag | `country/exporter/parcel` (`001/0001/00001`) | the full triple |

The registry is a closed list. A token whose channel is not one of these is **not a
hard-ID** — it stays flat origin text and is matched (if at all) by the fingerprint
(§3). Adding a scheme is a code change, deliberately, so the false-friend firewall
below can be written per-scheme and never widened by accident.

### The `{scheme, value}` normal form, per scheme

`normHardId(scheme, raw) → {scheme, value} | null`. Normalisation is **conservative
and lossless of identity** — it folds only presentation noise (case, spacing,
separators), never structure:

- **Generic:** trim; collapse internal whitespace to one space; uppercase.
- **`kenya-outturn`:** strip all internal spaces (it is one token). If a grade is
  appended (`17KF0001 AA`, `17KF0001/AA`), split it onto `OUTTURN/GRADE` — the
  correct key is outturn **with** grade (station-and-year over-merges; grade alone
  over-splits). A bare outturn with no grade normalises to `OUTTURN` and matches
  only another bare `OUTTURN` — never a graded sibling, which is a *different
  physical export lot* under the same processing batch (§5).
- **`ico`:** strip spaces around slashes; keep the `country/exporter/parcel` triple
  intact. A partial ICO (two of three segments) is refused — it names the shipment,
  not the parcel.
- **`coe` / `best-of-panama` / `esmeralda`:** normalise the rank/lot token
  (`#7`, `LOT 7`, `7` → the canonical `#7`) and require the **year** to be present
  in the value, because rank repeats every year (§ firewall). Split suffixes
  (`#1a`, `#1b`) are preserved — they are *different physical boxes and buyers* of
  the same cherry (§5 siblings), never collapsed to `#1`.
- **`gesha-village` / `ninety-plus`:** normalise the lot token; keep any block /
  variety qualifier the channel prints as part of the lot's identity.

`value` is the whole normalised string. Matching is exact string equality on
`{scheme, value}` — after normalisation, that is the point of normalisation.

### The false-friend firewall — what is refused at entry

Three identifiers look like keys and are not (`LOT_IDENTITY.md`). None may ever
enter `hardIds`. `hardIdRefusal(scheme, raw) → reason | null` runs **at entry**,
before anything is stored, and returns a plain-language refusal the form shows:

1. **A bare grade token** (`AA`, `AB`, `PB`, `C`, `G1`, `SHB`, `peaberry`, …) under
   *any* scheme. A grade is a quality class shared by thousands of lots — it names
   the screen, never the coffee. *Refused: "A grade names a class of coffee, not the
   coffee itself — it can't be an identity."*
2. **A warehouse SKU / importer Ref** — private, season-scoped, dropped when the
   roaster re-bags (Royal's `38302-1 … SPOT RCWHSE`). Detected by SKU/warehouse
   marker words and the private double-number shape. *Refused: "That reads like a
   warehouse reference — it names the shipment, not the green."*
3. **A per-sale auction seat** — the auction catalogue's own `LOT n`, a seating
   position that resets every sale, distinct from the COE *rank*. A bare `LOT n` /
   `#n` is refused **under the non-lot-numbered schemes** (`kenya-outturn`, `ico`),
   where it can only be a warehouse/seat position; under `coe`/`best-of-panama`/
   `gesha-village` a lot number is the legitimate identity, so the scheme
   disambiguates. *Refused: "A bare lot number is a sale position, not this scheme's
   identity."*

The firewall is **the schema of refusal, written per-scheme** — it is why the
registry is a closed list. It fires only on a non-empty entry; an empty field is
simply *no hard-ID*, not a refusal.

### The deterministic bind — the write contract

Identity is compiled, never keyed, so even the hard-ID rung does not *key* the lot —
it **redirects the collapse** to the standing lot the token already lives on:

```
lotByHardId(hids)  → the standing lot bound to any token in hids, or null
                     (earliest firstAt wins if >1; role:'batch' parents skipped)
lotBindKey(r, id)  → lotByHardId(recHardIds(r))?._key   ?? lotKeyOf(r, id)
                     // strongest rung first: a shared hard-ID ahead of the fingerprint fork
lotAddHardIds(lot, hids, who, at)
                   → union hids onto lot.hardIds[], append-only, signed+dated,
                     struck-not-deleted; mergeCatalog unions the set across devices
```

- Each accumulated token is `{id, scheme, value, by, at, withdrawnAt?}` — the
  sighting law applied to the identity set: **append-only, provenance-carrying,
  struck-not-deleted.** A mistyped hard-ID is *withdrawn* (a dated strike), never
  erased; matching reads only standing (`!withdrawnAt`) tokens. This is the
  `documented` rung of `PLATFORM.md`'s ladder, recorded as an attestation.
- The bind fires everywhere a lot is written from a record: the boot sweep
  (`catSeed`), the save-path stamp (`catStampLot`), and the boot repoint's
  key-resolution (`catRefsFor`/`catRepoint`) — the same four seed sites step 1 wired,
  so re-derivation is idempotent and a dropped ref re-points next boot.
- **Multi-match ⇒ a merge, not a fork.** If a record's tokens match two different
  lots, those lots *should be one* (a hard-ID collision across nodes). This session
  binds stably to the earliest-provenance match and leaves both lots standing;
  reconciling them is §5's merge, adjudicated next session. Binding never *forks* on
  a hard-ID — the failure to prevent is over-merge, and a hard-ID match is the one
  place over-merge cannot happen (the token is public and shared by construction).

### What §1 demonstrably buys

Two roasters' bags of one Kenyan outturn, whose *fingerprints differ* (one prints
the station, the other only the region; one says "washed", the other is silent) —
the fingerprint alone forks them into two lots. With the outturn entered on both,
the second binds to the first outright: **one lot, two roasts, the "same green,
many hands" page the whole atlas exists for** — reached at a confidence the record
can defend, because the token is printed and public.

---

## §2 — The normalisation layer *(designed; built next)*

The fuzzy rungs degrade to noise without this, so it runs **before** any score
(`LOT_IDENTITY.md`: "budget for a normalisation layer, or the fuzzy tier degrades to
noise"). Two jobs, one pass, all offline and single-file — no dictionary fetched, no
key, no model:

### Transliteration folding

Amharic-to-Latin has no canonical romanisation, so string equality fails on the same
place: *Yirgacheffe / Yirgachefe / Yergacheffe*, *Gesha / Geisha*, *Guji / Gujji*.
`normPlace(s)` folds these to a canonical token before comparison.

- **Shape:** a small, inline **alias table** (`{canonical: [variants…]}`) for the
  handful of origin words that actually collide — the coffee-growing regions and the
  varietals — plus a generic fold (lowercase, strip diacritics, collapse doubled
  letters, drop punctuation). The table is *data in the file*, a few dozen entries,
  not a downloaded gazetteer.
- **Honest ceiling, stated out loud:** the table covers the known collisions of
  specialty's common origins; it will miss a novel transliteration of an obscure
  station. That is a *fail-to-confirm*, never a false merge — an unfolded variant
  simply scores lower and proposes rather than binds. The layer never *invents* a
  fold it isn't sure of.

### Naming-tier reconciliation

One roaster heads the record with the farm (*Las Flores*), another the producer
(*Jhoan Vergara*), another the mill or the region — same green, three head-strings
at three tiers (`LOT_IDENTITY.md`). Before scoring, the head-string is tagged with
its tier so the scorer compares like with like:

```
headTier ∈ 'farm' | 'producer' | 'station' | 'region'   // already a fingerprint column (SCHEMA)
```

- **Shape:** `reconcileTier(fp)` reads the head-string against the structured
  columns already present (`producer`, `region`, `country`) and the alias table's
  tier tags, and sets `headTier`. When the tier is genuinely ambiguous it reads
  `null` — never a guess. The scorer (§3) then weights a cross-tier match down, not
  out: *Las Flores (farm)* vs *Jhoan Vergara (producer)* can still be one green, so
  the tier mismatch lowers confidence toward *propose*, never forces a fork.

**▸ QUESTION — how aggressive normalisation dares to be.** Two settings to fix: (a)
does the alias table ship as a **curated closed list** (safe, misses the long tail)
or may the fold apply **fuzzy string distance** (e.g. edit-distance ≤ 2 on region
tokens — catches more, risks folding two genuinely different nearby stations)? (b)
does tier reconciliation ever *rewrite* the head-string to the canonical tier, or
only *tag* it? The doc assumes **closed table + tag-only** (the conservative
reading, refusing over-merge first). Loosening either is a posture you set.

---

## §3 — The fingerprint scorer *(designed; built next)*

The default road — ~50–60% of real records carry no shared token, so identity is a
**cluster of traceable facts**, no single field of which is identity
(`LOT_IDENTITY.md`). The scorer runs after normalisation, over the fingerprint
columns SCHEMA already defined.

### Cluster fields and per-field match semantics

`score(a, b) → 0..1` over the fingerprint of a candidate record `a` and an existing
lot `b`. Each field contributes a partial, weighted signal; the **cluster** is
identity, never one field:

| field | match semantics | weight *(posture)* |
|---|---|---|
| `headName` + `headTier` | normalised (§2); same-tier exact = full; cross-tier fold = partial | high |
| `country` | exact after fold; a mismatch is a **hard fail** (different countries are different greens) | gate |
| `region` | exact after fold = full; one side blank = neutral (no signal, not a fail) | high |
| `harvest.year` | exact = full; ±1 crop-year = partial (hemisphere-aware); mismatch = strong down | high |
| `varieties[]` | set overlap (Jaccard); `unknown`/`mixed-heirloom` on either side = **neutral, never a fail** | medium |
| `process.family` | exact = full; `unspecified` on either side = neutral; family mismatch = down | medium |
| `intermediary` | same importer = weak-up; different = **no signal** (one green flows through two importers) | low |

- **`country` is a gate, not a weight.** Two different countries never merge, whatever
  else matches — the one place the cluster yields to a single field, because it is
  the one field that is never ambiguous.
- **The "never block, only fail to confirm" rule.** `unknown` variety, `unspecified`
  process, a blank region — these **never lower the score below the fork line by
  themselves**; they are *absence of a signal*, not *evidence of difference*. A
  fingerprint of all-unknowns scores low and proposes-or-forks; it is never a false
  merge and never a hard fork on absence. This is the invariant that keeps the fuzzy
  tier honest (`LOT_IDENTITY.md`: "`unknown` and `unspecified` never block a match —
  they only fail to confirm one").

### The three postures — auto-bind · propose · fork

Two thresholds cut the score into three actions. They are **postures to tune against
real records, never fabricated precision** — the numbers below are the starting
stance, biased hard toward *propose over auto-bind* and *fork over merge*:

```
score ≥ τ_auto   (≈ 0.90, starting)  → auto-bind:  derived binding sighting, no keeper prompt
τ_prop ≤ score < τ_auto  (≈ 0.55…)   → propose:    surface the candidate, ask the keeper (§4)
score < τ_prop                        → fork:       a new lot; the record stands alone until evidence merges it
```

- **Over-merge is the failure; the thresholds refuse it first.** `τ_auto` sits high
  enough that an auto-bind is effectively "the same green in all but the noise";
  everything genuinely uncertain routes to *propose*, where the keeper — who can see
  what the labels can't — decides. When in doubt, **fork**: over-splitting is a
  correctable sighting (§5 merges it later), over-merging silently unions two greens.
- **The seed stays timid.** Migration (`SCHEMA.md`) already forks below a very high
  bar; the scorer *is* the general form of that bar, and at boot it runs at
  `τ_auto`-only (no interactive propose during a sweep) — the catalog starts granular
  and is merged **up** by curation, never auto-merged down.

**▸ QUESTION — the confirm/fork threshold posture, and whether an unknown-variety
fingerprint proposes or stays forked.** Two linked settings: (a) the starting
`τ_auto` / `τ_prop` values above — hold them where they are, or open auto-bind wider
/ narrower? (b) a fingerprint whose variety and process are both `unknown/unspecified`
but whose *place and year* match well — does it **propose** (invite the keeper to
confirm the green) or **stay forked** (too thin to even ask)? The doc assumes
`≥ τ_prop on place+year alone ⇒ propose`, because a keeper can often confirm what the
label omitted — but this is exactly the line between helpful and noisy, and it is
yours to set.

---

## §4 — Propose-and-confirm *(designed; built next)*

The default entry path, not an edge case (`LOT_IDENTITY.md`). The machine proposes;
the keeper decides the call the labels can't make.

### The write contract

- **A confirm** appends a binding sighting `rung:'confirmed'`, `via:'keeper'` on the
  proposed lot, binding the record to it through `compile`. The flat text retires
  onto the node as it does today; the ref points at the confirmed lot.
- **A reject** forks: mint a new lot from the record's own fingerprint, bind the
  record there, and record *why* (a `via:'split'` note carrying the rejected
  candidate's id) so a later pass never re-proposes the same pair. Nothing is
  mutated on the rejected lot — the record simply never bound to it.
- **Reversible always.** A confirm is a sighting a later line supersedes; a wrong
  confirm is struck, not erased, and the record re-forks. `mergeCatalog` already
  unions sightings and drops none.

### The sheet contract

One proposal, one plain question, evidence on the face of it:

```
"This looks like Nine's Gedeb, natural, 2024 — the same green?"
  [ the same green ]   [ a different one ]   [ not sure — keep them apart ]
  ▸ why we think so:  station · year · process   (the matched fields, one tap)
```

- **"Not sure" forks** — the safe default, never a merge. Uncertainty routes to
  over-split, the correctable failure.
- **A match score never travels without its reasons** (the app's standing invariant):
  the matched fields are on the sheet, not behind a number.

### Offline degradation

`resolve` runs against **local catalog entries only** — no network. Offline, the
proposal is drawn from the lots already on the device; the candidate set is smaller,
never absent. Assisted ingestion (a curator pointing CARTA at an offering page) is
the one online moment, and it is already an *optional enhancement* by VISION's rule,
degrading to manual entry. Propose-and-confirm never requires a server.

---

## §5 — Merge & split *(designed; built next)*

You *will* learn later that two lots were one, or one was two — and a Kenyan outturn
is genuinely one cherry graded into sibling export lots (`LOT_IDENTITY.md`). Merge
and split are first-class, and both reduce to re-parenting plus append-only
sightings — no new machinery.

### The re-parenting protocol

```
mergeLots(keepId, absorbId, who)
  → every downstream roast/pour/record referencing absorbId re-points to keepId
    (a derived re-stamp, exactly as catRepoint re-points a ref)
  → absorbId becomes a tombstone carrying lineage.mergedInto = keepId
  → keep.lineage.mergedFrom .push(absorbId)   // append-only
  → keep.hardIds  ← union(keep.hardIds, absorb.hardIds)   // never lose a token
  → a binding sighting via:'merge' records who merged, when, and why
splitLot(parentId, {fingerprint, hardIds}, who)
  → mint child with lineage.splitFrom = parentId
  → move the named records' binds to the child (a re-stamp)
  → parent stands; child stands; both keep full provenance
```

- **Provenance preservation.** A merge keeps the earliest `firstBy/firstAt` across
  both lots (the collapse rule `mergeCatalog` already runs); every contributor's
  binding sighting survives on the kept node. Nothing is lost in a correction.
- **Both-direction guards** (`LOT_IDENTITY.md`'s taxonomy, enforced in the write
  path): never *same-string ⇒ same lot* (rebranded splits, rotating house names —
  a string match alone never triggers `mergeLots`; it must pass the scorer or a
  hard-ID); never *different-string ⇒ different lot* (transliteration, a lot resold
  under two importers' names — §2 folds these before they can fork). A merge is
  reversible: `splitLot` undoes it, and the tombstone's `mergedFrom` records the
  original boundary so the split can restore it exactly.

### The processing-batch parent

Kenya's outturn splits by screen into AA / AB / PB — *same cherry, different physical
export lots.* They are neither one node nor strangers: **siblings under one
processing batch.** The batch is a synthetic node in `lots` with `role:'batch'`,
`grain:'processing-batch'` (SCHEMA's lighter option, avoiding a ninth document):

```
lot (role:'batch')  // carries the kenya-outturn ONCE, never browsable
 ├─ lot AA  (hardIds: kenya-outturn/AA, processingBatchRef → batch)
 ├─ lot AB  (hardIds: kenya-outturn/AB, …)
 └─ lot PB  (hardIds: kenya-outturn/PB, …)
```

- The batch holds the bare outturn; each child carries `outturn/grade` (§1's keying).
  A bare-outturn record binds to the **batch** and can later be split to a graded
  child when the grade surfaces. `lotByHardId` skips `role:'batch'` parents for a
  *graded* token (a graded record binds to its sibling, not the parent) and matches
  the parent only for a bare-outturn token.
- Building the batch is §5 (next session); §1 ships the graded-token keying
  (`OUTTURN/GRADE`) so the batch can be introduced later **without re-keying** any
  token already entered.

---

## §6 — Grain & confidence in the UI *(designed; built next)*

Identity does not always reach the green lot, and the record is honest only when it
says so (`LOT_IDENTITY.md`). The grain and the confidence are one tap from any lot.

- **Grain is first-class and terminal where it lands.** `grain ∈ green-lot ·
  station-season · region-grade` reads on the lot page beside the name. A
  `station-season` node is a **legitimate terminal record** — often *the* node a
  keeper browses — drawn as a full node, never a half-filled lot or a blank coerced
  into false precision. `region-grade` (the ECX floor) is an honest state, labelled
  as such.
- **Confidence names its rung and its evidence.** The lot's identity confidence is
  the strongest standing bind: *documented* (a hard-ID — names the scheme:
  "Kenya outturn 17KF0001"), *confirmed* (a keeper adjudicated it), *derived* (the
  fingerprint proposed it). One tap opens the evidence — the token, or the matched
  fields — exactly as the reach badge explains itself today. **A confidence never
  shows without its reasons.**
- **Marks stay monochrome** — never the ember, never a fill; identity is a lens,
  never a sort that outranks taste (the standing invariant, carried from the reach).

---

## §7 — Coexistence & reversibility *(the law under all of it)*

- **`lotKeyOf` stays the offline floor.** The shipped timid fingerprint key
  (`fp:…` on ≥2 shared tokens, else `lot:<id>` fork) is not replaced — it is the
  **deterministic collapse the resolver falls through to** when no stronger rung
  fires (`lotBindKey` = hard-ID ahead of `lotKeyOf`). Every device, online or off,
  keys the same way it does today; the resolver only ever *redirects* the collapse to
  a stronger match. A device that never runs the scorer still lands every record on a
  lot.
- **Every bind is append-only and correctable.** Hard-ID tokens are struck, never
  erased; fingerprint binds are sightings a later line supersedes; merges split back;
  rejects fork. There is no destructive resolution step — the one irreversible act in
  the whole spine remains `catRetire` (the flat text retiring onto a stood node), and
  identity never rides on it.
- **Reversible and offline-first, end to end.** Every rung runs against local
  entries; the network only adds. The migration seeds timid, curation merges up, and
  no auto-merge ever runs downward. The atlas is granular-then-merged, never
  merged-then-regretted.

---

## The open questions, gathered

1. **The binding sighting's home** — column-and-ref for the fuzzy rungs (lighter,
   assumed), or every bind a `compile`-folded sighting (heavier, one identity fold)?
   *(fixes the §3+ write-path)*
2. **Resolver-at-save vs a review queue** — does the fingerprint scorer propose
   **inline at save** (interrupt the keeper with one question) or drop candidates
   into a **review queue** the keeper works later? The doc assumes inline-at-save for
   a *strong* propose and queue-none for auto-bind/fork; a review queue may suit
   ingestion. *(§4)*
3. **The confirm/fork threshold posture** — hold `τ_auto ≈ 0.90` / `τ_prop ≈ 0.55`,
   or open/narrow either? *(§3)*
4. **How aggressive normalisation dares to be** — closed alias table vs fuzzy
   distance; tier tag-only vs rewrite? *(§2)*
5. **Whether an unknown-variety fingerprint proposes or stays forked** — propose on
   strong place+year alone, or hold as too thin to ask? *(§3)*

None of these block §1. The hard-ID rung is deterministic and ships this session; the
questions all live downstream of it.

*We do not sell coffee. We keep the record — and the record now knows a green when it
sees the same one twice, and says how sure it is.*
