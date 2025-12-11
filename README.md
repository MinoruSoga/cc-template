# Claude Code ドキュメント

Claude Code の設定・使い方をまとめたドキュメント集です。

## 目次

| ファイル | 内容 |
|---------|------|
| [01_mcp-setup.md](./01_mcp-setup.md) | MCP サーバーの設定・管理方法 |
| [02_basic-settings.md](./02_basic-settings.md) | 基本設定・設定ファイルの構造 |
| [03_commands-shortcuts.md](./03_commands-shortcuts.md) | コマンド・ショートカット一覧 |
| [04_file-structure.md](./04_file-structure.md) | ファイル・ディレクトリ構成 |
| [05_tips-tricks.md](./05_tips-tricks.md) | 便利な使い方・Tips |

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

### 現在の MCP 構成

```
MCP_DOCKER (Docker MCP Gateway)
├── context7        # ドキュメント検索
├── duckduckgo      # Web 検索
├── playwright      # ブラウザ自動化
├── paper-search    # 論文検索
├── fetch           # URL 取得
├── memory          # 記憶
├── sequentialthinking  # 推論支援
├── SQLite          # SQLite
├── github          # GitHub API (要設定)
├── git             # Git (要設定)
├── filesystem      # ファイルシステム (要設定)
└── postgres        # PostgreSQL (要設定)

serena              # コード解析・編集
```

## 公式ドキュメント

- [Claude Code 公式ドキュメント](https://docs.claude.com/en/docs/claude-code)
- [MCP 設定ガイド](https://docs.claude.com/en/docs/claude-code/mcp)
- [GitHub リポジトリ](https://github.com/anthropics/claude-code)

## 更新日

2025-11-27
