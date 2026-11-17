# s02-ice-king: art direction and storyboard

Project: s02-ice-king, "The Man Who Shipped Ice to the Tropics" (Frederic Tudor)
Written: 2026-11-17, by the art director.
Inputs: `s02-ice-king-script.md` (APPROVED, 17 beats), `s02-ice-king-factcheck.md` (incl. the Script check), `CHANNEL-BIBLE.md`, `studio/STUDIO.md`, the vault (Visual Style, Animation Rules, Camera and Transitions, Captions, Owner Feedback Log, Lessons Learned, the planned set notes), and the code in `src/world.js`, `src/draw.js`, `src/stage.js`, `src/textures.js` and `content/s01-clever-hans.beats.mjs`.
Status: **plan only.** No code written, nothing rendered, no paid credits used.

---

## 0. What the code can and can't do today (read this first)

Findings from reading the code. They drive the build plan in section 4.

| Area | Today | What S02 needs |
|---|---|---|
| Set library (`src/world.js`) | One function, `buildCourtyard()`. All helpers (`box`, `cyl`, `ink`, `planter`, `addWin`, barrels, lamps, shutters, curtains, drainpipes, posters, ivy, hand cart, wheelbarrow, bucket, broom, pitchfork, pump, trough, bench, laundry line, dust motes) live **inside** that function and are not exported. | Move the helpers into an exported **kit** (`src/kit.js` or exported from `world.js`), so every new set builds from the same parts. The courtyard keeps working by calling the kit. |
| Stage (`src/stage.js`) | Builds only the courtyard (line 118). Hans the horse, the chalkboard, the folding screen, the stable doors, the tap counter and a hard-coded "beat 7 march" are wired in. | **Multi-set:** build every S02 set once and show only the set named by the current shot (`set: 'pond'` on a beat or shot; `group.visible` toggled). Hans and the other S01 parts become optional (only when the beats file asks for them). Each set returns its own `spot`/`beam`/lamp handles, or stubs. |
| Character positions | `pos` keys are 2D `[x, z]`; everyone stands on y = 0. | **Height support** (`[x, z, y]` or a per-set ground height) so people can stand on the brig's deck, the gangplank, the quay above the water and the ghat steps. Without it people float or sink. |
| Lighting presets | `warm`, `cool`, `spot` (blended beat to beat). Long shadows and the vignette are keyed to those names. | Six new presets (section 1.10). Long-shadow and vignette settings move into the preset itself instead of name checks. |
| Transitions | Implemented: `cut`, `whip`, `zoom`, `zoomout`, `push`, `wipe`. `pull` is just a camera move. **`match` and `iris` are named in the S01 file but do nothing (they play as cuts).** | Real `match` (short dissolve, about 6 frames, between two shots framed so the shapes line up), real `iris` (circle mask closes on a point, opens on the next shot), and a coloured `wipe` (sun-flare or paper-unroll edge). |
| HUD close-ups | `hansPortrait`, `face`, `eyes`, `eye`, `newspaper`, `stamp`. | Reuse `face` (merchant) and the `newspaper` frame with a new texture. New: `card` (year card), `map`, `letter`, `thermometer`. |
| Costumes (`src/draw.js`) | Hats `wide`, `top`, `bowler`, `flat`, `bonnet`, `helmet`; coats (long), waistcoat, tweed, tie, glasses, monocle, moustache, beard, apron, hair `bun`/`side`/`pigtails`; items `chalk`, `notebook`, `pencil`, `cane`, `paper`, `hanky`; icons `!`, `?`, `sparkle`, `anger`. | New pieces listed in section 2.5. |
| Render | `render-episode.mjs <beats> <outDir> --3d --preview t1,t2,...` exists. | Nothing new. |

**Period check on the existing library (1806 and 1833):**
- **Bowler hats are out.** The bowler dates from 1849. Swap every S01 bowler for a top hat, a low-crowned "round hat", a bicorne (older men in 1806) or a knit cap.
- **Gas lamps are out.** Boston had no gas street lights in 1806. Re-head the courtyard lamp post as an **oil lamp / lantern** (same post, glass box with a flame).
- **No circular saw** at the sawmill. An 1830s mill uses an up-and-down **sash saw** driven by a water wheel.
- **No steamships, no funnels, no photographs, no Suez Canal.** Sail only; woodcut-style drawings only; the route goes around Africa.
- Flat caps are acceptable for working men, but knit wool caps and round hats read more "1806". Use knit caps for workers and sailors.

---

## 1. Set list

Nine sets plus the 2D cards. Each set is a separate group in the multi-set stage. Measurements are metres. Every set follows the S01 lessons: rich background dressing, English text on props, real door/hatch openings (no grey bars through walls), and nothing in a person's walking path that they could pass through.

### 1.1 Frozen Pond (beat 1, shot A–B): night, cold blue

**Story job:** the loop target. The opening frame is a clear ice block face filling the frame, a saw biting in.
**Place:** the pond on the Tudor family land at Saugus (fact-check row 2). No horses (row 36: in 1806 cutting was by hand).

Geometry and dressing:
- **Ice sheet** 30 × 30 plane, blue-white ice texture with **scribed grid lines** where the cutters marked out blocks. One **open channel** of dark water (2 m wide) where blocks have already come out, its edges a little rough. Kept **at least 1 m from every worker's feet** (safety flag 1 and clipping).
- **Cut blocks**: 6–8 stacked by the bank, one half-cut block in the channel; blocks about 0.6 × 0.4 × 0.4.
- **Snow banks** around the shore: low, smooth, flattened domes (single smooth silhouettes, no lumpy overlaps: the "bump" lesson), soft blue shadow side.
- **Ice house / shed** on the bank: steep-roofed plank shed, snow on the roof edge, a **real door opening** with a dark interior behind it, a lantern on a hook beside the door, icicles along the eave.
- **Tool rack** against the shed: two **long hand ice saws**, two **pike poles**, **ice tongs** hanging, an axe, a coil of rope, a wooden **sledge** for hauling blocks.
- **Sign** on a post at the shore: **"ICE CUTTING · WORKERS ONLY"** (hand-painted board, English, readable; supports the safety flag).
- **Trees**: dark pines with snow caps (stacked cones) and two bare trees; a **farmhouse** far across the pond with one warm lit window (the Rockwood estate, unnamed).
- **Sky**: deep navy dome with stars and a low moon; light **falling snow** (reuse the dust-mote sprites as snowflakes).
- **Lanterns on poles** at the work area (2–3), each a warm point light: warm pools on cold ice.

Lighting: **new preset `night`** (cold blue moon key from high left, warm lantern points, dark fog close in, snow motes on).
Reused: `box`/`cyl`/`ink` kit, wood texture (shed, sledge, tool handles), lantern from the courtyard stable door, dust-mote system, hay texture (sledge bedding, optional).
New textures: `ice` (block: blue-white with inner cracks and bubbles, bright edge), `iceSheet` (with scribed grid), `snow` (white with blue speckle and sparkle), night sky with stars, sign board "ICE CUTTING · WORKERS ONLY".

