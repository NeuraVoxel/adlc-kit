# Testing strategy

English | [中文](testing.zh.md)

Evidence matches the change surface: run the narrowest checks that would fail for this change's regression; never default to the full suite; never repeat a check that already passed. CI owns the exhaustive matrix.

## Change surface → evidence

| Surface | Evidence |
|---|---|
| `server/src/**` | The vitest `node` project (`server/tests/`); Fastify `inject()`, no network |
| `apps/web/src/**` | The vitest `web` project (jsdom + Testing Library) |
| `packages/contracts/src/**` | The consuming tests on both sides + `pnpm run typecheck` |
| `scripts/**` | `scripts/run-gates.spec.ts` and `scripts/verify-doc-pairing.spec.ts` + `pnpm run check:all` |
| `packages/create-adlc-kit-ts/**` | `tests/lib.spec.ts` + a real scaffold/adopt smoke (see below) |
| `.agents/{inbox,learning,skills}/**`, `ChangeLog.md`, `docs/release.md` | `pnpm run doc-sync` (paired contracts) + review; sparks, queue rows, and learning notes are ungated user content |
| `docs/**`, `README*` | `pnpm run doc-sync` (bilingual pairing) |

## Focused runs

```sh
pnpm exec vitest run server/tests/app.spec.ts
pnpm exec vitest run --project web
pnpm run doc-sync
```

Installer changes warrant a real smoke: scaffold into a temp directory and run the gates there, since the copied checkout is the product.

## Evolution order

Coverage gates are not enabled yet; introduce a global threshold first, then tighten per-file as risk concentrates. Snapshot lanes and the real e2e lane (`ci-e2e`) arrive in phase 3 and self-skip without credentials; until then, component tests in the `web` project guard user-visible output. Tests describe behavior, not implementation: refactors leave tests alone; behavior changes move with their tests.
