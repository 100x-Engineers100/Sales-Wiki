---
title: "Ship Cycle"
type: concept
tags: [vibe-coding, deployment, development-workflow, 100x-cohort7]
source_count: 1
---

## Definition
The 9-step ship cycle is the complete workflow from idea to live product: PRD → Lovable → test → GitHub export → Cursor → refine → tests → git → deploy. It treats AI coding tools as amplifiers for existing technical knowledge, not replacements for it.

## Why It Matters
Most developers treat localhost as "practice" and assume deployment requires weeks of "productionizing." The ship cycle breaks this mental block: code written in Week 4 of learning FastAPI is already production-ready. The gap between localhost and live URL is git push + 5 minutes of platform configuration.

## How It Works

### The 9 Steps

**Step 1 — PRD with LLM assist**
Open ChatGPT with persona prompt: *"You are an expert product manager. Interview me about a feature I want to build. Ask 5-6 questions. Then write a half-page PRD."*
Output: Purpose, Users, Core features (3-5 bullets), Data structure notes, Technical constraints

**Step 2 — Generate in Lovable**
Paste PRD into Lovable. Iterate with chat commands:
- "Change primary color to blue"
- "Add a data table showing submission history"
- "Integrate Supabase auth"
Goal: 70-80% complete UI fast. Lovable is optimized for speed, not perfection.

**Step 3 — Test in cloud**
Preview in Lovable's live preview. Do buttons do what they should? If not, refine the prompt.

**Step 4 — Export to GitHub**
Lovable → Settings → Export to GitHub. Pushes to your GitHub repo.

**Step 5 — Clone and open in Cursor**
```bash
git clone https://github.com/username/your-app.git
cd your-app
```
Open in Cursor or VS Code. Now in real dev environment.

**Step 6 — Refine with Cursor**
Use `@codebase` to give Cursor context. Use Composer to add features.
Cursor's context system:
- `@codebase` — scans entire project structure
- `@docs` — points to API documentation
- `@file` — references specific files (e.g., routes.py from Lecture 4)

Key: give Cursor context about your existing backend (FastAPI structure, Supabase schema) before asking it to generate anything. AI amplifies precision when given precision.

**Step 7 — Add tests**
Ask Cursor: "Write tests for this endpoint." Run them. Fix what fails.

**Step 8 — Version control**
Small, frequent commits:
```bash
git add specific-file.py
git commit -m "Add user dashboard"
git push
```

**Step 9 — Deploy**
```bash
# On Render/Railway:
# Build command: pip install -r requirements.txt
# Start command: uvicorn main:app --host 0.0.0.0 --port $PORT
```
Platform reads `requirements.txt`, installs dependencies, starts server. `$PORT` not `8000` — platform assigns port.

### Tool Specialization
| Tool | Role | When to Use |
|------|------|-------------|
| Lovable / V0 | UI designer | Prototyping frontend, landing pages, dashboards |
| Cursor / Windsurf | Code refiner | Refining generated code, adding features, debugging |
| Claude Code | Architect | Greenfield decisions, large refactors, service boundaries |

### The Three Common Deployment Errors
1. **Port binding** — hardcoded `:8000` breaks on Render; use `$PORT` env var
2. **Missing dependencies** — package not in `requirements.txt`; run `pip freeze > requirements.txt`
3. **Environment variable typos** — one wrong character breaks Supabase connection; compare letter-by-letter

## Key Variants / Extensions
- **GIGO Principle** — Garbage In, Garbage Out: vague PRD → vague AI output; specific context → precise code
- **AI tools as amplifiers** — they multiply your existing knowledge; zero knowledge → zero output × multiplier = zero
- **PRD-driven development** — always write the PRD before opening any AI tool; the document is the instruction set

## Examples
**Real validations (from lecture):**
- Lovable reached $17M ARR with 500,000 users building 25,000 products/day
- One user built a $30K app in 10 days with minimal coding
- Kavya (Cohort 4): internal Slack bot using this exact cycle, boss asked to pay for it after 1 week
- Anthropic's team: 60-100 internal releases/day, ~5 PRs per developer/day (vs industry standard 1-2)

## Connections
Related concepts: [[vibe-coding]], [[fastapi-patterns]], [[full-stack-llm-architecture]], [[opt-framework]]
Introduced by: [[100x-cohort7-module2-llm]]

## Open Questions / Unknowns
- Where does this workflow break at team scale? (multiple devs, shared codebase, CI/CD pipelines)
- How does the cycle change when starting with an existing codebase vs greenfield?
