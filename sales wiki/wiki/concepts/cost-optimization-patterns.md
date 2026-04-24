---
title: "Cost Optimization Patterns"
type: concept
tags: [llm, cost, production, architecture, 100x-cohort7]
source_count: 2
---

## Definition
Cost optimization patterns are engineering techniques that reduce LLM API spending while maintaining output quality — primarily through response caching, model tiering, prompt efficiency, rate limiting, and streaming.

## Why It Matters
LLM API costs can escalate from $0 to thousands of dollars in hours if unchecked. A single bug causing repeated API calls, no caching on duplicate queries, or using GPT-4 for every task regardless of complexity — these are production incidents, not edge cases. Cost optimization is architecture, not afterthought.

## How It Works

### The Five Core Patterns

**1. Response Caching (Redis)**
Store LLM responses for identical or semantically similar queries. Most production queries repeat — user FAQs, common search patterns, repeated workflows.
```python
cache_key = md5(prompt.encode()).hexdigest()
cached = redis_client.get(cache_key)
if cached:
    return cached.decode()
# Call LLM only if cache miss
response = call_llm(prompt)
redis_client.setex(cache_key, 3600, response)  # 1hr TTL
```
Result: 60-80% cost reduction for apps with repeated query patterns.

**2. Model Tiering (Cascade)**
Route requests to the cheapest model capable of handling them. Don't use GPT-4 for tasks GPT-3.5 handles correctly.
| Model | Use Case |
|-------|----------|
| GPT-3.5-turbo / Llama 3 | General tasks, simple classification, FAQ answering |
| Claude Haiku | Fast responses, simple reasoning, cheap |
| Claude Sonnet | Balance of quality and cost |
| GPT-4 / Claude Opus | Complex reasoning, code generation, critical decisions |

Strategy: attempt with cheaper model → if quality insufficient → escalate. Cache the escalation decision.

**3. Prompt Efficiency**
Shorter, more precise prompts reduce token count directly:
- Remove verbose system prompts with redundant instructions
- Use structured output (`JSON mode`) to avoid post-processing
- For few-shot examples, use minimum examples that still work
- Avoid re-sending the same context multiple times in a conversation

**4. Streaming Responses**
`StreamingResponse` sends tokens as they generate rather than waiting for full completion:
- Reduces perceived latency (user sees output immediately)
- Enables early termination if response goes off-track
- Reduces memory footprint (no need to buffer full response)

**5. Rate Limiting**
- Per-user request limits prevent abuse and runaway costs
- Add `max_tokens` to every API call — prevents 10,000-token accidental outputs
- Exponential backoff on API failures prevents retry storms
- Budget alerts on API dashboard (OpenAI, Anthropic both support this)

### Cost-Aware Model Selection Framework
```
Task complexity → low: use GPT-3.5 / Haiku
                 medium: use Sonnet / GPT-4-mini
                 high: use GPT-4 / Opus
                 
Volume → high: consider open-source self-hosted (Modal + Llama)
         low: managed API is fine
```

### Agent Cost Warning (from Module 3)
Agent workflows can be 60-65% more expensive than equivalent workflow pipelines for the same task. Each agent loop = multiple LLM calls. Apply the [[95-percent-rule]] before building agents: can all steps be defined in advance? If yes, use a workflow.

### Monitoring Costs
Log every LLM call: `tokens_used`, `model`, `cost` (calculate: tokens × price-per-token)
- **Langfuse** — built-in cost tracking per LLM call
- Set daily/monthly budget alerts on provider dashboards
- Aggregate by user to identify high-cost users early

## Key Variants / Extensions
- **Semantic caching** — cache by embedding similarity, not exact match; catches paraphrased queries that mean the same thing
- **Batch processing** — group multiple small requests into one API call when possible (OpenAI Batch API)
- **Context compression** — summarize conversation history before adding to context; reduces tokens for long sessions
- **Local models for high-volume tasks** — Llama on Modal/Replicate; no per-token cost, fixed GPU cost

## Examples
**Real numbers from cohort:**
- Redis caching 60-80% cost reduction for FAQ-heavy apps
- Agent approach vs workflow for same task: 64.9% more expensive
- GPT-3.5 vs GPT-4 for simple tasks: ~20x cheaper per token

## Connections
Related concepts: [[production-genai-stack]], [[95-percent-rule]], [[context-economy]], [[retrieval-augmented-generation]]
Introduced by: [[100x-cohort7-module2-llm]], [[100x-cohort7-module3-agents]]

## Open Questions / Unknowns
- How does semantic caching work with vector similarity? (Most implementations use cosine similarity >0.95 threshold to consider "same" query)
- At what scale does self-hosted open-source become cheaper than managed API? (Rough: >$500/month API spend)
