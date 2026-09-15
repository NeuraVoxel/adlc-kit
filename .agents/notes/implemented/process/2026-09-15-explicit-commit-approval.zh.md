# Agent Note: commits and pushes require explicit user approval

Status: implemented

## Problem

开发循环里没有关于"何时提交"的成文规则，agent 完成变更后可能直接 `git commit`——可评审单元于是只能事后存在，验收退化为阅读一个已经做出的提交，而不是对变更本身说 yes。

## Decision

根 `AGENTS.md` 增加一条站立命令：完成一次变更以最窄的相关证据和一份汇报收尾；`git commit` 与 `git push` 只在当轮用户明确要求时执行。这约束包括文档和杂务在内的每一次提交；发版切割（[docs/release.md](../../../../docs/release.md)）是同一纪律的上一层——它自身也是一次显式请求。该规则经安装器的 `rules` 组件分发给采用者，因为它住在 `AGENTS.md` 里。

## Alternatives considered

- **继续靠逐次口头要求，不成文**。落败原因：这套约定只在维护者每次显式要求提交时才成立；第一个自动化或疏忽的会话就会打破它，而且没有任何文档告诉 agent 这条边界存在。
- **只限制 `git push`，提交放开**。落败原因：可评审单元是变更本身，不是它的发布；一次未经要求的本地提交已经决定了历史、消息粒度和验收的含义。

## Consequences

工作会积压在工作树里直到维护者验收，因此汇报必须说明改了什么、跑了什么证据——未提交的变更是一次开发回合的正常终点，不是故障。人提交时 pre-commit 钩子照常运行，门禁层不受影响。发版合同的"仅在显式请求时切割"从此成为一般规则的特例，不再是孤立的例外。
