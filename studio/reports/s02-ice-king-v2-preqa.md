# s02-ice-king v2: pre-render QA (previews)

Project: s02-ice-king, "The Man Who Shipped Ice to the Tropics", v2 beats (`content/s02-ice-king.beats.mjs` at `b8e08fc`)
Checked: 2026-11-23, by the qa-reviewer. No code changed. No full render exists, so this checks preview stills and a test mix.
Method:
- `node render-episode.mjs content/s02-ice-king.beats.mjs projects/review-qa --3d --preview <times>` (stills in `projects/review-qa/`, `p2/`, `p3/`). That is 263 frames: every 0.5 s, the last frame of the old shot, the first frame of the new shot and +3 frames at all 36 transitions, frames 793/794/795, frame 0 and the last frame (2046), and every frame at 53.33–54.03 s and 54.60–55.17 s.
- Brightness scan of every still for near-black and near-white areas.
- Audio: `python3 src/mix.py <timeline> <events> projects/review-qa/mix.wav content/s02-ice-king.beats.mjs` (the same arguments `render-episode.mjs` passes), then the same two-pass linear `loudnorm` the renderer applies. I measured it with `ebur128` and scanned it with a 1 ms vs 50 ms high-pass transient scan plus a sample-step (2nd difference) scan. Each stem was isolated through `runpy` to find where a click comes from.
- Not possible: listening, and transcription (no STT tool is installed). The cheer language is checked from the code and its cache file, not by ear. The music is being replaced (sea shanty / ocean bed), so it is judged only loosely.

Timing: **68.24 s** (2047 frames at 30 fps). Speech is 55.32 s. There are 98 caption chunks.

**Verdict: NOT READY** for the full render. 6 must-fix items (list at the end). Most of the 23 items are fixed. The blockers are mostly new problems that came with the v2 changes.

---

## The 23 v2 items

