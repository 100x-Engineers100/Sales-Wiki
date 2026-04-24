---
title: "LLM Wiki Pattern — Andrej Karpathy"
type: source
source_type: article
author: "Andrej Karpathy"
date: 2026-04-09
raw_path: raw/meta/karpathy-llm-wiki-gist.md
tags: [ai, knowledge-management, llm, wiki, second-brain]
---

## Summary

Karpathy proposes a fundamentally different approach to LLM-powered knowledge management. Instead of RAG (retrieve-and-generate on demand), the LLM incrementally builds and maintains a persistent wiki — a structured, interlinked set of markdown files that sits between the user and their raw sources. When a new source is added, the LLM reads it, extracts key information, and integrates it into the existing wiki: updating entity pages, revising concept summaries, flagging contradictions. Knowledge is compiled once and kept current, not re-derived on every query.

The wiki is a compounding artifact. Cross-references are pre-built. Contradictions have already been flagged. The synthesis already reflects everything read. Each ingest and each answered query makes it richer.

The human's job: source curation, directing analysis, asking good questions. The LLM's job: all the bookkeeping — summarizing, cross-referencing, filing, maintaining consistency across dozens of pages. Humans abandon wikis because maintenance cost exceeds value. LLMs never get bored and can touch 15 files in one pass.

Karpathy frames this as the realization of Vannevar Bush's Memex (1945) — a personal, curated knowledge store with associative trails. Bush's vision was closer to this than to what the web became. The part Bush couldn't solve was who does the maintenance. The LLM handles that.

## Key Ideas

- **RAG vs Wiki**: RAG re-derives knowledge on every query. The LLM wiki compiles it once and keeps it current. The wiki is a persistent artifact; RAG is stateless re-discovery.
- **Three layers**: Raw sources (immutable), Wiki (LLM-owned markdown), Schema (CLAUDE.md — configures the LLM's behavior as wiki maintainer)
- **Ingest operation**: LLM reads source → discusses key takeaways → writes summary page → updates entity/concept pages (can touch 10-15 pages per source) → appends to log
- **Query operation**: LLM reads index → reads relevant pages → synthesizes answer with citations → valuable answers can be filed back as synthesis pages
- **Lint operation**: Periodic health check — find contradictions, orphan pages, stale claims, missing concept pages
- **index.md**: Content-oriented catalog. LLM reads this first on every query to find relevant pages. Avoids need for embedding-based RAG at moderate scale (~100 sources).
- **log.md**: Append-only chronological record. Parseable with grep. Gives timeline of wiki evolution.
- **The schema (CLAUDE.md)**: The key config file. Makes the LLM a disciplined wiki maintainer rather than a generic chatbot. Co-evolved over time.
- **Obsidian as IDE**: LLM makes edits; Obsidian is for browsing. Graph view shows shape of knowledge. Marp for slide decks from wiki content. Dataview for dynamic queries on frontmatter.
- **Optional CLI tools**: qmd — local search engine for markdown with hybrid BM25/vector + LLM re-ranking. Has MCP server.
- **Obsidian Web Clipper**: Browser extension to convert articles to markdown for raw collection.
- **Git for version control**: The wiki is just a git repo. History, branching, collaboration for free.

## Notable Quotes / Moments

> "The tedious part of maintaining a knowledge base is not the reading or the thinking — it's the bookkeeping. [...] Humans abandon wikis because the maintenance burden grows faster than the value. LLMs don't get bored, don't forget to update a cross-reference, and can touch 15 files in one pass."

> "The wiki is a persistent, compounding artifact. The cross-references are already there. The contradictions have already been flagged. The synthesis already reflects everything you've read."

> "The human's job is to curate sources, direct the analysis, ask good questions, and think about what it all means. The LLM's job is everything else."

## Concepts Introduced
[[llm-wiki-pattern]], [[rag-vs-wiki-comparison]], [[knowledge-base-architecture]], [[vannevar-bush-memex]]

## Entities Mentioned
[[andrej-karpathy]], [[obsidian]], [[qmd-search]]

## Contradictions / Tensions
None yet — this is the foundational source for this wiki's own architecture.

## Open Questions
- At what scale does index.md become insufficient vs embedding-based search?
- Best practices for domain-specific schema design?
- How to handle sources with conflicting claims at ingest time?
