---
title: OpenClaw 龙虾详细说明
date: 2026-03-09
description: OpenClaw 是一个以 Gateway 为控制平面、以 Session 为记忆单元、以 Plugin 为扩展边界的个人 AI Runtime 平台
author: Owen
email: zeyangyz@icloud.com
---

# OpenClaw 龙虾详细说明

作者：Owen 、chatgpt5.4


## 前言

OpenClaw 不是“一个命令行工具加几个聊天渠道”，也不是“一个能接 Telegram 和 WhatsApp 的 Bot”。更准确的定义是：

**OpenClaw 是一个以 Gateway 为控制平面、以 Session 为记忆单元、以 Plugin 为扩展边界的个人 AI Runtime 平台。**

它把以下能力统一组织到一个系统里：

- 聊天渠道接入
- Agent Runtime
- Workspace 上下文
- 工具执行
- 设备节点能力
- 媒体处理
- Web / App 控制面
- 插件扩展
- 诊断与运维

理解 OpenClaw 的关键，不是记住多少命令，而是建立一张清晰的系统地图：

- CLI 是入口，不是状态中心
- Gateway 是系统中枢
- Route + Session 决定消息归属与上下文边界
- Agent Runtime 负责持续角色执行
- Channel / Node 是输入输出表面
- Plugin 是长期扩展边界

---

## 第一章：建立正确心智模型

### 1.1 OpenClaw 到底是什么

一句话定义：

**OpenClaw 是一个可自托管、可跨渠道、可调用本地与远程能力的个人 AI 平台。**

它解决的不是“怎么让模型回答一句话”，而是下面这些更难的问题：

- 如何让 AI 在多个聊天渠道中长期在线
- 如何让 AI 拥有连续上下文，而不是每次都像新对话
- 如何让 AI 不只说话，还能行动
- 如何让 AI 调用设备能力、浏览器、文件系统和外部服务
- 如何让整套系统有统一状态、统一协议、统一诊断方式

所以，OpenClaw 更像一个“小型 AI 操作系统”，而不是单点功能工具。

### 1.2 它不是什么

为了避免读代码时产生错误预期，先明确它不是什么：

- 不是纯 CLI 小工具
- 不是单一聊天机器人
- 不是简单的 prompt wrapper
- 不是只做渠道接入的 SDK 封装层
- 不是“模型 API + 一些脚本”的松散集合

### 1.3 全局六层架构

从高层看，OpenClaw 可以拆成六层：

| 层 | 作用 | 关键位置 |
|---|---|---|
| 入口层 | 初始化环境并启动 CLI | `src/index.ts` |
| CLI 层 | 暴露命令，连接 Gateway，发起系统操作 | `src/cli/program/command-registry.ts` |
| Gateway 层 | 长驻后台进程，统一持有连接、状态、协议与服务装配 | `src/gateway/server.impl.ts` |
| Routing / Session 层 | 决定消息归属到哪个 agent、哪个 session | `src/routing/resolve-route.ts` |
| Agent / Tools 层 | 运行 agent、注入 workspace、调度工具 | `docs/concepts/agent.md`、`docs/tools/index.md` |
| Plugin / Extension 层 | 注册 channel、tool、hook、provider、service、CLI 能力 | `src/plugins/registry.ts`、`src/plugins/runtime.ts` |

### 1.4 系统总图

```text
CLI / WebChat / macOS App / iOS-Android Node / Chat Channels
                           |
                           v
                        Gateway
                           |
        +------------------+------------------+
        |                                     |
   Routing + Session                    Plugin Runtime
        |                                     |
        +------------------+------------------+
                           |
                      Agent Runtime
                           |
   Tools / Browser / Canvas / Nodes / Media / Providers / Outbound
```

这张图里最关键的判断只有一个：

**OpenClaw 的核心不是输入输出界面，而是 Gateway 中枢与它背后的运行时模型。**

---

## 第二章：启动与 CLI 体系

### 2.1 入口文件 `src/index.ts`

入口文件 `src/index.ts` 不长，但它定义了整个项目的启动纪律。

它做的事可以概括为：

1. 加载 `.env`
2. 标准化环境变量
3. 确保 `openclaw` CLI 路径可被运行时找到
4. 打开 console capture 与结构化日志
5. 校验 Node 运行时版本
6. 构建 CLI 程序
7. 安装全局异常处理
8. 执行 `program.parseAsync(process.argv)`

