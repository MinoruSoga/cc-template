# 長時間タスク向け設定ガイド

> 基づく記事: Effective Harnesses for Long-Running Agents

## 概要

長時間実行されるタスクでは、複数のコンテキストウィンドウにわたって進捗を維持することが課題となります。このガイドでは、2エージェントアーキテクチャと進捗追跡システムを設定して、大規模タスクを効率的に完了する方法を説明します。

## 核心的な問題

```
セッション1          セッション2          セッション3
┌─────────┐         ┌─────────┐         ┌─────────┐
│ 作業開始 │   →    │ 記憶なし │   →    │ 記憶なし │
│ 進捗: 30%│         │ 進捗: ?% │         │ 進捗: ?% │
└─────────┘         └─────────┘         └─────────┘
     ↓                   ↓                   ↓
  コンテキスト         どこまで           同じ作業を
  が枯渇              やったか            繰り返す
                      不明
```

## 解決策：2エージェントアーキテクチャ

### アーキテクチャ概要

```
┌─────────────────────────────────────────────────────┐
│              イニシャライザーエージェント              │
│         （最初のセッションのみ実行）                  │
│                                                     │
│  1. 環境セットアップ（init.sh）                      │
│  2. 進捗ドキュメント作成（claude-progress.txt）      │
│  3. 機能リスト生成（features.json）                  │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│              コーディングエージェント                  │
│         （後続のセッションで実行）                    │
│                                                     │
│  1. 進捗ファイルを読み込み                           │
│  2. 次の機能を1つ実装                               │
│  3. Gitコミット                                     │
│  4. 進捗ファイルを更新                              │
└─────────────────────────────────────────────────────┘
```

## 設定ファイル

### 1. init.sh（環境セットアップ）

`Template/.claude/scripts/init.sh`:
```bash
#!/bin/bash
set -e

echo "=== 環境セットアップ開始 ==="

# 依存関係のインストール
echo "→ 依存関係をインストール中..."
npm install

# 環境変数の確認
echo "→ 環境変数を確認中..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "  .envファイルを作成しました。設定を確認してください。"
fi

# ビルド確認
echo "→ ビルドを確認中..."
npm run build

# テスト確認
echo "→ 基本テストを実行中..."
npm run test:basic

# 進捗ファイルの初期化
echo "→ 進捗ファイルを初期化中..."
if [ ! -f claude-progress.txt ]; then
    cat > claude-progress.txt << 'EOF'
# プロジェクト進捗

## 完了した機能
（なし）

## 現在の作業
初期セットアップ完了

## 次のステップ
features.jsonの最初の機能から開始

## 注意事項
- 各機能完了後にこのファイルを更新すること
- Gitコミットメッセージに機能IDを含めること
EOF
fi

echo "=== セットアップ完了 ==="
```

### 2. features.json（機能リスト）

`Template/.claude/features.json`:
```json
{
  "project": "プロジェクト名",
  "version": "1.0.0",
  "lastUpdated": "2025-01-01",
  "features": [
    {
      "id": "AUTH-001",
      "name": "ユーザー認証",
      "description": "メールとパスワードによるログイン機能",
      "status": "failing",
      "priority": "high",
      "dependencies": [],
      "commit": null,
      "completedAt": null
    },
    {
      "id": "AUTH-002",
      "name": "セッション管理",
      "description": "JWTによるセッション管理",
      "status": "failing",
      "priority": "high",
      "dependencies": ["AUTH-001"],
      "commit": null,
      "completedAt": null
    },
    {
      "id": "API-001",
      "name": "ユーザーAPI",
      "description": "ユーザーCRUD操作のAPIエンドポイント",
      "status": "failing",
      "priority": "medium",
      "dependencies": ["AUTH-001"],
      "commit": null,
      "completedAt": null
    }
  ]
}
```

### 3. claude-progress.txt（進捗追跡）

`claude-progress.txt`:
```markdown
# プロジェクト進捗

## 完了した機能
- [AUTH-001] ユーザー認証（コミット: abc1234, 2025-01-15）
  - メール/パスワードログイン実装
  - バリデーション追加
  - エラーハンドリング実装

## 現在の作業
- [AUTH-002] セッション管理
  - JWT生成は完了
  - リフレッシュトークンの実装中

## 次のステップ
1. AUTH-002のリフレッシュトークン実装を完了
2. AUTH-002のテストを追加
3. API-001に着手

## ブロッカー
- なし

## 注意事項
- JWTの有効期限は15分に設定
- リフレッシュトークンは7日間有効
- 認証エラーは統一フォーマットで返す

## 最終更新
2025-01-16 14:30
```

## CLAUDE.mdへの統合

