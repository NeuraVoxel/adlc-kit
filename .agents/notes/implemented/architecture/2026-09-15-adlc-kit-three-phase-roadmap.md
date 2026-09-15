# Agent Note: adlc-kit three-phase roadmap and cross-stack adoption rule

Status: implemented

## Problem

The adlc-kit series must cover TypeScript single-stack, Python single-stack, and hybrid shapes. Scaffolding the full stack at once would bake unverified seams into the template, and every new stack would change every kit's skeleton.

## Decision

Build the kits in three phases: `adlc-kit-ts` (TS front+back single stack) → `adlc-kit-py` (Python single stack) → `adlc-kit` (the integrated TS+Python shape). `adlc-kit` is not a third from-scratch kit: it is the first two kits' content plus `packages/contracts/` and the `ci-contracts` and `ci-e2e` lanes. Cross-stack shared artifacts take only two forms: contract schemas and fixtures committed to git (replayed offline by both sides); live-process verification lives only in the e2e lane. The adoption rule is written into each kit's root AGENTS.md: a new stack gets an independent language root and lane, going green, before any cross-stack seam exists.

## Alternatives considered

- **Scaffold the full stack in one step.** Lost: the seam mechanisms (generation, two-sided same-PR, e2e) have no runnable reference before single-stack validation, so rework cost lands on every phase; initial complexity also delays a usable phase 1.
- **One monorepo evolving through phases.** Lost: the three kits are independently adoptable template products; a single evolving repo would make adopters carry the other two stacks' gates and dependencies they never use, defeating the kits' independent-validation goal.

## Consequences

The shared skeleton (run-gates, lefthook, AGENTS.md templates, notes system) treats `adlc-kit-ts` as the reference implementation; the other kits derive from it. The three copies may evolve independently and sync at tagged kit releases. The cost is short-term triplication of the skeleton — if a clone-detection gate arrives, `scripts/` needs an exemption or a derivation mechanism first. The benefit: every phase starts from an all-green gate that is the next phase's regression baseline.
