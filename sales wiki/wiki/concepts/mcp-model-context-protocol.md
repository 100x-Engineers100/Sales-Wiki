---
title: "MCP — Model Context Protocol"
type: concept
tags: [ai, agents, mcp, protocol, tool-calling, 100x-cohort7]
source_count: 2
---

## Definition
Model Context Protocol (MCP) is a stateless protocol for LLM-tool and agent-to-agent communication. Analogous to HTTP for web — it defines the rules for how LLMs, agents, and external systems should interact, without prescribing implementation details.

## Why It Matters
Before MCP, every LLM-tool integration was custom. MCP standardizes the interface so tools can be written once and used with any compatible LLM or agent. It enables an ecosystem: one tool server, many LLM clients.

## How It Works
- **Stateless**: Like HTTP, the protocol itself maintains no state between requests. Each call is independent.
- **Stateless ≠ stateless application**: The stateless protocol does not prevent developers from building stateful applications on top. State is managed at the application layer.
- **Tool definition**: MCP defines how tools expose their capabilities (name, description, parameters) to LLMs.
- **Agent communication**: In multi-agent systems, MCP can be used for agent-to-agent communication, not just LLM-to-tool.

**How it fits in the stack:**
```
LLM (agent) → MCP → Tool server → result back via MCP → LLM
```

**In multi-agent context:**
```
Orchestrator agent → MCP → Specialist agent A
                   → MCP → Specialist agent B
```

## Key Variants / Extensions
- **MCP server**: A process that exposes tools over MCP. Can be local or remote.
- **MCP client**: Any LLM or agent that calls tools via MCP.
- **qmd MCP server**: Local search engine for markdown with MCP interface (relevant to this wiki)

## Examples
- 100x Module 2 & 3: function/tool calling evolved into MCP standard
- Claude Code: uses MCP for tool integrations (filesystem, bash, etc.)
- qmd: MCP server for wiki search

## Connections
Related concepts: [[ai-agents-react]], [[multi-agent-systems]], [[retrieval-augmented-generation]]
Introduced by: [[100x-cohort7-module2-llm]], [[100x-cohort7-module3-agents]]

## Open Questions / Unknowns
- What is the current version of the MCP spec and who maintains it?
- How does authentication work in MCP tool servers?
- What are the performance characteristics vs. direct API calls?
