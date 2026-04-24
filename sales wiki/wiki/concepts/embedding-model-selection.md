---
title: "Embedding Model Selection"
type: concept
tags: [rag, embeddings, retrieval, llm, 100x-cohort7]
source_count: 1
---

## Definition
Embedding model selection is the process of choosing the right vector embedding model for a RAG system, using the MTEB leaderboard to compare models on accuracy vs. cost vs. speed — with the principle: start with the smallest model that works, scale up only when needed.

## Why It Matters
The embedding model chosen determines retrieval quality (the R in RAG). A wrong choice means semantically related content isn't found — causing hallucination at the retrieval stage, not the generation stage. Critically: the model used for indexing and the model used for querying must be identical, or vectors won't align.

## How It Works

### What Embeddings Are
Vector embeddings convert text into numerical arrays that capture semantic meaning. Similar concepts cluster in vector space — enabling semantic search (finding meaning, not just keywords).

- **Word2Vec era**: ~200 dimensions
- **Modern models**: 384 to 4096+ dimensions
- Each dimension captures one trait or aspect of meaning
- More dimensions = more nuanced representation (but diminishing returns)

**Example:** The word "Apple" in 4096 dimensions can simultaneously encode all three meanings (fruit, tech company, record label) — a 200-dimension model cannot.

### MTEB Leaderboard (Selection Tool)
**MTEB** = Massive Text Embedding Benchmark (hosted on Hugging Face)
- Benchmarks 100+ embedding models across 1000+ languages
- Covers multiple task types: retrieval, classification, clustering, STS
- Also includes **RTEB** (Retrieval Text Embedding Benchmark) for pure retrieval tasks

**Top models by category (as of cohort date):**
| Model | Params | Dimensions | Notes |
|-------|--------|------------|-------|
| Llama Embed Nemotron | 8B | 4096 | Ranks #1; expensive; for high-stakes retrieval |
| Embedding Gemma | 307M | 768 | Good balance of quality/cost |
| Voyage AI voyage-3 | — | — | Strong 2024 performance on retrieval |
| Qwen | — | 1024 | Ranks ~#5 |
| BGE models (BAAI) | 27M+ | 384-768 | Solid open-source; good starting point |
| OpenAI text-embedding-ada | — | 1536 | Closed-source, expensive, reliable |

### Selection Strategy
```
Step 1: Start small
  → Use 384-dimension open-source model (e.g., BGE-small, all-MiniLM)
  → Test on your specific data and query patterns
  → Benchmark: does it return relevant chunks >90% of the time?

Step 2: Escalate if needed
  → Medium: 768-1024 dimensions (Gemma, Qwen)
  → Large: 4096 dimensions (Nemotron) — only if high precision required

Step 3: Consider domain specificity
  → General models work for most use cases
  → Legal/medical/financial may need domain-specific fine-tuned embeddings
  → Fine-tune embeddings only after exhausting general model options
```

**Key rule:** Higher dimensions ≠ better results. It depends on your data and use case. Always judge cost-benefit on your specific domain.

### Critical Constraint: Indexing = Querying Model
The embedding model used to create the vector index MUST be the same model used to convert the user query to a vector. Different models produce incompatible vector spaces — search will return garbage.

```python
# ✅ Correct — same model for both
index_model = "BAAI/bge-small-en"
query_model = "BAAI/bge-small-en"

# ❌ Broken — different models
index_model = "openai/ada-002"
query_model = "BAAI/bge-small-en"
```

### Dimensions and Cost
| Dimensions | Compute Cost | Storage | Quality |
|-----------|-------------|---------|---------|
| 384 | Low | Small | Good for general use |
| 768-1024 | Medium | Medium | Better semantic nuance |
| 1536 | Medium-High | Larger | OpenAI Ada range |
| 4096 | High | Large | Top-of-leaderboard; specialized use |

### Domain Specificity
- **General domains** — start with any top-10 MTEB model
- **Legal/compliance** — consider `legal-bert` or fine-tuned legal models
- **Medical/scientific** — `BioMedBERT`, `PubMedBERT`, or domain-specific models
- **Financial** — `FinBERT` family; PageIndex retrieval showed 98.7% accuracy on financial docs (from [[connecting-llm-dots]])

## Key Variants / Extensions
- **Fine-tuned embeddings** — adapt a base embedding model to your domain with labeled retrieval pairs; only justified with large labeled dataset
- **Matryoshka embeddings** — models trained to allow dimension truncation; use fewer dimensions for speed while maintaining quality
- **Multi-vector retrieval** — ColBERT-style; more accurate but slower; for high-precision use cases

## Examples
**Practical starting point (from lecture):**
> "Start with the smallest, cheapest, fastest model and move up only if needed. Do not over-engineer from the start." — Module 14 mentor

BGE-small (27M params, 384 dims, free, fast) → test → if insufficient → Gemma 307M → if insufficient → Nemotron 8B

## Connections
Related concepts: [[retrieval-augmented-generation]], [[retrieval-spectrum]], [[context-economy]], [[production-genai-stack]]
Introduced by: [[100x-cohort7-module2-llm]], [[connecting-llm-dots]]

## Open Questions / Unknowns
- How often should embedding models be updated as new leaderboard leaders emerge?
- Does fine-tuning embeddings on domain data always outperform larger general models for that domain?
