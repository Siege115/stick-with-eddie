# Editing Resources - Color Grading & Cinematic Lighting

**222 techniques, controls, looks and practical variants across 12 categories**

This is a searchable reference for cinematic edits, including **Roblox / Anime Breaker**, gaming guides, and faceless Shorts. It includes film color controls, lighting patterns, effects and workflow terminology. Some terms overlap and are not all individual presets.

## Core ideas

- **Color correction** fixes exposure, white balance, and contrast so footage looks consistent.
- **Color grading** introduces a deliberate mood or visual style after correction.
- **Lighting** shapes the appearance of a subject using actual scene light; grading mostly modifies already-recorded pixel values.
- **Game footage reality check:** A new lighting direction cannot usually be recreated convincingly from a single flattened game recording. Record in a different environment or use the game camera/lighting when possible.
- **Readability first:** Keep code text, boss HP, path landmarks and captions visible; avoid crushed blacks and oversaturated highlights.

## Five-second demo guide

| Time | Look | What changes |
|---|---|---|
| 0:00-0:01 | Natural / clean | Neutral white balance and even exposure; baseline. |
| 0:01-0:02 | Golden hour | Warm highlights and amber ambient fill. |
| 0:02-0:03 | Teal & orange | Cool shadows, warmer foreground accents, balanced saturation. |
| 0:03-0:04 | Moody / low key | Deepened shadows and a focused bright subject. |
| 0:04-0:05 | Rim light & bloom | Strong edge separation plus a controlled luminous halo. |

The video uses one **stylized demonstration scene** in five looks. The animated before/after wipe is a side-by-side grading comparison; lighting changes are illustrative simulated overlays, not a replacement for real in-game lighting.

## Practical workflow for a Roblox Short

1. **Correct:** adjust exposure, temperature, tint, and contrast before adding style.
2. **Match:** check that clips from the same map do not jump unexpectedly between brightnesses.
3. **Grade:** choose one look and use it subtly (not all five at once).
4. **Focus:** apply a small tracked vignette or local brightness correction where the subject needs separation.
5. **Finish:** check UI, captions, boss HP, and routes before exporting the finished clip.

## CapCut mobile starting settings (illustrative, not universal)

- Neutral: start with exposure/brightness and white balance; leave saturation near default.
- Golden hour: slightly increase warmth and highlights; preserve natural blues.
- Teal & orange: cool the shadows, warm selective highlights, then lower overall saturation slightly if too vivid.
- Moody: reduce exposure a little, add contrast, lift the subject region rather than crushing all blacks.
- Glow: duplicate the highlight layer, add blur, and blend lightly if your editor offers suitable controls.

**Caution:** There is no single correct numeric slider recipe because source recordings and editing apps vary. Use the before/after view to decide whether the grade helps the story.

## 01  |  Exposure and tonal foundation

