---
type: "guide"
category: "Production"
tags:
  - "stick-with-eddie"
---
# Render Pipeline

How a Short is made in code (repo `src/`):
- **draw.js:** the 2D cut-out rig (people, costumes, hats, Hans, close-ups), drawn onto canvas textures.
- **world.js / textures.js:** the 3D set library and painted textures (bricks, cobbles, wood, posters, documents).
- **stage.js:** renders any moment t: poses and automatic acting, walking, gaze, lights, camera shots, transitions, close-ups, captions, counters, stamps.
- **timeline.js:** narration timing → beats, word times, captions, taps, sound cues. Times can be written as `"w:word"`.
- **tts.py:** narration (Kokoro; `*.mark.wav` files override it).
- **mix.py:** clops, whooshes, crowd voices, music bed, ducking, room tone.
- **render-episode.mjs:** runs everything, renders frames in headless Chromium (Three.js on SwiftShader), and encodes resumable 2-second pieces → mp4 → two-pass loudness.
