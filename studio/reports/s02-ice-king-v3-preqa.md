# s02-ice-king v3: pre-render QA re-check (previews)

Project: s02-ice-king, "The Man Who Shipped Ice to the Tropics", v3 beats (`content/s02-ice-king.beats.mjs` at `f53821d`)
Checked: 2026-11-24, by the qa-reviewer. No code changed. There is no full render yet, so this checks preview stills and the sound designer's preview mix.

Method:
- Stills: the animator's sweep `projects/v3-sweep/` (391 stills: every 0.5 s plus −3/−1/0/+1/+3 frames at all 36 transitions) and `projects/v3-board/`. They were rendered at `edf2bee`. The only later picture change is the cameo move (`2451760`), so I rendered that myself, along with frames that could not be sampled: `node render-episode.mjs content/s02-ice-king.beats.mjs projects/v3-qa --aspect 9:16 --3d --preview …` for every frame from 54.40 to 54.83 s and from 55.60 to 56.03 s (both pushfades), frames 791, 792 and 793, frame 0 and the last frame (2119, 70.633 s).
- I scanned every still for brightness (mean, share below 20/255, share above 245/255), checked the caption chunks and the `num` flags in `events.json`, and compared the word times with the shots and SFX.
- Audio: `deliver/s02-music-preview-v3.mp3`, regenerated at 01:36 at the final 70.64 s timing (after `f53821d`). I measured it with `ebur128` (true peak), ran 20–50 ms RMS windows at the asked spots, and ran a 2nd-difference transient scan normalised to the local level.
- Not possible: listening, and transcription (no STT tool here).

Timing: **70.64 s** (2120 frames at 30 fps), with 99 caption chunks. The owner allows up to about 70 s (v3 brief item 19).

**Verdict: NOT READY.** One small must-fix is left. Water drops fall out of thin air beside the merchant at 32.25–33.69 s. This is the owner's "nothing floating" rule. All 11 v3 must-fix items and all 10 should-fix items are resolved. Audio passes. After that one fix, re-preview 32.2–33.7 s only, and the full render can go.

---

## v2 must-fix and v3 fix list (with new v3 times)

