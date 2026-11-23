// Set-building kit: shared parts every set is built from (primitives, windows, props, lamps,
// skyline, motes, spot rig). The courtyard (world.js) and every new set call these.
// All randomness is seeded, so every frame of every render matches.
import * as THREE from '/node_modules/three/build/three.module.js';
import * as T from './textures.js';

// ---------------- primitives ----------------
export const std = (o) => new THREE.MeshStandardMaterial({ roughness: 0.85, metalness: 0, ...o });
export function box(w, h, d, mat, x, y, z, ry = 0, cast = true) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z); m.rotation.y = ry; m.castShadow = cast; m.receiveShadow = true; return m;
}
export function cyl(rt, rb, h, mat, x, y, z, seg = 16) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat);
  m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; return m;
}
// cartoon ink outline: back-face hull
export function ink(mesh, s = 1.04) {
  const o = new THREE.Mesh(mesh.geometry, new THREE.MeshBasicMaterial({ color: 0x14100c, side: THREE.BackSide }));
  o.scale.setScalar(s); mesh.add(o); return mesh;
}
// seeded generator (same sequence as the original courtyard code)
export function rng(seed) { let v = seed; return () => (v = (v * 9301 + 49297) % 233280) / 233280; }
// a flat floor / ground plane
export function ground(parent, w, d, mat, y = 0) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), mat);
  m.rotation.x = -Math.PI / 2; m.position.y = y; m.receiveShadow = true; parent.add(m); return m;
}

// ---------------- plants ----------------
// leafy planter: stems, layered leaves, five-petal flowers, trailing vines (seeded)
export const LEAF_G = new THREE.SphereGeometry(1, 8, 6), PETAL_G = new THREE.SphereGeometry(1, 6, 5);
export const LEAF_M = [0x2f6b2f, 0x3d8a3a, 0x25562a, 0x4f9a45, 0x5aa04a].map((c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.8 }));
const STEM_M = new THREE.MeshStandardMaterial({ color: 0x35602b });
const SOIL_M = new THREE.MeshStandardMaterial({ color: 0x3a2618, roughness: 1 });
const CENTER_M = new THREE.MeshStandardMaterial({ color: 0xf2c94c });
export function planter(parent, cx, cy, cz, w, d, seed, flowerCols) {
  let v = seed * 9301 + 49297; const r = () => (v = (v * 9301 + 49297) % 233280) / 233280;
  const soil = new THREE.Mesh(new THREE.BoxGeometry(w * 0.96, 0.02, d * 0.9), SOIL_M); soil.position.set(cx, cy, cz); parent.add(soil);
  const leaves = Math.round(w * 16);
  for (let i = 0; i < leaves; i++) {
    const lf = new THREE.Mesh(LEAF_G, LEAF_M[Math.floor(r() * LEAF_M.length)]);
    const s = 0.05 + r() * 0.05; lf.scale.set(s * 0.55, s * 1.4, s * 0.22);
    lf.position.set(cx + (r() - 0.5) * w * 0.95, cy + 0.04 + r() * 0.2, cz + (r() - 0.5) * d * 0.8);
    lf.rotation.set((r() - 0.5) * 1.6, r() * 6.28, (r() - 0.5) * 1.8); parent.add(lf);
  }
  const flowers = Math.round(w * 6);
  for (let i = 0; i < flowers; i++) {
    const fx = cx + (r() - 0.5) * w * 0.85, fz = cz + (r() - 0.5) * d * 0.6, h = 0.16 + r() * 0.16;
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.008, h, 4), STEM_M); stem.position.set(fx, cy + h / 2, fz); parent.add(stem);
    const fl = new THREE.Group(); fl.position.set(fx, cy + h, fz); fl.rotation.set(-0.5 + (r() - 0.5) * 0.6, r() * 6.28, (r() - 0.5) * 0.5); parent.add(fl);
    const pm = new THREE.MeshStandardMaterial({ color: flowerCols[i % flowerCols.length], roughness: 0.6 });
    for (let p = 0; p < 5; p++) { const pe = new THREE.Mesh(PETAL_G, pm); const a = p / 5 * Math.PI * 2; pe.scale.set(0.028, 0.008, 0.016); pe.position.set(Math.cos(a) * 0.026, 0, Math.sin(a) * 0.026); pe.rotation.y = -a; fl.add(pe); }
    const ce = new THREE.Mesh(PETAL_G, CENTER_M); ce.scale.set(0.013, 0.01, 0.013); ce.position.y = 0.004; fl.add(ce);
  }
  for (let t = 0; t < 2; t++) { // trailing vines over the front edge
    const vx = cx + (r() - 0.5) * w * 0.8; let y = cy, z = cz + d * 0.5;
    for (let k = 0; k < 6; k++) { const lf = new THREE.Mesh(LEAF_G, LEAF_M[(k + t) % LEAF_M.length]); lf.scale.set(0.03, 0.05, 0.012); lf.position.set(vx + Math.sin(k * 1.7 + t) * 0.04, y, z + 0.02); lf.rotation.z = k % 2 ? 0.6 : -0.6; parent.add(lf); y -= 0.07; z += 0.008; }
  }
}
// clay flower pot with two planter layers
export function flowerPot(parent, x, z, c) {
  parent.add(ink(cyl(0.2, 0.15, 0.32, std({ color: 0xb5651d }), x, 0.16, z)));
  parent.add(box(0.44, 0.04, 0.44, std({ color: 0x9c5418 }), x, 0.31, z)); // pot rim
  planter(parent, x, 0.33, z, 0.4, 0.4, Math.abs(Math.round(x * 17 + z)) + 11, [c, 0xffffff]);
  planter(parent, x, 0.45, z, 0.3, 0.3, Math.abs(Math.round(x * 5 + z * 3)) + 29, [c]);
}
// ivy patch on a wall (alpha card)
let ivyTex = null;
export function ivy(parent, x, z, ry, s2) {
  ivyTex = ivyTex || T.ivy();
  const m = new THREE.Mesh(new THREE.PlaneGeometry(1.4 * s2, 2.1 * s2), new THREE.MeshStandardMaterial({ map: ivyTex, transparent: true, alphaTest: 0.3, roughness: 0.9, side: THREE.DoubleSide }));
  m.position.set(x, 1.05 * s2, z); m.rotation.y = ry; parent.add(m); return m;
}

