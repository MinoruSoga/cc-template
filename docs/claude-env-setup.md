# Claude Code グローバル環境変数セットアップガイド

## 概要

Claude Code MCP 関連の環境変数は、各プロジェクトの `.env` ではなく、**ホストPCのグローバル環境変数**として設定することを推奨します。

### メリット

- ✅ **セキュリティ向上**: トークンを誤ってgit commitするリスクがゼロ
- ✅ **DRY原則**: 複数プロジェクトで同じトークンを重複設定不要
- ✅ **一元管理**: トークンローテーション時に1箇所だけ更新すれば全プロジェクトに反映
- ✅ **責務の明確化**: プロジェクト固有設定とClaude Code共通設定を分離

---

## セットアップ手順

### 1. トークンの取得

#### GitHub Personal Access Token

1. https://github.com/settings/tokens にアクセス
2. **Generate new token (classic)** をクリック
3. スコープを選択:
   - ✅ `repo` (リポジトリアクセス)
   - ✅ `read:org` (組織情報読み取り)
   - ✅ `gist` (Gist作成・編集)
4. **Generate token** をクリックしてトークンをコピー

#### Figma Access Token (オプション)

1. https://www.figma.com/developers/api#access-tokens にアクセス
2. Figma アカウントにログイン
3. **Personal Access Tokens** セクションで **Create a new personal access token**
4. トークン名を入力して生成
5. トークンをコピー

---

### 2. ~/.zshrc に環境変数を追加

```bash
# ~/.zshrc を編集
vim ~/.zshrc
# または
code ~/.zshrc
```

ファイルの末尾に以下を追加:

```bash
# ===== Claude Code MCP Configuration =====

# GitHub Personal Access Token (必須)
export GITHUB_TOKEN="ghp_xxxxxxxxxxxxxxxxxxxx"  # ← 実際のトークンに置き換え

# Figma Access Token (Figma使用時のみ)
export FIGMA_ACCESS_TOKEN="figd_xxxxxxxxxxxxxxxxxxxx"  # ← 実際のトークンに置き換え

# MCP タイムアウト（ミリ秒）
export MCP_TIMEOUT=30000

# MCP 出力トークン上限
export MAX_MCP_OUTPUT_TOKENS=25000

# Tool Search（自動で5件以上のツールを遅延ロード）※オプション
# export ENABLE_TOOL_SEARCH=auto:5

# Agent Teams（実験的機能：複数エージェントの協調動作）※オプション
# export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
```

---

### 3. 設定を反映

```bash
# ~/.zshrc を再読み込み
source ~/.zshrc

# 環境変数が設定されたか確認
echo $GITHUB_TOKEN
# 出力: ghp_xxxxxxxxxxxxxxxxxxxx

echo $FIGMA_ACCESS_TOKEN
# 出力: figd_xxxxxxxxxxxxxxxxxxxx

echo $MCP_TIMEOUT
# 出力: 30000
```

---

### 4. 動作確認

Claude Code から MCP サーバーが利用できるか確認:

```bash
# GitHub MCP サーバーのテスト
claude "search GitHub for issues about Claude Code"

# Figma MCP サーバーのテスト（Figmaサーバー起動後）
claude "list my Figma files"
```

---

## 高度な設定（オプション）

### 方法A: 専用ファイルで管理

トークン管理を分離したい場合:

```bash
# ~/.claude-env ファイルを作成
cat << 'EOF' > ~/.claude-env
# Claude Code Global Environment Variables
export GITHUB_TOKEN="ghp_xxxxxxxxxxxxxxxxxxxx"
export FIGMA_ACCESS_TOKEN="figd_xxxxxxxxxxxxxxxxxxxx"
export MCP_TIMEOUT=30000
export MAX_MCP_OUTPUT_TOKENS=25000
EOF

# パーミッション設定（セキュリティ強化）
chmod 600 ~/.claude-env

# ~/.zshrc から読み込み
echo '' >> ~/.zshrc
echo '# Claude Code Environment Variables' >> ~/.zshrc
echo '[ -f ~/.claude-env ] && source ~/.claude-env' >> ~/.zshrc

# 反映
source ~/.zshrc
```

**メリット:**
- トークン管理が ~/.zshrc と分離される
- トークンファイルに厳格なパーミッション設定（600）
- git で ~/.zshrc を管理する場合でもトークンを除外しやすい

---

### 方法B: direnv でプロジェクトごとに上書き

特定のプロジェクトだけ設定を変更したい場合:

