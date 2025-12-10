# Claude Code テンプレート使用ガイド

このテンプレートは、JewelryStock プロジェクトで使用している`.claude`ディレクトリの雛形です。

## 📁 ディレクトリ構成

```
.claude/
├── settings.json              # Claude Code 設定ファイル（要カスタマイズ）
├── README.md                  # 設定ガイド
├── .gitignore                 # Git除外設定
├── output-styles/             # カスタム出力スタイル
│   └── senior-engineer.md     # シニアエンジニア向けスタイル
├── agents/                    # サブエージェント定義
│   ├── architect.md           # アーキテクチャ設計（Opus）
│   ├── implementer.md         # 機能実装（Sonnet）
│   ├── reviewer.md            # コードレビュー（Sonnet）
│   ├── debugger.md            # デバッグ（Sonnet）
│   ├── researcher.md          # コード検索（Haiku）
│   ├── formatter.md           # コミット生成・整形（Haiku）
│   └── prisma-expert.md       # DB設計（Sonnet）
├── skills/                    # スキル定義
│   ├── generating-commits/    # コミットメッセージ生成
│   ├── reviewing-code/        # コードレビュー支援
│   └── analyzing-prisma/      # Prismaスキーマ分析
├── plans/                     # 実装計画・タスク管理
├── sessions/                  # 会話セッション履歴（自動生成）
├── file-history/              # ファイル変更履歴（自動生成）
├── design_system/             # デザインシステム定義
└── docs/                      # プロジェクトドキュメント

.mcp.json                      # MCP サーバー設定
cipher.yml                     # Cipher MCP 専用設定
.env.example                   # 環境変数テンプレート

.serena/                       # Serena MCP 設定（NEW）
└── project.yml                # プロジェクト固有設定

docs/                          # ドキュメント
├── MCP_SETUP.md               # MCP セットアップガイド
└── ollama-guide.md            # Ollama 使い方ガイド

TEMPLATE_USAGE.md              # このファイル
```

## 🚀 使い方

### 1. テンプレートをプロジェクトにコピー

```bash
cp -r /Users/minoru/dev/case/CC/Template/.claude /path/to/your/project/
```

### 2. settings.json をカスタマイズ

`settings.json` の以下の箇所をプロジェクトに合わせて編集してください：

#### パス設定（重要）

プロジェクトローカルのパスを使用するための設定が含まれています：

```json
{
  "plansPath": ".claude/plans",
  "sessionsPath": ".claude/sessions",
  "fileHistoryPath": ".claude/file-history",
  "outputStylesPath": ".claude/output-styles",
  "skillsPath": ".claude/skills",
  "agentsPath": ".claude/agents",
  "designSystemPath": ".claude/design_system",
  "docsPath": ".claude/docs",
  "readmePath": ".claude/README.md",
  "claudePath": ".claude"
}
```

**効果:**
- グローバル設定（`~/.claude/`）ではなくプロジェクトローカルを使用
- 複数プロジェクト間で設定が分離
- チームでの共有が容易

#### 環境変数（env）

```json
{
  "env": {
    "DOCKER_PROJECT": "your-project-name",  // ← プロジェクト名に変更
    ...
  }
}
```

#### UserPromptSubmit フック

プロジェクト固有の情報を置き換えます：

```json
{
  "prompt": "## プロジェクト: [PROJECT_NAME]\n\n### 技術スタック\n- Frontend: [FRONTEND_STACK]\n- Styling: [STYLING_STACK]\n..."
}
```

**置換例：**

| プレースホルダー   | 置換内容例                                                   |
| ------------------ | ------------------------------------------------------------ |
| `[PROJECT_NAME]`   | `MyAwesomeApp（ECサイト）`                                   |
| `[FRONTEND_STACK]` | `Next.js 14 App Router, React Server Components, TypeScript` |
| `[STYLING_STACK]`  | `Tailwind CSS, shadcn/ui`                                    |
| `[BACKEND_STACK]`  | `Next.js API Routes, Server Actions`                         |
| `[ORM]`            | `Prisma`                                                     |
| `[DATABASE]`       | `PostgreSQL`                                                 |
| `[BUILD_TOOL]`     | `pnpm (Docker経由: make コマンド使用)`                       |
| `[DIR1]`           | `src/app/`                                                   |
| `[DIR2]`           | `src/components/`                                            |
| `[DIR3]`           | `src/lib/`                                                   |

