---
title: "100x Cohort 7 — L06: Flux LoRA Training"
type: source
source_type: course_notes
author: "Pranay, Sridev (100x Engineers)"
date: 2026-03-28
raw_path: raw/courses/Lecture_06_Flux_LoRA_Training.txt
tags: [ai, diffusion, flux, lora, fine-tuning, comfyui, 100x-cohort7, module1]
---

## Summary

Lecture 6 picks up where L05 left off: IP Adapters don't guarantee face consistency — LoRA training does, because the model *learns* the subject rather than referencing it at inference time. Pranay walked through the full FLUX model setup in ComfyUI (the unbundled three-node structure replacing Load Checkpoint), then attempted live LoRA training on JavasLabs, which hit a GPU/CUDA driver compatibility error mid-session. The live debug became its own lesson. The session also confirmed that LoRA supersedes seed-locking as the standard for character consistency going forward.

Sridev opened with AI news: TurboQuant (Google), a Claude Mythos leak (Anthropic unreleased models), Meta's Tribelab V2 (neural activity digital twin), Sora shutdown, and MIDO (open-source world engine built by a Chinese teenager using GraphRAG).

## Key Ideas

- **FLUX loading = 3 separate nodes**: Load Diffusion Model (flux1-dev, weight_type `fp8_e4m3fn_fast`), Dual CLIP Loader (clip_l + t5xxl), Load VAE (ae.safetensors). Never use SDXL VAE with FLUX.
- **fp8 quantization**: compresses the ~24GB FLUX model to fit available VRAM. Must set explicitly.
- **FLUX Guidance node**: placed between positive CLIP output and KSampler. Recommended value: 3.5. KSampler CFG must be set to 1 (FLUX handles guidance internally).
- **LoRA vs IP Adapter**: IP Adapter = reference at inference time (approximate). LoRA = model *learns* the subject at train time (exact). Trigger word recall is precise.
- **LoRA use cases**: Face (consistent person), Product (consistent shape/label/color), Style (Amul Girl), Brand (asset aesthetic replication).
- **Sridev's Amul Girl example**: 40 images → trained LoRA captured style, aesthetic, attempted font. Text rendering still weak — proprietary models better for text.
- **Dataset specs**: Face LoRA: 15-25 photos (varied angles, lighting, expressions, some full-body). Product LoRA: 15-20 images (multiple angles, clear label). No heavy filters or edits.
- **Training platform**: JavasLabs — use A6000 or A5000 specifically.
- **FLUX ControlNet**: Canny and Depth only (not OpenPose/MLSD). Loaded as LoRAs, not via ControlNet model loaders.
- **FLUX Redux**: FLUX's IP Adapter equivalent for image-based prompting.
- **Loading internet workflows**: Download workflow JSON → drag into ComfyUI canvas → install missing nodes via ComfyUI Manager → load required models → run.
- **Live debug lesson**: PyTorch version incompatible with CUDA driver on A6000 → uninstall torch → install CUDA-compatible version. Pranay: "70-80% of coding is error → investigate → fix → retry."
- **WAN 2.2 frame spec**: preferred 121 frames (5 seconds); max ~138 before quality drops.

## Notable Quotes / Moments

> "This is what 70-80% of coding looks like. Error → investigate → fix → retry. That's debugging." — Pranay, on the live GPU driver error

> "LoRA now supersedes seed-based consistency going forward." — Pranay, end of session

Live training hit a GPU/CUDA driver error (PyTorch version mismatch on A6000). A pre-recorded working version was committed to Discord as the resolution.

## Concepts Introduced

[[flux-architecture]], [[lora-training]], [[comfyui-workflow-system]]

## Entities Mentioned

[[pranay]], [[sridev]], [[100x-engineers]]

## Contradictions / Tensions

- Dataset size guidance: this lecture says face LoRA = 15-25 images. Earlier module 1 notes referenced 20-30. 15-25 is the more authoritative figure from L06.
- FLUX ControlNet only supports Canny and Depth — OpenPose, MLSD, Scribble etc. (covered in L05 for SDXL) are not yet available for FLUX.

## Open Questions

- What are the exact updated commands after the live debug fix? (Posted on Discord, not in transcript)
- When will FLUX ControlNet expand beyond Canny and Depth?
- FLUX 2 mentioned as better for AI influencer work — when does the cohort cover FLUX 2 training?
