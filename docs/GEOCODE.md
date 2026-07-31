# GEOCODE.md — the place resolver

*Shipped 6.17.0. The spec for how a place enters CARTA's record, and how two entries
naming one place become one page.*

Read with `RESOLVER.md` (the green's identity ladder — this document is deliberately
outside it), `MAPPING.md` (where a place is drawn), `LOT_IDENTITY.md` (what identity is)
and `CORRECTIONS.md` (how a record is unmade).

---

## 1 · The problem, stated honestly

A café has an address. A green has an argument.

Coffee's administrative geography is deeper than any three boxes, and it is deep in
different ways in every origin:

| | admin-1 | admin-2 | admin-3 | admin-4 |
|---|---|---|---|---|
| Colombia | Departamento — *Huila* | Municipio — *Pitalito* | Vereda — *Bruselas* | |
| Ethiopia | Region — *Oromia* | Zone — *Guji* | Woreda — *Hambela* | Kebele — *Worka* |
| Kenya | County — *Nyeri* | Sub-county | Ward | Factory |
| Brazil | Estado — *Minas Gerais* | Região — *Sul de Minas* | Município — *Carmo de Minas* | |
| Guatemala | Departamento — *Huehuetenango* | Municipio — *La Libertad* | Aldea | |

Three things follow, and all three were hurting the record:

1. **The word the trade uses is not at a fixed level.** Yirgacheffe is a woreda. Huila
   is a department. Sul de Minas is a sub-state region with no administrative existence
   at all. Asking a keeper "is this a region or a locality?" is asking them to answer a
   question about foreign administrative law, and they will guess — differently each
   time, which is the worst outcome available.
2. **A bag prints a run, not a field.** "Pitalito, Huila, Colombia" is three facts on one
   line. Typed into one box it became one region *named all of that*, which then drew its
   own page next to the page for Huila.
3. **The same place arrives spelled many ways.** Case off a bag's header, accents
   dropped by a keyboard, a transliteration, a parent restated. Every variant drew a
   page, and the atlas looked as though it held four places where it held one.

## 2 · The shape of the answer

Two halves. **The offline half is the one that matters**, because it runs on every
record, on every device, with no network and no permission.

```
placeSegs(text)     a run, split — finest first, the postal order every bag prints in
placeLead(text)     the place itself, out of the run it was printed in
placeFold(word)     the token two entries are COMPARED on — read-side, writes nothing
placeEq(a,b)        two entries, one place?
foldPlaces(list)    a list of place words, folded, printed in the form most carried
placeSplit(origin)  the entry-side act: the run, redistributed across its own columns
```

`placeFold` is `normPlace` plus two things `normPlace` cannot know: the run, and what
a keeper has confirmed. It resolves in that order —

1. **the lead segment** — `"Huila, Colombia"` and `"Huila"` are one place;
2. **`normPlace`** — case, accents, punctuation, and the curated alias table
   (`PLACE_ALIASES`: Yirgacheffe/Yirgachefe, Sidama/Sidamo);
3. **the learned index** — any spelling that has ever been confirmed against the same
   OSM place, on any green the device can read.

For (3), `placeIndex` reads back three words per confirmed green: the map's own name, the
word the map states at the level the pick landed on, and — the one that earns the index —
**that green's own column**, which is how this record spells that place. The last is what
folds a transliteration or a local spelling no alias table could carry.

It cannot fold two *different* places together, and not by luck: `placeHeld` refuses to
save a chain at all unless the columns still agree with the pick. A keeper who types Guji,
thinks again and picks Gedeo has a record whose column and whose pick disagree, so it keeps
no chain and nothing reaches the index. What does reach it was confirmed twice — once by
the tap, once by the columns still saying it at save. And where it folds, the page says so.
The standard is not that a fold is never wrong; it is that a fold is never wrong **silently**,
and never without appeal.

It folds nothing further. `genFold`'s doubled-letter collapse is a *scorer's* licence and
is not borrowed here, exactly as `keyFold` refuses it one kind up: a page merged on a
resemblance has no appeal.

**The fold shows its work.** A keeper who spelled one region four ways used to see four
pages and could at least count them. Now they see one — which is right, and would leave
them no way to know the other three existed. So a derived scope's page states which
spellings it gathered and what folded them (`scopeSpellingsHTML`). Nothing was rewritten;
every green still carries the words its own record was given.

### `placeSplit` — the only thing that writes

