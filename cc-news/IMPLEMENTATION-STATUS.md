# ドキュメント実装状況

cc-news/ のドキュメントで言及されている機能と、Template/ への実装状況を追跡するファイル。

## 対応状況表

| 機能 | ドキュメント | Template/ | 状態 | 備考 |
|------|-------------|-----------|------|------|
| CLAUDE.md | practice/01, Sample/docs/02 | `.claude/CLAUDE.md` | ✅ 完了 | |
| settings.json | practice/README | `.claude/settings.json` | ✅ 完了 | |
| settings.local.json | practice/README | `.claude/settings.local.json` | ✅ 完了 | |
| commands/ | practice/05 | `.claude/commands/` | ✅ 完了 | |
| hooks/ | practice/06 | `.claude/hooks/` | ✅ 完了 | |
| skills/ | practice/02 | `.claude/skills/` | ✅ 完了 | |
| agents/ | 02-building-effective-agents | `.claude/agents/` | ✅ 完了 | |
| scripts/ | practice/07 | `.claude/scripts/` | ✅ 完了 | |
| features.json | practice/07 | `.claude/features.json` | ✅ 完了 | |
| docs/ | - | `.claude/docs/` | ✅ 完了 | Template独自追加 |
| output-styles/ | - | `.claude/output-styles/` | ✅ 完了 | Template独自追加 |
| plans/ | - | `.claude/plans/` | ✅ 完了 | Template独自追加 |
| README.md | - | `.claude/README.md` | ✅ 完了 | Template独自追加 |
| .gitignore.sample | - | `.claude/.gitignore.sample` | ✅ 完了 | Template独自追加 |
| .env.example | practice/03, 04 | `.env.example` | ✅ 完了 | |
| .mcp.json | practice/03 | `.mcp.json` | ✅ 完了 | 既存 |
| rules/ | Sample/docs/02 | `.claude/rules/` | ✅ 完了 | 4つのサンプルルール追加 |

## 追加されたファイル一覧

### .claude/rules/

モジュール型ルール管理。YAML frontmatter で特定パスに適用可能。

| ファイル | 対象パス | 内容 |
|---------|---------|------|
| `code-style.md` | `**/*.{ts,tsx,js,jsx}` | コード規約、命名規則 |
| `testing.md` | `**/*.{test,spec}.*` | テスト規約 |
| `api.md` | `src/api/**/*.ts` | API開発規約 |
| `security.md` | (全体) | セキュリティ要件 |

## 更新履歴

| 日付 | 内容 |
|------|------|
| 2025-12-14 | 初版作成。対応状況を整理 |
| 2025-12-14 | `rules/` を追加。全項目完了 |
| 2025-12-14 | ドキュメント参照を修正、README.md と .env.example を追加 |
| 2025-12-14 | .gitignore.sample を追加 |
