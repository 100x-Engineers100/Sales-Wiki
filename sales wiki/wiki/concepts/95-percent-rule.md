---
title: "The 95% Rule: When NOT to Use Agents"
type: concept
tags: [ai, agents, decision-framework, workflows, cost, 100x-cohort7]
source_count: 1
---

## Definition
95% of use cases can be solved with LLM chains + deterministic workflows. You don't need agents. The 95% Rule is a forcing function: default to NOT using agents, and justify the agent approach with measurement before introducing it.

## Why It Matters
Agents are expensive and non-deterministic. They cost more per task and are less reliable than well-designed LLM workflows for predictable tasks. Finance teams will ask about costs. Users will ask about reliability. Adding agents because they "sound impressive" is a technical mistake that becomes a business problem.

## The Test

**Use LLM workflows (chains) when:**
- You can define all the steps in advance
- The number of steps is fixed regardless of query complexity
- The task is predictable and repeatable

**Consider agents when:**
- You CANNOT define all the steps in advance
- The number of steps varies by query complexity
- The task requires dynamic re-planning based on what is discovered mid-execution
- AND you can MEASURE that the agent approach outperforms the non-agent approach

## The Escalation Ladder (start simple, add complexity only when needed)

```
1. In-context learning (zero-shot / few-shot)
        ↓ still failing?
2. Add deterministic code (rules, validation, routing)
        ↓ still failing?
3. LLM chains (multi-step, but pre-defined steps)
        ↓ still failing AND steps are genuinely dynamic?
4. Agentic reasoning loop (agents)
```

Never skip steps. Most teams jump to step 4 and wonder why costs are high and reliability is low.

## Key Principle
**Measure before you graduate.** Don't introduce the agentic loop because you think it's better. Introduce it when you can show a metric that improved: task completion rate, accuracy, user satisfaction — compared to the LLM chain baseline.

> "Don't introduce agents because they sound impressive. Your finance team will ask about costs. Your users will ask about reliability."

## Connections
Related concepts: [[augmented-llm]], [[agentic-loop]], [[agent-failure-modes]], [[llm-decision-tree]], [[agent-production-pillars]]
Introduced by: [[100x-cohort7-module3-agents]]