#### permissions

プロジェクトで使用するコマンドに応じて、`allow`、`deny`、`ask` を調整します。

**例：**

```json
{
  "permissions": {
    "allow": [
      "Bash(make build:*)", // Makefileを使う場合
      "Bash(npm run build:*)" // npm scriptsを使う場合
    ]
  }
}
```

### 3. プロジェクト固有のエージェント・スキルをカスタマイズ（オプション）

#### エージェントの調整

`agents/` 配下のファイルを編集して、プロジェクト固有の技術スタックやワークフローを反映します。

**例：`agents/architect.md`**

```markdown
## 技術スタック

- React Native（モバイルアプリの場合）
- Firebase（Firebase を使う場合）
- ...
```

#### スキルの調整

`skills/` 配下のファイルを編集、または新しいスキルを追加します。

**新規スキル追加例：**

```bash
mkdir .claude/skills/my-custom-skill
touch .claude/skills/my-custom-skill/SKILL.md
```

### 4. 不要なエージェント・スキルを削除（オプション）

Prisma を使わないプロジェクトの場合など、不要なファイルを削除：

```bash
# Prisma関連を削除
rm .claude/agents/prisma-expert.md
rm -rf .claude/skills/analyzing-prisma
```

### 5. Claude Code を起動

```bash
cd /path/to/your/project
claude
```

設定が自動的に読み込まれます。

## 🔌 MCP（Model Context Protocol）設定

このテンプレートには、完全ローカルで動作する Cipher MCP（メモリエージェント）の設定が含まれています。

### 利用可能な MCP サーバー

| サーバー            | 説明                                           | 必要な設定                  |
| ------------------- | ---------------------------------------------- | --------------------------- |
| **serena**          | セマンティックコード解析（TypeScript対応）     | Python 3.8+                 |
| **context7-mcp**    | React/Next.js/TypeScriptドキュメント検索       | Node.js 18+                 |
| **playwright**      | E2Eテスト・ブラウザ自動化                      | Node.js 18+                 |
| **chrome-devtools** | ブラウザデバッグ・スクレイピング               | Node.js 18+                 |
| **sqlite**          | SQLiteデータベース操作                         | Python 3.8+                 |
| **figma-mcp**       | Figma デザイン連携                             | Figma Access Token          |
| **cipher**          | メモリエージェント（完全ローカル）             | Ollama モデルのダウンロード |

### Cipher MCP セットアップ（完全ローカル構成）

#### 1. 設定ファイルをコピー

```bash
# プロジェクトルートで実行
cd /path/to/your/project

# MCP設定ファイルをコピー
cp /Users/minoru/dev/case/CC/Template/.mcp.json ./
cp /Users/minoru/dev/case/CC/Template/cipher.yml ./
cp /Users/minoru/dev/case/CC/Template/.env.example ./.env
```

#### 2. `.mcp.json` のパスを更新

`.mcp.json` 内の `CIPHER_AGENT_CONFIG` を実際のプロジェクトパスに変更：

```json
{
  "mcpServers": {
    "cipher": {
      "env": {
        "CIPHER_AGENT_CONFIG": "/absolute/path/to/your-project/cipher.yml"
      }
    }
  }
}
```

**例:**

```json
"CIPHER_AGENT_CONFIG": "/Users/username/projects/my-app/cipher.yml"
```

#### 3. Ollama モデルをダウンロード

```bash
# LLMモデル（会話生成用）
ollama pull schroneko/gemma-2-2b-jpn-it

# 埋め込みモデル（セマンティック検索用）
ollama pull nomic-embed-text
```

**ダウンロード時間:** 約 3-5 分（合計 3GB）

