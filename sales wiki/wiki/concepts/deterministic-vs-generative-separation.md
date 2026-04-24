---
title: "Deterministic vs. Generative Separation"
type: concept
tags: [ai, agents, architecture, reliability, productivity]
source_count: 2
---

## Definition
A design principle for AI systems: LLMs (generative) should handle only tasks that require judgment, synthesis, or reasoning. Scripts and code (deterministic) should handle everything else — file reads, API calls, timestamp comparisons, data transformation. Mixing the two layers causes unpredictable failures and erodes trust in the system.

## Why It Matters
When you push deterministic work through an LLM (e.g., "compare these two timestamps and tell me which is later"), things break in unpredictable ways. The LLM might hallucinate a result. It might get it right 95% of the time and wrong 5%. You stop trusting the system. Once you separate the layers correctly, the system becomes something you can actually depend on.

## How It Works

**Generative layer (LLM handles):**
- Synthesis and summarization
- Prioritization and judgment calls
- Drafting written content
- Reasoning about what to do next (agent thoughts)
- Interpreting ambiguous input

**Deterministic layer (scripts/code handle):**
- Reading files
- Calling APIs with known parameters
- Comparing timestamps, numbers
- Sending messages, writing to databases
- Executing workflows with known steps

**The rule of thumb (rsarver):**
> "LLMs handle judgment, and scripts handle everything else."

**Applied to agent design:**
In a ReAct agent, the reasoning step (Thought) is generative; the action execution (calling the tool) is deterministic. The Switch node in n8n handles deterministic routing based on the LLM's decision.

**Applied to the LLM wiki:**
The LLM writes and maintains wiki pages (generative). File system operations, index updates, log appends are structured operations that follow defined rules (deterministic protocol, even if executed by the LLM).

## Key Variants / Extensions
- **Predictability Generation Engine**: emailhuynhhuy's pattern — AI acts as a router to find pre-validated execution scripts/templates. 100% reliable for known cases. LLM never generates what should be deterministic.
- **Pointer-based retrieval**: Finding a pre-validated artifact vs. generating one from scratch. Maximizes reliability.

## Examples
- Stella (rsarver): Python scripts handle email parsing, file writes, API calls. LLM handles synthesis, prioritization, drafting.
- n8n agent: Switch node (deterministic routing) + Model node (LLM reasoning) clearly separated
- This wiki: CLAUDE.md defines deterministic conventions (file naming, log format, index updates). LLM applies judgment in synthesis.

## Connections
Related concepts: [[ai-agents-react]], [[ai-memory-architecture]], [[llm-wiki-pattern]], [[opt-framework]]
Introduced by: [[rsarver-ai-chief-of-staff]], [[100x-cohort7-module3-agents]]

## Open Questions / Unknowns
- Where exactly is the right boundary for novel cases — when generative synthesis should be allowed to "promote" a result into the deterministic layer?
- How do you test deterministic AI system reliability?
