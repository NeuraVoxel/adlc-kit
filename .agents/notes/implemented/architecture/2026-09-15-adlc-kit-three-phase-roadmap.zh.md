# Agent Note: adlc-kit three-phase roadmap and cross-stack adoption rule

Status: implemented

## Problem

adlc-kit 系列要覆盖 TypeScript 单栈、Python 单栈与混合三种形态。如果一次性搭建全栈骨架，未经验证的接缝会被固化进模板，而且每接入一种新技术栈都要改动全部 kit 的骨架。

## Decision

按三阶段建 kit：`adlc-kit-ts`（TS 前后端单栈）→ `adlc-kit-py`（Python 单栈）→ `adlc-kit`（TS+Python 集成形态）。`adlc-kit` 不是第三个从零建的 kit：它由前两个 kit 的内容加上 `packages/contracts/` 与 `ci-contracts`、`ci-e2e` 两条泳道组成。跨栈共享物只允许两种形态：契约 schema 与提交在 git 里的 fixtures（双端离线回放）；活进程验证只存在于 e2e 泳道。接入规则已写入各 kit 根 AGENTS.md：新技术栈先建独立语言根 + 独立泳道并全绿，然后才建跨栈接缝。

## Alternatives considered

- **一步到位搭建全栈骨架**。落败原因：接缝机制（生成物、双端 same-PR、e2e）在单栈独立验证之前没有可运行的对照面，返工成本会落在每一步；初始复杂度还会推迟第一步的可用时间。
- **单一 monorepo 按阶段演化同一个仓库**。落败原因：三个 kit 是独立可采用的模板产品；单仓演化会让采用者背上他们用不到的另外两个栈的门禁与依赖，违背 kit 的独立验证目标。

## Consequences

共享骨架（run-gates、lefthook、AGENTS.md 模板、notes 体系）以 `adlc-kit-ts` 为参考实现，其余 kit 从它派生；三份拷贝允许各自演化，kit 发布打 tag 时同步一次。代价是骨架的短期三份重复——未来若引入克隆检测门禁，需把 `scripts/` 纳入豁免或先建派生同步机制。收益是每一阶段都有全绿门禁作为下一阶段的出发点和回归基线。