这里最重要的工程判断有三个：

- **环境先于业务**
- **错误尽量尽早暴露**
- **入口保持最小职责**

这说明 OpenClaw 把自己当作长期运行系统，而不是一段脚本。

### 2.2 CLI 不是状态中心

CLI 构建入口在 `src/cli/program/build-program.ts`，命令总表在 `src/cli/program/command-registry.ts`。

CLI 在 OpenClaw 中的角色非常清晰：

- 它是人类操作入口
- 它不是长期状态中心
- 它不直接成为系统的真相源
- 它的大多数动作最终都交给 Gateway 执行

这和很多“命令行即系统”的项目不同。  
OpenClaw 更像是：CLI 只是驾驶舱，发动机在别处。

### 2.3 CLI 的命令谱系

CLI 命令大致可以分成四类：

| 类别 | 代表命令 | 作用 |
|---|---|---|
| 安装与配置 | `setup` `onboard` `configure` `config` | 建立 workspace、gateway、auth、service |
| 运行与交互 | `agent` `message` `browser` | 发起 agent run、消息动作、浏览器操作 |
| 观测与巡检 | `status` `health` `sessions` `memory status` | 查看健康状态、会话、资源与使用情况 |
| 维护与修复 | `maintenance` `doctor` | 配置迁移、诊断、修复服务问题 |

### 2.4 为什么命令按 register 文件拆开

命令并不是全部堆在一个大 commander 文件中，而是拆成多个注册文件，例如：

- `src/cli/program/register.onboard.ts`
- `src/cli/program/register.agent.ts`
- `src/cli/program/register.message.ts`
- `src/cli/program/register.status-health-sessions.ts`

这种拆法的意义不是“代码风格更好看”，而是：

- 每个命令域有明确边界
- 命令可以独立演化
- 便于插件式扩展
- 上层 CLI 组合逻辑保持稳定

### 2.5 `onboard`、`agent`、`message` 的不同定位

#### `onboard`

`onboard` 是产品化安装入口，不只是引导写配置。它覆盖：

- workspace 目录
- local / remote mode
- auth 方案
- gateway port / bind / auth
- daemon 安装
- tailscale
- channels
- skills
- health check

这说明 OpenClaw 把“上手成本”当作产品问题来解决。

#### `agent`

`agent` 命令不是简单“给模型发一句话”。它实际上是在：

- 指定或推导 agent
- 指定或推导 session
- 选择 thinking / verbose 策略
- 决定是否把结果重新投递到某个渠道

也就是说，`agent` 代表的是一次正式的系统执行回合。

#### `message`

`message` 命令代表的是“通信动作控制面”，而不是单纯发文本。它支持：

- 发送文本 / 媒体
- broadcast
- poll
- reaction
- pin
- edit / delete
- thread 相关动作
- 某些平台的 admin action

这反映出 OpenClaw 的消息系统不是“AI 回复通道”，而是“可编排通信层”。

### 2.6 CLI 的快速路由执行

`command-registry.ts` 里有 `RouteSpec` 机制。  
它允许某些高频命令在完整 commander 树之外被快速判断与执行，例如：

- `status`
- `health`
- `sessions`
- `memory status`

这一点很工程化：

- 高频运维命令应尽量轻
- 不必为每次健康检查装配整棵命令树
- 某些命令甚至可以按需决定是否加载插件

这说明 CLI 不只是语法层，也承担执行调度优化。

---

## 第三章：Gateway，系统中枢

### 3.1 为什么 Gateway 是 OpenClaw 的核心

核心文件是 `src/gateway/server.impl.ts`。  
这是整个项目最值得反复阅读的文件之一。

Gateway 是：

- 长驻后台进程
- 唯一长期状态中心
- 渠道连接持有者
- session 真相源
- WebSocket / HTTP 协议面
- node 调度中心
- agent 执行入口
- 插件宿主

它不是简单意义上的“服务端”，而是 OpenClaw 的控制平面内核。

### 3.2 Gateway 启动链分层理解

Gateway 启动时并不是直接 `listen(port)`，而是先经历一条很完整的装配链：

1. 读取配置快照
2. 检查并迁移 legacy config
3. 验证配置是否合法
4. 自动启用某些插件
5. 解析 runtime config
6. 装配 model catalog / channel manager / node registry / plugin registry
7. 初始化 heartbeat / maintenance / cron / reload handler
8. 准备 browser / canvas sidecar
9. 最后才进入对外服务状态

