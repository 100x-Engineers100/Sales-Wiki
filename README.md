# Sales Wiki — AI-Powered Second Brain for Sales Reps

> A plug-and-play MCP server that gives every sales rep on your team a personalized AI brain — grounded in real curriculum, real alumni outcomes, and their own selling personality.

---

## What Is This?

Sales Wiki is a **file-based knowledge base + MCP server** built for sales teams that sell AI education. It carries the full context a sales rep needs — curriculum modules, objection playbooks, 70+ alumni success stories, domain-specific angles — and exposes it as tools Claude can call directly in a conversation.

A rep says: `"Get me a call brief for a game designer with 5 years experience"` — and Claude calls the MCP server, fetches the right wiki pages, triggers a live web search for current AI disruption stats in that domain, and returns a structured brief: hook angle, exact lecture names, likely objections, closest alumni story, and FOMO angle.

Everything is grounded. Real lecture names. Real alumni outcomes. Real stats. No hallucination from thin air.

This repo contains two things:
1. **The Obsidian vault** — the knowledge base (`sales wiki/`)
2. **The MCP server** — a Cloudflare Worker that exposes the wiki as tools Claude can call (`sales-mcp-server/`)

---

## The Persona Skill — What Makes This Different

Most AI sales tools give every rep the same generic response. Zeno Wiki goes further: **every rep can build their own persona skill** that makes Claude respond in a way tuned to how that specific rep sells.

### How It Works

The system runs an 8-question interview with the rep:
- What kinds of leads do you reliably convert?
- Where do your calls get hard?
- Which domains are you weak in?
- What do you need mid-call (a quick card? more data?)
- What's your biggest conversion blocker?

From the answers, Claude generates a **persona skill file** — a markdown document that describes:
- That rep's reliable strengths
- Their typical sticking points
- A domain map (strong vs. needs support)
- What format and timing they need from the wiki
- Instructions telling Claude how to adapt its responses for this specific rep

### How to Use It

Once a rep has their persona skill:
1. Add both the persona skill and the Sales Wiki MCP to Claude
2. Ask Claude anything — it will draw on the wiki knowledge AND adapt the response to how that rep thinks and sells
3. The result: every rep gets precision-fitted answers, not one-size-fits-all outputs

This scales to a large team because each rep does the interview once and owns their own skill file. The wiki stays shared. Only the persona layer is individual.

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Obsidian Vault                      │
│                                                      │
│  raw/                 ← Immutable source material    │
│  ├── transcripts/     ← Real call transcripts        │
│  ├── playbooks/       ← Objection handling scripts   │
│  ├── documents/       ← Curriculum, success story CSV│
│  └── courses/         ← Lecture transcripts          │
│                                                      │
│  wiki/                ← LLM-maintained knowledge base│
│  ├── index.md         ← Master catalog               │
│  ├── overview.md      ← Current state + thesis       │
│  ├── log.md           ← Append-only history          │
│  ├── sources/         ← One page per ingested source │
│  ├── concepts/        ← Sales frameworks + AI topics │
│  ├── entities/        ← Companies, people, tools     │
│  └── synthesis/       ← Success stories, domain maps │
│                                                      │
│  skills/              ← Persona interview skill      │
│  CLAUDE.md            ← LLM operating schema         │
│  templates/           ← Page templates               │
└──────────────────────┬──────────────────────────────┘
                       │ sync.js pushes to KV
                       ▼
┌─────────────────────────────────────────────────────┐
│            Cloudflare Worker (MCP Server)            │
│                                                      │
│  KV Store: all wiki pages as key-value pairs         │
│  Durable Objects: one per MCP session                │
│  OAuth: Google login gates access                    │
│                                                      │
│  Tools:                                              │
│  • get_call_brief       → pre-call brief             │
│  • get_objection_response → mid-call objection help  │
│  • draft_followup       → WhatsApp message draft     │
│  • get_index            → full wiki catalog          │
│  • get_page             → any page by key            │
│  • search_wiki          → full-text search           │
│  • visualize            → Mermaid diagrams in chat   │
└──────────────────────┬──────────────────────────────┘
                       │ MCP protocol
                       ▼
        ┌──────────────────────────────┐
        │  Rep + Claude + Persona Skill │
        │  Every response personalized  │
        │  to how that rep actually     │
        │  sells                        │
        └──────────────────────────────┘
