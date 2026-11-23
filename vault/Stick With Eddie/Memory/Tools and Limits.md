---
category: "Environment"
priority: 2
summary: "What works, what is blocked, known limits"
type: "memory"
updated: "2026-11-23"
tags:
  - "stick-with-eddie"
  - "memory"
---
# Tools and Limits

- **Render:** `node render-episode.mjs content/<id>.beats.mjs projects/<id> --aspect 9:16 --3d --workers 3` (about 45 min for 64 s). Stills: `--preview t1,t2,…` or `--preview all`. Contact sheet: `src/contact.sh`. See [[Render Commands]].
- **Voice:** local Kokoro (`am_michael`; S02 narrator runs a brisk 1.16 speed; merchant `am_adam`). ElevenLabs "Mark" (`UgBBYS2sOqTuMpoF3BR0`) generates, but downloading from elevenlabsusercontent.com was **denied in-session**, so it's unused. Drop takes in as `audio/<id>/bNN_0.mark.wav`.
- **Network:** Wikipedia, Gutenberg and help.obsidian.md page fetches are blocked; web search works.
- **Usage limit:** long agent runs can hit the plan's 5-hour limit. Work is saved; resume after the reset. Don't restart on your own (it spends the owner's usage).
- **Container restarts** happen: long tasks must be resumable; commit often.
- **Git:** pushes to `main` work. Deleting remote branches is refused (403): `wip/s02-ship` is left over (same as main); the owner can delete it on GitHub.
- Not in git (large or regenerable): `models/`, `audio/`, `projects/`, `deliver/`, `node_modules/`.
