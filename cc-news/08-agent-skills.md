# Agent Skills: エージェントのための専門的能力拡張

> 出典: [Equipping Agents for the Real World with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)

## 概要

**Agent Skills**は、ファイルとフォルダで組織化された指示書、スクリプト、リソースを使用して、AIエージェントに専門的な能力を動的に提供するシステムです。これにより、エージェントは特定のドメインや作業に最適化された知識とツールにアクセスできます。

## 基本構造

### SKILL.mdファイル

Agent Skillsの核心は`SKILL.md`ファイルです：

```markdown
---
name: データベース管理
description: PostgreSQLデータベースの操作と最適化のためのスキル
---

# データベース管理スキル

## 基本コマンド
- 接続: `psql -U user -d database`
- バックアップ: `pg_dump database > backup.sql`

## ベストプラクティス
- インデックスを適切に使用
- 定期的なVACUUM実行
```

### 必須メタデータ

YAML frontmatterに以下を含める：
- `name`: スキル名
- `description`: スキルの説明

> 「起動時に、エージェントは名前と説明をシステムプロンプトに事前ロードする」

## 段階的な情報開示

このアーキテクチャは3段階の設計を採用：

```
第1段階: メタデータのみ
    ↓ エージェントがスキルを使用すべきか判断
第2段階: 完全なSKILL.mdコンテンツ
    ↓ 基本的な指示とガイドライン
第3段階+: 参照ファイル
    reference.md, forms.md など
```

### 利点

- 初期コンテキストを最小化
- 必要に応じて詳細情報をロード
- トークン効率の最適化

## スキルの組織構造

### ディレクトリ構成例

```
skills/
├── database-management/
│   ├── SKILL.md           # メインスキルファイル
│   ├── reference.md       # 詳細リファレンス
│   ├── forms.md           # フォームテンプレート
│   └── scripts/
│       ├── backup.sh
│       └── optimize.sql
├── api-integration/
│   ├── SKILL.md
│   └── examples/
└── deployment/
    ├── SKILL.md
    └── checklists/
```

### SKILL.md例

```markdown
---
name: API統合
description: RESTful APIとの統合およびデータ同期
---

# API統合スキル

このスキルを使用する場面:
- 外部サービスとのデータ連携
- Webhook設定
- API認証の実装

## クイックリファレンス

### 認証方式
詳細は [reference.md](./reference.md) を参照

### 一般的なパターン
詳細は [patterns.md](./patterns.md) を参照
```

## 実装のベストプラクティス

### 1. 評価から開始する

```
ステップ:
1. エージェントを代表的なタスクで実行
2. 「エージェントの能力のギャップ」を特定
3. ギャップを埋めるスキルを作成
```

### 2. スケーリングのための構造化

**SKILL.mdが大きくなった場合**：

```markdown
# SKILL.md（簡潔に保つ）
---
name: 大規模スキル
description: 複雑な作業のためのスキル
---

## 概要
基本的な指示のみ

## 詳細リファレンス
- 設定: [config.md](./config.md)
- トラブルシューティング: [troubleshooting.md](./troubleshooting.md)
- API仕様: [api-spec.md](./api-spec.md)
```

**相互に排他的なコンテキスト**を別パスに保つことでトークン使用量を削減：

```
skills/
├── deployment/
│   ├── SKILL.md
│   ├── aws/           # AWS固有
│   ├── gcp/           # GCP固有
│   └── azure/         # Azure固有
```

### 3. セキュリティ考慮事項

> 「信頼できるソースからのスキルのみをインストール」することを推奨

不確実なソースからのスキルは以下を監査：

| チェック項目 | 確認内容 |
|--------------|----------|
| コード依存関係 | 悪意のあるパッケージがないか |
| バンドルリソース | 不正なファイルがないか |
| 外部ネットワーク接続 | 不審な通信がないか |

## スキルの作成手順

### ステップ1: ニーズの特定

```
質問:
- エージェントが繰り返し失敗するタスクは？
- どの専門知識が不足しているか？
- どのような構造化された指示が役立つか？
```

### ステップ2: SKILL.mdの作成

```markdown
---
name: [スキル名]
description: [1-2文の説明]
---

# [スキル名]

## このスキルを使用する場面
- [条件1]
- [条件2]

## 基本手順
1. [ステップ1]
2. [ステップ2]

## 重要な注意点
- [注意1]
- [注意2]
```

### ステップ3: 補助ファイルの追加

必要に応じて：
- `reference.md`: 詳細なリファレンス
- `examples/`: 具体例
- `scripts/`: 実行可能なスクリプト
- `templates/`: テンプレートファイル

### ステップ4: テストと反復

```
1. スキルをエージェントに導入
2. 代表的なタスクで実行
3. パフォーマンスを評価
4. SKILL.mdを改善
5. 繰り返し
```

## 利用可能なプラットフォーム

Agent Skillsは以下で即日利用可能：

| プラットフォーム | 利用方法 |
|------------------|----------|
| Claude.ai | チャットでスキルを参照 |
| Claude Code | プロジェクト内にskillsディレクトリ |
| Agent SDK | スキルディレクトリを設定 |

## リソース

- [公式ドキュメント](https://docs.anthropic.com/agent-skills)
- [GitHubクックブック](https://github.com/anthropics/agent-skills-cookbook)

## まとめ

Agent Skillsにより：
- エージェントに専門知識を動的に提供
- コンテキスト効率を最適化
- 再利用可能なスキルライブラリを構築
- チーム間でスキルを共有

段階的な情報開示により、必要な時に必要な情報だけをエージェントに提供することで、効率的でパワフルなエージェント体験を実現します。