It runs where a record is **read off a form**, before the record exists — `readOriginFields`
and `doorFields`. Never over a green already standing: rewriting the words somebody wrote
down is not a fold, it is an amend, and an amend is deliberate and signed.

Three refusals:

- **A word is never dropped.** A segment it cannot place stays exactly where it was typed.
- **A filled column is never overwritten.** Blanks only, the sparse law everywhere.
- **It never invents.** A segment becomes the country only if it *names* one, matched
  against the vocabularies the build already carries (`DOOR_COUNTRIES`, `LANDS`) — never
  guessed from position.

A run reads finest first, so a segment after the lead is that lead's parent and wants the
coarser column. The country box is the one exception and it is a named one: a keeper
pastes the whole line there, so the country is the run's *last* word — reordered only
when a later segment actually names a country.

**The run also reads downward, from the region.** Two words left standing in Region after
the parents have gone up are finest-first like every other run, so the lead belongs one
rung *below* the box it was typed into — which is how `Pitalito, Huila, Colombia` becomes
three columns rather than a country and a two-word region. Two guards keep it from being a
guess, and they are what tell a ladder from a name that merely contains a comma:

- the column below must be **blank** — nothing is ever overwritten; and
- the run must have **proved itself a ladder** by placing at least one of its own segments
  somewhere else. `Southern Nations, Nationalities and Peoples` places nothing, so nothing
  moves and the words stay exactly where somebody wrote them.

The country box has nothing coarser above it and only one column below, so a whole origin
line pasted there hands its **remainder to the region column whole** — where the pass above
reads it as the run it is. Before, the segments after the country fought over the single
region slot and `Colombia, Huila` stood as a country.

| typed | becomes |
|---|---|
| Region: `Huila, Colombia` | Region `Huila` · Country `Colombia` |
| Country `Colombia`, Region `Huila, Colombia` | Region `Huila` — the restatement dropped |
| Country: `Colombia, Huila` | Country `Colombia` · Region `Huila` |
| Region: `Pitalito, Huila, Colombia` | Country `Colombia` · Region `Huila` · Locality `Pitalito` |
| Country: `Pitalito, Huila, Colombia` | the same three columns — the remainder goes down |
| Locality: `Gedeb, Gedeo, Ethiopia` | the whole ladder, three columns |
| Region: `Pitalito, Huila, Colombia`, Locality `Bruselas` | Country `Colombia` · Region `Pitalito, Huila` — the seam stays visible rather than overwriting a filled column |
| Country `Brazil`, Region `Huila, Colombia` | *unchanged* — a different country is a seam, not noise |
| Region: `Gedeb, Yirgacheffe` | *unchanged* — neither word names a country |
| Region: `Southern Nations, Nationalities and Peoples` | *unchanged* — nothing placed, so nothing proved |

## 3 · The map rail

Type into Country, Region or Locality and the rail offers real administrative places,
each showing the whole ladder it sits in. **One tap fills every column from that ladder**
— which is the entire fix for "the right name in the right field": the assignment comes
from a map somebody has already drawn, not from the keeper's guess.

Two services. Both keyless, accountless, bundling nothing — the app's standing law for a
network read.

- **Photon** (`photon.komoot.io`, OSM data) answers each keystroke. Nominatim's own usage
  policy forbids autocomplete traffic; Photon is built for it. `layer` keeps the answers
  administrative — a street or a house number is not a place a coffee grows in and is
  never offered.
- **Nominatim** stays what it has always been, the confirm and the pin, and is also the
  **fallback** when Photon is silent (`placeOfNom`). A silent Photon costs the rail
  nothing but a slower first result.

Debounced at 450 ms, three characters minimum, one timer **per field**. The query is
narrowed by what the keeper has already chosen on the same screen — "Gedeb" in an
Ethiopian record is not answered with a Gedeb in another hemisphere — but the *answers*
are never filtered, so the rail can still offer a place the record has never been to.

`placeOf`/`placeOfNom` map a feature to CARTA's three columns under one refusal:
**a place is never its own parent.** Photon files a municipality under `county` as well
as naming it, so the region column takes the coarsest ancestor that is *not* this place —
otherwise Pitalito files itself as the region of Pitalito and the ladder collapses.

Offline the rail is simply absent. The fields stay free text, the record saves exactly as
it did before, and a green from a country the map has never heard of is still enterable.
**It suggests; it never constrains.**

### What the tap actually does

