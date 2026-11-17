// S02 set: Tropical Harbour, one base with two dressings (art brief 1.4).
//   place: 'martinique' — Saint-Pierre 1806: cream/white plaster with ochre trim, red clay tile roofs, blue and sea-green louvred
//          shutters, balconies with turned balusters over a street arcade, striped awnings, coconut palms + breadfruit,
//          rowing boats and a canoe, turquoise sea, Mont Pelée backdrop. Signs in plain French that English readers can read.
//   place: 'calcutta'   — Hooghly riverfront 1833: pale yellow-ochre stucco, flat roofs with balustrade parapets, two-storey
//          columns and deep verandahs, green louvres, plain cotton canopies on bamboo poles, a wide ghat down to brown-green
//          river water, banyan with hanging roots, country boats and a budgerow, low neoclassical skyline with a spire and
//          the Ochterlony column. English signs (British-run port): CUSTOM HOUSE, STRAND ROAD, CLOTH MERCHANT.
// Layout: quay at y = 0 for z < 0, water at y = WATER_Y (-2) for z > 0; building fronts at z = -14 (arcade/colonnade to z ≈ -11.6).
// The ship lies alongside at shipDock (heading π: bow to -x, port side to the quay). People: quay y 0; deck y -0.6 (no riding yet).
// Handle extras: movers.ship, open.sails/hatch/moored, shipDock, waterY, cameoSpot ([x, y, z] behind an open upper window).
import * as THREE from '/node_modules/three/build/three.module.js';
import * as T from './textures.js';
import * as K from './kit.js';
import { buildShip, waterPlane, gulls } from './ship.js';
const { std, box, cyl, ink } = K;
export const WATER_Y = -2;

