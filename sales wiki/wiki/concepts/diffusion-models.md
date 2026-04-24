---
title: "Diffusion Models"
type: concept
tags: [diffusion, architecture, sdxl, flux, comfyui, 100x-cohort7]
source_count: 1
---

## Definition
Diffusion models are a class of generative AI models that learn to create images (or video) by reversing a process of incremental noise addition. During training, real images are progressively corrupted with noise (forward diffusion). At inference, a model that learned this corruption process is run in reverse: starting from pure noise, it iteratively removes noise until a coherent image emerges (reverse diffusion).

## Why It Matters
Diffusion models produced the generation leap from blurry procedural images to photorealistic outputs (Stable Diffusion 2022, SDXL 2023, FLUX 2024). The key innovation — working in **latent space** rather than pixel space — reduced the computation required by ~98%, making consumer-grade GPU generation possible.

## How It Works

### The full generation pipeline
1. **Text prompt** → Tokenizer (CLIP) → Token IDs
2. Token IDs → Embedder → Vector embedding space (semantic relationships preserved)
3. Random **white noise** initialized in **latent space** (64×64×4 values for a 512×512 output)
4. **Noise predictor** (the core model / U-Net) iterates N times, subtracting predicted noise guided by the text embedding
5. **VAE decoder** expands latent representation → pixel space image (512×512)

### Latent space (the Stable Diffusion breakthrough)
- **Pixel space:** What you see — 512×512 = 786,432 values to process
- **Latent space:** Compressed abstract representation — 64×64×4 = 16,384 values (≈2% of pixel space)
- The VAE (Variational Autoencoder) converts: pixel → latent (encode), latent → pixel (decode)
- Stable Diffusion (2022) was the frontier breakthrough precisely because it did diffusion in latent space

### Key parameters
| Parameter | What it controls |
|-----------|-----------------|
| Steps | Number of denoising iterations (SDXL default: 20) |
| CFG scale | How much model respects text prompt (SDXL default: 7; FLUX: replaced by Guidance node) |
| Seed | Starting noise pattern — fix seed for reproducible output |
| Sampler | Algorithm for noise subtraction (Euler is standard) |

### Components in ComfyUI
| Node | Function |
|------|----------|
| Load Checkpoint (SDXL) / Load Diffusion Model (FLUX) | The noise predictor / U-Net |
| CLIP Text Encode | Tokenizer + embedder (converts prompt to conditioning) |
| Empty Latent Image | Initializes white noise canvas in latent space |
| KSampler | Runs the iterative denoising loop |
| VAE Decode | Converts latent → pixel space |

## Key Variants / Extensions
- **SDXL:** 1024×1024 native resolution, single checkpoint (model+CLIP+VAE bundled), CFG ~7
- **FLUX:** Unbundled components (see [[flux-architecture]]), no negative prompt needed, FLUX Guidance node replaces CFG
- **LoRA:** Adapter layers on top of base diffusion model for concept-specific fine-tuning (see [[lora-training]])
- **ControlNet:** Auxiliary network for spatial control (pose, depth, edges) (see [[controlnet]])
- **Video diffusion:** Same process applied to frame sequences with temporal consistency constraint (see [[video-generation-models]])

## Examples
- Generating "cat in a suit": prompt → CLIP tokenizes → embedding guides noise predictor → 20-step denoising in 64×64 latent → VAE decode → 512×512 pixel image
- Same prompt, different seed → different image (starting noise randomized each time)
- High CFG: very literal, can look over-processed. Low CFG: creative but prompt-ignoring.

## Connections
Related concepts: [[comfyui-workflow-system]], [[flux-architecture]], [[lora-training]], [[controlnet]], [[ip-adapter]], [[video-generation-models]]
Introduced by: [[100x-cohort7-module1-diffusion]]

## Open Questions / Unknowns
- What comes after FLUX as the next-generation architecture?
- When will video diffusion models reach real-time generation speeds on consumer hardware?
