# Context and Skills

Based on:

- [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [Introducing Contextual Retrieval](https://www.anthropic.com/engineering/contextual-retrieval)
- [Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)

## Overview

As LLM context windows grow, "Context Engineering" replaces simple prompt engineering. It focuses on optimizing the _entire_ state (tokens) available to the model.

## 1. Context Engineering

**The Problem**: "Context Rot". As context availability grows, recall precision degrades (n² relationships).
**The Goal**: Smallest set of high-signal tokens.

### Best Practices

- **Altitude**: Avoid brittle hardcoded logic. Use robust heuristics.
- **Structure**: Use XML/Markdown headers (`<instructions>`, `## Tool guidance`).
- **Tools**: Prune ambiguous tools. If you can't decide which tool to use, the agent can't either.
- **Examples**: Few-shot examples are "pictures worth a thousand words".

### Managing Long Horizons

1.  **Compaction**: Summarize history when nearing limits. Keep: architectural decisions, unresolved bugs. Discard: old tool outputs, chit-chat.
    - _Technique_: "Tool Result Clearing" (remove the raw output of old tools).
2.  **Structured Note-taking (Agent Memory)**: Agent maintains a `NOTES.md` or similar file to track progress across context resets (e.g., "Step 8/10 completed").

## 2. Contextual Retrieval (RAG++)

Traditional RAG fails because chunks lose context when split from their document (e.g., "The company revenue grew 3%" - _Which company? When?_).

### The Solution

1.  **Contextual Embeddings**: Prepend 50-100 tokens of context to _each chunk_ before embedding.
    - _How_: Use a cheap model (Claude Haiku) to generate this context for every chunk during indexing.
2.  **Contextual BM25**: Also index this contextualized text for lexical search.
3.  **Reranking**: Use a reranker (e.g., Cohere) on the top results.

**Result**: Reduces retrieval failure by 49% (67% with reranking).

## 3. Agent Skills

"Skills" are portable, modular capabilities packaged as folders.

### Anatomy

- **`SKILL.md`**: Entry point with YAML metadata (`name`, `description`).
- **Resources**: Additional files (`forms.md`, `reference.pdf`) bundled in the folder.
- **Progressive Disclosure**:
  1.  Agent sees `name`/`description`.
  2.  If relevant, Agent reads `SKILL.md`.
  3.  If needed, Agent reads `forms.md`.

### Benefits

- **Scalability**: Agents don't load the whole skill into context until needed.
- **Determinism**: Skills can contain scripts (e.g., Python for PDF parsing) that run reliably, avoiding LLM "vibes" for strict logic.
- **Security**: Easier to audit a folder of scripts than a massive prompt.
