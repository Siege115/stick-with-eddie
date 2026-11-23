# Editing Resources - Visual Effects & Keyframe Animations

**213 techniques and practical variants | 12 categories**

A comprehensive, searchable reference for cinematic video edits, including Roblox / Anime Breaker and faceless Shorts. Names include established compositing terms, editing effects, and clearly described workflow variations.

**Important:** Camera movement changes viewpoint; visual effects change or augment pixels/layers. Some simulations can be made with keyframes, but a 2D zoom does not restore true 3D perspective.

**Use with your own footage:** Choose a purpose (what should viewers notice), then use no more than 1-2 prominent effects per moment. For a boss-hit example: motion-track the hit point, add a small spark and impact shake, and synchronize a sound effect.

**Tool note:** CapCut can handle many transforms, masks, captions, blur, shake, and basic tracking (depending on version). More advanced 3D solves, planar tracks, vector blur, and detailed rotoscoping generally need desktop software or external assets.

## Quick starting recipes

1. **Secret boss reveal:** scale keyframe (1.00 to 1.17) + tracked boss label + soft glow; hold the boss clearly for readability.
2. **Heavy hit:** two-frame impact flash + 5-8 frame decreasing shake + tiny sparks; do not obscure the HP bar.
3. **Hidden location guide:** animated pointer + cropped reframe + text mask reveal; avoid effects during the exact location step.
4. **Rare drop:** bright outline + icon pulse + number pop + 0.5-second readable hold.
5. **Fast dash:** motion blur + two translucent afterimages + directional sound.

## Before you start

- **Mobile workflow:** Keep overlays on separate tracks, use keyframes for position/scale/opacity, and preview at 1x speed on your phone.
- **Game recording:** Genuine camera changes require a different in-game viewpoint; post effects cannot invent scenery hidden behind an object.
- **Frame rate:** Use 30 FPS delivery if matching your Shorts project; a two-frame flash is about 0.067 seconds.
- **Readability:** Don't add shaking, flashes, or heavy blur over codes, boss HP, or route instructions.
- **Comfort:** Avoid long intense strobing or repeated full-screen flashes; build impacts mainly with sound, brief motion, and particles.

## 01  |  Keyframe animation basics

| Technique | What it does | Suggested use |
|---|---|---|
| **Position keyframes** | Animate an element’s X and Y coordinates over time. | Slide a boss stat card into view. |
| **Scale keyframes** | Change an element’s size across frames. | Punch in on a rare drop. |
| **Rotation keyframes** | Animate an element spinning or tilting. | Rotate a power-up icon into position. |
| **Opacity keyframes** | Change transparency between points in time. | Fade a HUD label in without a transition preset. |
| **Anchor-point animation** | Move or change the pivot around which scaling and rotation occur. | Make a sword icon rotate from its handle. |
| **Uniform scale** | Enlarge width and height together so proportions remain intact. | Zoom a gameplay crop without stretching it. |
| **Nonuniform scale** | Animate horizontal and vertical dimensions independently. | Brief squash-and-stretch on a comic caption. |
| **Linear interpolation** | Move between keyframes at a constant numerical rate. | Use for steady UI scrolling. |
| **Ease-in** | Accelerate gradually from a keyframe. | Give a popup a soft start. |
| **Ease-out** | Decelerate gradually into its final position. | Settle the camera on the boss. |
| **Ease-in-out** | Start and finish slowly with quicker motion in between. | Smoothly reveal a skill description. |
| **Bezier easing** | Shape the acceleration curve manually with handles. | Fine-tune a professional-feeling title pop. |
| **Hold keyframe** | Keep a property unchanged until it jumps at a keyframe. | Switch an icon instantly at a hit. |
| **Overshoot** | Move a property beyond its endpoint, then return. | Make reward numbers land emphatically. |
| **Bounce easing** | Spring back at an endpoint with diminishing rebounds. | Animate achievement badges. |
| **Elastic easing** | Allow larger oscillation around the endpoint. | Use sparingly for playful reward popups. |
| **Keyframe loop** | Repeat a segment of keyed motion. | Make a rare-item icon pulse periodically. |
| **Ping-pong loop** | Repeat animation forward then backward. | Pulse a scan indicator without visible reset. |
| **Motion path** | Guide position keyframes along a curved path. | Arc a damage label away from a boss. |
| **Separated-axis animation** | Give X and Y their own timing curves. | Move text horizontally while it floats up. |
| **Parented motion** | Attach the transform of one layer to another. | Keep a name tag anchored to a moving subject. |
| **Nested transforms** | Animate a precomposed group and its elements separately. | Move a whole stat card while its numbers count. |