### 1.2 Boston Wharf + brig *Favorite* / ship *Tuscany* (beats 1C, 2, 5, 6, 9B, 10A, 13B, 16): snowy grey 1806 / warm 1833

**Story job:** the most-used set. Loading, departure, the laughing crowd, the letter, the ice-house door, and the 1833 "Ice King" moment.
**Place:** a Long Wharf–style plank wharf running out from a cobbled street. No real business names.

Geometry and dressing:
- **Wharf deck**: planks on pilings (pilings visible at the water edge), 10 m wide, 30 m long; **bollards**, iron mooring rings, **coils of rope**, an **anchor** leaning on a crate, a **capstan**.
- **Street head**: cobbles (reuse), **brick and clapboard warehouses** 3–4 storeys with gabled roofs, **hoist beams with block and tackle** over the loft doors (one with a crate halfway up), loft doors open with a dark interior, shutters, small-paned windows (reuse `addWin`, shutters, curtains, window boxes off in winter).
- **Shop signs** (English, period wording, invented): **"SHIP CHANDLER"**, **"SAIL LOFT"**, **"ROPE & TAR"**, **"COFFEE HOUSE"**. Handbill posters on a wall: **"FRESH COD DAILY"**, **"PASSAGE TO NEW YORK · ENQUIRE WITHIN"**, **"AUCTION TODAY"** (new poster kinds; no dates, no tonnage).
- **Ice-house shed** at the wharf head: plank building with a door sign **"ICE HOUSE"**. Its door must swing open (reuse the S01 `doors` keys) **before** the camera pushes through it in beat 10.
- **Cargo**: barrels (reuse), crates, sacks, fish baskets, lobster pots, a hand cart (reuse), a wheelbarrow (reuse).
- **Lamps**: the courtyard lamp post re-headed as an **oil lantern**; lit at night (beat 1C), unlit in daylight.
- **Background**: other ships' masts as flat silhouettes in the harbour; the **Old State House** tower silhouette up the street (real 1713 landmark, generic shape, unlabelled); gulls.
- **Snow** (1806 dressing): on roofs, bollards, crate tops, the edges of the planks; grey slush on the cobbles; falling snow.
- **The ship (hero prop, details in 1.2a).**

1833 re-dress (beats 13B, 16): snow off, May light (the *Tuscany* sailed in May, fact-check row 24), the wharf busier, posters changed, the ship swaps to the *Tuscany* (third mast, new stern board). Crowd costumes move to 1830s (section 2).

Lighting: `night` for 1C (lanterns); **new preset `snow`** (bright grey-white overcast, soft shadows, falling snow) for 2, 5, 6, 9B, 10A; existing **`warm`** for 13B and 16.
Reused: cobbles, bricks (two tints), plaster, wood, `addWin` + shutters + curtains, drainpipes and gutters, barrels, hand cart, wheelbarrow, bucket, broom, posters (new kinds), ivy (bare winter version off), courtyard skyline generator (re-coloured as grey-brown Boston roofs), contact-shadow system.
New textures: `water` (harbour: grey-green painted wave stripes, scrolling), `hull`, `sailcloth`, stern boards **"FAVORITE · BOSTON"** and **"TUSCANY · BOSTON"**, shop signs, new posters, snow.

#### 1.2a The brig (hero object)
- **Hull**: a deck-plan outline (pointed bow, square stern) extruded downward with a soft bevel, slightly tapered toward the keel. **Black hull with an ochre stripe** at the deck line (common for the period), plank lines in the texture, a bowsprit, a carved rail, a **stern board** with the name. One smooth silhouette with a thick ink outline (`ink()`), no stacked boxes showing seams.
- **Deck**: plank deck, **main hatch with a hinged cover** (real opening into the hold set), ship's wheel or tiller at the stern, a ship's bell, water barrel, coiled lines, a small deckhouse.
- **Masts**: the brig has **two** masts; the *Tuscany* (a ship) has **three**. Same hull, add a mast. Masts and yards are tapered cylinders. **Sails**: furled (rolled cylinders on the yards) when docked; set (slightly curved canvas planes) at sea and in beat 2 as it leaves.
- **Rigging**: shrouds as **ladder-pattern alpha planes** (ratlines) from the rails to the mast tops; stays and braces as thin dark lines (a handful, not hundreds). Reads as "ship" at phone size without the cost.
- **Gangplank** from the wharf to the deck rail, cleated, with a rope handrail. People walking on it need the height support from section 0.
- **Hoist**: a yard-arm tackle over the hatch for lowering blocks (beat 1C).
- **Movement**: the whole ship group moves on a simple track (new `ship` keys in the beats file, like `pos`) with a slow pitch/roll bob; a foam ring at the waterline and a short **wake** of flat white curved shapes behind the stern.

### 1.3 Period kitchen (beat 3): warm summer interior, 1806

**Story job:** "in 1806, there were no fridges". A hot day, a sweating jug, and an empty space where a fridge would be.

Geometry and dressing:
- Room box (BackSide), plaster walls, beamed ceiling, wide-plank floor.
- **Hearth**: big brick fireplace, iron crane with a hanging pot, embers glowing low, bellows, fire irons; a **bake oven door** in the brickwork.
- **Table**: scrubbed pine table with a **stoneware jug "sweating"** (droplets running, a small wet ring), a loaf, a crock of butter with a cloth over it, a bowl of plums, a candle in a pewter stick.
- **Dresser** with plates and pewter on the shelves; in the gap beside it, a **dashed white outline of a modern fridge** that pops in on "fridges" and **pops away** (a graphic joke, not a prop). The wall behind the gap is plain, so the joke reads.
- **Hanging herbs** and dried peppers from a beam, a **butter churn**, a water bucket with a dipper, a broom (reuse), a spinning wheel in the corner.
- **Window** open to a sunny garden (painted backdrop plane through a real opening): bright light beam across the floor with dust motes (reuse).
- One **cook** (adult extra) fanning herself with her apron.

Lighting: existing **`warm`** plus the window sun beam (motes on).
Reused: bricks (hearth), plaster, wood, `addWin` (open variant) + curtains, broom, bucket, dust motes, planter (window-sill herbs).
New textures: fridge-outline graphic (dashed), garden backdrop, pewter (flat grey with highlight).

### 1.4 Tropical Harbour: one set, two dressings (Martinique 1806: beats 4, 7, 8, 9A · Calcutta 1833: beat 15A)

**Base set** (shared geometry): a stone **quay** with an edge, iron mooring rings, bollards and **steps down to the water**; a **row of 2–3 storey buildings** facing the quay with an **arcade** at street level; market **stalls** under awnings; palms and shade trees; a water plane; the brig/ship moored alongside (reuse 1.2a); a painted backdrop card for the far skyline.