```

---

## The 7 MCP Tools

| Tool | When to use | What it returns |
|---|---|---|
| `get_call_brief` | Before a call — pass domain, role, years of experience | Hook angle, relevant modules, likely objections, closest alumni story, FOMO angle — all grounded in real curriculum |
| `get_objection_response` | Mid-call — pass the exact objection and domain | Three-mode response: Warm (empathetic), Pressure (urgency), Straightforward (facts). Rep picks the mode. |
| `draft_followup` | After a call — pass name, domain, call notes | One WhatsApp message. Conversational, specific to the call, grounded in real outcomes. No variants. |
| `get_index` | Orientation — discover all available knowledge | Full catalog of all wiki pages by category |
| `get_page` | Deep dive — fetch any page by key | Full markdown content of any wiki page |
| `search_wiki` | Find relevant knowledge — search by keyword | Matching pages with excerpts, filterable by type |
| `visualize` | Explain something visually — pass Mermaid syntax | Interactive diagram with zoom, pan, SVG export, and Excalidraw integration |

---

## Demo — What It Looks Like in Practice

Once the MCP server is connected to Claude, here's what a rep's session looks like:

---

**Before a call with a senior finance professional:**
```
Get me a call brief for a CFO with 12 years in financial services
```
> Claude returns: current AI disruption stat in finance (live web search), the exact cohort modules most relevant to their role (Module 2 on automation + Module 3 on agents), the closest alumni success story from finance, top 2 likely objections, and a hook angle. All in one response.

---

**Mid-call — prospect says "I don't have time for a 6-month course":**
```
Objection: "I don't have time for this, I'm already stretched thin" — prospect is a marketing manager
```
> Claude returns three ready-to-say responses: one warm (acknowledges the pressure, pivots to async learning), one with urgency (what they'll miss if they wait), one factual (actual time commitment per week). Rep picks the mode that fits the conversation.

---

**After the call — drafting a WhatsApp follow-up:**
```
Draft a follow-up for Priya, marketing manager at a D2C brand, we talked about AI-generated UGC for their influencer campaigns, she was interested but said she'd need to check with her team
```
> Claude returns one message. Conversational, mentions the specific UGC angle, references a real cohort outcome from a similar domain, ends with a low-friction next step.

---

**Using your persona skill (after running the interview):**
```
[Persona skill active] Get me a call brief for a doctor considering a career pivot into health-tech AI
```
> Claude returns the same brief — but adapted to how that specific rep sells. If the rep's persona says they're strong on empathy but weak on technical depth, Claude leads with the human angle and keeps the technical framing simple.

---

## How the Wiki Works

### The Three Layers

**Layer 1 — `raw/`** (you own this)
Original material exactly as it arrived. Call transcripts, objection playbooks, curriculum docs, success story CSVs. The LLM reads these but never modifies them.

**Layer 2 — `wiki/`** (the LLM owns this)
Synthesized knowledge. Every source gets a summary page. Every concept (sales framework, AI topic, objection technique) gets its own page. Cross-source insights become synthesis pages. The LLM writes and maintains all of this.

**Layer 3 — `CLAUDE.md`** (the schema)
The operating manual for the LLM. Defines every page format, naming convention, and operation. Open a Claude Code session, it reads this file first and knows exactly how to ingest a new source, answer a query, or run a lint pass.

### The Three Operations

**Ingest** — add a new source (new call transcript, new success stories, new playbook):
```
"Ingest raw/transcripts/new-calls.md. Follow CLAUDE.md ingest workflow."
```

**Query** — ask anything:
```
"What are the best objection responses for prospects in finance who say it's too expensive?"
```

**Lint** — health check:
```
"Run a lint pass on the wiki."
```

---

## Use the Live Server

The Sales Wiki MCP server is live. Add it to Claude and start using it immediately — no setup required.

**MCP Server URL:** `https://sales-wiki-mcp.cohort-c62.workers.dev/mcp`

