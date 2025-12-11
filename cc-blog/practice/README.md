# 実践ガイド: Claude Code の構成

このディレクトリには、Anthropic Engineering Blog のベストプラクティスと既存の構造に基づき、`Template/.claude` 環境を構成するためのステップバイステップガイドが含まれています。

## ガイド一覧

1.  [**ステップ 1: プロジェクトとエージェントの構成**](./step1_project_config.md)

    - `Template/.claude/settings.json` の設定
    - サブエージェント (`Template/.claude/agents/`) の活用
    - 出力スタイル (`Template/.claude/output-styles/`) のカスタマイズ

2.  [**ステップ 2: MCP とツールのセットアップ**](./step2_mcp_setup.md)

    - プロジェクト MCP サーバーの有効化
    - テンプレート内の Cipher MCP (メモリエージェント) 設定

3.  [**ステップ 3: エージェントスキルの実装**](./step3_agent_skills.md)
    - `skills/<skill-name>/SKILL.md` 構造の活用
    - 決定論的なスクリプトのベストプラクティス

## 目標

`Template/.claude` の既存構成を最適化し、「エージェント」機能を最大限に活用することを目指します：

- **構造化されたコンテキスト**: ディレクトリベースのスキルを使用。
- **セキュリティ**: `settings.json` の `permissions` を調整。
- **専門化**: `agents/` で定義された専門サブエージェントを使用。