这说明 Gateway 的职责不是“暴露接口”，而是“建立完整运行态”。

### 3.3 为什么系统必须只有一个 Gateway 真相源

如果系统让 CLI、WebChat、App、channels 各自维护自己的状态，会立即出现几个问题：

- session 分裂
- health / presence 分裂
- auth 逻辑分裂
- tools / node invoke 执行边界分裂

OpenClaw 通过 Gateway 把这一切收口，这个设计非常关键。  
它的好处是：

- 所有客户端面对同一份 session truth
- 所有事件走同一条总线
- local / remote 差异只体现在网络拓扑，而不是语义

### 3.4 Gateway 的协议模型

Gateway 对外暴露的是统一协议模型：

- 首帧 `connect`
- 后续 `req/res`
- 服务端推送 `event`

这套模型意味着：

- CLI 不是走特殊后门
- WebChat 不是另一套私有协议
- 节点也不是另一个独立系统

它们都是 Gateway 世界里的不同客户端角色。

### 3.5 Gateway 更像应用容器，而不是 Web Server

如果用更高层的话来描述，Gateway 实际上在做三件事：

- 装配子系统
- 仲裁运行时状态
- 暴露统一控制协议

这是典型的“宿主平台”形态，而不是传统“REST 接口服务”。

---

## 第四章：Routing 与 Session，消息归属法则

### 4.1 Route 解决的是“谁来处理”

核心文件是 `src/routing/resolve-route.ts`。

Routing 不负责回复内容，它只解决两件事：

- 选出 `agentId`
- 构造 `sessionKey`

这是 OpenClaw 系统行为最关键的边界之一。  
因为它明确告诉你：

**消息归属由宿主系统决定，不由模型决定。**

### 4.2 Routing 的输入为什么这么丰富

Routing 不是只看 channel，它还会用到：

- `channel`
- `accountId`
- `peer`
- `parentPeer`
- `guildId`
- `teamId`

原因是不同平台的消息结构不同：

- Telegram 有 group / topic
- Discord 有 guild / channel / thread
- Slack 有 team / channel / thread
- WhatsApp 有 peer / group

如果只按 channel 路由，系统会丢掉大部分真实上下文。

### 4.3 路由优先级是系统行为的稳定器

OpenClaw 的路由优先级是从最具体到最宽泛：

1. `binding.peer`
2. `binding.peer.parent`
3. `binding.guild`
4. `binding.team`
5. `binding.account`
6. `binding.channel`
7. `default`

这套顺序的价值在于：

- 明确
- 可解释
- 可预测
- 易于调试

系统甚至会在结果里给出 `matchedBy`，解释这次为什么命中当前路由。

### 4.4 Session 不是聊天窗口，而是系统主键

Session 文档在 `docs/concepts/session.md`。

在 OpenClaw 里，SessionKey 同时承担：

- 会话历史索引
- 并发控制索引
- transcript 持久化索引
- token usage 统计维度
- UI 会话展示主键

这就是为什么我一直强调：

**Session 在 OpenClaw 里更像数据库主键，而不是聊天框概念。**

### 4.5 DM、Group、Thread 为什么要区别对待

不同类型的对话在语义上天然不同：

- DM 更适合承载连续个人记忆
- Group 更适合隔离公共上下文
- Thread 适合局部话题连续性

OpenClaw 把这些差异写进 SessionKey 设计里，因此不会把所有消息都糊成一个大上下文桶。

### 4.6 `dmScope` 体现的是产品哲学

`session.dmScope` 支持：

- `main`
- `per-peer`
- `per-channel-peer`
- `per-account-channel-peer`

这不是小配置，而是系统哲学选择：

- `main` 适合个人 AI 助手，强调连续记忆
- 更细粒度的 scope 适合多账号、多租户、多入口隔离

---

## 第五章：Agent Runtime，持续角色执行器

### 5.1 Agent 不是一次模型调用

OpenClaw 的 Agent 不是“一次 chat completion”，而是一个持续角色执行体。

它至少由四部分组成：

- workspace
- session history
- identity / user profile
- tools

这使得它更像一个长期在线的角色，而不是一次性响应函数。

### 5.2 Workspace 文件体系为什么关键

Agent 会从 workspace 注入这些文件：

