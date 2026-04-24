---
title: "LangChain"
type: entity
entity_type: tool
tags: [agents, llm, framework, 100x-cohort7]
---

## Overview
LangChain is an open-source Python and JavaScript framework for building applications with LLMs. It provides abstractions for chains, agents, tools, memory, and retrieval — enabling developers to compose LLM-powered applications from reusable components. LangChain also produces LangGraph (stateful agent applications) and LangSmith (tracing/observability).

## Key Contributions / Role
- Popularized "chain" thinking for LLM applications: sequence LLM calls with tools and memory
- Introduced the concept of agent frameworks to a broad developer audience
- LangGraph: extension for stateful, graph-based agent workflows (separate entity)
- LangSmith: tracing and evaluation product from LangChain Inc.
- Used in cohort examples for RAG pipelines and agent construction

## Connections
Related entities: [[langraph]], [[crewai]], [[autogen-microsoft]]
Appears in sources: [[100x-cohort7-module2-llm]], [[100x-cohort7-module3-agents]]
Related concepts: [[agentic-patterns]], [[retrieval-augmented-generation]]

## Notes
LangChain received criticism for high abstraction overhead and difficult debugging. More recent cohort direction leans toward programmatic tool calling (direct API calls + execution environments) over heavy framework abstractions. See [[programmatic-tool-calling]].
