// S02 set: Boston Wharf, 1806 winter (snow) and the 1833 May re-dress. Art brief 1.2.
// Layout (metres): the plank wharf is the ground (y = 0); harbour water at y = WATER_Y (-2).
//   street head / quay: z < -12 (cobbles), warehouse fronts at z = -17, a street runs inland at x ∈ [-3, 3]
//   the wharf (pier): x ∈ [-5, 5], z ∈ [-12, 18]; the ship lies along its +x side, bow out to sea (+z)
//   ice house: on the quay left of the pier root, door facing the water (+z) at x = -9, z = -13.2
// opts: { year: 1806 | 1833, ship: 'favorite' | 'tuscany' | null, snow (default year === 1806) }
// handle extras: movers.ship (keys [x, z, -2]), open.hatch, open.sails, open.moored (gangplank + lines), doors (ice-house door),
//   shipDock: [x, z, y, heading] where the ship is moored, waterY.
import * as THREE from '/node_modules/three/build/three.module.js';
import * as T from './textures.js';
import * as K from './kit.js';
import { buildShip, waterPlane, gulls } from './ship.js';
const { std, box, cyl, ink } = K;

export const WATER_Y = -2;

export function buildWharf(scene, opts = {}) {
  const year = opts.year ?? 1806, snowy = opts.snow ?? year === 1806;
  const g = new THREE.Group(); scene.add(g);
  const H = K.setHandle(g, { center: [0, 0, -4], shadowSize: 20 });
  H.waterY = WATER_Y;
  const r = K.rng(year === 1806 ? 18 : 33);

  // ---------------- water, quay, wharf ----------------
  const water = waterPlane(g, { kind: 'harbour', w: 280, d: 260, z: 100, y: WATER_Y, flow: [0.01, 0.006] });
  const cob = T.cobbles(); cob.repeat.set(9, 5);
  const quay = new THREE.Mesh(new THREE.PlaneGeometry(70, 40), std({ map: cob, roughness: 0.95 })); quay.rotation.x = -Math.PI / 2; quay.position.set(0, 0, -32); quay.receiveShadow = true; g.add(quay);
  const stoneT = T.stoneBlocks(); stoneT.repeat.set(16, 1);
  g.add(box(70, 3.2, 0.8, std({ map: stoneT }), 0, -1.6, -12.4)); // quay wall facing the harbour
  g.add(box(70, 0.25, 1.0, std({ color: 0x8a857c }), 0, -0.12, -12.35)); // coping stones
  const deckT = T.wood([150, 112, 72], 10, false); deckT.repeat.set(1.5, 10); // ~0.3 m planks across the wharf
  g.add(box(10, 0.3, 30, std({ map: deckT }), 0, -0.15, 3)); // plank deck (planks run across)
  const capM = std({ map: T.wood([110, 78, 48], 3) });
  for (const s of [-1, 1]) g.add(ink(box(0.32, 0.24, 30, capM, s * 4.86, 0.06, 3), 1.01)); // edge stringers (wheel guards)
  g.add(ink(box(10, 0.24, 0.32, capM, 0, 0.06, 17.86), 1.01));
  const pileM = std({ map: T.wood([84, 64, 46], 3), roughness: 1 });
  for (let z = -10.5; z <= 18; z += 2.5) for (const x of [-4.85, -1.6, 1.6, 4.85]) g.add(ink(cyl(0.17, 0.2, 3.4, pileM, x, -1.85, z, 10), 1.05));
  for (let z = -9.25; z <= 16; z += 5) for (const s of [-1, 1]) { const br = box(0.12, 0.25, 3.6, pileM, s * 4.85, -1.2, z); br.rotation.x = 0.55 * s; g.add(br); } // cross braces
  // weed/green line on the pilings at the waterline
  const weed = std({ color: 0x3f5a35, roughness: 1 });
  for (let z = -10.5; z <= 18; z += 2.5) for (const x of [-4.85, 4.85]) g.add(cyl(0.205, 0.205, 0.3, weed, x, WATER_Y + 0.1, z, 10));
  // mooring dolphins off the end (pile clusters, a perch for gulls)
  const perches = [];
  for (const [x, z] of [[-7.5, 19], [8.5, 22]]) { for (const [dx, dz] of [[0, 0], [0.35, 0.1], [0.1, 0.35]]) g.add(ink(cyl(0.18, 0.2, 3.6, pileM, x + dx, WATER_Y + 1.6 - dx, z + dz, 10), 1.05)); g.add(K.rope(g, [x, 1.2, z], [x + 0.35, 1.0, z + 0.1], 0.05)); perches.push([x, WATER_Y + 3.4, z]); /* top of the tallest pile */ }
  // ladder down to the water
  const lad = new THREE.Group(); lad.position.set(-4.95, 0, 8); g.add(lad);
  for (const zz of [-0.3, 0.3]) lad.add(ink(box(0.08, 2.4, 0.08, capM, -0.06, -1.0, zz), 1.06)); for (let y = -1.9; y < 0.1; y += 0.35) lad.add(box(0.06, 0.06, 0.6, capM, -0.06, y, 0));
  // a little rowing boat tied at the ladder
  { const bt = new THREE.Group(); bt.position.set(-6.4, WATER_Y, 8.5); bt.rotation.y = 0.15; g.add(bt);
    const hb = new THREE.Mesh(new THREE.SphereGeometry(1, 18, 10, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), std({ color: 0x3c6b88, side: THREE.DoubleSide })); hb.scale.set(1.9, 0.55, 0.7); hb.position.y = 0.32; bt.add(K.inkOffset(hb, 0.03));
    const inside = new THREE.Mesh(new THREE.CircleGeometry(1, 20), std({ map: T.wood([130, 95, 60], 6) })); inside.rotation.x = -Math.PI / 2; inside.scale.set(1.75, 0.62, 1); inside.position.y = 0.3; bt.add(inside);
    for (const x of [-0.5, 0.5]) bt.add(box(0.25, 0.06, 1.2, capM, x, 0.36, 0));
    for (const s of [1, -1]) { const oar = box(2.2, 0.05, 0.08, capM, 0.2, 0.42, s * 0.3); oar.rotation.y = s * 0.08; bt.add(oar); }
    K.rope(g, [-4.95, 0.1, 8.3], [-5.0 - 1.4, WATER_Y + 0.5, 8.6], 0.025, undefined, 0.4);
    if (snowy) K.snowSlab(1.2, 0.5, 0.06, 0.3, 0.39, 0, 0, bt);
  }

  // ---------------- warehouses along the quay ----------------
  const brickA = T.bricks(), brickB = T.bricks([150, 96, 70]), brickC = T.bricks([140, 70, 55]);
  const wallBrick = (tx) => (rx, ry) => { const t2 = tx.clone(); t2.needsUpdate = true; t2.repeat.set(rx * 4 / 7, ry * 4 / 6); return std({ map: t2 }); };
  const clapT = [T.clapboard([200, 190, 165]), T.clapboard([170, 160, 140]), T.clapboard([160, 92, 70])];
  const wallClap = (tx) => (rx, ry) => { const t2 = tx.clone(); t2.needsUpdate = true; t2.repeat.set(rx * 4 / 5, ry * 4 / 5); return std({ map: t2 }); };
  const shT = T.shingles(), shT2 = T.shingles([80, 80, 86]);
  const roofOf = (tx, w) => { const t2 = tx.clone(); t2.needsUpdate = true; t2.repeat.set(w / 4, 3); return std({ map: t2 }); };
  const signs = year === 1806
    ? { B: ['SHIP CHANDLER', 'Rope · Canvas · Tar'], C: ['SAIL LOFT', null], D: ['ROPE & TAR', null], E: ['COFFEE HOUSE', 'Newspapers Read Here'] }
    : { B: ['SHIP CHANDLER', 'Rope · Canvas · Tar'], C: ['SAIL LOFT', null], D: ['ROPE & TAR', null], E: ['COFFEE HOUSE', 'Newspapers Read Here'] };
  const signStyle = { B: ['#22402e', '#f1d98a'], C: ['#efe4c8', '#2a2018'], D: ['#6e1f1a', '#f6ead0'], E: ['#151515', '#e8c060'] };
  const posterSet = year === 1806 ? ['cod', 'passage', 'auction'] : ['calcutta', 'teas', 'auction', 'cod'];
  const houses = [
    { id: 'A', x: -20.5, w: 7, h: 10.4, wall: wallBrick(brickA), roof: shT2 },
    { id: 'B', x: -13.25, w: 6.5, h: 8.0, wall: wallClap(clapT[0]), roof: shT },
    { id: 'C', x: -6.25, w: 6.5, h: 10.4, wall: wallBrick(brickB), roof: shT2 },
    { id: 'D', x: 6.25, w: 6.5, h: 8.0, wall: wallClap(clapT[2]), roof: shT },
    { id: 'E', x: 13.25, w: 6.5, h: 10.4, wall: wallBrick(brickC), roof: shT2 },
    { id: 'F', x: 20.5, w: 7, h: 8.0, wall: wallClap(clapT[1]), roof: shT },
  ];
  const doors = [];
  const shutterCols = year === 1806 ? [0x3e5a48, 0x2f3f52, 0x5a3a2a] : [0x2f7a52, 0x2a5a8a, 0x8a3a2a];
  houses.forEach((hs, hi) => {
    const d = 10, front = d / 2;
    const hg = K.gableHouse(g, hs.x, -22, 0, { w: hs.w, d, h: hs.h, roofH: 3.4, wall: hs.wall, roof: roofOf(hs.roof, hs.w), snow: snowy, trim: 0xe9e0c8 });
    const addWin = K.windowKit(hg, { panes: true, snowSill: snowy, flowerBoxes: !snowy, frame: 0xefe6d0 });
    const floors = hs.h > 9 ? [3.9, 6.5, 9.0] : [3.9, 6.4];
    const cols = hs.w > 6.8 ? [-2.2, 0, 2.2] : [-1.9, 0, 1.9];
    floors.forEach((fy, fi) => cols.forEach((cx, ci) => {
      if (ci === 1 && fi === floors.length - 1) return; // the loft door goes here
      addWin(cx, fy, front + 0.06, 0, (hi + fi + ci) % 7 === 3);
    }));
    K.dressWindows(hg, { shutter: shutterCols[hi % 3], slat: 0x1e2a22 });
    // loft door (open, dark inside) + hoist beam with block and tackle
    const ly = floors[floors.length - 1];
    hg.add(box(1.3, 2.0, 0.3, new THREE.MeshStandardMaterial({ color: 0x0c0806 }), 0, ly, front - 0.08, 0, false));
    for (const s of [-1, 1]) { hg.add(ink(box(0.12, 2.1, 0.14, std({ color: 0x3a2a1c }), s * 0.7, ly, front + 0.04), 1.04)); const lf = box(0.65, 1.95, 0.06, std({ map: T.wood([96, 64, 40], 4) }), s * 1.05, ly, front + 0.3, s * 1.1); hg.add(lf); }
    const by = hs.h + 3.4 - 1.0; hg.add(ink(box(0.28, 0.28, 1.8, std({ map: T.wood([90, 62, 40], 3) }), 0, by, front + 0.8), 1.03));
    const blk = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 6), std({ color: 0x5a3a20 })); blk.scale.set(0.6, 1.2, 0.6); blk.position.set(0, by - 0.35, front + 1.5); hg.add(ink(blk, 1.1));
    const hang = hi === 2 || hi === 4 ? ly - 2.6 : ly - 0.6; // a crate halfway up on two of them
    K.rope(hg, [0.05, by - 0.5, front + 1.5], [0.05, hang + 0.45, front + 1.5], 0.02); K.rope(hg, [-0.05, by - 0.5, front + 1.5], [-0.25, 0.9, front + 1.0], 0.02);
    if (hi === 2 || hi === 4) { K.crate(hg, 0, front + 1.5, 0.8, hang, 0.3); if (snowy) K.snowSlab(0.8, 0.8, 0.06, 0, hang + 0.4, front + 1.5, 0.3, hg); }
    // ground floor: wide warehouse doors (open on two of them, crates inside) + a shop door + a small-paned shop window
    const openD = hi === 1 || hi === 4;
    doors.push(K.doorway(hg, -0.9, front + 0.02, 2.2, 2.6, { double: true, openAt: openD ? 0.85 : 0 }));
    if (openD) { K.crate(hg, -1.3, front - 0.9, 0.8, 0.4, 0.2); K.barrel(hg, -0.4, front - 1.2); }
    K.doorway(hg, hs.w / 2 - 1.0, front + 0.02, 0.95, 2.2, { frame: 0x2a2a2a, wood: [70, 45, 30] });
    addWin(-hs.w / 2 + 0.9 > -0.9 - 1.5 ? -hs.w / 2 + 0.8 : -hs.w / 2 + 0.8, 1.55, front + 0.06, 0, false);
    // shop sign (English, period wording) over the ground floor, on its iron brackets
    const sg = signs[hs.id];
    if (sg) { const [bg, fg] = signStyle[hs.id]; const sm = new THREE.Mesh(new THREE.PlaneGeometry(hs.w * 0.82, hs.w * 0.82 * 0.25), std({ map: T.signText(sg[1] ? sg : sg[0], { bg, fg, w: 1024, h: 256 }) })); sm.position.set(0, 3.15, front + 0.09); hg.add(sm);
      hg.add(ink(box(hs.w * 0.84, 0.08, 0.1, std({ color: 0x2b2b2b }), 0, 3.15 + hs.w * 0.105, front + 0.08), 1.04)); }
    // handbills between the doors
    if (hi === 0 || hi === 3 || hi === 5) { K.poster(hg, posterSet[hi % posterSet.length], 1.45, 1.7, front + 0.08, 0, 1.0); K.poster(hg, posterSet[(hi + 1) % posterSet.length], 2.2, 1.6, front + 0.08, 0, 0.9); }
    // drainpipe on one corner
    K.drainpipe(hg, hs.w / 2 - 0.2, front + 0.15, std({ color: 0x55585c, metalness: 0.4 }), std({ color: 0x2a2a2a }), hs.h);
    // winter: snow drifted against the facade
    if (snowy) { K.snowPile(g, hs.x + hs.w / 2 - 0.4, -16.6, 0.9, 0.45, 1.4); K.snowPile(g, hs.x - hs.w / 2 + 0.6, -16.7, 0.7, 0.35, 1.2); }
  });
  // chimneys on the brick houses
  for (const hs of houses.filter((q) => q.id === 'A' || q.id === 'C' || q.id === 'E')) { g.add(ink(box(0.7, 2.2, 0.7, std({ map: brickA }), hs.x + hs.w / 2 - 0.6, hs.h + 2.3, -25), 1.03)); if (snowy) K.snowSlab(0.8, 0.8, 0.12, hs.x + hs.w / 2 - 0.6, hs.h + 3.4, -25, 0, g); }

  // ---------------- the street inland: houses, the Old State House tower ----------------
  for (let i = 0; i < 5; i++) for (const s of [-1, 1]) {
    const z = -32 - i * 8, hh = 7 + r() * 4, w = 6;
    const hg = K.gableHouse(g, s * (3 + 4), z, s * Math.PI / 2 * -1, { w: 7.5, d: w, h: hh, roofH: 2.6, wall: i % 2 ? wallBrick(brickB) : wallClap(clapT[(i + (s > 0)) % 3]), roof: roofOf(shT2, 7), snow: snowy });
    const aw = K.windowKit(hg, { panes: true, snowSill: snowy, flowerBoxes: !snowy }); for (const fy of [1.6, 4.3]) for (const cx of [-1.6, 1.6]) aw(cx, fy, w / 2 + 0.06, 0, (i + fy) % 3 < 1);
  }
  { // Old State House (1713): brick hall with a stepped tower, generic and unlabelled
    const sh = new THREE.Group(); sh.position.set(0, 0, -78); g.add(sh);
    sh.add(K.gableHouse(sh, 0, -6, 0, { w: 8, d: 14, h: 9, roofH: 3.2, wall: wallBrick(brickA), roof: roofOf(shT2, 8), snow: snowy, trim: 0xe9e0c8 }));
    const bm = std({ map: brickA }), wm = std({ color: 0xe9e0c8 });
    sh.add(ink(box(3.4, 15, 3.4, bm, 0, 7.5, 1.6), 1.02)); sh.add(box(3.7, 0.4, 3.7, wm, 0, 15.1, 1.6));
    sh.add(ink(cyl(1.4, 1.6, 3, wm, 0, 16.8, 1.6, 8), 1.03)); sh.add(ink(cyl(1.0, 1.2, 2.2, wm, 0, 19.4, 1.6, 8), 1.03));
    const sp = new THREE.Mesh(new THREE.ConeGeometry(0.9, 2.4, 8), std({ color: 0x4a5a52 })); sp.position.set(0, 21.7, 1.6); sh.add(ink(sp, 1.04));
    sh.add(cyl(0.05, 0.05, 1.2, std({ color: 0xc9962e, metalness: 0.6 }), 0, 23.3, 1.6, 6));
  }
  // background rooftops behind the warehouses (simple, fog takes them)
  for (let i = 0; i < 9; i++) { const x = -30 + i * 7.5 + r() * 2; if (Math.abs(x) < 5) continue; K.gableHouse(g, x, -36 - r() * 6, 0, { w: 6.5, d: 8, h: 9 + r() * 5, roofH: 3, wall: wallBrick(i % 2 ? brickB : brickC), roof: roofOf(shT2, 6.5), snow: snowy }); }

  // ---------------- the ice house on the quay (door opens: S01 `doors` keys or open.icehouse) ----------------
  {
    const ih = new THREE.Group(); ih.position.set(-9, 0, -15.0); g.add(ih);
    const plank = std({ map: T.wood([120, 92, 62], 7) }), dark = new THREE.MeshStandardMaterial({ color: 0x0c0908, roughness: 1, side: THREE.BackSide });
    const W = 4.2, D = 3.6, Hh = 3.0, DW = 1.3, DH = 2.3;
    // walls around a real doorway in the front (z = +D/2)
    ih.add(box(W, Hh, 0.18, plank, 0, Hh / 2, -D / 2)); for (const s of [-1, 1]) ih.add(box(0.18, Hh, D, plank, s * W / 2, Hh / 2, 0));
    ih.add(box((W - DW) / 2, Hh, 0.18, plank, -(W + DW) / 4, Hh / 2, D / 2)); ih.add(box((W - DW) / 2, Hh, 0.18, plank, (W + DW) / 4, Hh / 2, D / 2)); ih.add(box(DW, Hh - DH, 0.18, plank, 0, DH + (Hh - DH) / 2, D / 2));
    const inside = new THREE.Mesh(new THREE.BoxGeometry(W - 0.4, Hh - 0.1, D - 0.4), dark); inside.position.y = Hh / 2; ih.add(inside);
    const straw = new THREE.Mesh(new THREE.PlaneGeometry(W - 0.5, D - 0.5), std({ map: T.hay(), color: 0x6a5a3a })); straw.rotation.x = -Math.PI / 2; straw.position.y = 0.02; ih.add(straw);
    for (let i = 0; i < 4; i++) ih.add(box(0.6, 0.4, 0.45, std({ map: T.ice(i), color: 0x8aa8bb }), -0.9 + i * 0.62, 0.22 + (i % 2) * 0.42, -0.9, 0.05 * i, false));
    const shed = K.gableHouse(ih, 0, 0, 0, { w: W + 0.2, d: D + 0.2, h: 0.001, roofH: 1.6, wall: () => plank, roof: roofOf(shT, 4.4), snow: snowy }); shed.position.y = Hh;
    shed.children[0].visible = false; // the gable house's wall box is the walls above; keep only roof + gables
    for (const s of [-1, 1]) ih.add(ink(box(0.16, DH + 0.1, 0.24, std({ color: 0x4a3420 }), s * (DW / 2 + 0.08), DH / 2, D / 2 + 0.05), 1.04));
    ih.add(ink(box(DW + 0.5, 0.18, 0.26, std({ color: 0x4a3420 }), 0, DH + 0.12, D / 2 + 0.05), 1.04));
    const hinge = new THREE.Group(); hinge.position.set(-DW / 2, 0, D / 2 + 0.12); ih.add(hinge);
    hinge.add(box(DW, DH, 0.08, std({ map: T.wood([100, 70, 44], 4) }), DW / 2, DH / 2, 0));
    for (const yy of [0.5, 1.8]) hinge.add(box(DW * 0.9, 0.1, 0.04, std({ color: 0x3a2a1c }), DW / 2, yy, 0.05)); const br = box(0.1, 1.5, 0.04, std({ color: 0x3a2a1c }), DW / 2, 1.15, 0.05); br.rotation.z = 0.7; hinge.add(br);
    hinge.add(box(0.07, 0.07, 0.06, std({ color: 0x222222, metalness: 0.6 }), DW - 0.15, 1.1, 0.07));
    const sm = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 0.55), std({ map: T.signText('ICE HOUSE', { bg: '#1d3557', fg: '#f1faee', w: 1024, h: 245 }) })); sm.position.set(0, Hh + 0.42, D / 2 + 0.22); ih.add(sm);
    H.doors = (v) => { hinge.rotation.y = -v * 1.75; };
    H.lamps.push(K.hangingLantern(ih, DW / 2 + 0.5, 2.55, D / 2 + 0.3, { range: 6 })); ih.add(box(0.05, 0.05, 0.3, std({ color: 0x222222 }), DW / 2 + 0.5, 2.56, D / 2 + 0.15));
    if (snowy) { K.icicles(ih, [-W / 2 - 0.2, Hh - 0.05, D / 2 + 0.2], [W / 2 + 0.2, Hh - 0.05, D / 2 + 0.2], 14, r); K.snowPile(g, -11.4, -12.9, 0.7, 0.35, 1.3); }
    H.iceHouseDoor = [-9, 0, -15.0 + D / 2 + 0.12];
  }

  // ---------------- the ship, moored on the +x side, bow to sea ----------------
  let ship = null;
  if (opts.ship !== null) {
    ship = buildShip(opts.ship || (year === 1806 ? 'favorite' : 'tuscany'), { bob: 0.5 });
    const sx = 5 + ship.B / 2 + 0.45, sz = 3.5;
    ship.group.position.set(sx, WATER_Y, sz); ship.group.rotation.y = -Math.PI / 2; ship.group.userData.baseY = WATER_Y;
    g.add(ship.group, ship.flat);
    H.movers.ship = ship.group; H.lamps.push(...ship.lamps);
    H.open.sails = ship.sails; H.open.hatch = ship.hatch; H.openRest.sails = 0;
    H.shipDock = [sx, sz, WATER_Y, -Math.PI / 2];
    // gangplank from the wharf edge up to the port rail at the gangway, cleats and a rope handrail
    const moored = new THREE.Group(); g.add(moored);
    const gz = sz + ship.gangwayX, railY = WATER_Y + ship.top(ship.gangwayX) + 0.02, xr = sx - ship.bw(ship.gangwayX) + 0.05;
    const a = new THREE.Vector3(4.2, 0.08, gz), b = new THREE.Vector3(xr + 0.25, railY, gz); const len = a.distanceTo(b);
    const pl = new THREE.Group(); pl.position.copy(a).lerp(b, 0.5); pl.rotation.z = Math.atan2(b.y - a.y, b.x - a.x); moored.add(pl);
    pl.add(ink(box(len, 0.08, 0.7, std({ map: T.wood([150, 112, 72], 3, false) }), 0, 0, 0), 1.03)); for (let x = -len / 2 + 0.2; x < len / 2; x += 0.3) pl.add(box(0.05, 0.05, 0.62, capM, x, 0.06, 0));
    for (const xx of [-len / 2 + 0.1, len / 2 - 0.1]) pl.add(box(0.05, 0.9, 0.05, capM, xx, 0.45, -0.33));
    K.rope(pl, [-len / 2 + 0.1, 0.88, -0.33], [len / 2 - 0.1, 0.88, -0.33], 0.02, undefined, 0.08);
    // fenders on the ship side and mooring lines to bollards (bow, stern, springs)
    const fend = std({ color: 0x5a4632, roughness: 1 });
    for (const dz of [-6, -2, 2, 6]) { const f = new THREE.Mesh(new THREE.CapsuleGeometry(0.18, 0.5, 4, 8), fend); f.position.set(5.12, -0.7, sz + dz); moored.add(ink(f, 1.06)); K.rope(moored, [5.0, 0.05, sz + dz], [5.12, -0.3, sz + dz], 0.015); }
    const bowL = [sx - ship.bw(ship.L / 2 - 2) + 0.1, WATER_Y + ship.top(ship.L / 2 - 2), sz + ship.L / 2 - 2], sternL = [sx - ship.bw(-ship.L / 2 + 1) + 0.1, WATER_Y + ship.top(-ship.L / 2 + 1), sz - ship.L / 2 + 1];
    K.rope(moored, [4.6, 0.62, sz + ship.L / 2 + 2.5], bowL, 0.035, undefined, 0.5); K.rope(moored, [4.6, 0.62, sz - ship.L / 2 - 2.5], sternL, 0.035, undefined, 0.5);
    K.rope(moored, [4.6, 0.62, sz + 2.5], [sx - ship.bw(-3) + 0.1, WATER_Y + ship.top(-3), sz - 3], 0.03, undefined, 0.2);
    H.open.moored = (v) => { moored.visible = v > 0.5; }; H.openRest.moored = 1;
    H.gangplank = [a.toArray(), b.toArray()];
  }
  // bollards along both edges (snow caps in 1806)
  const bollardZ = [-9, -3, 3, 9, 15];
  for (const z of [...bollardZ, 3.5 + 12.5, 3.5 - 12.5, 6]) K.bollard(g, 4.6, Math.min(17.4, z), 0, snowy);
  for (const z of bollardZ) K.bollard(g, -4.6, z, 0, snowy);

  // ---------------- cargo, gear, lamps ----------------
  const woodL = std({ map: T.wood([150, 110, 70], 4, false) }), woodD = std({ map: T.wood([100, 70, 45], 4) }), iron = std({ color: 0x2a2c30, metalness: 0.5, roughness: 0.5 }), zinc = std({ color: 0x8a9096, metalness: 0.6, roughness: 0.4 });
  const capCrate = (x, z, s, y = s / 2, ry = 0.2) => { K.crate(g, x, z, s, y, ry); if (snowy) K.snowSlab(s * 0.98, s * 0.98, 0.07, x, y + s / 2, z, ry, g); };
  // left side of the wharf (the working side is the ship side, kept clear for the gangplank path at x 2…4.6)
  capCrate(-3.6, -6.5, 0.9); capCrate(-3.5, -5.5, 0.7); capCrate(-3.6, -6.4, 0.6, 0.9 + 0.3, 0.5);
  for (const [x, z] of [[-3.7, -1.2], [-2.9, -1.0], [-3.7, -0.4]]) K.barrel(g, x, z);
  K.anchorProp(g, -4.1, 2.6, Math.PI / 2, -0.3); capCrate(-3.5, 3.0, 0.8);
  K.ropeCoil(g, -3.2, 0, 5.2, 0.42, 5); K.ropeCoil(g, 3.8, 0, -8.0, 0.36, 4);
  K.capstan(g, -2.6, 13.5);
  for (const [x, z] of [[-3.8, 9.5], [-3.2, 9.9]]) K.lobsterPot(g, x, z, 0.3); K.lobsterPot(g, -3.5, 9.7, 0.6, 0.45);
  K.basket(g, -3.9, 11.2, 0, true); K.basket(g, -3.3, 11.6, 0, true); K.basket(g, -3.9, 12.0, 0, false);
  K.sack(g, -2.0, 0, -9.4, 0.4); K.sack(g, -1.3, 0, -9.6, -0.2); K.sack(g, -1.7, 0.28, -9.5, 0.1);
  K.handCart(g, 13.5, -14.5, 0.4, woodL, woodD, !snowy); K.wheelbarrow(g, -15.5, -14.0, 1.2, woodL, woodD, iron);
  K.bucket(g, -6.6, -13.6, zinc); K.broom(g, -6.2, -13.3, 0.18, woodL);
  for (const [x, z] of [[17.5, -14.6], [18.4, -14.9], [17.9, -15.6]]) K.barrel(g, x, z);
  capCrate(-17.5, -14.4, 1.0); capCrate(-16.6, -14.8, 0.7);
  // the ice to be loaded (1806): blocks under straw by the gangplank
  if (year === 1806) { const iceM = std({ map: T.ice(3), roughness: 0.2, color: 0xd6ecff }); for (let i = 0; i < 6; i++) g.add(ink(box(0.6, 0.4, 0.42, iceM, 2.3 + (i % 3) * 0.64, 0.2 + Math.floor(i / 3) * 0.4, -6.0 + (i % 2) * 0.05), 1.03)); K.hayBale(g, 2.9, -7.1, 0, 0.4); }
  // 1833: a busier wharf
  if (year === 1833) {
    for (const [x, z, s] of [[-3.5, 7.0, 0.9], [-2.6, 7.2, 0.7], [-3.4, 7.9, 0.8], [-2.0, -4.0, 0.8], [-1.3, -4.2, 0.6]]) capCrate(x, z, s);
    for (const [x, z] of [[2.6, -6.2], [3.3, -6.0], [2.9, -6.8], [-1.0, 10.5], [-1.7, 10.4]]) K.barrel(g, x, z);
    for (let i = 0; i < 5; i++) K.sack(g, 2.2 + (i % 3) * 0.7, Math.floor(i / 3) * 0.3, -9.8 + (i % 2) * 0.1, i * 0.4, 0xbfa36b);
    K.handCart(g, -1.5, -10.8, 1.3, woodL, woodD, true);
    for (const [x, z] of [[-8.6, -13.2], [9.0, -13.4], [-14.0, -13.4]]) K.flowerPot(g, x, z, 0xe63946);
  }
  // oil lamp posts (no gas in 1806): lit at night, dark by day
  for (const [x, z] of [[-5.6, -12.9], [5.6, -12.9], [-14.5, -13.0], [14.5, -13.0], [-4.55, 6.5]]) H.lamps.push(K.lampPost(g, x, z, { head: 'oil' }));

  // ---------------- winter dressing: snow on edges, piles, slush ----------------
  if (snowy) {
    for (const s of [-1, 1]) for (let z = -11.5; z < 17.5; z += 6) K.snowSlab(0.5, 5.2, 0.08, s * 4.86, 0.18, z + 2.6, 0, g); // on the stringers
    for (const [x, z, rr, hh, sx] of [[-3.0, -11.3, 0.8, 0.3, 1.8], [3.8, 16.6, 0.7, 0.25, 1.5], [-2.0, 16.9, 0.6, 0.22, 2.0], [-22, -14, 1.2, 0.5, 1.6], [24, -14.5, 1.0, 0.4, 1.4], [-12.5, -12.9, 0.9, 0.3, 2.2], [11.0, -12.9, 0.8, 0.3, 2.4]]) K.snowPile(g, x, z, rr, hh, sx);
    const slT = T.slush(); for (let i = 0; i < 14; i++) { const m = new THREE.Mesh(new THREE.PlaneGeometry(3 + r() * 3, 2 + r() * 2), new THREE.MeshStandardMaterial({ map: slT, transparent: true, depthWrite: false, roughness: 0.4, metalness: 0.2 })); m.rotation.x = -Math.PI / 2; m.rotation.z = r() * 3; m.position.set(-24 + r() * 48, 0.012, -13 - r() * 5); g.add(m); }
  }

  // ---------------- far harbour: other ships, a low far shore ----------------
  for (const [x, z, m, sd, ry, sc] of [[-34, 70, 3, 1, 0.3, 26], [22, 85, 2, 2, -0.4, 22], [48, 60, 2, 3, -0.9, 20], [-60, 95, 3, 4, 0.6, 24], [70, 110, 3, 5, -0.2, 26]]) {
    const card = new THREE.Mesh(new THREE.PlaneGeometry(sc, sc), new THREE.MeshBasicMaterial({ map: T.shipSilhouette(m, sd, year === 1806 ? '#4a5260' : '#3a4250'), transparent: true, alphaTest: 0.3, side: THREE.DoubleSide, fog: true }));
    card.geometry.translate(0, sc * 0.5 - sc * 0.06, 0); card.position.set(x, WATER_Y, z); card.rotation.y = ry; g.add(card);
  }
  { const sh = new THREE.Shape(); sh.moveTo(-200, 0); for (let i = 0; i <= 40; i++) { const x = -200 + i * 10; sh.lineTo(x, 4 + Math.sin(i * 0.7) * 2.5 + Math.sin(i * 1.9) * 1.2); } sh.lineTo(200, 0); sh.closePath();
    const hill = new THREE.Mesh(new THREE.ShapeGeometry(sh), new THREE.MeshBasicMaterial({ color: snowy ? 0x9aa3ad : 0x6f8a6a, fog: true })); hill.position.set(0, WATER_Y, 140); hill.rotation.y = Math.PI; g.add(hill); }
  const gullTick = gulls(g, 1, 7, 12, year === 1806 ? 3 : 4, perches, 7);

  // ---------------- per frame ----------------
  H.tick = (t, L, camera) => {
    water.tick(t); if (ship) ship.tick(t); gullTick(t, camera);
    // lamps are oil: lit only when it is dark (bright presets put them out)
    const c = new THREE.Color(L.bg); const lum = 0.3 * c.r + 0.59 * c.g + 0.11 * c.b;
    const lit = lum < 0.3 ? 1 : 0;
    for (const l of H.lamps) { l.pl.intensity *= lit; l.glow.material.opacity *= lit; if (l.glass) l.glass.color.setHex(lit ? 0xffd98a : 0x9a9180); }
  };
  return H;
}
