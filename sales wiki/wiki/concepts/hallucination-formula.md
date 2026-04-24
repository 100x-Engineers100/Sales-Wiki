---
title: "Hallucination Formula"
type: concept
tags: [ai, llm, hallucination, reliability, system-design, first-principles, 100x-cohort7]
source_count: 2
---

## Definition
`Hallucination = f(Uncertainty × Forced Response)`

LLM hallucination is not a model bug — it is the predictable consequence of two architectural constraints acting together: the model has incomplete or incorrect information (uncertainty), and it must always generate a response (forced response). When uncertainty is high and generation is forced, hallucination is the inevitable result.

## Why It Matters
The framing matters enormously for what you do about it. If hallucination is a model problem, the only fix is a better model. If it is a system design problem, it is solvable right now with the tools you already have. The formula says it is a system problem — and therefore your responsibility as the system designer.

**Liability implication:** Air Canada's chatbot promised a non-existent discount refund policy. Air Canada lost the lawsuit. The company — not the model vendor — was held responsible. Unreliable AI outputs are the builder's legal and reputational risk.

## How It Works

**Three root causes:**
1. LLMs have incomplete information — training data is a frozen snapshot
2. LLMs have no live access to reality — no APIs, databases, or senses at inference time
3. LLMs must always generate a response — the architecture demands a next token

**The system vs. model distinction:**
"LLMs hallucinate" is a category error. ChatGPT, Claude, Gemini are not models. They are systems: frontend, backend, database, API layer, orchestration, tool integration, memory. When these systems produce unreliable outputs, the failure is in the system design — not the raw model. System design is what we control.

**Two and only two mitigations:**
```
Uncertainty high?  → Reduce it: give the model access to real, current, trusted data
                     (tool calling, RAG, memory — Lever 1 interventions)

Forced response?   → Reduce it: allow the model to say "I don't know", route to human,
                     or defer to a deterministic layer for high-stakes decisions
```

**The escalation stack (from simplest to most complex):**
In-context grounding → Tool calling → RAG → Memory → Agentic architecture  
Each step reduces uncertainty by getting better information into the context window at inference time.

## Key Variants / Extensions
- **Output-layer hallucination prevention**: JSON schema conformance, structured output, Pydantic validation — prevents hallucination in the format/structure of the response even when content is correct
- **Confidence gating**: explicitly route to "I don't know" or human escalation when model confidence is below threshold
- **Deterministic fallback**: for policy/financial/legal decisions, route through a deterministic rules layer rather than relying on LLM generation

## Examples
- Air Canada chatbot: hallucinated a bereavement refund policy → company liability
- Weather query: uncertainty is maximal (training data is frozen) → tool calling solves it
- RAG support bot: retrieves policy documents before generating → reduces uncertainty to near-zero on factual questions

## Connections
Related concepts: [[llm-decision-tree]], [[hallucination-and-grounding]], [[retrieval-augmented-generation]], [[guardrails-architecture]], [[agent-failure-modes]]
Introduced by: [[connecting-llm-dots]], [[six-easy-pieces-for-llms]]

## Open Questions / Unknowns
- Is there a meaningful distinction between "hallucination" (factual error) and "confabulation" (plausible but invented detail) for system design purposes?
- What production metrics reliably track hallucination rate without requiring manual evaluation of every output?