| Term / technique | Quick definition | Example use |
|---|---|---|
| **Exposure correction** | Make an image brighter or darker overall. | Fix an underexposed boss reveal before styling. |
| **Brightness adjustment** | Shift apparent brightness with a basic editor control. | Correct an overly dim clip quickly. |
| **Contrast** | Increase or reduce light-dark separation. | Create stronger subject separation. |
| **Contrast pivot** | Choose which luminance range stays stable while contrast changes. | Avoid crushing the midtone details. |
| **Lift** | Adjust dark tonal regions with a primary wheel. | Give dark scenes a subtle colored shadow. |
| **Gamma** | Shift midtone brightness without changing both endpoints equally. | Brighten an avatar without washing out the sky. |
| **Gain** | Adjust bright tonal regions with a primary wheel. | Tame luminous weapons or portals. |
| **Offset** | Shift exposure uniformly across tonal values. | Correct overall luminance before fine tuning. |
| **Black point** | Define the darkest useful tone. | Keep the bottom of the frame deep but readable. |
| **White point** | Define the brightest useful tone. | Avoid harsh pure-white highlights. |
| **Black level lift** | Raise deep shadows above pure black. | Make a moody edit feel softer and hazier. |
| **Black crush** | Push dark values into solid black. | Use carefully for dramatic silhouettes. |
| **White clipping** | Force bright values to maximum output. | Avoid clipping game HUD details. |
| **Highlight recovery** | Bring down excessively bright regions. | Recover bright sky or energy flare texture. |
| **Shadow recovery** | Lift detail out of dark areas. | Show the route in a shadowed alley. |
| **Highlight roll-off** | Transition gracefully toward bright whites. | Keep portal glow soft, not flat. |
| **Shadow roll-off** | Control how dark values taper to black. | Preserve texture in dark buildings. |
| **Tone mapping** | Compress high dynamic range into a viewable output range. | Protect bright magic effects and deep shadows. |
| **Local contrast** | Increase contrast within nearby image regions. | Make armor textures read clearly. |
| **Clarity adjustment** | Boost or reduce perceived mid-frequency detail. | Use sparingly on busy Roblox UI. |

## 02  |  White balance and primary color

| Term / technique | Quick definition | Example use |
|---|---|---|
| **White balance** | Correct unwanted warm or cool casts. | Match clips recorded in different maps. |
| **Color temperature** | Shift the image toward warm amber or cool blue. | Suggest sunset or a cold dungeon. |
| **Tint adjustment** | Shift the green-magenta balance. | Remove a greenish cast from a clip. |
| **RGB channel balance** | Adjust red, green and blue channels separately. | Fix an uneven color cast. |
| **Primary color wheels** | Control large tonal ranges before selective work. | Set a cohesive overall look. |
| **Shadow tint** | Color the darkest regions independently. | Introduce cool shadows in a battle scene. |
| **Midtone tint** | Color the primary subject tones. | Keep an avatar readable after grading. |
| **Highlight tint** | Color brighter parts of the scene. | Make energy highlights lean golden. |
| **Global tint** | Apply one subtle color bias throughout. | Unify footage from different locations. |
| **Split toning** | Give shadows and highlights different colors. | Create warm light and cool shade. |
| **Three-way color correction** | Grade shadows, midtones and highlights separately. | Create dimensional color separation. |
| **Four-way color correction** | Add overall/global adjustments to three tonal ranges. | Fine-tune a finished edit. |
| **Printer lights** | Adjust channel exposure as if using film printer lights. | Make subtle film-style color trims. |
| **Color cast removal** | Neutralize an unintended overall hue. | Fix a scene that looks too purple. |
| **Neutral reference matching** | Grade using a known gray/white neutral. | Keep a white game menu truly neutral. |
| **Skin-tone preservation** | Protect face hues during a creative grade. | Keep visible avatar faces natural. |
| **Hue rotation** | Move a chosen hue around the color wheel. | Recolor a supporting accent deliberately. |
| **Chroma balance** | Balance the strength of competing colors. | Prevent backgrounds overpowering captions. |
| **Saturation** | Increase or decrease total color intensity. | Pull back neon colors behind instructions. |
| **Vibrance** | Preferentially boost muted colors versus highly saturated ones. | Keep bright effects from becoming harsh. |

## 03  |  Curves and selective color controls

