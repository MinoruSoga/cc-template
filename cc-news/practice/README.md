# Template/.claude フォルダ設定実践ガイド

このフォルダには、Anthropicエンジニアリングブログの内容に基づいた`Template/.claude`フォルダの実践的な設定手順をまとめています。

## Template/.claude フォルダの基本構造

```
Template/                       # プロジェクトテンプレート（コピーして使用）
├── .mcp.json                  # MCPサーバー設定（プロジェクトルート）
├── .claude/
│   ├── CLAUDE.md              # プロジェクト固有の指示
│   ├── settings.json          # Claude Code設定
│   ├── settings.local.json    # ローカル設定（gitignore）
│   ├── commands/              # カスタムスラッシュコマンド
│   │   ├── review.md
│   │   └── deploy.md
│   ├── hooks/                 # Hookスクリプト
│   │   └── auto-format.sh
│   └── skills/                # Agent Skills
│       ├── database/
│       │   └── SKILL.md
│       └── api/
│           └── SKILL.md
└── ...
```

## 実践ガイド一覧

### 01. CLAUDE.md 設定ガイド
- [01-claude-md-configuration.md](./01-claude-md-configuration.md)
  - 基づく記事: コンテキストエンジニアリング、エージェント構築、Claude Codeベストプラクティス
  - CLAUDE.mdの構造と書き方
  - コンテキスト最適化のテクニック

### 02. Agent Skills 設定ガイド
- [02-agent-skills-setup.md](./02-agent-skills-setup.md)
  - 基づく記事: Agent Skills
  - SKILL.mdファイルの作成方法
  - スキルディレクトリの構成

### 03. MCP サーバー設定ガイド
- [03-mcp-server-configuration.md](./03-mcp-server-configuration.md)
  - 基づく記事: Code Execution with MCP、Desktop Extensions
  - MCPサーバーのインストールと設定
  - Desktop Extensions（.mcpx）の活用

### 04. セキュリティ設定ガイド
- [04-security-configuration.md](./04-security-configuration.md)
  - 基づく記事: セキュリティとサンドボックス
  - サンドボックス設定
  - ファイルシステム/ネットワーク分離

### 05. カスタムコマンド設定ガイド
- [05-custom-commands.md](./05-custom-commands.md)
  - 基づく記事: ツール設計、Claude Codeベストプラクティス
  - スラッシュコマンドの作成
  - コマンドテンプレート

### 06. Hooks 設定ガイド
- [06-hooks-configuration.md](./06-hooks-configuration.md)
  - 基づく記事: ツール設計、マルチエージェントシステム
  - PreToolUse/PostToolUseフックの設定
  - 自動化ワークフロー

### 07. 長時間タスク向け設定ガイド
- [07-long-running-workflow.md](./07-long-running-workflow.md)
  - 基づく記事: 長時間実行エージェント
  - 進捗追跡の設定
  - セッション間の状態管理

### 08. ツール設計ガイド
- [08-tool-design-guide.md](./08-tool-design-guide.md)
  - 基づく記事: ツール設計、Advanced Tool Use
  - MCPツールの設計原則
  - Think Toolの活用

## クイックスタート

### 最小構成（すぐに始める）

```bash
# Template フォルダ内で実行
mkdir -p Template/.claude/commands Template/.claude/skills

# 基本的なCLAUDE.mdを作成
cat > Template/.claude/CLAUDE.md << 'EOF'
# プロジェクト概要

このプロジェクトは[プロジェクト名]です。

## 技術スタック
- [言語/フレームワーク]

## 重要なルール
- [ルール1]
- [ルール2]

## よく使うコマンド
- `npm run dev` - 開発サーバー起動
- `npm test` - テスト実行
EOF
```

### 推奨構成（本格的な活用）

1. まず[01-claude-md-configuration.md](./01-claude-md-configuration.md)でCLAUDE.mdを最適化
2. 繰り返しタスクがあれば[05-custom-commands.md](./05-custom-commands.md)でコマンド化
3. 専門知識が必要なら[02-agent-skills-setup.md](./02-agent-skills-setup.md)でスキル追加
4. セキュリティ要件があれば[04-security-configuration.md](./04-security-configuration.md)を適用

## 設定の優先順位

| 優先度 | 設定項目 | 効果 |
|--------|----------|------|
| 高 | CLAUDE.md | コンテキスト品質向上 |
| 高 | カスタムコマンド | 繰り返しタスクの効率化 |
| 中 | Agent Skills | 専門知識の提供 |
| 中 | MCP サーバー | 外部ツール連携 |
| 低 | Hooks | 自動化ワークフロー |
| 低 | 長時間タスク設定 | 大規模プロジェクト向け |

---

*各ガイドは独立して参照できます。必要な項目から始めてください。*
