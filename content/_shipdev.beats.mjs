export const meta = { id: 'ship-dev', title: 'ship dev', aspect: '9:16', fps: 30, width: 1080, height: 1920, gap: 0.12, set: 'water', captions: false,
  sets: { water: { tint: 'harbour', ship: 'favorite', sails: 0 }, sea2: { base: 'water', tint: 'sea', ship: 'tuscany', sails: 1 } } };
export const cast = {};
export const beats = [
  { line: 'One.', min: 2, light: 'snow', shots: [{ at: 0, cam: [[-26, 6, 18], [-26, 6, 18]], look: [[0, 6, 0], [0, 6, 0]], fov: [50, 50], trans: 'cut' }], cast: [], ship: [[0, [0, 0], 0]] },
  { line: 'Two.', min: 2, light: 'snow', shots: [{ at: 0, cam: [[-14, 3.2, 4], [-14, 3.2, 4]], look: [[-8, 2, 0], [-8, 2, 0]], fov: [45, 45], trans: 'cut' }], cast: [], open: { hatch: [[0, 1]] } },
  { line: 'Three.', min: 2, light: 'snow', shots: [{ at: 0, cam: [[6, 9, 9], [6, 9, 9]], look: [[0, 1.5, 0], [0, 1.5, 0]], fov: [55, 55], trans: 'cut' }], cast: [] },
  { line: 'Four.', min: 3, light: 'tropic', set: 'sea2', shots: [{ at: 0, cam: [[20, 4, 26], [20, 4, 26]], look: [[0, 7, 0], [0, 7, 0]], fov: [50, 50], trans: 'cut' }], cast: [], ship: [[0, [-10, 0], 0.3], [3, [10, 0], 0.3, 'sail']] },
];
