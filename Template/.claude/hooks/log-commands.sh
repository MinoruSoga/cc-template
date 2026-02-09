#!/bin/bash

# stdin から JSON を読み取り、コマンド実行をログに記録
INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // "unknown"')

LOG_FILE="$CLAUDE_PROJECT_DIR/.claude/logs/commands.log"
mkdir -p "$(dirname "$LOG_FILE")"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Tool: $TOOL_NAME" >> "$LOG_FILE"
if [ -n "$COMMAND" ]; then
    echo "  Command: $COMMAND" >> "$LOG_FILE"
fi
echo "  Working Dir: $(pwd)" >> "$LOG_FILE"
echo "---" >> "$LOG_FILE"
