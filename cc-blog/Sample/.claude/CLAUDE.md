# Project Context

## Commands

- **Test**: `npm test`
- **Lint**: `npm run lint`
- **Build**: `npm run build`
- **Dev**: `npm run dev`

## Architecture Principles

1.  **Sandboxing**: All file operations must stay within the project root.
2.  **Agents**: Use `architect` for planning and `implementer` for coding.
3.  **Local Memory**: Use `mcp-server-cipher` (if configured) or `NOTES.md` to persist context between sessions.

## Coding Style

- **TypeScript**: Strict mode enabled. No `any`.
- **Functional**: Prefer pure functions and immutability.
- **Comments**: Explain "Why", not "What".
- **Error Handling**: Use `Result` types or typed exceptions.

## Active Status

- **Current Phase**: Initialization
- **Next Milestone**: Setup project scaffolding
