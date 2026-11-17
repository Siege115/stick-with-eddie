// S02 small sets (art brief 1.3, 1.6, 1.8): the 1806 kitchen, the ice-house workshop, the sawmill.
import * as THREE from '/node_modules/three/build/three.module.js';
import * as T from './textures.js';
import * as K from './kit.js';
import { iceMat } from './hold.js';
const { std, box, cyl, ink } = K;
const lathe = (pts, mat, seg = 18) => { const m = new THREE.Mesh(new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), seg), mat); m.castShadow = true; m.receiveShadow = true; return m; };

// ===================== kitchen, summer 1806 =====================
// Room: x ∈ [-3.6, 3.6], z ∈ [-3, 3.5], floor y 0, ceiling 3.1. Hearth on the back wall (z = -3), window with a real opening
// on the left wall (x = -3.6) to a sunny garden, dresser on the right wall with a bare gap beside it (z ≈ -0.6) for the
// dashed fridge outline (open.fridge 0 hidden → 1 popped in). Table centre with the sweating jug (jugAt).
export function buildKitchen(scene, opts = {}) {
  const g = new THREE.Group(); scene.add(g);
  const H = K.setHandle(g, { center: [0, 0, 0], shadowSize: 7 });
  const r = K.rng(3);
  const X = 3.6, Z0 = -3, Z1 = 3.5, HT = 3.1;
  const plasterM = std({ map: T.plaster('#e8dcc0') }), floorT = T.wood([150, 108, 68], 6, true); floorT.repeat.set(2.5, 2);
  K.ground(g, 2 * X, Z1 - Z0, std({ map: floorT })).position.z = (Z0 + Z1) / 2;
  g.add(box(2 * X, HT, 0.25, plasterM, 0, HT / 2, Z0 - 0.12)); g.add(box(0.25, HT, Z1 - Z0, plasterM, X + 0.12, HT / 2, (Z0 + Z1) / 2));
  // left wall with a real window opening (x = -X, z ∈ [-0.6, 0.8], y ∈ [1.0, 2.3])
  const WZ0 = -0.6, WZ1 = 0.8, WY0 = 1.0, WY1 = 2.3;
  for (const [z0, z1, y0, y1] of [[Z0, WZ0, 0, HT], [WZ1, Z1, 0, HT], [WZ0, WZ1, 0, WY0], [WZ0, WZ1, WY1, HT]]) g.add(box(0.25, y1 - y0, z1 - z0, plasterM, -X - 0.12, (y0 + y1) / 2, (z0 + z1) / 2));
  const frameM = std({ color: 0xe9e0c8 }); for (const [w, h, y, z] of [[0.1, 1.4, 1.65, WZ0], [0.1, 1.4, 1.65, WZ1], [1.5, 0.1, WY0, 0.1], [1.5, 0.1, WY1, 0.1], [1.4, 0.06, 1.65, 0.1]]) g.add(ink(box(0.3, h, w === 0.1 ? 0.1 : w, frameM, -X - 0.1, y, z), 1.02));
  const casement = new THREE.Group(); casement.position.set(-X + 0.05, 0, WZ1); g.add(casement); casement.rotation.y = -1.2; // open casement
  casement.add(box(0.06, 1.3, 0.7, frameM, 0, 1.65, -0.35)); casement.add(box(0.07, 1.1, 0.5, new THREE.MeshStandardMaterial({ color: 0xdfefff, transparent: true, opacity: 0.25 }), 0, 1.65, -0.35));
  const gardenP = new THREE.Mesh(new THREE.PlaneGeometry(9, 6), new THREE.MeshBasicMaterial({ map: T.garden(), fog: false })); gardenP.position.set(-X - 3.5, 1.6, 0.1); gardenP.rotation.y = Math.PI / 2; g.add(gardenP);
  K.planter(g, -X - 0.02, WY0 + 0.04, 0.1, 0.35, 1.2, 7, [0xe63946, 0xffffff]); g.add(box(0.4, 0.04, 1.4, frameM, -X + 0.05, WY0 + 0.02, 0.1)); // herbs on the sill
  // beamed ceiling
  g.add(box(2 * X, 0.12, Z1 - Z0, std({ map: T.wood([130, 96, 62], 8, false) }), 0, HT + 0.06, (Z0 + Z1) / 2));
  const beamM = std({ map: T.wood([84, 58, 36], 3) }); for (const z of [-2, -0.5, 1.0, 2.5]) g.add(ink(box(2 * X, 0.24, 0.22, beamM, 0, HT - 0.12, z), 1.02));
  // hearth: brick chimney breast, a dark fire box with embers, iron crane + pot, bake-oven door, bellows, fire irons
  const brickM = (() => { const t2 = T.bricks([170, 90, 60]); t2.repeat.set(0.7, 0.7); return std({ map: t2 }); })();
  const hx = 0.6, hz = Z0 + 0.45;
  for (const [w, h, x, y] of [[0.6, 2.0, hx - 1.25, 1.0], [0.6, 2.0, hx + 1.25, 1.0], [3.1, 1.1, hx, 2.55]]) g.add(ink(box(w, h, 0.9, brickM, x, y, hz), 1.01));
  g.add(ink(box(3.4, 0.16, 1.05, std({ color: 0x6a4a2a }), hx, 2.02, hz + 0.05), 1.02)); // mantel
  g.add(box(1.9, 2.0, 0.2, std({ color: 0x120a06 }), hx, 1.0, Z0 + 0.1)); g.add(box(1.9, 0.08, 0.9, std({ color: 0x2a1c14 }), hx, 0.04, hz));
  const emberM = new THREE.MeshBasicMaterial({ color: 0xff7a2a }); for (let i = 0; i < 9; i++) { const e = new THREE.Mesh(new THREE.SphereGeometry(0.06 + r() * 0.05, 6, 5), emberM); e.position.set(hx - 0.5 + r(), 0.1, hz - 0.15 + r() * 0.3); g.add(e); }
  for (let i = 0; i < 3; i++) g.add(cyl(0.06, 0.06, 0.8, std({ color: 0x3a2a1c }), hx - 0.3 + i * 0.3, 0.14, hz, 6).rotateZ(Math.PI / 2));
  const fire = new THREE.PointLight(0xff8a3a, 2.5, 5, 1.5); fire.position.set(hx, 0.5, hz + 0.3); g.add(fire);
  const iron = std({ color: 0x2a2c30, metalness: 0.5, roughness: 0.5 });
  g.add(ink(box(0.05, 1.3, 0.05, iron, hx - 0.8, 1.0, hz - 0.1), 1.1)); { const arm = box(0.9, 0.05, 0.05, iron, hx - 0.35, 1.6, hz); g.add(arm); }
  g.add(K.inkOffset(lathe([[0.001, 0], [0.2, 0.03], [0.26, 0.18], [0.24, 0.32], [0.2, 0.36]], iron), 0.015).translateX(hx).translateY(0.95).translateZ(hz)); K.rope(g, [hx, 1.6, hz], [hx, 1.31, hz], 0.012, iron);
  { const od = new THREE.Mesh(new THREE.CircleGeometry(0.3, 16, 0, Math.PI), iron); od.position.set(hx + 1.25, 1.2, hz + 0.46); g.add(od); g.add(box(0.6, 0.3, 0.02, iron, hx + 1.25, 1.05, hz + 0.46)); g.add(ink(box(0.1, 0.05, 0.05, std({ color: 0x8a6a3a }), hx + 1.25, 1.15, hz + 0.5), 1.1)); }
  { const bel = new THREE.Group(); bel.position.set(hx - 1.6, 0.6, hz + 0.6); bel.rotation.set(0, 0.4, 1.2); g.add(bel); const bd = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 8), std({ color: 0x6a3a22 })); bd.scale.set(1, 0.3, 0.7); bel.add(ink(bd, 1.08)); bel.add(cyl(0.02, 0.04, 0.25, iron, 0.32, 0, 0, 6).rotateZ(Math.PI / 2)); }
  for (let i = 0; i < 3; i++) { const fi = cyl(0.018, 0.018, 0.9, iron, hx + 1.65 + i * 0.08, 0.45, hz + 0.55, 6); fi.rotation.z = -0.15; g.add(fi); }
  // pewter and plates on the mantel
  const pewter = std({ color: 0x9aa0a6, metalness: 0.6, roughness: 0.35 });
  for (let i = 0; i < 4; i++) g.add(ink(lathe([[0.001, 0], [0.08, 0], [0.09, 0.05], [0.06, 0.18], [0.07, 0.22]], pewter, 12), 1.08).translateX(hx - 1.2 + i * 0.75).translateY(2.1).translateZ(hz + 0.2));
  // table with the hero props: sweating stoneware jug, loaf, butter crock under a cloth, bowl of plums, a candle in pewter
  const tableM = std({ map: T.wood([196, 166, 120], 5, false) }), legM = std({ map: T.wood([150, 112, 72], 3) });
  const TX = 0.3, TZ = 0.6;
  g.add(ink(box(2.2, 0.1, 1.1, tableM, TX, 0.78, TZ), 1.02)); for (const [x, z] of [[-0.95, -0.45], [0.95, -0.45], [-0.95, 0.45], [0.95, 0.45]]) g.add(box(0.1, 0.74, 0.1, legM, TX + x, 0.37, TZ + z));
  const stone = std({ map: T.plaster('#9aa6b0'), roughness: 0.6 });
  const jug = lathe([[0.001, 0], [0.13, 0], [0.17, 0.08], [0.18, 0.2], [0.14, 0.32], [0.09, 0.38], [0.1, 0.42], [0.11, 0.44]], stone, 20); jug.position.set(TX + 0.2, 0.83, TZ + 0.1); g.add(K.inkOffset(jug, 0.012));
  const band = cyl(0.181, 0.181, 0.04, std({ color: 0x2a4a8a }), 0, 0.2, 0, 20); jug.add(band);
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.02, 6, 12, Math.PI * 1.1), stone); handle.position.set(-0.17, 0.25, 0); handle.rotation.z = Math.PI / 2 + 0.2; jug.add(ink(handle, 1.1));
  const dropM = std({ color: 0xe8f6ff, roughness: 0.02, metalness: 0.3, emissive: 0x2a4a66 }); for (let i = 0; i < 22; i++) { const a = r() * 6.3, y = 0.06 + r() * 0.3, rr = 0.17 * (1 - Math.abs(y - 0.2) * 0.4); const dp = new THREE.Mesh(new THREE.SphereGeometry(0.006 + r() * 0.004, 6, 5), dropM); dp.scale.y = 1.6; dp.position.set(Math.cos(a) * rr, y, Math.sin(a) * rr); jug.add(dp); }
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.16, 0.24, 24), new THREE.MeshStandardMaterial({ color: 0x8a6a48, transparent: true, opacity: 0.6, roughness: 0.1 })); ring.rotation.x = -Math.PI / 2; ring.position.set(TX + 0.2, 0.832, TZ + 0.1); g.add(ring);
  H.jugAt = [TX + 0.2, 1.05, TZ + 0.1];
  { const lf = new THREE.Mesh(new THREE.SphereGeometry(0.18, 14, 10), std({ color: 0xb07a3a })); lf.scale.set(1.4, 0.7, 0.9); lf.position.set(TX - 0.55, 0.92, TZ - 0.15); g.add(K.inkOffset(lf, 0.012)); for (let i = 0; i < 3; i++) g.add(box(0.03, 0.02, 0.18, std({ color: 0xe8c890 }), TX - 0.7 + i * 0.13, 1.04, TZ - 0.15, 0, false)); }
  { const cr = lathe([[0.001, 0], [0.12, 0], [0.13, 0.16], [0.11, 0.18]], std({ color: 0xc9a46a }), 16); cr.position.set(TX - 0.15, 0.83, TZ - 0.35); g.add(K.inkOffset(cr, 0.01)); const cl = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 6, 0, 6.3, 0, 1.4), std({ color: 0xf2efe6, side: THREE.DoubleSide })); cl.scale.y = 0.6; cl.position.set(TX - 0.15, 0.97, TZ - 0.35); g.add(cl); }
  { const bw = lathe([[0.001, 0], [0.09, 0], [0.18, 0.08], [0.2, 0.1]], std({ color: 0xe9e2d0 }), 18); bw.position.set(TX + 0.65, 0.83, TZ - 0.2); g.add(K.inkOffset(bw, 0.01)); for (let i = 0; i < 7; i++) { const pl = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 8), std({ color: 0x5a2a6a, roughness: 0.4 })); pl.position.set(TX + 0.65 + (r() - 0.5) * 0.18, 0.92 + (i > 4 ? 0.05 : 0), TZ - 0.2 + (r() - 0.5) * 0.18); g.add(pl); } }
  { const cs = lathe([[0.001, 0], [0.07, 0], [0.03, 0.03], [0.02, 0.1], [0.04, 0.12]], pewter, 12); cs.position.set(TX - 0.8, 0.83, TZ + 0.3); g.add(cs); g.add(cyl(0.015, 0.015, 0.16, std({ color: 0xf6f0de }), TX - 0.8, 1.03, TZ + 0.3, 8)); const fl = new THREE.Mesh(new THREE.SphereGeometry(0.014, 6, 5), new THREE.MeshBasicMaterial({ color: 0xffb347 })); fl.scale.y = 1.8; fl.position.set(TX - 0.8, 1.13, TZ + 0.3); g.add(fl); }
  for (const [x, z, ry] of [[TX - 0.6, TZ + 0.9, 0.2], [TX + 0.7, TZ + 0.85, -0.1]]) { const st = new THREE.Group(); st.position.set(x, 0, z); st.rotation.y = ry; g.add(st); st.add(ink(box(0.42, 0.06, 0.42, legM, 0, 0.46, 0), 1.04)); for (const [a, b] of [[-0.16, -0.16], [0.16, -0.16], [-0.16, 0.16], [0.16, 0.16]]) st.add(box(0.05, 0.46, 0.05, legM, a, 0.23, b)); }
  // dresser on the right wall (z -3 … -1.2), the bare gap beside it (z -1.1 … 0.1), then churn, bucket, broom, spinning wheel
  { const dr = new THREE.Group(); dr.position.set(X - 0.3, 0, -2.15); dr.rotation.y = -Math.PI / 2; g.add(dr); const dm = std({ map: T.wood([120, 80, 48], 5) });
    dr.add(ink(box(1.6, 0.9, 0.55, dm, 0, 0.45, 0), 1.02)); dr.add(box(1.6, 1.4, 0.06, dm, 0, 1.6, -0.24)); for (const y of [1.25, 1.75, 2.25]) dr.add(box(1.6, 0.05, 0.3, dm, 0, y, -0.1)); for (const s of [-1, 1]) dr.add(box(0.06, 1.45, 0.3, dm, s * 0.78, 1.62, -0.1));
    for (let row = 0; row < 3; row++) for (let i = 0; i < 4; i++) { const pl = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.02, 18), std({ color: row === 1 ? 0x9aa0a6 : 0xf2efe6, metalness: row === 1 ? 0.5 : 0 })); pl.rotation.x = Math.PI / 2 - 0.25; pl.position.set(-0.55 + i * 0.37, 1.43 + row * 0.5, -0.12); dr.add(ink(pl, 1.06)); if (row !== 1) { const rim = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.008, 4, 18), std({ color: 0x2a4a8a })); rim.position.copy(pl.position).add(new THREE.Vector3(0, 0, 0.012)); rim.rotation.x = -0.25; dr.add(rim); } }
    for (const s of [-1, 1]) dr.add(box(0.7, 0.75, 0.02, std({ map: T.wood([100, 66, 40], 3) }), s * 0.38, 0.45, 0.28)); }
  const fridge = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 1.75), new THREE.MeshBasicMaterial({ map: T.fridgeOutline(), transparent: true, depthWrite: false, fog: false })); fridge.position.set(X - 0.02, 0.9, -0.5); fridge.rotation.y = -Math.PI / 2; fridge.renderOrder = 5; g.add(fridge);
  H.open.fridge = (v) => { fridge.visible = v > 0.02; const s = v < 1 ? Math.min(1.08, v * 1.15) : 1; fridge.scale.set(s, s, 1); };
  H.fridgeAt = [X - 0.02, 0.9, -0.5];
  { const ch = lathe([[0.001, 0], [0.2, 0], [0.16, 0.8], [0.18, 0.86]], std({ map: T.wood([150, 110, 70], 6) }), 16); ch.position.set(X - 0.4, 0, 0.7); g.add(K.inkOffset(ch, 0.012)); g.add(cyl(0.025, 0.025, 0.7, legM, X - 0.4, 1.1, 0.7, 6)); for (const y of [0.15, 0.7]) g.add(cyl(0.205, 0.17, 0.04, iron, X - 0.4, y, 0.7, 16)); }
  { const bk = new THREE.Group(); bk.position.set(X - 0.5, 0, 1.4); g.add(bk); K.bucket(bk, 0, 0, std({ map: T.wood([140, 100, 60], 6) })); const dip = cyl(0.015, 0.015, 0.45, legM, 0.06, 0.4, 0, 6); dip.rotation.z = 0.5; bk.add(dip); }
  K.broom(g, X - 0.15, 2.0, -0.12, legM);
  { const sw = new THREE.Group(); sw.position.set(-2.6, 0, -2.0); sw.rotation.y = 0.7; g.add(sw); const wd = legM; sw.add(ink(new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.03, 6, 24), wd), 1.08).translateY(0.95)); for (let i = 0; i < 8; i++) { const sp = box(0.02, 0.88, 0.02, wd, 0, 0.95, 0); sp.rotation.z = i * Math.PI / 8; sw.add(sp); } for (const [x, a] of [[-0.3, 0.2], [0.3, -0.2]]) { const lg = box(0.05, 1.0, 0.05, wd, x, 0.5, 0.2); lg.rotation.z = a; sw.add(lg); } sw.add(ink(box(1.0, 0.08, 0.25, wd, 0, 0.4, 0.35), 1.04)); sw.add(cyl(0.03, 0.03, 0.4, std({ color: 0xe9dcb8 }), 0.55, 0.85, 0.35, 8)); }
  // herbs and dried peppers hanging from the beam over the table
  for (let i = 0; i < 6; i++) { const x = -1.6 + i * 0.6, z = -0.5; K.rope(g, [x, HT - 0.24, z], [x, HT - 0.55, z], 0.008); if (i % 3 === 2) { for (let j = 0; j < 5; j++) { const pp = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.14, 6), std({ color: 0xb02a1a })); pp.rotation.x = Math.PI; pp.position.set(x + (j - 2) * 0.025, HT - 0.62 - (j % 2) * 0.05, z); g.add(pp); } } else { const bn = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.32, 8), std({ color: i % 2 ? 0x6a8a3a : 0x8a9a4a, roughness: 1 })); bn.rotation.x = Math.PI; bn.position.set(x, HT - 0.72, z); g.add(K.inkOffset(bn, 0.01)); } }
  // sunbeam motes through the window
  H.motes = K.dustMotes(g, r, { n: 260, w: 3, h: 2.4, z0: -0.8, d: 1.8, x0: -2.2 });
  return H;
}

