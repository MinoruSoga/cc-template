# サブエージェント

サブエージェントは、特定のタスクに特化した事前設定済みAIアシスタントです。メイン会話とは独立したコンテキストで動作し、専門的なタスクを委譲できます。

## ファイルの場所

| タイプ | 場所 | スコープ |
|--------|------|---------|
| プロジェクトサブエージェント | `.claude/agents/` | 現在のプロジェクト |
| ユーザーサブエージェント | `~/.claude/agents/` | すべてのプロジェクト |

---

## サブエージェント定義ファイル形式

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
- パフォーマンス考慮事項

## フィードバック形式
優先度順に整理：
- **Critical**: 修正必須
- **Warning**: 修正すべき
- **Suggestion**: 改善検討
```

---

## frontmatter設定

| キー | 説明 | 例 |
|------|------|-----|
| `name` | エージェント名 | `code-reviewer` |
| `description` | 説明（使用タイミング含む） | レビュー時に使用 |
| `tools` | 利用可能なツール | `Read, Grep, Glob, Bash` |
| `model` | 使用モデル | `sonnet`, `opus`, `haiku` |
| `permissionMode` | 権限モード | `default`, `plan` |

### `permissionMode` について

| モード | 説明 | 用途 |
|--------|------|------|
| `default` | ファイル編集・Bash実行が可能 | 実装、テスト、デバッグ |
| `plan` | 読み取り専用。コードの変更不可 | 設計分析、レビュー、計画 |

`permissionMode: plan` を設定すると、エージェントは読み取り専用モードで動作します。アーキテクチャ分析やコードレビューなど、分析・評価のみを行うエージェントに適しています。

---

## 組み込みサブエージェント

| 名前 | 用途 | 特徴 |
|------|------|------|
| **汎用（general-purpose）** | 複雑なマルチステップタスク | 全ツールアクセス |
| **Plan** | コードベース分析 | 読み取り専用、planモード |
| **Explore** | 高速コードベース検索 | Haikuモデル、読み取り専用 |

---

## プロジェクトサブエージェント一覧

| エージェント | モデル | permissionMode | 用途 |
|-------------|--------|---------------|------|
| `architect` | Opus | plan | アーキテクチャ設計、セキュリティ監査 |
| `planner` | Sonnet | plan | タスク分解、実装計画 |
| `implementer` | Sonnet | default | 機能実装、リファクタリング |
| `reviewer` | Sonnet | plan | コードレビュー、PR確認 |
| `debugger` | Sonnet | default | バグ調査、エラー分析 |
| `db-expert` | Sonnet | default | DB設計、マイグレーション |
| `web-researcher` | Haiku | default | 外部ドキュメント・ライブラリ調査 |
| `documenter` | Haiku | default | ドキュメント自動生成 |

---

## サブエージェントの使用

### インタラクティブに管理
```bash
/agents
```

### 直接呼び出し
```
> Use the architect subagent to design the authentication system
> Have the reviewer subagent check my recent changes
> Ask the debugger subagent to investigate this error
> Use the planner subagent to break down this feature into tasks
```

### CLI でカスタム定義
```bash
claude --agents '{
  "debugger": {
    "description": "デバッグ専門家",
    "prompt": "エラー分析と修正を行います",
    "tools": ["Read", "Edit", "Bash", "Grep", "Glob"]
  }
}'
```

---

## 3層モデル: Skills vs Agents vs Commands

| 層 | トリガー | コンテキスト | 用途 |
|---|---------|-----------|------|
| **Skills** | Claude が自律判断 | メイン会話と共有 | 軽量・単発タスク |
| **Agents** | 明示的委譲 | 独立コンテキスト | 複雑・複数ステップタスク |
| **Commands** | ユーザーが `/command` で実行 | メイン会話 | ショートカット |

### Skills と Agents のクロスリファレンス

| スキル | 対応エージェント | 使い分け |
|--------|----------------|---------|
| `reviewing-code` | `reviewer` | スキル=軽量チェック / エージェント=PR全体レビュー |
| `testing` | `tester` | スキル=テスト方針ガイド / エージェント=テストスイート一括作成 |
| `analyzing-schema` / `database` | `db-expert` | スキル=分析・単発操作 / エージェント=設計・マイグレーション |
| `generating-commits` | — | スキルのみ（エージェント不要） |

---

## ベストプラクティス

1. **明確なdescription**: いつ使うべきかを明記（起動条件を含める）
2. **最小限のtools**: 必要なツールのみ許可
3. **適切なmodel**:
   - 複雑な分析: `opus`
   - 一般的なタスク: `sonnet`
   - 高速・低コスト: `haiku`
4. **具体的な手順**: 実行手順をステップで明記
5. **permissionMode**: 読み取り専用エージェントには `plan` を設定

---

## Agent Teams（実験的）

複数のエージェントが協調してタスクを遂行する機能です。環境変数で有効化：

```bash
CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
```

### 概要

Agent Teams では、オーケストレーターエージェントが複数のサブエージェントにタスクを分配し、結果を統合します。大規模なコードベース変更やマルチファイルリファクタリングに有効です。

### チーム構成テンプレート

| チーム | フロー | 用途 |
|--------|--------|------|
| 機能実装 | `planner` → `implementer` → `tester` → `reviewer` | 新機能の設計から実装まで |
| バグ修正 | `web-researcher` → `debugger` → `implementer` → `tester` | バグ調査から修正・テストまで |
| アーキテクチャレビュー | `architect` → `reviewer` → `planner` | 設計評価と改善計画 |

### コスト考慮事項

| 構成 | トークン倍率 |
|------|------------|
| シングルエージェント | 1x |
| 2エージェント | ~5x |
| 3-4エージェント | ~10-15x |

Agent Teams はトークン消費が大きいため、高価値タスクでのみ使用してください。

### 注意事項

- この機能は **実験的** であり、今後のリリースで変更される可能性があります
- 各エージェントは独立コンテキストで動作するため、コンテキスト共有には限界があります
- `permissionMode: plan` のエージェントは読み取り専用です

詳細は [Agent Teams ドキュメント](18-agent-teams.md) を参照してください。
