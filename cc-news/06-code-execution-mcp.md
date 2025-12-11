# コード実行とMCP（Model Context Protocol）

> 出典: [Code Execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp), [Desktop Extensions](https://www.anthropic.com/engineering/desktop-extensions)

## 概要

MCPの採用が拡大するにつれ、AIエージェントがコード実行を通じて外部ツールとより効率的にやり取りできるようになります。すべてのツール定義を事前にロードするのではなく、オンデマンドでツールを呼び出すコードを書くことで、トークン消費を大幅に削減できます。

---

# Part 1: MCPによるコード実行

## 核心的な問題

MCPの採用が拡大すると、2つの主要な非効率性が現れます：

### 1. ツール定義のオーバーヘッド

- 数百のツール説明をコンテキストにロード
- ユーザーリクエストを処理する前にトークンを浪費

### 2. 中間結果の肥大化

- ツール出力が複数回モデルを通過
- コンテキスト内でデータが重複

**例**: 2時間の会議トランスクリプトがツール呼び出し間でコピーされると、追加で50,000トークンを消費する可能性があります。

## ソリューション：コードベースのツールアクセス

エージェントは直接ツール呼び出しではなく、ファイルシステム構造で整理されたコードAPIを通じてMCPサーバーとやり取りします：

```
servers/
├── google-drive/
├── salesforce/
├── slack/
└── ...
```

### トークン削減効果

**98.7%削減**（150,000トークン → 2,000トークン）

## 主要なメリット

### 1. プログレッシブツール発見

モデルが自然にファイルシステムをナビゲートし、必要な定義のみをオンデマンドでロード：

```python
# 全ツールを事前ロードする代わりに
tools = discover_tools("servers/slack/")
# 必要なツールのみ使用
slack_search = tools.get("search")
```

### 2. 効率的なデータフィルタリング

大規模データセットを実行環境内で処理し、サマリーのみをモデルに返す：

```python
# コンテキストに全データを入れる代わりに
summary = process_large_dataset(data)
return summary  # 簡潔な結果のみ返す
```

### 3. 制御フローの利点

ネイティブコードのループと条件分岐がチェーンされたツール呼び出しを置き換え、レイテンシを改善：

```python
# 複数のツール呼び出しの代わりに
for item in items:
    if item.needs_processing:
        result = process(item)
        results.append(result)
```

### 4. プライバシー保護

- 機密データは実行環境内に留まる
- 中間結果はモデルコンテキストに入らない

### 5. 状態の永続化

エージェントが中間作業をファイルとして保存し、再開とスキル開発を可能にする：

```python
# 状態を保存
save_state("progress.json", current_state)

# 後で再開
state = load_state("progress.json")
continue_from(state)
```

## 重要なトレードオフ

コード実行には以下が必要：
- **セキュアなサンドボックス**
- **リソース制限**
- **監視インフラストラクチャ**

直接ツール呼び出しが回避する運用上の複雑さが追加されます。

---

# Part 2: Desktop Extensions

## Desktop Extensionsとは

Desktop Extensions（`.mcpb`ファイル）は、Claude Desktop用のMCPサーバーのインストールを簡素化するバンドルパッケージです。サーバー全体と依存関係を単一のインストール可能なファイルにパッケージ化します。

## 解決される問題

**従来のMCPインストールプロセス**：
- Node.jsやPythonなどの開発ツールが必要
- JSONファイル編集による手動設定
- 依存関係管理と競合解決
- サーバー発見のためのGitHub検索
- 更新のための手動再インストール

**Desktop Extensions後**：
1. `.mcpb`ファイルをダウンロード
2. ダブルクリック
3. インストールをクリック

## アーキテクチャ

Desktop ExtensionはZIPアーカイブで、以下を含みます：

```
extension.mcpb/
├── manifest.json        # 必須のメタデータと設定
├── server/              # MCPサーバー実装
├── dependencies/        # バンドルされたパッケージ
└── icon.png            # オプションのアイコン
```

## Manifest構造

### 最小限の構成

```json
{
  "mcpb_version": "1.0",
  "name": "my-extension",
  "version": "1.0.0",
  "author": {
    "name": "Developer Name"
  },
  "server": {
    "command": "node",
    "args": ["server/index.js"]
  }
}
```

### ユーザー設定の宣言

```json
{
  "user_config": {
    "api_key": {
      "type": "string",
      "sensitive": true,
      "required": true,
      "description": "APIキーを入力してください"
    },
    "workspace_id": {
      "type": "string",
      "required": false
    }
  }
}
```

Claude Desktopがユーザーフレンドリーな設定UIを表示し、機密値を安全に管理します。

## Desktop Extensionの構築手順

### ステップ1: 初期化

```bash
npx @anthropic-ai/mcpb init
```

### ステップ2: マニフェストにuser_configフィールドを追加

```json
{
  "user_config": {
    "api_key": {
      "type": "string",
      "sensitive": true,
      "required": true
    }
  }
}
```

### ステップ3: パッケージ化

```bash
npx @anthropic-ai/mcpb pack
```

### ステップ4: テスト

`.mcpb`ファイルをClaude Desktop設定にドラッグ

## 高度な機能

### クロスプラットフォームサポート

Windows、macOS、Linux用のプラットフォーム固有のオーバーライド：

```json
{
  "server": {
    "command": "node",
    "args": ["server/index.js"],
    "platforms": {
      "windows": {
        "command": "node.exe"
      }
    }
  }
}
```

### 動的設定

テンプレートリテラルを使用：
- `${__dirname}` - 拡張機能ディレクトリ
- `${user_config.key}` - ユーザー設定値
- `${HOME}` - ホームディレクトリ

### 機能宣言

マニフェストでツールとプロンプトを定義して透明性を確保：

```json
{
  "features": {
    "tools": ["search", "create", "update"],
    "prompts": ["greeting", "summary"]
  }
}
```

## セキュリティとエンタープライズ

### ユーザー向け
- キーチェーンに保存される機密データ
- 自動更新
- 拡張機能の監査機能

### エンタープライズ向け
- グループポリシーとMDMサポート
- 承認済み拡張機能の事前インストール
- 拡張機能ブロックリストとディレクトリ無効化
- プライベート拡張機能ディレクトリのデプロイ

## エコシステム

Anthropicは以下をオープンソース化：
- MCPB仕様
- ツールチェーン
- リファレンス実装

これにより、AIデスクトップアプリケーション全体での幅広い採用が可能になります。

## 始め方

- **開発者**: `github.com/anthropics/dxt`でドキュメントを確認
- **ユーザー**: Claude Desktopを更新し、設定でExtensionsにアクセス
- **エンタープライズ**: デプロイメントドキュメントを参照

> このイニシアチブは「ユーザーがローカルAIツールとやり取りする方法の根本的な変化」を表し、MCPサーバーを開発者コミュニティを超えてアクセス可能にします。
