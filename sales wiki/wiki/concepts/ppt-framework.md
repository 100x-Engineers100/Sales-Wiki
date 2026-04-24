---
title: "PPT Framework: Principle → Process → Tool"
type: concept
tags: [first-principles, learning, meta-framework, 100x-cohort7, ai-tools]
source_count: 1
---

## Definition
A meta-learning framework for approaching any new technology or AI tool. Instead of starting with the tool (what it does), start with the Principle (why it works), then derive the Process (how to convert input to output), and only then treat the Tool as one implementation of that process. Tools will keep changing. Principles won't.

Described as "the single most important concept of the entire 6-month cohort" — Module 3, Part 3.

## Why It Matters
Tool-first learning creates brittle knowledge. If you learn "how to use Notebook LM" but not why it works, you are a user of someone else's system with no leverage. When the tool gets deprecated, pivots, or can't meet a client's requirements (privacy, cost, latency, output format), you're stuck. Principle-first learning means any tool change is trivial because you own the underlying architecture.

**The problem with tool-first thinking:**
- Tool gets deprecated → you have nothing
- Client has data privacy requirements → tool may not work
- Need to optimize cost or latency → no visibility into the system
- Need a different output format → no way to change it

**The result of principle-first thinking:**
- Notebook LM gets deprecated → you can rebuild it
- Enterprise client can't share data with Google → build a private RAG pipeline using the same architecture
- Need a different output → change only the tool layer, same principle applies

## How It Works

**The three levels:**
```
PRINCIPLE  The first principle of why something works
PROCESS    The steps that convert input to output based on that principle
TOOL       One implementation of the process (replaceable)
```

**Applied to any new AI tool — 4 questions:**
1. What is the INPUT and OUTPUT?
2. What PROCESS converts that input to that output?
3. What is the FIRST PRINCIPLE underlying that process?
4. Which part of that process could you build or modify yourself?

When you can answer all four, the tool becomes one implementation option. You own the principle.

**Live example from the cohort — Notebook LM → RAG → Tool Calling:**
```
Tool:      Notebook LM
Input:     Knowledge base (documents) + user query
Output:    Grounded answer

Process:   1. Can I fit everything in context? → try in-context learning
           2. Too large/expensive? → need retrieval
           3. How does retrieval work? → tool calling architecture
           4. LLM decides to use retrieval tool → execution env fetches → injects back

Principle: LLMs hallucinate because they lack current/specific information.
           RAG fills the context gap. It's tool calling applied to retrieval.
           The 3-layer architecture (Query → Execution Env → Tool/DB) is identical
           for weather lookup, search, code execution, document retrieval.
```

## Key Variants / Extensions
- Applied to any AI framework: before asking "how do I use LangChain", ask "what problem is LangChain solving and could I implement that from scratch?"
- Applied to evaluation: when assessing a new AI product, ask "what is the principle behind this, and is this the best implementation of that principle for my context?"
- Applied to hiring: distinguish people who understand principles (can adapt) from people who know tools (will be obsolete)

## Examples
- RAG → decompose to: 3-layer architecture + retrieval spectrum + domain modeling
- MCP → decompose to: N×M integration problem + standardized contracts + tool calling grown up
- Agent → decompose to: augmented LLM + reasoning loop + SPAORL cycle

## Connections
Related concepts: [[llm-decision-tree]], [[hallucination-formula]], [[six-easy-pieces-philosophy]], [[opt-framework]]
Introduced by: [[100x-cohort7-module3-agents]]

## Open Questions / Unknowns
- How does PPT apply to non-AI domains (design tools, business processes)?
- Is there a fourth level — "Pattern" — that sits between Principle and Process?
