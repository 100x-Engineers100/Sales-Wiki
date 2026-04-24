---
title: "AI Agents & ReAct Pattern"
type: concept
tags: [ai, agents, react, reasoning, tool-calling, 100x-cohort7]
source_count: 5
---

## Definition
An AI agent is an LLM augmented with tools and memory, operating in a feedback loop — it acts, observes results, and uses those observations to inform its next action. The ReAct (Reasoning and Action) pattern is the most common design framework: the agent explicitly cycles through Thought → Action → Observation until the goal is achieved.

## Why It Matters
A chatbot answers a question in one pass. An agent breaks down a complex problem, uses multiple tools over multiple steps, re-plans after each observation. This enables tasks that require iteration, external data, or multi-step execution — things no single LLM call can do.

## How It Works

**The ReAct loop:**
```
Thought: Reason about current state, decide what to do next
Action: Select a tool and parameters
Observation: Execute the tool, receive result
→ Feed Thought + Action + Observation back as context
→ Repeat until goal achieved or max iterations hit
```

**Stop conditions (two kinds):**
1. **Max iterations** — hard guardrail to prevent infinite loops and control cost
2. **Goal achievement** — agent itself signals completion via a "finish" action

**Tool definition requirement**: LLM prompt must explicitly list available tools and their parameters. Without this, the agent cannot reliably select actions. This is the most common failure mode for first builds.

**State management**: All context (conversation history, previous actions, observations) must be explicitly managed and passed to the LLM on each iteration. The loop is stateless at the protocol level; state is the application's responsibility.

**Implementation in n8n (manual):**
1. Set node: initialize state variables (topic, max_iterations, current_iteration, is_finished)
2. IF node: loop condition (is_finished == false AND current_iteration < max)
3. Model node: reasoning step — system prompt instructs JSON output: `{"thought": "...", "action": {"tool": "...", "query": "..."}}`
4. Switch node: parse action.tool, route to correct tool branch
5. Tool node (SerpApi/Tavily): execute, get observation
6. Set node: append thought+action+observation to context, increment counter
7. Loop back to IF

## Key Variants / Extensions
- **Single agent**: One LLM + tools, one ReAct loop
- **Multi-agent**: Multiple specialized agents, each with own role. Orchestrated centrally or peer-to-peer.
- **Sequential workflow**: Agents pass results in a chain
- **Parallel workflow**: Multiple agents work simultaneously on different sub-tasks
- **High-level agent nodes**: n8n AI Agent node, LangChain agents, LlamaIndex — abstract the ReAct loop. Understand the manual version first to debug these effectively.

## Examples
- Web research agent: Thought → search query → SerpApi → observation → refine search → final synthesis
- 100x Module 3 n8n build: manual ReAct loop with SerpApi tools
- Stella (rsarver): multi-tool agent (email, calendar, Granola, Todoist) with cron scheduling

## Hard Problems in Production Agents
- **Infinite loops**: agent keeps trying and never converges. Every agent needs a max iteration count and fallback strategy.
- **Compounding errors**: in a loop, one mistake feeds the next. A wrong tool call → wrong observation → worse plan. Guardrails at each step are not optional.
- **Goal ambiguity**: "Help me with my project" without clarification → confident, useless work. Sometimes the right first action is asking a question, not calling a tool.
- **Context window exhaustion**: each loop adds tokens. After several iterations, context fills. Memory (summarize, compress, selectively forget) becomes critical.
- **Trust and safety**: agents with access to email, payment APIs, and databases can cause real damage if reasoning goes wrong. Blast radius of a bad decision is larger than a pipeline.

**Multi-agent patterns:**
- **Specialization**: retrieval-heavy agent + generation-heavy agent + code execution agent. Each has focused tool set and system prompt.
- **Coordination**: supervisor agent decomposes goal, assigns to specialists, synthesizes result.
- **Debate/verification**: two agents evaluate each other's work (one generates, one critiques). Independent evaluation is more reliable than self-evaluation.

**Principle**: Don't reach for multi-agent when a single well-designed agent suffices. Complexity is a cost, not a feature.

## AAA Progression
See [[aaa-agent-progression]] for the Assisted → Accelerated → Autonomous spectrum. Most production systems today operate at Assisted or Accelerated.

## Connections
Related concepts: [[multi-agent-systems]], [[mcp-model-context-protocol]], [[ai-memory-architecture]], [[agentic-workflows]], [[aaa-agent-progression]], [[context-economy]], [[hallucination-and-grounding]]
Introduced by: [[100x-cohort7-module3-agents]], [[rsarver-ai-chief-of-staff]]

## Open Questions / Unknowns
- When does a single-agent approach fail vs. when should multi-agent be used?
- What are the most effective guardrail patterns in production agents?
- How does ReAct compare to other patterns (MRKL, Toolformer, Plan-and-Execute)?
