# CARTA 7 — the roadmap

*The fourth turn's build order. `PIVOT.md` is the thesis; this is the route.
It is a hobby's roadmap, so it carries no dates — phases are ordered by
joy-per-effort, every phase ends with something shippable and fun, and the
only deadline is that the founder still wants to open the app. The outfitter
(`.claude/skills/outfitter/`) holds this document in every session and keeps
the logbook (`LOGBOOK.md`) of where the trip actually is.*

## How this roadmap works (a hobby's operating principles)

- **Every phase ends shippable.** No phase leaves the app broken or the
  branch unmergeable. If a phase stalls, what shipped before it still stands.
- **Joy-per-effort ordering.** The next phase is the biggest delight for the
  least machinery — which is why the brief ships before the atlas.
- **The parked list, not scope creep.** A good idea mid-phase goes to the
  logbook's parked list, never into the current phase. Parked is a
  compliment; it means the idea deserved better than being rushed.
- **No phase may add a proof.** The tripwire against third-turn relapse: the
  moment a feature needs a resolver, a merge law, a shared document, or an
  evidence gate, it is Lotmark's feature. Record it for Lotmark's desk and
  keep walking.
- **Decisions decided stay decided** until deliberately reopened. The seven
  below were adopted with the pivot's approval; reopening one is a logbook
  entry, not a mood.

## Decisions adopted (with the pivot's approval)

1. **Photos return** — one per cup, optional forever, presentation governed
   by restraint. The deliberate break with the old law.
2. **The 1–9 stays** — it's brand, and the scout's bar is computed from it.
   A three-state fast path (again / good / not for me) maps onto it.
3. **AI posture: brief → BYO-key → concierge**, in that order. The brief
   alone transforms the founding ritual, so it ships first and stands alone.
4. **Free text everywhere except the graph's nodes.** Roasters and places
   get the gentle one-tap join (`aka[]`, `ARCHITECTURE.md` §4); origin
   fields stay pure story.
5. **Menus are personal capture in v1.** Community menus wait for Lotmark
   to make them nearly free.
6. **Four rooms** — Journal · Scout · Atlas · Shelf — one door, ＋ a cup.
7. **Ships as Carta 7.0.** The number announces the turn.

## The phases

### Phase 0 — the record of the turn ✓

The pivot argued and approved; this suite recorded (`PIVOT.md`,
`ROADMAP.md`, `ARCHITECTURE.md`, `MARKET.md`); the outfitter installed; the
old `/goal` skill superseded, kept for the record.

### Phase 1 — the skeleton

**The joy it serves:** the cup, caught. **What ships:** a new `index.html`
built clean per `ARCHITECTURE.md` — token layer, the six objects, the
Journal stream, the door (paste or type, card out, no adjudication), the
Shelf, the dial-in loop, put-away + undo. The current app moves whole to
`classic/index.html` and keeps working untouched.

**Done when:** on a phone, offline, you can log a café cup in under twenty
seconds and a home brew through the dial-in loop, and both read back
beautifully in the Journal. **Deliberately not in it:** maps, scout, menus,
photos, cards, migration.

### Phase 2 — the brief

**The joy it serves:** the hunt — the founding ritual, armed. **What
ships:** the taste model (`tasteModel()`, pure, derived, inspectable — the
bar, the vector, the anchors, always with evidence) and the brief: a
scoped, self-contained artifact (`carta.brief/v1`) — a beautiful page, a
machine block, and a plain-text cut sized for pasting into a chat.

**Done when:** landing in a city, "Brief — this city" produces something
you actually paste into your AI chat instead of typing the paragraph from
memory — and the answer visibly improves. This is the corpus paying rent.
**Deliberately not in it:** any network call, any key, any in-app answer.

### Phase 3 — the atlas

**The joy it serves:** the map fills in. **What ships:** the passport
(world frame — `LANDS` outlines and highland contours ported from classic,
tasted countries washed, untasted ones as hairline invitations, the city
list beside it), the chapters (country/region pages as typography — regions,
farms, producers as story rows), and the city frame (street layer in the
themed ink, your bars and your roasters' bars).

**Done when:** the passport is the screen you show someone at a dinner
table. **Deliberately not in it:** evidence gates of any kind — the footer
owns it: *the map remembers what the bags said.*

### Phase 4 — the bridge

**The joy it serves:** take it home, and the menu. **What ships:**
take-it-home (café cup → shelf card, one tap; home brews attach to the same
card), menu capture (paste text → cards; assisted transcription for photos —
no OCR dependency, per `ARCHITECTURE.md` §7), and photos on cups.

**Done when:** the full signature loop closes: menu read → cup logged →
taken home → bag bought → dialled in — one coffee, one card, whole story.

### Phase 5 — the cards

**The joy it serves:** the share. **What ships:** the card renderer —
Coffee card, Place card, the Passport, the Year, the friend-brief — each a
self-contained page/image on Carta paper, embedding its own data
(`carta.card/v1`) so "add this to my Carta" is one tap on the other end.

**Done when:** you've actually sent one to a friend, unprompted, because it
looked too good not to.

### Phase 6 — the migration, and the handover

**What ships:** the classic importer (classic's JSON export →
Carta 7 ledger, mapping per `ARCHITECTURE.md` §8), `classic/` linked from
the Desk corner, GitHub Pages serving Carta 7 at the root. The founder's
own record crosses over.

**Done when:** the founder's daily driver is Carta 7 and classic is a
museum with the lights still on.

### Phase 7 — the scout, stage two

**The joy it serves:** the hunt, answered in-app. **What ships:** the ask
(city · neighborhood · country · route · friend) sent with the brief via
BYO-key; answers drawn as pins on the city frame, reasons a tap away, every
named café grounded against a real place lookup before it is drawn; been /
booked / skip feeding the loop.

**Done when:** in a new city, the in-app ask beats the paste-into-chat
ritual it grew from. **Deliberately not in it:** the concierge tier —
that waits for a reason to exist (`MARKET.md` §5).

### The horizon (unscheduled, in the order they'd earn it)

- **The Lotmark loop** — the keyless enrichment read of Lotmark's published
  atlas; corpus × atlas × freshness; the roaster graph made real.
- **Sync as backup** — the tiny server returns as a dumb one-owner backup,
  only if multi-device pain is felt in practice.
- **OCR for menus** — a BYO-key vision call through the same sanctioned
  channel as the scout's ask; one posture, two uses.
- **Community menus** — only on Lotmark's infrastructure.
- **The concierge tier** — only if strangers ask for the scout.

## The tripwires (read at every phase gate)

1. **Third-turn relapse.** Resolver, rungs, merge law, shared document,
   evidence gate → it's Lotmark's. Log it, don't build it.
2. **Tooling creep.** A bundler, a framework, a dependency → re-read
   `ARCHITECTURE.md` §1. The kit stays light.
3. **The scout before the journal.** If scout work is outpacing journal
   joy, stop — the corpus is the fuel, and an empty journal scouts nothing.
4. **Business creep.** `MARKET.md` is play. If a decision starts from
   revenue, re-rank it by joy and see if it survives.
