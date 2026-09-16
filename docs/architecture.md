# Architecture

English | [中文](architecture.zh.md)

adlc-kit is the integrated shape of the adlc-kit series: TypeScript faces and the Python face in one repository, joined by the contract pipeline. This file is the map to read before changing `server/`, `apps/web/`, `python/`, `packages/`, or `scripts/`; decision rationale lives in [Agent Notes](../.agents/notes/README.md).

## Composition

| Directory | Responsibility |
|---|---|
| `apps/web/` | React + Vite frontend; the browser face (bundler resolution, DOM lib); the bundle must not reach Node APIs |
| `server/` | Fastify backend; the Node face (NodeNext); serves `GET /health` validated by the generated contract |
| `python/` | FastAPI service; the Python face (uv-managed, strict mypy); serves the same `/health` contract through the generated pydantic model |
| `packages/contracts/` | Generated TypeScript wire artifacts; the only hand-written file is the `index.ts` re-export |
| `fixtures/` | The seam: `schema/*.schema.json` is the single hand-authored wire contract; the JSON files are replayed offline by both faces |
| `scripts/` | The `run-gates.ts` orchestrator, verify gates, the contract generator, and the e2e bootstrap |
| `docs/` | The architecture map (this file), the [testing strategy](testing.md), and the [release contract](release.md) |
| `.agents/` | Decision records (`notes/`), the spark inbox and learning retrospectives, and the `kit-*` workflow skills |

## The contract pipeline

`fixtures/schema/` is the source of truth. `pnpm run gen:contracts` emits `packages/contracts/src/generated/*.ts` (interface + runtime validator) and `python/src/adlc_kit/generated/*.py` (pydantic model); `generate-contracts.ts --check` fails on any drift. Provider and consumer update in the same change as the schema; `ci-contracts` replays the committed fixtures through both faces offline. Hand-written wire types anywhere are forbidden — the seam rules live in [packages/AGENTS.md](../packages/AGENTS.md).

## Faces and toolchains

| Face | Runtime | Types | Gates |
|---|---|---|---|
| `server/` + `apps/web/` + `packages/` | Node 22, pnpm, tsx | NodeNext / bundler / NodeNext faces under `tsconfig.base.json` | oxlint, tsc, vitest |
| `python/` | uv-managed Python 3.12 | pydantic models, strict mypy | ruff (lint + format), mypy, pytest |

Both toolchains are first-class: the runner treats them as lanes, not as a primary and a bolt-on.

## Gate system

`pnpm run check:all` is what CI runs. The runner only schedules the aggregate graph and never parses a toolchain — adding a lane means adding Gate definitions, not runner changes. Current graph:

- `ci-primary`: lint, typecheck, test — the TypeScript faces.
- `ci-python`: py-lint, py-format, py-typecheck, py-test — each with its working directory (`cwd`) on the Python root.
- `ci-contracts`: schema/artifact freshness plus the TypeScript and Python fixture replays.
- `doc-sync`: bilingual doc pairing, note classification, note format, archive integrity.
- `ci-e2e`: the live cross-stack check — boots the Python service on a real socket and validates its `/health` payload with the TypeScript generated validator. The only lane where a live process is required.

Git hook ownership: pre-commit runs fast staged-file checks only (lint --fix, trailing whitespace), pre-push runs the TypeScript typecheck, and CI owns the exhaustive matrix.

## Roadmap provenance

This repository is phase 3 of the three-phase roadmap: `adlc-kit-ts` and `adlc-kit-py` were validated independently first; this kit is their composition plus the contract pipeline, not a third from-scratch build. The roadmap and its composition rules: the [roadmap note in adlc-kit-ts](https://github.com/NeuraVoxel/adlc-kit-ts/blob/main/.agents/notes/implemented/architecture/2026-09-15-adlc-kit-three-phase-roadmap.md); this kit's assembly decisions: the [assembly note](../.agents/notes/implemented/process/2026-09-15-assemble-adlc-kit.md).
