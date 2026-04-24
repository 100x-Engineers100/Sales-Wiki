---
title: "Augmented LLM"
type: concept
tags: [ai, agents, llm, tools, memory, retrieval, 100x-cohort7]
source_count: 1
---

## Definition
An LLM enhanced with three augmentations: Retrieval (access to external documents/databases via RAG), Capabilities (access to tools for executing actions), and a Controller (a system prompt or logic layer directing when to use augmentations). An Augmented LLM is NOT yet an agent. It is the prerequisite state — the building block that becomes an agent when a reasoning loop is added.

The distinction is critical: people call Augmented LLMs "agents" when they are not. The loop is what makes an agent.

## Why It Matters
The Augmented LLM framing (from Anthropic's "Building Effective Agents" article) clarifies the evolution path from raw LLM to agent. It prevents premature complexity: most use cases only need an Augmented LLM, not a full agent. Adding a reasoning loop is a cost and reliability tradeoff — only justified when the task genuinely requires dynamic multi-step planning.

**The 4-phase evolution of LLMs:**
1. Phase 1 — Text In/Text Out: basic LLMs, isolated, no external access
2. Phase 2 — Context Extension: larger context windows for more data processing
3. Phase 3 — RAG + Tools: connecting to external data (RAG) and actions (tool calling) → Augmented LLM
4. Phase 4 — Agents: Augmented LLM + a reasoning loop

## How It Works

**The three augmentations:**
```
Augmented LLM = LLM + Knowledge + Capabilities + Controller

Knowledge      = Access to documents/databases (RAG)
Capabilities   = Access to tools (search, code execution, API calls)
Controller     = Logic directing when/how to use augmentations
```

**What it is NOT:**
- Not a full agent — no autonomous reasoning loop, no self-directed plan-act-observe cycle
- Not a chatbot — can access external data and execute actions
- The middle state: more powerful than a vanilla LLM, less autonomous than an agent

**When Augmented LLM is sufficient (95% of cases):**
- Tasks where all steps can be defined in advance
- Fixed workflows with predictable tool sequences
- When you need external data but don't need dynamic re-planning
- When reliability and cost matter more than autonomy

**When you need to graduate to Agent:**
- Task requires dynamic multi-step planning that can't be pre-defined
- Number of steps varies significantly by query complexity
- Agent needs to re-plan based on what it discovers mid-execution

## Key Variants / Extensions
- **RAG-only augmentation**: Knowledge only, no tool execution — the simplest form
- **Tool-calling LLM**: Capabilities only (weather API, code execution) — no retrieval
- **Memory-augmented**: adds persistence across sessions via memory system
- **Full augmentation**: Knowledge + Capabilities + Memory + Controller — maximum augmentation without the reasoning loop

## Examples
- Perplexity AI: Augmented LLM — web search capability + language generation. Not a full agent (most queries are answered in one search-retrieve-generate cycle)
- Cursor: Augmented LLM with codebase as knowledge + code execution as capability
- Simple customer support bot with FAQ retrieval: Augmented LLM (RAG only)
- 100x Module 3 Lecture 1: Instructor defines Augmented LLM as the entry point to agents before teaching the loop

## Connections
Related concepts: [[agentic-loop]], [[react-framework]], [[retrieval-augmented-generation]], [[mcp-model-context-protocol]], [[95-percent-rule]]
Introduced by: [[100x-cohort7-module3-agents]]

## Open Questions / Unknowns
- Is there a clean boundary where an Augmented LLM becomes an agent, or is it a spectrum?
- How do you benchmark "sufficient augmentation" before adding loop complexity?
