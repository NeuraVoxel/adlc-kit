# Learning notes

This directory holds learning notes for this repository: session retrospectives, process walkthroughs, and how-this-repo-behaves samples.

## Boundary

- **Not Agent Notes.** Nothing here enters `.agents/notes/`, uses the Agent Note header or skeleton, or counts as a decision record.
- **Not a todo entry.** Uncommitted sparks queue in [`.agents/inbox/`](../inbox/README.md); sparks surfacing during a retrospective land there, and this directory only links over.
- **Not consumer documentation.** Durable contracts for adopters live in `README.md`, `docs/`, or Agent Notes — never here.

## Entry language

Write in Chinese by default; terms, paths, and commands stay English.

## Layout

Files are named `yyyy-mm-dd-topic.md` (the date is when the note was first written).

Notes that must not leave the machine go to `.agents/learning/private/` — the sibling `.gitignore` ignores that subtree: never commit it, never expect it to ship with the kit.

When a note's durable facts have been absorbed into an Agent Note or shipped documentation, delete the note or mark it absorbed at the top, so this directory never becomes a second authority.
