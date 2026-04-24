---
title: "Video Generation Models"
type: concept
tags: [diffusion, video, wan, hunyuan, comfyui, quantization, 100x-cohort7]
source_count: 2
---

## Definition
AI video generation models apply diffusion principles to produce sequences of temporally consistent frames, assembled into video. The key distinction from image generation: each frame must be coherent with adjacent frames to avoid flicker. Open-source video generation is dominated by Wan (Alibaba) and Hunyuan (Tencent); the commercial leader at cohort time is Seedance 2.0.

## Why It Matters
Video = frames at 24 FPS. A 5-second clip = 120+ individual images generated with temporal consistency between them. Video generation democratizes filmmaking: ad films, brand videos, AI avatars, and short films that previously required studios, actors, and production crews can now be produced for ~$40–50/month. The 100x cohort identifies AI films as the biggest open commercial opportunity in generative AI as of 2026.

## How It Works

### Frame math (critical formula)
```
Duration (seconds) = Length (frames) ÷ FPS
```
- 121 frames ÷ 24 FPS ≈ **5 seconds** (WAN 2.2 preferred length)
- 50 frames ÷ 25 FPS = 2 seconds
- Lowering FPS to 12 doubles duration but creates stop-motion/clay feel (below 12 FPS = human eye detects individual frames)

### ComfyUI video workflow differences from image
| Node | Image equivalent | Video addition |
|------|-----------------|----------------|
| Empty H-Latent Video | Empty Latent Image | Adds `length` field (number of frames) |
| Video Combine / Create Video | Save Image | Assembles frames + sets FPS |
| Save Video (WEBP) | Save Image | Video file output |

Everything else (positive/negative prompt, KSampler, VAE decode, CLIP) is identical to image workflows.

### Model loading (unbundled, like FLUX)
WAN requires 3 separate downloads:
1. **Diffusion model** (main model, e.g., `wan_1.3B_t2v.safetensors`) → Load Diffusion Model
2. **Text encoder** (UMT5 XXL CLIP) → Load CLIP
3. **VAE** (WAN-specific) → Load VAE

## Key Variants / Extensions

### Wan model family
| Model | Parameters | Size | Capabilities | VRAM |
|-------|-----------|------|--------------|------|
| Wan 2.1 1.3B | 1.3B | Small | T2V only | Lower |
| Wan 2.1 14B T2V | 14B | Large | Text-to-video | High |
| Wan 2.1 14B I2V | 14B | Large | Image-to-video | High |
| Wan 2.2 5B (FP16) | 5B | ~10 GB | T2V, fast | ~20 GB |
| Wan 2.2 full | 14B | ~64 GB | T2V, quality | 64 GB |

- **T2V (Text-to-Video):** Generate video from text prompt alone
- **I2V (Image-to-Video):** Generate video using a starting image + text prompt (only 14B, not 1.3B)
- WAN is a Chinese model — negative prompts are in Chinese by default (normal behavior)

### Quantization: FP16 vs FP8
| | FP16 | FP8 |
|--|------|-----|
| Precision | 16-bit floating point | 8-bit floating point |
| VRAM required | Higher | Lower |
| Quality | Better | Slight degradation |
| File size | Larger | Smaller |
| Use case | Production quality | Low-VRAM hardware, quick tests |

WAN 2.2 5B FP16 = the recommended balance for cohort use (~10 GB, fast generation on A6000).

### Hunyuan World (Tencent)
- Text-to-3D world generation (not just static 3D)
- Generates separable 3D elements with physics simulation
- Output can be imported into game engines (Unity, etc.) for interactive experiences
- Designed for game developers and metaverse creators
- Represents a leap beyond static 3D generation tools

### Advanced WAN/Hunyuan techniques (from L07 — old cohort structure)
1. **Video ControlNet:** Preprocess source video into a control map video (Canny, Depth) → use to drive new video generation while changing style/subject
2. **Video Inpainting:** Apply static mask to all frames → regenerate masked region consistently across the full video clip
3. **Video Outpainting:** Pad video canvas + inpaint the expanded area for every frame
4. **Style transfer for video:** ControlNet (motion/structure) + IP-Adapter (visual style) + text prompt → combined generation

### Proprietary video model ecosystem (FreePik / direct API)
As of April 2026, the commercial video model landscape:

| Model | Platform | Quality | Cost | Notes |
|-------|----------|---------|------|-------|
| CDance 2.0 (Seedance) | FreePik, Higgsfield, OpenArt | Highest | ~$2.5/video | Up to 9 inputs (image+audio+text); passes AI detectors as real |
| Kling 3.0 | FreePik, direct API | Very high | ~350 credits/5s | Best balance; character consistency across cuts |
| Kling 2.5 | FreePik, direct API | High | ~250 credits/video | Slightly cheaper |
| VO3 Lite | FreePik | Decent | Cheapest | Best for image+audio input; fewest credits |
| LTX 2 | FreePik | Good | Low | Solid option |

FreePik markup: ~30-40% over direct API. Direct API = better economics at scale.
For avatar/lip-sync: sync.ai > HeyGen for facial expression quality.
For voice cloning: 11Labs (audio only) or CDance 2.0 (voice within video).

### LoRA compatibility warning
LoRAs trained on FLUX image models are **not compatible** with WAN video models. The architectures are different; LoRAs are tied to their base model. A FLUX LoRA cannot be used in a WAN workflow.

## Examples
- **5-second product video:** Wan 2.2 5B, 121 frames, 24 FPS, FLUX LoRA-trained product as reference image (I2V) → consistent product across full clip
- **AI avatar for Instagram:** Script (Claude) → voice clone (11Labs) → WAN/Heygen for avatar video → edit to show avatar 2–4 seconds at a time, B-roll covers rest
- **Jungle composition assignment (cohort L8):** WAN jungle scene with controlled depth and motion
- **Video outpainting:** Extend a 480p video canvas to cinematic widescreen by generating consistent content beyond original borders

## Connections
Related concepts: [[comfyui-workflow-system]], [[flux-architecture]], [[controlnet]], [[ip-adapter]], [[lora-training]]
Introduced by: [[100x-cohort7-module1-diffusion]] (WAN/Hunyuan, L07), [[100x-l09-intro-freepik-spaces]] (CDance/Kling/VO3 ecosystem), [[100x-l10-branding-marketing-freepik-spaces]] (Spaces pipelines), [[100x-l11-ai-influencer-ugc-product-ads]] (UGC/influencer video), [[100x-l12-filmmaking-storyboarding-interpolations]] (filmmaking principles, interpolation)

## Open Questions / Unknowns
- When will open-source video quality match Seedance 2.0 / Veo for cinematic output?
- WAN 2.2 full 64 GB — how does quality compare to WAN 2.1 14B at same resolution?
- Can LoRAs be trained specifically for WAN video models for character consistency across video?