The ladder is **one fact, not three**, so the tap lands all of it — and the column the
keeper **typed in** is the one being answered. It held the question, never the answer, so
it is written through even when it is full. That is what moves `Gedeb` out of Region,
where a keeper who does not know Ethiopian administrative geography quite reasonably put
it, and into Locality where the map says it belongs.

Leaving the typed column alone was the bug that hollowed the whole feature out: the word
stayed in the wrong box, the pick's own word was copied in beside it, the columns then
disagreed with the ladder, and `placeHeld` threw the confirmation away at save. One tap,
and nothing to show for it.

What the ladder does not name is left exactly as typed. The source column is the one
exception, and emptying it is the move rather than a loss — its word has gone up or down
the ladder. Where the map's words replace something the keeper typed, the note **says
which**: nothing is replaced in silence.

### The rail asks about one field at a time

`repaintSug(active)` takes the id of the input being typed in, and the map rail answers
for that field and no other. Without it every repaint — and a sheet repaints on open, on
a green pick, on a prefilled amend — fired three lookups and dropped three lists under
three columns nobody had touched: the form jumped while it was being read, and the
network was asked a question nobody had. The on-file rail is local and free, so it still
repaints everywhere.

One list is open at a time; the columns beside the active one put theirs away. The rail
says **it is looking** while it looks (450 ms plus a network crossing is long enough that
a blank box reads as a broken feature), and says so plainly when the map has never heard
of the place — the column is free text and what was typed stands.

### The placement is a sentence, not a badge

`placeNote(prefix)` renders under all three columns, at full width, because a placement is
a statement about the **record** and not about whichever column happened to be tapped. It
states the ladder in full, names anything the map's words replaced, offers *set it aside*,
and — this is the part that used to be invisible — says out loud when the keeper has since
edited away from it and `placeHeld` will no longer carry the chain. Nothing here is an
error: the record saves either way. It simply stops claiming a confirmation it no longer
has, where the keeper can see it stop.

Before, the note lived inside the tapped field's own `mapbox`, where the next keystroke in
that column painted straight over it — so a keeper could confirm a place, edit a word, and
have both the confirmation and any sign of it disappear without a sentence.

### It stays inside its column

The rail lives in a grid cell, and a grid track sizes to its content's *min-content* width
unless told otherwise. An un-wrappable ladder — `Gedeb · Gedeo Zone · Southern Nations,
Nationalities and Peoples Region · Ethiopia` — pushed its own column wider than the sheet
and shoved the column beside it off the screen. `.grid2`/`.grid3` are `minmax(0,1fr)`, a
form field is `min-width:0`, and every rail clamps its own text, so a long answer clips
inside the column it belongs to rather than rearranging the form around itself.

## 4 · The chain, on the green

A confirmed pick lands on the green as `lot.place`:

```js
{ ref:'osm:R1234567', level:'locality', name:'Pitalito', typed:'pitalito huila',
  country:'Colombia', state:'Huila', region:'Huila', locality:'Pitalito', district:'',
  chain:['Pitalito','Huila','Colombia'], lat:1.85, lon:-76.05,
  src:'photon', by:'…', at:'2026-07-30T…' }
```

`lotSetPlace` is `lotSetAltitude`'s construction exactly, and for the same reason: the
first confirmation stands, a later one that **disagrees is carried** (`placeAlt[]`) rather
than resolved, both signed and dated, unioned across devices by `mergeById` in
`mergeCatalog`. It reads the *layered* green and writes the *own* node (READER.md §8).

Stamped by `doorStampPlace`, beside `doorStampActors` and `doorStampAltitude`, on every
surface a record can enter by — the bag form, the café cup, the door's four binds, the
curator's authored roast, and the amend. A chain confirmed on a café cup teaches the
atlas exactly what one confirmed on a bag does.

It earns its place three ways:

- **the fold learns from it** — `placeIndex` reads the confirmed chains the greens already
  carry, so the atlas knows only the places its own records have been to. No gazetteer is
  downloaded and none is bundled.
- **the pin comes free** — `atlasGeoFill` prefers the confirmed point over re-typing the
  string into a second lookup, gated by `RUNG` so it can never land finer than the grain
  (MAPPING M1).
- **the page can state the ladder** — the *Placed* row on a green, below the origin facts
  because it is not one of them.

## 5 · What this is NOT

The whole discipline of this feature is in what it refuses.

