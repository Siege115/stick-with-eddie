// 3D stage renderer: builds every set a beats file names, the cast and the camera from a beats file + timeline,
// and renders any moment t (seconds) to a 1080x1920 frame. Deterministic: frame = f(t).
import * as THREE from '/node_modules/three/build/three.module.js';
import { drawPerson, DEFAULT_POSE, drawHorse, drawTapLeg, drawHansPortrait, drawHansEye, outlined, drawLogCameo } from './draw.js';
import * as TX from './textures.js';
import { SETS } from './world.js';
import { resolver, compile } from './timeline.js';
import { CARDS } from './cards.js';

const W = 1080, H = 1920;
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, t) => a + (b - a) * t;
const lerp3 = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
const ease = { linear: (x) => x, inout: (x) => x * x * (3 - 2 * x), out: (x) => 1 - (1 - x) ** 3, in: (x) => x * x * x };
const backOut = (x) => { const c = 1.9; return 1 + (c + 1) * (x - 1) ** 3 + c * (x - 1) ** 2; };
function hash(...a) { let h = 2166136261; for (const v of a) { const s = String(v); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } } return ((h >>> 0) % 100000) / 100000; }

// ---------------- poses (all authored facing right) ----------------
const P = {
  idle: {}, watch: { armL: { a: 0.1, b: 0.1 }, armR: { a: 0.15, b: 0.25 }, brow: 0.15 },
  akimbo: { armL: { a: 0.45, b: -1.1 }, armR: { a: 0.45, b: -1.1 }, brow: 0.2 },
  lean: { lean: 0.08, headTilt: 0.06, armL: { a: 0.2, b: 0.3 }, armR: { a: 0.3, b: 0.6 }, brow: 0.3 },
  point: { armR: { a: 1.45, b: 0.05 }, brow: 0.5, mouth: 'o' },
  pointUp: { armR: { a: 2.5, b: 0.15 }, brow: 0.7, mouth: 'grin' },
  whisper: { armR: { a: 0.75, b: 2.3 }, headTilt: -0.12, mouth: 'smug', lookX: -1 },
  handChin: { armR: { a: 0.6, b: 2.45 }, brow: -0.2, mouth: 'flat', squint: 0.4 },
  clap: { armL: { a: 0.75, b: 1.25 }, armR: { a: 0.75, b: 1.25 }, mouth: 'smile', brow: 0.5, clap: 1 },
  gasp: { armL: { a: 0.75, b: 2.55 }, armR: { a: 0.75, b: 2.55 }, mouth: 'gasp', brow: 1, lean: -0.06 },
  handsCheeks: { armL: { a: 0.62, b: 2.65 }, armR: { a: 0.62, b: 2.65 }, mouth: 'o', brow: 1 },
  recoil: { lean: -0.14, armL: { a: 0.9, b: 0.6 }, armR: { a: 1.0, b: 0.5 }, mouth: 'gasp', brow: 1, icon: '!' },
  cheer: { armL: { a: 2.7, b: 0.1 }, armR: { a: 2.7, b: 0.1 }, mouth: 'grin', brow: 0.8, hop: 1 },
  cheerOne: { armL: { a: 0.2, b: 0.2 }, armR: { a: 2.8, b: 0 }, mouth: 'grin', brow: 0.6, hop: 0.5 },
  laughBelly: { armL: { a: 0.35, b: 2.0 }, armR: { a: 0.35, b: 2.0 }, mouth: 'laugh', brow: 1, lean: -0.12, shake: 1, eyes: 0.1 },
  laughPoint: { armL: { a: 0.35, b: 2.0 }, armR: { a: 1.4, b: 0 }, mouth: 'laugh', brow: 0.8, lean: -0.08, shake: 1, eyes: 0.1 },
  laughBack: { armL: { a: 0.5, b: 0.4 }, armR: { a: 0.5, b: 0.4 }, mouth: 'laugh', lean: -0.2, headTilt: -0.15, shake: 1, eyes: 0.1 },
  slapTable: { armR: { a: 1.1, b: 0.4 }, armL: { a: 0.3, b: 1.9 }, mouth: 'laugh', shake: 1, lean: 0.1, eyes: 0.1 },
  skeptic: { armL: { a: 0.45, b: 1.9 }, armR: { a: 0.6, b: 2.42 }, brow: -0.7, squint: 0.7, mouth: 'flat' },
  pointSneer: { armR: { a: 1.4, b: 0.05 }, armL: { a: 0.35, b: 2.0 }, brow: -0.6, mouth: 'smug', headTilt: -0.1 },
  notes: { armL: { a: 0.8, b: 1.3 }, armR: { a: 0.75, b: 1.75 }, brow: -0.3, lookY: 1, write: 1 },
  stern: { armL: { a: 0.45, b: -1.1 }, armR: { a: 0.45, b: -1.1 }, brow: -0.8, mouth: 'frown' },
  chalkUp: { armR: { a: 1.25, b: 0.55 }, armL: { a: 0.2, b: 0.2 }, brow: 0.5, mouth: 'smile', lookY: 1 },
  ask: { armR: { a: 1.0, b: -0.6 }, armL: { a: 0.2, b: 0.1 }, brow: 0.6, mouth: 'smile' },
  askLean: { armR: { a: 1.25, b: -0.5 }, lean: 0.1, headTilt: 0.08, brow: 0.8, mouth: 'smile', lookY: 1 },
  askB: { armR: { a: 1.5, b: -0.2 }, armL: { a: 0.3, b: 0.2 }, brow: 0.4, mouth: 'flat' },
  proud: { armL: { a: 0.45, b: -1.1 }, armR: { a: 1.2, b: 0.2 }, brow: 0.7, mouth: 'grin', lean: -0.05 },
  present: { armL: { a: 0.9, b: 0.2 }, armR: { a: 1.1, b: 0.15 }, brow: 0.6, mouth: 'smile' },
  presentL: { armL: { a: 1.0, b: 0.2 }, armR: { a: 0.2, b: 0.2 }, brow: 0.5, mouth: 'smile', lookX: -1 },
  pointBoard: { armR: { a: 1.5, b: 0 }, armL: { a: 0.2, b: 0.2 }, brow: 0.6, mouth: 'smile' },
  swear: { armR: { a: 2.45, b: 0.5 }, armL: { a: 0.6, b: 2.0 }, brow: 0.9, mouth: 'grin' },
  write: { armR: { a: 1.95, b: 0.75 }, brow: 0.2, mouth: 'smile', lookX: 1, write: 1 },
  writeB: { armR: { a: 1.65, b: 1.0 }, brow: 0.3, mouth: 'smile', lookX: 1, write: 1 },
  handsStill: { armL: { a: 0.06, b: 0 }, armR: { a: 0.06, b: 0 }, brow: 0.1, mouth: 'flat' },
  handsStillShrug: { armL: { a: 0.06, b: 0 }, armR: { a: 0.06, b: 0 }, brow: 1, mouth: 'smile', headTilt: 0.12 },
  holdKid: { armL: { a: 2.6, b: -0.5 }, armR: { a: 2.6, b: -0.5 }, mouth: 'smile', brow: 0.4 },
  pushGlasses: { armR: { a: 0.8, b: 2.6 }, armL: { a: 0.8, b: 1.3 }, brow: 0.4, mouth: 'smug' },
  pointUpOne: { armR: { a: 2.75, b: 0 }, armL: { a: 0.8, b: 1.3 }, brow: 0.9, mouth: 'smile', icon: '!' },
  pointRight: { armR: { a: 1.55, b: 0 }, armL: { a: 0.8, b: 1.3 }, brow: 0.5, mouth: 'smile' },
  worried: { armL: { a: 0.6, b: 2.2 }, armR: { a: 0.3, b: 0.2 }, brow: 1, mouth: 'wobbly', sweat: 0.6 },
  sweat: { armR: { a: 0.85, b: 2.6 }, armL: { a: 0.2, b: 0.2 }, brow: 1, mouth: 'wobbly', sweat: 1, lean: -0.05 },
  tense: { lean: 0.07, armL: { a: 0.25, b: 0.5 }, armR: { a: 0.25, b: 0.5 }, brow: -0.5, squint: 0.5, mouth: 'flat' },
  relaxed: { lean: -0.02, brow: 0.5, mouth: 'smile', armL: { a: 0.12, b: 0.05 }, armR: { a: 0.12, b: 0.05 }, headTilt: 0.06 },
  march: { brow: -0.5, mouth: 'flat' },
  ride: { legL: { a: -0.5, b: 0.5 }, legR: { a: 0.5, b: -0.5 } },
  // ---- S02 acting (art brief 2.1–2.4) ----
  wave: { armR: { a: 2.6, b: 0.25 }, armL: { a: 0.15, b: 0.1 }, brow: 0.6, mouth: 'smile', hatLift: 1 },
  hatWave: { armR: { a: 2.35, b: -0.35 }, armL: { a: 0.15, b: 0.1 }, brow: 0.6, mouth: 'smile', hatLift: 1 }, // S02: arm out and up, hat held clear of the head
  hatWave2: { armR: { a: 2.5, b: -0.45 }, armL: { a: 0.15, b: 0.1 }, brow: 0.7, mouth: 'grin', hatLift: 1 },
  hatLift: { armR: { a: 2.75, b: 0.1 }, armL: { a: 0.2, b: 0.2 }, brow: 0.8, mouth: 'grin', hatLift: 1, lean: -0.03 },
  hatDroop: { armL: { a: 0.05, b: 0.05 }, armR: { a: 0.9, b: 1.4 }, brow: 1, mouth: 'frown', headTilt: 0.12, lean: 0.06, hatDroop: 1 },
  presentIce: { armR: { a: 2.2, b: -0.35 }, armL: { a: 0.25, b: 0.2 }, brow: 0.8, mouth: 'grin', lookY: -1 },
  sigh: { armL: { a: 0.05, b: 0 }, armR: { a: 0.05, b: 0 }, brow: 0.9, mouth: 'wobbly', headTilt: 0.1, lean: 0.05, sweat: 1, eyes: 0.6 },
  saw: { armL: { a: 0.2, b: -0.75 }, armR: { a: 0.2, b: -0.75 }, lean: 0.12, brow: -0.3, mouth: 'flat', lookY: 1 }, // S02 v3: both hands on the crossbar, the down stroke
  sawUp: { armL: { a: 0.5, b: -1.9 }, armR: { a: 0.5, b: -1.9 }, lean: 0.04, brow: -0.3, mouth: 'flat', lookY: 1 }, // the up stroke (the saw rises with the hands)
  tongsLift: { armL: { a: 0.7, b: 0.4 }, armR: { a: 0.7, b: 0.4 }, lean: 0.08, brow: -0.2, mouth: 'flat', lookY: 1 },
  pushPole: { armL: { a: 1.3, b: 0.3 }, armR: { a: 1.0, b: 0.5 }, lean: 0.14, brow: -0.4, mouth: 'flat' },
  hoist: { armL: { a: 2.5, b: 0.2 }, armR: { a: 2.2, b: 0.3 }, lean: -0.08, brow: -0.4, mouth: 'flat', lookY: -1 },
  coilRope: { armL: { a: 0.8, b: 1.2 }, armR: { a: 0.9, b: 1.0 }, lean: 0.1, brow: 0.1, mouth: 'smile', lookY: 1 },
  wheel: { armL: { a: 1.2, b: 0.5 }, armR: { a: 1.2, b: 0.5 }, brow: -0.2, mouth: 'flat' },
  fan: { armR: { a: 0.85, b: 2.1 }, armL: { a: 0.15, b: 0.1 }, brow: 0.3, mouth: 'smile', headTilt: 0.05 },
  holdAtArm: { armR: { a: 1.45, b: 0.05 }, armL: { a: 1.4, b: 0.1 }, brow: 0.9, mouth: 'smile', lean: -0.06, headTilt: -0.08 },
  kneeSlap: { armL: { a: 0.2, b: 0.5 }, armR: { a: 0.3, b: 0.7 }, lean: 0.18, mouth: 'laugh', brow: 1, shake: 1, eyes: 0.1 },
  shovel: { armL: { a: 0.9, b: 0.6 }, armR: { a: 0.5, b: 0.4 }, lean: 0.12, brow: -0.2, mouth: 'flat', lookY: 1 },
  oldStand: { lean: 0.05, headTilt: 0.04, armR: { a: 0.35, b: 0.1 }, armL: { a: 0.15, b: 0.15 }, brow: 0.3, mouth: 'smile' },
  holdUmbrella: { armR: { a: 2.3, b: 0.45 }, armL: { a: 0.2, b: 0.2 }, brow: 0.3, mouth: 'smile' },
  holdParasol: { armR: { a: 2.3, b: 0.45 }, armL: { a: 0.25, b: 0.3 }, brow: 0.4, mouth: 'smile', headTilt: 0.04 },
  holdLedger: { armL: { a: 0.7, b: 1.2 }, armR: { a: 0.3, b: 0.2 }, brow: 0.2, mouth: 'smile' },
  carry: { armL: { a: 1.1, b: 0.4 }, armR: { a: 1.1, b: 0.4 }, brow: 0, mouth: 'flat' },
};
const MOODS = {
  watch: ['watch', 'akimbo', 'lean', 'point', 'whisper', 'handChin', 'clap', 'watch'],
  amazed: ['gasp', 'point', 'cheer', 'clap', 'pointUp', 'handsCheeks', 'point'],
  cheer: ['cheer', 'clap', 'cheerOne', 'cheer', 'clap'],
  gasp: ['gasp', 'handsCheeks', 'recoil', 'point', 'gasp'],
  laugh: ['laughBelly', 'laughPoint', 'laughBack', 'slapTable'],
  experts: ['skeptic', 'notes', 'stern', 'handChin', 'akimbo'],
};
function mergePose(base, part) {
  const p = { ...base, ...part };
  for (const k of ['armL', 'armR', 'legL', 'legR']) p[k] = { ...base[k], ...(part[k] || {}) };
  return p;
}
function blendPose(a, b, u) {
  const o = { ...b };
  for (const k of ['lean', 'bob', 'headTilt', 'turn', 'brow', 'eyes', 'lookX', 'lookY', 'sweat', 'squint', 'clap', 'write', 'shake', 'hop', 'hatLift', 'hatDroop'])
    o[k] = lerp(a[k] ?? DEFAULT_POSE[k] ?? 0, b[k] ?? DEFAULT_POSE[k] ?? 0, u);
  for (const k of ['armL', 'armR', 'legL', 'legR']) o[k] = { a: lerp(a[k].a, b[k].a, u), b: lerp(a[k].b, b[k].b, u) };
  if (u < 0.5) { o.mouth = a.mouth; }
  return o;
}

