# Claude Code ベストプラクティス 完全ガイド

> **公式ドキュメント参照:** https://code.claude.com/docs/en/
> **Zenn記事参照:** https://zenn.dev/farstep/articles/claude-code-best-practices

---

## 目次

- [1. Claude Code 概要](#1-claude-code-概要)
- [2. インストールと初期設定](#2-インストールと初期設定)
- [3. CLAUDE.md メモリシステム](#3-claudemd-メモリシステム)
- [4. settings.json 設定リファレンス](#4-settingsjson-設定リファレンス)
- [5. Hooks（フック）システム](#5-hooksフックシステム)
- [6. サブエージェント](#6-サブエージェント)
- [7. Agent Skills（スキル）](#7-agent-skillsスキル)
- [8. MCP（Model Context Protocol）](#8-mcpmodel-context-protocol)
- [9. 効果的なプロンプト技法](#9-効果的なプロンプト技法)
- [10. ワークフローとCLIリファレンス](#10-ワークフローとcliリファレンス)
- [11. セキュリティ対策](#11-セキュリティ対策)
- [12. トラブルシューティング](#12-トラブルシューティング)

---

## 1. Claude Code 概要

### Claude Code とは

**Claude Code** は、Anthropic公式のCLIベースAIコーディングアシスタントです。ターミナルで動作し、コードベースの理解、バグ修正、機能実装、リファクタリングなどを支援します。

### 主な特徴

| 特徴 | 説明 |
|------|------|
| **自然言語からコード生成** | 説明からコードを計画・実装・検証 |
| **デバッグ支援** | エラーメッセージを解析し修正を提案 |
| **コードベース理解** | プロジェクト構造を把握し質問に回答 |
| **タスク自動化** | lint修正、マージコンフリクト解決、リリースノート作成 |
| **MCP統合** | 外部ツール（Figma、Slack、DB等）との連携 |

### 利用可能なプラットフォーム

- ターミナル（ネイティブCLI）
- Web（claude.ai/code）
- デスクトップアプリ
- Visual Studio Code
- JetBrains IDE
- GitHub Actions / GitLab CI/CD
- Slack

---

## 2. インストールと初期設定

### インストール方法

**Homebrew（macOS/Linux）:**
```bash
brew install --cask claude-code
```

**curl（macOS/Linux/WSL）:**
```bash
curl -fsSL https://claude.ai/install.sh | bash
```

**Windows PowerShell:**
```powershell
irm https://claude.ai/install.ps1 | iex
```

**NPM（Node.js 18+）:**
```bash
npm install -g @anthropic-ai/claude-code
```

### 初回起動

```bash
cd /path/to/your/project
claude
# 初回起動時にログインを求められます
```

### 基本コマンド

| コマンド | 説明 |
|---------|------|
| `claude` | インタラクティブモード開始 |
| `claude "query"` | 初期プロンプト付きで開始 |
| `claude -p "query"` | ワンショットクエリ（終了後exit） |
| `claude -c` | 最新の会話を継続 |
| `claude -r` / `--resume` | 会話選択ピッカーを表示 |
| `claude update` | 最新版にアップデート |
| `/help` | ヘルプ表示 |
| `/clear` | 会話履歴クリア |

---

## 3. CLAUDE.md メモリシステム

### メモリの階層構造（公式）

Claude Codeは複数レベルのメモリを階層的に読み込みます：

| メモリタイプ | 場所 | 用途 | 共有範囲 |
|-------------|------|------|----------|
| **エンタープライズ** | `/Library/Application Support/ClaudeCode/CLAUDE.md`（macOS）<br>`/etc/claude-code/CLAUDE.md`（Linux）<br>`C:\Program Files\ClaudeCode\CLAUDE.md`（Windows） | 組織全体の指示 | 組織全ユーザー |
| **ユーザー** | `~/.claude/CLAUDE.md` | 個人設定（全プロジェクト共通） | 本人のみ |
| **プロジェクト** | `./CLAUDE.md` または `./.claude/CLAUDE.md` | チーム共有指示 | Gitを通じてチーム |
| **プロジェクトルール** | `./.claude/rules/*.md` | モジュール型トピック別指示 | Gitを通じてチーム |
| **プロジェクトローカル** | `./CLAUDE.local.md` | プロジェクト固有の個人設定 | 本人のみ（自動gitignore） |

### CLAUDE.md の記述例

```markdown
# プロジェクト名

## 概要
Next.jsベースのEコマースプラットフォーム

## 技術スタック
- Frontend: Next.js 14, TypeScript, Tailwind CSS
- Backend: Node.js, Prisma
- Database: PostgreSQL
- Testing: Jest, Playwright

## 共通コマンド
```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# テスト
npm test

# Lint & Format
npm run lint && npm run format
```

## コードスタイル
- TypeScript strict mode 必須
- 関数名は camelCase
- コンポーネント名は PascalCase
- 定数は UPPER_SNAKE_CASE
- インポート順: React → 外部ライブラリ → 内部モジュール → 型

## 禁止事項
- any型の使用禁止
- console.logの放置禁止
- ハードコード禁止（環境変数を使用）
- 未使用インポートの放置禁止

## ワークフロー
- コミットメッセージは Conventional Commits 形式
- mainブランチへの直接プッシュ禁止
- PRは必ずレビューを通す
```

### ファイルインポート機能（@構文）

CLAUDE.md内で他のファイルを参照可能：

```markdown
# プロジェクト情報
プロジェクト概要は @README.md を参照
利用可能なnpmコマンドは @package.json を確認

# 追加指示
- gitワークフロー: @docs/git-instructions.md
- 個人設定: @~/.claude/my-project-instructions.md
```

**インポート機能の特徴：**
- 相対パス・絶対パスに対応
- ホームディレクトリ（`~`）の参照が可能
- 最大5ホップまでの再帰的インポートに対応
- コード内のインポート構文は評価されない

### .claude/rules/ によるモジュール管理

大規模プロジェクト向けに、複数のルールファイルで指示を整理：

```
your-project/
├── .claude/
│   ├── CLAUDE.md           # メインプロジェクト指示
│   └── rules/
│       ├── code-style.md   # コード規約
│       ├── testing.md      # テスト規約
│       ├── api.md          # API開発規約
│       └── security.md     # セキュリティ要件
```

**パス特定ルール（YAML frontmatter）:**

```markdown
---
paths: src/api/**/*.ts
---

# API開発規約

- すべてのAPIエンドポイントに入力検証を含める
- 標準エラーレスポンス形式を使用
- OpenAPIドキュメントコメントを含める
```

**グロブパターン対応:**

| パターン | マッチ対象 |
|---------|---------|
| `**/*.ts` | 全ディレクトリのTypeScriptファイル |
| `src/**/*` | srcディレクトリ以下の全ファイル |
| `*.md` | プロジェクトルートのMarkdownファイル |
| `src/**/*.{ts,tsx}` | TypeScriptおよびReactファイル |

### メモリ追加の方法

**方法1: # ショートカット（最速）**
```
# Always use descriptive variable names
```
入力後、保存先メモリファイルの選択を促されます。

**方法2: /memory スラッシュコマンド**
セッション中に `/memory` を実行するとエディタが開きます。

**方法3: /init でプロジェクト初期化**
```
> /init
```
プロジェクト用のCLAUDE.mdを自動生成します。

---

## 4. settings.json 設定リファレンス

### 設定ファイルの階層（優先度順）

1. **Enterprise managed policies** - `managed-settings.json`（最優先）
2. **Command line arguments** - CLIフラグ
3. **Local project settings** - `.claude/settings.local.json`
4. **Shared project settings** - `.claude/settings.json`
5. **User settings** - `~/.claude/settings.json`

### 設定ファイルの場所

| 種類 | パス |
|------|------|
| ユーザー設定 | `~/.claude/settings.json` |
| プロジェクト共有設定 | `.claude/settings.json` |
| プロジェクトローカル設定 | `.claude/settings.local.json` |
| エンタープライズポリシー（macOS） | `/Library/Application Support/ClaudeCode/managed-settings.json` |
| エンタープライズポリシー（Linux） | `/etc/claude-code/managed-settings.json` |
| エンタープライズポリシー（Windows） | `C:\Program Files\ClaudeCode\managed-settings.json` |

### 包括的な設定例

```json
{
  "permissions": {
    "allow": [
      "Edit",
      "Bash(git diff:*)",
      "Bash(git log:*)",
      "Bash(git branch:*)",
      "Bash(git show:*)",
      "Bash(git stash:*)",
      "Bash(npm run:*)",
      "Bash(make:*)",
      "Read(~/.zshrc)"
    ],
    "ask": [
      "Bash(git push:*)",
      "Bash(git commit:*)"
    ],
    "deny": [
      "WebFetch",
      "Bash(curl:*)",
      "Bash(wget:*)",
      "Bash(rm -rf:*)",
      "Bash(sudo:*)",
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(./secrets/**)"
    ],
    "additionalDirectories": ["../docs/", "../shared/"],
    "defaultMode": "default"
  },
  "env": {
    "CLAUDE_CODE_ENABLE_TELEMETRY": "1",
    "NODE_ENV": "development"
  },
  "model": "claude-sonnet-4-5-20250929",
  "attribution": {
    "commit": "Generated with AI\n\nCo-Authored-By: Claude <noreply@anthropic.com>",
    "pr": ""
  },
  "sandbox": {
    "enabled": true,
    "autoAllowBashIfSandboxed": true,
    "excludedCommands": ["git", "docker"]
  },
  "outputStyle": "Explanatory"
}
```

### 権限が必要なツール / 不要なツール

**権限が必要:**
- `Bash` - シェルコマンド実行
- `Edit` - ファイル編集
- `Write` - ファイル作成
- `WebFetch` - Web取得
- `WebSearch` - Web検索
- `NotebookEdit` - Jupyter編集

**権限不要（常に許可）:**
- `AskUserQuestion` - ユーザーへの質問
- `Glob` - ファイルパターン検索
- `Grep` - テキスト検索
- `Read` - ファイル読み取り

### Permission Mode（権限モード）

| モード | 説明 | 使用場面 |
|--------|------|----------|
| `default` | 各操作で承認を求める | 通常の開発 |
| `acceptEdits` | 編集は自動承認、コマンドは確認 | 信頼できるタスク |
| `plan` | 読み取り専用、変更不可 | コードベース分析 |
| `bypassPermissions` | すべて自動承認（危険） | CI/CD等の自動化のみ |

**Shift+Tab** でインタラクティブに切り替え可能。

---

## 5. Hooks（フック）システム

### フックの概要

フックは特定のイベント発生時に自動実行されるシェルコマンドです。設定は `settings.json` の `hooks` セクションで定義します。

### 10種類のフックイベント

| フック名 | 発火タイミング | 用途例 |
|---------|---------------|--------|
| **PreToolUse** | ツール実行前 | 入力検証、権限チェック |
| **PostToolUse** | ツール実行後 | フォーマット、追加検証 |
| **PermissionRequest** | 権限ダイアログ表示時 | 自動承認/拒否 |
| **UserPromptSubmit** | ユーザープロンプト送信時 | コンテキスト追加、プロンプト検証 |
| **Notification** | 通知送信時 | カスタム通知処理 |
| **Stop** | メインエージェント停止時 | 追加作業の要求 |
| **SubagentStop** | サブエージェント停止時 | サブタスク完了処理 |
| **SessionStart** | セッション開始時 | 環境変数設定、依存関係チェック |
| **SessionEnd** | セッション終了時 | クリーンアップ処理 |
| **PreCompact** | コンテキスト圧縮前 | 圧縮前の処理 |

### フック設定例

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'Running command...' >> ~/.claude/audit.log"
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
            "command": "npm run format -- \"$CLAUDE_PROJECT_DIR\""
          }
        ]
      }
    ],
    "SessionStart": [
      {
        "matcher": "startup",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'source ~/.nvm/nvm.sh && nvm use' >> \"$CLAUDE_ENV_FILE\""
          }
        ]
      }
    ]
  }
}
```

### フックの決定制御（JSON出力）

フックからJSON出力を返すことで、Claude Codeの動作を制御できます：

**PreToolUse での権限制御:**
```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "allow",
    "permissionDecisionReason": "Auto-approved by CI policy"
  }
}
```

**操作のブロック:**
```json
{
  "decision": "block",
  "reason": "This operation is not allowed in this context"
}
```

### 環境変数の永続化

`SessionStart` フックで `$CLAUDE_ENV_FILE` に書き込むことで環境変数を永続化：

```bash
#!/bin/bash
if [ -n "$CLAUDE_ENV_FILE" ]; then
  echo 'export NODE_ENV=production' >> "$CLAUDE_ENV_FILE"
  echo 'source ~/.nvm/nvm.sh && nvm use 20' >> "$CLAUDE_ENV_FILE"
fi
exit 0
```

---

## 6. サブエージェント

### サブエージェントとは

サブエージェントは、特定のタスクに特化した事前設定済みAIアシスタントです。メイン会話とは独立したコンテキストで動作し、専門的なタスクを委譲できます。

### ファイルの場所

| タイプ | 場所 | スコープ |
|--------|------|---------|
| プロジェクトサブエージェント | `.claude/agents/` | 現在のプロジェクト |
| ユーザーサブエージェント | `~/.claude/agents/` | すべてのプロジェクト |

### サブエージェント定義ファイル形式

```markdown
---
name: code-reviewer
description: コード品質、セキュリティ、保守性を専門とするコードレビュー。コード作成・修正直後にプロアクティブに使用。
tools: Read, Grep, Glob, Bash
model: sonnet
permissionMode: default
---

高度なコード品質とセキュリティ基準を確保するコードレビュー専門家です。

## 実行時の手順
1. `git diff` で最近の変更を確認
2. 修正されたファイルに焦点を当てる
3. 以下のチェックリストに基づいてレビュー

## レビューチェックリスト
- コードの明確さと可読性
- 関数と変数の適切な命名
- 重複コードの排除
- 適切なエラーハンドリング
- シークレットや API キーの露出がないか
- 入力検証の実装
- テストカバレッジ
- パフォーマンス考慮事項

## フィードバック形式
優先度順に整理：
- **Critical**: 修正必須
- **Warning**: 修正すべき
- **Suggestion**: 改善検討
```

### 組み込みサブエージェント

| 名前 | 用途 | 特徴 |
|------|------|------|
| **汎用（general-purpose）** | 複雑なマルチステップタスク | 全ツールアクセス |
| **Plan** | コードベース分析 | 読み取り専用、planモード |
| **Explore** | 高速コードベース検索 | Haikuモデル、読み取り専用 |

### サブエージェントの使用

```bash
# インタラクティブに管理
/agents

# 直接呼び出し
> Use the code-reviewer subagent to check my recent changes

# CLI でカスタム定義
claude --agents '{
  "debugger": {
    "description": "デバッグ専門家",
    "prompt": "エラー分析と修正を行います",
    "tools": ["Read", "Edit", "Bash", "Grep", "Glob"]
  }
}'
```

---

## 7. Agent Skills（スキル）

### スキルとは

スキルは、Claude Codeの機能を拡張するモジュール型の能力です。`SKILL.md` ファイルと補助ファイルで構成されます。

**重要な違い:**
- **スキル**: Claudeが自律的に使用を判断（モデル呼び出し）
- **スラッシュコマンド**: ユーザーが明示的に呼び出し（`/command`）

### スキルの保存場所

```
# 個人スキル（全プロジェクト共通）
~/.claude/skills/my-skill-name/SKILL.md

# プロジェクトスキル（チーム共有）
.claude/skills/my-skill-name/SKILL.md
```

### SKILL.md の形式

```yaml
---
name: generating-commit-messages
description: Gitの差分からコミットメッセージを生成。コミット作成時やステージ済み変更のレビュー時に使用。
allowed-tools: Read, Grep, Glob, Bash
---

# コミットメッセージ生成

## 手順
1. `git diff --staged` で変更を確認
2. 以下の形式でコミットメッセージを提案:
   - 50文字以内の要約
   - 詳細な説明
   - 影響を受けるコンポーネント

## メッセージ形式
Conventional Commits形式を使用:
- feat: 新機能
- fix: バグ修正
- docs: ドキュメント
- style: フォーマット
- refactor: リファクタリング
- test: テスト
- chore: その他
```

### スキルのベストプラクティス

**推奨:**
- 1スキル = 1つの明確な責任
- 具体的なトリガーワードを含む説明
- 必要なツールのみアクセス許可
- プロジェクトスキルはバージョン管理

**スキル名の例:**
- `pdf-form-filling` - PDF入力支援
- `excel-data-analysis` - Excelデータ分析
- `generating-commit-messages` - コミットメッセージ生成

---

## 8. MCP（Model Context Protocol）

### MCPとは

**Model Context Protocol (MCP)** は、Claude Codeを外部ツールやデータソースに接続するためのオープンスタンダードです。

### MCPでできること

- JIRAからイシューを取得し、GitHubでPRを作成
- SentryやStatisigでモニタリングデータを分析
- PostgreSQLから顧客情報を検索
- Figmaのデザインをコードに反映
- Gmail/Slackでの通知送信

### MCPサーバーのインストール

**リモートHTTPサーバー（推奨）:**
```bash
claude mcp add --transport http notion https://mcp.notion.com/mcp
```

**リモートSSEサーバー:**
```bash
claude mcp add --transport sse asana https://mcp.asana.com/sse
```

**ローカルstdioサーバー:**
```bash
claude mcp add --transport stdio airtable --env AIRTABLE_API_KEY=YOUR_KEY \
  -- npx -y airtable-mcp-server
```

### スコープ

| スコープ | 保存場所 | 用途 |
|---------|---------|------|
| local（デフォルト） | `~/.claude.json` | 個人用、機密情報含むサーバー |
| project | `.mcp.json` | チーム共有、バージョン管理 |
| user | `~/.claude.json` | 全プロジェクトで利用 |

### .mcp.json の形式

```json
{
  "mcpServers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer ${GITHUB_TOKEN}"
      }
    },
    "database": {
      "command": "npx",
      "args": ["-y", "@bytebase/dbhub", "--dsn", "${DATABASE_URL}"],
      "env": {
        "DATABASE_URL": "postgresql://user:pass@localhost:5432/mydb"
      }
    },
    "figma": {
      "type": "sse",
      "url": "http://localhost:3845/sse"
    }
  }
}
```

### MCP管理コマンド

```bash
# サーバー一覧
claude mcp list

