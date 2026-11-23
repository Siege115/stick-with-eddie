# s02-ice-king: QA report

Project: s02-ice-king, "The Man Who Shipped Ice to the Tropics"
File checked: `deliver/s02-ice-king.mp4` (plus `deliver/s02-contact-sheet.jpg`, `projects/s02-ice-king/events.json`, `src/mix.py`, `content/s02-ice-king.beats.mjs`)
Checked: 2026-11-23, by the qa-reviewer. The video was not modified.
Method: ffprobe; EBU R128 and true-peak measurement (ffmpeg `ebur128` and `loudnorm`); a frame every 0.5 s (127 frames) plus full-resolution frames at every transition and problem spot; a per-frame scan of all 1904 frames for near-black, washed-out and frozen stretches; a high-frequency transient scan of the audio for clicks; caption timings read from `events.json`.
Not checked: **I could not transcribe the audio.** No speech-to-text tool is installed, and the Whisper model download was blocked by the network proxy (Hugging Face and openaipublic hosts refused). I also cannot listen. Word clarity, the merchant's accent and the crowd lines are **not verified by ear** (see Audio).

Verdict: **FAIL.** Six fixes are needed (list at the end). Specs, loudness, facts, package and safety all pass.

---

## Video

| | Item | Result |
|---|---|---|
| ✅ | 1080 × 1920, 9:16 | 1080 × 1920, H.264, yuv420p |
| ✅ | 30 fps | 30/1, constant; 1904 frames |
| ✅ | 55–65 s | 63.47 s |
| ✅ | No frozen poses over 2 s | The frame scan found no stretch of 20 or more near-identical frames. The newspaper card (18.34–22.01 s) holds 3.7 s, but with a slow push. |
| ❌ | No floating props | **3.75–5.60 s:** in the wave-off shot, Eddie's top hat floats beside his head, and its brim cuts through the head outline. His raised hand is empty and the other arm hangs down, so nobody holds the hat. **38.55–40.87 s:** a flat, semi-transparent grey square (about 100 px) floats in the air above the bins and Eddie, drifting from frame to frame. It looks like a mote sprite without its texture. |
| ✅ | No clipping (people) | I saw no person passing through walls, rails, barrels or the gangplank. |
| ❌ | Every shot readable | **35.17–35.57 s (13 frames):** near-black (97% of the frame below 8% brightness). The push through the "ICE HOUSE" door enters an unlit void, and the caption "in hay" appears over black at 35.31 s. **35.57–38.55 s:** the hay, straw and rice-husks shots show only the slate signs. No ice block and no packing material can be seen; the hay shot's lower 35–40% is an unlit dark mound. **38.55–40.87 s** ("Too much of it still melted"): the wide shot shows puddles and one hay pad, but **no ice blocks at all**. The fact-check shot note asks for blocks that shrink a lot but don't vanish. **52.33–54.97 s (80 frames)** ("The hatch opens, and most of the ice is still there"): the hatch opening is a flat, featureless pale-grey/white area covering 35–50% of the frame (luma about 220–235: washed out, not hard-clipped). **No ice is in frame**; the camera looks up at the sky. The one shot that proves "most of the ice" doesn't show it. |
| ✅ | Brief dip at 3.13–3.27 s | 5 near-black frames in the push into the hold. Reads as the transition; acceptable. |
| ✅ | Counts on screen = clops = words said | Three slate signs "1 · HAY", "2 · STRAW", "3 · RICE HUSKS" (numbers in green); three tick SFX at 35.58, 36.62 and 37.66 s; three materials said. |
| ✅ | Numbers in green, "about 15,000" | "1806" (card and caption), "1833" and "15,000" are green. The caption reads "About 15,000", then "miles" (46.63–48.12 s). The thermometer has tick marks only, no numbers. |
| ❌ | Captions cover no face | **28.08–28.58 s:** "what do I do" runs over the right edge of the merchant's face in the close-up, next to his mouth. **27.04–27.50 s:** "Lovely" touches the same face edge. All other captions sit below faces or on bodies. |
| ❌ | Merchant line shown as a speech bubble only | Fact-check (beat 8): "show it as a speech bubble from the merchant, never … as a caption block". The bubble is correct (27.0–29.0 s), but the same line also runs as word captions underneath ("Lovely", "And..", "what do I do", "with it?"). The caption "And.." has two dots; the bubble correctly has "And…". |
| ⚠️ | Captions 1–2 words (Standing Rules) | 16 of the 86 chunks have 3 words and one has 4 ("what do I do", 28.08 s). They are all readable and small, white with an outline, in the lower middle. Minor, but against the rule. |
| ✅ | Loop | The last frame (63.43 s) and frame 0 put the front ice block at the same size and position (left edge about x 200, top edge about y 1150 in both) in the same cool blue, so the seam reads as a match cut on the block. Small differences: the last frame has a second block stacked on top and tan packing (looks more like hay than sawdust), and the first frame is the wide pond shot with workers. Acceptable. |
| ✅ | Log cameo | Exactly **one frame, 702 (23.40 s)**, in the upper window of the centre Saint-Pierre house, seen through the glazing bars (behind glass, inside a lit room). Frames 701 and 703 show the empty lit room. Our own drawing. |
| ✅ | Eddie never outside Boston | Eddie appears only at the pond and on the Boston wharf (1806 and 1833), in the ice house and in the street. He is not in Martinique (21.9–30.7 s), at sea or in Calcutta (50.65–54.97 s). The hat droop and letter are in Boston (31.0 s); the letter has a drawing and no words. |
| ✅ | Sneakers | Visible at 1.5 s, 31.0 s and 38.5 s. |

