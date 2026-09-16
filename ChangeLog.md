# Changelog

Notable changes to this repository are listed here by released semver. The version authorities are root `package.json` and `python/pyproject.toml`, kept in agreement; each released cut also carries an annotated git tag `v<version>`. Development accumulates under `## Unreleased`; a cut renames that heading (see [docs/release.md](docs/release.md)).

## Unreleased

## [0.1.0] — 2026-09-16

### Added

- The integrated kit assembled from adlc-kit-ts and adlc-kit-py: TypeScript faces (Fastify server, React web), the Python face (FastAPI under uv), and the shared rule system (run-gates, bilingual pairing, Agent Notes gates, inbox/learning/kit-* workflows).
- The contract pipeline: `fixtures/schema/` as the single hand-authored wire source, `gen:contracts` generating the TypeScript artifact (interface + runtime validator) and the pydantic model, the `ci-contracts` lane (freshness `--check` plus offline fixture replays through both faces), and the `ci-e2e` lane booting the live Python service validated by the TypeScript generated contract.
- Lanes `ci-python` and gate `cwd` support in the runner; CI installs both toolchains (pnpm + uv) and runs `check:all`.
