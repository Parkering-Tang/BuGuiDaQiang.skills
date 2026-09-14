# 从“状态改中文”到明确范围

[English](#english) · [返回主页](../../README.md)

这是使用虚构数据的教学演练，不是客户案例，也不是模型自动执行的会话实录。

## 1. 明确目标

原请求：“把状态改成中文。”

澄清后：“界面显示‘待处理 / 已完成’，内部仍保留 `pending` / `done`；不修改数据库、接口或状态流转。”

## 2. 明确修改范围

只新增显示映射，未知状态保留原值作为回退。在实际项目中应先定位渲染入口，再确定文件，不能把示例路径当成项目真实路径。

## 3. 运行确定性示例

在仓库根目录运行：

```bash
node examples/status-labels/demo.cjs
```

脚本输出三种状态的显示结果，并用断言检查映射与原始数据未改变。它没有调用模型。

## 4. 在自己的测试项目中演练技能

先用 `/assess` 分析同类需求，检查工作区没有被修改。范围明确后使用 `/safe`；验证真实界面、未知值回退和相关测试。报告中分开写“通过”“失败”和“未执行”，不要把本文演示输出当成项目测试结果。

恢复前保存实际工作区：仅记录 HEAD 无法恢复未提交或未跟踪内容。本例不提供整库重置命令。

## English

This walkthrough uses fictional data. It is neither a customer case nor a transcript of a model completing the task.

**Request:** “Translate the status.”

**Clarified scope:** Display translated labels while retaining `pending` / `done` internally. Do not change the database, API, or transitions.

Add a display mapping with the original value as the fallback for unknown states. In a real project, locate the actual rendering entry point before naming files to edit.

Run the deterministic demonstration from the repository root:

```bash
node examples/status-labels/demo.cjs
```

The script prints three labels and asserts that the mapping works without changing source data. It makes no model calls.

In a disposable project, use `/assess` first and verify that it made no edits. Once scope is clear, use `/safe`, then check the real interface, fallback behavior, and relevant tests. Report passed, failed, and unexecuted checks separately. This demonstration is not evidence that your application passed its tests.

Preserve the actual worktree before recovery: a HEAD reference cannot recover uncommitted or untracked content. No whole-repository reset command is provided here.
