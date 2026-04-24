---
title: "Multi-Agent Systems"
type: concept
tags: [agents, multi-agent, orchestration, 100x-cohort7]
source_count: 1
---

## Definition
A multi-agent system is an architecture in which multiple specialized AI agents collaborate on a task, each handling a distinct sub-domain or function. Instead of one agent doing everything, work is divided and coordinated across a network of agents with defined roles.

## Why It Matters
A single LLM-based agent has a finite context window, limited tool access, and no parallelism. Multi-agent systems break through these limits: specialized agents can run in parallel, accumulate deeper expertise in their domain, and hand off outputs cleanly between stages. The result is better quality, lower cost per task, and the ability to tackle problems that exceed any single agent's capability.

## How It Works
A multi-agent system requires:
1. **Agent definitions** — each agent has a role, tools, and a bounded scope
2. **Coordination mechanism** — how agents communicate (shared memory, message passing, or a central orchestrator)
3. **Task decomposition** — the incoming problem is broken into sub-tasks aligned to agent roles
4. **Result aggregation** — individual outputs are combined into a coherent final response

## Key Variants / Extensions
The 6 coordination patterns (see [[agentic-patterns]] for full detail with when-to-use logic):

| Pattern | Description |
|---------|-------------|
| Manager-Worker | Central manager decomposes and reviews; workers execute |
| Handoff | Autonomous specialists pass context sequentially |
| Routing | Classifier routes incoming requests to the right specialist |
| Parallelization | Independent tasks run simultaneously; results aggregated |
| Orchestrator-Worker | Orchestrator decomposes; workers execute autonomously |
| Evaluator-Optimizer | Generate → evaluate → improve loop |

**Frameworks:** LangChain, CrewAI, AutoGen (Microsoft), LangGraph, OpenAI Swarm, LangFlow

## Examples
- Research pipeline: Web researcher → Summarizer → Fact-checker → Writer (sequential handoff)
- Code review system: Linter agent + Security agent + Performance agent running in parallel → Aggregator
- Customer support: Router classifies intent → Billing agent or Technical agent handles it

## Connections
Related concepts: [[agentic-patterns]], [[agentic-loop]], [[react-framework]], [[programmatic-tool-calling]], [[agent-production-pillars]]
Introduced by: [[100x-cohort7-module3-agents]]

## Open Questions / Unknowns
- At what number of agents does coordination overhead exceed the parallelism benefit?
- How to handle state consistency when multiple agents modify shared context simultaneously?
