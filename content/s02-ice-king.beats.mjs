// Stick With Eddie — Short #2: "The Man Who Shipped Ice to the Tropics" (Frederic Tudor)
// Script: studio/briefs/s02-ice-king-script.md (APPROVED, trims A and B applied → 16 beats).
// Shots: studio/briefs/s02-ice-king-art.md section 3 (old beat 12 cut, beat 14 trimmed). Local Kokoro voices.
// Times inside a beat: seconds from the beat start, "w:<word>[±s]" (that word's start), "w2:<word>" (word in line2), or "end".
// Fact-check rules kept: Eddie-Tudor only in Boston (wharf, workshop) — never in Martinique or Calcutta; hat droops in Boston
// over the letter; no tonnage anywhere; "about 15,000 miles"; "most of the ice" (a few puddles in the hold); heat arrows fade in
// the sawdust; adults only on the pond, away from the open channel; respectful crowds (same faces, period dress).
// Loop: the first frame (beat 1, pond block face) and the last frame (beat 16, cutaway block face) share framing, texture and light.
import { S02_COSTUMES as C } from './s02-cast.mjs';

const ICE_X = 0.55, ICE_Y = 0.40; // hero block in the cutaway (src/hold.js); its face is at z = 0.65
const POND_HERO = [5.2, 0.21, -6.2]; // hero block on the pond ice (src/pond.js); its face is at z = -5.98
const FAV_DOCK = [8.45, 3.5, -2], TUS_DOCK = [8.75, 3.5, -2], NORTH = -Math.PI / 2; // Boston wharf berth (bow out to sea, +z)
const MQ_DOCK = [10, 3.55, -2], CA_DOCK = [10, 3.85, -2]; // tropical quay berth (heading π: bow to -x, port side to the quay)

export const meta = {
  id: 's02-ice-king', title: 'The Man Who Shipped Ice to the Tropics',
  aspect: '9:16', fps: 30, width: 1080, height: 1920,
  gap: 0.12,
  voice: 'narratorBrisk', // the same narrator (am_michael), read a little brisker so the Short lands near 63 s
  set: 'wharf',
  sets: {
    pond: {}, wharf: { year: 1806 }, wharf33: { base: 'wharf', year: 1833 }, kitchen: {},
    mq: { base: 'harbour', place: 'martinique' }, ca: { base: 'harbour', place: 'calcutta' },
    workshop: {}, sea: { base: 'water', tint: 'sea', ship: 'tuscany', sails: 1 }, hold: {}, sawmill: {}, cutaway: {},
  },
  // the running easter egg: the log peeks through the open upper window in Saint-Pierre for exactly one frame (beat 7)
  cameo: { t: 23.40, pos: [-0.6, 4.6, -15.0], set: 'mq' }, // = cameoSpot in src/harbour.js
  // sound: no tense section; room tones per beat (`amb`), soft acoustic bed from src/mix.py
  mix: { music: 'acoustic' },
};

