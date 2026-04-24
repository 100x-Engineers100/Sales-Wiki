---
title: "Cinematic Shot Node (FreePik)"
type: concept
tags: [filmmaking, freepik, spaces, camera, cinematography, 100x-cohort7, module1]
source_count: 1
---

## Definition
The Cinematic Shot node is a specialized image generator in FreePik Spaces that replaces model selection with virtual camera configuration controls — film stock (Camera), optical character (Lens), field of view (Focal Length), and depth of field (Aperture). It functions as a virtual camera crew, allowing prompt-based cinematography without needing to describe camera settings in text.

## Why It Matters
Without the Cinematic Shot node, camera-style control requires extensive prompt engineering ("85mm lens, f2.8 aperture, bokeh background"). The node encapsulates these as dropdown controls, enabling precise shot-type replication. Every professional filmmaker thinks in these four dimensions; this node gives AI generative workflows the same vocabulary.

## The 4 Camera Controls

### 1. Camera (Film Stock) — Color Tone & Dynamic Range
| Stock | Aesthetic | Use case |
|-------|-----------|----------|
| Standard | Prompt-dependent, no film character | Default / unspecified |
| Cinema Digital 35mm | Modern Hollywood, high dynamic range, rich colors | Commercial ads, brand films |
| 70mm Film | Grainy texture, warm grain (Christopher Nolan aesthetic) | Prestige / cinematic |
| 35mm Film | Classic cinematic look | Period-inspired content |
| 8mm Film | Heavy grain, warm tone — retro/vintage | Nostalgia, vintage brand feel |
| Camcorder | Y2K / 2000s aesthetic (Mr. Bean era) | Retro nostalgia, Lo-fi viral |
| Medium Format Film | Clean, professional modern camera look | Editorial, fashion |
| Lo-Fi Toy Camera | High contrast, extreme color distortion, Lomo-style | Experimental, lo-fi brand identity |

### 2. Lens (Optical Character) — How Light Is Filtered
| Lens | Character | Notes |
|------|-----------|-------|
| Standard Lens | Clean glass, no distortion, no personality | Neutral reference |
| Prime Lens | Extremely sharp focus on subject | Recommended by Pranay as default |
| Anamorphic | Oval bokeh, cinematic widescreen feel | Prestige film look |
| Classic Planar Prime | Smooth bokeh, no distortion | Close to prime, softer |
| Vintage Aspherical | Soft edges, darker at edges — old TV look | Retro/vintage aesthetic |
| Medium Format | Good background separation | Editorial |
| Medium Format Smooth | Soft focus roll-off in background | Lifestyle, beauty |

### 3. Focal Length (Field of View / Perspective)
**Rule: LOWER focal length = WIDER shot. HIGHER focal length = NARROWER, more isolated shot.**

| Focal Length | What it sees | Use case |
|-------------|-------------|----------|
| 14-24mm (Ultra-Wide) | Massive environment, everything visible | Grand establishing shots, low-angle hero shots |
| 35mm (Medium-Wide) | Subject grounded in environment; both in detail | Person-in-scene, closest to human peripheral vision |
| 50mm (Normal) | Mimics human eye, zero distortion | Realistic portrait, slightly blurred background |
| 85-135mm (Telephoto) | Subject isolated, background blurred (bokeh) | Close-up emotional shots, faces |
| 200mm+ (Extreme Tele) | Only subject; background abstract/magnified/blurred | Extreme isolation, background unrecognizable |

Mechanical truth: focal length = physical distance between lens and camera sensor.

### 4. Aperture (Depth of Field) — What Is In Focus
**Rule: LOWER f-number = SHALLOWER depth of field (more blur). HIGHER f-number = DEEPER depth of field (everything sharp).**

| Aperture | Depth of Field | Use case |
|----------|---------------|----------|
| F1.2 | Ultra-shallow — eyelashes sharp, everything else blurs immediately | Extreme macro, eye close-ups |
| F2-F2.8 | Subject sharp, background creamy blur | Classic portrait |
| F4-F5.6 | Subject sharp, background partially blurred | Person + environment |
| F8 | Most things in focus | General use |
| F11-F16 | Everything sharp, wide depth of field | Wide landscapes, everything must be clear |

**Focal length vs Aperture distinction:**
- Focal length = field of view (how wide or narrow the frame is)
- Aperture = depth of field (how much of the frame is in focus)
Both can blur backgrounds, but from different mechanisms. Do not confuse them.

## Camera Cheat Sheet (Shot-to-Settings Map)

| Shot Type | Focal Length | Aperture | Film Stock |
|-----------|-------------|----------|------------|
| Ultra-wide establishing | 14-24mm | F11-F16 | Cinema Digital 35mm |
| Medium environment shot | 35mm | F8 | Medium Format Film |
| Normal portrait | 50mm | F4-F5.6 | Cinema Digital 35mm |
| Tight portrait / face | 85-135mm | F2-F2.8 | Prime Lens |
| Extreme close-up | 135-200mm | F1.2-F2 | Prime Lens |
| Aerial/drone | 16-24mm | F8-F11 | Cinema Digital 35mm |
| Dramatic action hero | 50mm | F2.8 | Anamorphic Lens |

## Access
- FreePik Spaces: Add Node → Cinematic Shot
- Also accessible via: FreePik Home → All Tools → Cinematic Shot → pin to sidebar
- Likely running Imagen 2 under the hood (based on output aesthetics)

## Connections
Related concepts: [[ai-filmmaking-workflow]], [[freepik-spaces-workflows]], [[freepik-platform]]
Introduced by: [[100x-l12-filmmaking-storyboarding-interpolations]]

## Open Questions / Unknowns
- What model does Cinematic Shot run under the hood? (Appears to be Imagen 2, not confirmed)
- Can Cinematic Shot settings be combined with character references from Upload nodes?
- Will future versions allow custom film stock and lens configurations?
