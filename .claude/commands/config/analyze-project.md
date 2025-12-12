# プロジェクト分析

対象: $ARGUMENTS

> 未指定の場合は現在のディレクトリを使用

## 実行内容

対象ディレクトリを分析し、Claude設定に必要な情報を収集します。

## 分析項目

### 1. 技術スタック検出

以下のファイルを確認:

**Node.js/JavaScript:**
- `package.json` - 依存関係、スクリプト、タイプ（module/commonjs）
- `package-lock.json` / `pnpm-lock.yaml` / `yarn.lock` - パッケージマネージャー
- `tsconfig.json` - TypeScript設定
- `next.config.*` - Next.js
- `vite.config.*` - Vite
- `webpack.config.*` - Webpack

**Python:**
- `requirements.txt` - pip依存関係
- `pyproject.toml` - Poetry/PDM設定
- `setup.py` / `setup.cfg` - setuptools
- `Pipfile` - Pipenv

**Ruby:**
- `Gemfile` - Bundler依存関係
- `Rakefile` - タスク定義

**Go:**
- `go.mod` - モジュール定義
- `go.sum` - 依存関係チェックサム

**Rust:**
- `Cargo.toml` - パッケージ定義
- `Cargo.lock` - 依存関係ロック

**Java/Kotlin:**
- `pom.xml` - Maven
- `build.gradle` / `build.gradle.kts` - Gradle

### 2. フレームワーク判定

**Web フレームワーク:**
- Next.js: `next` 依存 + `next.config.*`
- React: `react` 依存（Next.jsなし）
- Vue: `vue` 依存
- Angular: `@angular/core` 依存
- Svelte: `svelte` 依存
- Django: `django` 依存
- FastAPI: `fastapi` 依存
- Flask: `flask` 依存
- Rails: `rails` gem
- Express: `express` 依存

**UIライブラリ:**
- shadcn/ui: `components/ui/` 存在
- Material UI: `@mui/*` 依存
- Tailwind: `tailwind.config.*` 存在
- Chakra: `@chakra-ui/*` 依存

### 3. データベース/ORM検出

- Prisma: `prisma/schema.prisma` 存在
- TypeORM: `typeorm` 依存
- Drizzle: `drizzle-orm` 依存
- SQLAlchemy: `sqlalchemy` 依存
- Django ORM: Django使用時
- ActiveRecord: Rails使用時
- GORM: Go + `gorm.io/gorm` 依存

### 4. テストフレームワーク検出

- Jest: `jest` 依存 or `jest.config.*`
- Vitest: `vitest` 依存 or `vitest.config.*`
- Playwright: `@playwright/test` 依存
- Cypress: `cypress` 依存
- pytest: `pytest` 依存
- RSpec: `rspec` gem
- Go test: `*_test.go` 存在

### 5. プロジェクト構造分析

**ディレクトリパターン:**
- `src/` - ソースコード
- `app/` - Next.js App Router / Rails
- `pages/` - Next.js Pages Router
- `components/` - UIコンポーネント
- `lib/` / `utils/` - ユーティリティ
- `hooks/` - Reactフック
- `services/` - ビジネスロジック
- `types/` - 型定義
- `tests/` / `__tests__/` - テスト
- `docs/` - ドキュメント

### 6. 既存Claude設定確認

- `CLAUDE.md` - プロジェクト指示
- `.claude/` ディレクトリ
  - `settings.json` - 設定
  - `settings.local.json` - ローカル設定
  - `commands/` - カスタムコマンド
  - `skills/` - Agent Skills
  - `agents/` - サブエージェント
  - `hooks/` - フック
- `.mcp.json` - MCPサーバー設定

## 出力形式

```json
{
  "projectName": "プロジェクト名",
  "projectType": "Web App | CLI | Library | API | Unknown",
  "techStack": {
    "language": "TypeScript | JavaScript | Python | Ruby | Go | Rust | Java",
    "runtime": "Node.js | Bun | Deno | Python | Ruby | Go | Rust",
    "framework": "Next.js | React | Vue | Django | FastAPI | Rails | Express | null",
    "ui": "shadcn/ui | Material UI | Tailwind | Chakra | null",
    "database": "PostgreSQL | MySQL | MongoDB | SQLite | null",
    "orm": "Prisma | TypeORM | Drizzle | SQLAlchemy | ActiveRecord | null",
    "test": "Jest | Vitest | Playwright | pytest | RSpec | null",
    "packageManager": "npm | pnpm | yarn | pip | poetry | bundler | go mod | cargo"
  },
  "structure": {
    "sourceDir": "src | app | lib | .",
    "hasTests": true | false,
    "hasDocs": true | false,
    "patterns": ["App Router", "Server Components", "API Routes", ...]
  },
  "existingConfig": {
    "claudeMd": { "exists": true | false, "path": "..." },
    "settings": { "exists": true | false, "path": "..." },
    "mcp": { "exists": true | false, "path": "..." },
    "commands": { "exists": true | false, "count": 0, "path": "..." },
    "skills": { "exists": true | false, "count": 0, "path": "..." }
  },
  "recommendations": {
    "mcp": ["filesystem", "github", ...],
    "commands": ["review", "test", ...],
    "skills": ["generating-commits", ...]
  }
}
```

## 使用例

```bash
# 特定プロジェクトを分析
/config/analyze-project /Users/minoru/Dev/Case/JewelryStock

# 現在のディレクトリを分析
/config/analyze-project
```
