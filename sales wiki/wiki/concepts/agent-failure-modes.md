---
title: "Agent Failure Modes (Devin + Air Canada Case Studies)"
type: concept
tags: [ai, agents, failure, production, case-study, liability, 100x-cohort7]
source_count: 1
---

## Definition
Real-world agent failures mapped to the SPAORL loop. Every agent failure can be diagnosed by identifying which loop step broke. Two canonical case studies: Cognition's Devin (broken sensing + broken HITL) and Air Canada (broken sensing + non-deterministic policy enforcement).

## Why It Matters
**Real data from the cohort:**
- MIT Study 2025: only 5% of AI agents built in companies reach production
- Carnegie Mellon study: best LLMs average only ~24% task completion across real-world tasks (Finance: ~0%, PM: ~39%, SWE: ~30-37%)
- Gartner: 40%+ of AI consulting projects will be canceled by 2027

Models people think can automate their jobs can only complete ~1 in 4 real-world tasks. This doesn't mean agents are useless — it means you need to know WHERE they fail and design around it.

**Liability:** You are now building systems that can be attacked, exploited, or litigated against. After Air Canada, US and Canadian companies started pushing AI liability onto vendors. Read every contract carefully.

## The Two Canonical Case Studies

### Case Study 1 — Cognition's Devin
**What it was:** "World's first AI software engineer." Raised at ~$400M valuation. Reality: completes ~3 out of 20 tasks (under 15%). These are average/below-average difficulty tasks.

**The assessment:** Not a failure of intelligence (Cognition's founders are Math Olympiad winners). The problem is fundamental to how agents work today.

**Finding 1 — Context Anxiety (SENSE step):**
Sonnet 4.5 is "aware of its context window." As it approaches limits, it takes shortcuts, summarizes prematurely, leaves tasks incomplete. Behaviorally identical to an overloaded human with too many tabs open.
*Fix: sub-agents + skills — offload execution so main agent's context stays clean; return only the most relevant data to the orchestrator.*

**Finding 2 — Broken Human-in-the-Loop (OBSERVE step):**
Devin checked in only at planning, then executed the entire task autonomously. Built a landing page without asking for brand guidelines, colors, logo — then presented a wrong finished product. Wasted tokens, wasted cost, wrong output.
*Fix: after planning and after each major action, pause and verify with the human. OBSERVE should be active throughout, not just at the start.*

**Finding 3 — Sensing Broken (SENSE step):**
Devin received GitHub issues and started building without reading the existing codebase. Implemented features that already existed, created duplicate code, bloated codebase, degraded quality.
*Root cause: to save tokens, Devin didn't pull repository context. Assumption: issue ticket has all necessary details. For most real-world usage, that assumption is wrong.*

---

### Case Study 2 — Air Canada
**What happened:** Customer support chatbot confidently stated a bereavement discount existed. It didn't. Customer purchased ticket, was denied discount, sued. Air Canada's defense: "The chatbot is a separate entity, we're not responsible." Court rejected this. Air Canada ordered to pay damages.

**Root cause mapped to SPAORL:**
1. SENSE: Agent had no relevant policy data in knowledge base. Hallucinated confidence from general training data.
2. OBSERVE: LLM layer is non-deterministic; system prompt saying "don't give information not in the database" can still be overridden by RLHF's agreeable tendencies.

**The fundamental mistake:** Using the LLM layer to enforce policy. LLMs cannot reliably enforce policy through prompts.

**The fix (deterministic architecture):**
```
[User: "Do you offer bereavement discounts?"]
  → Deterministic code checks policy database
  → Not found → return "We don't offer this" (code, not LLM)
  → Found → retrieve policy → pass to LLM for language generation only
```

---

## The Diagnostic Framework
When any agent fails, map to SPAORL:
- **SENSE:** Did the agent have the right context before starting?
- **PLAN:** Was the plan logical and well-scoped?
- **ACT:** Did the action match the plan?
- **OBSERVE:** Did the agent check whether output matched expectations?
- **REFLECT:** Did the agent learn and adjust, or barrel forward?

If you can identify which step failed, you can fix it. If you just see "wrong output," you'll never fix it reliably.

## Connections
Related concepts: [[agentic-loop]], [[guardrails-architecture]], [[hallucination-formula]], [[95-percent-rule]], [[agent-production-pillars]]
Introduced by: [[100x-cohort7-module3-agents]]
