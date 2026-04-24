---
title: "LLM Optimization Decision Tree — Connecting the Dots"
type: synthesis
sources: [connecting-llm-dots, 100x-cohort7-module2-llm, 100x-cohort7-module3-agents]
tags: [llm, optimization, decision-tree, rag, fine-tuning, 100x-cohort7]
---

## Question / Framing
When an LLM system isn't producing the right outputs, what is the systematic process for diagnosing the failure and choosing the correct fix? How does the two-lever framework from "Connecting the LLM Dots" connect to every topic in Modules 2 and 3?

## Analysis

### The foundational formula
`Hallucination = f(Uncertainty × Forced Response)`

Hallucination is not a model flaw. It is a system design problem. The model is uncertain + it is forced to respond anyway = it confabulates. Fix the system, not the model.

### Diagnosis first — the two failure types
Before any fix, answer: **Is this a context problem or a behavior problem?**

| Context problem | Behavior problem |
|----------------|-----------------|
| LLM has wrong or missing information | LLM fundamentally cannot do what you need |
| Fix: give it the right information | Fix: change what the model can do |
| Lever 1 | Lever 2 |

**Critical rule:** Diagnosing wrong wastes enormous effort. Fine-tuning (Lever 2) cannot fix missing information. RAG (Lever 1) cannot fix a model that fundamentally lacks a capability. Identify the failure type FIRST.

### Lever 1 — Context Optimization (escalation ladder)

Start at the top. Only escalate if the level below does not solve the problem. Each level adds cost and complexity.

| Level | Technique | When to use | Cost |
|-------|-----------|-------------|------|
| 1 | **In-context learning** | Model has the capability but needs examples/format guidance | Cheapest — just tokens |
| 2 | **Tool calling** | Model needs live data or external actions (3-layer: LLM→Execution→Tool) | API costs |
| 3 | **MCP** | M×N tool integration problem; standardize tool calling | Setup cost |
| 4 | **RAG (Naive)** | Domain knowledge that changes; basic vector search | Infrastructure |
| 5 | **RAG (Advanced)** | Naive RAG insufficient; hybrid+reranking+metadata | More infra |
| 6 | **Knowledge Graph RAG** | Complex entity relationships in the domain | High setup |
| 7 | **Agentic architectures** | Context is dynamic, multi-hop, or requires planning | Variable |
| 8 | **Memory** | Context must persist across sessions | State infrastructure |

**Always start at level 1.** Most production failures are solved at levels 1–4. Escalating to agents (level 7) for a problem solvable by better prompting (level 1) is the most common expensive mistake.

### Lever 2 — Behavior Optimization (escalation ladder)

| Level | Technique | When to use | Cost |
|-------|-----------|-------------|------|
| 1 | **LoRA** | Parameter-efficient, most practical entry point | Low hardware |
| 2 | **QLoRA** | LoRA but quantized (lower VRAM) | Even lower hardware |
| 3 | **Full parameter fine-tuning** | LoRA insufficient for the capability gap | High hardware |
| 4 | **DPO (Direct Preference Optimization)** | Align outputs to human preferences without RLHF | Moderate |
| 5 | **RLHF** | Highest alignment investment; OpenAI/Anthropic scale | Extreme |

**RAG and fine-tuning are complementary, not alternatives.** A model can be fine-tuned for domain behavior AND augmented with RAG for domain knowledge simultaneously.

### The full Module 2 + 3 curriculum mapped to the two levers

**Lever 1 implementations taught in the cohort:**
- In-context learning: `[[prompt-engineering]]` (Module 2 L9)
- Tool calling: `[[mcp-model-context-protocol]]` (Module 2 L11/L12)
- RAG levels: `[[retrieval-augmented-generation]]`, `[[retrieval-spectrum]]` (Module 2 L13–L16)
- Agentic architectures: all of Module 3
- Memory: `[[ai-memory-architecture]]` (Module 2 L16)

**Lever 2 implementations taught in the cohort:**
- LoRA: `[[lora-training]]` (Module 1 L6/L8/L9/L10)
- Full fine-tuning concepts: `[[llm-decision-tree]]`

## Conclusions
1. Every LLM system problem has a diagnosis step: context vs behavior. Skip it at your peril.
2. The Module 2 and Module 3 curriculum is Lever 1 applied end-to-end. Module 1 LoRA is Lever 2 applied for diffusion models.
3. The escalation ladders save money: solving a Lever 1 level-1 problem with a Lever 1 level-7 approach (agents) can cost 65% more for identical results.
4. The full decision framework is the meta-architecture for all LLM system design decisions in the cohort.

## Contradictions
None. The two-lever framework was explicitly designed to connect all three modules together.

## Further Research
- Real-world benchmarks: at what Lever 1 level does agent overhead start paying off vs deterministic pipeline?
- When does Lever 2 (LoRA) fail to close the capability gap — what's the realistic ceiling of parameter-efficient fine-tuning?
