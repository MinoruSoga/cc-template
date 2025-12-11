# MCP サーバー設定ガイド

> 基づく記事: Code Execution with MCP、Desktop Extensions
> 参照: Claude Code 公式ドキュメント

## 概要

Model Context Protocol (MCP) は、AIエージェントが外部ツールやサービスと連携するための標準プロトコルです。MCPサーバーを設定することで、コード実行やファイル操作などの機能を安全に拡張できます。

## MCPの基本概念

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Claude Code   │ ←→  │   MCP Server    │ ←→  │  External Tool  │
│   (Client)      │     │   (Bridge)      │     │  (Service)      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## 設定ファイルの場所（公式仕様）

```bash
# プロジェクトスコープ（推奨）
Template/.claude/.mcp.json

# ユーザースコープ
~/.claude.json
```

**重要**: MCP設定は `.mcp.json` ファイルに記載します。`settings.json` ではありません。

## 基本的な設定構造

### プロジェクトスコープ（`Template/.claude/.mcp.json`）

```json
{
  "mcpServers": {
    "server-name": {
      "command": "実行コマンド",
      "args": ["引数1", "引数2"],
      "env": {
        "ENV_VAR": "value"
      }
    }
  }
}
```

### ユーザースコープ（`~/.claude.json`）

```json
{
  "mcpServers": {
    "global-server": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-example"]
    }
  }
}
```

## 実践的なMCPサーバー設定

### 例1: ファイルシステムサーバー

`Template/.claude/.mcp.json`:
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/path/to/allowed/directory"
      ]
    }
  }
}
```

### 例2: GitHubサーバー

`Template/.claude/.mcp.json`:
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

### 例3: PostgreSQLサーバー

`Template/.claude/.mcp.json`:
```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "${DATABASE_URL}"
      }
    }
  }
}
```

### 例4: Puppeteer（ブラウザ自動化）

`Template/.claude/.mcp.json`:
```json
{
  "mcpServers": {
    "puppeteer": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-puppeteer"]
    }
  }
}
```

## Desktop Extensions (.mcpx ファイル)

### 概要

Desktop Extensions は、MCPサーバーをワンクリックでインストールできるバンドル形式です。

### インストール方法

```bash
# Claude Desktopで.mcpxファイルを開く
# または CLI でインストール
claude mcp add server-name
```

### 利用可能なサーバーの確認

```bash
# インストール済みMCPサーバーの一覧
claude mcp list
```

## カスタムMCPサーバーの作成

### ステップ1: プロジェクト初期化

```bash
mkdir my-mcp-server
cd my-mcp-server
npm init -y
npm install @modelcontextprotocol/sdk
```

### ステップ2: サーバー実装

`server.js`:
```javascript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new Server(
  {
    name: 'my-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// ツールの定義
server.setRequestHandler('tools/list', async () => {
  return {
    tools: [
      {
        name: 'my_tool',
        description: 'ツールの説明',
        inputSchema: {
          type: 'object',
          properties: {
            param1: {
              type: 'string',
              description: 'パラメータの説明',
            },
          },
          required: ['param1'],
        },
      },
    ],
  };
});

// ツールの実行
server.setRequestHandler('tools/call', async (request) => {
  if (request.params.name === 'my_tool') {
    const { param1 } = request.params.arguments;
    // ツールの実装
    return {
      content: [
        {
          type: 'text',
          text: `結果: ${param1}`,
        },
      ],
    };
  }
  throw new Error('Unknown tool');
});

// サーバー起動
const transport = new StdioServerTransport();
await server.connect(transport);
```

### ステップ3: 設定に追加

`Template/.claude/.mcp.json`:
```json
{
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["/path/to/my-mcp-server/server.js"]
    }
  }
}
```

## コード実行サーバーの設定

### 効果

> MCPによるコード実行で**トークン98.7%削減**

### 使用パターン

```
従来: 大量のコードをコンテキストに含める
    ↓
MCP: コードを実行して結果のみを取得

トークン削減: 98.7%
```

## セキュリティ設定

### 環境変数の安全な管理

```bash
# .env ファイル（.gitignoreに追加必須）
GITHUB_TOKEN=your_token_here
DATABASE_URL=postgres://user:pass@host/db

# .claude/.mcp.json で参照
{
  "mcpServers": {
    "github": {
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

### アクセス制限

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "--allowed-paths", "/project/src",
        "--denied-paths", "/project/.env,/project/secrets"
      ]
    }
  }
}
```

## CLIでのMCP管理

```bash
# MCPサーバーを追加
claude mcp add <server-name>

# MCPサーバーを削除
claude mcp remove <server-name>

# インストール済みサーバー一覧
claude mcp list

# サーバーの状態確認
claude mcp status
```

## トラブルシューティング

### サーバーが起動しない

```bash
# 手動でサーバーを起動してエラーを確認
npx -y @modelcontextprotocol/server-filesystem /path

# Claude Code のログを確認
claude --debug
```

### 権限エラー

```bash
# 実行権限を確認
chmod +x server.js

# 環境変数を確認
echo $GITHUB_TOKEN
```

### 接続タイムアウト

`Template/.claude/.mcp.json`:
```json
{
  "mcpServers": {
    "slow-server": {
      "command": "...",
      "timeout": 30000
    }
  }
}
```

## 推奨MCPサーバー一覧

| サーバー | 用途 | パッケージ |
|----------|------|------------|
| Filesystem | ファイル操作 | @modelcontextprotocol/server-filesystem |
| GitHub | GitHub連携 | @modelcontextprotocol/server-github |
| PostgreSQL | DB操作 | @modelcontextprotocol/server-postgres |
| Puppeteer | ブラウザ自動化 | @modelcontextprotocol/server-puppeteer |
| Slack | Slack連携 | @modelcontextprotocol/server-slack |

## ディレクトリ構成

```
Template/
├── .claude/
│   ├── .mcp.json           # MCP サーバー設定
│   ├── settings.json       # その他の設定
│   └── ...
└── ...
```

## チェックリスト

- [ ] `Template/.claude/.mcp.json` が作成されている
- [ ] MCPサーバーのコマンドが正しい
- [ ] 環境変数が設定されている（`.env` ファイル）
- [ ] `.env` が `.gitignore` に追加されている
- [ ] 必要な権限が付与されている
- [ ] `claude mcp list` で確認済み
- [ ] 動作テストを実施

## 次のステップ

MCPサーバーの設定が完了したら：

1. [セキュリティ設定](./04-security-configuration.md)でサンドボックスを設定
2. [カスタムコマンド](./05-custom-commands.md)でMCPツールを呼び出すコマンドを作成
3. [CLAUDE.md](./01-claude-md-configuration.md)にMCPツールの使用方法を記載
