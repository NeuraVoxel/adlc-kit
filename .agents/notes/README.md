# Agent Notes

English | [中文](README.zh.md)

One kind of design doc lives here. An **Agent Note** records a decision that affects this repository — the *why* and *what we gave up*, the parts code and docs cannot carry. Session recaps and study notes live in [`.agents/learning/`](../learning/README.md); uncommitted sparks queue in [`.agents/inbox/`](../inbox/README.md).

## Layout and naming

The path encodes both axes: `{lifecycle}/{class}/yyyy-mm-dd-topic.md`, and the classification gate (`scripts/agent-note-tree.ts`) rejects any note path outside the closed sets below.

- **lifecycle** (the top-level directory) is the status, and notes move between folders as it changes:
  - `proposed/` — reviewed proposals, not yet built.
  - `implemented/` — the decision shipped; the file records the decision and the rejected alternatives, and **stays current with what actually shipped**: when code later moves a file, renames a package, or changes a default, the same change updates the corresponding facts (facts only — never the decision itself).
  - `rejected/` — considered and declined; the verdict lives on the `Status:` line and the proposal stays frozen as it was.
  - `archived/` — shipped decisions whose rationale no longer guides future work; append-only frozen history, never current authority.
- **class** (the nested directory) is the kind of decision, a closed set: `feature` / `bug-fix` / `simplification` / `architecture` / `process` / `testing`. Adding a class means extending `CLASSES` in the gate script and updating this section in the same change.

The date is when the topic was **first proposed** (per git history). Notes cross-reference through relative Markdown links, never bare filenames or numbers. There is no centralized index; the active tree is the inventory.

## Archiving and deletion

Archive an implemented note when the shipped decision is complete and its rationale is unlikely to guide future work; the calibrated question is whether any alternative, ownership boundary, negative guarantee, durable-semantics rule, or reintroduction condition here still prevents a plausible mistake — never word count, age, or a quota. Never archive a proposed note: reject it instead. Keep a rejected note only while its rationale prevents a plausible mistake; otherwise delete it entirely.

Archiving moves the complete English/Chinese pair to `archived/{class}/`, keeps `Status: implemented`, inserts `Archived: YYYY-MM-DD` directly below the status line in both files, and repairs or deletes inbound links — the only content changes archiving permits. Once sealed, the pair is permanently frozen: [`verify-archived-agent-notes`](../../../scripts/verify-archived-agent-notes.ts) hashes every archived file against the append-only manifest (`scripts/archived-notes.manifest.json`), so any later edit, move, or deletion fails the gate. Re-record the manifest only in the same change that adds new archives.

## When to write one

Every **non-trivial change** adds or updates at least one Agent Note in the same PR: changes to behavior, architecture, a contract shared across files or packages, process or tooling, testing strategy, an on-disk/wire/configuration format, or any decision a maintainer may reasonably revisit. Implemented notes sync with code moves, renames, and default changes in the same change. Purely mechanical or local edits are exempt.

## Supersession and consolidation

A note is never edited into a *different* decision: supersede it with a new note and keep both cross-linked. A fully superseded note may be consolidated into the current owning note and deleted only when the owner preserves every unique rationale, alternative, consequence, and named coverage gap, repairs every inbound link, and deletes the Chinese counterpart in the same change. Partial supersession does not qualify: keep both notes cross-linked and update every fact that remains current.

## The file format

The format gate ([`verify-agent-note-format`](../../../scripts/verify-agent-note-format.ts), part of `doc-sync`) enforces everything in this section; the classification gate enforces the path.

### The header block

The first three lines are exactly:

```markdown
# Agent Note: <title>

Status: <status>
```

`Status:` is `proposed`, `implemented`, or `rejected — <one-line why>`, and must agree with the lifecycle folder — the gate cross-checks them. An archived note keeps `Status: implemented` with `Archived: YYYY-MM-DD` as its fourth line. The header tokens stay in English verbatim in both languages.

### The body skeleton

The body opens with `## Problem` (motivation only, readable without the solution). The canonical section names per lifecycle are fixed:

```markdown
proposed:     Problem / Proposal / Alternatives considered / Acceptance criteria / Risks
implemented:  Problem / Decision / Alternatives considered / Consequences
rejected:     the proposal frozen as it was, Alternatives considered included
archived:     the implemented skeleton as sealed, plus the Archived: line
```

Proposal-era headings (`## Proposal`, `## Plan`, `## Migration plan`, `## Acceptance criteria`) are rejected under `implemented/` and `archived/`: an implemented note describes what is, in the present tense.

### Alternatives considered is mandatory

Every note carries an `## Alternatives considered` section: each genuine alternative and why it lost. A decision recorded without its opponents invites re-litigation — the failure notes exist to prevent. Notes dated before the format gate whose alternatives are not reconstructible carry the exact comment `<!-- agent-note-format: alternatives-not-recorded (pre-format Agent Note) -->` in its place.

### Moving between lifecycles

Moving a file between lifecycle folders means updating the `Status:` line and re-satisfying that folder's skeleton in the same change — the gate fails the move otherwise. Concretely, `proposed/` → `implemented/` rewrites `## Proposal` into a present-tense `## Decision` and folds `## Acceptance criteria` and `## Risks` into `## Consequences`; `proposed/` → `rejected/` only adds the reason to the `Status:` line.

### Chinese counterparts

A `.zh.md` counterpart mirrors its English sibling's structure section-for-section under the doc pairing gate; the machine-checked header tokens (`# Agent Note: ` and the `Status:` line) stay in English verbatim. The format gate skips `.zh.md` files — the pairing gate checks their consistency.