## 02  |  Simulated camera and spatial motion

| Technique | What it does | Suggested use |
|---|---|---|
| **Digital push-in** | Use scale and position keyframes to simulate moving closer. | Zoom toward a boss’s face. |
| **Digital pullback** | Reduce crop scale to reveal more of the existing frame. | Start close on damage and show the arena. |
| **Digital pan** | Shift a cropped image horizontally inside the frame. | Guide attention toward a hidden alley. |
| **Digital tilt** | Shift a cropped image vertically inside the frame. | Reveal a tall tower from a still recording. |
| **Digital camera roll** | Rotate the whole image around its center. | Build tension before a boss attack. |
| **Handheld shake simulation** | Use irregular small shifts and rotations. | Make combat footage feel less static. |
| **Impact camera shake** | Use a few sharp, rapidly decaying offsets. | Emphasize an attack at the exact hit frame. |
| **2.5D parallax** | Move separated foreground and background layers at different rates. | Add depth to a title card or extracted gameplay still. |
| **Depth-map parallax** | Use estimated depth to warp pixels by apparent distance. | Animate a still scene; check edge artifacts. |
| **Perspective corner pin** | Distort four corners to fit an angled surface. | Place a stat screen onto a game billboard. |
| **3D layer rotation** | Turn a plane around X or Y in compositing software. | Flip a floating menu panel toward camera. |
| **Perspective zoom** | Scale and skew a layer to suggest movement in depth. | Make a HUD fly toward the viewer. |
| **Virtual orbit with layers** | Shift separated cutouts and backgrounds to suggest a small arc. | Only plausible with enough isolated depth information. |
| **Foreground parallax pass** | Move a nearby layer faster than the background. | Sweep a pillar past the lens for depth. |
| **Camera drift** | Apply subtle constant movement to a still. | Keep a tutorial screenshot visually alive. |
| **Animated cropping** | Change the visible frame boundaries over time. | Track the important part of an Xbox capture. |
| **Reframe follow** | Animate the crop to follow the subject inside footage. | Keep a running Roblox avatar centered. |
| **Focus-pull simulation** | Animate blur between foreground and background layers. | Shift attention from player to boss. |

## 03  |  Motion blur, trails, and temporal effects

| Technique | What it does | Suggested use |
|---|---|---|
| **Directional motion blur** | Blur along a chosen direction of movement. | Give a rapid sideways dash visual speed. |
| **Vector motion blur** | Use motion vectors or tracked movement to blur moving pixels. | Higher-end compositing for fast action. |
| **Transform motion blur** | Blur a layer based on its animated transform. | Keep a keyframed zoom from looking jittery. |
| **Radial blur** | Blur around a central point in a circular pattern. | Emphasize a spinning power-up. |
| **Zoom blur** | Blur outward from a central vanishing point. | Suggest a rush into a boss arena. |
| **Spin blur** | Introduce circular streaks around the frame center. | Support a rotation animation. |
| **Frame blending** | Blend adjacent frames to smooth or stylize retiming. | Try on footage slowed below source frame rate. |
| **Optical-flow interpolation** | Generate estimated in-between frames. | Smooth slow motion; inspect warped swords or UI. |
| **Echo trail** | Composite delayed copies of an image over time. | Show a character’s fast dash path. |
| **Ghost trail** | Use faint translucent duplicates of earlier poses. | Stylized afterimages behind a sword swing. |
| **Motion smear** | Stretch a moving element in its travel direction. | Sell a cartoon-like high-speed hit. |
| **Speed lines** | Add graphic streaks radiating or sweeping with action. | Intensify a short attack animation. |
| **Long-exposure streak** | Accumulate luminous movement across several frames. | Turn moving neon sword into a glowing arc. |
| **Strobe-frame effect** | Alternate or skip visible frames deliberately. | Use sparingly for a stylized power-up. |
| **Shutter-angle look** | Adjust effective motion blur duration visually. | Sharper battle motion versus dreamy smear. |
| **Temporal posterization** | Deliberately lower an effect layer’s frame rate. | Create stop-motion-like UI movement. |

