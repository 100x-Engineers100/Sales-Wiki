---
title: "100x Engineers Cohort 7 — Module 2: Full Stack LLM Development"
type: source
source_type: course_notes
author: "Siddhant, Sridev (100x Engineers)"
date: 2026-03-13
raw_path: raw/courses/Data_Doc_main.txt
tags: [ai, llm, full-stack, api, rag, mcp, 100x-cohort7, fastapi, supabase]
---

## Summary

Module 2 covers full-stack LLM development across 17 lectures, taught primarily by Siddhant (CTO, 2 prior exits). It spans the full stack from UI building (Gradio) through APIs (FastAPI), databases (Supabase), prompt engineering, tool/function calling, MCP, RAG (three levels), memory, and GenAI application architecture.

The module teaches how to build real, deployable LLM-powered systems — not just chatbots. The thread running through it is the OPT framework: automating one-prompt-tasks incrementally to compound productivity over time (10% per month → 60% more productive in 6 months).

First principles thinking is the pedagogical foundation: understanding WHY before HOW. Experience first (build it before being taught how it works), then understanding.

## Key Ideas

- **OPT framework (One Prompt Task)**: Identify tasks that can be automated with a single AI prompt. The building block of LLM automation. Entry point: UI → API → Backend → LLM → Response.
- **Why APIs matter**: Solve the limitations of standalone apps — no reusability, no integration, no scalability. APIs are the communication protocol between components.
- **FastAPI**: Python framework for building REST APIs. Uses Pydantic for data validation, decorators for endpoints, Uvicorn for serving. The standard for Python LLM backends.
- **Supabase (SQL)**: Cloud PostgreSQL for LLM app data. Part of the "connecting the dots" lecture — how data persists across LLM interactions.
- **Gradio**: Python library for building UI components. Used as frontend for LLM apps. Limitation: tightly coupled to backend — no reusability or integration.
- **Vibe Coding**: AI-assisted code generation. Takes you to MVP. Engineering fundamentals needed for scaling beyond. Claude Code is specifically taught in this module.
- **Prompt Engineering**: The craft of getting reliable outputs from LLMs. Includes system prompts, few-shot examples, chain-of-thought, output formatting.
- **LLM Wrappers**: Building abstraction layers around LLM APIs for reuse across applications.
- **Function/Tool Calling**: LLMs can call external functions/tools. Foundation for agentic behavior. MCP standardizes this.
- **MCP (Model Context Protocol)**: Stateless protocol for LLM-tool integration. Analogous to HTTP for web. Defines how agents and systems should interact. Not a state manager — state is the application layer's responsibility.
- **RAG (Retrieval-Augmented Generation)**: Three levels of RAG taught. Augmenting LLM context with retrieved documents. Covered in theory and practice with real builds.
- **Memory RAG**: Advanced technique for persistent memory across LLM interactions. Addresses the session-amnesia problem.
- **GenAI Application Architecture**: How to design and architect production LLM systems. Monolith vs. microservice decisions for AI apps.
- **Compound automation effect**: 10% productivity gain per month compounds to 60%+ in 6 months. Sustainable only through incremental, not wholesale, automation.
- **Security from day one**: Parameterized queries, auth layers, no hardcoded secrets. Not an afterthought.
- **Student success examples**: VP at SOTI (39% productivity increase), Design Lead at Apple (automated majority of work), Fani BCom non-tech (now works as AI generalist at startup).

## Key Lectures
| # | Title |
|---|-------|
| L1 | Orientation Introduction to Full Stack |
| L2 | UI Building Practical with Gradio |
| L3 | Introduction to APIs |
| L4 | Building APIs with FastAPI |
| L5 | Introduction to Databases & Domain Modeling, ERD |
| L6 | Connecting the Dots & Supabase (SQL) (Practical) |
| L7 | Introduction to AI-Powered Development (VibeCode) |
| L8 | MVP Building Workshop |
| L9 | Introduction to LLMs & Prompt Engineering |
| L10 | Prompt Engineering & Building LLM Wrappers |
| L11 | Function, Tool Calling and Intro to MCP |
| L12 | Function, Tool Calling and MCPs (Practical) |
| L13 | Introduction to Retrieval-Augmented Generation (RAG) — Theory |
| L14 | Building RAG Apps with Three Levels (Practical) |
| L15 | Advanced RAG Techniques |
| L16 | Memory RAG Techniques |
| L17 | Building and Architecting GenAI Applications |

## Notable Quotes / Moments

> "Vibe coding takes you to MVP. Scaling beyond MVP requires understanding engineering fundamentals." — Sridev

> "By consistently automating small portions of your workflow, you create a compound effect: Month 1: 10% more productive, Month 6: 60% more productive."

## Concepts Introduced
[[opt-framework]], [[retrieval-augmented-generation]], [[mcp-model-context-protocol]], [[prompt-engineering]], [[fastapi]], [[ai-memory-architecture]], [[vibe-coding]], [[llm-application-architecture]]

## Entities Mentioned
[[siddhant]], [[sridev]], [[100x-engineers]], [[100x-cohort7]], [[supabase]], [[gradio]]

## Contradictions / Tensions
None.

## Open Questions
- What are the three levels of RAG taught? (naive, advanced, agentic?)
- How does memory RAG technically work in their implementation?
- What does the GenAI application architecture framework look like?
