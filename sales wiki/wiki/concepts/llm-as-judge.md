---
title: "LLM-as-Judge (Evaluation Pattern)"
type: concept
tags: [ai, agents, evaluation, evals, llm, quality, 100x-cohort7]
source_count: 1
---

## Definition
Using an LLM to evaluate the quality of another LLM's output, by encoding domain expert criteria as a scoring rubric and having the judge LLM score outputs against that rubric. The evaluator LLM acts as a proxy for the best human expert in the domain.

## Why It Matters
Agent systems can fail silently — fluent, confident outputs that are factually wrong or out of scope. Without systematic evaluation, you're flying blind. Manual evaluation doesn't scale. LLM-as-judge scales evaluation to any volume, and when set up correctly, correlates well with human expert judgment.

## How It Works

**The 4-step setup:**
1. Identify the best human expert in your domain (who would you hire to judge quality?)
2. Find how they evaluate quality (read their book, extract their criteria)
3. Encode their criteria as a scoring rubric (15 criteria → 15 dimensions → prompt)
4. Use LLM with that rubric as judge for every output

**Example — Ogilvy Copy Reviewer:**
Problem: evaluate marketing copy quality at scale.
Solution: Read "Ogilvy on Advertising," extract David Ogilvy's 15 criteria for great copy, encode into an evaluation prompt. LLM scores submissions against those criteria. Human judgment is encoded once; evaluation runs automatically.

**The 50 QA Pairs exercise (most underrated practice):**
Before building any evaluation framework, write 50 ideal question-answer pairs for your agent. These become your ground truth.
- Expose gaps in your knowledge base
- Reveal categories of queries your agent must handle
- Enable deterministic checks before the LLM ever sees a query
- Foundation for both in-context learning and later fine-tuning

Most engineers skip this. They copy existing architectures and tune hyperparameters. The hard problem — knowing what "good" looks like — never gets solved.

**For specialized domains (nuclear, regional languages, niche finance):**
When the base model has little training data on the domain, provide more few-shot examples showing what "good" looks like. The fewer domain examples in the base model, the more explicit examples you must provide.

**Key production metrics for agent evaluation:**
- Hallucination Rate: % of responses containing fabricated claims
- Task Completion Rate: % of assigned tasks successfully completed
- Boundary Adherence: % of responses staying within defined scope
- False Positive / False Negative Rate: for guardrail classifications
- Recovery Rate: how gracefully the agent handles edge cases

**Evaluation is continuous, not a one-time step.** Build → measure → diagnose → improve. RAGAS for RAG-specific metrics (Faithfulness, Answer Relevancy, Context Precision, Context Recall).

## Connections
Related concepts: [[agent-production-pillars]], [[guardrails-architecture]], [[retrieval-augmented-generation]], [[hallucination-formula]]
Introduced by: [[100x-cohort7-module3-agents]]
