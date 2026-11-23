// S02 sets: the ship's hold (beats 12B, 15B) and the sawdust cutaway diorama (17B). Art brief 1.7.
// Hold: a long dark room along x (-7 … 7), plank floor at y = 0, deck overhead at y = 2.6, curved ribs and lining,
//   the main hatch opening at x ∈ [-1, 1], z ∈ [-0.85, 0.85] with a hinged cover (open.hatch) and a light shaft
//   (spot + beam: use the `hold` preset), a ladder, ice blocks stacked both sides packed in sawdust, a hanging lantern,
//   glints on the ice, and a canvas-covered crate on movers.crate (keys [x, z]).
// Cutaway: a slice through the hull wall read left → right: hot sky card | outer hull planks | thick sawdust | inner lining |
//   an ice block nested in sawdust (centre x = ICE_X). Heat arrows come from beat `fx` (kind 'arrows'); light `cutaway`.
import * as THREE from '/node_modules/three/build/three.module.js';
import * as T from './textures.js';
import * as K from './kit.js';
const { std, box, cyl, ink } = K;

let ICE_M = null; export const iceMat = () => (ICE_M = ICE_M || std({ map: T.ice(3), roughness: 0.15, color: 0xe2f3ff, emissive: 0x15324c }));

export function buildHold(scene, opts = {}) {
  const g = new THREE.Group(); scene.add(g);
  const H = K.setHandle(g, { center: [0, 0, 0], shadowSize: 9 });
  const r = K.rng(12); const L = 14, R = 3.4, CY = 2.0, DECK = 2.6;
  const plank = T.wood([110, 78, 50], 8, false); plank.repeat.set(3, 3);
  // lining: an open cylinder seen from inside (the floor and deck hide its bottom and top)
  const lin = T.wood([96, 66, 42], 10, false); lin.repeat.set(4, 6);
  const lining = new THREE.Mesh(new THREE.CylinderGeometry(R, R, L, 32, 1, true), std({ map: lin, side: THREE.BackSide })); lining.rotation.z = Math.PI / 2; lining.position.y = CY; lining.receiveShadow = true; g.add(lining);
  for (const s of [-1, 1]) g.add(box(0.2, 6, 2 * R, std({ map: lin, side: THREE.DoubleSide }), s * L / 2, CY, 0)); // bulkheads at the ends
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(L, 2 * R), std({ map: plank })); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; g.add(floor);
  // ribs (frames) every 0.6 m, and the deck overhead with a real hatch opening
  const ribM = std({ map: T.wood([88, 60, 38], 3) });
  for (let x = -L / 2 + 0.4; x < L / 2; x += 0.6) { const rib = new THREE.Mesh(new THREE.TorusGeometry(R - 0.1, 0.09, 6, 32), ribM); rib.rotation.y = Math.PI / 2; rib.position.set(x, CY, 0); rib.castShadow = true; g.add(rib); }
  const deckM = std({ map: T.wood([120, 88, 56], 8, false), side: THREE.DoubleSide });
  for (const [x0, x1, z0, z1] of [[-L / 2, -1, -R, R], [1, L / 2, -R, R], [-1, 1, -R, -0.85], [-1, 1, 0.85, R]]) g.add(box(x1 - x0, 0.12, z1 - z0, deckM, (x0 + x1) / 2, DECK + 0.06, (z0 + z1) / 2));
  for (let x = -L / 2 + 0.9; x < L / 2; x += 1.25) if (Math.abs(x) > 1.1) g.add(ink(box(0.22, 0.24, 2 * R, ribM, x, DECK - 0.12, 0), 1.02)); // deck beams
  for (const s of [-1, 1]) { g.add(ink(box(0.22, 0.3, 2 * R, ribM, s * 1.1, DECK - 0.15, 0), 1.02)); g.add(ink(box(2.4, 0.3, 0.2, ribM, 0, DECK - 0.15, s * 0.95), 1.02)); } // hatch framing
  // above the hatch: coaming, bright sky, the hinged cover
  const skyT = (() => { /* hazy daytime sky with soft clouds, mid-tones only: the open hatch must not read as a blown-out white square */
    const cv = document.createElement('canvas'); cv.width = cv.height = 512; const k = cv.getContext('2d'); const rr = K.rng(77);
    const gr = k.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, '#6f9cc8'); gr.addColorStop(0.55, '#a9c3da'); gr.addColorStop(1, '#d9c49a'); k.fillStyle = gr; k.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 14; i++) { const x = rr() * 512, y = rr() * 512, w = 60 + rr() * 120; const cg = k.createRadialGradient(x, y, 0, x, y, w); cg.addColorStop(0, 'rgba(240,236,226,.55)'); cg.addColorStop(1, 'rgba(240,236,226,0)'); k.fillStyle = cg; k.fillRect(x - w, y - w, 2 * w, 2 * w); }
    const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t; })();
  const sky = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), new THREE.MeshBasicMaterial({ map: skyT, color: opts.sky ?? 0xdcecff, fog: false, toneMapped: false })); sky.rotation.x = Math.PI / 2; sky.position.y = DECK + 2.2; g.add(sky);
  for (const [w, d, x, z] of [[2.3, 0.15, 0, 0.93], [2.3, 0.15, 0, -0.93], [0.15, 1.7, 1.08, 0], [0.15, 1.7, -1.08, 0]]) g.add(box(w, 0.35, d, ribM, x, DECK + 0.3, z));
  const hinge = new THREE.Group(); hinge.position.set(0, DECK + 0.48, 1.0); g.add(hinge);
  const cover = new THREE.Group(); cover.position.z = -1.0; hinge.add(cover); cover.add(ink(box(2.3, 0.1, 2.0, deckM, 0, 0.05, 0), 1.02));
  H.open.hatch = (v) => { hinge.rotation.x = Math.min(1, Math.max(0, v)) * 1.95; sky.material.color.setScalar(1).multiplyScalar(0.2 + 0.62 * Math.min(1, v * 1.5)); };
  H.openRest.hatch = opts.hatch ?? 1;
  // light shaft from the hatch (the `hold` preset drives intensity)
  Object.assign(H, K.spotRig(g, { pos: [0.3, 7.5, 0.2], target: [0, 0, 0], angle: 0.3, pen: 0.35, dist: 14, beamPos: [0, 1.3, 0], beamR: 1.15, beamH: 2.7, beamRot: [0, 0, 0.08] }));
  H.spotCenter = [0, 0]; H.spotR = 1.2;
  H.motes = K.dustMotes(g, r, { n: 110, soft: true, w: 2.2, h: 2.6, z0: -1.1, d: 2.2, x0: 0 });
  // ladder up to the hatch
  { const lg = new THREE.Group(); lg.position.set(-0.9, 0, -0.55); lg.rotation.z = -0.28; g.add(lg); for (const zz of [-0.3, 0.3]) lg.add(ink(box(0.08, 2.9, 0.08, ribM, 0, 1.45, zz), 1.06)); for (let y = 0.3; y < 2.8; y += 0.32) lg.add(box(0.06, 0.06, 0.62, ribM, 0, y, 0)); }
  // ice stacked both sides: sawdust packing with the block faces showing through
  const sawT = T.sawdust([3, 1]); const sawM = std({ map: sawT, roughness: 1 });
  const glints = [];
  const glintTex = T.radial('rgba(255,255,255,1)', 'rgba(200,230,255,0)');
  for (const s of [-1, 1]) {
    const z0 = s * 1.25, depth = 1.5; // stack runs from the aisle edge (|z| = 1.25) back toward the hull
    for (const [x0, x1] of [[-6.6, -1.4], [1.4, 6.6]]) {
      const pk = box(x1 - x0, 1.32, depth, sawM, (x0 + x1) / 2, 0.66, z0 + s * depth / 2); g.add(pk);
      for (let x = x0 + 0.42; x < x1 - 0.3; x += 0.72) for (let y = 0; y < 3; y++) {
        const b = box(0.6, 0.38, 0.44, iceMat(), x + (r() - 0.5) * 0.05, 0.24 + y * 0.43, z0 + s * 0.2, (r() - 0.5) * 0.04, false); g.add(b);
        if (r() < 0.35) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: glintTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); sp.position.set(x + (r() - 0.5) * 0.4, 0.3 + y * 0.43 + 0.1, z0 - s * 0.01); sp.userData.ph = r() * 6.3; g.add(sp); glints.push(sp); }
      }
      for (let x = x0 + 0.42; x < x1 - 0.3; x += 0.72) g.add(box(0.6, 0.05, 0.44, iceMat(), x, 1.33, z0 + s * 0.4, 0, false)); // tops peeking through the sawdust
      K.snowSlab(x1 - x0, depth, 0.08, (x0 + x1) / 2, 1.3, z0 + s * depth / 2, 0, g).material = sawM; // a soft sawdust top
    }
  }
  // sawdust spilled on the floor in the aisle, a shovel, a hanging lantern
  for (let i = 0; i < 6; i++) { const m = new THREE.Mesh(new THREE.CircleGeometry(0.12 + r() * 0.12, 10), new THREE.MeshStandardMaterial({ map: sawT, transparent: true, opacity: 0.7 })); m.rotation.x = -Math.PI / 2; m.position.set(-5 + r() * 10, 0.01, (r() - 0.5) * 1.6); g.add(m); }
  { const sh = new THREE.Group(); sh.position.set(3.2, 0, -1.0); sh.rotation.z = 0.25; g.add(sh); sh.add(cyl(0.025, 0.025, 1.2, ribM, 0, 0.75, 0, 6)); sh.add(ink(box(0.26, 0.32, 0.03, std({ color: 0x5a5e66, metalness: 0.6 }), 0, 0.14, 0), 1.08)); }
  for (const x of [-4.6, 4.2]) H.lamps.push(K.hangingLantern(g, x, DECK - 0.25, 0.3, { range: 6 }));
  const fill = new THREE.PointLight(0x9ab8e0, 6, 11, 1.0); fill.position.set(0, 1.6, 0); g.add(fill); // cool bounce from the shaft
  // the canvas-covered crate (what is inside is not shown); slides on movers.crate
  { const cr = new THREE.Group(); cr.position.set(0, 0, 0); g.add(cr); cr.rotation.order = 'YXZ';
    cr.add(ink(box(0.9, 0.7, 0.7, std({ map: T.wood([150, 110, 70], 4, false) }), 0, 0.35, 0), 1.03));
    const cloth = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.72, 0.8, 4, 3, 4), std({ map: T.sailcloth('#d9cfb2'), roughness: 1 })); { const p = cloth.geometry.attributes.position; for (let i = 0; i < p.count; i++) if (p.getY(i) < 0.3) { p.setX(i, p.getX(i) * 1.06); p.setZ(i, p.getZ(i) * 1.1); } cloth.geometry.computeVertexNormals(); } cloth.position.y = 0.42; cloth.castShadow = true; cr.add(K.inkOffset(cloth, 0.02));
    for (const xx of [-0.3, 0.3]) K.rope(cr, [xx, 0.79, -0.42], [xx, 0.79, 0.42], 0.02, undefined, -0.05);
    cr.visible = opts.crate ?? false; H.movers.crate = cr; H.open.crate = (v) => { cr.visible = v > 0.5; }; H.openRest.crate = opts.crate ? 1 : 0; }
  H.tick = (t) => { for (const sp of glints) { const k = Math.max(0, Math.sin(t * 3 + sp.userData.ph)); const s = 0.08 + k * 0.22; sp.scale.set(s, s, 1); sp.material.opacity = k; } };
  return H;
}

