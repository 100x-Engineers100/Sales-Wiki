---
title: "LoRA Training"
type: concept
tags: [diffusion, lora, fine-tuning, flux, sdxl, 100x-cohort7]
source_count: 2
---

## Definition
LoRA (Low-Rank Adaptation) is a parameter-efficient fine-tuning technique that adds small adapter layers on top of a frozen pre-trained model. The base model weights are never modified; the LoRA adapts the model's output for a specific concept (person, product, style) without expensive full fine-tuning.

## Why It Matters
Full fine-tuning a diffusion model requires enormous compute and modifies all model weights. LoRA achieves comparable specificity by training only a tiny adapter (~160–600 MB) on 20–30 images. This makes custom model training accessible: one person can train a brand style generator, product photoshoot engine, or AI character in ~1–2 hours on a rented GPU.

## How It Works
1. Prepare a dataset of the target concept (face: 15–25 images; product: 15–20 images; style: 20–30 images)
2. Caption each image — either just the trigger word, or a full description including the trigger word
3. Configure training parameters (steps, learning rate, rank)
4. Train: the adapter learns to associate the trigger word with the target concept
5. At inference: include the trigger word in the prompt → model generates with that specific concept applied

**Trigger word:** A unique keyword (e.g., `SidZWX`, `ZWX perfume`) that activates the LoRA. Must be uncommon enough that it doesn't appear in the base model's training data as a different concept. Always include it in generation prompts.

## Key Variants / Extensions

### Training tools
| Tool | Best for | Interface |
|------|----------|-----------|
| AI Toolkit | FLUX LoRA | Gradio UI (simpler, single page) |
| KohyaSS | SDXL LoRA | Multi-tab GUI |

**Architecture-specific:** A FLUX-trained LoRA cannot be used on SDXL or SD 1.5. Different base model = incompatible LoRA.

### Parameter guide by use case
| Use case | Learning rate | LoRA rank | Steps |
|----------|--------------|-----------|-------|
| Face | 0.0004 (AI Toolkit) / 0.00005 (KohyaSS) | 16 | 1200–2000 |
| Product | 0.00025 / 0.00005 | 32 | 1200–2000 |
| Style | 0.00015 / 0.00005 | 64 | 1200–2000 |

**Rank and file size:**
- Rank 16 ≈ 160 MB
- Rank 32 ≈ 440 MB
- Rank 64 ≈ 600 MB

Rank controls expressiveness. Style LoRAs need highest rank (most detail to capture). Face LoRAs need least.

**Steps:** 1200 gives usable results. 2000 is better. Max ~4000 — above that, overfitting occurs (model just returns training images, loses generalization). Save checkpoints every 200–250 steps to find the sweet spot.

**Learning rate:** How large each parameter adjustment is per step. Too high = jumpy, poor detail. Style needs lowest LR (most detail-sensitive). Faces tolerate higher LR.

### FLUX vs SDXL LoRA differences
- FLUX: AI Toolkit, no strict rare trigger token required, Gradio UI streamlines to one page
- SDXL: KohyaSS, instance token + class token (e.g., `zwx man`), BLIP auto-captioning available
- FLUX produces better faces and detail adherence

### ControlNets loaded as LoRAs (FLUX-specific)
In FLUX, ControlNet models are loaded as LoRAs via a Load LoRA node, not via a separate ControlNet model loader as in SDXL.

## Training Platform (JavasLabs)
Recommended GPUs: **A6000 or A5000**. Setup: create conda env → install PyTorch → clone AI Toolkit → `pip install -r requirements.txt` → add HuggingFace token to `.env`. Token must have "write" permissions; copy immediately — only shown once.

**Common error**: PyTorch version incompatible with CUDA driver. Fix: uninstall current torch, install the version matching the CUDA driver on that specific GPU. Check CUDA version before installing PyTorch.

## Examples
- **GTA 6 Bombay Trailer (100x Engineers):** Used 10–12 Flux LoRAs — 1 for visual style, ~10 for individual characters. Produced feature-film-level character consistency.
- **Amul Girl LoRA:** Trained on ~40 Amul Girl comic images. Captured character style, scene aesthetic, font style. Text rendering remained weak (proprietary models better for text).
- **Product photoshoot engine:** Train LoRA on a product → generate infinite variations in any background/lighting.

## Connections
Related concepts: [[comfyui-workflow-system]], [[flux-architecture]], [[diffusion-models]], [[cost-optimization-patterns]]
Introduced by: [[100x-l06-flux-lora-training]]

## Open Questions / Unknowns
- At what rank/step count does FLUX LoRA overfit for styles vs faces?
- Can multiple LoRAs be stacked reliably in FLUX (character + style) without interference?
- FLUX 2 reportedly gives significantly better AI influencer output than FLUX 1 Dev — when does it become standard for cohort training?
