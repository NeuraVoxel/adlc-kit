# Agent Notes

中文 | [English](README.md)

这里只住一种设计文档。**Agent Note** 记录影响本仓库的决策——*为什么*、*放弃了什么*，即代码和文档承载不了的部分。会话纪要和学习笔记住在 [`.agents/learning/`](../learning/README.md)；未承诺的灵感排队在 [`.agents/inbox/`](../inbox/README.md)。

## 布局与命名

路径编码两个轴：`{lifecycle}/{class}/yyyy-mm-dd-topic.md`，分类门禁（`scripts/agent-note-tree.ts`）拒绝任何越出下列封闭集合的 note 路径。

- **lifecycle**（顶层目录）是状态，Note 随状态在目录间移动：
  - `proposed/`——已评审、未实施的提案。
  - `implemented/`——决策已上线；文件记录决策与被否决的替代方案，并**与实际交付保持同步**：代码后续移动文件、改名、改默认值时，同一变更内更新对应事实（只改事实，不改决策本身）。
  - `rejected/`——考虑过并否决；裁决写在 `Status:` 行，提案原样冻结。
  - `archived/`——理由不再指导未来工作的已交付决策；append-only 冻结历史，绝非现行权威。
- **class**（嵌套目录）是决策类别，封闭集合：`feature` / `bug-fix` / `simplification` / `architecture` / `process` / `testing`。新增类别须在同一变更内扩展门禁脚本的 `CLASSES` 并更新本节。

日期是主题**首次提出**的日期（以 git 历史为准）。Note 之间用相对 Markdown 链接互引，不用裸文件名或编号。不设集中索引；活跃目录树就是清单。

## 归档与删除

当已交付的决策完整、其理由不再可能指导未来工作时归档该 implemented Note；校准的问法是：这里是否有某个替代方案、所有权边界、负面保证、持久语义规则或重新引入条件，仍能防止一个可能犯的错——绝不用字数、年龄或配额衡量。绝不归档 proposed Note：过时就转 rejected。rejected Note 只在其理由还能防止一个可能犯的错时保留，否则整体删除。

归档把完整的英/中对移入 `archived/{class}/`，保留 `Status: implemented`，在两个文件的状态行下方插入 `Archived: YYYY-MM-DD`，并修复或删除入链——这是归档允许的全部内容变更。封存后永久冻结：[`verify-archived-agent-notes`](../../../scripts/verify-archived-agent-notes.ts) 将每个归档文件与 append-only manifest（`scripts/archived-notes.manifest.json`）中的哈希比对，任何后续编辑、移动或删除都会挂门禁。只在新增归档的同一变更内重新记录 manifest。

## 何时写一条

每个**非平凡变更**必须同一 PR 内新增或更新至少一条 Agent Note：改变行为、架构、跨文件或跨包共享的契约、流程或工具、测试策略、磁盘/wire/配置格式，或任何维护者可能需要重新审视的决策。已实施的 Note 随代码迁移、改名、默认值变更在同一变更内同步。纯机械或局部修改豁免。

## 取代与合并

Note 永不改写成*另一个*决策：用新 Note 取代并保持两者互链。被完全取代的 Note 可以合并进现行拥有者 Note 后删除，前提是：拥有者保全每一条独特理由、替代方案、后果和已命名的覆盖缺口，修复每一条入链，并在同一变更内删除中文对照。部分取代不合格：保持两条 Note 互链，更新仍然成立的事实。

## 文件格式

格式门禁（[`verify-agent-note-format`](../../../scripts/verify-agent-note-format.ts)，属 `doc-sync`）强制本节全部内容；分类门禁强制路径。

### 头部块

前三行固定：

```markdown
# Agent Note: <title>

Status: <status>
```

`Status:` 取 `proposed`、`implemented` 或 `rejected — <一行理由>`，且必须与所在 lifecycle 目录一致——门禁交叉核对。归档 Note 保留 `Status: implemented`，第四行为 `Archived: YYYY-MM-DD`。头部标记在两种语言里都保持英文原样。

### 正文骨架

正文以 `## Problem` 开头（只写动机，脱离方案也能读懂）。每个生命周期的规范章节名固定：

```markdown
proposed:     Problem / Proposal / Alternatives considered / Acceptance criteria / Risks
implemented:  Problem / Decision / Alternatives considered / Consequences
rejected:     提案原样冻结，含 Alternatives considered
archived:     封存时的 implemented 骨架，外加 Archived: 行
```

提案期章节（`## Proposal`、`## Plan`、`## Migration plan`、`## Acceptance criteria`）在 `implemented/` 与 `archived/` 下被拒绝：已实施的 Note 以现在时描述现状。

### Alternatives considered 强制存在

每个 Note 必须携带 `## Alternatives considered`：每个真实替代方案及落败原因。没有记录对手的决策会招来重新争论——这正是 Note 存在要防止的事。早于格式门禁、替代方案不可复原的 Note，以精确注释 `<!-- agent-note-format: alternatives-not-recorded (pre-format Agent Note) -->` 代替该节。

### 生命周期之间移动

在生命周期目录间移动文件，意味着同一变更内更新 `Status:` 行并重新满足该目录的骨架——否则门禁拒绝这次移动。具体地：`proposed/` → `implemented/` 把 `## Proposal` 改写为现在时的 `## Decision`，并把 `## Acceptance criteria` 与 `## Risks` 并入 `## Consequences`；`proposed/` → `rejected/` 只在 `Status:` 行加理由。

### 中文对照

`.zh.md` 对照在文档配对门禁下逐节镜像英文正本的结构；机器校验的头部标记（`# Agent Note: ` 与 `Status:` 行）在两种语言里都保持英文原样。格式门禁跳过 `.zh.md` 文件——配对门禁负责它们的结构一致性。
