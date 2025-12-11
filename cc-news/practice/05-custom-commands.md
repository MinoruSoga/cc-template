# カスタムコマンド設定ガイド

> 基づく記事: Claude Code Best Practices、Tool Design

## 概要

カスタムスラッシュコマンドを作成することで、繰り返しのタスクを効率化し、チーム全体で一貫した操作を実現できます。

## ディレクトリ構造

```
Template/
├── .claude/
│   └── commands/
│       ├── review.md       # /review コマンド
│       ├── deploy.md       # /deploy コマンド
│       ├── test.md         # /test コマンド
│       └── debug.md        # /debug コマンド
└── ...
```

## コマンドファイルの基本形式

### シンプルなコマンド

`Template/.claude/commands/review.md`:
```markdown
コードレビューを実行してください。

## 確認項目
1. コードスタイルの一貫性
2. エラーハンドリングの適切さ
3. セキュリティ上の問題
4. パフォーマンスの問題
5. テストカバレッジ

## 出力形式
- 問題点をリスト形式で報告
- 重要度（高/中/低）を付記
- 修正案を提示
```

### 引数付きコマンド

`Template/.claude/commands/test.md`:
```markdown
$FILEに対してテストを実行してください。

## 手順
1. 対象ファイル: $FILE
2. 関連するテストファイルを特定
3. テストを実行
4. カバレッジを確認
5. 失敗したテストがあれば原因を分析

## 出力
- テスト結果のサマリー
- 失敗したテストの詳細
- カバレッジレポート
```

使用方法:
```
/test src/utils/helper.ts
```

## 実践的なコマンド例

### 1. コードレビューコマンド

`Template/.claude/commands/review.md`:
```markdown
# コードレビュー

現在のステージングされた変更をレビューしてください。

## チェックリスト

### コード品質
- [ ] 命名規則に従っている
- [ ] 関数が単一責任を持っている
- [ ] 重複コードがない
- [ ] 適切なコメントがある

### セキュリティ
- [ ] 入力値の検証
- [ ] SQLインジェクション対策
- [ ] XSS対策
- [ ] 機密情報のハードコードなし

### パフォーマンス
- [ ] N+1クエリがない
- [ ] 不要な再レンダリングがない
- [ ] メモリリークの可能性がない

### テスト
- [ ] ユニットテストがある
- [ ] エッジケースがカバーされている

## 出力形式
各問題点について:
- ファイル名と行番号
- 問題の説明
- 推奨される修正
- 重要度（Critical/Major/Minor）
```

### 2. デプロイコマンド

`Template/.claude/commands/deploy.md`:
```markdown
# デプロイ実行

$ENVIRONMENTへのデプロイを準備してください。

## 前提条件の確認
1. 現在のブランチを確認
2. 未コミットの変更がないことを確認
3. テストがすべてパスすることを確認
4. ビルドが成功することを確認

## デプロイ手順
1. 環境: $ENVIRONMENT
2. ビルドコマンド: `npm run build`
3. デプロイコマンド: `./scripts/deploy.sh $ENVIRONMENT`

## 注意事項
- productionへのデプロイは必ず確認を求める
- ロールバック手順を表示
- デプロイ後の確認項目を提示

## 出力
- デプロイの準備状況
- 実行すべきコマンド
- 確認すべき項目
```

### 3. バグ調査コマンド

`Template/.claude/commands/debug.md`:
```markdown
# バグ調査

$DESCRIPTIONの問題を調査してください。

## 調査手順
1. エラーメッセージの分析
2. 関連するコードの特定
3. 最近の変更履歴の確認
4. 再現手順の特定

## 出力形式
### 問題の概要
[問題の説明]

### 根本原因
[原因の分析]

### 影響範囲
[影響を受ける機能]

### 修正案
[具体的な修正方法]

### 再発防止
[防止策の提案]
```

### 4. ドキュメント生成コマンド

`Template/.claude/commands/docs.md`:
```markdown
# ドキュメント生成

$FILEのドキュメントを生成してください。

## 生成する内容
1. 関数/クラスの概要
2. パラメータの説明
3. 戻り値の説明
4. 使用例
5. 注意事項

## フォーマット
JSDoc/TSDoc形式で出力

## 例
```typescript
/**
 * ユーザー情報を取得する
 * @param userId - ユーザーID
 * @returns ユーザー情報オブジェクト
 * @throws {NotFoundError} ユーザーが存在しない場合
 * @example
 * const user = await getUser('123');
 */