#### 4. Ollama サービスの起動（初回のみ）

```bash
# macOSの場合: 自動起動を設定
brew services start ollama

# 手動起動の場合
ollama serve
```

#### 5. Claude Code を起動

```bash
cd /path/to/your/project
claude
```

### Cipher MCP の使用方法

セットアップ完了後、Claude Code 内で以下のように使用：

```
過去の会話で「認証機能」について話した内容を教えてください
```

Cipher MCP が完全ローカルで動作し、プライバシーを保ちながら検索結果を返します。

### MCP 設定の特徴

- ✅ **OpenAI 不要** - 完全ローカル LLM（Gemma 2 2B-JPN）を使用
- ✅ **プライバシー保護** - すべてのデータがローカルで処理
- ✅ **ランニングコストゼロ** - API 料金不要
- ✅ **マルチエージェント最適化** - 3 エージェント同時実行で約 8-9GB

### その他の MCP サーバー設定

#### Figma MCP

Figma デザインからコード生成する場合：

1. **Figma Access Token を取得**

   - https://www.figma.com/settings にアクセス
   - "Personal access tokens" で新しいトークンを作成
   - "File Read" スコープを選択

2. **`.env` に追加**
   ```bash
   FIGMA_ACCESS_TOKEN=your-figma-token-here
   ```

#### Serena MCP

Serena は、高度なコード解析と検索機能を提供する MCP サーバーです。

##### セットアップ手順

1. **`.mcp.json` の確認**

   Serena MCP はテンプレートのコピー時に既に `.mcp.json` に設定されています：

   ```json
   "serena": {
     "type": "stdio",
     "command": "uvx",
     "args": [
       "--from",
       "git+https://github.com/oraios/serena",
       "serena",
       "start-mcp-server",
       "--context",
       "ide-assistant",
       "--project",
       "${PROJECT_ROOT}",
       "--port",
       "32123"
     ],
     "description": "セマンティックコード解析（TypeScript対応）",
     "env": {
       "SERENA_MAX_MEM": "1024",
       "SERENA_MAX_WORKERS": "2"
     }
   }
   ```

   - `${PROJECT_ROOT}` は自動的にプロジェクトルートに置換されます
   - `SERENA_MAX_MEM`: メモリ上限（MB）
   - `SERENA_MAX_WORKERS`: 並列ワーカー数

2. **プロジェクトをインデックス化**

   Serena を使用する前に、プロジェクトをインデックス化する必要があります。この処理により、高速な検索と解析が可能になります：

   ```bash
   cd /path/to/your/project
   uvx --from git+https://github.com/oraios/serena serena project index
   ```

   **重要:** このコマンドを実行すると：
   - `.serena/` ディレクトリが作成されます
   - プロジェクト内のファイルが解析・インデックス化されます
   - 実行時間はプロジェクトサイズに応じて数分～10分程度かかります

   完了後、`.gitignore` に以下を追加してください：

   ```bash
   echo ".serena/" >> .gitignore
   ```

3. **プロジェクト設定ファイル（`.serena/project.yml`）**

   プロジェクト固有の設定を `.serena/project.yml` でカスタマイズできます：

   ```yaml
   # 対応言語
   languages:
     - typescript

   # .gitignoreのパターンを自動適用
   ignore_all_files_in_gitignore: true

   # 追加の除外パス（パフォーマンス向上）
   ignored_paths:
     - 'node_modules/'
     - '.next/'
     - 'dist/'
     - 'coverage/'
     - '*.test.ts'

   # 読み取り専用モード（メモリ削減）
   read_only: false
   ```

4. **Claude Code の起動**

   インデックス化完了後、Claude Code を再起動して Serena を利用開始できます：

   ```bash
   cd /path/to/your/project
   claude
   ```

##### 利用方法

Claude Code 内で以下のような高度なコード検索が可能になります：

- シンボルの定義と参照を検索
- 複数ファイルにまたがる構造的な変更
- コードの依存関係を追跡
- リファクタリング支援