// palm: curved trunk of rings, a crown of frond cards, coconuts
const PALM_FROND = {}; let palmBark = null;
export function palm(parent, x, z, h = 7, lean = 0.25, ry = 0, y = 0) {
  palmBark = palmBark || std({ map: T.bark([120, 98, 70]) });
  const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = ry; parent.add(g);
  const pts = []; for (let i = 0; i <= 10; i++) { const u = i / 10; pts.push(new THREE.Vector3(Math.sin(u * 1.4) * lean * h * 0.6, u * h, 0)); }
  const curve = new THREE.CatmullRomCurve3(pts);
  const trunk = new THREE.Mesh(new THREE.TubeGeometry(curve, 20, 0.2, 8), palmBark); trunk.castShadow = true; g.add(K.inkOffset(trunk, 0.03));
  for (let i = 1; i < 10; i++) { const p = curve.getPoint(i / 10); const rg = new THREE.Mesh(new THREE.TorusGeometry(0.21, 0.025, 4, 12), std({ color: 0x6b5638 })); rg.position.copy(p); rg.rotation.x = Math.PI / 2; g.add(rg); }
  const top = curve.getPoint(1);
  const fm = PALM_FROND.m || (PALM_FROND.m = new THREE.MeshStandardMaterial({ map: T.palmLeaf(), transparent: true, alphaTest: 0.35, side: THREE.DoubleSide, roughness: 0.8 }));
  for (let i = 0; i < 9; i++) {
    const a = i / 9 * Math.PI * 2 + ry; const fr = new THREE.Group(); fr.position.copy(top); fr.rotation.y = a; g.add(fr);
    const geo = new THREE.PlaneGeometry(2.4, 3.8, 2, 8); const p2 = geo.attributes.position; for (let j = 0; j < p2.count; j++) { const v = (p2.getY(j) + 1.9) / 3.8, xx = p2.getX(j) * Math.sin(Math.min(1, v * 3) * Math.PI / 2 + 0.2) * (1 - v * 0.4); p2.setXYZ(j, xx, -v * v * 2.0 + 0.3 - Math.abs(xx) * 0.35, v * 3.5); } // drooping frond, folded into a shallow V geo.computeVertexNormals();
    const m = new THREE.Mesh(geo, fm); m.rotation.x = -0.15 + (i % 3) * 0.1; m.castShadow = true; fr.add(m);
  }
  for (let i = 0; i < 4; i++) { const c = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8), std({ color: i % 2 ? 0x5a3e1e : 0x7a8a2a })); c.position.copy(top).add(new THREE.Vector3(Math.cos(i * 1.6) * 0.25, -0.25, Math.sin(i * 1.6) * 0.25)); g.add(ink(c, 1.08)); }
  return g;
}
// broad shade tree (breadfruit: big glossy leaves; banyan: wide crown + hanging aerial roots)
function shadeTree(parent, x, z, kind, s = 1) {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.scale.setScalar(s); parent.add(g);
  const barkM = std({ map: T.bark(kind === 'banyan' ? [120, 110, 95] : [92, 70, 50]) });
  const trunkR = kind === 'banyan' ? 0.75 : 0.35;
  g.add(K.inkOffset(cyl(trunkR * 0.8, trunkR * 1.2, 4.2, barkM, 0, 2.1, 0, 12), 0.04));
  const r = K.rng(Math.round(x * 7 + z));
  const leafCols = kind === 'banyan' ? [0x2f6a34, 0x3a7a3c, 0x285c2c] : [0x3d8a3a, 0x4f9a45, 0x2f7a30];
  const crown = new THREE.Group(); crown.position.y = 4.4; g.add(crown);
  const n = kind === 'banyan' ? 0 : 6, spread = 2.4;
  if (kind === 'banyan') { // wide layered canopy: three tiers, each one smooth flattened dome with a scalloped edge
    for (const [ty, R, hh, col] of [[0.0, 6.2, 1.3, 0x2a5e30], [0.9, 4.8, 1.2, 0x347034], [1.7, 3.0, 1.0, 0x3f7f3a]]) {
      const pts = []; for (let i = 0; i <= 10; i++) { const a = i / 10 * Math.PI / 2; pts.push(new THREE.Vector2(Math.cos(a) * R + 0.001, Math.sin(a) * hh)); }
      pts.unshift(new THREE.Vector2(R * 0.82, -0.35));
      const geo = new THREE.LatheGeometry(pts, 36); const p2 = geo.attributes.position;
      for (let i = 0; i < p2.count; i++) { const x = p2.getX(i), z = p2.getZ(i), y = p2.getY(i), a = Math.atan2(z, x); const k = 1 + 0.07 * Math.sin(a * 9 + ty * 3) * (1 - Math.max(0, y) / hh); p2.setX(i, x * k); p2.setZ(i, z * k); }
      geo.computeVertexNormals(); const m = new THREE.Mesh(geo, std({ color: col, roughness: 0.95 })); m.position.y = ty; m.castShadow = true; m.receiveShadow = true; crown.add(K.inkOffset(m, 0.05));
      for (let j = 0; j < 40; j++) { const a = r() * 6.28, rr = R * (0.3 + r() * 0.65); const lf = new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 4), std({ color: j % 2 ? 0x4f9a45 : 0x2f6a34 })); lf.scale.set(1.4, 0.4, 0.9); lf.position.set(Math.cos(a) * rr, ty + Math.sqrt(Math.max(0, 1 - (rr / R) ** 2)) * hh + 0.03, Math.sin(a) * rr); lf.rotation.y = a; crown.add(lf); } // leaf glints on top
    }
  }
  for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, rr = i ? spread * (0.5 + r() * 0.5) : 0; const m = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), std({ color: leafCols[i % 3], roughness: 0.9 })); m.scale.set(1.8 + r(), 1.1 + r() * 0.4, 1.8 + r()); m.position.set(Math.cos(a) * rr, (r() - 0.3) * 0.8, Math.sin(a) * rr); m.castShadow = true; crown.add(m); }
  if (kind === 'breadfruit') for (let i = 0; i < 7; i++) { const f = new THREE.Mesh(new THREE.SphereGeometry(0.17, 10, 8), std({ color: 0x8fb33a })); const a = r() * 6.3; f.position.set(Math.cos(a) * 1.9, -0.9, Math.sin(a) * 1.9); crown.add(ink(f, 1.08)); }
  if (kind === 'banyan') { // limbs and hanging aerial roots, a few reaching the ground as props
    for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2 + 0.3; K.rope(g, [0, 3.6, 0], [Math.cos(a) * 3.4, 4.6, Math.sin(a) * 3.4], 0.22, barkM); }
    const rootM = std({ color: 0x7a6a55, roughness: 1 });
    for (let i = 0; i < 40; i++) { const a = r() * 6.3, rr = 1.2 + r() * 3.6, L = 1.2 + r() * 2.4; const reach = i % 5 === 0; K.rope(g, [Math.cos(a) * rr, 4.3, Math.sin(a) * rr], [Math.cos(a) * rr + 0.05, reach ? 0 : 4.3 - L, Math.sin(a) * rr], reach ? 0.12 : 0.055, rootM); }
  }
  return g;
}
// small boat (rowing boat, canoe, country boat with a thatched hood, budgerow with a cabin)
export function boat(parent, x, z, ry, kind = 'row', col = 0x3c6b88, y = WATER_Y) {
  const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = ry; parent.add(g);
  const L = { row: 1.9, canoe: 2.6, country: 3.6, budgerow: 5.2 }[kind], B = { row: 0.7, canoe: 0.42, country: 1.0, budgerow: 1.5 }[kind];
  const hb = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 10, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), std({ color: col, side: THREE.DoubleSide }));
  hb.scale.set(L, kind === 'row' || kind === 'canoe' ? 0.55 : 0.8, B); hb.position.y = hb.scale.y * 0.6; hb.castShadow = true; g.add(K.inkOffset(hb, 0.03));
  const deckY = hb.scale.y * 0.6 - 0.02;
  const inside = new THREE.Mesh(new THREE.CircleGeometry(1, 24), std({ map: T.wood([130, 95, 60], 6) })); inside.rotation.x = -Math.PI / 2; inside.scale.set(L * 0.94, B * 0.9, 1); inside.position.y = deckY; g.add(inside);
  const wood = std({ map: T.wood([110, 78, 48], 3) });
  if (kind === 'row') { for (const xx of [-0.5, 0.5]) g.add(box(0.25, 0.06, B * 1.6, wood, xx, deckY + 0.06, 0)); for (const s of [1, -1]) { const oar = box(2.2, 0.05, 0.08, wood, 0.2, deckY + 0.1, s * 0.25); oar.rotation.y = s * 0.08; g.add(oar); } }
  if (kind === 'canoe') { const pd = box(1.2, 0.04, 0.12, wood, 0.3, deckY + 0.08, 0.1); pd.rotation.y = 0.3; g.add(pd); }
  if (kind === 'country' || kind === 'budgerow') {
    for (const s of [1, -1]) { const post = cyl(0.06, 0.08, 1.0, wood, s * L * 0.98, deckY + 0.4, 0, 6); post.rotation.z = s * 0.5; g.add(ink(post, 1.1)); } // raised ends
    if (kind === 'country') { const hood = new THREE.Mesh(new THREE.CylinderGeometry(B * 0.85, B * 0.85, L * 0.7, 14, 1, true, 0, Math.PI), std({ map: T.hay(), color: 0x9a7a44, side: THREE.DoubleSide })); hood.rotation.z = Math.PI / 2; hood.position.set(-0.2, deckY, 0); g.add(K.inkOffset(hood, 0.02)); }
    else { const cab = new THREE.Group(); cab.position.set(-0.6, deckY, 0); g.add(cab); cab.add(ink(box(L * 0.9, 1.2, B * 1.4, std({ color: 0xe9dcb8 }), 0, 0.6, 0), 1.03)); cab.add(ink(box(L * 0.96, 0.1, B * 1.6, std({ color: 0x6a3a22 }), 0, 1.25, 0), 1.03));
      for (let i = -2; i <= 2; i++) for (const s of [1, -1]) cab.add(box(0.4, 0.45, 0.04, std({ color: 0x2f6a4a }), i * 0.85, 0.7, s * B * 0.71)); // green louvred windows
      g.add(ink(cyl(0.06, 0.08, 4.0, wood, 1.4, deckY + 2.0, 0, 8), 1.1)); }
  }
  return g;
}

