---
title: "AutoGen (Microsoft)"
type: entity
entity_type: tool
tags: [agents, multi-agent, framework, microsoft, 100x-cohort7]
---

## Overview
AutoGen is an open-source multi-agent framework from Microsoft Research that enables building systems where multiple conversational agents collaborate to solve tasks. Known for its conversable agent pattern: agents can converse with each other, with humans, or with code execution environments.

## Key Contributions / Role
- Introduced the "conversable agent" abstraction — agents communicate via natural language messages
- Strong integration with code execution: agents can write and run code, observe results, iterate
- Human-in-the-loop (HITL) support is a first-class feature
- Used as a reference implementation for the Orchestrator-Worker pattern in the cohort

## Connections
Related entities: [[langchain]], [[crewai]], [[langraph]]
Appears in sources: [[100x-cohort7-module3-agents]]
Related concepts: [[multi-agent-systems]], [[agentic-patterns]], [[agent-failure-modes]]

## Notes
AutoGen's strength is code-heavy multi-agent workflows where agents need to write and execute code to accomplish tasks. The Devin case study (broken HITL, context anxiety) is referenced in [[agent-failure-modes]] — AutoGen-style HITL loops are exactly what can break when not designed correctly.
