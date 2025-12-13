# Claude設定最適化

対象プロジェクト: $ARGUMENTS

> 未指定の場合は現在のディレクトリを使用

**重要: この指示書を読んだら、Phase 1から順に実行を開始してください。指示書の表示だけで終わらず、実際にプロジェクトを分析してファイルを生成してください。**

## 概要

このコマンドは、対象プロジェクトを分析し、最適なClaude設定ファイルを自動生成します。

## 実行手順

### Phase 1: プロジェクト分析

以下のファイル/ディレクトリを確認して技術スタックを検出:

**依存関係ファイル:**
- `package.json` → Node.js/TypeScript、フレームワーク（Next.js, React, Vue等）
- `requirements.txt` / `pyproject.toml` → Python、フレームワーク（Django, FastAPI等）
- `Gemfile` → Ruby/Rails
- `go.mod` → Go
- `Cargo.toml` → Rust
- `pom.xml` / `build.gradle` → Java

**プロジェクト構造:**
- ディレクトリ構造（src/, app/, pages/, components/等）
- 設定ファイル（tsconfig.json, .eslintrc, prettier等）
- テストフレームワーク（jest, vitest, pytest, rspec等）
- DB/ORM（Prisma, TypeORM, Drizzle, SQLAlchemy等）

**既存Claude設定:**
- `CLAUDE.md` の有無と内容
- `.claude/settings.json` の有無と内容
- `.mcp.json` の有無と内容
- `.claude/commands/` の有無と内容
- `.claude/skills/` の有無と内容

### Phase 2: 分析結果の報告

以下の形式で報告してください:

```
## プロジェクト分析結果

**プロジェクト名:** [package.json等から取得]
**プロジェクトタイプ:** [Web App / CLI / Library / API / 不明]

**技術スタック:**
- 言語: [検出結果]
- フレームワーク: [検出結果]
- データベース/ORM: [検出結果]
- テストフレームワーク: [検出結果]
- ビルドツール: [検出結果]

**既存Claude設定:**
| ファイル | 状態 | アクション |
|---------|------|----------|
| CLAUDE.md | あり/なし | マージ/新規作成 |
| settings.json | あり/なし | マージ/新規作成 |
| .mcp.json | あり/なし | マージ/新規作成 |
| commands/ | あり(X個)/なし | 追加/新規作成 |
| skills/ | あり(X個)/なし | 追加/新規作成 |

**推奨設定:**
1. [推奨事項1]
2. [推奨事項2]
...
```

### Phase 3: ユーザー確認

分析結果を報告後、以下を確認:
- 設定生成を続行するか
- 特定のファイルのみ生成するか
- カスタマイズが必要な項目があるか

### Phase 4: 設定ファイル生成

確認後、以下の順序で生成:

1. **CLAUDE.md** - プロジェクト指示書
   - テンプレート: `/Users/minoru/Dev/cc/Template/.claude/CLAUDE.md`
   - ガイド: `/Users/minoru/Dev/cc/Template/.claude/docs/`

2. **settings.json** - 権限・サンドボックス設定
   - テンプレート: `/Users/minoru/Dev/cc/Template/.claude/settings.json`
   - ガイド: `/Users/minoru/Dev/cc/Template/.claude/docs/10-security.md`

3. **.mcp.json** - MCPサーバー設定
   - テンプレート: `/Users/minoru/Dev/cc/Template/.mcp.json`
   - ガイド: `/Users/minoru/Dev/cc/Template/.claude/docs/07-mcp-integration.md`

4. **commands/** - カスタムコマンド
   - テンプレート: `/Users/minoru/Dev/cc/Template/.claude/commands/`
   - ガイド: `/Users/minoru/Dev/cc/Template/.claude/docs/`

5. **skills/** - Agent Skills
   - テンプレート: `/Users/minoru/Dev/cc/Template/.claude/skills/`
   - ガイド: `/Users/minoru/Dev/cc/Template/.claude/docs/`

6. **hooks/** - フックスクリプト
   - テンプレート: `/Users/minoru/Dev/cc/Template/.claude/hooks/`
   - ガイド: `/Users/minoru/Dev/cc/Template/.claude/docs/`

7. **agents/** - サブエージェント定義
   - テンプレート: `/Users/minoru/Dev/cc/Template/.claude/agents/`
   - ガイド: `/Users/minoru/Dev/cc/Template/.claude/docs/13-agent-design-patterns.md`

## 技術スタック別設定

### プロジェクトタイプ判定

| 検出条件 | タイプ | 推奨設定 |
|---------|--------|---------|
| package.json + next.config.* | Next.js | App Router/Pages Router判定、SSR考慮 |
| package.json + React (no next) | React SPA | CSR特化設定 |
| pyproject.toml + django | Django | manage.py、migrations考慮 |
| pyproject.toml + fastapi | FastAPI | async対応設定 |
| package.json (main/exports) | NPM Library | publish設定追加 |
| go.mod | Go | go build/test設定 |
| Cargo.toml | Rust | cargo設定 |

### 推奨MCPサーバー

| 条件 | MCPサーバー |
|------|------------|
| 全プロジェクト | filesystem |
| .git存在 | github |
| PostgreSQL (prisma/db設定) | postgres |
| MongoDB | mongodb |
| playwright/puppeteer依存 | puppeteer / playwright |
| 大規模（500+ファイル） | serena |
| React/Next.js/TypeScript | context7-mcp |

### 推奨コマンド

| タイプ | コマンド |
|--------|---------|
| 全プロジェクト | review, debug, status |
| Web App | deploy, test, gen-test |
| Library | publish, docs |
| API | api-test, migrate |
| DB使用 | db-seed, db-reset |

## マージ戦略

既存設定がある場合:

| ファイル | 戦略 |
|---------|------|
| CLAUDE.md | セクション単位でマージ、既存の禁止事項/必須事項は保持 |
| settings.json | allow追加、deny既存優先、sandbox既存尊重 |
| .mcp.json | 既存サーバー保持 + 新規推奨を確認後追加 |
| commands/ | 既存保持 + 推奨で不足分を追加 |
| skills/ | 既存保持 + 技術スタック別に追加 |

## 出力形式

各ファイル生成時:

1. **プレビュー表示** - 生成内容を確認用に表示
2. **差分表示** - 既存ファイルがある場合は差分を表示
3. **確認** - ユーザーの承認を求める
4. **生成** - 承認後にファイルを作成/更新

## 使用例

```bash
# 別プロジェクトを最適化
/optimize-claude-config /Users/minoru/Dev/Case/NewProject

# 現在のプロジェクトを最適化（引数省略）
/optimize-claude-config
```

## 注意事項

- 既存の禁止事項・必須事項は上書きしない
- セキュリティ設定（deny）は既存を優先
- 生成前に必ずプレビューを表示
- 破壊的変更は行わない
