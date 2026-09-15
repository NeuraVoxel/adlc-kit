---
name: kit-release
description: >-
  Cuts a release of this repository when the user says 发版 / release / cut a
  version: bump the version in the authority, promote the ChangeLog Unreleased
  section to the released version, update version references, reconcile
  next-cut attributions, run the release checks, commit, and tag — all in one
  change. Push and publish stay separate approvals. Do not use for development
  commits; development never touches the version, the ChangeLog, or version
  references.
---

# Kit Release

Cut one release of this repository. This skill states the baseline discipline; it is guidance, not a script. The release contract — [docs/release.md](../../../docs/release.md) — wins over anything here, including where the version lives and the changelog format.

## Trigger and boundary

Cut only on the maintainer's explicit 发版 / release request in the current turn — never spontaneously after finishing a feature. Development commits carry code, tests, notes, and ChangeLog `## Unreleased` entries only; if the working tree already contains version or released-heading edits outside a release request, stop and report the conflict instead of building on it.

## What one cut carries

Exactly one change (one commit) does all of:

1. **Version bump** in the version authority (root `package.json`). Default to the semver step the unreleased changes justify; state the chosen version so the maintainer can correct it in the same turn.
2. **Changelog cut** — rename the `## Unreleased` heading to `## [<version>] — <today>` in `ChangeLog.md`; everything under it ships with this cut. The newest released heading must match the version authority.
3. **Version references** — README statements and docs examples that pin a released version move with the bump.
4. **Next-cut attributions** — notes and docs written during development may attribute shipped work to "the next cut" (or 下一 cut); replace each with the released version.
5. **Tag** — annotated `v<version>` matching the version authority, created in the same change.

## Checks before the release commit

Run `pnpm run check:all` — this repository's full gate set. Any failure stops the cut; do not loosen gates or thresholds, and do not push and hope.

## Explicitly not part of the cut

- `git push` (branch and tag) — separate approval, then verify the remote tag matches local.
- Publishing to any registry — separate approval.
- Loosening gates or thresholds to make a failing cut pass.
