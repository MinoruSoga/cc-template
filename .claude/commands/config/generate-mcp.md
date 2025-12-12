# .mcp.json 生成

対象プロジェクト: $ARGUMENTS

## 参照ドキュメント

生成時は以下を必ず参照:

- **テンプレート:** `/Users/minoru/Dev/cc/cc-news/Template/.mcp.json`
- **ガイド:** `/Users/minoru/Dev/cc/cc-news/practice/03-mcp-server-configuration.md`

## 生成手順

### 1. プロジェクト分析

以下を確認して必要なMCPサーバーを判定:

- 技術スタック
- データベース種類
- テストフレームワーク
- CI/CD設定
- 外部サービス連携

### 2. 既存設定の確認

既存.mcp.jsonがある場合:

1. 現在の設定を読み込む
2. 既存サーバー設定を保持
3. 新規推奨サーバーを追加提案

### 3. .mcp.json生成

以下の構造で生成:

```json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["-y", "@package/server"],
      "env": {
        "ENV_VAR": "${ENV_VAR}"
      }
    }
  }
}
```

## 推奨MCPサーバー

### 全プロジェクト共通

#### filesystem（必須）

```json
{
  "filesystem": {
    "command": "npx",
    "args": ["-y", "@anthropic/mcp-server-filesystem", "."],
    "env": {
      "PATH": "${PATH}"
    }
  }
}
```

#### github（Git使用時）

```json
{
  "github": {
    "command": "npx",
    "args": ["-y", "@anthropic/mcp-server-github"],
    "env": {
      "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
    }
  }
}
```

### データベース

#### postgres（PostgreSQL使用時）

```json
{
  "postgres": {
    "command": "npx",
    "args": ["-y", "@anthropic/mcp-server-postgres"],
    "env": {
      "DATABASE_URL": "${DATABASE_URL}"
    }
  }
}
```

#### sqlite（SQLite使用時）

```json
{
  "sqlite": {
    "command": "npx",
    "args": ["-y", "@anthropic/mcp-server-sqlite", "./database.db"],
    "env": {}
  }
}
```

### テスト/ブラウザ自動化

#### puppeteer（E2Eテスト/スクレイピング）

```json
{
  "puppeteer": {
    "command": "npx",
    "args": ["-y", "@anthropic/mcp-server-puppeteer"],
    "env": {}
  }
}
```

#### playwright（Playwright使用時）

```json
{
  "playwright": {
    "command": "npx",
    "args": ["-y", "@anthropic/mcp-server-playwright"],
    "env": {}
  }
}
```

### コード解析

#### serena（大規模プロジェクト）

```json
{
  "serena": {
    "command": "uvx",
    "args": ["serena-mcp-server"],
    "env": {
      "SERENA_CONFIG": "${PROJECT_ROOT}/.serena/config.json"
    }
  }
}
```

#### context7（React/Next.js/TypeScript）

```json
{
  "context7-mcp": {
    "command": "npx",
    "args": ["-y", "@anthropic/mcp-server-context7"],
    "env": {}
  }
}
```

### 外部サービス連携

#### slack（Slack連携）

```json
{
  "slack": {
    "command": "npx",
    "args": ["-y", "@anthropic/mcp-server-slack"],
    "env": {
      "SLACK_BOT_TOKEN": "${SLACK_BOT_TOKEN}",
      "SLACK_TEAM_ID": "${SLACK_TEAM_ID}"
    }
  }
}
```

#### figma（Figma連携）

```json
{
  "figma": {
    "command": "npx",
    "args": ["-y", "@anthropic/mcp-server-figma"],
    "env": {
      "FIGMA_ACCESS_TOKEN": "${FIGMA_ACCESS_TOKEN}"
    }
  }
}
```

## 技術スタック別推奨構成

### Next.js / React

```json
{
  "mcpServers": {
    "filesystem": { "..." },
    "github": { "..." },
    "puppeteer": { "..." },
    "context7-mcp": { "..." }
  }
}
```

### Django / FastAPI + PostgreSQL

```json
{
  "mcpServers": {
    "filesystem": { "..." },
    "github": { "..." },
    "postgres": { "..." }
  }
}
```

### フルスタック（大規模）

```json
{
  "mcpServers": {
    "filesystem": { "..." },
    "github": { "..." },
    "postgres": { "..." },
    "puppeteer": { "..." },
    "serena": { "..." },
    "context7-mcp": { "..." }
  }
}
```

## 環境変数の設定

MCPサーバーが必要とする環境変数:

| サーバー | 環境変数 | 説明 |
|---------|---------|------|
| github | `GITHUB_TOKEN` | GitHub Personal Access Token |
| postgres | `DATABASE_URL` | PostgreSQL接続文字列 |
| slack | `SLACK_BOT_TOKEN` | Slack Bot Token |
| slack | `SLACK_TEAM_ID` | Slack Team ID |
| figma | `FIGMA_ACCESS_TOKEN` | Figma Access Token |

**設定場所:**

1. `.env` ファイル（プロジェクトローカル）
2. シェル環境変数
3. `.claude/settings.local.json` の env セクション

## マージ戦略

既存.mcp.jsonがある場合:

1. **既存サーバー:** 設定を保持
2. **新規推奨:** 追加提案（確認後）
3. **環境変数:** 既存の参照を維持

## 出力

1. 推奨サーバー一覧を表示
2. 生成内容のプレビューを表示
3. 必要な環境変数を一覧表示
4. ユーザー確認後にファイルを作成

## 配置場所

`[プロジェクトルート]/.mcp.json`

## 注意事項

- 環境変数は `${VAR_NAME}` 形式で参照
- トークン等の秘密情報は直接記載しない
- 不要なサーバーは含めない（パフォーマンス考慮）
