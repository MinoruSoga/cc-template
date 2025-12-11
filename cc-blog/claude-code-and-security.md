# Claude Code and Security

Based on:

- [Claude Code: Best practices for agentic coding](https://www.anthropic.com/engineering/claude-code-best-practices)
- [The "think" tool](https://www.anthropic.com/engineering/claude-think-tool)
- [Raising the bar on SWE-bench Verified](https://www.anthropic.com/engineering/swe-bench-sonnet)
- [Beyond permission prompts: making Claude Code more secure and autonomous](https://www.anthropic.com/engineering/claude-code-sandboxing)

## Overview

This document consolidates best practices for using Claude Code (the CLI tool), implementing the new "Think" tool, and understanding the security sandboxing model that powers autonomous agents.

## 1. Claude Code Best Practices

Claude Code is a CLI tool for agentic coding. It is designed to be a "power tool"—flexible and unopinionated.

### Setup & Customization

- **`CLAUDE.md`**: A context file automatically loaded by Claude. Use it to document:
  - Build/test commands.
  - Code style (e.g., "Use ES modules").
  - Project-specific quirks.
- **Slash Commands**: Store prompts in `.claude/commands/*.md` (e.g., `/project:fix-issue`).
- **Headless Mode**: Use `claude -p "prompt" --output-format stream-json` for CI/CD pipelines (e.g., auto-triaging issues, linting).

### Optimization Techniques

- **Specific Instructions**: Be precise.
- **Pass Data**: Pipe content into Claude (`cat logs.txt | claude`).
- **Course Correct**: Use `/clear` to reset context if the agent gets stuck.
- **Multi-Claude**: Run multiple instances (e.g., one implements, one verifies) or use git worktrees for parallel tasks.

## 2. The "Think" Tool

A new tool that allows Claude 3.7 Sonnet (and 3.5 Sonnet) to "stop and think" during tool use chains.

- **Purpose**: Unlike "Extended Thinking" (which happens _before_ response), the "Think" tool happens _during_ generation, allowing the model to pause after receiving tool output but before taking the next action.
- **Use Case**: Complex sequential tool calls, policy-heavy environments, or where mistakes are costly.
- **Implementation**: A simple tool definition (`name: "think"`, `input: { thought: string }`).
  - _Best Practice_: Put instructions for _when_ to use it in the logical system prompt, not just the tool description.

## 3. High-Performance Coding Agents (SWE-bench)

Anthropic achieved 49% on SWE-bench Verified by **keeping the scaffold simple**.

- **Philosophy**: Give control to the model. Don't hardcode rigid workflows.
- **Tools**: Just `BashTool` and `EditTool`.
- **Prompt**: "Explore -> Reproduce -> Edit -> Verify".
- **Lesson**: The model's own judgment (with a good system prompt) often outperforms complex engineered flows.

## 4. Security & Sandboxing

To enable autonomous agents (fewer "Approve" clicks) while maintaining safety, Claude Code introduces **Sandboxing**.

### Two-Layer Isolation

1.  **Filesystem Isolation**: Agent can only read/write to specific directories.
2.  **Network Isolation**: Agent can only connect to approved domains via a proxy.

### Features

- **Sandboxed Bash Tool**: Uses OS primitives (Linux bubblewrap, macOS seatbelt) to isolate executed commands.
- **Claude Code on the Web**: Runs the entire session in a cloud sandbox. Sensitive credentials (git keys) are held by a proxy, never exposed to the sandbox environment.
