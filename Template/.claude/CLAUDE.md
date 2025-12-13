# [プロジェクト名]

## 🎯 コーディング姿勢

**シニアエンジニアとして以下を徹底：**
- 型安全性最優先
- SOLID原則・クリーンアーキテクチャ
- エラーハンドリング徹底
- セキュリティ意識
- パフォーマンス考慮
- 自己レビュー実施

---

## 📋 プロジェクト概要

**名前:** [プロジェクト名]
**説明:** [一行説明]

---

## 🛠️ 技術スタック

- 言語: TypeScript 5.x
- フレームワーク: Next.js 14
- データベース: PostgreSQL
- ORM: Prisma
- テスト: Jest / Playwright
- その他: [追加ライブラリ]

---

## 📁 ディレクトリ構造

```
src/
├── components/     # UIコンポーネント
├── hooks/          # カスタムフック
├── lib/            # ユーティリティ
├── pages/          # ページ（Next.js）
├── services/       # ビジネスロジック
├── types/          # 型定義
└── utils/          # ヘルパー関数
```

---

## 🚀 開発コマンド

| コマンド | 説明 |
|---------|------|
| `make dev` | 開発サーバー起動 |
| `make build` | 本番ビルド |
| `make test` | テスト実行 |
| `make lint` | Linter実行 |

---

## 📝 命名規則

| 対象 | 規則 | 例 |
|------|------|-----|
| コンポーネント | PascalCase | `UserProfile`, `TaskList` |
| 関数・変数 | camelCase | `getUserById`, `isActive` |
| 定数 | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT`, `API_BASE_URL` |
| ファイル | kebab-case | `user-profile.tsx`, `api-client.ts` |
| 型・インターフェース | PascalCase | `UserData`, `ApiResponse` |
| Enum | PascalCase (値もPascalCase) | `Status.InProgress` |

---

## 🔐 環境変数

必要な環境変数は `.env.example` を参照してください。

```bash
# .env.example からコピーして設定
cp .env.example .env

# 必須の環境変数
DATABASE_URL=          # PostgreSQL接続文字列
GITHUB_TOKEN=          # GitHub Personal Access Token
```

**注意:** `.env` ファイルは `.gitignore` に含まれています。

---

## 📐 重要なパターン

### API呼び出し
```typescript
// 共通のAPIクライアントを使用
const response = await api.get<UserData>('/users/:id', { id });
if (!response.ok) {
  throw new ApiError(response.error);
}
return response.data;
```

### エラーハンドリング
```typescript
// Result型でエラーを明示的に扱う
type Result<T, E = Error> = { ok: true; data: T } | { ok: false; error: E };

const result = await fetchUser(id);
if (!result.ok) {
  logger.error('Failed to fetch user', { error: result.error });
  return null;
}
```

### コンポーネント構造
```typescript
// Props型を明示的に定義
interface UserCardProps {
  user: User;
  onSelect?: (id: string) => void;
}

