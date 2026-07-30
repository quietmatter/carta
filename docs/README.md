# The design record

Everything here is reference, not runtime — the app ships as `../index.html`
alone. Cite the document, not a memory of it.

## The through-line

- **NORTH_STAR.md** — the record (the product thesis, the restraint standard)
- **VISION.md** — the atlas (the lot-keyed spine, steps 1–7)
- **ECOSYSTEM.md · CONSTITUENTS.md · COMMERCE.md · PLATFORM.md · SEQUENCE.md**
  — the road itself: every hand on one shared spine, and the order it ships in

## The specs

- **RESOLVER.md** — how a record binds to its lot (the ladder, merge/split)
- **SCHEMA.md** — the catalog envelope and the shared documents
- **CHARTS.md** — the atlas at more than one altitude: scenes, charts, the two
  frames, the lenses and facets
- **MAPPING.md** — the map, unified: the marks of a scope are `scopeGreens`
  pointed at coordinates, the walk is the zoom, and the published atlas is the
  same map with the overlay off. Reads on top of `CHARTS.md` and `READER.md`
- **SURFACES.md** — the surfaces and the graph under them: one door in, one
  reading out, and what to cut so the graph can fill
- **READER.md** — the person who keeps nothing: what the founder publishes, what
  a reader sees, and every write that is absent rather than locked
- **GEOCODE.md** — the place resolver: how a place enters the record (the map
  rail, the comma-run split) and how two entries naming one place become one
  page. Deliberately outside `RESOLVER.md` — a place is not an identity
- **LOT_IDENTITY.md** — what a lot is, and what it honestly is not
- **CORRECTIONS.md** — how a record is amended and how it is set down: the
  strike, the cascade, the one irreversible door
- **MODEL_QA.md** — the model checked against the trade, kept for the record
- **MODEL_REVIEW.md** — the model checked against the build: where the two drifted,
  which side was wrong, and what is left

## The standards

- **VOICE.md** — the voice of the keeper of records; every string screens
  against its gate
- **SUBBRAND.md** — the Carta ↔ Quiet Matter design-system charter
- **SKILL.md** — the /goal skill's source

## The redesign

- **DESIGN_BRIEF.md** — the commission for the redesign
- **redesign-concept/** — the Claude Design prototype (`CARTA Redesign.dc.html`),
  its handoff, its voice pass, and the local design-system copies. **The
  prototype is the reference file for the app's surfaces.**
  - **redesign-concept/READER.html** — the reader's flow drawn: every surface in
    `READER.md`, plus the founder's side of the same act, in the app's own token
    and component layer. Reference file for `READER.md`.
  - **redesign-concept/UNIFIED.html** — one page grammar built: every node kind
    drawn by one renderer answering the same five questions, with the unified
    map inside it and a keeper/reader switch on the Desk. Reference file for
    `UNIFIED-HANDOFF.md` and `MAPPING.md`.
  `STREAMLINED.html` is `SURFACES.md` built — the door, the road, the plate,
  in both themes, with a live parser and the data model on a toggle.
- **design-system/** — the Carta design system: tokens, components, foundations
