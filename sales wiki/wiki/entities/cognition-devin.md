---
title: "Cognition / Devin"
type: entity
entity_type: company
tags: [agents, case-study, failure-modes, 100x-cohort7]
---

## Overview
Cognition AI is the company behind Devin, marketed as the world's first AI software engineer. Devin was designed to autonomously complete full software engineering tasks — writing code, running tests, debugging, deploying. It became a landmark case study in AI agent failure modes when independent testing revealed it completed only 3 out of 20 tasks assigned to it.

## Key Contributions / Role
- **Landmark case study:** Devin documents three distinct failure modes that map directly to the [[agentic-loop]] (SPAORL)
- Failure 1 — **Context anxiety:** When the context window fills up with accumulated tool outputs, the agent's reasoning degrades. It starts making errors not present at step 1. (Observe/Reflect phase breaks down.)
- Failure 2 — **Broken human-in-the-loop:** Devin asked for clarification at wrong moments — not early enough to prevent costly wrong paths, not late enough to be useful. HITL timing is a design problem, not a "ask more questions" problem.
- Failure 3 — **Broken sensing:** Devin could not always accurately detect its own progress or environment state. If the Sense step is wrong, every subsequent step is wrong.
- Real-world stat: MIT 2025 study — only 5% of agents deployed in production successfully complete tasks at scale. CMU: 24% average task completion rate.

## Connections
Related entities: [[anthropic]]
Appears in sources: [[100x-cohort7-module3-agents]]
Related concepts: [[agent-failure-modes]], [[agentic-loop]], [[95-percent-rule]], [[guardrails-architecture]]

## Notes
The Devin case is not a story about a bad product — it's a story about honest measurement. The 3/20 completion rate was self-reported by independent researchers, not Cognition. The lesson: agent marketing runs far ahead of agent capability. The 95% rule exists precisely because of cases like Devin: when a deterministic workflow would have completed 18 of those 20 tasks reliably, the agentic approach was the wrong tool.
