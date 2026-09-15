# Agent Note: per-subtree AGENTS.md supplements

Status: implemented

## Problem

全部工程规则都住在根 `AGENTS.md` 里，只在单个模块内才有意义的义务——server 响应与契约的关系、web 产物允许导入什么、安装器改一个组件必须动几处——没有 home 在它们所治理的代码旁边。根文件若承载它们，只会让每个会话加载的上下文膨胀。

## Decision

按 deepseek-harness 的分层方式新增四个子树指令文件：`server/AGENTS.md`、`apps/web/AGENTS.md`、`packages/AGENTS.md`（每包一节：contracts 接缝与安装器）和 `scripts/AGENTS.md`。每个只陈述该子树特有的义务，链接它依赖的接缝规则，不复述根约定；每个带 `CLAUDE.md` 符号链接。子树文件随 `new` 模式的整仓拷贝进入脚手架，但**有意不加入** `rules` 采纳组件——它们的路径描述的是本 kit 的布局，采用者项目并不共享。根文件增加一行指路，点名四个子树。

## Alternatives considered

- **每包一个文件（拆开 `packages/`，共五个）**。在此规模落败：包数量多两个数量级的 deepseek-harness 仍只保留一个组级 `packages/AGENTS.md`；两个包不配各占一个文件。
- **把模块特有规则继续塞进根文件**。落败原因：大多数工作触不到的规则让每个会话支付上下文代价，根文件还会漂向预算墙。
- **等漂移出现再补**。落败原因：接缝规则（原始数据而非展示）和安装器的四处修改规则已经在对话里被反复口述；没写下来的义务正是会腐烂的那些。

## Consequences

规则住到了它们治理的代码旁边，根文件保持精瘦。代价是四个文件成为同步义务：某条规则在子树里不再为真时，必须随代码变更同 PR 迁移或删除。采纳模式的项目只获得根纪律；采用者布局若与本 kit 收敛，自行拷贝子树文件——路线图的 tag 发布同步把它们视为 kit 内容。
