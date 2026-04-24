---
title: "AI Memory Architecture"
type: concept
tags: [ai, agents, memory, persistence, knowledge-management]
source_count: 2
---

## Definition
The design of persistent memory systems for AI agents — enabling them to retain and accumulate context across sessions rather than starting fresh each time. The core problem: LLMs have no native long-term memory. Session context disappears when the conversation ends.

## Why It Matters
Without persistent memory, AI agents have amnesia. They can be capable in the moment but fail when they need to remember a commitment from last week, track a relationship over months, or build on prior work. Memory transforms an assistant from a tool you use to a collaborator that knows your context.

## How It Works

**Two-layer architecture (rsarver / Stella pattern):**
1. **Daily notes** (`memory/YYYY-MM-DD.md`): Raw append-only log of everything that happens each day — meetings, decisions, tasks, context. Written automatically by script.
2. **Long-term memory** (`MEMORY.md`): Curated synthesis. Key people, active projects, lessons learned, decisions made. Periodically synthesized from daily notes by the LLM itself. Read on startup.

**Wiki pattern memory (Karpathy):**
- The wiki itself IS the memory. Entity pages, concept pages, synthesis pages persist and compound across sessions.
- `log.md` provides timeline/history context.
- The LLM reads relevant pages at query time — no RAG needed at moderate scale.

**Key design principles:**
- **Flat markdown > database**: Human-readable, auditable, git-backable. Operator can see exactly what the assistant knows, edit it directly, trust it more.
- **Separation of raw and synthesized**: Raw logs (daily notes) vs. curated synthesis (MEMORY.md) serve different roles. Don't mix them.
- **Read on startup**: The assistant must load memory at session start to orient itself. Without this step, each session starts cold.

## Key Variants / Extensions
- **Personal CRM memory**: Per-person markdown files tracking relationship history, commitments, context
- **Project memory**: Per-project context that accumulates over sprints/iterations
- **Decision log**: Append-only record of decisions made and the reasoning behind them
- **MEMORY.md pattern**: Single curated file with key people, projects, lessons — the "loading fast path" on startup

## Examples
- Stella (rsarver's AI chief of staff): daily notes + MEMORY.md → comprehensive context across fundraise, board work, portfolio
- This wiki vault: wiki pages as persistent memory for AI/GenAI knowledge
- Memory RAG (100x Module 2): specific technique for injecting persistent memory into RAG systems

## Connections
Related concepts: [[llm-wiki-pattern]], [[ai-agents-react]], [[ai-chief-of-staff-pattern]], [[retrieval-augmented-generation]]
Introduced by: [[rsarver-ai-chief-of-staff]], [[100x-cohort7-module2-llm]], [[karpathy-llm-wiki-pattern]]

## Open Questions / Unknowns
- How does the daily note synthesis trigger work (cron? manual? end of session)?
- What is the right granularity for MEMORY.md entries vs. daily notes?
- How to handle memory that becomes stale or incorrect over time?
