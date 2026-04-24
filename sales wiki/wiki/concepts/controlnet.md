---
title: "ControlNet"
type: concept
tags: [diffusion, controlnet, comfyui, sdxl, flux, 100x-cohort7]
source_count: 2
---

## Definition
ControlNet is an auxiliary neural network that constrains image generation by providing a spatial control map — a derived representation of an input image (edges, depth, pose skeleton, etc.). It sits between the text conditioning and the KSampler, enforcing structure that prompts alone cannot guarantee.

## Why It Matters
Text prompts can describe what an image should contain but cannot reliably dictate exact spatial layout, pose, or composition. ControlNet solves this: it forces the diffusion model to follow the structure of a reference image while still applying the style and content of the text prompt. This unlocks professional use cases like fashion photography (consistent pose), architectural rendering (straight lines), and character consistency (exact pose replication).

## How It Works
1. Load a reference image into ComfyUI
2. Pass it through a **preprocessor node** — this extracts the control map (e.g., edge lines, depth gradient, pose skeleton)
3. Load the matching **ControlNet model** (preprocessor type must match model type)
4. Feed the control map + ControlNet model into an **Apply ControlNet node**
5. Apply ControlNet sits between CLIP Text Encode outputs and the KSampler — it injects the control map into the conditioning
6. KSampler generates guided by both text prompt AND control map

**Critical rule:** Preprocessor and ControlNet model must match. Canny preprocessor + Canny model. Depth preprocessor + Depth model. Mismatch = degraded or incoherent output.

## Key Variants / Extensions

### The 6 ControlNet types
| Type | What it detects | Best use case |
|------|----------------|---------------|
| **Canny** | Sharp edges and outlines of all shapes | Organic shapes, product silhouettes, character structure |
| **Depth** | 3D depth map (lighter = closer, darker = farther) | Scene layout, interior design, 3D product mockups |
| **OpenPose** | Human pose as a stick-figure skeleton | Fashion photography, character pose replication, film sequences |
| **Scribble** | Simplified hand-drawn-like outline | Rough concept sketching to finished image |
| **MLSD** | Straight lines only (ignores curves) | Architecture, interior design, rooms, buildings |
| **SAM (Segmentation)** | Color-coded object segments | Complex scene understanding, object manipulation |

Quick ref: MLSD → rooms and buildings. Canny → organic shapes and products.

### Multi-ControlNet chaining
Multiple ControlNets can be applied simultaneously by chaining Apply ControlNet nodes in series. The conditioning output of the first node becomes the conditioning input of the second.

Example: OpenPose (character pose) + Depth (background layout) running simultaneously → full scene control.

### Key parameters
**Strength (0–1):** How rigidly the generation adheres to the control map. Higher = more literal. Lower = looser interpretation.

**Start/End percentage:** At what point in the denoising process ControlNet is active. `end_percent = 0.8` on a 20-step process → ControlNet active for first 16 steps only. Useful for applying structural guidance early while allowing detail freedom later.

### FLUX ControlNet (different mechanism)
FLUX does not use the standard ControlNet node structure. FLUX ControlNet models (currently Depth and Canny) are:
- Loaded as LoRAs via a Load LoRA node
- Applied via an InstructPix2Pix Conditioning node (sits between FLUX Guidance and KSampler)
- Require higher guidance value in FLUX Guidance node (e.g., 30) to balance LoRA influence

## Examples
- **Fashion/apparel photography:** OpenPose transfers model's pose → no studio, no live models needed. AI-generated product photos at scale.
- **Architectural redesign:** MLSD captures straight lines of walls/rooms → lighting and style can be regenerated while preserving exact room structure.
- **Outfit Anyone workflow (combined):** OpenPose (maintain pose) + IP-Adapter (new clothing style) + Inpainting (mask original clothing) → complete outfit swap in one pipeline.
- **Video ControlNet:** Same types work on video by preprocessing each frame into a control map video, then driving WAN video generation.

## Connections
Related concepts: [[comfyui-workflow-system]], [[flux-architecture]], [[ip-adapter]], [[lora-training]], [[video-generation-models]]
Introduced by: [[100x-l05-controlnet-ip-adapters]]

## Inpainting with ControlNet
Segmentation ControlNet can be used to auto-mask objects for inpainting. For manual inpainting, the workflow is separate (see [[inpainting-workflow]]). Best results come from inpainting-specific checkpoints — regular diffusion models can inpaint but quality is lower.

## Open Questions / Unknowns
- SAM segmentation node performance on complex scenes with overlapping objects?
- Full range of FLUX ControlNet types — currently only Depth and Canny; others may come from community
- Optimal strength values per ControlNet type for SDXL vs FLUX — no universal standard
