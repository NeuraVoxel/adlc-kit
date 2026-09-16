# Release

English | [中文](release.zh.md)

A release is an explicit cut, never a side effect of development. The maintainer asks for it (发版 / release); the [kit-release skill](../.agents/skills/kit-release/SKILL.md) is the operating procedure, and this document is the contract that procedure defers to.

## Authority

This repository carries two version authorities that must always agree: root `package.json` (the TypeScript faces) and `python/pyproject.toml` (the Python face). Each cut gets one annotated git tag `v<version>` covering both. Development commits never touch either version.

## ChangeLog format

`ChangeLog.md` accumulates development under `## Unreleased`; a cut renames that heading. The canonical headings:

```markdown
## Unreleased

## [<version>] — <YYYY-MM-DD>

### Added
### Fixed
### Removed
```

Section names under a released cut describe shipped reality (Added / Fixed / Removed / Changed); the newest released heading must match both version authorities. Entries state behavior, not narration — what a consumer gets, not how the change was derived.

## What one cut carries

One commit does all of: the version bump in both authorities, the Unreleased-to-`[<version>]` rename, version references that pin a released version, next-cut attributions rewritten to the released version (including "下一 cut"), and the annotated `v<version>` tag.

## Checks

The full gate set (`pnpm run check:all`, every lane including `ci-e2e`) runs before the release commit. Any failure stops the cut; gates and thresholds are never loosened to pass it.

## Explicitly outside a cut

`git push` of the branch and tag, and any registry publishing, are separate approvals. After a push, verify the remote tag matches local before treating the cut as done.
