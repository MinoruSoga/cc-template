# [プロジェクト名]

## プロジェクト概要

**名前:** [プロジェクト名]
**説明:** [一行説明]

## 技術スタック

- 言語: [例: TypeScript 5.x]
- フレームワーク: [例: Next.js / Express / Django]
- データベース: [例: PostgreSQL]
- ORM: [例: Prisma / Drizzle / SQLAlchemy]
- テスト: [例: Jest / Vitest / pytest]
- その他: [追加ライブラリ]

## ディレクトリ構造

```
src/
├── [プロジェクトに合わせて記載]
```

## 開発コマンド

| コマンド | 説明 |
|---------|------|
| `make dev` | 開発サーバー起動 |
| `make build` | 本番ビルド |
| `make test` | テスト実行 |
| `make lint` | Linter実行 |

## 命名規則

> プロジェクトに合わせて調整してください

| 対象 | 規則 | 例 |
|------|------|-----|
| コンポーネント | PascalCase | `UserProfile`, `TaskList` |
| 関数・変数 | camelCase | `getUserById`, `isActive` |
| 定数 | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT`, `API_BASE_URL` |
| ファイル | kebab-case | `user-profile.tsx`, `api-client.ts` |
| 型・インターフェース | PascalCase | `UserData`, `ApiResponse` |

## 環境変数

必要な環境変数は `.env.example` を参照してください。

```bash
cp .env.example .env
```

**注意:** `.env` ファイルは `.gitignore` に含まれています。

## 禁止事項 / 必須事項

- any型使用禁止、未使用インポート禁止、ハードコード禁止、コンソールログ放置禁止
- 適切な型定義、エラーハンドリング、入力値バリデーション、既存パターン準拠を徹底
- コードパターンの詳細: @.claude/rules/code-style.md
- API 規約: @.claude/rules/api.md
- テスト規約: @.claude/rules/testing.md
- セキュリティ: @.claude/rules/security.md

## 長時間タスクのワークフロー

1. **開始時:** `claude-progress.txt` と `git log --oneline -10` で状態確認
2. **作業中:** 一度に1機能、小ステップでコミット、進捗ファイル更新
3. **終了前:** 作業状態コミット、`claude-progress.txt` 更新

## 重要なファイル

| ファイル | 説明 |
|---------|------|
| `claude-progress.txt` | 進捗追跡 |
| `.claude/features.json` | 機能一覧 |
| `.claude/settings.json` | Claude Code設定 |

## 参照ドキュメント

- [ドキュメント目次](docs/README.md)
- [設定リファレンス](docs/03-settings-reference.md)
- [フックシステム](docs/04-hooks-system.md)
- [スキル定義](docs/06-agent-skills.md)
- [MCP連携](docs/07-mcp-integration.md)
- [コンテキスト管理](docs/14-context-engineering.md)
- [エージェント設計パターン](docs/13-agent-design-patterns.md)
- [マルチエージェント](docs/15-multi-agent-systems.md)
- [セキュリティ](docs/10-security.md)