| Term / technique | Quick definition | Example use |
|---|---|---|
| **RGB curve** | Remap red, green and blue channel values. | Build a signature look without a preset. |
| **Luma curve** | Remap brightness without directly moving hue. | Improve midtone visibility. |
| **S-curve** | Deepen shadows and lift highlights for contrast. | Make a flat capture feel punchier. |
| **Reverse S-curve** | Reduce contrast by raising shadows and lowering highlights. | Create a gentle matte look. |
| **Curves toe** | Shape the darkest part of a tone curve. | Soften black shadows gradually. |
| **Curves shoulder** | Shape the brightest part of a tone curve. | Control harsh bright effects. |
| **Hue vs Hue** | Reposition one chosen color family. | Change an overly cyan sky toward blue. |
| **Hue vs Saturation** | Increase or decrease saturation in a selected hue. | Quiet neon green areas. |
| **Hue vs Luma** | Brighten or darken one color family. | Make yellow interface markers stand out. |
| **Luma vs Saturation** | Change saturation based on brightness. | Avoid oversaturated highlights. |
| **Saturation vs Saturation** | Change colors depending on their existing saturation. | Protect already vivid effects. |
| **Color warper** | Reposition and reshape ranges of color on a grid. | Refine complex animated color palettes. |
| **HSL qualifier** | Select pixels by hue, saturation and brightness. | Color an enemy while leaving background alone. |
| **Hue qualifier** | Select a color based primarily on its hue. | Target red attacks for grading. |
| **Luma qualifier** | Select based on brightness rather than color. | Isolate only the brightest portal areas. |
| **Secondary correction** | Change one portion of the image instead of the whole frame. | Give a boss a brighter silhouette. |
| **Selective desaturation** | Mute background colors while preserving the subject. | Focus attention on the important item. |
| **Selective color isolation** | Preserve one accent color and reduce others. | Highlight a rare drop icon. |
| **Power window** | Grade a defined circular or custom region. | Lighten a boss without touching captions. |
| **Tracked power window** | Make a local grade follow a moving subject. | Keep a brightened character centered in action. |

## 04  |  Popular cinematic color looks

| Term / technique | Quick definition | Example use |
|---|---|---|
| **Neutral cinematic** | Natural colors with intentional contrast and controlled highlights. | Good default for instructional videos. |
| **Teal and orange** | Cool cyan shadows paired with warmer subjects. | Help the player separate from the environment. |
| **Golden-hour grade** | Warm highlights, elongated gentle contrast and natural shadows. | Make a victory scene feel triumphant. |
| **Blue-hour grade** | Soft cool hues with moderate, subdued contrast. | Set up a mysterious reveal. |
| **Low-key grade** | Dark image with selected bright focal points. | Introduce a powerful boss. |
| **High-key grade** | Mostly bright tonal values and light shadows. | Create an upbeat guide segment. |
| **Desaturated dramatic** | Low saturation with pronounced contrast. | Emphasize a dangerous encounter. |
| **Pastel grade** | Light, soft, low-contrast color palette. | Make a casual faceless explainer feel calm. |
| **Vibrant game grade** | Strong but controlled color saturation and contrast. | Show off a new map or cosmetic. |
| **Moody cool grade** | Cool shadows and restrained highlights. | Give a dungeon a threatening mood. |
| **Warm nostalgic grade** | Soft amber highlights and gently faded shadows. | Use for progress montages. |
| **Monochrome** | Remove color and focus on shape and value. | Build a dramatic failure moment. |
| **Sepia** | Color the image in warm brown tones. | Create a flashback insert. |
| **Duotone** | Map the image mostly to two colors. | Make a graphic reaction insert. |
| **Tri-tone palette** | Use three chosen main colors to stylize an image. | Brand a short intro consistently. |
| **Bleach bypass look** | Muted color with strong silvery contrast. | Add tension to a showdown. |
| **Cross-processed look** | Unusual color shifts reminiscent of mismatched film processing. | Use for stylized surprises. |
| **Day-for-night grade** | Make daytime footage appear nocturnal through exposure/color changes. | Suggest a night scene with caveats. |
| **Winter-cool grade** | Cool cyan-blue palette and less warm saturation. | Introduce a snow-themed map. |
| **Autumn-warm grade** | Warm oranges and softer greens. | Create a cozy seasonal atmosphere. |

## 05  |  Film texture and optical finishing

