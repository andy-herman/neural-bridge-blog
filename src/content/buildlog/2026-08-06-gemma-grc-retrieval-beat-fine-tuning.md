---
title: "Gemma GRC: retrieval beat fine-tuning, and the search model was the lever"
date: 2026-08-06
kind: release
project: gemma-grc
links:
  - label: "Project page"
    url: "/projects/gemma-grc"
tags: [gemma-grc, rag, fine-tuning, retrieval, evaluation]
---

The local compliance assistant shipped with no fine-tuned generator at all: base Gemma 3 4B, hybrid retrieval, and a prompt that demands a citation for every claim or a plain statement of what is missing.

That was a measured decision, not a shortcut. Closed-book fine-tuning on my notes raised fabrication from 20% of answers to 48% on the 1B model. It learned the register and none of the facts. Retrieval raised answer quality by 0.86 on a five-point scale (confidence interval +0.48 to +1.24). Tuning the generator on top of retrieval added +0.04, which is noise.

The component that moved was the one I had been ignoring. Contrastive fine-tuning of the 33M-parameter embedding model, 1,549 pairs, nine minutes on the Mac Mini, took recall@4 from 0.711 to 0.786. Four generator experiments bought nothing; one retriever run bought seven and a half points.