## 04  |  Masks, cutouts, keying, and compositing

| Technique | What it does | Suggested use |
|---|---|---|
| **Rectangle mask** | Show only the content inside a movable box. | Reveal stats in a clean panel. |
| **Ellipse mask** | Reveal content through a circular region. | Highlight a boss or loot icon. |
| **Custom pen mask** | Draw an irregular outline around a subject or object. | Hide an overlay behind a character. |
| **Animated mask path** | Change a mask’s shape or position with keyframes. | Reveal a caption from behind a blade. |
| **Mask feathering** | Soften a mask’s edge to blend layers. | Integrate glow without a hard border. |
| **Inverted mask** | Show everything outside the mask instead of inside. | Darken surroundings while keeping boss bright. |
| **Track matte / alpha matte** | Use one layer’s transparency to reveal another. | Fill big text with gameplay footage. |
| **Luma matte** | Use another layer’s brightness as a reveal map. | Expose an energy effect through a gradient. |
| **Rotoscoping** | Cut out moving subjects frame by frame or with assisted tools. | Put captions behind a moving Roblox avatar. |
| **Subject segmentation** | Automatically separate a subject from its background. | Extract a boss for a thumbnail-like overlay. |
| **Chroma key** | Remove a chosen screen color, often green. | Place a keyed animation over gameplay. |
| **Spill suppression** | Remove unwanted green/blue reflection from keyed edges. | Clean up chroma-keyed assets. |
| **Garbage matte** | Roughly exclude unwanted areas before precision keying. | Remove irrelevant edge pixels around an overlay. |
| **Holdout matte** | Cut a hole in one layer using another shape. | Let a character pass in front of text. |
| **Mask expansion** | Grow or shrink a matte to repair its edges. | Avoid colored halos around extracted characters. |
| **Edge refinement** | Repair fine details and anti-aliasing around a cutout. | Fix sword outlines or hair-like effects. |
| **Light wrap** | Bleed background lighting slightly around a foreground subject. | Make a composited avatar fit a glowing map. |
| **Blend modes** | Combine layers using screen, add, multiply, overlay, etc. | Integrate spell particles without opaque black boxes. |
| **Precomposition** | Treat several layers as one composite for further animation. | Animate a whole visual-effects stack together. |
| **Occlusion layering** | Place elements in front of or behind the subject correctly. | Keep a location arrow behind a pillar. |

## 05  |  Tracking, stabilization, and placement

