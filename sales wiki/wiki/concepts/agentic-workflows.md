---
title: "Agentic Workflows"
type: concept
tags: [agents, workflows, production, patterns, 100x-cohort7]
source_count: 1
---

## Definition
An agentic workflow is a production system that uses AI agents with dynamic reasoning loops to execute multi-step tasks — as opposed to a deterministic pipeline where every step is pre-programmed. The key distinction: in a workflow, all steps are defined in advance; in an agentic workflow, the agent can dynamically plan, change course, and handle situations not anticipated at design time.

## Why It Matters
Most real-world tasks require judgment: encountering unexpected data, needing to retry a failed step differently, or discovering mid-task that the approach needs to change. Deterministic pipelines break on edge cases. Agentic workflows handle them by giving the system the ability to reason and adapt. The tradeoff: higher cost, less predictability, more failure modes.

## How It Works
An agentic workflow wraps the [[agentic-loop]] (Sense → Plan → Act → Observe → Reflect → Adapt) in a production framework that includes:
- **Tool access:** The agent can call APIs, run code, query databases
- **Memory:** Episodic and semantic context persisting across steps
- **Guardrails:** Deterministic safety layer before LLM calls (see [[guardrails-architecture]])
- **Tracing:** Observability into every step for debugging
- **Evaluation:** Automated quality checks on agent outputs

## Key Variants / Extensions

### Agentic workflow vs deterministic pipeline
| | Deterministic Workflow | Agentic Workflow |
|--|----------------------|-----------------|
| Steps | Pre-defined | Dynamic |
| Handles edge cases | Needs explicit coding | Agent reasons through them |
| Cost | Predictable | Variable (loop iterations) |
| Debugging | Straightforward | Requires tracing |
| When to use | All steps definable in advance | Steps cannot all be pre-defined |

The **95% Rule:** Most problems are solvable with LLM chains + deterministic workflows. Agentic loops are justified only when you can measure that deterministic approaches fail (see [[95-percent-rule]]).

### The 6 production patterns
For multi-agent agentic workflows, the 6 coordination patterns (Manager-Worker, Handoff, Routing, Parallelization, Orchestrator-Worker, Evaluator-Optimizer) determine how agents are structured. See [[agentic-patterns]] for full detail.

### Production pillars (what makes agentic workflows production-ready)
The 5 pillars: Patterns / Sessions+Memory / Tracing / Debugging / Evaluation+Guardrails. See [[agent-production-pillars]].

## Examples
- **Customer support agent:** Routes incoming query → retrieves account info (RAG) → responds → if escalation needed, hands off to billing specialist agent
- **Research pipeline:** Web search → extract → summarize → fact-check → final synthesis; agent decides how many search iterations are needed
- **Code review workflow:** Agent uses tools (linter, security scanner, test runner), observes results, decides whether to flag or pass

## Connections
Related concepts: [[agentic-loop]], [[agentic-patterns]], [[agent-production-pillars]], [[guardrails-architecture]], [[95-percent-rule]], [[react-framework]]
Introduced by: [[100x-cohort7-module3-agents]]

## Open Questions / Unknowns
- At what complexity does an agentic workflow become harder to maintain than an equivalent deterministic pipeline?
- How to version control agentic workflows when the agent's plan is non-deterministic?
