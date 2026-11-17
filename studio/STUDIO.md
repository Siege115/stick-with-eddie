# Stick With Eddie Studio: operating manual

The shared rulebook for the manager and all 12 specialists. Creative rules live in `../CHANNEL-BIBLE.md`.

## Who is in charge
- **The owner** decides what gets made, approves pictures and videos, and **sets every posting date**.
- **`youtube-manager`** runs the team, assigns work, checks it and reports to the owner.
- **Specialists** do one job each and hand back to the manager. They never start other agents.

## Pipeline (one project = one Short, id `sNN-short-name`)
| # | Stage | Owner | Output | Gate |
|---|---|---|---|---|
| 1 | Idea | trend-scout | entry in `studio/IDEAS.md` | owner picks the topic |
| 2 | Research | trend-scout | `briefs/<id>-research.md` | — |
| 3 | Script | scriptwriter | `briefs/<id>-script.md` | — |
| 4 | Fact-check | fact-checker | `briefs/<id>-factcheck.md` | APPROVED |
| 5 | Art & storyboard | art-director | `briefs/<id>-art.md` | — |
| 6 | Build | animator (+ scriptwriter for the beats) | `content/<id>.beats.mjs`, code in `src/` | — |
| 7 | Stills review | art-director + animator | `deliver/<id>-review.jpg` | **owner approves the pictures** |
| 8 | Sound | sound-designer | narration + mix | −14 LUFS |
| 9 | Full render | animator | `deliver/<id>.mp4` + contact sheet | — |
| 10 | Packaging | packaging-lead | `content/<id>-package.md` | — |
| 11 | QA | qa-reviewer | `reports/<id>-qa.md` | PASS |
| 12 | Publish prep | publisher (+ social-repurposer) | `briefs/<id>-publish.md`, `briefs/<id>-social.md` | **owner approves the video and the post** |
| 13 | Live | publisher | URL in `PIPELINE.md` | owner's date |
| 14 | Review | analytics-analyst, community-manager | `reports/<id>-48h.md`, `-7d.md`, `-comments.md` | lessons → manager memory |

A project can go back to any earlier stage. The manager writes the reason in `PIPELINE.md`.

## Approval rules (apply to every agent)
Nothing goes public and nothing costs money without the owner's explicit yes for that exact action:
- uploading, scheduling or publishing a video, on any platform;
- replying to, pinning, hearting or deleting comments;
- paid generations (ElevenLabs, Higgsfield, vidIQ credits and similar), always with the cost stated.

## Brief format (manager → specialist)
```
Project: sNN-short-name
Task: <one sentence>
Inputs: <files>
Deliver to: <file path>
Due: <date or "today">
Notes: <owner feedback, bible rules that matter here>
```

## Hand-off note (specialist → manager)
`Done / Blocked` · what was made · file path · open questions · what the next stage needs.

## Stand-up format (manager → owner)
```
📅 Next posting dates (set by you): …
🎬 In progress: <id> — stage — owner of the task — next step
⛔ Blocked / waiting on you: …
💡 Suggestions: … (max 3)
```

## Files
| File | What it holds | Who edits it |
|---|---|---|
| `studio/SCHEDULE.md` | Posting dates | owner (manager records what the owner says) |
| `studio/PIPELINE.md` | Board of all projects | manager |
| `studio/IDEAS.md` | Ranked idea backlog | trend-scout |
| `studio/briefs/` | Per-project research, scripts, art, fact-checks, publish packs | specialists |
| `studio/reports/` | QA, analytics, comment reports | specialists |
| `content/` | Beats files and packages | scriptwriter, packaging-lead |
| `src/`, `render-episode.mjs` | The 3D render pipeline | animator, sound-designer |
| `deliver/` | Finished videos, contact sheets, review boards | animator, art-director |
