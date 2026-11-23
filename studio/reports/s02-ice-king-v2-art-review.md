# s02-ice-king v2: art director pre-render review

Date: 2026-11-23 · Reviewer: art director · Build: `content/s02-ice-king.beats.mjs` at commit b8e08fc (68.24 s)
Method: 137 preview stills every 0.5 s (0.0–68.0) plus 68.2, the frame-794 cameo, and frame-by-frame through the 54.8–55.2 s dip
(`node render-episode.mjs content/s02-ice-king.beats.mjs projects/review-art --3d --preview ...`). No code changed.
Board of the problem frames: `deliver/s02-v2-art-review.jpg` (codes below match the labels on the board).

**Verdict: not ready for the full render.** The v2 fixes the owner approved on `deliver/s02-v2-fixes.jpg` are in and hold up
(slide on ice, block and tackle with sailors, route card, jug handle and beads, cup, merchant bubble-only, lit ice-house door, bins,
melt row, map label, payoff strip, cameo). But the 0.5 s sweep shows 8 things the owner will notice from the full video,
mostly hero objects that read as flat white cards and faces cut by the frame edge. Each fix is small.

## MUST FIX (before the full render)

| # | Time | What is wrong | Exact fix |
|---|---|---|---|
| M1 | 54.83–55.00 s (6 frames; 54.90 is mean luma 2/255, pure black) | The `push` from Calcutta into the hold dips through black: longer than 3 frames, and it breaks the owner rule "no near-black frames in pushes" (QA B15). It lands on "The hatch". | Beat 14 shot 2: change `'push'` to `'cut'` (or a cross-dissolve with no black), or clamp the push transition's darkening so no frame falls below about 40% of the neighbouring frames (target mean luma ≥ 35). Recheck 54.77–55.20 frame by frame. |
| M2 | 1.0–3.3 s (saw hold, the hook's second shot) | The saw floats: its crossbar sits across the worker's chest but both arms are spread wide, hands off the handle; the blade stands in front of the apron. This is the 2.5 s "saw cut" the owner asked for, so it is a hero action. His head is also cut by the top edge at 2.5–3.3 s. | Put both hands on the crossbar (two-handed grip pose for `saw`, hands at the handle ends, stroke moves the hands with the blade). Tilt the camera down / raise it about 0.15 m so the whole head stays in frame. |
| M3 | 16.44–17.9 s (beat 5 "match" close-up) | The ice chunk is a flat white-grey square tile on a stick arm with a ball hand, no Eddie in shot, no glint. It reads as a paddle or sign, not "ice held up like a jewel". | Use the 3D ice block material (blue, bubbles, outline, thickness) for the `ice` item; add the planned glint/sparkle ping; start the shot with Eddie's hand and cuff visible, or simply open on the beat 5B medium with the chunk in his raised hand. Make it fill about 30% of frame width. |
| M4 | 27.94–30.4 s (merchant holding the block) | The "dripping block" he holds at arm's length is the same flat white square: reads as a paper or a plate. Drips and puddle are hard to see. This is the proof of "nowhere to keep it cold". | Same as M3: the `iceBlock` item as a real blue 3D block (about 0.25 m), drips visible against the stone, puddle growing under it. Frame so the block is in the upper-middle, clear of the caption. |
| M5 | 30.4–32.3 s (merchant close-up with the bubble) | The speaker's face is cut in half by the left edge (only one eye, the mouth on the edge). Behind him stands a second man in the same straw hat, cravat and coat (`mq2`), so it looks like the merchant is twice in shot, and the bubble tail points toward the man at the back. | Re-aim the close-up so the merchant's whole face sits centre at about y 0.40 (the brief's 0.38), bubble upper-right with the tail to his mouth. Re-dress `mq2` (different hat and coat colour, no straw boater) or move him out of this frame. |
| M6 | 55.1–58.0 s (hold proof shot: "most of the ice is still there") | The ice reads as blue glass cabinets on the side walls; no blocks-in-sawdust in the centre, no faces at the hatch rim (ca1/ca3 are not in frame), the sky is a pale slot. The owner's proof-shot rule: the claimed object must be clearly on screen. | Put a stacked block pile (5–8 blocks, sawdust between them, 2–3 small puddles) in the centre foreground under the light shaft; drop the camera lower and look up so two Calcutta faces show at the hatch rim against a lit sky; add the planned sparkles on "most". |
| M7 | 58.3–60.5 s (Ice King) | Eddie's raised hat overlaps the head of the crowd man behind him (who also wears a tall top hat), so it reads as that man's hat, or as two stacked hats. The ice-crown sparkle pops high in the sky by the chimney, nowhere near Eddie's head. | Move the crowd man with the top hat (`k4`, `hat: 'topTall'`) out of the hat's path (to the left side) or give him a different hat; raise Eddie's hat against clear sky. Move the sparkle to just above Eddie's head (about 0.35 m over it in this framing; `sparkle` target at about `[0.6, 2.2, -4.4]` and check in frame). |
| M8 | 62.0–62.9 s ("Sawdust") | The sawdust stream starts in mid-air: there is no blade or chute above it (the sash saw is far back in the frame). Physical-sense rule. | Lower the camera/tilt up so the stream starts at the saw blade's lower edge or under a wooden chute from the saw table; or move the heap and pour under the blade. |

## SHOULD FIX

| # | Time | What is wrong | Fix |
|---|---|---|---|
| S1 | 0.0–0.9 s (hook frame) | Frame 0 is readable but not a "burst": no splash or water spray around the rising block; the lantern glint is a blurry white dot; Eddie is cut by the right edge (half body), so his pointing toward the ship is lost. | Add a splash ring and a few water drops/spray particles at 0.0–0.5 s; keep Eddie fully in frame (move him 0.4 m left or widen the fov 2–3°) with the point readable. |
| S2 | 3.4–4.37 s (block slides along the ice) | A big blurred foreground post with a snowy cap fills half the frame, and the block is small at the right edge, so the slide the owner asked for (A1) is hard to see. Only about 1 s. | Move the foreground post out to the frame edge (or lower it); frame the block centre-left, sliding across the frame. |
| S3 | 6.4–9.0 s (route card) | "CARIBBEAN SEA" collides with "MARTINIQUE" and the compass rose (reads "CARIBBEAN SEAMARTINIQUE"). | Move "CARIBBEAN SEA" left/down into open water, clear of the compass and the Martinique label. |
| S4 | 9.1–11.8 s (kitchen) | The cook's face is cut by the left edge (half a face), so "fanning herself" is lost; the jug dominates. | Shift the camera 0.25 m right or pan left so her whole face is in frame behind the jug. |
| S5 | 33.9–35.4 s (Eddie, letter, hat droop) | At 34.0 his head and hat are cut by the top edge; the letter in his hand is a tiny white square; the letter insert card is on screen only about 0.6 s, too short to read the drawing. | Tilt down so the head and drooping hat are in frame; hold the letter card about 1.2 s (start it at `w:money-0.3` or so). |
| S6 | 38.4–41.6 s (three bins) | The count numbers are cut: the slates read "· HAY", "STRAW", "RICE HUSKS" with the 1, 2, 3 out of frame, so the rule-of-three count is lost. All three shots are the same top-down angle (the brief asked for a new angle each). The blocks sit on top of flat hay instead of nested in it. Eddie's head is cut at the top in the rice-husk shot. | Widen or shift each shot so the whole slate ("1 · HAY" etc.) is in frame; vary the angle (side-low, high three-quarter, close); raise the packing material around the block's lower third; frame Eddie's whole head or keep him out. |
| S7 | 49.6–52.3 s (open sea) | The hull fills the lower 40% as near-black; there is no bow wave or foam; the anchor reads as a white glint floating on black. Feels flat and dark. | Black-level lift on the hull (editing guide 06), add bow-wave foam and spray at the waterline, light the hull side from the sun. |
| S8 | 63.0–63.9 s (shovelling) | The near worker's shovel is a large square board that covers his lower face and reads as a mallet or sign; the second worker's arms hold nothing. "Shovelling into barrels and carts" does not read. | Smaller shovel blade with a long handle held two-handed; show the barrel or cart being filled in shot; keep both faces clear. |
| S9 | 20.14–21.4 s ("Boston laughed") and 48.4–49.5 s (Tuscany sets sail) | Both about 1.1–1.3 s: short for a reaction beat and the departure. | Give the crowd laugh about 2 s (start the newspaper at `w:newspaper+0.3`); give the Tuscany shot about 2 s if the timing allows (the map can start 0.4 s earlier). |
| S10 | 53.7–55.0 s (Calcutta) | The arrival is three faces over a hatch cover: no riverfront, ghat or city, so "The ship docks" in Calcutta has no establishing image. Respectful and fine, just thin. | Open on the planned wide from the ghat steps (brass pots, the moored Tuscany, the crowd) for about 1 s, then push to the hatch. |

## NICE

| # | Time | Note |
|---|---|---|
| N1 | 0.0 / 68.2 s | Loop pair: block size and position match well (about 60% of frame width, same height). The backgrounds differ (snowy night pond with workers vs. a royal-blue hull wall); a slightly navier wall and one or two snow-like specks would make the seam softer. |
| N2 | 21.4–25.0, 44.0–48.4 s | HUD cards (newspaper, map) are still for 3.5–4.5 s over a blurred background. The planned gull landing on the newspaper corner is not there; a gull or wind flutter on the paper would add motion. |
| N3 | 64.0–64.8 s | The heat arrows are barely visible in the 0.5 s stills; make them thicker/brighter orange for the first second. |

## Checked and OK
- Captions: none cover a face in any still; 1–2 words; numbers green (1806, 1833, 15,000).
- Cameo: frame 794 (26.467 s), the log is behind the glass of the upper window in Saint-Pierre, one frame.
- Hat in hand at 5.5 s (hand at the brim, inside the card, no clipping). Gulls not tracking characters in the stills seen.
- Jug handle attached, beads on the surface; cup detailed; merchant line is bubble only; no "Wunderbar"-style cross-Short text.
- Period: sail only, 1806 and 1833 dress, English signs; respectful Martinique and Calcutta crowds.
- Brightness: apart from M1 and S7, every still is above mean luma 40.

## Open
- I did not listen to audio (no transcription tool); the sound checks stay with the audio reviewer.
- After the fixes, re-render previews at 0.0, 1.5, 4.0, 7.0, 9.5, 16.8, 29.0, 31.0, 34.0, 40.0, 51.0, 54.8–55.2 (each frame), 55.8, 59.3, 62.2, 63.2, 68.2 for the owner.