// ---------------- windows ----------------
// Returns addWin(x, y, z, ry, warm, open) bound to one parent group.
// warm: lit pane; open: see-through glass. Closed unlit windows get a seeded flower box.
export function windowKit(g, opts = {}) {
  const frameMat = std({ color: opts.frame ?? 0xe9dfc8 }); const pane = std({ color: 0x223040, roughness: 0.2, metalness: 0.3 });
  const warmPane = new THREE.MeshBasicMaterial({ color: 0xffc66b });
  const glassMat = new THREE.MeshStandardMaterial({ color: 0xdfefff, transparent: true, opacity: 0.16, roughness: 0.05, metalness: 0.2, depthWrite: false });
  const flowerBoxes = opts.flowerBoxes ?? true;
  return (x, y, z, ry, warm, open = false) => {
    const w = new THREE.Group(); w.position.set(x, y, z); w.rotation.y = ry; w.userData.open = open;
    if (open) { // see-through window: frame bars + clear glass
      w.add(box(1.25, 0.125, 0.12, frameMat, 0, 0.8125, 0)); w.add(box(1.25, 0.125, 0.12, frameMat, 0, -0.8125, 0));
      w.add(box(0.125, 1.75, 0.12, frameMat, -0.5625, 0, 0)); w.add(box(0.125, 1.75, 0.12, frameMat, 0.5625, 0, 0));
      const gl = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 1.5), glassMat); gl.position.z = 0.02; w.add(gl);
    } else {
      w.add(box(1.25, 1.75, 0.12, frameMat, 0, 0, 0));
      w.add(box(1.0, 1.5, 0.14, warm ? warmPane : pane, 0, 0, 0.01, 0, false));
    }
    w.add(box(0.06, 1.5, 0.18, frameMat, 0, 0, 0.02)); w.add(box(1.0, 0.06, 0.18, frameMat, 0, 0.2, 0.02));
    if (opts.panes) { for (const px of [-0.25, 0.25]) w.add(box(0.03, 1.5, 0.16, frameMat, px, 0, 0.02, 0, false)); for (const py of [-0.3, 0.6]) w.add(box(1.0, 0.03, 0.16, frameMat, 0, py, 0.02, 0, false)); }
    w.add(box(1.45, 0.12, 0.3, frameMat, 0, -0.92, 0.08));
    if (flowerBoxes && warm === false && ((x * 7 + z) | 0) % 3 === 0 && !(opts.snowSill)) { // flower box
      const boxWood = std({ map: T.wood([120, 70, 38], 3, false) });
      w.add(ink(box(1.12, 0.22, 0.3, boxWood, 0, -0.76, 0.22), 1.03));
      for (const bx of [-0.42, 0.42]) w.add(box(0.05, 0.24, 0.32, std({ color: 0x2b2f33, metalness: 0.5 }), bx, -0.8, 0.22)); // iron brackets
      const cols = [[0xe63946, 0xffffff], [0xffd166, 0xf4a1c1], [0x9b5de5, 0xffd166], [0xf4a1c1, 0xe63946]][Math.abs(Math.round(x * 3 + z)) % 4];
      planter(w, 0, -0.65, 0.22, 1.05, 0.26, Math.abs(Math.round(x * 13 + z * 7)) + 3, cols);
    }
    if (opts.snowSill) w.add(snowSlab(1.4, 0.3, 0.07, 0, -0.84, 0.1)); // winter: snow on the sill
    w.userData.win = true;
    g.add(w); return w;
  };
}
// shutters + curtains on every window made by windowKit under g (in build order)
export function dressWindows(g, opts = {}) {
  const shutterMat = std({ map: T.wood([60, 110, 80], 6), color: opts.shutter ?? 0xbfe0c8 });
  const slat = opts.slat ?? 0x2f5a43;
  const curtainCols = opts.curtains ?? [0xb23a48, 0xe9d8a6, 0x5d7ea8, 0xd98c5f, 0x8a6aa0];
  const wins = []; g.traverse((o) => { if (o.userData.win) wins.push(o); });
  wins.forEach((w, i) => {
    for (const sx of [-1, 1]) { const sh = box(0.5, 1.7, 0.06, shutterMat, sx * 0.9, 0, 0.05); sh.rotation.y = sx * 0.25; w.add(ink(sh, 1.02)); for (let k2 = 0; k2 < 6; k2++) w.add(box(0.44, 0.03, 0.08, std({ color: slat }), sx * 0.9, -0.65 + k2 * 0.26, 0.08, sx * 0.25)); }
    const cc = std({ color: curtainCols[i % curtainCols.length], side: THREE.DoubleSide });
    const cw = w.userData.open ? 0.12 : 0.36; // a see-through window has its curtains pulled back
    for (const sx of [-1, 1]) { const cu = new THREE.Mesh(new THREE.PlaneGeometry(cw, 1.45), cc); cu.position.set(sx * (0.5 - cw / 2), 0, -0.03); w.add(cu); }
  });
  return wins;
}