# サーバー詳細
claude mcp get github

# サーバー削除
claude mcp remove github

# Claude Code内で状態確認
/mcp
```

### MCPリソースの参照

```bash
# @メンションで参照
> Can you analyze @github:issue://123 and suggest a fix?
> Compare @postgres:schema://users with @docs:file://database/user-model
```

---

## 9. 効果的なプロンプト技法

### 具体的な指示を出す

**悪い例（曖昧）:**
```
テストを追加して
```

**良い例（具体的）:**
```
foo.pyに新しいテストケースを作成してください。
ログアウト状態のエッジケースをカバーしてください。
```

### Extended Thinking（拡張思考）の使い分け

| レベル | キーワード | 用途 |
|--------|----------|------|
| 軽量 | `think` | 単純な問題、クイックな修正 |
| 中程度 | `think hard` | 複雑な設計判断 |
| 深い | `think harder` | アーキテクチャ決定 |
| 最深 | `ultrathink` | 全体最適化、大規模リファクタ |

**使用例:**
```
think hard: このAPIの認証方式をJWTからOAuthに変更する設計を考えて
```

**切り替え:** `Tab` キーで思考モードを切り替え

### 探索→計画→実装→コミット サイクル

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│  探索   │ ──▶ │  計画   │ ──▶ │  実装   │ ──▶ │ コミット │
└─────────┘     └─────────┘     └─────────┘     └─────────┘
```

