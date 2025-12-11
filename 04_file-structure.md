# Claude Code ファイル構成

## ディレクトリ構造

```
~/.claude/
├── settings.json          # ユーザー設定
├── history.jsonl          # 会話履歴
├── CLAUDE.md              # グローバルなカスタム指示
├── commands/              # カスタムスラッシュコマンド
│   └── *.md
├── agents/                # カスタムエージェント
│   └── *.md
├── debug/                 # デバッグログ
├── file-history/          # ファイル変更履歴
├── plans/                 # プランモードの計画ファイル
├── projects/              # プロジェクト関連データ
├── session-env/           # セッション環境
├── shell-snapshots/       # シェルスナップショット
├── statsig/               # 統計データ
└── todos/                 # Todo リスト

~/.claude.json             # メイン設定ファイル
```

---

## 各ファイルの詳細

### ~/.claude.json

メイン設定ファイル。以下を含む：
- MCP サーバー設定
- プロジェクト履歴
- 統計情報
- キャッシュ

**注意**: このファイルは自動で更新されるため、肥大化することがある。定期的な整理を推奨。

### ~/.claude/settings.json

ユーザー設定。手動で編集可能。

```json
{
  "permissions": {
    "allow": [],
    "deny": []
  },
  "env": {}
}
```

### ~/.claude/commands/

カスタムスラッシュコマンドを定義。Markdown ファイルで作成。

**例: `~/.claude/commands/review.md`**

```markdown
---
description: コードレビューを実行
argument-hint: <ファイルパス>
---

以下のファイルをレビューしてください：
- コーディング規約に従っているか
- バグの可能性
- パフォーマンスの問題
- セキュリティの問題

$ARGUMENTS
```

使用方法: `/review src/main.ts`

### ~/.claude/agents/

カスタムエージェントを定義。

**例: `~/.claude/agents/reviewer.md`**

```markdown
---
name: reviewer
description: コードレビュー専門エージェント
model: sonnet
---

あなたはコードレビューの専門家です。
以下の観点でレビューを行います：
- セキュリティ
- パフォーマンス
- 可読性
- テスタビリティ
```

使用方法: `@reviewer このコードをレビューして`

---

## プロジェクト固有の設定

```
<project>/
├── .claude/
│   └── settings.json     # プロジェクト固有設定
├── .mcp.json             # プロジェクト共有 MCP 設定
└── CLAUDE.md             # プロジェクト指示
```

### .mcp.json

プロジェクトで共有する MCP サーバー設定。Git でコミット可能。

```json
{
  "mcpServers": {
    "project-specific-server": {
      "command": "node",
      "args": ["./scripts/mcp-server.js"]
    }
  }
}
```

### CLAUDE.md

プロジェクト固有の指示。Claude Code が自動で読み込む。

---

## ファイルのメンテナンス

### ~/.claude.json の整理

```bash
# プロジェクト履歴をクリア
jq '.projects = {}' ~/.claude.json > tmp.json && mv tmp.json ~/.claude.json

# キャッシュをクリア
jq '.cachedChangelog = ""' ~/.claude.json > tmp.json && mv tmp.json ~/.claude.json
```

### 古いファイルの削除

```bash
# 古いデバッグログを削除
find ~/.claude/debug -mtime +30 -delete

# 古いプランファイルを削除
find ~/.claude/plans -mtime +30 -delete
```

### バックアップ

```bash
# 設定のバックアップ
cp ~/.claude.json ~/.claude.json.backup
cp -r ~/.claude ~/.claude.backup
```

---

## セキュリティに関する注意

以下のファイルには機密情報が含まれる可能性がある：

- `~/.claude.json` - API キー情報が含まれる可能性
- `~/.claude/history.jsonl` - 会話履歴

**Git にコミットしない**こと。
