---
title: "100x Cohort 7 — L10: Branding & Marketing Workflows in FreePik Spaces"
type: source
source_type: course_notes
author: "Pranay, Sridev (100x Engineers)"
date: 2026-04-11
raw_path: raw/courses/Lecture_10_Branding_Marketing_FreePik_Spaces.txt
tags: [ai, freepik, spaces, ugc, branding, workflow, 100x-cohort7, module1]
---

## Summary

Lecture 10 introduces FreePik Spaces — the node-based workflow interface inside FreePik that automates multi-step content pipelines. Pranay builds the same UGC pipeline from L09 (product + character → composite image → video) but now inside Spaces, where all steps connect as nodes and run in one click. The core value: swap one node (e.g., change the product Upload) and re-run the whole pipeline instantly.

Sridev opened with AI news: Netflix VOID model (SAM2-equivalent for video, object removal from scenes), CIA Ghost Murmur (quantum magnetometry + AI for heartbeat detection), OpenAI funding round, new OpenAI image model (ranks #1 for editing on LM Arena, not T2I), LM Arena explained, and Anthropic's 171 emotional representations research.

## Key Ideas

- **FreePik Spaces = ComfyUI paradigm with proprietary models**: Same node-based canvas, "Add Node" button, left-to-right data flow. No open-source models; cloud-based; faster; less granular control.
- **Key nodes**: Image Generator (references via drag from Upload node), Video Generator (Kling/CDance/VO3), Upload, AI Assistant (GPT-4o Mini), Cinematic Shot.
- **"Run from here" option**: Run the pipeline from any node forward — useful for partial re-runs.
- **UGC pipeline in Spaces**: Upload product → Upload character → Image Generator (Imagen 3 Pro) with both as references → Video Generator (Kling) → UGC video. Total: ~1,300 credits.
- **When to choose FreePik Spaces**: Fast production content, best proprietary models, UGC/product ads/social media, no local GPU required.
- **When to choose ComfyUI**: Local powerful hardware, cost-zero generation at scale, data privacy requirements, full pipeline control, building apps/products on top.
- **Prompt strategy (Pranay's workflow)**: Paper notepad → LLM conversation to flesh out → paper structure again → FreePik → iterate.
- **LLMs for prompting**: Claude Sonnet 4.5 (best for content per Pranay); Meta AI (best for understanding video context and deriving video prompts).
- **Iteration is mandatory**: "You will never get the output one-shot. You always have to iterate." Expect 3-10 iterations to reach clean output.
- **AI influencer vs AI twin**: Using your own face = AI twin, not influencer. AI influencer = no human identity behind it.
- **Kling 3.0 / CDance 2.0 outputs**: Currently pass most AI detectors as "real video."
- **LM Arena**: Anonymous benchmark — same question to 2 models, user picks better one without knowing which is which. Claude Opus 4.6 #1 for text and code.
- **Anthropic 171 emotional representations**: "Act desperately" → riskier model responses. "Analyze calmly" → conservative results. Prompt tonality matters.

## Notable Quotes / Moments

> "You will never get the output one-shot. You always have to iterate. Every generation is a starting point." — Pranay

> "Whoever controls the story, controls the market." — Sridev, on OpenAI acquiring TBPN (media narrative play)

> "March was entirely Claude's month. They're dominating both model efficacy and business model." — Sridev

## Concepts Introduced

[[freepik-spaces-workflows]], [[freepik-platform]]

## Entities Mentioned

[[pranay]], [[sridev]], [[100x-engineers]]

## Contradictions / Tensions

- FreePik Spaces cannot be deployed as standalone apps yet (as of April 2026) — limits commercial product use case vs. ComfyUI.
- Cohort gifted credits do not include commercial licensing; commercial use requires purchasing own plan.

## Open Questions

- When will FreePik enable app-building on top of Spaces?
- What is the full node library in Spaces beyond Image Generator, Video Generator, Upload, AI Assistant, and Cinematic Shot?
