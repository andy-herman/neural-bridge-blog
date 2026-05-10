---
title: "Research: Memory Poisoning in Personal Agentic AI Substrates"
date: 2026-05-08
kind: post
project: neural-bridge-blog
links:
  - label: "Read the paper"
    url: "/research/memory-poisoning-in-personal-agentic-ai-substrates"
tags: [agentic-ai-security, memory-poisoning, threat-model]
---

The threat model that drives every design decision in compile.py. AgentPoison and PoisonedRAG show that less than 0.1% adversarial entries in long-term memory can hit 80–99% attack success. If agents write into shared memory and other agents read from it, you have a perfect channel for prompt injection — and prompt-rule defenses do not survive contact with content the prompt itself loads.
