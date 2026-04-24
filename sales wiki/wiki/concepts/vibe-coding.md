---
title: "Vibe Coding"
type: concept
tags: [ai-tools, development-workflow, product, 100x-cohort7]
source_count: 1
---

## Definition
Vibe coding is AI-assisted code generation using natural language instructions — using tools like Lovable, Bolt.new, or V0 to generate working code from a Product Requirements Document (PRD), treating the LLM as a collaborative developer that amplifies existing technical knowledge rather than replacing it.

## Why It Matters
Vibe coding compresses the time from idea to working prototype from days to hours. But it is not autonomous — the output quality is directly proportional to the quality of the input context (PRD, existing architecture details, tech constraints). Engineering fundamentals are still required to guide the AI, debug its output, and scale beyond the MVP.

## How It Works

### The GIGO Principle (Core Rule)
**Garbage In, Garbage Out.** AI tools are amplifiers, not mind-readers.

- Vague prompt: "Build me a dashboard" → generic, non-functional output with hardcoded data and broken submissions
- Specific PRD with existing architecture context → 70-80% complete working code matching your stack

The AI has no knowledge of your existing FastAPI backend, your Supabase schema, or your REST API patterns unless you explicitly provide them.

### PRD-First Workflow
Before opening any AI tool, write a half-page PRD:
- **Purpose** — what problem does this solve?
- **Users** — who are the actors?
- **Core features** — 3-5 specific bullet points
- **Data structure** — what entities and relationships?
- **Technical constraints** — uses FastAPI, connects to Supabase, existing auth from Lecture 6

Generate the PRD using an LLM as a product manager: *"Interview me about a feature I want to build. Ask 5-6 questions. Write a half-page PRD."*

### Tool Landscape
| Tool | Category | Best For |
|------|----------|----------|
| Lovable | UI designer | Rapid UI prototyping, React components, Supabase integration |
| V0 (by Vercel) | UI designer | Pixel-perfect React components with Tailwind |
| Bolt.new | UI designer | Quick general experiments |
| Cursor | Code refiner | Refining AI-generated code, debugging, tests |
| Windsurf | Code refiner | Similar to Cursor, strong git integration |
| Claude Code | Architect | Architectural decisions, large refactors, service boundaries |
| Gemini Pro 3 | Architect | 2M token context; analyze entire codebases |

### Iteration Loop
1. Write PRD
2. Generate in Lovable/V0
3. Iterate: "Add a filter dropdown", "Change colors to match brand", "Show error state"
4. Export to GitHub when 70% complete
5. Clone locally, refine with Cursor using `@codebase` context
6. Fix what Lovable got wrong (state management, API connections, auth)

### When Vibe Coding Gets You to MVP
- Lovable reached $17M ARR, 500,000 users, 25,000 products/day
- One user built a $30K app in 10 days with minimal coding
- Anthropic's team built ~20 feature prototypes in a few hours using Claude Code

### Where Engineering Knowledge Still Matters
- Spotting broken database schema (single JSON field vs proper relational tables)
- Recognizing when hardcoded auth (`user === 'user123'`) is a security hole
- Connecting Lovable output to existing FastAPI routes and Supabase schemas
- Knowing which async patterns to apply for LLM calls
- Debugging when the AI-generated code fails silently

## Key Variants / Extensions
- **No-Code Vibe Coding** — n8n, LangFlow for workflow automation without writing code
- **AI filmmaking** — applying the same pattern to Runway, Pika, SDXL for video generation
- **PRD → Cursor (no Lovable)** — skip UI generation tools; use Cursor Composer directly with PRD
- **Claude Code architecture mode** — describe system design intent, Claude generates structure + migration scripts

## Examples
**The Two-Demo Contrast (from lecture):**
- Bad: "Build me a dashboard" → Bolt.new generates something that looks real but: empty `handleSubmit()`, single JSON field database, hardcoded auth. Looks like a movie set.
- Good: Paste full PRD + existing routes.py + Supabase schema → Bolt.new generates code that connects to your actual database, uses your auth patterns, follows your API structure. 80% there instead of 0%.

## Connections
Related concepts: [[ship-cycle]], [[opt-framework]], [[ppt-framework]], [[full-stack-llm-architecture]], [[fastapi-patterns]]
Introduced by: [[100x-cohort7-module2-llm]]

## Open Questions / Unknowns
- At what project scale does vibe coding become net-negative? (Context pollution, tech debt from AI-generated code)
- How do AI coding tools handle stateful logic (reducers, complex state machines)?
