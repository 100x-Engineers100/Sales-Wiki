---
title: "LlamaGuard"
type: entity
entity_type: tool
tags: [agents, safety, guardrails, meta, 100x-cohort7]
---

## Overview
LlamaGuard is Meta's open-source safety classification model (22 million parameters) designed to be used as a guardrail layer in LLM applications. It classifies inputs and outputs into 7 harm categories and returns either "safe" or "unsafe [category]" — enabling deterministic safety enforcement before or after LLM calls.

## Key Contributions / Role
- 22M parameters: small enough to run cheaply as a pre/post-processing step
- 7 harm categories: violence, hate speech, sexual content, weapons, drug use, privacy violation, self-harm
- Returns structured output (`safe` / `unsafe S1` etc.) — deterministic, not probabilistic
- Implements the "deterministic layer before LLM" principle (see [[guardrails-architecture]])
- Used in cohort as the reference implementation for production guardrails

## Connections
Related entities: [[anthropic]]
Appears in sources: [[100x-cohort7-module3-agents]]
Related concepts: [[guardrails-architecture]], [[agent-production-pillars]], [[pii-handling]]

## Notes
LlamaGuard represents the correct design: safety enforcement via a small, fast, deterministic classifier — not via prompting the main LLM to "be safe." The Air Canada case study shows what happens when a company relies on the LLM itself to enforce policy (it hallucinated a refund policy and the company was held legally liable). LlamaGuard is the antidote to that failure mode.