**探索フェーズ:**
```
関連ファイルを読み込んで、現状の実装を分析してください。
この段階ではコードを書かないでください。
```

**計画フェーズ:**
```
think hard: 先ほどの分析を踏まえて、実装計画を立ててください。
```

**実装フェーズ:**
```
計画に従って実装を進めてください。
各ステップで動作確認をしながら進めてください。
```

**コミットフェーズ:**
```
変更内容に基づいてコミットメッセージを生成し、コミットしてください。
```

### Plan Mode（計画モード）

複雑な変更には **Plan Mode** が推奨されます：

```bash
# Shift+Tab で切り替え
# または起動時に指定
claude --permission-mode plan
```

**使用場面:**
- 複数ファイルへの実装
- コードベース探索
- アーキテクチャ設計

### ファイル参照（@構文）

```bash
# ファイル参照
> Explain the logic in @src/utils/auth.js

# ディレクトリ参照
> What's the structure of @src/components?

# 外部リソース参照（MCP）
> Show me the data from @github:repos/owner/repo/issues
```

---

## 10. ワークフローとCLIリファレンス

### 主要なCLIフラグ

| フラグ | 説明 |
|--------|------|
| `--print`, `-p` | 非インタラクティブモード（終了後exit） |
| `--continue`, `-c` | 最新の会話を継続 |
| `--resume`, `-r` | セッションIDを指定して再開 |
| `--model` | モデル指定（`sonnet`, `opus`, `haiku`） |
| `--permission-mode` | 権限モード指定 |
| `--output-format` | 出力形式（`text`, `json`, `stream-json`） |
| `--max-turns` | 最大ターン数制限 |
| `--add-dir` | 追加の作業ディレクトリ |
| `--mcp-config` | MCPサーバー設定ファイル |
| `--debug` | デバッグモード |
| `--verbose` | 詳細ログ出力 |