// ---------- cast ----------
const P = (id, card, home, set, extra = {}) => ({ card, home, set, c: { ...C[id].c, ...(extra.c || {}) }, ...(extra.def || {}) });
const tint = (id, over) => ({ ...C[id].c, ...over });
export const cast = {
  // Eddie as Tudor (Boston only): 1806 on the wharf and in the workshop; 1833 on the wharf
  eddie: { card: 'hero', home: [3.6, 2.2], set: ['wharf', 'workshop'], c: { ...C.eddie1806.c } },
  eddie33: { card: 'hero', home: [0.6, -4.4], set: ['wharf33'], c: { ...C.eddie1833.c, item: undefined, itemL: 'cane' } },
  // pond: four grown-up ice cutters on thick ice, well away from the open channel
  w1: P('iceSaw1', 'mid', [6.7, -7.6], ['pond']), w2: P('iceTongs', 'mid', [5.85, -6.3], ['pond']),
  w3: P('icePike', 'mid', [3.9, -8.3], ['pond']), w4: P('iceSaw2', 'mid', [7.9, -8.9], ['pond']),
  // sailors: one on the deck at the tackle, one on the wharf by the plank (Boston); one on the Martinique quay
  s1: P('sailor1', 'mid', [9.3, 4.2, -0.6], ['wharf']), s2: P('sailor2', 'mid', [4.1, 4.4], ['wharf']),
  sMq: P('sailor2', 'mid', [10.3, -1.8], ['mq'], { c: { neckerchief: '#c0392b', hat: 'straw', hatColor: '#e3c87a', hatBand: '#1d3557', item: undefined } }),
  // kitchen cook
  cook: P('cook', 'mid', [-0.5, -0.65], ['kitchen']),
  // Martinique: the merchant and three townspeople (calm, curious)
  mer: P('mqMerchant', 'hero', [8.8, -2.4], ['mq'], { def: { mood: 'mq' } }),
  mq1: P('mqWoman', 'mid', [6.4, -4.2], ['mq'], { def: { mood: 'mq' } }),
  mq2: P('mqMan', 'mid', [7.4, -5.2], ['mq'], { def: { mood: 'mq' } }),
  mq3: P('mqFisher', 'mid', [11.6, -4.6], ['mq'], { def: { mood: 'mq' } }),
  // Calcutta (now Kolkata): merchants, dockworkers, British residents; two also look down into the hold (beat 14B)
  ca1: P('caMerchant1', 'mid', [5.0, -2.2], ['ca', 'hold'], { def: { mood: 'ca' } }),
  ca2: P('caMerchant2', 'mid', [6.4, -3.4], ['ca'], { def: { mood: 'ca' } }),
  ca3: P('caWorker1', 'mid', [8.0, -1.7], ['ca', 'hold'], { def: { mood: 'ca' } }),
  ca4: P('caWorker2', 'mid', [9.4, -2.6], ['ca'], { def: { mood: 'ca' } }),
  ca5: P('caWorker3', 'mid', [11.0, -2.0], ['ca'], { def: { mood: 'ca' } }),
  ca6: P('caBritMan', 'mid', [7.6, -4.6], ['ca'], { def: { mood: 'ca' } }),
  ca7: P('caBritWoman', 'mid', [8.9, -4.9], ['ca'], { def: { mood: 'ca' } }),
  // sawmill
  m1: P('mill1', 'mid', [-2.9, 1.9], ['sawmill']), m2: P('mill2', 'mid', [2.5, -1.55], ['sawmill']),
  // Boston crowd 1806 (laughs) — on the wharf, clear of the crates, barrels, ice and sacks
  b1: P('b06man', 'extra', [-1.9, -7.6], ['wharf']), b2: P('b06woman', 'extra', [-0.8, -7.7], ['wharf']),
  b3: P('b06work', 'extra', [0.3, -7.6], ['wharf']), b4: P('b06old', 'extra', [1.4, -7.8], ['wharf']),
  b5: P('b06woman2', 'extra', [-1.3, -8.9], ['wharf']), b6: { card: 'extra', home: [-0.2, -8.9], set: ['wharf'], c: tint('b06man', { coat: { color: '#2a3a52', long: true }, hatColor: '#3a3028', breeches: '#e8dcc0' }) },
  b7: { card: 'extra', home: [0.9, -8.8], set: ['wharf'], c: tint('b06woman', { empire: { color: '#e9d8ee', sash: '#7a2a5a', hem: '#7a2a5a' }, spencer: '#2a4a3a', hatBand: '#7a2a5a' }) },
  b8: { card: 'extra', home: [2.0, -8.9], set: ['wharf'], c: tint('b06work', { vest: '#2a3a52', hat: 'knit', hatColor: '#8a2a2a', hatBand: '#6a1f1f' }) },
  b9: { card: 'extra', home: [-0.7, -10.0], set: ['wharf'], c: tint('b06old', { coat: { color: '#3a2a22', long: true } }) },
  b10: { card: 'extra', home: [0.6, -10.1], set: ['wharf'], c: tint('b06woman2', { empire: { color: '#cfe0ea', sash: '#2a4a7a' }, shawl: { color: '#3f6a52', pattern: '#e8c55a' } }) },
  kid: P('b06kid', 'extra', [-0.25, -7.0], ['wharf']),
  // Boston crowd 1833 (the same people, cheering) — same marks on the 1833 wharf
  k1: P('b33man', 'extra', [-1.9, -7.6], ['wharf33']), k2: P('b33woman', 'extra', [-0.8, -7.7], ['wharf33']),
  k3: P('b33work', 'extra', [0.3, -7.6], ['wharf33']), k4: { card: 'extra', home: [1.4, -7.8], set: ['wharf33'], c: tint('b06old', { hat: 'topTall' }) },
  k5: { card: 'extra', home: [-1.3, -8.9], set: ['wharf33'], c: tint('b33woman', { empire: { color: '#efe2c4', waist: 'natural', sash: '#3f6a52', bodice: '#efe2c4' }, puffSleeves: '#efe2c4', hatBand: '#3f6a52' }) },
  k6: { card: 'extra', home: [-0.2, -8.9], set: ['wharf33'], c: tint('b33man', { coat: { color: '#3a2a22', long: true } }) },
  k7: { card: 'extra', home: [0.9, -8.8], set: ['wharf33'], c: tint('b33woman', { empire: { color: '#e8cfd8', waist: 'natural', sash: '#7a2a5a', bodice: '#e8cfd8' }, puffSleeves: '#e8cfd8' }) },
  k8: { card: 'extra', home: [2.0, -8.9], set: ['wharf33'], c: tint('b33work', { vest: '#5a3a22' }) },
  k9: { card: 'extra', home: [0.2, -10.0], set: ['wharf33'], c: tint('b33man', { coat: { color: '#2a2a3a', long: true } }) },
};
export const crowdIds = ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'b9', 'b10', 'kid', 'k1', 'k2', 'k3', 'k4', 'k5', 'k6', 'k7', 'k8', 'k9'];
export const expertIds = [];

