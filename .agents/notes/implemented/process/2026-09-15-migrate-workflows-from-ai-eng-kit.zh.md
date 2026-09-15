# Agent Note: migrate inbox, learning, skills, and release workflows from ai-eng-kit

Status: implemented

## Problem

本 kit 缺少 ai-eng-kit 已经验证过的捕获与发版工作流：没有未承诺灵感的排队区，没有会话复盘的家，没有工作流技能，也没有发版纪律——这个缺口恰好在第一次发版临近时变大，因为没有任何文件说明版本住在哪里、一次切割携带什么。

## Decision

按本仓规范迁移这四个功能，而不是复制：

- inbox 与 learning 合同以英文为主档配 `.zh.md` 对照，通过枚举的根文件清单进入配对门禁；spark、`QUEUE.md` 行与学习笔记保持不设门禁的单语用户内容，与源仓一致。
- 技能平铺在 `.agents/skills/` 下（`<name>/SKILL.md`，与 `AGENTS.md` 一样纯英文）。源仓 `skills/` + `.agents/skills/` 双份布局是为 npm 分发服务的，本 kit 没有 npm 发布面——安装器就是分发渠道，单一实时副本消灭了漂移面。迁移四个技能：`kit-inbox-capture`、`kit-inbox-promote`、`kit-learning-note`、`kit-release`。
- 去掉 `ai-eng` CLI 依赖：`kit-inbox-promote` 引用 notes README 骨架而非 `verify-notes`；`kit-release` 跑本仓自己的 `pnpm run check:all`。
- 发版合同是 `docs/release.md`（配对）加带 `## Unreleased` 暂存的 `ChangeLog.md`：开发内容累积其中，切割时重命名标题、bump 根 `package.json`、改写 next-cut 署名、打 tag `v<version>`。
- 安装器新增 `workflows` 组件，把以上全部分发给脚手架与采纳项目。

## Alternatives considered

- **原样拷贝文件**。落败原因：中文为主的合同违反语言策略；双份技能布局解决的是本 kit 不存在的 npm 问题；CLI 依赖把自足的 kit 耦合到一个外部包上，换来的只是一个它并不运行的格式检查。
- **推迟到第二阶段随 `adlc-kit-py` 一起**。落败原因：灵感和发版纪律现在就需要；阶段顺序约束的是技术栈，不是工作流。
- **只迁移发版功能**。落败原因：当捕获与学习先给开发碎屑安了家，"开发永不碰 changelog"的边界更容易守住；在源仓里三者本就是一个工作流家族。

## Consequences

没有任何东西检测 `QUEUE.md` 过期——inbox 有意不设门禁，条目 `Status` 是权威，其余靠纪律；当漂移成为真实问题时，那正是引入 format gate 的时机。配对门禁通过枚举覆盖两个新 README，spark 文件永远不需要对照。这些技能可能与 ai-eng-kit 的原件漂移；按路线图 Note 的约定，kit 在打 tag 发布时同步。`ChangeLog.md` 已在 `## Unreleased` 下累积；首次切割（`v0.1.0`）尚未发生。
