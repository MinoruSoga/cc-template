# MCP and Tools

Based on:

- [Introducing advanced tool use](https://www.anthropic.com/engineering/advanced-tool-use)
- [Code execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp)
- [Writing effective tools for agents — with agents](https://www.anthropic.com/engineering/writing-tools-for-agents)
- [Desktop Extensions](https://www.anthropic.com/engineering/desktop-extensions)

## Overview

This document covers the complete ecosystem of tools for Claude agents: from low-level MCP implementation and code execution to high-level discovery and desktop distribution.

_Update (Dec 2025)_: MCP is now stewarded by the **Agentic AI Foundation** (Linux Foundation), co-founded by Anthropic, OpenAI, and Block, ensuring vendor neutrality.

## 1. Tool Implementation & Strategy

### A. Claude in Xcode

_Based on: [Claude in Xcode](https://www.anthropic.com/news/claude-in-xcode)_

- **Integration**: Direct access to Claude 3.7 Sonnet within Apple's IDE.
- **Features**: Assisting with Swift/SwiftUI, debugging, and refactoring native apps.
- **Context**: Can read project files to understand architecture.

### B. Core Principles for Writing Tools

1.  **Design for Agents, Not Humans**: Agents are non-deterministic. Tools must be robust.
2.  **Naming Matters**: Use clear, specific names. Namespacing (`asana_search`, `asana_users`) helps agents select the right tool and reduces confusion.
3.  **Meaningful Context**: Return high-signal information (e.g., `name`, `file_type`), not just opaque IDs (`uuid`).
    - _Tip_: Use enums to control response verbosity (`response_format="concise"` vs `"detailed"`).
4.  **Token Efficiency**: Truncate large outputs. Use pagination/filtering by default. If a tool fails, return an actionable error message, not a stack trace.

### B. "Tool Use Examples"

JSON schemas are insufficient for teaching "usage patterns" (conventions, optional params).

- **Solution**: Add `input_examples` to tool definitions to show concrete valid calls.

## 2. Advanced Execution Patterns

### A. Tool Search (On-Demand Loading)

_Problem_: Loading 100+ tools consumes too much context.
_Solution_:

- Keep ~3-5 critical tools always loaded.
- Mark others with `defer_loading: true`.
- Claude uses a "Search Tool" to find and load others on the fly.

### B. Programmatic Tool Calling & Code Execution

_Problem_: Serial tool calls (Call -> Wait -> Read -> Call) are slow and pollute context with intermediate data.
_Solution_: Move from "Direct Tool Calls" to "Code Execution".

- Expose tools as **code libraries** (e.g., TypeScript/Python files) in a filesystem.
- Agent writes a script to import and execute tools, process data (filter/aggregate), and return only the final result.
- **Benefit**: Reduces token usage by up to 98% and enables loops/logic.

## 3. Desktop Extensions (.mcpb)

_Problem_: Installing local MCP servers is hard (Node.js, config files, dependencies).
_Solution_: **Desktop Extensions** (MCP Bundles).

- A `.mcpb` file is a zip containing:
  - `manifest.json`: Metadata, permissions, configuration.
  - Server code & bundled dependencies.
- **User Experience**: One-click install in Claude Desktop. No terminal required.

## Procedure: Building a Desktop Extension

1.  **Init**: `npx @anthropic-ai/mcpb init`
2.  **Configure**: Define `user_config` (e.g., API keys, allowed directories) in `manifest.json`.
3.  **Package**: `npx @anthropic-ai/mcpb pack` -> Generates `.mcpb`.
4.  **Test**: Drag & drop into Claude Desktop settings.