export const UserCard: FC<UserCardProps> = ({ user, onSelect }) => {
  // 実装
};
```

---

## ⚡ 禁止事項

- ❌ any型使用
- ❌ 未使用インポート
- ❌ ハードコード
- ❌ 重複コード
- ❌ コンソールログ放置

---

## ✅ 必須事項

- ✅ 適切な型定義
- ✅ エラーハンドリング
- ✅ 入力値バリデーション
- ✅ 既存パターンに従う
- ✅ 変更前に影響範囲確認

---

## 🤖 エージェント構成

| エージェント | モデル | 用途 |
|-------------|--------|------|
| `architect` | Opus | アーキテクチャ設計、セキュリティ監査 |
| `implementer` | Sonnet | 機能実装、テスト作成 |
| `reviewer` | Sonnet | コードレビュー、品質チェック |
| `debugger` | Sonnet | バグ調査、エラー分析 |
| `researcher` | Haiku | コード検索、ファイル探索 |
| `formatter` | Haiku | コミット生成、コード整形 |
| `prisma-expert` | Sonnet | DB設計、マイグレーション計画 |

**使用方法:**
- 自動委譲: 適切なタスクで自動的に呼び出される
- 明示的: `Use the [agent] agent to...`

---

## 📚 Skills

| スキル | トリガー | 用途 |
|--------|---------|------|
| generating-commits | 「コミット」 | コミットメッセージ生成 |
| reviewing-code | 「レビュー」 | コードレビュー支援 |
| analyzing-prisma | 「スキーマ」 | Prismaスキーマ分析 |
| database | DB操作時 | データベース管理 |
| deployment | デプロイ時 | デプロイメント |
| testing | テスト時 | テスト作成・実行 |

---

## 🔧 長時間タスクのワークフロー

### セッション開始時

1. `claude-progress.txt` を読む
2. `git log --oneline -10` で最近のコミットを確認
3. `.claude/features.json` で次の機能を特定

### 作業中

1. **一度に1つの機能**のみ実装
2. 小さなステップでコミット
3. 進捗ファイルを頻繁に更新

### セッション終了前

1. 現在の作業状態をコミット
2. `claude-progress.txt` を更新
3. `features.json` のステータスを更新

---

## 📂 重要なファイル

| ファイル | 説明 |
|---------|------|
| `claude-progress.txt` | 進捗追跡 |
| `.claude/features.json` | 機能一覧 |
| `.claude/scripts/init.sh` | 環境初期化 |
| `.claude/settings.json` | Claude Code設定 |

---

## 🔧 利用可能なツール

### MCP サーバー

| ツール | 説明 | 使用例 |
|--------|------|--------|
| `filesystem` | ファイル操作 | プロジェクト内ファイルの読み書き |
| `github` | GitHub連携 | Issue作成、PR操作、コード検索 |
| `puppeteer` | ブラウザ自動化 | スクレイピング、E2Eテスト |
| `postgres` | DB操作 | SQLクエリ実行、テーブル操作 |
| `slack` | Slack連携 | メッセージ送信、チャンネル操作 |

### 推論ツール（Think Tool）

複雑なタスクでは `think` ツールを使用:

```
think("このバグの原因を分析:
1. エラーメッセージ: XXX
2. 発生条件: YYY
3. 仮説1: ZZZ
4. 検証方法: ...")
```

**使用場面:**
- アーキテクチャ決定時
- デバッグの原因分析
- 複数選択肢の評価
- リスク評価

---

## 🎯 ツール使用のベストプラクティス

1. **複雑なタスクではまず `think` で計画** - 推論能力54%向上
2. **GitHub操作は確認してから実行** - 破壊的操作に注意
3. **DBクエリは読み取りから開始** - SELECT → INSERT/UPDATE
4. **ツールの戻り値を確認** - 次のステップを決定

---

## 🛠️ ツール設計5原則

### 1. 明確で説明的な名前
```
❌ query, do_thing, process
✅ search_database_users, create_github_issue
```

### 2. 詳細なドキュメント
- ツールの目的を明確に
- 全パラメータに説明
- 必須/オプションを区別

### 3. 意味のあるエラーメッセージ
```json
{
  "error": true,
  "message": "タイトルが長すぎます（280文字）",
  "suggestion": "256文字以内にしてください"
}
```

### 4. 意味のあるコンテキストを返す
```json
{
  "success": true,
  "issueUrl": "https://github.com/...",
  "nextSteps": ["ラベルを追加する場合は..."]
}
```

### 5. 名前空間でグループ化
```
github_create_issue, github_update_issue
slack_send_message, slack_create_channel
db_query, db_insert
```

---

## 🧠 コンテキスト管理戦略

### 基本原則
「望む結果の可能性を最大化する、最小の高信号トークンセットを見つけ出す」

### ジャストインタイム検索
- 全データ事前ロード ❌
- 必要時に動的ロード ✅
- Explore エージェントを活用して関連コードを検索

### コンパクション戦略
- 長時間稼働時はコンテキストを要約してリセット
- 重要な決定・成果物は保持
- 不要な探索結果は破棄

詳細: [docs/14-context-engineering.md](docs/14-context-engineering.md)

---

## 🏗️ エージェント設計パターン

### 6つの設計パターン

| パターン | 使用場面 | 例 |
|---------|---------|-----|
| プロンプトチェーン | 順序が明確 | 入力検証→処理→出力 |
| ルーティング | 入力分類が必要 | サポートチケット振り分け |
| 並列化 | 独立タスク | 複数ファイル同時処理 |
| オーケストレーター | 複数専門分野 | コード生成+テスト+レビュー |
| 評価者 | 反復改善 | 生成→評価→改善ループ |
| 自律エージェント | 複雑な探索 | バグ調査、リファクタリング |

### 3つの核心原則
1. **シンプルさが第一** - 必要最小限の複雑さ
2. **透明性** - 何が起きているか常に見える
3. **明確なツールドキュメント** - 誤用を防ぐ

詳細: [docs/13-agent-design-patterns.md](docs/13-agent-design-patterns.md)

---

## ⚡ Advanced Tool Use（APIベータ）

### 3つの機能

| 機能 | 効果 | 使用場面 |
|------|------|---------|
| Tool Search Tool | トークン85%削減 | 10K+トークンのツール定義 |
| Programmatic Tool Calling | トークン37%削減 | 複数ツールのループ |
| Tool Use Examples | 精度72%→90% | 複雑なパラメータ |

### 設定例
```json
{
  "name": "search_orders",
  "defer_loading": true,
  "allowed_callers": ["code_execution_20250825"]
}
```

### ベータヘッダー
```python
headers = {"betas": ["advanced-tool-use-2025-11-20"]}
```

詳細: [docs/12-advanced-tool-use.md](docs/12-advanced-tool-use.md)

---

## 🔗 マルチエージェント8原則

1. **エージェントのように思考** - 失敗モードを事前特定
2. **委任を教える** - タスク境界・出力形式・完了条件を明確に
3. **複雑さに応じてスケール** - シンプル1-2、中程度3-5、複雑5+エージェント
4. **ツール設計を重視** - 誤選択防止のヒューリスティクス
5. **エージェント自己改善** - 失敗診断→改善提案
6. **広く始めて絞り込む** - 広範探索→関連領域→深掘り→統合
7. **思考をガイド** - 拡張思考（計画）、インターリーブ（評価）
8. **積極的に並列化** - asyncio.gatherで90%時間削減

詳細: [docs/15-multi-agent-systems.md](docs/15-multi-agent-systems.md)

---

## 📊 品質監視ベストプラクティス

### 検出困難な問題への対策
- 複数視点からの品質測定
- 段階的ロールアウト
- ユーザーフィードバック収集（`/bug` コマンド）
- リアルタイム異常検出

### 評価の多様化
- 単一メトリクスに依存しない
- 複数の評価軸を用意
- 予期しない副作用を監視

詳細: [docs/16-quality-monitoring.md](docs/16-quality-monitoring.md)

---

## ⏱️ 長時間エージェント詳細

### 2エージェント設計
1. **イニシャライザー**: 環境セットアップ、進捗ドキュメント作成
2. **コーディング**: 1機能ずつ処理、Gitコミット、進捗更新

### セッション開始プロトコル
```bash
git log --oneline -n 10     # Git履歴確認
cat claude-progress.txt      # 進捗確認
npm run test:basic           # 基本テスト
```

### features.json 形式
```json
{
  "features": [
    {"id": "feat-001", "name": "User Login", "status": "passing", "commit": "abc123"},
    {"id": "feat-002", "name": "REST API", "status": "in_progress", "progress": "50%"}
  ]
}
```

詳細: [docs/17-long-running-agents.md](docs/17-long-running-agents.md)

---

## 📚 参照

- [ドキュメント目次](docs/README.md)
- [設定ガイド](README.md)
- [MCP連携](docs/07-mcp-integration.md)
- [セキュリティ](docs/10-security.md)
