# Agent Note: assemble adlc-kit as the phase-3 integrated shape

Status: implemented

## Problem

The roadmap's phase 3 calls for the hybrid kit: both stacks in one repository with a real cross-stack seam. The risk it was designed against is exactly what the seam must now carry — parallel hand-written types drifting between languages, and integration that only exists when someone happens to boot both services.

## Decision

Assemble `adlc-kit` from the two validated kits (their content, gates, and rule system) plus a contract pipeline and three new lanes:

- **The schema is the single hand-authored wire contract.** `fixtures/schema/*.schema.json` feeds `generate-contracts.ts`, which emits the TypeScript artifact (interface + runtime validator) and the pydantic model; `--check` fails on drift. Field names are snake_case on the wire (the schema's spelling), so the Node provider migrated `uptimeSeconds` → `uptime_seconds` in the same change — the seam rules applied to real code on day one.
- **Shared fixtures replay offline on both faces** (`ci-contracts`): one passing and one rejected JSON, validated by the generated validator in each language. No live process is needed to prove the two faces agree on the wire.
- **`ci-e2e` is the only live lane**: it boots the Python service on a real socket and validates its `/health` payload with the TypeScript generated validator — the cross-stack claim is checked, not assumed.
- **The runner gained `cwd` on gates** rather than `--project` flags scattered through commands: each Python gate declares its working directory, keeping the lane definitions declarative.
- Both toolchains are first-class: CI installs pnpm and uv and runs one `check:all`; no lane is "primary with a bolt-on".

## Alternatives considered

- **Generate TypeScript from pydantic (or the reverse) instead of a neutral schema.** Lost: one stack becomes the source of truth and the other the consumer — the exact asymmetry the roadmap rejects; JSON Schema is language-neutral and versionable in git alongside the fixtures.
- **Use an off-the-shelf generator (openapi-typescript, datamodel-code-generator).** Deferred: at one schema they would add a dependency and a config surface for what 130 lines of explicit mapper do; the trigger to adopt one is the second schema construct family (unions, nested objects) the hand mapper cannot carry.
- **Keep two `/health` contracts, one per kit, tolerating the naming drift.** Lost: the drift was the bug class this kit exists to delete; `uptimeSeconds` vs `uptime_seconds` would resurface in every future payload.

## Consequences

A schema edit now crosses lanes by contract: regenerate, replay both sides, update providers — `docs/testing.md` names it the one always-crossing surface. The generator supports the constructs today's schemas use and says so; growing it means growing the declared support, not silent acceptance. The two single-stack kits remain independently adoptable; this repository is the composition, and the three kits sync at tagged releases.
