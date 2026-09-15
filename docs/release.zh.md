# 发版

中文 | [English](release.md)

发版是一次显式切割，绝不是开发的副作用。由维护者提出（发版 / release）；[kit-release 技能](../.agents/skills/kit-release/SKILL.md)是操作流程，本文是该流程服从的合同。

## 权威

发布版本号以根 `package.json` 为权威。每次切割打一个附注 git tag `v<version>`；tag 与清单必须始终一致。开发提交永不改动版本号。

## ChangeLog 格式

`ChangeLog.md` 在 `## Unreleased` 下累积开发内容；切割时重命名该标题。规范标题：

```markdown
## Unreleased

## [<version>] — <YYYY-MM-DD>

### Added
### Fixed
### Removed
```

已发布条目下的章节名描述已交付的现实（Added / Fixed / Removed / Changed）；最新的已发布标题必须与版本权威一致。条目陈述行为而非叙事——消费者得到什么，而不是变更是怎么推导出来的。

## 一次切割携带什么

一个提交完成全部：版本号 bump、Unreleased 改名为 `[<version>]`、钉住已发布版本的版本引用、"下一 cut"类署名改写为已发布版本、附注 tag `v<version>`。

## 检查

发布提交前运行 `pnpm run check:all`。任何失败都终止切割；绝不为了通过而放宽门禁或阈值。

## 明确在切割之外

分支与 tag 的 `git push`、任何 registry 发布，都是单独的审批。推送后须核实远端 tag 与本地一致，切割才算完成。