`Template/.claude/CLAUDE.md`:
```markdown
# プロジェクト概要

[プロジェクトの説明]

## 長時間タスクの進め方

### セッション開始時
1. `claude-progress.txt`を読む
2. `git log --oneline -10`で最近のコミットを確認
3. `Template/.claude/features.json`で次の機能を特定

### 作業中
1. **一度に1つの機能**のみ実装
2. 小さなステップでコミット
3. 進捗ファイルを頻繁に更新

### セッション終了前
1. 現在の作業状態をコミット
2. `claude-progress.txt`を更新
3. `features.json`のステータスを更新

## 重要なファイル
- 進捗: `claude-progress.txt`
- 機能一覧: `Template/.claude/features.json`
- 初期化: `Template/.claude/scripts/init.sh`
```

## 起動プロトコル

各セッション開始時に実行するチェックリスト:

```markdown
## セッション開始チェックリスト

### 1. 状態の確認
- [ ] `cat claude-progress.txt`
- [ ] `git log --oneline -10`
- [ ] `git status`

### 2. 環境の確認
- [ ] `npm run build` が成功する
- [ ] `npm test` が（既存テストが）パスする

### 3. 次のタスクの特定
- [ ] `features.json`で次の"failing"機能を確認
- [ ] 依存関係が満たされているか確認

### 4. 作業開始
- [ ] 1つの機能に集中
- [ ] 小さなステップでコミット
```

## カスタムコマンドの作成

### /status コマンド

`Template/.claude/commands/status.md`:
```markdown
# 進捗状況確認

以下を実行して現在の状況を報告してください：

1. `claude-progress.txt`の内容を表示
2. `git log --oneline -5`で最近のコミットを表示
3. `features.json`から:
   - 完了した機能の数
   - 残りの機能の数
   - 次に取り組むべき機能

## 出力形式
### 進捗サマリー
- 完了: X / Y 機能
- 現在の作業: [機能名]
- 次のステップ: [概要]

### 最近のコミット
[git log出力]

### 注意事項
[進捗ファイルからの注意事項]
```

### /next コマンド

`Template/.claude/commands/next.md`:
```markdown
# 次の機能に着手

以下の手順で次の機能の実装を開始してください：

1. `features.json`から次の"failing"機能を特定
2. 依存関係が満たされているか確認
3. 機能の実装を開始
4. 完了したら:
   - Gitコミット（メッセージに機能IDを含める）
   - `features.json`のstatusを"passing"に更新
   - `claude-progress.txt`を更新

## 注意事項
- 一度に1つの機能のみ
- 大きな機能は小さなステップに分割
- 各ステップでコミット
```

### /save コマンド

`Template/.claude/commands/save.md`:
```markdown
# 進捗を保存

現在の作業状態を保存してください：

1. 未コミットの変更をコミット
2. `claude-progress.txt`を更新:
   - 完了した作業
   - 現在の作業状態
   - 次のステップ
   - 注意事項
3. `features.json`を更新（必要な場合）

## 出力
- コミットハッシュ
- 更新した進捗の要約
```

## テストインフラストラクチャ

### ユニットテストだけに頼らない

```markdown
## テスト戦略

### ユニットテスト
- 個別関数の動作確認
- `npm test`で実行

### 統合テスト
- API エンドポイントの確認
- `npm run test:integration`で実行

### E2Eテスト（Puppeteer）
- ブラウザでの動作確認
- `npm run test:e2e`で実行

### 各機能の完了条件
1. ユニットテストがパス
2. 統合テストがパス（該当する場合）
3. 手動確認（または E2E テスト）
```

## ベストプラクティス

### 1. 段階的進捗

> 「エージェントが一度にやりすぎる傾向に対処するために重要」

```
❌ 悪い例:
- 認証システム全体を一度に実装しようとする

✅ 良い例:
1. ログインフォームのUI
2. 認証APIエンドポイント
3. セッション管理
4. ログアウト機能
```

### 2. JSON形式の活用

```json
// 不適切な変更を防止
{
  "status": "failing",  // "passing"以外の値に変更できない
  "commit": null        // コミットハッシュのみ設定可能
}
```

### 3. Git + 進捗ファイルの組み合わせ

```
Git履歴: 何を変更したか
進捗ファイル: なぜ、どこまでやったか

両方を組み合わせることで、新しいセッションで
迅速に作業状態を理解できる
```

## チェックリスト

### 初期設定

- [ ] `Template/.claude/scripts/init.sh`を作成
- [ ] `Template/.claude/features.json`を作成
- [ ] `claude-progress.txt`を作成
- [ ] CLAUDE.mdに長時間タスクの進め方を追加
- [ ] カスタムコマンド（/status, /next, /save）を作成

### 各セッション

- [ ] 進捗ファイルを確認
- [ ] Git履歴を確認
- [ ] 1つの機能に集中
- [ ] 小さなステップでコミット
- [ ] セッション終了前に進捗を保存

## 次のステップ

長時間タスク設定が完了したら：

1. [CLAUDE.md](./01-claude-md-configuration.md)にワークフローを統合
2. [カスタムコマンド](./05-custom-commands.md)で進捗管理を効率化
3. [Hooks](./06-hooks-configuration.md)で自動保存を設定
