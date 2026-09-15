# AGENTS.md — apps/web

Rules for the React + Vite frontend only; repo-wide conventions live in the root [AGENTS.md](../../AGENTS.md) and are not restated here.

- **Browser face only.** Bundler resolution plus DOM lib; reaching a Node built-in (`node:fs`, `node:path`, `node:process`) from anything that enters the bundle is a defect — the bundle-purity gate arrives at first violation.
- **Derive presentation.** Render from the raw data and persisted metadata the server already provides; ask for contract fields, never for UI-shaped payloads ([seam rules](../../packages/AGENTS.md)).
- **Shared types through the seam.** Import cross-surface types only via `@adlc-kit/contracts`; reaching into `server/src` is a dependency-direction violation — the domain-graph gate arrives with the graph.
- **Copy lives in components** until locale dictionaries arrive; then copy moves under `src/locale/` and a verify gate rejects hard-coded strings (the root convention owns that policy).
- **Tests query by role.** Testing Library queries go through accessible roles and names, never implementation details; the vitest `web` project (jsdom) owns these tests.
