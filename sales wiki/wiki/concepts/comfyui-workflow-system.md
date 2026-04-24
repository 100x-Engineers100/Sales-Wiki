---
title: "ComfyUI Workflow System"
type: concept
tags: [diffusion, comfyui, workflow, image-generation, 100x-cohort7]
source_count: 2
---

## Definition
ComfyUI is a node-based workflow builder for diffusion models — a directed acyclic graph (DAG) where each node performs one specific operation and connections represent data flow between operations. It is not an image generator; it is an AI pipeline engine that provides pixel-level control over every parameter of image and video generation.

## Why It Matters
ComfyUI enables professional-grade consistency (exact reproducibility via seed fixing), custom fine-tuning (LoRA, ControlNet integration), cost efficiency (local GPU = free images at scale), and full IP ownership — none of which are possible with proprietary tools like Midjourney or DALL-E. Critically: ComfyUI trains node-based thinking that transfers directly to N8N (agent automation) and other workflow tools.

## How It Works

### Core Architecture: Nodes as a DAG
- **Nodes** — boxes that perform one operation: load a model, encode text, sample noise, decode latent
- **Edges (wires)** — connect output of one node to input of next; data flows left to right
- **Pipeline** — chain of nodes from blank canvas to final image
- Every parameter visible, every step modifiable

### The Minimal Text-to-Image Pipeline
```
[Load Checkpoint] → outputs: MODEL, CLIP, VAE
       ↓ MODEL
[CLIP Text Encode (positive)] ← text prompt
       ↓ CONDITIONING
[CLIP Text Encode (negative)] ← negative prompt
       ↓ CONDITIONING
[Empty Latent Image] → LATENT (blank canvas)
       ↓ LATENT
[KSampler] ← MODEL, POSITIVE, NEGATIVE, LATENT
       ↓ LATENT (denoised)
[VAE Decode] ← LATENT + VAE
       ↓ IMAGE
[Save Image / Preview Image]
```

### The KSampler — Core Generation Engine
The KSampler is where the denoising loop runs. Key parameters:
| Parameter | What It Controls | Default (SDXL) |
|-----------|-----------------|----------------|
| SEED | Random starting noise; fix seed → same output | Random |
| STEPS | Number of denoising iterations | 20 |
| CFG | How rigidly the model follows the prompt | 7 (SDXL), 3.5 (FLUX) |
| SAMPLER | Sampling algorithm | Euler |
| SCHEDULER | Noise schedule | Normal |

**CFG scale behavior:**
- Low CFG (3-5) — model ignores prompt, does its own thing; more creative
- High CFG (10+) — rigidly follows prompt; can look over-processed
- SDXL sweet spot: 7; FLUX sweet spot: 3.5

### Load Checkpoint vs Separate Loaders
- **Load Checkpoint** — bundles MODEL + CLIP + VAE in one node; simpler; for SDXL
- **Separate loaders** — required for FLUX (Load Diffusion Model + Dual CLIP Loader + Load VAE); more control; for advanced workflows

### Nodes Reference
| Node | Maps to | Function |
|------|---------|----------|
| Load Checkpoint | Noise predictor (whole model) | Loads base model weights |
| CLIP Text Encode | Tokenizer + Embedder | Converts text prompt to conditioning vector |
| Empty Latent Image | Blank canvas | Generates random noise in latent space (default: 1024×1024) |
| KSampler | Iterative denoising loop | Runs N steps of noise prediction + subtraction |
| VAE Decode | Pixel-space decoder | Converts latent 64×64 → full pixel image |

### ComfyUI vs Proprietary Decision Framework
**Use ComfyUI when:** consistency required, custom fine-tuning needed, IP ownership matters, data privacy required, cost at scale, building products on top of the pipeline
**Use proprietary when:** speed matters, simple output, no complex control needed, massive scale without GPU infra, on-device use
See full scorecard: [[comfyui-vs-proprietary]] (ComfyUI wins 9 categories; proprietary wins 6)

### Transferable Skill
Learning ComfyUI teaches **node-based thinking** — the same paradigm used in FreePik Spaces, n8n, Langflow, and all visual workflow tools. Learn ComfyUI deeply; every other node tool becomes immediately familiar.

### ComfyUI in AI Filmmaking
For film production: open-source video models (WAN, LTX) are behind CDance/Kling/VO for creative quality. ComfyUI's role in filmmaking = image consistency (character references, product photoshoots) that feeds into proprietary video generation pipelines.

## Key Variants / Extensions
- **FLUX workflows** — use separate loaders (Diffusion Model + Dual CLIP + VAE); add FLUX Guidance node instead of KSampler CFG
- **ControlNet workflows** — add Preprocessor + Apply ControlNet nodes between CLIP encoders and KSampler
- **LoRA workflows** — add Load LoRA node between Load Diffusion Model and CLIP loader
- **Video workflows** — add `length` parameter to Empty Latent Image; add Create Video node at end (FPS + frame assembly)

## Examples
**Real-world use case:** 100x Engineers' GTA 6 Bombay Trailer — used 10-12 FLUX LoRAs (1 for style, ~10 for individual characters). ComfyUI was the pipeline engine chaining them together.

**Ex-cohort student:** replaced entire corporate building lighting simulation workflow with ComfyUI. MLSD ControlNet for straight lines, accurate light physics.

## Connections
Related concepts: [[flux-architecture]], [[controlnet]], [[lora-training]], [[ip-adapter]], [[video-generation-models]]
Introduced by: [[100x-l08-comfyui-nodes-to-money]]

## Open Questions / Unknowns
- How does ComfyUI API mode work for deploying workflows as web apps with a user-facing prompt bar?
- Can LoRAs trained on one architecture (FLUX) run on another (WAN video)? — No; different base model = different LoRA.
