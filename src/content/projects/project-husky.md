---
title: Project Husky
description: "The local app I teach AI security from at the UW iSchool. Its slides run real prompt injection attacks against a small model on the laptop, measure how often each defense holds, and keep a recorded clip behind every demo."
status: active
started: 2026-09-18
tagline: "A classroom where the attack runs live"
featured: 6
---

Project Husky is the app I teach from at the University of Washington iSchool.
It runs on one laptop at the front of the room and keeps the slides, my
speaker notes, the live demos, and the class polls in one app instead of
three.

It started with a new course on securing AI systems, where the attack is the
lesson. A slide in Husky can be a working panel. I send a prompt injection at
HuskyAI, a deliberately vulnerable academic advisor, switch defense layers on
and off, and the room watches what the model does with each one.

<figure class="not-prose my-10 lg:-mx-24" data-evidence="runtime-capture">
<a href="/images/project-husky/demo-remove-a-leg.webp" class="block" target="_blank" rel="noopener">
<img src="/images/project-husky/demo-remove-a-leg.webp" alt="Husky running Week 2's Remove a Leg demo on a real local model. The red verdict reads EXFILTRATED: the agent emailed the student's records to records-sync@evil.example after reading a tampered policy document. Below it are the agent's tool calls and the simulated outbox, and on the right is everything the model saw, colored by trust." width="1920" height="1080" loading="lazy" decoding="async" class="w-full h-auto" />
</a>
<figcaption class="mt-3 text-sm leading-relaxed text-cream-800 dark:text-cream-300">Week 2's Remove a Leg demo on the real model. A tampered policy document told the agent to email a student's records out, and it did. The right side is everything the model saw, colored by who wrote it. <a href="/images/project-husky/demo-remove-a-leg.webp" target="_blank" rel="noopener" class="text-rust-500 underline underline-offset-4">Open full size</a>.</figcaption>
</figure>

## How it works

- **The app and demos stay on the laptop.** Husky serves only `127.0.0.1`, because
  what it hosts is deliberately vulnerable. The demos run `qwen2.5:3b` in
  Ollama on the same machine, with no API keys and no calls out.
- **One source, two decks.** The lectures live in Python files that a script
  already turned into PowerPoint decks. Husky reads the same files, so a fix
  to a slide lands in the `.pptx` and the web deck at once.
- **Rates, not anecdotes.** Any demo can run ten tries and report the leak
  rate with a 95% range. One lucky or unlucky run never stands in for a
  measurement.
- **A worst case on demand.** A scripted model called `mock` always follows
  the attacker, so the defense is the only thing left that can change the
  outcome.
- **A clip behind every demo.** Each of the 23 live demo slides has a recorded
  fallback, and one command re-records all of them. If a demo misbehaves in
  class, I press V.
- **Phones through a relay.** Students join with a four-letter code to answer
  polls and ask questions. The laptop connects out to a small relay on
  Firebase's free plan, and nothing connects in.

<figure class="not-prose my-10 lg:-mx-24" data-evidence="runtime-capture">
<a href="/images/project-husky/projector-and-phone.webp" class="block" target="_blank" rel="noopener">
<img src="/images/project-husky/projector-and-phone.webp" alt="Left, the projector view: the slide under the live poll, an announcement, four student questions shown without names, and a QR code with the join code. Right, a phone joined as a fictional student, with an answer selected and the same questions listed for upvoting." width="1920" height="1080" loading="lazy" decoding="async" class="w-full h-auto" />
</a>
<figcaption class="mt-3 text-sm leading-relaxed text-cream-800 dark:text-cream-300">The projector and a student's phone in a rehearsal. Questions reach the room without names, and the student is fictional. <a href="/images/project-husky/projector-and-phone.webp" target="_blank" rel="noopener" class="text-rust-500 underline underline-offset-4">Open full size</a>.</figcaption>
</figure>

## What is in it

- AI Systems Security, built in: ten weeks, 570 lecture slides, 94 lab
  slides, and 23 live demo slides on 11 demo engines.
- Information Assurance and Cybersecurity (INFO 310) and Enterprise Risk
  Management (INFO 312), from imported PowerPoint decks. Every imported deck
  gets an accessibility check against what UW asks of course materials.
- A presenter console with the talking track, polls, and a moderated question
  queue, plus Simulate class for rehearsing with pretend students.
- A Results page that matches participation against the class roster from
  Canvas.
- A double-click Windows app. Every pull request runs the full test suite on
  Windows and Linux, then builds the app, starts it, and asks it for every
  demo engine.

## Student data

Class records stay on the laptop. Each session writes a plain log of who
joined, each poll answer, and each question and vote. When students join from
phones, the relay carries their names, NetIDs, answers, and questions during
class, and the cloud copy is deleted when the class ends. A class that is
never ended stays in the cloud until the next class starts and sweeps it. A
relay update that is not deployed yet also stops writes 12 hours after a
class starts and has Firestore delete what is left within about a day.
Assignments and final grades stay in Canvas.

## What it is built from

- Python and Flask, bound to `127.0.0.1` only.
- Vanilla JavaScript and Jinja templates, with no build step.
- Ollama with `qwen2.5:3b`, or the scripted `mock` model.
- Firestore and Firebase Hosting on the free Spark plan for the phone relay.
- PyInstaller for the Windows app, which opens in its own Edge window.
- Playwright driving Edge to record the fallback clips.

## What it is not

Husky is not a learning management system, and it does not replace Canvas.
It is not a hosted service either. It runs on my laptop, and its source
repository is private.

The demos run on a 3-billion-parameter model, so their attack rates are not
rates against frontier models. What transfers is the method: look at the
whole context, measure instead of trusting one run, and prefer changes to
architecture over changes to wording.

The name comes from the UW mascot. The mark is my own drawing of a husky, not
the university's athletics logo, and Husky is a personal project, not
something the UW publishes.
