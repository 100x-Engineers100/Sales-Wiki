---
title: "Structured I/O for LLMs"
type: concept
tags: [ai, llm, structured-output, json, tool-calling, reliability]
source_count: 1
---

## Definition
Structured I/O is the technique that bridges the fundamental mismatch between probabilistic LLM outputs and deterministic system requirements. Instead of relying on free-form text from the LLM to trigger code, the LLM is constrained to return structured JSON that maps directly to pre-written deterministic functions.

## Why It Matters
Software systems are deterministic. APIs require exact inputs. LLMs generate flexible, probabilistic outputs. If you rely on raw text to trigger code, your system breaks unpredictably. Structured I/O makes LLM-to-system integration reliable.

## How It Works

**The four-step pattern:**
1. **Pre-write** deterministic functions in the backend
2. **Ask the LLM** to return structured JSON (function name + parameters)
3. **Extract and validate** the structured output
4. **Call** the function directly

```json
{
  "function": "getWeather",
  "arguments": {
    "city": "Bengaluru"
  }
}
```

**Why JSON works:**
- Machine-readable
- Grammar can be constrained (token-level decoding can enforce structure)
- Modern models support JSON mode, structured output, constrained decoding via fine-tuning

**JSON schemas as tool descriptions (input optimization):**
Instead of uploading entire codebases to the LLM, convert function signatures into compact JSON schemas — minimal, machine-readable descriptions of what each tool does, what parameters it accepts, what it returns. The LLM reads the schema and decides; the execution environment does the work. Reduces cost, improves accuracy, makes tool selection reliable.

**The clean separation of concerns:**
```
Probabilistic intelligence (LLM)      → decides WHAT to do
Deterministic execution (backend)     → decides HOW to do it
JSON schema                           → the contract between them
```

The model is responsible for reasoning. The system is responsible for reliability.

## Key Variants / Extensions
- **JSON mode**: LLM constrained to output valid JSON (OpenAI, Anthropic support)
- **Function calling / tool use**: LLM selects from a defined list of tools, outputs structured params
- **Pydantic models** (FastAPI): server-side schema validation of LLM outputs
- **Constrained decoding**: token-level enforcement of grammar at generation time

## Examples
- FastAPI + Pydantic: define request/response models → LLM outputs match schema → validate on entry
- OpenAI function calling: provide tool schemas → model returns JSON → backend executes
- n8n agent: Model node outputs structured JSON → Switch node routes to correct tool branch

## Connections
Related concepts: [[hallucination-and-grounding]], [[deterministic-vs-generative-separation]], [[mcp-model-context-protocol]], [[context-economy]]
Introduced by: [[six-easy-pieces-for-llms]]

## Open Questions / Unknowns
- What is the failure rate of JSON mode in practice? When does it still fail?
- How does Pydantic validation interact with LLM retries when schema conformance fails?