// ---------------- town dressing ----------------
// skyline beyond the walls: ring of houses with pyramid roofs + chimneys. r = seeded generator (shared on purpose)
export function skyline(parent, r, o = {}) {
  const roofMat = std({ color: o.roof ?? 0x7a3b2e }); const chim = std({ color: o.chimney ?? 0x8c5a44 });
  const sky = new THREE.Group(); parent.add(sky);
  const n = o.n ?? 26, cx = o.cx ?? 0, cz = o.cz ?? 1.5, R0 = o.r ?? 17;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2; const R = R0 + r() * 4;
    const x = cx + Math.cos(a) * R, z = cz + Math.sin(a) * R * 0.9;
    const h = 7 + r() * 5, w = 4 + r() * 3;
    const b = box(w, h, 4, std({ color: new THREE.Color().setHSL((o.hue ?? 0.07) + r() * 0.05, o.sat ?? 0.25, (o.light ?? 0.45) + r() * 0.15) }), x, h / 2, z, -a + Math.PI / 2, false);
    sky.add(b);
    const roof = new THREE.Mesh(new THREE.ConeGeometry(w * 0.75, 2.4, 4), roofMat);
    roof.position.set(x, h + 1.2, z); roof.rotation.y = -a + Math.PI / 4; sky.add(roof);
    if (r() > 0.4) sky.add(box(0.5, 1.6, 0.5, chim, x + 1, h + 1.5, z, 0, false));
  }
  return sky;
}
// street lamp: head 'gas' (1904 glass cylinder) or 'oil' (lantern box with a flame). Returns a lamp handle {glow, pl, glass}.
let glowTex = null;
export function lampPost(parent, x, z, o = {}) {
  const lampMat = o.mat || std({ color: 0x23352c, roughness: 0.5, metalness: 0.4 });
  const glass = o.glass || new THREE.MeshBasicMaterial({ color: 0xffe2a0 });
  glowTex = glowTex || T.radial('rgba(255,210,140,.9)', 'rgba(255,170,80,0)');
  const L = new THREE.Group(); L.position.set(x, 0, z); parent.add(L);
  L.add(ink(cyl(0.07, 0.11, 3.4, lampMat, 0, 1.7, 0)));
  L.add(cyl(0.22, 0.26, 0.25, lampMat, 0, 0.12, 0));
  if ((o.head || 'gas') === 'gas') {
    L.add(cyl(0.26, 0.16, 0.5, glass, 0, 3.6, 0, 6));
    L.add(cyl(0.05, 0.32, 0.2, lampMat, 0, 3.95, 0, 6));
  } else { // oil lantern: square glass box, iron frame, pointed cap, small flame
    L.add(box(0.3, 0.42, 0.3, glass, 0, 3.6, 0, 0, false));
    for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) L.add(box(0.035, 0.46, 0.035, lampMat, sx * 0.15, 3.6, sz * 0.15));
    L.add(box(0.36, 0.05, 0.36, lampMat, 0, 3.38, 0));
    const cap = new THREE.Mesh(new THREE.ConeGeometry(0.27, 0.22, 4), lampMat); cap.position.set(0, 3.93, 0); cap.rotation.y = Math.PI / 4; L.add(cap);
    const fl = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffb347 })); fl.scale.y = 1.7; fl.position.set(0, 3.58, 0); L.add(fl);
  }
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  glow.scale.set(1.8, 1.8, 1); glow.position.set(0, 3.6, 0); L.add(glow);
  const pl = new THREE.PointLight(0xffb060, 6, 9, 1.6); pl.position.set(0, 3.5, 0); L.add(pl);
  return { glow, pl, glass, group: L };
}
export function drainpipe(parent, x, z, zinc, iron, h = 7.0) {
  parent.add(cyl(0.07, 0.07, h, zinc, x, h / 2, z, 10));
  parent.add(cyl(0.1, 0.07, 0.25, zinc, x, 0.12, z, 10));
  for (let y = 1; y < h; y += 1.4) parent.add(box(0.2, 0.05, 0.05, iron, x, y, z));
}
// handbill poster (kinds from textures.poster)
export function poster(parent, kind, x, y, z, ry, s = 1) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(0.62 * s, 0.87 * s), new THREE.MeshStandardMaterial({ map: T.poster(kind), transparent: true, roughness: 1 }));
  m.position.set(x, y, z); m.rotation.y = ry; m.rotation.z = (x % 2) * 0.02; parent.add(m); return m;
}
// painted board sign
export function signBoard(parent, text, x, y, z, ry = 0, w = 1.2, h = 0.34, bg = '#3a2414', fg = '#f4e6c0') {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), std({ map: T.sign2(text, bg, fg) }));
  m.position.set(x, y, z); m.rotation.y = ry; parent.add(m); return m;
}