| Term / technique | Quick definition | Example use |
|---|---|---|
| **Film emulation** | Reproduce the broad tone and color behavior of a film stock. | Add cohesion to a cinematic montage. |
| **Film-print emulation** | Simulate the contrast and color of projected film prints. | Create punchier highlight handling. |
| **Film grain** | Add small, changing texture to an image. | Tie footage and overlays together. |
| **Fine grain** | Use delicate texture barely seen at normal scale. | Avoid overpowering UI text. |
| **Coarse grain** | Use visible grain for rougher style. | Create a gritty cinematic interlude. |
| **Halation** | Give intense highlights reddish or warm halos. | Make light sources feel more analog. |
| **Bloom** | Spread bright highlights into their surroundings. | Make a boss ability look luminous. |
| **Diffusion** | Soften highlight edges without fully losing detail. | Make footage less digitally sharp. |
| **Soft-focus filter** | Reduce high-frequency detail for a dreamy look. | Use on an emotional montage beat. |
| **Vignette** | Darken or brighten image edges. | Center focus on the player. |
| **Color vignette** | Tint edges separately from the middle. | Create subtle color depth. |
| **Light leak** | Layer irregular bands of colored light. | Stylize a scene change briefly. |
| **Lens flare** | Add optical flare shapes to bright sources. | Accent a reveal without obscuring it. |
| **Anamorphic streak** | Add horizontally stretched light flares. | Highlight an energy or light source. |
| **Gate weave** | Simulate tiny frame registration shifts. | Make an archival-style insert. |
| **Chromatic aberration** | Separate color channels slightly at edges. | Use very lightly, if at all, in guides. |
| **Lens dirt** | Show dust/smudges against glare. | Add realism to cinematic scenes sparingly. |

## 06  |  Fundamental light direction and setups

| Term / technique | Quick definition | Example use |
|---|---|---|
| **Key light** | The dominant light shaping the subject. | Illuminate a boss's face or armor. |
| **Fill light** | Soften shadows created by the key. | Preserve detail in a dark character. |
| **Backlight** | Illuminate a subject from behind. | Separate a character from a bright map. |
| **Rim light** | Create a narrow highlight at the subject outline. | Make a sword-bearing avatar pop. |
| **Kicker light** | Add a smaller side/back accent light. | Add sculpting to a character pose. |
| **Top light** | Illuminate from directly above. | Create a dramatic arena entrance. |
| **Underlight** | Illuminate from below. | Make a boss seem ominous. |
| **Side light** | Light the subject predominantly from one side. | Give an avatar stronger depth. |
| **Frontal light** | Illuminate the subject from the camera side. | Keep a tutorial clip clear and neutral. |
| **Three-point lighting** | Use key, fill and backlights together. | A balanced character reveal setup. |
| **High-key lighting** | Use a bright, low-shadow arrangement. | Showcase rewards or upbeat content. |
| **Low-key lighting** | Use selective light with large dark regions. | Build suspense before combat. |
| **Rembrandt lighting** | Form a small light triangle on the shadow-side cheek. | A portrait-oriented facial look. |
| **Butterfly lighting** | Place key high and centered for symmetrical shadows. | Useful for stylized hero portraits. |
| **Split lighting** | Light approximately half of the subject's face. | Suggest conflict or duality. |
| **Loop lighting** | Place a small nose shadow angled to one side. | Give faces natural dimension. |
| **Broad lighting** | Illuminate the side of the face turned toward the camera. | Soften face contours. |
| **Short lighting** | Illuminate the side of the face turned away from camera. | Give portraits more dramatic sculpting. |
| **Clamshell lighting** | Combine soft light above and below a face. | Create clean, flattering character portraits. |
| **Silhouette lighting** | Expose background while leaving subject largely unlit. | Create a mysterious boss entrance. |

## 07  |  Light quality, distance, and motivation

