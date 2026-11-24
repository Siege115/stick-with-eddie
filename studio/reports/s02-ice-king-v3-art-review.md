# s02-ice-king v3: art director re-check before the owner sees the board

Date: 2026-11-24 · Reviewer: art director · Build: `content/s02-ice-king.beats.mjs` at commit 2451760 (visuals unchanged at f53821d, which only touches `src/mix.py`) · New total 70.64 s
Inputs: `studio/briefs/s02-ice-king-v3-fixes.md` (items 1–21), my v2 review `studio/reports/s02-ice-king-v2-art-review.md`, the animator's board `deliver/s02-v3-fixes.jpg`, stills in `projects/v3-board/`, `projects/v3-sweep/` (every 0.5 s plus around every transition), `projects/v3-before/`.
Extra previews I rendered (preview only, no full render, no code changed): `projects/s02-ice-king/still_{2.90,30.03,30.07,30.10,30.12,31.10,31.13,31.17,31.20,31.30,31.40,64.80,65.40}.jpg`.
Brightness: I measured mean luma on every sweep still. The lowest is 40.4/255 (37.54 s, the whip into the ice house). The lowest frame of the Calcutta push is 76.8 (55.73 s). **No dark frames anywhere.**

## Verdict: NOT READY (3 small must-fixes; everything else passes)

All 11 v2 must-fixes and the SHOULD/NICE items are in, and they hold up in the stills. Three problems remain that the owner would catch at full speed, each against one of the owner's rules: a block that pops between two hand positions in one frame, and two cut heads. Each one is a single-shot fix. After these, I would call the board ready without another full sweep: re-render only the times listed under "Re-check".

## NEW MUST-FIX

