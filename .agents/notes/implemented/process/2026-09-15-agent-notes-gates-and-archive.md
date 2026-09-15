# Agent Note: close the five Agent Notes gaps found against deepseek-harness

Status: implemented

## Problem

A comparison against the origin repository's Agent Notes conventions found five gaps in this kit's system: the `archived/` lifecycle was missing entirely (and the omission was implicit, not a recorded decision), the closed class set existed only as prose with no gate, the format gate was deferred, supersession/consolidation rules were a one-line summary, and lifecycle moves had no mechanical enforcement.

## Decision

All five are now in place, each as a gate with a rejection spec wired into `doc-sync`:

- `scripts/agent-note-tree.ts` encodes the closed lifecycle set (now including `archived/`) and class set, parses `{lifecycle}/{class}/yyyy-mm-dd-topic.md`, and rejects unclassifiable paths.
- `scripts/verify-agent-note-format.ts` enforces the header block, cross-checks `Status:` against the folder, requires the per-lifecycle skeleton, rejects proposal-era headings under `implemented/` and `archived/`, and mandates `## Alternatives considered` (with the exact pre-format escape comment).
- `scripts/verify-archived-agent-notes.ts` hashes every archived file against the append-only `scripts/archived-notes.manifest.json`, rejects edits to frozen content, unrecorded archives, manifest entries without files, and English notes without their Chinese counterpart.
- The notes README (both languages) now carries the full archiving calibration, supersession and consolidation rules, and the lifecycle-move procedure the gates enforce.

## Alternatives considered

- **Defer archiving until implemented notes accumulate, recording only the deferral.** Lost: an undocumented omission was already the worst state; and the machinery is small, self-contained, and testable — deferring it buys nothing while leaving the "when to archive" question to memory.
- **Port only the gates, keep the README prose short.** Lost: gates enforce what prose states; a skeleton or archive rule the README does not explain turns every red gate into an investigation.

## Consequences

The notes system is now fully machine-checked: classification, format, pairing, and archive integrity all fail loud in `doc-sync`, and `check-all` runs them. New duties follow: archiving requires re-recording the manifest in the same change, and class-set growth now means a `CLASSES` edit plus a README update. The six existing notes pass the new gates unchanged; the installer `gates` component ships all three gates and the manifest.
