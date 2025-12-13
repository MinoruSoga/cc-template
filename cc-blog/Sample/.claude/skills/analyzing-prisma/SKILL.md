---
name: analyzing-prisma
description: Prismaスキーマの分析・マイグレーション支援。スキーマ、マイグレーション、DBモデル時に使用。
allowed-tools: Read, Grep, Glob
---

# Analyzing Prisma

Prismaスキーマの分析とマイグレーション計画の作成。

## Workflow

- [ ] `prisma/schema.prisma` を読み取り
- [ ] 既存モデルとリレーションを把握
- [ ] 変更の影響範囲を特定
- [ ] マイグレーション計画を提案

## Key Files

- `prisma/schema.prisma` - スキーマ定義
- `prisma/migrations/` - マイグレーション履歴

## Checklist

### スキーマ設計
- [ ] 適切なフィールド型を使用しているか
- [ ] リレーションは正しく定義されているか
- [ ] インデックスは必要な箇所に設定されているか
- [ ] `@unique`, `@default` は適切か

### マイグレーション
- [ ] 破壊的変更はないか（カラム削除、型変更）
- [ ] データ移行が必要か
- [ ] ロールバック計画はあるか

## Commands Reference

| Command | 用途 |
|---------|------|
| `make prisma-generate` | Prisma Client生成 |
| `make prisma-format` | スキーマフォーマット |
| `make prisma-validate` | スキーマ検証 |
| `make db-migrate` | マイグレーション実行 |
| `make db-studio` | Prisma Studio起動 |

## Output Format

```markdown
## 現在のスキーマ構造
- モデル一覧とリレーション図

## 変更提案
- 追加/修正するフィールド
- リレーションの変更

## マイグレーション計画
- 実行手順
- 注意点
```
