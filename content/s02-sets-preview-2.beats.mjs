// S02 look-dev (round 0, part 2): build steps 7–10 — Tropical Harbour (Martinique 1806 / Calcutta 1833), the hold, the
// sawdust cutaway, the kitchen, the ice-house workshop, the sawmill, and the five HUD cards. Not for broadcast; no people;
// captions off; the short local (Kokoro) lines only set the timing.
// Stills: node render-episode.mjs content/s02-sets-preview-2.beats.mjs projects/s02-sets-preview-2 --3d --preview <beat middles>
const ICE_X = 0.55, ICE_Y = 0.4; // = ICE_X / hold block centre in src/hold.js (beats files load in node, so no browser imports here)

export const meta = {
  id: 's02-sets-preview-2', title: 'S02 sets preview (round 0, part 2)',
  aspect: '9:16', fps: 30, width: 1080, height: 1920, gap: 0.12,
  set: 'mq', captions: false,
  sets: { mq: { base: 'harbour', place: 'martinique' }, ca: { base: 'harbour', place: 'calcutta' }, hold: { crate: true }, cutaway: {}, kitchen: {}, workshop: {}, sawmill: {}, pond: {}, wharf: { year: 1806 } },
};
export const cast = {};
const still = (cam, look, fov = 50, extra = {}) => ({ at: 0, cam: [cam, cam], look: [look, look], fov: [fov, fov], trans: 'cut', ...extra });
const b = (line, set, light, shot, extra = {}) => ({ line, min: 2.2, set, light, shots: [shot], cast: [], ...extra });
const card = (line, hud) => b(line, 'kitchen', 'warm', still([0.6, 1.4, 3.0], [0, 1.2, -1], 55, { hud: { kind: 'card', ...hud } }), { open: { fridge: [[0, 0]] } });
const dock = { ship: [[0, [10, 3.85, -2], Math.PI]], open: { sails: [[0, 0]], hatch: [[0, 0]], moored: [[0, 1]] } };
const dockT = { ship: [[0, [10, 4.15, -2], Math.PI]], open: { sails: [[0, 0]], hatch: [[0, 0]], moored: [[0, 1]] } };

export const beats = [
  // ---- Martinique, Saint-Pierre, 1806 ----
  b('Martinique.', 'mq', 'tropic', still([7, 4.5, 21], [-7, 4.2, -14], 60), dock),
  b('The arcade.', 'mq', 'tropic', still([-1.5, 1.6, -3.2], [-14, 3.2, -12.5], 56), dock),
  b('A cup on the stall.', 'mq', 'tropic', still([-6.0, 1.5, -5.3], [-6.6, 1.0, -8.1], 40, { shimmer: { amp: 4, y: [0.35, 0.6] } }), dock),
  b('Steps and boats.', 'mq', 'tropic', still([-3, 1.8, 9], [-12, -1.2, 1], 58), dock),
  // ---- Calcutta, Hooghly riverfront, 1833 ----
  b('Calcutta.', 'ca', 'tropicHaze', still([7, 4.5, 23], [-8, 4.5, -14], 60), dockT),
  b('The ghat.', 'ca', 'tropicHaze', still([-9, -0.9, 10], [-12, 1.4, -8], 60), dockT),
  b('The custom house.', 'ca', 'tropicHaze', still([-13, 1.6, -2.5], [-16, 5.5, -13], 58), dockT),
  b('Brass and clay.', 'ca', 'tropicHaze', still([-13.6, 1.45, -5.8], [-15.6, 1.0, -9.1], 52), dockT),
  b('The banyan.', 'ca', 'tropicHaze', still([-24, 1.8, -1.5], [-32, 3.5, -8.5], 58), dockT),
  // ---- the hold, and the cutaway ----
  b('The hold.', 'hold', 'hold', still([-5.6, 1.45, 0.1], [1, 0.9, 0], 60), { open: { hatch: [[0, 1]] } }),
  b('Up through the hatch.', 'hold', 'hold', still([2.4, 0.5, 0.25], [0, 2.8, 0], 70)),
  b('The cutaway.', 'cutaway', 'cutaway', still([-0.45, 1.05, 10.5], [-0.45, 1.0, 0], 34), { fx: [{ kind: 'arrows', at: 0, from: [-2.7, 0.45, 0.75], to: [ICE_X - 0.36, 0.45, 0.75], n: 4, every: 0.4, life: 1.6 }] }),
  b('The ice block (ends cool, loops to beat 1).', 'cutaway', 'night', still([ICE_X, ICE_Y, 1.45], [ICE_X, ICE_Y, 0], 26)),
  // ---- kitchen, workshop, sawmill ----
  b('The kitchen.', 'kitchen', 'warm', still([1.0, 1.5, 3.3], [-0.3, 1.1, -1.5], 62), { open: { fridge: [[0, 0]] } }),
  b('No fridge.', 'kitchen', 'warm', still([-1.6, 1.45, 2.6], [3.4, 1.1, -0.8], 60), { open: { fridge: [[0, 1]] } }),
  b('The workshop.', 'workshop', 'warm', still([-2.0, 1.9, 2.4], [0.3, 0.7, -1.6], 64), { open: { melt: [[0, 0]], season: [[0, 0]] } }),
  b('After the melt.', 'workshop', 'warm', still([3.4, 1.7, 1.4], [1.4, 0.6, -1.6], 60), { open: { melt: [[0, 1]], season: [[0, 0]] } }),
  b('The window, summer.', 'workshop', 'warm', still([-1.6, 1.7, -0.2], [-4.5, 1.65, -0.2], 56), { open: { melt: [[0, 0.5]], season: [[0, 1]] } }),
  b('The sawmill.', 'sawmill', 'warm', still([-7, 3.0, 9], [1.5, 1.5, -1], 60)),
  b('The sash saw.', 'sawmill', 'warm', still([1.5, 2.7, -4.8], [0, 1.8, -0.6], 50)),
  // ---- loop reference: beat 1's first frame (a pond block face at night) next to the cutaway end frame above ----
  b('Loop check, the pond block.', 'pond', 'night', still([-1.2, 0.8, -15.62], [-1.2, 0.8, -16.6], 26)),
  // ---- wharf gulls (redrawn) ----
  b('The gulls.', 'wharf', 'snowWide', still([-6.2, 2.0, 17.1], [-7.45, 1.8, 19.0], 38), { ship: [[0, [8.45, 3.5, -2], -Math.PI / 2]] }),
  // ---- HUD cards ----
  card('Year card.', { art: 'year', y: 0.16, w: 0.5 }),
  card('Newspaper.', { art: 'news', w: 0.86, rot: -0.03 }),
  card('Letter.', { art: 'letter', w: 0.8, rot: 0.04 }),
  card('The map.', { art: 'map', w: 0.96, route: [0.3, 1.0] }),
  card('Thermometer.', { art: 'thermo', w: 0.36, level: [0.35, 0.9] }),
  // ---- added after round 0: the farmhouse across the pond ----
  b('The farmhouse across the pond.', 'pond', 'night', still([-2.5, 1.7, 1.5], [-9, 3.2, 26], 52)),
];