// a street building: walls (front wall built as one extruded shape so it can have real openings), roof, facade features
function streetHouse(parent, o) {
  const g = new THREE.Group(); g.position.set(o.x, 0, o.z); parent.add(g);
  const { w, d, h } = o; const wallM = std({ map: o.wallTex, color: o.wallCol ?? 0xffffff });
  g.add(box(w, h, d - 0.25, wallM, 0, h / 2, -0.125));
  const fs = new THREE.Shape(); fs.moveTo(-w / 2, 0); fs.lineTo(w / 2, 0); fs.lineTo(w / 2, h); fs.lineTo(-w / 2, h); fs.closePath();
  for (const [hx, hy, hw, hh] of o.holes || []) { const p = new THREE.Path(); p.moveTo(hx - hw / 2, hy - hh / 2); p.lineTo(hx - hw / 2, hy + hh / 2); p.lineTo(hx + hw / 2, hy + hh / 2); p.lineTo(hx + hw / 2, hy - hh / 2); p.closePath(); fs.holes.push(p); }
  const fg = new THREE.ExtrudeGeometry(fs, { depth: 0.25, bevelEnabled: false }); { const p = fg.attributes.position, u = fg.attributes.uv; for (let i = 0; i < p.count; i++) u.setXY(i, p.getX(i) / 4, p.getY(i) / 4); }
  const front = new THREE.Mesh(fg, wallM); front.position.z = d / 2 - 0.25; front.castShadow = true; front.receiveShadow = true; g.add(front);
  // trim bands (cornice + string course)
  if (o.trim != null) { const tm = std({ color: o.trim }); g.add(ink(box(w + 0.2, 0.3, d + 0.2, tm, 0, h - 0.15, 0), 1.01)); g.add(box(w + 0.1, 0.18, 0.12, tm, 0, 3.55, d / 2 + 0.04)); for (const s of [-1, 1]) g.add(box(0.3, h, 0.1, tm, s * (w / 2 - 0.15), h / 2, d / 2 + 0.03)); }
  return g;
}
// tile roof with the ridge along the street (x): two pitches + gable ends
function tileRoof(g, w, d, h, rh, tileM, wallM) {
  const slope = Math.hypot(d / 2, rh), ang = Math.atan2(rh, d / 2), ov = 0.5;
  for (const s of [-1, 1]) { const p = box(w + ov * 2, 0.16, slope + ov, tileM, 0, h + rh / 2 - ov * Math.sin(ang) / 2, s * (d / 4 + ov * Math.cos(ang) / 2)); p.rotation.x = s * ang; g.add(ink(p, 1.01)); }
  const tri = new THREE.Shape(); tri.moveTo(-d / 2, 0); tri.lineTo(d / 2, 0); tri.lineTo(0, rh); tri.closePath();
  const pg = new THREE.ExtrudeGeometry(tri, { depth: w, bevelEnabled: false }); pg.translate(0, 0, -w / 2); pg.rotateY(Math.PI / 2);
  const gm = new THREE.Mesh(pg, wallM); gm.position.y = h; g.add(gm);
  g.add(box(w + ov * 2.2, 0.2, 0.26, std({ color: 0x8a3a22 }), 0, h + rh + 0.05, 0));
}
// flat roof with a balustrade parapet
function parapet(g, w, d, h, col) {
  const pm = std({ color: col });
  g.add(ink(box(w + 0.2, 0.25, d + 0.2, pm, 0, h + 0.1, 0), 1.01));
  for (const [len, x, z, ry] of [[w, 0, d / 2, 0], [w, 0, -d / 2, 0], [d, w / 2, 0, Math.PI / 2], [d, -w / 2, 0, Math.PI / 2]]) {
    const rail = new THREE.Group(); rail.position.set(x, h + 0.22, z); rail.rotation.y = ry; g.add(rail);
    rail.add(box(len + 0.2, 0.14, 0.3, pm, 0, 0.75, 0)); rail.add(box(len + 0.2, 0.1, 0.3, pm, 0, 0.05, 0));
    for (let xx = -len / 2 + 0.2; xx <= len / 2 - 0.15; xx += 0.32) rail.add(cyl(0.06, 0.08, 0.62, pm, xx, 0.38, 0, 8));
  }
}
// turned-baluster balcony rail along x (local)
function balustrade(g, len, x, y, z, col, step = 0.28) {
  const m = std({ color: col });
  g.add(ink(box(len, 0.08, 0.14, m, x, y + 0.92, z), 1.02)); g.add(box(len, 0.06, 0.12, m, x, y + 0.05, z));
  for (let xx = -len / 2 + 0.12; xx <= len / 2; xx += step) { const pts = [new THREE.Vector2(0.05, 0), new THREE.Vector2(0.07, 0.12), new THREE.Vector2(0.035, 0.3), new THREE.Vector2(0.075, 0.55), new THREE.Vector2(0.04, 0.78), new THREE.Vector2(0.05, 0.86)]; const b = new THREE.Mesh(new THREE.LatheGeometry(pts, 8), m); b.position.set(x + xx, y + 0.06, z); g.add(b); }
}
// market stall: table with goods, shade overhead (striped awning on wooden frame, or plain cloth on bamboo poles)
function stall(parent, x, z, ry, o) {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; parent.add(g);
  const wood = std({ map: T.wood([140, 104, 66], 4, false) });
  g.add(ink(box(2.4, 0.08, 1.1, wood, 0, 0.85, 0), 1.03)); for (const [xx, zz] of [[-1.1, -0.45], [1.1, -0.45], [-1.1, 0.45], [1.1, 0.45]]) g.add(box(0.08, 0.85, 0.08, wood, xx, 0.42, zz));
  const poleM = o.bamboo ? std({ color: 0xc9b46a }) : std({ map: T.wood([110, 78, 48], 3) });
  for (const [xx, zz, hh] of [[-1.3, -0.7, 2.6], [1.3, -0.7, 2.6], [-1.3, 0.9, 2.1], [1.3, 0.9, 2.1]]) { const p = cyl(o.bamboo ? 0.045 : 0.06, o.bamboo ? 0.05 : 0.06, hh, poleM, xx, hh / 2, zz, 8); g.add(ink(p, 1.1)); if (o.bamboo) for (let y = 0.5; y < hh; y += 0.5) g.add(cyl(0.055, 0.055, 0.04, std({ color: 0x9a8a4a }), xx, y, zz, 8)); }
  const cloth = new THREE.Mesh(new THREE.PlaneGeometry(2.9, 1.9, 6, 4), std({ map: o.shadeTex, side: THREE.DoubleSide, roughness: 0.95 }));
  { const p = cloth.geometry.attributes.position; for (let i = 0; i < p.count; i++) p.setZ(i, -Math.sin((p.getX(i) / 2.9 + 0.5) * Math.PI * 3) * 0.03 - (o.bamboo ? Math.cos(p.getY(i) / 1.9 * Math.PI) * 0.12 : 0)); cloth.geometry.computeVertexNormals(); }
  cloth.rotation.x = -Math.PI / 2 + 0.26; cloth.position.set(0, 2.38, 0.1); cloth.castShadow = true; g.add(cloth);
  if (!o.bamboo) { const val = new THREE.Mesh(new THREE.PlaneGeometry(2.9, 0.3), std({ map: o.shadeTex, side: THREE.DoubleSide })); val.position.set(0, 1.98, 1.02); g.add(val); }
  (o.goods || (() => {}))(g);
  return g;
}

