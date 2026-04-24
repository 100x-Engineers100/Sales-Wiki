---
title: "AI Filmmaking Workflow"
type: concept
tags: [filmmaking, storyboarding, interpolation, freepik, spaces, video, 100x-cohort7, module1]
source_count: 1
---

## Definition
The AI filmmaking workflow is a 6-phase process for producing coherent short ad films (30-40 seconds) using AI tools — from narrative concept through storyboarding, asset generation, video creation, and final assembly. It adapts professional filmmaking principles (narrative-first, shot-by-shot) to AI generation tooling in FreePik Spaces.

## Why It Matters
$40-50/month in subscriptions now produces what previously required millions in studio production budget. AI filmmaking is identified as the biggest commercial opportunity in generative AI as of 2026, with ad agencies (Ogilvy, etc.) actively hiring. The process democratizes brand films, ad films, and short films for micro-agencies and solo creators.

## The 6-Phase Process

### Phase 1 — Narrative
**Before touching any tool**, compress the entire story into ONE line.
Example: "If a monster drinks Monster Energy drink, he becomes more destructive."

That one line = the creative north star. Every shot decision, character design, and location choice is validated against it.

**Storytelling frameworks** (choose one or combine):
| Framework | Structure | Best for |
|-----------|-----------|----------|
| Three-Act | Setup → Confrontation → Resolution | Classic brand stories |
| Hero's Journey | Ordinary world → Call → Transformation | Character-driven ads |
| Save the Cat | Hook-focused beat sheet | Commercial storytelling |
| In Medias Res | Open mid-action, cut back/forward | Attention-grabbing from frame 1 (Nolan method) |

### Phase 2 — Character & Location Setup
Lock all characters and locations **before generating any scene**.
Changing characters mid-production breaks consistency — there is no undo.

**Per character, generate:**
- Front-facing image (base reference)
- T-pose (full body anatomy, clothing, proportions — critical)
- Side profile(s)
- Emotional/contextual shots

**Per location, generate:**
- Master establishing shot (wide, 14-24mm, F11) → use as reference for all subsequent angles
- Alternative angles (low angle, eye level, drone)

### Phase 3 — Storyboard Generation
Each storyboard frame = a separate Image Generator node in Spaces.
Connect relevant character and location references to each shot node.

This IS the visual storyboard — AI-generated storyboard frames, not a separate tool.

**Name each node**: "Shot 1", "Shot 2" etc. for navigability.

Match camera settings (Cinematic Shot node — see [[cinematic-shot-node]]) to shot mood:
- Establishing → wide focal (14-24mm), F11
- Face close-up → tight focal (85-135mm), F2.8
- Dramatic hero moment → anamorphic lens, 50mm, F2.8

### Phase 4 — Scene Image Generation
For each storyboard frame:
- Use a separate Image Generator (or Cinematic Shot) node
- Connect character + location references
- Set aspect ratio: 16:9 for landscape video
- Aspect ratio: always set before generating, not after

### Phase 5 — Video Generation (Two Strategies)

**Strategy 1 — Direct Prompting**
Feed a single image as start frame + write a motion prompt.
Use when: more creative freedom in motion is acceptable.
Model: Kling 3.0 or CDance 2.0.

**Strategy 2 — Interpolation (Start + End Frame)**
Feed Shot N as START image and Shot N+1 as END image.
Model creates the transition motion between them.
Use when: specific character movement from one pose to another is required.

Trade-off: interpolation with references decreases realism. Direct prompting = more photorealistic; interpolation = more controlled transitions. Choose based on priority.

### Phase 6 — Combining Video Clips
Use the **Video Combiner** node in FreePik Spaces.
Connect multiple video outputs; define sequence order at the bottom of the node.
Final output: assembled ad film.

**Transitions (cuts, fades, zooms):** Do NOT attempt in AI prompts — results are inconsistent.
Use post-production tools: CapCut (easiest), Premiere Pro, Final Cut Pro.
CapCut handles: transitions, AI auto-captions, basic cuts.

## Prompting Formula for Film
```
[subject] + [action] + [environment] + [camera angle] + [mood/style]
```
Always reference all key assets via @ syntax in Spaces.
Use "THE camera" (not "a camera") for UGC facing shots.
Use cinematic vocabulary: "low angle", "drone shot", "establishing shot", "close-up", "rack focus", "bokeh".

## Real Ad Built Live (L12)
- Concept: "If a monster drinks Monster Energy drink, he becomes more destructive"
- Characters: human man (front/side/T-pose) + King Kong gorilla (front/side/T-pose with big hands)
- Locations: Manhattan city (daytime drone) + destroyed city (cloudy, rubble, low angle)
- Product: real product photo uploaded directly
- Duration: ~31 seconds | Cost: ~4,445 credits
- Pranay's self-assessment: "First 10 seconds polished. Last section rushed. Drone shot I'd redo."

## Connections
Related concepts: [[cinematic-shot-node]], [[freepik-spaces-workflows]], [[freepik-platform]], [[ai-influencer-pipeline]], [[video-generation-models]]
Introduced by: [[100x-l12-filmmaking-storyboarding-interpolations]]

## Open Questions / Unknowns
- What is the optimal interpolation approach for high-motion scenes (action, fight, sports)?
- When does open-source video quality (WAN, LTX) match CDance/Kling for professional filmmaking?
- ComfyUI deployment masterclass (easy + hard methods) — not yet released as of April 2026.
