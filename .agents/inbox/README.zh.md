# Inbox

未承诺灵感的排队区：先捕获、不承诺必做；在 `QUEUE.md` 扫未完成项；值得做的再升格为正式 Agent Note。

## 边界

- **在一切 format gate 之外。** 门禁只扫 `.agents/notes/`；inbox 靠本 README 与人工 / Agent 纪律约束。
- **不是学习笔记。** 复盘与过程样例放 [`.agents/learning/`](../learning/README.md)；复盘里冒出的灵感落到这里，learning 只链过来。
- **不是决策记录。** 值得正式审阅的想法升格为 `notes/proposed/` 下的 Agent Note；禁止把 inbox 文件改名或移进 notes 树。

同一想法不要同时以权威待办存在于 inbox 与 learning 两处。

## 条目语言

正文默认用中文写；Status 取值、路径、命令与术语保留英文（例如 Agent Note、`QUEUE.md`、`Status: open`）。

## 布局

| 路径 | 职责 |
|---|---|
| `README.md` | 本目录合同 |
| `QUEUE.md` | checkbox 排队板（扫队列读它） |
| `yyyy-mm-dd-slug.md` | 一条灵感；文件名日期 = 捕获日 |

## 单条文件形状

```markdown
# Inbox: <短标题>

Status: open

## Spark
<几句：想法是什么、为何此刻记下>

## Notes
（可选）上下文、链接、粗略代价；勿写成 Proposal 骨架
```

`Status` 取值：

- `open`——仍在排队
- `promoted`——已升格离队；正文须链到归属 Agent Note
- `discarded`——已丢弃离队；Status 旁或 `## Notes` 里写一行原因

形状没有门禁检查，靠本 README 与纪律约束。

## QUEUE.md

- `[ ]` 表示 `open`。
- `[x]` 表示已离队（`promoted` 或 `discarded`）；升格行链到 Agent Note；丢弃行可附短原因。
- 顺序：捕获日新 → 旧。

每次捕获、升格、丢弃都须在同一变更中改条目文件并更新 `QUEUE.md` 对应行。不一致时以条目 `Status` 为准，修那一行。

## 捕获

1. 新建 `yyyy-mm-dd-slug.md`，`Status: open`，`## Spark` 写几句即可。
2. 在 `QUEUE.md` 顶部（新 → 旧）加一行 `- [ ] [标题](./yyyy-mm-dd-slug.md)`。

也可使用随 kit 安装的技能（kit 创作的技能平铺在 `.agents/skills/` 下）：

| Skill | 用途 |
|---|---|
| [kit-inbox-capture](../skills/kit-inbox-capture/SKILL.md) | 只需主体（可选标题 / slug / Notes）：写 spark 并更新 `QUEUE.md` |
| [kit-inbox-promote](../skills/kit-inbox-promote/SKILL.md) | 明确升格某条 `open` spark 为 `proposed/` Agent Note，并改状态与队列 |

捕获不升格；升格须当轮明确提出。

## 扫队列

打开 `QUEUE.md`，只看 `[ ]` 行；需要更多上下文再点开条目文件。不强制回顾节奏。

## 升格

1. 确认这条 spark 值得写完整、认真审阅的 Agent Note。
2. 在 `.agents/notes/proposed/<class>/yyyy-mm-dd-….md` 新建正式 note——禁止通过改名或移动 inbox 文件产生。
3. 双向互链：proposed note 链 spark；spark 改为 `Status: promoted` 并链 note。
4. `QUEUE.md` 对应行改 `[x]`，附 Agent Note 链接。
5. 优先同一变更完成；若拆提交，结束时双向链接必须齐全。

Agent 可代写条目并更新 `QUEUE.md`；除非当轮人明确要求，Agent 不得自行升格。

## 丢弃

1. 条目改为 `Status: discarded`，附一行短原因。
2. 对应行改 `[x]`（可选附短原因）。
3. 默认保留文件；仅在没有引用价值时删除，并去掉对应行。
