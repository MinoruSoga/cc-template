# Anthropic Engineering ブログまとめ

Anthropicのエンジニアリングブログ（https://www.anthropic.com/engineering）の記事を日本語でまとめたドキュメント集です。

**記事は公開日の古い順に番号を振っています。**

## 目次

### 01. Contextual Retrieval（2024-09-19）
- [01-contextual-retrieval.md](./01-contextual-retrieval.md)
  - RAGの検索精度を67%向上させる手法
  - Contextual EmbeddingsとContextual BM25
  - コンテキストエンジニアリングの基礎

### 02. Building Effective Agents（2024-12-19）
- [02-building-effective-agents.md](./02-building-effective-agents.md)
  - 効果的なエージェント構築の包括的ガイド
  - 6つの基本設計パターン
  - ワークフローとエージェントの違い
  - Claude Agent SDKの使用方法

### 03. Claude Code ベストプラクティス（2025-01-06 / 2025-04-18）
- [03-claude-code-best-practices.md](./03-claude-code-best-practices.md)
  - SWE-bench Verifiedで49%達成
  - CLAUDE.mdファイルの活用
  - Explore, Plan, Code, Commitワークフロー

### 04. ツール設計とAdvanced Tool Use（2025-03-20 / 2025-09-11 / 2025-11-24）
- [04-tool-design.md](./04-tool-design.md)
  - 効果的なツール設計の5原則
  - Think Tool（シンクツール）の活用
  - Tool Search Tool、Programmatic Tool Calling、Tool Use Examples

### 05. マルチエージェントシステム（2025-06-13）
- [05-multi-agent-systems.md](./05-multi-agent-systems.md)
  - オーケストレーター・ワーカーパターン
  - 8つのプロンプティング原則
  - 並列化による研究時間90%削減

### 06. コード実行とMCP（2025-06-26 / 2025-11-04）
- [06-code-execution-mcp.md](./06-code-execution-mcp.md)
  - MCPによるコード実行でトークン98.7%削減
  - Desktop Extensions（.mcpbファイル）
  - ワンクリックMCPサーバーインストール

### 07. インフラストラクチャ障害の事後分析（2025-09-17）
- [07-postmortem-infrastructure-bugs.md](./07-postmortem-infrastructure-bugs.md)
  - 3つの重大な障害とその原因
  - 検出が困難だった理由
  - 改善措置と学んだ教訓

### 08. Agent Skills（2025-10-16）
- [08-agent-skills.md](./08-agent-skills.md)
  - SKILL.mdによる専門能力の提供
  - 段階的な情報開示アーキテクチャ
  - スキルの作成とセキュリティ考慮事項

### 09. セキュリティとサンドボックス（2025-10-20）
- [09-security-sandboxing.md](./09-security-sandboxing.md)
  - ファイルシステム分離とネットワーク分離
  - Sandboxed Bash Toolとクラウドサンドボックス
  - 許可プロンプト84%削減

### 10. 長時間実行エージェント（2025-11-26）
- [10-long-running-agents.md](./10-long-running-agents.md)
  - 複数コンテキストウィンドウにわたる進捗維持
  - 2エージェントアーキテクチャ（イニシャライザー + コーディング）
  - 進捗追跡とGit連携

## 元記事一覧（公開日順）

| # | 公開日 | タイトル | URL |
|---|--------|---------|-----|
| 1 | 2024-09-19 | Introducing Contextual Retrieval | /engineering/contextual-retrieval |
| 2 | 2024-12-19 | Building effective agents | /engineering/building-effective-agents |
| 3 | 2025-01-06 | Raising the bar on SWE-bench Verified with Claude 3.5 Sonnet | /engineering/swe-bench-sonnet |
| 4 | 2025-03-20 | The "think" tool: Enabling Claude to stop and think | /engineering/claude-think-tool |
| 5 | 2025-04-18 | Claude Code: Best practices for agentic coding | /engineering/claude-code-best-practices |
| 6 | 2025-06-13 | How we built our multi-agent research system | /engineering/multi-agent-research-system |
| 7 | 2025-06-26 | Desktop Extensions: One-click MCP server installation | /engineering/desktop-extensions |
| 8 | 2025-09-11 | Writing effective tools for agents — with agents | /engineering/writing-tools-for-agents |
| 9 | 2025-09-17 | A postmortem of three recent issues | /engineering/a-postmortem-of-three-recent-issues |
| 10 | 2025-09-29 | Effective context engineering for AI agents | /engineering/effective-context-engineering-for-ai-agents |
| 11 | 2025-09-29 | Building agents with the Claude Agent SDK | /engineering/building-agents-with-the-claude-agent-sdk |
| 12 | 2025-10-16 | Equipping agents for the real world with Agent Skills | /engineering/equipping-agents-for-the-real-world-with-agent-skills |
| 13 | 2025-10-20 | Beyond permission prompts: making Claude Code more secure | /engineering/claude-code-sandboxing |
| 14 | 2025-11-04 | Code execution with MCP: Building more efficient agents | /engineering/code-execution-with-mcp |
| 15 | 2025-11-24 | Introducing advanced tool use on the Claude Developer Platform | /engineering/advanced-tool-use |
| 16 | 2025-11-26 | Effective harnesses for long-running agents | /engineering/effective-harnesses-for-long-running-agents |

## 主要なベストプラクティスまとめ

### エージェント設計
1. **シンプルさを優先** - 複雑なフレームワークより単純で組み合わせ可能なパターン
2. **透明性を確保** - 計画ステップを可視化
3. **明確なツールドキュメント** - Agent-Computer Interface設計

### コンテキスト管理
1. **最小の高信号トークンセット**を見つける
2. **ジャストインタイム検索**でオンデマンドにコンテンツをロード
3. **コンパクション**で長時間セッションの要約とリセット

### ツール設計
1. **少数の目的特化ツール** > 多くの汎用ラッパー
2. **名前空間**で関連ツールをグループ化
3. **意味のあるコンテキスト**をレスポンスに含める

### セキュリティ
1. **ファイルシステム分離**と**ネットワーク分離**の両方が必須
2. **最小権限の原則**を適用
3. **信頼できるソースからのスキルのみ**をインストール

### 評価と改善
1. **小さなサンプル**（~20テストケース）から開始
2. **LLMジャッジ**と**人間評価**の組み合わせ
3. **継続的な品質監視**で早期に問題を検出

---

*最終更新: 2025年12月*
*出典: https://www.anthropic.com/engineering*