Minor (not blocking): the "BOSTON" label is clipped by the map's left border (40.9–45.1 s); "slippery speculation" on the newspaper is very small for a phone; the gull never lands on the paper; the sawdust stream at the sawmill (57.84–60.63 s) starts in mid-air with no blade in view; no faint heat arrow reaches the ice in the cutaway (arrows stop at the sawdust, which still doesn't contradict the fact-check, since they never bounce); the Calcutta riverfront set never appears: beat 14 opens on the ship's deck (50.65–51.85 s), so only the map and narration say where we are.

## Audio

| | Item | Result |
|---|---|---|
| ✅ | −14 LUFS ±1 | −14.15 LUFS integrated, LRA 2.1 LU |
| ✅ | True peak ≤ −1 dBTP | −1.04 dBTP (just inside the limit) |
| ✅ | No clicks or distortion | The transient scan (8 kHz high-pass, 1 ms vs 50 ms energy) found no click candidates. No sample-level clipping (peak −1.5 dBFS sample). |
| ⚠️ | End of file / loop seam | The audio stops hard at 63.42 s at about −17 dBFS RMS: the final "ding" (62.87 s) and the bed are cut mid-ring, and 0.3 s of `mix.wav` (63.77 s long) is not in the file. The first samples start from zero, so I found no click, but the wrap will be an abrupt sound cut. A fade of 2–3 frames into the last frame is recommended (Standing Rules: "notes fade out"). |
| ✅ | Music not 8-bit | From the code (`src/mix.py`, `mix: { music: 'acoustic' }`): pizzicato, piano and bass built from sine partials with attack/release fades; no square waves. I could not listen to it. |
| ⚠️ | Every word clear | **Not verified** (no transcription available, see top). The narrator is Kokoro `am_michael` at 1.16× (`narratorBrisk`); the pipeline has no transcription check (`tts.py` only sums durations). An owner or manager listen is needed. |
| ❌ (by code, not ear) | Crowd cheer | The cheer at **55.29 s**, under "They called him the Ice King" (55.08–56.44 s), uses `crowd_cheer()`, whose lines include **"Wunderbar!"**, left over from S01's Berlin story. A German shout from an 1833 Boston crowd, on top of the payoff line. |
| ⚠️ | Merchant voice neutral, no accent | Configured as Kokoro `am_adam`, en-us ("neutral, polite, no accent"). Not heard. |

## Facts

| | Item | Result |
|---|---|---|
| ✅ | Fact-checker APPROVED | The script check gives APPROVED once its 7 fixes are applied word for word; the script records them as applied. The on-screen captions match the approved narration word for word ("Then he sent it…", "He tried straw. He tried rice husks.", "most of the ice is still there"). |
| ✅ | No tonnage anywhere | None in narration, captions, newspaper, map or props (frames and a code search). |
| ✅ | Shot-level fact fixes | Woodcut ship, no photo, on the paper; only "slippery speculation" readable; generic masthead with year only; route around Africa; "(now Kolkata)" on the map (small); "about 15,000"; thermometer without numbers; heat arrows stop in the sawdust, none bounce; a few puddles in the hold. |
| ❌ | Picture supports the claim | 52.33–54.97 s: "most of the ice is still there" is said over a washed-out hatch with no ice in view (see Video). Not a false claim, but the picture doesn't show it. |
| ✅ | Sources in the description | The fact-checker's 8 sources, verbatim. |

