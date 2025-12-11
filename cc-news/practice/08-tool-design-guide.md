# ツール設計ガイド

> 基づく記事: Tool Design、Advanced Tool Use、Think Tool

## 概要

効果的なツール設計は、AIエージェントのパフォーマンスを大幅に向上させます。このガイドでは、MCPツールの設計原則とThink Toolの活用方法を説明します。

## ツール設計の5原則

### 1. 明確で説明的な名前

```json
{
  "tools": [
    {
      "name": "search_database_users",
      "description": "ユーザーデータベースを検索します"
    }
  ]
}
```

```
❌ 悪い例: query, do_thing, process
✅ 良い例: search_database_users, create_github_issue, send_email_notification
```

### 2. 詳細なドキュメント

```json
{
  "name": "create_github_issue",
  "description": "GitHubリポジトリに新しいIssueを作成します。タイトルと本文は必須です。ラベルとアサイニーはオプションです。",
  "inputSchema": {
    "type": "object",
    "properties": {
      "title": {
        "type": "string",
        "description": "Issueのタイトル（最大256文字）"
      },
      "body": {
        "type": "string",
        "description": "Issueの本文（Markdown形式）"
      },
      "labels": {
        "type": "array",
        "items": { "type": "string" },
        "description": "適用するラベル（例: ['bug', 'priority-high']）"
      },
      "assignees": {
        "type": "array",
        "items": { "type": "string" },
        "description": "アサインするユーザー名"
      }
    },
    "required": ["title", "body"]
  }
}
```

### 3. 意味のあるエラーメッセージ

```javascript
// ツール実装例
async function createGithubIssue(params) {
  if (!params.title) {
    return {
      error: true,
      message: "タイトルは必須です。",
      suggestion: "title パラメータにIssueのタイトルを指定してください。"
    };
  }

  if (params.title.length > 256) {
    return {
      error: true,
      message: `タイトルが長すぎます（${params.title.length}文字）。`,
      suggestion: "タイトルは256文字以内にしてください。"
    };
  }

  try {
    const result = await github.createIssue(params);
    return {
      success: true,
      issueUrl: result.html_url,
      issueNumber: result.number
    };
  } catch (e) {
    return {
      error: true,
      message: `Issue作成に失敗しました: ${e.message}`,
      suggestion: "リポジトリへのアクセス権限を確認してください。"
    };
  }
}
```

### 4. 意味のあるコンテキストを返す

```javascript
// 悪い例
return { success: true };

// 良い例
return {
  success: true,
  issueUrl: "https://github.com/owner/repo/issues/123",
  issueNumber: 123,
  createdAt: "2025-01-15T10:30:00Z",
  nextSteps: [
    "Issueが作成されました。URLをユーザーに共有できます。",
    "ラベルを追加する場合は update_github_issue を使用してください。"
  ]
};
```

### 5. 名前空間でグループ化

```json
{
  "tools": [
    { "name": "github_create_issue" },
    { "name": "github_update_issue" },
    { "name": "github_list_issues" },
    { "name": "github_close_issue" },

    { "name": "slack_send_message" },
    { "name": "slack_create_channel" },

    { "name": "db_query" },
    { "name": "db_insert" },
    { "name": "db_update" }
  ]
}
```

## Think Tool の活用

### 概要

Think Toolは、エージェントが「立ち止まって考える」ための専用ツールです。複雑なタスクでの推論能力を**54%向上**させます（τ-Bench基準）。

### 設定

```json
{
  "tools": [
    {
      "name": "think",
      "description": "複雑な問題を分析し、推論を行うためのツール。計画立案、問題分解、意思決定に使用します。",
      "inputSchema": {
        "type": "object",
        "properties": {
          "thought": {
            "type": "string",
            "description": "現在の思考内容"
          }
        },
        "required": ["thought"]
      }
    }
  ]
}
```

### 使用シナリオ

```markdown
## Think Toolを使用すべき場面

1. **複雑な問題の分解**
   - 大きなタスクを小さなステップに分割
   - 依存関係の分析

2. **複数の選択肢の評価**
   - アーキテクチャ決定
   - ライブラリの選択
   - 実装方法の比較

3. **リスク評価**
   - 変更の影響範囲
   - 潜在的な問題の特定

4. **デバッグ**
   - エラーの原因分析
   - 仮説の立案と検証
```

### CLAUDE.mdへの統合

