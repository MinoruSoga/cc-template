# Claude Code 基本設定ガイド

## 設定ファイルの場所

| ファイル | 用途 |
|---------|------|
| `~/.claude.json` | メイン設定（MCP、プロジェクト履歴など） |
| `~/.claude/settings.json` | ユーザー設定 |
| `<project>/.claude/settings.json` | プロジェクト固有設定 |
| `<project>/CLAUDE.md` | プロジェクト用のカスタム指示 |

---

## ~/.claude.json の構造

```json
{
  "numStartups": 100,
  "installMethod": "global",
  "autoUpdates": true,
  "autoConnectIde": true,
  "mcpServers": {
    "MCP_DOCKER": {
      "command": "docker",
      "args": ["mcp", "gateway", "run"]
    },
    "serena": {
      "command": "uvx",
      "args": ["--from", "git+https://github.com/oraios/serena", "serena-mcp-server"]
    }
  },
  "projects": {
    "/path/to/project": {
      "allowedTools": [],
      "mcpServers": {},
      "hasTrustDialogAccepted": true
    }
  }
}
```

### 主要な設定項目

| キー | 説明 |
|-----|------|
| `autoUpdates` | 自動更新の有効/無効 |
| `autoConnectIde` | IDE への自動接続 |
| `mcpServers` | グローバル MCP サーバー設定 |
| `projects` | プロジェクトごとの設定 |

---

## ~/.claude/settings.json

ユーザー設定ファイル。Claude Code の動作をカスタマイズ。

```json
{
  "permissions": {
    "allow": [
      "Bash(git:*)",
      "Bash(npm:*)",
      "Read(/Users/minoru/Dev/**)"
    ],
    "deny": [
      "Bash(rm -rf:*)"
    ]
  },
  "env": {
    "EDITOR": "code"
  }
}
```

### 権限設定の書式

```
ツール名(パターン:*)
```

例：
- `Bash(git:*)` - すべての git コマンドを許可
- `Read(/path/**)` - 指定パス以下の読み取りを許可
- `Edit(/path/**)` - 指定パス以下の編集を許可
- `Write(/path/**)` - 指定パス以下の書き込みを許可

---

## CLAUDE.md（プロジェクト指示ファイル）

プロジェクトルートに配置すると、Claude Code がそのプロジェクトで作業する際に自動で読み込む。

### 例

```markdown
# プロジェクト: MyApp

## 概要
このプロジェクトは React + TypeScript のフロントエンドアプリです。

## コーディング規約
- コンポーネントは関数コンポーネントで書く
- スタイルは Tailwind CSS を使用
- テストは Vitest を使用

## 重要なファイル
- `src/App.tsx` - メインコンポーネント
- `src/hooks/` - カスタムフック
- `src/components/` - 共通コンポーネント

## コマンド
- `npm run dev` - 開発サーバー起動
- `npm run build` - ビルド
- `npm test` - テスト実行
```

### 外部ファイルのインポート

```markdown
@path/to/other-instructions.md
```

---

## 環境変数

Claude Code で使用可能な環境変数：

| 変数 | 説明 |
|-----|------|
| `ANTHROPIC_API_KEY` | API キー（直接設定時） |
| `CLAUDE_CONFIG_DIR` | 設定ディレクトリの変更 |
| `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` | 非必須通信の無効化 |
| `BASH_DEFAULT_TIMEOUT_MS` | Bash コマンドのデフォルトタイムアウト |
| `BASH_MAX_TIMEOUT_MS` | Bash コマンドの最大タイムアウト |
| `MCP_TIMEOUT` | MCP サーバー起動タイムアウト |

---

## 設定の優先順位

1. コマンドライン引数（最優先）
2. プロジェクト設定（`.claude/settings.json`）
3. ユーザー設定（`~/.claude/settings.json`）
4. デフォルト値

---

## 設定のリセット

```bash
# 設定ファイルのバックアップ
cp ~/.claude.json ~/.claude.json.backup

# プロジェクト履歴のクリア（jq 使用）
jq '.projects = {}' ~/.claude.json > tmp.json && mv tmp.json ~/.claude.json

# キャッシュのクリア
jq '.cachedChangelog = ""' ~/.claude.json > tmp.json && mv tmp.json ~/.claude.json
```
