---
title: "Context Economy"
type: concept
tags: [ai, llm, context-window, cost, reliability, domain-modeling, routing]
source_count: 1
---

## Definition
The context window is a scarce resource. Every token placed in it carries three costs: financial (you pay per token), attention (LLMs have finite attention; more dilutes quality), and reliability (irrelevant context increases hallucination). Managing the context window like a scarce resource — not filling it indiscriminately — is a core system design discipline.

## Why It Matters
The naive approach to LLM systems is: put everything relevant in the context window. This fails at scale. Every tool description added competes for attention. Every retrieved chunk that isn't perfectly relevant introduces noise. The system degrades as it grows. Context economy is the discipline that prevents this.

**The degradation chain:**
```
Every tool added → context pollution
Context pollution → attention dilution
Attention dilution → output degradation
```

## How It Works

**Three costs of every token:**
1. **Financial cost** — input tokens are cheaper than output, but aggregate cost is significant at scale
2. **Attention cost** — LLM attention is finite; more context means each piece gets less "focus"
3. **Reliability cost** — irrelevant context increases hallucination probability

**The universal first step — domain modeling:**
Before choosing any retrieval strategy or tool:
1. Collect data (documents, APIs, databases, transcripts)
2. Domain modeling — define entities and relationships (ER diagram)
3. Build schema based on the domain model
4. Then decide which retrieval technique fits each entity and query type

This is not an AI concept — it's a database concept as old as computing. AI doesn't replace domain modeling. It requires it.

**Routing architecture (the result of domain modeling):**
```
Incoming Query
    ├── Can LLM answer directly?     → Answer (no retrieval, zero token cost)
    ├── Structured lookup?           → SQL / Keyword
    ├── Semantic question?           → Vector Search
    ├── Document navigation?         → PageIndex
    ├── Conditional logic?           → Knowledge Graph
    └── Unbounded/complex?          → RLM
```

**Separation of concerns (applied to context):**
The model should see only what it needs. Tool descriptions → minimal JSON schemas, not verbose docs. Retrieved chunks → filtered and ranked before injection. System prompts → lean. This is the classic software engineering principle: separate intelligence (LLM) from infrastructure (execution, storage, retrieval). The LLM asks for what it needs; the backend provides it. The LLM doesn't need to know how the server works.

## Key Variants / Extensions
- **Tool pruning**: don't give all tools to the agent — give only the tools relevant to the current task
- **Chunk re-ranking**: retrieve more than needed, re-rank by relevance, inject only top-k
- **System prompt compression**: keep system prompts minimal; avoid restating what the model already knows
- **Progressive loading**: start with minimal context, add more only when the agent requests it

## Examples
- 100x support bot: admin query routed directly to SQL (zero retrieval cost), not through vector search
- Agent with 20 tools: tool descriptions alone can consume 2-3k tokens before any user message
- Long conversation: context fills → summaries replace old turns (Piece 6/Memory addresses this)

## Connections
Related concepts: [[retrieval-spectrum]], [[structured-io-llm]], [[ai-memory-architecture]], [[ai-agents-react]]
Introduced by: [[six-easy-pieces-for-llms]], [[connecting-llm-dots]]

## Open Questions / Unknowns
- What are practical token budgets for system prompt vs. tools vs. retrieved context vs. conversation history?
- At what context length do current models (Claude, GPT-4o) start degrading in practice?
- How does context economy interact with extended thinking / reasoning models?
