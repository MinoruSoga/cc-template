---
name: Database Management
description: データベース操作、マイグレーション、最適化
---

# データベース管理スキル

## このスキルを使用するタイミング

- データベースマイグレーションの作成と実行
- クエリパフォーマンスの最適化
- バックアップとリストア操作

## 基本コマンド

### マイグレーション

```bash
# マイグレーション作成（プロジェクトの ORM に応じたコマンドを使用）
make db-migrate

# マイグレーション適用
make db-deploy
```

### データベース操作

```bash
# DB管理ツール起動
make db-studio

# シード実行
make db-seed
```

## 命名規則

- マイグレーション: YYYYMMDD_description
- テーブル: snake_case、複数形
- カラム: snake_case

## 重要な注意事項

- 本番環境ではマイグレーション適用コマンドを使用
- 破壊的変更は段階的に実施
- インデックスは `CREATE INDEX CONCURRENTLY` を使用（PostgreSQL）

## 詳細リファレンス

- スキーマガイド: [schema-guide.md](./schema-guide.md)
- パフォーマンス: [performance.md](./performance.md)
