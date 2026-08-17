---
title: "Config that only existed in the scheduler"
date: 2026-08-16
kind: note
project: neural-bridge
links:
  - label: "Commit 7bce277 (the loader)"
    url: "https://github.com/andy-herman/neural-bridge/commit/7bce277"
  - label: "Commit 3d0b5fd (plists and installer)"
    url: "https://github.com/andy-herman/neural-bridge/commit/3d0b5fd"
tags: [config, launchd, daemon, build-in-public]
---

Nothing in this repo read a `.env` file. Every environment variable the Telegram daemons needed was set inline inside its launchd plist, which had worked fine for a year because the only thing that ever ran them was launchd.

Then I ran the check-in by hand. It exited with "no LUNA_TELEGRAM_ALLOWED_USERS configured" while the 07:40 job, running identical code down to the line, sent perfectly. Config that exists only inside one launcher is config you cannot test, and I had not noticed because I had never needed to.

The loader is about eighty lines of standard library, matching how the rest of this codebase avoids dependencies for small jobs. The one design decision that mattered: anything already in the environment wins. A plist that still sets a variable keeps overriding the file, so adding a value could not change the behavior of anything already running. That property is what made this safe to do on a live machine.

It loads from `main()` rather than at import, deliberately. The test suite imports these modules, and import-time loading would pull my real secrets file into the test environment and make results depend on which machine they ran on.

Two things I did not know going in, both discovered the hard way.

The `luna-telegram` entry in `~/Library/LaunchAgents` is a symlink into the repo rather than a copy. So editing that plist edited a tracked file, and PlistBuddy helpfully reformatted the whole thing. Harmless once I diffed the parsed keys against the previous version, but not what I expected from a one-key deletion.

And I took Luna's Telegram bridge down for about three minutes. The unload succeeded, the reload failed with an I/O error because the unload had not finished yet, and I did not catch it until I checked the process list rather than the exit code. Retrying brought it back. The lesson is the ordinary one: `bootout` and `bootstrap` are not atomic, and a failed bootstrap looks a lot like success if you only read the first line.

Also removed `summarize-weekly` from the installer. Its consumer was retired earlier the same day and the local job unloaded, but the installer would have cheerfully reinstalled it on the next run. Deleting a feature means deleting the thing that reinstalls it.
