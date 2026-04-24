---
title: "100x Cohort 7 — L05: ControlNets, IP Adapters & Flux Intro"
type: source
source_type: course_notes
author: "Pranay (100x Engineers)"
date: 2026-03-27
raw_path: raw/courses/Lecture_05_ControlNets_IP_Adapters_Flux.txt
tags: [ai, diffusion, controlnet, ip-adapter, comfyui, sdxl, 100x-cohort7, module1]
---

## Summary

Lecture 5 by Pranay answers the core question: "Prompting alone can't control the exact structure or style of an image — what other levers do we have?" The answer is ControlNet (structural guidance) and IP Adapters (image-as-prompt). The session started with a Socratic rebuild of the basic text-to-image workflow from memory, then layered on ControlNet nodes, followed by IP Adapters, inpainting, and seed-locking for character consistency.

This is the most hands-on workflow lecture in Module 1 to this point — students built each workflow live in ComfyUI, with Pranay explicitly refusing to repeat steps more than twice, pushing students toward the recorded material for reference.

## Key Ideas

- **ControlNet = structural guidance**: Preprocesses a reference image into a condition map (edges, depth, skeleton) and overlays it on the latent noise at every denoising step. The stencil analogy: structure locked, style free.
- **Critical wiring rule**: Never connect Load Image directly to Apply ControlNet. Always run a Preprocessor node in between.
- **Preprocessor must match ControlNet model**: Canny preprocessor → Canny model. SDXL models are incompatible with SD 1.5 models.
- **8 preprocessor types covered**: Canny, Scribble, Line Art, OpenPose, MLSD (straight lines only, SD 1.5 only), Depth, Normal Map, Segmentation.
- **ControlNet Union model**: Single 4GB model that handles all ControlNet types — good for iteration, not production. Individual specialized models produce better results.
- **IP Adapter = image-as-prompt**: CLIP converts text to tokens; IP Adapter converts images to the same machine language. The KSampler treats the image encoding as a semantic prompt — not structural guidance.
- **Key distinction**: ControlNet = structural (what shape). IP Adapter = semantic (what style/character). Do not conflate.
- **IP Adapter Plus Face**: Focuses on facial features. Still not 1:1 accuracy — LoRA training (Lecture 6) is required for true face consistency.
- **Image Batch Multi node**: Load up to 5 reference images for IP Adapter to blend style influence.
- **Inpainting workflow**: Replaces Empty Latent Image with VAE Encode for Inpainting; mask painted via "Open in Mask Editor" on Load Image node; grow_mask ~25 for clean bleed.
- **Seed locking**: Fix seed → same base noise → similar structure across generations. Cheaper than LoRA but less precise for true character consistency.

## Notable Quotes / Moments

> "Like a stencil — the structure is locked, the style and content can change." — Pranay, on ControlNet

> "Pranay committed to releasing more recorded material on ControlNet and IP Adapters" — post-lecture, in response to 29% hard difficulty rating

Session difficulty poll: Easy 11% | Medium 60% | Hard 29%

## Concepts Introduced

[[controlnet]], [[ip-adapter]], [[inpainting-workflow]], [[comfyui-workflow-system]]

## Entities Mentioned

[[pranay]], [[100x-engineers]]

## Contradictions / Tensions

- MLSD is explicitly noted as SD 1.5 only (not SDXL yet) — this contradicts any documentation implying MLSD works on SDXL. Flag if SDXL MLSD support ships.
- IP Adapter is not sufficient for face consistency — LoRA (L06) is the correct tool. Beginners commonly misapply IP Adapter for this purpose.

## Open Questions

- When will MLSD support arrive for SDXL?
- What are the precise grow_mask values for different mask types in inpainting?
- How do Normal Map ControlNets behave in production workflows for material/texture manipulation?