// ---------------- light presets ----------------
// Each preset carries its whole look: sky/fog, sun, hemisphere, lamps, spot + beam, rim/tint on people,
// exposure, and the per-look extras that used to be name checks:
//   long: long-shadow opacity · vig/vigA: vignette colour + strength · motes: 'dust' | 'snow' | 'sawdust' | 'heat' | 'none'
//   mote: mote strength · shimmer: heat-shimmer amplitude in px (0 = off)
// Numbers and '#colours' blend over 0.35 s when the light changes inside one set; other values switch at the midpoint.
const LIGHTS = {
  warm: { bg: '#f2b47c', fog: '#e9ad78', near: 16, far: 46, sun: '#ffd09a', sunI: 2.8, sunPos: [-10, 6.2, 7], hemiS: '#ffe6c4', hemiG: '#6b4a32', hemiI: 0.95, lamp: 0.7, spot: 0, beam: 0, rim: '#ffc27a', tint: '#fff1e2', exp: 1.0, mote: 0.6, motes: 'dust', long: 1, vig: '#1e0f00', vigA: 0.38, shimmer: 0 },
  cool: { bg: '#a7b2c1', fog: '#9da9b8', near: 14, far: 40, sun: '#e3eaf7', sunI: 1.6, sunPos: [7, 10, 6], hemiS: '#c9d3e1', hemiG: '#3f3f48', hemiI: 1.05, lamp: 0.25, spot: 0, beam: 0, rim: '#bcd2ff', tint: '#eef2f8', exp: 1.0, mote: 0.25, motes: 'dust', long: 0.45, vig: '#1e0f00', vigA: 0.38, shimmer: 0 },
  spot: { bg: '#0b0e16', fog: '#0b0e16', near: 7, far: 24, sun: '#5a6a9a', sunI: 0.22, sunPos: [6, 10, 6], hemiS: '#2e3650', hemiG: '#0e0a0a', hemiI: 0.22, lamp: 0.08, spot: 90, beam: 0.55, rim: '#fff1cc', tint: '#ffffff', exp: 1.05, mote: 0.9, motes: 'dust', long: 0, vig: '#000000', vigA: 0.6, shimmer: 0 },
  // ---- S02 looks (art brief 1.10) ----
  // deep navy, cold moon key from high left, warm lantern points, falling snow
  night: { bg: '#0b1630', fog: '#0d1a34', near: 9, far: 36, sun: '#9db6ff', sunI: 1.15, sunPos: [-8, 12, 6], hemiS: '#4a5f8f', hemiG: '#10141f', hemiI: 0.55, lamp: 1.0, spot: 0, beam: 0, rim: '#bcd2ff', tint: '#dfe7ff', exp: 1.0, mote: 0.85, motes: 'snow', long: 0.3, vig: '#000814', vigA: 0.55, shimmer: 0 },
  // bright grey-white overcast, soft short shadows, falling snow, cool rim
  snow: { bg: '#d9dee6', fog: '#cfd6df', near: 12, far: 42, sun: '#f4f6fb', sunI: 1.2, sunPos: [5, 12, 7], hemiS: '#e8edf5', hemiG: '#6c7380', hemiI: 1.3, lamp: 0.15, spot: 0, beam: 0, rim: '#e6eeff', tint: '#f4f6fa', exp: 1.05, mote: 0.9, motes: 'snow', long: 0.25, vig: '#1a2230', vigA: 0.3, shimmer: 0 },
  // hard high sun, short dark shadows, saturated sky, warm bounce, a little heat haze
  tropic: { bg: '#5ec3f0', fog: '#9fd9f2', near: 30, far: 95, sun: '#fff1d0', sunI: 3.4, sunPos: [3, 14, 5], hemiS: '#bfe8ff', hemiG: '#a07848', hemiI: 1.0, lamp: 0, spot: 0, beam: 0, rim: '#fff2c8', tint: '#fff8ec', exp: 1.05, mote: 0.3, motes: 'heat', long: 0.35, vig: '#3a2400', vigA: 0.28, shimmer: 3 },
  // warmer yellow, more haze, softer shadows than tropic (so the two ports feel different)
  tropicHaze: { bg: '#e9c98a', fog: '#e2bf86', near: 18, far: 75, sun: '#ffd99a', sunI: 2.3, sunPos: [-6, 10, 6], hemiS: '#ffe6b8', hemiG: '#7a5a38', hemiI: 1.15, lamp: 0, spot: 0, beam: 0, rim: '#ffd38a', tint: '#fff0d8', exp: 1.0, mote: 0.45, motes: 'heat', long: 0.3, vig: '#3a2400', vigA: 0.32, shimmer: 2 },
  // overexposed white-orange sun, orange far fog, strong heat shimmer
  blaze: { bg: '#ffb35c', fog: '#ff9a45', near: 18, far: 55, sun: '#fff0c8', sunI: 3.8, sunPos: [0, 6, -14], hemiS: '#ffe1b0', hemiG: '#8a4a20', hemiI: 1.2, lamp: 0, spot: 0, beam: 0, rim: '#fff0b0', tint: '#fff2e0', exp: 1.18, mote: 0.5, motes: 'heat', long: 0.6, vig: '#5a1e00', vigA: 0.4, shimmer: 6 },
  // dark cool interior, white-gold shaft from the hatch (uses the set's spot + beam), motes in the shaft
  hold: { bg: '#05080d', fog: '#070b12', near: 8, far: 24, sun: '#4a5a7a', sunI: 0.18, sunPos: [6, 10, 6], hemiS: '#2e4262', hemiG: '#0e0a08', hemiI: 0.9, lamp: 0.6, spot: 80, beam: 0.6, rim: '#fff1cc', tint: '#ffffff', exp: 1.15, mote: 0.9, motes: 'dust', long: 0, vig: '#000000', vigA: 0.6, shimmer: 0 },
  // readable night (S02 round 1b): the same navy mood, but a stronger moon key, more fill, lanterns brighter, cool rim on people
  nightReadable: { bg: '#0e1c3c', fog: '#13234a', near: 12, far: 46, sun: '#b8ccff', sunI: 1.7, sunPos: [-8, 12, 6], hemiS: '#6178ad', hemiG: '#1a2236', hemiI: 0.95, lamp: 1.25, spot: 0, beam: 0, rim: '#cfe0ff', tint: '#e8eeff', exp: 1.12, mote: 0.85, motes: 'snow', long: 0.3, vig: '#000814', vigA: 0.45, shimmer: 0 },
  // warm key from the left/outside, cool blue fill on the ice
  cutaway: { bg: '#26314a', fog: '#26314a', near: 14, far: 40, sun: '#ffb070', sunI: 2.6, sunPos: [-7, 5, 9], hemiS: '#8fb8ff', hemiG: '#2a1a10', hemiI: 0.8, lamp: 0, spot: 0, beam: 0, rim: '#bfe0ff', tint: '#f4f8ff', exp: 1.0, mote: 0.4, motes: 'sawdust', long: 0, vig: '#0a1020', vigA: 0.45, shimmer: 0 },
  // wide, readable versions for empty or wide sets (fog pushed back): the snowy wharf, Boston in May 1833, a clear day at sea
  snowWide: { bg: '#d9dee6', fog: '#cfd6df', near: 22, far: 80, sun: '#f4f6fb', sunI: 1.3, sunPos: [5, 12, 7], hemiS: '#e8edf5', hemiG: '#6c7380', hemiI: 1.3, lamp: 0.15, spot: 0, beam: 0, rim: '#e6eeff', tint: '#f4f6fa', exp: 1.05, mote: 0.8, motes: 'snow', long: 0.25, vig: '#1a2230', vigA: 0.3, shimmer: 0 },
  mayWarm: { bg: '#f4c890', fog: '#efc392', near: 26, far: 90, sun: '#ffe0b0', sunI: 2.8, sunPos: [-10, 9, 8], hemiS: '#ffeccc', hemiG: '#6b4a32', hemiI: 1.0, lamp: 0.7, spot: 0, beam: 0, rim: '#ffc27a', tint: '#fff1e2', exp: 1.0, mote: 0.3, motes: 'dust', long: 0.8, vig: '#1e0f00', vigA: 0.32, shimmer: 0 },
  seaDay: { bg: '#8fc3e8', fog: '#a9d2ee', near: 30, far: 110, sun: '#fff4dc', sunI: 3.0, sunPos: [-8, 12, 9], hemiS: '#d6ecff', hemiG: '#2c4a63', hemiI: 1.1, lamp: 0, spot: 0, beam: 0, rim: '#fff2c8', tint: '#fff8ec', exp: 1.0, mote: 0, motes: 'none', long: 0.3, vig: '#0a1a2a', vigA: 0.25, shimmer: 0 },
};
export { LIGHTS, P as POSES };
const col = (c) => new THREE.Color(c);
const rgba = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; }; // sRGB hex → css
const mod = (a, n) => ((a % n) + n) % n;
// two-render transitions: how long each side of the cut they run (s)
const MIX = { match: 0.1, 'wipe:flare': 0.25, 'wipe:paper': 0.3, pushfade: 0.16 }; // pushfade: the push-in dolly with a cross-dissolve, never through black
const IRIS = 0.32;