- `AGENTS.md`
- `SOUL.md`
- `TOOLS.md`
- `BOOTSTRAP.md`
- `IDENTITY.md`
- `USER.md`

这几份文件分别承载：

- 行为规则
- 人格风格
- 工具使用建议
- 初始化过程
- 身份设定
- 用户画像

这比单个 system prompt 更有层次，也更利于长期维护。

### 5.3 多 Agent 真正意味着什么

多 agent 不是换个名字而已。  
每个 agent 可以拥有：

- 独立 workspace
- 独立 model 偏好
- 独立 session store
- 独立 identity
- 独立 bindings

这使得 support、ops、research、personal 等 agent 真正能成为不同“脑区”，而不是同一个脑子的不同别名。

### 5.4 Runtime 为什么还要关心 queue、streaming、compaction

Agent 一旦进入长期运行，就会自然遇到：

- 队列消息如何处理
- 流式输出如何切块
- 历史如何压缩
- token 窗口如何节制

这说明 OpenClaw 的目标不只是“让模型答一句”，而是让它在长时间、多轮、多工具场景下持续稳定工作。

---

## 第六章：Channel 系统，消息世界的标准化层

### 6.1 Channel 系统的真正工作

Channel 层不是简单把 Telegram SDK、Discord SDK 包一下。  
它真正做的是把异构平台的消息模型统一成内部可处理语义。

OpenClaw 需要标准化的内容包括：

- DM
- group
- channel / room
- thread / topic
- account
- mention
- reply context
- sender identity

### 6.2 `src/channels/registry.ts` 是渠道语义字典

这个文件不只是列出渠道名称。它定义了：

- 标准 channel id
- 别名归一化
- 展示顺序
- 文档路径
- 用户可见文案

所以在 OpenClaw 里，渠道首先是“系统实体”，其次才是“某个平台接入实现”。

### 6.3 运行时渠道视图来自 plugin registry

`src/channels/plugins/index.ts` 会从 active plugin registry 中拿到当前可用渠道集合，然后做排序和去重。

这一步很重要，因为它说明：

- 渠道是运行时能力
- 官方渠道和扩展渠道共享同一抽象层
- 上层共享逻辑不需要 import 具体 connector

### 6.4 渠道层与安全边界天然相连

渠道层不只是识别消息，还会为后续治理提供基础信息：

- 这是私聊还是群聊
- 当前是否能检测 mention
- 是否存在 reply context
- 当前平台的 outbound 能力边界是什么

所以它虽然不是 policy 层，但它决定了 policy 层能否正确判断。

---

## 第七章：消息治理与安全边界

### 7.1 为什么 OpenClaw 不会“收到就回”

因为它接入的是现实消息世界，而不是受控 demo 环境。  
所以每条消息在进入 Agent 之前，都可能经历：

- pairing 检查
- allowlist 检查
- mention gating
- command gating
- send policy 约束

这让 OpenClaw 能够在真实群聊、DM、跨渠道环境中保持可控。

### 7.2 mention gating 是群聊行为的关键边界

相关代码在 `src/channels/mention-gating.ts`。

它会综合判断：

- 是否要求 mention
- 是否能检测 mention
- 是否真的被 mention
- 是否有隐式 mention
- 是否允许命令 bypass

如果群聊未满足触发条件，系统可以安全地跳过，不进入 Agent Runtime。

### 7.3 为什么 pairing 与 allowlist 必不可少

一个长期在线、可执行工具的 agent，如果默认相信所有 DM，是非常危险的。

OpenClaw 的设计倾向是：

- 默认保守
- 通过 pairing code / allowlist 建立显式信任
- 让风险从宿主层被拦住，而不是靠 prompt 临时约束

---

## 第八章：Tools，Agent 的行动边界

### 8.1 没有工具，OpenClaw 只是另一个聊天机器人

OpenClaw 真正的核心价值之一，是它让 Agent 具备行动能力，而不只是文本生成能力。

工具体系包括：

- 文件与补丁：`read` `write` `edit` `apply_patch`
- 运行与进程：`exec` `process`
- 浏览器与 UI：`browser` `canvas`
- 节点与设备：`nodes`
- 消息与会话：`message` `sessions_*`
- 记忆：`memory_*`

### 8.2 Tool Policy 才是硬边界

Workspace 文件可以建议如何使用工具，但真正决定“能不能用”的，是 Tool Policy。

OpenClaw 支持：

