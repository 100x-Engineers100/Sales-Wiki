---
title: "Hallucination and Grounding"
type: concept
tags: [ai, llm, hallucination, reliability, tool-calling, first-principles]
source_count: 2
---

## Definition
LLM hallucination is not a bug — it is the inevitable consequence of the architecture. LLMs are trained to predict the next token, not to verify truth. When they don't know the answer, they still predict. Grounding is the set of techniques that reduce this uncertainty by connecting LLMs to trusted external sources.

## Why It Matters
Hallucination is a liability issue, not just a UX problem. Air Canada's chatbot promised a non-existent refund; the airline lost the lawsuit. The company — not the chatbot — was held responsible. If you build AI systems, unreliable outputs are your legal and reputational risk.

## How It Works

**The Hallucination Formula:**
```
Hallucination = Uncertainty × Forced Response
```
LLMs must always generate a response (the architecture demands a next token). When uncertainty is high and response is forced: hallucination.

**Two and only two mitigations:**
1. **Reduce uncertainty** — give the model access to real, trusted data
2. **Reduce forced generation** — let the model say "I don't know" or defer to a tool

Everything else (RAG, tool calling, grounding, structured output) is an elaboration of lever 1 or lever 2.

**The System vs. The Model:**
"LLMs hallucinate" is a category error. Individual models hallucinate. Systems built around models can be designed to not hallucinate. ChatGPT, Gemini, Claude — these are not models. They are systems: frontend, backend, database, API layer, orchestration, tool integration, memory. System design is what we control.

**The Three-Layer Grounding Architecture:**
```
Layer 1: LLM              → Determines what to do (intent + parameters)
Layer 2: Execution Env     → Runs deterministic code (server / backend)
Layer 3: Tool              → Returns real data (API, database, file system)
```
A raw LLM cannot execute code, call APIs, or access the internet. It lacks an execution environment. The three-layer architecture gives it hands.

**Tool calling IS RAG:**
When you call a tool, inject its result into the prompt, and generate an answer, you've done Retrieval → Augmentation → Generation. RAG and tool calling are the same pattern at different scales.

## Key Variants / Extensions
- **Tool calling**: structured tool invocation for small, real-time data
- **RAG**: retrieval from large corpora that don't fit in context
- **Structured output**: preventing hallucination at the output layer (JSON schema conformance)
- **"I don't know" capability**: routing to human escalation when confidence is below threshold

## Examples
- Air Canada lawsuit: chatbot hallucinated a refund policy → company liability
- Weather query: LLM cannot know today's temperature → connect to weather API (tool call)
- Medical AI: high stakes → structured retrieval from verified sources + explicit "I don't know" paths

## Connections
Related concepts: [[retrieval-augmented-generation]], [[structured-io-llm]], [[retrieval-spectrum]], [[deterministic-vs-generative-separation]]
Introduced by: [[six-easy-pieces-for-llms]], [[connecting-llm-dots]]

## Open Questions / Unknowns
- What is the right threshold for "I don't know" vs. attempting an answer with a confidence qualifier?
- How do you measure hallucination rate in production systems?
