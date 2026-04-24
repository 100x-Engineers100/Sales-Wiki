---
title: "100x Cohort 7 — L11: AI Influencer & In-Depth UGC / Product Ads"
type: source
source_type: course_notes
author: "Pranay, Sridev (100x Engineers)"
date: 2026-04-17
raw_path: raw/courses/Lecture_11_AI_Influencer_UGC_Product_Ads.txt
tags: [ai, freepik, spaces, influencer, ugc, product-ads, 100x-cohort7, module1]
---

## Summary

Lecture 11 covers the most-requested student topic: building a fully fictional AI influencer from scratch, then generating content of that influencer selling a real product — in a single automated pipeline in FreePik Spaces. Sridev attended briefly (his final live lecture before leaving for Google Cloud Next / Adobe Summit). The session also included the house sorting ceremony.

The key process: define a distinctive fictional character → generate 9+ multi-angle reference images → build a Spaces pipeline with character + product + clothing + room references → assemble final influencer+product composite → animate with Kling.

## Key Ideas

- **AI influencer ≠ AI twin**: AI influencer = fully fictional persona, no real human behind it. AI twin = your own face used in AI. Distinct business models.
- **Distinctive features = scroll-stoppers**: Use unusual, non-existent combinations (red hair + dark complexion + red eyes). Avoids stock photo hallucination. Consistency across angles easier with distinctive traits.
- **9+ reference images per character**: Front-facing, left/right side profiles, full body, T-pose (captures anatomy + clothing proportions), emotion shots (screaming/smiling/surprised), contextual shots (cafe, stage, event). One image is insufficient — model guesses what side profile looks like and gets it wrong.
- **T-pose is critical**: Captures hands, body proportions, clothing detail that the model needs for full-body shots.
- **Pipeline architecture (4-column layout in Spaces)**:
  - Column 1: 5 character reference Upload nodes → main Image Generator
  - Column 2: Separate Image Generator for product → output connects as reference
  - Column 3: Separate Image Generator for clothing (optional) → output connects as reference
  - Column 4: Separate Image Generator for background/room → output connects as reference
  - Final: Assembly Image Generator (Imagen 3 Pro) — all 4 columns connect here
- **@ syntax for references**: Use @character, @clothing, @product, @room in the final assembly prompt to reference connected nodes explicitly.
- **"THE camera" vs "a camera"**: "a camera" = model generates a camera object. "THE camera" = character speaks toward viewer. Critical distinction for UGC-style content.
- **AI Assistant node for complex prompts**: Use GPT-4o Mini node in Spaces to generate the full assembly prompt from a description. Meta-prompting: LLM writes prompts for image models.
- **Reference limits**: Imagen 3 Pro accepts ~14 references max. Most video models accept ~9. Count connected nodes; disconnect unused ones to stay under limit.
- **Resolution strategy**: Generate at 1K first for speed; bump to 2K/4K once prompt is validated.
- **Credit strategy**: Imagen 2 for test runs; Imagen 3 Pro only when prompt is tuned; Kling 3.0 over CDance 2.0 (4x cheaper); VO3 Lite is cheapest video option. Do not use "Build Your Character" template — expensive, low control.
- **Product pipeline variants**: Physical product → photograph it, upload as reference. 2D product (PDF/app interface) → generate 3D mockup first, then multi-angle product images. Clothing brand → swap product node with clothing photos.
- **Video: interpolation for multi-shot**: Generate Shot 1, Shot 2, Shot 3 as images. Video 1: Shot1→Shot2 (start+end frame). Video 2: Shot2→Shot3. Combine in post.
- **House system**: AlphaGo (Entrepreneur + Code), Watson (Entrepreneur + No-code), Deep Blue (Career + Code), Liberatus (Career + No-code).

## Notable Quotes / Moments

Pranay used ~10,000 credits building the full session demo.
Morphica (wrapper app for AI influencers) was built by a Cohort 5 student — real business precedent for this workflow.

## Concepts Introduced

[[ai-influencer-pipeline]], [[freepik-spaces-workflows]], [[freepik-platform]]

## Entities Mentioned

[[pranay]], [[sridev]], [[100x-engineers]]

## Contradictions / Tensions

- VO3 Lite (cheapest video) vs CDance 2.0 (best quality) — students must trade off cost vs quality per use case. No universal recommendation.

## Open Questions

- What is the exact reference limit for Kling 3.0 (vs Imagen's ~14)?
- When does Spaces add native character-call functionality beyond the @ reference syntax?
- Capstone project credits: additional credits coming — amount not specified in this session.
