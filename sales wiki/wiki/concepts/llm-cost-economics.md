---
title: "LLM Cost Economics"
type: concept
tags: [ai, llm, agents, cost, economics, 100x-cohort7]
source_count: 1
---

## Definition
LLM cost economics is the discipline of calculating, comparing, and optimizing the token-based costs of different AI architectures — specifically the cost differential between agentic reasoning loops and deterministic LLM workflows for the same task.

## Why It Matters
Agentic systems are seductive. They feel more capable. But every iteration of a reasoning loop costs tokens — and tokens cost money. The decision to use an agent vs. a workflow is also a financial decision. Getting it wrong by defaulting to agents for tasks that don't need them can result in 65%+ cost overruns that make a product economically unviable.

Finance teams and business stakeholders will ask about cost before reliability. Builders need to answer this question with data, not intuition.

## How It Works

### The Cost Calculator Model

The 100x cohort mentor built a live cost calculator tool with these inputs:
- Model selection (e.g., GPT-4, Claude Opus, open-weight equivalent)
- Token count per LLM call (prompt + completion)
- Number of tools available to the agent
- Max iterations per query (the reasoning loop depth)
- Queries per day (usage volume)

Output: daily + annual cost for agentic approach vs. workflow approach for the same task.

### Real Numbers from Cohort Demo

**Agent approach** (GPT-5 Opus equivalent, 10 tools, 10 iterations max):
- 100 users × 10 queries each = 1,000 queries/day
- Cost: ~₹75,000/day → ~₹1.7 crore/year

**Workflow approach** (same problem, no reasoning loop):
- Same 1,000 queries/day
- Cost: ~₹26,000/day → ~₹65 lakh/year

**Savings from switching agent → workflow: 64.9%**

This is not a theoretical estimate. The mentor's pre-100x consulting model was built on this finding: audit companies' agentic AI systems, identify unnecessary reasoning loops, convert them to LLM workflows, save 60–70% of AI costs, take a percentage of savings as fee.

### Why Agents Cost So Much More

Each iteration of a reasoning loop adds:
1. **Tokens**: The full conversation history (prompt + all previous observations) gets re-sent on every iteration. Context grows linearly with iterations.
2. **Latency**: Each LLM call adds round-trip time. 10 iterations = 10× the latency of a single call.
3. **Error accumulation risk**: Each iteration is a chance for the LLM to go off-track. More iterations = higher probability of compounding errors.

Formula: `Total tokens per query ≈ base_prompt_tokens × iterations + tool_output_tokens × tools_called`

The multiplication effect is why agents are 2–3× more expensive than workflows even at the same per-token rate.

### Cost Per Task Methodology

To calculate correctly:
1. **Measure, don't estimate**: Run 50–100 test queries through your agent. Log token counts per call (use `tiktoken` or your provider's dashboard).
2. **Separate input vs. output tokens**: Most providers charge output tokens at 3–5× input token rate.
3. **Account for failed iterations**: Agents don't always complete in the minimum iterations. Factor in average iterations, not max.
4. **Project at scale**: 100 users feels manageable. 10,000 users with the same architecture may be economically impossible.

### Model Tiering Strategy

Not all tasks require the most capable (most expensive) model. Tiering:

| Use case | Recommended model tier | Rationale |
|---|---|---|
| Intent classification, routing | Small/fast (Haiku, Llama-8B) | Simple classification, cheap at volume |
| Tool selection, argument extraction | Mid-tier (Sonnet, Llama-70B) | Needs reasoning, not creativity |
| Final response generation, complex reasoning | Large (Opus, GPT-4) | Quality matters here |
| Code generation, complex analysis | Large (Opus, GPT-4) | Accuracy critical |

The cohort decision rule: "Always start simple. In-context learning → prompt engineering → PEFT → full fine-tune → pre-training. Cost/complexity increases dramatically at each step."

Apply the same logic to model selection: start with the cheapest model that achieves acceptable quality.

## Key Variants / Extensions

### Jevons Paradox Applied to AI

Jevons Paradox (1865): When technology becomes more efficient, overall consumption of that resource increases, not decreases. Cheaper coal engines → more coal use, not less.

Applied to AI (from the final cohort lecture):
- "The cost of building software is going to zero."
- When building cost drops, more people build software.
- More software → more demand for people who can solve real problems, not just generate outputs.
- Cheaper AI → more AI use → higher total AI spend industry-wide, not less.

Implication for builders: AI cost efficiency doesn't reduce your cost pressure — it shifts where the value (and therefore the cost) concentrates. The expensive layer moves from "building" to "quality judgment and system design."

### The 95% Rule and Its Cost Implication

"95% of use cases can be solved with LLM chains + deterministic workflows."

Cost implication: If 95% of your use cases don't need agents, defaulting to agents for everything means paying agent-level costs for 95% of tasks that could run at workflow cost. At scale, this is the difference between a viable and unviable product.

The threshold test: Can you define all the steps in advance?
- Yes → LLM workflow (chains)
- No, and steps vary by query complexity → consider agents, but justify with measurement

### Caching as a Cost Lever

Redis caching of LLM responses for repeated queries can reduce cost non-linearly:
- If 30% of queries are identical or near-identical, caching eliminates those LLM calls entirely
- Cache hit = zero token cost
- Most effective for: FAQ-type queries, lookup-heavy agents, shared context across users

See: [[cost-optimization-patterns]]

## Examples

**Consulting model (mentor's pre-100x work):**
Companies built agents because they sounded powerful. Audit revealed: 60–70% of agent iterations were unnecessary — the LLM was reasoning about things that could be predetermined. Converting to deterministic workflow with LLM only at decision nodes → 60–70% cost reduction. Mentor charged a percentage of savings as his consulting fee.

**Agent vs. workflow cost decision in practice:**
A customer support agent that follows a fixed tree (order status → check DB → return result) does not need a reasoning loop. A research agent that must decide which sources to query, in what order, based on what it finds, does. Build the deterministic version first. Add the loop only when you can measure it improves quality.

## Connections
Related concepts: [[95-percent-rule]], [[agentic-loop]], [[cost-optimization-patterns]], [[agent-vs-workflow-economics]], [[llm-decision-tree]], [[guardrails-architecture]]
Introduced by: [[100x-cohort7-module3-agents]] (L8 — Connecting Dots final lecture)

## Open Questions / Unknowns
- As model prices drop (consistent trend), will the workflow vs. agent cost differential shrink? Or will the token volumes from longer context windows offset the price reduction?
- The 64.9% figure is from a specific demo with specific parameters. How does the savings rate change with task complexity and loop depth?
- When will native caching at the provider level (Anthropic prompt caching, OpenAI) make the cost calculation materially different?
