# Agent Note: commits and pushes require explicit user approval

Status: implemented

## Problem

The development loop had no written rule for when commits happen, so an agent finishing a change could go straight to `git commit` — the reviewable unit then exists only after the fact, and acceptance collapses into reading an already-made commit instead of approving the change.

## Decision

A standing order in root `AGENTS.md`: finishing a change ends with the narrowest relevant evidence and a report; `git commit` and `git push` run only on the user's explicit request in the current turn. This governs every commit including documentation and chore edits; the release cut ([docs/release.md](../../../../docs/release.md)) is the same discipline at the next level — its own explicit request. The rule ships to adopters through the installer's `rules` component, since it lives in `AGENTS.md`.

## Alternatives considered

- **Keep relying on per-request behavior without a written rule.** Lost: the convention only held while the maintainer asked for each commit explicitly; the first automated or forgetful session would break it, and nothing in the docs told an agent the boundary existed.
- **Restrict only `git push`, leave commits free.** Lost: the reviewable unit is the change, not the publication; an unrequested local commit already shapes history, message granularity, and what acceptance means.

## Consequences

Work accumulates in the worktree until the maintainer accepts, so reports must state what changed and which evidence ran — uncommitted changes are the normal end state of a development turn, not a failure. Pre-commit hooks still run when the human commits, so the gate layer is unaffected. The release contract's "cut only on explicit request" is now a special case of a general rule instead of a standalone exception.
