---
title: "Production Failure Analysis — Devin and Air Canada as First-Principles Lessons"
type: synthesis
sources: [100x-cohort7-module3-agents]
tags: [agents, failure-modes, production, case-study, 100x-cohort7]
---

## Question / Framing
What do the Devin and Air Canada AI failures teach about building production AI systems? What structural lessons apply to any builder, regardless of domain?

## Analysis

### Case 1: Devin (Cognition AI) — the agentic loop failure
**What happened:** Devin was deployed as an autonomous software engineer. Independent researchers tested it on 20 real-world software tasks. It completed 3 of 20.

**The three failure modes, mapped to the agentic loop (SPAORL):**

| Failure mode | Which loop step breaks | Root cause | Fix |
|-------------|----------------------|------------|-----|
| **Context anxiety** | Observe / Reflect | Context window fills with accumulated tool outputs → reasoning degrades across iterations | Context management: summarize+compress long conversations, sliding window, or task decomposition |
| **Broken HITL** | Plan / Act | Human-in-the-loop asked for input at wrong moments — too late to prevent costly wrong paths | HITL timing is a design decision: define checkpoints upfront, not ad-hoc |
| **Broken sensing** | Sense | Agent cannot accurately detect its own environment state or progress | Sensing reliability = foundational; if Sense is wrong, every subsequent step is wrong |

**The SPAORL lesson:** Every step is a failure surface. A pipeline that looks correct can fail because of one broken step upstream. Sense is the most critical — garbage in, garbage out applies to agent sensing just as it does to data.

### Case 2: Air Canada — the liability failure
**What happened:** Air Canada deployed an LLM-based customer service agent. The agent told a customer it could receive a bereavement discount on a flight already taken — a policy that didn't exist. Air Canada argued in court it wasn't responsible for what the chatbot said. The court ruled Air Canada liable. Air Canada had to honor the discount.

**The structural failure:** Air Canada used an LLM to *enforce policy and provide binding guarantees* — exactly the use case LLMs should never be trusted for. LLMs are probabilistic. Policy and financial commitments require deterministic guarantees.

**The mandate that follows:**
Any system that can make a legally binding, financial, or policy-level commitment MUST have a deterministic layer before the LLM. The LLM can help understand the question. The answer must come from a deterministic policy engine.

### First-principles lessons that generalize

| Lesson | Applied principle |
|--------|------------------|
| **Never let an LLM enforce a policy** | Deterministic layer for any binding decision (see [[guardrails-architecture]]) |
| **Context window is a liability at scale** | Architect for context budget from day one (see [[context-economy]]) |
| **HITL timing is a design decision** | Define human checkpoints upfront as part of workflow design |
| **Sense reliability is foundational** | Test and monitor the sensing layer as rigorously as the generation layer |
| **Agents create legal exposure** | Every LLM-facing customer interaction needs deterministic policy enforcement |
| **Marketing ≠ production capability** | Measure completion rate, not benchmark claims |

### The failure formula
`Agent failure = Broken step × Magnitude of downstream consequence`

Devin: broken sensing → all code produced on wrong assumptions → wasted engineering cycles.
Air Canada: no deterministic policy layer → wrong policy stated → legal liability.

The magnitude of downstream consequence is what makes proper guardrails non-negotiable for consumer-facing agents.

## Conclusions
1. Devin proves that agentic loops fail in predictable places (Sense, HITL timing, context accumulation). Design against these failure points explicitly.
2. Air Canada proves that probabilistic LLMs must never be the sole enforcement mechanism for policies, contracts, or financial commitments. Always have a deterministic layer.
3. The combination of these two cases defines a production agent safety checklist: robust sensing, bounded context, defined HITL checkpoints, deterministic policy enforcement.
4. Liability transfers to the builder. "The AI did it" is not a legal defense.

## Contradictions
None — both cases reinforce the same direction (deterministic guardrails, bounded context, explicit HITL design).

## Further Research
- As AI legal frameworks evolve, will there be industry-standard liability waivers for AI agents, or will builder liability remain?
- Are there counter-examples where agentic approaches succeeded in high-stakes domains (healthcare, finance) and what guardrail architectures made that possible?
