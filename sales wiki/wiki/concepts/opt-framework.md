---
title: "OPT Framework (Operating Model → Processes → Tasks)"
type: concept
tags: [productivity, automation, llm, 100x-cohort7, workflow, business]
source_count: 2
---

## Definition
OPT (Operating Model, Processes, Tasks) — a three-level framework for systematically identifying automation opportunities within any business or workflow. Start from the top (what is the overall mission?) and decompose down to the specific tasks that can be automated with AI.

| Level | Definition | Example |
|---|---|---|
| Operating Model | The overall mission or goal | Resolve customer queries efficiently |
| Processes | Core functions that achieve the mission | Ticket management, FAQ handling |
| Tasks | Individual automatable actions | Answer FAQs, escalate complex issues |

The entry point for any AI productivity initiative: don't automate random things — map your operating model first, then find which tasks within which processes are AI-automatable.

## Why It Matters
Most people try to automate everything at once and burn out, or automate random things that don't compound. OPT forces top-down thinking: understand the mission, understand the processes that serve it, then identify the specific tasks within those processes that are good candidates for automation. The result is automation that compounds because each task connects to a meaningful process.

**Compound effect:** Automating 10% of your workflow per month = 60%+ more productive in 6 months.

## How It Works

**The three-level decomposition:**
1. **Operating Model** — What is the mission or goal of this function/team/company? State it in one sentence.
2. **Processes** — What are the 3-7 core functions that make the operating model run? These are repeatable sequences of work.
3. **Tasks** — Within each process, what are the individual atomic actions? Which of these have clear inputs, predictable outputs, and could be fully specified in a system prompt?

**Identifying an automatable task (OPT criteria):**
- Takes 15-30+ minutes and involves processing text or making decisions
- Has a clear, consistent input format
- Has a predictable output format
- Does not require real-time judgment or external action mid-process
- Can be fully specified in a system prompt

**The OPT system architecture (once a task is identified):**
```
User Input (UI) → API → Backend/LLM → Response → Display (UI)
```

**Implementation sequence:**
1. Map your operating model (what are you trying to achieve?)
2. List processes under the operating model
3. Identify one specific automatable task
4. Build: UI → API endpoint → LLM with system prompt → test full flow

## Key Variants / Extensions
- **Chained tasks**: Multiple OPT tasks in sequence = an automated workflow
- **Agentic OPT**: The task is given to an agent that decides how to execute it (multi-step reasoning)
- **No-code OPT**: Same framework, implemented via n8n or Zapier instead of code
- **OPT audit**: Periodically re-run the framework as AI capabilities evolve — tasks that weren't automatable 6 months ago may be now

## Examples
- Vikram (100x student): Operating Model = find high-ROI Facebook ads. Task = analyze individual ad performance. Result: analyzes 100+ ads in under 10 minutes.
- Sha Shanand (VP at SOTI): Operating Model = customer success. Process = lead qualification. Task = initial lead scoring. Result: 39% productivity increase.
- Design Lead at Apple: mapped design review process → automated majority of routine review tasks

## Connections
Related concepts: [[ppt-framework]], [[full-stack-llm-architecture]], [[vibe-coding]], [[llm-decision-tree]]
Introduced by: [[100x-cohort7-module2-llm]], [[100x-cohort7-module1-diffusion]]

## Open Questions / Unknowns
- What is the right granularity for "task" — too broad and it becomes a process; too narrow and it's trivial?
- How does OPT map to existing business process frameworks (e.g., BPMN, value stream mapping)?
