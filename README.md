# adlc-kit

English | [中文](README.zh.md)

The integrated shape of the adlc-kit series: the TypeScript faces (Fastify server, React web) and the Python face (FastAPI service) in one repository, joined by the contract pipeline — a JSON Schema source of truth, per-language generated artifacts, shared fixtures replayed offline by both sides, and one live cross-stack e2e lane.

## Quick start

```sh
pnpm install                                   # TypeScript toolchain + lefthook hooks
uv sync --project python                       # Python environment (managed 3.12)
pnpm run check:all                             # every lane: TS + Python + contracts + docs + e2e
pnpm run dev:server                            # Node face, http://127.0.0.1:3000/health
pnpm run dev:python                            # Python face, http://127.0.0.1:8000/health
pnpm run dev:web                               # Vite dev server
```

## Layout

| Directory | Responsibility |
|---|---|
| `apps/web/` | React + Vite frontend (browser face) |
| `server/` | Fastify backend (Node face) |
| `python/` | FastAPI service (Python face), uv-managed |
| `packages/contracts/` | Generated TypeScript wire types; consumers import `@adlc-kit/contracts` |
| `fixtures/` | The cross-stack seam: `schema/` is the source of truth, the JSON files are replayed by both faces |
| `scripts/` | The `run-gates.ts` orchestrator, verify gates, and the contract generator |
| `docs/` | Architecture map, testing strategy, release contract |
| `.agents/` | Decision records, spark inbox, learning retrospectives, `kit-*` skills |

Docs are English-primary with `.zh.md` counterparts; `doc-sync` rejects drift. `AGENTS.md` (agent-facing) is English-only. Each module subtree carries its own `AGENTS.md` supplement.

## The contract pipeline

1. Edit `fixtures/schema/*.schema.json` — the only hand-authored wire contract.
2. `pnpm run gen:contracts` regenerates `packages/contracts/src/generated/*.ts` and `python/src/adlc_kit/generated/*.py`.
3. Update provider and consumer in the same change; `ci-contracts` fails on any artifact drift (`--check`) and replays the shared fixtures through both faces offline.
4. `ci-e2e` boots the Python service on a real socket and validates its live `/health` payload with the TypeScript generated validator.

Hand-written wire types anywhere are forbidden. The seam rules: [packages/AGENTS.md](packages/AGENTS.md).

## Gates

`pnpm run check:all` runs every lane: `ci-primary` (lint/typecheck/test), `ci-python` (ruff/mypy/pytest), `ci-contracts` (freshness + two fixture replays), `doc-sync` (pairing + notes gates), and `ci-e2e` (live cross-stack check). CI runs the same aggregate ([.github/workflows/ci.yml](.github/workflows/ci.yml)); pre-commit stays fast, CI owns the exhaustive matrix.

## The adlc-kit series

`adlc-kit-ts` (phase 1) → `adlc-kit-py` (phase 2) → `adlc-kit` (this repository, phase 3). The roadmap and composition rules: the [roadmap note in adlc-kit-ts](https://github.com/NeuraVoxel/adlc-kit-ts/blob/main/.agents/notes/implemented/architecture/2026-09-15-adlc-kit-three-phase-roadmap.md).
