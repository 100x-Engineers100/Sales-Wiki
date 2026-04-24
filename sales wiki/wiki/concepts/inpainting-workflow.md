---
title: "Inpainting Workflow"
type: concept
tags: [diffusion, inpainting, comfyui, sdxl, 100x-cohort7, module1]
source_count: 1
---

## Definition
Inpainting is a diffusion workflow that regenerates only a user-defined masked region of an existing image while preserving the rest. The model fills the masked area with new content described by the updated text prompt, blending seamlessly with the surrounding pixels.

## Why It Matters
Full image regeneration discards a good base image to fix one element. Inpainting solves this: surgically replace a person, object, or background region without touching the rest of the composition. Core use case: swap a subject in a scene while keeping background, lighting, and context intact.

## How It Works

### ComfyUI Inpainting Workflow (SDXL)
```
Load Image ─────────────────────────────────────┐ (pixel)
             → Open in Mask Editor → paint mask  ↓ (mask)
                                     VAE Encode for Inpainting
                                              ↓ (latent)
CLIP Text Encode (new content description) → KSampler
                                              ↓
                                         VAE Decoder → Preview
```

Step-by-step:
1. Load Image node — bring in your base image
2. Right-click Load Image → "Open in Mask Editor" → paint the region to replace → Save
3. Replace Empty Latent Image with **VAE Encode for Inpainting** node
4. Wire: pixel output → pixel input, mask output → mask input
5. Set `grow_mask` to ~25 (controls how far the mask bleeds into surrounding pixels for seamless edge blending)
6. Update text prompt to describe the NEW content for the masked area
7. VAE Encode for Inpainting encodes the masked image as a latent → feeds KSampler

### Key parameter: grow_mask
Controls mask edge bleed. Too low = hard seam. Too high = replaces too much surrounding content. ~25 is a safe starting point for most subjects.

## Key Variants / Extensions

**Segmentation ControlNet for auto-masking**: Instead of manual mask painting, a Segmentation ControlNet can automatically isolate objects by class — useful for batch pipelines where manual masking is not feasible.

**Inpainting-specific checkpoints**: Models trained specifically for inpainting (e.g., SDXL Inpainting) produce significantly higher quality output than using a standard diffusion checkpoint. Use them when quality matters.

## Examples
- Swap person in a scene (boy → girl in a jungle) while keeping the background unchanged
- Replace product on a shelf while maintaining lighting/shadow
- Fix AI-generated hands using inpainting with a hand-focused prompt
- Remove unwanted objects from a scene and fill with contextually appropriate content

## Connections
Related concepts: [[controlnet]], [[comfyui-workflow-system]], [[diffusion-models]], [[ip-adapter]]
Introduced by: [[100x-l05-controlnet-ip-adapters]]

## Open Questions / Unknowns
- Optimal grow_mask values by subject type (faces vs. products vs. backgrounds)
- Does FLUX have a native inpainting node or does it use the same VAE Encode for Inpainting path?
- How does inpainting interact with IP-Adapter style transfer (can both be applied in the same workflow)?
