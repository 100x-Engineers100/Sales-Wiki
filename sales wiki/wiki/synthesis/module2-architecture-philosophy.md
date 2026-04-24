---
title: "Module 2 Architecture Philosophy — Six Easy Pieces to Full-Stack Reality"
type: synthesis
sources: [six-easy-pieces-for-llms, 100x-cohort7-module2-llm]
tags: [full-stack, architecture, philosophy, 100x-cohort7]
---

## Question / Framing
Why is the Module 2 full-stack LLM stack — FastAPI, Supabase, Next.js, Pinecone, Redis — structured the way it is? What is the philosophical justification for each layer? How do the Six Easy Pieces map to actual lectures and production decisions?

## Analysis

### The philosophical chain (Six Easy Pieces → Module 2 lectures)

**Piece 1: Screen & Machine** → `[[full-stack-llm-architecture]]` L1/L2
The UI/server split is not a design preference. The screen physically cannot access a database directly — different processes, different machines, different trust boundaries. This is the reason a frontend (Next.js/Lovable) and a backend (FastAPI) exist as separate layers. Every API call in Module 2 is justified by this physical separation.

**Piece 2: The Conversation** → `[[fastapi-patterns]]` L3/L4
HTTP is the postal system: GET/POST/PUT/PATCH/DELETE are the verbs, JSON is the envelope, status codes are delivery receipts. FastAPI is the implementation of this conversation. `@app.get()` and `@app.post()` decorators are not arbitrary syntax — they are the language of HTTP.

**Piece 3: The Contract** → `[[domain-modeling]]` L5, `[[fastapi-patterns]]` L4
HTTP ≠ API. HTTP is the postal system. An API is the specific contract — the exact forms you fill in, the exact data you send. REST is a design style for that contract. Pydantic models in FastAPI enforce the contract. `domain-modeling` (drawing the ERD before touching any code) is how you design the contract before implementing it.

**Piece 4: The Memory** → `[[domain-modeling]]` L5/L6, Supabase L6
A database is a spreadsheet at scale. Tables have relationships (1:1, 1:N, M:N). Row Level Security (RLS) is not just security — it is trust architecture: who is allowed to read which rows of which tables. Supabase's `anon key` (RLS enforced) vs `service_role key` (bypasses RLS) is the production manifestation of this trust model.

**Piece 5: The Connections** → `[[production-genai-stack]]` L17
The 6-step system trace (client → HTTP → FastAPI → business logic → Supabase → back) is made concrete in the production stack: Next.js → FastAPI → Supabase + Pinecone + Redis + Langfuse. Architecture gives freedom *through* constraints — the constraint of the separation means each layer can be replaced, scaled, or debugged independently.

**Piece 6: The Whole Thing** → `[[ship-cycle]]` L7/L8
The 7-step flow (find the problem → PRD → build → test → refine → deploy → measure) maps to the 9-step ship cycle. The deepest lesson from Piece 6: find the problem FIRST. The entire ship cycle starts with a PRD, not with a framework choice.

### Where Six Easy Pieces explains Module 2 decisions students find confusing

| Student confusion | Six Easy Pieces answer |
|-------------------|----------------------|
| "Why do we need both a frontend and a backend?" | Piece 1: physical separation is non-negotiable |
| "Why does FastAPI use decorators?" | Piece 2: decorators map to HTTP verbs |
| "Why draw an ERD before touching code?" | Pieces 3+4: the contract and the memory must be designed before implementation |
| "Why is RLS important?" | Piece 4: it's trust architecture, not just security theatre |
| "Why is this stack so complicated?" | Piece 5: each layer solves one specific problem — complexity is earned, not added |

## Conclusions
1. The Module 2 tech stack is not a list of tools — it is a physical and logical necessity derived from first principles.
2. Six Easy Pieces should be read BEFORE starting Module 2 lectures, not after. It is the "why" that makes the "what" of each lecture legible.
3. Any student confused about why they're learning FastAPI or Supabase should be directed here first.
4. The ship cycle (Piece 6) shows that the stack exists to serve the problem — not the other way around. Tool choice follows problem definition.

## Contradictions
None found between the two sources. Six Easy Pieces is the philosophy; Module 2 lectures are the practice. They are designed to be coherent.

## Further Research
- How does the Six Easy Pieces philosophy extend to Module 3 agents? (The API/memory/trust architecture established in Module 2 is what agents rely on when calling tools.)
- Does the MCP protocol (Module 2 L11/L12) represent a 7th "easy piece"? It solves the M+N tool integration problem that the original 6 pieces don't address.
