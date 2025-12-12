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
Template/.mcp.json

# ユーザースコープ
~/.claude.json
```

**重要**: MCP設定は `.mcp.json` ファイルに記載します。`settings.json` ではありません。

## 基本的な設定構造

### プロジェクトスコープ（`Template/.mcp.json`）

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

`Template/.mcp.json`:
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

`Template/.mcp.json`:
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

`Template/.mcp.json`:
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

`Template/.mcp.json`:
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

`Template/.mcp.json`:
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

# .mcp.json で参照（プロジェクトルート）
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

`Template/.mcp.json`:
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

### 公式サーバー（Anthropic）

#### Filesystem
ローカルファイルシステムへの安全なアクセスを提供。ファイルの読み書き、ディレクトリ操作、ファイル検索が可能。許可されたディレクトリのみにアクセスを制限できる。

| パッケージ | @modelcontextprotocol/server-filesystem |
|-----------|----------------------------------------|

#### GitHub
GitHub API のラッパー。リポジトリの操作、Issue/PR の作成・管理、コード検索、ブランチ操作などを AI から直接実行可能。CI/CD ワークフローの自動化にも活用できる。

| パッケージ | @modelcontextprotocol/server-github |
|-----------|-------------------------------------|

#### PostgreSQL
PostgreSQL データベースへの接続を提供。SQL クエリの実行、スキーマ情報の取得、データの CRUD 操作が可能。AI によるデータ分析やレポート生成に活用できる。

| パッケージ | @modelcontextprotocol/server-postgres |
|-----------|--------------------------------------|

#### Puppeteer
Headless Chrome/Chromium を制御するブラウザ自動化ツール。Web スクレイピング、スクリーンショット取得、PDF 生成、フォーム操作、E2E テストの実行が可能。

| パッケージ | @modelcontextprotocol/server-puppeteer |
|-----------|---------------------------------------|

#### Slack
Slack API との連携を提供。メッセージの送受信、チャンネル操作、ユーザー情報の取得、ファイルアップロードが可能。チーム通知やボット機能の実装に活用できる。

| パッケージ | @modelcontextprotocol/server-slack |
|-----------|-----------------------------------|

### コミュニティサーバー（推奨）

#### Serena
LSP（Language Server Protocol）ベースのセマンティックコード解析ツール。IDE と同等の「定義へジャンプ」「参照検索」「シンボル検索」機能を AI に提供。9言語（Python, Java, TypeScript, Ruby, Go, C#, Clojure, Elixir, Terraform）に対応。Microsoft/GitHub がスポンサー。

| パッケージ | git+https://github.com/oraios/serena |
|-----------|-------------------------------------|

#### Context7
任意のライブラリ・フレームワークの最新ドキュメントをリアルタイムで取得。AI の知識カットオフを超えた最新情報にアクセス可能。4.5M ダウンロード、GitHub 39K スター。プロンプトに「use context7」と書くだけで使用可能。

| パッケージ | @upstash/context7-mcp |
|-----------|----------------------|

### Serena 設定例

```json
{
  "mcpServers": {
    "serena": {
      "command": "uvx",
      "args": [
        "--from", "git+https://github.com/oraios/serena",
        "serena", "start-mcp-server",
        "--context", "ide-assistant",
        "--project", "${PROJECT_ROOT}"
      ],
      "env": {
        "SERENA_MAX_MEM": "1024",
        "SERENA_MAX_WORKERS": "2"
      }
    }
  }
}
```

**対応言語**: Python, Java, TypeScript, Ruby, Go, C#, Clojure, Elixir, Terraform

**機能**:
- Go to Definition（定義へジャンプ）
- Find References（参照検索）
- セマンティック検索
- シンボル検索

### Context7 設定例

```json
{
  "mcpServers": {
    "context7-mcp": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"],
      "env": {
        "NODE_OPTIONS": "--max-old-space-size=512"
      }
    }
  }
}
```

**使い方**: プロンプトに「use context7」と書くだけで、任意のライブラリの最新ドキュメントを取得

**例**:
- 「Next.js 15のApp Routerについて教えて use context7」
- 「Prismaのリレーション設定 use context7」

### その他の人気サーバー（用途別）

#### ブラウザ自動化

**Playwright** (12K+ Stars)
Microsoft 製のブラウザ自動化フレームワーク。Chromium、Firefox、WebKit の3エンジンに対応。Puppeteer より高機能で、自動待機、ネットワークインターセプト、モバイルエミュレーション、複数タブ/ブラウザの同時制御が可能。E2E テストのデファクトスタンダード。

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-playwright"]
    }
  }
}
```