// ---------------- props ----------------
export function barrel(parent, x, z, mat, hoop) {
  mat = mat || std({ map: T.wood([140, 85, 45], 8) }); hoop = hoop || std({ color: 0x333333, metalness: 0.6, roughness: 0.4 });
  parent.add(ink(cyl(0.38, 0.38, 0.95, mat, x, 0.475, z))); for (const y of [0.15, 0.8]) parent.add(cyl(0.395, 0.395, 0.06, hoop, x, y, z));
}
export function hayBale(parent, x, z, ry, y = 0.4, mat) { parent.add(ink(box(1.2, 0.8, 0.75, mat || std({ map: T.hay() }), x, y, z, ry), 1.03)); }
export function crate(parent, x, z, s, y = s / 2, ry = 0.2, mat) { parent.add(ink(box(s, s, s, mat || std({ map: T.wood([150, 110, 70], 4, false) }), x, y, z, ry), 1.03)); }
export function trough(parent, x, z, ry = Math.PI / 2) {
  parent.add(ink(box(2.0, 0.6, 0.6, std({ map: T.wood([100, 70, 45], 4, false) }), x, 0.3, z, ry)));
  const water = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 1.9), std({ color: 0x5c8aa8, roughness: 0.1, metalness: 0.3 })); water.rotation.x = -Math.PI / 2; water.position.set(x, 0.58, z); parent.add(water);
}
export function cartWheel(parent, x, y, z, ry = Math.PI / 2, tilt = 0.15) {
  const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.07, 8, 24), std({ color: 0x6b4226 }));
  wheel.position.set(x, y, z); wheel.rotation.y = ry; wheel.rotation.x = tilt; wheel.castShadow = true; parent.add(wheel);
  for (let i = 0; i < 6; i++) { const sp = box(0.05, 1.4, 0.05, std({ color: 0x6b4226 }), 0, 0, 0); sp.rotation.z = i * Math.PI / 6; wheel.add(sp); sp.position.set(0, 0, 0); }
}
export function pump(parent, x, z, iron) {
  const p = new THREE.Group(); p.position.set(x, 0, z); parent.add(p);
  p.add(ink(cyl(0.13, 0.17, 1.3, iron, 0, 0.65, 0)));
  p.add(ink(cyl(0.16, 0.13, 0.18, iron, 0, 1.35, 0)));
  const spout = cyl(0.04, 0.05, 0.4, iron, 0.18, 1.05, 0); spout.rotation.z = Math.PI / 2.3; p.add(spout);
  const handle = box(0.6, 0.05, 0.05, iron, -0.28, 1.45, 0); handle.rotation.z = 0.4; p.add(handle);
  return p;
}
export function wheelbarrow(parent, x, z, ry, woodL, woodD, iron) {
  const wb = new THREE.Group(); wb.position.set(x, 0, z); wb.rotation.y = ry; parent.add(wb);
  wb.add(ink(box(0.9, 0.3, 0.6, woodL, 0, 0.45, 0))); const wwh = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.04, 6, 16), iron); wwh.position.set(0.55, 0.2, 0); wb.add(wwh);
  for (const z2 of [-0.25, 0.25]) { const hd = box(0.9, 0.05, 0.05, woodD, -0.55, 0.45, z2); hd.rotation.z = 0.15; wb.add(hd); wb.add(box(0.05, 0.3, 0.05, woodD, -0.25, 0.15, z2)); }
  return wb;
}
export function bucket(parent, x, z, zinc) { parent.add(ink(cyl(0.17, 0.13, 0.32, zinc, x, 0.16, z))); }
export function broom(parent, x, z, rz, woodL) {
  const b = new THREE.Group(); b.position.set(x, 0, z); b.rotation.z = rz; parent.add(b);
  b.add(cyl(0.02, 0.02, 1.5, woodL, 0, 0.9, 0, 6)); b.add(ink(cyl(0.05, 0.16, 0.4, std({ map: T.hay() }), 0, 0.2, 0, 8))); return b;
}
export function pitchfork(parent, x, z, rz, woodL, iron) {
  const f = new THREE.Group(); f.position.set(x, 0, z); f.rotation.z = rz; parent.add(f);
  f.add(cyl(0.02, 0.02, 1.6, woodL, 0, 0.95, 0, 6)); for (const x2 of [-0.06, 0, 0.06]) f.add(cyl(0.008, 0.008, 0.25, iron, x2, 0.1, 0, 4)); return f;
}
export function appleCrate(parent, x, z) {
  const ac = new THREE.Group(); ac.position.set(x, 0, z); parent.add(ac);
  ac.add(ink(box(0.7, 0.35, 0.5, std({ map: T.wood([160, 120, 75], 4, false) }), 0, 0.18, 0)));
  for (let i = 0; i < 12; i++) { const ap = new THREE.Mesh(new THREE.SphereGeometry(0.065, 10, 8), std({ color: i % 4 ? 0xc0392b : 0x7cb342 })); ap.position.set(-0.25 + (i % 4) * 0.165, 0.38 + Math.floor(i / 8) * 0.06, -0.15 + Math.floor(i / 4) % 2 * 0.25); ac.add(ap); }
  return ac;
}
export function bench(parent, x, z, ry, woodL, iron) {
  const b = new THREE.Group(); b.position.set(x, 0, z); b.rotation.y = ry; parent.add(b);
  b.add(ink(box(2.0, 0.08, 0.45, woodL, 0, 0.48, 0), 1.03)); b.add(box(2.0, 0.4, 0.06, woodL, 0, 0.8, -0.2));
  for (const x2 of [-0.85, 0.85]) b.add(box(0.08, 0.48, 0.4, iron, x2, 0.24, 0)); return b;
}
export function wateringCan(parent, x, z) {
  const can = new THREE.Group(); can.position.set(x, 0, z); parent.add(can);
  can.add(ink(cyl(0.14, 0.16, 0.32, std({ color: 0x4a7a5a, metalness: 0.4 }), 0, 0.16, 0))); const sp2 = cyl(0.02, 0.03, 0.4, std({ color: 0x4a7a5a }), 0.2, 0.3, 0); sp2.rotation.z = -0.9; can.add(sp2);
  return can;
}
// clothes line between two points with hanging cloths [u, colour, w, h]
export function laundryLine(parent, lineA, lineB, cloths, sag = 0.3) {
  const lm = lineA.clone().lerp(lineB, 0.5); lm.y -= sag;
  const curve = new THREE.QuadraticBezierCurve3(lineA, lm, lineB);
  parent.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 20, 0.01, 4), std({ color: 0xdddddd })));
  cloths.forEach(([u, cl, w2, h2]) => {
    const p0 = curve.getPoint(u);
    const c = new THREE.Mesh(new THREE.PlaneGeometry(w2, h2), std({ color: cl, side: THREE.DoubleSide })); c.position.set(p0.x, p0.y - h2 / 2, p0.z); c.rotation.y = Math.atan2(lineB.x - lineA.x, lineB.z - lineA.z) + Math.PI / 2; parent.add(c);
  });
}
export function handCart(parent, x, z, ry, woodL, woodD, load = true) {
  const cart = new THREE.Group(); cart.position.set(x, 0, z); cart.rotation.y = ry; parent.add(cart);
  cart.add(ink(box(1.6, 0.4, 1.0, woodL, 0, 0.75, 0))); cart.add(box(1.7, 0.06, 1.1, woodD, 0, 0.55, 0));
  for (const z2 of [-0.55, 0.55]) { const wh2 = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.05, 6, 20), woodD); wh2.position.set(0, 0.45, z2); cart.add(wh2); for (let i = 0; i < 4; i++) { const sp3 = box(0.04, 0.9, 0.04, woodD, 0, 0.45, z2); sp3.rotation.z = i * Math.PI / 4; cart.add(sp3); } }
  for (const z2 of [-0.3, 0.3]) cart.add(box(1.4, 0.05, 0.05, woodD, -1.4, 0.7, z2));
  if (load) cart.add(ink(box(0.8, 0.5, 0.6, std({ map: T.hay() }), 0.2, 1.15, 0)));
  return cart;
}
// scattered straw patches on the ground
export function strawPatches(parent, x0, z0, n = 9, w = 2.8, d = 1.6) {
  const strawM = new THREE.MeshStandardMaterial({ map: T.hay(), transparent: true, opacity: 0.85 });
  for (let i = 0; i < n; i++) { const st = new THREE.Mesh(new THREE.CircleGeometry(0.25 + (i % 3) * 0.12, 7), strawM); st.rotation.x = -Math.PI / 2; st.rotation.z = i; st.position.set(x0 + (i * 0.47) % w, 0.008, z0 + (i * 0.73) % d); parent.add(st); }
}
// static glossy puddle
export function puddle(parent, x, z, r = 0.7, sx = 1.4, sz = 0.8, color = 0x51677a) {
  const p = new THREE.Mesh(new THREE.CircleGeometry(r, 24), std({ color, roughness: 0.05, metalness: 0.6 }));
  p.rotation.x = -Math.PI / 2; p.scale.set(sx, sz, 1); p.position.set(x, 0.01, z); parent.add(p); return p;
}