### 一般的なワークフロー

**コードベース理解:**
```bash
> give me an overview of this codebase
> what technologies does this project use?
> trace the login process from front-end to database
```

**バグ修正:**
```bash
> I'm seeing an error when I run npm test
> suggest a few ways to fix the @ts-ignore in user.ts
> update user.ts to add the null check you suggested
```

**リファクタリング:**
```bash
> find deprecated API usage in our codebase
> refactor utils.js to use ES2024 features while maintaining the same behavior
> run tests for the refactored code
```

**テスト作成:**
```bash
> find functions in NotificationsService.swift that are not covered by tests
> add tests for the notification service
> add test cases for edge conditions
```

**PR作成:**
```bash
> summarize the changes I've made to the authentication module
> create a pr
> enhance the PR description with more context
```

### カスタムスラッシュコマンド

`.claude/commands/` ディレクトリにMarkdownファイルを配置：

**例: `.claude/commands/fix-issue.md`**
```markdown
GitHub Issue #$ARGUMENTS を修正します。

## 手順
1. `gh issue view $ARGUMENTS` で詳細を取得
2. 問題を分析し、関連ファイルを検索
3. 修正を実装
4. テストを実行
5. コミットしてPRを作成
```

**使用方法:**
```bash
> /fix-issue 123
```

