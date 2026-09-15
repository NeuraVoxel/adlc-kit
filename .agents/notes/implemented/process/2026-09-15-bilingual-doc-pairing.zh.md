# Agent Note: English-primary paired docs with a structural pairing gate

Status: implemented

## Problem

本 kit 的文档最初只有中文。kit 是被其他项目、甚至其他团队采用的模板，单一语言限制了受众；而没有门禁的双语文档，任何一侧单独更新时就会漂移。

## Decision

面向人的文档以英文为主档，同一变更内更新 `.zh.md` 中文对照：`README.md`、`docs/*.md` 与 `.agents/notes/**/*.md`。唯一豁免是 `AGENTS.md`——面向 agent 的站立命令保持纯英文，以约束模型上下文。`scripts/verify-doc-pairing.ts` 拒绝缺失或孤儿的对照文件，以及配对间的章节数或代码块漂移；它挂在 `doc-sync` 聚合里，`check-all` 会运行它。规范章节名在对照文件中保持英文，这正是结构化校验有意义的前提。

## Alternatives considered

- **中文为主、英文对照**。落败原因：kit 的站立命令与门禁词汇都是英文（AGENTS.md、oxlint、run-gates）；让主语言偏离工具链词汇，等于给每次规则修改加一道翻译工序。
- **仅英文、不做对照**。落败原因：维护团队以中文工作；砍掉对照是用评审者的阅读舒适度换翻译工作量——在文档集还很小的时候是笔亏本交易。
- **深一致性配对（manifest、sidecar、术语表），如起源仓库 deepseek-harness**。推迟：那套机制匹配该仓库的文档体量；在七个配对文件的规模下，结构化门禁以极小的机制成本提供了大部分防漂移能力。等术语争议真实发生时再升级。

## Consequences

每次文档编辑现在都要动两个文件，门禁把"忘了另一侧"从静默漂移变成红灯。AGENTS.md 与包 README 保持单语，配对面被有意收窄。配对门禁随安装器的 `gates` 与 `docs` 组件一起分发，从本 kit 脚手架或采纳的项目自动继承同一策略。
