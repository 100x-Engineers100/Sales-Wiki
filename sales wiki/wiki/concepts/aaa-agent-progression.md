---
title: "AAA Agent Progression: Assisted → Accelerated → Autonomous"
type: concept
tags: [ai, agents, autonomy, production, reliability]
source_count: 1
---

## Definition
Not every system needs to be a fully autonomous agent. The AAA Progression is a spectrum for designing and deploying AI agents: Assisted (human approves every action), Accelerated (human reviews at checkpoints), Autonomous (LLM pursues goals independently). The right tier depends on the reliability of the underlying system layers.

## Why It Matters
Most teams jump to "autonomous agent" as the target. This is wrong. Full autonomy requires high reliability at every layer — tools, structured I/O, retrieval, context management, memory. If any layer is unreliable, autonomy amplifies the failures. The AAA progression gives teams a disciplined path to autonomy.

**The core principle:**
> "Increase autonomy only as you increase the reliability of each underlying layer."

## How It Works

**Assisted — Human in the loop for every action:**
- LLM helps a human do their job
- Tool calls require human approval
- "Here's what I'd do — shall I proceed?"
- Human stays in the loop for every action
- When to use: novel domains, high-stakes decisions, early deployment when reliability is unproven

**Accelerated — Human oversight at checkpoints:**
- LLM executes multi-step workflows autonomously
- Human reviews at critical decision points (not every action)
- "I've drafted the email and found three flights. Want me to book the cheapest one?"
- Plans and acts, pauses at branch points
- When to use: well-defined workflows, medium-stakes, reliability demonstrated on sub-tasks

**Autonomous — LLM pursues goals independently:**
- LLM pursues a goal independently — invokes tools, manages memory, handles errors
- Only escalates when hitting a genuine blocker
- "You asked me to research competitors and prepare a briefing. Here's the document. I found a discrepancy in their Q2 numbers — flagged on page 3."
- When to use: well-defined goals, high reliability at every layer, established trust via Assisted/Accelerated track record

**Most production systems today:** Assisted or Accelerated. Full autonomy is still rare because it requires reliability across all seven pieces.

## Key Variants / Extensions
- **Human-on-the-loop**: agent acts autonomously but human can intervene anytime (between Accelerated and Autonomous)
- **Confidence-gated autonomy**: agent is autonomous when confidence is high, escalates when below threshold
- **Staged rollout**: deploy Assisted → Accelerated → Autonomous on the same task as reliability is proven

## Examples
- rsarver's Stella: Assisted for email drafts (queued for review), Autonomous for daily briefs and meeting prep
- Code agent: Assisted for production deployments, Autonomous for test-writing and refactoring
- 100x Module 3 n8n agent: starts as Assisted (human triggers), path toward Autonomous with guardrails

## Connections
Related concepts: [[ai-agents-react]], [[agent-evaluation]], [[agentic-workflows]], [[deterministic-vs-generative-separation]]
Introduced by: [[100x-cohort7-module3-agents]]

## Open Questions / Unknowns
- What specific reliability thresholds justify moving from Accelerated to Autonomous?
- How do you measure reliability at each layer (tools, retrieval, context, memory) before promoting to autonomy?