| Technique | What it does | Suggested use |
|---|---|---|
| **Single-point tracking** | Follow one visual feature through frames. | Attach a small arrow to a moving object. |
| **Two-point tracking** | Use two points to infer position, rotation, and scale. | Keep a label aligned to a rotating item. |
| **Planar tracking** | Track a flat surface’s change of perspective. | Replace a gameplay screen or billboard. |
| **Four-corner tracking** | Attach four corners of a graphic to a moving quadrilateral. | Pin a map graphic onto a sign. |
| **Perspective tracking** | Account for skew as an object changes its viewing angle. | Attach UI to a turning wall surface. |
| **3D camera tracking** | Estimate virtual camera motion using scene features. | Insert graphics that remain stable in the 3D environment. |
| **Object tracking** | Follow a moving subject rather than a fixed scene point. | Keep a boss-name callout beside the boss. |
| **Face tracking** | Follow a face’s features and orientation. | Relevant to avatars with visible faces. |
| **Text-to-motion tracking** | Parent animated text to a tracked target. | Attach a label to a moving rare item. |
| **Tracked glow** | Move a light/glow effect with a tracked emitter. | Keep sword aura attached as character moves. |
| **Tracked particles** | Make a particle system follow a moving subject. | Emit sparks from a weapon’s tip. |
| **Screen replacement** | Replace footage inside a tracked monitor or device. | Show a gameplay stat in an in-scene display. |
| **Basic stabilization** | Reduce unwanted global shake in recorded footage. | Smooth out unintentional handheld movement. |
| **Warp stabilization** | Apply local warping to smooth complex camera motion. | Can distort HUDs; inspect gameplay carefully. |
| **Motion-tracked reframing** | Shift the output crop using tracked subject position. | Follow gameplay automatically for vertical Shorts. |
| **Tracking through occlusion** | Continue the track when a subject disappears briefly. | Maintain a label as boss passes behind a pillar. |
| **Tracking data smoothing** | Remove jitter from tracked coordinates. | Prevent a moving damage callout from buzzing. |

## 06  |  Glow, lighting, and color effects

| Technique | What it does | Suggested use |
|---|---|---|
| **Bloom** | Spread bright areas into soft surrounding light. | Make portals and rare drops luminous. |
| **Outer glow** | Put a colored halo around a cutout or text. | Highlight secret boss locations. |
| **Inner glow** | Light the inner edge of a masked object. | Accent an energized sword. |
| **Animated glow pulse** | Keyframe glow strength repeatedly. | Pulse an important upgrade button. |
| **Exposure ramp** | Animate overall brightness across a moment. | Brighten the scene during an ultimate move. |
| **Highlight bloom** | Limit bloom largely to image highlights. | Keep glow from washing out the whole scene. |
| **Animated vignette** | Darken corners increasingly toward a focal point. | Focus attention on boss HP. |
| **Rim light composite** | Add edge lighting around an isolated subject. | Make boss silhouette stand out. |
| **Volumetric beam** | Create light shafts through dust or haze. | Emphasize a portal or doorway reveal. |
| **God rays** | Simulate distinct light rays spilling from a source. | Reveal a glowing treasure room. |
| **Lens flare** | Add flare artifacts that react to a bright light. | Use lightly for powerful abilities. |
| **Light leak** | Overlay irregular warm or cool light entering the frame. | Stylized energetic accent during edits. |
| **Light flicker** | Vary brightness in a fast or irregular pattern. | Mimic an unstable energy source. |
| **Color isolation** | Keep one color vivid while muting others. | Highlight the red boss warning icon. |
| **Hue shift** | Keyframe hue changes over time. | Show a power state transformation. |
| **Gradient map** | Map dark and light values into chosen colors. | Unify graphic-heavy montage aesthetics. |
| **Color grade match** | Make separate clips share similar contrast and color. | Keep worlds consistent across guide cuts. |
| **Glow falloff** | Control how rapidly light weakens with distance. | Avoid a flat, pasted-on aura. |
| **Drop shadow** | Add offset softened darkness behind an element. | Make subtitles readable over gameplay. |

## 07  |  Particle and environmental effects

