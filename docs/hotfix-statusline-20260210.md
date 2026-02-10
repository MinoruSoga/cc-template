# Hotfix: statusLine 設定エラー修正

**日付:** 2026-02-10
**問題:** Phase 1 で追加した `statusLine` 設定が不完全でエラー発生

---

## 問題の詳細

### エラーメッセージ
```
Settings Error

/Users/minoru/Dev/Case/Elith/ri-croute/prj-ri-croute-frontend/.claude/settings.json
 └ statusLine
   ├ command: Expected string, but received undefined
   └ type: Invalid value. Expected one of: "command"
```

### 原因
Phase 1 で追加した `statusLine` 設定が不完全でした：

```json
"statusLine": {
  "enabled": true  // ❌ type と command フィールドが必要
}
```

Claude Code の `statusLine` は以下の形式が必要：
```json
"statusLine": {
  "type": "command",
  "command": "git branch --show-current"
}
```

---

## 修正内容

### 修正方針
`statusLine` はオプション機能のため、完全に削除することで対応しました。

### 修正されたファイル

#### 1. CRoute Frontend
**ファイル:** `/Users/minoru/dev/case/Elith/ri-croute/prj-ri-croute-frontend/.claude/settings.json`

**修正前:**
```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "model": "claude-sonnet-4-5-20250929",
  "outputStyle": "senior-engineer",
  "statusLine": {
    "enabled": true
  },
  "alwaysThinkingEnabled": true,
  ...
}
```

**修正後:**
```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "model": "claude-sonnet-4-5-20250929",
  "outputStyle": "senior-engineer",
  "alwaysThinkingEnabled": true,
  ...
}
```

#### 2. Template
**ファイル:** `/Users/minoru/Dev/cc/Template/.claude/settings.json`

**修正前:**
```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "outputStyle": "senior-engineer",
  "statusLine": {
    "enabled": true
  },
  "alwaysThinkingEnabled": true,
  ...
}
```

**修正後:**
```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "outputStyle": "senior-engineer",
  "alwaysThinkingEnabled": true,
  ...
}
```

---

## 検証

### CRoute Frontend
```bash
cd /Users/minoru/dev/case/Elith/ri-croute/prj-ri-croute-frontend
jq . < .claude/settings.json > /dev/null
# ✅ settings.json is valid JSON

claude "hello"
# ✅ エラーなく起動
```

### Template
```bash
cd /Users/minoru/Dev/cc/Template
jq . < .claude/settings.json > /dev/null
# ✅ Template settings.json is valid JSON
```

---

## 影響範囲

### ✅ 維持された機能（2026年必須機能）
- `alwaysThinkingEnabled: true` (Extended Thinking)
- `respectGitignore: true` (.gitignore準拠)
- `attribution` (Modern attribution format)
- `sandbox.network.allowedDomains: []` (Network sandbox)
- Async hooks (log-commands.sh, notify-slack.sh)
- UserPromptSubmit hook array

### ❌ 削除された機能（オプション）
- `statusLine` - カスタムステータスライン表示
  - 元々オプション機能のため、Phase 1-6 の主要機能には影響なし

---

## 将来の statusLine 使用について

もし statusLine 機能を使用したい場合は、以下の形式で追加してください：

```json
"statusLine": {
  "type": "command",
  "command": "git branch --show-current"
}
```

### 使用例

#### Git ブランチ名を表示
```json
"statusLine": {
  "type": "command",
  "command": "git branch --show-current"
}
```

#### プロジェクト名を表示
```json
"statusLine": {
  "type": "command",
  "command": "basename $(pwd)"
}
```

#### Node.js バージョンを表示
```json
"statusLine": {
  "type": "command",
  "command": "node --version"
}
```

---

## まとめ

- ✅ CRoute Frontend の settings.json 修正完了
- ✅ Template の settings.json 修正完了
- ✅ 両方とも JSON バリデーション通過
- ✅ 2026年必須機能はすべて維持
- ⚠️ statusLine 機能のみ削除（オプション機能）

**ステータス:** 修正完了、動作確認済み