// ---------------- light rigs ----------------
// theatre spotlight + additive beam cone (handles for the light presets)
export function spotRig(parent, o = {}) {
  const spot = new THREE.SpotLight(o.color ?? 0xfff1d6, 0, o.dist ?? 14, o.angle ?? 0.42, o.pen ?? 0.45, o.decay ?? 1.2);
  spot.position.set(...(o.pos || [0.6, 7, 1.2])); spot.target.position.set(...(o.target || [0.4, 0, -2])); spot.castShadow = true;
  spot.shadow.mapSize.set(1024, 1024);
  parent.add(spot, spot.target);
  const beamTex = T.radial('rgba(255,240,200,.35)', 'rgba(255,240,200,0)');
  const beam = new THREE.Mesh(new THREE.ConeGeometry(o.beamR ?? 2.6, o.beamH ?? 7, 32, 1, true), new THREE.MeshBasicMaterial({ map: beamTex, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, color: 0xfff0d0 }));
  beam.position.set(...(o.beamPos || [0.5, 3.5, -1.6])); if (o.beamRot) beam.rotation.set(...o.beamRot); parent.add(beam);
  return { spot, beam };
}
// floating dust motes (sunbeams). r = seeded generator.
export function dustMotes(parent, r, o = {}) {
  const n = o.n ?? 400, w = o.w ?? 16, h = o.h ?? 5, z0 = o.z0 ?? -7, d = o.d ?? 14, x0 = o.x0 ?? 0;
  const geo = new THREE.BufferGeometry(); const mp = [];
  for (let i = 0; i < n; i++) mp.push(x0 + (r() - 0.5) * w, r() * h, z0 + r() * d);
  geo.setAttribute('position', new THREE.Float32BufferAttribute(mp, 3));
  const mat = new THREE.PointsMaterial({ color: o.color ?? 0xfff0c8, size: 0.03, transparent: true, opacity: 0.6, depthWrite: false });
  if (o.soft) { // S02: round soft motes that fade out near the lens (a mote right at the camera drew as a big flat grey square)
    const cv = document.createElement('canvas'); cv.width = cv.height = 64; const k = cv.getContext('2d');
    const gr = k.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.5, 'rgba(255,255,255,.6)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    k.fillStyle = gr; k.fillRect(0, 0, 64, 64); mat.map = new THREE.CanvasTexture(cv);
    mat.onBeforeCompile = (sh) => {
      sh.vertexShader = 'varying float vNear;\n' + sh.vertexShader.replace('#include <fog_vertex>', '#include <fog_vertex>\n\tvNear = smoothstep(0.9, 1.8, -mvPosition.z);');
      sh.fragmentShader = 'varying float vNear;\n' + sh.fragmentShader.replace('#include <tonemapping_fragment>', 'gl_FragColor.a *= vNear;\n\t#include <tonemapping_fragment>');
    };
  }
  const motes = new THREE.Points(geo, mat);
  parent.add(motes); return motes;
}

// ---------------- set handle ----------------
// Every set builder returns one of these; stage.js only talks to sets through it.
// group: THREE.Group (shown only while a shot uses this set); lamps: [{glow, pl}]; spot/beam/motes: optional;
// doors(v): optional opener; center: shadow-camera centre; shade(x, z): extra darkening for a person at x,z.
export function setHandle(group, extra = {}) {
  // open: { name: (v) => {} } openers driven by beat `open: { name: [[at, v]] }` keys (rest value openRest[name] ?? 0)
  // tick(t, L, camera): per-frame animation of the set (water, gulls, smoke); called after movers are placed
  return { group, lamps: [], spot: null, beam: null, motes: null, doors: () => {}, board: null, screen: null, center: [0, 0, 0], shadowSize: 15, spotCenter: null, shade: null, movers: {}, open: {}, openRest: {}, tick: null, ...extra };
}

