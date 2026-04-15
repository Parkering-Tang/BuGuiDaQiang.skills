# rollback

> 回滚安全：为无 Git 用户创建安全网

## 触发条件

- 在任何文件修改之前
- 对于 moderate 及以上复杂度的变更，**强制**触发
- 对于 trivial 变更，可选触发

---

## 核心职责

1. **检测版本控制** - 判断是否使用 Git
2. **创建快照** - 在修改前保存可恢复状态
3. **提供恢复命令** - 给用户明确的恢复方法

---

## 工作流程

```
修改请求
    │
    ▼
检测 Git
    │
    ├─ 有 Git ──────────────────────┐
    │   记录当前 commit             │
    │   提示可用 git restore        │
    │                              │
    └─ 无 Git ─────────────────────┤
        创建本地快照                │
        存储到 .safe-vibecoding/    │
        提供恢复命令                │
                                  │
                                  ▼
                         继续执行修改
```

---

## Git 检测命令

```bash
# 检测是否在 Git 仓库中
git rev-parse --git-dir

# 如果成功，获取当前 commit
git rev-parse HEAD

# 获取当前分支
git rev-parse --abbrev-ref HEAD

# 检查是否有未提交的更改
git status --porcelain
```

---

## 快照创建命令

### 有 Git 时

```bash
# 记录当前状态
echo "当前 commit: $(git rev-parse HEAD)" > .safe-vibecoding/last-commit.txt
echo "当前分支: $(git rev-parse --abbrev-ref HEAD)" >> .safe-vibecoding/last-commit.txt

# 恢复命令（告知用户）
git restore .
# 或
git checkout <commit-hash>
```

### 无 Git 时

```bash
# 创建快照目录
SNAPSHOT_ID="snap-$(date +%Y%m%d-%H%M%S)"
mkdir -p ".safe-vibecoding/snapshots/$SNAPSHOT_ID"

# 复制要修改的文件
for file in <要修改的文件列表>; do
  # 创建目录结构
  mkdir -p ".safe-vibecoding/snapshots/$SNAPSHOT_ID/$(dirname $file)"
  # 复制文件
  cp "$file" ".safe-vibecoding/snapshots/$SNAPSHOT_ID/$file"
done

# 创建清单文件
echo "{
  \"id\": \"$SNAPSHOT_ID\",
  \"created_at\": \"$(date -Iseconds)\",
  \"reason\": \"<变更原因>\",
  \"files\": <文件列表>
}" > ".safe-vibecoding/snapshots/$SNAPSHOT_ID/manifest.json"
```

---

## 快照存储结构

```
.safe-vibecoding/
├── session.json              # 会话状态
├── last-commit.txt           # Git 最后 commit（如有）
└── snapshots/
    └── snap-20260415-1030/
        ├── manifest.json     # 快照元数据
        ├── src/
        │   └── pages/
        │       └── Login.tsx # 备份的文件
        └── services/
            └── auth.ts
```

---

## 恢复命令

### 有 Git 时

```bash
# 恢复所有未提交的更改
git restore .

# 恢复到特定 commit
git checkout <commit-hash>

# 查看更改历史
git log --oneline -10
```

### 无 Git 时

```bash
# 列出快照
ls -la .safe-vibecoding/snapshots/

# 恢复特定快照
SNAPSHOT_ID="snap-20260415-1030"
cp -r ".safe-vibecoding/snapshots/$SNAPSHOT_ID/*" .

# 或使用 tar（如果用 tar 创建的）
tar -xzf ".safe-vibecoding/snapshots/$SNAPSHOT_ID.tar.gz"
```

---

## 输出模板

### 创建快照

```
📸 创建快照...

检查文件：
• src/pages/Login.tsx ✓
• src/services/auth.ts ✓

生成快照...
✅ 快照已创建

┌─────────────────────────────────────────────────────┐
│ 快照信息                                            │
├─────────────────────────────────────────────────────┤
│ ID: snap-20260415-1030                              │
│ 文件数: 2                                           │
│ 原因: 添加记住密码功能                              │
│                                                     │
│ 恢复命令:                                           │
│ cp -r .safe-vibecoding/snapshots/snap-20260415-1030/* . │
└─────────────────────────────────────────────────────┘
```

### 有 Git 时

```
📸 检测到 Git

当前分支: main
当前 commit: abc1234

建议使用 Git 回滚：
  git restore .
  或
  git checkout abc1234

但仍会创建快照作为额外保护。
```

---

## 清理策略

### 手动清理

```bash
# 列出所有快照
ls -la .safe-vibecoding/snapshots/

# 删除旧快照
rm -rf .safe-vibecoding/snapshots/snap-20260401-*
```

### 自动清理规则

- 默认保留最近 10 个快照
- 超过 30 天的快照可手动清理

---

## 示例

### 完整流程

```
用户: /safe 改一下登录页面

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[经过 clarify 确认]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📸 创建快照...

# 执行命令
git rev-parse --git-dir 2>/dev/null || echo "no-git"

# 假设无 Git，创建本地快照
SNAPSHOT_ID="snap-$(date +%Y%m%d-%H%M%S)"
mkdir -p ".safe-vibecoding/snapshots/$SNAPSHOT_ID/src/pages"
mkdir -p ".safe-vibecoding/snapshots/$SNAPSHOT_ID/src/services"
cp src/pages/Login.tsx ".safe-vibecoding/snapshots/$SNAPSHOT_ID/src/pages/"
cp src/services/auth.ts ".safe-vibecoding/snapshots/$SNAPSHOT_ID/src/services/"

✅ 快照已创建: snap-20260415-1030
恢复命令: cp -r .safe-vibecoding/snapshots/snap-20260415-1030/* .

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✏️ 继续执行修改...
```
