---
type: "video"
category: "Videos"
id: "s01-clever-hans"
status: "Rendered – awaiting QA + owner date"
format: "Short"
story_year: 1904
setting: "Berlin courtyard"
length_s: 63.7
loudness_lufs: -14.1
resolution: "1080x1920 @30fps"
narrator: "Kokoro am_michael (local)"
posted: false
post_date: ""
characters:
  - "[[Eddie]]"
  - "[[Hans the Horse]]"
  - "[[Oskar Pfungst]]"
  - "[[The 13 Experts]]"
  - "[[Crowd Extras]]"
  - "[[Log Cameo]]"
sets:
  - "[[Berlin Courtyard 1904]]"
  - "[[Stable Interior]]"
  - "[[Window Room]]"
render_minutes: 45
review_rounds: 6
file: "deliver/s01-clever-hans.mp4"
beats_file: "content/s01-clever-hans.beats.mjs"
tags:
  - "stick-with-eddie"
---
# S01 · The Horse That Could Do Math

The first Short in the new format: the true story of **Clever Hans**, the Berlin horse who "did maths" around 1904 but was really reading people's faces.

## Story (16 beats, about 170 words)
1. Hook: *He asked his horse what three plus two was.* → 2. Five hoof taps → 3. "You see…" Berlin, 1900s, a maths teacher swore his horse could count → 4. add, subtract, tell the date → 5. crowds, never charged a penny → 6. the New York Times wrote about him → 7. scientists laugh: *"A horse? Doing maths?"* → 8. 13 experts march in → 9. they watch the teacher's hands: nothing → 10. they ask the questions themselves, and Hans is still right → 11. verdict: NO TRICK → 12. a student, Oskar, tries one more thing → 13. he hides the person asking behind a screen → 14. Hans gets almost everything wrong → 15. faces relaxed as the taps reached the right number → 16. **Payoff:** *Hans wasn't reading numbers. He was reading faces.* (The last frame loops into the first.)

## Facts and sources
- Wilhelm von Osten, maths teacher; no admission fee; NYT article 4 Sept 1904; 13-person commission, Sept 1904, found no trick.
- Oskar Pfungst, 1907: 89% right when Hans could see the questioner, 6% when he couldn't.
- Sources: Oskar Pfungst, *Clever Hans (The Horse of Mr. von Osten)*, 1911 English edition (Project Gutenberg #33936) · Encyclopaedia Britannica, "Clever Hans".

## What it took to make
- **Built from scratch in one session:** character rig (`src/draw.js`), set library (`src/world.js`, `src/textures.js`), 3D renderer (`src/stage.js`), timing (`src/timeline.js`), narration (`src/tts.py`), sound mix (`src/mix.py`), render script (`render-episode.mjs`). See [[Render Pipeline]].
- **New assets:** [[Hans the Horse]] (side view, three-quarter close-up, eye close-up), [[Eddie]] as von Osten, [[The 13 Experts]], [[Oskar Pfungst]], 16 [[Crowd Extras]], the [[Berlin Courtyard 1904]] set with 20+ props, and a [[Log Cameo]].
- **Voice:** ElevenLabs "Mark" was tried, but the audio host was blocked in the cloud session, so it uses the local Kokoro voice (`am_michael`, with `bm_lewis` for the expert's line).
- **Six owner review rounds** (stills before video): see [[Owner Feedback Log]].
- **Renders:** about 1.4 s per frame, 1,912 frames, 3 workers, about 45 min. Resumable 2-second pieces were added after a crash and a container restart.
- **Final:** 63.7 s, 1080×1920, 30 fps, −14.1 LUFS, peak −0.7 dBFS; 21 hoof taps = 21 clops.

## Packaging
- Title: **The Horse That Could Do Math**
- Description: *The horse that fooled 13 experts.* plus sources (see `content/s01-package.md`).

## Status
Rendered. Waiting for the `qa-reviewer` pass and **a posting date from the owner**.
