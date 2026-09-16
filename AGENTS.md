# AGENTS.md

adlc-kit — the integrated shape of the adlc-kit series: the TypeScript faces (Fastify server, React web) and the Python face (FastAPI) joined by the contract pipeline. Read [docs/architecture.md](docs/architecture.md) before changing source. Each module subtree (`server/`, `apps/web/`, `packages/`, `python/`, `scripts/`) carries its own `AGENTS.md` supplementing these rules; read it before working in that tree.

## Commands

```sh
pnpm install                                   # TypeScript toolchain, lefthook hooks (postinstall)
uv sync --project python                       # Python environment, first time and after dep edits
pnpm run check:all                             # every lane — CI runs the same aggregate
pnpm run check:ci | check:python | check:contracts | check:e2e | doc-sync   # single lanes
pnpm run gen:contracts                         # regenerate per-language artifacts from the schema
pnpm run dev:server | dev:python | dev:web     # run one face
```

`lint` / `typecheck` / `test` / `test:python` run standalone. Select test evidence by change surface ([docs/testing.md](docs/testing.md)); never default to the full suite.

## Core conventions

- **The schema is the only hand-written wire contract.** Every field crossing a face lives in `fixtures/schema/*.schema.json`; per-language artifacts are generated (`pnpm run gen:contracts`) and hand-written wire types anywhere are defects. A schema edit updates provider and consumer in the same change.
- **English-primary, paired docs.** Human-facing docs (`README.md`, `docs/*.md`, `.agents/notes/**/*.md`, the inbox and learning READMEs) carry a `.zh.md` counterpart updated in the same change; `AGENTS.md` and `.agents/skills/*/SKILL.md` stay English-only to bound agent context. `doc-sync` rejects missing, orphaned, or drifted counterparts.
- **ESM everywhere** on the TypeScript side (`"type": "module"`, package names `@adlc-kit/*`, `.ts` local imports, tsx execution); **Python 3.12+ through uv exclusively** on the Python side (`uv.lock` committed, no direct pip, no system Python).
- **Explicit over implicit**: defaulting is an explicit resolve step owned by the caller; misconfiguration fails loud at load; never silently skip a missing referent.
- **Trust static types at typed same-process boundaries**; validate at wire, file, environment, and subprocess boundaries. The generated per-language validators are the wire-boundary validation.
- **Hardened invariants become gates**: `scripts/verify-*.ts` or `scripts/verify_*.py` with a rejection spec, wired into the runner graph. Promote a soft convention after its second violation.
- **Tests describe behavior.** The Node face tests through Fastify `inject()`, the Python face through the ASGI transport; a live process appears only in the `ci-e2e` lane.
- **Docs update in the same PR as code**; every fact has one home; docs state current contracts, not reasoning transcripts.
- **Every non-trivial change adds or updates one Agent Note in the same PR** ([.agents/notes/README.md](.agents/notes/README.md)); purely mechanical or local edits are exempt. **Never commit or push on your own**: finishing a change ends with the narrowest relevant evidence and a report for acceptance.
- **Sparks queue in `.agents/inbox/`, retrospectives in `.agents/learning/`**; promotion to a proposed note is always an explicit request. Releases are explicit cuts ([docs/release.md](docs/release.md)).
- **Secrets never enter the repository**; credential-dependent tests self-skip without credentials.

## Git hooks and gate ownership

pre-commit runs fast staged-file checks only (oxlint --fix, trailing whitespace); pre-push runs the TypeScript typecheck; CI owns the exhaustive matrix ([.github/workflows/ci.yml](.github/workflows/ci.yml)). Never bypass a failing gate: fix it or prove the failure is environmental.
