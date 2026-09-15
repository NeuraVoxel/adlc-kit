---
name: kit-inbox-capture
description: >-
  Captures an uncommitted inspiration into `.agents/inbox/` (spark file plus
  QUEUE.md checkbox). Use when the user wants to record a spark or idea, says
  kit-inbox-capture / 记到 inbox / 记灵感, or gives only a spark body and asks to
  queue it without promoting to an Agent Note. Part of the kit-* skill family
  under `.agents/skills/`. For learning retrospectives use kit-learning-note.
---

# Inbox Capture

Record one spark. Contract authority: the [inbox README](../../inbox/README.md). Sibling: [kit-inbox-promote](../kit-inbox-promote/SKILL.md). This skill is guidance, not a second contract.

## Inputs

| Input | Required | Notes |
|---|---|---|
| **Body** (the spark) | yes | The idea and why it is captured now; body defaults to Chinese, terms and paths stay English |
| **Title** | no | Short title; derive from the body when missing |
| **slug** | no | `kebab-case`; derive from the title when missing |
| **Notes** | no | Optional context only — never a Proposal skeleton |

If the body is missing, ask once and stop. Do not interview for optional fields.

## Steps

1. Confirm `.agents/inbox/README.md` and `QUEUE.md` exist; if not, stop and say the inbox is not initialized.
2. Date = today (`yyyy-mm-dd`). Path: `.agents/inbox/{date}-{slug}.md`. If the path exists, adjust the slug (`-2`, `-3`, …) — never overwrite.
3. Write the spark file:

```markdown
# Inbox: <title>

Status: open

## Spark
<body, lightly edited, never expanded into a plan>

## Notes
<only when the user supplied notes; otherwise omit the whole section>
```

4. Prepend to `QUEUE.md` (newest first), directly under the `# Inbox queue` heading:

```markdown
- [ ] [<title>](./{date}-{slug}.md)
```

5. Report the created path and the QUEUE line. Do **not** commit unless the user asks.

## Hard stops

- Do not promote to `proposed/`, write Agent Notes, or put todos in `.agents/learning/`.
- Do not invent dimensions, architecture, or acceptance criteria beyond what the user wrote.
- The inbox is outside every format gate — do not run gates on it.