## Brand (CHANNEL-BIBLE.md, Standing Rules)

| | Item | Result |
|---|---|---|
| ✅ | Shape | Hook by "he" at 0 s → "You see" (6.17 s) → Boston laughs → three tries → Calcutta → payoff in the last sentence |
| ✅ | Ends cold, no call to action | The last words "to keep the heat out" end at 63.07 s; nothing after; no subscribe or outro |
| ✅ | Look | Flat cut-outs in detailed 3D sets; English props; Eddie's egg head is Eddie-only |
| ✅ | Period | Top hats and round hats (no bowlers), oil lanterns, sash-saw mill, sail only |

## Safety and rights

| | Item | Result |
|---|---|---|
| ✅ | Kid-safe | Adults only on the pond, tools in adult hands, nobody falls in; nothing scary |
| ✅ | Respectful depiction | Martinique merchant and townspeople are calm and dignified, in period dress; Calcutta figures are calm and interested; the same flat faces for everyone; no plantations, chains or "exotic" props |
| ✅ | No copied scripts or art | Our own script and drawings; music and SFX synthesized locally or from the CC0 kit |
| ✅ | No real logos | "BOSTON NEWS" and the stern boards are invented |

## Package (`content/s02-ice-king-package.md`)

| | Item | Result |
|---|---|---|
| ✅ | Title | "The Man Who Shipped Ice to the Tropics" (owner's choice; 8 words, noted) |
| ✅ | Description | True and kid-safe; "sent", not "sailed"; no tonnage; sawdust hinted, not spoiled; sources included |
| ✅ | Pinned comment | Kid-safe question; prepared only |
| ⚠️ | Housekeeping | The "File" section still says the video is "not rendered yet". Update it to the delivered file. vidIQ scoring (25 credits) stays unrun pending the owner's yes. |

---

## Verdict: FAIL

### Exact fixes (re-render the affected beats, then re-check)
1. **Beat 14 hold, 52.33–54.97 s:** reframe so the ice blocks (with the few puddles) are in the shot, for example looking down through the open hatch or a low angle along the stacked blocks under the light shaft. Replace the flat white hatch sky with a lit, textured sky or haze colour, so that under 10% of the frame is near-white.
2. **Beat 10 push, 35.17–35.57 s:** light or dress the space behind the "ICE HOUSE" door, or cut to the workshop at 35.17 s, so no frame is near-black and "in hay" never shows over black.
3. **Beats 10–11, 35.57–40.87 s:** show an ice block in each material (hay, straw, rice husks) in the three sign shots, lit enough to read. In the "Too much of it still melted" wide, show the three shrunken but **still present** blocks (fact-check shot note).
4. **Floating grey square, 38.55–40.87 s:** remove it or give the mote sprite its texture.
5. **Beat 2 wave, 3.75–5.60 s:** put the top hat in Eddie's raised hand (or back on his head) so it no longer floats or cuts through his head.
6. **Beat 8 merchant, 27.04–28.58 s:** turn off the word captions for the line2 merchant line (the speech bubble carries it, as the fact-check requires). That also clears the caption off his face and removes the "And.." typo.

### Recommended (not blocking)
- Drop "Wunderbar!" from the cheer for this episode (for example "Huzzah!"), or move the cheer off the narration line at 55.29 s. Confirm by ear.
- Add a 2–3 frame audio fade into the last frame so the loop seam isn't an abrupt cut, keeping the true peak ≤ −1 dBTP.
- Have someone listen to the full narration for swallowed words before publish prep: transcription wasn't possible here.
- Small cleanups: keep caption chunks to 1–2 words; un-clip "BOSTON" on the map; update the package's "File" line.

## Hand-off note (qa-reviewer → youtube-manager)
**Done: FAIL.** Report: `studio/reports/s02-ice-king-qa.md`. Specs, loudness (−14.15 LUFS, −1.04 dBTP), facts, cameo (one frame at 23.40 s, behind glass), loop, safety and package pass. Six visual fixes are needed in beats 2, 8, 10, 11 and 14 (above). Open: word clarity not verified (no transcription tool; model downloads blocked), and the "Wunderbar!" cheer is found from the code only. No paid credits used; nothing published; no dates touched.
