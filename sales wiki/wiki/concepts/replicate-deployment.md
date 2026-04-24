---
title: "Replicate Deployment"
type: concept
tags: [diffusion, deployment, comfyui, serverless, inference, 100x-cohort7]
source_count: 1
---

## Definition
Replicate is a serverless inference platform for AI models: a GPU spins up only when a prediction request arrives, processes the request, and shuts down — billing only for active compute time. For ComfyUI workflows, Replicate provides a standardized path from local development to production API endpoint without managing GPU infrastructure.

## Why It Matters
ComfyUI workflows run locally on a developer's GPU. To turn them into usable products, they must be accessible via API by a frontend or other service. Replicate bridges this gap: it accepts a ComfyUI workflow exported as JSON, hosts the required model files, and exposes a stable API endpoint — without the developer managing servers, scaling, or GPU availability.

The alternative (Jarvis Labs) provides persistent GPU instances for development but is cost-inefficient for production with variable traffic. Replicate's serverless model is cost-efficient for production at any scale.

## How It Works

### The Full ComfyUI → Replicate Workflow

**Step 1: Export from ComfyUI**
In ComfyUI, use `Workflow → Export as API`. This generates an API Format JSON file where every node is numbered and structured for programmatic parsing. This is different from the regular workflow save — it's machine-readable, not just human-readable.

**Step 2: Identify and Upload Custom Models**
Replicate pre-hosts common models. For custom models (LoRAs, fine-tuned checkpoints):
1. Go to Replicate → Train tab → create new "model" space (container for custom files)
2. Paste the direct download URL from Hugging Face (right-click the file's download button to get the direct link)
3. Provide your Hugging Face read token
4. Click "Create Training" — Replicate downloads and hosts the file on its servers

**Step 3: Run on Replicate**
1. Navigate to Replicate's `any-comfyui-workflow` model page
2. Paste the entire API JSON from Step 1 into the `workflow_json` input field
3. Verify model filenames in the JSON match the filenames hosted on Replicate (must be exact matches)
4. Modify inputs (prompt, seed) directly in the JSON or via API parameters
5. Click "Run"

### The Serverless Inference Model

GPU lifecycle:
- **Cold start**: GPU is off. On first request after idle period, GPU spins up (adds latency — seconds to minutes depending on model size)
- **Processing**: GPU is active, billing by the second
- **Idle**: GPU shuts down after request completes. Zero cost.

This model is highly cost-effective for variable traffic: a model that gets 10 requests/hour doesn't pay for the 50 idle minutes between requests.

### Pricing Model

Replicate charges **per-second** for active GPU time. Price varies by GPU type:
- A100: highest cost, fastest computation
- L40S: lower cost, slightly slower
- Other GPU options depending on model requirements

Rule: Pick the cheapest GPU that completes the workflow within acceptable latency for your users. A100 is overkill for most SDXL/FLUX workflows.

Storage (uploading model files): generally free or very low-cost. Compute is the variable cost.

**Who pays:** Each Replicate user has their own account and billing. When a user calls your public model, the cost is charged to their account, not yours.

### Dynamic Input Override
When calling the Replicate API, inputs can be overridden without modifying the base JSON:
```
POST /predictions
{
  "version": "...",
  "input": {
    "workflow_json": {...},
    "prompt": "new prompt here",
    "seed": 12345
  }
}
```
This enables the same base workflow to serve different prompts/parameters per request.

## Key Variants / Extensions

### Replicate vs. Jarvis Labs

| Dimension | Jarvis Labs | Replicate |
|---|---|---|
| Use case | Development, experimentation | Production, user-facing API |
| GPU management | Persistent instance, always-on | Serverless, spins up per request |
| Cost model | Hourly rate, running 24/7 | Per-second, only when active |
| Interface | Direct GPU access, SSH, ComfyUI UI | API endpoint only |
| Scaling | Manual | Automatic |
| Cold start | None (persistent) | Yes (seconds to minutes) |

Development workflow: use Jarvis Labs to build and iterate on the ComfyUI workflow. Production deployment: export to Replicate.

### Monetization Path

Once deployed on Replicate, the endpoint becomes the foundation for a product:

1. **Deploy on Replicate** → stable API endpoint
2. **Build a frontend** (Gradio, Streamlit, or web app) that calls the Replicate API
3. **Pass through cost + markup**: Replicate charges per-second; the product owner charges per-generation with a markup
4. **User-facing product**: end users interact with the frontend, never with ComfyUI or Replicate directly

Example: A FLUX LoRA portrait generator → deployed on Replicate → wrapped in a Gradio UI → sold as a subscription portrait app. The FLUX model is the core; Replicate is the invisible infrastructure; Gradio is the user interface.

### Mid-Capstone Application

The L14 Mid-Capstone required students to deploy a complete ComfyUI workflow (combining ControlNets, IP-Adapters, LoRA training, etc.) on Replicate. Key advice:
- Build each component independently and test before combining
- Start with lower-complexity problem statements if overwhelmed
- "Don't be afraid to start with the low-hanging fruit projects"

## Examples

**FLUX LoRA deployment (L14 live demo):**
- Workflow: FLUX base model + custom LoRA trained on Hugging Face
- Export from ComfyUI as API JSON
- Upload LoRA to Replicate via Train tab → direct HuggingFace download URL
- Paste JSON to `any-comfyui-workflow` on Replicate
- Override prompt via API call
- Result: production API callable from any frontend

**Pricing intuition:**
If a FLUX inference run takes 30 seconds on an L40S GPU at $0.001/second, the cost is $0.03/image. At 1,000 images/day: $30/day. At $0.50/image charge to users: $500 revenue on $30 cost.

## Connections
Related concepts: [[comfyui-workflow-system]], [[flux-architecture]], [[lora-training]], [[video-generation-models]], [[full-stack-llm-architecture]], [[ship-cycle]]
Introduced by: [[100x-cohort7-module1-diffusion]] (L14 — Deploying Models on Replicate)

## Open Questions / Unknowns
- Cold start latency for large models (FLUX 14B, Wan 2.1 14B) can be 2–5 minutes. How do you design UX around cold starts at the product layer?
- Replicate's `any-comfyui-workflow` model — is this the standard path for all workflows or does it have limitations for complex multi-node workflows?
- When does it make sense to run your own GPU cloud (e.g., Lambda Labs) vs. Replicate for production? The crossover point depends on utilization rate.
