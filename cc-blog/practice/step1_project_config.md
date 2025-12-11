# ステップ 1: プロジェクトとエージェントの構成

関連ブログ: `claude-code-and-security.md`, `Template/.claude/README.md`

## 1. `settings.json` の構成

`Template/.claude/settings.json` ファイルは設定の中心となるハブです。

**確認すべき主要設定:**

- **`sandbox`**: セキュリティのために有効化されていることを確認してください。

  ```json
  "sandbox": {
    "enabled": true,
    "autoAllowBashIfSandboxed": true,
    "excludedCommands": ["docker", "make", "git"]
  }
  ```

  _理由_: 常に「承認」をクリックすることなく、エージェントが安全にコマンドを実行できるようにするためです（ブログ記事「Beyond permission prompts」参照）。

- **`permissions`**: 詳細なアクセス制御。
  - `allow`: `make`, `gh` など安全に実行できるコマンド。
  - `deny`: 機密情報（`.env` など）の読み書き禁止。
  - `ask`: 破壊的な操作（`rm`, `git push --force`）の確認。

## 2. エージェントの役割 (`Template/.claude/agents/`)

単純な「スラッシュコマンド」の代わりに、このテンプレートでは**サブエージェント**（ペルソナ）を使用しています。

**場所**: `Template/.claude/agents/`

**既存のエージェント**:

- `architect.md` (Opus): 設計とセキュリティ担当。
- `implementer.md` (Sonnet): コーディング担当。
- `reviewer.md` (Sonnet): 品質保証（QA）担当。

**使用方法**:
Claude Code 内で自然言語または `/agents` コマンドで呼び出せます：

> "Use the generic architect to review this plan."（一般的なアーキテクトを使ってこの計画をレビューして）

**実践**:
`Template/.claude/agents/architect.md` を編集し、チーム固有の「アーキテクチャ原則」（例：「常に Feature-Sliced Design を使用する」など）を追加してみましょう。

## 3. 出力スタイル (`Template/.claude/output-styles/`)

Claude の「話し方」や「振る舞い」を定義します。

- **現在**: `senior-engineer.md` -> 「厳密な型安全性重視」「日本語での説明」。
- **変更**: もしより簡潔な回答が欲しい場合は、`Template/.claude/output-styles/terse.md` を作成し、`settings.json` で `"outputStyle": "terse"` に設定します。