- **A confirmed place is not identity.** `lot.place` is outside `lotKeyOf`, outside the
  fingerprint, outside `scoreLot`. Two greens confirmed to one town are not thereby one
  green — that question belongs to `RESOLVER.md` and nothing here touches it.
- **A confirmed place is not a finer grain.** Confirming a spelling is evidence about a
  *word*, not about the coffee. A green whose town was confirmed on a map has proved
  nothing more than one whose keeper simply typed it. *The grain is never rounded up*
  holds here exactly as it holds everywhere.
- **No fourth column, and no seventh rung.** The map's finer and coarser levels
  (`state`, `district`) are **carried** in the chain, read and displayed, never promoted
  to a box a keeper must fill or a page they can walk to. Adding a rung means the key, the
  fingerprint, `GRAIN_READ`, `DOOR_GRAIN` and the primer all move together; carrying a
  reading costs none of that and answers the same question.
- **No stored place node, ever.** A region, a town, a country stay derived scopes —
  readings over the greens that name them. The learned index is derived at read from the
  greens themselves and busts with them (`catBust`); it is not a document, it does not
  sync on its own, and it has no page. *A derived scope has nothing to amend, and says so.*
- **No polygon below the country.** Unchanged from `MAPPING.md`: a region name matched to
  a shape is a guess. The chain names a region; it never draws one.
- **The rail is never required.** Every surface must keep working with zero network — the
  columns are free text, `placeSplit` is offline, and the fold's first two rungs need
  nothing but the device.

## 6 · The tidy sweep — the resolver, pointed backwards

`placeSplit` runs at **entry** and nowhere else. That is the right law and it leaves an
obvious hole: every green entered before the resolver landed still carries whatever its
keeper typed at the time. A run of three facts sits in one box, a column the green's own
confirmed ladder could fill sits blank, one region is written four ways. None of that is
*wrong* — it is what somebody wrote down — but it is the difference between a record and a
clean one, and until the sweep the only way to mend it was to remember which greens needed
it and walk to each page by hand.

So the sweep **flags**. It is a reading over the standing greens, `tidyScan()`, derived at
open and **stored nowhere**: a fresh device derives the same list, and a list that has been
worked comes back empty. It is `reviewQueue`'s construction one kind up.

Three suggestions, each backed by evidence the record already holds:

| kind | what it found | the evidence |
|---|---|---|
| `run` | a run of place words still standing in one column | a comma — presentation, exactly as case and accents are |
| `chain` | a blank column the green's **own confirmed** `lot.place` already names | a ladder somebody tapped on a map for this green |
| `spell` | a column spelled apart from the form the atlas prints most | the greens themselves, folded (`tidyForms`) |

The `spell` case is the only cosmetic one and it says so: those entries already *read* as
one place, because the fold sees to that and rewrites nothing. It is ranked last.

Counted apart from the three, because it is an offer and not a fault: the greens **nobody
has placed on a map yet**. A green stating no place at all is in neither list — there is
nothing there to tidy and nothing to look up.

Four rules the sweep keeps:

- **It never applies anything on its own.** Every suggestion shows the columns *before and
  after* and waits for a tap. A correction the keeper cannot check before tapping is
  exactly the record tidying itself behind their back that the fold refuses one layer down.
- **A tidy is an amend.** Every apply lands through `lotAmendOrigin` — the whole of the
  amend's own lots branch, lifted out so the two can never drift into two different writes.
  Signed, dated, its own sighting, re-keyed off the corrected words, and stopping to offer
  the **join** when the corrected key is already another green's.
- **Pen-gated**, like every other write to the shared record.
- **One batch, and only the run split.** A comma is not a guess, so that correction reads
  the same on every green; anything that would land on a green already standing is set
  aside and **counted out loud** rather than dragging a join sheet up over the run.

Three surfaces, because a suggestion is worth most where the keeper already is: the desk
(*Add to the atlas → Tidy the place columns*), the green's own corrections fold, and a
derived scope's fold — a region or a town naming which of its greens carry one.

`tidyForms`/`tidyScan` memoise on `catBust`, alongside `placeIndex`: the desk and every
green's page ask on each paint.

## 7 · What is deliberately left

- **`placeAlt` has no comparator.** Two confirmations that disagree are both shown; which
  one *stands* is `compile()`'s rung comparator, the same pass altitude waits on.
- **Reverse geocoding.** A pin does not currently teach the columns. It could, and the
  same `placeOf` shape would carry it.
