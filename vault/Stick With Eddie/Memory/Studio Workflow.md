---
category: "Workflow"
priority: 2
summary: "How work moves through the team"
type: "memory"
updated: "2026-11-23"
tags:
  - "stick-with-eddie"
  - "memory"
---
# Studio Workflow

- Rulebook: `studio/STUDIO.md` (14 pipeline stages, gates, brief and stand-up formats). Board: `studio/PIPELINE.md`. Owner dates: `studio/SCHEDULE.md`.
- The **manager** delegates; specialists do one job each and hand back. In claude.ai sessions the manager runs as a sub-agent and **cannot itself spawn agents**, so the main session dispatches specialists directly and the manager can do a stage itself under the specialist's rules.
- Every stage writes a file (`studio/briefs/<id>-*.md`, `studio/reports/`, `content/`, `deliver/`).
- **Fact-check twice:** the research, then the script line by line. Shot fixes from the fact-check go to the art director and animator.
- Builds go step by step, each ending with a still board; **S01 regression check** (stills at 1.0, 19.0, 30.97, 60.6 s must match) before merging engine changes.
- Long renders run in the background, resumable (2-second pieces); re-run the same command after any interruption.
- Commit and push after each step. A Stop hook insists on a clean tree, so commit everything.