### UNIXスタイルパイプ処理

```bash
# エラーログ分析
cat build-error.txt | claude -p 'explain the root cause' > analysis.txt

# JSON出力
cat code.py | claude -p 'analyze for bugs' --output-format json

# ストリーミングJSON
cat log.txt | claude -p 'parse errors' --output-format stream-json
```

### Git Worktreeでの並列セッション

```bash
# 新しいworktree作成
git worktree add ../project-feature-a -b feature-a
cd ../project-feature-a
claude

# worktree管理
git worktree list
git worktree remove ../project-feature-a
```

### キーボードショートカット

| ショートカット | 機能 |
|---------------|------|
| `Shift+Tab` | 権限モード切り替え |
| `Tab` | Thinking（思考）モード切り替え |
| `Ctrl+K` | 検索 |
| `↑` | コマンド履歴 |
| `/` | スラッシュコマンド一覧 |
| `?` | 全ショートカット表示 |

---

## 11. セキュリティ対策

### 基本原則

- **デフォルトは読み取り専用**: 機密操作には明示的な許可が必要
- **書き込み制限**: 起動ディレクトリとそのサブフォルダのみ書き込み可能
- **サンドボックス対応**: `/sandbox` コマンドでファイルシステム・ネットワーク隔離

### 組み込み保護機能

