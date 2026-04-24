---
title: "Agentic Patterns (6 Multi-Agent Coordination Patterns)"
type: concept
tags: [ai, agents, multi-agent, architecture, orchestration, 100x-cohort7]
source_count: 1
---

## Definition
Six architectural patterns for coordinating multiple AI agents. Each pattern solves a different coordination problem. Pattern selection depends on task structure — not personal preference. Using the wrong pattern adds cost and complexity without benefit.

## Why It Matters
Agents don't just scale vertically (more capable single agent) — they scale horizontally (specialized agents working together). But multi-agent coordination introduces new failure modes: communication overhead, context pollution, cascading errors, orchestration complexity. The six patterns give you a decision framework for when and how to coordinate.

## How It Works

### Pattern 1 — Manager-Worker
**Structure:** A manager agent coordinates and delegates tasks to specialized worker agents. Manager maintains oversight and enforces process compliance. Can block worker output if requirements aren't met.

**When to use:** When you need strict process adherence. Manager acts like a traditional supervisor — workers must comply with organizational standards. Good for regulated industries (legal, healthcare, finance) where audit trails and compliance are required.

**Key characteristics:**
- Centralized control and oversight
- Manager can reject/retry worker outputs
- Clear reporting structure
- Easier to debug than decentralized patterns

**Analogy:** Office manager who sits on workers' heads and won't let them leave until work meets standards.

---

### Pattern 2 — Handoff
**Structure:** Agents pass control to each other sequentially without central coordination. Each agent decides autonomously whether to complete the task or hand off to another specialist.

**When to use:** When agents have different specializations and can self-coordinate without a supervisor. More flexible than Manager-Worker; less control.

**Key characteristics:**
- No central orchestrator
- Each agent decides its own exit condition (complete vs. hand off)
- Suitable when specialists trust each other
- Harder to audit than Manager-Worker

**Analogy:** Specialists who autonomously decide when their expertise is sufficient vs. when to refer to a colleague.

---

### Pattern 3 — Routing
**Structure:** A classification agent analyzes incoming requests and routes them to the most appropriate specialist agent based on the nature of the query.

**When to use:** When you have well-defined categories of requests and need to direct traffic efficiently. Reduces latency by avoiding unnecessary agent hops.

**Key characteristics:**
- Semantic or rule-based routing logic
- Critical for multi-domain applications
- Can use small classification model (cheap, fast) as router
- Routing errors cascade — quality of classifier determines system quality

**Example:** Customer support system: billing questions → billing agent, technical issues → tech support agent, refunds → policy agent.

---

### Pattern 4 — Parallelization
**Structure:** Multiple agents work simultaneously on independent aspects of a problem. Results are aggregated at the end for a comprehensive solution.

**When to use:** When tasks can be decomposed into truly independent subtasks and speed matters. Research tasks (analyze 5 competitors simultaneously), multi-perspective analysis (get 3 expert opinions on the same document).

**Key characteristics:**
- Tasks must be genuinely independent (no dependencies between parallel agents)
- Need result aggregation logic (how to combine potentially conflicting outputs)
- Faster than sequential for independent tasks
- Higher cost (multiple LLM calls running simultaneously)

**Warning:** Don't parallelize tasks with dependencies. The aggregation logic must handle partial failures.

---

### Pattern 5 — Orchestrator-Worker
**Structure:** Similar to Manager-Worker but workers are more autonomous. Workers have well-defined, repeatable tasks and don't need constant supervision from the orchestrator.

**When to use:** When tasks are well-defined and repeatable but you still need coordination. Workers can be trusted to complete their tasks without the orchestrator validating every step.

**Key characteristics:**
- Orchestrator manages high-level workflow; workers manage their own execution
- Less overhead than Manager-Worker
- Less control than Manager-Worker
- Suitable for mature workflows where worker behavior is predictable

**Distinction from Manager-Worker:** Manager validates and can block; Orchestrator delegates and trusts.

---

### Pattern 6 — Evaluator-Optimizer
**Structure:** Two agents work in an iterative improvement cycle — one generates output, the other evaluates it and provides feedback. The generator then improves based on feedback. Loop continues until quality threshold is met.

**When to use:** When output quality needs to be maximized iteratively. Code review (generator writes code, evaluator reviews and suggests improvements), content generation (writer drafts, editor refines).

**Key characteristics:**
- Generates high-quality output through iteration
- Requires clear evaluation criteria (the evaluator must know what "good" looks like)
- Can loop many times — need stop condition (max iterations OR quality threshold)
- Higher cost per final output but often worth it for quality-critical tasks

---

## Decision Guide

| If you need... | Use |
|---|---|
| Strict process compliance + audit trail | Manager-Worker |
| Flexible specialist coordination | Handoff |
| Traffic routing by query type | Routing |
| Speed + independent subtasks | Parallelization |
| Repeatable workflows + light oversight | Orchestrator-Worker |
| Maximum output quality via iteration | Evaluator-Optimizer |

## Key Variants / Extensions
- Patterns can be **composed**: a Routing pattern that routes to specialized Manager-Worker sub-systems
- **Hybrid architectures**: e.g., Orchestrator-Worker at the top level with Evaluator-Optimizer within each worker
- **OpenAI Swarm framework**: lightweight framework specifically designed for Handoff and Routing patterns

## Examples
- GitHub issue handler (student project): Issue Analysis Agent → Reproduction Agent → Communicator Agent (Handoff pattern)
- Anthropic user research agent: Planning Agent + Interviewing Agent + Analysis Agent (Orchestrator-Worker — each has defined role, orchestrator manages the flow)
- Content moderation: Router classifies content type → specialist agents handle each category (Routing)
- Marketing copy generator: Writer agent → Evaluator agent (Ogilvy criteria) → Writer revises → repeat (Evaluator-Optimizer)

## Connections
Related concepts: [[agentic-loop]], [[react-framework]], [[augmented-llm]], [[agent-production-pillars]], [[multi-agent-systems]]
Introduced by: [[100x-cohort7-module3-agents]]

## Open Questions / Unknowns
- When does Handoff degrade into an uncontrolled "hot potato" where no agent takes ownership?
- How do you implement graceful degradation in Parallelization when one worker fails mid-execution?