| Term / technique | Quick definition | Example use |
|---|---|---|
| **Hard lighting** | Small/distant apparent source creates crisp shadows. | Make combat feel intense. |
| **Soft lighting** | Large apparent source creates gentle shadow edges. | Create readable guide footage. |
| **Directional lighting** | Light arrives predominantly from one direction. | Suggest strong sunlight. |
| **Diffuse lighting** | Light scatters broadly with few strong shadows. | Keep location walkthroughs clear. |
| **Motivated lighting** | Place light where a believable source would exist. | Let a portal appear to light the player. |
| **Practical lighting** | Use visible in-scene lights as part of composition. | Show lanterns or screens in a scene. |
| **Ambient lighting** | Provide broad baseline illumination across the environment. | Prevent dark maps from hiding routes. |
| **Bounce lighting** | Reflect light from one surface onto another. | Give a character a natural secondary tint. |
| **Negative fill** | Use darkness to deepen one side of a subject. | Add shape without an extra bright source. |
| **Light falloff** | Let brightness decrease as source distance increases. | Avoid flat-looking magical glows. |
| **Inverse-square falloff** | Approximate physical light dropoff with distance. | Keep nearby weapons brighter than far walls. |
| **Color contrast lighting** | Use warm and cool sources for separation. | Distinguish player from background. |
| **Chiaroscuro** | Use dramatic contrast between lit and unlit regions. | Make a boss stand out. |
| **Edge lighting** | Highlight only part of a subject boundary. | Define geometry in dark scenes. |
| **Cross lighting** | Light a subject from opposing angles. | Create depth in a two-character scene. |
| **Book light** | Bounce a soft light into a diffusion surface. | Achieve a broad soft-light feel in live-action. |
| **Flagging** | Block light from a chosen portion of the set. | Keep the background dark. |
| **Light wrap** | Add nearby background color around composited subject edges. | Integrate a glowing boss cutout. |
| **Shadow softness** | Control the transition from lit to unlit areas. | Choose gentle or crisp mood. |
| **Shadow density** | Control how dark cast shadows appear. | Keep enemy details legible. |

## 08  |  Digital and game-engine light sources

| Term / technique | Quick definition | Example use |
|---|---|---|
| **Directional sun light** | Illuminate a whole scene with consistent light direction. | Give a map a clear time of day. |
| **Point light** | Emit light outward from a localized position. | Illuminate an orb or torch. |
| **Spotlight** | Concentrate light in a cone. | Reveal a boss in a spotlight. |
| **Area light** | Use a broad light-emitting surface. | Create flattering highlights on an avatar. |
| **Emissive material** | Make a texture appear self-illuminated. | Light up a sword or portal. |
| **Environment lighting** | Use surrounding world illumination. | Maintain consistent exposure across the scene. |
| **HDRI lighting** | Illuminate from a high-dynamic-range environment map. | Achieve nuanced reflections in 3D renderers. |
| **Image-based lighting** | Use an image's colors as lighting information. | Blend a model with a new map. |
| **Global illumination** | Approximate light bouncing around a scene. | Make wall colors subtly affect subjects. |
| **Ambient occlusion** | Darken creases and close contact regions. | Ground characters in the environment. |
| **Screen-space reflections** | Approximate reflections from currently visible pixels. | Enhance glossy floors when supported. |
| **Reflection probe** | Store nearby environment reflections for materials. | Make metal swords more reflective. |
| **Shadow map** | Compute shadows from a light in real-time rendering. | Make a character's shadow follow them. |
| **Contact shadow** | Add small shadows at touching surfaces. | Keep shoes grounded on the floor. |
| **Volumetric light** | Make light visible inside fog or haze. | Show a beam cutting through a dungeon. |
| **Light cookie / gobo** | Project a pattern through or from a light. | Create patterned dungeon shadows. |

## 09  |  Haze, focus, and atmospheric depth