| # | Item | Result | Evidence (v3 preview times) |
|---|---|---|---|
| M1 | Ship loading: rope pulley → hook → load, no hanging block | ✅ | 4.37–5.98 s: the block rises on a sling and hook at the cargo boom tip (5.00 s), and a rope runs up from the hook (5.50 s). No load hangs unsupported (5.88 s). The hook at 5.00 s hangs right at the boom end with only a short reach, which is acceptable. |
| M2 | Saw: two hands on the crossbar, head not cut | ✅ | 0.90–3.40 s (2.5 s): both arms end on the crossbar handles (zoomed 1.50 and 3.00 s), and the worker's head and hat are in frame. |
| M3 | Hero ice is a real 3D block; Eddie in the shot; the merchant's block drips with a puddle | ✅ | 16.24–17.52 s: Eddie holds a translucent cube with edges, a crack line and a glint. 27.87–29.95 s: the merchant holds a 3D block, drips fall, and a puddle sits at his feet (29.50 s). |
| M4 | Merchant close-up: face whole, tail to speaker, `mq2` re-dressed | ✅ | 29.95–32.25 s: face whole and centred; the bubble tail ends on his face; the figure behind wears a yellow plaid cap. The bubble text is right, with an ellipsis. |
| M5 | Hot-port cup with no beads and no wet ring (fact-check V12) | ✅ | 13.09–16.24 s: plain pewter cup with rim, banding and handle; no beads and no ring. The 1806 kitchen jug keeps its beads (9.5–12 s). |
| M6 | Bins: full 1·2·3 slates, three angles, blocks packed in; melt shot complete | ✅ | 39.10 "1 · HAY", 40.35 "2 · STRAW", 41.39 "3 · RICE HUSKS": numbers whole and green, a different angle each time, material heaped around the block sides. Melt 42.40–44.72 s: all three blocks shrink, Eddie is whole with sweat drops, the puddles grow. The front block is about ¾ in frame at the lower right, which is fine. |
| M7 | Hold proof: pile in sawdust, shaft, glints, two Calcutta faces | ✅ | 55.70–58.82 s: a centre pile of blocks with sawdust mounds, the lantern and the shaft, sparkle glints (57.00 s), and two Calcutta men smiling down through the hatch. The side walls still show blue glass-like blocks, but the centre pile reads as ice. Puddles are not clearly visible in the sampled frames (minor). |
| M8 | No black in the push into the hold | ✅ | Pushfade at 54.50 s and 55.70 s, every frame rendered: the darkest frame has a mean of 68.3/255 (55.83 s), and none falls below 35. Across the whole sweep the lowest mean is 41.2 (37.54 s, whip). "The hatch" now sits over the dissolve into the pile, not over black. |
| M9 | Ice King hat clear of `k4`, sparkle over Eddie's head | ✅ | 58.82–61.34 s: the hat is raised beside his head against the sky, with no one behind it; the sparkle sits just above his head (60.00 s). |
| M10 | Sawdust pour starts at the blade or a chute | ✅ | 62.38–64.30 s (1.9 s): the stream starts at a short wooden chute on the face of the log carriage, under the blade. The chute is small but reads as fixed to the mill. |
| M11 | Heat arrows visible, slowing and fading in the sawdust | ✅ | 66.37–70.64 s: three orange arrows enter from the hot side, shrink inside the sawdust wall and never reach the ice (67.50 s); they are gone by 69.00 s. |
| S12 | Hook: splash, Eddie whole | ✅ | 0.00–0.50 s: splash burst as the block surfaces; Eddie (top hat, right) is whole. |
| S13 | Slide clear of the post | ✅ | 3.40–4.37 s: the slide on the ice reads; no post covers it. |
| S14 | Route card labels separate | ✅ | 6.69–8.89 s: "CARIBBEAN SEA" and "MARTINIQUE" are apart. |
| S15 | Kitchen: cook's face whole | ✅ | 9.5–11.68 s. |
| S16 | Letter: head whole, card ≥ 1.5 s | ✅ | 33.69–34.15 s: Eddie whole, holding the letter. Card 34.15–35.67 s = 1.52 s. |
| S17 | Sea: lit hull, planks, ochre band, bow wave | ✅ | 50.32–52.88 s: ochre band and planking, white bow spray (51.00 s). The *Tuscany* departure (48.29–50.32 s) still has a hull that is 57% near-black, though the mean (43–47) is above the dark-frame floor (minor). |
| S18 | Real shovel | ✅ | 64.30–66.37 s: long handles, steel blades in the heap, both faces visible. |
| S19 | Short shots ≥ 2 s; payoff ≈ 9–10 s | ✅ | Crowd 19.94–21.93 (2.0 s), *Tuscany* 48.29–50.32 (2.0 s), pour 1.9 s, shovel 2.1 s. "His secret?" cut (61.34 s) to end = **9.30 s**. |
| S20 | Calcutta establishing shot | ✅ | 54.50–55.70 s: colonnaded Custom House front, ghat steps, moored boat. |
| S21 | Gull on the newspaper; slow card pushes | ✅ (stills) | 24.00 s: a gull sits on the BOSTON NEWS card. The pushes can't be proven from stills. |
| 22 | Click at 25.13 s | ✅ | See Audio. |
| 23 | New shanty bed: gap, LUFS, peak, end fade, no clicks | ✅ | See Audio. |

## Full checklist

