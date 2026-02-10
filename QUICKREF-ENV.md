# Claude Code 環境変数クイックリファレンス

## 🚀 グローバル環境変数（~/.zshrc）

```bash
# GitHub Personal Access Token
export GITHUB_TOKEN="ghp_..."

# Figma Access Token (MCP互換名)
export FIGMA_ACCESS_TOKEN="${FIGMA_TOKEN}"

# MCP Server Configuration
export MCP_TIMEOUT=30000
export MAX_MCP_OUTPUT_TOKENS=25000
```

## 📋 プロジェクト固有環境変数（.env.local）

### Next.js フロントエンド
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-key
```

### バックエンドAPI
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
API_SECRET_KEY=your-secret-key
CORS_ORIGINS=http://localhost:3000
```

### フルスタック
```bash
NODE_ENV=development
PORT=3000
SESSION_SECRET=your-session-secret
```

## ✅ 検証コマンド

```bash
# 環境変数チェック
bash /tmp/verify-claude-env.sh

# 個別確認
echo $GITHUB_TOKEN
echo $FIGMA_ACCESS_TOKEN
echo $MCP_TIMEOUT

# Claude Code 動作確認
claude "list MCP servers"
```

## 🔄 トークンローテーション

```bash
# 1. 新しいトークン生成
# GitHub: https://github.com/settings/tokens
# Figma: https://www.figma.com/developers/api

# 2. ~/.zshrc 編集
vim ~/.zshrc

# 3. 反映
source ~/.zshrc

# 4. 検証
bash /tmp/verify-claude-env.sh
```

## 📚 完全ガイド

`/Users/minoru/Dev/cc/docs/claude-env-setup.md`

## 🎯 ルール

| 設定場所 | 用途 | 例 |
|---------|------|-----|
| **~/.zshrc** | Claude Code グローバル | `GITHUB_TOKEN`, `MCP_TIMEOUT` |
| **.env.local** | プロジェクト固有 | `DATABASE_URL`, `API_SECRET_KEY` |
| **.env.example** | 参照情報のみ | コメントで設定場所を案内 |

**鉄則: トークンは ~/.zshrc、プロジェクト固有設定は .env.local**