// ===================== ice-house workshop =====================
// Plank shed interior: x ∈ [-4, 4], z ∈ [-3, 3]; sun slits between the boards. Three bins in a row along the back wall
// (bin centres BIN_X at z = -1.6) with slate signs 1 · HAY, 2 · STRAW, 3 · RICE HUSKS, an ice block in each packing,
// a measuring stick (marks only) and a drip tray. open.melt 0 … 1 shrinks the blocks (never to nothing) and spreads the
// puddles; open.season 0 snow · 1 leaves · 2 snow selects the window view (left wall).
export const BIN_X = [-2.2, 0, 2.2];
export function buildWorkshop(scene, opts = {}) {
  const g = new THREE.Group(); scene.add(g);
  const H = K.setHandle(g, { center: [0, 0, 0], shadowSize: 7 });
  const r = K.rng(10); const X = 4, Z = 3, HT = 3.0;
  const boardM = std({ map: T.wood([128, 94, 60], 3) }), darkM = std({ map: T.wood([92, 66, 42], 3) });
  K.ground(g, 2 * X, 2 * Z, std({ color: 0x6a5238, roughness: 1 }));
  { const st = T.straw(); for (let i = 0; i < 16; i++) { const m = new THREE.Mesh(new THREE.CircleGeometry(0.25 + r() * 0.25, 7), new THREE.MeshStandardMaterial({ map: st, transparent: true, opacity: 0.85 })); m.rotation.x = -Math.PI / 2; m.rotation.z = r() * 3; m.position.set((r() - 0.5) * 7, 0.01, (r() - 0.3) * 5); g.add(m); } }
  // walls from vertical boards with thin gaps (the sun comes through the cracks)
  const boards = (x0, z0, x1, z1, skip) => { const L = Math.hypot(x1 - x0, z1 - z0), n = Math.floor(L / 0.3), ang = Math.atan2(z1 - z0, x1 - x0); for (let i = 0; i < n; i++) { const u = (i + 0.5) / n; if (skip && skip(x0 + (x1 - x0) * u, z0 + (z1 - z0) * u)) continue; const b = box(0.27, HT, 0.06, i % 3 ? boardM : darkM, x0 + (x1 - x0) * u, HT / 2, z0 + (z1 - z0) * u); b.rotation.y = -ang; g.add(b); } };
  const WIN = { z0: -0.9, z1: 0.5, y0: 1.1, y1: 2.2 };
  boards(-X, -Z, X, -Z); boards(X, -Z, X, Z); boards(-X, Z, X, Z);
  boards(-X, -Z, -X, Z, (x, z) => z > WIN.z0 && z < WIN.z1);
  for (const [y0, y1] of [[0, WIN.y0], [WIN.y1, HT]]) for (let z = WIN.z0 + 0.15; z < WIN.z1; z += 0.3) g.add(box(0.06, y1 - y0, 0.27, boardM, -X, (y0 + y1) / 2, z));
  for (const [w, h, y, z] of [[0.08, WIN.y1 - WIN.y0, (WIN.y0 + WIN.y1) / 2, WIN.z0], [0.08, WIN.y1 - WIN.y0, (WIN.y0 + WIN.y1) / 2, WIN.z1]]) g.add(ink(box(0.12, h, w, std({ color: 0x5a3e26 }), -X + 0.03, y, z), 1.04));
  for (const y of [WIN.y0, WIN.y1]) g.add(ink(box(0.14, 0.08, WIN.z1 - WIN.z0 + 0.1, std({ color: 0x5a3e26 }), -X + 0.03, y, (WIN.z0 + WIN.z1) / 2), 1.04));
  const views = [T.season('snow'), T.season('leaves')]; const viewM = new THREE.MeshBasicMaterial({ map: views[0], fog: false });
  const view = new THREE.Mesh(new THREE.PlaneGeometry(3, 2.4), viewM); view.position.set(-X - 1.2, 1.65, -0.2); view.rotation.y = Math.PI / 2; g.add(view);
  H.open.season = (v) => { viewM.map = views[Math.round(v) % 2]; }; // 0 snow, 1 leaves, 2 snow again
  // roof: rafters and boards
  g.add(box(2 * X, 0.1, 2 * Z, boardM, 0, HT + 0.05, 0)); for (let x = -X + 0.5; x < X; x += 1.0) g.add(ink(box(0.16, 0.2, 2 * Z, darkM, x, HT - 0.1, 0), 1.02));
  // the three test bins
  const packs = [{ word: 'HAY', m: std({ map: T.hay() }) }, { word: 'STRAW', m: std({ map: T.straw([2, 2]) }) }, { word: 'RICE HUSKS', m: std({ map: T.riceHusks() }) }];
  const blocks = [], puddles = [];
  BIN_X.forEach((bx, i) => {
    const bz = -1.6; const bin = new THREE.Group(); bin.position.set(bx, 0, bz); g.add(bin);
    for (const [w, d, x, z] of [[1.5, 0.08, 0, 0.55], [1.5, 0.08, 0, -0.55], [0.08, 1.1, 0.71, 0], [0.08, 1.1, -0.71, 0]]) bin.add(ink(box(w, 0.75, d, darkM, x, 0.45, z), 1.03));
    bin.add(box(1.5, 0.08, 1.1, darkM, 0, 0.1, 0)); for (const [x, z] of [[-0.7, -0.5], [0.7, -0.5], [-0.7, 0.5], [0.7, 0.5]]) bin.add(box(0.08, 0.1, 0.08, darkM, x, 0.05, z));
    const fill = new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.5, 0.98), packs[i].m); fill.position.y = 0.4; bin.add(fill);
    const blk = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.42, 0.44), iceMat()); blk.position.y = 0.72; blk.castShadow = true; bin.add(ink(blk, 1.03)); blocks.push(blk);
    const tray = box(1.7, 0.04, 1.3, std({ color: 0x5a5e66, metalness: 0.5, roughness: 0.4 }), 0, 0.02, 0); tray.position.y = 0.0; bin.add(tray);
    const sg = new THREE.Mesh(new THREE.PlaneGeometry(1.26, 0.42), std({ map: T.slate(i + 1, packs[i].word) })); sg.position.set(0, 1.08, 0.64); sg.rotation.x = -0.12; bin.add(sg); for (const sx of [-0.45, 0.45]) bin.add(box(0.05, 0.6, 0.05, darkM, sx, 0.82, 0.55)); // slate on two posts
    // measuring stick with marks only, standing at the bin's right front corner
    const ms = new THREE.Group(); ms.position.set(0.85, 0, 0.45); bin.add(ms); ms.add(ink(box(0.06, 1.3, 0.04, std({ color: 0xe9dcb8 }), 0, 0.65, 0), 1.06)); for (let y = 0.15; y < 1.3; y += 0.1) ms.add(box(Math.round(y * 10) % 5 === 0 ? 0.06 : 0.035, 0.012, 0.045, std({ color: 0x1b1b1b }), 0.02, y, 0));
    const pd = new THREE.Mesh(new THREE.CircleGeometry(1, 24), new THREE.MeshStandardMaterial({ color: 0x8fb4cc, roughness: 0.05, metalness: 0.5, transparent: true, opacity: 0.85, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 })); pd.rotation.x = -Math.PI / 2; pd.position.set(bx + 0.2, 0.015, bz + 0.9); pd.scale.set(0.01, 0.01, 1); g.add(pd); puddles.push(pd);
  });
  H.open.melt = (v) => { v = Math.min(1, Math.max(0, v)); blocks.forEach((b, i) => { const s = 1 - v * [0.45, 0.55, 0.35][i]; b.scale.set(s, s, s); b.position.y = 0.51 + 0.21 * s; }); puddles.forEach((p, i) => { const s = 0.05 + v * [0.55, 0.65, 0.42][i]; p.scale.set(s * 1.4, s, 1); p.visible = v > 0.01; }); };
  H.binAt = BIN_X.map((x) => [x, 0.72, -1.6]);
  // sacks "RICE HUSKS", a hay bale, a straw bundle, pitchfork + shovel, workbench with the notebook and an ink pot, lantern
  for (const [x, z, ry] of [[3.2, -0.2, 0.3], [3.4, 0.5, -0.4]]) { const s = K.sack(g, x, 0, z, ry, 0xc9b07a); const lb = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.18), std({ map: T.signText('RICE HUSKS', { bg: '#efe2bd', fg: '#3a2410', w: 512, h: 210, border: null, grain: false }) })); lb.position.set(0, 0.22, 0.24); lb.rotation.x = -0.4; s.add(lb); }
  K.hayBale(g, -3.1, 1.6, 0.4); { const sb = cyl(0.3, 0.3, 1.0, std({ map: T.straw() }), -3.3, 0.3, 0.4, 12); sb.rotation.x = Math.PI / 2; g.add(ink(sb, 1.04)); K.rope(g, [-3.3, 0.6, 0.4], [-3.3, 0.6, 0.41], 0.31); }
  K.pitchfork(g, 3.85, 1.6, 0.12, darkM, std({ color: 0x5a5e66, metalness: 0.6 }));
  { const sh = new THREE.Group(); sh.position.set(3.85, 0, 2.2); sh.rotation.z = 0.12; g.add(sh); sh.add(cyl(0.025, 0.025, 1.3, darkM, 0, 0.85, 0, 6)); sh.add(ink(box(0.28, 0.34, 0.03, std({ color: 0x5a5e66, metalness: 0.6 }), 0, 0.15, 0), 1.08)); }
  { const wb = new THREE.Group(); wb.position.set(1.4, 0, 1.7); g.add(wb); wb.add(ink(box(2.0, 0.08, 0.8, boardM, 0, 0.9, 0), 1.02)); for (const [x, z] of [[-0.9, -0.35], [0.9, -0.35], [-0.9, 0.35], [0.9, 0.35]]) wb.add(box(0.08, 0.9, 0.08, darkM, x, 0.45, z));
    const nb = new THREE.Group(); nb.position.set(-0.3, 0.95, 0); nb.rotation.y = 0.2; wb.add(nb); nb.add(ink(box(0.36, 0.03, 0.26, std({ color: 0x6a2a1e }), 0, 0, 0), 1.05)); nb.add(box(0.33, 0.012, 0.24, std({ color: 0xf2ead4 }), 0, 0.02, 0)); for (let i = 0; i < 5; i++) nb.add(box(0.26, 0.004, 0.006, std({ color: 0x5a5a6a }), 0, 0.028, -0.08 + i * 0.04));
    const ip = lathe([[0.001, 0], [0.05, 0], [0.055, 0.04], [0.03, 0.07], [0.03, 0.08]], std({ color: 0x1b1b1b, roughness: 0.3 }), 12); ip.position.set(0.15, 0.94, 0.1); wb.add(ip); const qu = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.32, 5), std({ color: 0xf6f0de })); qu.position.set(0.17, 1.1, 0.1); qu.rotation.z = -0.3; wb.add(qu); }
  H.lamps.push(K.hangingLantern(g, 1.6, HT - 0.2, 1.5, { range: 5 }));
  const fillW = new THREE.PointLight(0xffd8a0, 4, 11, 1.1); fillW.position.set(0, 2.4, 0.5); g.add(fillW); // warm daylight bounce inside the shed
  // god rays through the board gaps: thin additive slabs from the right wall, dust motes in them
  const rayM = new THREE.MeshBasicMaterial({ color: 0xfff0c8, transparent: true, opacity: 0.12, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
  const rays = []; for (let i = 0; i < 6; i++) { const ry = new THREE.Mesh(new THREE.PlaneGeometry(0.06, 6), rayM); ry.position.set(X - 2.2, 1.6, -2.2 + i * 0.85); ry.rotation.set(0, Math.PI / 2, 0.95); g.add(ry); rays.push(ry); }
  H.motes = K.dustMotes(g, r, { n: 300, w: 6, h: 2.6, z0: -2.6, d: 5, x0: 0 });
  H.open.melt(opts.melt ?? 0); H.openRest.melt = opts.melt ?? 0; H.openRest.season = 0;
  H.tick = (t) => { rays.forEach((ry, i) => { ry.material.opacity = 0.1 + 0.04 * Math.sin(t * 0.7 + i); }); };
  return H;
}

// ===================== sawmill, 1830s =====================
// Open-sided mill on a riverbank: water wheel (turns), an up-and-down sash saw in a wooden frame (moves), a log on a carriage,
// sawdust pouring from under the saw into a big heap, a chute toward the river, stacked boards, logs, a cant hook, "SAWMILL".
// Floor y 0 (x ∈ [-4, 4], z ∈ [-3, 3]); the river runs along x = 6 … 30 at y = -0.8; saw at SAW = [0, 0, 0].
export function buildSawmill(scene, opts = {}) {
  const g = new THREE.Group(); scene.add(g);
  const H = K.setHandle(g, { center: [0, 0, 0], shadowSize: 12 });
  const r = K.rng(1833);
  const woodL = std({ map: T.wood([150, 110, 70], 5, false) }), woodD = std({ map: T.wood([100, 70, 45], 4) }), barkM = std({ map: T.bark() }), endM = std({ map: T.logEnd() });
  K.ground(g, 80, 80, std({ color: 0x6f8a46, roughness: 1 }));
  const floorT = T.wood([160, 120, 78], 8, false); floorT.repeat.set(2, 2); g.add(box(9, 0.25, 7, std({ map: floorT }), 0, 0.12, 0));
  for (const [x, z] of [[-4.3, -3.3], [4.3, -3.3], [-4.3, 3.3], [4.3, 3.3], [0, -3.3], [0, 3.3]]) g.add(ink(box(0.3, 4.4, 0.3, woodD, x, 2.45, z), 1.02));
  const shT = T.shingles(); shT.repeat.set(3, 2); for (const s of [-1, 1]) { const rf = box(10, 0.15, 4.4, std({ map: shT }), 0, 5.3, s * 1.9); rf.rotation.x = s * 0.45; g.add(ink(rf, 1.01)); }
  const sg = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 0.8), std({ map: T.signText('SAWMILL', { bg: '#3a2414', fg: '#f4e6c0', w: 1024, h: 256 }) })); sg.position.set(0, 4.5, 3.48); g.add(sg); g.add(ink(box(3.3, 0.9, 0.06, woodD, 0, 4.5, 3.44), 1.02));
  // the river and the mill race with the water wheel on the +x side
  const riv = new THREE.Mesh(new THREE.PlaneGeometry(26, 80), std({ map: (() => { const t2 = T.water('river'); t2.repeat.set(3, 9); return t2; })(), roughness: 0.4 })); riv.rotation.x = -Math.PI / 2; riv.position.set(18, -0.8, 0); g.add(riv);
  g.add(box(1.6, 1.2, 80, std({ color: 0x6a5a3e }), 5.6, -0.3, 0)); // bank
  const wheel = new THREE.Group(); wheel.position.set(5.6, 1.4, -1.0); g.add(wheel);
  { const rim = std({ map: T.wood([110, 80, 50], 3) }); for (const zz of [-0.45, 0.45]) { const rr = new THREE.Mesh(new THREE.TorusGeometry(2.0, 0.09, 6, 32), rim); rr.position.z = zz; wheel.add(ink(rr, 1.04)); for (let i = 0; i < 8; i++) { const sp = box(0.08, 4.0, 0.08, rim, 0, 0, zz); sp.rotation.z = i * Math.PI / 8; wheel.add(sp); } }
    for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2; const pd = box(0.08, 0.5, 1.0, woodD, Math.cos(a) * 2.0, Math.sin(a) * 2.0, 0); pd.rotation.z = a; wheel.add(pd); } wheel.add(cyl(0.18, 0.18, 1.6, woodD, 0, 0, 0, 10).rotateX(Math.PI / 2)); }
  g.add(ink(box(0.3, 1.8, 0.3, woodD, 5.6, 0.6, -1.9), 1.03)); g.add(ink(box(0.3, 1.8, 0.3, woodD, 5.6, 0.6, -0.1), 1.03));
  const foamT = T.foam(9); const splash = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.2), new THREE.MeshBasicMaterial({ map: foamT, transparent: true, depthWrite: false })); splash.rotation.x = -Math.PI / 2; splash.position.set(5.9, -0.77, -1.0); g.add(splash);
  // the sash saw: two uprights, a sash (frame) that slides up and down with the blade in it, the log on a carriage
  const SAW = new THREE.Group(); SAW.position.set(0, 0.25, 0); g.add(SAW);
  for (const x of [-0.55, 0.55]) SAW.add(ink(box(0.22, 3.6, 0.22, woodD, x, 1.8, -0.6), 1.03));
  SAW.add(ink(box(1.5, 0.22, 0.22, woodD, 0, 3.6, -0.6), 1.03));
  const sash = new THREE.Group(); SAW.add(sash);
  for (const x of [-0.4, 0.4]) sash.add(ink(box(0.12, 2.2, 0.12, woodL, x, 1.6, -0.6), 1.04)); for (const y of [0.5, 2.7]) sash.add(ink(box(0.92, 0.12, 0.14, woodL, 0, y, -0.6), 1.04));
  const bladeM = std({ color: 0xb8c0c8, metalness: 0.8, roughness: 0.3 }); sash.add(box(0.02, 2.1, 0.12, bladeM, 0, 1.6, -0.6)); for (let y = 0.6; y < 2.6; y += 0.08) { const tth = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.05, 3), bladeM); tth.position.set(0, y, -0.53); tth.rotation.x = Math.PI / 2; sash.add(tth); }
  // carriage rails and the log being sawn (a kerf already partway along)
  for (const z of [-1.0, -0.2]) SAW.add(box(7.5, 0.1, 0.12, woodD, 0, 0.05, z));
  const carriage = new THREE.Group(); carriage.position.set(0.8, 0, 0); SAW.add(carriage); carriage.add(ink(box(4.4, 0.18, 1.1, woodL, 0, 0.2, -0.6), 1.02));
  const log = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.45, 4.2, 18), [barkM, endM, endM]); log.rotation.z = Math.PI / 2; log.position.set(0, 0.73, -0.6); log.castShadow = true; carriage.add(K.inkOffset(log, 0.025));
  carriage.add(box(1.6, 0.86, 0.025, std({ color: 0x1a1008 }), -1.25, 0.73, -0.6)); // the kerf (cut so far)
  // sawdust: pouring from under the saw (particles), a big smooth heap, and a chute dumping some toward the river
  const sawT = T.sawdust([2, 2]); const sawM = std({ map: sawT, roughness: 1 });
  const heap = new THREE.Mesh(new THREE.LatheGeometry([[2.3, -0.02], [2.0, 0.25], [1.4, 0.75], [0.7, 1.15], [0.001, 1.3]].map(([x, y]) => new THREE.Vector2(x, y)), 28), sawM); heap.position.set(-0.4, 0.25, 1.4); heap.scale.set(1, 1, 0.65); heap.castShadow = true; heap.receiveShadow = true; g.add(K.inkOffset(heap, 0.025));
  const PN = 160; const pp = new Float32Array(PN * 3); const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pp, 3));
  const pour = new THREE.Points(pg, new THREE.PointsMaterial({ color: 0xd9b27a, size: 0.045, transparent: true, opacity: 0.95, depthWrite: false })); pour.frustumCulled = false; g.add(pour);
  const seeds = []; for (let i = 0; i < PN; i++) seeds.push([r(), r(), r()]);
  { const ch = new THREE.Group(); ch.position.set(2.6, 0.9, 1.6); ch.rotation.z = -0.35; g.add(ch); ch.add(ink(box(2.8, 0.06, 0.6, woodD, 0, 0, 0), 1.03)); for (const s of [-1, 1]) ch.add(box(2.8, 0.25, 0.05, woodD, 0, 0.12, s * 0.3)); ch.add(box(2.6, 0.05, 0.5, sawM, 0, 0.05, 0)); for (const [x, y] of [[-1.0, -0.5], [0.9, -0.95]]) ch.add(box(0.1, 1.0, 0.1, woodD, x, y, 0)); }
  { const sp = new THREE.Mesh(new THREE.CircleGeometry(1.6, 18), new THREE.MeshStandardMaterial({ map: sawT, transparent: true, opacity: 0.8 })); sp.rotation.x = -Math.PI / 2; sp.position.set(7.4, -0.78, 1.8); sp.scale.set(1.6, 0.8, 1); g.add(sp); } // sawdust drifting on the river (fact-check row 20)
  // boards stacked, logs waiting (bark sides, ring ends), a cant hook leaning, a hand cart
  for (let l = 0; l < 6; l++) for (let i = 0; i < 5; i++) g.add(ink(box(3.2, 0.06, 0.28, woodL, -2.0, 0.28 + l * 0.07, -2.2 + i * 0.3 + (l % 2) * 0.05), 1.02));
  for (let i = 0; i < 5; i++) { const lg = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.38, 4.0, 16), [barkM, endM, endM]); lg.rotation.z = Math.PI / 2; lg.position.set(-1.2 + (i % 3) * 0.05, 0.37 + Math.floor(i / 3) * 0.62, -5.0 - (i % 3) * 0.76 + Math.floor(i / 3) * 0.38); lg.castShadow = true; g.add(K.inkOffset(lg, 0.02)); }
  { const ck = new THREE.Group(); ck.position.set(-3.6, 0.25, -0.9); ck.rotation.z = 0.25; g.add(ck); ck.add(cyl(0.035, 0.04, 1.5, woodD, 0, 0.75, 0, 8)); const hk = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.025, 6, 12, Math.PI * 1.2), std({ color: 0x2a2c30, metalness: 0.5 })); hk.position.set(0.12, 1.1, 0); ck.add(ink(hk, 1.1)); }
  K.handCart(g, -6.2, 1.8, 0.6, woodL, woodD, false); K.sack(g, 3.0, 0.25, -2.4, 0.2, 0xc9b07a);
  // pine forest backdrop (scenery only)
  const pineM = std({ color: 0x2f5a36, roughness: 1, flatShading: true });
  for (let i = 0; i < 40; i++) { const a = r() * Math.PI - Math.PI, R = 20 + r() * 20; const x = Math.cos(a) * R * 0.9 - 4, z = Math.sin(a) * R; const s = 1 + r() * 0.8; const t = new THREE.Group(); t.position.set(x, 0, z); t.scale.setScalar(s); g.add(t); t.add(cyl(0.2, 0.25, 1.5, std({ color: 0x4a3420 }), 0, 0.75, 0, 6)); for (let k = 0; k < 4; k++) { const c = new THREE.Mesh(new THREE.ConeGeometry(2.0 - k * 0.42, 2.0, 9), pineM); c.position.y = 1.6 + k * 1.15; t.add(c); } }
  H.motes = K.dustMotes(g, r, { n: 220, w: 6, h: 3.5, z0: -3, d: 6, x0: 0 });
  H.sawAt = [0, 1.0, -0.6]; H.heapAt = [-0.4, 1.0, 1.4];
  H.tick = (t) => {
    wheel.rotation.z = -t * 0.9; foamT.offset.x = t * 0.4;
    sash.position.y = Math.sin(t * 9) * 0.22; // up-and-down sash saw
    for (let i = 0; i < PN; i++) { const [a, b, c] = seeds[i]; const age = (t * 0.9 + a) % 1; pp[i * 3] = -0.05 + (b - 0.5) * 0.25 + age * -0.25; pp[i * 3 + 1] = 0.95 - age * 0.95 + 0.3; pp[i * 3 + 2] = -0.25 + age * 1.3 + (c - 0.5) * 0.25; }
    pg.attributes.position.needsUpdate = true;
  };
  return H;
}
