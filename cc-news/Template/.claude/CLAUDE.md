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

## 📚 参照

- [設定ガイド](.claude/README.md)
- [MCP設定](.claude/docs/MCP_SETUP.md)
- [ベストプラクティス](.claude/docs/claude_bestpractice.md)
