# AGENTS.md — packages

Package-specific rules supplementing the root [AGENTS.md](../AGENTS.md); each section owns one package and is not restated in sibling sections.

## contracts — the cross-surface seam

- **One home per wire type.** Every field crossing server → web is declared here; hand-written copies of these types on either side are defects, and neither side imports the other's internals.
- **Raw data, not presentation.** The seam carries domain data and persisted metadata; display labels, sort orders, and UI groupings are derived on the web side. A field that exists only because a component finds it convenient is rejected here.
- **Document payload semantics.** JSDoc on each exported type states units, enums, and nullability; both faces consume the same JSDoc.
- **Two-sided changes.** A contract edit updates provider and consumer in the same change (the root cross-stack rule); until generation arrives in phase 3, this directory is the hand-maintained source of truth.

## create-adlc-kit-ts — the installer

- **Zero dependencies, split brains.** Planning logic lives in `lib.ts` as pure functions with specs; `bin.ts` owns all I/O and process boundaries.
- **The checkout is the template.** Components copy live from this repository — never snapshot, never vendor a second copy of a rule file.
- **A component change is four edits**: `COMPONENTS` in `lib.ts`, the installer README table, the usage examples (root README pair and installer README), and the `lib.spec.ts` expectations. Missing one is how the `workflow`/`workflows` drift started.
- **Fail loud at the boundaries.** Unknown component name, non-empty `new` target, existing files without `--force`, a flag without its value — each rejects before any write.
- **Copy hygiene.** Excludes stay minimal and explicit; the `CLAUDE.md` alias must land as a relative link — never the materialized absolute path that `fs.cp` produces for copied symlinks.
