---
title: "LangGraph"
type: entity
entity_type: tool
tags: [agents, stateful, graph, framework, 100x-cohort7]
---

## Overview
LangGraph is an extension of LangChain for building stateful, graph-based agent applications. Unlike LangChain's linear chains, LangGraph models agent workflows as directed graphs — nodes are agent/tool actions, edges are transitions, and shared state persists across the entire graph execution.

## Key Contributions / Role
- Enables conditional branching, loops, and parallel execution within agent workflows
- State object shared and mutated across all nodes — solves the state management problem for complex agents
- Natural fit for Evaluator-Optimizer pattern (iterative generate → evaluate → improve loops)
- Used in cohort Module 3 for building stateful agentic workflows

## Connections
Related entities: [[langchain]], [[crewai]], [[autogen-microsoft]]
Appears in sources: [[100x-cohort7-module3-agents]]
Related concepts: [[agentic-patterns]], [[agentic-loop]], [[agentic-workflows]]

## Notes
LangGraph's graph model maps directly to the Sense→Plan→Act→Observe→Reflect→Adapt agentic loop. Each step in the loop is a node; conditional edges handle the "if observation suggests course correction" branching. Most powerful when workflow structure is complex but well-defined.
