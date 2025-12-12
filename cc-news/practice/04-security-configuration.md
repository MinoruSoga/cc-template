# セキュリティ設定ガイド

> 基づく記事: Beyond Permission Prompts: Making Claude Code More Secure
> 参照: Claude Code 公式ドキュメント

## 概要

Claude Codeのセキュリティ機能を適切に設定することで、許可プロンプトを**84%削減**しながら、プロンプトインジェクション攻撃から保護できます。

## 2つの必須セキュリティ境界

### 効果的なサンドボックスには両方が必要

```
┌─────────────────────────────────────────────────────┐
│                   サンドボックス                      │
│  ┌─────────────────┐    ┌─────────────────┐        │
│  │ ファイルシステム │    │   ネットワーク   │        │
│  │     分離        │    │      分離       │        │
│  └─────────────────┘    └─────────────────┘        │
│         ↓                      ↓                   │
│  プロジェクトフォルダ      承認済みサーバー           │
│  のみアクセス可能          のみ接続可能              │
└─────────────────────────────────────────────────────┘
```

### 片方だけでは不十分な理由

| シナリオ | ファイルのみ | ネットワークのみ | 両方 |
|----------|-------------|-----------------|------|
| データ流出 | ❌ 可能 | ✅ 防止 | ✅ 防止 |
| ファイル改ざん | ✅ 防止 | ❌ 可能 | ✅ 防止 |
| マルウェアDL | ❌ 可能 | ✅ 防止 | ✅ 防止 |

## 設定ファイルの場所

```bash
# ユーザーレベル
~/.claude/settings.json

# プロジェクトレベル（チーム共有）
Template/.claude/settings.json

# プロジェクトレベル（個人用、自動gitignore）
Template/.claude/settings.local.json
```

## Sandbox 設定（公式仕様）

### 基本設定

`Template/.claude/settings.json`:
```json
{
  "sandbox": {
    "enabled": true,
    "autoAllowBashIfSandboxed": true
  }
}
```

### 詳細設定

```json
{
  "sandbox": {
    "enabled": true,
    "autoAllowBashIfSandboxed": true,
    "excludedCommands": ["docker", "git"],
    "allowUnsandboxedCommands": false,
    "network": {
      "allowUnixSockets": ["~/.ssh/agent-socket"],
      "allowLocalBinding": true,
      "httpProxyPort": 8080,
      "socksProxyPort": 8081
    }
  }
}
```

### Sandbox オプション説明

| オプション | 説明 | デフォルト |
|-----------|------|-----------|
| enabled | サンドボックスを有効化 | false |
| autoAllowBashIfSandboxed | サンドボックス内でBashを自動許可 | false |
| excludedCommands | サンドボックス外で実行するコマンド | [] |
| allowUnsandboxedCommands | サンドボックス外コマンドを許可 | false |

### 対応OS

- **macOS**: seatbelt を使用
- **Linux**: bubblewrap を使用
- **Windows**: 未対応

## Permissions 設定（公式仕様）

### 基本構造

```json
{
  "permissions": {
    "allow": [
      "パターン1",
      "パターン2"
    ],
    "deny": [
      "パターン3",
      "パターン4"
    ]
  }
}
```

### パターンの書き方

```json
{
  "permissions": {
    "allow": [
      "Bash(npm test:*)",
      "Bash(git status:*)",
      "Read(src/**)",
      "Write(src/**)"
    ],
    "deny": [
      "Read(.envrc)",
      "Read(~/.aws/**)",
      "Read(~/.ssh/**)",
      "Bash(rm -rf:*)",
      "Bash(curl|bash:*)"
    ]
  }
}
```

### パターン形式

```
ツール名(引数パターン)
```

**例:**
- `Bash(npm test:*)` - `npm test` で始まるコマンドを許可
- `Read(src/**)` - src ディレクトリ配下の読み取りを許可
- `Write(*.md)` - Markdownファイルへの書き込みを許可

## プロジェクト固有の設定例

### Webアプリケーション

`Template/.claude/settings.json`:
```json
{
  "sandbox": {
    "enabled": true,
    "autoAllowBashIfSandboxed": true,
    "excludedCommands": ["docker", "docker-compose"]
  },
  "permissions": {
    "allow": [
      "Bash(npm:*)",
      "Bash(yarn:*)",
      "Bash(git status:*)",
      "Bash(git diff:*)",
      "Read(src/**)",
      "Read(public/**)",
      "Read(tests/**)",
      "Write(src/**)",
      "Write(tests/**)"
    ],
    "deny": [
      "Read(.env*)",
      "Read(secrets/**)",
      "Bash(rm -rf:*)"
    ]
  }
}
```

### データ分析プロジェクト

```json
{
  "sandbox": {
    "enabled": true,
    "autoAllowBashIfSandboxed": true
  },
  "permissions": {
    "allow": [
      "Bash(python:*)",
      "Bash(pip:*)",
      "Read(notebooks/**)",
      "Read(data/public/**)",
      "Write(outputs/**)"
    ],
    "deny": [
      "Read(data/sensitive/**)",
      "Read(credentials/**)"
    ]
  }
}
```

## CLI での設定

### Sandbox の有効化

