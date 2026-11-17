# Stick With Eddie

A YouTube Shorts channel of true fun-fact stories, told with flat cut-out characters inside 3D sets. This repo holds the **AI studio team** that runs the channel and the **3D render pipeline** that makes the videos.

## The studio team

A manager in charge of 12 specialists, like a professional YouTube team.

| Agent | Job |
|---|---|
| **youtube-manager** | Runs the team: delegates every step, checks the work, tracks your posting dates, reports to you |
| trend-scout | Topic ideas, trend and competitor research, idea backlog |
| fact-checker | Verifies every claim, with sources |
| scriptwriter | Narration in the channel format, plus the beats file |
| art-director | Sets, costumes, storyboard, preview stills |
| animator | Builds and renders the 3D video |
| sound-designer | Voice, sound effects, music, mix (−14 LUFS) |
| packaging-lead | Title, thumbnail, description, pinned comment |
| qa-reviewer | Final quality, facts, kid-safety and copyright gate |
| publisher | Upload package for the date you choose |
| analytics-analyst | 48 h and 7-day reviews, weekly report |
| community-manager | Comment triage and drafted replies |
| social-repurposer | TikTok and Instagram Reels versions |

**You stay in charge.** You set every posting date. Nothing is uploaded, scheduled, posted, replied to, or paid for without your explicit yes.

### Use it in Claude Code
Open this folder in Claude Code. The manager starts automatically (set in `.claude/settings.json`) and gives you a stand-up. You can also start it directly with `claude --agent youtube-manager`.
The agents live in `.claude/agents/`, and the shared studio files in `studio/` (`STUDIO.md` is the rulebook; `PIPELINE.md`, `SCHEDULE.md` and `IDEAS.md` track the work).

### Knowledge base (Obsidian)
The `vault/Stick With Eddie/` folder is an Obsidian knowledge base: `Stick With Eddie.base` gives table and card views of every video, character, set, prop, team member, guide, idea and log note. Copy the folder into your Obsidian vault. Bases needs Obsidian 1.9 or later.

### Use it in any other chat
- **One file:** upload or paste [`YOUTUBE-STUDIO-TEAM.md`](YOUTUBE-STUDIO-TEAM.md) into a Claude chat or Project (add `CHANNEL-BIBLE.md` too). Claude runs as the manager and switches into each specialist role.
- **As a skill:** upload [`dist/youtube-studio.zip`](dist/youtube-studio.zip) in claude.ai → Settings → Capabilities → Skills.
- After editing any agent, run `python3 studio/build-portable.py` to rebuild both.

---

## 3D Shorts pipeline

Flat cut-out characters inside real 3D sets (Three.js), rendered frame by frame in headless Chromium.

```
node render-episode.mjs content/s01-clever-hans.beats.mjs projects/s01 --aspect 9:16 --3d [--workers 4]
node render-episode.mjs content/s01-clever-hans.beats.mjs projects/s01 --3d --preview 1.5,10,30   # stills only
node render-episode.mjs ... --preview all                                                       # one still per second
```

| File | What it does |
|---|---|
| `content/sNN-*.beats.mjs` | The Short: cast + costumes, then one entry per narrated beat (shots, camera moves, transitions, acting, taps, sound cues). Times can be seconds or `"w:word"` (when that word is spoken). |
| `src/draw.js` | Character rig: pill bodies, flat white heads, costumes (hats, beards, monocles, coats, waistcoats), props, expressions. Hans the horse (side view + three-quarter portrait + eye close-up). |
| `src/world.js`, `src/textures.js` | Set library. Built so far: **Berlin courtyard ~1904**: cobbles, brick walls, stable doors, gas lamps, chalkboard, calendar, rope line, experts' table, folding screen, spotlight. |
| `src/stage.js` | Renderer: poses + automatic acting, walking, gaze, lighting presets (warm / cool / spot), camera shots, transitions (whip, zoom, push, wipe, pull, match), HUD close-ups, captions, tap counters, stamp, newspaper. |
| `src/timeline.js` | Narration timing → beat starts, word times, captions, tap times, sound cues. |
| `src/tts.py` | Narration (local Kokoro voice; drop-in `*.mark.wav` files override it). |
| `src/mix.py` | Sound: clop per tap, whooshes per transition, crowd reactions, march, stamp, drone, plucked music bed ducked under the voice, room tone. |

Needs: Node 22, `npm i`, Playwright's Chromium, ffmpeg, Python with `numpy scipy soundfile kokoro-onnx`, and the Kokoro model files in `models/` (from the kokoro-onnx GitHub releases).
