---
title: "OpenAI Swarm"
type: entity
entity_type: tool
tags: [agents, multi-agent, framework, openai, 100x-cohort7]
---

## Overview
OpenAI Swarm is a lightweight, experimental open-source framework from OpenAI for multi-agent orchestration. It focuses on simplicity: agents hand off control to each other via a straightforward handoff mechanism, with minimal abstraction overhead. Released as an educational/exploratory framework, not production infrastructure.

## Key Contributions / Role
- Demonstrates the Handoff pattern cleanly: agents can pass control and context to other agents
- Very low abstraction compared to LangChain/CrewAI — close to raw OpenAI API calls
- Forces clarity in agent role design: each agent must have a well-defined scope for handoffs to work
- Used in cohort as a reference implementation for the Handoff pattern

## Connections
Related entities: [[langchain]], [[crewai]], [[autogen-microsoft]]
Appears in sources: [[100x-cohort7-module3-agents]]
Related concepts: [[agentic-patterns]], [[multi-agent-systems]]

## Notes
OpenAI explicitly positioned Swarm as exploratory and not recommended for production use. Its value is pedagogical: it shows how multi-agent systems work at the API level, without a framework hiding the mechanics. For production multi-agent work, OpenAI recommends their Assistants API or third-party frameworks.
