# settings.json 生成

対象プロジェクト: $ARGUMENTS

## 参照ドキュメント

生成時は以下を必ず参照:

- **テンプレート:** `/Users/minoru/Dev/cc/cc-news/Template/.claude/settings.json`
- **ガイド:** `/Users/minoru/Dev/cc/cc-news/practice/04-security-configuration.md`

## 生成手順

### 1. プロジェクト分析

以下を確認:

- 技術スタック（Node.js, Python, Go等）
- パッケージマネージャー（npm, pnpm, yarn, pip等）
- ビルドツール（Makefile, npm scripts等）
- テストフレームワーク
- Docker使用有無

### 2. 既存設定の確認

既存ファイルがある場合:

1. 現在の設定を読み込む
2. セキュリティ設定（deny）は既存を優先
3. allow設定は追加可能

### 3. settings.json生成

以下の構造で生成:

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",

  "outputStyle": "senior-engineer",

  "env": {
    "USE_DOCKER": "false",
    "MAX_THINKING_TOKENS": "10000",
    "BASH_DEFAULT_TIMEOUT_MS": "60000"
  },

  "permissions": {
    "allow": [],
    "deny": [],
    "ask": [],
    "defaultMode": "default"
  },

  "sandbox": {
    "enabled": true,
    "excludedCommands": []
  },

  "hooks": {}
}
```

## 技術スタック別設定

### Node.js / TypeScript

```json
{
  "permissions": {
    "allow": [
      "Bash(make:*)",
      "Bash(git:*)",
      "Bash(node:*)",
      "Edit",
      "Read"
    ],
    "deny": [
      "Bash(npm publish:*)",
      "Bash(npm unpublish:*)",
      "Bash(rm -rf:*)",
      "Read(.env)",
      "Read(.env.*)",
      "Read(~/.ssh/**)",
      "Read(~/.aws/**)"
    ],
    "ask": [
      "Bash(npm install:*)",
      "Bash(pnpm install:*)",
      "Bash(yarn add:*)",
      "Bash(git push:*)",
      "Bash(git push --force:*)"
    ]
  },
  "sandbox": {
    "enabled": true,
    "excludedCommands": ["git", "node", "npm", "pnpm", "yarn"]
  }
}
```

### Python

```json
{
  "permissions": {
    "allow": [
      "Bash(make:*)",
      "Bash(git:*)",
      "Bash(python:*)",
      "Bash(pytest:*)",
      "Edit",
      "Read"
    ],
    "deny": [
      "Bash(pip install --user:*)",
      "Bash(rm -rf:*)",
      "Read(.env)",
      "Read(.env.*)",
      "Read(~/.ssh/**)",
      "Read(~/.aws/**)"
    ],
    "ask": [
      "Bash(pip install:*)",
      "Bash(poetry add:*)",
      "Bash(git push:*)"
    ]
  },
  "sandbox": {
    "enabled": true,
    "excludedCommands": ["git", "python", "pip", "poetry", "pytest"]
  }
}
```

### Go

```json
{
  "permissions": {
    "allow": [
      "Bash(make:*)",
      "Bash(git:*)",
      "Bash(go build:*)",
      "Bash(go test:*)",
      "Bash(go run:*)",
      "Edit",
      "Read"
    ],
    "deny": [
      "Bash(rm -rf:*)",
      "Read(.env)",
      "Read(~/.ssh/**)"
    ],
    "ask": [
      "Bash(go install:*)",
      "Bash(git push:*)"
    ]
  },
  "sandbox": {
    "enabled": true,
    "excludedCommands": ["git", "go"]
  }
}
```

### Docker使用時の追加設定

```json
{
  "env": {
    "USE_DOCKER": "true"
  },
  "sandbox": {
    "excludedCommands": ["docker", "docker-compose", "docker compose"]
  }
}
```

## セキュリティ原則

### 必須deny設定（全プロジェクト共通）

```json
{
  "deny": [
    "Read(.env)",
    "Read(.env.*)",
    "Read(~/.ssh/**)",
    "Read(~/.aws/**)",
    "Read(~/.config/gcloud/**)",
    "Bash(rm -rf /)",
    "Bash(rm -rf ~)",
    "Bash(:(){ :|:& };:)",
    "Bash(> /dev/sda)",
    "Bash(dd if=/dev/zero)"
  ]
}
```

### 推奨ask設定

```json
{
  "ask": [
    "Bash(git push:*)",
    "Bash(git push --force:*)",
    "Bash(*install*:*)",
    "Bash(*publish*:*)",
    "Bash(*deploy*:*)"
  ]
}
```

## フック設定（オプション）

### SessionStart

```json
{
  "hooks": {
    "SessionStart": [
      {
        "type": "command",
        "command": "echo 'Session started at $(date)' >> .claude-session.log"
      }
    ]
  }
}
```

### PreToolUse（危険コマンド警告）

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "type": "command",
        "command": "if echo \"$TOOL_INPUT\" | grep -qE '(rm -rf|drop database|truncate)'; then echo 'WARNING: Destructive command detected'; fi"
      }
    ]
  }
}
```

## マージ戦略

既存settings.jsonがある場合:

1. **deny設定:** 既存を優先（セキュリティ上）
2. **allow設定:** 既存 + 新規（重複排除）
3. **ask設定:** 既存 + 新規（重複排除）
4. **sandbox設定:** 既存を尊重
5. **env設定:** 既存を優先
6. **hooks:** 既存を保持

## 出力

1. 生成内容のプレビューを表示
2. 既存ファイルがある場合は差分を表示
3. ユーザー確認後にファイルを作成

## 配置場所

`[プロジェクトルート]/.claude/settings.json`

**注意:** `settings.local.json` は個人設定用（.gitignore推奨）
