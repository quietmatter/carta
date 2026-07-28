# Corrections — how a record is amended, and how it is set down

CARTA has always known how to *add*. One door on the masthead, a paste, a bind.
It did not know how to *unmake*. A cup could be removed — through a browser
`confirm()` that promised, wrongly, that it "cannot be undone." A bag could only
be put away. A Setup, once named, was permanent. A brew whose impression was
skipped could not be reached at all. A café entered by a typo stayed on the
Register forever.

This document states the grammar that fixes it. It is not a new idea: the app
already had the right one and applied it only to the *shared* record. The
sighting is struck, never deleted. The caliber record is withdrawn, never erased.
The door's facts are strikeable chips. **This extends that law to the keeper's
own ledger**, where the fat-fingering actually happens.

---

## The law

> **Nothing is erased by an ordinary act.**
> A record you set down leaves every reading — every count, every average, every
> map, every export — and waits, whole, in one room. It is signed, it is dated,
> and it comes back with one tap.

Erasure exists. It is one door, in one room, on records you have already set
down, and it is the only place in the app where the word *permanently* is
honest.

## The three verbs

Every record answers to exactly three verbs beyond its making. Two of them
already existed; the third is what was missing.

| Verb | What it means | Reversible |
|---|---|---|
| **Amend** | Revise it. Reopens the form it was written in. | — |
| **Put away** / **Retire** | It leaves the working surfaces; the record stays whole and readable. A finished bag. A grinder you sold. | yes, instantly |
| **Withdraw** | Strike it from the record. It leaves every reading. | yes, from the desk |

And, once, deliberately, in one room only:

| **Erase** | The struck record is destroyed and tombstoned. | **no** |

The distinction between *put away* and *withdraw* is not a nicety. A bag you
finished is a true fact — the brews you pulled from it are true, the cups are
true, the record should keep all of it and simply stop offering it on the shelf.
A bag you typed by mistake was never a fact at all. One is bookkeeping; the
other is a correction. Collapsing them into a single "delete" would have made
the app lie in one direction or the other.

## The strike is itself a record

A withdrawal is not a flag on a record. It is a record of its own, in the same
shape as every other attestation in this codebase:

```js
{ id:'strike:<recId>', ref, coll, at, by, rec, via, restoredAt }
```

- `rec` carries the withdrawn record **whole**, so it can be restored from any
  device that has ever seen the strike.
- `at` / `by` sign and date it, exactly as a sighting is signed and dated.
- `restoredAt` records the un-striking. **The entry is never removed on
  restore** — it stands, superseded, the way a superseded sighting does.
- `via` names the record whose withdrawal carried this one (see *the cascade*).

The record itself is spliced out of its live collection and lives on the strike
entry until it is restored. This is deliberate: it means **no read path in the
app has to remember to filter struck records.** A struck bag is not in `D.bags`,
so it cannot leak into the atlas, a count, a plate, a map, or an export by
somebody forgetting a `.filter()`. The ~160 places that read the ledger directly
were not touched, and cannot regress.

### Why the entry survives a restore

Sync merges by union of ids. **Only additions propagate.** If a restore removed
the strike entry, the removal would not travel — the other device would still
carry the strike, and the next merge would set the record down again. So both
the strike and the restore are additive facts on one entry, and liveness is
derived:

```
struck  ⟺  at > (restoredAt || '')
```

Merge takes the newest `at` (with its body) and the newest `restoredAt`
independently. The comparison is monotone and order-free, so two devices
converge on the same answer regardless of what order they see things in — the
same construction `mergeSightings` uses, for the same reason.

### The cascade

Some records have no meaning without their parent. A brew belongs to a bag; a
cup is a reading *of* a brew. So a withdrawal carries its dependents:

- **a coffee** → its brews → their cups
- **a brew** → its cup
- **a café cup** → its Pour (the availability edge; it must never outlive the
  cup that attested it)

Each carried record gets its own strike entry stamped with `via`, so a restore
brings back exactly the set that went, and no more. **The sheet names every
record that will go before you tap.** A cascade the keeper cannot see in advance
would be a trap; a cascade stated in full is just an honest sentence.