**Browser Tools**
Web 開発に特化したブラウザデバッグツール群。DOM インスペクション、ネットワーク監視、コンソールログ取得、パフォーマンス計測などフロントエンド開発に必要な機能を提供。

#### コンテナ・インフラ

**Docker**
Docker Engine との連携を提供。コンテナの起動・停止・ログ取得、イメージのビルド・プル、ボリューム/ネットワーク管理が可能。AI によるインフラ運用自動化に活用。

```json
{
  "mcpServers": {
    "docker": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-docker"]
    }
  }
}
```

**AWS (Bedrock AgentCore)**
AWS サービス群との統合を提供。Bedrock エコシステムの中核として、マルチエージェント間のコンテキスト管理、セッション記憶、アクション割り当てを担当。

#### プロダクティビティ

**Notion**
Notion API との連携を提供。ページ・データベースの作成・編集・検索、ブロック操作、コメント管理が可能。AI によるナレッジベース構築・ドキュメント自動生成に活用。

**GSuite**
Google Workspace（Gmail、Drive、Docs、Sheets、Calendar）との連携。ドキュメント作成・編集、スプレッドシート操作、メール送受信、カレンダー管理を AI から実行可能。

**Figma**
Figma API との連携を提供。デザインファイルの読み取り、コンポーネント情報取得、スタイル抽出が可能。デザインシステムの文書化やコード生成の自動化に活用。

#### ワークフロー自動化

**Zapier**
5000以上のアプリを連携するノーコード自動化プラットフォーム。トリガーとアクションを組み合わせたワークフロー（Zap）を AI から作成・実行可能。

**n8n**
オープンソースのワークフロー自動化ツール。セルフホスト可能で、400以上のアプリ統合、カスタムコード実行、Webhook 対応。AI エージェントからのワークフロートリガーに対応。

#### データ・AI

**Qdrant**
高性能ベクトル類似検索エンジン。AI エージェントのセマンティック記憶として機能し、過去の会話や関連ドキュメントを即座に検索。RAG（Retrieval-Augmented Generation）構築に最適。

**Chroma**
埋め込みベクトルデータベース。ドキュメントの保存・検索・フィルタリングを提供。LangChain/LlamaIndex との統合が容易で、AI アプリケーションのコンテキスト管理に活用。

**Jupyter**
Jupyter Notebook/Lab との連携。ノートブックの作成・実行、セル操作、カーネル管理が可能。データ分析・可視化・機械学習ワークフローを AI から制御。

#### コミュニケーション

**WhatsApp**
WhatsApp Business API との連携。メッセージの送受信、チャット管理、メディアファイル送信が可能。カスタマーサポートやマーケティング自動化に活用。

**Discord**
Discord Bot API との連携。メッセージ送受信、サーバー/チャンネル管理、ユーザー情報取得、リアクション操作が可能。コミュニティ管理やボット機能の実装に活用。

### MCP サーバー選定ガイド

```
基本構成（Template推奨）:
├── filesystem    # ファイル操作
├── github        # GitHub連携
├── puppeteer     # ブラウザ自動化（または playwright）
├── postgres      # DB操作
├── slack         # チーム連携
├── serena        # コード解析
└── context7-mcp  # ドキュメント検索

プロジェクト固有で追加:
├── notion        # ドキュメント管理が必要な場合
├── docker        # コンテナ運用がある場合
├── figma         # デザインチームと協業する場合
└── qdrant/chroma # RAG/AI検索を構築する場合
```

### リソース

- [awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers) - 全サーバー一覧
- [MCPMarket Leaderboard](https://mcpmarket.com/leaderboards) - GitHub Stars ランキング
- [Docker MCP Toolkit](https://www.docker.com/blog/top-mcp-servers-2025/) - セキュアな MCP 運用

## ディレクトリ構成

```
Template/
├── .mcp.json               # MCP サーバー設定（プロジェクトルート）
├── .claude/
│   ├── settings.json       # その他の設定
│   └── ...
└── ...
```

## チェックリスト

- [ ] `Template/.mcp.json` が作成されている
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