// =====================================================================
export async function setup(beatsUrl, tlUrl) {
  const mod_ = await import(beatsUrl);
  const TL = await (await fetch(tlUrl)).json();
  const { meta, cast, beats } = mod_;
  const crowdIds = mod_.crowdIds || [], expertIds = mod_.expertIds || [];
  const R = resolver(TL);
  const EV = compile(meta, beats, TL);
  const beatAt = (t) => { let i = 0; while (i < TL.beats.length - 1 && t >= TL.beats[i + 1].start) i++; return i; };
  const PRESETS = { ...LIGHTS, ...(meta.lights || {}) };
  const DEFAULT_SET = meta.set || 'courtyard';

  // ---------- renderer ----------
  const glCanvas = document.createElement('canvas'); glCanvas.width = W; glCanvas.height = H;
  const renderer = new THREE.WebGLRenderer({ canvas: glCanvas, antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1); renderer.setSize(W, H, false);
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xe9ad78, 16, 46);
  const camera = new THREE.PerspectiveCamera(50, W / H, 0.05, 120);
  const sun = new THREE.DirectionalLight(0xffd09a, 2.8);
  sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -15, right: 15, top: 15, bottom: -15, near: 1, far: 50 });
  sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.02;
  scene.add(sun, sun.target);
  const hemi = new THREE.HemisphereLight(0xffe6c4, 0x6b4a32, 0.95); scene.add(hemi);

  // ---------- sets: build every set the beats file names, once ----------
  const SHOTS = [];
  beats.forEach((b, bi) => b.shots.forEach((s, si) => SHOTS.push({ ...s, t0: R(s.at, bi), beat: bi, si })));
  SHOTS.forEach((s, i) => { s.t1 = i < SHOTS.length - 1 ? SHOTS[i + 1].t0 : TL.duration; s.prev = SHOTS[i - 1]; s.next = SHOTS[i + 1]; });
  const setOf = (s) => s.set || beats[s.beat].set || DEFAULT_SET;
  const lightOf = (s) => s.light || beats[s.beat].light || 'warm';
  const sets = {};
  for (const name of new Set([DEFAULT_SET, ...SHOTS.map(setOf)])) {
    const so = (meta.sets || {})[name] || {}; // `base` builds this name with another set's builder (two dressings of one set)
    const builder = SETS[name] || SETS[so.base] || SETS.empty;
    if (!SETS[name] && !SETS[so.base]) console.warn(`set "${name}" has no builder yet; using an empty floor`);
    sets[name] = builder(scene, so);
    sets[name].name = name;
  }
  let curSet = null;
  function useSet(name) {
    if (curSet === name) return sets[name];
    for (const [n, s] of Object.entries(sets)) s.group.visible = n === name;
    const s = sets[name]; curSet = name;
    const sc = sun.shadow.camera, sz = s.shadowSize;
    if (sc.right !== sz) { Object.assign(sc, { left: -sz, right: sz, top: sz, bottom: -sz }); sc.updateProjectionMatrix(); }
    return s;
  }

  // ---------- cards ----------
  const shadowTex = TX.radial('rgba(0,0,0,.55)', 'rgba(0,0,0,0)');
  const longShadowTex = TX.radial('rgba(30,15,5,.35)', 'rgba(30,15,5,0)');
  function makeCard(cw, ch, ww, wh, groundFrac) {
    const canvas = document.createElement('canvas'); canvas.width = cw; canvas.height = ch;
    const tex = new THREE.CanvasTexture(canvas); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
    const geo = new THREE.PlaneGeometry(ww, wh); geo.translate(0, wh / 2 - wh * groundFrac, 0);
    const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: false, alphaTest: 0.5, alphaToCoverage: true, side: THREE.DoubleSide, fog: false });
    const mesh = new THREE.Mesh(geo, mat);
    return { canvas, ctx: canvas.getContext('2d'), tex, mesh, mat };
  }
  function contact(w, d, op = 1) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity: op }));
    m.rotation.x = -Math.PI / 2; m.position.y = 0.012; return m;
  }
  function longShadow(len, w) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, len), new THREE.MeshBasicMaterial({ map: longShadowTex, transparent: true, depthWrite: false }));
    m.geometry.translate(0, -len / 2 + 0.2, 0); m.rotation.x = -Math.PI / 2; m.position.y = 0.011; return m;
  }
  const RES = { hero: [1024, 1536, 2], mid: [512, 768, 1], extra: [384, 576, 0.75] };
  const PERSON_W = 1.44, PERSON_H = 2.16, PERSON_GROUND = (768 - 745) / 768;
  const chars = {};
  for (const [id, def] of Object.entries(cast)) {
    const [cw, ch, s] = RES[def.card];
    const card = makeCard(cw, ch, PERSON_W, PERSON_H, PERSON_GROUND);
    const g = new THREE.Group(); g.add(card.mesh);
    const sc = def.c.scale || 1;
    const sh = contact(0.95 * sc, 0.5 * sc); const ls = longShadow(2.4 * sc, 0.55 * sc);
    scene.add(g, sh, ls);
    const sets_ = def.set == null ? null : [].concat(def.set);
    chars[id] = { id, def, card, g, sh, ls, res: s, acts: [], pos: [], visibleFrom: def.hidden ? Infinity : -1, lastKey: '', sets: sets_, baseY: 0 };
  }

  // ---------- Hans (S01; only when meta.hans asks: { set, at: [x, z] }) ----------
  let hans = null;
  if (meta.hans) {
    const hp0 = meta.hans.at || [0, -2]; const hg = sets[meta.hans.set || DEFAULT_SET].group;
    const HW = 3.36, HPX = 1024 / HW;
    const horse = makeCard(1024, 768, HW, 768 / HPX, 2 / 768);
    const LEG = { x0: 548, y0: 380, w: 256, h: 388, s: 3 };
    const leg = makeCard(LEG.w * LEG.s, LEG.h * LEG.s, LEG.w / HPX, LEG.h / HPX, 0);
    leg.mesh.position.set((LEG.x0 + LEG.w / 2 - 512) / HPX, (766 - (LEG.y0 + LEG.h)) / HPX, 0.012);
    const g = new THREE.Group(); g.add(horse.mesh, leg.mesh); g.position.set(hp0[0], 0, hp0[1]);
    const sh = contact(3.0, 0.9); sh.position.set(hp0[0] - 0.1, 0.012, hp0[1]);
    const ls = longShadow(4, 1.4); ls.position.set(hp0[0] - 0.1, 0.011, hp0[1]);
    hg.add(g, sh, ls);
    const HOOF = new THREE.Vector3(hp0[0] + (648 - 512) / HPX, 0.03, hp0[1] + 0.02);
    // dust puffs at hoof strikes
    const dustTex = TX.radial('rgba(205,180,140,.85)', 'rgba(205,180,140,0)');
    const dust = []; for (let i = 0; i < 48; i++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: dustTex, transparent: true, depthWrite: false })); sp.visible = false; hg.add(sp); dust.push(sp); }
    hans = { g, sh, ls, horse, leg, LEG, HOOF, dust, at: hp0, set: meta.hans.set || DEFAULT_SET,
      head: new THREE.Vector3(hp0[0] + 0.9, 1.8, hp0[1]), hoofLook: new THREE.Vector3(hp0[0] + 0.45, 0.3, hp0[1]) };
  }

  // one-frame easter egg in a window (meta.cameo = { t, pos:[x,y,z], set })
  let cameo = null;
  if (meta.cameo) {
    const cc = makeCard(512, 768, 0.84, 1.26, 0);
    cc.ctx.setTransform(1, 0, 0, 1, 256, 768); drawLogCameo(cc.ctx); cc.tex.needsUpdate = true;
    cc.mesh.position.set(...meta.cameo.pos); cc.mesh.visible = false; sets[meta.cameo.set || DEFAULT_SET].group.add(cc.mesh); cameo = cc.mesh;
  }

  // ---------- falling / floating particles (snow, sawdust, heat specks), world-anchored around the camera ----------
  const PN = 1400, PB = 22, PH_ = 10;
  const pSeed = new Float32Array(PN * 4); { let v = 77; const r = () => (v = (v * 9301 + 49297) % 233280) / 233280; for (let i = 0; i < PN * 4; i++) pSeed[i] = r(); }
  const pPos = new Float32Array(PN * 3);
  const pGeo = new THREE.BufferGeometry(); pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const flakeTex = TX.radial('rgba(255,255,255,1)', 'rgba(255,255,255,0)');
  const pMat = new THREE.PointsMaterial({ map: flakeTex, size: 0.08, transparent: true, depthWrite: false, opacity: 0, color: 0xffffff });
  const particles = new THREE.Points(pGeo, pMat); particles.frustumCulled = false; particles.visible = false; scene.add(particles);
  const PTYPE = { // fall speed m/s (negative rises), size, colour, sway, count share, opacity factor
    snow: { v: 0.9, size: 0.075, color: 0xffffff, sway: 0.35, n: 1, op: 1 },
    sawdust: { v: 0.35, size: 0.035, color: 0xd9b27a, sway: 0.5, n: 0.7, op: 0.9 },
    heat: { v: -0.22, size: 0.03, color: 0xffe2b0, sway: 0.15, n: 0.45, op: 0.45 },
  };
  function updateParticles(type, strength, t) {
    const P = PTYPE[type];
    if (!P || strength <= 0.01) { particles.visible = false; return; }
    particles.visible = true; pMat.size = P.size; pMat.color.setHex(P.color); pMat.opacity = Math.min(1, strength * P.op);
    const n = Math.floor(PN * P.n); const cx = camera.position.x, cz = camera.position.z, y0 = Math.max(0, camera.position.y - PH_ / 2);
    for (let i = 0; i < PN; i++) {
      const o = i * 4, q = i * 3;
      if (i >= n) { pPos[q + 1] = -999; continue; }
      const ph = pSeed[o + 3] * 6.283;
      const x = pSeed[o] * PB + Math.sin(t * 0.7 + ph) * P.sway + t * 0.12;
      const z = pSeed[o + 2] * PB + Math.cos(t * 0.6 + ph) * P.sway * 0.6;
      pPos[q] = cx + mod(x - cx, PB) - PB / 2;
      pPos[q + 2] = cz + mod(z - cz, PB) - PB / 2;
      pPos[q + 1] = y0 + mod(pSeed[o + 1] * PH_ - P.v * t, PH_);
    }
    pGeo.attributes.position.needsUpdate = true;
  }

  // ---------- per-beat compiled tracks ----------
  beats.forEach((b, bi) => {
    const bt = TL.beats[bi];
    for (const [id, keys] of Object.entries(b.acts || {})) for (const [at, name, opts] of keys) {
      const o = { ...(opts || {}) };
      if (o.talk) o.talk = [R(o.talk[0], bi), R(o.talk[1], bi)];
      if (o.monoPop) o.monoPop = R(o.monoPop, bi);
      chars[id].acts.push({ t: R(at, bi), name, pose: P[name] || {}, opts: o, beat: bi });
    }
    for (const [id, keys] of Object.entries(b.pos || {})) for (const [at, p, how] of keys) chars[id].pos.push({ t: R(at, bi), p, walk: how === 'walk', beat: bi });
    for (const id of b.show || []) chars[id].visibleFrom = Math.min(chars[id].visibleFrom, bt.start);
    if (b.march) {
      const m = b.march; const s = R(m.start, bi);
      m.ids.forEach((id, i) => {
        const a = m.from(i), z = m.to(i); const d = Math.hypot(z[0] - a[0], z[1] - a[1]);
        const st = s + (m.delay ? m.delay(i) : (i % 7) * 0.06 + Math.floor(i / 7) * 0.35);
        chars[id].pos.push({ t: bt.start, p: a, beat: bi }, { t: st, p: a, beat: bi }, { t: st + d / m.speed, p: z, walk: true, march: true, beat: bi });
        chars[id].visibleFrom = Math.min(chars[id].visibleFrom, bt.start);
        chars[id].marchHome = z; chars[id].marchHomeT = bt.start;
      });
    }
  });
  for (const c of Object.values(chars)) { c.acts.sort((a, b) => a.t - b.t); c.pos.sort((a, b) => a.t - b.t); }
  const hansExpr = [], sparkles = [];
  beats.forEach((b, bi) => {
    if (b.hans && b.hans.expr) for (const [at, e] of b.hans.expr) hansExpr.push({ t: R(at, bi), e });
    if (b.hans && b.hans.sparkle != null) sparkles.push(R(b.hans.sparkle, bi));
  });
  hansExpr.sort((a, b) => a.t - b.t);
  const keysOf = (field, f) => { const out = []; beats.forEach((b, bi) => (b[field] || []).forEach((k) => out.push({ ...f(k, bi), beat: bi }))); return out.sort((a, b) => a.t - b.t); };
  const boardKeys = keysOf('board', ([at, lines, rv], bi) => ({ t: R(at, bi), lines, rv: rv[0] < 0 ? null : [R(rv[0], bi), R(rv[1], bi)] }));
  const screenKeys = keysOf('screen', ([at, v], bi) => ({ t: R(at, bi), v: Array.isArray(v) ? v : [v] }));
  const doorKeys = keysOf('doors', ([at, v], bi) => ({ t: R(at, bi), v }));
  // movers: `ship: [[at, [x, z, (y)], heading, 'sail'?]]` or `movers: { name: [...] }` (moves set.movers[name])
  const moverKeys = {};
  beats.forEach((b, bi) => {
    const m = { ...(b.movers || {}) }; if (b.ship) m.ship = b.ship;
    for (const [name, keys] of Object.entries(m)) for (const [at, p, hd, how] of keys) (moverKeys[name] = moverKeys[name] || []).push({ t: R(at, bi), p, hd: hd || 0, sail: how === 'sail', beat: bi });
  });
  for (const k of Object.values(moverKeys)) k.sort((a, b) => a.t - b.t);
  // openers: `open: { hatch: [[at, v]], sails: [[at, v]] }` (eases between keys of one beat, like doors)
  const openKeys = {};
  beats.forEach((b, bi) => { for (const [name, keys] of Object.entries(b.open || {})) for (const [at, v] of keys) (openKeys[name] = openKeys[name] || []).push({ t: R(at, bi), v, beat: bi }); });
  for (const k of Object.values(openKeys)) k.sort((a, b) => a.t - b.t);

  // ---------- effects: puddles, drips, heat arrows (beat `fx` entries; they live in that beat's set) ----------
  const FX = [];
  const arrowTex = (() => {
    const c = document.createElement('canvas'); c.width = 512; c.height = 256; const k = c.getContext('2d');
    k.lineJoin = 'round'; k.beginPath(); k.moveTo(20, 92); k.lineTo(330, 92); k.lineTo(330, 30); k.lineTo(490, 128); k.lineTo(330, 226); k.lineTo(330, 164); k.lineTo(20, 164); k.closePath();
    k.fillStyle = '#ff5a1f'; k.fill(); k.lineWidth = 18; k.strokeStyle = '#1a0d06'; k.stroke();
    k.fillStyle = 'rgba(255,220,120,.55)'; k.fillRect(40, 102, 280, 16);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  })();
  const dropMat = new THREE.MeshStandardMaterial({ color: 0xcfeaff, roughness: 0.05, metalness: 0.2, emissive: 0x2a4a66 });
  const dropGeo = new THREE.SphereGeometry(1, 10, 8);
  beats.forEach((b, bi) => (b.fx || []).forEach((f) => {
    const setName = f.set || b.set || DEFAULT_SET; const parent = sets[setName].group;
    const at = R(f.at ?? 0, bi), until = f.until != null ? R(f.until, bi) : Infinity;
    const e = { ...f, at, until, setName };
    if (f.kind === 'puddle') {
      const s0 = hash(at, 'pud') * 6.28; const pts = [];
      for (let i = 0; i < 40; i++) { const a = i / 40 * Math.PI * 2; const rr = 1 + 0.12 * Math.sin(3 * a + s0) + 0.07 * Math.sin(5 * a + 2 * s0); pts.push(new THREE.Vector2(Math.cos(a) * rr, Math.sin(a) * rr)); }
      const m = new THREE.Mesh(new THREE.ShapeGeometry(new THREE.Shape(pts)), new THREE.MeshStandardMaterial({ color: f.color ?? 0x6f93ad, roughness: 0.06, metalness: 0.55, transparent: true, opacity: 0.88, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 }));
      m.rotation.x = -Math.PI / 2; m.position.set(f.pos[0], (f.pos[2] || 0) + 0.006, f.pos[1]); m.visible = false; m.receiveShadow = true; parent.add(m);
      e.mesh = m;
    } else if (f.kind === 'drip') {
      e.drops = []; for (let i = 0; i < 6; i++) { const d = new THREE.Mesh(dropGeo, dropMat); d.visible = false; parent.add(d); const sp = new THREE.Mesh(new THREE.RingGeometry(0.6, 1, 20), new THREE.MeshBasicMaterial({ color: 0xdff2ff, transparent: true, depthWrite: false, side: THREE.DoubleSide })); sp.rotation.x = -Math.PI / 2; sp.visible = false; parent.add(sp); e.drops.push({ d, sp }); }
    } else if (f.kind === 'arrows') {
      e.root = new THREE.Group(); e.root.rotation.y = f.ry || 0; parent.add(e.root);
      const from = new THREE.Vector3(...f.from), to = new THREE.Vector3(...f.to);
      e.from = from; e.to = to; e.n = f.n || 4; e.every = f.every ?? 0.45; e.life = f.life ?? 1.6;
      const d = to.clone().sub(from); e.roll = Math.atan2(d.y, Math.hypot(d.x, d.z) * Math.sign(d.x || 1));
      e.arrows = []; for (let i = 0; i < e.n * 3; i++) { const m = new THREE.Mesh(new THREE.PlaneGeometry(f.len ?? 0.9, (f.len ?? 0.9) * 0.5), new THREE.MeshBasicMaterial({ map: arrowTex, transparent: true, depthWrite: false, side: THREE.DoubleSide, fog: false })); m.visible = false; e.root.add(m); e.arrows.push(m); }
    }
    FX.push(e);
  }));
  function updateFx(t, setName) {
    for (const e of FX) {
      const live = e.setName === setName && t >= e.at && t < e.until;
      if (e.kind === 'puddle') {
        e.mesh.visible = live; if (!live) continue;
        const [r0, r1] = e.r || [0.05, 0.6]; const u = ease.out(clamp((t - e.at) / (e.grow ?? 2)));
        const r = lerp(r0, r1, u); e.mesh.scale.set(r * (e.sx ?? 1.3), r, 1);
      } else if (e.kind === 'drip') {
        const rate = e.rate ?? 1.5, [x, y0, z] = e.pos, gy = e.to ?? 0, fall = Math.sqrt(2 * Math.max(0.01, y0 - gy) / 9.8);
        let j = 0;
        if (live) {
          const kNow = Math.floor((t - e.at) * rate);
          for (let k = Math.max(0, kNow - 3); k <= kNow && j < e.drops.length; k++) {
            const te = e.at + k / rate; const age = t - te; const { d, sp } = e.drops[j++];
            const s = e.size ?? 0.028;
            if (age < 0.25) { const g = age / 0.25; d.visible = true; d.position.set(x, y0 - s * g, z); d.scale.set(s * g, s * 1.4 * g, s * g); sp.visible = false; }
            else if (age < 0.25 + fall) { const a = age - 0.25; d.visible = true; d.position.set(x, y0 - 0.5 * 9.8 * a * a, z); d.scale.set(s * 0.8, s * 2.2, s * 0.8); sp.visible = false; }
            else if (age < 0.25 + fall + 0.22) { const a = (age - 0.25 - fall) / 0.22; d.visible = false; sp.visible = true; sp.position.set(x, gy + 0.008, z); const rs = 0.03 + a * 0.16; sp.scale.set(rs, rs, 1); sp.material.opacity = 0.8 * (1 - a); }
            else { d.visible = false; sp.visible = false; }
          }
        }
        for (; j < e.drops.length; j++) { e.drops[j].d.visible = false; e.drops[j].sp.visible = false; }
      } else if (e.kind === 'arrows') {
        e.root.visible = live; if (!live) continue;
        // each cycle of n: n-1 strong arrows slow down and fade inside the layer; the last one is faint and thin and reaches `to`
        const stops = e.stops || [0.42, 0.55, 0.36, 0.6];
        let j = 0;
        const kNow = Math.floor((t - e.at) / e.every);
        for (let k = Math.max(0, kNow - Math.ceil(e.life / e.every)); k <= kNow && j < e.arrows.length; k++) {
          const age = t - (e.at + k * e.every); if (age < 0 || age > e.life) continue;
          const i = k % e.n, faint = i === e.n - 1; const tau = age / e.life;
          const m = e.arrows[j++]; m.visible = true;
          const stop = faint ? 1 : stops[i % stops.length];
          const p = stop * (1 - (1 - tau) ** (faint ? 1.6 : 3));
          const pos = e.from.clone().lerp(e.to, p); const lane = ((i * 0.37) % 1 - 0.5) * (e.spread ?? 0.5);
          m.position.set(pos.x, pos.y + (faint ? 0 : lane), pos.z); m.rotation.z = e.roll;
          const sy = faint ? 0.38 : 1 - 0.35 * tau, sx = faint ? 0.75 : 1 - 0.25 * tau; m.scale.set(sx, sy, 1);
          m.material.opacity = faint ? 0.42 * clamp((1 - tau) / 0.25) * clamp(age / 0.15) : clamp(age / 0.12) * (1 - ease.inout(clamp((tau - 0.25) / 0.75)));
        }
        for (; j < e.arrows.length; j++) e.arrows[j].visible = false;
      }
    }
    // movers (ship track + bob)
    const S = sets[setName];
    for (const [name, keys] of Object.entries(moverKeys)) {
      const g = S.movers[name]; if (!g) continue;
      let i = -1; for (let j = 0; j < keys.length; j++) if (keys[j].t <= t) i = j;
      if (i < 0) continue;
      let p = keys[i].p, hd = keys[i].hd, speed = 0; const n = keys[i + 1];
      if (n && n.sail) { const r = clamp((t - keys[i].t) / (n.t - keys[i].t)), u = ease.inout(r); p = [lerp(p[0], n.p[0], u), lerp(p[1], n.p[1], u), lerp(p[2] || 0, n.p[2] || 0, u)]; hd = lerp(hd, n.hd, u); speed = r > 0 && r < 1 ? 4 * r * (1 - r) : 0; }
      const bob = g.userData.bob ?? 1; // movers can ask for a gentler bob (a docked ship)
      g.userData.speed = speed; g.userData.baseY = p[2] || 0;
      g.position.set(p[0], (p[2] || 0) + Math.sin(t * 1.3) * 0.04 * bob, p[1]);
      g.rotation.set(Math.sin(t * 1.1 + 1) * 0.025 * bob, hd, Math.sin(t * 0.9) * 0.035 * bob);
    }
  }

  // ---------- helpers ----------
  function keyAt(keys, t) { let k = null; for (const q of keys) if (q.t <= t) k = q; return k; }
  // value of a keyed track: eases between consecutive keys of the same beat, holds otherwise
  function keyLerp(keys, t, def) {
    let i = -1; for (let j = 0; j < keys.length; j++) if (keys[j].t <= t) i = j;
    if (i < 0) return def;
    const k = keys[i], n = keys[i + 1];
    if (n && n.beat === k.beat) return lerp(k.v, n.v, ease.inout(clamp((t - k.t) / (n.t - k.t))));
    return k.v;
  }

  function charPos(c, t) {
    const ks = c.pos; let p = c.def.home, moving = 0, march = false;
    if (c.marchHome && t >= c.marchHomeT) p = c.marchHome;
    let i = -1; for (let j = 0; j < ks.length; j++) if (ks[j].t <= t) i = j;
    if (i >= 0) {
      p = ks[i].p;
      const n = ks[i + 1];
      if (n && n.walk && n.beat === ks[i].beat) {
        const u = clamp((t - ks[i].t) / (n.t - ks[i].t));
        p = [lerp(ks[i].p[0], n.p[0], u), lerp(ks[i].p[1], n.p[1], u), lerp(ks[i].p[2] || 0, n.p[2] || 0, u)];
        const d = Math.hypot(n.p[0] - ks[i].p[0], n.p[1] - ks[i].p[1], (n.p[2] || 0) - (ks[i].p[2] || 0));
        moving = u > 0 && u < 1 ? d * u : 0; march = !!n.march;
        if (u >= 1) moving = 0;
      }
    }
    return { p, moving, march };
  }
  function lookTarget(id, bi) {
    const b = beats[bi]; const l = (b.look || {})[id];
    if (l === 'camera') return null;
    if (Array.isArray(l)) return new THREE.Vector3(...l);
    if (l === 'hoof') return hans ? hans.hoofLook.clone() : null;
    if (l && chars[l]) { const q = chars[l].g.position; return new THREE.Vector3(q.x, chars[l].baseY + 1.4, q.z); }
    if (!l && b.lookAll) return new THREE.Vector3(...b.lookAll); // S02: everyone without a target watches this point
    return hans ? hans.head.clone() : null; // S01: everyone watches Hans's head by default
  }

  function poseFor(c, t, bi, worldPos, scr) {
    const acts = c.acts; let k = -1;
    for (let j = 0; j < acts.length; j++) if (acts[j].t <= t && acts[j].beat === bi) k = j;
    let target, since, prevPose, opts = {};
    const b = beats[bi]; const bt = TL.beats[bi];
    if (k >= 0) {
      target = mergePose(DEFAULT_POSE, acts[k].pose); since = t - acts[k].t; opts = acts[k].opts;
      const pk = k > 0 && acts[k - 1].beat === bi ? acts[k - 1] : null;
      prevPose = pk ? mergePose(DEFAULT_POSE, pk.pose) : mergePose(DEFAULT_POSE, P.watch);
      if (!pk && acts[k].t <= bt.start + 0.01) prevPose = target;
    } else {
      // mood-driven background acting
      let mood = 'watch';
      const isCrowd = crowdIds.includes(c.id), isExpert = expertIds.includes(c.id);
      if (b.mood && isCrowd && b.mood.crowd) mood = b.mood.crowd;
      if (isExpert) mood = (b.mood && b.mood.table && c.def.home[0] < -6) ? 'laugh' : 'experts';
      if (c.def.mood && !isCrowd && !isExpert) mood = (b.mood && b.mood[c.def.mood]) || mood; // other groups: cast.def.mood names a key in beat.mood
      if (c.id === 'eddie') mood = 'eddie';
      const list = mood === 'eddie' ? ['watch', 'proud', 'akimbo', 'present'] : MOODS[mood] || MOODS.watch;
      const per = 1.15 + hash(c.id, 'per') * 0.7; const off = hash(c.id, 'off') * per;
      const local = t - bt.start + off; const slot = Math.floor(local / per);
      const pick = (s) => list[Math.floor(hash(c.id, bi, s) * list.length)];
      target = mergePose(DEFAULT_POSE, P[pick(slot)]); prevPose = mergePose(DEFAULT_POSE, P[pick(slot - 1)]);
      since = local - slot * per;
      if (slot === 0) prevPose = target;
    }
    const u = clamp(since / 0.26); let p = blendPose(prevPose, target, backOut(u));
    // no held poses: subtle alternate every 1.6 s
    const hold = Math.floor(since / 1.6);
    if (hold > 0) { const alt = hold % 2; const v = hash(c.id, k, hold); const w = clamp((since - hold * 1.6) / 0.25);
      const amt = alt ? w : 1 - w;
      p.headTilt += amt * (v - 0.5) * 0.18; p.brow = clamp(p.brow + amt * (v > 0.5 ? 0.25 : -0.15), -1, 1);
      p.armL.b += amt * 0.12; p.armR.a += amt * (v - 0.5) * 0.2; p.lookX += amt * (v > 0.5 ? 1 : -1); }
    if (opts.freeze) { if (opts.item !== undefined) p.item = opts.item; if (opts.itemL !== undefined) p.itemL = opts.itemL; p.dir = scr.dir; p.turn = scr.turn; p.lookX = clamp(p.lookX + scr.turn * 1.5, -1.2, 1.2); return p; } // S02: deadpan hold — a true micro-freeze (no bob, no blink)
    // procedural layers
    const seed = hash(c.id) * 10;
    p.bob += Math.sin(t * 2.2 + seed) * 2;
    const bper = 2.8 + hash(c.id, 'blink') * 1.6; const bph = (t + seed) % bper;
    if (bph < 0.11) p.eyes = Math.min(p.eyes, 0.05);
    if (p.clap) { const s = Math.sin(t * 17 + seed); p.armL.b += s * 0.3 * p.clap; p.armR.b += s * 0.3 * p.clap; }
    if (p.write) p.armR.b += Math.sin(t * 21 + seed) * 0.13 * p.write;
    if (p.shake) { p.bob += Math.sin(t * 20 + seed) * 5 * p.shake; p.talk = (0.35 + 0.35 * Math.sin(t * 19 + seed)) * p.shake; }
    if (opts.talk && t >= opts.talk[0] && t <= opts.talk[1]) { const s = Math.abs(Math.sin(t * 13 + seed)) * (0.55 + 0.45 * Math.sin(t * 5.3)); p.talk = 0.2 + 0.8 * s; }
    if (opts.icon) { p.icon = opts.icon; p.iconT = since; } else if (p.icon) p.iconT = since;
    if (opts.monoPop && t >= opts.monoPop) { p.monocleOut = true; }
    if (opts.item !== undefined) p.item = opts.item; // S02: a prop for this act only (letter, ice, notebook…)
    if (opts.itemL !== undefined) p.itemL = opts.itemL;
    p.hopY = (p.hop || 0) * 0.13 * Math.abs(Math.sin(t * 7.5 + seed));
    // walking
    if (worldPos.moving > 0) {
      const ph = worldPos.moving / 0.62 * Math.PI;
      p.legL = { a: 0.42 * Math.sin(ph), b: -0.35 * Math.max(0, -Math.cos(ph)) };
      p.legR = { a: -0.42 * Math.sin(ph), b: -0.35 * Math.max(0, Math.cos(ph)) };
      p.armL = { a: 0.15 - 0.4 * Math.sin(ph), b: 0.2 }; p.armR = { a: 0.15 + 0.4 * Math.sin(ph), b: 0.2 };
      p.bob -= 7 * Math.abs(Math.sin(ph));
      if (worldPos.march) { p.brow = -0.6; p.mouth = 'frown'; }
    }
    if (c.def.ride) { p.legL = { a: 0.5, b: -0.3 }; p.legR = { a: -0.5, b: 0.3 }; }
    // gaze → turn & facing
    p.dir = scr.dir; p.turn = scr.turn;
    p.lookX = clamp(p.lookX + scr.turn * 1.5, -1.2, 1.2);
    return p;
  }

  function horsePose(t) {
    // expression
    let e0 = {}, e1 = {}, u = 1;
    let i = -1; for (let j = 0; j < hansExpr.length; j++) if (hansExpr[j].t <= t) i = j;
    if (i >= 0) { e1 = hansExpr[i].e; e0 = i > 0 ? hansExpr[i - 1].e : e1; u = backOut(clamp((t - hansExpr[i].t) / 0.3)); }
    const num = (k, d = 0) => lerp(e0[k] ?? d, e1[k] ?? d, u);
    const p = { head: num('head'), brow: num('brow'), pupil: num('pupil', 0.5), sweat: num('sweat'), blink: 1, mouth: u > 0.5 ? (e1.mouth || 'smile') : (e0.mouth || 'smile'), camLook: num('camLook') };
    if (e1.blink != null) p.blink = num('blink', 1);
    const bph = t % 3.3; if (bph < 0.12) p.blink = 0.05;
    const eph = t % 2.4; p.earFlick = eph < 0.3 ? Math.sin(eph / 0.3 * Math.PI) : 0;
    p.tail = Math.sin(t * 2.1) * 0.12 + Math.sin(t * 5.3) * 0.04;
    p.breathe = t * 0.35;
    p.head += Math.sin(t * 1.7) * 0.015;
    // tap leg
    const lift = { a: 0.55, b: -1.3 };
    let leg = { a: 0, b: 0 };
    for (const [a, z] of EV.poise) if (t >= a - 0.2 && t <= z) { const k = clamp((t - (a - 0.2)) / 0.2); leg = { a: lift.a * ease.out(k) + Math.sin(t * 9) * 0.02, b: lift.b * ease.out(k) }; }
    for (let j = 0; j < EV.taps.length; j++) {
      const tp = EV.taps[j]; const prev = EV.taps[j - 1]; const gap = prev && prev.beat === tp.beat ? tp.t - prev.t : 0.5;
      const win = Math.min(0.24, gap * 0.9);
      if (t >= tp.t - win && t < tp.t) {
        const k = (t - (tp.t - win)) / win; const s = Math.sin(Math.PI * Math.min(1, k * 1.15));
        const inPoise = EV.poise.some(([a, z]) => tp.t - win >= a - 0.25 && tp.t - win <= z + 0.01);
        leg = inPoise ? { a: lift.a * (1 - ease.in(k)), b: lift.b * (1 - ease.in(k)) } : { a: lift.a * s, b: lift.b * s };
      } else if (t >= tp.t && t < tp.t + 0.08) { const k = (t - tp.t) / 0.08; leg = { a: -0.04 * Math.sin(k * Math.PI), b: 0.05 * Math.sin(k * Math.PI) }; }
    }
    p.tap = leg;
    return p;
  }

  // ---------- draw a person card ----------
  function paintPerson(c, pose, rim) {
    const { ctx, canvas } = c.card; const s = c.res;
    let cost = c.def.c, pp = pose;
    if ('item' in pose || 'itemL' in pose) cost = { ...cost, ...('item' in pose ? { item: pose.item } : {}), ...('itemL' in pose ? { itemL: pose.itemL } : {}) };
    if (pose.dir < 0) { // mirror authored pose so the acting arm leads
      pp = { ...pose, armL: pose.armR, armR: pose.armL, legL: pose.legR, legR: pose.legL };
      cost = { ...cost, item: cost.itemL, itemL: cost.item };
    }
    cost = { ...cost, dir: pose.dir };
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(s, 0, 0, s, 256 * s, 745 * s);
    drawPerson(ctx, cost, pp, rim);
    if (pose.monocleOut && c.def.c.monocle) { // falling monocle
      const k = clamp((pose.monoT || 0.3) / 0.5);
      ctx.save(); ctx.translate(40 + k * 20, -505 + k * 300); ctx.rotate(k * 5);
      ctx.strokeStyle = '#c9a227'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(0, 0, 20, 0, 7); ctx.stroke(); ctx.restore();
    }
    c.card.tex.needsUpdate = true;
  }

  // ---------- HUD canvases ----------
  const mkCanvas = () => { const c = document.createElement('canvas'); c.width = W; c.height = H; return [c, c.getContext('2d')]; };
  const [out, O] = mkCanvas(); const [tmp, TM] = mkCanvas(); const [bufB, BB] = mkCanvas();
  let paper = null; // S01 newspaper, painted on first use
  const newspaperArt = () => paper || (paper = TX.newspaper((k) => {
    drawHorse(k, { head: 0.12, mouth: 'smile', brow: 0.3, blink: 1, tap: { a: 0.5, b: -1.2 }, tail: 0.1 }, { blanket: '#555' });
    k.save(); k.translate(1010, 745); k.scale(0.9, 0.9); drawPerson(k, { ...cast.eddie.c, dir: -1 }, { ...DEFAULT_POSE, armL: { a: 1.2, b: 0.5 }, mouth: 'smile', brow: 0.5, turn: -0.5, dir: -1 }, null); k.restore();
  }));
  const frustum = new THREE.Frustum(), pm = new THREE.Matrix4();

  function project(v) { const q = v.clone().project(camera); return [(q.x + 1) / 2 * W, (1 - q.y) / 2 * H, q.z]; }

  // ---------- camera from shot ----------
  function shotAt(t) { let s = SHOTS[0]; for (const q of SHOTS) if (q.t0 <= t) s = q; return s; }
  function camFor(s, t) {
    const len = s.t1 - s.t0; const e = ease[s.ease || 'inout'];
    let pos, look, fov;
    if (s.then) {
      const d = s.dur;
      if (t - s.t0 < d) { const u = e(clamp((t - s.t0) / d)); pos = lerp3(s.cam[0], s.cam[1], u); look = lerp3(s.look[0], s.look[1], u); }
      else { const u = ease.inout(clamp((t - s.t0 - d) / Math.max(0.01, len - d))); pos = lerp3(s.then.cam, s.then.cam2, u); look = lerp3(s.then.look, s.then.look2, u); }
      fov = lerp(s.fov[0], s.fov[1], e(clamp((t - s.t0) / d)));
    } else {
      const u = e(clamp((t - s.t0) / len));
      pos = lerp3(s.cam[0], s.cam[1], u); look = lerp3(s.look[0], s.look[1], u); fov = lerp(s.fov[0], s.fov[1], u);
    }
    return { pos, look, fov };
  }

  // ---------- lights ----------
  // The preset belongs to the shot (shot.light, else beat.light). It blends from the previous shot's preset over
  // 0.35 s when both shots are in the same set (night → snow = dawn); a cut to another set switches at once.
  function applyLights(t, shot, S) {
    const cur = PRESETS[lightOf(shot)];
    const pv = shot.prev; const blendable = pv && setOf(pv) === setOf(shot);
    const prev = blendable ? PRESETS[lightOf(pv)] : cur;
    const u = ease.inout(clamp((t - shot.t0) / 0.35));
    const L = {};
    for (const k of Object.keys(cur)) {
      const a = prev[k] ?? cur[k], b = cur[k];
      if (typeof b === 'number') L[k] = lerp(a, b, u);
      else if (Array.isArray(b)) L[k] = lerp3(a, b, u);
      else if (typeof b === 'string' && b[0] === '#') L[k] = '#' + col(a).lerp(col(b), u).getHexString();
      else L[k] = u < 0.5 ? a : b;
    }
    const motes = shot.motes || beats[shot.beat].motes; if (motes) L.motes = motes;
    if (shot.shimmer != null) L.shimmer = typeof shot.shimmer === 'number' ? shot.shimmer : (shot.shimmer.amp ?? L.shimmer);
    scene.background = col(L.bg); scene.fog.color = col(L.fog); scene.fog.near = L.near; scene.fog.far = L.far;
    const c = S.center;
    sun.color = col(L.sun); sun.intensity = L.sunI; sun.position.set(c[0] + L.sunPos[0], c[1] + L.sunPos[1], c[2] + L.sunPos[2]); sun.target.position.set(...c);
    hemi.color = col(L.hemiS); hemi.groundColor = col(L.hemiG); hemi.intensity = L.hemiI;
    for (const l of S.lamps) { l.pl.intensity = 6 * L.lamp; l.glow.material.opacity = 0.3 + L.lamp * 0.9; }
    if (S.spot) S.spot.intensity = L.spot;
    if (S.beam) S.beam.material.opacity = L.beam * 0.5;
    if (S.motes) S.motes.material.opacity = L.motes === 'dust' ? L.mote * 0.6 : 0;
    renderer.toneMappingExposure = L.exp;
    return L;
  }

  // ======================= RENDER ONE SHOT (3D + its own 2D layers) INTO `out` =======================
  function composeShot(t, shot) {
    const bi = beatAt(t); const b = beats[bi];
    const setName = setOf(shot); const S = useSet(setName);
    const L = applyLights(t, shot, S);
    let cam = camFor(shot, t);
    let yaw = 0, fovMul = 1, blurX = 0, zoomBlur = 0, dark = 0, flash = 0, wipe = null, dolly = 0, iris = null;
    // outgoing transition into next shot
    const nx = shot.next;
    if (nx) {
      const k = t - nx.t0;
      if (nx.trans === 'whip' && k > -0.16) { const q = (k + 0.16) / 0.16; yaw += 0.75 * q * q; blurX = q; }
      if (nx.trans === 'zoom' && k > -0.3) { const q = (k + 0.3) / 0.3; fovMul *= 1 - 0.55 * q * q; zoomBlur = q; }
      if (nx.trans === 'push' && k > -0.3) { const q = (k + 0.3) / 0.3; dolly = 2.2 * q * q; dark = q; }
      if (nx.trans === 'pushfade' && k > -0.45) { const q = clamp((k + 0.45) / 0.45); dolly = 1.6 * q * q; }
      if (nx.trans === 'wipe' && k > -0.22) wipe = { w: (k + 0.22) / 0.44, s: nx };
      if (nx.trans === 'iris' && k > -IRIS) iris = { r: 1 - ease.in(clamp((k + IRIS) / IRIS)), at: irisPoint(nx, 'out') };
    }
    { // incoming transition
      const k = t - shot.t0;
      if (shot.trans === 'whip' && k < 0.18) { const q = 1 - k / 0.18; yaw -= 0.75 * q * q; blurX = Math.max(blurX, q); }
      if (shot.trans === 'zoomout' && k < 0.4) { const q = 1 - k / 0.4; fovMul *= 1 - 0.6 * q * q; zoomBlur = Math.max(zoomBlur, q * 0.8); if (k < 0.07) flash = 1 - k / 0.07; }
      if (shot.trans === 'zoom' && k < 0.3) { const q = 1 - k / 0.3; zoomBlur = Math.max(zoomBlur, q); if (k < 0.06) flash = 0.7; }
      if (shot.trans === 'push' && k < 0.25) dark = Math.max(dark, 1 - k / 0.25);
      if (shot.trans === 'pushfade' && k < 0.4) { const q = 1 - k / 0.4; dolly -= 0.5 * q * q; } /* the new shot settles in from slightly behind */
      if (shot.trans === 'wipe' && k < 0.22) wipe = { w: 0.5 + k / 0.44, s: shot };
      if (shot.trans === 'iris' && k < IRIS && k >= 0) iris = { r: ease.out(clamp(k / IRIS)), at: irisPoint(shot, 'in') };
    }
    // camera
    const pos = new THREE.Vector3(...cam.pos), look = new THREE.Vector3(...cam.look);
    if (dolly) { const d = look.clone().sub(pos).normalize(); pos.addScaledVector(d, dolly); look.addScaledVector(d, dolly); }
    camera.position.copy(pos); camera.fov = cam.fov * fovMul; camera.updateProjectionMatrix();
    camera.lookAt(look);
    if (yaw) camera.rotateY(yaw);
    let shake = shot.shake || 0;
    // stamp shake
    if (shot.hud && shot.hud.kind === 'stamp') { const st = R(shot.hud.at, shot.beat); if (t >= st && t < st + 0.25) shake = 0.03 * (1 - (t - st) / 0.25); }
    if (shake) { camera.position.x += (hash(t.toFixed(3), 'sx') - 0.5) * shake * 2; camera.position.y += (hash(t.toFixed(3), 'sy') - 0.5) * shake * 2; }
    camera.updateMatrixWorld();
    pm.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse); frustum.setFromProjectionMatrix(pm);

    // set dressing state (only what this set has)
    if (S.board) {
      const k = keyAt(boardKeys, t);
      const lines = k ? k.lines : ['3 + 2 = ?'];
      const rv = k && k.rv ? clamp((t - k.rv[0]) / Math.max(0.01, k.rv[1] - k.rv[0])) : 1;
      const key = lines.join('|') + Math.round(rv * 24);
      if (key !== S.board.last) { TX.paintBoard(S.board.canvas, lines, rv); S.board.tex.needsUpdate = true; S.board.last = key; }
    }
    if (S.screen) { // folding screen: `screen: [[at, x]]` or `[[at, [x, z, ry]]]`, stepped
      const k = keyAt(screenKeys, t); const v = k ? k.v : S.screenRest; const rest = S.screenRest;
      S.screen.position.set(v[0], 0, v[1] ?? rest[1]); S.screen.rotation.y = v[2] ?? rest[2];
    }
    S.doors(keyLerp(doorKeys, t, 0));
    for (const [name, fn] of Object.entries(S.open)) fn(keyLerp(openKeys[name] || [], t, S.openRest[name] ?? 0));
    if (S.motes) { S.motes.rotation.y = t * 0.01; S.motes.position.y = Math.sin(t * 0.3) * 0.1; }
    updateFx(t, setName);
    if (S.tick) S.tick(t, L, camera);
    updateParticles(L.motes, L.mote, t);

    // sun-shadow direction for long shadows
    const sunDir = Math.atan2(-L.sunPos[0], -L.sunPos[2]);
    const longOp = L.long;

    // people
    const tint = col(L.tint);
    const inCast = b.cast ? new Set(b.cast) : null;
    for (const c of Object.values(chars)) {
      let visible = t >= c.visibleFrom && (!c.sets || c.sets.includes(setName)) && (!inCast || inCast.has(c.id));
      const wp = charPos(c, t);
      let [x, z] = wp.p;
      let y = wp.p[2] || 0;
      if (c.def.ride) { const rc = chars[c.def.ride]; const r = charPos(rc, t).p; x = r[0]; z = r[1] - 0.04; y = (r[2] || 0) + 1.3; }
      c.baseY = y;
      c.g.position.set(x, y, z); c.g.rotation.y = Math.atan2(camera.position.x - x, camera.position.z - z);
      const gy = c.def.ride ? 0 : y; // contact + long shadows sit on the surface the person stands on
      c.sh.position.set(x, gy + 0.012, z); c.ls.position.set(x, gy + 0.011, z); c.ls.rotation.z = sunDir; c.ls.material.opacity = longOp;
      c.sh.visible = visible && !c.def.ride; c.ls.visible = visible && !c.def.ride && longOp > 0.001;
      c.g.visible = visible;
      if (!visible) continue;
      const inView = frustum.intersectsSphere(new THREE.Sphere(new THREE.Vector3(x, y + 1.0, z), 1.3));
      // gaze in screen space
      const tgt = lookTarget(c.id, bi);
      let dir = 1, turn = 0;
      if (tgt) {
        const a = new THREE.Vector3(x, y + 1.45, z).project(camera), q = tgt.clone().project(camera);
        const dx = q.x - a.x; turn = clamp(dx * 2.2, -0.6, 0.6); dir = dx < 0 ? -1 : 1;
        if (wp.march) { turn = 0; dir = 1; }
      }
      const pose = poseFor(c, t, bi, wp, { dir, turn });
      if (pose.monocleOut) { const pk = c.acts.find((a) => a.opts.monoPop); pose.monoT = pk ? t - pk.opts.monoPop : 0.5; }
      c.g.position.y = y + (pose.hopY || 0);
      // spot scene: characters outside the light dim (faces stay pale)
      let f = 1;
      if (L.spot > 1 && S.spotCenter) { const d = Math.hypot(x - S.spotCenter[0], z - S.spotCenter[1]); f = lerp(1, d < (S.spotR ?? 2.4) ? 1 : 0.55, clamp(L.spot / 90)); }
      if (S.shade) f *= S.shade(x, z);
      c.card.mat.color.copy(tint).multiplyScalar(f);
      c.pose = pose;
      if (inView) paintPerson(c, pose, L.rim);
    }
    // Hans
    let hp = null;
    if (hans) {
      hp = horsePose(t);
      const hg = hans.g;
      hg.rotation.y = Math.atan2(camera.position.x - hg.position.x, camera.position.z - hg.position.z);
      hans.ls.rotation.z = sunDir; hans.ls.material.opacity = longOp;
      if (setName === hans.set && frustum.intersectsSphere(new THREE.Sphere(new THREE.Vector3(hans.at[0], 1.2, hans.at[1]), 2.4))) {
        const { horse, leg, LEG } = hans;
        const k = horse.ctx; k.setTransform(1, 0, 0, 1, 0, 0); k.clearRect(0, 0, 1024, 768);
        drawHorse(k, hp, { withTapLeg: false, blanket: '#7a1f2a' }); horse.tex.needsUpdate = true;
        const lk = leg.ctx; lk.setTransform(1, 0, 0, 1, 0, 0); lk.clearRect(0, 0, leg.canvas.width, leg.canvas.height);
        lk.setTransform(LEG.s, 0, 0, LEG.s, -LEG.x0 * LEG.s, -LEG.y0 * LEG.s); drawTapLeg(lk, hp); leg.tex.needsUpdate = true;
      }
      hans.horse.mat.color.copy(tint); hans.leg.mat.color.copy(tint);
      // dust puffs at strikes
      let di = 0; const HOOF = hans.HOOF, dust = hans.dust;
      for (const tp of EV.taps) {
        const age = t - tp.t; if (age < 0 || age > 0.75) continue;
        for (let j = 0; j < 6 && di < dust.length; j++, di++) {
          const sp = dust[di]; const a = hash(tp.t, j) * Math.PI * 2; const r = 0.08 + age * (0.35 + hash(tp.t, j, 'r') * 0.3);
          sp.visible = true; sp.position.set(HOOF.x + Math.cos(a) * r, 0.04 + age * 0.25 * hash(j, 'y'), HOOF.z + Math.sin(a) * r * 0.6);
          const s = 0.12 + age * 0.5; sp.scale.set(s, s, 1); sp.material.opacity = 0.9 * (1 - age / 0.75);
        }
      }
      for (; di < dust.length; di++) dust[di].visible = false;
    }

    if (cameo) { // visible for exactly one frame
      const f0 = Math.round(meta.cameo.t * meta.fps); cameo.visible = Math.round(t * meta.fps) === f0;
      cameo.rotation.y = Math.atan2(camera.position.x - cameo.position.x, camera.position.z - cameo.position.z);
    }
    renderer.render(scene, camera);

    // ================= 2D layers of this shot =================
    O.setTransform(1, 0, 0, 1, 0, 0); O.filter = 'none'; O.globalAlpha = 1; O.globalCompositeOperation = 'source-over';
    O.drawImage(glCanvas, 0, 0);
    if (L.shimmer > 0.05) shimmer(t, L.shimmer, shot.shimmer && shot.shimmer.y);
    if (shot.grade) gradeFrame(shot.grade); // S02: per-shot grade (local contrast, black-level lift)
    const hud = shot.hud;
    if (hud && hud.kind !== 'stamp') drawHud(hud, shot, t, hp);
    // sparkle on Hans (proud)
    for (const sT of sparkles) { const a = t - sT; if (a >= 0 && a < 0.7) sparkleAt(W * 0.74, H * 0.24, a); }
    for (const sp of (b.sparkle ? [b.sparkle] : []).concat(b.sparkles || [])) { const sT = R(sp[0], bi), a = t - sT; if (a >= 0 && a < 0.9 && (!sp[2] || sp[2] === setName)) { const q = project(new THREE.Vector3(...sp[1])); sparkleAt(q[0], q[1], a); } } // S02: sparkles at world points (ice crown; `sparkles: [[at, pos, set?]]`)
    const calT = b.calendarSparkle ? R(b.calendarSparkle, bi) : null;
    if (calT != null && S.calendarPos && t >= calT && t < calT + 0.8 && (!hud)) { const q = project(S.calendarPos); sparkleAt(q[0] + 230, q[1] + 40, t - calT); }
    // tap counters
    if (hans && (!hud || hud.kind === 'stamp')) for (const tp of EV.taps) {
      const age = t - tp.t; const last = tp.k === tp.n;
      if (age < 0 || age > (last ? 0.9 : 0.45)) continue;
      const q = project(hans.HOOF.clone().add(new THREE.Vector3(0.1, 0.55, 0.3)));
      const pop = backOut(clamp(age / 0.15)); const fade = last ? clamp((0.9 - age) / 0.25) : clamp((0.45 - age) / 0.15);
      const txt = tp.style === 'red' ? (tp.k > 3 ? tp.k + '?' : String(tp.k)) : String(tp.k);
      O.save(); O.globalAlpha = fade; O.translate(clamp(q[0] + 90, 120, W - 120), Math.min(q[1] - 60, H * 0.58) - age * 80); O.scale(pop, pop);
      O.font = 'bold 120px "DejaVu Sans", sans-serif'; O.textAlign = 'center'; O.textBaseline = 'middle'; O.lineJoin = 'round';
      O.lineWidth = 18; O.strokeStyle = '#111'; O.strokeText(txt, 0, 0); O.fillStyle = tp.style === 'red' ? '#ff5a4e' : '#6dff7a'; O.fillText(txt, 0, 0); O.restore();
    }
    // speech bubble
    if (b.bubble) {
      const bb = b.bubble; const t0 = R(bb.from, bi), t1 = R(bb.to, bi);
      if (t >= t0 && t <= t1) { const c = chars[bb.who]; const q = project(new THREE.Vector3(c.g.position.x, c.baseY + 1.95, c.g.position.z)); const qt = bb.tailY != null ? project(new THREE.Vector3(c.g.position.x, c.baseY + bb.tailY, c.g.position.z)) : null; bubble(bb.text, q[0], q[1], t - t0, qt); } /* tailY: world height the tail points at (S02 v3: the speaker's face in a close-up) */
    }
    if (hud && hud.kind === 'stamp') stampHud(hud, shot, t, S);
    // camera-move transitions on the whole frame
    if (blurX > 0.02 || zoomBlur > 0.02) {
      TM.setTransform(1, 0, 0, 1, 0, 0); TM.clearRect(0, 0, W, H); TM.drawImage(out, 0, 0);
      const n = 7; O.save();
      for (let i = 1; i <= n; i++) {
        O.globalAlpha = 0.22;
        if (blurX > 0.02) O.drawImage(tmp, (i - n / 2) * blurX * 26, 0);
        if (zoomBlur > 0.02) { const s = 1 + i * 0.022 * zoomBlur; O.drawImage(tmp, W / 2 - W * s / 2, H / 2 - H * s / 2, W * s, H * s); }
      }
      O.restore();
    }
    if (wipe != null) wipePanel(wipe.w, wipe.s.wipeColor);
    if (dark > 0) { O.fillStyle = `rgba(0,0,0,${dark})`; O.fillRect(0, 0, W, H); }
    if (flash > 0) { O.fillStyle = `rgba(255,255,255,${flash * 0.85})`; O.fillRect(0, 0, W, H); }
    if (iris) irisMask(iris.r, iris.at);
    return L;
  }

  // ======================= RENDER ONE FRAME =======================
  function renderAt(t) {
    const shot = shotAt(t);
    // two-shot transitions (match dissolve, flare and paper wipes): render both shots, then mix
    let A = null, B = null;
    const nx = shot.next;
    if (nx && MIX[nx.trans] && t >= nx.t0 - MIX[nx.trans]) { A = shot; B = nx; }
    else if (shot.prev && MIX[shot.trans] && t < shot.t0 + MIX[shot.trans]) { A = shot.prev; B = shot; }
    let L;
    if (A) {
      const half = MIX[B.trans]; const k = clamp((t - (B.t0 - half)) / (2 * half));
      // incoming holds its first frame until the cut; outgoing holds its last frame after it
      const LB = composeShot(Math.max(t, B.t0), B);
      BB.setTransform(1, 0, 0, 1, 0, 0); BB.globalAlpha = 1; BB.drawImage(out, 0, 0);
      const LA = composeShot(Math.min(t, B.t0 - 1e-4), A);
      mixShots(B.trans, k, B);
      L = t >= B.t0 ? LB : LA;
    } else L = composeShot(t, shot);
    // vignette (colour + strength from the preset)
    O.setTransform(1, 0, 0, 1, 0, 0); O.globalAlpha = 1;
    const vg = O.createRadialGradient(W / 2, H * 0.48, H * 0.32, W / 2, H * 0.5, H * 0.72);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, rgba(L.vig, +L.vigA.toFixed(4)));
    O.fillStyle = vg; O.fillRect(0, 0, W, H);
    if (meta.captions !== false) captions(t, shot);
    return out;
  }

  // ---------------- transitions ----------------
  function irisPoint(s, side) { // shot.iris: [x, y] (screen fractions) or { out: [x, y], in: [x, y] }
    const v = s.iris; if (!v) return [0.5, 0.45];
    return Array.isArray(v) ? v : (v[side] || [0.5, 0.45]);
  }
  function irisMask(r, at) {
    const cx = at[0] * W, cy = at[1] * H;
    const far = Math.max(Math.hypot(cx, cy), Math.hypot(W - cx, cy), Math.hypot(cx, H - cy), Math.hypot(W - cx, H - cy));
    const rad = r * far;
    O.save(); O.fillStyle = '#000'; O.beginPath(); O.rect(0, 0, W, H); O.arc(cx, cy, Math.max(0.1, rad), 0, Math.PI * 2, true); O.fill('evenodd');
    if (rad > 2 && r < 0.98) { O.strokeStyle = '#111'; O.lineWidth = 14; O.beginPath(); O.arc(cx, cy, rad, 0, Math.PI * 2); O.stroke(); }
    O.restore();
  }
  // `out` holds the outgoing shot, `bufB` the incoming one; k runs 0 → 1 across the transition
  function mixShots(kind, k, B) {
    O.save(); O.setTransform(1, 0, 0, 1, 0, 0);
    if (kind === 'match' || kind === 'pushfade') { // short dissolve; frame the two shots so the shapes line up
      O.globalAlpha = ease.inout(k); O.drawImage(bufB, 0, 0);
    } else if (kind === 'wipe:flare') { // a hot sun-flare edge sweeps left → right, the new shot behind it
      const e = lerp(-0.35 * W, 1.35 * W, ease.inout(k)), slope = 0.28;
      O.save(); O.beginPath(); O.moveTo(-10, -10); O.lineTo(e + slope * H / 2, -10); O.lineTo(e - slope * H / 2, H + 10); O.lineTo(-10, H + 10); O.closePath(); O.clip();
      O.drawImage(bufB, 0, 0); O.restore();
      O.globalCompositeOperation = 'lighter';
      for (const [w, a] of [[260, 0.55], [120, 0.7], [40, 0.9]]) {
        const g = O.createLinearGradient(e - w, 0, e + w, 0);
        g.addColorStop(0, 'rgba(255,170,60,0)'); g.addColorStop(0.5, `rgba(255,236,190,${a})`); g.addColorStop(1, 'rgba(255,170,60,0)');
        O.save(); O.translate(e, H / 2); O.transform(1, 0, -slope, 1, 0, 0); O.translate(-e, -H / 2); O.fillStyle = g; O.fillRect(e - w, -H, w * 2, H * 3); O.restore();
      }
      const sy = H * 0.3, sx = e - slope * (sy - H / 2); // sun disc + lens ghosts riding the edge
      const sg = O.createRadialGradient(sx, sy, 0, sx, sy, 300); sg.addColorStop(0, 'rgba(255,255,235,1)'); sg.addColorStop(0.25, 'rgba(255,220,140,.8)'); sg.addColorStop(1, 'rgba(255,140,40,0)');
      O.fillStyle = sg; O.fillRect(sx - 300, sy - 300, 600, 600);
      for (const [f, rr, a] of [[0.35, 60, 0.35], [0.6, 26, 0.45], [0.85, 90, 0.18]]) {
        const gx = lerp(sx, W - sx, f), gy = lerp(sy, H - sy, f);
        O.fillStyle = `rgba(255,200,120,${a * Math.sin(Math.PI * k)})`; O.beginPath(); O.arc(gx, gy, rr, 0, 7); O.fill();
      }
      O.globalCompositeOperation = 'source-over';
      O.fillStyle = `rgba(255,230,180,${0.35 * Math.sin(Math.PI * k)})`; O.fillRect(0, 0, W, H);
    } else if (kind === 'wipe:paper') { // a parchment roll unrolls top → bottom; the new shot is on the unrolled paper
      const RH = 90; const e = lerp(-RH, H + RH, ease.inout(k));
      O.save(); O.beginPath(); O.rect(0, 0, W, Math.max(0, e)); O.clip(); O.drawImage(bufB, 0, 0);
      O.fillStyle = 'rgba(214,180,120,.12)'; O.fillRect(0, 0, W, e); O.restore(); // a touch of paper tone
      const sh = O.createLinearGradient(0, e + RH / 2, 0, e + RH / 2 + 60); sh.addColorStop(0, 'rgba(0,0,0,.45)'); sh.addColorStop(1, 'rgba(0,0,0,0)');
      O.fillStyle = sh; O.fillRect(0, e + RH / 2, W, 60);
      const g = O.createLinearGradient(0, e - RH / 2, 0, e + RH / 2);
      g.addColorStop(0, '#8a6a3a'); g.addColorStop(0.18, '#d8bd88'); g.addColorStop(0.45, '#f6e8c4'); g.addColorStop(0.75, '#c9a466'); g.addColorStop(1, '#6e5028');
      O.fillStyle = g; O.fillRect(-10, e - RH / 2, W + 20, RH);
      O.strokeStyle = '#1a120a'; O.lineWidth = 8; O.beginPath(); O.moveTo(0, e - RH / 2); O.lineTo(W, e - RH / 2); O.moveTo(0, e + RH / 2); O.lineTo(W, e + RH / 2); O.stroke();
      O.strokeStyle = 'rgba(90,60,25,.35)'; O.lineWidth = 3; for (let i = 1; i < 4; i++) { O.beginPath(); O.moveTo(0, e - RH / 2 + i * RH / 4); O.lineTo(W, e - RH / 2 + i * RH / 4); O.stroke(); }
    }
    O.restore();
  }
  // heat shimmer: horizontal sine wobble of the picture inside a band (screen-space)
  function shimmer(t, amp, band) {
    const [y0, y1] = band || [0.42, 0.82]; const a = Math.round(y0 * H), z = Math.round(y1 * H);
    TM.setTransform(1, 0, 0, 1, 0, 0); TM.drawImage(out, 0, a, W, z - a, 0, a, W, z - a);
    const step = 6;
    for (let y = a; y < z; y += step) {
      const env = Math.sin(Math.PI * (y - a) / (z - a));
      const dx = Math.sin(y * 0.045 + t * 9) * amp * env + Math.sin(y * 0.11 - t * 13) * amp * 0.35 * env;
      O.drawImage(tmp, 0, y, W, step, dx, y, W, step);
    }
  }

  // ---------------- HUD pieces ----------------
  function blurredBackdrop(px = 16, darken = 0.25) {
    TM.setTransform(1, 0, 0, 1, 0, 0); TM.filter = `blur(${px}px)`; TM.drawImage(glCanvas, -40, -40, W + 80, H + 80); TM.filter = 'none';
    O.drawImage(tmp, 0, 0); O.fillStyle = `rgba(0,0,0,${darken})`; O.fillRect(0, 0, W, H);
  }
  const cardCanvas = {};
  function drawHud(h, shot, t, hp) {
    const u = clamp((t - shot.t0) / (shot.t1 - shot.t0)); const sc = h.s ? lerp(h.s[0], h.s[1], ease.inout(u)) : 1;
    if (h.kind === 'hansPortrait' && hp) {
      blurredBackdrop(14, 0.12);
      O.save(); O.translate(W * h.x, H * h.y); O.scale(sc * 1.55, sc * 1.55);
      const pp = { ...hp, pupil: lerp(hp.pupil, 0, hp.camLook || 0), pupilY: 0 };
      drawHansPortrait(O, pp); O.restore();
    } else if (h.kind === 'face') {
      blurredBackdrop(18, 0.2);
      const c = chars[h.who]; const pose = { ...c.pose, dir: -1, turn: -0.35, bob: 0 };
      const f = sc; O.save(); O.translate(W * h.x, H * h.y + 505 * f); O.scale(f, f);
      let cost = { ...c.def.c, dir: -1 }; const pp = { ...pose, armL: pose.armR, armR: pose.armL };
      drawPerson(O, cost, pp, LIGHTS.spot.rim); O.restore();
    } else if (h.kind === 'eyes') {
      blurredBackdrop(20, 0.3);
      h.ids.forEach((id, i) => {
        const c = chars[id]; const y0 = H * 0.05 + i * H * 0.215, hh = H * 0.205;
        O.save(); O.beginPath(); O.rect(0, y0, W, hh); O.clip();
        O.fillStyle = ['#e9dcc4', '#d9e2ea', '#efe3d0'][i]; O.fillRect(0, y0, W, hh);
        const f = 5.2; O.translate(W / 2 + (i - 1) * 40, y0 + hh / 2 + 8 * f + 505 * f); O.scale(f, f);
        const look = Math.sin((t - shot.t0) * 4.2 + i * 0.4);
        const pose = { ...DEFAULT_POSE, ...c.pose, lookX: look * 1.6, lookY: 0.8, squint: 0.75, brow: -0.8, mouth: 'flat', talk: 0, icon: null, sweat: 0, turn: look * 0.05, dir: 1, headTilt: 0, bob: 0, lean: 0 };
        drawPerson(O, { ...c.def.c, dir: 1 }, pose, null);
        O.restore();
        O.lineWidth = 12; O.strokeStyle = '#111'; O.strokeRect(-10, y0, W + 20, hh);
      });
    } else if (h.kind === 'eye' && hp) {
      O.save(); O.translate(W / 2, H / 2); O.scale(sc, sc); O.translate(-W / 2, -H / 2);
      const relaxT = R(beats[shot.beat].reflect.relax, shot.beat);
      const r = ease.inout(clamp((t - relaxT) / 0.5));
      const who = chars[h.who || 'e1'];
      drawHansEye(O, W, H, { blink: hp.blink }, (k, Rr) => {
        k.fillStyle = '#c9b48a'; k.fillRect(-Rr, -Rr, Rr * 2, Rr * 2);
        k.save(); k.scale(-1, 1); const fs = Rr / 150; k.translate(0, 505 * fs + Rr * 0.1); k.scale(fs, fs);
        drawPerson(k, { ...who.def.c, dir: 1 }, { ...DEFAULT_POSE, brow: lerp(-0.6, 0.6, r), squint: lerp(0.6, 0, r), mouth: r > 0.5 ? 'smile' : 'flat', lean: lerp(0.06, -0.02, r) }, null);
        k.restore();
      });
      O.restore();
      // ripple to show the relax moment
      if (t >= relaxT && t < relaxT + 0.6) { const a = (t - relaxT) / 0.6; O.strokeStyle = `rgba(255,255,255,${0.6 * (1 - a)})`; O.lineWidth = 10; O.beginPath(); O.arc(W / 2 + 40, H * 0.47, 120 + a * 300, 0, 7); O.stroke(); }
    } else if (h.kind === 'card') { // S02 cards: { art: year|news|letter|map|thermo, x, y, w (of frame width), rot, blur, level/route: [from, to], unroll }
      const C = CARDS[h.art]; if (!C) return;
      const [cw, ch] = C.size; const cv = cardCanvas[h.art] || (cardCanvas[h.art] = Object.assign(document.createElement('canvas'), { width: cw, height: ch }));
      const k = t - shot.t0, len = shot.t1 - shot.t0, e = ease.inout(u);
      const st = {}; if (h.level) st.level = lerp(h.level[0], h.level[1], e); if (h.route) st.route = lerp(h.route[0], h.route[1], e); if (h.text) st.text = h.text;
      const cx2 = cv.getContext('2d'); cx2.setTransform(1, 0, 0, 1, 0, 0); cx2.clearRect(0, 0, cw, ch); C.draw(cx2, st);
      if (h.blur !== false) blurredBackdrop(12, 0.3);
      const pop = h.pop === false ? 1 : backOut(clamp(k / 0.28)); const ww = W * (h.w ?? 0.8) * sc * pop, hh = ww * ch / cw;
      O.save(); O.translate(W * (h.x ?? 0.5), H * (h.y ?? 0.45)); O.rotate(h.rot ?? 0);
      O.shadowColor = 'rgba(0,0,0,.45)'; O.shadowBlur = 36; O.shadowOffsetY = 16;
      if (h.unroll) { const r2 = ease.out(clamp(k / 0.5)); O.beginPath(); O.rect(-ww / 2, -hh / 2, ww * r2, hh); O.clip(); O.drawImage(cv, -ww / 2, -hh / 2, ww, hh); O.shadowColor = 'transparent'; if (r2 < 1) { O.fillStyle = '#c9b48a'; O.fillRect(-ww / 2 + ww * r2 - 18, -hh / 2, 36, hh); } }
      else O.drawImage(cv, -ww / 2, -hh / 2, ww, hh);
      O.restore();
    } else if (h.kind === 'newspaper') {
      blurredBackdrop(10, 0.35);
      const k = t - shot.t0, len = shot.t1 - shot.t0;
      const sp = ease.out(clamp(k / 0.65)); const ang = (1 - sp) * Math.PI * 5 - 0.07; let s = lerp(0.04, 1, sp);
      const zoomOut = clamp((k - (len - 0.3)) / 0.3); s *= 1 + ease.in(zoomOut) * 4;
      O.save(); O.translate(W / 2, H * 0.46); O.rotate(ang + zoomOut * 0.05); O.scale(s, s);
      const pw = W * 0.8, ph = pw * 1800 / 1350;
      O.shadowColor = 'rgba(0,0,0,.5)'; O.shadowBlur = 40; O.shadowOffsetY = 20;
      O.drawImage(newspaperArt(), -pw / 2, -ph / 2, pw, ph); O.restore();
    }
  }
  function sparkleAt(x, y, a) {
    for (let i = 0; i < 3; i++) {
      const s = backOut(clamp((a - i * 0.08) / 0.2)) * (1 - clamp((a - 0.45) / 0.25));
      if (s <= 0) continue;
      O.save(); O.translate(x + [0, 70, -60][i], y + [0, 60, 50][i]); O.scale(s * [1.6, 1, 0.8][i], s * [1.6, 1, 0.8][i]); O.rotate(a * 2);
      outlined(O, (k) => { for (let j = 0; j < 8; j++) { const r = j % 2 ? 12 : 38; const an = j * Math.PI / 4; j ? k.lineTo(Math.sin(an) * r, -Math.cos(an) * r) : k.moveTo(Math.sin(an) * r, -Math.cos(an) * r); } k.closePath(); }, '#ffe066', 5);
      O.restore();
    }
  }
  function bubble(text, x, y, age, tail) {
    const s = backOut(clamp(age / 0.18));
    O.save(); O.font = 'bold 72px "DejaVu Sans", sans-serif';
    if (O.measureText(text).width + 70 > W - 60) { O.restore(); return bubbleWrap(text, x, y, s, tail); } // too wide for one line (S02)
    const tw = O.measureText(text).width + 70, th = 120;
    let bx = clamp(x - tw / 2 - 60, 30, W - tw - 30), by = clamp(y - th - 150, 140, H - 600);
    O.translate(bx + tw / 2, by + th / 2); O.scale(s, s); O.translate(-(bx + tw / 2), -(by + th / 2));
    outlined(O, (k) => { k.roundRect(bx, by, tw, th, 50); k.moveTo(bx + tw * 0.55, by + th - 4); k.lineTo(x, y - 40); k.lineTo(bx + tw * 0.75, by + th - 4); }, '#fff', 7);
    O.fillStyle = '#fff'; O.fillRect(bx + tw * 0.55, by + th - 14, tw * 0.2, 12);
    O.fillStyle = '#111'; O.textAlign = 'center'; O.textBaseline = 'middle';
    // numbers green
    const parts = text.split(' '); let cx = bx + 35; O.textAlign = 'left';
    for (const p of parts) { O.fillStyle = /\d/.test(p) ? '#1f9d36' : '#111'; O.fillText(p, cx, by + th / 2 + 4); cx += O.measureText(p + ' ').width; }
    O.restore();
  }
  // grade: { contrast: 1.1 (mid-contrast boost), lift: 0.05 (black level raised, 0..1), liftTint: [r, g, b] multipliers }
  function gradeFrame(g) {
    if (g.contrast && g.contrast !== 1) { TM.setTransform(1, 0, 0, 1, 0, 0); TM.clearRect(0, 0, W, H); TM.drawImage(out, 0, 0); O.save(); O.filter = `contrast(${g.contrast}) saturate(${g.saturate ?? 1})`; O.drawImage(tmp, 0, 0); O.restore(); }
    if (g.lift) { const tn = g.liftTint || [0.9, 0.95, 1.15]; O.save(); O.globalCompositeOperation = 'lighter'; O.fillStyle = `rgb(${tn.map((k) => Math.round(255 * g.lift * k)).join(',')})`; O.fillRect(0, 0, W, H); O.restore(); }
  }
  function bubbleWrap(text, x, y, s, tail) { // multi-line speech bubble, tail to the speaker, kept inside the frame
    O.save(); O.font = 'bold 66px "DejaVu Sans", sans-serif';
    const words = text.split(' '), lines = []; let cur = '';
    for (const w of words) { const t2 = cur ? cur + ' ' + w : w; if (O.measureText(t2).width > W * 0.78 && cur) { lines.push(cur); cur = w; } else cur = t2; }
    if (cur) lines.push(cur);
    const tw = Math.max(...lines.map((l) => O.measureText(l).width)) + 80, th = lines.length * 84 + 44;
    const bx = clamp(x - tw / 2 - 60, 30, W - tw - 30), by = clamp(y - th - 150, 140, H - 600);
    O.translate(bx + tw / 2, by + th / 2); O.scale(s, s); O.translate(-(bx + tw / 2), -(by + th / 2));
    outlined(O, (k) => { k.roundRect(bx, by, tw, th, 50); const tx = tail ? tail[0] : x, ty = tail ? Math.max(tail[1], by + th + 60) : y - 40; k.moveTo(bx + tw * 0.45, by + th - 4); k.lineTo(tx, ty); k.lineTo(bx + tw * 0.6, by + th - 4); }, '#fff', 7);
    O.fillStyle = '#fff'; O.fillRect(bx + tw * 0.45, by + th - 14, tw * 0.2, 12);
    O.fillStyle = '#111'; O.textAlign = 'center'; O.textBaseline = 'middle';
    lines.forEach((l, i) => O.fillText(l, bx + tw / 2, by + 22 + 42 + i * 84));
    O.restore();
  }
  function stampHud(h, shot, t, S) {
    const st = R(h.at, shot.beat); if (t < st) return;
    const at = h.pos ? new THREE.Vector3(...h.pos) : S.verdictPaper; if (!at) return;
    const a = t - st; const s = a < 0.1 ? lerp(2.6, 1, ease.in(a / 0.1)) : 1 + Math.max(0, 0.06 - (a - 0.1) * 0.3);
    const q = project(at);
    O.save(); O.translate(q[0], q[1] - 40); O.rotate(-0.16); O.scale(s, s);
    O.globalAlpha = a < 0.1 ? 0.5 + a * 5 : 1;
    O.strokeStyle = '#c1121f'; O.lineWidth = 16; O.strokeRect(-330, -110, 660, 220);
    O.lineWidth = 6; O.strokeRect(-310, -92, 620, 184);
    O.fillStyle = '#c1121f'; O.font = 'bold 132px "DejaVu Sans", sans-serif'; O.textAlign = 'center'; O.textBaseline = 'middle';
    O.fillText(h.text, 0, 6);
    // ink speckle (deterministic)
    O.globalCompositeOperation = 'destination-out';
    for (let i = 0; i < 70; i++) { O.beginPath(); O.arc((hash(i, 'x') - 0.5) * 640, (hash(i, 'y') - 0.5) * 200, 2 + hash(i, 'r') * 7, 0, 7); O.fill(); }
    O.restore();
    if (a < 0.12) { O.fillStyle = `rgba(255,255,255,${0.4 * (1 - a / 0.12)})`; O.fillRect(0, 0, W, H); }
  }
  function wipePanel(w, color) {
    // a dark folding-screen panel sweeps right→left across the frame (shot.wipeColor tints it)
    const x = lerp(W * 1.05, -W * 1.05 - 200, w);
    O.save(); O.fillStyle = color || '#4a1422'; O.fillRect(x, 0, W + 200, H);
    O.fillStyle = '#2e1a0e'; O.fillRect(x, 0, 46, H); O.fillRect(x + W + 154, 0, 46, H);
    O.fillStyle = 'rgba(255,255,255,.05)'; for (let i = 0; i < 12; i++) O.fillRect(x + 80 + i * 95, 0, 30, H);
    O.restore();
  }
  function captions(t, shot) {
    const c = EV.captions.find((q) => t >= q.t0 && t < q.t1);
    if (!c) return;
    const age = t - c.t0; const s = age < 0.08 ? lerp(1.18, 1, age / 0.08) : 1;
    const y = (shot.captionY || 0.71) * H;
    O.save(); O.font = 'bold 78px "DejaVu Sans", sans-serif'; O.textBaseline = 'middle'; O.lineJoin = 'round';
    const text = c.words.map((w) => w.w); const widths = text.map((w) => O.measureText(w).width); const sp = O.measureText(' ').width;
    const total = widths.reduce((a, b) => a + b, 0) + sp * (text.length - 1);
    O.translate(W / 2, y); O.scale(s, s);
    let x = -total / 2;
    c.words.forEach((w, i) => {
      O.lineWidth = 14; O.strokeStyle = '#111'; O.strokeText(w.w, x, 0);
      O.fillStyle = w.num ? '#6dff7a' : '#ffffff'; O.fillText(w.w, x, 0); x += widths[i] + sp;
    });
    O.restore();
  }

  return { renderAt, duration: TL.duration, EV, TL, shots: SHOTS.map((s) => [s.t0, s.trans, s.beat, setOf(s)]) };
}
