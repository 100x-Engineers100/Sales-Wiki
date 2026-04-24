---
title: "Retrieval-Augmented Generation (RAG)"
type: concept
tags: [ai, llm, rag, knowledge-retrieval, 100x-cohort7]
source_count: 5
---

## Definition
RAG augments an LLM's context at query time with retrieved documents from an external knowledge source. Instead of answering from training data alone, the LLM first retrieves relevant chunks (via keyword search, vector similarity, or hybrid methods) and then generates an answer grounded in those chunks.

## Why It Matters
LLMs have a knowledge cutoff and hallucinate on domain-specific content they were not trained on. RAG grounds responses in actual documents — making answers more accurate, citable, and updatable without retraining.

## How It Works
**Basic RAG pipeline:**
1. **Index**: Chunk documents → embed chunks → store in vector DB
2. **Retrieve**: User query → embed query → similarity search → top-k chunks
3. **Generate**: Pass query + retrieved chunks to LLM → grounded answer

**Three levels (100x Module 2):**
- **Level 1 (Naive RAG)**: Basic chunking, embedding, retrieval. Works for simple corpora.
- **Level 2 (Advanced RAG)**: Better chunking strategies, re-ranking, query expansion, hybrid search (BM25 + vector).
- **Level 3 (Agentic/Memory RAG)**: Agent decides what to retrieve and when. Memory RAG persists context across sessions. Multi-hop reasoning across multiple retrievals.

**Five-level retrieval spectrum (Easy Pieces framework):**
RAG is not one thing — see [[retrieval-spectrum]] for the full spectrum: keyword → semantic/vector → PageIndex (98.7% accuracy on financial docs) → knowledge graphs → RLMs (LLM writes code to process data outside context window).

**When to use RAG vs. tool calling:**
RAG is triggered by two conditions: (1) context window limit — data is physically too large, (2) cost limit — passing everything every call is unsustainable. If data fits in context: use tool calls directly.

**Limitations vs. LLM Wiki:**
RAG re-derives knowledge on every query. Nothing compounds. A synthesis requiring five documents must be discovered from scratch each time. The LLM Wiki pattern addresses this by pre-compiling the synthesis.

## Key Variants / Extensions
- **Memory RAG**: Persistent memory injected into RAG pipeline across sessions
- **Self-RAG**: LLM decides when to retrieve vs. answer from memory
- **Graph RAG**: Knowledge graph as retrieval index (captures relationships, not just similarity)
- **HyDE (Hypothetical Document Embeddings)**: Generate a hypothetical answer, embed it, use it as query vector

## Examples
- 100x Module 2 builds: RAG apps at three levels using Python
- Stella (rsarver): effectively uses memory files as a lightweight RAG system, read at query time
- This wiki: the index.md-based navigation IS a simple RAG — but for pre-synthesized pages rather than raw chunks

## Connections
Related concepts: [[llm-wiki-pattern]], [[ai-memory-architecture]], [[retrieval-spectrum]], [[context-economy]], [[structured-io-llm]], [[prompt-engineering]], [[mcp-model-context-protocol]]
Introduced by: [[100x-cohort7-module2-llm]], [[karpathy-llm-wiki-pattern]], [[five-easy-pieces-for-llms]], [[six-easy-pieces-for-llms]], [[seven-easy-pieces-for-llms]]

> [!warning] Contradiction:
> Karpathy argues RAG is insufficient for knowledge accumulation — the wiki pattern is explicitly positioned as superior for compounding knowledge. RAG remains valid for real-time retrieval of large corpora where pre-compilation is impractical.

## Open Questions / Unknowns
- What are the three specific levels taught in 100x Module 2?
- At what corpus size does RAG outperform the wiki index approach?
- How does memory RAG differ from just reading MEMORY.md in the system prompt?
