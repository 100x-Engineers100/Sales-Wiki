---
title: "Full Cohort Decision Framework — OPT to MCP"
type: synthesis
sources: [100x-cohort7-module2-llm, 100x-cohort7-module3-agents, connecting-llm-dots]
tags: [framework, decision-making, full-cohort, 100x-cohort7]
---

## Question / Framing
What is the complete decision chain that connects every topic across all three modules of the 100x Cohort 7 curriculum? How does a builder move from "I have a problem" to "I have a production-ready AI system"?

## Analysis

The complete chain taught across the cohort:

```
OPT → PRD → MVP → Full-Stack → LLM Decision Tree → Augmented LLM → Agents → Multi-Agent → MCP
```

Each step is a decision gate. You only proceed to the next if the current step is insufficient.

---

### Step 1: OPT Framework → What to build
`[[opt-framework]]` — Operating Model → Processes → Tasks

Before writing a single line of code: define the Operating Model (what your business does), map the Processes, identify the Tasks that can be automated with AI. This prevents building solutions to the wrong problems.

---

### Step 2: PRD → How to specify it
A Product Requirements Document defines what the system must do — user flows, data entities, success criteria. This is the input to Lovable (vibe coding). See [[ship-cycle]], [[vibe-coding]].

**The GIGO gate:** A bad PRD → bad MVP. Garbage In, Garbage Out applies before any code runs.

---

### Step 3: MVP → First working version
`[[ship-cycle]]` — PRD → Lovable → test → GitHub → Cursor → refine → tests → git → deploy

The 9-step cycle produces a deployable MVP. This is where the full-stack architecture becomes real.

---

### Step 4: Full-Stack Architecture → Production foundation
`[[full-stack-llm-architecture]]` — UI / API / AI / DB / Deploy

The 5-component stack. FastAPI for the API layer. Supabase for the database. The philosophical justification is in `[[six-easy-pieces-philosophy]]`. Every layer exists because of the physical separation between screen and machine.

---

### Step 5: LLM Decision Tree → Which AI approach
`[[llm-decision-tree]]` — Diagnose: context failure or behavior failure?

- Context failure → Lever 1 escalation ladder (in-context → tools → MCP → RAG → agents → memory)
- Behavior failure → Lever 2 escalation ladder (LoRA → QLoRA → full fine-tuning → DPO → RLHF)

This is the decision engine. Every AI technique in the cohort sits at a specific rung of one of these ladders.

---

### Step 6: Augmented LLM → The pre-agent state
`[[augmented-llm]]` — LLM + Knowledge + Capabilities + Controller

This is NOT yet an agent. It is the correct baseline for most production systems: an LLM that can access tools, memory, and retrieval — but without a dynamic reasoning loop. This is where 95% of production AI systems should stop.

---

### Step 7: Agents → When augmented LLM is insufficient
`[[agentic-loop]]` — Add the reasoning loop: Sense → Plan → Act → Observe → Reflect → Adapt

Only add agents when: steps cannot be defined in advance, task requires dynamic planning, deterministic pipeline provably fails. See `[[95-percent-rule]]`.

---

### Step 8: Multi-Agent → When one agent is insufficient
`[[multi-agent-systems]]`, `[[agentic-patterns]]` — 6 coordination patterns

Only when a single agent's context window, tool access, or capability is demonstrably insufficient. Each additional agent adds coordination cost. Use the simplest pattern that works.

---

### Step 9: MCP → When tool integration becomes a systemic problem
`[[mcp-model-context-protocol]]` — Solves M×N integration → M+N

MCP standardizes how LLMs and agents access tools. Instead of writing M integrations for M models and N tools (M×N problem), MCP lets each tool expose one server (N) and each model use one protocol (M). HTTP is to the web as MCP is to AI.

---

### The PPT meta-lens
`[[ppt-framework]]` — Principle → Process → Tool

At every step of this chain: identify the principle (why this layer exists), understand the process (how to apply it), then choose the tool. Tools change; principles don't. Any new AI tool released during or after the cohort can be evaluated by asking where it sits in this chain.

---

### Visual summary
```
Problem exists → OPT → What processes need AI?
                 ↓
              PRD → What exactly should the system do?
                 ↓
              MVP → Build the simplest working version
                 ↓
         Full-Stack → Productionize the architecture
                 ↓
    LLM Decision Tree → Context failure? or Behavior failure?
                 ↓
       Augmented LLM → Add knowledge + tools + memory
                 ↓
            Agents → Add reasoning loop (only if needed)
                 ↓
       Multi-Agent → Add coordination (only if needed)
                 ↓
              MCP → Standardize tool integration at scale
```

## Conclusions
1. This chain is the meta-framework for the entire 6-month cohort. Every lecture slot is a node on it.
2. Most builders skip to Step 7 (agents) before completing Steps 1–6. The chain exists precisely to prevent this.
3. The PPT framework is the lens for evaluating new tools that appear after the cohort ends. Identify the principle, map it to the step in this chain, then choose the tool.
4. The chain is not prescriptive — it is a diagnostic tool. If production problems appear, walk back up the chain to find where the decision went wrong.

## Contradictions
None — this synthesis connects material designed to be coherent across all three modules.

## Further Research
- Does this chain hold as agentic systems become more autonomous? Does MCP become Step 5 rather than Step 9 as AI tooling matures?
- Where do multi-modal inputs (voice, video, images) sit in this chain — are they a new Step 0 (what modality is the input?) or embedded in the existing steps?