export function buildHarbour(scene, opts = {}) {
  const place = opts.place || 'martinique', MQ = place === 'martinique';
  const g = new THREE.Group(); scene.add(g);
  const H = K.setHandle(g, { center: [0, 0, -6], shadowSize: 22 });
  H.waterY = WATER_Y; const r = K.rng(MQ ? 1806 : 1833);

  // ---------------- water, quay, quay wall, steps / ghat ----------------
  const water = waterPlane(g, { kind: MQ ? 'tropic' : 'river', w: 280, d: 220, z: 110, y: WATER_Y, flow: MQ ? [0.008, 0.006] : [0.03, 0.004] });
  const qT = T.stoneBlocks(MQ ? [176, 168, 150] : [190, 170, 140]); qT.repeat.set(16, 8);
  const quay = new THREE.Mesh(new THREE.PlaneGeometry(90, 40), std({ map: qT, roughness: 0.95 })); quay.rotation.x = -Math.PI / 2; quay.position.set(0, 0, -20); quay.receiveShadow = true; g.add(quay);
  const wT = T.stoneBlocks(MQ ? [150, 142, 128] : [160, 140, 112]); wT.repeat.set(20, 1.2);
  const stepX0 = MQ ? -12 : -19, stepX1 = MQ ? -9.4 : -3; // the steps / ghat run out from the quay between these x
  for (const [x0, x1] of [[-45, stepX0], [stepX1, 45]]) g.add(box(x1 - x0, 3.0, 0.8, std({ map: wT }), (x0 + x1) / 2, -1.5, -0.4));
  g.add(box(90, 0.22, 0.9, std({ color: MQ ? 0xbdb4a0 : 0xc8b48c }), 0, -0.1, -0.45)); // coping
  { const n = MQ ? 7 : 8, rise = (MQ ? 2.3 : 2.5) / n, run = MQ ? 0.42 : 0.72; const sM = std({ map: T.stoneBlocks(MQ ? [170, 162, 146] : [196, 176, 140]) });
    for (let i = 0; i < n; i++) { const top = -rise * (i + 1), bot = -3.2; g.add(box(stepX1 - stepX0, top - bot, run, sM, (stepX0 + stepX1) / 2, (top + bot) / 2, -0.8 + run * (i + 0.5))); } // solid steps down into the water
    if (!MQ) { for (const x of [stepX0 - 0.3, stepX1 + 0.3]) g.add(ink(box(0.6, 1.1, 0.6, std({ color: 0xe8d8b0 }), x, 0.55, -0.6), 1.03)); } // ghat end piers
    const wetM = std({ color: MQ ? 0x6a8a80 : 0x5a5a3e, roughness: 0.4 }); g.add(box(stepX1 - stepX0 + 0.01, 0.35, n * run, wetM, (stepX0 + stepX1) / 2, WATER_Y + 0.05, -0.8 + n * run / 2)); }
  // bollards and iron mooring rings on the coping
  const iron = std({ color: 0x2a2c30, metalness: 0.5, roughness: 0.5 });
  for (const x of [-30, -22, 1, 9, 17, 26]) { K.bollard(g, x, -1.0); const rg = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.03, 6, 14), iron); rg.position.set(x + 2, -0.25, 0.02); g.add(rg); }

  // ---------------- the ship, moored alongside ----------------
  let ship = null;
  if (opts.ship !== null) {
    ship = buildShip(opts.ship || (MQ ? 'favorite' : 'tuscany'), { bob: 0.5 });
    const sx = 10, sz = ship.B / 2 + 0.55; ship.group.position.set(sx, WATER_Y, sz); ship.group.rotation.y = Math.PI; ship.group.userData.baseY = WATER_Y;
    g.add(ship.group, ship.flat); H.movers.ship = ship.group; H.lamps.push(...ship.lamps);
    H.open.sails = ship.sails; H.open.hatch = ship.hatch; H.openRest.sails = 0; H.shipDock = [sx, sz, WATER_Y, Math.PI];
    const moored = new THREE.Group(); g.add(moored);
    const gx = sx - ship.gangwayX, railY = WATER_Y + ship.top(ship.gangwayX) + 0.02, zr = sz - ship.bw(ship.gangwayX) + 0.05;
    const a = new THREE.Vector3(gx, 0.08, -0.7), b = new THREE.Vector3(gx, railY, zr + 0.25); const len = a.distanceTo(b);
    const pl = new THREE.Group(); pl.position.copy(a).lerp(b, 0.5); pl.rotation.x = -Math.atan2(b.y - a.y, b.z - a.z); moored.add(pl);
    pl.add(ink(box(0.7, 0.08, len, std({ map: T.wood([150, 112, 72], 3) }), 0, 0, 0), 1.03)); for (let z = -len / 2 + 0.2; z < len / 2; z += 0.3) pl.add(box(0.62, 0.05, 0.05, iron, 0, 0.06, z));
    K.rope(moored, [9 + 8.5, 0.62, -1.0], [sx - ship.L / 2 + 2, WATER_Y + ship.top(ship.L / 2 - 2), sz - ship.bw(ship.L / 2 - 2)], 0.035, undefined, 0.4);
    K.rope(moored, [1, 0.62, -1.0], [sx + ship.L / 2 - 1.5, WATER_Y + ship.top(-ship.L / 2 + 1.5), sz - ship.bw(-ship.L / 2 + 1.5)], 0.035, undefined, 0.4);
    H.open.moored = (v) => { moored.visible = v > 0.5; }; H.openRest.moored = 1;
  }

  // ---------------- the waterfront row ----------------
  const FRONT = -14;
  const plasterT = MQ ? [T.plaster('#f1e9d6'), T.plaster('#f6f2e8'), T.plaster('#efdcae')] : [T.plaster('#e9cf8e'), T.plaster('#f1e6c8'), T.plaster('#e2c27a')];
  const shutterCols = MQ ? [0x2e86ab, 0x3aa58b, 0x2a6f97] : [0x2f6a3a, 0x3a7a46, 0x2a5a32];
  const tileM = std({ map: T.terracotta([3, 2]) });
  const rows = MQ
    ? [{ x: -28, w: 8, h: 6.8 }, { x: -19.5, w: 8.5, h: 9.4 }, { x: -11, w: 8, h: 6.8, cameo: true }, { x: -2.5, w: 8.5, h: 9.4 }, { x: 6, w: 8, h: 6.8 }, { x: 14.5, w: 8.5, h: 9.4 }, { x: 23, w: 8, h: 6.8 }]
    : [{ x: -27, w: 10, h: 10.6 }, { x: -16, w: 11.5, h: 10.6, custom: true }, { x: -4.5, w: 10, h: 8.4 }, { x: 6, w: 10.5, h: 10.6 }, { x: 17, w: 10, h: 8.4 }, { x: 27.5, w: 10.5, h: 10.6 }];
  rows.forEach((o, i) => {
    const d = 9, h = o.h; const wallTex = plasterT[i % 3].clone(); wallTex.needsUpdate = true; wallTex.repeat.set(1, 1);
    const holes = o.cameo ? [[1.9, 5.3, 1.0, 1.5]] : [];
    const hs = streetHouse(g, { x: o.x, z: FRONT - d / 2, w: o.w, d, h, wallTex, trim: MQ ? 0xd9a441 : 0xf4ecd6, holes });
    const wallM = std({ map: wallTex });
    if (MQ) tileRoof(hs, o.w, d, h, 2.6, tileM, wallM); else parapet(hs, o.w, d, h, 0xf4ecd6);
    const addWin = K.windowKit(hs, { panes: !MQ, flowerBoxes: MQ, frame: MQ ? 0xf6f0e2 : 0xf4ecd6 });
    const floors = h > 9 ? [5.3, 8.0] : [5.3];
    const cols = o.w > 9 ? [-3.4, -1.15, 1.15, 3.4] : [-1.9, 1.9];
    floors.forEach((fy) => cols.forEach((cx) => addWin(cx, fy, d / 2 + 0.06, 0, false, o.cameo && cx === 1.9 && fy === 5.3)));
    K.dressWindows(hs, { shutter: shutterCols[i % 3], slat: MQ ? 0x1a4a5a : 0x1c3a22, curtains: MQ ? [0xf2e6c8, 0xe9d8a6] : [0xf4ecd6, 0xe8d8b0] });
    // ground floor openings: dark shop doorways with doors folded back
    for (const cx of cols.filter((_, j) => j % 2 === 0)) K.doorway(hs, cx + (o.w > 9 ? 1.1 : 0), d / 2 + 0.02, 1.6, 2.8, { double: true, openAt: 0.9, frame: MQ ? 0x6a4a2a : 0x3a4a30, wood: MQ ? [60, 110, 140] : [50, 100, 60] });
    if (MQ) {
      // street arcade: one extruded wall with round arches, gallery roof = balcony floor, turned balusters above
      const aw = o.w, ah = 3.6, n = Math.round(aw / 2.6); const sh = new THREE.Shape(); sh.moveTo(-aw / 2, 0); sh.lineTo(aw / 2, 0); sh.lineTo(aw / 2, ah); sh.lineTo(-aw / 2, ah); sh.closePath();
      for (let k = 0; k < n; k++) { const cx = -aw / 2 + (k + 0.5) * aw / n, hw = aw / n / 2 - 0.32; const p = new THREE.Path(); p.moveTo(cx - hw, 0.02); p.lineTo(cx - hw, 2.4); p.absarc(cx, 2.4, hw, Math.PI, 0, true); p.lineTo(cx + hw, 0.02); p.closePath(); sh.holes.push(p); }
      const ag = new THREE.ExtrudeGeometry(sh, { depth: 0.45, bevelEnabled: false }); { const p = ag.attributes.position, u = ag.attributes.uv; for (let q = 0; q < p.count; q++) u.setXY(q, p.getX(q) / 4, p.getY(q) / 4); }
      const arc = new THREE.Mesh(ag, std({ map: wallTex })); arc.position.set(0, 0, d / 2 + 2.0); arc.castShadow = true; arc.receiveShadow = true; hs.add(K.inkOffset(arc, 0.03));
      hs.add(ink(box(aw, 0.2, 2.5, std({ color: 0xd9a441 }), 0, ah + 0.1, d / 2 + 1.2), 1.01)); // gallery roof / balcony floor
      balustrade(hs, aw - 0.3, 0, ah + 0.2, d / 2 + 2.3, 0xf6f0e2);
    } else {
      // two-storey colonnade with a deep verandah: tall columns, entablature, verandah floor with a balustrade
      const n = Math.round(o.w / 2.4) + 1, colH = 7.0; const cm = std({ color: 0xf4ecd6 });
      for (let k = 0; k < n; k++) { const cx = -o.w / 2 + 0.4 + k * (o.w - 0.8) / (n - 1); hs.add(K.inkOffset(cyl(0.26, 0.3, colH, cm, cx, colH / 2, d / 2 + 2.6, 16), 0.03)); hs.add(ink(box(0.75, 0.3, 0.75, cm, cx, 0.15, d / 2 + 2.6), 1.03)); hs.add(ink(box(0.72, 0.25, 0.72, cm, cx, colH - 0.05, d / 2 + 2.6), 1.03)); }
      hs.add(ink(box(o.w + 0.2, 0.7, 3.2, cm, 0, colH + 0.3, d / 2 + 1.5), 1.01)); // entablature + verandah roof
      hs.add(ink(box(o.w, 0.25, 3.0, std({ color: 0xd8c08a }), 0, 3.5, d / 2 + 1.4), 1.01)); // upper verandah floor
      balustrade(hs, o.w - 0.6, 0, 3.62, d / 2 + 2.75, 0xf4ecd6, 0.3);
      for (let k = 0; k < 3; k++) { const blind = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 2.2), std({ color: 0x3a6a3e, side: THREE.DoubleSide })); blind.position.set(-o.w / 2 + 1.6 + k * (o.w - 3.2) / 2, 5.6, d / 2 + 2.85); hs.add(blind); for (let y = 4.6; y < 6.7; y += 0.18) hs.add(box(1.8, 0.03, 0.02, std({ color: 0x24442a }), blind.position.x, y, d / 2 + 2.87, 0, false)); } // green chick blinds
    }
    if (o.cameo) { // a room behind the open upper window (the log cameo peeks through here)
      const room = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.4, 2.0), new THREE.MeshStandardMaterial({ color: 0xb98a5a, side: THREE.BackSide, roughness: 1 })); room.position.set(1.9, 5.2, d / 2 - 1.2); hs.add(room);
      const lamp = new THREE.PointLight(0xffc070, 2, 4, 1.4); lamp.position.set(1.4, 5.8, d / 2 - 1.2); hs.add(lamp);
      H.cameoSpot = [o.x + 1.9, 4.6, FRONT - 1.0];
    }
  });
  // signs (Martinique: plain French that English readers can read; Calcutta: English)
  const sgn = (txt, x, y, z, w, bg, fg, ry = 0) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, w * 0.25), std({ map: T.signText(txt, { bg, fg, w: 1024, h: 256 }) })); m.position.set(x, y, z); m.rotation.y = ry; g.add(m); return m; };
  if (MQ) { sgn('CAFÉ', -19.5, 3.1, FRONT + 0.05, 2.6, '#2e5e7a', '#f6f0e2'); sgn('FRUITS', -2.5, 3.1, FRONT + 0.05, 2.8, '#7a3420', '#f6f0e2'); sgn('PORT', 14.5, 3.1, FRONT + 0.05, 2.4, '#1d3557', '#f1faee'); }
  else { sgn('CUSTOM HOUSE', -16, 9.6, FRONT + 3.06, 6.0, '#f4ecd6', '#3a2a18'); sgn('CLOTH MERCHANT', 6, 2.9, FRONT + 0.05, 3.6, '#2a4a7a', '#f4ecd6');
    const sp = new THREE.Group(); sp.position.set(-10.2, 0, -5.4); g.add(sp); sp.add(ink(cyl(0.06, 0.07, 3.0, iron, 0, 1.5, 0, 8), 1.1)); const ss = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 0.38), std({ map: T.signText('STRAND ROAD', { bg: '#1b1b1b', fg: '#f4ecd6', w: 1024, h: 216 }), side: THREE.DoubleSide })); ss.position.set(0.85, 2.8, 0); sp.add(ss); }
  // backdrop: the hills and Mont Pelée, or the Calcutta skyline, painted on a far card
  { const bd = new THREE.Mesh(new THREE.PlaneGeometry(MQ ? 200 : 240, MQ ? 52 : 75), new THREE.MeshBasicMaterial({ map: T.backdrop(MQ ? 'pelee' : 'calcutta'), transparent: true, fog: false, color: MQ ? 0xffffff : 0xf2e2c0 })); bd.position.set(0, MQ ? 27 : 22, -95); g.add(bd); }
  // far shore across the water (low headland / the far river bank)
  { const sh = new THREE.Shape(); sh.moveTo(-200, 0); for (let i = 0; i <= 40; i++) sh.lineTo(-200 + i * 10, (MQ ? 3 : 1.5) + Math.sin(i * 0.7) * (MQ ? 2.5 : 0.6)); sh.lineTo(200, 0); sh.closePath(); const hill = new THREE.Mesh(new THREE.ShapeGeometry(sh), new THREE.MeshBasicMaterial({ color: MQ ? 0x5f9a6a : 0x7a8a5a, fog: true })); hill.position.set(0, WATER_Y, 150); hill.rotation.y = Math.PI; g.add(hill); }

  // ---------------- quay dressing: stalls, trees, boats, carts ----------------
  const fruitM = { banana: std({ color: 0xf2c94c }), coco: std({ color: 0x6b4a2a }), pine: std({ color: 0xc98a2a }), crown: std({ color: 0x3f8a3a }), bread: std({ color: 0x8fb33a }) };
  const basketAt = (gg, x, z, y = 0.89) => K.basket(gg, x, z, y, false);
  const mqGoods = (kind) => (gg) => {
    if (kind === 0) { for (let i = 0; i < 4; i++) { const hand = new THREE.Group(); hand.position.set(-0.8 + i * 0.5, 0.95, -0.1 + (i % 2) * 0.25); gg.add(hand); for (let j = 0; j < 5; j++) { const b = new THREE.Mesh(new THREE.CapsuleGeometry(0.035, 0.16, 3, 6), fruitM.banana); b.rotation.z = 1.2 + j * 0.06; b.position.set(j * 0.05 - 0.1, 0.03, j * 0.02); hand.add(ink(b, 1.15)); } } for (let i = 0; i < 6; i++) gg.add(ink(new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 8), fruitM.coco).translateX(0.5 + (i % 3) * 0.24).translateY(0.98).translateZ(-0.25 + Math.floor(i / 3) * 0.24), 1.08)); }
    else if (kind === 1) { for (let i = 0; i < 4; i++) { const p = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 8), fruitM.pine); p.scale.y = 1.5; p.position.set(-0.8 + i * 0.32, 1.05, 0.1); gg.add(ink(p, 1.08)); const cr = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.2, 6), fruitM.crown); cr.position.set(-0.8 + i * 0.32, 1.3, 0.1); gg.add(cr); } for (let i = 0; i < 5; i++) gg.add(ink(new THREE.Mesh(new THREE.SphereGeometry(0.15, 10, 8), fruitM.bread).translateX(0.4 + (i % 3) * 0.3).translateY(1.02).translateZ(-0.2 + Math.floor(i / 3) * 0.3), 1.08)); }
    else { basketAt(gg, -0.6, 0); basketAt(gg, 0.1, 0.1); K.sack(gg, 0.75, 0.89, 0, 0.3, 0xa48a5a); const cup = cyl(0.05, 0.04, 0.1, std({ color: 0xf2f2ea }), -0.1, 0.94, 0.38, 10); gg.add(ink(cup, 1.1)); }
  };
  const caGoods = (kind) => (gg) => {
    if (kind === 0) { const cols = [0x2a4a9a, 0xb03a2a, 0xe8d8b0, 0x2a7a5a, 0xd98a2a]; for (let i = 0; i < 6; i++) { const b = cyl(0.17, 0.17, 0.9, std({ color: cols[i % 5] }), -0.75 + (i % 3) * 0.4, 1.06 + Math.floor(i / 3) * 0.33, -0.15, 12); b.rotation.x = Math.PI / 2; gg.add(ink(b, 1.06)); } }
    else if (kind === 1) { const brass = std({ color: 0xc9962e, metalness: 0.7, roughness: 0.3 }), clay = std({ color: 0xa8552e, roughness: 0.9 }); const pot = (m, x, z, s) => { const pts = [new THREE.Vector2(0.001, 0), new THREE.Vector2(0.14, 0.02), new THREE.Vector2(0.22, 0.14), new THREE.Vector2(0.2, 0.28), new THREE.Vector2(0.09, 0.38), new THREE.Vector2(0.1, 0.44), new THREE.Vector2(0.12, 0.46)]; const p = new THREE.Mesh(new THREE.LatheGeometry(pts, 16), m); p.scale.setScalar(s); p.position.set(x, 0.89, z); p.castShadow = true; gg.add(K.inkOffset(p, 0.015)); }; for (let i = 0; i < 3; i++) pot(brass, -0.8 + i * 0.4, -0.1, 1); for (let i = 0; i < 3; i++) pot(clay, 0.4 + i * 0.35, 0.05, 1.2); }
    else { basketAt(gg, -0.6, 0); K.ropeCoil(gg, 0.4, 0.89, 0.0, 0.3, 4); }
  };
  const shadeTexes = MQ ? [T.awning(['#c0392b', '#f4efe2']), T.awning(['#c0392b', '#f4efe2'], 48), T.awning(['#2e86ab', '#f4efe2'])] : [T.awning(['#27408b'], 512), T.awning(['#b4532a'], 512), T.awning(['#efe6d0'], 512)];
  const stallSpots = [[-24, -8.6, 0.05], [-15.5, -9.0, -0.08], [-6.5, -8.4, 0.1], [2.5, -8.8, -0.05], [21, -8.6, 0.06]];
  stallSpots.forEach(([x, z, ry], i) => stall(g, x, z, ry, { bamboo: !MQ, shadeTex: shadeTexes[i % 3], goods: MQ ? mqGoods(i % 3) : caGoods(i % 3) }));
  if (MQ) {
    for (const [x, z, hh, l, ry] of [[-31, -4, 7.5, 0.3, 0.4], [-8, -3.2, 8.5, 0.35, -0.6], [28, -4.5, 7.0, 0.28, 2.2], [32, -9, 8.0, 0.2, 1.0]]) palm(g, x, z, hh, l, ry);
    shadeTree(g, 12, -9.6, 'breadfruit', 0.9);
    boat(g, -14, 3.6, 0.5, 'row', 0x3c6b88); boat(g, -16.5, 5.2, -0.2, 'row', 0xb5532a); boat(g, -6, 6.5, 1.3, 'canoe', 0x6b4a2a);
    { const cart = K.handCart(g, -27, -10.8, 0.3, std({ map: T.wood([150, 110, 70], 4, false) }), std({ map: T.wood([100, 70, 45], 4) }), false); K.sack(cart, 0.1, 0.95, 0, 0.2, 0xa48a5a); K.sack(cart, -0.4, 0.95, 0.1, -0.2, 0xa48a5a); }
    for (const [x, z] of [[-3.5, -4.2], [-2.8, -4.5], [-3.2, -3.6]]) K.barrel(g, x, z);
    for (const [x, z, c] of [[-29.5, -12.6, 0xe63946], [-12.5, -12.7, 0xf4a1c1], [8.2, -12.6, 0xffd166]]) K.flowerPot(g, x, z, c);
  } else {
    for (const [x, z, hh, l, ry] of [[24.5, -6.5, 8.5, 0.25, 0.9], [33, -10, 7.5, 0.2, 2.0]]) palm(g, x, z, hh, l, ry);
    shadeTree(g, -33, -8.5, 'banyan', 1.0);
    boat(g, -15, 7.5, 0.2, 'country', 0x6a4a2a); boat(g, -6.5, 9.5, -0.3, 'country', 0x5a4028); boat(g, -26, 10, 0.1, 'budgerow', 0x7a5a3a);
    { // palanquin (palki) resting on its poles
      const pk = new THREE.Group(); pk.position.set(-22.5, 0, -10.4); pk.rotation.y = 0.15; g.add(pk); const wd = std({ color: 0x6a3a22 }), cl = std({ color: 0xb03a2a });
      pk.add(ink(box(1.6, 0.9, 0.9, cl, 0, 0.75, 0), 1.03)); pk.add(ink(box(1.75, 0.1, 1.0, wd, 0, 1.25, 0), 1.03)); pk.add(box(0.6, 0.55, 0.02, std({ color: 0x1a1210 }), 0, 0.75, 0.46));
      for (const s of [-1, 1]) pk.add(ink(cyl(0.05, 0.05, 4.2, wd, 0, 0.42, s * 0.18, 8).rotateZ(Math.PI / 2), 1.1)); for (const [xx, zz] of [[-0.7, -0.38], [0.7, -0.38], [-0.7, 0.38], [0.7, 0.38]]) pk.add(box(0.08, 0.3, 0.08, wd, xx, 0.15, zz)); }
    K.handCart(g, 14, -10.4, -0.4, std({ map: T.wood([150, 110, 70], 4, false) }), std({ map: T.wood([100, 70, 45], 4) }), false);
    for (const [x, z] of [[-1, -4.6], [-0.3, -4.9]]) K.barrel(g, x, z); K.crate(g, 0.6, -4.4, 0.8);
  }
  const gullTick = gulls(g, 4, 9, 2, 3, [], 8);
  H.tick = (t, L, camera) => { water.tick(t); if (ship) ship.tick(t); gullTick(t, camera); };
  return H;
}
