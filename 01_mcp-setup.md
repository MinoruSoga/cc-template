# MCP (Model Context Protocol) 設定ガイド

## 現在の MCP 構成

### Docker MCP Gateway 経由（MCP_DOCKER）

以下のサーバーは `docker mcp server add <name>` で追加済み：

| MCP | 説明 | 設定 |
|-----|------|------|
| context7 | コードドキュメント検索 | 不要 |
| duckduckgo | Web検索（API キー不要） | 不要 |
| playwright | ブラウザ自動化 | 不要 |
| paper-search | 学術論文検索 | 不要 |
| fetch | URL からコンテンツ取得 | 不要 |
| memory | 知識グラフベースの記憶 | 不要 |
| sequentialthinking | 複雑な推論支援 | 不要 |
| SQLite | SQLite 操作 | 不要 |
| github | GitHub API 操作 | 🔑 要シークレット |
| git | Git リポジトリ操作 | ⚙️ 要設定 |
| filesystem | ファイルシステム | ⚙️ 要設定 |
| postgres | PostgreSQL 接続 | 🔑 要シークレット |

### 直接設定（~/.claude.json）

| MCP | 説明 |
|-----|------|
| serena | コード解析・編集ツール（29ツール） |

---

## MCP 管理コマンド

### Docker MCP Gateway

```bash
# サーバー一覧
docker mcp server ls

# サーバー追加
docker mcp server add <name>

# サーバー削除
docker mcp server rm <name>

# カタログ表示（利用可能なサーバー一覧）
docker mcp catalog show

# カタログ検索
docker mcp catalog show | grep -i <keyword>
```

### Claude Code 内

```
/mcp                    # MCP サーバー一覧・管理
/mcp add <name>         # MCP サーバー追加
```

---

## 設定が必要な MCP の設定方法

### 1. GitHub MCP

GitHub Personal Access Token が必要です。

```bash
# シークレットを設定
docker mcp secret set github GITHUB_PERSONAL_ACCESS_TOKEN
# プロンプトでトークンを入力
```

**トークンの取得方法：**
1. https://github.com/settings/tokens にアクセス
2. "Generate new token (classic)" をクリック
3. 必要なスコープを選択（repo, read:org など）
4. トークンを生成してコピー

**推奨スコープ：**
- `repo` - リポジトリへのフルアクセス
- `read:org` - 組織情報の読み取り
- `read:user` - ユーザー情報の読み取り

### 2. Git MCP

`~/.docker/mcp.json` にリポジトリパスを設定：

```json
{
  "servers": {
    "git": {
      "config": {
        "repository": "/Users/minoru/Dev"
      }
    }
  }
}
```

または、Docker MCP の設定コマンド：
```bash
# 設定ファイルを確認
docker mcp server inspect git
```

### 3. Filesystem MCP

`~/.docker/mcp.json` にアクセス可能なディレクトリを設定：

```json
{
  "servers": {
    "filesystem": {
      "config": {
        "allowed_directories": [
          "/Users/minoru/Dev",
          "/Users/minoru/Documents"
        ]
      }
    }
  }
}
```

**注意:** Docker コンテナ内からホストのファイルシステムにアクセスするため、
マウント設定が必要な場合があります。

### 4. PostgreSQL MCP

接続文字列をシークレットとして設定：

```bash
docker mcp secret set postgres POSTGRES_CONNECTION_STRING
# プロンプトで接続文字列を入力
# 例: postgresql://user:password@host.docker.internal:5432/dbname
```

**注意:** ローカルの PostgreSQL に接続する場合は、
`localhost` の代わりに `host.docker.internal` を使用

---

## Serena MCP の設定

`~/.claude.json` に以下の設定が必要：

```json
{
  "mcpServers": {
    "serena": {
      "command": "uvx",
      "args": [
        "--from",
        "git+https://github.com/oraios/serena",
        "serena-mcp-server"
      ]
    }
  }
}
```

**前提条件：**
```bash
brew install uv
```

---

## トラブルシューティング

### MCP が接続できない場合

1. Docker Desktop が起動しているか確認
2. `/mcp` で状態を確認
3. Claude Code を再起動

### Serena が接続できない場合

1. `uvx` がインストールされているか確認
   ```bash
   which uvx
   ```
2. 手動でテスト
   ```bash
   uvx --from git+https://github.com/oraios/serena serena-mcp-server
   ```

### Docker MCP Gateway が接続できない場合

```bash
# Docker MCP の状態確認
docker mcp server ls

# Docker の再起動
# Docker Desktop を再起動
```
