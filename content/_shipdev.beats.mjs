export const meta = { id: 'ship-dev', title: 'dev', aspect: '9:16', fps: 30, width: 1080, height: 1920, gap: 0.12, set: 'wharf', captions: false,
  sets: { wharf: { year: 1806 }, wharf33: { base: 'wharf', year: 1833 } } };
export const cast = {};
const sh = (cam, look, fov = 50) => ({ at: 0, cam: [cam, cam], look: [look, look], fov: [fov, fov], trans: 'cut' });
export const beats = [
  { line: 'One.', min: 2, light: 'snow', shots: [sh([1, 2.2, 17], [-2, 4, -18], 55)], cast: [] },
  { line: 'Two.', min: 2, light: 'night', shots: [sh([-1.5, 1.4, -6], [8, 4, 6], 55)], cast: [] },
  { line: 'Three.', min: 2, light: 'snow', shots: [sh([-6, 1.6, -7], [-9, 1.6, -13.5], 50)], cast: [], doors: [[0, 0.9]] },
  { line: 'Four.', min: 2, light: 'warm', set: 'wharf33', shots: [sh([16, 3, 26], [4, 4, 0], 55)], cast: [] },
];
