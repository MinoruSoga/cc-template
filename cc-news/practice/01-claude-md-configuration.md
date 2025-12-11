# CLAUDE.md 設定ガイド

> 基づく記事: Contextual Retrieval、Building Effective Agents、Claude Code Best Practices

## 概要

CLAUDE.mdは、Claude Codeがプロジェクトを理解するための最も重要なファイルです。適切に設定することで、コンテキストの品質が大幅に向上し、より正確で効率的なコード生成が可能になります。

## ファイルの配置

```
# プロジェクトレベル（推奨）
Template/.claude/CLAUDE.md

# ユーザーレベル（グローバル設定）
~/.claude/CLAUDE.md
```

## 基本構造テンプレート

```markdown
# プロジェクト名

## プロジェクト概要
[1-2文でプロジェクトの目的を説明]

## 技術スタック
- 言語: [例: TypeScript 5.x]
- フレームワーク: [例: Next.js 14]
- データベース: [例: PostgreSQL]
- その他: [重要なライブラリ]

## ディレクトリ構造
```
src/
├── components/  # UIコンポーネント
├── hooks/       # カスタムフック
├── lib/         # ユーティリティ
├── pages/       # ページコンポーネント
└── types/       # 型定義
```

## コーディング規約

### 命名規則
- コンポーネント: PascalCase
- 関数/変数: camelCase
- 定数: UPPER_SNAKE_CASE
- ファイル: kebab-case

### スタイルガイド
- [具体的なルール]

## 重要なパターン

### [パターン名]
```typescript
// 例: API呼び出しパターン
const data = await api.get('/endpoint');
```

## 禁止事項
- ❌ [やってはいけないこと1]
- ❌ [やってはいけないこと2]

## よく使うコマンド
- `npm run dev` - 開発サーバー起動
- `npm run build` - プロダクションビルド
- `npm test` - テスト実行
- `npm run lint` - リント実行

## 環境変数
必要な環境変数は`.env.example`を参照

## 追加リソース
- 設計ドキュメント: `docs/design.md`
- API仕様: `docs/api.md`
```

## コンテキストエンジニアリングの原則

### 1. 最小の高信号トークンセット

> 「最小の高信号トークンセットを見つける」ことが重要

```markdown
# 悪い例（冗長）
このプロジェクトは、ユーザーがタスクを管理できるようにするための
タスク管理アプリケーションです。ユーザーはタスクを作成、編集、削除
することができ、各タスクには優先度を設定できます...（長文続く）

# 良い例（簡潔で高信号）
## 概要
タスク管理SPA。CRUD操作 + 優先度設定。

## 主要エンティティ
- Task: { id, title, priority, status, createdAt }
- User: { id, email, tasks[] }
```

### 2. ジャストインタイム情報

必要な時に必要な情報だけを提供：

```markdown
## 詳細リファレンス
- 認証フロー: `docs/auth-flow.md` を参照
- DB スキーマ: `prisma/schema.prisma` を参照
- API エンドポイント: `src/pages/api/` を参照
```

### 3. 構造化された情報

```markdown
## エラーハンドリング

| エラータイプ | 対処法 | 例 |
|-------------|--------|-----|
| ValidationError | 入力検証 | `throw new ValidationError(message)` |
| AuthError | 認証リダイレクト | `redirect('/login')` |
| APIError | リトライ + ログ | `logger.error(err)` |
```

## 実践的な設定手順

### ステップ1: 基本情報の収集

```bash
# プロジェクトの技術スタックを確認
cat package.json | grep -A 20 '"dependencies"'

# ディレクトリ構造を確認
find src -type d -maxdepth 2

# 既存の設定ファイルを確認
ls -la *.config.* .* 2>/dev/null | grep -v node_modules
```

### ステップ2: CLAUDE.mdの作成

```bash
mkdir -p Template/.claude
touch Template/.claude/CLAUDE.md
```

### ステップ3: 段階的に情報を追加

```markdown
# 最初は最小限から開始

## プロジェクト概要
[プロジェクト名] - [目的]

## 技術スタック
- [主要技術のみ]

## よく使うコマンド
- [最頻出コマンド]
```

### ステップ4: 使いながら改善

```markdown
# Claudeが間違えたパターンを追加

## 重要な注意点
- このプロジェクトではXXXを使用すること（YYYは使わない）
- APIレスポンスは必ず`ApiResponse<T>`型でラップ
```

## アンチパターン

### ❌ 情報過多

```markdown
# 悪い例：すべてを詰め込む
[ファイル全体のコピペ]
[すべてのAPIドキュメント]
[すべての型定義]
```

### ❌ 曖昧な指示

```markdown
# 悪い例
- きれいなコードを書く
- ベストプラクティスに従う

# 良い例
- 関数は20行以内
- 早期リターンを使用
- エラーは上位でキャッチ
```

### ❌ 古い情報

```markdown
# 悪い例：更新されていない
## 技術スタック
- React 16  # 実際はReact 18
```

## チェックリスト

CLAUDE.md作成時の確認項目：

- [ ] プロジェクトの目的が1-2文で説明されている
- [ ] 技術スタックが正確に記載されている
- [ ] ディレクトリ構造が現状を反映している
- [ ] コーディング規約が具体的
- [ ] よく使うコマンドが記載されている
- [ ] 禁止事項/注意事項が明記されている
- [ ] 詳細情報への参照リンクがある
- [ ] 定期的に更新する仕組みがある

## 効果測定

CLAUDE.mdの効果を測定する方法：

1. **エラー率の追跡**
   - Claudeが間違えた回数を記録
   - 同じミスが繰り返されるか確認

2. **コンテキスト使用量**
   - 余分な説明が減ったか
   - 一度の指示で期待通りの結果が出るか

3. **継続的改善**
   - 週1回CLAUDE.mdをレビュー
   - 新しいパターン/注意点を追加

## 次のステップ

CLAUDE.mdの基本設定が完了したら：

1. [カスタムコマンド](./05-custom-commands.md)で繰り返しタスクを効率化
2. [Agent Skills](./02-agent-skills-setup.md)で専門知識を追加
3. [Hooks](./06-hooks-configuration.md)で自動化を追加
