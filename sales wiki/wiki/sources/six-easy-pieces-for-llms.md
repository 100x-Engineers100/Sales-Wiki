---
title: "Six Easy Pieces for Full-Stack LLM Applications"
type: source
source_type: course_notes
author: "Siddhant Goswami (100x Engineers)"
date: 2026-04-09
raw_path: raw/courses/Six Easy Pieces for Full-Stack LLM Applications_mod 2.txt
tags: [ai, llm, full-stack, api, database, http, rest, rls, 100x-cohort7, first-principles]
---

## Summary

A first-principles guide to building complete LLM-powered web applications. Unlike traditional full-stack courses that list technologies and show usage, this document asks a series of simple questions — each answer reveals WHY a particular concept must exist before naming it.

The central pedagogical method: derive necessity from constraint. The user and the server are physically separated → interface and logic must split. Programs must communicate → HTTP. Programs need agreements → APIs and REST. Applications must remember → databases. Data must be protected → Row Level Security. All these pieces must connect → the complete architecture.

The document culminates in the deepest lesson: every technology is an answer to a question. Find the problem first. This is the philosophical entry point to all of Module 2.

## Key Ideas

- **Piece 1 — The Screen and the Machine**: The UI/server split is not a design choice — it is a physical necessity. The user and the machine are in different places. Once accepted, everything follows: the interface draws and captures, the server processes, they communicate over the internet. Three-component architecture emerges from one constraint.

- **Piece 2 — The Conversation**: HTTP is the postal system of the internet. It doesn't care what your programs are discussing — it defines the envelope (URL = address, method = action type, body = content, JSON = universal format). Five methods: GET (fetch), POST (create/send), PUT (replace), PATCH (partial update), DELETE (remove). Response = status code + data. HTTP carries the envelope reliably; it does not define what's inside.

- **Piece 3 — The Contract**: HTTP ≠ API. HTTP is the universal delivery mechanism. An API is the contract for a specific service — the set of forms a specific organization accepts. REST is a design style for APIs: resources as nouns (URLs), actions as verbs (HTTP methods). "REST API" = API that follows these conventions. OpenAI, Stripe, GitHub all use REST. Contracts give freedom on both sides — swap the AI provider without touching the interface, build a mobile app reusing the same server.

- **Piece 4 — The Memory**: Without a database, every session starts from zero. A database stores and retrieves data reliably even through power failures. Relational databases organize data into tables (spreadsheets at scale). Domain modeling: identify the "things" (nouns) → one table per thing → define relationships. Three relationship types: one-to-many (most common), one-to-one, many-to-many. Row Level Security (RLS) moves access control from application code into the database — enforced on every query automatically, even if application code forgets to filter.

- **Piece 5 — The Connections**: Full 6-step trace of a user action through the complete system: (1) user types → (2) interface sends POST → (3) server verifies + saves + forwards to AI → (4) AI responds → (5) server saves + returns → (6) interface displays. Architecture: browser (interface only, never touches DB or AI directly) → server (holds all connections) → AI provider (stateless, knows nothing about users) → database (stores everything persistent). Each connection is a structured request/response. Changing one piece doesn't require changing others — contracts are the boundaries.

- **Piece 6 — The Whole Thing**: Complete 7-step flow naming every component. The deepest lesson: every technology is an answer to a question. Find the question first. Build from problems, not from tools. This is how you move from someone who uses tools to someone who understands systems.

## Notable Quotes / Moments

> "This split is not a design choice. It is a consequence of the physical fact that the user and the machine are in different places."

> "HTTP is the postal system. An API is the set of forms a specific organization accepts. The postal system carries any envelope. The tax office only processes tax forms."

> "Row Level Security solves this by moving the access control from your application into the database itself. Instead of hoping every query includes the right filter, you tell the database once: 'Users can only see rows that belong to them.'"

> "Every technology is an answer to a question. Find the question first."

> "This is how you move from someone who uses tools to someone who understands systems."

## Concepts Introduced
[[six-easy-pieces-philosophy]], [[full-stack-llm-architecture]], [[domain-modeling]], [[fastapi-patterns]]

## Entities Mentioned
[[siddhant]], [[100x-engineers]], [[supabase]]

## Contradictions / Tensions
This document is purely about full-stack architecture (UI/API/DB). It does not cover LLM-specific concepts (tool calling, RAG, agents) — those are covered in `[[connecting-llm-dots]]`. The two documents are complementary, not overlapping.

## Open Questions
- Does the course implementation use Supabase's RLS directly as described in Piece 4, or is it abstracted further?
- How does the "build in layers" advice (interface → add AI → add database) map to the actual Module 2 lecture sequence?