| 保護機能 | 説明 |
|---------|------|
| **権限システム** | 機密操作は明示的な承認が必要 |
| **コンテキスト分析** | 潜在的に有害な指示を検出 |
| **入力サニタイズ** | コマンドインジェクション防止 |
| **コマンドブロックリスト** | `curl`, `wget` などデフォルトでブロック |
| **ネットワークリクエスト承認** | 外部通信は承認が必要 |
| **分離コンテキスト** | Web fetchは別コンテキストで実行 |

### 機密ファイルの保護

```json
{
  "permissions": {
    "deny": [
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(./secrets/**)",
      "Read(./config/credentials.json)",
      "Read(./.git/config)"
    ]
  }
}
```

### セキュリティベストプラクティス

**機密コード作業時:**
1. 提案された変更は承認前に必ずレビュー
2. 機密リポジトリにはプロジェクト固有の権限設定を使用
3. devcontainer の使用を検討
4. `/permissions` で定期的に権限設定を監査

**チームセキュリティ:**
1. Enterprise managed policies で組織標準を強制
2. 承認済み権限設定をバージョン管理で共有
3. チームメンバーにセキュリティベストプラクティスを教育

**信頼できないコンテンツ:**
1. 提案されたコマンドは承認前にレビュー
2. 信頼できないコンテンツを直接パイプしない
3. 重要ファイルへの変更提案を検証
4. 外部Webサービスとの連携時はVMの使用を検討