##### トラブルシューティング

- **"serena not found" エラーが出る場合:** `uvx --from git+https://github.com/oraios/serena serena --help` を実行してください
- **メモリ不足の場合:** `SERENA_MAX_MEM` を調整するか、`read_only: true` を設定

#### Chrome DevTools MCP

特別な設定不要。Claude Code 起動時に自動的に利用可能になります。

### トラブルシューティング

問題が発生した場合は、以下のドキュメントを参照：

- **[docs/MCP_SETUP.md](docs/MCP_SETUP.md)** - 詳細なセットアップガイド
- **[docs/ollama-guide.md](docs/ollama-guide.md)** - Ollama のトラブルシューティング

## 📝 主要機能

### フック（Hooks）

| フック名           | タイミング       | 機能                                           |
| ------------------ | ---------------- | ---------------------------------------------- |
| `UserPromptSubmit` | プロンプト送信時 | プロジェクトコンテキストを自動注入             |
| `PostToolUse`      | ファイル編集後   | 自動コードレビュー（型安全性、セキュリティ等） |
| `PreToolUse`       | Bash 実行前      | 破壊的操作の検出・警告                         |
| `SessionStart`     | セッション開始時 | Git ステータス確認                             |
| `Notification`     | タスク完了時     | macOS 通知                                     |

### エージェント（Agents）

| エージェント    | モデル | 用途                                 |
| --------------- | ------ | ------------------------------------ |
| `architect`     | Opus   | アーキテクチャ設計、セキュリティ監査 |
| `implementer`   | Sonnet | 機能実装、テスト作成                 |
| `reviewer`      | Sonnet | コードレビュー、品質チェック         |
| `debugger`      | Sonnet | バグ調査、エラー分析                 |
| `researcher`    | Haiku  | コード検索、ファイル探索             |
| `formatter`     | Haiku  | コミット生成、コード整形             |
| `prisma-expert` | Sonnet | DB 設計、マイグレーション計画        |

### スキル（Skills）

| スキル               | 用途                                      |
| -------------------- | ----------------------------------------- |
| `generating-commits` | Conventional Commits 形式のメッセージ生成 |
| `reviewing-code`     | 読み取り専用のコードレビュー              |
| `analyzing-prisma`   | Prisma スキーマ分析とマイグレーション計画 |

## 🔧 高度なカスタマイズ

### 1. 新しい出力スタイルを追加

```bash
touch .claude/output-styles/my-style.md
```

`settings.json` で指定：

```json
{
  "outputStyle": "my-style"
}
```

### 2. 環境変数の追加

```json
{
  "env": {
    "MY_CUSTOM_VAR": "value"
  }
}
```

### 3. サンドボックス設定の調整

```json
{
  "sandbox": {
    "enabled": true,
    "excludedCommands": ["docker", "make", "git", "my-custom-tool"]
  }
}
```

## ⚠️ 注意事項

1. **settings.json の`[PLACEHOLDER]`を必ず置換**してください
2. **機密情報（API キー等）をコミットしない**よう注意
3. **sessions ディレクトリは自動生成**されます（`.gitignore`で除外済み）
4. **Docker 環境でない場合**は、`permissions`の`make`コマンドを調整

## 📚 参考リソース

### Claude Code

- [Claude Code 公式ドキュメント](https://code.claude.com/docs/ja/)
- [Settings Schema](https://json.schemastore.org/claude-code-settings.json)
- [Hooks ガイド](https://code.claude.com/docs/ja/settings#hooks)

### MCP（Model Context Protocol）

- [MCP セットアップガイド](docs/MCP_SETUP.md) - 詳細な設定手順
- [Ollama 使い方ガイド](docs/ollama-guide.md) - ローカル LLM の使い方
- [MCP 公式サイト](https://modelcontextprotocol.io/)

---

**作成元プロジェクト:** JewelryStock（宝石店在庫管理システム）
**作成日:** 2025-12-09
**最終更新:** 2025-12-10
**テンプレートバージョン:** 1.1