| Term / technique | Quick definition | Example use |
|---|---|---|
| **Atmospheric haze** | Soften distant background contrast. | Separate an avatar from far buildings. |
| **Depth fog** | Increase fog with scene distance. | Make a large map feel deeper. |
| **Volumetric fog** | Let light interact with visible fog volume. | Create a magical boss entrance. |
| **Ground mist** | Keep low fog near the ground. | Add tension around footsteps. |
| **God rays** | Show separated shafts of sunlight through mist. | Reveal the path toward a tower. |
| **Light shafts** | Add visible beams from windows or portals. | Draw attention to a doorway. |
| **Dust motes** | Add tiny particles in the light. | Make an empty space feel dimensional. |
| **Bokeh** | Turn defocused highlights into soft shapes. | Create a cinematic backdrop for a title. |
| **Shallow depth of field** | Keep one focal plane crisp while blurring others. | Prioritize the character over scenery. |
| **Deep depth of field** | Keep near and far subjects relatively sharp. | Show a boss location clearly. |
| **Rack focus** | Shift sharpness from one depth to another. | Reveal the boss behind your avatar. |
| **Foreground haze** | Add atmosphere near the camera. | Create layered depth around title text. |
| **Background separation** | Give subject and background distinct brightness/color. | Keep an important subject readable. |
| **Light-to-dark layering** | Arrange planes with alternating luminance levels. | Strengthen depth in 2D game footage. |
| **Dappled light** | Create scattered patches of light and shade. | Suggest trees overhead. |
| **Fog backlighting** | Light fog from behind the subject. | Make a silhouette look dramatic. |

## 10  |  Animated lighting accents

| Term / technique | Quick definition | Example use |
|---|---|---|
| **Light intensity ramp** | Keyframe a light getting brighter or darker. | Build toward a boss reveal. |
| **Color-temperature ramp** | Animate warm-to-cool lighting. | Signal a shift in mood. |
| **Light flicker** | Vary illumination briefly and irregularly. | Make an unstable portal feel alive. |
| **Light pulse** | Expand and contract intensity rhythmically. | Synchronize a power-up to a beat. |
| **Impact flash** | Add a very brief bright accent at contact. | Emphasize an attack landing. |
| **Lightning flash** | Simulate short, irregular bursts of environmental light. | Create thunderstorm drama. |
| **Firelight flicker** | Modulate warm light irregularly. | Enhance a fire-themed fight. |
| **Neon sign flicker** | Simulate a faulty light turning on and off. | Emphasize a location reveal. |
| **Rim-light sweep** | Animate a highlight traveling around an edge. | Showcase a weapon or avatar. |
| **Specular glint** | Move a narrow bright highlight across reflective material. | Reveal a rare item. |
| **Gobo sweep** | Move projected shadow patterns across a scene. | Suggest passing light or objects. |
| **Light-sweep reveal** | Move a bright band across the subject. | Introduce a new upgrade. |
| **Exposure flicker** | Vary whole-frame exposure as a controlled effect. | Use only sparingly for shock moments. |
| **Shadow pass** | Animate a shadow moving over the scene. | Signal something approaching. |
| **Glow pulse** | Keyframe bloom or glow around a bright object. | Make loot visibly special. |

## 11  |  Compositing and local light effects

