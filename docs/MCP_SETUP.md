# MCP Server セットアップガイド

このガイドでは、Claude Code プロジェクトにおけるMCP（Model Context Protocol）サーバーのセットアップ方法を説明します。

## 目次

- [クイックスタート（5分）](#クイックスタート5分)
- [MCPサーバー詳細](#mcpサーバー詳細)
  - [Serena MCP](#serena-mcp)
  - [Context7 MCP](#context7-mcp)
  - [Playwright MCP](#playwright-mcp)
  - [Chrome DevTools MCP](#chrome-devtools-mcp)
  - [SQLite MCP](#sqlite-mcp)
  - [Figma MCP](#figma-mcp)
  - [Cipher MCP](#cipher-mcp)
- [トラブルシューティング](#トラブルシューティング)
- [FAQ](#faq)

---

## クイックスタート（5分）

### 前提条件

- Claude Code CLIがインストールされていること
- Node.js 18以上（Chrome DevTools用）
- Python 3.8以上（Serena用）
- Figma Desktopアプリ（Figma MCP使用時）

### セットアップ手順

#### 1. リポジトリをクローン

```bash
git clone <repository-url>
cd your-project
```

#### 2. 基本設定の確認

プロジェクトルートに`.mcp.json`が存在することを確認：

```bash
ls -la .mcp.json
```

#### 3. ローカル設定の作成（必要に応じて）

Figma MCPを使用する場合、個人用設定ファイルを作成：

```bash
cp .mcp.local.json.example .mcp.local.json
```

**`.mcp.local.json`を編集：**

```json
{
  "mcpServers": {
    "figma-mcp": {
      "env": {
        "FIGMA_ACCESS_TOKEN": "figd_実際のトークンをここに入力"
      }
    }
  }
}
```

**Figma Personal Access Tokenの取得方法：**

1. https://www.figma.com/settings にアクセス
2. "Personal access tokens" セクションで新しいトークンを作成
3. "File Read" スコープを選択
4. トークンをコピーして`.mcp.local.json`に貼り付け

#### 4. Claude Codeを起動

```bash
claude code
```

#### 5. MCPサーバーの動作確認

Claude Code内で以下を実行：

```
利用可能なMCPツールを確認してください
```

正常に動作している場合、以下のサーバーが表示されます：
- `serena` - セマンティックコード解析
- `context7-mcp` - React/Next.js/TypeScriptドキュメント検索
- `playwright` - E2Eテスト・ブラウザ自動化
- `chrome-devtools` - ブラウザデバッグ・スクレイピング
- `sqlite` - SQLiteデータベース操作
- `figma-mcp` - Figmaデザイン連携
- `cipher` - メモリエージェント

---

## MCPサーバー詳細

### Serena MCP

**機能:** セマンティックコード解析ツール（TypeScriptファイルのインデックス化対応）

**必要な設定:**
- Python 3.8以上
- uvxコマンドが利用可能であること

**環境変数（オプション）:**
- `SERENA_MAX_MEM`: メモリ上限（デフォルト: 1024MB）
- `SERENA_MAX_WORKERS`: ワーカー数（デフォルト: 2）

**プロジェクト設定ファイル: `.serena/project.yml`**

プロジェクトごとにSerenaの動作をカスタマイズできます：

```yaml
# 対応言語
languages:
  - typescript

# エンコーディング
encoding: 'utf-8'

# .gitignoreのパターンを自動適用
ignore_all_files_in_gitignore: true

# 追加の除外パス
ignored_paths:
  - 'node_modules/'
  - '.next/'
  - 'dist/'
  - 'coverage/'
  - '*.test.ts'
  - '*.spec.ts'

# 読み取り専用モード（メモリ削減）
read_only: false
```

**主要な設定項目:**

| 設定 | 説明 | デフォルト |
|------|------|----------|
| `languages` | 解析対象言語 | `['typescript']` |
| `encoding` | ファイルエンコーディング | `utf-8` |
| `ignore_all_files_in_gitignore` | .gitignore連携 | `true` |
| `ignored_paths` | 除外パス（パフォーマンス向上） | 多数 |
| `read_only` | 読み取り専用モード（メモリ削減） | `false` |
| `excluded_tools` | 無効化するツール | `[]` |

**利用可能なツール:**

| ツール名 | 説明 | 使用例 |
|---------|------|--------|
| `find_symbol` | コード内のシンボル検索 | クラス、関数、変数の検索 |
| `get_symbols_overview` | ファイルのシンボル概要取得 | コード構造の把握 |
| `search_for_pattern` | パターン検索 | 正規表現によるコード検索 |
| `replace_symbol_body` | シンボル本体の置換 | リファクタリング |
| `find_referencing_symbols` | 参照シンボルの検索 | 依存関係の追跡 |
| `insert_before_symbol` | シンボル前に挿入 | コード追加 |
| `insert_after_symbol` | シンボル後に挿入 | コード追加 |
| `rename_symbol` | シンボル名変更 | リファクタリング |

**使用方法:**

```
RenewalAppHeader.tsxのシンボル概要を取得してください
```

**注意事項:**
- 初回実行時、`serena`が自動的にインストールされます
- インターネット接続が必要です
- `.serena/project.yml`でプロジェクト固有の設定が可能

---

### Context7 MCP

**機能:** React/Next.js/TypeScript等のライブラリドキュメントをリアルタイム検索

**必要な設定:**
- Node.js 18以上
- npxコマンドが利用可能であること

**環境変数（オプション）:**
- `NODE_OPTIONS`: Node.jsオプション（デフォルト: `--max-old-space-size=512`）

**利用可能なツール:**

| ツール名 | 説明 | 使用例 |
|---------|------|--------|
| `resolve-library-id` | ライブラリIDの解決 | ライブラリ名からContext7 IDを取得 |
| `get-library-docs` | ライブラリドキュメントの取得 | 最新のAPIリファレンスを取得 |

**使用方法:**

```
Next.js 14のApp Routerの使い方を教えてください
```

**注意事項:**
- 最新のドキュメントを取得するためインターネット接続が必要
- キャッシュされたドキュメントで高速応答

---

### Playwright MCP

**機能:** E2Eテストおよびブラウザ自動化

**必要な設定:**
- Node.js 18以上
- npxコマンドが利用可能であること

**環境変数:** 不要

**利用可能なツール:**

| ツール名 | 説明 | 使用例 |
|---------|------|--------|
| `browser_navigate` | ページ遷移 | テストページへの移動 |
| `browser_click` | 要素クリック | ボタン操作、リンククリック |
| `browser_fill_form` | フォーム入力 | 複数フィールドの一括入力 |
| `browser_snapshot` | アクセシビリティスナップショット | ページ構造の取得 |
| `browser_take_screenshot` | スクリーンショット取得 | UI確認、テスト証跡 |
| `browser_evaluate` | JavaScript実行 | カスタムスクリプト実行 |

**使用方法:**

```
http://localhost:3000でログインフォームをテストしてください
```

**注意事項:**
- 初回実行時、`@playwright/mcp@latest`が自動的にダウンロードされます
- Chromiumブラウザが自動インストールされます

---

### Chrome DevTools MCP

**機能:** Chrome DevToolsを使用したブラウザデバッグ・スクレイピング

**必要な設定:**
- Node.js 18以上
- npxコマンドが利用可能であること

**環境変数:** 不要

**利用可能なツール:**

| ツール名 | 説明 | 使用例 |
|---------|------|--------|
| `navigate_page` | ページ遷移 | URLへの移動 |
| `click` | 要素クリック | フォーム操作、ボタンクリック |
| `take_snapshot` | ページスナップショット | アクセシビリティツリー取得 |
| `take_screenshot` | スクリーンショット取得 | UI確認、バグレポート |
| `evaluate_script` | JavaScript実行 | ページ内スクリプト実行 |
| `list_network_requests` | ネットワークリクエスト一覧 | API通信の確認 |
| `list_console_messages` | コンソールメッセージ一覧 | エラーログの確認 |

**使用方法:**

```
Chromeでhttp://localhost:3000を開いて、コンソールエラーを確認してください
```

**注意事項:**
- 初回実行時、`chrome-devtools-mcp@latest`が自動的にダウンロードされます
- インターネット接続が必要です

---

### SQLite MCP

**機能:** SQLiteデータベースの操作・クエリ実行

**必要な設定:**
- Python 3.8以上
- uvxコマンドが利用可能であること

**環境変数:** 不要（`${PROJECT_ROOT}/database.db`を使用）

**利用可能なツール:**

| ツール名 | 説明 | 使用例 |
|---------|------|--------|
| `read_query` | SELECTクエリ実行 | データの読み取り |
| `write_query` | INSERT/UPDATE/DELETEクエリ実行 | データの変更 |
| `create_table` | テーブル作成 | スキーマ定義 |
| `list_tables` | テーブル一覧取得 | DB構造の確認 |
| `describe_table` | テーブルスキーマ取得 | カラム情報の確認 |

**使用方法:**

```
database.dbのテーブル一覧を表示してください
```

**注意事項:**
- データベースファイルはプロジェクトルートの`database.db`に保存されます
- 存在しない場合は自動作成されます

---

### Figma MCP

**機能:** Figma Desktopアプリと連携して、デザイン情報を取得

**必要な設定:**
- Figma Desktopアプリのインストール
- Figma Personal Access Token（`.mcp.local.json`に設定）

**利用可能なツール:**

| ツール名 | 説明 | 使用例 |
|---------|------|--------|
| `get_screenshot` | デザインのスクリーンショットを取得 | コンポーネントの視覚的確認 |
| `get_design_context` | デザインコンテキスト情報を取得 | コード生成の精度向上 |
| `get_metadata` | メタデータ（レイヤー構造）を取得 | デザイン構造の理解 |
| `get_variable_defs` | Figma変数定義を取得 | デザイントークンの抽出 |

**使用方法:**

1. Figma Desktopアプリを起動
2. 対象のデザインファイルを開く
   - ファイル名: **案内所**
   - URL: https://www.figma.com/design/MH84ymDifyB02x92eBzn80/案内所
3. Claude Codeでコマンドを実行

```
Figmaのノード19:178（HomeCategorySelect）からReactコンポーネントを作成してください
```

詳細は [`docs/figma-mcp-usage-guide.md`](./figma-mcp-usage-guide.md) を参照。

---

### Cipher MCP

**機能:** メモリエージェント - 知識蓄積・セッション管理・過去の会話検索

**必要な設定:**
- Node.js 18以上
- Cipherコマンドがインストール済み
- Ollama（埋め込みモデル用）
- オプション: OpenAI API（ハイブリッド構成の場合）

**構成オプション:**

Cipher MCPは2つの構成から選択可能：

| 構成 | LLM | 埋め込み | コスト | プライバシー | 推奨環境 |
|------|-----|---------|--------|------------|----------|
| **完全ローカル** 🏆 | Ollama | Ollama | 無料 | 完全ローカル | マルチエージェント |
| **ハイブリッド** | OpenAI | Ollama | 有料 | 部分クラウド | 高品質会話重視 |

#### 完全ローカル構成（推奨）

**推奨モデル:** Gemma 2 2B-JPN

**メリット:**
- ✅ OpenAI APIキー不要
- ✅ 完全プライバシー保護
- ✅ ランニングコストゼロ
- ✅ マルチエージェント環境に最適（3エージェント同時実行で約8-9GB）

**セットアップ:**

1. モデルのダウンロード
   ```bash
   ollama pull schroneko/gemma-2-2b-jpn-it
   ollama pull nomic-embed-text
   ```

2. `cipher.yml` を設定
   ```yaml
   llm:
     provider: ollama
     model: schroneko/gemma-2-2b-jpn-it
     baseUrl: http://localhost:11434
     maxIterations: 50
     temperature: 0.3  # ハルシネーション対策

   embedding:
     type: ollama
     model: nomic-embed-text
     baseUrl: $OLLAMA_BASE_URL
     dimensions: 768
   ```

3. `.env` の設定
   ```bash
   # OpenAI APIキー不要
   OLLAMA_BASE_URL=http://localhost:11434
   VECTOR_STORE_TYPE=in-memory
   CIPHER_LOG_LEVEL=debug
   ```

4. `.mcp.json` の設定（OPENAI_API_KEYを削除）
   ```json
   {
     "mcpServers": {
       "cipher": {
         "type": "stdio",
         "command": "cipher",
         "args": ["--mode", "mcp"],
         "disabled": false,
         "description": "メモリエージェント（完全ローカル）- 知識蓄積・セッション管理・過去の会話検索",
         "env": {
           "CIPHER_AGENT_CONFIG": "/Users/minoru/Dev/Case/InfoCenterSystem/cipher.yml",
           "OLLAMA_BASE_URL": "$OLLAMA_BASE_URL",
           "VECTOR_STORE_TYPE": "$VECTOR_STORE_TYPE",
           "CIPHER_LOG_LEVEL": "$CIPHER_LOG_LEVEL"
         }
       }
     }
   }
   ```

詳細は **[ollama-guide.md#完全ローカル構成](ollama-guide.md#完全ローカル構成openai不要)** を参照。

#### ハイブリッド構成

**使用モデル:** OpenAI gpt-4o-mini + Ollama nomic-embed-text

高品質な会話生成が必要な場合はこちらを選択。

詳細は **[ollama-guide.md#ハイブリッド構成](ollama-guide.md#ハイブリッド構成openai--ollama)** を参照。

---

**利用可能なツール:**

| ツール名 | 説明 | 使用例 |
|---------|------|--------|
| `create_memory` | 新しい記憶を作成 | 重要な情報の保存 |
| `search_memory` | 過去の記憶を検索 | 類似の会話・知識の検索 |
| `list_sessions` | セッション一覧を取得 | 過去のセッション確認 |
| `switch_session` | セッションを切り替え | 別プロジェクトへの切り替え |

**使用方法:**

```
過去の会話で「Figma連携」について話した内容を教えてください
```

Cipherが過去のセッションを検索し、関連する知識を提供します。

**セッション管理例:**

```
新しいセッション"renewal-ui-development"を作成してください
```

プロジェクトごとにセッションを分けて知識を管理できます。

**注意事項:**
- 初回実行時、Cipherが自動的にローカルストレージを初期化します
- 知識はプロジェクトローカルに保存されます（チーム共有されません）
- セッションIDは`.mcp.local.json`で個別に管理可能

**カスタム設定（オプション）:**

`.mcp.local.json`でセッションIDを指定:

```json
{
  "mcpServers": {
    "cipher": {
      "env": {
        "CIPHER_SESSION_ID": "infocenter-system"
      }
    }
  }
}
```

**Ollamaとの統合:**

Cipher MCPはローカル埋め込みモデル（Ollama）と統合して、セマンティック検索を強化できます。完全ローカル構成またはハイブリッド構成の詳細は **[ollama-guide.md](ollama-guide.md)** を参照してください。

---

## トラブルシューティング

### Q1: MCPサーバーが読み込まれない

**症状:**
Claude Code起動時にMCPサーバーが表示されない

**解決策:**

1. `.mcp.json`の構文をチェック：
   ```bash
   jq empty .mcp.json
   ```

2. Claude Codeを再起動：
   ```bash
   # Claude Codeを終了してから再起動
   claude code
   ```

3. ログを確認：
   ```bash
   # Claude Codeのログ確認方法（環境により異なる）
   tail -f ~/.claude/logs/mcp.log
   ```

---

### Q2: Figma MCPに接続できない

**症状:**
`figma-mcp`ツールが利用できない、または403エラー

**解決策:**

1. **Figma Desktopアプリの起動を確認**
   - Figma Desktopが起動しているか確認
   - 対象のデザインファイルが開かれているか確認

2. **Personal Access Tokenの確認**
   - `.mcp.local.json`にトークンが正しく設定されているか確認
   - トークンに"File Read"スコープが付与されているか確認

3. **ローカルサーバーの確認**
   ```bash
   curl http://127.0.0.1:3845/sse
   ```
   応答がない場合、Figma Desktopを再起動してください。

---

### Q3: Chrome DevTools MCPでエラーが発生

**症状:**
`browser_navigate`などのツールが動作しない

**解決策:**

1. **npxコマンドの確認**
   ```bash
   which npx
   npx --version
   ```

2. **Node.jsのバージョン確認**
   ```bash
   node --version  # 18以上であること
   ```

3. **手動でパッケージをインストール**
   ```bash
   npx chrome-devtools-mcp@latest --help
   ```

---

### Q4: Serena MCPが起動しない

**症状:**
`find_symbol`などのツールが利用できない

**解決策:**

1. **uvxコマンドの確認**
   ```bash
   which uvx
   uvx --version
   ```

2. **Pythonのバージョン確認**
   ```bash
   python3 --version  # 3.8以上であること
   ```

3. **手動でSerenaをインストール**
   ```bash
   uvx serena --help
   ```

---

### Q5: `.mcp.local.json`がGitにコミットされてしまう

**症状:**
`git status`で`.mcp.local.json`が表示される

**解決策:**

1. **`.gitignore`の確認**
   ```bash
   cat .gitignore | grep mcp
   ```

2. **Git cacheをクリア**
   ```bash
   git rm --cached .mcp.local.json
   git commit -m "Remove .mcp.local.json from tracking"
   ```

3. **`.gitignore`が正しく機能しているか確認**
   ```bash
   git check-ignore -v .mcp.local.json
   ```

---

## FAQ

### Q: グローバル設定（`~/.claude.json`）との関係は?

**A:** プロジェクト単位の`.mcp.json`が優先されます。

**設定の優先順位:**
1. `.mcp.local.json` (個人用設定、最優先)
2. `.mcp.json` (プロジェクト共有設定)
3. `~/.claude.json` (グローバル設定、フォールバック)

---

### Q: チームメンバーに設定を共有するには?

**A:** 以下のファイルをGit管理します：

**共有するファイル:**
- ✅ `.mcp.json` (MCPサーバー定義)
- ✅ `.mcp.env.example` (環境変数ガイド)
- ✅ `.mcp.local.json.example` (セットアップテンプレート)
- ✅ `docs/MCP_SETUP.md` (このドキュメント)

**共有しないファイル:**
- ❌ `.mcp.local.json` (個人用設定、機密情報)
- ❌ `.mcp.env` (実際の環境変数)

---

### Q: 新しいMCPサーバーを追加するには?

**A:** `.mcp.json`を編集してサーバー定義を追加します。

**例: SQLite MCPサーバーの追加**

```json
{
  "mcpServers": {
    "figma-mcp": { ... },
    "chrome-devtools": { ... },
    "serena": { ... },
    "sqlite": {
      "type": "stdio",
      "command": "uvx",
      "args": ["mcp-server-sqlite", "--db-path", "./database.db"],
      "description": "SQLiteデータベース操作"
    }
  }
}
```

Claude Codeを再起動すると、新しいサーバーが利用可能になります。

---

### Q: MCPサーバーを一時的に無効化するには?

**A:** `disabled: true`を追加します。

```json
{
  "mcpServers": {
    "cipher": {
      "type": "stdio",
      "command": "cipher",
      "args": ["--mode", "mcp"],
      "disabled": true  // 追加
    }
  }
}
```

---

### Q: 環境ごとに異なる設定を使用するには?

**A:** `.mcp.local.json`で個人用設定をオーバーライドします。

**例: 開発環境と本番環境で異なるFigmaトークンを使用**

**開発者A（`.mcp.local.json`）:**
```json
{
  "mcpServers": {
    "figma-mcp": {
      "env": {
        "FIGMA_ACCESS_TOKEN": "figd_dev_token_A"
      }
    }
  }
}
```

**開発者B（`.mcp.local.json`）:**
```json
{
  "mcpServers": {
    "figma-mcp": {
      "env": {
        "FIGMA_ACCESS_TOKEN": "figd_dev_token_B"
      }
    }
  }
}
```

---

## セキュリティベストプラクティス

### DO（推奨）

- ✅ `.mcp.local.json`に機密情報を保存
- ✅ パスワードマネージャーでトークンを管理
- ✅ 定期的なトークンローテーション（3ヶ月ごと）
- ✅ `.gitignore`で機密ファイルを除外

### DON'T（禁止）

- ❌ `.mcp.json`にAPIキーやトークンを含める
- ❌ Git履歴に機密情報を含める
- ❌ Slack・メールで平文でトークンを共有
- ❌ スクリーンショットにトークンを含める

---

## 関連ドキュメント

- [Figma MCP使用ガイド](./figma-mcp-usage-guide.md)
- [Figmaコンポーネントマッピング](./figma-component-mapping.md)
- [Claude Code公式ドキュメント](https://code.claude.com/docs)
- [Model Context Protocol (MCP)](https://modelcontextprotocol.io/)

---

## サポート

問題が解決しない場合は、以下の方法でサポートを受けてください：

1. **Issue作成**: プロジェクトのGitHub Issueに報告
2. **チームに相談**: Slackの`#infocenter-dev`チャンネル
3. **ドキュメント確認**: 上記の関連ドキュメントを参照

---

**最終更新日:** 2025-12-10
