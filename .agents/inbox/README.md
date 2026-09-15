# Inbox

The queue for uncommitted sparks: capture first, promise nothing; sweep `QUEUE.md` for open items; promote what deserves formal review into an Agent Note.

## Boundary

- **Outside every format gate.** The gates scan `.agents/notes/` only; the inbox is held to this README plus human and agent discipline.
- **Not a learning note.** Retrospectives and process samples belong in [`.agents/learning/`](../learning/README.md); sparks surfacing during a retrospective land here, and learning only links over.
- **Not a decision record.** An idea worth formal review is promoted to an Agent Note under `notes/proposed/`; never rename or move an inbox file into the notes tree.

One idea must not exist as an authoritative todo in both the inbox and learning at once.

## Entry language

Default to Chinese for the body; Status values, paths, commands, and terms stay English (for example Agent Note, `QUEUE.md`, `Status: open`).

## Layout

| Path | Responsibility |
|---|---|
| `README.md` | This directory's contract |
| `QUEUE.md` | The checkbox board (what a queue sweep reads) |
| `yyyy-mm-dd-slug.md` | One spark; the filename date is the capture date |

## Entry shape

```markdown
# Inbox: <short title>

Status: open

## Spark
<a few sentences: the idea and why it is captured now>

## Notes
(optional) context, links, rough cost; never a Proposal skeleton
```

`Status` values:

- `open` — still queued
- `promoted` — left the queue by promotion; the body links the owning Agent Note
- `discarded` — left the queue by dismissal; a one-line reason next to the status or in `## Notes`

No gate checks the shape; this README and discipline do.

## QUEUE.md

- `[ ]` marks `open`.
- `[x]` marks a departed entry (`promoted` or `discarded`); a promoted row links the Agent Note; a discarded row may carry a short reason.
- Order: newest capture first.

Every capture, promotion, or dismissal updates the entry file and its `QUEUE.md` row in the same change. On disagreement the entry's `Status` wins; fix the row.

## Capture

1. Create `yyyy-mm-dd-slug.md` with `Status: open` and a few sentences under `## Spark`.
2. Prepend `- [ ] [title](./yyyy-mm-dd-slug.md)` to `QUEUE.md` (newest first).

Or use the installed skills (kit-authored skills live flat under `.agents/skills/`):

| Skill | Purpose |
|---|---|
| [kit-inbox-capture](../skills/kit-inbox-capture/SKILL.md) | Given just the body (optional title / slug / notes): writes the spark and updates `QUEUE.md` |
| [kit-inbox-promote](../skills/kit-inbox-promote/SKILL.md) | Explicitly promotes one `open` spark to a `proposed/` Agent Note and updates status and queue |

Capture never promotes; promotion requires an explicit promote request in the turn.

## Sweep the queue

Open `QUEUE.md` and read only the `[ ]` rows; open an entry file when more context helps. No mandated review cadence.

## Promote

1. Confirm the spark deserves a full, seriously reviewed Agent Note.
2. Create the formal note under `.agents/notes/proposed/<class>/yyyy-mm-dd-….md` — never by renaming or moving the inbox file.
3. Cross-link: the proposed note links the spark; the spark becomes `Status: promoted` and links the note.
4. Flip the `QUEUE.md` row to `[x]` with the Agent Note link.
5. Prefer one change for all of it; if split across commits, the bidirectional links must be complete by the end.

An agent may draft entries and update `QUEUE.md`; an agent must not promote unless the human explicitly asks in the current turn.

## Discard

1. Set the entry to `Status: discarded` with a short reason.
2. Flip the row to `[x]` (a short reason is optional).
3. Keep the file by default; delete it only when it has no reference value, and remove its row.
