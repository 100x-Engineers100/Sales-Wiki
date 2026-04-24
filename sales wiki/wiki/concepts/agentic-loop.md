---
title: "Agentic Loop (SPAORL)"
type: concept
tags: [ai, agents, react, reasoning, loop, 100x-cohort7]
source_count: 1
---

## Definition
The 6-step feedback cycle that defines what makes an AI agent an agent — not the tools it has, but its ability to continuously sense, plan, act, observe, reflect, and adapt. Also written as SPAORL or SPAOR. Without this loop, you have an LLM workflow (linear chain). With it, you have an agent (dynamic, self-correcting system).

## Why It Matters
The loop is the fundamental difference between a pipeline (fragile, breaks if one step fails) and an agent (resilient, re-plans after failure). Each step of the loop is also a diagnostic point — when an agent fails, you can identify exactly which step broke. The SPAORL framework is both the architecture and the debugging tool.

## How It Works

**The 6 steps:**

| Step | What happens | Common failure |
|---|---|---|
| **Sense** | Agent perceives the environment — reads the task, gathers context, understands user state | Insufficient context (Devin reading GitHub issues without the codebase) |
| **Plan** | Breaks vague goal into concrete steps; creates a strategy before acting | Vague goals → confident, useless work; plan too rigid to adapt |
| **Act** | Executes a step using tools — web search, code execution, API call, database query | Tool call with wrong parameters; tool not defined in system prompt |
| **Observe** | Inspects the output of the action — "did the search return useful results?" | Skipping observation to save tokens; assuming success without checking |
| **Reflect** | Internal reasoning about the observation — "my original plan is insufficient, I need to add a step" | Missing entirely from many agent implementations |
| **Adapt** | Modifies the plan based on reflection; updates strategy for next iteration | Barreling forward without incorporating what was learned |

**The loop in code terms (simplified):**
```
while not (finished or max_iterations_reached):
    sense()           # load current context + environment
    plan()            # decide next action
    act()             # execute tool/function
    observe()         # inspect result
    reflect()         # reason about whether plan needs updating
    adapt()           # update plan / context
```

**Stop conditions:**
1. Max iterations — hard guardrail to prevent infinite loops and control cost
2. Goal achievement — agent signals completion via a "finish" action

**The Human Researcher analogy:** Agents must behave like human researchers. You don't just type one query and stop. You search, read, realize you don't understand a term, go down a rabbit hole, come back with better understanding. The Reflect + Adapt steps are what distinguish a researcher from a search engine.

## Key Variants / Extensions
- **SENSE → PLAN → ACT → OBSERVE → REFLECT** (abbreviated SPAOR — some formulations drop explicit Adapt as redundant with reflect)
- **ReAct** (Thought→Action→Observation) — subset of SPAORL; maps to Plan→Act→Observe; Reflect and Adapt are implicit in the Thought step of the next iteration
- **Human-in-the-loop**: adding checkpoints after PLAN or ACT where a human approves before continuing; critical for high-stakes agents (see [[agent-failure-modes]])

## Examples
- n8n manual ReAct agent: Set (Sense/init) → Model (Plan: output JSON) → Switch (Act: route to tool) → SerpApi (Observe) → Set (Reflect+Adapt: update context) → loop
- Devin failure mapped: Sense broken (no codebase read) → Act without good context → Observe missing (no HITL mid-execution)
- Research agent: Sense (load topic) → Plan (generate search queries) → Act (search) → Observe (read results) → Reflect (identify gaps) → Adapt (add new search terms)

## Connections
Related concepts: [[react-framework]], [[augmented-llm]], [[agentic-patterns]], [[agent-failure-modes]], [[95-percent-rule]]
Introduced by: [[100x-cohort7-module3-agents]]

## Open Questions / Unknowns
- How do you instrument Reflect and Adapt steps for observability? These are internal reasoning steps with no external side effects.
- Is there a minimum number of iterations before an agent should be allowed to call "finish"?
