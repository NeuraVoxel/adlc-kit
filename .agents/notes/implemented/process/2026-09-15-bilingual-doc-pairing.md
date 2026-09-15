# Agent Note: English-primary paired docs with a structural pairing gate

Status: implemented

## Problem

The kit's docs started Chinese-only. A kit is a template consumed by other projects and possibly other teams, so one language caps its audience; and bilingual docs without a gate drift the moment one side updates alone.

## Decision

Human-facing docs are English-primary with a `.zh.md` Chinese counterpart updated in the same change: `README.md`, `docs/*.md`, and `.agents/notes/**/*.md`. `AGENTS.md` is the single exemption — agent-facing standing orders stay English-only to bound model context. `scripts/verify-doc-pairing.ts` rejects a missing or orphaned counterpart and section-count or fenced-block drift between pairs, wired into the `doc-sync` aggregate; `check-all` runs it. Canonical section headings stay English in counterparts, which is what makes the structural check meaningful.

## Alternatives considered

- **Chinese-primary with English counterparts.** Lost: the kit's standing orders and gate vocabulary are English (AGENTS.md, oxlint, run-gates); making the primary language differ from the toolchain vocabulary adds a translation step to every rule edit.
- **English-only, no counterparts.** Lost: the maintaining team works in Chinese; dropping counterparts trades reviewer comfort for less translation work — a poor trade while the doc set is small.
- **Deep-consistency pairing (manifests, sidecars, a terminology table) as in the deepseek-harness origin repo.** Deferred: correct at that repo's doc volume; at seven paired files, the structural gate delivers most of the drift protection at a fraction of the machinery. Revisit when a terminology dispute actually happens.

## Consequences

Every doc edit now touches two files, and the gate turns forgetting one side into a red check instead of silent drift. AGENTS.md and package READMEs stay single-language, so the pairing surface stays deliberately small. The pairing gate travels with the `gates` and `docs` installer components, so projects scaffolded or adopted from this kit inherit the same policy.
