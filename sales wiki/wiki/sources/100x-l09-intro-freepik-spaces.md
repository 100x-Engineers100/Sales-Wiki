---
title: "100x Cohort 7 — L09: Intro to FreePik Spaces"
type: source
source_type: course_notes
author: "Pranay (100x Engineers)"
date: 2026-04-10
raw_path: raw/courses/Lecture_09_Intro_FreePik_Spaces.txt
tags: [ai, freepik, video, kling, cdance, ugc, 100x-cohort7, module1]
---

## Summary

Lecture 9 transitions from the ComfyUI engine room to FreePik — a commercial AI aggregator that wraps top proprietary models in a polished UI. Pranay positions this as "ComfyUI was React/Next.js from scratch; FreePik is learning Framer." The core argument: students' deep understanding of latent space, ControlNet, IP adapters, and LoRA behavior gives them an edge on FreePik that regular users don't have.

The session covered FreePik's model roster, UI navigation, video model pricing, and built a live UGC-style video demo (product + character composite → Kling video). Lecture 10 automates this same workflow in FreePik Spaces.

## Key Ideas

- **FreePik = AI aggregator**: Pulls APIs of best AI models, wraps them in polished UI. No model management required. Students' ComfyUI knowledge = advantage because they understand what's happening underneath.
- **Models on FreePik**: Imagen 3 (NanaBanana), Imagen 3 Pro, Imagen 2 (fast), CDance 2.0, Flux 2.2 Pro, CDream 5 Lite, Kling 2.5/3.0 (video), LTX 2 (video), OpenAI Sora (until April 24th).
- **Other aggregators**: Higgsfield, OpenArt, Genspark.
- **Why FreePik chosen**: It has FreePik Spaces — a node-based workflow interface (covered in L10).
- **Image model recommendations**: Imagen 3 Pro = best quality; CDream 5 Lite = fastest.
- **Video model recommendations**: Kling 3.0 (balance), CDance 2.0 (quality ceiling).
- **Style references in FreePik = LoRAs**: When you pick "Pastel Cartoon" or "Oil Painting" style in FreePik's image generator, you are selecting a pre-trained LoRA. FreePik hides the technical layer.
- **Character reference in FreePik = IP Adapter**: Upload a face image for character consistency — same mechanism as IP Adapter in ComfyUI.
- **FreePik pricing markup**: ~30-40% over direct API. Example: Kling on FreePik ~$0.20/sec vs direct API ~$0.14/sec. Use APIs directly at scale; FreePik for learning/prototyping.
- **Video continuity**: Top models (Kling 3.0, CDance 2.0) now maintain character/object consistency across cuts — solved problem as of cohort date.
- **Data privacy**: Images uploaded to FreePik are processed on model providers' servers. Enterprise use case for local ComfyUI: sensitive product/face/brand data must not leave internal systems.
- **Avatar/lip-sync**: sync.ai > HeyGen for facial expression quality; more expensive.
- **Voice cloning**: 11Labs for audio only; CDance 2.0 for voice within video.

## Notable Quotes / Moments

> "FreePik is like learning Framer. ComfyUI was learning React/Next.js from scratch. Both valid — different levels of control." — Pranay analogy

> "Template apps that animate your photo charge premiums because users don't understand the pipeline. You do — that's your advantage." — Pranay

Live UGC demo built: product image + character image → composite via Imagen → Kling video = raw iPhone-look UGC ad.

## Concepts Introduced

[[freepik-platform]], [[video-generation-models]]

## Entities Mentioned

[[pranay]], [[100x-engineers]]

## Contradictions / Tensions

- FreePik's commercial licensing only applies to purchased plans, not cohort gifted credits. Students using gifted credits cannot use outputs commercially.

## Open Questions

- Can applications be built on top of FreePik's API? Not yet as of April 2026 — "coming soon."
- What is CDance 2.0's per-credit cost on FreePik vs. direct API?
