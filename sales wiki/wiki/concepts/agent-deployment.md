---
title: "Agent Deployment"
type: concept
tags: [agents, deployment, production, replicate, 100x-cohort7]
source_count: 1
---

## Definition
Agent deployment is the process of taking a working AI agent or agentic workflow from a development environment and making it accessible in production — typically as an API endpoint that an application can call. For diffusion model workflows specifically, this includes deploying ComfyUI workflows as serverless APIs via platforms like Replicate.

## Why It Matters
An agent that only runs in a Jupyter notebook or local ComfyUI instance has no user or commercial value. Deployment is the bridge between "it works on my machine" and "anyone can use it." The primary technical challenge is cost-efficient scaling: GPU instances are expensive when always-on. Serverless inference (spin up GPU only when a request arrives) solves this for variable-traffic AI products.

## How It Works

### Serverless inference (the production model)
- Cloud provider allocates GPU only when a prediction request arrives
- When idle: instance is "cold," GPU is off, cost is near-zero
- When request arrives: instance "warms up," processes, shuts back down
- Billing: per-second of GPU active time (e.g., Replicate charges by GPU type per second)
- Trade-off: cold starts add latency (~5–20 seconds for first request)

### ComfyUI → Replicate deployment workflow
1. **Export workflow as API JSON:** ComfyUI → Workflow → Export as API (structured node graph, not the visual JSON)
2. **Identify all custom models:** Checkpoints, LoRAs, VAEs used in the workflow
3. **Upload models to Replicate:** For models not already on Replicate's servers — create a model container, provide Hugging Face download URL + HF token
4. **Paste API JSON** into Replicate's `any-comfyui-workflow` model page
5. **Verify filename matches:** Model filenames in the JSON must exactly match names on Replicate
6. **Run:** Replicate executes the full ComfyUI pipeline and returns the output image/video

### Monetization path
Deployed Replicate workflow → API endpoint → wrap in frontend (Gradio, Streamlit, Next.js) → users pay → cost passed to users with markup → product/business.

### The 5 production pillars for agents
Beyond deployment infrastructure, production-ready agents require: Patterns / Sessions+Memory / Tracing / Debugging / Evaluation+Guardrails. See [[agent-production-pillars]].

## Key Variants / Extensions

### Replicate vs Jarvis Labs
| | Replicate | Jarvis Labs |
|--|-----------|-------------|
| Purpose | Production serving | Development/training |
| Billing | Per-second (serverless) | Per-hour (persistent instance) |
| Scaling | Automatic | Manual |
| API | Standard REST endpoint | Not production API |
| When to use | Serving users, variable traffic | Building workflows, training LoRAs |

### Agent API-first pattern
Production agents should be built API-first: the agent logic is a backend service with a defined input schema and output format. Frontends (web, mobile, n8n, other agents) call the API. This enables multi-channel deployment without rebuilding the agent.

## Examples
- **FLUX LoRA product photoshoot on Replicate:** Export ComfyUI FLUX workflow → upload trained product LoRA to Replicate → API endpoint accepts product name + prompt → returns generated photoshoot images → wrap in Gradio frontend for client use
- **Jarvis Labs → Replicate path:** Full cohort workflow: develop and train on Jarvis Labs (GPU by hour) → export and deploy to Replicate (GPU by second) → embed in client-facing product
- **n8n + agent API:** n8n workflow calls deployed agent API as an HTTP node → no-code orchestration of a production agent

## Connections
Related concepts: [[agentic-workflows]], [[agent-production-pillars]], [[comfyui-workflow-system]], [[lora-training]], [[production-genai-stack]]
Introduced by: [[100x-cohort7-module1-diffusion]], [[100x-cohort7-module3-agents]]

## Open Questions / Unknowns
- Cold start latency on Replicate — acceptable for consumer apps? Workarounds (keep-warm pings)?
- At what request volume does owning dedicated GPU infrastructure beat serverless pricing?
