export const meta = { id: 'ship-dev', title: 'dev', aspect: '9:16', fps: 30, width: 1080, height: 1920, gap: 0.12, set: 'pond', captions: false };
export const cast = {};
const sh = (cam, look, fov = 50) => ({ at: 0, cam: [cam, cam], look: [look, look], fov: [fov, fov], trans: 'cut' });
export const beats = [
  { line: 'One.', min: 2, light: 'night', shots: [sh([-2, 1.3, 6], [1, 1.2, -14], 55)], cast: [] },
  { line: 'Two.', min: 2, light: 'night', shots: [sh([9, 4.5, -2], [2, 0.8, -17], 50)], cast: [] },
  { line: 'Three.', min: 2, light: 'night', shots: [sh([-5, 0.35, -6.5], [-1, 0.3, -2.5], 60)], cast: [] },
  { line: 'Four.', min: 2, light: 'night', shots: [sh([3, 2, -8], [-6, 1.5, 25], 60)], cast: [] },
];
