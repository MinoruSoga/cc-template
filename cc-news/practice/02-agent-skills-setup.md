# Agent Skills 設定ガイド

> 基づく記事: Equipping Agents for the Real World with Agent Skills

## 概要

Agent Skillsは、SKILL.mdファイルを使用してAIエージェントに専門的な能力を動的に提供するシステムです。段階的な情報開示により、必要な時に必要な情報だけをエージェントに提供します。

## ディレクトリ構造

```
Template/
├── .claude/
│   └── skills/
│       ├── database/
│       │   ├── SKILL.md
│       │   ├── reference.md
│       │   └── scripts/
│       │       └── backup.sh
│       ├── deployment/
│       │   ├── SKILL.md
│       │   ├── aws/
│       │   ├── gcp/
│       │   └── azure/
│       └── testing/
│           ├── SKILL.md
│           └── templates/
└── ...
```

## SKILL.md の基本構造

### 必須フォーマット

```markdown
---
name: スキル名
description: スキルの1-2文の説明
---

# スキル名

## このスキルを使用する場面
- [条件1]
- [条件2]

## 基本手順
1. [ステップ1]
2. [ステップ2]

## 重要な注意点
- [注意1]
- [注意2]

## 詳細リファレンス
- 設定詳細: [config.md](./config.md)
- トラブルシューティング: [troubleshooting.md](./troubleshooting.md)
```

### メタデータの重要性

```yaml
---
name: データベース管理      # 起動時にシステムプロンプトに表示
description: PostgreSQL操作  # エージェントがスキルを選択する判断基準
---
```

## 段階的情報開示アーキテクチャ

```
第1段階: メタデータのみ（name + description）
    ↓ エージェントがスキルの使用を判断
第2段階: 完全なSKILL.mdコンテンツ
    ↓ 基本的な指示とガイドライン
第3段階+: 参照ファイル
    reference.md, forms.md など必要に応じて
```

## 実践的なスキル例

### 例1: データベース管理スキル

```bash
mkdir -p Template/.claude/skills/database
```

`Template/.claude/skills/database/SKILL.md`:
```markdown
---
name: データベース管理
description: PostgreSQLデータベースの操作、マイグレーション、最適化
---

# データベース管理スキル

## このスキルを使用する場面
- データベースマイグレーションの作成・実行
- クエリパフォーマンスの最適化
- バックアップ・リストア作業

## 基本コマンド

### マイグレーション
```bash
# マイグレーション作成
npx prisma migrate dev --name [migration_name]

# マイグレーション適用
npx prisma migrate deploy

# スキーマ同期
npx prisma db push
```

### データベース操作
```bash
# Prisma Studio起動
npx prisma studio

# シード実行
npx prisma db seed
```

## 命名規則
- マイグレーション: `YYYYMMDD_description`
- テーブル: snake_case、複数形
- カラム: snake_case

## 重要な注意点
- 本番環境では必ず `migrate deploy` を使用
- 破壊的変更は段階的に実施
- インデックスは `CREATE INDEX CONCURRENTLY` を使用

## 詳細リファレンス
- スキーマ設計ガイド: [schema-guide.md](./schema-guide.md)
- パフォーマンスチューニング: [performance.md](./performance.md)
```

### 例2: デプロイメントスキル

```bash
mkdir -p Template/.claude/skills/deployment/{aws,scripts}
```

`Template/.claude/skills/deployment/SKILL.md`:
```markdown
---
name: デプロイメント
description: AWS/GCP/Azureへのアプリケーションデプロイ
---

# デプロイメントスキル

## このスキルを使用する場面
- 新バージョンのデプロイ
- インフラストラクチャの更新
- 環境変数の管理

## デプロイフロー

```
1. テスト実行 → 2. ビルド → 3. ステージングデプロイ
                                    ↓
                              4. 検証テスト
                                    ↓
                              5. 本番デプロイ
```

## 環境別コマンド

### ステージング
```bash
./scripts/deploy.sh staging
```

### 本番
```bash
# 必ず承認を得てから
./scripts/deploy.sh production
```

## 重要な注意点
- 本番デプロイ前に必ずステージングで検証
- ロールバック手順を確認してからデプロイ
- デプロイ後は監視ダッシュボードを確認

## プラットフォーム別ガイド
- AWS: [aws/README.md](./aws/README.md)
- GCP: [gcp/README.md](./gcp/README.md)
- Azure: [azure/README.md](./azure/README.md)
```