| Technique | What it does | Suggested use |
|---|---|---|
| **Particle burst** | Emit many particles at once from a point. | Celebrate a secret boss defeat. |
| **Sparks** | Short-lived, bright fragments moving from a collision. | Enhance sword-on-armor hits. |
| **Debris burst** | Send small chunks outward after impact. | Show a large boss strike. |
| **Dust plume** | Create a cloud of particles rising near the ground. | Emphasize a landing animation. |
| **Smoke plume** | Layer drifting, soft translucent clouds. | Reveal a boss emerging from fog. |
| **Atmospheric fog** | Introduce distant translucent haze. | Add depth to an arena establishing shot. |
| **Falling embers** | Animate glowing specks descending slowly. | Enhance a fire-themed battle. |
| **Rain overlay** | Composite vertical drops over the scene. | Add atmosphere, not a gameplay mechanic. |
| **Snow overlay** | Composite drifting snowflakes. | Emphasize a snowy game world. |
| **Confetti burst** | Send colorful pieces upward and down. | Mark rare loot or milestones. |
| **Magic motes** | Small glowing floating points with varied movement. | Make an enchanted area feel alive. |
| **Energy orbs** | Animate glowing spheres around a character. | Represent a charging ultimate attack. |
| **Particle attraction** | Move particles toward a center or target. | Show energy charging into a weapon. |
| **Particle dispersion** | Send a particle cluster away from a source. | Show a portal shutting down. |
| **Shockwave dust ring** | Expand a ring of dust from the impact center. | Ground a powerful hit. |
| **Fire overlay** | Layer animated flame elements with proper blending. | Decorate flame attacks without covering UI. |
| **Atmospheric depth haze** | Make far layers less contrasted than near layers. | Strengthen perspective in composited scenes. |

## 08  |  Impact, combat, and power-up effects

| Technique | What it does | Suggested use |
|---|---|---|
| **Impact flash** | Add one or two very brief bright frames on contact. | Mark exactly when a strike hits. |
| **Impact shake** | Jolt the frame and settle rapidly. | Make a heavy boss attack feel powerful. |
| **Shockwave ring** | Expand a luminous ring from a hit point. | Show the scale of an ability. |
| **Distortion shockwave** | Warp nearby background pixels in an expanding radius. | Suggest concussive energy. |
| **Hit spark** | Spawn a tiny bright explosion exactly at contact. | Clarify hard-to-read gameplay hits. |
| **Slash trail** | Draw a luminous arc following a swinging weapon. | Clarify sword direction. |
| **Energy trail** | Leave colored afterimages along an ability path. | Make a dash more readable. |
| **Sword gleam** | Sweep a bright glint across a blade. | Emphasize weapon showcase. |
| **Aura pulse** | Expand and dim a glow around the character. | Show a temporary power boost. |
| **Charge-up glow** | Increase emissive intensity before an attack. | Signal action anticipation. |
| **Screen-edge pulse** | Flash or darken only the frame border. | Add a damage or low-HP warning. |
| **Damage-number pop** | Scale and move damage text out of the hit point. | Make crit hits more obvious. |
| **Critical-hit burst** | Combine a brief shockwave, spark, and accent color. | Distinguish crits from ordinary hits. |
| **Hit marker overlay** | Show a small cross or confirmation icon at a contact point. | Reinforce precise hits. |
| **Screen crack overlay** | Composite a brief stylized glass-crack graphic. | Use for rare devastating impacts. |
| **Energy crackle** | Show short electric branches near charged objects. | Power-up or lightning effects. |
| **Teleport flash** | Use a brief glow and transformed silhouette. | Suggest a warp between locations. |
| **Speed dash afterimage** | Create several offset poses behind a fast-moving character. | Sell superhuman travel speed. |

## 09  |  Animated captions, callouts, and interface

