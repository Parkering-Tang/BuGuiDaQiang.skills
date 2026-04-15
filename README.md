# Buguidaqiang (不鬼打墙)

> 护栏优先的 AI 编程助手系统 - 防止陷入 AI 编程的死循环和混乱

## 名字含义

**"不鬼打墙"** - AI 编程时最怕的就是：
- 改了 A，坏了 B
- 越改越乱，越乱越改
- 陷入"改 bug → 引入新 bug → 再改"的死循环
- 最后不知道自己改了什么，也不知道怎么恢复

这个系统就是一面"墙"，挡住这些混乱，让 AI 编程不再鬼打墙。

---

## 核心理念

**AI 编程的真正问题不是"AI 不会写代码"，而是"AI 太听话了"。**

AI 会毫无保留地执行一个经验不足用户的危险请求，即使这个请求在架构上是灾难性的。Buguidaqiang 是一个护栏系统，强制在写代码前完成：

- 需求澄清
- 风险评估
- 影响审查
- 数据安全检查
- 验证后才算完成

## 目标用户

- 非技术或弱技术用户
- 无法判断架构、schema、副作用、验证、回滚、范围蔓延
- 可能没有 Git
- 不知道如何恢复文件

## 两个版本

### 🌟 纯提示词版本（推荐非技术用户）

**无需安装任何依赖，下载即用。**

```
pure-prompts/
├── README.md              # 使用说明
├── skills/                # 直接复制到 AI 工具的 skill 目录
│   ├── safe.md            # 主入口
│   ├── clarify.md         # 需求澄清
│   ├── scope-guard.md     # 范围守护
│   ├── schema-guard.md    # 数据安全
│   ├── rollback.md        # 回滚安全
│   ├── implement.md       # 安全实现
│   ├── verify.md          # 验证完成
│   └── assess.md          # 只评估不执行
└── examples/              # 示例会话
```

**使用方式**：
1. 下载 `pure-prompts/` 文件夹
2. 把 `skills/` 里的文件复制到 AI 工具的 skill 目录
3. 开始使用

**支持**：Claude Code、OpenCode、Codex 等支持自定义 skill 的 AI 工具

### 工具库版本（适合技术用户）

需要 Node.js 环境，提供更精确的代码分析能力。

```
core/tools/                # TypeScript 工具库
├── src/
│   ├── git-detector.ts    # Git 检测
│   ├── snapshot-manager.ts # 快照管理
│   ├── project-analyzer.ts # 项目分析
│   ├── verifier-runner.ts  # 验证执行
│   ├── state-tracker.ts    # 状态追踪
│   └── code-style-analyzer.ts # 代码风格分析
└── dist/                   # 编译产物
```

## 核心功能

### 用户命令

| 命令 | 用途 |
|------|------|
| `/safe "描述"` | 安全完成一个变更请求 |
| `/assess "描述"` | 只评估风险，不执行 |

### 核心技能

1. **clarify** - 改写用户请求，确认共识
2. **scope-guard** - 确保不越界
3. **schema-guard** - 保护数据安全
4. **rollback** - 创建恢复点
5. **implement** - 约束实现
6. **verify** - 验证完成

## 快速开始

### 纯提示词版本

```bash
# 1. 复制 skill 文件到 AI 工具目录
cp pure-prompts/skills/*.md ~/.claude/skills/

# 2. 在项目中使用
/safe 帮我改一下登录页面
```

### 工具库版本

```bash
cd core/tools
npm install
npm run build
```

## 版本对比

| 特性 | 纯提示词版本 | 工具库版本 |
|------|------------|-----------|
| 安装要求 | 无 | 需要 Node.js |
| 使用方式 | 复制文件 | npm 安装 |
| 代码风格分析 | AI 分析 | 程序分析 |
| 快照管理 | 系统命令 | TypeScript 代码 |
| 适用人群 | 非技术用户 | 技术用户 |
| 跨平台 | 完全兼容 | 需要 Node.js |

## 项目结构

```
buguidaqiang/
├── pure-prompts/           # 🌟 纯提示词版本（推荐）
│   ├── skills/             # skill 文件
│   └── examples/           # 示例
├── core/
│   ├── skills/             # 技能定义（详细版）
│   └── tools/              # TypeScript 工具库
└── README.md
```

## GitHub

🔗 https://github.com/Parkering-Tang/BuGuiDaQiang.skills

## 许可证

MIT