**Claude Desktop** (`claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "sales-wiki": {
      "url": "https://sales-wiki-mcp.cohort-c62.workers.dev/mcp"
    }
  }
}
```

**Claude Code** (`.claude/settings.json`):
```json
{
  "mcpServers": {
    "sales-wiki": {
      "type": "url",
      "url": "https://sales-wiki-mcp.cohort-c62.workers.dev/mcp"
    }
  }
}
```

Authentication is Google OAuth — log in with your Google account on first use.

---

## Authentication — Why Google OAuth?

The server is public but not open. Anyone can find the URL — nobody gets in without logging in with Google first.

**Why this matters:**
- Every rep is a verified identity — name, email, Google user ID
- Every tool call is tied to that identity — no anonymous abuse
- Tokens expire (24h access, 30d refresh) — stale sessions auto-invalidate
- Usage is attributable — you can see exactly who called what tool

**For your own deployment:**
- Create a Google Cloud project, enable Google OAuth 2.0
- Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` as Cloudflare secrets
- Register the redirect URI in Google Cloud Console: `https://your-worker.workers.dev/callback`

---

## Analytics — What You Can Track with PostHog

Every tool call fires a PostHog event. This tells you exactly how the wiki is being used — which tools reps rely on, which domains they call briefs for, which objections come up most, and where the knowledge gaps are.

**Events tracked automatically:**

| Event | What it tells you |
|---|---|
| `tool_called` | Which tool, which user, duration, success or fail |
| `tool_error` | What broke and for which rep |
| `rate_limit_hit` | Who is hammering the server |
| `input_rejected` | Bad input attempts |

Every event includes:
- `distinct_id` — Google user ID (stable, permanent per rep)
- `user_email` / `user_name` — shows up in PostHog People tab
- `tool` — which MCP tool was called
- `domain` — what domain was passed to `get_call_brief`
- `duration_ms` — how long it took
- `results_count` — how many results came back

**What you can build in PostHog:**
- Which domains reps call briefs for most — where's the pipeline focused?
- Which objections come up most — what training gaps need filling?
- Which reps use the tool vs. which don't — adoption tracking
- Error rate over time — is the wiki missing pages? Is something broken?
- Per-rep usage history — click any rep in PostHog People → see every tool call

**Setup:**
```bash
wrangler secret put POSTHOG_API_KEY
```

PostHog is optional — server works without it, analytics just won't fire. But for a team of any size, it's worth having from day one.

---

## Cloudflare Deployment

**Prerequisites:** Node.js 18+, Cloudflare account, Google Cloud project with OAuth credentials.

```bash
cd sales-mcp-server
npm install

# Create KV namespaces and update wrangler.jsonc with the IDs
wrangler kv namespace create SALES_WIKI
wrangler kv namespace create OAUTH_KV

# Set secrets
wrangler secret put GOOGLE_CLIENT_ID
wrangler secret put GOOGLE_CLIENT_SECRET
wrangler secret put COOKIE_ENCRYPTION_KEY    # any random 32-char string
wrangler secret put POSTHOG_API_KEY          # optional

# Deploy
npm run deploy

# Push wiki pages to KV
npm run sync
```

**Local dev:**
```bash
cp .dev.vars.example .dev.vars   # fill in your secrets
npm run dev
```

Run `npm run sync` after every ingest session to keep the live server in sync with the wiki files.

---

## How to Build Your Own

Fork this repo and point it at your own sales knowledge. The architecture is domain-agnostic — the three sales-specific tools (`get_call_brief`, `get_objection_response`, `draft_followup`) are just prompts that reference wiki content. Change the prompts and wiki pages and you have a sales brain for any product.

### Step 1 — Replace the wiki content

- Put your raw material in `raw/` (transcripts, playbooks, product docs, success stories)
- Open a Claude Code session and run: `"Read CLAUDE.md. Ingest raw/[your-file]. Follow the ingest workflow."`
- Let Claude build out the `wiki/` pages

### Step 2 — Update `CLAUDE.md`

Update the purpose, domain scope, and source ingestion table to match your product.

### Step 3 — Update the tool prompts

The prompts inside `get_call_brief`, `get_objection_response`, and `draft_followup` in `src/index.ts` reference specific wiki pages. Update these to match your wiki structure.

### Step 4 — Run the interview skill

Have each rep run the persona interview once. Store their persona skill file. Add both to Claude. Every rep gets personalized responses from that point on.

### Step 5 — Deploy

Follow the Cloudflare deployment steps above. Sync wiki to KV. Done.

---

## How to Contribute

### Add Knowledge to the Wiki

If you have call transcripts, objection patterns, success stories, or domain playbooks that belong here:

1. Fork the repo
2. Add raw material to the right `raw/` subfolder
3. Open Claude Code: `"Read CLAUDE.md. Ingest raw/[path]. Follow the ingest workflow."`
4. Let Claude create/update wiki pages
5. Submit a PR with the new `raw/` file and updated `wiki/` pages

Good contributions:
- Real objection transcripts (anonymized)
- Domain-specific success stories
- New concept pages for sales frameworks
- Updated playbooks based on what's working

### Improve the MCP Server

The server is `sales-mcp-server/src/index.ts`. Good areas:
- Better search (semantic/embedding-based)
- New tools (`get_success_story`, domain-specific briefs)
- Support for other OAuth providers

```bash
cd sales-mcp-server
npm install
npm run dev
```

### Reporting Issues

Open a GitHub issue with:
- Which tool the issue is with
- What you passed in
- What you expected vs. what happened

---

## Directory Structure

```
Sales wiki_server/
│
├── README.md                               ← this file
│
├── sales wiki/                             ← the Obsidian knowledge base
│   ├── CLAUDE.md                           ← LLM operating schema (most important file)
│   ├── raw/                                ← immutable source material
│   │   ├── transcripts/                    ← real call transcripts
│   │   ├── playbooks/                      ← objection handling scripts
│   │   ├── documents/                      ← curriculum, success story CSV
│   │   └── courses/                        ← lecture transcripts
│   ├── wiki/                               ← LLM-maintained knowledge base
│   │   ├── index.md                        ← master content catalog
│   │   ├── overview.md                     ← current state + thesis
│   │   ├── log.md                          ← append-only history
│   │   ├── sources/                        ← one page per ingested source
│   │   ├── concepts/                       ← sales frameworks + AI topics
│   │   ├── entities/                       ← people, companies, tools
│   │   └── synthesis/                      ← success stories, domain maps
│   ├── skills/
│   │   └── sales-rep-interviewing/
│   │       └── SKILL.md                    ← persona interview skill
│   └── templates/                          ← page templates (do not edit)
│
└── sales-mcp-server/                       ← Cloudflare Worker MCP server
    ├── src/
    │   ├── index.ts                        ← all 7 tools, OAuth, rate limiting
    │   └── google-handler.ts               ← Google OAuth flow
    ├── sync.js                             ← pushes wiki files to Cloudflare KV
    ├── wrangler.jsonc                      ← Cloudflare deployment config
    └── package.json
```

---

## Quick Reference

| Task | What to do |
|---|---|
| Orient Claude | `"Read CLAUDE.md, wiki/overview.md, and wiki/log.md"` |
| Add a new source | `"Ingest raw/[path]. Follow CLAUDE.md ingest workflow."` |
| Ask a question | Just ask. Claude reads the index first. |
| Save a valuable answer | `"File this as a synthesis page."` |
| Health check | `"Run a lint pass on the wiki."` |
| Push wiki to Cloudflare | `cd sales-mcp-server && npm run sync` |
| Deploy server changes | `cd sales-mcp-server && npm run deploy` |
| Local dev | `cd sales-mcp-server && npm run dev` |
| Run persona interview | Add `skills/sales-rep-interviewing/SKILL.md` to Claude, say `"Run the sales rep interview"` |

---

## Credits

Built by [100x Engineers](https://100xengineers.com).
