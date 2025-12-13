# Claude設定最適化コマンド

任意のプロジェクトに対して最適なClaude設定を自動生成するスラッシュコマンド集です。

## 目次

- [使い方](#使い方)
- [コマンド一覧](#コマンド一覧)
- [生成されるファイル](#生成されるファイル)
- [処理フロー](#処理フロー)
- [対応技術スタック](#対応技術スタック)
- [参照ドキュメント](#参照ドキュメント)
- [注意事項](#注意事項)
- [別プロジェクトへの適用方法](#別プロジェクトへの適用方法)
- [例](#例)

## 使い方

### 1. ccディレクトリでClaude Codeを起動

```bash
cd /Users/minoru/Dev/cc
claude
```

### 2. コマンドを実行

```bash
# 別プロジェクトを最適化（推奨）
/optimize-claude-config /Users/minoru/Dev/Case/NewProject

# 現在のディレクトリを最適化（引数省略）
/optimize-claude-config
```

## コマンド一覧

| コマンド | 説明 |
|---------|------|
| `/optimize-claude-config [path]` | フル最適化（分析→全設定生成） |
| `/config/analyze-project [path]` | プロジェクト分析のみ |
| `/config/generate-claude-md` | CLAUDE.md生成 |
| `/config/generate-settings` | settings.json生成 |
| `/config/generate-mcp` | .mcp.json生成 |
| `/config/generate-commands` | カスタムコマンド生成 |
| `/config/generate-skills` | Agent Skills生成 |

## 生成されるファイル

```
対象プロジェクト/
├── CLAUDE.md                # プロジェクト指示書
├── .mcp.json                # MCPサーバー設定
└── .claude/
    ├── settings.json        # 権限・サンドボックス設定
    ├── commands/            # カスタムコマンド
    │   ├── review.md
    │   ├── debug.md
    │   ├── test.md
    │   └── ...
    └── skills/              # Agent Skills
        ├── generating-commits/
        ├── reviewing-code/
        └── ...
```

## 処理フロー

### `/optimize-claude-config` の実行フロー

1. **分析フェーズ**
   - 技術スタック検出（package.json, requirements.txt等）
   - プロジェクト構造分析
   - 既存Claude設定の確認

2. **報告フェーズ**
   - 分析結果の表示
   - 推奨設定の提案
   - マージ戦略の提示（既存設定がある場合）

3. **確認フェーズ**
   - ユーザーへの確認
   - カスタマイズの受付

4. **生成フェーズ**
   - 各ファイルのプレビュー表示
   - 確認後にファイル作成/更新

## 対応技術スタック

### 言語・ランタイム
- Node.js / TypeScript / JavaScript
- Python
- Go
- Rust
- Ruby
- Java / Kotlin

### フレームワーク
- Next.js (App Router / Pages Router)
- React
- Vue
- Django / FastAPI / Flask
- Rails
- Express

### データベース/ORM
- PostgreSQL + Prisma/TypeORM/Drizzle
- MySQL
- MongoDB
- SQLite
- SQLAlchemy / Django ORM

## 参照ドキュメント

生成時は以下のテンプレート・ベストプラクティスを参照:

- `/Users/minoru/Dev/cc/Template/` - **完全版テンプレート**
- `/Users/minoru/Dev/cc/Template/.claude/docs/` - ベストプラクティス
- `/Users/minoru/Dev/cc/cc-news/` - 参考: 最新トピック
- `/Users/minoru/Dev/cc/cc-blog/` - 参考: 設計思想

## 注意事項

- 既存の禁止事項・必須事項は上書きしません
- セキュリティ設定（deny）は既存を優先します
- 生成前に必ずプレビューを表示します
- 破壊的変更は行いません

## 別プロジェクトへの適用方法

### 方法1: パス引数で指定（推奨）

ccディレクトリからパスを引数として渡す方法です。

```bash
cd /Users/minoru/Dev/cc
claude

# Claude Code内で
/optimize-claude-config /path/to/target-project
```

### 方法2: コマンドをコピー

対象プロジェクトにコマンドをコピーして、そこで実行する方法です。

```bash
# コマンドをコピー
cp -r /Users/minoru/Dev/cc/.claude/commands /path/to/target-project/.claude/

# 対象プロジェクトでClaude Codeを起動
cd /path/to/target-project
claude

# Claude Code内で
/optimize-claude-config
```

この方法は、対象プロジェクトでも継続的にコマンドを使いたい場合に便利です。

## 例

### 新規プロジェクトの設定

```bash
# Claude Code内で
/optimize-claude-config /Users/minoru/Dev/Case/NewProject

# 分析結果が表示される
# → 確認後、設定ファイルが生成される
```

### 既存プロジェクトの更新

```bash
# 既存設定がある場合
/optimize-claude-config /Users/minoru/Dev/Case/JewelryStock

# → 既存設定とのマージが提案される
# → 追加すべき設定のみ提案される
```

### 個別コマンドの使用

```bash
# 分析だけしたい場合
/config/analyze-project /path/to/project

# CLAUDE.mdだけ更新したい場合
/config/generate-claude-md

# MCPサーバー設定だけ追加したい場合
/config/generate-mcp
```