| Technique | What it does | Suggested use |
|---|---|---|
| **Text pop-in** | Scale text from smaller to full size with eased keyframes. | Emphasize “SECRET BOSS” in a hook. |
| **Kinetic typography** | Animate type to reflect meaning or rhythm. | Make voiceover words visually energetic. |
| **Word-by-word captions** | Reveal each spoken word at the intended time. | Keep faceless Shorts easy to follow. |
| **Typewriter reveal** | Show characters appearing sequentially. | Introduce a code or mysterious clue. |
| **Text mask reveal** | Expose letters through an animated mask. | Slide text out from behind a pillar. |
| **Animated lower third** | Bring a label into an organized screen position. | Name a boss without obscuring gameplay. |
| **Tracked text label** | Move text with a gameplay object. | Identify a small rare item as it moves. |
| **Animated pointer** | Keyframe an arrow line toward a target. | Show exactly which alley to enter. |
| **Callout box growth** | Expand a panel from a dot or line. | Display HP or damage requirements. |
| **Number counter** | Animate a numeric value between two states. | Show upgrade cost or damage gain. |
| **Progress-bar animation** | Reveal a fill level from 0 to a target value. | Explain upgrade completion. |
| **Icon pulse** | Scale or brighten an icon repeatedly. | Highlight a code redeem button. |
| **Stat-card slide** | Bring a cluster of numbers on-screen with keyframes. | Show boss HP, drops, and location. |
| **HUD scanning line** | Sweep a line across a UI panel. | Add an inspection aesthetic. |
| **Cursor path animation** | Move a pointer along keyframed coordinates. | Demonstrate where to tap a menu. |
| **Blur-in title** | Animate a blurred title into focus. | Stylized reveal of the world name. |
| **Text glitch** | Briefly distort and displace letter fragments. | Create a dramatic title entrance. |
| **Outline draw-on** | Reveal a stroked path progressively. | Circle the item viewers should notice. |
| **Highlight sweep** | Move a translucent streak across words or icons. | Call attention to one instruction. |

## 10  |  Distortion, texture, and stylization

| Technique | What it does | Suggested use |
|---|---|---|
| **Chromatic aberration** | Offset RGB channels subtly at the edges. | Add a short impact accent, not constant strain. |
| **RGB split** | Separate color channels horizontally or vertically. | Emphasize glitch or hit effects. |
| **Digital glitch blocks** | Replace patches with shifted image data. | Use very briefly on code reveals. |
| **Pixelation** | Reduce perceived image resolution in blocks. | Hide spoilers or show retro game style. |
| **Posterization** | Reduce the number of color tones. | Make a flat comic or cartoon aesthetic. |
| **Halftone** | Overlay a dot or print-screen pattern. | Comic-style reaction freeze frame. |
| **Edge detection** | Outline boundaries based on local contrast. | Create an x-ray-like graphic moment. |
| **Toon-shading look** | Emphasize flat color regions and sharp edges. | Stylize a cutout for an overlay. |
| **Noise overlay** | Add random texture over the image. | Avoid banding and add grit subtly. |
| **Film grain** | Add fine animated luminance/color variation. | Tie composited assets together. |
| **Scan lines** | Overlay repeated horizontal lines. | Make HUD footage resemble a monitor. |
| **CRT curvature** | Distort the frame like an old curved display. | Retro tech-style insert. |
| **VHS tracking errors** | Simulate noisy horizontal picture displacement. | Use for intentionally retro jokes. |
| **Wave warp** | Displace image pixels along oscillating curves. | Make a magical heat ripple. |
| **Turbulent displacement** | Warp an image using evolving noise. | Create liquid energy or unstable portals. |
| **Mirror/kaleidoscope** | Reflect and repeat image portions symmetrically. | Show surreal power-up sequences. |
| **Heat haze** | Apply subtle refractive wobble behind bright effects. | Add dimensionality to flames or energy. |

## 11  |  Depth, focus, and optical effects

