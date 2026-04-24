---
title: "LLM Wiki Pattern"
type: concept
tags: [knowledge-management, llm, wiki, second-brain, rag]
source_count: 1
---

## Definition
A method of building and maintaining personal knowledge bases where the LLM incrementally compiles raw sources into a persistent, interlinked wiki — rather than retrieving from raw sources on every query (RAG). Knowledge is built once and kept current; not re-derived on demand.

## Why It Matters
RAG re-discovers knowledge from scratch on every question. Nothing compounds. Ask a question requiring synthesis of five documents and the LLM has to find and piece together fragments every time.

The wiki pattern makes knowledge compound. By the time you ask a question, the cross-references are already there, the contradictions have already been flagged, and the synthesis already reflects everything read. The more sources added, the richer the answers become — with no additional retrieval overhead.

## How It Works
**Three layers:**
1. **Raw sources** — immutable collection of source documents (articles, notes, transcripts). LLM reads; never modifies.
2. **Wiki** — LLM-owned directory of markdown files: summaries, entity pages, concept pages, comparisons, synthesis. LLM creates and updates.
3. **Schema (CLAUDE.md)** — config file defining wiki structure, conventions, and workflows. Makes the LLM a disciplined maintainer rather than a generic chatbot.

**Three operations:**
- **Ingest**: New source arrives → LLM reads it → writes summary page → updates 10-15 wiki pages (concepts, entities, cross-references) → appends to log
- **Query**: Read index → read relevant pages → synthesize answer with citations → file valuable answers as synthesis pages
- **Lint**: Periodic health check — find contradictions, orphan pages, stale claims, missing pages

**Two navigation files:**
- `index.md` — content catalog. LLM reads first on every query to find relevant pages. Sufficient for ~100 sources.
- `log.md` — append-only chronological record. Parseable with grep.

## Key Variants / Extensions
- **Personal second brain**: tracking goals, health, psychology, journal entries
- **Research wiki**: going deep on a topic over weeks/months, evolving thesis
- **Book companion**: filing each chapter as you read, building character/theme/plot pages
- **Team/company wiki**: fed by Slack, meetings, project docs — maintained by LLM, humans review
- **Competitive analysis, due diligence, trip planning, course notes**

## Examples
- This vault (Zeno Second Brain) — AI/GenAI knowledge base for company use
- Karpathy's own implementation: Obsidian vault + Claude Code as LLM maintainer
- Fan wikis (e.g. Tolkien Gateway) — what a personal reading wiki could become over time

## Connections
Related concepts: [[rag-vs-wiki-comparison]], [[ai-memory-architecture]], [[knowledge-base-architecture]]
Introduced by: [[karpathy-llm-wiki-pattern]]

## Open Questions / Unknowns
- At what scale (source count) does `index.md` need to be replaced by proper search (qmd, embeddings)?
- Best practices for schema design in domain-specific wikis?
- How to handle ingest of very long sources (book-length)?
