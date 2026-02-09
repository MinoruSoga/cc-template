# Database Reference

## スキーマ設計ガイド

### モデル定義例

> 以下は一般的な ORM でのモデル定義例です。プロジェクトの ORM に合わせて読み替えてください。

```sql
-- SQL ベースの例
CREATE TABLE users (
  id         TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT UNIQUE NOT NULL,
  name       TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE posts (
  id         TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  title      TEXT NOT NULL,
  content    TEXT,
  published  BOOLEAN DEFAULT false,
  author_id  TEXT REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_posts_author ON posts(author_id);
```

### リレーション種別

| 種別 | 説明 | 例 |
|------|------|-----|
| 1:1 | 外部キー + UNIQUE | User - Profile |
| 1:N | 外部キー | User - Posts |
| M:N | 中間テーブル | Post - Tags |

### データ型マッピング（PostgreSQL）

| PostgreSQL | 用途 | 一般的な言語型 |
|------------|------|---------------|
| TEXT | 文字列 | string |
| INTEGER | 整数 | number / int |
| BIGINT | 大きい整数 | bigint / long |
| DOUBLE PRECISION | 浮動小数点 | number / float |
| BOOLEAN | 真偽値 | boolean |
| TIMESTAMPTZ | 日時 | Date / datetime |
| JSONB | JSON データ | object / dict |

## インデックス設計

### 推奨パターン

```sql
-- 単一カラム
CREATE INDEX idx_users_email ON users(email);

-- 複合インデックス（検索順序重要）
CREATE INDEX idx_posts_status_date ON posts(status, created_at);

-- ユニーク制約
CREATE UNIQUE INDEX idx_users_email_tenant ON users(email, tenant_id);
```

### パフォーマンス指針

- WHERE句で頻繁に使用するカラムにインデックス
- 外部キーには自動でインデックス作成（ORM による）
- 複合インデックスは左から順に使用される

## マイグレーション

### コマンド例

```bash
# プロジェクトの ORM に合わせたコマンドを使用
make db-migrate       # マイグレーション作成
make db-deploy        # マイグレーション適用（本番）
make db-reset         # リセット（開発のみ）
make db-status        # 状態確認
```

### 命名規則

```
YYYYMMDD_description
例: 20260115_add_user_role
```

## クエリ最適化

### N+1問題の回避

```
# NG: N+1クエリ
users = get_all_users()
for user in users:
    posts = get_posts_by_user(user.id)  # N回のクエリ

# OK: JOIN / include / eager loading で解決
users = get_all_users_with_posts()  # 1-2回のクエリ
```

### 選択的フィールド取得

必要なフィールドのみ SELECT することでパフォーマンスを改善。

## 参照リンク

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- プロジェクトの ORM ドキュメントを参照してください
