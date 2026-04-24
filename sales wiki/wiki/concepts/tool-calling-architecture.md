---
title: "Tool Calling Architecture"
type: concept
tags: [ai, llm, tool-calling, mcp, agents, 100x-cohort7]
source_count: 2
---

## Definition
Tool calling (also called function calling) is a 3-layer architecture that enables LLMs to interact with external systems: the LLM parses intent and selects tools, an execution environment runs them, and a second LLM call formats the results into a natural language response.

## Why It Matters
LLMs are static — their weights are frozen at training time. They cannot access real-time data, call APIs, or run code. Tool calling solves the "context automation problem": instead of a developer manually copying current data into every prompt, the LLM itself decides when it needs external data and which tool to call to get it.

Without tool calling, LLMs hallucinate on queries requiring real-time or private data (e.g., "what's the current weather?"). With it, the LLM fetches ground truth automatically.

## How It Works

### The 3-Layer Architecture

```
User Prompt
    ↓
[LAYER 1] LLM — Intent Parser + Tool Selector
    • Receives user prompt + list of tool definitions
    • Identifies which tool (if any) is needed
    • Extracts arguments from the natural language prompt
    • Outputs: { tool_name, arguments } — does NOT execute
    ↓
[LAYER 2] Execution Environment — Your Application Code
    • Receives tool name + arguments from LLM
    • Executes the actual function / API call / database query
    • LLM cannot do this itself (sandboxed, no network access)
    • Returns raw data (often JSON)
    ↓
[LAYER 3] LLM (second call) — Response Formatter
    • Receives: original user prompt + raw data from tool
    • Generates natural language response
    • Does NOT re-execute; only formats
    ↓
User-Facing Response
```

### The Dual-Call Pattern
Every tool-calling interaction requires exactly two LLM calls:
- **Call 1 (intent + selection)**: LLM reads tool definitions, decides which tool to call, extracts arguments. Output is structured (tool name + args), not natural language.
- **Call 2 (formatting)**: LLM receives raw API data as context and generates a user-friendly response.

The LLM never executes tools directly. Your code is the execution environment.

### JSON Schema Tool Definition
Tools are defined as structured JSON that the LLM can read to understand tool purpose and parameters:

```python
weather_tool = {
    "type": "function",
    "function": {
        "name": "get_current_weather",
        "description": "Get the current weather in a given location",
        "parameters": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "The city and state, e.g. San Francisco, CA"
                }
            },
            "required": ["location"]
        }
    }
}
```

The quality of `name` and `description` fields directly determines how reliably the LLM selects the correct tool. Vague descriptions cause tool selection errors.

### Tool Selection Logic
Two modes when calling the LLM with tools:
- `tool_choice: "auto"` — LLM decides whether a tool is needed or answers directly from training data
- Forced selection — application logic routes to a specific tool regardless of LLM preference

For applications with many tools, use a **router pattern**: first classify user intent, then pass only the relevant subset of tool definitions. This reduces ambiguity and improves selection accuracy.

### Multi-Tool Routing Pattern
When multiple tools are defined:
```python
available_functions = {
    "get_current_weather": python_weather_function,
    "get_current_humidity": python_humidity_function
}
# LLM returns function_name in tool_calls field
# Application dispatches to correct function dynamically
function_to_call = available_functions[tool_call.function.name]
```

## Key Variants / Extensions

### MCP (Model Context Protocol) — Standardization Layer
Direct tool calling requires custom integration code for every tool. At scale (many tools, many LLM apps), this creates an M×N problem: M apps × N tools = M×N custom integrations.

MCP reduces this to M+N: tool providers expose standardized MCP servers; any MCP client (Claude Desktop, Cursor) can use any MCP server without custom integration code.

MCP analogy: "HTTP is to web as MCP is to AI." Stateless protocol, client-server model. MCP clients consume tools; MCP servers expose them.

Example MCP servers: Gmail, Google Drive, Playwright (browser automation). Any of these can be connected to any MCP client with zero custom wiring.

**LLMO (future concept)**: Just as SEO helps websites rank on search engines, LLMO (Large Language Model Optimization) will emerge as tool providers optimize their MCP servers to be easily discovered and correctly used by LLMs.

### Programmatic Tool Calling
A newer paradigm where the execution environment (code) acts as the primary orchestrator, and the LLM is consulted only for intent parsing. Reduces context window pollution.

See: [[programmatic-tool-calling]]

### Context Pollution Problem
Every tool result that gets appended back to the LLM's context window consumes tokens. In long agentic loops, tool outputs accumulate and can:
1. Push earlier context out of the window (context anxiety)
2. Cause the LLM to over-rely on recent tool results
3. Increase cost per query linearly with tool call count

Mitigation: return only the most relevant subset of tool output to the LLM, not the full raw API response.

## Examples

**Weather query (L12 live demo):**
- User: "What's the weather in Bengaluru?"
- Call 1: LLM identifies `get_current_weather`, extracts `location="Bengaluru"`
- Execution: Python calls OpenWeatherMap API, gets JSON with temp/humidity/description
- Call 2: LLM formats raw JSON into "Currently 28°C and sunny in Bengaluru..."

**Browser automation (Playwright MCP demo):**
- User (in Cursor): "Go to google.com and search for current temperature in Bangalore"
- Cursor (MCP Client) → Playwright MCP Server → browser opens, navigates, extracts
- Result returned to Cursor → LLM summarizes

**Multi-agent tool routing:**
- Orchestrator agent determines task type → routes to specialist tool → returns result to orchestrator → formats final response

## Connections
Related concepts: [[mcp-model-context-protocol]], [[programmatic-tool-calling]], [[retrieval-augmented-generation]], [[agentic-loop]], [[context-economy]], [[llm-decision-tree]]
Introduced by: [[100x-cohort7-module2-llm]] (L11, L12), [[connecting-llm-dots]]

## Open Questions / Unknowns
- As LLMO emerges, how will tool discovery ranking work? Will tools compete for LLM "attention" the way web pages compete for search rankings?
- At what tool-count threshold does raw function calling become unmanageable vs. MCP? (The cohort suggested "many tools" qualitatively, no hard number given.)
- How do streaming tool calls (partial results mid-generation) interact with the dual-call pattern?
