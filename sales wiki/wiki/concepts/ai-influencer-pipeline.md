---
title: "AI Influencer Pipeline"
type: concept
tags: [ai, influencer, ugc, freepik, spaces, character-consistency, 100x-cohort7, module1]
source_count: 1
---

## Definition
An AI influencer is a fully fictional digital persona — no real human identity behind it — that runs social media, promotes products, and appears consistent across all generated content. The AI influencer pipeline is the end-to-end workflow for creating such a persona and generating product ad content using that persona, built in FreePik Spaces.

## Why It Matters
AI influencers remove scheduling, fees, personal brand conflicts, and photographer costs from content marketing. A single pipeline can generate 30+ consistent character images or videos across any product, setting, and scenario. Morphica (built by a 100x Cohort 5 student) is a real commercial wrapper app for exactly this workflow.

**AI influencer ≠ AI twin**: An AI twin uses your own face as the source. An AI influencer is a fictional persona with no real human behind it. Distinct business models with different ethical/legal considerations.

## Phase 1: Character Design

### Design principles
- Choose unusual, non-existent feature combinations (e.g., red hair + dark complexion + red eyes)
- Why: avoids stock photo hallucination; makes character scroll-stopping and distinctive
- Consistency across angles is easier with highly distinctive traits
- Model: Imagen 3 Pro (best quality + lowest hallucination rate)
- Expect 3-5 generation iterations before a satisfactory base character

### Required reference image set (minimum 9)
| Image | Purpose |
|-------|---------|
| Front-facing close-up | Base character reference |
| Left side profile | Side-angle generation |
| Right side profile | Side-angle generation |
| Full body / zoomed out | Body proportion reference |
| T-pose | Captures hands, clothing, full body anatomy — critical |
| Emotion: screaming | Range |
| Emotion: smiling | Range |
| Emotion: surprised/neutral | Range |
| Contextual (cafe/event/stage) | Situational reference |

**Why 9+?** When generating new scenarios, the model needs multiple reference angles. With one image, it guesses side profiles and anatomy — and gets them wrong. More references = higher consistency.

Generate each new angle using the original front-facing image as reference to maintain consistency across the set.

## Phase 2: Pipeline Architecture in FreePik Spaces

4-column structure:

**Column 1 — Character references (5 Upload nodes max recommended)**
Front, side, T-pose, emotion, contextual shots → all wired to Final Assembly node.

**Column 2 — Product generation**
Separate Image Generator node:
- Prompt: `"product photography of [product], studio lighting, clean minimal packaging, white background"`
- Or: upload real product photo directly (no generation needed)
- For 2D products (PDF/app): generate 3D mockup first, then multi-angle product images from the mockup

**Column 3 — Clothing (optional)**
Separate Image Generator:
- Prompt: `"flat lay image of men's/women's [style] attire, [description]"`
- Adds explicit clothing control to the final assembly

**Column 4 — Background/Room**
Separate Image Generator:
- Prompt: `"[room type], [style], [lighting], [time of day], no humans"`

**Final Assembly (Imagen 3 Pro)**
All columns connect here as references.
Prompt uses @ syntax:
`"This person [@character] wearing [@clothing] holding [@product] in one hand, in a [@room], speaking to THE camera, UGC style"`

**Critical**: Say "THE camera" not "a camera." "a camera" = model generates a camera object in the scene.

## Phase 3: Video Generation

After generating the final composite image:
1. Connect to Video Generator node (Kling 3.0 recommended for credit efficiency)
2. Start image: final influencer+product composite
3. Prompt: `"person speaking to camera enthusiastically, slight body movement, UGC style"`

For multi-shot sequences:
Generate Shot 1, 2, 3 as separate images → Video 1: Shot1→Shot2 (interpolation), Video 2: Shot2→Shot3 → combine in post (CapCut/Premiere Pro).

## Technical Limits
- Imagen 3 Pro: ~14 references maximum
- Most video models: ~9 references maximum
- Count connected nodes — disconnect unused references to stay under limit
- Generate at 1K first; bump to 2K/4K only when prompt is validated

## Credit Strategy
| Step | Model | Notes |
|------|-------|-------|
| Test generations | Imagen 2 | Fast, fewer credits |
| Final images | Imagen 3 Pro | Only when prompt tuned |
| Video | Kling 3.0 | 4x cheaper than CDance 2.0 |
| Cheapest video | VO3 Lite | Safest for image+audio input |

Avoid: "Build Your Character" template in Spaces — expensive, low control.

## Using AI Assistant for Complex Prompts
When combining many elements (character + clothing + product + room + action), use the **AI Assistant node** (GPT-4o Mini) to generate the final assembly prompt. Input: description of what you want. Output: structured prompt → pipe into Image Generator. The node reads connected reference images as context.

## Business Model
- Social media pages with zero human behind them — users engage and buy without knowing
- Morphica (C5 student): wrapper app for this exact pipeline
- Brands pay for AI UGC ad production packages: character creation → content library → ongoing generation

## Connections
Related concepts: [[freepik-spaces-workflows]], [[freepik-platform]], [[lora-training]], [[ip-adapter]], [[controlnet]], [[ai-filmmaking-workflow]]
Introduced by: [[100x-l11-ai-influencer-ugc-product-ads]]

## Open Questions / Unknowns
- Legal/ethical framework for AI influencers using fictional faces: no established standard as of April 2026
- When does Spaces add native character library / character-call-by-name functionality?
- Can a FLUX face LoRA (from ComfyUI training) be used in Spaces to call the character? Not yet integrated.