```markdown
## 推論ツールの使用

複雑なタスクに取り組む際は、Think Toolを使用して:
1. 問題を分解する
2. 選択肢を評価する
3. 計画を立てる

### 使用例
```
think("このバグの原因を分析する:
1. エラーメッセージ: XXX
2. 発生条件: YYY
3. 仮説1: ZZZ
4. 仮説2: AAA
5. 検証方法: ...")
```
```

## Advanced Tool Use 機能

### 1. Tool Search Tool

多数のツールがある場合に、関連ツールを検索：

```json
{
  "name": "tool_search",
  "description": "利用可能なツールを検索します",
  "inputSchema": {
    "type": "object",
    "properties": {
      "query": {
        "type": "string",
        "description": "検索クエリ"
      },
      "category": {
        "type": "string",
        "enum": ["github", "slack", "database", "file"],
        "description": "ツールカテゴリ"
      }
    },
    "required": ["query"]
  }
}
```

### 2. Programmatic Tool Calling

ツール呼び出しをプログラム的に制御：

```javascript
// ツール呼び出しの制御
const toolConfig = {
  allowedTools: ["github_create_issue", "github_update_issue"],
  maxCalls: 10,
  requireApproval: ["github_delete_issue"]
};
```

### 3. Tool Use Examples

ツールの使用例をドキュメントに含める：

```json
{
  "name": "search_code",
  "description": "コードベースを検索します",
  "examples": [
    {
      "input": {
        "query": "function handleSubmit",
        "fileType": "tsx"
      },
      "description": "TypeScript Reactファイルでフォーム送信ハンドラを検索"
    },
    {
      "input": {
        "query": "import.*prisma",
        "regex": true
      },
      "description": "Prismaをインポートしているファイルを検索"
    }
  ]
}
```

## MCPツールの実装

### 基本構造

```javascript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';

const server = new Server({
  name: 'my-tools',
  version: '1.0.0',
}, {
  capabilities: { tools: {} }
});

// ツール一覧
server.setRequestHandler('tools/list', async () => ({
  tools: [
    {
      name: 'my_tool',
      description: '説明',
      inputSchema: { /* ... */ }
    }
  ]
}));

// ツール実行
server.setRequestHandler('tools/call', async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'my_tool':
      return await handleMyTool(args);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});
```

### エラーハンドリング

```javascript
async function handleMyTool(args) {
  try {
    // バリデーション
    if (!args.required_param) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            error: true,
            message: 'required_param is required',
            suggestion: 'Provide the required_param parameter'
          })
        }],
        isError: true
      };
    }

    // 実行
    const result = await doSomething(args);

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          success: true,
          data: result,
          nextSteps: ['...']
        })
      }]
    };
  } catch (error) {
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          error: true,
          message: error.message,
          suggestion: 'Check the input and try again'
        })
      }],
      isError: true
    };
  }
}
```

## ツール設計チェックリスト

### 命名
- [ ] 動詞_名詞_修飾子 の形式（例: create_github_issue）
- [ ] 名前空間でグループ化（github_, slack_, db_）
- [ ] 一貫した命名規則

### ドキュメント
- [ ] 明確な説明
- [ ] すべてのパラメータに説明
- [ ] 必須/オプションの区別
- [ ] 使用例の提供

### 入力
- [ ] 適切な型定義
- [ ] バリデーション
- [ ] デフォルト値の設定

### 出力
- [ ] 成功/失敗の明確な区別
- [ ] 意味のあるコンテキスト
- [ ] 次のステップの提案
- [ ] 詳細なエラーメッセージ

### セキュリティ
- [ ] 入力のサニタイズ
- [ ] 権限チェック
- [ ] レート制限

## CLAUDE.mdへのツール記載

```markdown
## 利用可能なツール

### GitHub関連
| ツール | 説明 | 使用例 |
|--------|------|--------|
| github_create_issue | Issue作成 | `github_create_issue(title, body)` |
| github_search_code | コード検索 | `github_search_code(query)` |

### データベース関連
| ツール | 説明 | 使用例 |
|--------|------|--------|
| db_query | クエリ実行 | `db_query(sql)` |

### 推論
| ツール | 説明 | 使用例 |
|--------|------|--------|
| think | 思考ツール | `think(thought)` |

## ツール使用のベストプラクティス
1. 複雑なタスクではまず`think`で計画
2. GitHub操作は確認してから実行
3. DBクエリは読み取りから開始
```

## 次のステップ

ツール設計が完了したら：

1. [MCP設定](./03-mcp-server-configuration.md)でツールを登録
2. [CLAUDE.md](./01-claude-md-configuration.md)にツール情報を記載
3. [カスタムコマンド](./05-custom-commands.md)でツールを活用
