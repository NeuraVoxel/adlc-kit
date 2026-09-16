# AGENTS.md — packages

Package-specific rules supplementing the root [AGENTS.md](../AGENTS.md); each section owns one package and is not restated in sibling sections.

## contracts — the cross-surface seam

- **Everything here is generated.** `src/generated/*.ts` comes from `fixtures/schema/*.schema.json` via `pnpm run gen:contracts`; hand edits to generated files are defects and `ci-contracts` catches the drift. The schema is the only hand-authored wire contract in the repository.
- **One home per wire type.** Every field crossing a face is declared in the schema; hand-written copies of these types on any side are defects, and no face imports another's internals.
- **Raw data, not presentation.** The seam carries domain data and persisted metadata; display labels, sort orders, and UI groupings are derived on the web side. A field that exists only because a component finds it convenient is rejected at the schema.
- **Two-sided changes.** A schema edit updates every provider and consumer in the same change; `index.ts` re-exports generated symbols and is the only hand-written file here.
