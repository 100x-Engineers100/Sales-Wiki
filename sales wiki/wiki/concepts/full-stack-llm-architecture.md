---
title: "Full-Stack LLM Architecture"
type: concept
tags: [llm, full-stack, architecture, api, database, 100x-cohort7]
source_count: 2
---

## Definition
A full-stack LLM application is built from five components — UI, API, AI Model, Database, and Deployment — connected through three interface types: UI (human↔machine), API (machine↔machine), and Language (human↔AI).

## Why It Matters
Understanding the five-component structure prevents the mistake of treating an LLM integration as a standalone script. Every production AI app — no matter how simple — requires all five layers to be secure, scalable, and maintainable.

## How It Works

### Five Core Components
| Component | Role | Example Tech |
|-----------|------|-------------|
| UI (Frontend) | User-facing interface; collects input, renders output | React, Next.js, Gradio, Streamlit |
| API (Backend) | Middleman; processes requests, routes to AI/DB | FastAPI, Flask, Express.js |
| AI Model (LLM) | Processes language, generates responses | GPT-4, Claude, Llama (via Groq) |
| Database | Stores persistent data: users, history, state | PostgreSQL (Supabase), Pinecone (vectors) |
| Deployment | Makes app accessible over internet | Vercel, Railway, Render, AWS |

### Three Interface Types
- **UI** — human-to-machine: visual buttons, forms, chat inputs
- **API** — machine-to-machine: HTTP calls, JSON payloads, standard verbs (GET/POST/PUT/DELETE)
- **Language** — human-to-AI: natural language prompt as interface (LLMs make this possible)

### Architecture Evolution (3 Levels)
**Level 1 Stack:** Gradio UI + Python backend in one file; in-memory data; Hugging Face Spaces deployment

**Level 2 Stack:** Streamlit frontend + FastAPI backend (separate files); CSV file storage; Hugging Face Spaces

**Level 3 Stack:** Next.js + FastAPI + Supabase (PostgreSQL + Auth + RLS); production-ready; Vercel + Railway

### Complete Production Data Flow
1. User sends query through Next.js frontend
2. Frontend calls FastAPI backend endpoint
3. Backend authenticates user with Supabase
4. Check Redis cache for similar queries
5. If not cached, retrieve context from vector DB (Pinecone)
6. Pass context + query to LLM API
7. Stream response back to frontend
8. Log interaction (Langfuse/Sentry)
9. Cache response for future queries

## Key Variants / Extensions
- **Minimal Stack** — FastAPI + Supabase + any LLM; sufficient for 80% of GenAI apps
- **RAG Stack** — adds Pinecone for vector storage; needed when knowledge base exceeds context window
- **Agent Stack** — adds memory layer, tool-calling, multi-step reasoning; needed when tasks are dynamic
- **Multi-tenant Stack** — adds RLS policies in Supabase; needed when multiple users own separate data

## Examples
- **Perplexity AI** — search wrapper: UI → API → LLM + web search → response
- **Cursor** — code tool: IDE (UI) → LLM API → response streamed back
- **ChatBase** — chatbot builder: UI → FastAPI → RAG pipeline → Supabase

## Connections
Related concepts: [[six-easy-pieces-philosophy]], [[domain-modeling]], [[fastapi-patterns]], [[production-genai-stack]], [[retrieval-augmented-generation]], [[opt-framework]]
Introduced by: [[100x-cohort7-module2-llm]], [[six-easy-pieces-for-llms]]

## Open Questions / Unknowns
- When does a Level 2 stack need to become Level 3? (Rough trigger: real users, persistent data, multi-session state)
- How does MCP change this architecture as it matures? (MCP may replace custom API integration for tool access)
