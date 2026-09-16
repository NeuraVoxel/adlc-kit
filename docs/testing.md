# Testing strategy

English | [中文](testing.zh.md)

Evidence matches the change surface: run the narrowest checks that would fail for this change's regression; never default to the full suite; never repeat a check that already passed. CI owns the exhaustive matrix.

## Change surface → evidence

| Surface | Evidence |
|---|---|
| `server/src/**` | `server/tests/` through Fastify `inject()`; wire assertions go through the generated validator |
| `apps/web/src/**` | The vitest `web` project (jsdom + Testing Library) |
| `python/src/**` | `python/tests/` through the ASGI transport (FastAPI `TestClient`, no live socket) |
| `fixtures/schema/**` | `pnpm run gen:contracts` + **both** fixture replays (`ci-contracts`) + every consuming face's tests |
| `packages/contracts/**`, `python/src/adlc_kit/generated/**` | Never hand-edited; `ci-contracts` freshness gate owns them |
| `scripts/**` | The gate specs beside each gate + `pnpm run check:all` |
| `docs/**`, `README*`, `.agents/**` contracts | `doc-sync` |

## Lane map

```sh
pnpm run check:ci          # TypeScript faces
pnpm run check:python      # Python face
pnpm run check:contracts   # freshness + both fixture replays
pnpm run check:e2e         # live cross-stack check
pnpm run doc-sync          # docs + notes gates
```

A schema change is the one surface that always crosses lanes: regenerate, replay both sides, and run the provider faces' tests before reporting.

## Evolution order

Coverage gates are not enabled yet; introduce a global threshold per face first, then tighten as risk concentrates. Snapshot lanes for user-visible output arrive on demand and self-skip without credentials. Tests describe behavior, not implementation: refactors leave tests alone; behavior changes move with their tests.
