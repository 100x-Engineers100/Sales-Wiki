---
title: "LlamaIndex"
type: entity
entity_type: tool
tags: [rag, retrieval, agents, framework, 100x-cohort7]
---

## Overview
LlamaIndex (formerly GPT Index) is an open-source data framework for building LLM applications with retrieval — RAG pipelines, document indexing, and retrieval-augmented agents. It is specialized in connecting LLMs to diverse data sources with strong indexing abstractions.

## Key Contributions / Role
- Abstracts document loading, chunking, embedding, indexing, and retrieval into composable components
- Supports multiple index types: vector, keyword, knowledge graph, tree, list
- Strong integration with agent workflows: retrieval can be a tool that agents call
- PageIndex pattern (98.7% accuracy on financial docs) referenced in [[retrieval-spectrum]] comes from LlamaIndex ecosystem research

## Connections
Related entities: [[langchain]], [[crewai]]
Appears in sources: [[100x-cohort7-module2-llm]], [[100x-cohort7-module3-agents]]
Related concepts: [[retrieval-augmented-generation]], [[retrieval-spectrum]], [[embedding-model-selection]]

## Notes
LlamaIndex specializes in data connection and retrieval; LangChain specializes in chain/agent orchestration. They are complementary: LlamaIndex for the "data layer," LangChain/LangGraph for the "orchestration layer." Often used together in production RAG systems.