| # | Item | Result | Evidence (preview times) |
|---|---|---|---|
| 1 | Block slides **on** the ice | ✅ (⚠️ framing) | 3.40–3.90 s: the block slides across the ice sheet, not water. **3.90–4.37 s:** the camera passes a foreground post with a big outlined snow-mound disc that covers the centre of the frame and hides the end of the slide (see Should fix). |
| 2 | Saw cut held 2.5–3 s | ✅ | Saw shot 0.90–3.40 s (2.5 s): two-handed strokes, the blade sinks deeper (3.00 → 3.37 s). Chips are not visible in stills. |
| 3 | Visible block-and-tackle, sailors haul, every rope connected | ❌ | 4.37–4.95 s: the tackle and the tan rope are visible on deck. **5.00–5.13 s:** the block swings on a sling and hook with **no rope going up from the hook ring** (an invisible rope again). **5.27–5.90 s:** an ice block in a sling **hangs in mid-air** at the left of frame with no rope, beside a loose pulley block. The sailors are small at the edge of frame; hauling is not readable in stills. |
| 4 | ~3 s departure with a goal + route card | ✅ | Departure 5.16–5.93 s (0.8 s, sails filling, Eddie waves), then the route card 5.93–9.09 s (3.2 s): dotted line Boston → Martinique, ship moving along it. The departure itself is short. |
| 5 | Whole hat inside the card, in the raised hand | ✅ | 5.27–5.90 s: the hat is held by the brim in the raised hand, uncut, clear of the head. |
| 6 | Gulls fly their own paths | ✅ (stills) | Gulls sit in the sky at different spots across 4.50–5.50 s; none sits on Eddie's line. Motion paths can't be proven from stills. |
| 7 | Jug: handle attached, beads, drips | ✅ | 9.50–11.87 s: the handle joins the body; beads sit on the surface. The ring on the table is mostly below frame. |
| 8 | Detailed cup | ✅ | 13.40–16.43 s: pewter cup with rim, banding, handle, beads, shadow ring. |
| 9 | No dead air before "His secret?" | ✅ | 59.49–60.68 s: the mix stays at −16 to −22 dBFS RMS (100 ms windows), with the riser at 60.04 s. The quietest 50 ms in the whole file is −30.3 dBFS (56.95 s); nothing falls below −40. |
| 10 | Payoff given room (8–10 s), crate → mill → shovelling → slow cutaway with fading arrows | ❌ | Crate with a lid at 60.57–61.50 s ✅. Sawdust pours at 61.57–62.55 s (only ~1 s). Shovelling at 62.57–63.63 s (~1 s; the shovel blade hides the right worker's face). Cutaway 63.66–68.24 s, slow, settling on the block ✅. **No heat arrows are visible at any time** (63.77, 64.00, 64.50, 65.00, 65.50 s), although the beats file schedules them for 63.78–66.0 s. "His secret?" to the end = **7.56 s** (target about 8–10). |
| 11 | More detail on backgrounds | ✅ | Window boxes, smoke, signage ("ICE CUTTING / WORKERS ONLY"), market awnings, barrels and logs are in every set. |
| 12 | More 3D motion | ✅ (stills) | Snow, sails filling, chimney smoke (58–60 s), palms, sea, camera pushes with parallax. Not verified frame-to-frame. |
| 13 | Hook: narration almost immediate, frame 0 readable and moving | ✅ | "He" starts at 0.17 s. Frame 0: the block at the channel edge, worker with tongs, Eddie pointing; 0.50 s splash and glint, push-in low. |
| 14 | Hold proof shot (ice in sawdust, puddles, lit sky, shaft) | ✅ | 55.10–58.00 s: stacked blocks behind sawdust walls left and right, three puddles, light shaft, open hatch with a lit pale sky. Near-white is 0.5% of the frame (was 35–50%). The ladder covers part of the right stack. The sawdust reads grey-green, not tan. |
| 15 | No near-black push through the ice-house door | ✅ | 36.67–38.30 s: lit doorway, lantern, blocks; no dark frames. (New dips to black elsewhere: see Should fix.) |
| 16 | Block nested in hay / straw / rice husks; three shrunken blocks for "melted" | ✅ (⚠️) | 38.33–41.60 s: a block in each material, one per word. The block sits **on top** of a flat layer rather than packed in. Melt wide at 41.63–43.90 s: three blocks shrink but remain, with puddles; the third block is mostly cut off at the lower-left edge. |
| 17 | No floating grey square | ✅ | Not seen in 38.3–43.9 s. |
| 18 | No floating top hat in beat 2 | ✅ | See #5. (A new hat problem in beat 15 is listed under Brand / physical sense.) |
| 19 | Merchant line bubble only | ✅ | No captions 29.89–32.41 s. The bubble reads "Lovely. And… what do I do with it?" (30.03–32.3 s), with a correct ellipsis. |
| 20 | English-only cheers | ✅ (code) | `crowd_cheer()` takes the S02 branch when `timeline.mix` is set (it is): "Hooray!", "Bravo!", "Huzzah!", "Hurrah!" (cache `audio/crowd/cheerEn.wav`, built 12:11 today). "Wunderbar!" stays only in the S01 branch. Not heard. |
| 21 | 2–3 frame fade at the end | ✅ | The mix fades over the last 0.1 s (3 frames) to −64 dBFS at 68.233 s, with digital silence after 68.239 s. |
| 22 | Captions 1–2 words; numbers green | ✅ | All 98 chunks have 1–2 words. "1806", "1833" and "15,000" are flagged `num` and render green. |
| 23 | "BOSTON" label not clipped | ✅ | Map cards at 6.5 s and 44.5–48.1 s: BOSTON is fully inside the border. "(now Kolkata)" is shown, and the route goes round Africa. |

## Full checklist

### Video
| | Item | Result |
|---|---|---|
| ✅ | 1080 × 1920, 30 fps | `meta`, and every still is 1080 × 1920 |
| ✅ | Length | 68.24 s: above 55–65 but within the owner's "up to about 68 s" (Standing Rules; Decisions note in the beats file) |
| ❌ | No floating props / everything attached | **5.00–5.90 s** rope-less hook and hanging block (#3). **58.50–60.50 s** (beat 15): Eddie's lifted top hat sits exactly over the old man in a top hat (k4) behind him, so it reads as k4 wearing two stacked hats (58.50 s) or Eddie's hat on k4's head (60.00 s). It is held low beside the shoulder, not raised. |
| ❌ | Counts on screen = clops = words | Three tick SFX (`w:hay`, `w:straw`, `w:rice`) and three words are fine, but **the 1 / 2 / 3 numbers on the bin signs are cropped off the left edge**. 38.33–39.53 s shows "· HAY" with only a green sliver, 39.57–40.57 s "· STRAW", 40.60–41.60 s "RICE HUSKS". No count is on screen. |
| ❌ | Every shot readable / proof shots | **27.97–30.00 s** (beat 8, "nowhere to keep it cold"): the merchant's "dripping block" is a small pale rectangle with a "V" line that reads as an envelope or card, not ice. The puddle is not in frame, and the big sailor fills the right half. **63.78–66.0 s:** no heat arrows (#10). |
| ✅ | Captions readable, not over faces | Lower-middle, white with outline; on bodies or ground in all sampled frames |
| ✅ | Loop | Frame 0 (pond block, night blue) and frame 2046 (cutaway block, night blue): the front block has the same size and place (left edge ≈ x 200, top ≈ y 1150). The last frame adds a block on top and side blocks; it reads as a match cut. |
| ✅ | Log cameo exactly one frame, behind glass | Frame **794** (26.467 s) only: the log in the lit upper window of the centre Saint-Pierre house, behind the glazing bars. Frames 793 and 795 show the empty lit window. |
| ✅ | Eddie only in Boston; sneakers | Eddie is seen on the pond, the Boston wharf and street, and in the ice house; not in Martinique, at sea or in Calcutta |
| ⚠️ | Near-black frames | The "push" transitions dip through black: **53.60–53.73 s** (frames 1608–1612, 4 frames over 70% black; frame 1611 is 100% black) and **54.83–55.00 s** (frames 1645–1650, 6 frames; **"The hatch" caption over black**). Short, transition-like, the same class I let pass at 3.13 s in v1, but the Standing Rules ask for none in pushes. |

### Audio (test mix, renderer's loudnorm)
| | Item | Result |
|---|---|---|
| ✅ | −14 LUFS ±1 | **−14.1 LUFS** integrated, LRA 2.4 LU (input −21.11 → linear +7.1 dB) |
| ✅ | True peak ≤ −1 dBTP | **−1.4 dBTP**; sample peak in `mix.wav` −1.51 dBFS |
| ❌ | No clicks | **25.130 s:** a one-sample step (−0.052 → +0.020 in the mix, ≈ 0.16 after loudnorm), in both channels. Source: the sfx stem. The `zoom` transition whoosh (`whoosh(0.45, …, rev=True)` placed at 25.062 − 0.38 s) has a rising `(t/n)²` envelope and **ends at full level** at 25.132 s, with no release. It falls on the cut into Martinique. The other transient candidates are speech consonants, drips and ticks with continuous waveforms. |
| ✅ | No dead air before the reveal | See #9 |
| ✅ | End fade / loop seam | See #21 |
| ✅ (code) | English cheers | See #20 |
| ✅ (loosely) | Music not 8-bit | The current bed is the sine-partial acoustic set; it is being replaced by the sound designer, so this needs re-checking on the new bed |
| ⚠️ | Every word clear | Not verifiable here (no STT, can't listen). Beat 16 is now read at normal pace (`voice: 'narrator'`). A person should listen once before publishing. |

### Facts
| | Item | Result |
|---|---|---|
| ✅ | Fact-checker APPROVED | Narration unchanged from the approved script; captions match it word for word |
| ✅ | Shot fact rules | "about 15,000"; no tonnage seen; thermometer with no numbers; "(now Kolkata)"; route round Africa; woodcut ship on the 1806 paper; "most of the ice" shows blocks plus a few puddles |
| ❌ | Cutaway supports "packed thick around the ice to keep the heat out" | No heat arrows appear, so the "heat slows and fades in the sawdust" shot note is not shown. The ice sits on a shelf with small tan mounds; the sawdust is only in the hull wall at the left. |
| ✅ | Sources in the description | 8 sources, verbatim |

### Brand
| | Item | Result |
|---|---|---|
| ✅ | Shape, ends cold, no CTA | Last word "out" ends 66.45 s, then a 1.8 s settle on the block; nothing after |
| ✅ | Look and period | Flat cut-outs in detailed 3D sets; top hats, no bowlers; sail only; English props, French-era Martinique dressing |
| ❌ | Physical sense (Standing Rules, S02 lessons) | Rope-less hook (5.0–5.9 s) and the hat over k4 (58.5–60.5 s), as above |

### Safety and rights
| | Item | Result |
|---|---|---|
| ✅ | Kid-safe | Adults on the pond, away from the channel; tools in adult hands |
| ✅ | Respectful depiction | Martinique and Calcutta people calm, in period dress, same flat faces |
| ✅ | Own work, no real logos | "BOSTON NEWS", "TUSCANY / BOSTON" invented; cameo is our drawing |

### Package
| | Item | Result |
|---|---|---|
| ✅ | Title, description, pinned comment | Ready; the "File" line now says v1 failed QA and a v2 re-render is pending (update it after the v2 render) |
| ⚠️ | vidIQ title scoring | Still unrun (25 credits, needs the owner's yes) |

---

## MUST FIX before the full render
1. **Beat 2 rigging, 5.00–5.90 s:** connect a visible rope from the hook ring up to the tackle block at the yard arm while the ice swings in. Remove or hide the ice block that hangs rope-less at the left of frame at 5.27–5.90 s (or show it on its rope going down the hatch).
2. **Beat 10 count, 38.33–41.60 s:** reframe the three bin shots (or move the signs) so "1 ·", "2 ·" and "3 ·" are fully in frame, with the numbers green.
3. **Beat 16 cutaway, 63.78–66.0 s:** make the heat arrows visible. They should enter from the hot side, slow and fade inside the sawdust layer, and never reach the ice. Check the arrows' `from`/`to` against the new cutaway camera, which may have moved them out of shot.
4. **Beat 15 hat, 58.50–60.50 s:** move k4 (the old man in the top hat) away from Eddie's hat side, or raise the hat clearly above head height on Eddie's side, so the lifted hat never sits on or over another person's head.
5. **Click at 25.13 s:** give the reversed `zoom` whoosh a short release (5–10 ms) or end it just before the cut, so it doesn't stop at full level.
6. **Beat 8, 27.97–30.00 s:** make the merchant's block read as ice (larger, clearly blue, with visible thickness and drips) and get the growing puddle into frame. Today it reads as an envelope (proof-shot rule).

## Should fix (not blocking)
- 3.90–4.37 s: the foreground post and snow disc cover the slide's end. Move the camera path off the post, or drop the post.
- 53.60–53.73 s and 54.83–55.00 s: the push dips through black (up to 100% black; "The hatch" over black). Shorten the dip or cross-dissolve instead.
- 30.03–32.30 s: in the merchant close-up his face is half out of frame at the left. Pull the framing right so the speaker is whole next to his bubble.
- Payoff 7.56 s, with ~1 s each for the pour and the shovelling: add ~0.5 s so the payoff reaches 8 s, mostly on the pour.
- 38.33–41.60 s: sink the blocks into the material, or heap it up around their sides ("packed in").
- 50.00–52.07 s: in the sea shot the black hull fills 40–55% of the frame, and the white anchor highlights read like a grin. 40.60–41.60 s: Eddie's head is cut at the frame top. 41.63–43.90 s: the third melted block is mostly out of frame.
- The Calcutta riverfront is still never shown (beat 14 opens on deck): carried over from v1.

## READY / NOT READY
**NOT READY.** Fix the 6 items above, re-preview 4.3–6.0, 25.0–25.3 (audio), 27.9–30.1, 38.3–41.7, 58.0–60.6 and 63.6–66.2 s, then the full render can go. Re-check the music when the new sea-shanty bed lands (loudness, true peak, no clicks, no dead air at 59.5–60.7 s).

## Hand-off note (qa-reviewer → youtube-manager)
**Done: NOT READY.** Report: `studio/reports/s02-ice-king-v2-preqa.md`; stills in `projects/review-qa/` (+`p2/`, `p3/`), test mix `projects/review-qa/mix.wav`. 21 of 23 v2 items pass (#3 and #10 fail; #1 and #16 pass with notes). Loudness −14.1 LUFS / −1.4 dBTP, end fade, English cheers (by code), cameo (frame 794 only), loop and captions pass. Six must-fix items: rope-less hook, cropped 1-2-3 counts, missing heat arrows, hat over k4, a click at 25.13 s, and the merchant's ice that reads as an envelope. Open: word clarity and the cheer still need a human listen; the music needs re-checking after the new bed. No code changed, no paid credits, nothing published, no dates touched.