| Technique | What it does | Suggested use |
|---|---|---|
| **Depth of field** | Blur elements away from a chosen focal plane. | Guide attention toward the boss. |
| **Bokeh** | Convert defocused highlights into soft light shapes. | Give a magical background softness. |
| **Animated rack focus** | Move focus between two depths over time. | Shift attention from avatar to enemy. |
| **Tilt-shift blur** | Sharpen a thin region while blurring above and below. | Stylize a wide overhead game view. |
| **Fisheye distortion** | Curve straight lines outward toward the edges. | Funny reaction or heightened perspective. |
| **Barrel distortion** | Bow straight edges outward. | Use gently for wide-angle action. |
| **Pincushion distortion** | Bow straight edges inward. | A subtle optical-stylization choice. |
| **Lens breathing simulation** | Make image size change slightly while focus shifts. | Add camera realism to a rack-focus edit. |
| **Glass refraction** | Warp scene portions through a glass-like shape. | Show an energy shield or lens. |
| **Water ripple refraction** | Oscillate pixels as if viewed through water. | Suggest underwater or portal effects. |
| **Prism split** | Split and offset bright image regions into spectral colors. | Stylize power-up flashes. |
| **Anamorphic streak** | Add long horizontal highlights around bright points. | Cinematic energy emphasis. |
| **Animated vignette focus** | Darken edges as the viewer’s focus narrows. | Guide eyes to a small item in footage. |
| **Lens dirt overlay** | Reveal subtle specks only near bright highlights. | Avoid overusing on clean gaming footage. |
| **Focus blur pulse** | Blur and sharpen the frame around a single event. | Direct attention during an intense change. |

## 12  |  Layer integration, realism, and workflow

| Technique | What it does | Suggested use |
|---|---|---|
| **Motion-matched overlay** | Animate an added element in the same direction and speed as footage. | Keep stat graphics feeling attached to gameplay. |
| **Perspective-matched overlay** | Match scale, skew, and rotation to a surface. | Put a code sign naturally into a scene. |
| **Animated contact shadow** | Add shadow that follows a moving cutout. | Ground a composited character in the scene. |
| **Reflection composite** | Create a mirrored or blurred counterpart below a subject. | Add polish to a reward-card reveal. |
| **Color-spill match** | Tint an inserted subject with nearby light color. | Make a glowing portal illuminate an avatar. |
| **Grain match** | Give composited layers matching noise structure. | Avoid sharp text cutouts looking pasted onto footage. |
| **Depth-order management** | Maintain correct near-to-far layer arrangement. | Put boss behind scenery but ahead of the skyline. |
| **Audio-reactive animation** | Drive a visual parameter from a beat or amplitude envelope. | Pulse a ring on a bass hit; verify timing. |
| **Layer pre-render** | Render a complex effects group before editing more. | Improve playback on a phone editor. |
| **Effect stacking** | Apply multiple small effects in a deliberate order. | Blur a glow layer before adding it over footage. |
| **Adjustment layer** | Apply the same effect to clips or layers underneath. | Keep a uniform grade on several scenes. |
| **Blend-mode matching** | Choose blending that works with the asset’s black/white background. | Use screen for bright particles over black. |
| **Alpha-channel export** | Render an effect with real transparency for reuse. | Save an isolated sword trail overlay. |
| **Nested sequence** | Group visual layers into one reusable timed sequence. | Reuse a consistent boss-stat reveal. |
| **Mask-and-track workflow** | Track a subject then attach a mask or graphic to its path. | Keep an outlined highlight aligned with the boss. |

## Five-second demo breakdown

| Time | Effect | What to look for |
|---|---|---|
| 0:00-0:01 | Scale keyframes | The frame smoothly pushes toward the central portal. |
| 0:01-0:02 | Motion tracking | A label and reticle follow a changing target position. |
| 0:02-0:03 | Animated mask reveal | A bright sweep reveals a label in place. |
| 0:03-0:04 | Motion blur & afterimages | A rushing object leaves directional blur and ghost trails. |
| 0:04-0:05 | Impact effects | A burst combines glow, flash, shake, and particles. |

### Recommended editing order for a short

Select footage -> trim for clarity -> set camera framing -> keyframe motion -> add masks/tracking -> add 1-2 VFX accents -> add captions -> add sound -> check the finished video without sound -> export.

*This is a vocabulary library, not a claim that every entry is a distinct built-in CapCut preset. Similar tools can have different names across apps.*
