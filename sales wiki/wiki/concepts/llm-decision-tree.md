---
title: "LLM Decision Tree: Context vs Behaviour Diagnosis"
type: concept
tags: [ai, llm, decision-framework, hallucination, rag, fine-tuning, first-principles, 100x-cohort7]
source_count: 1
---

## Definition
A diagnostic framework for choosing the right LLM optimization technique. The core insight: before selecting any technique (RAG, fine-tuning, tool calling, agents), you must first diagnose whether the failure is a context problem (the model lacks the right information) or a behaviour problem (the model has the information but responds incorrectly). The wrong diagnosis leads to wasted effort.

## Why It Matters
Most teams reach for the wrong solution. They fine-tune when they should be doing RAG. They add more retrieval when the problem is the model's output format. The decision tree prevents this by requiring diagnosis before intervention. It also imposes an escalation discipline — always start with the simplest intervention and escalate only when it fails.

## How It Works

**Step 1 — Always start with prompt engineering**
Zero-shot, then few-shot. Many problems are solved here. Never skip this step.

**Step 2 — Diagnose the failure mode**
```
Is the model generating plausible but factually wrong content?
→ Context problem (Lever 1). Model lacks the right information.

Does the model have the right context but produce poorly formatted,
off-tone, or structurally wrong outputs even when explicitly prompted?
→ Behaviour problem (Lever 2). Consider fine-tuning.
```

**Step 3 — Context Optimization Path (Lever 1)**
Follow the escalation ladder. Start simple. Add complexity only when simpler fails.
```
START: Ground from trusted sources
  │
  ├─ Data is live/external?              → Tool Calling
  │
  ├─ Data exceeds context window?        → RAG
  │    │
  │    ├─ Phrasing mismatch             → Add vector embeddings (semantic search)
  │    │
  │    ├─ Need to evaluate retrieval?   → RAGAS
  │    │
  │    ├─ Document structure needed?    → Hierarchical Retrieval (PageIndex)
  │    │
  │    ├─ Multi-hop entity reasoning?   → Knowledge Graphs
  │    │
  │    ├─ Visual layout / not text?     → ColPali / ColVision + OCR
  │    │
  │    └─ Corpus too large for window?  → Code-Augmented Retrieval
  │
  ├─ Multi-step planning + autonomy?     → Agentic Architecture
  │
  └─ Need persistence across sessions?  → LLM Memory
```

**Step 4 — Behaviour Optimization Path (Lever 2)**
```
START: Prompt engineering insufficient for behaviour change
  │
  ├─ Limited data + compute?            → LoRA / QLoRA
  │
  ├─ Need preference alignment?         → DPO
  │
  └─ Maximum control over alignment?    → RLHF / Full-Parameter Fine-tuning
```

**Step 5 — Combine both levers**
Production systems use both. A fine-tuned model (Lever 2) with RAG grounding (Lever 1) and memory (Lever 1 persistence). The levers are complementary, not alternatives.

**Critical rule:** Fine-tuning changes behaviour, not knowledge. A fine-tuned model still halluccinates about facts it hasn't seen.

## Key Variants / Extensions
- **Router pattern**: use the diagnosis framework to build a routing layer in production systems — route query types to the right retrieval method rather than applying one method to everything
- **RAG + fine-tune combo**: fine-tune for domain tone/format (Lever 2) while using RAG for factual grounding (Lever 1) — these are not alternatives

## Examples
- Medical AI that uses clinical language: both levers needed — RAG for current medical data (Lever 1) + LoRA fine-tune for clinical terminology/format (Lever 2)
- Support bot answering FAQs: Lever 1 only — keyword search or vector search over FAQ corpus; no behaviour change needed
- Customer service bot with wrong tone: Lever 2 — DPO on preferred/rejected response pairs to align tone; retrieval may still be Lever 1

## Connections
Related concepts: [[hallucination-formula]], [[retrieval-augmented-generation]], [[retrieval-spectrum]], [[ppt-framework]], [[context-economy]]
Introduced by: [[connecting-llm-dots]]

## Open Questions / Unknowns
- How do you diagnose behaviour vs context failure when you don't have ground truth labels?
- What is the minimum dataset size for DPO to be more effective than extended prompt engineering?
