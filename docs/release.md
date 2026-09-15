# Release

English | [中文](release.zh.md)

A release is an explicit cut, never a side effect of development. The maintainer asks for it (发版 / release); the [kit-release skill](../.agents/skills/kit-release/SKILL.md) is the operating procedure, and this document is the contract that procedure defers to.

## Authority

The released version lives in root `package.json`. Each cut gets an annotated git tag `v<version>`; the tag and the manifest must always agree. Development commits never touch the version.

## ChangeLog format

`ChangeLog.md` accumulates development under `## Unreleased`; a cut renames that heading. The canonical headings:

```markdown
## Unreleased

## [<version>] — <YYYY-MM-DD>

### Added
### Fixed
### Removed
```

Section names under a released cut describe shipped reality (Added / Fixed / Removed / Changed); the newest released heading must match the version authority. Entries state behavior, not narration — what a consumer gets, not how the change was derived.

## What one cut carries

One commit does all of: the version bump, the Unreleased-to-`[<version>]` rename, version references that pin a released version, next-cut attributions rewritten to the released version (including "下一 cut"), and the annotated `v<version>` tag.

## Checks

`pnpm run check:all` runs before the release commit. Any failure stops the cut; gates and thresholds are never loosened to pass it.

## Explicitly outside a cut

`git push` of the branch and tag, and any registry publishing, are separate approvals. After a push, verify the remote tag matches local before treating the cut as done.