The two dressings must **not** look like the same place with a new caption. They change colour, rooflines, shade structures, signs, water, trees, boats and the backdrop:

| | **Martinique, Saint-Pierre, 1806** | **Calcutta (now Kolkata), Hooghly riverfront, 1833** |
|---|---|---|
| Walls | **Warm white and cream plaster** with **ochre trim** | **Pale yellow-ochre and white** stucco, **tall columns and arched verandahs** (the neoclassical "City of Palaces" look) |
| Roofs | **Red clay tile**, sloped | **Flat roofs with balustrade parapets** |
| Windows | **Louvred shutters in blue and sea green**, wooden balconies with turned balusters | **Green louvred shutters**, tall arched windows, deep verandahs |
| Shade | **Red-and-white striped canvas awnings** | **Plain cotton canopies** (indigo, terracotta, off-white) on **bamboo poles** |
| Water edge | Stone quay and steps into **turquoise sea** | A wide **ghat** (broad stone steps down to the river), **brown-green river water** |
| Boats | Small rowing boats, a fishing canoe | Flat-bottomed **country boats** and a **budgerow** (river houseboat), flat cut-outs |
| Trees | **Coconut palms**, a breadfruit tree | **Banyan tree** with hanging roots, a couple of palms |
| Backdrop | **Mont Pelée** volcano with a cloud cap, green hills, a church tower | Low neoclassical skyline, **a church spire**, optionally the **Ochterlony Monument** column (built 1828, period-correct) |
| Stalls | Bananas, coconuts, pineapples, breadfruit, baskets, coffee sacks | **Cloth bales**, **brass water pots**, **clay water jars** (earthen pots kept water cool: a true period detail), baskets, rope |
| Parked | A two-wheeled cart, barrels | A **palanquin (palki)** resting on its poles, a hand cart |
| Signs (English) | **"HARBOUR OFFICE"**, **"FRUIT & SPICES"**, **"CAFÉ"** | **"CUSTOM HOUSE"**, **"STRAND ROAD"**, **"CLOTH MERCHANT"** |
| Light | **New `tropic`**: hard high sun, short shadows, bright sky | **New `tropicHaze`**: warmer yellow, more haze, softer shadows |

**Not shown, on purpose (safety flag 2):** no plantations, no cane fields, no chains or labour scenes, no shirtless figures, no "exotic" props (no snakes, no elephants, no fakirs). The quay is a busy, ordinary town waterfront.

Beat 4 uses the Martinique dressing **without a caption** ("in hot places"): a merchant fanning himself under a striped awning, a cup of water on a stall in full sun, heat shimmer above the stones.

Reused: plaster (two tints), `addWin` + shutters + curtains, `planter` (balcony pots and window boxes with flowers), barrels, crates, hand cart, bench, laundry line (in a side alley), LEAF/PETAL meshes (banyan and shrubs), brig/ship, water, dust motes (heat haze specks).
New textures: terracotta roof tiles, louvred shutters (blue/green), striped awning, plain cloth canopy, stone quay blocks (cobbles scaled up), ghat steps, palm leaf (alpha card), sea water (turquoise) and river water (brown-green), two painted backdrops (Mont Pelée; Calcutta skyline), shop signs.

### 1.5 Open Sea (beat 14): blazing heat

**Story job:** "about 15,000 miles… his longest, hottest trip yet."
Geometry and dressing: a large water plane with painted wave stripes scrolling past; **flat cut-out wave crests** with white caps around the bow; a big **sun disc** that grows; a sky gradient (orange to white near the sun); a **heat-shimmer** band low over the water; flying fish (2 flat cut-outs, optional). The **ship *Tuscany*** with full sails set and a bow wave. **On deck**: a **thermometer** on a board by the wheel (glass tube, red column that climbs, **no numbers on the scale**: fact-check), two sailors (one coiling rope, one at the wheel) with straw hats.
Lighting: **new preset `blaze`** (very hot white-orange sun, high exposure, orange fog far off, heat shimmer on).
Reused: ship (1.2a), water (re-tinted deep blue), sky dome.
New: thermometer prop, wave-crest cut-outs, shimmer effect (screen-space sine wobble in a band).

### 1.6 Ice house workshop (beats 10, 11, 12A): warm day inside a plank shed

**Story job:** three packing tests (hay, straw, rice husks) and the time-lapse melt; the seasons window.
Geometry and dressing:
- Plank shed interior (BackSide box): **sunlight slits between the boards** giving thin god rays with dust motes; a beamed roof; a packed-earth floor with scattered straw.
- **Three wooden bins** in a row, each with a **chalk slate sign: "1 · HAY", "2 · STRAW", "3 · RICE HUSKS"** (English; supports the 1-2-3 count). Each bin holds one ice block in its packing.
- **Measuring stick** standing beside each bin (marks only, **no numbers**), so the shrink is visible.
- **Sacks** labelled **"RICE HUSKS"**, a bale of hay, a bundle of straw, pitchfork and shovel (reuse), a lantern, a **workbench** with Tudor's **notebook** (reuse item) and an ink pot.
- A **window** with a real opening: outside is a backdrop plane whose texture flips **snow → leaves → snow** for beat 12 (iris through it).
- A **drip tray** under each bin so meltwater pools on the floor (puddle decals that grow).

Lighting: existing **`warm`** with strong beams (motes on).
Reused: wood, hay, straw (hay re-tinted), pitchfork, shovel, bucket, lantern, notebook, chalk sign style (from the S01 chalkboard), dust motes.
New textures: rice husks (golden speckle), slate signs, three season backdrops, puddle decal.

### 1.7 Ship's hold + the sawdust cutaway (beats 12B, 15B, 17B): dark interior / split warm-cool

