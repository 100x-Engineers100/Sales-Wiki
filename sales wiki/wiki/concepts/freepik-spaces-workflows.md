---
title: "FreePik Spaces Workflows"
type: concept
tags: [freepik, spaces, workflow, ugc, node-based, 100x-cohort7, module1]
source_count: 3
---

## Definition
FreePik Spaces is a node-based workflow interface embedded inside FreePik — the same DAG paradigm as ComfyUI but operating exclusively with proprietary cloud models (Imagen, Kling, CDance, VO3). Each generation step becomes a node; nodes connect via wires; the full pipeline runs in one click.

## Why It Matters
Manual step-by-step generation in FreePik (image → video → download → re-upload) becomes a single automated pipeline in Spaces. Change one input (e.g., swap the product Upload node) and re-run the full pipeline instantly. This is the difference between a craftsman workflow and a production workflow.

## How It Works

### Core nodes
| Node | Function | Equivalent in ComfyUI |
|------|----------|-----------------------|
| **Upload** | Import image into canvas; output connects to other nodes | Load Image |
| **Image Generator** | Select model, add references, set resolution; generates from connected inputs | KSampler + VAE + checkpoint |
| **Video Generator** | Select video model, duration, audio; start image = Image Generator output | Video workflow |
| **AI Assistant** | LLM node (GPT-4o Mini default); generates prompts from descriptions | No direct equivalent |
| **Cinematic Shot** | Camera-configured image generator (film stock/lens/focal/aperture) | No direct equivalent |
| **Video Combiner** | Assembles multiple video outputs in defined sequence order | No direct equivalent |

### Pipeline execution
- **"Run"** button: runs the entire canvas
- **"Run from here"**: runs from a specific node forward — useful for partial re-runs without regenerating all upstream nodes

### Reference wiring
Drag an Upload node's output → connect to Image Generator's reference input. Multiple Upload nodes can connect to one Image Generator. This is the IP Adapter paradigm but via node wiring instead of a dedicated node.

Use **@ syntax** in prompt text to explicitly call connected references: `@character`, `@clothing`, `@product`, `@room`.

## The Standard UGC Pipeline

```
[Upload: product image] ──────────────────────────────────┐
[Upload: character image] ────────────────────────────────→ [Image Generator: Imagen 3 Pro]
                                                            → composite image
                                                                        ↓
                                                           [Video Generator: Kling 3.0]
                                                                        ↓
                                                              UGC-style video
```
Total credits: ~1,300 (primarily video generation)

## The Full AI Influencer Pipeline (4-column layout)

```
Column 1: 5 character reference Upload nodes → all connect to Final Assembly
Column 2: Product Image Generator (separate) → output connects to Final Assembly
Column 3: Clothing Image Generator (optional) → output connects to Final Assembly
Column 4: Room/Background Image Generator → output connects to Final Assembly
                                                                ↓
                                         [Final Image Generator: Imagen 3 Pro]
                                         Prompt uses @character @clothing @product @room
                                                                ↓
                                              [Video Generator: Kling 3.0]
```

Reference limits: Imagen 3 Pro accepts ~14 max. Most video models accept ~9. Disconnect unused references.

## Prompt Strategy in Spaces
1. Paper notepad: write idea down
2. LLM conversation (Claude Sonnet 4.5 for content; Meta AI for video context) to flesh out concept
3. Paper structure again
4. Prompt in Spaces → iterate 3-10 times

Use **AI Assistant node** when prompts become complex (many elements). Pipe its text output into the Image Generator prompt field. The node reads connected reference images as context — meta-prompting.

## When to Use Spaces vs ComfyUI

| Use Spaces | Use ComfyUI |
|-----------|-------------|
| Fast production content | Local GPU available (RTX 5090/A6000) |
| Best proprietary models needed | Cost-zero generation at scale |
| UGC/product ads/social media | Data privacy requirements |
| Client delivery, standard outputs | Full parameter control |
| No local GPU | Building apps/products on the pipeline |

## Credit Optimization
- Imagen 2 for test generations (fast, cheaper)
- Imagen 3 Pro only when prompt is validated
- Kling 3.0 > CDance 2.0 for video (4x cheaper, nearly equivalent quality)
- VO3 Lite: cheapest video option; good for image+audio input
- Generate at 1K first; bump to 2K/4K once output is right
- Avoid "Build Your Character" template — expensive, low control

## Connections
Related concepts: [[freepik-platform]], [[comfyui-vs-proprietary]], [[ai-influencer-pipeline]], [[ai-filmmaking-workflow]], [[comfyui-workflow-system]]
Introduced by: [[100x-l10-branding-marketing-freepik-spaces]], [[100x-l11-ai-influencer-ugc-product-ads]], [[100x-l12-filmmaking-storyboarding-interpolations]]

## Open Questions / Unknowns
- When will Spaces support building/deploying standalone apps?
- What is the full node library beyond the 5 documented types?
- Can Spaces connect to external APIs or only FreePik's internal model roster?
