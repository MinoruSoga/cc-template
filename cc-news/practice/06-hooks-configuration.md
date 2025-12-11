# Hooks 設定ガイド

> 基づく記事: Tool Design、Multi-Agent Systems、Claude Code Best Practices
> 参照: Claude Code 公式ドキュメント

## 概要

Hooksを使用することで、Claude Codeの各種イベントに対して自動的にスクリプトを実行できます。これにより、品質チェック、ログ記録、通知などの自動化が可能になります。

## Hooksの種類（公式サポート）

| Hook イベント | 実行タイミング | 用途 |
|--------------|---------------|------|
| PreToolUse | ツール実行前 | 検証、ブロック |
| PostToolUse | ツール実行後 | ログ、通知、自動フォーマット |
| UserPromptSubmit | ユーザー入力時 | 入力検証 |
| Notification | 通知時 | 外部通知連携 |
| Stop | エージェント停止時 | クリーンアップ |
| SessionStart | セッション開始時 | 初期化 |
| SessionEnd | セッション終了時 | 終了処理 |

## 設定ファイルの場所

```bash
# ユーザーレベル
~/.claude/settings.json

# プロジェクトレベル（チーム共有）
Template/.claude/settings.json

# プロジェクトレベル（個人用、自動gitignore）
Template/.claude/settings.local.json
```

## 基本設定構造

```json
{
  "hooks": {
    "イベント名": [
      {
        "matcher": "ツールパターン",
        "hooks": [
          {
            "type": "command",
            "command": "実行するコマンド"
          }
        ]
      }
    ]
  }
}
```

## 実践的なHook例

### 1. コマンド実行ログ（PostToolUse）

`Template/.claude/hooks/log-commands.sh`:
```bash
#!/bin/bash

# コマンド実行をログに記録
LOG_FILE="$CLAUDE_PROJECT_DIR/.claude/logs/commands.log"
mkdir -p "$(dirname "$LOG_FILE")"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Tool executed" >> "$LOG_FILE"
echo "  Working Dir: $(pwd)" >> "$LOG_FILE"
echo "---" >> "$LOG_FILE"
```

設定（`settings.json`）:
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/log-commands.sh"
          }
        ]
      }
    ]
  }
}
```

### 2. 危険なコマンドのブロック（PreToolUse）

`Template/.claude/hooks/block-dangerous.sh`:
```bash
#!/bin/bash

# 環境変数からツール入力を取得
TOOL_INPUT="$CLAUDE_TOOL_INPUT"

# 危険なパターンをチェック
DANGEROUS_PATTERNS=(
    "rm -rf /"
    "rm -rf ~"
    "> /dev/sda"
    "mkfs"
    "dd if=/dev/zero"
)

for pattern in "${DANGEROUS_PATTERNS[@]}"; do
    if [[ "$TOOL_INPUT" == *"$pattern"* ]]; then
        echo "BLOCKED: Dangerous command pattern detected: $pattern"
        exit 2  # exit 2 = ブロック
    fi
done

exit 0
```

設定:
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/block-dangerous.sh"
          }
        ]
      }
    ]
  }
}
```

### 3. 自動フォーマット（PostToolUse）

`Template/.claude/hooks/auto-format.sh`:
```bash
#!/bin/bash

# 変更されたファイルを自動フォーマット
# $CLAUDE_FILE_PATH で対象ファイルを取得

if [[ -n "$CLAUDE_FILE_PATH" ]]; then
    case "$CLAUDE_FILE_PATH" in
        *.ts|*.tsx)
            npx prettier --write "$CLAUDE_FILE_PATH" 2>/dev/null
            ;;
        *.py)
            black "$CLAUDE_FILE_PATH" 2>/dev/null
            ;;
        *.go)
            gofmt -w "$CLAUDE_FILE_PATH" 2>/dev/null
            ;;
    esac
fi
```

設定:
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/auto-format.sh"
          }
        ]
      }
    ]
  }
}
```

### 4. Slack通知（Notification）

`Template/.claude/hooks/notify-slack.sh`:
```bash
#!/bin/bash

# 重要な通知をSlackに送信
WEBHOOK_URL="${SLACK_WEBHOOK_URL}"
MESSAGE="$CLAUDE_NOTIFICATION"

if [[ -n "$WEBHOOK_URL" && -n "$MESSAGE" ]]; then
    curl -X POST -H 'Content-type: application/json' \
        --data "{\"text\":\"Claude Code: $MESSAGE\"}" \
        "$WEBHOOK_URL" 2>/dev/null
fi
```

設定:
```json
{
  "hooks": {
    "Notification": [
      {
        "matcher": ".*",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/notify-slack.sh"
          }
        ]
      }
    ]
  }
}
```

### 5. セッション開始時の初期化（SessionStart）

`Template/.claude/hooks/session-init.sh`:
```bash
#!/bin/bash

echo "=== Claude Code Session Started ==="
echo "Project: $CLAUDE_PROJECT_DIR"
echo "Time: $(date)"

# 環境チェック
if [[ -f "$CLAUDE_PROJECT_DIR/package.json" ]]; then
    echo "Node project detected"
fi

