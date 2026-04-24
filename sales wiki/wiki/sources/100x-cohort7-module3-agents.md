---
title: "100x Engineers Cohort 7 — Module 3: AI Agents"
type: source
source_type: course_notes
author: "Siddhant (100x Engineers)"
date: 2026-03-13
raw_path: raw/courses/Data_Doc_main.txt
tags: [ai, agents, multi-agent, mcp, 100x-cohort7, react, production, n8n]
---

## Summary

Module 3 covers AI agents across 8 lectures, taught by Siddhant (CTO). It spans from foundational agent concepts through multi-agent systems, agentic workflow patterns, production best practices, and deployment. Both code and no-code (n8n) paths are covered.

The module builds directly on Module 2 (tool calling, MCP, RAG) and extends to autonomous systems that reason, act, observe, and iterate. The pedagogical approach is first-principles: build a ReAct loop manually in n8n before using high-level agent nodes, so students understand what is happening inside the abstraction.

The final lecture "Connecting Dots from Every Module" integrates all three modules into a coherent picture of the AI engineer's full stack.

## Key Ideas

- **What makes an agent**: Augmented LLM (tools + memory) + a feedback loop. Not a chatbot — an iterative problem-solver.
- **ReAct pattern (Reasoning and Action)**: The core agent architecture pattern. Loop: Thought → Action → Observation → (feeds back as context) → repeat. Agent continues until goal achieved or max iterations hit.
- **Stop conditions**: (1) Max iterations (guardrail against infinite loops), (2) LLM self-signals completion via "finish" action.
- **Agent vs chatbot**: Chatbot answers a question in one pass. Agent breaks down problems, uses multiple tools over multiple steps, re-plans after each observation. Multi-step iterative problem-solver.
- **Tool definition is critical**: LLM prompt must explicitly define available tools and their parameters. Without this, the agent cannot reliably select actions.
- **State management**: Key challenge in agents — tracking conversation history, previous actions, observations. In n8n: "Set" node explicitly manages and appends context each iteration.
- **n8n manual ReAct build**: Trigger → Set (init state) → IF (loop condition) → Model (reasoning: output JSON with thought + action) → Switch (parse action, route to tool) → Tool (e.g., SerpApi) → Set (append to context) → loop back to IF.
- **Multi-agent systems**: Multiple specialized agents working together. Each agent focuses on a specific role. Better overall outcomes than a single generalist agent on complex tasks.
- **Orchestration patterns**: Centralized (one controller manages all agents) vs. decentralized (peer-to-peer communication). Sequential vs. parallel agent workflows.
- **MCP in multi-agent context**: Stateless protocol for agent-to-tool and agent-to-agent communication. Stateless protocol ≠ stateless application. State lives in the application layer.
- **Production best practices**: Guardrails, evals, monitoring. Max iteration limits. Cost controls. Error handling. Logging.
- **Agent deployment patterns**: How to deploy agents to production. API-first architecture.
- **Anthropic user research agent**: Mentioned as real-world case study for multi-agent architecture.

## Key Lectures
| # | Title | Track |
|---|-------|-------|
| L1 | Introduction to AI Agents | Both |
| L2 | Building Your First AI Agent | Code |
| L2 | Building Your First AI Agent | No-Code (n8n) |
| L3 | Understanding Multi-Agent Systems | Code |
| L4 | Multi Agents Implementation — Advanced Tool Calling | Code |
| L5 | Road to Agentic Workflows — Patterns, Guardrails & Evals | Code |
| L5 | Hands-on Building Agents | No-Code (n8n + LangFlow) |
| L6 | Agentic Workflows — Production Best Practices | Both |
| L7 | Agent Deployment & Production Patterns | Both |
| L8 | Connecting Dots from Every Module | Both |

## Notable Quotes / Moments

> "The purpose of building the loop manually is to understand what is happening inside a high-level node like 'AI Agent.' By building the reasoning and action loop from its fundamental components, you gain a much deeper understanding, which is invaluable for debugging and designing more complex systems."

> "Multi-Agent Systems Enable Specialization: Breaking complex tasks into specialized roles allows each agent to focus on what it does best, leading to better overall outcomes than a single generalist agent."

> "Stateless Protocols Are Powerful: Like HTTP, MCP being stateless doesn't limit functionality. Developers implement state management at the application layer."

## Concepts Introduced
[[ai-agents-react]], [[multi-agent-systems]], [[mcp-model-context-protocol]], [[agentic-workflows]], [[agent-evaluation]], [[agent-deployment]]

## Entities Mentioned
[[siddhant]], [[100x-engineers]], [[100x-cohort7]], [[n8n]], [[anthropic]]

## Contradictions / Tensions
None.

## Open Questions
- What specific eval frameworks are recommended for agents?
- What guardrail patterns are most important in production?
- How does the "Connecting Dots" lecture unify all three modules?
