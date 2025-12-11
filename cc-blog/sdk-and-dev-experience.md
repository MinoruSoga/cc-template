# SDK and Dev Experience

Based on:

- [Building agents with the Claude Agent SDK](https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk)
- [A postmortem of three recent issues](https://www.anthropic.com/engineering/a-postmortem-of-three-recent-issues)

## Overview

This document covers the **Claude Agent SDK** (formerly Claude Code SDK) and lessons learned from a recent infrastructure postmortem relevant to building reliable agents.

## 1. Claude Agent SDK

The SDK powers "Claude Code" (the CLI) and is available for developers to build their own agents.

### Core Components

1.  **Context Gathering**:

    - _Agentic Search_: Using tools like `grep`, `ls` to let the agent discover files.
    - _Semantic Search_: RAG/Vector search (faster but less precise than agent exploration).
    - _Subagents_: Parallel agents with isolated windows (e.g., "Search Subagent" filters emails before sending to Main Agent).
    - _Compaction_: Summarize history when nearing context limits.

2.  **Tools & Action**:

    - _Bash_: General-purpose computer use.
    - _Code Generation_: "Code is precise, composable, and deterministically reliable." Use it for logical tasks (e.g., "Write a Python script to parse this PDF" vs "Parse this PDF").
    - _MCP_: Connect to Slack/GitHub/Google Drive without writing custom auth code.

3.  **Verification**:
    - _Linter Feedback_: Generate TypeScript > Javascript for better error signals.
    - _Visual Feedback_: Screenshot rendered HTML/UI and feed it back to the model.
    - _LLM Judge_: Use a separate model to critique output (high latency, but useful for fuzzy quality).

## 2. Reliability & Infrastructure (Postmortem Lessons)

Even the best models rely on stable infrastructure. A recent incident highlighted three bugs:

1.  **Routing Error**: Short requests sent to 1M-context servers (routing logic failure).
2.  **Output Corruption**: Performance optimization caused rare token probability errors (e.g., outputting Chinese characters for English queries).
3.  **Compiler Bug (XLA)**: Approximate "top-k" sampling (an optimization) occasionally dropped the _most probable_ token.

### Takeaways for Agent Developers

- **Evaluations are Critical**: Synthetic benchmarks often miss "vibes" or rare failures.
- **Continuous Monitoring**: Run evals on _production_ traffic/systems, not just staging.
- **Fallback & Recovery**: Agents should be robust to occasional infrastructure hiccups (retries, validation loops).
