# Sales Wiki MCP — 100xEngineers

A production MCP (Model Context Protocol) server that gives the 100xEngineers sales team an AI-powered second brain. Sales reps connect this to Claude.ai and get domain-aware call briefs, objection handling, and WhatsApp follow-up drafts — all grounded in the real cohort curriculum and 70+ alumni success stories.

---

## What This Does

A rep types `get_call_brief for a game designer with 5 years experience` into Claude.ai. The MCP server:

1. Fetches the full cohort curriculum (exact lecture names — not generic descriptions)
2. Fetches relevant domain-specific wiki pages for "game designer"
3. Instructs Claude to web-search for a current AI disruption stat in that domain
4. Returns a structured brief: hook angle, relevant modules, likely objections, closest alumni story, FOMO angle, key handle

Same pattern for objection handling and follow-up drafting. Everything is grounded — real lecture names, real alumni outcomes, real stats.

---

## Repo Structure

```
Sales wiki_server/
├── sales wiki/                        # Obsidian knowledge base (the brain)
│   ├── CLAUDE.md                      # Schema + operating manual for LLM ingestion
│   ├── wiki/
│   │   ├── index.md                   # Master catalog of all wiki pages
│   │   ├── overview.md                # High-level synthesis of the sales system
│   │   ├── log.md                     # Append-only ingest log
│   │   ├── sources/                   # One page per ingested source
│   │   ├── concepts/                  # Sales frameworks, objection techniques, AI framings
│   │   ├── entities/                  # Companies, people, tools, the cohort program
│   │   └── synthesis/                 # Cross-source analysis, success stories, domain playbooks
│   ├── raw/                           # IMMUTABLE. Source material (never edit)
│   │   ├── transcripts/               # Zahid's call transcripts
│   │   ├── playbooks/                 # Objection playbooks, scripts
│   │   ├── documents/                 # Curriculum docs, success story CSV
│   │   └── courses/                   # Lecture transcripts (Module 1 Diffusion)
│   ├── templates/                     # Page templates (source/concept/entity/synthesis)
│   ├── skills/                        # Claude Code skills for this project
│   └── docs/                          # Dev plans and session notes
│
└── sales wiki-server/                 # Cloudflare Worker — the MCP server
    └── sales-mcp-server/
        ├── src/
        │   ├── index.ts               # Main Worker: all MCP tools defined here
        │   └── google-handler.ts      # Google OAuth handler
        ├── sync.js                    # Syncs wiki/ markdown files → Cloudflare KV
        ├── wrangler.jsonc             # Cloudflare Worker config
        ├── package.json
        └── tsconfig.json
```

---

## MCP Tools

| Tool | Purpose |
|---|---|
| `get_call_brief` | Pre-call brief for any domain/role/experience level. Fetches curriculum + domain wiki pages + instructs web search for current AI stats. |
| `get_objection_response` | Three-mode objection handling (Warm / Pressure / Straightforward) with domain context. |
| `draft_followup` | Single WhatsApp message draft. References specific call details. No variants, no options. |
| `search_wiki` | Full-text search across the wiki KV store. |
| `get_page` | Fetch any single wiki page by key path. |
| `get_index` | Returns the full wiki index — used by Claude to discover available pages. |
| `visualize` | Renders a Mermaid diagram as an interactive HTML page (opens in browser). |

---

## Tech Stack

- **Runtime:** Cloudflare Workers (Durable Objects)
- **Protocol:** MCP via `@modelcontextprotocol/sdk`
- **Storage:** Cloudflare Workers KV (wiki content synced from markdown files)
- **Auth:** Google OAuth via `@cloudflare/workers-oauth-provider`
- **Analytics:** PostHog (tool call tracking)
- **Knowledge base:** Obsidian-compatible markdown files

---

## Local Dev Setup

### Prerequisites
- Node.js 18+
- Wrangler CLI (`npm install -g wrangler`)
- Cloudflare account with KV namespaces provisioned

### 1. Install dependencies

```bash
cd "sales wiki-server/sales-mcp-server"
npm install
```

### 2. Configure secrets for local dev

Create `.dev.vars` in `sales-mcp-server/` (this file is gitignored — never commit it):

```
POSTHOG_API_KEY=your_posthog_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 3. Sync wiki content to KV

```bash
npm run sync
```

This reads all markdown files from `sales wiki/wiki/` and pushes them to Cloudflare KV. Run this any time wiki content changes.

### 4. Run local dev server

```bash
npm run dev
```

---

## Deploy

```bash
cd "sales wiki-server/sales-mcp-server"
npm run sync       # push latest wiki content to KV
npm run deploy     # deploy Worker to Cloudflare
```

Expected output: `Deployed sales-wiki-mcp ... (version X)`

### Set production secrets (one-time)

```bash
wrangler secret put POSTHOG_API_KEY
wrangler secret put GOOGLE_CLIENT_ID
wrangler secret put GOOGLE_CLIENT_SECRET
```

---

## Adding Wiki Content

All wiki pages are markdown files in `sales wiki/wiki/`. The schema is defined in `sales wiki/CLAUDE.md`.

| Page type | Folder | When to add |
|---|---|---|
| Source | `wiki/sources/` | After ingesting any raw source |
| Concept | `wiki/concepts/` | Sales frameworks, techniques, AI framings |
| Entity | `wiki/entities/` | Companies, people, tools, the cohort itself |
| Synthesis | `wiki/synthesis/` | Cross-source analysis, domain playbooks, success stories |

After adding pages, run `npm run sync` to push to KV, then `npm run deploy`.

---

## Connecting to Claude.ai

1. Go to **Claude.ai > Settings > Integrations > Add MCP Server**
2. Enter the Worker URL: `https://sales-wiki-mcp.cohort-c62.workers.dev`
3. Authenticate with your Google account
4. The 7 tools will appear in Claude's tool panel

---

## Security

- All tool output is sanitized against prompt injection patterns before returning to Claude
- Google OAuth enforces authentication — unauthenticated requests are rejected
- `.dev.vars` (local secrets) is gitignored — never committed
- Production secrets are stored as Cloudflare Worker secrets (not in code)
- Rate limiting: 30 requests / 60s per IP

---

## Worker URL

`https://sales-wiki-mcp.cohort-c62.workers.dev`