```bash
# インタラクティブに設定
/sandbox

# 出力例:
# Sandbox Status: Enabled
# Filesystem: /Users/dev/project/ (read-write)
# Network: Restricted
```

### 権限の確認

```bash
# 現在の権限設定を確認
/permissions
```

## 資格情報の保護

### プロキシサービスの活用

```
┌──────────┐    ┌──────────┐    ┌──────────┐
│  Claude  │ →  │  Proxy   │ →  │  GitHub  │
│  Code    │    │ Service  │    │          │
└──────────┘    └──────────┘    └──────────┘
                     │
              認証トークンを
              ここで付加
```

### 環境変数の管理

```bash
# .env（.gitignoreに追加必須）
GITHUB_TOKEN=ghp_xxxxxxxxxxxx
DATABASE_URL=postgres://user:pass@host/db
API_SECRET=secret_key_here
```

```json
// settings.json で環境変数を参照
{
  "env": {
    "GITHUB_TOKEN": "${env:GITHUB_TOKEN}"
  }
}
```

## セキュリティチェックリスト

### 初期設定時

- [ ] サンドボックスが有効になっている
- [ ] permissions の deny リストに機密ファイルを追加
- [ ] 環境変数が .env ファイルで管理されている
- [ ] .env が .gitignore に追加されている

### 定期確認

- [ ] allow リストに不要な項目がないか
- [ ] 新しい機密ファイルが deny リストに含まれているか
- [ ] excludedCommands が最小限か

## プロンプトインジェクション対策

### サンドボックスによる防御

```
悪意のあるプロンプト
    ↓
サンドボックス内で実行
    ↓
- システムファイルへのアクセス → ブロック
- 外部サーバーへの通信 → ブロック
- 機密データの読み取り → ブロック
    ↓
被害がサンドボックス内に限定
```

### Hooks による追加防御

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/validate-command.sh"
          }
        ]
      }
    ]
  }
}
```

**終了コードについて**: Hookスクリプトは終了コード `2` でツール実行をブロックできます。詳細は[Hooks設定ガイド](./06-hooks-configuration.md)を参照。

## Web版 Claude Code

### クラウドサンドボックスの利点

```
┌──────────────────────────────────────────┐
│           クラウドサンドボックス            │
│  ┌────────────────────────────────────┐  │
│  │         Claude Code 実行環境        │  │
│  │                                    │  │
│  │  - 分離された環境                   │  │
│  │  - 資格情報はサンドボックス外        │  │
│  │  - Git操作はプロキシ経由            │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

### 利用方法

[claude.ai/code](https://claude.ai/code) にアクセス

## 設定テンプレート

### 開発環境（バランス型）

```json
{
  "sandbox": {
    "enabled": true,
    "autoAllowBashIfSandboxed": true,
    "excludedCommands": ["docker"]
  },
  "permissions": {
    "allow": [
      "Bash(npm:*)",
      "Bash(git status:*)",
      "Bash(git diff:*)",
      "Read(**)",
      "Write(src/**)",
      "Write(tests/**)"
    ],
    "deny": [
      "Read(~/.ssh/**)",
      "Read(~/.aws/**)",
      "Read(~/.gnupg/**)",
      "Read(.env*)",
      "Bash(rm -rf:*)",
      "Bash(*|bash:*)",
      "Bash(*|sh:*)"
    ]
  }
}
```

### 高セキュリティ環境

```json
{
  "sandbox": {
    "enabled": true,
    "autoAllowBashIfSandboxed": false,
    "allowUnsandboxedCommands": false
  },
  "permissions": {
    "allow": [
      "Read(src/**)"
    ],
    "deny": [
      "Read(.env*)",
      "Read(**/*.key)",
      "Read(**/*.pem)",
      "Read(**/secrets/**)",
      "Read(~/**)",
      "Write(**)",
      "Bash(*)"
    ]
  }
}
```

## トラブルシューティング

### 許可エラーが多すぎる

```json
// allow リストを適切に設定
{
  "permissions": {
    "allow": [
      "Read(**)",
      "Bash(npm:*)"
    ]
  }
}
```

### サンドボックスが動作しない

```bash
# OS固有の依存関係を確認
# Linux: bubblewrap
which bwrap

# macOS: seatbeltは標準搭載
```

### 特定のコマンドがブロックされる

```json
// excludedCommands に追加
{
  "sandbox": {
    "excludedCommands": ["docker", "required-command"]
  }
}
```

## ディレクトリ構成

```
Template/
├── .claude/
│   ├── settings.json       # セキュリティ設定（チーム共有）
│   ├── settings.local.json # ローカル設定（gitignore）
│   └── hooks/
│       └── validate-command.sh
├── .env                    # 機密情報（gitignore）
└── ...
```

## チェックリスト

- [ ] sandbox.enabled が true
- [ ] permissions.deny に機密ファイルパターンを追加
- [ ] .env が .gitignore に含まれている
- [ ] excludedCommands が最小限
- [ ] /sandbox で設定を確認済み
- [ ] チームメンバーに設定を共有

## 次のステップ

セキュリティ設定が完了したら：

1. [MCP設定](./03-mcp-server-configuration.md)でMCPサーバーのセキュリティを確認
2. [CLAUDE.md](./01-claude-md-configuration.md)にセキュリティポリシーを記載
3. 定期的にセキュリティ設定をレビュー
