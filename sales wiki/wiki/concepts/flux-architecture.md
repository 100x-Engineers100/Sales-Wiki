---
title: "FLUX Architecture"
type: concept
tags: [diffusion, flux, comfyui, architecture, 100x-cohort7]
source_count: 2
---

## Definition
FLUX is a next-generation diffusion model architecture developed by Black Forest Labs (a team with roots at Stability AI) that uses an **unbundled component structure** — the main diffusion model, text encoders (CLIP), and image decoder (VAE) are separate files loaded independently — as opposed to SDXL's single bundled checkpoint. FLUX produces superior image quality, better prompt adherence, and more accurate human anatomy than SDXL.

## Why It Matters
SDXL bundles everything into one checkpoint file, which limits flexibility. FLUX's unbundled architecture allows each component to be updated, swapped, or versioned independently. More importantly, FLUX's underlying model architecture is fundamentally better at generating realistic faces, hands, and following complex prompts — the two biggest failure modes of SDXL at production scale.

## How It Works

### Unbundled loading in ComfyUI
SDXL: one `Load Checkpoint` node outputs MODEL + CLIP + VAE.

FLUX: three separate nodes:
- **Load Diffusion Model** → loads the main U-Net (`flux1-dev`). Set `weight_type` to `fp8_e4m3fn_fast` — this quantizes the ~24GB model to fit available VRAM. Must be set explicitly.
- **Dual CLIP Loader** → loads FLUX's two text encoders: `clip_l` (Clip 1) and `t5xxl` (Clip 2). SDXL uses one CLIP; FLUX requires both.
- **Load VAE** → loads `ae.safetensors` (FLUX-specific). Do NOT use SDXL VAE with FLUX.

These outputs (MODEL, CLIP, VAE) connect to the same downstream nodes as in SDXL.

### FLUX Guidance node
FLUX replaces the standard CFG scale with a dedicated **FLUX Guidance node** placed between the positive CLIP Text Encode output and the KSampler.
- KSampler CFG is set to **1.0** (effectively disabled)
- FLUX Guidance value controls prompt adherence — start at **3.5**
- No negative prompt required (model is robust enough without it)

### ControlNets in FLUX
FLUX does not use the standard ControlNet node. Instead:
- ControlNet models (currently Depth and Canny) are loaded as **LoRAs** via a Load LoRA node
- Applied via an **InstructPix2Pix Conditioning node** between FLUX Guidance and KSampler
- Guidance value must be increased significantly (e.g., to ~30) when using ControlNet LoRAs to balance their influence

### Style transfer in FLUX
**FLUX Style Model (Redux):** FLUX's equivalent of IP-Adapter. Uses an `Apply Style Model` node for transferring the aesthetic of a reference image onto generated output.

## Key Variants / Extensions

### FLUX.1 Dev vs FLUX.1 Schnell (Chanel)
| | FLUX.1 Dev | FLUX.1 Schnell (Chanel) |
|--|-----------|------------------------|
| Quality | Higher | Slightly lower |
| Steps needed | ~20 | As few as 4 |
| License | Non-commercial for apps | Apache 2.0 (fully commercial) |
| LoRA training | Yes (primary target) | Yes |
| Best for | Custom training, max quality | Shipping commercial apps fast |

**License note:** FLUX Dev outputs can be used commercially, but wrapping FLUX Dev into a paid application requires permission from Black Forest Labs. Use FLUX Schnell for commercial app deployment.

### LoRA training for FLUX
- Use **AI Toolkit** (not KohyaSS)
- Setup: PyTorch template on Jarvis Labs → clone ai-toolkit → Gradio UI
- FLUX is gated on Hugging Face — must accept terms on Black Forest Labs model page
- Better face/product output than SDXL LoRA due to FLUX's stronger architecture
- LoRAs are architecture-specific: FLUX LoRA ≠ SDXL LoRA (not interchangeable)

### SDXL vs FLUX — when to use which
| SDXL | FLUX |
|------|------|
| Mature ecosystem, huge community model library | Superior image quality and prompt adherence |
| Single checkpoint = simpler workflow | Unbundled = more flexible, more setup |
| ControlNet: dedicated ControlNet model nodes | ControlNet: loaded as LoRAs |
| LoRA training: KohyaSS | LoRA training: AI Toolkit |
| Still useful for video (WAN is separate) | Current standard for open-weight image generation |

## Examples
- **FLUX Text-to-Image in ComfyUI:** Load Diffusion Model + Dual CLIP Loader + Load VAE → CLIP Text Encode → FLUX Guidance → KSampler (CFG=1) → VAE Decode → Save Image
- **FLUX LoRA for AI influencer:** Train on 20–30 face images via AI Toolkit on Jarvis Labs A6000 (~2 hours) → load LoRA in ComfyUI → trigger word in prompt → consistent character across all outputs
- **FLUX ControlNet for depth-guided generation:** Load ControlNet depth model as LoRA → InstructPix2Pix Conditioning → FLUX Guidance (value=30) → KSampler

## Connections
Related concepts: [[comfyui-workflow-system]], [[lora-training]], [[controlnet]], [[ip-adapter]], [[diffusion-models]]
Introduced by: [[100x-l06-flux-lora-training]]

## Open Questions / Unknowns
- When will community ControlNet types beyond Depth and Canny be available for FLUX?
- FLUX 2 — mentioned as superior for AI influencer/character work; training process not yet covered in cohort
- FLUX Schnell performance ceiling — how much quality is sacrificed for 4-step generation?
