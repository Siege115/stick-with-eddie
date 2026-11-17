// S02 look-dev (round 0, part 1): the empty sets from build steps 4–6, for the owner's picture review.
// Not for broadcast. No people; captions off; a short local (Kokoro) line per shot only sets the timing.
// Sets: Boston Wharf 1806 (snow, night), Boston Wharf 1833 (May), Frozen Pond (night), brig/ship on open water.
// Stills: node render-episode.mjs content/s02-sets-preview.beats.mjs projects/s02-sets-preview --3d --preview <beat middles>

export const meta = {
  id: 's02-sets-preview', title: 'S02 sets preview (round 0, part 1)',
  aspect: '9:16', fps: 30, width: 1080, height: 1920, gap: 0.12,
  set: 'wharf', captions: false,
  sets: {
    wharf: { year: 1806 },
    wharf33: { base: 'wharf', year: 1833 },
    pond: {},
    seaBrig: { base: 'water', tint: 'sea', ship: 'favorite', sails: 1 },
    seaShip: { base: 'water', tint: 'sea', ship: 'tuscany', sails: 1 },
    river: { base: 'water', tint: 'river', ship: null },
    tropicWater: { base: 'water', tint: 'tropic', ship: null },
  },
  // the snow and May looks with the fog pushed back, so an empty wide set reads (the episode will tune per shot)
  lights: {
    snowWide: { bg: '#d9dee6', fog: '#cfd6df', near: 22, far: 80, sun: '#f4f6fb', sunI: 1.3, sunPos: [5, 12, 7], hemiS: '#e8edf5', hemiG: '#6c7380', hemiI: 1.3, lamp: 0.15, spot: 0, beam: 0, rim: '#e6eeff', tint: '#f4f6fa', exp: 1.05, mote: 0.8, motes: 'snow', long: 0.25, vig: '#1a2230', vigA: 0.3, shimmer: 0 },
    mayWarm: { bg: '#f4c890', fog: '#efc392', near: 26, far: 90, sun: '#ffe0b0', sunI: 2.8, sunPos: [-10, 9, 8], hemiS: '#ffeccc', hemiG: '#6b4a32', hemiI: 1.0, lamp: 0.7, spot: 0, beam: 0, rim: '#ffc27a', tint: '#fff1e2', exp: 1.0, mote: 0.3, motes: 'dust', long: 0.8, vig: '#1e0f00', vigA: 0.32, shimmer: 0 },
    seaDay: { bg: '#8fc3e8', fog: '#a9d2ee', near: 30, far: 110, sun: '#fff4dc', sunI: 3.0, sunPos: [-8, 12, 9], hemiS: '#d6ecff', hemiG: '#2c4a63', hemiI: 1.1, lamp: 0, spot: 0, beam: 0, rim: '#fff2c8', tint: '#fff8ec', exp: 1.0, mote: 0, motes: 'none', long: 0.3, vig: '#0a1a2a', vigA: 0.25, shimmer: 0 },
  },
};
export const cast = {};

const D1806 = [8.45, 3.5, -2], D1833 = [8.75, 3.5, -2], HD = -Math.PI / 2;
const still = (cam, look, fov = 50, cam2, look2) => ({ at: 0, cam: [cam, cam2 || cam], look: [look, look2 || look], fov: [fov, fov], trans: 'cut' });
const wharf = (line, light, shot, extra = {}) => ({ line, min: 2.2, light, shots: [shot], cast: [], ship: [[0, D1806, HD]], open: { sails: [[0, 0]], hatch: [[0, 0]], moored: [[0, 1]] }, doors: [[0, 0]], ...extra });
const wharf33 = (line, shot, extra = {}) => ({ line, min: 2.2, light: 'mayWarm', set: 'wharf33', shots: [shot], cast: [], ship: [[0, D1833, HD]], open: { sails: [[0, 0]], hatch: [[0, 0]], moored: [[0, 1]] }, doors: [[0, 0]], ...extra });
const pond = (line, shot, extra = {}) => ({ line, min: 2.2, light: 'night', set: 'pond', shots: [shot], cast: [], doors: [[0, 0.55]], ...extra });
// sailing: the ship crosses the origin heading +x (speed peaks mid-beat, so the wake shows in the middle still)
const sail = (line, set, shot) => ({ line, min: 3.0, light: 'seaDay', set, shots: [shot], cast: [], ship: [[0, [-7, 0, 0], 0.0], [3.0, [7, 0, 0], 0.0, 'sail']], open: { sails: [[0, 1]], hatch: [[0, 0]] } });

export const beats = [
  // ---- Boston Wharf, 1806 ----
  wharf('Boston wharf, winter.', 'snowWide', still([1.2, 2.3, 17.5], [-1.5, 4.2, -18], 56)),
  wharf('The warehouses.', 'snowWide', still([-1.2, 1.5, -9.5], [-7, 4.6, -22], 54)),
  wharf('The ice house.', 'snowWide', still([-4.4, 1.7, -9.2], [-9, 1.9, -13.6], 50), { doors: [[0, 1]] }),
  wharf('The brig at night.', 'night', still([3.0, 2.6, -1.5], [8.4, 0.4, 5.2], 60), { open: { sails: [[0, 0]], hatch: [[0, 1]], moored: [[0, 1]] } }),
  wharf('Down on the water.', 'snowWide', still([16, -0.6, -8], [8.4, 2.2, 3], 52)),
  // ---- Boston Wharf, 1833 ----
  wharf33('Boston, May.', still([16, 3.2, 27], [3, 4.2, -6], 56)),
  wharf33('New posters.', still([3.8, 1.6, -11.2], [7.6, 2.4, -17], 48)),
  wharf33('The ship at the wharf.', still([15.5, -0.5, -10], [8.7, 3.5, 3], 56)),
  // ---- Frozen Pond, night ----
  pond('The frozen pond.', still([-2, 1.6, 8], [1, 1.2, -14], 55)),
  pond('The shed.', still([8.2, 2.1, -9.5], [3.5, 1.4, -17.8], 52)),
  pond('The tools.', still([10.2, 1.7, -17.6], [7.2, 1.5, -19.4], 50)),
  pond('The open channel.', still([-6.2, 1.5, -8.2], [-5.2, 0.0, -3.0], 55)),
  pond('Looking across.', still([-5, 1.8, -12.5], [-7, 1.4, 20], 58)),
  // ---- the brig Favorite, sailing ----
  sail('The brig, bow.', 'seaBrig', still([20, 4, 15], [0, 5.5, 0], 55)),
  sail('The brig, side.', 'seaBrig', still([0, 3, 30], [0, 6.5, 0], 52)),
  sail('The brig, stern.', 'seaBrig', still([-30, 3.2, 7], [-9, 3.0, 0], 34)),
  // ---- the ship Tuscany, sailing ----
  sail('The ship, bow.', 'seaShip', still([22, 4, 16], [0, 6, 0], 55)),
  sail('The ship, side.', 'seaShip', still([0, 3, 33], [0, 7, 0], 54)),
  sail('The ship, stern.', 'seaShip', still([-32, 3.2, 7], [-10, 3.0, 0], 34)),
  // ---- water tints: river and tropic (harbour is under the wharf, sea under the ships) ----
  { line: 'River water.', min: 2.0, light: 'seaDay', set: 'river', shots: [still([0, 3, 10], [0, 0, -10], 60)], cast: [] },
  { line: 'Tropic water.', min: 2.0, light: 'seaDay', set: 'tropicWater', shots: [still([0, 3, 10], [0, 0, -10], 60)], cast: [] },
];