if [[ -f "$CLAUDE_PROJECT_DIR/requirements.txt" ]]; then
    echo "Python project detected"
fi
```

設定:
```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": ".*",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/session-init.sh"
          }
        ]
      }
    ]
  }
}
```

## 環境変数

Hookスクリプトで使用可能な環境変数:

| 変数 | 説明 |
|------|------|
| CLAUDE_PROJECT_DIR | プロジェクトディレクトリのパス |
| CLAUDE_TOOL_INPUT | ツールへの入力（JSON形式） |
| CLAUDE_FILE_PATH | 対象ファイル（Write/Edit時） |
| CLAUDE_NOTIFICATION | 通知メッセージ（Notification時） |

## Hook の終了コード

| 終了コード | 意味 |
|-----------|------|
| 0 | 成功（処理を続行） |
| 2 | ブロック（ツール実行を中止） |
| その他 | エラー（警告を表示して続行） |

## matcher パターン

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Bash",           // 完全一致
        "hooks": [...]
      },
      {
        "matcher": "Write|Edit",     // OR条件
        "hooks": [...]
      },
      {
        "matcher": "Bash\\(npm.*\\)", // 正規表現（npmコマンドのみ）
        "hooks": [...]
      },
      {
        "matcher": ".*",             // すべてにマッチ
        "hooks": [...]
      }
    ]
  }
}
```

## ディレクトリ構成

```
Template/
├── .claude/
│   ├── settings.json      # Hook設定
│   ├── settings.local.json # ローカル設定（gitignore）
│   └── hooks/
│       ├── log-commands.sh
│       ├── block-dangerous.sh
│       ├── auto-format.sh
│       ├── notify-slack.sh
│       └── session-init.sh
└── ...
```

## 設定手順

### ステップ1: Hooksディレクトリの作成

```bash
mkdir -p Template/.claude/hooks
```

### ステップ2: Hookスクリプトの作成

```bash
touch Template/.claude/hooks/my-hook.sh
chmod +x Template/.claude/hooks/my-hook.sh
```

### ステップ3: settings.jsonへの登録

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/my-hook.sh"
          }
        ]
      }
    ]
  }
}
```

### ステップ4: 動作確認

```bash
# 手動でスクリプトをテスト
CLAUDE_PROJECT_DIR=$(pwd) Template/.claude/hooks/my-hook.sh
```

## ベストプラクティス

### 1. 高速な実行

```bash
# 悪い例：重い処理
npm run full-test-suite  # 数分かかる

# 良い例：高速な検証
npm run lint -- --cache  # キャッシュを活用
```

### 2. 適切な終了コード

```bash
#!/bin/bash

# ブロックしたい場合は exit 2
if [[ 危険な条件 ]]; then
    echo "BLOCKED: 理由"
    exit 2
fi

# 正常終了
exit 0
```

### 3. エラーハンドリング

```bash
#!/bin/bash
set -e  # エラー時に即座に終了

# エラーハンドラ
trap 'echo "Hook failed: $?"' ERR

# メイン処理
main() {
    # ...
}

main "$@"
```

### 4. 環境変数の活用

```bash
#!/bin/bash

# プロジェクトディレクトリを基準に
cd "$CLAUDE_PROJECT_DIR"

# ツール入力をパース（jqを使用）
COMMAND=$(echo "$CLAUDE_TOOL_INPUT" | jq -r '.command // empty')
```

## 複数Hookの組み合わせ

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/validate-bash.sh"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/auto-format.sh"
          },
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/log-changes.sh"
          }
        ]
      }
    ],
    "SessionEnd": [
      {
        "matcher": ".*",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/cleanup.sh"
          }
        ]
      }
    ]
  }
}
```

## トラブルシューティング

### Hookが実行されない

```bash
# 実行権限を確認
ls -la Template/.claude/hooks/

# 権限を付与
chmod +x Template/.claude/hooks/*.sh
```

### パスが見つからない

```bash
# $CLAUDE_PROJECT_DIR を使用して絶対パスを構築
command: "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/my-hook.sh"
```

### デバッグ出力

```bash
#!/bin/bash
# デバッグ出力をファイルに
echo "DEBUG: CLAUDE_PROJECT_DIR=$CLAUDE_PROJECT_DIR" >> /tmp/hook-debug.log
echo "DEBUG: CLAUDE_TOOL_INPUT=$CLAUDE_TOOL_INPUT" >> /tmp/hook-debug.log
```

## チェックリスト

- [ ] `Template/.claude/hooks/` ディレクトリが作成されている
- [ ] スクリプトに実行権限がある (`chmod +x`)
- [ ] `settings.json` に正しい構造で登録されている
- [ ] matcher パターンが適切に設定されている
- [ ] 終了コードが正しく使用されている（0=成功, 2=ブロック）
- [ ] `$CLAUDE_PROJECT_DIR` を使用してパスを構築している
- [ ] 手動テストで動作確認済み

## 次のステップ

Hooks設定が完了したら：

1. [カスタムコマンド](./05-custom-commands.md)と連携
2. [長時間タスク設定](./07-long-running-workflow.md)でセッション管理
3. チームでHookスクリプトを共有
