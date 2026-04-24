---
title: "Guardrails Architecture"
type: concept
tags: [ai, agents, safety, guardrails, llama-guard, production, 100x-cohort7]
source_count: 1
---

## Definition
A deterministic safety layer placed BEFORE the LLM that intercepts, classifies, and filters user inputs before they reach the main model. Guardrails are not prompt instructions — they are separate code or model components that the LLM cannot override.

The core principle: **Non-deterministic systems (LLMs) cannot enforce policy reliably. Critical decisions must live in deterministic code.**

## Why It Matters
Prompting the main LLM to "behave safely" does not work. LLMs are non-deterministic. They have seen adversarial training data. They can be jailbroken. RLHF makes them agreeable — even a system prompt saying "don't give information not in the database" can be overridden by a sufficiently crafted prompt. The Air Canada case: the LLM hallucinated a refund policy despite a system prompt. Court ordered damages.

The fix is architectural: move guardrails OUT of the LLM and into deterministic code or a separate classification model.

## How It Works

**The guardrail stack (execution order):**
```
[User Input]
     ↓
[Guard Model — LlamaGuard or OpenAI Moderation]
     ↓ unsafe → return "Query is unsafe. Category: S2"
     ↓ safe
[Intent Classifier — domain scope enforcement]
     ↓ out of scope → "This is outside my scope"
     ↓ in scope
[Deterministic Execution Layer — your code]
     ↓ policy/financial decisions made here, not by LLM
[LLM — language generation only]
```

**LlamaGuard:**
- Meta open-source model, 22M parameters (tiny vs Llama 70B)
- Trained specifically to classify unsafe content — one job, not general purpose
- 7 default categories: S1 Violence/hate, S2 Illegal weapons, S3 Sexual content, S4 Controlled substances, S5 Suicide/self-harm, S6 Criminal planning, S7+
- Returns: "safe" or "unsafe [category code]"
- Customizable: add your own policy categories via in-context examples
- Much harder to jailbreak than the main LLM — it only classifies intent, doesn't "understand" adversarial prompts

**Intent classification as guardrail (domain-specific):**
- Define the 3-5 intents your agent supports
- Every query passes through an intent classifier first
- Query maps to a known intent → proceed
- Query does not map → "This is outside my scope" (never reaches LLM)
- Can be implemented with a small ML model or even rule-based logic
- Impossible to jailbreak because it classifies to a fixed category set

**Deterministic layer for policy decisions:**
```
[User: "Do you offer bereavement discounts?"]
       ↓
[Deterministic code: check policy database]
  → found → retrieve exact policy text → pass to LLM for language generation
  → not found → return "We don't offer this discount" (code, not LLM)
[LLM generates natural language response around the policy text]
```
Nothing about refunds, discounts, or policies should be DECIDED by the LLM. LLM only generates the language around decisions made by deterministic code.

## Key Variants / Extensions
- **Multimodal guardrails**: Voice → STT → text guardrails → LLM (adds latency). For production voice: use native voice models with built-in moderation (OpenAI Real-Time API)
- **Video guardrails**: No clean solution currently. Per-frame classification is compute-prohibitive. Monitor and flag for human review.
- **OpenAI alternatives**: GPT OSS Safeguard (Hugging Face), OpenAI Moderation API

## Connections
Related concepts: [[agent-production-pillars]], [[pii-handling]], [[agent-failure-modes]], [[hallucination-formula]], [[95-percent-rule]]
Introduced by: [[100x-cohort7-module3-agents]]
