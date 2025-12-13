# Claude Code 設定管理ハブ

Claude Code の設定テンプレート・ドキュメント・ベストプラクティスを管理するリポジトリです。

---

## 📁 フォルダ構成

```
/Users/minoru/Dev/cc/
├── .claude/                    # ccプロジェクト設定（管理ハブ用）
│   ├── settings.json          # ワイルドカードで作業プロジェクト許可
│   ├── settings.local.json    # ローカル設定
│   └── commands/
│       ├── optimize-claude-config.md  # 設定適用コマンド
│       └── README.md
├── .mcp.json                   # ccプロジェクト用MCP
│
├── Template/                   # ★完全版テンプレート
│   ├── .claude/               # 設定ディレクトリ
│   │   ├── CLAUDE.md          # プロジェクト指示書
│   │   ├── settings.json      # 設定テンプレート
│   │   ├── agents/            # サブエージェント定義
│   │   ├── skills/            # Agent Skills
│   │   ├── commands/          # カスタムコマンド
│   │   ├── hooks/             # フック
│   │   ├── docs/              # ベストプラクティス
│   │   └── output-styles/     # 出力スタイル
│   ├── .mcp.json              # MCP設定テンプレート
│   └── README.md              # テンプレート使用ガイド
│
├── cc-blog/                    # 参考: Anthropic公式ブログ翻訳
│   ├── *.md                   # エージェント設計、ツール設計等
│   ├── practice/              # 実践ガイド
│   └── Sample/                # サンプル設定
│
├── cc-news/                    # 参考: Claude Code最新情報
│   ├── *.md                   # セキュリティ、MCP、SDK等
│   ├── practice/              # 実践ガイド
│   └── Sample/                # サンプル設定
│
├── 01_mcp-setup.md            # MCPセットアップガイド
├── 02_basic-settings.md       # 基本設定ガイド
├── 03_commands-shortcuts.md   # コマンド・ショートカット
├── 04_file-structure.md       # ファイル構成
├── 05_tips-tricks.md          # Tips
│
└── README.md                   # このファイル
```

---

## 🚀 設定適用フロー

### 作業プロジェクトへのClaude設定適用

```
[ccフォルダでClaude Code起動]
        ↓
    cd /Users/minoru/Dev/cc
    claude
        ↓
[コマンドで設定適用]
        ↓
    /optimize-claude-config /path/to/project
        ↓
[プロジェクト分析]
  - 技術スタック検出
  - 既存設定確認
        ↓
[テンプレート参照: cc/Template/]
        ↓
[設定ファイル生成]
  - CLAUDE.md
  - .claude/settings.json
  - .claude/hooks/
  - .claude/commands/
  - .mcp.json
        ↓
[完了]
```

### 手動での設定コピー

```bash
# テンプレートをプロジェクトにコピー
cp -r /Users/minoru/Dev/cc/Template/.claude /path/to/your/project/
cp /Users/minoru/Dev/cc/Template/.mcp.json /path/to/your/project/
cp /Users/minoru/Dev/cc/Template/CLAUDE.md /path/to/your/project/

# プロジェクトに合わせてカスタマイズ
```

---

## 📖 ドキュメント

### 基本ガイド

| ファイル | 内容 |
|---------|------|
| [01_mcp-setup.md](./01_mcp-setup.md) | MCP サーバーの設定・管理方法 |
| [02_basic-settings.md](./02_basic-settings.md) | 基本設定・設定ファイルの構造 |
| [03_commands-shortcuts.md](./03_commands-shortcuts.md) | コマンド・ショートカット一覧 |
| [04_file-structure.md](./04_file-structure.md) | ファイル・ディレクトリ構成 |
| [05_tips-tricks.md](./05_tips-tricks.md) | 便利な使い方・Tips |

### 参考ドキュメント

| フォルダ | 内容 |
|---------|------|
| [cc-blog/](./cc-blog/) | Anthropic公式ブログ翻訳（エージェント設計パターン、ツール設計、マルチエージェント等） |
| [cc-news/](./cc-news/) | Claude Code最新情報（セキュリティ、MCP連携、SDK、長時間タスク管理等） |
| [Template/.claude/docs/](./Template/.claude/docs/) | 詳細なベストプラクティス（17ファイル） |

---

## 🤖 利用可能なコマンド

| コマンド | 説明 |
|---------|------|
| `/optimize-claude-config` | 作業プロジェクトにClaude設定を適用 |

---

## 🔑 権限設定

`cc/.claude/settings.json` でワイルドカード許可を設定:

```json
{
  "permissions": {
    "allow": [
      "Read(/Users/minoru/Dev/Case/**)",
      "Write(/Users/minoru/Dev/Case/**/.claude/**)",
      "Write(/Users/minoru/Dev/Case/**/CLAUDE.md)",
      "Write(/Users/minoru/Dev/Case/**/.mcp.json)"
    ]
  }
}
```

これにより、`/Users/minoru/Dev/Case/` 配下の全プロジェクトに対して設定適用が可能です。

---

## クイックリファレンス

### よく使うコマンド

| コマンド | 説明 |
|---------|------|
| `/help` | ヘルプ |
| `/mcp` | MCP 管理 |
| `/model` | モデル変更 |
| `/compact` | 会話圧縮 |
| `/clear` | 会話クリア |
| `/resume` | 会話再開 |

### よく使うショートカット

| キー | 説明 |
|-----|------|
| `Tab` | オートコンプリート / Thinking 切替 |
| `Shift + Tab` | Auto-accept 切替 |
| `Esc` | 中断 |
| `Ctrl + R` | 履歴検索 |

---

## 🔗 公式ドキュメント

- [Claude Code 公式ドキュメント](https://docs.anthropic.com/claude-code)
- [MCP 設定ガイド](https://docs.anthropic.com/claude-code/mcp)
- [GitHub リポジトリ](https://github.com/anthropics/claude-code)

---

**更新日:** 2025-12-13
