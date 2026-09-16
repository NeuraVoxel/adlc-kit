# AGENTS.md — python

Rules for the Python face only; repo-wide conventions live in the root [AGENTS.md](../AGENTS.md) and are not restated here.

- **uv exclusively.** Every command runs through `uv run` inside this directory (the gates set their `cwd` here); `uv.lock` is committed; no direct pip, no system Python, no edits to `.venv`.
- **Generated modules are untouchable.** `src/adlc_kit/generated/` comes from `fixtures/schema/` via `pnpm run gen:contracts` (run from the repository root); hand edits fail the `ci-contracts` freshness gate. `contracts.py` re-exports generated symbols and nothing else.
- **Wire types come from the seam.** Import wire types from `adlc_kit.contracts`; hand-written request/response models are defects.
- **Apps do not bind.** `create_app()` builds without binding; only `server.py` reads `HOST`/`PORT` and listens. Tests drive the ASGI transport (`TestClient`) — never a live socket; the one live listener is the `ci-e2e` lane's.
- **Raw data out.** Responses carry domain data through the generated pydantic models; display strings and UI groupings belong to the web face.
- **Raw data in gets validated once.** Parsing an untrusted payload goes through the generated model (`model_validate`); trusted same-process values rely on type annotations.
