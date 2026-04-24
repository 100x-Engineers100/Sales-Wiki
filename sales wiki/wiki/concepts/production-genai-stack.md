---
title: "Production GenAI Stack"
type: concept
tags: [architecture, production, deployment, llm, 100x-cohort7]
source_count: 2
---

## Definition
The production GenAI stack is the combination of services that makes an LLM application scalable, observable, and cost-controlled in a real-world deployment: Next.js + FastAPI + Supabase + Pinecone + Redis + Langfuse/Sentry.

## Why It Matters
A development prototype (Gradio + single Python file) breaks under real users, real data, and real concurrency. The production stack solves authentication, vector retrieval, response caching, cost observability, and error monitoring — without requiring custom infrastructure from scratch.

## How It Works

### Complete Stack
| Layer | Component | Role |
|-------|-----------|------|
| Frontend | Next.js (Vercel) | SSR, API routes, fast CDN deployment |
| Backend | FastAPI (Railway) | Async LLM calls, business logic, auth proxy |
| Database | Supabase (PostgreSQL + pgvector) | Relational data + Auth + RLS + optional vector search |
| Vector DB | Pinecone | High-scale embedding storage and semantic search |
| Cache | Redis (Upstash) | Semantic caching of LLM responses |
| Auth | Supabase Auth | Email/social login, JWT, RLS enforcement |
| File Storage | AWS S3 | Original documents, images |
| Monitoring | Sentry + Langfuse | Error tracking + LLM-specific observability |
| LLM | OpenAI GPT-3.5/4 + Claude fallback | Primary generation with cost-tiered fallback |

### Production Data Flow
1. User sends query → Next.js frontend
2. Frontend calls FastAPI backend endpoint
3. Backend authenticates user via Supabase
4. Check Redis cache for semantically similar query
5. If not cached → retrieve context from Pinecone
6. Pass context + query to LLM API
7. Stream response back to frontend
8. Log interaction (Langfuse: tokens, cost, latency)
9. Cache response in Redis (TTL: 1 hour)

### Why Next.js Over React/Gradio
- **Gradio/Streamlit** — prototypes only; not production UX
- **React SPA** — good but requires separate hosting + no SSR
- **Next.js** — built-in API routes, SSR, easy Vercel deployment, industry standard for GenAI apps

### Why FastAPI Over Flask/Django
- Async support — critical for concurrent LLM API calls
- Pydantic validation — type-safe request/response contracts
- Auto-generated docs — Swagger UI at `/docs`
- Performance — comparable to Node.js for I/O-bound workloads

### Why Supabase Over Firebase
- PostgreSQL not NoSQL — relational integrity, joins, transactions
- RLS (Row-Level Security) — fine-grained per-user data access
- Built-in auth — no separate auth service needed
- pgvector extension — can serve as vector DB for smaller scale
- Open-source — exportable, no vendor lock-in

### Redis Caching Pattern
```python
import redis
from hashlib import md5

redis_client = redis.Redis(host='localhost', port=6379)

def get_cached_response(prompt):
    cache_key = md5(prompt.encode()).hexdigest()
    cached = redis_client.get(cache_key)
    if cached:
        return cached.decode()
    response = call_llm(prompt)
    redis_client.setex(cache_key, 3600, response)  # 1hr TTL
    return response
```

### Deployment Platform Selection
| Hosting | Use Case |
|---------|----------|
| Vercel | Next.js frontend (auto-detects, free tier) |
| Railway | FastAPI backend (Python auto-detect, auto-scaling) |
| Render | Alternative to Railway (free tier, slower cold start) |
| AWS/GCP | Enterprise scale; requires DevOps knowledge |

### Monitoring Strategy
Log every LLM call with: `timestamp`, `user_id`, `prompt`, `response`, `tokens_used`, `cost`, `latency`
- **Langfuse** — LLM-specific: trace chains, token costs, latency per call
- **Sentry** — application errors, performance monitoring
- Store in separate analytics DB — don't mix with application data

## Key Variants / Extensions
- **Minimal Stack (80% of apps)** — Next.js + FastAPI + Supabase + LLM API only. Add Pinecone/Redis when you hit scale.
- **Agent Stack** — adds session/memory layer (MemZero, SuperMemory), tool registry, tracing (LangSmith)
- **Self-hosted stack** — replace Pinecone with Qdrant/Weaviate, OpenAI with Llama on Modal

## Examples
**Architecture from L17 (EOS Labs):**
- Frontend: Next.js on Vercel
- Backend: FastAPI on Railway
- DB: Supabase (PostgreSQL + pgvector)
- Vector: Pinecone
- Auth: Supabase Auth
- Cache: Redis (Upstash)
- Monitoring: Sentry + Langfuse
- LLM: OpenAI GPT-3.5/4 with Claude fallback

## Connections
Related concepts: [[full-stack-llm-architecture]], [[fastapi-patterns]], [[domain-modeling]], [[cost-optimization-patterns]], [[retrieval-augmented-generation]]
Introduced by: [[100x-cohort7-module2-llm]]

## Open Questions / Unknowns
- When does pgvector in Supabase become insufficient vs dedicated Pinecone? (Rough trigger: >1M vectors)
- How does the stack change when adding real-time streaming for agent workflows?