**Story job:** the covered crate slid in (12), the hatch opening in Calcutta (15), and the payoff cutaway (17).
Hold geometry and dressing:
- Long dark room: **curved ribs** (frames) every 0.6 m, inner plank lining, deck beams overhead, a **ladder** up to the **hatch opening** (same hatch as the brig deck).
- **Ice blocks** stacked in rows, packed with sawdust between them (sawdust texture); in beat 15 **a few small puddles** on the floor boards (fact-check: "most of the ice"); in 12 a single **canvas-covered crate** being slid in (what's inside is not shown).
- A **light shaft** from the hatch (reuse the S01 spot + beam), dust motes in the shaft, **sparkle glints** on the blocks when the light hits them.
Lighting: **new preset `hold`** (dark, cool fill, a white-gold shaft from the hatch).

**Cutaway diorama (beat 17B)**, its own small group:
- A "cake slice" through the hull wall, read left to right: **outside** (hot orange sky card) → **outer hull planks** → **a thick sawdust layer** (visibly thick, about one block wide) → **inner lining** → **an ice block nested in sawdust** in the middle.
- **Heat arrows**: flat orange-red outlined arrows that come in from the left, **slow down and fade** as they push into the sawdust; **one faint thin arrow** reaches the ice (fact-check fix 7: they never bounce).
- The camera finishes on a **slow push until the ice block fills the frame**, in the same cool blue as the first frame of beat 1 (loop).
Lighting: **new preset `cutaway`** (warm key from the left/outside, cool blue fill on the ice).
Reused: wood, ribs from cylinders, spot/beam, dust motes, sparkle icon, ice texture.
New textures: sawdust (fine tan speckle), heat arrow card.

### 1.8 Sawmill (beat 17A): warm daylight, 1830s

**Story job:** "the stuff sawmills threw away".
Geometry and dressing: an open-sided timber mill on a riverbank; a **water wheel** turning; a vertical **sash saw** (blade in a wooden frame) moving up and down through a log on a **carriage**; **sawdust pouring** from under the saw into a big **heap**, and a **chute** dumping some toward the river (fact-check row 20); stacked boards, logs with bark ends, a cant hook, a sign **"SAWMILL"**; two adult workers; a pine forest backdrop (fine as scenery; "pine" is not said).
Lighting: existing **`warm`** (motes on, sawdust particles).
Reused: wood, `cyl`, dust motes (as sawdust), hand cart, water plane (river tint).
New: water wheel (spoked cylinder), sash-saw frame, sawdust heap mesh (smooth cone, sawdust texture), log end texture.

### 1.9 Cards and insets (2D HUD)

| Card | Beat | Content | Rules |
|---|---|---|---|
| **Year card "1806"** | 3 | A small aged-paper tag pinned at the top of frame, "1806" big, in green (numbers are green) | Doesn't cover the cook's face |
| **Newspaper** | 6 → 7 | Generic masthead **"BOSTON NEWS"**, "1806", a **woodcut-style drawing of a ship** in a column, grey squiggle text; **only "slippery speculation" is readable**. A gull lands on it. | No photo, no tonnage, no real masthead, no date beyond the year (fact-check rows 6, 10, 11) |
| **Letter** | 9 | Folded letter in Eddie's hands with a **drawn puddle and a sad ice cube**, **no words** | Fact-check beat 9 fix |
| **Map** | 13 | Aged parchment, compass rose; labels **BOSTON**, **CALCUTTA**, **AFRICA**, **ATLANTIC OCEAN**, **INDIAN OCEAN**; a dotted line **down the Atlantic, around the southern tip of Africa, up to the Bay of Bengal**; a tiny ship icon rides the line. Unrolls in (paper-roll wipe). | No modern borders. No Suez route. Captions "1833" and "Calcutta (now Kolkata)" sit below the map, not on Africa |
| **Thermometer close-up** | 14 | The deck thermometer; red column climbs | **No numbers on the scale** |
| **Merchant face** | 8 | Reuse the `face` HUD (blurred backdrop) on "what do I do with it?" | Speech bubble from the merchant, never a caption in quote marks |

Map outline: trace a simplified coastline from public-domain Natural Earth 1:110m data if it's available offline; otherwise hand-draw it and check it against an atlas. A wrong-looking Africa or India gets noticed.

### 1.10 Lighting presets

| Preset | New? | Used in | Look |
|---|---|---|---|
| `night` | new | Pond, wharf loading (1) | Deep navy sky and fog close in, cold blue moon key, warm lantern points, snow motes. Ice glows pale blue. |
| `snow` | new | Wharf 1806 (2, 5, 6, 9B, 10A) | Bright grey-white overcast, soft short shadows, falling snow, cool rim. Beat 1 → 2 blends `night` → `snow` = dawn. |
| `warm` | existing | Kitchen (3), workshop (10–12A), Boston 1833 (13B, 16), sawmill (17A) | As in S01. |
| `tropic` | new | Martinique (4, 7, 8, 9A) | Hard high sun, short dark shadows, saturated sky, bright warm bounce. |
| `tropicHaze` | new | Calcutta (15A) | Warmer yellow, more haze and softer shadows than `tropic`, so the two ports feel different. |
| `blaze` | new | Open sea (14) | Overexposed white-orange sun, orange far fog, heat shimmer. |
| `hold` | new (built like `spot`) | Hold (12B, 15B) | Dark cool interior, white-gold hatch shaft, motes. |
| `cutaway` | new | Cutaway (17B) | Warm key from the outside, cool blue fill on the ice; ends cool to match beat 1. |

Each preset also carries its long-shadow strength, vignette colour and mote type (dust, snow, sawdust, heat specks), instead of the current name checks in `stage.js`.

---

## 2. Characters and costumes

Style for everyone (bible + Visual Style): flat cut-outs, thick black outlines, flat white heads with dot eyes and brows, pill-shaped coloured bodies, stick limbs, contact shadows. **One smooth silhouette per piece** (no stacked shapes that leave inner outline "bumps"). Accessories detailed (sheen and band on hats, stitching on coats, buckles, fringe on scarves). Extras get one main accessory each. **All faces stay the same flat white in every port**: identity is carried by clothing, never by changing faces or adding features, which also keeps us clear of caricature.

### 2.1 Eddie as Frederic Tudor
- **1806 look (beats 1, 2, 5, 9):** Eddie's egg head, clean-shaven (keeps him reading as Eddie). **Tall black top hat** with a band and sheen (existing `top`, taller crown); a **dark blue greatcoat with a short caped collar** (a "carrick" capelet: new piece); a **high white collar and cravat** (new piece); waistcoat underneath; **sneakers** kept, as in S01, as the channel trademark (owner can ask for boots instead). Winter: a knitted **scarf** with fringe (new piece) in 1, 2 and 5.
- **1833 look (beats 13B, 16):** the same coat and hat with **grey side-whiskers** (new `sideburns`) and a **cane** (existing item), so 27 years have visibly passed.
- **Props:** an **ice chunk** held up like a jewel (new item with a glint) in 5; the **letter** in 9; the **notebook** in 10–11; he **lifts his top hat** in 16 (new hat-lift pose) and a tiny ice-crown sparkle pops above his head.
- **New acting:** `wave` (hat in hand, waving the ship off: beat 2), `hatDroop` (the hat's crown squashes and sags, a rig parameter, beat 9), `hatLift` (16), `sigh` (with a new **sweat-drop** icon, beat 11), `presentIce` (5).
- **Where he is NOT:** Martinique (7–8) and Calcutta (15). Sources show he sent the ice; his brother and cousin went to the islands (fact-check beat 2). Eddie stays in Boston.

### 2.2 Ice workers, pond (beat 1): 4 adults
Short wool work jackets, **knit caps** (new) or round hats, **mittens** (dark hand dots, new), **scarves**, boots. Each one accessory plus a tool: **long ice saw** (two of them, new item), **ice tongs** (new), **pike pole** (new). All on solid ice away from the channel; no one near a broken edge; no kids anywhere on the pond.
Acting: `saw` (two-beat push/pull, new), `tongsLift` (two-handed lift, new), `pushPole` (new). No poses held over 2 s.

### 2.3 Sailors (beats 1C, 2, 14): 3 adults
Short blue jackets, wide trousers, **knit caps** in Boston, **straw hats** at sea (new `straw` hat). Acting: `hoist` (hauling a rope, new), `coilRope` (new), `wheel` (hands on the wheel).

### 2.4 Crowds
- **Boston 1806 crowd (beats 6, 9B):** reuse the S01 16 extras (c1–c16, the kid on dad's shoulders) with period remaps: **bowlers → top hats, bicornes (older men), knit caps or round hats**; women in **high-waisted Empire dresses** (a high sash line on the pill body: new), **spencer jackets and shawls** (new), **bonnets** (existing). Moods: `laugh` (existing set), plus a new `kneeSlap` and bigger `laughBack` for "laughed harder" in 9.
- **Boston 1833 crowd (beat 16):** same 16 with 1830s touches: frock coats, wider-brim bonnets, **leg-of-mutton sleeves** (puffed upper arm, new), top hats. Mood `cheer` (existing): the same people who laughed now cheer. That reversal is the beat.
- **Kitchen cook (beat 3):** adult woman, **mob cap** (new), apron (existing), rolled sleeves, fanning with her apron.
- **Martinique merchant (beats 4, 8):** a dignified townsman, **cream linen coat**, waistcoat, white cravat, **wide straw hat**, a **palm-leaf hand fan** (new item). Neutral, polite acting: `fan`, `holdAtArm` (holding the dripping block out, puzzled brows, a small smile). His line is said in a neutral voice with no accent. Two or three Martinique townspeople behind (light linen coats, a woman with a parasol and a neat headwrap, one straw-hatted fisherman), all in calm, ordinary town poses: watching, curious.
- **Calcutta merchants and dockworkers (beat 15A):**
  - **Bengali merchants (2):** white **dhoti** (new lower garment), a long fitted **chapkan** coat (new) in white or pale saffron, a folded **shawl** over one shoulder (new), one with a neat **turban** (new, compact and tidy: not oversized), one bareheaded with side-parted hair (existing). One holds a **ledger**, one an **umbrella** (new item).
  - **Dockworkers (3):** white **kurta** and dhoti, cloth **head-wrap** (gamchha), sandals; carrying **rope, a sack and a crate between two** (purposeful work, not loads on heads, no one bowed or servile).
  - **British residents (2):** white linen frock coats, straw hats or top hats (fact-check flag 2: many of the first buyers were British residents).
  - Mood: **interested and pleased** (watch, point at the ship, one claps). No over-the-top amazement, nobody frightened of the ice, no comic gestures.
- **Sawmill workers (17A): 2 adults:** shirtsleeves, waistcoats, round hats; one guides the log, one shovels sawdust (new `shovel` pose).
- **Gull (beat 6, background in 2 and 9):** new flat cut-out animal, two poses (glide, land).

### 2.5 Optional characters: William Tudor / James Savage
**Recommendation: leave them out.** The fact-check says they went to Martinique. Showing a second top-hatted Boston man on the quay would confuse kids ("is that Eddie?"), and the script never names them. In beat 8 the merchant takes the block from a **sailor** instead. If the owner wants accuracy on screen, add one young man in a brown coat and round hat (not a top hat) standing by the gangplank, unlabelled.

### 2.6 New costume pieces for `src/draw.js` (checklist)
Hats: `knit`, `straw`, `mobcap`, `bicorne`, `roundHat` (low crown, wide brim: a variant of the bowler geometry so it never reads as a bowler), `turban`, `headwrap`.
Body/clothes: `capelet` (caped greatcoat collar), `cravat`, `scarf` (fringed), `empire` (high-waist sash), `spencer`, `shawl`, `legOfMutton` sleeves, `dhoti`, `chapkan`, `kurta`, `stockings` (lower-leg colour, for 1806 breeches).
Face: `sideburns`.
Items: `ice` (chunk with glint), `iceBlock` (two-hand, dripping), `saw`, `tongs`, `pike`, `fan`, `letter`, `umbrella`, `ledger`, `lantern`, `shovel`, `rope`.
Rig: `hatDroop`, `hatLift`, mittens (hand colour).
Icons: `sweat` (drop).
Poses: `wave`, `presentIce`, `sigh`, `saw`, `tongsLift`, `pushPole`, `hoist`, `coilRope`, `wheel`, `fan`, `holdAtArm`, `kneeSlap`, `shovel`.
Lineup check: every piece drawn once on a costume sheet (front and three-quarter) before it goes into a scene. That is the first owner review (section 4).

---

## 3. Shot list (17 beats)

Times are the script's estimates (normal pace, 0.12 s gaps). Real times come from the voice timeline. **Captions sit at the bible default (~71% down) unless noted;** the note says where to move them so they never cover a face. "HUD" marks a 2D close-up card.

| # | ~start | Set · light | Shots: framing → camera move | Hero object | Transition in | On screen | Caption note | HUD |
|---|---|---|---|---|---|---|---|---|
| 1 | 0.0 | Pond → Wharf · `night` | **A** (0–1.2 s) Extreme close-up: a clear ice block face fills the frame, cool blue; a saw blade bites in from the top, chips fly. Slow pull back. **B** (1.2–2.3) Low angle from ice level, a lantern in the near foreground: two workers lift a block with tongs, two saw behind; shed and farmhouse light in the back. Slight push in. **C** (2.3–3.5) Wharf at night, low angle from the deck by the hatch: the block slides down a plank into the hatch on the hoist; Eddie-Tudor on the wharf points at the hold. | Ice block | Cold open (loop target: matches 17's last frame) | Snow falling, lantern pools, the brig's hatch | A: caption at 0.82 (block face only, no faces). B/C: faces upper third; default. | — |
| 2 | 3.6 | Wharf · `snow` (blend from night = dawn) | **A** (0–0.8) Continuing the push: camera rises out of the hatch over the deck. **B** (0.8–2.9) Wide from the end of the wharf, low behind a bollard (foreground depth): the *Favorite* pulls away, sails dropping open, stern board readable; Eddie on the wharf waves, hat in hand; gulls. | Stern board "FAVORITE · BOSTON" | push (rides the block into the hold, out over the deck) | Ship moving, wake, snow | Eddie stands at screen left mid-height; caption default, centred under the ship | — |
| 3 | 6.6 | Kitchen · `warm` | **A** Medium from low behind the table, the sweating jug in the foreground (out-of-focus scale), cook fanning herself behind; slow push toward the jug. On "fridges": the dashed fridge outline pops in beside the dresser and pops away. | Sweating jug | whip | Year card "1806" top of frame | Cook's face is upper-mid; caption at 0.80 | **card "1806"** |
| 4 | 10.2 | Martinique quay · `tropic` (no caption name) | **A** Low angle on a cup of water on a stall in blazing sun, heat shimmer above it (foreground hero), the merchant fanning himself under a striped awning behind. Slow crane up to the awning. | Cup of water | wipe (sun-flare colour) | Shimmer, palms, white walls | Merchant upper half; default | — |
| 5 | 13.1 | Wharf · `snow` | **A** Match: the round ice chunk enters the same screen spot and size as beat 4's sun. Close-up of the chunk held up like a jewel, glint. **B** (on "Frederic Tudor") pull back to a medium of Eddie holding it up, warehouses behind. | Ice chunk | match (round sun → round ice chunk) | Name caption "Frederic Tudor" | Name caption under the chunk, at 0.78; Eddie's face above | — |
| 6 | 16.8 | Wharf · `snow` | **A** (0–2.0) Whip to the crowd behind a rope of barrels: over-the-shoulder from behind Eddie's hat (foreground), the crowd laughs and points; kid on dad's shoulders. **B** (on "newspaper") HUD newspaper close-up, slight push toward "slippery speculation"; at about 4.0 s a gull lands on the paper corner. Ends framed on the woodcut ship. | Newspaper | whip | "BOSTON NEWS / 1806", only "slippery speculation" readable | A: crowd faces sit high; caption 0.84. B: caption below the paper | **newspaper** |
| 7 | 21.9 | Martinique quay · `tropic` | **A** Zoom out of the woodcut ship into the real harbour: high wide over the quay as the *Favorite* docks, Mont Pelée behind, sailors throwing lines. Slow descending crane. | The ship docking | zoom (out of the woodcut drawing) | Caption "Martinique" | Wide shot, faces small; default | — |
| 8 | 25.0 | Martinique quay · `tropic` | **A** Medium, low angle from the quay steps: a sailor hands the merchant a dripping block; he holds it at arm's length, polite and puzzled; drips, a puddle starts. Townspeople watch behind (calm). **B** (on "what do I do with it?") merchant face close-up, speech bubble. | Dripping block | cut | Speech bubble with his line (no quote marks) | A: default. B: face centred at 0.38, bubble upper right, caption at 0.84 | **face (merchant)** |
| 9 | 30.0 | Martinique → Wharf · `tropic` → `snow` | **A** (0–1.6) Top-down low angle on the dock planks: the puddle spreads and fills the frame. **B** (1.6–4.6) Match to wet Boston cobbles; tilt up to Eddie reading the letter; letter insert; his top hat droops; whip to the crowd laughing harder (knee slap, laugh back). | Puddle / letter | match (puddle → wet cobbles) | Letter with a drawn puddle, no words | B: Eddie's face upper third; caption 0.82 | **letter** (short insert) |
| 10 | 34.7 | Wharf ice-house door → Workshop · `warm` | **A** (0–0.5) The "ICE HOUSE" door swings open, camera pushes through the open doorway. **B/C/D** One quick shot per material, each a new angle: bin 1 HAY (low, from the side), bin 2 STRAW (high three-quarter), bin 3 RICE HUSKS (close, Eddie writing in the notebook behind). On-screen count 1, 2, 3 lands with each word. | The three bins | push (through the shed door; the door is open first) | Slate signs "1 · HAY", "2 · STRAW", "3 · RICE HUSKS"; count in green | Bins sit low; captions at 0.62 for these three shots (above the bins, below faces) | — |
| 11 | 39.6 | Workshop · `warm` | **A** Wide, locked camera, low behind the measuring sticks: time-lapse, the light beams sweep across the floor, the three blocks shrink a lot but **not to nothing**, puddles spread. Eddie sighs, sweat-drop icon. | Shrinking blocks | cut | Blocks and puddles | Default | — |
| 12 | 42.0 | Workshop → Hold · `warm` → `hold` | **A** (0–1.4) Push toward the workshop window: snow → leaves → snow outside. **B** (1.4–2.8) Iris opens in the hold: a canvas-covered crate is slid in down the hatch light. *(Trim option A cuts this beat.)* | Window / covered crate | iris (window) | Seasons flipping | Default | — |
| 13 | 44.9 | Map → Wharf 1833 · `warm` | **A** (0–2.6) Map unrolls, the dotted line runs Boston → around Africa → Calcutta, ship icon moving. **B** (2.6–4.2) Wharf 1833, low angle from the water: the three-masted *Tuscany* sets sail, stern board readable. | Map route | wipe (map unrolls) | "1833", "Calcutta (now Kolkata)" | A: captions under the map, not on Africa or India. B: default | **map** |
| 14 | 49.3 | Open sea · `blaze` | **A** Whip to a very low angle off the bow wave, ship crashing through, sun huge behind the sails. **B** (on "hottest") close-up on the deck thermometer, the red column climbing (no numbers), sailor's straw hat edge in the foreground. *(Trim option B drops "Four months at sea.")* | Thermometer | whip | Caption "about 15,000 miles" (numbers green) | A: no faces; default. B: caption 0.84 | **thermometer** (or a 3D close-up) |
| 15 | 53.9 | Calcutta riverfront → Hold · `tropicHaze` → `hold` | **A** (0–1.6) Wide from the ghat steps, foreground brass pots and a clay jar: the *Tuscany* moored, merchants, dockworkers and residents gathered with interest; camera cranes up and **pushes down toward the hatch**. **B** (1.6–4.2) Low angle from inside the hold looking up: the hatch cover swings open, light floods in, the ice blocks gleam (sparkles), a few small puddles; faces look down over the hatch rim. | Hatch and ice | push (down into the hatch) | The real blocks, "most" of them | A: crowd faces mid-frame; caption 0.84. B: faces at the top rim; default | — |
| 16 | 58.2 | Wharf 1833 · `warm` | **A** Low angle medium on Eddie (older look, cane), the 1833 crowd cheering behind him; he lifts his top hat, ice-crown sparkle pops above his head. Small push in. | Top hat | cut | Ice-crown sparkle | Eddie centred upper-mid; caption 0.82 | — |
| 17 | 60.5 | Sawmill → Cutaway · `warm` → `cutaway` | **A** (0–2.2) Low angle beside the sash saw: the blade cuts, sawdust pours into the heap in the foreground; the water wheel turns behind. Push toward the heap. **B** (2.2–5.5) Match: sawdust heap → the sawdust layer in the hull-wall cutaway. Heat arrows come in from the left, slow and fade in the sawdust, one faint arrow reaches the ice. Slow push in **until the ice block fills the frame** (cool blue), the same framing as beat 1's first frame. Hard stop. | Sawdust layer and ice block | match (sawdust heap → sawdust in the hold wall) | Heat arrows, the cutaway layers | A: workers' faces high; default. B: caption at 0.84 so it never sits on the block's centre | — |

**Rhythm check:** 32 shots in about 66 s, about one new angle every 2.1 s; the longest single shot is beat 11 (about 2.3 s with motion inside it) and 17B (3.3 s with a continuous push and animated arrows). OK with the bible's "every 2–4 s".

**HUD close-up beats:** 3 (year card), 6 (newspaper), 8 (merchant face), 9 (letter), 13 (map), 14 (thermometer).

**Loop:** 17's last frame and 1's first frame are both a clear ice block filling the frame, cool blue, block edges at the same screen position. Check them side by side on the review board.

---

## 4. Build plan for the animator

In order. Effort is a rough estimate of focused hours for one animator; the total is about **44–58 h**. Each step ends with a still the art director checks before the next one starts.

| # | Step | Effort | Done when |
|---|---|---|---|
| 1 | **Engine prep.** Move the `world.js` helpers into an exported kit (courtyard still renders the same: compare one S01 still before/after). Multi-set support in `stage.js` (`set:` per beat/shot, visibility toggle, per-set light handles). Make Hans, board, screen, doors, taps and the beat-7 march optional. Height (`y`) in `pos`. Presets carry their own shadow/vignette/motes. | 6–8 h | An S01 still matches the shipped S01 frame; an empty test set switches in by name |
| 2 | **Transitions and effects**: real `match` (dissolve with aligned framing), `iris`, coloured `wipe` (flare, paper unroll); snow/sawdust/heat motes; heat shimmer; drips and puddle decals; heat arrows; ship track keys. | 4–5 h | A test strip of each transition |
| 3 | **Costume pieces and poses** (section 2.6) and the **costume lineup sheet**. Fix the S01 bowlers and the gas-lamp head for this episode. | 6–8 h | Lineup sheet approved (owner review round 0) |
| 4 | **Ship** (1.2a): hull, deck, hatch, masts, furled and set sails, ratlines, gangplank, stern boards, two/three-mast variants, bob and wake; **water** (harbour, sea, river tints). | 7–9 h | Turnaround stills of brig and ship, docked and sailing |
| 5 | **Boston Wharf** (1806 snow dressing and 1833 re-dress, ice-house door). | 5–6 h | Empty-set stills, both dressings |
| 6 | **Frozen Pond.** | 3–4 h | Empty-set still at night with lanterns |
| 7 | **Tropical Harbour** base + Martinique and Calcutta dressings + backdrops. | 6–8 h | Two empty-set stills side by side that read as two different places |
| 8 | **Hold + cutaway.** | 3 h | Hold with shaft; cutaway with arrows |
| 9 | **Workshop**, **Kitchen**, **Sawmill** (smaller sets). | 4–5 h | One still each |
| 10 | **HUD cards**: year card, newspaper, letter, map (with a checked coastline), thermometer. | 3–4 h | Each card alone at 1080 × 1920 |
| 11 | **Beats file** `content/s02-ice-king.beats.mjs` with the scriptwriter: cameras and acting from section 3; local voice first (free, Piper) so the timings are real. | 4–5 h | `--preview` runs with no errors |
| 12 | **Review board**: the stills below, labelled, into `deliver/s02-ice-king-review.jpg`. **Owner approves pictures before any full render.** | 1 h | Board delivered |

### Owner review rounds (pictures before video)
- **Round 0 (after step 3–10): look development.** Costume lineup sheet (Eddie 1806/1833, pond workers, sailors, Boston 1806 and 1833 extras, cook, Martinique merchant and townspeople, Calcutta merchants, dockworkers and residents, sawmill workers, gull); empty-set stills of all nine sets; the brig/ship turnaround; Martinique vs Calcutta side by side; the five HUD cards. This is where the owner judges respect, period detail and background richness, before we spend time on acting.
- **Round 1 (after step 11): story stills.** The 34 stills below.

### Round 1 still list (`--preview` times)
The times are **beat start + offset**. Absolute times are the script estimates; **re-read the beat starts from the voice timeline in `projects/s02-ice-king/` and recompute before running**, because the Piper voice runs slower than the estimate.

| Still | Beat + offset | ~abs (s) | Check |
|---|---|---|---|
| 1 | B1 + 0.2 | 0.2 | Loop frame: block fills frame, saw entering |
| 2 | B1 + 1.6 | 1.6 | Workers on solid ice, away from the channel; tools in adult hands |
| 3 | B1 + 2.9 | 2.9 | Block into the hatch; Eddie on the wharf, not on the plank |
| 4 | B2 + 1.6 | 5.2 | Ship moving, stern board readable, Eddie waving from the wharf |
| 5 | B3 + 1.6 | 8.2 | Kitchen detail, sweating jug, "1806" card clear of the cook's face |
| 6 | B3 + 2.6 | 9.2 | Fridge outline joke reads |
| 7 | B4 + 1.4 | 11.6 | Shimmer, merchant dignified |
| 8 | B5 + 0.4 | 13.5 | Match frame: chunk where the sun was |
| 9 | B5 + 2.4 | 15.5 | Name caption under the chunk, not on the face |
| 10 | B6 + 1.0 | 17.8 | Crowd laughing, foreground hat, no one inside the barrels |
| 11 | B6 + 4.3 | 21.1 | Newspaper: only "slippery speculation" readable, gull on corner |
| 12 | B7 + 1.6 | 23.5 | Martinique wide: white walls, red roofs, Mont Pelée |
| 13 | B8 + 1.2 | 26.2 | Sailor hands over the block on the quay (feet on stone, not in water) |
| 14 | B8 + 3.6 | 28.6 | Face close-up + bubble, no caption on the face |
| 15 | B9 + 1.0 | 31.0 | Puddle shot |
| 16 | B9 + 2.6 | 32.6 | Letter: drawing, no words; hat droop |
| 17 | B9 + 4.0 | 34.0 | Crowd laughing harder (bigger than still 10) |
| 18 | B10 + 0.3 | 35.0 | Door already open as the camera passes |
| 19 | B10 + 1.3 | 36.0 | 1 · HAY |
| 20 | B10 + 2.6 | 37.3 | 2 · STRAW |
| 21 | B10 + 3.9 | 38.6 | 3 · RICE HUSKS |
| 22 | B11 + 1.8 | 41.4 | Blocks small but not gone; sweat drop |
| 23 | B12 + 0.8 | 42.8 | Season window |
| 24 | B12 + 2.2 | 44.2 | Covered crate in the hold |
| 25 | B13 + 2.0 | 46.9 | Map: route around Africa, captions clear of land |
| 26 | B13 + 3.6 | 48.5 | *Tuscany* with three masts leaving Boston, 1833 crowd |
| 27 | B14 + 1.2 | 50.5 | Sea, sun, bow wave |
| 28 | B14 + 3.4 | 52.7 | Thermometer, no numbers; caption "about 15,000 miles" |
| 29 | B15 + 1.0 | 54.9 | Calcutta: arcades, ghat, canopies, respectful crowd |
| 30 | B15 + 3.0 | 56.9 | Hold looking up: light, ice gleams, a few puddles |
| 31 | B16 + 1.2 | 59.4 | Eddie 1833, hat lift, crown sparkle, cheering crowd |
| 32 | B17 + 1.4 | 61.9 | Sawmill: sash saw, sawdust pouring |
| 33 | B17 + 3.4 | 63.9 | Cutaway: arrows slow and fade, one faint arrow reaches the ice |
| 34 | B17 + 5.4 | 65.9 | Last frame = still 1 (place them side by side on the board) |
| 35 | cameo frame | set by the beats | **Log cameo (owner decision 2026-11-17):** one frame through the open upper Martinique window (`cameoSpot` in `src/harbour.js`, `meta.cameo = { t, pos: cameoSpot, set }`), in beat 7 or 8; add its exact time here once the voice timeline exists. *(Added by the animator.)* |

Command (once the beats file exists and the voice is made):
`node render-episode.mjs content/s02-ice-king.beats.mjs projects/s02-ice-king --3d --preview 0.2,1.6,2.9,5.2,8.2,9.2,11.6,13.5,15.5,17.8,21.1,23.5,26.2,28.6,31.0,32.6,34.0,35.0,36.0,37.3,38.6,41.4,42.8,44.2,46.9,48.5,50.5,52.7,54.9,56.9,59.4,61.9,63.9,65.9`

**Every still gets the standard check:** clipping (people through walls, rails, barrels, the gangplank, the hatch rim), floating or sunken people (height support), held poses, captions on faces, unreadable or non-English prop text, anything blocking the camera, and anachronisms (section 0 list).

---

## 5. Risks and simple fixes (flat cut-out-in-3D style)

| Risk | Why it's a risk | Simple fix |
|---|---|---|
| **Ship complexity** | Rigging and sails can eat days and still look busy at phone size | Hero-detail only where the camera goes: hull outline, stern board, hatch, rail. Rigging = ladder-texture planes plus a few lines. Sails furled as cylinders when docked. One hull for both ships, a third mast for the *Tuscany*. |
| **Water** | Real water shaders are slow and off-style | Flat plane with a painted wave-stripe texture scrolling slowly; flat outlined wave-crest cut-outs at the bow; a white foam ring at the hull; a darker band under the hull instead of reflections. Three tints: harbour, sea, river. |
| **Ice looking like plastic or glass** | Transmission materials are expensive and noisy | Pale blue standard material with a painted crack-and-bubble texture, a bright rim, an ink outline and sparkle sprites when lit. Tint per light: blue at night, white-gold in the hold. |
| **People on the ship, gangplank, quay steps and ghat** | The stage only places people at y = 0 | Height support (build step 1). Until it exists, keep everyone on flat ground and frame decks from below the rail so feet are hidden. |
| **Clipping** | Owner caught walls, a screen and props passing through people in S01 | Every walk path planned on a top-down sketch per set; rails, barrels and gangplanks exist from frame 0; people walk behind them; the ice-house door and hatch open **before** the camera or a person goes through; contact shadows on every person. |
| **Two ports looking the same** | One set re-dressed | The comparison table in 1.4 changes colour, roofline, shade, water, trees, boats, backdrop and light. Round 0 shows them side by side. |
| **Respectful depiction** (safety flag 2) | Colonial Martinique and Calcutta | Ordinary town waterfronts; dignified merchants in accurate dress; dockworkers shown working with purpose; mixed crowd including British residents in Calcutta; no plantations, chains, shirtless figures or "exotic" props; neutral voice; same faces for everyone. Owner reviews at Round 0. |
| **Kid safety on the pond** (safety flag 1) | Ice cutting looks fun to copy | Adults only, solid ice, distance from the open channel, "WORKERS ONLY" sign, nobody slips or falls. |
| **Anachronisms** | S01 props carry 1904 details | Section 0 list: no bowlers, gas lamps, circular saws, steamers, photos, Suez. Period check on every still. |
| **Map accuracy** | A sloppy Africa or India is noticed and commented on | Trace public-domain coastline data or check a hand drawing against an atlas; route around the Cape of Good Hope. |
| **Text legibility** | Small props on a phone | Signs short (one to three words), big serif lettering, English, framed fully in the shots that show them (S01 "FREE ADMISSION" lesson). |
| **Loop seam** | First and last frames shot in different sets | Same ice texture, same framing and the same cool blue light; check side by side. |
| **Render time** | S01 took about 45 min; S02 has nine sets | Build all sets once and toggle visibility; shadow map sized per set; keep the courtyard out of this episode. Use `--preview` stills until the owner approves. |
| **Length** | Piper reads slower (about 72 s untrimmed) | Every shot list beat is cut so trims A and B drop cleanly (beat 12 is self-contained; beat 14 shot B can start later). |
| **HUD-to-3D zoom (beat 6 → 7)** | Different render layers | End the newspaper HUD scaled up on the woodcut ship, flash, then open in 3D with the real ship at the same screen spot. |

---

## Open questions for the owner (through the manager)
1. Eddie keeps his **sneakers** in costume (as in S01), or period boots for this one?
2. Show **William Tudor** (unnamed) in Martinique, or leave him out as recommended?
3. Should the **log cameo** easter egg from S01 return (for example in a Boston warehouse window for one frame)?
4. Trims A and B: the shot list works with or without them; the manager decides after the voice timing.

---

## Hand-off note (art director → youtube-manager)
**Done (plan stage).** Art direction and storyboard for s02-ice-king: nine sets with full dressing and lighting, costumes for every character, a 17-beat shot list (32 shots) with camera moves, transitions, hero objects, caption positions and HUD beats, a 12-step build plan (about 44–58 h) and a 34-still review list. File: `/home/user/stick-with-eddie/studio/briefs/s02-ice-king-art.md`.
- **Key findings from the code:** the stage only knows the S01 courtyard; it needs multi-set support, height for people on decks and quays, and real `match`/`iris` transitions (both currently play as cuts). The set helpers need to be exported as a kit. This is build step 1.
- **Period fixes:** no bowlers, no gas lamps, sash saw not circular, sail only, woodcut not photo, route around Africa.
- **Fact-check honoured:** Eddie-Tudor stays in Boston (never in Martinique or Calcutta); hat droop in Boston; letter without words; no tonnage, no numbers on the thermometer; "about 15,000 miles"; heat arrows slow and fade; "most of the ice"; adults only on the pond; respectful ports.
- **Not done (by brief):** no code, no renders, so the review board `deliver/s02-ice-king-review.jpg` does not exist yet. It comes after the build (Round 0 look-dev, then Round 1 story stills).
- **Open:** the four owner questions above.
- No paid credits used; nothing published; no schedule dates touched.
