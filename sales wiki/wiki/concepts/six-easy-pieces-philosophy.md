---
title: "Six Easy Pieces Philosophy"
type: concept
tags: [full-stack, web-architecture, first-principles, http, api, database, rls, 100x-cohort7]
source_count: 1
---

## Definition
A first-principles pedagogical method for teaching full-stack web architecture: instead of listing technologies, ask a series of forced questions. Each answer reveals why a concept must exist before naming it. The six pieces build from a single physical constraint (user and server are in different places) to the complete mental model of any web application.

This is the philosophical entry point to all of Module 2. Any student confused about WHY they're learning FastAPI, Supabase, or REST APIs should start here.

## Why It Matters
Tool-first learning of full-stack development creates confusion because each technology appears arbitrary. Principle-first learning reveals that each piece is the only logical answer to a specific constraint. Once you see the chain of necessity, every tool becomes obvious — not a fact to memorize but a conclusion you could have derived yourself.

**The deepest lesson:** Every technology is an answer to a question. Find the question first.

## How It Works

**Piece 1 — The Screen and the Machine**
*Question: How does a user interact with your program?*
The user and the server are physically separated. The split into interface + server is not a design choice — it is a consequence of physical reality. Everything else follows from this single constraint.
- Interface: draws UI, captures input, displays output (runs in user's browser)
- Server: does the actual processing (runs on a machine you control)
- They must communicate → leads to Piece 2

**Piece 2 — The Conversation**
*Question: How do two programs communicate across the internet?*
HTTP is the postal system. It defines the envelope format — not what's inside. Three parts of every HTTP message: URL (address), method (action type: GET/POST/PUT/PATCH/DELETE), body (content, formatted as JSON). Response = status code + data. HTTP carries any message reliably but does not define what to put inside → leads to Piece 3.

**Piece 3 — The Contract**
*Question: What goes inside the envelope?*
HTTP ≠ API. HTTP is the universal postal system. An API is the specific contract for one service — the forms a specific organization accepts. REST is a design style for APIs: URLs are nouns (resources), HTTP methods are verbs (actions). The contract gives freedom on both sides: swap AI providers without touching the interface; build mobile app reusing same server. The contract is the boundary.

**Piece 4 — The Memory**
*Question: What happens when the user closes the browser and comes back tomorrow?*
Without a database, every session starts from zero. Databases provide persistent storage. Relational databases organize data into tables (like spreadsheets). Domain modeling: identify the "things" in your application (nouns) → one table per thing → define relationships (one-to-many is most common) → foreign keys link tables. Row Level Security (RLS) moves access control into the database itself — enforced on every query automatically, not scattered through application code.

**Piece 5 — The Connections**
*Question: How does a full user action flow through the entire system?*
6-step trace: (1) user types → (2) interface sends POST → (3) server verifies identity + saves to DB + forwards to AI → (4) AI responds → (5) server saves response + returns → (6) interface displays. Architecture: interface never touches AI or DB directly; server holds all connections; AI is stateless; DB stores everything persistent. Change one piece without touching others — contracts are the boundaries.

**Piece 6 — The Whole Thing**
*Question: What is the complete mental model?*
7-step flow naming every component. The deepest lesson: do not start with "I need a database." Start with "my application needs to remember things." Problems lead you to the right solutions, and you understand them deeply because you arrived at them yourself.

**The chain of necessity:**
```
User and server separated → need an interface + server
Programs on different machines → need HTTP
HTTP doesn't define content → need an API contract
APIs benefit from consistency → REST conventions
Application must remember → need a database
Database needs protection → need Row Level Security
All pieces must connect → the architecture
```

## Key Variants / Extensions
- **Build in layers principle**: interface only → add AI → add database. Each step reveals the need for the next. Don't add complexity before you need it.
- **Contracts as boundaries**: the same principle that explains REST APIs explains why services can change their internals without breaking callers — as long as the contract stays the same.

## Examples
- Gradio app: interface piece (Piece 1) — tightly coupled to backend, no reusability → why you need APIs (Piece 3)
- FastAPI endpoint: the server piece with contract defined via Pydantic schema
- Supabase: the memory piece (Piece 4) with built-in Row Level Security
- Full 100x Module 2 stack: Next.js (Piece 1) + FastAPI (Piece 3) + Supabase (Piece 4) + AI provider (invoked by server)

## Connections
Related concepts: [[full-stack-llm-architecture]], [[domain-modeling]], [[fastapi-patterns]], [[ppt-framework]], [[llm-decision-tree]]
Introduced by: [[six-easy-pieces-for-llms]]

## Open Questions / Unknowns
- Where does authentication fit in this mental model? (implied in Piece 5 but not given its own piece)
- How does the six-piece model extend when the "server" is itself a multi-service architecture?
