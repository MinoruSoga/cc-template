# CLAUDE.md 生成

対象プロジェクト: $ARGUMENTS

## 参照ドキュメント

生成時は以下を必ず参照:

- **テンプレート:** `/Users/minoru/Dev/cc/cc-news/Template/.claude/CLAUDE.md`
- **ガイド:** `/Users/minoru/Dev/cc/cc-news/practice/01-claude-md-configuration.md`

## 生成手順

### 1. プロジェクト情報の収集

以下の情報を収集:

- プロジェクト名（package.json等から）
- 技術スタック
- ディレクトリ構造
- 既存のコーディング規約（.eslintrc, prettier等から推測）
- 開発コマンド（package.json scripts, Makefile等）

### 2. 既存CLAUDE.mdの確認

既存ファイルがある場合:

1. 現在の内容を読み込む
2. 保持すべきセクションを特定:
   - 禁止事項
   - 必須事項
   - カスタムルール
3. マージ戦略を提案

### 3. CLAUDE.md生成

以下の構造で生成:

```markdown
# [プロジェクト名]

## コーディング姿勢
[シニアエンジニアとしての基本姿勢]

## プロジェクト概要
- **名前:** [プロジェクト名]
- **説明:** [一行説明]

## 技術スタック
[検出した技術スタックをリスト]

## ディレクトリ構造
[実際の構造を反映]

## 開発コマンド
[package.json scripts / Makefile から]

## 禁止事項
[技術スタックに応じた禁止事項]

## 必須事項
[技術スタックに応じた必須事項]

## エージェント構成（オプション）
[プロジェクト規模に応じて]

## Skills（オプション）
[利用可能なスキル一覧]
```

## 技術スタック別テンプレート

### Next.js (App Router)

```markdown
## 技術スタック
- フレームワーク: Next.js 14 (App Router)
- 言語: TypeScript
- スタイリング: Tailwind CSS
- 状態管理: [検出結果]
- DB/ORM: [検出結果]

## 禁止事項
- any型の使用
- useEffect内での直接的なデータフェッチ（Server Componentsを使用）
- pages/ディレクトリとapp/ディレクトリの混在
- クライアントコンポーネントでの不要な'use client'
- 未使用インポート

## 必須事項
- Server Componentsをデフォルトで使用
- データフェッチはServer Componentsで実行
- 'use client'は必要な場合のみ
- loading.tsx, error.tsx, not-found.tsxの適切な配置
- メタデータの適切な設定
```

### React SPA

```markdown
## 技術スタック
- フレームワーク: React 18
- 言語: TypeScript
- ビルドツール: [Vite/CRA/その他]
- 状態管理: [検出結果]

## 禁止事項
- any型の使用
- インラインスタイル（Tailwind/CSS Modules使用時）
- プロップドリリング（Context/状態管理ライブラリを使用）
- 未使用インポート

## 必須事項
- コンポーネントは関数コンポーネントで作成
- カスタムフックで再利用可能なロジックを抽出
- React.memoは計測後に必要な場合のみ
- エラーバウンダリの設置
```

### Python (Django/FastAPI)

```markdown
## 技術スタック
- フレームワーク: [Django/FastAPI]
- 言語: Python 3.x
- ORM: [Django ORM/SQLAlchemy]
- テスト: pytest

## 禁止事項
- 型ヒントなしの関数定義
- ハードコードされた設定値
- print文でのデバッグ（loggingを使用）
- N+1クエリ

## 必須事項
- 型ヒントの使用
- docstringの記載
- 設定は環境変数から
- テストの作成
```

## マージ戦略

既存CLAUDE.mdがある場合:

1. **保持するセクション:**
   - 禁止事項（既存のルールを優先）
   - 必須事項（既存のルールを優先）
   - カスタムセクション

2. **更新するセクション:**
   - 技術スタック（最新状態に）
   - ディレクトリ構造（最新状態に）
   - 開発コマンド（最新状態に）

3. **追加するセクション:**
   - 不足している推奨セクション

## 出力

1. 生成内容のプレビューを表示
2. 既存ファイルがある場合は差分を表示
3. ユーザー確認後にファイルを作成/更新

## 配置場所

- 推奨: `[プロジェクトルート]/CLAUDE.md`
- 代替: `[プロジェクトルート]/.claude/CLAUDE.md`