// =====================================================================
// S02 additions: offset ink, ropes, snow, gabled houses, lanterns
// =====================================================================
// ink outline that keeps the same thickness on long shapes: back faces pushed out along smooth normals by d metres
export function inkOffset(mesh, d = 0.05, color = 0x14100c) {
  let g = mesh.geometry.clone(); g.deleteAttribute('uv'); if (g.index) g = g.toNonIndexed();
  // merge-by-position normals so hard edges get a closed shell
  const pos = g.attributes.position, n = pos.count, key = (i) => `${pos.getX(i).toFixed(3)},${pos.getY(i).toFixed(3)},${pos.getZ(i).toFixed(3)}`;
  g.computeVertexNormals(); const nor = g.attributes.normal, acc = new Map();
  for (let i = 0; i < n; i++) { const k = key(i); const a = acc.get(k) || [0, 0, 0]; a[0] += nor.getX(i); a[1] += nor.getY(i); a[2] += nor.getZ(i); acc.set(k, a); }
  for (let i = 0; i < n; i++) { const a = acc.get(key(i)); const l = Math.hypot(...a) || 1; pos.setXYZ(i, pos.getX(i) + a[0] / l * d, pos.getY(i) + a[1] / l * d, pos.getZ(i) + a[2] / l * d); }
  const o = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color, side: THREE.BackSide })); mesh.add(o); return mesh;
}
// straight rope / spar between two points (cylinder), optional sag (tube)
const ROPE_M = new THREE.MeshStandardMaterial({ color: 0x2a2018, roughness: 0.9 });
export function rope(parent, a, b, r = 0.025, mat = ROPE_M, sag = 0) {
  a = new THREE.Vector3(...a); b = new THREE.Vector3(...b);
  let m;
  if (sag) { const mid = a.clone().lerp(b, 0.5); mid.y -= sag; m = new THREE.Mesh(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(a, mid, b), 12, r, 5), mat); }
  else { const len = a.distanceTo(b); m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 6), mat); m.position.copy(a).lerp(b, 0.5); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize()); }
  m.castShadow = true; parent.add(m); return m;
}
// coil of rope lying flat
export function ropeCoil(parent, x, y, z, r = 0.32, turns = 4, mat) {
  mat = mat || std({ color: 0xb08a55, roughness: 1 });
  const g = new THREE.Group(); g.position.set(x, y, z); parent.add(g);
  for (let i = 0; i < turns; i++) { const t = new THREE.Mesh(new THREE.TorusGeometry(r * (1 - i * 0.16), 0.045, 6, 22), mat); t.rotation.x = -Math.PI / 2; t.position.y = 0.045 + i * 0.07; t.castShadow = true; g.add(i === 0 ? ink(t, 1.06) : t); }
  return g;
}
// snow material (shared)
let SNOW_M = null;
export const snowMat = () => (SNOW_M = SNOW_M || std({ map: T.snow([2, 2]), roughness: 1, color: 0xffffff }));
// a soft slab of snow (rounded edges, one smooth shape) w × d, thickness h, sitting at (x, y, z) (y = bottom)
export function snowSlab(w, d, h, x, y, z, ry = 0, parent = null) {
  const r = Math.min(h * 0.9, w * 0.25, d * 0.25);
  const s = new THREE.Shape(); const hw = w / 2, hd = d / 2;
  s.moveTo(-hw + r, -hd); s.lineTo(hw - r, -hd); s.quadraticCurveTo(hw, -hd, hw, -hd + r); s.lineTo(hw, hd - r); s.quadraticCurveTo(hw, hd, hw - r, hd); s.lineTo(-hw + r, hd); s.quadraticCurveTo(-hw, hd, -hw, hd - r); s.lineTo(-hw, -hd + r); s.quadraticCurveTo(-hw, -hd, -hw + r, -hd);
  const bev = Math.min(h * 0.6, r * 0.9);
  const geo = new THREE.ExtrudeGeometry(s, { depth: Math.max(0.001, h - bev), bevelEnabled: true, bevelThickness: bev, bevelSize: bev * 0.6, bevelSegments: 3, curveSegments: 6 });
  geo.rotateX(-Math.PI / 2); geo.translate(0, bev, 0);
  const m = new THREE.Mesh(geo, snowMat()); m.position.set(x, y, z); m.rotation.y = ry; m.castShadow = true; m.receiveShadow = true;
  if (parent) parent.add(m); return m;
}
// smooth snow pile / bank: a flattened dome (lathe), radius r, height h, stretched sx along x
export function snowPile(parent, x, z, r = 0.8, h = 0.45, sx = 1, ry = 0, y = 0) {
  const pts = []; for (let i = 0; i <= 12; i++) { const a = i / 12 * Math.PI / 2; pts.push(new THREE.Vector2(Math.cos(a) * r * (1 + 0.08 * Math.sin(a * 3)), Math.sin(a) ** 0.8 * h)); }
  pts.unshift(new THREE.Vector2(r * 1.04, -0.02));
  const m = new THREE.Mesh(new THREE.LatheGeometry(pts, 24), snowMat());
  m.scale.set(sx, 1, 1); m.position.set(x, y, z); m.rotation.y = ry; m.castShadow = true; m.receiveShadow = true;
  parent.add(inkOffset(m, 0.025)); return m;
}
// icicles along an edge from a to b (cones), seeded
export function icicles(parent, a, b, n, r) {
  const m = std({ color: 0xd8eeff, roughness: 0.15, metalness: 0.1, emissive: 0x1a3046 });
  for (let i = 0; i < n; i++) { const u = (i + 0.5) / n; const L = 0.12 + r() * 0.35; const c = new THREE.Mesh(new THREE.ConeGeometry(0.035 + r() * 0.02, L, 6), m); c.rotation.x = Math.PI; c.position.set(lerpN(a[0], b[0], u), lerpN(a[1], b[1], u) - L / 2, lerpN(a[2], b[2], u)); parent.add(c); }
}
const lerpN = (a, b, t) => a + (b - a) * t;

