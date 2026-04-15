# Buguidaqiang 纯提示词版本

> 无需安装任何依赖，下载即用

## 这是什么？

这是 Buguidaqiang 的纯提示词版本，专为非技术用户设计。

**不需要**：
- ❌ 安装 Node.js
- ❌ 运行 npm install
- ❌ 编译任何代码

**只需要**：
- ✅ 下载这个文件夹
- ✅ 把 skills/ 里的文件复制到你的 AI 工具的 skill 目录
- ✅ 开始使用

## 支持的 AI 工具

- Claude Code
- OpenCode
- Codex
- 其他支持自定义 skill 的 AI 编程工具

## 快速开始

### Claude Code 用户

```bash
# 1. 复制 skill 文件
cp skills/*.md ~/.claude/skills/

# 2. 在项目中使用
/safe 帮我改一下登录页面
```

### OpenCode 用户

```bash
# 1. 复制 skill 文件到 OpenCode 的 skill 目录
# 2. 在项目中使用
/safe 添加一个记住密码功能
```

## 文件说明

| 文件 | 用途 |
|------|------|
| `skills/safe.md` | 主入口，安全变更流程 |
| `skills/clarify.md` | 需求澄清 |
| `skills/scope-guard.md` | 范围守护 |
| `skills/schema-guard.md` | 数据安全审查 |
| `skills/rollback.md` | 回滚安全 |
| `skills/implement.md` | 安全实现 |
| `skills/verify.md` | 验证完成 |
| `skills/assess.md` | 只评估不执行 |

## 工作原理

所有功能通过 AI 直接执行系统命令实现：

| 功能 | 实现方式 |
|------|---------|
| Git 检测 | `git rev-parse --git-dir` |
| 创建快照 | `cp -r` 或 `tar -czf` |
| 恢复快照 | `cp -r` 或 `tar -xzf` |
| 项目分析 | 读取 `package.json` |
| 验证构建 | `npm run build` / `npm test` |
| 代码风格分析 | AI 直接分析文件内容 |

## 与工具库版本的区别

| 特性 | 纯提示词版本 | 工具库版本 |
|------|------------|-----------|
| 安装要求 | 无 | 需要 Node.js |
| 代码风格分析 | AI 分析 | 程序分析 |
| 快照管理 | 系统命令 | TypeScript 代码 |
| 精确度 | 依赖 AI | 程序更精确 |
| 适用人群 | 非技术用户 | 技术用户 |
