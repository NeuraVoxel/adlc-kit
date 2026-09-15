# Agent Note: close the five Agent Notes gaps found against deepseek-harness

Status: implemented

## Problem

与起源仓库 Agent Notes 规范的对比发现本 kit 缺五块：`archived/` 生命周期整体缺失（且该省略是隐性的，不是被记录的决策）、class 封闭集只是散文没有门禁、格式门禁被推迟、取代/合并规则只有一句话版本、生命周期移动没有机器强制。

## Decision

五项全部落地，每项都是带拒绝用例 spec、接入 `doc-sync` 的门禁：

- `scripts/agent-note-tree.ts` 编码封闭的 lifecycle 集合（现已含 `archived/`）与 class 集合，解析 `{lifecycle}/{class}/yyyy-mm-dd-topic.md`，拒绝不可分类的路径。
- `scripts/verify-agent-note-format.ts` 强制头部块、交叉核对 `Status:` 与目录、要求各生命周期骨架、在 `implemented/` 与 `archived/` 下拒绝提案期章节、强制 `## Alternatives considered`（含精确的预格式逃逸注释）。
- `scripts/verify-archived-agent-notes.ts` 将每个归档文件与 append-only 的 `scripts/archived-notes.manifest.json` 哈希比对，拒绝修改冻结内容、未记录的归档、无文件的 manifest 条目、缺中文对照的英文 Note。
- notes README（双语）现在承载完整的归档校准、取代与合并规则、以及门禁所强制的生命周期移动流程。

## Alternatives considered

- **推迟归档，只记录推迟决策，等 implemented 积累再做**。落败原因：未成文的省略本来就是最差状态；而且这套机制小、自足、可测——推迟毫无收益，还把"何时归档"留给记忆。
- **只上门禁，README 散文保持简短**。落败原因：门禁强制的是散文所陈述的；README 不解释的骨架或归档规则会让每次红灯都变成一次侦查。

## Consequences

notes 体系现已全面机器化：分类、格式、配对、归档完整性都在 `doc-sync` 响亮失败，`check-all` 全部运行。新的义务随之而来：归档须在同一变更内重录 manifest；class 集合增长意味着改 `CLASSES` 加更新 README。现有六条 Note 原样通过新门禁；安装器 `gates` 组件分发全部三个门禁与 manifest。
