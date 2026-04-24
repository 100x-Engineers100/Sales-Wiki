---
title: "ReAct Framework (Reasoning and Action)"
type: concept
tags: [ai, agents, react, reasoning, tool-calling, 100x-cohort7]
source_count: 1
---

## Definition
ReAct (Reasoning and Action) is the most common design pattern for AI agents. It structures agent behavior as an explicit iterative cycle: **Thought → Action → Observation**. Each triplet is fed back as context for the next iteration, allowing the agent to build upon previous steps until the goal is achieved.

ReAct is a subset of the full SPAORL agentic loop — it maps to Plan (Thought) → Act (Action) → Observe (Observation), with Reflect and Adapt implicit in the next Thought step.

## Why It Matters
ReAct makes agent behavior interpretable and debuggable. By forcing the model to articulate its Thought before each Action, you get a visible reasoning trace. This is the primary debugging artifact: when an agent fails, read the Thought steps to identify where reasoning went wrong. Without explicit Thought steps, agent failures are opaque.

## How It Works

**The triplet:**
```
Thought:     Reason about current state, decide what to do next
             "I need to find the current CEO of OpenAI. Let me search."
Action:      Select a tool and parameters
             {"tool": "search", "query": "OpenAI CEO 2025"}
Observation: Execute the tool, receive result
             "Sam Altman returned to CEO in November 2023..."
→ Feed Thought + Action + Observation back as context
→ Next iteration begins
```

**System prompt structure for ReAct agents:**
The LLM must be instructed to output structured JSON with `thought` and `action` fields. The system prompt defines available tools and their parameters. Without explicit tool definitions, the agent cannot reliably select actions — this is the most common failure in first builds.

**n8n implementation (manual ReAct loop):**
1. Set node: initialize state (topic, max_iterations=5, current_iteration=0, is_finished=false, context=[])
2. IF node: `is_finished == false AND current_iteration < max_iterations`
3. Model node (system prompt → output JSON): `{"thought": "...", "action": {"tool": "search", "query": "..."}}`
4. Switch node: parse `action.tool` → route to tool branch or "finish" branch
5. SerpApi/Tavily node: execute search, return observation
6. Set node: append `{thought, action, observation}` to context, increment counter
7. Loop back to IF node

**Stop conditions:**
1. **Max iterations** — hard limit (guardrail); prevents infinite loops and controls cost
2. **Goal achievement** — agent outputs `{"tool": "finish", "report": "..."}` which the Switch routes to a branch that sets `is_finished = true`

**Why build it manually first:**
Building the ReAct loop manually in n8n or Python (before using LangChain/n8n's AI Agent node) makes the inner workings transparent. High-level agent nodes abstract this loop — you cannot debug them without understanding what they do internally.

## Key Variants / Extensions
- **High-level agent nodes** (n8n AI Agent, LangChain AgentExecutor, LlamaIndex): abstract the ReAct loop; use after understanding the manual version
- **Plan-and-Execute**: alternative pattern where Planning is separated from Execution; agent creates a full plan first, then executes each step
- **Reflexion**: adds a dedicated reflection pass after each episode — more explicit than ReAct's implicit reflection in Thought steps
- **MRKL (Modular Reasoning, Knowledge, Language)**: similar routing-based architecture; ReAct is simpler and more widely adopted

## Examples
- Web research agent: Thought → decide to search → Action → SerpApi call → Observation → read results → Thought → refine search → ...
- 100x Module 2 n8n build: manual ReAct implementation with 5-step loop, SerpApi for search, is_finished flag for termination
- Anthropic user research agent (case study): three specialized agents each running ReAct loops internally

## Connections
Related concepts: [[agentic-loop]], [[augmented-llm]], [[agentic-patterns]], [[ai-agents-react]], [[agent-failure-modes]]
Introduced by: [[100x-cohort7-module3-agents]]

## Open Questions / Unknowns
- At what point does explicit Thought generation add more cost than it provides debugging value?
- How does ReAct perform versus Plan-and-Execute for tasks with long dependency chains?