### Video
| | Item | Result |
|---|---|---|
| ✅ | 1080 × 1920, 30 fps | Every still is 1080 × 1920; timeline 70.639 s |
| ✅ | Length | 70.64 s: over the bible's 55–65 s, but the owner OK'd up to about 70 s for clarity (v3 brief #19) |
| ❌ | Nothing floating | **32.25–33.69 s (beat 9, "It melted away, and…")**: single water drops keep falling in mid-air at the left of frame, beside the merchant's shoulder (x ≈ 40–130, y ≈ 600–1000, at 32.28, 32.35, 32.50, 33.00 and 33.50 s). Nothing is above them: the block is on the ground by then. Likely cause: the beat 8 drip emitter (`fx: drip`, pos `[8.32, 0.92, -2.08]`, the old hand height) keeps running into beat 9, which has no drip of its own. Everything else is attached: ropes, hats, saw, chute, letter, shovels. |
| ✅ | Counts on screen = clops = words | Hay / straw / rice: slate numbers 1·2·3 on screen, ticks at 39.43 / 40.47 / 41.51 s, on "hay." 39.43, "straw." 40.47, "rice" 41.51 |
| ✅ | No dark frames | No still has a mean below 35/255 (lowest 41.2 at 37.54 s, inside a whip blur); the pushfades are checked frame by frame (above) |
| ✅ | Key actions held ≥ 2.5 s | Saw 2.5 s, hold proof 3.1 s, payoff 9.3 s |
| ✅ | Captions | All 99 chunks have 1–2 words. "1806", "1833" and "15,000" are `num` and render green. Spelling checked against the narration: Caribbean, Frederic Tudor, Martinique, Calcutta, sawmills. No captions run under the merchant's bubble. Captions sit in the lower middle, with no face covered in sampled frames. Some chunks flash for under 0.2 s (e.g. 1.33, 6.05, 27.98, 59.40 s), as in v1/v2: not blocking. |
| ✅ | Cameo exactly one frame (792) | Rendered 791/792/793: the log appears behind the glazing bars of the lit upper window **only in frame 792** (26.40 s); 791 and 793 show the empty window |
| ✅ | Loop | Frame 2119 (cutaway pile, night blue) → frame 0 (pond block, night blue): the front block sits in the same place at the same size (left edge ≈ x 227); it reads as a match cut |
| ✅ | Eddie only in Boston / the pond | Not in Martinique, at sea or in Calcutta in any sampled frame |

### Audio (`deliver/s02-music-preview-v3.mp3`, 01:36, final timing)
| | Item | Result |
|---|---|---|
| ✅ | −14 LUFS ±1 | **−14.0 LUFS** integrated, LRA 2.7 LU |
| ✅ | True peak ≤ −1 dBTP | **−1.6 dBTP** |
| ✅ | Click near 25.06 s | The 20 ms RMS falls smoothly from −15.7 (24.98) to −23.2 dBFS (25.14) and then rises on the next sound; no sample-step spike in 24.8–25.4 s. The strongest transients in the whole file are the scheduled `iceCrack` SFX at 0.02, 0.93 and 3.15 s (in `events.json`), not clicks. |
| ✅ | No gap before "His secret?" | 61.34–61.53 s sits at −15 to −19 dBFS (50 ms windows); "His" at 61.53 s. The quietest 50 ms before the end fade is −33.9 dBFS at 34.8–35.05 s (the timed pause after "money."), which is not dead air. |
| ✅ | 54.50 s whoosh | No transient spike at the pushfade cut |
| ✅ | End fade / loop seam | −22 (69.5) → −33 (70.0) → −45 (70.5) → −57 dBFS (70.60), then digital silence from 70.64 s. The mp3 is 70.97 s long because of trailing encoder silence; the renderer's own mux decides the final length. |
| ⚠️ | Music not 8-bit; every word clear | Acoustic shanty instruments by design (`1035ce5`); I can't listen here. A person should listen once before publishing (also for the cheers). |

### Facts
| | Item | Result |
|---|---|---|
| ✅ | Narration unchanged | `git diff b8e08fc HEAD`: v3 only adds `breaks` (timed pauses) and `min`; every `line:` and the bubble text are identical to the approved script |
| ✅ | Fact-check V12 | Cup dry (see M5); the kitchen jug keeps its beads |
| ✅ | Shot fact rules | "about 15,000", thermometer with no numbers, "(now Kolkata)", route round Africa, "most of the ice" shows a pile, invented signs only |
| ✅ | Sources in the description | Unchanged since v2 (8 sources) |

### Brand / safety / rights
| | Item | Result |
|---|---|---|
| ✅ | Ends cold, no CTA | "out." 68.46 s, then the settle on the pile; nothing after |
| ✅ | Kid-safe, respectful | Tools in adult hands; Martinique and Calcutta people calm, in period dress, smiling |
| ✅ | Own work, no real logos | Invented "BOSTON NEWS", "TUSCANY / BOSTON"; the cameo is our drawing |

### Package
| | Item | Result |
|---|---|---|
| ⚠️ | Title, description, pinned comment | Ready, but `content/s02-ice-king-package.md` "File" line still says "v1 … QA FAIL → v2 re-render". Update it after the v3 render. vidIQ scoring is still unrun (25 credits, needs the owner's yes). |

---

## MUST FIX before the full render
1. **Beat 9, 32.25–33.69 s, floating drops:** stop the beat 8 drip emitter at the end of beat 8 (`until` / beat-local), or move it down onto the block now on the ground, so no drop falls from empty air beside the merchant.

## Should fix (not blocking)
- 55.70–58.82 s: a puddle or two in frame by the pile (the brief asked for "a few puddles"); the side walls still look a bit like blue glass.
- 48.29–50.32 s: the *Tuscany* hull is mostly near-black (57% of the frame below 20/255); a touch more fill light like the sea shot.

## READY / NOT READY
**NOT READY**, with one small fix. After the drip fix, re-preview 32.2–33.7 s (about 5 stills). No other re-check is needed, the audio does not change, and then the full render can go.

## Hand-off note (qa-reviewer → youtube-manager)
**Done: NOT READY, with one small item left.** Report: `studio/reports/s02-ice-king-v3-preqa.md`. My extra stills (pushfade frames, cameo 791–793, loop pair) are in `projects/v3-qa/`. All 11 v3 must-fix items, all 10 should-fix items, and the v2 click are resolved. Audio preview at the final timing: −14.0 LUFS, −1.6 dBTP, no click at 25.06 s, no gap before "His secret?", clean end fade. Cameo is in frame 792 only, the loop matches, captions and green numbers are fine, and the facts are unchanged. **Open:** floating drips at 32.25–33.69 s (beat 8 emitter leaking into beat 9); the package "File" line needs updating after the render; a human listen; vidIQ (25 credits, owner's call). No code changed, no paid credits, nothing published, no dates touched.

---

## v3.1 re-check (2026-11-24, at `d6af7dc`)
Stills rendered with `node render-episode.mjs content/s02-ice-king.beats.mjs projects/v3-qa2 --aspect 9:16 --3d --preview …` (32 frames, in `projects/v3-qa2/`). Timing is unchanged at **70.64 s**; the sound designer's mix still matches it.

| | Item | Result |
|---|---|---|
| ✅ | Floating drips, 32.25–33.69 s | Rendered at 32.28, 32.35, 32.50, 32.75, 33.00, 33.25, 33.50 and 33.66 s: no drops in the air. The block shrinks on the ground in its puddle, and nothing else moves near the merchant. **Fixed.** |
| ✅ | *Tuscany* hull, 48.29–50.32 s | The stern now shows lit brown planking, the "TUSCANY / BOSTON" board and the windows (49.00, 50.00 s). Only the bow shadow side at 48.32–48.50 s stays dark (35% below 20/255, mean 94–98), which reads as shade, not black. Near-white is under 7.5% at 49–50 s. |
| ✅ | Brightness of the reworked shots | Saw 1.0–3.37 s: mean 114–118. Cup 14.5 s: 102. Merchant 28.0–31.5 s: 123–149. Melt 32.3–33.7 s: 99–120. *Tuscany* 48.3–50.3 s: 94–192. Sea 51.0 s: 132. Hold with puddles 56.5–58.5 s: 94–97. Shovelling 64.4–66.2 s: 77–78. **No frame is below 35/255.** |
| ✅ | Side changes looked at | Saw: the hat is kept and both hands are on the crossbar (2.00, 3.37 s). The merchant holds the block against his chest, with drips and a puddle (29.00, 31.50 s). Shovelling: both workers are whole, and the right one tosses sawdust off a raised blade (65.0, 66.2 s). Hold: the pile and the hatch faces are unchanged (57.5 s). |

**Verdict v3.1: READY** for the full render once the owner OKs the board. Still open from above, none of it blocking: update the package "File" line after the render, a human listen once, and vidIQ scoring (25 credits, the owner's call).