### Windows WebDAVリスク

Windows環境では、WebDAVへのアクセスや `\\*` パスを含むWebDAVサブディレクトリへのアクセスを避けてください。権限システムをバイパスするネットワークリクエストがトリガーされる可能性があります。

---

## 12. トラブルシューティング

### MCP デバッグ

```bash
# デバッグモードで起動
claude --mcp-debug

# サーバー状態確認
/mcp
```

### よくある問題と解決策

| 問題 | 解決策 |
|------|--------|
| MCPサーバーが接続できない | `claude mcp list` で設定確認、`--mcp-debug` でデバッグ |
| フックが動作しない | 実行権限確認（`chmod +x`）、パス確認 |
| スキルが使用されない | description に具体的なトリガーワードを追加 |
| 権限エラー | `.claude/settings.json` の permissions 設定を確認 |
| メモリが読み込まれない | ファイルパスとYAML frontmatter構文を確認 |

### ログとデバッグ

```bash
# 詳細ログ出力
claude --verbose

# デバッグモード（カテゴリ指定可能）
claude --debug

# 特定カテゴリのデバッグ
claude --debug=mcp,hooks
```

### セキュリティ問題の報告

セキュリティ脆弱性を発見した場合：
1. 公開しない
2. [Anthropic HackerOneプログラム](https://hackerone.com/anthropic-vdp/reports/new?type=team&report_type=vulnerability) で報告
3. 詳細な再現手順を含める

---

## 付録: クイックリファレンス

### 重要なファイルパス

| ファイル | 用途 |
|---------|------|
| `CLAUDE.md` | プロジェクト指示 |
| `.claude/settings.json` | Claude Code設定（共有） |
| `.claude/settings.local.json` | Claude Code設定（個人） |
| `.mcp.json` | MCPサーバー設定 |
| `.claude/commands/*.md` | カスタムスラッシュコマンド |
| `.claude/agents/*.md` | サブエージェント定義 |
| `.claude/skills/*/SKILL.md` | スキル定義 |
| `.claude/rules/*.md` | モジュール型ルール |

### よく使うコマンド

```bash
# 基本操作
claude                    # インタラクティブモード
claude -c                 # 会話継続
claude -p "query"         # ワンショット
/help                     # ヘルプ
/clear                    # 履歴クリア

# 設定
/config                   # 設定画面
/memory                   # メモリ編集
/permissions              # 権限確認
/mcp                      # MCP状態

# エージェント
/agents                   # サブエージェント管理
/init                     # プロジェクト初期化
```

---

**最終更新:** 2025-12-10
**公式ドキュメント:** https://code.claude.com/docs/en/
**参照記事:** https://zenn.dev/farstep/articles/claude-code-best-practices