| # | Time | What is wrong | Fix |
|---|---|---|---|
| A | 30.07 → 30.10 s and 31.10 → 31.17 s (merchant close-up with the bubble) | The ice block jumps from his left side (frame edge) to the front of his chest in **one frame** as the bubble opens, then jumps back over 2 frames when the line ends. His face also shifts down at the same moments. It reads as a glitch and breaks the physical-sense rule. | Keep one block position for the whole close-up (29.95–32.25 s). Simplest: hold the left-side position, which already has the drips, and drop the "present" pose. If the gesture stays, ease it over 8 frames or more. |
| B | ~2.9–3.4 s (saw, end of the hook's second shot) | The camera push crops the top of the worker's red hat: the pompom at 2.9 s, the whole crown by 3.0–3.37 s. The face stays in frame, but the owner's rule is "heads never cut", and item 2 asked for exactly this framing fix. | Stop the push at about its 2.5 s size (or tilt up about 0.1 m) so the hat and pompom stay inside the frame until the cut at 3.40 s. |
| C | ~64.9–65.2 s and ~65.8–66.3 s (shovelling) | The left worker (brown cap) sways or drifts so that half his face leaves the frame at the left edge (sweep stills 65.00 and 66.00; he is whole at 64.34, 64.80, 65.40 and 65.50). | Move him about 0.3 m right or widen the framing slightly so his whole head stays in frame for the shot (64.30–66.37 s). |

## Item-by-item (brief items 1–21; times are v3 timing)

| # | Item | Result | Evidence (sweep / extra stills) |
|---|---|---|---|
| 1 | Ship loading, ropes | **PASS** | 4.40: rope from boom to tongs on the block on deck. 5.00: hook from the boom tip, tongs on the block. 5.50: line from the yard to the hook. 5.78–5.94: pulley → hook → tongs. No second hanging block. |
| 2 | Saw grip + head | **PART**: grip PASS, framing FAIL (see B) | 1.0–2.5: both arms end on the crossbar, the blade runs into the slot, the head is whole. Shot holds 0.90–3.40 = 2.5 s. Hat cropped 2.9–3.37. |
| 3 | Hero ice 3D | **PASS** (one should-fix) | 16.24–19.94: Eddie holds a translucent 3D block with an edge glint, about 30% of frame width. 27.87–29.95: the merchant's block is 3D with drips and a pale puddle. See S1 on how he holds it. |
| 4 | Merchant close-up | **PASS** for the face, the tail and `mq2`; NEW must-fix A | 30.10–32.0: his whole face is centred; the tail runs to his face (it ends between the eyes; tip it to the mouth if convenient); `mq2` is now in a blue coat. |
| 5 | Hot-port cup | **PASS** | 13.5–15.5: no beads, no wet ring. Rim, highlight and shadow kept. The 1806 jug at 9.5–11.5 keeps its beads. |
| 6 | Bins | **PASS** | 39.10 "1 · HAY" (low three-quarter angle), 40.35 "2 · STRAW" (front), 41.39 "3 · RICE HUSKS" (high angle, with Eddie): full numbers, three different angles, blocks set flush in the material. Melt row 42.4–44.7: three shrinking blocks, Eddie's head whole. |
| 7 | Hold proof shot | **PASS** | 55.73–58.82 (3.1 s): a centre pile of blocks with sawdust mounds under the light shaft, sparkles on "most" (57.0–57.5), two Calcutta faces at the hatch against a lit sky. |
| 8 | No black in the push | **PASS** | 54.47–54.70 and 55.60–55.80 are cross-dissolves. The minimum luma is 76.8; "The hatch" sits over a picture. |
| 9 | Ice King | **PASS** | 58.82–61.34: `k4` has moved to the right edge, clear of the raised hat. The sparkle sits just above Eddie's head (60.0–60.5). |
| 10 | Sawdust pour | **PASS** | 62.50–64.30: the stream starts at a wooden chute on the saw-table edge and lands on a heap. Held 1.9 s. |
| 11 | Heat arrows | **PASS** | 66.6–68.5: thick orange arrows enter from the left, slow, and fade inside the sawdust wall. |
| 12 | Hook splash, Eddie in frame | **PASS** | 0.00: splash burst around the surfacing block. Eddie (top hat, navy coat) is whole at the right. 0.5–0.8: the block rests on the ice ledge, not floating. |
| 13 | Slide on ice | **PASS** | 3.40–4.37: the post is gone; the block slides across the frame toward the worker. |
| 14 | Route card | **PASS** | 7.0–8.5: "CARIBBEAN SEA" and "MARTINIQUE" are separate. The card pushes in slowly. |
| 15 | Kitchen cook | **PASS** | 9.5–11.5: her whole face is in frame behind the jug. |
| 16 | Letter | **PASS** | 34.00: Eddie's head and hat are whole. The letter card is on screen 34.15–35.66 (about 1.5 s). |
| 17 | Sea hull | **PASS** | 50.3–52.9: planks and the ochre band are visible, with bow spray at the waterline. (The *Tuscany* departure 48.3–48.5 still has a very dark lower hull, luma 42; acceptable.) |
| 18 | Shovel | **PASS** for the prop; pose weak (see S2); NEW must-fix C | 64.30–66.37: long handle with a steel blade, two hands, faces clear of the blades. |
| 19 | Short shots | **PASS** | Crowd laugh 19.94–21.93 (2.0 s), *Tuscany* departure 48.29–50.32 (2.0 s), pour 1.9 s, shovelling 2.1 s, payoff 61.34–70.64 (9.3 s). |
| 20 | Calcutta establishing | **PASS** | 54.50–55.70: ghat steps, colonnaded front, the moored ship, a boat in the foreground. |
| 21 | Gull + card motion | **PASS** | 22.0–24.99: the newspaper pushes in, and a gull flies in (23.0) and lands on the top-right corner (24.5). The map card pushes in at 44.7–48.3. Arrows are stronger. |

Other checks: the cameo is in frame 792 only (26.40 s, the log behind the upper window; absent at 26.37 and 26.43). Captions never cover a face in any still. Key actions are held 2 s or more (saw 2.5, Eddie's ice 3.7, merchant's block 2.1, hold 3.1, Ice King 2.5, pour 1.9, shovel 2.1). No clipping through walls or props was found. Nothing else floats.

## SHOULD FIX (not blocking; do them if the must-fix pass touches these shots)

| # | Time | Note |
|---|---|---|
| S1 | 27.87–29.95 s | The merchant's block sits up beside his ear with no visible holding hand. The only hand-ball near it reads as belonging to the woman behind, and the block hides half her face. Bring it to chest height in his own visible hand, clear of her face. This also fixes the continuity into must-fix A. |
| S2 | 64.30–66.37 s | Shovel toss (open note): **agreed, it reads weakly.** Both men only poke their blades at the edge of the heap; nothing is lifted or thrown. Give the brown-hat worker one scoop, lift and toss into the barrel (about 64.6–65.4) with a few sawdust flecks leaving the blade. The other worker can stay static. |
| S3 | 66.37–67.5 s | At the left edge of the cutaway the sun is an off-white disc with a black outline, half out of frame. It reads like a cut-off head. Tint it yellow (as on the letter card) or move it fully into frame. |

## NICE / open note

- **Loop pair (70.61 s → 0.00 s):** **still differs, acceptable.** The end is a lit ice stack in a navy hold with a few specks; the start is a single block bursting out of a snowy night pond with workers. Both are blue-night, block-centred frames of similar size, so the cut reads as "the ice goes back to the pond". Not blocking. If anyone touches the last shot: add 3–4 falling snow specks over 69.5–70.6 and lift the hold wall a little toward the pond's sky colour.

## Re-check after the fixes (previews only)
2.50, 2.90, 3.20, 3.37 · 29.00, 30.03, 30.07, 30.10, 31.10, 31.17, 31.50 · 64.50, 64.90, 65.00, 65.40, 66.00, 66.30 · 66.57 (if S3 is done).

## v3.1 re-check (2026-11-24, build d6af7dc, 70.64 s, timing unchanged)

**Verdict: READY for the owner's board.** All three must-fixes and the three should-fixes pass. Stills checked: `projects/v3-fix2/` at 2.50, 2.90, 3.20, 3.37, 27.90–29.50, 29.95–32.20, 57.00 and 64.30–68.50.

| # | Time | Result | Evidence |
|---|---|---|---|
| A | 29.95–32.25 s | **PASS** | One `holdChest` pose for the whole close-up. At 29.95, 30.03, 30.07, 30.10, 31.10, 31.17 and 31.50 the block stays at chest height in his hands, with no jump and no face shift as the bubble opens or closes. The bubble tail runs to his face. |
| B | 2.5–3.4 s | **PASS** | The hat and pompom are inside the frame at 2.50, 2.90, 3.20 and 3.37. The two-handed grip on the crossbar is unchanged. |
| C | 64.3–66.37 s | **PASS** | Both workers' heads are whole in every still (64.35–66.30). |
| S1 | 27.87–29.95 s | **PASS** | The block is at chest height in his own visible hand, clear of the woman's face, and drips onto a puddle. |
| S2 | shovel toss | **PASS** | The brown-hat worker scoops at the heap (64.35–64.5), lifts (64.9) and tosses into the barrel (65.0), with sawdust flecks leaving the blade (65.2). Minor: at the top of the toss (65.0–65.4) the blade touches the right edge. Not blocking. |
| S3 | 66.4–68.5 s | **PASS** | The sun is now yellow with rays and fully in frame (66.45–67.2). By 68.5 the push moves it to the left edge, where it still reads as a sun. |

No new problems in these shots.

Still open, not blocking: the loop pair (see "NICE / open note" above).