- `allow`
- `deny`
- `profile`
- `byProvider`
- agent-specific override

这意味着系统的强能力不会无边界外溢。

### 8.3 为什么安全边界必须在宿主层

如果危险能力只靠 prompt 约束，例如“请不要执行危险命令”，那并不可靠。  
真正可信的边界必须放在宿主层：

- gateway policy
- tool policy
- node permission
- auth / allowlist

这是 OpenClaw 能做强 Agent 又不完全失控的前提。

---

## 第九章：Media、Nodes、Canvas，文本之外的扩展面

### 9.1 Media 让输出变成结构化多模态结果

核心文件：

- `src/media/parse.ts`
- `src/media/server.ts`

`MEDIA:` 协议的意义在于：

- 文本与媒体资源解耦
- 模型输出可以结构化表达“这是文本 + 这是媒体”
- 音频可以显式标记为 voice 模式

这不是“发送附件的小功能”，而是输出协议层面的升级。

### 9.2 临时媒体服务解决的是本地生成与远程投递之间的桥接问题

`src/media/server.ts` 不是普通静态文件服务，而是一个受控的临时媒体桥：

- 校验路径是否合法
- 限制大小
- 限制 TTL
- 发完后删除

这样本地生成内容才能安全地进入远程消息渠道。

### 9.3 Node 让设备变成 Agent 的外设

Node 接入 Gateway 后，可以暴露：

- `canvas.*`
- `camera.*`
- `screen.record`
- `location.get`
- 某些系统命令和通知能力

这意味着 Agent 不再只能“建议你做什么”，而是能借宿主系统去触达真实设备。

### 9.4 Canvas 的意义是让 Agent 有视觉工作表面

Canvas 说明 OpenClaw 不只想做对话型 AI。  
它还想让 Agent 能把结果投影到一个可视表面上，让用户在消息之外看到 Agent 工作状态与输出结构。

这使得 OpenClaw 更接近“AI 运行环境”，而不是“消息机器人后端”。

---

## 第十章：Plugin / Extension，第二内核

### 10.1 为什么 Plugin System 可以被称作第二内核

核心文件：

- `src/plugins/registry.ts`
- `src/plugins/runtime.ts`

插件系统覆盖的面非常广：

- channels
- tools
- hooks
- providers
- gateway handlers
- http routes
- cli registrars
- services
- diagnostics

这已经不是“可选小扩展”，而是整个平台的能力增长机制。

### 10.2 Plugin Registry 的真正价值

Plugin Registry 把扩展能力从“散落在各处的自定义逻辑”提升为：

- 可注册
- 可观测
- 可描述
- 可统一装配

它定义的不只是列表，而是一整套系统认可的扩展接口。

### 10.3 Runtime 激活让插件变成运行时事实

`src/plugins/runtime.ts` 的作用是维护 active plugin registry。

这意味着系统可以在任意时刻明确回答：

- 现在有哪些插件生效
- 现在有哪些 channel 可用
- 现在有哪些工具是运行时能力

这一步使插件从“代码存在”变成“系统事实”。

### 10.4 为什么 `extensions/` 代表的是官方生态区

`extensions/` 不是 demo 区，也不是杂项文件夹。  
它体现的是 OpenClaw 的一个核心方向：

**能力应尽可能通过稳定边界扩展，而不是持续侵入 core。**

这也是为什么 voice-call、matrix、nostr、msteams 等功能更适合存在于 extension 形态。

---

## 第十一章：运维体系，项目成熟度的体现

### 11.1 `onboard` 让安装成为正式系统能力

OpenClaw 把 onboarding 做成命令，而不是只给一堆 README 文本。  
它会引导用户配置：

- workspace
- gateway mode
- auth
- daemon
- channels
- skills
- health check

这说明项目把“第一次运行成功”当作正式产品目标。

### 11.2 `status` 与 `health` 让系统有自解释能力

复杂系统最怕的是：出了问题只能靠猜。  
OpenClaw 提供：

- `health`：最小健康探针
- `status`：更完整的状态与问题摘要

这使得用户和维护者都可以先从系统视角理解问题，而不是直接下沉到源码和日志。

### 11.3 `doctor` 是这个项目成熟度最高的命令之一

`src/commands/doctor.ts` 不只是“打印建议”，它实际会处理或提示：

- gateway.mode 缺失
- auth 风险
- legacy config / state migration
- sandbox 问题
- gateway service 配置问题
- 平台级运行问题
- 模型配置健康度

