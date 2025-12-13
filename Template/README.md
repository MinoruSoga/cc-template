# Claude Code テンプレート

Claude Code の包括的な設定テンプレートです。

## 📁 構成

```
Template/
├── .claude/                    # Claude Code 設定ディレクトリ
│   ├── CLAUDE.md              # プロジェクト指示書テンプレート
│   ├── settings.json          # 設定ファイル
│   ├── settings.local.json    # ローカル設定（サンプル）
│   ├── README.md              # 設定ガイド（詳細）
│   ├── agents/                # サブエージェント定義
│   ├── skills/                # Agent Skills
│   ├── commands/              # カスタムスラッシュコマンド
│   ├── hooks/                 # フックスクリプト
│   ├── docs/                  # ドキュメント・ベストプラクティス
│   ├── scripts/               # 初期化・ユーティリティスクリプト
│   ├── output-styles/         # 出力スタイル定義
│   └── features.json          # 機能追跡テンプレート
│
├── .mcp.json                  # MCP サーバー設定
├── .env.example               # 環境変数テンプレート
├── cipher.yml                 # Cipher MCP 設定
├── CLAUDE.md                  # プロジェクトルート用 CLAUDE.md
└── docs/                      # 追加ドキュメント
```

---

## 🚀 使用方法

### 方法1: ccフォルダから自動適用（推奨）

```bash
# ccフォルダでClaude Codeを起動
cd /Users/minoru/Dev/cc
claude

# コマンドで作業プロジェクトに適用
/optimize-claude-config /path/to/project
```

### 方法2: 手動コピー

```bash
# テンプレートをプロジェクトにコピー
cp -r /Users/minoru/Dev/cc/Template/.claude /path/to/your/project/
cp /Users/minoru/Dev/cc/Template/.mcp.json /path/to/your/project/
cp /Users/minoru/Dev/cc/Template/CLAUDE.md /path/to/your/project/

# プロジェクトに合わせてカスタマイズ
# 1. CLAUDE.md のプロジェクト情報を更新
# 2. .claude/settings.json の permissions を調整
# 3. .mcp.json のパスを更新
```

---

## ⚙️ カスタマイズ項目

### 1. CLAUDE.md（必須）

プロジェクト固有の情報を設定:
- プロジェクト名・説明
- 技術スタック
- 開発コマンド
- ディレクトリ構造

### 2. settings.json

#### 環境変数

```json
{
  "env": {
    "DOCKER_PROJECT": "your-project-name",
    "MAX_THINKING_TOKENS": "10000"
  }
}
```

#### 権限設定

```json
{
  "permissions": {
    "allow": ["Bash(make:*)"],
    "deny": ["Read(.env*)"],
    "ask": ["Bash(rm:*)"]
  }
}
```

### 3. .mcp.json

MCP サーバーのパスを更新:

```json
{
  "mcpServers": {
    "cipher": {
      "env": {
        "CIPHER_AGENT_CONFIG": "/absolute/path/to/your-project/cipher.yml"
      }
    }
  }
}
```

---

## 🤖 含まれるエージェント

| エージェント | モデル | 用途 |
|-------------|--------|------|
| `architect` | Opus | アーキテクチャ設計、セキュリティ監査 |
| `implementer` | Sonnet | 機能実装、テスト作成 |
| `reviewer` | Sonnet | コードレビュー、品質チェック |
| `debugger` | Sonnet | バグ調査、エラー分析 |
| `researcher` | Haiku | コード検索、ファイル探索 |
| `formatter` | Haiku | コミット生成、コード整形 |
| `prisma-expert` | Sonnet | DB設計、マイグレーション計画 |

---

## 📚 含まれるスキル

| スキル | トリガー | 用途 |
|--------|---------|------|
| `generating-commits` | 「コミット」 | Conventional Commits 形式でメッセージ生成 |
| `reviewing-code` | 「レビュー」 | コードレビュー支援 |
| `analyzing-prisma` | 「スキーマ」 | Prisma スキーマ分析 |
| `database` | DB操作時 | データベース管理 |
| `deployment` | デプロイ時 | デプロイメント支援 |
| `testing` | テスト時 | テスト作成・実行 |
| `context-engineering` | 複雑なタスク | コンテキスト管理 |
| `multi-agent` | 大規模タスク | マルチエージェント設計 |

---

## 🔧 含まれるコマンド

| コマンド | 説明 |
|---------|------|
| `/review` | コードレビュー実行 |
| `/test` | テスト作成・実行 |
| `/debug` | デバッグ支援 |
| `/status` | プロジェクト状態確認 |
| `/save` | 進捗保存 |
| `/deploy` | デプロイメント支援 |
| `/docs` | ドキュメント生成 |
| `/gen-test` | テストコード自動生成 |
| `/next` | 次のタスク提案 |
| `/refactor` | リファクタリング支援 |

---

## 🪝 含まれるフック

| フック | タイミング | 機能 |
|--------|----------|------|
| `block-dangerous.sh` | PreToolUse | 危険コマンドをブロック |
| `auto-format.sh` | PostToolUse | 自動フォーマット |
| `log-commands.sh` | PostToolUse | コマンドログ記録 |
| `session-init.sh` | SessionStart | セッション初期化 |
| `cleanup.sh` | Stop | クリーンアップ |

---

## 📖 ドキュメント

`.claude/docs/` に含まれるベストプラクティス:

- エージェント設計パターン
- コンテキストエンジニアリング
- マルチエージェントシステム
- 長時間タスク管理
- セキュリティガイドライン
- MCP 連携

---

## 🔗 関連リソース

- [Claude Code 公式ドキュメント](https://docs.anthropic.com/claude-code)
- [MCP 公式サイト](https://modelcontextprotocol.io/)
- [cc-news/](../cc-news/) - 最新のベストプラクティス（参考）
- [cc-blog/](../cc-blog/) - 設計思想・理論（参考）

---

**最終更新:** 2025-12-13