// ---------- helpers ----------
const sh = (at, cam, look, fov, trans = 'cut', extra = {}) => ({ at, cam, look, fov, trans, ...extra });
const still2 = (a, b) => [a, b];
const docked = (dock, hd) => ({ ship: [[0, dock, hd]] });

// ---------- the 16 beats ----------
export const beats = [
  { // 1 — cold open on the pond (loop target), then loading the brig at night
    line: 'He filled a ship with ice from a frozen pond.', min: 3.1, light: 'night', set: 'pond', amb: 'night',
    shots: [
      sh(0, [[5.2, 0.22, -5.35], [5.2, 0.34, -5.0]], [[5.2, 0.22, -6.2], [5.2, 0.33, -6.2]], [26, 38], 'cut', { captionY: 0.84 }), // frame 1: the block face fills the frame (= the last frame), then the camera eases back to show the saw
      sh('w:ship-0.05', [[1.3, 0.55, -3.55], [1.5, 0.6, -3.75]], [[6.0, 1.0, -8.0], [6.0, 1.0, -8.0]], [50, 48], 'cut', { captionY: 0.78 }),
      sh('w:frozen-0.1', [[2.3, 1.7, 0.2], [2.45, 1.65, 0.45]], [[7.6, 0.8, 5.0], [7.8, 0.6, 5.1]], [56, 54], 'cut', { set: 'wharf', captionY: 0.84 }),
    ],
    open: { saw: [[0, 0.35], ['w:ship-0.1', 0.85], ['w:ship-0.06', 0]], hatch: [[0, 1]], sails: [[0, 0]], moored: [[0, 1]] },
    ship: [[0, FAV_DOCK, NORTH]],
    movers: { block: [['w:frozen-0.1', [7.6, 4.3, 1.5], 0], ['end', [8.45, 5.15, -1.25], 0, 'sail']] },
    acts: {
      w1: [[0, 'saw'], [0.5, 'pushPole'], [1.0, 'saw'], [1.5, 'pushPole'], [2.0, 'saw']], w2: [[0, 'tongsLift'], [1.6, 'carry']],
      w3: [[0, 'pushPole'], [1.4, 'watch']], w4: [[0, 'saw'], [0.55, 'pushPole'], [1.1, 'saw'], [1.65, 'pushPole']],
      eddie: [[0, 'point'], [1.4, 'pointRight']], s1: [[0, 'hoist']], s2: [[0, 'coilRope']],
    },
    look: { eddie: [8.45, 0.4, 5.15], s2: [8.45, 0.4, 5.15] },
    sfx: [[0.02, 'iceSaw', 1.1], [0.0, 'wind', 3.5], ['w:frozen', 'creak']],
  },
  { // 2 — dawn: the Favorite sails; Eddie waves from the wharf, hat in hand
    line: 'Then he sent it all the way to the Caribbean.', min: 2.7, light: 'snowWide', set: 'wharf', amb: 'harbour',
    shots: [
      sh(0, [[8.45, -0.1, 5.15], [8.0, 2.6, 3.0]], [[8.45, 3.0, 7.5], [5.0, 1.6, -3.0]], [60, 56], 'push', { ease: 'inout', captionY: 0.8 }),
      sh('w:sent', [[0.9, 1.25, -5.6], [0.95, 1.3, -5.4]], [[6.4, 2.4, 8.0], [7.0, 3.0, 12.0]], [56, 54], 'cut', { captionY: 0.86 }),
    ],
    open: { sails: [[0, 0], ['w:sent', 0.1], ['end', 1]], hatch: [[0, 1], [0.4, 0]], moored: [[0, 1], ['w:sent-0.05', 0]] },
    ship: [['w:sent', FAV_DOCK, NORTH], ['end', [8.45, 15.5, -2], NORTH, 'sail']],
    movers: { block: [[0, [3.2, -5.5, -5], 0]] }, // the loaded block is gone (out of sight under the wharf)
    pos: { eddie: [[0, [2.4, -1.4]]] },
    acts: { eddie: [[0, 'watch'], ['w:sent', 'wave'], ['w:Caribbean', 'wave']], s2: [[0, 'watch']] },
    look: { eddie: [8.4, 2, 12] },
    cast: ['eddie'],
    sfx: [[0.1, 'gulls', 2.4], [0, 'waves', 3.2], ['w:sent', 'creak']],
  },
  { // 3 — 1806 kitchen: no fridges (year card; the outline pops in and away)
    line: 'You see, in 1806, there were no fridges.', min: 3.0, light: 'warm', set: 'kitchen', amb: 'room',
    shots: [
      sh(0, [[0.95, 1.0, 2.5], [0.8, 1.05, 2.1]], [[0.3, 1.1, -0.6], [0.3, 1.15, -0.6]], [52, 50], 'whip', { captionY: 0.8, hud: { kind: 'card', art: 'year', y: 0.115, w: 0.42, blur: false } }),
      sh('w:fridges-0.15', [[-1.6, 1.45, 2.6], [-1.45, 1.45, 2.35]], [[3.4, 1.1, -0.8], [3.4, 1.1, -0.75]], [60, 58], 'cut', { captionY: 0.82, hud: { kind: 'card', art: 'year', y: 0.115, w: 0.42, blur: false, pop: false } }),
    ],
    open: { fridge: [[0, 0], ['w:fridges', 0], ['w:fridges+0.3', 1], ['w:fridges+1.0', 1], ['w:fridges+1.3', 0]] },
    acts: { cook: [[0, 'fan'], [1.0, 'sweat'], [1.9, 'fan'], [2.8, 'sweat']] },
    look: { cook: 'camera' },
    sfx: [['w:fridges+0.3', 'pop']],
  },
  { // 4 — a hot port (Martinique dressing, no caption name): a cup of water in the sun, the merchant fans himself
    line: 'In hot places, almost nobody had ice.', min: 2.8, light: 'tropic', set: 'mq', amb: 'tropic',
    shots: [sh(0, [[-5.7, 1.0, -6.2], [-5.85, 1.5, -6.4]], [[-7.4, 1.05, -8.4], [-7.8, 1.75, -9.4]], [48, 52], 'wipe:flare', { ease: 'inout', captionY: 0.82, shimmer: { amp: 4, y: [0.32, 0.62] } })],
    pos: { mer: [[0, [-8.2, -9.2]]] },
    acts: { mer: [[0, 'fan', { item: 'fan' }], [1.4, 'sweat', { item: 'fan' }], [2.2, 'fan', { item: 'fan' }]] },
    look: { mer: 'camera' },
    cast: ['mer'],
    ship: [[0, MQ_DOCK, Math.PI]], open: { sails: [[0, 0]], moored: [[0, 1]], hatch: [[0, 0]] },
    sfx: [[0, 'waves', 2.8]],
  },
  { // 5 — Boston: Eddie holds the ice up like a jewel; "Frederic Tudor"
    line: 'Frederic Tudor, from Boston, wanted to sell them winter.', min: 3.4, light: 'snowWide', set: 'wharf', amb: 'harbour',
    shots: [
      sh(0, [[1.2, 1.34, -2.35], [1.15, 1.32, -2.2]], [[1.15, 1.32, -3.2], [1.1, 1.3, -3.2]], [30, 34], 'match', { captionY: 0.8 }),
      sh('w:Boston-0.1', [[0.9, 1.35, -1.2], [0.8, 1.4, 0.0]], [[0.6, 1.45, -3.2], [0.6, 1.6, -5.0]], [44, 46], 'cut', { ease: 'out', captionY: 0.82 }),
    ],
    ship: [[0, [30, 120, -2], NORTH]], open: { moored: [[0, 0]], sails: [[0, 1]] },
    pos: { eddie: [[0, [0.6, -3.2]]] },
    acts: { eddie: [[0, 'presentIce', { item: 'ice' }], [1.6, 'proud', { item: 'ice' }], [2.6, 'presentIce', { item: 'ice' }]] },
    look: { eddie: 'camera' }, cast: ['eddie'],
    sfx: [[0.05, 'ping']],
  },
  { // 6 — Boston laughed; the newspaper ("slippery speculation" is the only readable line)
    line: 'Boston laughed. A newspaper joked it might be a "slippery speculation."', min: 4.8, light: 'snowWide', set: 'wharf', amb: 'harbour',
    shots: [
      sh(0, [[1.3, 2.1, -2.9], [1.25, 2.05, -3.15]], [[0.2, 1.4, -9.5], [0.2, 1.4, -9.5]], [52, 50], 'whip', { captionY: 0.86 }),
      sh('w:newspaper-0.1', [[1.3, 2.1, -3.2], [1.3, 2.1, -3.2]], [[0.2, 1.4, -9.5], [0.2, 1.4, -9.5]], [50, 50], 'cut', { captionY: 0.86, hud: { kind: 'card', art: 'news', w: 0.84, y: 0.44, rot: -0.03, s: [1, 1.07] } }),
    ],
    pos: { eddie: [[0, [0.6, -4.2]]] },
    acts: { eddie: [[0, 'akimbo'], [1.6, 'handChin']] },
    mood: { crowd: 'laugh' }, lookAll: [0.6, 1.4, -4.2],
    sfx: [['w:laughed', 'laugh'], ['w:newspaper', 'paper'], [0, 'gulls', 1.5]],
  },
  { // 7 — the Favorite reaches Martinique (zoom out of the paper into the real harbour); the cameo frame is in this shot
    line: 'His ice reached the island of Martinique.', min: 2.7, light: 'tropic', set: 'mq', amb: 'tropic',
    shots: [sh(0, [[-1, 11, 25], [0, 8.6, 21.5]], [[0, 3, -8], [0.5, 3.4, -9]], [56, 54], 'zoom', { ease: 'out', captionY: 0.84 })],
    ship: [[0, [26, 3.55, -2], Math.PI], [2.5, MQ_DOCK, Math.PI, 'sail']],
    open: { sails: [[0, 1], [2.5, 0.25]], moored: [[0, 0], [2.6, 1]], hatch: [[0, 0]] },
    pos: { mer: [[0, [8.8, -3.4]]] },
    mood: { mq: 'watch' }, lookAll: [12, 2, 3],
    cast: ['mer', 'mq1', 'mq2', 'mq3'],
    sfx: [[0, 'waves', 3.0], [0.4, 'gulls', 2.0], [2.5, 'creak']],
  },
  { // 8 — nowhere to keep it cold: the merchant holds the dripping block, polite and puzzled; his line
    line: 'But there was nowhere to keep it cold.', line2: { text: 'Lovely. And... what do I do with it?', voice: 'merchant' }, min: 4.2, light: 'tropic', set: 'mq', amb: 'tropic',
    shots: [
      sh(0, [[12.0, 0.65, 0.2], [11.8, 0.7, 0.0]], [[8.9, 1.25, -2.4], [8.9, 1.3, -2.4]], [50, 48], 'cut', { captionY: 0.84 }),
      sh('w2:Lovely-0.1', [[10.3, 1.6, -0.9], [10.2, 1.6, -1.0]], [[9.25, 1.75, -2.3], [9.25, 1.75, -2.3]], [40, 38], 'cut', { captionY: 0.86 }),
    ],
    ship: [[0, MQ_DOCK, Math.PI]], open: { sails: [[0, 0.25]], moored: [[0, 1]], hatch: [[0, 0]] },
    pos: { mer: [[0, [8.8, -2.4]]], sMq: [[0, [10.3, -1.8]]] },
    acts: { mer: [[0, 'holdAtArm', { item: 'iceBlock' }], [1.5, 'holdAtArm', { item: 'iceBlock' }], ['w2:Lovely', 'ask', { item: 'iceBlock', talk: ['w2:Lovely', 'end'] }], ['w2:what', 'holdAtArm', { item: 'iceBlock', talk: ['w2:Lovely', 'end'] }]],
      sMq: [[0, 'carry'], [1.2, 'watch']] },
    look: { mer: [9.6, 1.4, -0.6], sMq: 'mer' }, mood: { mq: 'watch' }, lookAll: [8.8, 1.4, -2.4],
    cast: ['mer', 'sMq', 'mq1', 'mq2', 'mq3'],
    bubble: { who: 'mer', text: 'Lovely. And… what do I do with it?', from: 'w2:Lovely', to: 'end' },
    fx: [{ kind: 'drip', at: 0, pos: [9.19, 0.98, -2.87], rate: 2.6 }, { kind: 'puddle', at: 0, pos: [9.19, -2.87], r: [0.06, 0.5], grow: 4.0 }],
    sfx: [[0.3, 'drip'], [0.9, 'drip'], [1.5, 'drip'], [2.2, 'drip']],
  },
  { // 9 — it melts (puddle spreads); Boston: the letter, the hat droops; the crowd laughs harder
    line: 'It melted away, and he lost a lot of money. Boston laughed harder.', min: 4.2, light: 'tropic', set: 'mq', amb: 'harbour',
    shots: [
      sh(0, [[9.3, 2.3, -2.0], [9.25, 1.7, -2.5]], [[9.19, 0, -2.9], [9.19, 0, -2.9]], [50, 46], 'match', { captionY: 0.84 }),
      sh('w:lost-0.05', [[1.25, 0.8, -11.3], [1.1, 1.55, -11.0]], [[1.0, 0.1, -13.3], [0.9, 1.95, -14.2]], [50, 48], 'match', { set: 'wharf', light: 'snowWide', ease: 'inout', captionY: 0.84 }),
      sh('w:money-0.05', [[1.1, 1.55, -11.0], [1.1, 1.55, -11.0]], [[0.9, 1.95, -14.2], [0.9, 1.95, -14.2]], [48, 48], 'cut', { set: 'wharf', light: 'snowWide', captionY: 0.86, hud: { kind: 'card', art: 'letter', w: 0.66, y: 0.42, rot: 0.04 } }),
      sh('w:Boston-0.05', [[0.6, 1.5, -4.8], [0.5, 1.45, -5.2]], [[0.4, 1.4, -9.0], [0.4, 1.4, -9.0]], [54, 52], 'whip', { set: 'wharf', light: 'snowWide', captionY: 0.86 }),
    ],
    ship: [[0, MQ_DOCK, Math.PI]],
    fx: [{ kind: 'puddle', at: 0, until: 'w:lost-0.05', pos: [9.19, -2.87], r: [0.5, 1.9], grow: 1.5 }, { kind: 'puddle', set: 'wharf', at: 0, pos: [1.1, -12.9], r: [0.7, 0.7], grow: 0.1, color: 0x6a7684 }],
    pos: { eddie: [[0, [0.9, -14.0]]] },
    acts: { eddie: [[0, 'watch', { item: 'letter' }], ['w:lost', 'hatDroop', { item: 'letter' }], ['w:money+0.4', 'sigh', { item: 'letter' }]],
      b1: [['w:Boston', 'kneeSlap'], ['w:harder', 'laughBack']], b4: [['w:Boston', 'laughBack'], ['w:harder', 'kneeSlap']], b6: [['w:Boston', 'kneeSlap']], b8: [['w:Boston', 'laughBelly'], ['w:harder', 'kneeSlap']] },
    look: { eddie: 'camera' }, mood: { crowd: 'laugh' }, lookAll: [0.9, 1.4, -14],
    sfx: [[0.1, 'splash'], ['w:lost', 'paper'], ['w:Boston', 'laugh'], ['w:harder', 'laugh']],
  },
  { // 10 — the ice house door opens, push in; three tests, one per word: 1 · HAY, 2 · STRAW, 3 · RICE HUSKS
    line: 'So he tried packing the ice in hay. He tried straw. He tried rice husks.', min: 4.4, light: 'snowWide', set: 'wharf', amb: 'room',
    shots: [
      sh(0, [[-8.8, 1.7, -9.4], [-9.0, 1.5, -12.6]], [[-9.0, 1.5, -13.6], [-9.0, 1.45, -15]], [52, 56], 'whip', { ease: 'in', captionY: 0.8 }),
      sh('w:hay-0.12', [[-3.6, 1.0, 0.85], [-3.5, 1.0, 0.65]], [[-1.95, 0.9, -1.6], [-1.95, 0.9, -1.6]], [56, 54], 'push', { set: 'workshop', light: 'warm', captionY: 0.62 }),
      sh('w:straw-0.12', [[0.45, 1.95, 1.0], [0.4, 1.9, 0.85]], [[0, 0.85, -1.6], [0, 0.85, -1.6]], [52, 50], 'cut', { set: 'workshop', light: 'warm', captionY: 0.62 }),
      sh('w:rice-0.12', [[2.3, 1.6, 0.75], [2.3, 1.6, 0.55]], [[2.2, 1.15, -2.0], [2.2, 1.15, -2.0]], [58, 56], 'cut', { set: 'workshop', light: 'warm', captionY: 0.84 }),
    ],
    doors: [[0, 0.1], [0.3, 1]],
    open: { melt: [[0, 0]], season: [[0, 0]] },
    pos: { eddie: [[0, [2.4, -2.62]]] },
    acts: { eddie: [[0, 'notes', { item: 'pencil', itemL: 'notebook' }], ['w:straw', 'write', { item: 'pencil', itemL: 'notebook' }], ['w:rice', 'notes', { item: 'pencil', itemL: 'notebook' }]] },
    look: { eddie: [2.2, 0.8, -1.6] }, cast: ['eddie'],
    sfx: [[0.1, 'creak'], ['w:hay', 'tick'], ['w:straw', 'tick'], ['w:rice', 'tick']],
  },
  { // 11 — time-lapse: the blocks shrink a lot but not to nothing; Eddie sighs
    line: 'Too much of it still melted.', min: 2.2, light: 'warm', set: 'workshop', amb: 'room',
    shots: [sh(0, [[-1.2, 1.25, 2.3], [-1.2, 1.25, 2.25]], [[0.7, 0.75, -1.3], [0.7, 0.75, -1.3]], [66, 66], 'cut', { captionY: 0.86 })],
    open: { melt: [[0, 0.05], ['end', 1]], season: [[0, 0]] },
    pos: { eddie: [[0, [1.2, -0.3]]] },
    acts: { eddie: [[0, 'handChin'], [0.9, 'sigh']] },
    look: { eddie: [0, 0.6, -1.6] }, cast: ['eddie'],
    sfx: [[0.2, 'drip'], [0.8, 'drip'], [1.3, 'drip']],
  },
  { // 12 — 1833: the map (round the southern tip of Africa to Calcutta); the Tuscany sets sail from Boston
    line: 'In 1833, he sent a ship of ice to Calcutta, in India.', min: 4.0, light: 'mayWarm', set: 'wharf33', amb: 'harbour',
    shots: [
      sh(0, [[4, 2, 6], [4, 2, 6]], [[0, 2, -10], [0, 2, -10]], [50, 50], 'wipe:paper', { captionY: 0.82, hud: { kind: 'card', art: 'map', w: 0.96, y: 0.42, route: [0.02, 1.0], unroll: true } }),
      sh('w:India-0.35', [[12.6, -0.6, -10.4], [12.4, -0.5, -10.0]], [[8.6, 1.8, -1.0], [8.6, 2.4, 2.5]], [54, 52], 'cut', { captionY: 0.86 }),
    ],
    ship: [['w:India-0.3', TUS_DOCK, NORTH], ['end', [8.75, 12.5, -2], NORTH, 'sail']],
    open: { sails: [[0, 0], ['w:India-0.3', 0.1], ['end', 1]], moored: [[0, 1], ['w:India-0.4', 0]], hatch: [[0, 0]] },
    mood: { crowd: 'watch' }, lookAll: [8.7, 2, 4],
    pos: { eddie33: [[0, [3.6, -1.6]]] },
    acts: { eddie33: [[0, 'oldStand'], ['w:India', 'wave']] },
    sfx: [[0.05, 'paper'], ['w:India-0.3', 'creak'], ['w:India-0.3', 'gulls', 1.6]],
  },
  { // 13 — the open sea, blazing: about 15,000 miles; the deck thermometer climbs (no numbers)
    line: 'About 15,000 miles. His longest, hottest trip yet.', min: 3.6, light: 'blaze', set: 'sea', amb: 'sea',
    shots: [
      sh(0, [[7.5, 0.35, 6.5], [6.0, 0.5, 6.2]], [[-1, 5.5, -6], [-2, 6, -7]], [62, 60], 'whip', { captionY: 0.82, shimmer: { amp: 6, y: [0.55, 0.75] } }),
      sh('w:hottest-0.12', [[7.5, 0.35, 6.5], [7.5, 0.35, 6.5]], [[-1, 5.5, -6], [-1, 5.5, -6]], [62, 62], 'cut', { captionY: 0.86, hud: { kind: 'card', art: 'thermo', w: 0.34, y: 0.4, level: [0.35, 0.95] } }),
    ],
    ship: [[0, [-9, 0, 0], 0.15], ['end', [6, 0, 0], 0.15, 'sail']],
    open: { sails: [[0, 1]], hatch: [[0, 0]] },
    cast: [],
    sfx: [[0, 'waves', 3.6], [0, 'wind', 3.6], [0.3, 'splash']],
  },
  { // 14 — Calcutta (now Kolkata): the Tuscany docks, the crowd gathers; the hatch opens: most of the ice is still there
    line: 'The ship docks. The hatch opens, and most of the ice is still there.', min: 4.2, light: 'tropicHaze', set: 'ca', amb: 'river',
    shots: [
      sh(0, [[0.6, 1.75, -7.6], [1.0, 1.8, -7.3]], [[8.0, 1.3, -1.6], [8.2, 1.4, -1.4]], [56, 54], 'push', { captionY: 0.86 }),
      sh('w:hatch-0.1', [[0.95, 0.55, 0.45], [0.9, 0.5, 0.5]], [[0, 3.6, 0.1], [0, 3.7, 0.12]], [66, 64], 'push', { set: 'hold', light: 'hold', captionY: 0.86 }),
    ],
    ship: [[0, CA_DOCK, Math.PI]], open: { sails: [[0, 0.25]], moored: [[0, 1]], hatch: [[0, 0], ['w:hatch', 0], ['w:hatch+0.6', 1]], crate: [[0, 0]] },
    pos: { ca1: [[0, [5.0, -2.2]], ['w:hatch-0.1', [-1.25, 1.12, 2.72]]], ca3: [[0, [8.0, -1.7]], ['w:hatch-0.1', [1.3, 1.1, 2.72]]] },
    acts: { ca1: [[0, 'holdLedger'], [1.2, 'point'], ['w:hatch', 'watch'], ['w:most', 'clap']], ca3: [[0, 'watch'], [1.0, 'point'], ['w:most', 'cheerOne']], ca6: [[0, 'watch'], [1.5, 'clap']] },
    mood: { ca: 'watch' }, lookAll: [6.6, 0.4, 3.85],
    look: { ca1: [0, 0, 0], ca3: [0, 0, 0] },
    fx: [{ kind: 'puddle', set: 'hold', at: 0, pos: [-1.3, 0.55], r: [0.22, 0.22], grow: 0.1 }, { kind: 'puddle', set: 'hold', at: 0, pos: [1.6, -0.4], r: [0.16, 0.16], grow: 0.1 }, { kind: 'puddle', set: 'hold', at: 0, pos: [0.3, 0.9], r: [0.12, 0.12], grow: 0.1 }],
    sfx: [[0, 'crowdMurmur', 2.2], ['w:hatch', 'creak'], ['w:most', 'ping']],
  },
  { // 15 — the Ice King: Eddie (1833) lifts his top hat; the same Boston people now cheer; an ice-crown sparkle
    line: 'They called him the Ice King.', min: 2.4, light: 'mayWarm', set: 'wharf33', amb: 'harbour',
    shots: [sh(0, [[0.95, 0.9, -1.55], [0.8, 1.0, -2.0]], [[0.6, 1.75, -4.4], [0.6, 1.8, -4.4]], [46, 44], 'cut', { captionY: 0.84 })],
    ship: [[0, [30, 120, -2], NORTH]], open: { moored: [[0, 0]] },
    pos: { eddie33: [[0, [0.6, -4.4]]] },
    acts: { eddie33: [[0, 'oldStand'], ['w:called', 'hatLift']] },
    look: { eddie33: 'camera' }, mood: { crowd: 'cheer' }, lookAll: [0.6, 1.5, -4.4],
    sparkle: ['w:King', [0.6, 2.75, -4.4]],
    sfx: [['w:called', 'cheer'], ['w:King', 'ding']],
  },
  { // 16 — payoff: the sawmill's waste sawdust → the cutaway: heat arrows slow and fade; push in until the block fills the frame
    line: 'His secret? Sawdust, the stuff sawmills threw away, packed thick around the ice to keep the heat out.', min: 5.4, light: 'warm', set: 'sawmill', amb: 'mill',
    shots: [
      sh(0, [[2.4, 1.7, 4.2], [1.6, 1.5, 3.4]], [[-0.1, 1.4, -0.6], [-0.3, 1.1, 0.6]], [50, 48], 'whip', { ease: 'inout', captionY: 0.84 }),
      sh('w:packed-0.15', [[-0.45, 1.05, 10.5], [0.45, 0.5, 2.6]], [[-0.45, 1.0, 0], [0.5, 0.42, 0]], [34, 30], 'match', { set: 'cutaway', light: 'cutaway', ease: 'in', captionY: 0.86 }),
      sh('w:heat-0.2', [[0.45, 0.5, 2.6], [ICE_X, ICE_Y, 1.28]], [[0.5, 0.42, 0], [ICE_X, ICE_Y, 0]], [30, 26], 'cut', { set: 'cutaway', light: 'night', ease: 'out', captionY: 0.86 }),
    ],
    fx: [{ kind: 'arrows', set: 'cutaway', at: 'w:packed', from: [-2.7, 0.45, 0.76], to: [ICE_X - 0.36, 0.45, 0.76], n: 4, every: 0.4, life: 1.6 }],
    acts: { m1: [[0, 'shovel', { item: 'shovel' }], [0.9, 'pushPole', { item: 'shovel' }], [1.8, 'shovel', { item: 'shovel' }]], m2: [[0, 'pushPole'], [1.2, 'watch'], [2.0, 'pushPole']] },
    look: { m1: [-0.4, 1.0, 1.4], m2: [0, 1.0, -0.6] },
    sfx: [[0, 'sawmill', 2.8], ['w:out', 'ding']],
  },
];
