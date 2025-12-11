# ステップ 3: エージェントスキルの実装

関連ブログ: `context-and-skills.md`

このテンプレートでは、拡張性が高い推奨アプローチである **ディレクトリベースのスキル** パターンを使用しています。

## ディレクトリ構造

**場所**: `Template/.claude/skills/`

各スキルは独自のフォルダを持ちます：

```text
Template/.claude/skills/
├── analyzing-prisma/
│   └── SKILL.md
├── generating-commits/
│   └── SKILL.md
└── [new-skill-name]/     <-- 新しいスキルはここに作成
    ├── SKILL.md
    └── script.py         (任意)
```

## 新しいスキルの追加方法

1.  **ディレクトリ作成**: `mkdir -p Template/.claude/skills/my-new-skill`
2.  **マニフェスト作成**: `touch Template/.claude/skills/my-new-skill/SKILL.md`
3.  **メタデータ定義**:

    ```markdown
    ---
    name: my-new-skill
    description: Claude がいつこのスキルを使うべきかの短い説明。
    allowed-tools: [Read, Grep]
    ---

    # Instructions

    何をするか詳細な手順を記述。
    ```

## ベストプラクティス：「決定論的スクリプト」

`analyzing-prisma` スキルで見られるように、プロンプトだけに頼らないようにしましょう。

複雑なロジック（例：DB マイグレーションの検証など）がある場合：

1.  スキルフォルダ内にスクリプト（例：`verify_migration.py`）を作成します。
2.  `SKILL.md` 内で、`Bash` を使ってそのスクリプトを実行するよう Claude に指示します。

これは `mcp-and-tools.md` の **"Code Execution"（コード実行）** パターンと一致しており、ロジックをプロンプトから信頼性の高いコードに移動させるものです。