| Term / technique | Quick definition | Example use |
|---|---|---|
| **Additive glow blend** | Combine a bright light pass using additive blending. | Make sparks feel luminous. |
| **Screen blend** | Composite a light texture while reducing black background. | Overlay a flare on gameplay. |
| **Soft-light blend** | Add gentle contrast and color texture. | Unify graphics with footage. |
| **Overlay blend** | Blend contrast-enhancing color layers. | Add punch without changing the subject cutout. |
| **Luma mask** | Limit an effect to parts of an image by brightness. | Keep glow on highlights only. |
| **Gradient mask** | Fade a grade gradually across part of the screen. | Darken the sky but not the player. |
| **Radial mask** | Apply a local grade around a circular focus area. | Spotlight a boss. |
| **Trackable local exposure** | Attach a brightness adjustment to a moving object. | Keep a fast avatar visible. |
| **Selective shadow lift** | Brighten only a dark subject region. | Help viewers follow a route. |
| **Vignette animation** | Change corner darkness over time. | Narrow attention before an attack. |
| **Dodge** | Locally brighten part of an image. | Light up a character face. |
| **Burn** | Locally darken part of an image. | Reduce a distracting background. |
| **Rim light overlay** | Draw or composite a color accent at subject edges. | Separate an avatar from a bright backdrop. |
| **Glow radius adjustment** | Control the size of a light halo. | Avoid glow covering captions. |
| **Glow threshold** | Choose which bright pixels contribute to bloom. | Keep midtones sharp. |
| **Spill match** | Tint the subject with colors from nearby light. | Make inserted effects feel integrated. |
| **Light-wrap composite** | Blend nearby environmental glow around a cutout. | Fix a pasted-on character edge. |
| **Shadow composite** | Add or shape a shadow under a composited element. | Make floating text graphics feel grounded. |

## 12  |  Measurement, consistency, and output

| Term / technique | Quick definition | Example use |
|---|---|---|
| **Shot matching** | Make consecutive clips share exposure and hue. | Avoid jarring cuts between maps. |
| **Reference still** | Use a chosen image as visual target for grading. | Keep multiple uploads consistent. |
| **Technical LUT** | Transform footage into a display color space. | Normalize log footage correctly. |
| **Creative LUT** | Apply a reusable artistic color treatment. | Maintain a recurring channel look. |
| **LUT intensity mix** | Blend a LUT with the original rather than using it fully. | Keep colors natural in gameplay. |
| **Node-based grading** | Use separate operations in a deliberate order. | Keep exposure, tone and style independent. |
| **Adjustment layer** | Apply one grade to several clips below it. | Keep a guide sequence consistent. |
| **RGB parade** | Compare the three color channels across brightness ranges. | Spot unwanted color casts. |
| **Waveform monitor** | Read pixel brightness over the frame. | Avoid blown highlights and crushed shadows. |
| **Vectorscope** | Inspect hue and saturation distribution. | Detect overly saturated reds or greens. |
| **Histogram** | See the frequency of dark and bright pixels. | Understand exposure balance. |
| **False-color exposure** | Color-code brightness ranges for exposure assessment. | Identify clipping in a shot. |
| **Zebra stripes** | Mark values over an exposure threshold. | Find overbright areas before export. |
| **Gamut warning** | Identify colors outside the chosen output range. | Prevent strange color clipping. |
| **Color space transform** | Convert between capture, working and delivery spaces. | Keep colors reliable across software. |
| **Rec. 709 output** | Deliver standard SDR video color. | Use a common Shorts-compatible export. |
| **HDR grading** | Grade footage for high-dynamic-range playback. | Only use if the whole workflow supports it. |
| **SDR trim pass** | Adjust an HDR grade to work on ordinary displays. | Keep effects legible to most viewers. |
| **Bit-depth awareness** | Recognize that limited bit depth can cause color banding. | Avoid extreme curves on compressed footage. |
| **Export color check** | Watch the encoded video on the target phone. | Confirm contrast and captions survive compression. |

## Suggested combinations

- **Boss reveal:** Low-key lighting + restrained teal shadow tone + subject rim light + brief impact flash.
- **Secret boss route:** Neutral correction + mild local contrast + readable highlights, without heavy fog or crushed shadows.
- **New update showcase:** Bright high-key style + vibrant but controlled color + soft bloom on rewards.
- **Training arc:** Warm nostalgia for progress footage, moody cool grade for failures, cleaner grade for the comeback.
- **Codes Short:** Neutral color, darkened caption area and high luminance contrast for text.

## Notes on terminology

This guide includes standard cinematography terms, color grading tools, film-emulation concepts, game-engine lighting concepts and practical descriptions. A few are variations of the same foundational concept. Availability depends on your editor and source footage.