这说明 OpenClaw 不把诊断交给用户的经验，而是尽可能把诊断写进系统。

---

## 第十二章：实战链路理解

### 12.1 一条消息如何从渠道进入系统

完整链路可以概括为：

```text
Channel Input
  -> Normalize
  -> Governance
  -> Route
  -> Session
  -> Agent Runtime
  -> Tools / Nodes / Media
  -> Outbound Adaptation
  -> Channel Output
```

这是理解 OpenClaw 的最关键链路。

### 12.2 一次 `openclaw agent --message ...` 如何进入系统

CLI 不会默认自己偷偷跑一套独立状态。  
标准路径是：

```text
CLI
  -> Gateway
  -> resolve agent/session
  -> Agent Runtime
  -> optional delivery
```

这进一步说明 CLI 只是入口，不是中心。

### 12.3 一个插件如何进入运行时

插件的生命周期可以概括为：

```text
Plugin source
  -> Registry registration
  -> Runtime activation
  -> System-visible capability
```

这解释了为什么 OpenClaw 的扩展能力不是外挂，而是平台内部正式成员。

### 12.4 一个 Session 的生命周期

Session 从路由命中开始，经由：

- 创建
- 复用
- reset
- compaction
- pruning

不断演化。  
它不是单一聊天记录，而是系统连续性的主键。

---

## 第十三章：架构复盘与工程判断

### 13.1 OpenClaw 架构最值得称赞的地方

如果做架构复盘，OpenClaw 至少有四个明显优点：

- Gateway 作为唯一真相源，避免状态分裂
- Route + Session 明确建模，行为可解释
- Plugin System 是真实扩展边界，不是口号
- Onboard / Status / Doctor 形成成熟运维闭环

### 13.2 它付出的代价

这些优点伴随的代价也很明显：

- Gateway 成为高复杂度核心
- Session / Route 学习曲线较高
- 插件系统会持续面临 API 稳定性压力
- Workspace + Session + Policy 三层模型让调试更复杂

### 13.3 最值得借鉴的设计

如果把 OpenClaw 当作架构样本，最值得借鉴的是：

- 中心化控制平面
- 显式 Route + Session 模型
- 正式插件注册中心
- 产品化安装与诊断
- Workspace 角色化上下文设计

### 13.4 未来最容易增长复杂度的地方

从架构演化看，最值得持续警惕的是：

- Gateway 进一步膨胀
- 插件边界失稳
- 渠道抽象压坏平台特性
- Session 模型不断叠加特例
- Tool Policy 与真实使用需求之间的长期张力

### 13.5 二次开发最应该遵守的边界

如果要基于 OpenClaw 做扩展，最应该坚持的几条边界是：

- 不要让 CLI 成为第二状态中心
- 不要绕过 Route + Session 体系
- 不要让插件直接深啃 core 私有实现
- 不要把真正安全边界只写在 prompt 里
- 不要忽视 status / doctor / observability

### 13.6 总评

如果做一句架构总评：

**OpenClaw 最有价值的地方，不是它接了很多渠道，也不是它支持很多工具，而是它已经建立了一套清晰的 Agent 平台架构语言。**

这套语言包含：

- Gateway 作为中枢
- Session 作为记忆单元
- Agent Runtime 作为持续角色执行器
- Plugin 作为扩展边界
- Tools / Nodes / Media / Canvas 作为行动与呈现表面

这使得它比“聊天机器人项目”更像“AI 平台项目”。

---

## 附录 A：推荐源码阅读顺序

建议按以下顺序阅读：

1. `src/index.ts`
2. `src/cli/program/command-registry.ts`
3. `src/gateway/server.impl.ts`
4. `src/routing/resolve-route.ts`
5. `src/channels/registry.ts`
6. `src/plugins/registry.ts`
7. `docs/concepts/architecture.md`
8. `docs/concepts/session.md`
9. `docs/concepts/agent.md`
10. `docs/tools/index.md`

---

## 附录 B：一句话记住 OpenClaw

**OpenClaw 是一个以 Gateway 为中枢、以 Session 为记忆单元、以 Agent Runtime 为执行核心、以 Tools 为行动边界、以 Channel 与 Node 为输入输出表面、以 Plugin 为扩展机制的个人 AI 平台。**

<div class="watermark">Owen & 零食有鸣© 2026 请勿外传</div>