### 例3: テストスキル

`Template/.claude/skills/testing/SKILL.md`:
```markdown
---
name: テスト
description: ユニットテスト、統合テスト、E2Eテストの作成と実行
---

# テストスキル

## このスキルを使用する場面
- 新機能のテスト作成
- 既存テストの修正
- テストカバレッジ向上

## テスト種別

| 種別 | ツール | コマンド |
|------|--------|----------|
| Unit | Jest | `npm test` |
| Integration | Jest | `npm run test:integration` |
| E2E | Playwright | `npm run test:e2e` |

## テスト作成パターン

### ユニットテスト
```typescript
describe('関数名', () => {
  it('should [期待する動作]', () => {
    // Arrange
    const input = ...;

    // Act
    const result = 関数名(input);

    // Assert
    expect(result).toBe(...);
  });
});
```

### 統合テスト
```typescript
describe('API: /api/endpoint', () => {
  it('should return 200 on valid request', async () => {
    const response = await request(app)
      .get('/api/endpoint')
      .expect(200);

    expect(response.body).toMatchObject({...});
  });
});
```

## 重要な注意点
- モックは必要最小限に
- テストデータはファクトリパターンで生成
- 非同期テストは適切にawait

## テンプレート
- ユニットテスト: [templates/unit.test.ts](./templates/unit.test.ts)
- 統合テスト: [templates/integration.test.ts](./templates/integration.test.ts)
```

## スキル作成の手順

### ステップ1: ニーズの特定

```
質問リスト:
□ エージェントが繰り返し失敗するタスクは？
□ どの専門知識が不足しているか？
□ どのような構造化された指示が役立つか？
```

### ステップ2: ディレクトリ作成

```bash
# スキルディレクトリを作成
mkdir -p Template/.claude/skills/[skill-name]

# SKILL.mdを作成
touch Template/.claude/skills/[skill-name]/SKILL.md
```

### ステップ3: SKILL.mdの作成

1. メタデータ（name, description）を定義
2. 使用条件を明記
3. 基本手順を記載
4. 注意点を追加
5. 詳細リファレンスへのリンク

### ステップ4: 補助ファイルの追加

```bash
# 必要に応じて追加
touch Template/.claude/skills/[skill-name]/reference.md
touch Template/.claude/skills/[skill-name]/troubleshooting.md
mkdir Template/.claude/skills/[skill-name]/templates
mkdir Template/.claude/skills/[skill-name]/scripts
```

### ステップ5: テストと改善

```
1. スキルを導入
2. 代表的なタスクで実行
3. パフォーマンスを評価
4. SKILL.mdを改善
5. 繰り返し
```

## スケーリングのベストプラクティス

### SKILL.mdが大きくなった場合

```markdown
# SKILL.md（簡潔に保つ - 100行以内推奨）

## 概要
基本的な指示のみ

## クイックリファレンス
最も頻繁に使用する情報

## 詳細リファレンス
- 設定: [config.md](./config.md)
- 高度な使用法: [advanced.md](./advanced.md)
- FAQ: [faq.md](./faq.md)
```

### 相互に排他的なコンテキスト

```
skills/
└── deployment/
    ├── SKILL.md      # 共通部分
    ├── aws/          # AWS固有（AWSデプロイ時のみロード）
    ├── gcp/          # GCP固有（GCPデプロイ時のみロード）
    └── azure/        # Azure固有（Azureデプロイ時のみロード）
```

## セキュリティ考慮事項

### 信頼できるソースからのみインストール

```
チェックリスト:
□ ソースの信頼性を確認
□ コード依存関係を監査
□ バンドルリソースを確認
□ 外部ネットワーク接続を確認
```

### スキルに含めてはいけない情報

```
❌ APIキー、シークレット
❌ 個人情報
❌ 本番環境の認証情報
❌ 内部IPアドレス
```

## チェックリスト

- [ ] メタデータ（name, description）が適切
- [ ] 使用条件が明確
- [ ] 基本手順が具体的
- [ ] 詳細情報は別ファイルに分離
- [ ] セキュリティ上の問題がない
- [ ] テストで動作確認済み

## 次のステップ

Agent Skillsの設定が完了したら：

1. [CLAUDE.md](./01-claude-md-configuration.md)でスキルへの参照を追加
2. [カスタムコマンド](./05-custom-commands.md)でスキルを呼び出すコマンドを作成
3. 定期的にスキルの有効性を評価し改善