// gabled building: walls (texture repeated per metre), roof pitches, gable ends. Front (gable end) faces +z in local space.
// o: { w, d, h (eaves), roofH, wall (material maker (repX, repY) => mat), roof (mat), snow (bool), trim (colour) }
export function gableHouse(parent, x, z, ry, o) {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; parent.add(g);
  const { w, d, h, roofH } = o;
  g.add(box(w, h, d, o.wall(w / 4, h / 4), 0, h / 2, 0));
  // gable triangles (front and back) as one prism with the same wall texture
  const tri = new THREE.Shape(); tri.moveTo(-w / 2, 0); tri.lineTo(w / 2, 0); tri.lineTo(0, roofH); tri.closePath();
  const pg = new THREE.ExtrudeGeometry(tri, { depth: d, bevelEnabled: false }); pg.translate(0, 0, -d / 2);
  // planar UVs in metres for the gable
  const uv = pg.attributes.uv, ps = pg.attributes.position; for (let i = 0; i < uv.count; i++) uv.setXY(i, ps.getX(i) / 4, ps.getY(i) / 4);
  const gm = new THREE.Mesh(pg, o.wall(1, 1)); gm.position.y = h; gm.castShadow = true; gm.receiveShadow = true; g.add(gm);
  // roof pitches
  const slope = Math.hypot(w / 2, roofH), ang = Math.atan2(roofH, w / 2), ov = 0.35;
  for (const s of [-1, 1]) {
    const p = box(slope + ov, 0.16, d + ov * 2, o.roof, s * (w / 4 + ov * Math.cos(ang) / 2 - 0.02), h + roofH / 2 + 0.06 - ov * Math.sin(ang) / 2, 0); p.rotation.z = -s * ang; g.add(ink(p, 1.01));
    if (o.snow) { const sn = snowSlab(slope * 0.98, d + ov * 1.6, 0.14, 0, 0, 0); sn.position.set(s * (w / 4 + ov * Math.cos(ang) / 2 - 0.02) - s * Math.sin(ang) * 0.09, h + roofH / 2 + 0.06 - ov * Math.sin(ang) / 2 + Math.cos(ang) * 0.08, 0); sn.rotation.z = -s * ang; g.add(sn); }
  }
  g.add(box(0.22, 0.22, d + ov * 2.2, std({ color: o.ridge ?? 0x3a2a20 }), 0, h + roofH + 0.06, 0)); // ridge board
  if (o.trim != null) { const tm = std({ color: o.trim }); for (const zz of [d / 2 + 0.02, -d / 2 - 0.02]) { for (const s of [-1, 1]) { const b2 = box(slope + 0.2, 0.18, 0.08, tm, s * w / 4, h + roofH / 2, zz); b2.rotation.z = -s * ang; g.add(b2); } g.add(box(w + 0.1, 0.16, 0.08, tm, 0, h, zz)); } }
  g.userData = { w, d, h, roofH };
  return g;
}
// wooden lantern pole with a hanging lantern (pond, wharf). Returns a lamp handle {glow, pl, glass, group}
export function lanternPole(parent, x, z, o = {}) {
  const wood = o.wood || std({ map: T.wood([100, 70, 45], 3) });
  const g = new THREE.Group(); g.position.set(x, o.y ?? 0, z); g.rotation.y = o.ry ?? 0; parent.add(g);
  const H = o.h ?? 2.4;
  g.add(ink(box(0.12, H, 0.12, wood, 0, H / 2, 0), 1.04));
  g.add(ink(box(0.7, 0.09, 0.09, wood, 0.3, H - 0.1, 0), 1.04));
  const brace = box(0.06, 0.4, 0.06, wood, 0.12, H - 0.3, 0); brace.rotation.z = -0.8; g.add(brace);
  const L = hangingLantern(g, 0.58, H - 0.18, 0, o);
  return L;
}
// a hanging (or standing) lantern: tin cap + ring, four glass sides, a flame; hook point at (x, y, z)
export function hangingLantern(parent, x, y, z, o = {}) {
  const tin = std({ color: 0x2b2b2b, metalness: 0.5, roughness: 0.5 });
  const glass = new THREE.MeshBasicMaterial({ color: 0xffd98a });
  glowTex = glowTex || T.radial('rgba(255,210,140,.9)', 'rgba(255,170,80,0)');
  const g = new THREE.Group(); g.position.set(x, y, z); parent.add(g);
  g.add(rope(g, [0, 0, 0], [0, -0.12, 0], 0.012, tin));
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.01, 6, 12), tin); ring.position.y = -0.02; g.add(ring);
  const cap = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.12, 4), tin); cap.rotation.y = Math.PI / 4; cap.position.y = -0.17; g.add(ink(cap, 1.08));
  g.add(box(0.2, 0.26, 0.2, glass, 0, -0.36, 0, 0, false));
  for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) g.add(box(0.022, 0.28, 0.022, tin, sx * 0.1, -0.36, sz * 0.1));
  g.add(ink(box(0.24, 0.04, 0.24, tin, 0, -0.51, 0), 1.06));
  const fl = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffa62b })); fl.scale.y = 1.8; fl.position.y = -0.38; g.add(fl);
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  glow.scale.set(1.2, 1.2, 1); glow.position.y = -0.36; g.add(glow);
  const pl = new THREE.PointLight(0xffa850, 6, o.range ?? 7, 1.6); pl.position.y = -0.36; g.add(pl);
  return { glow, pl, glass, group: g };
}