```bash
# direnv インストール
brew install direnv

# ~/.zshrc に direnv フックを追加
echo 'eval "$(direnv hook zsh)"' >> ~/.zshrc
source ~/.zshrc

# プロジェクトディレクトリで .envrc 作成
cd /path/to/project
cat << 'EOF' > .envrc
# このプロジェクトだけ Docker 環境でタイムアウト延長
export MCP_TIMEOUT=120000
EOF

# .envrc を許可
direnv allow .
```

**使用例:**
- Docker 開発環境のプロジェクト → `MCP_TIMEOUT=120000`
- 通常のプロジェクト → グローバル設定 `30000` を使用

---

## プロジェクトの .env には何を設定する？

### ❌ グローバル環境変数に設定すべきもの

```bash
# これらは ~/.zshrc に設定（プロジェクトの .env には書かない）
GITHUB_TOKEN=...
FIGMA_ACCESS_TOKEN=...
MCP_TIMEOUT=...
MAX_MCP_OUTPUT_TOKENS=...
ENABLE_TOOL_SEARCH=...
CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=...
```

### ✅ プロジェクトの .env に設定すべきもの

```bash
# プロジェクト固有の設定のみ

# Next.js フロントエンド
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-project-specific-key

# バックエンドAPI
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
API_SECRET_KEY=your-project-secret-key
CORS_ORIGINS=http://localhost:3000

# 共通
NODE_ENV=development
PORT=3000
```

---

## トークンローテーション

定期的にトークンを更新することを推奨します:

```bash
# 1. GitHub で新しいトークンを生成
# 2. ~/.zshrc または ~/.claude-env を編集
vim ~/.zshrc  # または vim ~/.claude-env

# 3. GITHUB_TOKEN の値を更新
export GITHUB_TOKEN="ghp_新しいトークン"

# 4. 反映
source ~/.zshrc  # または source ~/.claude-env

# 5. 古いトークンを GitHub で削除
```

**推奨ローテーション頻度:**
- GitHub Token: 90日ごと
- Figma Token: 180日ごと

---

## トラブルシューティング

### 環境変数が認識されない

```bash
# シェルの確認
echo $SHELL
# /bin/zsh → ~/.zshrc を使用
# /bin/bash → ~/.bashrc を使用

# 環境変数の確認
env | grep GITHUB_TOKEN
env | grep MCP_

# 再読み込み
source ~/.zshrc
```

### MCP サーバーがトークンを認識しない

```bash
# Claude Code のプロセスを再起動
# ターミナルを再起動するか、新しいターミナルウィンドウで Claude Code を起動
```

### .env.local と競合する

```bash
# プロジェクトの .env.local を確認
cat .env.local

# 重複する環境変数があれば削除（プロジェクト固有のもの以外）
# .env.local の設定がグローバル環境変数より優先されるため
```

---

## セキュリティベストプラクティス

1. **トークンをコミットしない**
   ```bash
   # .gitignore に追加（通常はデフォルトで含まれる）
   echo ".env" >> .gitignore
   echo ".env.local" >> .gitignore
   echo ".claude-env" >> ~/.gitignore_global
   ```

2. **パーミッション設定**
   ```bash
   # ~/.claude-env のパーミッションを制限
   chmod 600 ~/.claude-env

   # 確認
   ls -l ~/.claude-env
   # -rw------- 1 user staff ... .claude-env
   ```

3. **トークンスコープを最小限に**
   - GitHub: 必要なスコープのみ選択
   - Figma: Read-only で十分な場合は編集権限を与えない

4. **定期的なトークン監査**
   ```bash
   # GitHub で使用中のトークンを確認
   # https://github.com/settings/tokens

   # 不要なトークンは削除
   ```

---

## 参照

- [GitHub Personal Access Tokens ドキュメント](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [Figma API ドキュメント](https://www.figma.com/developers/api)
- [direnv 公式ドキュメント](https://direnv.net/)
- [Claude Code 公式ドキュメント](https://docs.anthropic.com/claude-code)

---

## まとめ

| 設定場所 | 用途 | 例 |
|---------|------|-----|
| **~/.zshrc** | Claude Code グローバル設定 | `GITHUB_TOKEN`, `MCP_TIMEOUT` |
| **~/.claude-env** | トークン分離管理（オプション） | `GITHUB_TOKEN`, `FIGMA_ACCESS_TOKEN` |
| **プロジェクト/.env** | プロジェクト固有設定 | `DATABASE_URL`, `API_SECRET_KEY` |
| **プロジェクト/.envrc** | プロジェクト固有上書き（direnv） | `MCP_TIMEOUT=120000` |

**推奨構成:**
1. **必須**: `~/.zshrc` にグローバル環境変数設定
2. **推奨**: `~/.claude-env` でトークン分離（セキュリティ強化）
3. **プロジェクト**: `.env` にプロジェクト固有設定のみ
