---
title: "5 Pillars of Production-Ready Agents"
type: concept
tags: [ai, agents, production, tracing, evaluation, guardrails, 100x-cohort7]
source_count: 1
---

## Definition
Five non-negotiable capabilities every production agent system must have. Missing any one pillar makes the system unreliable, undebuggable, or unsafe at scale.

## The 5 Pillars

| # | Pillar | What it covers |
|---|---|---|
| 1 | **Patterns** | Choose the right multi-agent coordination pattern (Manager-Worker, Handoff, Routing, Parallelization, Orchestrator-Worker, Evaluator-Optimizer) |
| 2 | **Sessions + Memory** | Persist context across conversation turns and sessions; use sessions API to avoid re-injecting history manually |
| 3 | **Tracing** | Log every step — LLM call, tool call, reasoning trace, token count; custom traces + dashboard monitoring |
| 4 | **Debugging** | Use traces to diagnose exactly which SPAORL step failed; 90% of engineers who build agents don't know which step is broken |
| 5 | **Evaluation + Guardrails** | Deterministic layer before LLM; guard model (LlamaGuard/OpenAI Moderation); custom policies; 50 QA pairs as ground truth; PII handling; metrics |

## Why It Matters
Agent behavior is non-deterministic and varies with model capacity, reasoning ability, available tools, prompt engineering, and runtime context. You cannot predict what an agent will do. Without comprehensive logging and evaluation, you are flying blind. Production failures are silent — the agent generates fluent, confident outputs that are wrong.

## Key Details Per Pillar

**Pillar 3 — Tracing:** Log every decision, every tool call, every reasoning step. The trace is the primary debugging artifact. Without it, you cannot tell which SPAORL step failed. OpenAI Agents SDK includes tracing; also use Langfuse, Sentry, or custom dashboards.

**Pillar 4 — Debugging:** Systematic process: collect trace → map to SPAORL → identify broken step → fix that step only. Don't guess. Don't tweak prompts randomly.

**Pillar 5 key components:**
- Deterministic code layer BEFORE the LLM (for policy/financial/legal decisions)
- Guard model (LlamaGuard 22M params or OpenAI Moderation API) as first filter
- Custom intent classification for domain-specific scope enforcement
- 50 QA pairs as ground truth before building any evaluation framework
- PII anonymization/encryption before any LLM call
- Metrics: hallucination rate, task completion rate, boundary adherence, false positive/negative rate, recovery rate

## Connections
Related concepts: [[agentic-patterns]], [[guardrails-architecture]], [[llm-as-judge]], [[pii-handling]], [[agent-failure-modes]], [[agentic-loop]]
Introduced by: [[100x-cohort7-module3-agents]]
