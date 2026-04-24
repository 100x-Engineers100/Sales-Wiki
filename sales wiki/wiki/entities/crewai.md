---
title: "CrewAI"
type: entity
entity_type: tool
tags: [agents, multi-agent, framework, 100x-cohort7]
---

## Overview
CrewAI is an open-source Python framework for building multi-agent systems using a crew metaphor: each agent has a role, goal, and backstory; a crew coordinates agents to accomplish a task. It is one of the primary multi-agent frameworks covered in the 100x Module 3 curriculum alongside AutoGen and LangGraph.

## Key Contributions / Role
- Popularized role-based agent design (each agent has a defined role, goal, backstory)
- Implements Manager-Worker and Orchestrator patterns natively
- Lower abstraction than LangChain — more explicit about agent responsibilities
- Used in cohort Module 3 code path for building first multi-agent systems

## Connections
Related entities: [[langchain]], [[autogen-microsoft]], [[langraph]]
Appears in sources: [[100x-cohort7-module3-agents]]
Related concepts: [[multi-agent-systems]], [[agentic-patterns]]

## Notes
CrewAI's role metaphor (engineer, researcher, writer) maps well to Manager-Worker and Handoff patterns. The framework handles sequential and parallel execution modes. Decision guide: use CrewAI when you want explicit role definitions; use LangGraph when you need stateful, graph-based control flow.
