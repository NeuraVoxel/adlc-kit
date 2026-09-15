# Architecture

English | [中文](architecture.zh.md)

adlc-kit-ts is the TypeScript reference kit of the adlc-kit series. This file is the map to read before changing `server/`, `apps/web/`, `packages/`, or `scripts/`; decision rationale lives in [Agent Notes](../.agents/notes/README.md), and step-by-step guides do not live here.

## Composition

| Directory | Responsibility |
|---|---|
| `apps/web/` | React + Vite frontend; the browser face (bundler resolution, DOM lib); the bundle must not reach Node APIs |
| `server/` | Fastify backend; the Node face (NodeNext); tsx executes TS directly; serves `GET /health` |
| `packages/contracts/` | Cross-surface contract source. In phase 3 this becomes the home of generated artifacts (gen/verify pairs, two-sided same-PR); today it holds the hand-written source of truth |
| `packages/create-adlc-kit-ts/` | The installer: scaffolds a new project from this checkout or adopts rule components into an existing one; the checkout is the template |
| `scripts/` | The `run-gates.ts` orchestrator and verify scripts; language-agnostic infrastructure that never imports business code |
| `docs/` | The architecture map (this file), the [testing strategy](testing.md), and the [release contract](release.md) |
| `.agents/` | Decision records (`notes/`), the spark inbox and learning retrospectives, and the `kit-*` workflow skills |

## Language policy

Human-facing contracts are English-primary with a `.zh.md` Chinese counterpart updated in the same change: `README.md`, `docs/*.md`, `.agents/notes/**/*.md`, and the inbox and learning READMEs. `AGENTS.md` and the `.agents/skills/*/SKILL.md` files stay English-only — agent-facing, to bound model context ([pairing decision](../.agents/notes/implemented/process/2026-09-15-bilingual-doc-pairing.md)). Inbox sparks, `QUEUE.md`, learning notes, and `ChangeLog.md` are single-language by design and outside the pairing gate. `pnpm run doc-sync` rejects missing, orphaned, or structurally drifted counterparts.

## Compiler faces

The same TypeScript compiles under four face configs, each typechecked independently; shared strictness lives in `tsconfig.base.json`:

- `server/tsconfig.json` — NodeNext + node types; runs on Node.
- `apps/web/tsconfig.json` — esnext + bundler resolution + DOM lib + react-jsx; bundles for the browser.
- `packages/contracts/tsconfig.json` — NodeNext; the shared type source.
- `tsconfig.tools.json` — repository tooling: `scripts/`, `vitest.config.ts`, the installer package.

Faces own `module`/`moduleResolution`/`lib`; there is no root solution program. Cross-package types resolve from source through `paths` in `tsconfig.base.json` (the source plane); when an artifact plane arrives (for example tsdown), add the face first and the build second — never merge faces.

## Gate system

`pnpm run check:ci` is `scripts/run-gates.ts ci-primary`. The runner only schedules the aggregate graph (spawn commands, `needs` dependencies, bounded parallelism, fail-fast per stage) and never parses a toolchain — adding a lane means adding Gate definitions, not runner changes. Current graph:

- `ci-primary`: lint, typecheck, test — one parallel stage.
- `doc-sync`: bilingual doc pairing.
- `check-all`: both of the above; this is what CI runs.

Extension points:

- **New verify gate**: `scripts/verify-<invariant>.ts` with a spec proving it rejects one invalid case, wired into `gatesForMode`.
- **New lane** (for example `ci-web`, `ci-python`): extend the `Mode` union and `gatesForMode`; the runner body does not change.
- **UI copy gate**: when locale dictionaries arrive, add a verify gate rejecting copy hard-coded in components.
- **End-to-end (phase 3)**: a `ci-e2e` lane, separate from unit lanes, self-skipping without credentials.

Git hook ownership: pre-commit runs fast staged-file checks only (lint --fix, trailing whitespace), pre-push runs typecheck only, and CI owns the exhaustive matrix. Fast local checkpoints are the price of hooks that stay installed.

## Cross-stack seam (phase 3 preview)

`packages/contracts` admits exactly two kinds of cross-stack shared artifacts:

1. **Contract schemas** — per-language types are generated from them; hand-written type copies in any language are forbidden; generation freshness is gated by a gen/verify pair.
2. **Fixtures committed to git** — replayed offline by both sides, which is what keeps every lane independently validatable.

A contract edit updates provider and consumer in the same change; live-process integration verification lives only in the `ci-e2e` lane. The three-phase roadmap and its composition rules: [Agent Note](../.agents/notes/implemented/architecture/2026-09-15-adlc-kit-three-phase-roadmap.md). The installer design: [Agent Note](../.agents/notes/implemented/process/2026-09-15-create-adlc-kit-ts-installer.md).
