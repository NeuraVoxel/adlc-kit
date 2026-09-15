# Agent Note: migrate inbox, learning, skills, and release workflows from ai-eng-kit

Status: implemented

## Problem

The kit lacked the capture and release workflows ai-eng-kit has already proven: no queue for uncommitted sparks, no home for session retrospectives, no workflow skills, and no release discipline — a gap that grows exactly when the first cut approaches, because nothing says where the version lives or what a cut carries.

## Decision

Migrate the four features adapted to this repository's conventions, not copied:

- The inbox and learning contracts are English-primary with `.zh.md` counterparts and join the pairing gate through an enumerated root-file list; sparks, `QUEUE.md` rows, and learning notes stay ungated, single-language user content, exactly as in the source kit.
- Skills live flat under `.agents/skills/` (`<name>/SKILL.md`, English-only like `AGENTS.md`). The source kit's dual `skills/` + `.agents/skills/` layout existed for npm distribution, which this kit does not have — the installer is the distribution, so a single live copy removes the drift surface. Four skills migrate: `kit-inbox-capture`, `kit-inbox-promote`, `kit-learning-note`, `kit-release`.
- The `ai-eng` CLI dependency is gone: `kit-inbox-promote` references the notes README skeleton instead of `verify-notes`, and `kit-release` runs `pnpm run check:all` against this repo's own gates.
- The release contract is `docs/release.md` (paired) plus `ChangeLog.md` with `## Unreleased` staging: development appends there, a cut renames the heading, bumps root `package.json`, rewrites next-cut attributions, and tags `v<version>`.
- A `workflows` component in the installer distributes all of the above to scaffolded and adopting projects.

## Alternatives considered

- **Copy the files verbatim.** Lost: Chinese-primary contracts violate the language policy; the dual skills layout solves an npm problem this kit does not have; the CLI dependency couples a self-contained kit to an external package for a format check it does not run.
- **Defer to phase 2 with `adlc-kit-py`.** Lost: sparks and release discipline are needed now; the phase ordering governs stacks, not workflows.
- **Migrate only the release feature.** Lost: the release boundary "development never touches the changelog" is easier to hold when capture and learning give development debris a home first; in the source kit the three form one workflow family.

## Consequences

Nothing detects a stale `QUEUE.md` — the inbox is ungated by design, so the entry `Status` is authoritative and discipline carries the rest; if drift becomes real, that is the trigger for a format gate. The pairing gate covers the two new READMEs through enumeration, so spark files never need counterparts. These skills may drift from their ai-eng-kit originals; the kits sync at tagged releases, per the roadmap note. `ChangeLog.md` already accumulates under `## Unreleased`; the first cut (`v0.1.0`) has not been made.
