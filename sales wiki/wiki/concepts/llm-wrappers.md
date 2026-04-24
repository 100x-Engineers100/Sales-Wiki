---
title: "LLM Wrappers"
type: concept
tags: [llm, business-model, product, 100x-cohort7]
source_count: 1
---

## Definition
An LLM wrapper is an application or service built on top of one or more LLM APIs that delivers targeted value through task-specific focus, optimized UI/UX, external integrations, or sophisticated prompt engineering — making a general-purpose LLM useful for a specific domain or workflow.

## Why It Matters
LLMs are general-purpose. Users don't want general — they want their specific problem solved. LLM wrappers extract value from the raw capability by adding the right context, interface, and integrations. Perplexity AI and Cursor are billion-dollar wrappers built on top of OpenAI and Anthropic APIs.

## How It Works

### What a Wrapper Adds
| Layer | Example |
|-------|---------|
| Task-specific focus | Summarizing legal docs, not all docs |
| Optimized UI/UX | Perplexity's search-result-style interface |
| External integrations | Connecting LLM to private data (RAG), tools (tool calling) |
| Sophisticated prompting | Few-shot examples, rubrics, structured output |
| Workflow automation | Chaining multiple LLM calls into a process |

### Minimum Viable Wrapper Architecture
1. **UI** — collects user input (web/mobile interface or direct API)
2. **Backend** — receives input, builds context-rich prompt, calls LLM API
3. **LLM API** — processes prompt, returns response
4. **Optional: external data** — tool calling or RAG to ground the response
5. **Output** — structured response delivered to user

### Business Model Defensibility
A naive wrapper with no additional value is easily copied. Defensibility comes from:
- **Superior UI/UX** — better experience than the raw model interface
- **Sophisticated prompting** — proprietary prompt engineering built through iteration
- **Unique integrations** — connects to data sources competitors don't have
- **Domain focus** — specialized for one vertical (legal, medical, coding)
- **Brand/community** — network effects, user trust, content moats

### When to Fine-tune vs Use a Wrapper
- **Start with prompt engineering** — In-Context Learning (ICL) can match fine-tuning results for many tasks without training costs
- **Fine-tune only when:** need deep domain knowledge, consistent tone/style, large training dataset, cheaper inference at scale
- First wrapper, then fine-tune if wrapper hits ceiling

## Key Variants / Extensions
- **RAG wrapper** — adds knowledge base retrieval; needed when proprietary data is the core value
- **Tool-calling wrapper** — connects LLM to real-time APIs (weather, calendars, databases)
- **Agent wrapper** — multi-step reasoning; needed when tasks require planning and execution loops
- **B2B API wrapper** — exposes your prompt-engineered LLM as an API for other companies

## Examples
**Perplexity AI** — wraps multiple LLMs + web search; adds real-time citations; better research UX than ChatGPT

**Cursor** — wraps Anthropic/OpenAI models; adds codebase context (`@codebase`, `@file`); IDE integration

**ChatBase** — wraps any LLM; adds website scraping + RAG; allows non-technical users to build custom chatbots

**100x AI CRM** (from lecture) — wraps Groq/LLaMA; adds few-shot lead qualification rubric; FastAPI + Streamlit interface; replaces manual lead scoring

## Connections
Related concepts: [[full-stack-llm-architecture]], [[prompt-engineering]], [[retrieval-augmented-generation]], [[ppt-framework]], [[opt-framework]]
Introduced by: [[100x-cohort7-module2-llm]]

## Open Questions / Unknowns
- As LLM context windows grow to millions of tokens, do simpler wrappers (context stuffing) beat complex RAG wrappers?
- How does MCP change the wrapper model? (MCP may allow dynamic tool integration at inference time, reducing need for custom wrapper infrastructure)