export const ICE_X = 0.55;
// Cutaway, read left → right: OUTSIDE (hot sun, sea) | outer hull planks | thick golden sawdust | inner planks | INSIDE the hold
// (cool blue): ice blocks on the plank floor, the hero block in front at ICE_X. Ribs and a deck beam make it read as a ship.
// The end frame is a close-up of the hero block face (same ice texture as the pond blocks in beat 1): camera at
// [ICE_X, ICE_Y, 1.45] looking at [ICE_X, ICE_Y, 0], fov 26.
export const ICE_Y = 0.42;
export function buildCutaway(scene, opts = {}) {
  const g = new THREE.Group(); scene.add(g);
  const H = K.setHandle(g, { center: [0, 1.0, 0], shadowSize: 6 });
  const HT = 2.1, D = 1.4;
  const paint = (w, h, fn) => { const c = document.createElement('canvas'); c.width = w; c.height = h; fn(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; };
  // OUTSIDE: hot sky with the sun and sea waves, on the left
  const outT = paint(512, 1024, (k, w, h) => { const gr = k.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#ff7a1a'); gr.addColorStop(0.6, '#ffc25a'); gr.addColorStop(0.61, '#1f6fa0'); gr.addColorStop(1, '#155a86'); k.fillStyle = gr; k.fillRect(0, 0, w, h);
    k.fillStyle = '#fff2a8'; k.beginPath(); k.arc(230, 300, 110, 0, 7); k.fill(); k.strokeStyle = '#1b1b1b'; k.lineWidth = 10; k.stroke();
    k.strokeStyle = '#ffe680'; k.lineWidth = 12; k.lineCap = 'round'; for (let i = 0; i < 10; i++) { const a = i / 10 * 6.283; k.beginPath(); k.moveTo(230 + Math.cos(a) * 140, 300 + Math.sin(a) * 140); k.lineTo(230 + Math.cos(a) * 185, 300 + Math.sin(a) * 185); k.stroke(); }
    k.strokeStyle = 'rgba(255,255,255,.7)'; k.lineWidth = 8; for (let y = 660; y < h; y += 60) { k.beginPath(); for (let x = 0; x <= w; x += 40) k.quadraticCurveTo(x + 10, y - 14, x + 20, y), k.quadraticCurveTo(x + 30, y + 14, x + 40, y); k.stroke(); } });
  const out = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 5.2), new THREE.MeshBasicMaterial({ map: outT, fog: false })); out.position.set(-2.55, 1.2, -0.75); g.add(out);
  // INSIDE: the dark cool hold wall behind the ice
  const inT = paint(512, 512, (k, w, h) => { k.fillStyle = '#1d2d48'; k.fillRect(0, 0, w, h); k.strokeStyle = 'rgba(0,0,0,.45)'; k.lineWidth = 6; for (let y = 0; y < h; y += 64) { k.beginPath(); k.moveTo(0, y); k.lineTo(w, y); k.stroke(); } });
  const inside = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 3.2), new THREE.MeshBasicMaterial({ map: inT, fog: false })); inside.position.set(0.95, 1.1, -0.72); g.add(inside);
  // the slice through the hull wall
  const plankM = std({ map: (() => { const t2 = T.wood([150, 100, 58], 9, false); t2.repeat.set(1, 2); return t2; })() });
  const sawM = new THREE.MeshStandardMaterial({ map: T.sawdust([0.6, 1.4], true), roughness: 1, emissive: 0x3a2400 });
  const lay = (x0, x1, m, y0 = 0, y1 = HT) => g.add(ink(box(x1 - x0, y1 - y0, D, m, (x0 + x1) / 2, (y0 + y1) / 2, 0), 1.006));
  lay(-1.66, -1.44, plankM); // outer hull planks
  lay(-1.44, -0.84, sawM); // thick golden sawdust (more than a block wide)
  lay(-0.84, -0.64, plankM); // inner planks
  const ribM = std({ map: T.wood([96, 64, 40], 3) });
  for (const x of [-1.72, -0.58]) g.add(ink(box(0.12, HT + 0.2, D + 0.06, ribM, x, HT / 2 + 0.05, 0), 1.01)); // frames either side of the wall
  g.add(ink(box(3.0, 0.18, D + 0.1, ribM, 0.2, HT + 0.18, 0), 1.01)); // the deck beam over the hold
  g.add(ink(box(1.9, 0.12, D, plankM, 0.36, 0.06, 0), 1.01)); // hold floor planks
  // the ice, cool blue-white (own lighting so the warm key never turns it lilac)
  const iceM = new THREE.MeshStandardMaterial({ map: T.ice(3), color: 0xeaf6ff, emissive: 0x3a6c98, emissiveIntensity: 0.3, /* matched to the pond block of frame 0 (loop) */ roughness: 0.2 });
  const iw = 0.74, ih = 0.56;
  g.add(ink(box(iw, ih, 0.6, iceM, ICE_X, 0.12 + ih / 2, 0.35), 1.01)); // the hero block, in front
  for (const [x, y, z] of [[ICE_X - 0.45, 0.12 + ih / 2, -0.3], [ICE_X + 0.45, 0.12 + ih / 2, -0.3], [ICE_X, 0.12 + ih * 1.5 + 0.02, -0.3]]) g.add(ink(box(iw, ih, 0.6, iceM, x, y, z), 1.01));
  for (const [x, z, r] of [[ICE_X - 0.5, 0.45, 0.22], [ICE_X + 0.48, 0.5, 0.2], [-0.4, 0.3, 0.25]]) { const pl = new THREE.Mesh(new THREE.SphereGeometry(r, 14, 8, 0, 6.3, 0, 1.5), sawM); pl.scale.y = 0.5; pl.position.set(x, 0.12, z); g.add(pl); } // sawdust packed round the blocks
  const cool = new THREE.PointLight(0x9cc8ff, 2.5, 4, 1.2); cool.position.set(ICE_X + 0.2, 1.4, 1.2); g.add(cool);
  g.add(ink(box(3.8, 0.16, D + 0.4, std({ color: 0x1b2438 }), -0.4, -0.08, 0), 1.01)); // plinth
  H.iceAt = [ICE_X, 0.12 + ih / 2, 0.65];
  return H;
}
