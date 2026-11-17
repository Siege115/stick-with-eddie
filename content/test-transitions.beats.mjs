// Engine test (not for broadcast): proves multi-set switching by name, people standing at height,
// the new light presets, the two-render transitions (match, flare and paper wipes), iris, the classic
// panel wipe in a colour, falling snow / heat specks / sawdust, heat shimmer, drip + puddle, heat arrows,
// and a mover on a track (the S02 ship). Local Kokoro voice only.
// Render stills: node render-episode.mjs content/test-transitions.beats.mjs projects/test-transitions --3d --preview <times>

export const meta = {
  id: 'test-transitions', title: 'Engine test: sets, height, transitions',
  aspect: '9:16', fps: 30, width: 1080, height: 1920,
  gap: 0.12,
  set: 'testyard', // default set for beats and shots that do not name one
  sets: { courtyard: {} }, // the courtyard with none of the S01-only pieces
};

export const cast = {
  // Eddie in a top hat and long coat (1806-style placeholder), standing on the raised platform (y = 1.2 m)
  eddie: { card: 'hero', home: [2.5, -1.5, 1.2], c: { egg: true, coat: { color: '#2b2b36', long: true }, hat: 'top', hatColor: '#222', shoes: 'sneaker', shirt: '#e8e2d2' } },
  worker: { card: 'mid', home: [-0.9, 0.6], c: { body: '#4f6d8f', hat: 'flat', hatColor: '#5a4a3a', apron: '#d8ccb0', shoes: 'boot' } },
};

export const beats = [
  { // 1: test yard at night, snow falling, Eddie up on the platform (height), worker on the ground
    line: 'Test one. The test yard at night, with snow.', min: 3.0, light: 'night',
    shots: [{ at: 0, cam: [[0.2, 1.7, 6.2], [0.4, 1.8, 5.6]], look: [[1.2, 1.3, -1.5], [1.3, 1.35, -1.5]], fov: [52, 50], trans: 'cut' }],
    acts: { eddie: [[0, 'present'], [1.4, 'pointUp']], worker: [[0, 'watch'], [1.0, 'point']] },
    look: { worker: 'eddie', eddie: 'worker' },
  },
  { // 2: match dissolve into another set, named per beat
    line: 'Test two. A match dissolve into the courtyard.', min: 3.0, light: 'warm', set: 'courtyard',
    shots: [{ at: 0, cam: [[0.6, 1.7, 4.2], [0.5, 1.65, 3.8]], look: [[0.6, 1.35, -1.5], [0.6, 1.35, -1.5]], fov: [50, 48], trans: 'match' }],
    pos: { eddie: [[0, [1.3, -1.2]]], worker: [[0, [-0.6, -0.4]]] },
    acts: { eddie: [[0, 'proud']], worker: [[0, 'clap']] },
    look: { worker: 'eddie', eddie: 'camera' },
  },
  { // 3: iris closes on Eddie, opens on the snowy yard
    line: 'Test three. An iris closes, and opens again.', min: 3.0, light: 'snow',
    shots: [{ at: 0, cam: [[3.6, 2.2, 3.6], [3.4, 2.15, 3.2]], look: [[2.4, 1.9, -1.5], [2.4, 1.9, -1.5]], fov: [46, 44], trans: 'iris', iris: { out: [0.52, 0.42], in: [0.5, 0.36] } }],
    pos: { eddie: [[0, [2.5, -1.5, 1.2]]], worker: [[0, [-0.9, 0.6]]] },
    acts: { eddie: [[0, 'cheerOne']] },
    look: { eddie: 'camera' },
  },
  { // 4: sun-flare wipe into hot light: heat shimmer, heat specks, a drip filling a puddle
    line: 'Test four. A sun flare wipe, heat shimmer, and a drip.', min: 3.4, light: 'tropic',
    shots: [{ at: 0, cam: [[-0.9, 1.15, 0.9], [-1.0, 1.1, 0.6]], look: [[-2.5, 0.55, -3.1], [-2.5, 0.5, -3.1]], fov: [46, 44], trans: 'wipe:flare', shimmer: { amp: 5, y: [0.3, 0.75] } }],
    cast: ['worker'],
    pos: { worker: [[0, [-1.4, -2.3]]] },
    acts: { worker: [[0, 'sweat']] },
    look: { worker: [-2.6, 0.6, -3.1] },
    fx: [
      { kind: 'drip', at: 0, pos: [-2.6, 0.78, -3.08], rate: 2.2 },
      { kind: 'puddle', at: 0, pos: [-2.6, -2.85], r: [0.08, 0.55], grow: 3.0 },
    ],
  },
  { // 5: paper-unroll wipe; heat arrows slow down and fade, one faint thin arrow gets through
    line: 'Test five. A paper wipe, and heat arrows that slow and fade.', min: 3.6, light: 'cutaway',
    shots: [{ at: 0, cam: [[0, 2.1, -1.2], [0, 2.1, -1.6]], look: [[0, 2.15, -6], [0, 2.15, -6]], fov: [52, 50], trans: 'wipe:paper' }],
    cast: [],
    fx: [{ kind: 'arrows', at: 0, from: [-2.4, 2.0, -5.5], to: [2.0, 2.0, -5.5], n: 4, every: 0.4, life: 1.6 }],
  },
  { // 6: classic panel wipe (in a sea-blue colour); the ship placeholder sails along its track in blazing heat
    line: 'Test six. The ship sails along its track.', min: 3.2, light: 'blaze',
    shots: [{ at: 0, cam: [[-1.0, 2.4, 10.5], [-0.6, 2.3, 10.0]], look: [[-1.0, 1.2, 2.5], [-0.6, 1.2, 2.5]], fov: [56, 54], trans: 'wipe', wipeColor: '#1d4e6b' }],
    cast: [],
    ship: [[0, [-7, 3], 0], [3.0, [1.5, 3], 0.05, 'sail']],
  },
  { // 7: the dark hold preset (spot + beam on the platform); the worker walks up the steps to Eddie (height while walking)
    line: 'Test seven. The worker climbs up to the platform.', min: 3.4, light: 'hold',
    shots: [{ at: 0, cam: [[-2.6, 1.6, 3.6], [-2.4, 1.7, 3.3]], look: [[1.4, 1.2, -1.2], [1.5, 1.3, -1.2]], fov: [50, 48], trans: 'cut' }],
    pos: { eddie: [[0, [3.2, -1.7, 1.2]]], worker: [[0, [0.05, -0.15, 0]], [0.3, [0.05, -0.15, 0]], [2.2, [0.6, -1.5, 1.2], 'walk']] },
    acts: { eddie: [[0, 'clap']] },
    look: { worker: 'eddie', eddie: 'worker' },
  },
];