```
```

### 5. リファクタリングコマンド

`Template/.claude/commands/refactor.md`:
```markdown
# リファクタリング提案

$FILEのリファクタリングを提案してください。

## 分析項目
1. コードの複雑度（Cyclomatic Complexity）
2. 重複コード
3. 長すぎる関数
4. 深すぎるネスト
5. 不明確な命名

## 提案形式
各提案について:
- 現状の問題点
- 提案する変更
- 期待される改善
- リスクと注意点

## 優先順位
1. バグの可能性がある箇所
2. 保守性に影響する箇所
3. パフォーマンスに影響する箇所
```

### 6. テスト生成コマンド

`Template/.claude/commands/gen-test.md`:
```markdown
# テスト生成

$FILEのテストを生成してください。

## テスト方針
- 正常系のテスト
- 境界値のテスト
- エラーケースのテスト
- エッジケースのテスト

## フレームワーク
Jest / Vitest

## テストパターン
```typescript
describe('関数名', () => {
  describe('正常系', () => {
    it('should [期待する動作]', () => {
      // Arrange
      // Act
      // Assert
    });
  });

  describe('異常系', () => {
    it('should throw error when [条件]', () => {
      // ...
    });
  });
});
```

## 出力
- テストファイルの内容
- モックが必要な場合はモックの設定
```

## コマンドの作成手順

### ステップ1: コマンドディレクトリの作成

```bash
mkdir -p Template/.claude/commands
```

### ステップ2: コマンドファイルの作成

```bash
touch Template/.claude/commands/[command-name].md
```

### ステップ3: コマンド内容の記述

```markdown
# コマンドタイトル

[Claudeへの指示を記述]

## 手順
1. [ステップ1]
2. [ステップ2]

## 出力形式
[期待する出力の形式]
```

### ステップ4: 動作確認

```bash
# Claude Codeで実行
/[command-name] [引数]
```

## ベストプラクティス

### 1. 明確な指示を記述

```markdown
# 悪い例
コードをレビューして

# 良い例
以下のチェックリストに基づいてコードをレビューしてください:
1. [具体的な確認項目]
2. [具体的な確認項目]
```

### 2. 出力形式を指定

```markdown
## 出力形式
以下のJSON形式で出力:
```json
{
  "issues": [
    {
      "file": "ファイル名",
      "line": 行番号,
      "severity": "high|medium|low",
      "message": "問題の説明",
      "suggestion": "修正案"
    }
  ]
}
```
```

### 3. 引数のドキュメント化

```markdown
# コマンド名

## 引数
- $FILE: 対象ファイルのパス（必須）
- $OPTIONS: オプション（任意）

## 使用例
/command src/index.ts
/command src/index.ts --verbose
```

### 4. エラーケースの考慮

```markdown
## エラー時の対応
- ファイルが存在しない場合: エラーメッセージを表示
- 権限がない場合: 適切な権限を案内
```

## チームでの活用

### 共有コマンドの管理

```
Template/
├── .claude/
│   └── commands/
│       ├── team/           # チーム共有コマンド
│       │   ├── review.md
│       │   └── deploy.md
│       └── personal/       # 個人用コマンド（.gitignore）
│           └── my-command.md
```

### .gitignore設定

```gitignore
# 個人用コマンドは除外
Template/.claude/commands/personal/
```

## コマンド一覧テンプレート

| コマンド | 説明 | 引数 |
|----------|------|------|
| /review | コードレビュー | なし |
| /test | テスト実行 | $FILE |
| /deploy | デプロイ | $ENVIRONMENT |
| /debug | バグ調査 | $DESCRIPTION |
| /docs | ドキュメント生成 | $FILE |
| /refactor | リファクタリング提案 | $FILE |
| /gen-test | テスト生成 | $FILE |

## チェックリスト

- [ ] コマンドディレクトリが作成されている
- [ ] コマンドファイルが.md形式で作成されている
- [ ] 指示が明確で具体的
- [ ] 出力形式が指定されている
- [ ] 引数がある場合はドキュメント化されている
- [ ] チームで共有すべきコマンドはリポジトリに含まれている

## 次のステップ

カスタムコマンドの設定が完了したら：

1. [CLAUDE.md](./01-claude-md-configuration.md)によく使うコマンドを記載
2. [Hooks](./06-hooks-configuration.md)でコマンド実行前後の処理を追加
3. チームメンバーと有用なコマンドを共有
