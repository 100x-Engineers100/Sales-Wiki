---
title: "Retrieval Spectrum (5 Levels)"
type: concept
tags: [ai, rag, retrieval, vector-search, knowledge-graph, pageindex, rlm]
source_count: 3
---

## Definition
Not all retrieval is the same. There is a spectrum of five retrieval techniques for LLM systems, each suited to different data types, query patterns, and scale requirements. Choosing the wrong point on this spectrum is the most common RAG mistake.

## Why It Matters
Teams learn about vector search and apply it to every problem. But vector search only finds *similar* content — not *correct* content. Similarity ≠ reasoning. A structured financial document needs PageIndex. A conditional logic query needs a knowledge graph. Understanding the spectrum prevents over-engineering and under-engineering.

## How It Works

**The spectrum:**

**Level 1 — Keyword Search**
- Match exact tokens
- Best for: known queries, SQL lookups, structured data, exact lookups
- Fails when: user language doesn't match stored content
- Tools: SQL LIKE, Elasticsearch BM25, grep

**Level 2 — Semantic / Vector Search**
- Text → high-dimensional vectors → similarity search
- "Man – Woman + Uncle ≈ Aunt" — meaning clusters together
- Best for: conceptual questions, semantic similarity, unstructured content
- Fails when: accuracy matters more than similarity (finds *similar*, not *correct*)
- Key insight: Similarity ≠ reasoning
- Tools: Pinecone, Weaviate, pgvector, FAISS

**Level 3 — Reasoning-Based Retrieval (PageIndex)**
- LLM navigates a structured index (Table of Contents), selects sections, extracts, loops until sufficient
- Best for: structured domains — financial docs, legal docs, curricula, textbooks
- Benchmark: **98.7% accuracy on financial benchmarks where vector search fails**
- Fails when: data is unstructured or dynamic
- How it works: Build a ToC/index of the document → LLM reads index → selects relevant sections → extracts → evaluates sufficiency → loops if needed

**Level 4 — Knowledge Graphs**
- Traverses entities and rules via graph structure
- Best for: conditional, multi-step logic ("I rode a bike without a helmet in Bangalore. What's my fine?")
- Query path: vehicle type → helmet law → state → penalty — requires chaining, not similarity
- Vector search cannot traverse chains. Knowledge graphs can.
- Tools: Neo4j, Amazon Neptune

**Level 5 — Recursive Language Models (RLMs)**
- Paradigm shift: instead of fitting data into context window, LLM writes code that processes data in an execution environment
- Data analysts don't memorize datasets — they write queries. RLMs apply this to retrieval.
- The LLM decomposes query → writes scripts → execution environment runs them → results accumulate outside context window
- Best for: unbounded/complex queries, large analytical datasets
- Evolution: Similarity → Reasoning → **Recursion**

**Decision Framework (escalate only as needed):**
1. Try tool calling first (data fits in context)
2. Context or cost problem → move to RAG
3. Start with keyword search + metadata filters
4. Keyword fails → add semantic search
5. Reasoning needed → add PageIndex or knowledge graphs
6. Context is the bottleneck → consider RLMs
7. Always evaluate with RAGAS metrics (precision, recall, faithfulness, relevancy)

**Domain modeling first:**
Before choosing retrieval technique, build an ER diagram → define entities and relationships → build schema → THEN decide retrieval method per entity/query type. Don't apply one retrieval method to all queries.

**Routing architecture:**
```
Incoming Query
    ├── Can LLM answer directly?        → Answer (no retrieval)
    ├── Structured lookup?              → SQL / Keyword
    ├── Semantic question?              → Vector Search
    ├── Document navigation needed?     → PageIndex
    ├── Conditional logic?              → Knowledge Graph
    └── Unbounded/complex?             → RLM
```

## Key Variants / Extensions
- **Hybrid search**: BM25 + vector search combined (best of keyword + semantic)
- **Re-ranking**: retrieve more → rerank → inject top-k into context
- **HyDE**: generate hypothetical answer → embed it → use as query vector
- **RAGAS**: evaluation framework for retrieval quality (context precision, context recall, answer relevancy, faithfulness)

## Examples
- Support bot: admin query (enrolled count) → SQL; student concept query → vector search; assignment navigation → PageIndex
- Financial document analysis: PageIndex at 98.7% accuracy where vector search fails
- Legal knowledge base: knowledge graph for conditional rules traversal
- Data analytics agent: RLM — writes Python to query dataset, results outside context window

## Connections
Related concepts: [[retrieval-augmented-generation]], [[context-economy]], [[hallucination-and-grounding]], [[ai-agents-react]]
Introduced by: [[five-easy-pieces-for-llms]], [[six-easy-pieces-for-llms]], [[seven-easy-pieces-for-llms]]

## Open Questions / Unknowns
- What is the exact PageIndex implementation — how is the ToC structured and how does the loop terminate?
- When is hybrid (BM25 + vector) better than pure vector search?
- What frameworks implement RLMs most effectively in production?
