---
title: "PII Handling in AI Systems"
type: concept
tags: [ai, agents, privacy, security, pii, compliance, 100x-cohort7]
source_count: 1
---

## Definition
A 3-step pipeline ensuring that Personally Identifiable Information (PII) never reaches a third-party LLM API in identifiable form. The LLM sees anonymized or encrypted data; real PII lives only in the builder's execution environment.

PII: any data that can identify a specific individual — name, Aadhaar, PAN card, UPI ID, email, phone number, biometrics, social security number.

## Why It Matters
When you send user data to a third-party LLM API (OpenAI, Anthropic, any non-local API), you transfer that data to their servers. You lose control. Cambridge Analytica was possible because Facebook's APIs exposed user data — an external company used it to influence the 2016 US election and Brexit. Sending Indian users' Aadhaar/UPI data to foreign LLM APIs creates the same risk. Even without malicious intent, you are legally responsible for what happens to that data. PII handling is not optional — it is your legal and ethical responsibility as a builder.

## How It Works

**The 3-step pipeline:**

**Step 1 — Identify:** Before sending anything to the LLM, run a PII filter that detects identifiable fields in the input.
- Tools: Azure PII API (Azure Cognitive Services), open-source PII filters on Hugging Face, OpenAI Moderation API (partial support)

**Step 2 — Anonymize or Encrypt:**
- **Anonymization**: Replace names with "John Doe," remove PAN numbers, redact phone numbers. For most tasks, the LLM can complete the work without actual PII values.
- **Encryption**: Convert PII to encrypted tokens before sending. Store the decryption mapping in your execution environment only — never send it to the LLM.
- The LLM sees: encrypted strings or placeholders. It responds using those.

**Step 3 — Decrypt/Restore:** After the LLM responds, map encrypted tokens back to real values in your deterministic execution layer before returning results to the user.

```
[Raw user input: "My name is Rahul Sharma, UPI ID 9876543210@upi"]
       ↓
[PII filter]
       ↓
[Anonymized: "My name is [NAME_1], UPI ID [UPI_1]"]
       ↓
[LLM processes anonymized input]
       ↓
[Response: "Hello [NAME_1], your transaction for [UPI_1] was processed"]
       ↓
[Decryption layer restores: "Hello Rahul Sharma, your transaction..."]
[Returned to user]
```

The LLM never sees real PII. Even if the LLM provider logs or trains on the data, they have encrypted strings with no re-identification capability.

## Key Variants / Extensions
- **Government/defense builds**: treat ALL user data as maximally sensitive; mask and encrypt everything by default
- **VPC deployment**: for enterprise clients who can't send any data to public APIs, deploy open-source models in private cloud — same pipeline, no external transfer
- **Razorpay UPI agent example** (from cohort): conversational UPI agent handling payment data — mandatory PII pipeline

## Connections
Related concepts: [[guardrails-architecture]], [[agent-production-pillars]], [[hallucination-formula]]
Introduced by: [[100x-cohort7-module3-agents]]