// ---------------- harbour / winter props (S02) ----------------
// mooring bollard: squat wooden post with an iron cap
export function bollard(parent, x, z, y = 0, snowCap = false) {
  const g = new THREE.Group(); g.position.set(x, y, z); parent.add(g);
  g.add(ink(cyl(0.2, 0.24, 0.62, std({ map: T.wood([90, 62, 40], 3) }), 0, 0.31, 0, 12), 1.06));
  g.add(ink(cyl(0.26, 0.24, 0.1, std({ color: 0x2b2d31, metalness: 0.5, roughness: 0.5 }), 0, 0.66, 0, 12), 1.06));
  if (snowCap) { const pts = []; for (let i = 0; i <= 8; i++) { const a = i / 8 * Math.PI / 2; pts.push(new THREE.Vector2(Math.cos(a) * 0.27, Math.sin(a) * 0.12)); } const sc = new THREE.Mesh(new THREE.LatheGeometry(pts, 14), snowMat()); sc.position.y = 0.7; sc.castShadow = true; g.add(sc); }
  return g;
}
// grain/coffee sack: soft squashed pillow with a tied neck
export function sack(parent, x, y, z, ry = 0, col = 0xc9b07a, label = null) {
  const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = ry; parent.add(g);
  const m = new THREE.Mesh(new THREE.SphereGeometry(0.34, 16, 12), std({ map: T.hay(), color: col, roughness: 1 })); m.scale.set(1, 0.55, 0.7); m.position.y = 0.19; m.castShadow = true; g.add(inkOffset(m, 0.02));
  const neck = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.16, 8), std({ color: col })); neck.rotation.z = -Math.PI / 2; neck.position.set(0.38, 0.2, 0); g.add(neck);
  return g;
}
// lobster pot: slatted half-barrel trap
export function lobsterPot(parent, x, z, ry = 0, y = 0) {
  const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = ry; parent.add(g);
  const w = std({ map: T.wood([150, 120, 80], 3, false) });
  g.add(ink(box(0.8, 0.05, 0.5, w, 0, 0.025, 0), 1.04));
  for (const xx of [-0.36, 0, 0.36]) { const a = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.022, 5, 12, Math.PI), w); a.position.set(xx, 0.04, 0); a.rotation.y = Math.PI / 2; g.add(a); }
  for (let i = 0; i < 6; i++) { const a = i / 5 * Math.PI; g.add(box(0.8, 0.03, 0.04, w, 0, 0.04 + Math.sin(a) * 0.25, Math.cos(a) * 0.25)); }
  return g;
}
// wicker basket (fish or cargo), optional fish heads showing
export function basket(parent, x, z, y = 0, fish = false) {
  const g = new THREE.Group(); g.position.set(x, y, z); parent.add(g);
  g.add(ink(cyl(0.3, 0.24, 0.42, std({ map: T.hay(), color: 0xa0743a }), 0, 0.21, 0, 14), 1.05));
  g.add(cyl(0.31, 0.31, 0.05, std({ color: 0x7a5228 }), 0, 0.42, 0, 14));
  if (fish) for (let i = 0; i < 5; i++) { const f = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 6), std({ color: i % 2 ? 0x8a97a3 : 0xa7b2bb, metalness: 0.3, roughness: 0.4 })); f.scale.set(1.6, 0.45, 0.6); f.position.set(-0.12 + (i % 3) * 0.12, 0.44, -0.1 + Math.floor(i / 3) * 0.18); f.rotation.y = i; g.add(f); }
  return g;
}
// capstan: drum with a cap and four bars
export function capstan(parent, x, z, y = 0) {
  const g = new THREE.Group(); g.position.set(x, y, z); parent.add(g);
  const w = std({ map: T.wood([120, 84, 52], 4) });
  g.add(ink(cyl(0.32, 0.4, 0.9, w, 0, 0.45, 0, 12), 1.05)); g.add(ink(cyl(0.45, 0.42, 0.18, w, 0, 0.98, 0, 12), 1.05));
  for (let i = 0; i < 4; i++) { const b = box(2.0, 0.07, 0.07, w, 0, 1.0, 0); b.rotation.y = i * Math.PI / 4; g.add(b); }
  for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; g.add(box(0.06, 0.8, 0.1, w, Math.cos(a) * 0.38, 0.45, Math.sin(a) * 0.38, -a)); }
  return g;
}
// a spare anchor leaning on something (rz tilt)
export function anchorProp(parent, x, z, ry = 0, rz = 0.35, y = 0) {
  const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.set(0, ry, rz); parent.add(g);
  const iron = std({ color: 0x2a2c30, metalness: 0.5, roughness: 0.55 });
  g.add(ink(box(0.12, 1.8, 0.12, iron, 0, 1.0, 0), 1.06));
  const arm = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.07, 6, 16, Math.PI), iron); arm.rotation.z = Math.PI; arm.position.y = 0.6; g.add(ink(arm, 1.06));
  for (const ax of [-0.55, 0.55]) { const fl = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.3, 3), iron); fl.position.set(ax, 0.72, 0); g.add(fl); }
  g.add(ink(box(1.3, 0.12, 0.12, std({ map: T.wood([100, 70, 45], 3) }), 0, 1.75, 0), 1.06));
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.03, 6, 12), iron); ring.position.y = 1.98; g.add(ring);
  return g;
}
// doorway in a facade (local coords of a building group, front face at z): frame, dark recess, one or two leaves
// returns opener (v) that swings the leaves in
export function doorway(g, x, z, w = 1.4, h = 2.3, o = {}) {
  const frame = std({ color: o.frame ?? 0x3a2a1c }), leafM = std({ map: T.wood(o.wood ?? [96, 64, 40], 5) });
  g.add(box(w + 0.1, h + 0.05, 0.3, new THREE.MeshStandardMaterial({ color: 0x0c0806, roughness: 1 }), x, h / 2, z - 0.1, 0, false)); // dark interior
  for (const s of [-1, 1]) g.add(ink(box(0.14, h + 0.1, 0.16, frame, x + s * (w / 2 + 0.07), (h + 0.1) / 2, z + 0.04), 1.04));
  g.add(ink(box(w + 0.42, 0.18, 0.2, frame, x, h + 0.12, z + 0.05), 1.04));
  const leaves = []; const n = o.double ? 2 : 1;
  for (let i = 0; i < n; i++) {
    const s = n === 1 ? -1 : (i ? 1 : -1); const lw = w / n;
    const hinge = new THREE.Group(); hinge.position.set(x + s * w / 2, 0, z + 0.04); g.add(hinge);
    const leaf = box(lw, h, 0.07, leafM, -s * lw / 2, h / 2, 0); hinge.add(leaf);
    hinge.add(box(lw * 0.9, 0.09, 0.03, frame, -s * lw / 2, h * 0.25, 0.05)); hinge.add(box(lw * 0.9, 0.09, 0.03, frame, -s * lw / 2, h * 0.75, 0.05));
    hinge.add(box(0.06, 0.06, 0.05, std({ color: 0x222222, metalness: 0.6 }), -s * (lw - 0.15), h * 0.5, 0.06));
    leaves.push([hinge, s]);
  }
  const open = (v) => { for (const [hg, s] of leaves) hg.rotation.y = s * (o.inward ? -1 : 1) * v * 1.6 * -1; };
  open(o.openAt ?? 0); return open;
}

// S02 v2: chimney smoke: soft puffs rising and drifting with the wind; returns tick(t)
export function smoke(parent, x, y, z, o = {}) {
  const n = o.n ?? 7, tex = T.radial('rgba(205,210,220,.55)', 'rgba(205,210,220,0)'); const ps = [];
  for (let i = 0; i < n; i++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false })); parent.add(sp); ps.push(sp); }
  return (t) => ps.forEach((sp, i) => { const u = (t * (o.speed ?? 0.16) + i / n) % 1; sp.position.set(x + u * (o.drift ?? 2.2), y + u * (o.rise ?? 3.2), z + Math.sin(u * 3 + i) * 0.2); sp.scale.setScalar(0.5 + u * (o.grow ?? 2.0)); sp.material.opacity = Math.sin(u * Math.PI) * 0.8; });
}
