---
name: kit-inbox-promote
description: >-
  Promotes an open `.agents/inbox/` spark into a formal `proposed/` Agent Note
  with bidirectional links and a QUEUE.md checkbox update. Use only when the
  user explicitly asks to 升格 / promote an inbox item, or says
  kit-inbox-promote. Part of the kit-* skill family under `.agents/skills/`.
  Do not use for capture-only requests.
---

# Inbox Promote

Promote one open spark to `proposed/`. Contract authority: the [inbox README](../../inbox/README.md) and the [Agent Notes README](../../notes/README.md). Sibling: [kit-inbox-capture](../kit-inbox-capture/SKILL.md). This skill is guidance, not a second contract.

## Inputs

| Input | Required | Notes |
|---|---|---|
| **Target** | yes | A spark path, a QUEUE title, or a keyword uniquely matching one `open` spark |
| **class** | no | One of `feature` / `bug-fix` / `simplification` / `architecture` / `process` / `testing`; ask once when missing or ambiguous |
| **Extra facts** | no | Additional facts for the Agent Note; never invent beyond spark plus extras |

If the target is missing or matches zero / multiple `open` sparks, ask once and stop. Never promote without an explicit promote / 升格 request in the current turn.

## Steps

1. Resolve the spark file. Require `Status: open`; if `promoted` or `discarded`, stop and report.
2. Choose the `class` (from input or one clarifying question).
3. Create `.agents/notes/proposed/<class>/yyyy-mm-dd-<slug>.md` using today's date and a slug from the spark title. Never move or rename the inbox file into notes. If the path exists, adjust the slug — never overwrite.
4. Write a full **proposed** Agent Note, required sections only:

```markdown
# Agent Note: <title>

Status: proposed

## Problem
## Proposal
## Alternatives considered
## Acceptance criteria
## Risks
```

In `## Proposal` (or a nearby line), link back to the spark with a relative path. Base the content on the spark (plus extras); expand it into a real proposal without inventing unstated product scope. `## Alternatives considered` needs at least one genuine alternative — from the user, implied by the spark, or an honest "defer / do nothing" with why it loses for now. The note follows the language policy for `.agents/notes/`: English primary with a `.zh.md` counterpart.

5. Update the spark: `Status: promoted` and a clear link to the new Agent Note (both language files when a counterpart exists).
6. Update the matching `QUEUE.md` row to `[x]` and append `→ [Agent Note](<relative path>)`.
7. Satisfy the notes README skeleton; the note-format gate rejects drifted sections once introduced.
8. Report the spark path, the Agent Note path, and the QUEUE line. Do **not** commit unless the user asks. Do **not** implement the proposal.

## Hard stops

- No explicit 升格 / promote in this turn → do not write a proposed note.
- Do not delete or rename the spark file; the inbox entry stays as the promotion record.
