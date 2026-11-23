# s02-ice-king: v3 fix list (team double-check before the full render)

Date: 2026-11-23. The owner approved the v2 pictures but asked the team to double-check everything before the video.
Sources: `studio/reports/s02-ice-king-v2-art-review.md` (art director: NOT READY), `studio/reports/s02-ice-king-v2-preqa.md` (QA: NOT READY), `studio/briefs/s02-ice-king-factcheck.md` "v2 check" (one change).
**Owner rules:** pictures before any full video; nothing floating; physical sense; hold key actions ≥ 2.5 s; no dark frames in transitions; strong hook; more motion and detail.

## MUST FIX (blocking)
1. **Ship loading, 5.0–5.9 s:** the block swings on a hook with no rope above it, and a second block hangs in mid-air. Every rope must run pulley → hook → tongs on the block; no unsupported blocks.
2. **Saw, 1.0–3.3 s:** the saw floats. Use a two-handed grip on the saw's crossbar (hands visibly on it), and lower the framing so the worker's head isn't cut.
3. **Hero ice is a flat card (16.4–17.9 s Eddie's chunk; 27.9–30.4 s the merchant's block).** Make real 3D ice blocks (translucent, edges, a glint) held in a hand; Eddie must be in the 16.4–17.9 s shot. The merchant's block drips with a visible puddle.
4. **Merchant close-up, 30.4–32.3 s:** his face is half out of frame, and the bubble tail points at a look-alike behind him. Reframe on the speaker, re-dress `mq2` (a different hat or colours), and point the tail at the speaker.
5. **Hot-port cup, 13.4–16.4 s (fact-check V12):** remove the condensation beads and the wet ring (a sweating cup would mean a cold drink; the line is "almost nobody had ice"). Keep the rim, water, highlight and shadow; show heat with the shimmer. The 1806 kitchen jug keeps its beads.
6. **Bins, 38.3–41.6 s:** the 1·2·3 numbers are cropped off the signs. Show them fully, use a different angle per bin, and pack the blocks **into** the hay, straw and husks (material around their sides). Melt shot: all three shrunken blocks in frame; Eddie's head not cut (40.6–41.6 s).
7. **Hold proof shot, 55.1–58.0 s:** it reads as blue glass cabinets. Make a centre pile of ice blocks packed in sawdust under the light shaft, a few puddles, sparkle glints, and two Calcutta faces peering down through the hatch.
8. **Push into the hold, 53.6–53.73 s and 54.83–55.0 s:** dips to black (54.90 s fully black) with "The hatch" over black. Use a cut or a cross-dissolve; every frame should have a mean brightness of about 35/255 or more.
9. **Ice King, 58.3–60.5 s:** Eddie's raised hat overlaps the top-hatted man `k4` behind him. Move or re-hat `k4`, and put the ice-crown sparkle just above Eddie's head.
10. **Sawdust pour, 62.0–62.9 s:** it comes from mid-air. The stream must start at the saw blade or a chute.
11. **Final cutaway, 63.8–66.0 s:** the heat arrows are missing. Bring them into frame, clearly visible, slowing and fading in the sawdust.

## SHOULD FIX (do these too)
12. **Hook, 0–0.9 s:** add the splash burst as the block surfaces, and keep Eddie fully in frame.
13. **Slide on the ice, 3.4–4.4 s:** a blurred post hides it. Move the camera or the post so the slide reads.
14. **Route card, 6.4–9.0 s:** "CARIBBEAN SEA" and "MARTINIQUE" overlap. Separate them.
15. **Kitchen:** the cook's face is half cut. Reframe.
16. **Letter, 33.9–35.4 s:** Eddie's head is cut. Hold the letter card about 1.5 s or more.
17. **Sea:** lift the hull from near-black (show its planks and ochre band) and add a bow wave.
18. **Shovelling:** a proper shovel (blade and handle), not a board hiding a face.
19. **Short shots:** "Boston laughed" crowd and the *Tuscany* departure at least 2 s each. Payoff: hold the sawdust pour and the shovelling about 2 s each (the payoff becomes about 9–10 s). Total may run to about **70 s**; the owner prefers clarity.
20. **Calcutta:** a quick establishing shot of the riverfront (ghat, colonnades, boats) before the hatch.
21. **Nice:** a gull lands on the newspaper card; subtle motion on the map and newspaper cards (a slow push or parallax); slightly stronger heat arrows.

## Sound (sound designer, `src/mix.py` / `src/shanty.py`)
22. **Click at 25.13 s:** the reversed whoosh on the zoom into Martinique stops at full volume. Add a short fade-out.
23. After the animator's timing changes, re-check the new shanty bed: no dead air before "His secret?", loudness −14 LUFS, true peak ≤ −1 dBTP, end fade, no clicks.

## Then
- Board `deliver/s02-v3-fixes.jpg`: before → after for every item with timestamps, plus the hook strip (0–3 s), the payoff strip and the loop pair.
- Art director and QA re-check the listed times (the re-check lists in their reports) **before** the owner sees the board.
- **No full render** until the owner OKs the board.
