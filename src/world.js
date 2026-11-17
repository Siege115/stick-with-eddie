// Set library: Berlin courtyard ~1904 (reusable). Builds into a THREE.Scene and returns handles.
import * as THREE from '/node_modules/three/build/three.module.js';
import * as T from './textures.js';

const std = (o) => new THREE.MeshStandardMaterial({ roughness: 0.85, metalness: 0, ...o });
function box(w, h, d, mat, x, y, z, ry = 0, cast = true) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z); m.rotation.y = ry; m.castShadow = cast; m.receiveShadow = true; return m;
}
function cyl(rt, rb, h, mat, x, y, z, seg = 16) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat);
  m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; return m;
}
// cartoon ink outline: back-face hull
function ink(mesh, s = 1.04) {
  const o = new THREE.Mesh(mesh.geometry, new THREE.MeshBasicMaterial({ color: 0x14100c, side: THREE.BackSide }));
  o.scale.setScalar(s); mesh.add(o); return mesh;
}


// leafy planter: stems, layered leaves, five-petal flowers, trailing vines (seeded, so every frame matches)
const LEAF_G = new THREE.SphereGeometry(1, 8, 6), PETAL_G = new THREE.SphereGeometry(1, 6, 5);
const LEAF_M = [0x2f6b2f, 0x3d8a3a, 0x25562a, 0x4f9a45, 0x5aa04a].map((c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.8 }));
const STEM_M = new THREE.MeshStandardMaterial({ color: 0x35602b });
const SOIL_M = new THREE.MeshStandardMaterial({ color: 0x3a2618, roughness: 1 });
const CENTER_M = new THREE.MeshStandardMaterial({ color: 0xf2c94c });
function planter(parent, cx, cy, cz, w, d, seed, flowerCols) {
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

export function buildCourtyard(scene) {
  const H = {};
  const g = new THREE.Group(); scene.add(g);

  // ground
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(44, 44), std({ map: T.cobbles(), roughness: 0.95 }));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; g.add(ground);

  // walls
  const brick = T.bricks(); brick.repeat.set(4, 1.2);
  const brick2 = T.bricks([150, 96, 70]); brick2.repeat.set(4, 1.2);
  const wallMat = std({ map: brick }), wallMat2 = std({ map: brick2 });
  const W = 7.2;
  // back wall with a real doorway for the stable (x -6.15 … -2.85, 3.3 m high)
  const wallPart = (w, h, x, y) => { const t2 = brick.clone(); t2.needsUpdate = true; t2.repeat.set(4 * w / 28, 1.2 * h / W); g.add(box(w, h, 0.6, std({ map: t2 }), x, y, -8.3)); };
  wallPart(7.85, W, -10.075, W / 2); wallPart(16.85, W, 5.575, W / 2); wallPart(3.3, W - 3.3, -4.5, 3.3 + (W - 3.3) / 2);
  // front wall, with a real opening behind the lit upper window at x -1.5 (a room you can see into)
  const OX0 = -2.0, OX1 = -1.0, OY0 = 3.95, OY1 = 5.45;
  const fwPart = (x0, x1, y0, y1) => { const t2 = brick2.clone(); t2.needsUpdate = true; t2.repeat.set(4 * (x1 - x0) / 28, 1.2 * (y1 - y0) / W); g.add(box(x1 - x0, y1 - y0, 0.6, std({ map: t2 }), (x0 + x1) / 2, (y0 + y1) / 2, 11.3)); };
  fwPart(-14, OX0, 0, W); fwPart(OX1, 14, 0, W); fwPart(OX0, OX1, 0, OY0); fwPart(OX0, OX1, OY1, W);
  { // the room behind the window: wallpaper, a picture frame, a warm lamp
    const wp = document.createElement('canvas'); wp.width = 256; wp.height = 256; const k = wp.getContext('2d');
    k.fillStyle = '#c9a66b'; k.fillRect(0, 0, 256, 256);
    k.fillStyle = '#b08850'; for (let x = 0; x < 256; x += 32) k.fillRect(x, 0, 12, 256);
    k.fillStyle = '#e8d2a0'; for (let y = 16; y < 256; y += 48) for (let x = 6; x < 256; x += 32) { k.beginPath(); k.arc(x, y + (x % 64 ? 24 : 0), 4, 0, 7); k.fill(); }
    const wpt = new THREE.CanvasTexture(wp); wpt.colorSpace = THREE.SRGBColorSpace; wpt.wrapS = wpt.wrapT = THREE.RepeatWrapping; wpt.repeat.set(3, 3);
    const room = new THREE.Mesh(new THREE.BoxGeometry(2.6, 2.6, 2.0), new THREE.MeshStandardMaterial({ map: wpt, side: THREE.BackSide, roughness: 1 }));
    room.position.set(-1.5, 4.5, 12.6); g.add(room);
    const pic = box(0.5, 0.4, 0.04, std({ color: 0x6b3f22 }), -1.1, 5.0, 13.56); g.add(pic);
    g.add(box(0.4, 0.3, 0.05, std({ color: 0x7fa7c9 }), -1.1, 5.0, 13.54));
    const lamp = new THREE.PointLight(0xffc070, 4, 4, 1.4); lamp.position.set(-1.9, 5.3, 12.4); g.add(lamp);
    const shade = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.2, 12, 1, true), new THREE.MeshBasicMaterial({ color: 0xffd28a, side: THREE.DoubleSide })); shade.position.set(-2.05, 5.55, 12.9); g.add(shade);
  }
  g.add(box(0.6, W, 20, wallMat2, -10.3, W / 2, 1.5));
  g.add(box(0.6, W, 20, wallMat, 10.3, W / 2, 1.5));
  // cornice + plaster band
  const plaster = std({ map: T.plaster() });
  for (const [w, d, x, z] of [[28.4, 0.9, 0, -8.15], [28.4, 0.9, 0, 11.15], [0.9, 20.4, -10.15, 1.5], [0.9, 20.4, 10.15, 1.5]]) {
    g.add(box(w, 0.35, d, plaster, x, W + 0.1, z));
    if (z === -8.15) { // trim band stops at the stable doorway
      g.add(box(8.0, 0.25, d * 0.95, plaster, -10.2, 2.6, z)); g.add(box(17.0, 0.25, d * 0.95, plaster, 5.7, 2.6, z));
    } else g.add(box(w, 0.25, d * 0.95, plaster, x, 2.6, z));
  }
  // windows on walls (frames + dark/warm panes)
  const frameMat = std({ color: 0xe9dfc8 }); const pane = std({ color: 0x223040, roughness: 0.2, metalness: 0.3 });
  const warmPane = new THREE.MeshBasicMaterial({ color: 0xffc66b });
  const glassMat = new THREE.MeshStandardMaterial({ color: 0xdfefff, transparent: true, opacity: 0.16, roughness: 0.05, metalness: 0.2, depthWrite: false });
  const addWin = (x, y, z, ry, warm, open = false) => {
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
    w.add(box(1.45, 0.12, 0.3, frameMat, 0, -0.92, 0.08));
    // flower box
    if (warm === false && ((x * 7 + z) | 0) % 3 === 0) {
      const boxWood = std({ map: T.wood([120, 70, 38], 3, false) });
      w.add(ink(box(1.12, 0.22, 0.3, boxWood, 0, -0.76, 0.22), 1.03));
      for (const bx of [-0.42, 0.42]) w.add(box(0.05, 0.24, 0.32, std({ color: 0x2b2f33, metalness: 0.5 }), bx, -0.8, 0.22)); // iron brackets
      const cols = [[0xe63946, 0xffffff], [0xffd166, 0xf4a1c1], [0x9b5de5, 0xffd166], [0xf4a1c1, 0xe63946]][Math.abs(Math.round(x * 3 + z)) % 4];
      planter(w, 0, -0.65, 0.22, 1.05, 0.26, Math.abs(Math.round(x * 13 + z * 7)) + 3, cols);
    }
    g.add(w);
  };
  for (const x of [-7.5, -1.5, 1.5, 4.5, 7.5]) { addWin(x, 4.7, -7.95, 0, x === 4.5); }
  for (const x of [-7.5, -4.5, -1.5, 1.5, 4.5, 7.5]) { addWin(x, 4.7, 10.95, Math.PI, x === -1.5, x === -1.5); addWin(x, 1.6, 10.95, Math.PI, false); }
  for (const z of [-5, -1, 3, 7]) { addWin(-9.95, 4.7, z, Math.PI / 2, z === 3); addWin(9.95, 4.7, z, -Math.PI / 2, false); addWin(9.95, 1.6, z + 1, -Math.PI / 2, false); }
  addWin(-9.95, 1.6, 6.5, Math.PI / 2, false);

  // skyline beyond the walls: roofs + chimneys
  const roofMat = std({ color: 0x7a3b2e }); const chim = std({ color: 0x8c5a44 });
  const sky = new THREE.Group(); g.add(sky);
  const rr = (s) => { let v = s; return () => (v = (v * 9301 + 49297) % 233280) / 233280; };
  const r = rr(4);
  for (let i = 0; i < 26; i++) {
    const a = (i / 26) * Math.PI * 2; const R = 17 + r() * 4;
    const x = Math.cos(a) * R, z = 1.5 + Math.sin(a) * R * 0.9;
    const h = 7 + r() * 5, w = 4 + r() * 3;
    const b = box(w, h, 4, std({ color: new THREE.Color().setHSL(0.07 + r() * 0.05, 0.25, 0.45 + r() * 0.15) }), x, h / 2, z, -a + Math.PI / 2, false);
    sky.add(b);
    const roof = new THREE.Mesh(new THREE.ConeGeometry(w * 0.75, 2.4, 4), roofMat);
    roof.position.set(x, h + 1.2, z); roof.rotation.y = -a + Math.PI / 4; sky.add(roof);
    if (r() > 0.4) sky.add(box(0.5, 1.6, 0.5, chim, x + 1, h + 1.5, z, 0, false));
  }

  // stable doors on back wall
  const doorWood = std({ map: T.wood([110, 62, 32], 5) });
  const stable = new THREE.Group(); stable.position.set(-4.5, 0, -7.95); g.add(stable);
  const frameWood = std({ map: T.wood([90, 55, 30], 3) });
  stable.add(ink(box(0.22, 3.4, 0.4, frameWood, -1.76, 1.7, 0.05), 1.02)); stable.add(ink(box(0.22, 3.4, 0.4, frameWood, 1.76, 1.7, 0.05), 1.02));
  stable.add(box(3.6, 0.35, 0.5, doorWood, 0, 3.45, 0.15));
  const dL = new THREE.Group(), dR = new THREE.Group();
  dL.position.set(-1.45, 0, 0.25); dR.position.set(1.45, 0, 0.25);
  const leaf = (s) => { const q = new THREE.Group(); q.add(box(1.45, 3.05, 0.1, doorWood, s * 0.725, 1.55, 0)); const xm = std({ color: 0x5a3820 }); const brace = box(0.12, 1.9, 0.12, xm, s * 0.725, 1.55, 0.07); brace.rotation.z = s * 0.62; q.add(brace); q.add(box(1.4, 0.12, 0.12, xm, s * 0.725, 0.6, 0.07)); q.add(box(1.4, 0.12, 0.12, xm, s * 0.725, 2.5, 0.07)); return q; };
  dL.add(leaf(1)); dR.add(leaf(-1)); stable.add(dL, dR);
  H.doors = (open) => { dL.rotation.y = -open * 1.7; dR.rotation.y = open * 1.7; };
  // dark stable interior behind the doors (the experts march out of here)
  const inner = std({ color: 0x2a1c12, roughness: 1 });
  const straw = T.hay(); straw.repeat.set(2, 4);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 7), std({ map: straw, color: 0x8a7550 }));
  floor.rotation.x = -Math.PI / 2; floor.position.set(0, 0.01, -3.9); stable.add(floor);
  stable.add(box(3.4, 3.4, 0.2, inner, 0, 1.7, -7.4, 0, false));
  stable.add(box(0.2, 3.4, 7, inner, -1.7, 1.7, -3.9, 0, false));
  stable.add(box(0.2, 3.4, 7, inner, 1.7, 1.7, -3.9, 0, false));
  stable.add(box(3.4, 0.2, 7, inner, 0, 3.35, -3.9, 0, false));
  for (const z of [-2.2, -4.6]) stable.add(box(3.2, 0.18, 0.18, std({ color: 0x4a3018 }), 0, 3.1, z, 0, false));
  const lantern = new THREE.PointLight(0xffb060, 3, 7, 1.5); lantern.position.set(0, 2.8, -3.5); stable.add(lantern);
  // lantern over door
  H.lamps = [];

  // gas lamps
  const lampMat = std({ color: 0x23352c, roughness: 0.5, metalness: 0.4 });
  const glass = new THREE.MeshBasicMaterial({ color: 0xffe2a0 });
  const glowTex = T.radial('rgba(255,210,140,.9)', 'rgba(255,170,80,0)');
  for (const [x, z] of [[-7.6, -6.2], [7.6, -6.2], [-7.6, 8.4], [7.6, 8.4]]) {
    const L = new THREE.Group(); L.position.set(x, 0, z); g.add(L);
    L.add(ink(cyl(0.07, 0.11, 3.4, lampMat, 0, 1.7, 0)));
    L.add(cyl(0.22, 0.26, 0.25, lampMat, 0, 0.12, 0));
    const head = cyl(0.26, 0.16, 0.5, glass, 0, 3.6, 0, 6); L.add(head);
    L.add(cyl(0.05, 0.32, 0.2, lampMat, 0, 3.95, 0, 6));
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    glow.scale.set(1.8, 1.8, 1); glow.position.set(0, 3.6, 0); L.add(glow);
    const pl = new THREE.PointLight(0xffb060, 6, 9, 1.6); pl.position.set(0, 3.5, 0); L.add(pl);
    H.lamps.push({ glow, pl, glass });
  }

  // chalkboard on easel
  const board = new THREE.Group(); board.position.set(3.45, 0, -3.5); board.rotation.y = -0.35; g.add(board);
  const bc = T.chalkboardCanvas(); const bt = new THREE.CanvasTexture(bc); bt.colorSpace = THREE.SRGBColorSpace;
  const frame = std({ map: T.wood([130, 80, 45], 3, false) });
  board.add(ink(box(1.72, 1.22, 0.08, frame, 0, 1.75, 0)));
  const face = new THREE.Mesh(new THREE.PlaneGeometry(1.56, 1.07), std({ map: bt, roughness: 1 }));
  face.position.set(0, 1.75, 0.045); board.add(face);
  for (const [x, rz] of [[-0.6, -0.08], [0.6, 0.08]]) { const leg = box(0.08, 2.6, 0.08, frame, x, 1.25, -0.12); leg.rotation.z = rz; board.add(leg); }
  const back = box(0.08, 2.6, 0.08, frame, 0, 1.2, -0.7); back.rotation.x = -0.35; board.add(back);
  board.add(box(1.6, 0.06, 0.18, frame, 0, 1.12, 0.08));
  H.board = { canvas: bc, tex: bt, group: board, last: '' };

  // calendar on back wall
  const cal = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 1.14), std({ map: T.calendar(), roughness: 1 }));
  cal.position.set(1.0, 1.82, -7.97); g.add(cal);
  g.add(box(0.05, 0.05, 0.12, std({ color: 0x333333, metalness: 0.6 }), 1.0, 2.52, -7.95));
  const str = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.006, 4, 24, Math.PI), std({ color: 0x6b4a2a }));
  str.position.set(1.0, 2.38, -7.975); g.add(str);
  H.calendar = cal;

  // free admission sign by the rope
  const signT = T.sign();
  // hangs from the rope, facing the horse side
  const sg = new THREE.Group(); sg.position.set(-1.12, 0, 2.56); sg.rotation.y = Math.PI; g.add(sg);
  const sb = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.55), std({ map: signT }));
  sb.position.set(0, 0.36, 0.025); sg.add(sb);
  sg.add(ink(box(1.12, 0.57, 0.04, std({ color: 0x3a2414 }), 0, 0.36, 0), 1.02));
  for (const x of [-0.4, 0.4]) sg.add(box(0.012, 0.22, 0.012, std({ color: 0x222222 }), x, 0.74, 0));

  // rope line (brass posts, red velvet rope)
  const brass = std({ color: 0xc9a227, metalness: 0.8, roughness: 0.3 });
  const rope = std({ color: 0x9b2226, roughness: 0.6 });
  const posts = [-4.5, -2.25, 0, 2.25, 4.5];
  for (const x of posts) {
    g.add(cyl(0.05, 0.06, 1.0, brass, x, 0.5, 2.6)); g.add(cyl(0.2, 0.22, 0.06, brass, x, 0.03, 2.6));
    const top = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 8), brass); top.position.set(x, 1.04, 2.6); g.add(top);
  }
  for (let i = 0; i < posts.length - 1; i++) {
    const a = new THREE.Vector3(posts[i], 0.95, 2.6), b = new THREE.Vector3(posts[i + 1], 0.95, 2.6);
    const mid = a.clone().lerp(b, 0.5); mid.y -= 0.28;
    const tube = new THREE.Mesh(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(a, mid, b), 20, 0.035, 8), rope);
    tube.castShadow = true; g.add(tube);
  }

  // props: barrels, hay bales, crates, trough, cart wheel
  const barrelMat = std({ map: T.wood([140, 85, 45], 8) });
  const hoop = std({ color: 0x333333, metalness: 0.6, roughness: 0.4 });
  const addBarrel = (x, z) => { const b = ink(cyl(0.38, 0.38, 0.95, barrelMat, x, 0.475, z)); g.add(b); for (const y of [0.15, 0.8]) g.add(cyl(0.395, 0.395, 0.06, hoop, x, y, z)); };
  addBarrel(-8.6, -6.6); addBarrel(-7.9, -7.1); addBarrel(8.8, 4.5);
  const hayMat = std({ map: T.hay() });
  for (const [x, z, ry, y] of [[-2.2, -7.3, 0.1, 0.4], [-0.9, -7.4, -0.05, 0.4], [-1.6, -7.3, 0.05, 1.2], [8.5, -3, 0.3, 0.4], [8.6, -1.6, 0.2, 0.4]]) g.add(ink(box(1.2, 0.8, 0.75, hayMat, x, y, z, ry), 1.03));
  const crate = std({ map: T.wood([150, 110, 70], 4, false) });
  for (const [x, z, s, y] of [[6.5, -7.3, 0.8, 0.4], [7.3, -7.2, 0.7, 0.35], [6.9, -7.25, 0.6, 1.1]]) g.add(ink(box(s, s, s, crate, x, y, z, 0.2), 1.03));
  // trough
  g.add(ink(box(2.0, 0.6, 0.6, std({ map: T.wood([100, 70, 45], 4, false) }), -8.5, 0.3, -2.5, Math.PI / 2)));
  const water = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 1.9), std({ color: 0x5c8aa8, roughness: 0.1, metalness: 0.3 })); water.rotation.x = -Math.PI / 2; water.position.set(-8.5, 0.58, -2.5); g.add(water);
  // cart wheel leaning on wall
  const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.07, 8, 24), std({ color: 0x6b4226 }));
  wheel.position.set(9.9, 0.75, 6.5); wheel.rotation.y = Math.PI / 2; wheel.rotation.x = 0.15; wheel.castShadow = true; g.add(wheel);
  for (let i = 0; i < 6; i++) { const sp = box(0.05, 1.4, 0.05, std({ color: 0x6b4226 }), 0, 0, 0); sp.rotation.z = i * Math.PI / 6; wheel.add(sp); sp.position.set(0, 0, 0); }

  // experts' table (left side), papers and ink pots
  const tableWood = std({ map: T.wood([95, 58, 32], 5, false) });
  const table = new THREE.Group(); table.position.set(-6.4, 0, 0.6); g.add(table);
  table.add(ink(box(1.4, 0.1, 4.8, tableWood, 0, 0.95, 0), 1.02));
  table.add(box(1.5, 0.75, 0.04, std({ color: 0x5a1f1f }), 0.0, 0.62, 0, Math.PI / 2, false)); // cloth skirt (front)
  const skirt = new THREE.Mesh(new THREE.PlaneGeometry(4.8, 0.8), std({ color: 0x6a2424, side: THREE.DoubleSide })); skirt.position.set(0.71, 0.58, 0); skirt.rotation.y = Math.PI / 2; table.add(skirt);
  for (const [x, z] of [[-0.6, -2.3], [0.6, -2.3], [-0.6, 2.3], [0.6, 2.3]]) table.add(box(0.1, 0.95, 0.1, tableWood, x, 0.47, z));
  const docMats = [1, 2, 3, 4].map((sd) => std({ map: T.smallDoc(sd), roughness: 1 }));
  const inkMat = std({ color: 0x111111, roughness: 0.2, metalness: 0.2 });
  for (let i = 0; i < 7; i++) {
    const z = -2 + i * 0.66;
    if (i !== 4) { const p = new THREE.Mesh(new THREE.PlaneGeometry(0.36, 0.48), docMats[i % 4]); p.rotation.x = -Math.PI / 2; p.rotation.z = Math.PI / 2 + (i % 3 - 1) * 0.2; p.position.set(0.2, 1.006, z); table.add(p); }
    table.add(cyl(0.05, 0.06, 0.1, inkMat, -0.25, 1.05, z + 0.25, 10));
    const quill = box(0.015, 0.35, 0.015, std({ color: 0xf2f2f2 }), -0.22, 1.2, z + 0.25); quill.rotation.z = 0.35; table.add(quill);
  }
  H.table = table;
  // the commission's report (stamped in beat 11)
  const vd = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.68), std({ map: T.verdictDoc(), roughness: 1 }));
  vd.rotation.x = -Math.PI / 2; vd.rotation.z = Math.PI / 2 - 1.0; vd.position.set(0.15, 1.008, 0.66 - 0.6 + 0.6); table.add(vd);
  H.verdictPaper = new THREE.Vector3(-6.25, 1.01, 1.26);

  // test screen: three-panel folding screen (wipes across in beat 13)
  const screen = new THREE.Group(); g.add(screen);
  const cloth = std({ color: 0xa83246, emissive: 0x3a0c16, roughness: 0.9, side: THREE.DoubleSide });
  const sframe = std({ color: 0x8a5a32, emissive: 0x1e1008 });
  for (let i = 0; i < 3; i++) {
    const pnl = new THREE.Group(); pnl.position.set(0, 0, (i - 1) * 0.86); pnl.rotation.y = (i % 2 ? 0.55 : -0.55);
    pnl.add(box(0.05, 2.5, 0.85, cloth, 0, 1.4, 0));
    pnl.add(box(0.09, 2.65, 0.07, sframe, 0, 1.33, 0.42)); pnl.add(box(0.09, 2.65, 0.07, sframe, 0, 1.33, -0.42));
    pnl.add(box(0.09, 0.07, 0.9, sframe, 0, 2.66, 0)); pnl.add(box(0.09, 0.07, 0.9, sframe, 0, 0.16, 0));
    screen.add(pnl);
  }
  H.screen = screen;

  // spotlight (test scene)
  const spot = new THREE.SpotLight(0xfff1d6, 0, 14, 0.42, 0.45, 1.2);
  spot.position.set(0.6, 7, 1.2); spot.target.position.set(0.4, 0, -2); spot.castShadow = true;
  spot.shadow.mapSize.set(1024, 1024);
  scene.add(spot, spot.target); H.spot = spot;
  const beamTex = T.radial('rgba(255,240,200,.35)', 'rgba(255,240,200,0)');
  const beam = new THREE.Mesh(new THREE.ConeGeometry(2.6, 7, 32, 1, true), new THREE.MeshBasicMaterial({ map: beamTex, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, color: 0xfff0d0 }));
  beam.position.set(0.5, 3.5, -1.6); H.beam = beam; scene.add(beam);
  // dust motes in the air (sunbeams)
  const motes = new THREE.BufferGeometry(); const mp = [];
  for (let i = 0; i < 400; i++) mp.push((r() - 0.5) * 16, r() * 5, -7 + r() * 14);
  motes.setAttribute('position', new THREE.Float32BufferAttribute(mp, 3));
  H.motes = new THREE.Points(motes, new THREE.PointsMaterial({ color: 0xfff0c8, size: 0.03, transparent: true, opacity: 0.6, depthWrite: false }));
  scene.add(H.motes);

  // ===================== extra set dressing =====================
  const iron = std({ color: 0x2b2f33, metalness: 0.6, roughness: 0.45 });
  const zinc = std({ color: 0x7d8a8f, metalness: 0.7, roughness: 0.35 });
  const woodL = std({ map: T.wood([150, 100, 60], 4) });
  const woodD = std({ map: T.wood([95, 60, 35], 4) });
  // shutters + curtains on every window
  const shutterMat = std({ map: T.wood([60, 110, 80], 6), color: 0xbfe0c8 });
  const curtainCols = [0xb23a48, 0xe9d8a6, 0x5d7ea8, 0xd98c5f, 0x8a6aa0];
  g.traverse((o) => { if (o.isGroup && o.children.length >= 4 && o.children[0].geometry && o.children[0].geometry.parameters && o.children[0].geometry.parameters.width === 1.25) o.userData.win = true; });
  const wins = []; g.traverse((o) => { if (o.userData.win) wins.push(o); });
  wins.forEach((w, i) => {
    for (const sx of [-1, 1]) { const sh = box(0.5, 1.7, 0.06, shutterMat, sx * 0.9, 0, 0.05); sh.rotation.y = sx * 0.25; w.add(ink(sh, 1.02)); for (let k2 = 0; k2 < 6; k2++) w.add(box(0.44, 0.03, 0.08, std({ color: 0x2f5a43 }), sx * 0.9, -0.65 + k2 * 0.26, 0.08, sx * 0.25)); }
    const cc = std({ color: curtainCols[i % curtainCols.length], side: THREE.DoubleSide });
    const cw = w.userData.open ? 0.12 : 0.36; // the see-through window has its curtains pulled back
    for (const sx of [-1, 1]) { const cu = new THREE.Mesh(new THREE.PlaneGeometry(cw, 1.45), cc); cu.position.set(sx * (0.5 - cw / 2), 0, -0.03); w.add(cu); }
  });
  // drainpipes + gutters
  for (const [x, z, ry] of [[-9.9, -7.9, 0], [9.9, -7.9, 0], [3.0, -7.95, 0], [-9.95, 9.5, 0], [9.95, 2.0, 0]]) {
    g.add(cyl(0.07, 0.07, 7.0, zinc, x, 3.5, z, 10));
    g.add(cyl(0.1, 0.07, 0.25, zinc, x, 0.12, z, 10));
    for (let y = 1; y < 7; y += 1.4) g.add(box(0.2, 0.05, 0.05, iron, x, y, z));
  }
  g.add(box(28, 0.12, 0.18, zinc, 0, 7.2, -7.88));
  // posters on the walls
  const pst = (kind, x, y, z, ry, s = 1) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(0.62 * s, 0.87 * s), new THREE.MeshStandardMaterial({ map: T.poster(kind), transparent: true, roughness: 1 })); m.position.set(x, y, z); m.rotation.y = ry; m.rotation.z = (x % 2) * 0.02; g.add(m); };
  pst('circus', -6.6, 1.7, -7.97, 0); pst('lost', -2.5, 1.55, -7.97, 0, 0.8);
  pst('coffee', 9.97, 1.7, -4.2, -Math.PI / 2); pst('concert', -9.97, 1.7, 1.0, Math.PI / 2);
  pst('circus', -9.97, 1.6, 4.4, Math.PI / 2, 0.9); pst('coffee', 4.0, 1.65, 10.97, Math.PI);
  // ivy on walls
  const ivyT = T.ivy();
  for (const [x, z, ry, s2] of [[-8.9, -7.96, 0, 1.6], [9.96, -6.5, -Math.PI / 2, 1.9], [-9.96, 8.6, Math.PI / 2, 1.5], [7.2, 10.96, Math.PI, 1.7]]) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1.4 * s2, 2.1 * s2), new THREE.MeshStandardMaterial({ map: ivyT, transparent: true, alphaTest: 0.3, roughness: 0.9, side: THREE.DoubleSide }));
    m.position.set(x, 1.05 * s2, z); m.rotation.y = ry; g.add(m);
  }
  // horseshoe + "STALL" sign over the stable
  const shoe = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.035, 8, 20, Math.PI * 1.3), iron);
  shoe.position.set(-4.5, 3.8, -7.9); shoe.rotation.z = -Math.PI * 0.15 - Math.PI / 2 + Math.PI; g.add(shoe);
  const stallSign = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.34), std({ map: T.sign2('STABLE', '#3a2414', '#f4e6c0') }));
  stallSign.position.set(-4.5, 4.25, -7.93); g.add(stallSign);
  // cast-iron water pump by the trough
  const pump = new THREE.Group(); pump.position.set(-8.8, 0, -3.9); g.add(pump);
  pump.add(ink(cyl(0.13, 0.17, 1.3, iron, 0, 0.65, 0)));
  pump.add(ink(cyl(0.16, 0.13, 0.18, iron, 0, 1.35, 0)));
  const spout = cyl(0.04, 0.05, 0.4, iron, 0.18, 1.05, 0); spout.rotation.z = Math.PI / 2.3; pump.add(spout);
  const handle = box(0.6, 0.05, 0.05, iron, -0.28, 1.45, 0); handle.rotation.z = 0.4; pump.add(handle);
  // wheelbarrow, bucket, broom and pitchfork near the hay
  const wb = new THREE.Group(); wb.position.set(-1.6, 0, -7.1); wb.rotation.y = 0.3; g.add(wb);
  wb.add(ink(box(0.9, 0.3, 0.6, woodL, 0, 0.45, 0))); const wwh = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.04, 6, 16), iron); wwh.position.set(0.55, 0.2, 0); wb.add(wwh);
  for (const z of [-0.25, 0.25]) { const hd = box(0.9, 0.05, 0.05, woodD, -0.55, 0.45, z); hd.rotation.z = 0.15; wb.add(hd); wb.add(box(0.05, 0.3, 0.05, woodD, -0.25, 0.15, z)); }
  g.add(ink(cyl(0.17, 0.13, 0.32, zinc, -2.4, 0.16, -6.6)));
  const broom = new THREE.Group(); broom.position.set(-0.2, 0, -7.85); broom.rotation.z = 0.2; g.add(broom);
  broom.add(cyl(0.02, 0.02, 1.5, woodL, 0, 0.9, 0, 6)); broom.add(ink(cyl(0.05, 0.16, 0.4, std({ map: T.hay() }), 0, 0.2, 0, 8)));
  const fork = new THREE.Group(); fork.position.set(-2.95, 0, -7.85); fork.rotation.z = -0.18; g.add(fork);
  fork.add(cyl(0.02, 0.02, 1.6, woodL, 0, 0.95, 0, 6)); for (const x of [-0.06, 0, 0.06]) fork.add(cyl(0.008, 0.008, 0.25, iron, x, 0.1, 0, 4));
  // apple crate
  const ac = new THREE.Group(); ac.position.set(5.8, 0, -7.3); g.add(ac);
  ac.add(ink(box(0.7, 0.35, 0.5, std({ map: T.wood([160, 120, 75], 4, false) }), 0, 0.18, 0)));
  for (let i = 0; i < 12; i++) { const ap = new THREE.Mesh(new THREE.SphereGeometry(0.065, 10, 8), std({ color: i % 4 ? 0xc0392b : 0x7cb342 })); ap.position.set(-0.25 + (i % 4) * 0.165, 0.38 + Math.floor(i / 8) * 0.06, -0.15 + Math.floor(i / 4) % 2 * 0.25); ac.add(ap); }
  // bench against the right wall with a sleeping cat-shaped cushion and a watering can
  const bench = new THREE.Group(); bench.position.set(9.6, 0, 0.5); bench.rotation.y = -Math.PI / 2; g.add(bench);
  bench.add(ink(box(2.0, 0.08, 0.45, woodL, 0, 0.48, 0), 1.03)); bench.add(box(2.0, 0.4, 0.06, woodL, 0, 0.8, -0.2));
  for (const x of [-0.85, 0.85]) bench.add(box(0.08, 0.48, 0.4, iron, x, 0.24, 0));
  const can = new THREE.Group(); can.position.set(9.3, 0, 2.1); g.add(can);
  can.add(ink(cyl(0.14, 0.16, 0.32, std({ color: 0x4a7a5a, metalness: 0.4 }), 0, 0.16, 0))); const sp2 = cyl(0.02, 0.03, 0.4, std({ color: 0x4a7a5a }), 0.2, 0.3, 0); sp2.rotation.z = -0.9; can.add(sp2);
  // flower pots by the doorway
  for (const [x, z, c] of [[-6.3, -7.6, 0xe63946], [-2.7, -7.5, 0xffd166], [6.3, 10.6, 0xf4a1c1], [-8.0, 10.6, 0xffd166]]) {
    g.add(ink(cyl(0.2, 0.15, 0.32, std({ color: 0xb5651d }), x, 0.16, z)));
    g.add(box(0.44, 0.04, 0.44, std({ color: 0x9c5418 }), x, 0.31, z)); // pot rim
    planter(g, x, 0.33, z, 0.4, 0.4, Math.abs(Math.round(x * 17 + z)) + 11, [c, 0xffffff]);
    planter(g, x, 0.45, z, 0.3, 0.3, Math.abs(Math.round(x * 5 + z * 3)) + 29, [c]);
  }
  // laundry line across the right corner
  const lineA = new THREE.Vector3(9.9, 4.0, 6.0), lineB = new THREE.Vector3(5.5, 4.0, 10.9);
  const lm = lineA.clone().lerp(lineB, 0.5); lm.y -= 0.3;
  g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(lineA, lm, lineB), 20, 0.01, 4), std({ color: 0xdddddd })));
  [[0.2, 0xffffff, 0.5, 0.7], [0.38, 0x5d7ea8, 0.45, 0.55], [0.55, 0xe9d8a6, 0.6, 0.45], [0.72, 0xb23a48, 0.35, 0.5]].forEach(([u, cl, w2, h2]) => {
    const p0 = new THREE.QuadraticBezierCurve3(lineA, lm, lineB).getPoint(u);
    const cloth2 = new THREE.Mesh(new THREE.PlaneGeometry(w2, h2), std({ color: cl, side: THREE.DoubleSide })); cloth2.position.set(p0.x, p0.y - h2 / 2, p0.z); cloth2.rotation.y = Math.atan2(lineB.x - lineA.x, lineB.z - lineA.z) + Math.PI / 2; g.add(cloth2);
  });
  // a hand cart parked by the front wall
  const cart = new THREE.Group(); cart.position.set(-7.6, 0, 7.4); cart.rotation.y = 0.4; g.add(cart);
  cart.add(ink(box(1.6, 0.4, 1.0, woodL, 0, 0.75, 0))); cart.add(box(1.7, 0.06, 1.1, woodD, 0, 0.55, 0));
  for (const z of [-0.55, 0.55]) { const wh2 = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.05, 6, 20), woodD); wh2.position.set(0, 0.45, z); cart.add(wh2); for (let i = 0; i < 4; i++) { const sp3 = box(0.04, 0.9, 0.04, woodD, 0, 0.45, z); sp3.rotation.z = i * Math.PI / 4; cart.add(sp3); } }
  for (const z of [-0.3, 0.3]) cart.add(box(1.4, 0.05, 0.05, woodD, -1.4, 0.7, z));
  cart.add(ink(box(0.8, 0.5, 0.6, std({ map: T.hay() }), 0.2, 1.15, 0)));
  // scattered straw near the stable + a puddle
  const strawM = new THREE.MeshStandardMaterial({ map: T.hay(), transparent: true, opacity: 0.85 });
  for (let i = 0; i < 9; i++) { const st = new THREE.Mesh(new THREE.CircleGeometry(0.25 + (i % 3) * 0.12, 7), strawM); st.rotation.x = -Math.PI / 2; st.rotation.z = i; st.position.set(-5.8 + (i * 0.47) % 2.8, 0.008, -7.1 + (i * 0.73) % 1.6); g.add(st); }
  const puddle = new THREE.Mesh(new THREE.CircleGeometry(0.7, 24), std({ color: 0x51677a, roughness: 0.05, metalness: 0.6 }));
  puddle.rotation.x = -Math.PI / 2; puddle.scale.set(1.4, 0.8, 1); puddle.position.set(5.2, 0.01, 6.0); g.add(puddle);
  // experts' table: books, candlestick, brass scale, magnifying glass
  const bookCols = [0x7a1f1f, 0x1f3a5f, 0x2f5a43, 0x5a3a22];
  for (let i = 0; i < 4; i++) table.add(ink(box(0.32, 0.07, 0.24, std({ color: bookCols[i] }), -0.2, 1.04 + i * 0.07, -2.15 + i * 0.01, i * 0.12), 1.03));
  table.add(cyl(0.06, 0.08, 0.06, std({ color: 0xc9a227, metalness: 0.8, roughness: 0.3 }), -0.35, 1.03, 2.0));
  table.add(cyl(0.025, 0.025, 0.25, std({ color: 0xc9a227, metalness: 0.8, roughness: 0.3 }), -0.35, 1.18, 2.0, 8));
  table.add(cyl(0.022, 0.022, 0.16, std({ color: 0xf6f0de }), -0.35, 1.38, 2.0, 8));
  const flame = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffc04a })); flame.scale.y = 1.8; flame.position.set(-0.35, 1.5, 2.0); table.add(flame);
  const scale = new THREE.Group(); scale.position.set(-0.3, 0.98, 1.4); table.add(scale);
  scale.add(cyl(0.08, 0.1, 0.04, brass, 0, 0.02, 0)); scale.add(cyl(0.015, 0.015, 0.35, brass, 0, 0.2, 0, 6)); scale.add(box(0.4, 0.015, 0.015, brass, 0, 0.37, 0));
  for (const x of [-0.19, 0.19]) scale.add(cyl(0.07, 0.05, 0.02, brass, x, 0.24, 0));
  const mg = new THREE.Group(); mg.position.set(0.25, 1.01, -1.2); mg.rotation.y = 0.6; table.add(mg);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.012, 8, 20), brass); ring.rotation.x = Math.PI / 2; mg.add(ring);
  mg.add(box(0.16, 0.02, 0.025, woodD, 0.15, 0, 0));
  // chalk box and sponge on the chalkboard tray
  board.add(box(0.18, 0.06, 0.1, std({ color: 0xf2f2ea }), -0.5, 1.18, 0.1)); board.add(box(0.16, 0.06, 0.09, std({ color: 0xd4a017 }), 0.45, 1.18, 0.1));
  return H;
}
