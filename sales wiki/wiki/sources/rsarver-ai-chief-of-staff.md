---
title: "How I Built a Chief of Staff on OpenClaw That's Better Than Any Human I've Hired"
type: source
source_type: article
author: "rsarver (@rsarver)"
date: 2026-04-06
raw_path: raw/clippings/rsarver-ai-chief-of-staff.md
tags: [ai, agents, productivity, memory, chief-of-staff, openclaw]
---

## Summary

A VC managing a fundraise and multiple portfolio companies describes building an AI chief of staff called "Stella" on OpenClaw (an AI coding/agent tool). Stella now outperforms every human EA and chief of staff he's worked with — never forgets commitments, handles small tasks unprompted, flags important things without being asked, and improves every week.

The two defining innovations are the memory architecture and the self-improvement (Kaizen) loop. Without persistent memory, AI assistants have amnesia. With a two-layer memory system, they accumulate context like a person who has been working with you for months. Without a Kaizen loop, the system stays static. With weekly self-review and external research, it measurably improves on a cadence.

The system covers: meeting prep/follow-through, task management, stakeholder CRM, information filtering, operational rhythm (morning/evening briefs), and research digests.

## Key Ideas

- **Memory layer 1 — daily notes**: One markdown file per day (`memory/YYYY-MM-DD.md`). Raw log of meetings, decisions, tasks, context. Written automatically by a script throughout the day.
- **Memory layer 2 — MEMORY.md**: Long-term memory curated by Stella. Key people, active projects, lessons, decisions. Synthesized from daily notes. Read on startup.
- **Flat markdown files over database**: Human-readable, auditable, git-backable. No abstraction layer between operator and assistant's understanding. Trust comes from transparency.
- **Kaizen loop**: Every Friday a cron job runs — Stella scans community, finds new patterns, saves findings. Sunday: review together, implement changes. System also learns from daily friction patterns.
- **Layer separation rule**: LLMs handle judgment (synthesis, prioritization, drafting). Scripts handle everything deterministic (file reading, API calls, timestamps). Mixing layers causes unpredictable failures.
- **Meeting prep**: Brief arrives 60 min before external meetings via WhatsApp. Pulls prior meeting notes, email threads, open action items, pipeline stage. Processed through Granola API for notes → action items → Todoist.
- **CRM at scale**: Persistent structured context on every person, company, project. Relationship history, last touchpoint, open commitments. Compounds visibly over time.
- **Task management split**: Markdown (full context + history) as source of truth. Todoist for near-term execution view. Both kept in sync by Stella.
- **Evening sweep**: Flags overdue tasks, patterns of delay, upcoming high-stakes prep needs.
- **Operational rhythm**: 9am morning brief, 6pm evening wrap, both via WhatsApp.

## Notable Quotes / Moments

> "Session memory is a lie. Any assistant that treats conversation history as its working context will fail you at the most frustrating moments."

> "Without this layer you have a capable assistant with amnesia. With it you have something closer to a person who's been working alongside you for months and never forgets anything."

> "LLMs handle judgment, and scripts handle everything else. [...] When you push deterministic work through an LLM, things break in unpredictable ways and you stop trusting the system."

> "I didn't get the best assistant I've ever had by asking better questions. I got it by giving the system a better operating model."

## Concepts Introduced
[[ai-memory-architecture]], [[ai-agent-kaizen-loop]], [[deterministic-vs-generative-separation]], [[ai-chief-of-staff-pattern]]

## Entities Mentioned
[[openclaw]], [[todoist]], [[granola]]

## Contradictions / Tensions
None vs existing wiki. Complements Karpathy's pattern — both emphasize persistent, structured knowledge over stateless generation.

## Open Questions
- How does the daily note synthesis actually work in practice (what triggers it, how often)?
- What does the Stella system prompt / MEMORY.md structure look like?
- Could this pattern be applied at company level, not just personal level?