**A Setup does not cascade.** A Setup is a tool, not an event. You do not
un-brew the coffee you made on a grinder you sold — those brews are still true.
So a Setup with brews reading through it is **retired**, not withdrawn: it
leaves the picker, its brews stay whole and readable. A Setup nothing reads
through can be withdrawn like anything else. The sheet says which case you are
in and why, and never presents a door that leads nowhere.

## The surfaces

### The correction sheet — one door, every record

`openCorrect(coll, id)`. One sheet, the same shape for a cup, a brew, a coffee,
a Setup, a café. It states, in order:

1. what the record is (named, with its facts in a card),
2. **what follows** — every record the withdrawal will carry, by name,
3. two doors: *Amend* (reopens the record's own form) and *Withdraw*,
4. the note: where it goes, and that nothing is erased.

No browser dialog. `confirm()` is gone from the correction path entirely — it
broke the paper, spoke in the operating system's voice instead of the keeper's,
and, in the one place it was used, told a lie.

### The room — *What you have set down*

A row on the Desk that appears only when something is struck. Everything
withdrawn, newest first, each with its date, who signed it, and what came with
it. Two actions: **Put it back**, and — once, at the bottom, behind its own
statement — **Erase them for good.**

That is the whole of it: **removal is two-stage.** The first stage is instant,
quiet, reversible, and in reach of the record itself. The second is deliberate,
gathered, rare, and in one room. Which is why no step of it needs to ask *are
you sure?* — the first stage does not warrant the question, and the second stage
*is* the answer to it.

### Reach — the records that had no door

- **A brew** is reachable at last. A coffee's page lists its brews, each opening
  to be amended or set down. Previously a brew whose impression was skipped was
  unreachable by any path in the app.
- **A coffee** can be corrected, not only put away — and *put away* stopped
  wearing the red button, which had it reading as destruction when it is the
  gentlest act in the app.
- **A Setup** can be retired, restored and (when nothing reads through it)
  withdrawn.
- **A café** on the Register can be withdrawn by the hand that holds the pen —
  the phantom entry a typo'd shop name minted is no longer permanent. It is
  struck on the shared document exactly as a sighting is: signed, dated, and
  reversible, so it converges across every keeper.
- **An authored roast** — the curator's direct entry to the atlas — can be set
  down from the desk where it was authored.

### Red is spent once

`--danger` now appears on exactly one control in the app: **erase**. Not on
*put the bag away*, not on *withdraw*, not on any reversible act. VOICE.md asks
that guard rails stay in ink, never in red; a colour that means *irreversible*
is worth exactly as much as the number of places it is not used.

---

## What this deliberately does not touch

**The catalog spine** — lots, roasters, roasts, producers. A green is not
withdrawn; its *identity* is corrected, and the app already has the right and
much stronger grammar for that: merge, split, reverse a bind, keep apart
(`RESOLVER.md` §5). A strike on a lot would be a second, weaker answer to a
question already answered, and it would sit uncomfortably close to the resolver.
Corrections there stay where they are, in the lot page's *Corrections &
identity* fold.

**Reach sightings, caliber records, hard IDs, penFacts.** Already struck-not-
deleted, already signed, already dated. They were the model for this. They keep
their own withdraw paths.

**Deleting a keeper and their whole ledger** stays what it is — the one act
that destroys a whole record — but it stopped using a browser dialog and now
states, in a proper sheet, exactly what is about to be lost.

---

## The test

Read the three questions from `/goal` against it:

1. *Does it make some link of the road more legible, or a fact enter the record
   closer to where it was born?* — A record that cannot be corrected is a record
   that slowly stops being true. The correction is what keeps the rest honest.
2. *Does it keep every refusal intact?* — Nothing here sells, ranks, or invents.
   The strike is signed and dated like every other attestation, and the one
   irreversible act names itself as such.
3. *Would it sound right read aloud in the keeper's voice?* — "Set down, not
   erased. It waits under *what you have set down*, and comes back whole."
