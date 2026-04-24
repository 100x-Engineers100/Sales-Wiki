---
title: "LangFlow"
type: entity
entity_type: tool
tags: [agents, no-code, visual, framework, 100x-cohort7]
---

## Overview
LangFlow is an open-source, low-code visual builder for LLM applications and agent workflows. It provides a node-based drag-and-drop interface (similar to ComfyUI but for LLM pipelines) that compiles to LangChain code. Used in the 100x Module 3 no-code track alongside n8n.

## Key Contributions / Role
- Visual node-based builder for LangChain-based agent and RAG pipelines
- No-code path in Module 3: LangFlow handles agent construction without writing Python
- Bridges the gap between visual thinking (node graphs) and production agent code
- Exports to Python/LangChain — outputs are real, deployable code

## Connections
Related entities: [[langchain]], [[n8n]]
Appears in sources: [[100x-cohort7-module3-agents]]
Related concepts: [[agentic-workflows]], [[agentic-patterns]]

## Notes
The mental model transfer from ComfyUI (node-based image pipelines) to LangFlow (node-based agent pipelines) is explicit in the 100x curriculum. Sridev noted: "Once you can wire ComfyUI, every other node tool feels familiar." LangFlow targets non-coders building LLM apps; n8n targets non-coders building workflow automation (often used together).
