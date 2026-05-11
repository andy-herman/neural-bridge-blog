---
title: "Responsive page widths — wide prop for index/grid pages"
date: 2026-05-10
kind: fix
project: neural-bridge-blog
pr_url: "https://github.com/andy-herman/neural-bridge-blog/pull/12"
links:
  - label: "PR #12"
    url: "https://github.com/andy-herman/neural-bridge-blog/pull/12"
tags: [auto-sync]
---

Index/grid pages now opt into a wider container (max-w-6xl ≈ 1152px) instead of being forced into the article-reading width (max-w-2xl ≈ 672px). Article reading pages stay narrow for readability. Nav and Footer accept the same prop and stay aligned with whichever width the page uses.
