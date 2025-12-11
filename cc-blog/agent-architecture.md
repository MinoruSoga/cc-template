# Agent Architecture

Based on:

- [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- [How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)
- [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)

## Overview

This document synthesizes Anthropic's engineering practices for building agentic systems, ranging from simple workflows to complex multi-agent architectures.

## Core Concepts

**Agents vs. Workflows:**

- **Workflows**: Orchestrated through predefined code paths. Best for predictable, well-defined tasks.
- **Agents**: LLMs dynamically direct their own processes and tool usage. Best for flexible, model-driven decision-making at scale.

**Principle**: Start simply. Only increase complexity when it demonstrably improves outcomes.

## 1. Common Patterns (Building Blocks)

Anthropic identifies these core patterns, ordered by complexity:

### A. The Augmented LLM

The basic unit: an LLM with access to tools, retrieval, and memory (via context).

### B. Prompt Chaining

Decomposing a task into sequential steps where each LLM call uses the output of the previous one.

- _Use for:_ Marketing copy translation, document outlining + writing.

### C. Routing

Classifying input to direct it to specialized downstream tasks/prompts.

- _Use for:_ Customer service (Refunds vs Tech Support), routing easy tasks to Haiku and hard ones to Sonnet.

### D. Parallelization

- **Sectioning**: Breaking tasks into independent subtasks run in parallel (e.g., Guardrails check + response generation).
- **Voting**: Running the same task multiple times for diversity or higher confidence (e.g., Vulnerability scanning).

### E. Orchestrator-Workers

A central "Orchestrator" LLM breaks down a task and delegates to "Worker" LLMs.

- _Use for:_ Complex coding tasks (multiple files), broad research.

### F. Evaluator-Optimizer

One LLM generates, another evaluates and provides feedback in a loop.

- _Use for:_ Translation refinement, iterative search.

## 2. Advanced Architectures

### Multi-Agent Research System

For complex, open-ended research (browse, read, synthesize), Anthropic uses an **Orchestrator-Worker** pattern.

- **Lead Agent**: Plans research, spawns subagents.
- **Subagents**: Execute parallel searches, distilled insights, and report back.
- _Key Insight_: Token usage explains 80% of performance variance in research. Multi-agent systems "spend tokens" to buy better performance.

### Computer Use (Architecture)

_Based on: [Developing a computer use model](https://www.anthropic.com/news/developing-computer-use)_

- **Concept**: Training Claude to interpret screenshots (pixel counting) and output cursor coordinates/clicks.
- **Training**: Restricted to simple apps (calculator, text editor) to learn generalization.
- **Performance**: 14.9% on OSWorld (State-of-the-art for AI, though below human 70-75%).
- **Safety**: Specialized classifiers to detect risky actions (e.g., posting on social media, government sites) before execution.

### Robotics & Autonomy (Project Fetch)

_Based on: [Project Fetch: Can Claude train a robot dog?](https://www.anthropic.com/research/project-fetch)_

- **Experiment**: Two teams (Manual vs AI-assisted) competed to program a robot dog to fetch a ball.
- **Result**: The AI-assisted team was the _only_ one to achieve full autonomy.
- **Key Takeaway**: Agents excel at rapid iteration in unfamiliar domains (API discovery, error log analysis) where humans get stuck reading documentation.

### Long-Running Agents (Coding)

For tasks spanning hours/days (e.g., "Build a full app"), distinct roles are used to bridge context windows.

- **Initializer Agent**: Runs once. Sets up `init.sh`, `claude-progress.txt`, `feature_list.json`.
- **Coding Agent**: Runs iteratively. Reads state, picks _one_ feature, implements it, tests it (browser), and commits.

## Best Practices & Engineering Tips

### Prompt Engineering for Agents

1.  **Think like your agent**: Simulate the agent in the Console to see failure modes (e.g., getting stuck in loops).
2.  **Teach delegation**: Give orchestrators clear instructions on _how_ to delegate (objective, format, tools).
3.  **Scale effort**: Tell agents how much effort to spend (e.g., "Fact finding = 1 agent", "Complex research = 10 subagents").
4.  **Self-Correction**: Ask the model to diagnose its own tool failures or code errors.

### Testing & Evaluation

- **Start small**: 20 test cases are enough to see big impacts.
- **LLM-as-Judge**: Use an LLM to grade outputs (accuracy, completeness) on a 0-1 scale.
- **Human Eval**: Essential for catching "hallucinated" or SEO-spam sources that automated judges miss.
- **End-to-End Testing**: For coding agents, use browser automation (Puppeteer) to verify the app actually works, don't just rely on unit tests.

### Reliability

- **State Persistence**: Agents must be able to "resume" work. Use files (`progress.txt`, git) to save state.
- **Rainbow Deployments**: Update agent logic gradually to avoid breaking long-running sessions.
- **Sandboxing**: All code execution must happen in a secure isolated environment.
