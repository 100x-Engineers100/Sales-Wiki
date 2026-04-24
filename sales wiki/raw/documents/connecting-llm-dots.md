---
title: "Connecting the LLM Dots with First Principles"
type: source
source_type: course_notes
author: "Siddhant Goswami (100x Engineers)"
date: 2026-04-09
raw_path: raw/courses/Connecting the LLM Dots with First Principles_mod 2.txt
tags: [ai, llm, hallucination, rag, tool-calling, fine-tuning, agents, memory, mcp, first-principles, 100x-cohort7]
---

## Summary

The decision-making backbone for all LLM system design. Starts from the single root cause of LLM failure — the hallucination formula — and derives two and only two optimization paths: context optimization (the LLM has wrong or missing information) and behaviour optimization (the LLM has the information but responds incorrectly).

Everything in LLM engineering — tool calling, MCP, RAG, retrieval spectrum, memory, fine-tuning, RLHF — is an instance of one of these two levers. The document provides a complete escalation ladder for each lever and a decision framework for diagnosing which lever to use first.

This document is the philosophical spine connecting Module 2 (full-stack LLM) to Module 3 (agents). The final line: "Each dot connects with the previous ones and builds the stack of first principles for Module 3."

## Key Ideas

- **Hallucination formula**: `Hallucination = f(Uncertainty × Forced Response)`. Three root causes: LLMs have frozen training data, no live access to reality, and must always generate a response. Hallucination is a system design problem — not a model flaw. ChatGPT, Gemini, Claude are systems (frontend + backend + DB + APIs), not raw models.

- **Two and only two levers**: (1) Context Optimization — reduce uncertainty by getting better information into the context window. (2) Behaviour Optimization — change how the model transforms input into output. Diagnosing which lever applies is step one.

- **Lever 1 — Context Optimization (escalation ladder)**:
  1. In-context learning (start here always — zero-shot then few-shot)
  2. Tool calling — three-layer architecture (LLM → Execution Env → Tool); LLM decides whether/which tool; execution env runs it; result injected back
  3. MCP — standardizes tool calling at scale; solves N×M integration problem → N+M; also introduces resource primitives, sampling, bidirectional protocol
  4. RAG — same three-layer architecture; "tool" is a retrieval system; two triggers: context window limit, cost limit; domain modeling is the mandatory first step
  5. RAG evaluation with RAGAS — four metrics: Faithfulness, Answer Relevancy, Context Precision, Context Recall; continuous loop not one-time
  6. Agentic architectures — when task requires multi-step planning and autonomous decision-making
  7. Memory — RAG across time; four types: short-term (context window), semantic (vector store over conversation history), episodic (condensed logs + timestamps), procedural (stored workflows/tool-use patterns)

- **The retrieval spectrum (within RAG)**:
  - Level 1: Keyword search — exact token match, SQL, structured data
  - Level 2: Semantic/vector search — high-dimensional embeddings; finds proximate meaning but semantic proximity ≠ correctness
  - Level 3: Hierarchical retrieval (PageIndex) — LLM navigates document structure (ToC → section → extract); 98.7% accuracy on financial docs
  - Level 4: Knowledge graphs — multi-hop conditional logic across entities; vector search cannot traverse chains
  - Level 5: Code-augmented retrieval — LLM writes scripts; execution environment runs them; results accumulate outside context window; also called Recursive LLMs or agentic retrieval

- **Domain modeling is the first principle of RAG design**: Most RAG pipelines fail because no one thought carefully about what data exists and what queries users will ask. Process: map example queries → collect data sources → define entities + relationships (ERD) → schema design → query-to-retrieval mapping → build router. The router is the deliverable.

- **Lever 2 — Behaviour Optimization (when context is right but output is wrong)**:
  - LoRA — low-rank adapter matrices on frozen weights; most practical entry point; limited data + compute
  - QLoRA — LoRA on quantized (4-bit) base; when GPU memory is the constraint
  - Full parameter fine-tuning — all weights; maximum capability shift; requires abundant data + compute
  - DPO (Direct Preference Optimization) — learns from preference pairs (chosen vs. rejected); implicitly defines reward function without a separate reward model
  - RLHF — explicit separately trained reward model; how frontier models are fine-tuned post-pretraining

- **Critical distinction**: Fine-tuning changes behaviour, not knowledge. A fine-tuned model still halluccinates about facts it hasn't seen. The two levers are complementary — production systems use both.

- **Decision framework**: Step 1: always start with prompt engineering. Step 2: diagnose — factually wrong = context problem (Lever 1); correctly informed but wrong format/tone = behaviour problem (Lever 2). Step 3: escalate within the lever. Step 4: combine both levers for production.

## Notable Quotes / Moments

> "Hallucination = f(Uncertainty, Forced Response)"

> "When people say 'LLMs hallucinate,' what they actually mean is: the system built around the LLM produced an unreliable output. That's a problem of a system not being able to meet the user's expectations."

> "RAG is not a new paradigm. It uses the exact same three-layer architecture as tool calling. The only difference is that the 'tool' is now a retrieval system."

> "Memory is RAG across time."

> "Fine-tuning is not a replacement for RAG. It changes the model's behaviour, not its knowledge."

> "The First Principle of RAG Design is Domain Modeling."

> "Each dot connects with the previous ones and builds the stack of first principles for Module 3."

## Concepts Introduced
[[hallucination-and-grounding]], [[llm-decision-tree]], [[retrieval-augmented-generation]], [[retrieval-spectrum]], [[context-economy]], [[mcp-model-context-protocol]], [[ai-memory-architecture]]

## Entities Mentioned
[[siddhant]], [[100x-engineers]]

## Contradictions / Tensions
The document presents agentic architectures as a retrieval escalation step (under Lever 1), but Module 3 treats agents as an independent paradigm requiring their own architecture. These are complementary framings, not contradictions — Lever 1 explains why agents emerge; Module 3 explains how to build them.

## Open Questions
- How does RAGAS evaluation integrate into a production CI/CD pipeline?
- At what scale does the PageIndex approach (Level 3) break down?
- What is the practical threshold for switching from DPO to full RLHF?
