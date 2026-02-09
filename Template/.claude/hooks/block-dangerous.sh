#!/bin/bash

# stdin から JSON を読み取り、危険なコマンドをブロック
INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

if [ -z "$COMMAND" ]; then
    exit 0
fi

# 危険なパターンをチェック
DANGEROUS_PATTERNS=(
    "rm -rf /"
    "rm -rf ~"
    "> /dev/sda"
    "mkfs"
    "dd if=/dev/zero"
    ":(){:|:&};:"
)

for pattern in "${DANGEROUS_PATTERNS[@]}"; do
    if [[ "$COMMAND" == *"$pattern"* ]]; then
        echo '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"Dangerous command pattern detected: '"$pattern"'"}}'
        exit 0
    fi
done

exit 0
