---
title: "100x Cohort 7 — L12: Filmmaking Principles, Storyboarding & Interpolations"
type: source
source_type: course_notes
author: "Pranay (100x Engineers)"
date: 2026-04-18
raw_path: raw/courses/Lecture_12_Filmmaking_Storyboarding_Interpolations.txt
tags: [ai, filmmaking, storyboarding, freepik, spaces, cinematic, interpolation, 100x-cohort7, module1]
---

## Summary

Lecture 12 is an over-the-shoulder session — Pranay builds a 31-second Monster Energy ad live while students watch a professional think out loud. The core question: "You can generate images and videos — how do you turn that into a coherent 30-40 second ad film?" Answer: filmmaking principles first, then systematic storyboarding, scene-by-scene asset generation, interpolation for transitions, and combining in sequence.

The lecture introduces the Cinematic Shot node (camera/lens/focal/aperture controls), two video strategies (direct prompting vs interpolation), the Video Combiner node, and Pranay's 6-phase filmmaking process. This lecture is identified as the most-asked skill in 100x Engineers' recruitment pipeline. Companies like Ogilvy are actively hiring for this.

## Key Ideas

- **Cinematic Shot node**: Specialized image generator in FreePik with virtual camera controls — film stock (Camera), optical character (Lens), field of view (Focal Length), depth of field (Aperture). Likely Imagen 2 under the hood.
- **Narrative first**: Compress the entire story into ONE line before touching any tool. That line is the creative north star for every shot decision.
- **Storytelling frameworks**: Three-Act (Setup/Confrontation/Resolution), Hero's Journey, Save the Cat (commercial), In Medias Res (open mid-action, Nolan method — attention from frame 1).
- **Lock character + location before first scene**: Changing characters mid-pipeline breaks consistency. Generate all reference images (front, T-pose, side, emotional) before generating scenes.
- **Storyboard = AI-generated images**: Each storyboard frame IS a ComfyUI/Spaces image node. No separate storyboard tool needed.
- **Focal length rule**: Lower = wider shot (14-24mm for establishing). Higher = narrower/isolated (85-200mm for faces/close-ups).
- **Aperture rule**: Lower f-number = shallower depth of field (more blur). Higher f-number = deeper depth of field (everything sharp).
- **Two video strategies**: (1) Direct prompting: single start frame + motion prompt → more creative freedom. (2) Interpolation: Shot N → Shot N+1 as start+end frames → controlled transitions. Realism decreases with interpolation + references.
- **Video Combiner node**: Connects multiple video outputs in sequence. Set sequence order at node bottom.
- **Transitions**: Do NOT try to handle in AI prompts — results inconsistent. Use CapCut/Premiere Pro/Final Cut Pro for fade/cut/zoom transitions.
- **Prompt formula for film**: subject + action + environment + camera angle + mood. Always reference all key assets via connected nodes + @ syntax.
- **Monster Energy ad built live**: ~31 seconds, 2 characters (man + King Kong), 2 locations (Manhattan + destroyed city), 1 product (real photo upload). Cost: ~4,445 credits.
- **ComfyUI deployment masterclass**: Pranay committed to a separate masterclass for deploying ComfyUI workflows as consumer apps (easy wrapper + hard custom method). Not in regular lecture slots.

## Notable Quotes / Moments

> "Compress your story into ONE LINE. That one line = your creative north star. Every shot decision comes from it." — Pranay

Pranay's self-assessment of the live ad: "First 10 seconds are polished, last section was rushed. The drone shot I'd redo."

Camera cheat sheet (from the lecture):
| Shot Type | Focal Length | Aperture | Use Case |
|-----------|-------------|----------|----------|
| Ultra-wide establishing | 14-24mm | F11-F16 | Grand establishing shots |
| Medium environment | 35mm | F8 | Subject in scene, all visible |
| Normal portrait | 50mm | F4-F5.6 | Realistic, slightly blurred bg |
| Tight portrait | 85-135mm | F2-F2.8 | Face focus, creamy bokeh |
| Extreme close-up | 135-200mm | F1.2-F2 | Macro, eye detail |
| Aerial/drone | 16-24mm | F8-F11 | Wide aerial perspective |
| Dramatic action | 50mm | F2.8 | Subject isolated, bg suggestive |

## Concepts Introduced

[[ai-filmmaking-workflow]], [[cinematic-shot-node]], [[freepik-spaces-workflows]]

## Entities Mentioned

[[pranay]], [[100x-engineers]]

## Contradictions / Tensions

- Interpolation (start+end frame) reduces realism vs direct prompting — tradeoff between control and quality. No universal best choice.
- Open-source video (WAN/LTX) behind proprietary (CDance/Kling) for film quality — ComfyUI best for image consistency within film pipelines, not end-to-end film generation.

## Open Questions

- When will the ComfyUI deployment masterclass be released (easy + hard methods)?
- Pranay's prompting guide Notion doc — shared on Discord day after session; not archived in this transcript.
- Kling Avatar feature (record yourself → someone else does it) — teased, covered in next lecture.
