// S02 set: the Frozen Pond at night (Tudor family land, Saugus, 1806). Art brief 1.1.
// Ice cutting by hand (no horses in 1806: fact-check row 36); adults only; workers stay well clear of the open channel.
// Layout (metres): ice sheet 30 × 30 centred on the origin, top at y = 0. The open channel (dark water, 2 m wide)
//   runs from the west shore x = -15 to x = 3 at z ∈ [-4, -2]. Shore ground is 0.6 m higher (y = SHORE_Y).
//   Shed + tool rack on the north bank (z ≈ -19), facing the ice; cut blocks, plank ramp and the sledge by it.
// handle extras: doors (shed door), iceY 0, shoreY, channel: {x0, x1, z0, z1} (keep people ≥ 1 m from it)
import * as THREE from '/node_modules/three/build/three.module.js';
import * as T from './textures.js';
import * as K from './kit.js';
const { std, box, cyl, ink } = K;

export const SHORE_Y = 0.6;

export function buildPond(scene, opts = {}) {
  const g = new THREE.Group(); scene.add(g);
  const H = K.setHandle(g, { center: [0, 0, -6], shadowSize: 18 });
  const r = K.rng(1806);
  H.iceY = 0; H.shoreY = SHORE_Y; H.channel = { x0: -15, x1: 3, z0: -4, z1: -2 };
  const P = 15;

  // ---------------- ice sheet (slabs around the open channel), channel water, floating chunks ----------------
  const sheetT = T.iceSheet(10);
  const iceTop = (w, d, x, z) => { const t2 = sheetT.clone(); t2.needsUpdate = true; t2.repeat.set(w / 8, d / 8); t2.offset.set((x - w / 2) / 8, (z - d / 2) / 8); return t2; };
  const edgeM = std({ color: 0x9fd0ec, roughness: 0.2, emissive: 0x16304a });
  const slab = (x0, x1, z0, z1) => {
    const w = x1 - x0, d = z1 - z0, x = (x0 + x1) / 2, z = (z0 + z1) / 2;
    const mats = [edgeM, edgeM, std({ map: iceTop(w, d, x, z), roughness: 0.25, metalness: 0.05 }), edgeM, edgeM, edgeM];
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, 0.32, d), mats); m.position.set(x, -0.16, z); m.receiveShadow = true; g.add(m); return m;
  };
  slab(-P, P, -P, -4); slab(-P, P, -2, P); slab(3, P, -4, -2);
  const wT = T.water('sea'); wT.repeat.set(4, 0.5); const water = new THREE.Mesh(new THREE.PlaneGeometry(19, 2.2), std({ map: wT, color: 0x4a6a88, roughness: 0.15, metalness: 0.3 })); water.rotation.x = -Math.PI / 2; water.position.set(-6, -0.14, -3); g.add(water);
  const chunkM = std({ map: T.ice(7), roughness: 0.2, color: 0xcfe8ff, emissive: 0x0e2234 });
  for (let i = 0; i < 9; i++) { const c = box(0.3 + r() * 0.4, 0.12, 0.25 + r() * 0.3, chunkM, -13 + i * 1.6 + r() * 0.6, -0.1, -3 + (r() - 0.5) * 1.2, r() * 3, false); g.add(c); }
  // rough channel edges: broken lips of ice along both sides
  for (const zE of [-4, -2]) for (let x = -14.6; x < 2.8; x += 0.7 + r() * 0.5) { const lip = box(0.5 + r() * 0.5, 0.1, 0.18, chunkM, x, -0.03, zE + (zE < -3 ? 0.06 : -0.06), (r() - 0.5) * 0.4, false); g.add(lip); }
  // the half-cut block at the channel's end: a kerf line scored into the ice, a block nearly free
  const iceBlockM = std({ map: T.ice(3), roughness: 0.15, color: 0xe2f3ff, emissive: 0x2a5a80 }); // same face as the cutaway end frame (loop)
  g.add(ink(box(0.62, 0.36, 0.42, iceBlockM, 2.45, -0.12, -3.0, 0.04), 1.03));
  g.add(box(0.03, 0.02, 1.3, std({ color: 0x0b1a26 }), 2.85, 0.005, -3.0, 0, false)); // saw kerf
  // the hero block (beat 1's first frame = its face): freshly cut, on solid ice well away from the channel
  const HERO = [5.2, -6.2]; H.heroBlock = [HERO[0], 0.21, HERO[1] + 0.22];
  g.add(ink(box(0.62, 0.42, 0.44, iceBlockM, HERO[0], 0.21, HERO[1]), 1.03));
  // the hook block (frame 0): hauled up out of the channel onto the north lip by two cutters with tongs (movers.pblock)
  { const pb = new THREE.Group(); pb.userData.bob = 0; pb.position.set(-1.0, -0.12, -3.35); g.add(pb);
    const bm = std({ map: T.ice(3), roughness: 0.12, color: 0xeaf6ff, emissive: 0x2e5f88 });
    pb.add(ink(box(0.66, 0.46, 0.46, bm, 0, 0.23, 0), 1.03));
    const gl = new THREE.Sprite(new THREE.SpriteMaterial({ map: T.radial('rgba(255,255,255,1)', 'rgba(200,230,255,0)'), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); gl.position.set(0.2, 0.4, 0.24); gl.scale.set(0.1, 0.1, 1); pb.add(gl);
    H.movers.pblock = pb; H.pblock = pb;
    const warm = new THREE.PointLight(0xffb060, 3.5, 5, 1.4); warm.position.set(-0.1, 1.3, -4.7); g.add(warm); H.lamps.push({ pl: warm, glow: { material: {} } });
  }
  { const saw = new THREE.Group(); saw.position.set(HERO[0], 0, HERO[1]); g.add(saw);
    const steel = std({ color: 0xb8c0c8, metalness: 0.8, roughness: 0.3 });
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.85, 0.012), std({ color: 0xc8d2dc, metalness: 0.4, roughness: 0.3, emissive: 0x3a4a5a })); blade.position.set(0, 0.425, 0.23); saw.add(K.inkOffset(blade, 0.006)); // flat side to the camera, cutting the block's front edge
    for (let y = 0.05; y < 0.85; y += 0.05) { const th = new THREE.Mesh(new THREE.ConeGeometry(0.012, 0.03, 3), steel); th.position.set(-0.055, y, 0.23); th.rotation.z = Math.PI / 2; saw.add(th); }
    saw.add(ink(box(0.42, 0.05, 0.05, std({ map: T.wood([120, 88, 56], 3) }), 0, 0.87, 0.23), 1.06));
    g.add(box(0.025, 0.012, 0.46, std({ color: 0x1a3a56 }), HERO[0], 0.425, HERO[1], 0, false)); // the saw groove along the top
    const chipsT = T.radial('rgba(235,248,255,1)', 'rgba(235,248,255,0)'); const chips = [];
    for (let i = 0; i < 10; i++) { const c = new THREE.Sprite(new THREE.SpriteMaterial({ map: chipsT, transparent: true, depthWrite: false })); c.visible = false; g.add(c); chips.push(c); }
    let sawV = 0; H.open.saw = (v) => { sawV = v; saw.visible = v > 0.01; };
    H.openRest.saw = 0; saw.visible = false;
    H.sawTick = (t) => { if (!saw.visible) { chips.forEach((c) => (c.visible = false)); return; } saw.position.y = 0.44 - sawV * 0.22 + Math.sin(t * 14) * 0.06; saw.position.x = HERO[0] + Math.sin(t * 14) * 0.004;
      chips.forEach((c, i) => { const a = ((t * 2.2 + i / 10) % 1); c.visible = sawV > 0.05; c.position.set(HERO[0] + (i % 2 ? 0.05 : -0.05) * (1 + a * 3), 0.43 + a * 0.25 - a * a * 0.4, HERO[1] + 0.1 + (i % 3) * 0.04); const s = 0.03 * (1 - a); c.scale.set(s, s, 1); }); };
  }

  // ---------------- shore: raised snow ground with a hole for the pond, smooth banks, snow drifts ----------------
  const shore = new THREE.Shape(); shore.moveTo(-90, -90); shore.lineTo(90, -90); shore.lineTo(90, 90); shore.lineTo(-90, 90); shore.closePath();
  const hole = new THREE.Path(); hole.moveTo(-P, -P); hole.lineTo(-P, P); hole.lineTo(P, P); hole.lineTo(P, -P); hole.closePath(); shore.holes.push(hole);
  const sg = new THREE.ShapeGeometry(shore); sg.rotateX(-Math.PI / 2);
  { const p = sg.attributes.position, u = sg.attributes.uv; for (let i = 0; i < p.count; i++) u.setXY(i, p.getX(i) / 6, p.getZ(i) / 6); }
  const snowT = T.snow([1, 1]); const shoreM = std({ map: snowT, roughness: 1 });
  const shoreMesh = new THREE.Mesh(sg, shoreM); shoreMesh.position.y = SHORE_Y; shoreMesh.receiveShadow = true; g.add(shoreMesh);
  // the bank face all round (a soft rounded rim, one smooth shape per side)
  // the bank: a gentle snow slope from the ice up to the shore on all four sides, corners rounded off by drifts
  const BW = 1.8, slopeL = Math.hypot(BW, SHORE_Y), slopeA = Math.atan2(SHORE_Y, BW);
  for (let side = 0; side < 4; side++) {
    const bk = new THREE.Group(); bk.rotation.y = side * Math.PI / 2; g.add(bk);
    const sl = new THREE.Mesh(new THREE.BoxGeometry(2 * P + 2 * BW, 0.12, slopeL), shoreM); sl.position.set(0, SHORE_Y / 2 - 0.05, -P - BW / 2 + 0.05); sl.rotation.x = slopeA; sl.receiveShadow = true; bk.add(sl);
  }
  shoreMesh.geometry.dispose(); { const s2 = new THREE.Shape(); s2.moveTo(-90, -90); s2.lineTo(90, -90); s2.lineTo(90, 90); s2.lineTo(-90, 90); s2.closePath(); const h2 = new THREE.Path(); const Q = P + BW - 0.05; h2.moveTo(-Q, -Q); h2.lineTo(-Q, Q); h2.lineTo(Q, Q); h2.lineTo(Q, -Q); h2.closePath(); s2.holes.push(h2); const g2 = new THREE.ShapeGeometry(s2); g2.rotateX(-Math.PI / 2); const p2 = g2.attributes.position, u2 = g2.attributes.uv; for (let i = 0; i < p2.count; i++) u2.setXY(i, p2.getX(i) / 6, p2.getZ(i) / 6); shoreMesh.geometry = g2; }
  for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) K.snowPile(g, x * (P + 0.9), z * (P + 0.9), 1.5, SHORE_Y + 0.25, 1, 0.8, -0.02);
  // low smooth drifts on the banks (no lumpy overlaps: each is a single flattened dome)
  for (let i = 0; i < 18; i++) { const a = i / 18 * Math.PI * 2, R = P + 2.4 + r() * 1.5; const x = Math.cos(a) * R * (Math.abs(Math.cos(a)) > 0.7 ? 1 : 1.05), z = Math.sin(a) * R; if (z < -P && Math.abs(x - 4) < 6) continue; K.snowPile(g, x, z, 1.0 + r() * 0.8, 0.35 + r() * 0.25, 1.4 + r() * 0.8, a + Math.PI / 2, SHORE_Y - 0.05); }
  // a few drifts out on the ice, well away from the channel
  for (const [x, z, rr, hh, sx] of [[-9, 8, 0.9, 0.18, 2.4], [8, 9, 0.8, 0.15, 2.0], [10, -9, 0.7, 0.14, 1.8]]) K.snowPile(g, x, z, rr, hh, sx);

  // ---------------- shed on the north bank: real doorway, dark inside, lantern on a hook, icicles ----------------
  {
    const sh = new THREE.Group(); sh.position.set(4.5, SHORE_Y, -19.5); g.add(sh);
    const plank = std({ map: T.wood([104, 76, 50], 7) }), dark = new THREE.MeshStandardMaterial({ color: 0x0a0807, roughness: 1, side: THREE.BackSide });
    const W = 5, D = 4, Hh = 2.8, DW = 1.3, DH = 2.2;
    sh.add(box(W, Hh, 0.18, plank, 0, Hh / 2, -D / 2)); for (const s of [-1, 1]) sh.add(box(0.18, Hh, D, plank, s * W / 2, Hh / 2, 0));
    sh.add(box((W - DW) / 2, Hh, 0.18, plank, -(W + DW) / 4, Hh / 2, D / 2)); sh.add(box((W - DW) / 2, Hh, 0.18, plank, (W + DW) / 4, Hh / 2, D / 2)); sh.add(box(DW, Hh - DH, 0.18, plank, 0, DH + (Hh - DH) / 2, D / 2));
    const inside = new THREE.Mesh(new THREE.BoxGeometry(W - 0.4, Hh - 0.1, D - 0.4), dark); inside.position.y = Hh / 2; sh.add(inside);
    for (let i = 0; i < 3; i++) sh.add(box(0.6, 0.4, 0.42, std({ map: T.ice(i + 4), color: 0x7f9fb6 }), -1.4 + i * 0.66, 0.2, -1.2, 0, false)); // ice stacked inside, under straw
    sh.add(box(2.4, 0.15, 0.6, std({ map: T.hay(), color: 0x7a6640 }), -0.7, 0.47, -1.2, 0, false));
    const roofT = T.shingles([80, 64, 52]); roofT.repeat.set(1.5, 3);
    const roof = K.gableHouse(sh, 0, 0, 0, { w: W + 0.2, d: D + 0.2, h: 0.001, roofH: 2.0, wall: () => plank, roof: std({ map: roofT }), snow: true }); roof.position.y = Hh; roof.children[0].visible = false;
    for (const s of [-1, 1]) sh.add(ink(box(0.16, DH + 0.1, 0.24, std({ color: 0x3e2c1c }), s * (DW / 2 + 0.08), DH / 2, D / 2 + 0.05), 1.04));
    sh.add(ink(box(DW + 0.5, 0.18, 0.26, std({ color: 0x3e2c1c }), 0, DH + 0.12, D / 2 + 0.05), 1.04));
    const hinge = new THREE.Group(); hinge.position.set(-DW / 2, 0, D / 2 + 0.12); sh.add(hinge);
    hinge.add(box(DW, DH, 0.08, std({ map: T.wood([92, 64, 40], 4) }), DW / 2, DH / 2, 0)); for (const yy of [0.45, 1.75]) hinge.add(box(DW * 0.9, 0.1, 0.04, std({ color: 0x3a2a1c }), DW / 2, yy, 0.05));
    { const sgn = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 0.48), std({ map: T.signText('ICE HOUSE', { bg: '#1d3557', fg: '#f1faee', w: 1024, h: 245 }) })); sgn.position.set(0, Hh - 0.32, D / 2 + 0.12); sh.add(sgn); sh.add(ink(box(2.06, 0.54, 0.05, std({ color: 0x3e2c1c }), 0, Hh - 0.32, D / 2 + 0.09), 1.02)); }
    H.doors = (v) => { hinge.rotation.y = -v * 1.75; }; H.doors(0.35); // left ajar: the dark doorway reads from the ice
    H.lamps.push(K.hangingLantern(sh, -DW / 2 - 0.45, 2.15, D / 2 + 0.32, { range: 7 })); sh.add(box(0.05, 0.05, 0.32, std({ color: 0x222222 }), -DW / 2 - 0.45, 2.16, D / 2 + 0.16));
    K.icicles(sh, [-W / 2 - 0.2, Hh - 0.02, D / 2 + 0.2], [W / 2 + 0.2, Hh - 0.02, D / 2 + 0.2], 16, r);
    K.snowPile(sh, -W / 2 - 0.3, D / 2 + 0.2, 0.6, 0.3, 1.2); K.snowPile(sh, W / 2 + 0.3, D / 2 + 0.1, 0.7, 0.35, 1.3);
    // tool rack against the east wall: two long ice saws, two pike poles, tongs, an axe, a coil of rope
    const rack = new THREE.Group(); rack.position.set(W / 2 + 0.25, 0, 0.2); rack.rotation.y = Math.PI / 2; sh.add(rack);
    const wd = std({ map: T.wood([120, 88, 56], 3) }), steel = std({ color: 0x9aa3ad, metalness: 0.7, roughness: 0.35 }), iron = std({ color: 0x2a2c30, metalness: 0.5, roughness: 0.5 });
    for (const xx of [-1.5, 1.5]) rack.add(ink(box(0.12, 2.0, 0.12, wd, xx, 1.0, 0), 1.05)); rack.add(ink(box(3.2, 0.1, 0.12, wd, 0, 1.9, 0.05), 1.04)); rack.add(ink(box(3.2, 0.1, 0.12, wd, 0, 0.5, 0.05), 1.04));
    for (const [xx, tilt] of [[-1.1, 0.06], [-0.7, -0.04]]) { // long hand ice saws: tapered blade, teeth edge, cross handle
      const sw = new THREE.Group(); sw.position.set(xx, 0.05, 0.14); sw.rotation.z = tilt; rack.add(sw);
      const bl = new THREE.Shape(); bl.moveTo(-0.03, 0); bl.lineTo(0.03, 0); bl.lineTo(0.09, 1.65); bl.lineTo(-0.09, 1.65); bl.closePath();
      const blade = new THREE.Mesh(new THREE.ExtrudeGeometry(bl, { depth: 0.01, bevelEnabled: false }), steel); blade.castShadow = true; sw.add(K.inkOffset(blade, 0.012));
      for (let y = 0.05; y < 1.6; y += 0.06) { const tooth = new THREE.Mesh(new THREE.ConeGeometry(0.018, 0.04, 3), steel); tooth.rotation.z = Math.PI / 2; tooth.position.set(-0.04 - y * 0.03, y, 0.005); sw.add(tooth); }
      sw.add(ink(box(0.5, 0.06, 0.06, wd, 0, 1.72, 0.005), 1.06)); sw.add(box(0.06, 0.14, 0.06, wd, 0, 1.66, 0.005));
    }
    for (const [xx, tilt] of [[-0.15, 0.05], [0.15, -0.03]]) { // pike poles
      const pp = new THREE.Group(); pp.position.set(xx, 0, 0.16); pp.rotation.z = tilt; rack.add(pp);
      pp.add(ink(cyl(0.025, 0.03, 2.9, wd, 0, 1.45, 0, 6), 1.1)); pp.add(ink(new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.2, 6), iron).translateY(3.0), 1.1));
      const hk = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.015, 5, 10, Math.PI * 1.1), iron); hk.position.set(0.06, 2.85, 0); pp.add(hk);
    }
    { const tg = new THREE.Group(); tg.position.set(0.8, 1.55, 0.18); rack.add(tg); // ice tongs hanging on a peg
      for (const s of [-1, 1]) { const arm = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.022, 6, 14, Math.PI * 0.9), iron); arm.rotation.z = s > 0 ? -1.7 : Math.PI + 0.25; arm.position.set(s * 0.1, -0.2, 0); tg.add(ink(arm, 1.08)); }
      tg.add(cyl(0.035, 0.035, 0.05, iron, 0, 0.0, 0, 8)); for (const s of [-1, 1]) tg.add(ink(box(0.18, 0.05, 0.05, wd, s * 0.22, 0.12, 0), 1.08)); }
    { const ax = new THREE.Group(); ax.position.set(1.3, 0.62, 0.18); ax.rotation.z = 0.3; rack.add(ax); ax.add(ink(box(0.05, 0.9, 0.05, wd, 0, 0.45, 0), 1.08)); ax.add(ink(box(0.22, 0.12, 0.04, steel, 0.08, 0.86, 0), 1.08)); }
    K.ropeCoil(rack, 1.05, 0.0, 0.45, 0.3, 4);
    H.lamps.push(K.hangingLantern(rack, -1.62, 2.05, 0.35, { range: 6 })); rack.add(box(0.05, 0.05, 0.3, std({ color: 0x222222 }), -1.62, 2.06, 0.2)); // lights the tools
  }

  // ---------------- by the shed: cut blocks stacked, the plank ramp from the ice, a hand sledge ----------------
  const stackX = -1.2, stackZ = -16.6;
  for (let i = 0; i < 8; i++) { const lay = Math.floor(i / 4), k = i % 4; g.add(ink(box(0.6, 0.4, 0.42, iceBlockM, stackX + (k % 2) * 0.66 + lay * 0.3, SHORE_Y + 0.2 + lay * 0.41, stackZ + Math.floor(k / 2) * 0.46, (k - 1.5) * 0.03), 1.03)); }
  { const rp = new THREE.Group(); g.add(rp); // ramp: two planks with cleats from the ice up onto the bank
    const a = new THREE.Vector3(0.6, 0.03, -12.4), b = new THREE.Vector3(0.6, SHORE_Y + 0.05, -17.4); const len = a.distanceTo(b);
    rp.position.copy(a).lerp(b, 0.5); rp.rotation.x = Math.atan2(b.y - a.y, Math.abs(b.z - a.z)); // far (-z) end up on the bank
    const wd = std({ map: T.wood([140, 104, 66], 3, false) });
    for (const xx of [-0.32, 0.32]) rp.add(ink(box(0.42, 0.06, len, wd, xx, 0, 0), 1.03)); for (let z = -len / 2 + 0.3; z < len / 2; z += 0.45) rp.add(box(1.1, 0.05, 0.06, wd, 0, 0.04, z)); }
  { const sl = new THREE.Group(); sl.position.set(2.6, SHORE_Y, -16.9); sl.rotation.y = 0.25; g.add(sl); // hand sledge (no horse in 1806)
    const wd = std({ map: T.wood([130, 92, 58], 4, false) }), iron = std({ color: 0x2a2c30, metalness: 0.5 });
    for (const s of [-1, 1]) { const pts = [new THREE.Vector3(-0.9, 0.05, s * 0.4), new THREE.Vector3(0.7, 0.05, s * 0.4), new THREE.Vector3(1.0, 0.18, s * 0.4), new THREE.Vector3(0.95, 0.45, s * 0.4)]; const rn = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 16, 0.045, 6), iron); rn.castShadow = true; sl.add(rn); for (const xx of [-0.6, 0.0, 0.5]) sl.add(box(0.07, 0.25, 0.07, wd, xx, 0.17, s * 0.4)); }
    sl.add(ink(box(1.8, 0.07, 0.95, wd, -0.1, 0.32, 0), 1.03)); for (const s of [-1, 1]) sl.add(box(1.8, 0.2, 0.05, wd, -0.1, 0.44, s * 0.46));
    sl.add(ink(box(0.6, 0.4, 0.42, iceBlockM, -0.4, 0.56, 0, 0.05), 1.03)); K.rope(sl, [0.95, 0.45, 0.4], [1.6, 0.04, 0.1], 0.02, undefined, 0.1); K.rope(sl, [0.95, 0.45, -0.4], [1.6, 0.04, 0.1], 0.02, undefined, 0.1); }

  // ---------------- shore sign: ICE CUTTING · WORKERS ONLY ----------------
  { const sp = new THREE.Group(); sp.position.set(-7.5, SHORE_Y, -16.4); sp.rotation.y = 0.15; g.add(sp);
    const wd = std({ map: T.wood([110, 80, 52], 3) });
    for (const xx of [-0.8, 0.8]) sp.add(ink(box(0.1, 1.9, 0.1, wd, xx, 0.95, 0), 1.05));
    const bd = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 0.9), std({ map: T.signText(['ICE CUTTING', 'WORKERS ONLY'], { bg: '#efe6cf', fg: '#7a1414', w: 1024, h: 460 }) })); bd.position.set(0, 1.45, 0.07); sp.add(bd);
    sp.add(ink(box(2.06, 0.96, 0.06, wd, 0, 1.45, 0.02), 1.02)); K.snowSlab(2.1, 0.14, 0.06, 0, 1.93, 0.03, 0, sp); K.snowPile(sp, 0, 0.1, 0.6, 0.22, 1.8); }

  // ---------------- lanterns on poles at the work area (warm pools on cold ice) ----------------
  for (const [x, z, ry] of [[-7.5, -6.2, 0.3], [0.8, -6.0, -0.4], [-3.0, 0.6, 2.6]]) { const L = K.lanternPole(g, x, z, { ry, h: 2.5 }); H.lamps.push(L); K.snowPile(g, x, z, 0.35, 0.12, 1.0); }

  // ---------------- trees: snow-capped pines (one smooth lathe each) and bare trees ----------------
  const pineGeo = (() => { const pts = [new THREE.Vector2(0.001, 0)]; const tiers = 5; for (let i = 0; i < tiers; i++) { const y0 = 0.9 + i * 1.15, rr = 2.0 - i * 0.36; pts.push(new THREE.Vector2(rr, y0), new THREE.Vector2(rr * 0.45, y0 + 1.15)); } pts.push(new THREE.Vector2(0.001, 0.9 + tiers * 1.15 + 0.5)); const geo = new THREE.LatheGeometry(pts, 10); geo.computeVertexNormals();
    const col = []; const n = geo.attributes.normal, p = geo.attributes.position; for (let i = 0; i < n.count; i++) { const up = n.getY(i) > 0.3, snowy = up && p.getY(i) > 0.8; const c = new THREE.Color(snowy ? 0xeef3fb : 0x1f3a2c); col.push(c.r, c.g, c.b); } geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); return geo; })();
  const pineM = std({ vertexColors: true, roughness: 1, flatShading: true }); const trunkM = std({ color: 0x3a2a1e });
  const pine = (x, z, s) => { const t = new THREE.Group(); t.position.set(x, SHORE_Y, z); t.scale.setScalar(s); t.rotation.y = x * 3.1; g.add(t); t.add(cyl(0.18, 0.24, 1.2, trunkM, 0, 0.6, 0, 8)); const m = new THREE.Mesh(pineGeo, pineM); m.castShadow = true; t.add(K.inkOffset(m, 0.05)); };
  for (let i = 0; i < 46; i++) { const a = r() * Math.PI * 2, R = 21 + r() * 26; const x = Math.cos(a) * R, z = Math.sin(a) * R; if (z < -16 && Math.abs(x - 4) < 9) continue; if (z > 30 && Math.abs(x + 10) < 8) continue; pine(x, z, 0.8 + r() * 0.7); }
  const bare = (x, z, s) => { const t = new THREE.Group(); t.position.set(x, SHORE_Y, z); t.scale.setScalar(s); g.add(t); const bm = std({ color: 0x2a221c, roughness: 1 });
    t.add(ink(cyl(0.12, 0.25, 4.5, bm, 0, 2.25, 0, 8), 1.05)); const rr = K.rng(Math.round(x * 10 + z));
    for (let i = 0; i < 7; i++) { const y = 1.8 + i * 0.4, a = rr() * 6.3, L = 1.0 + rr() * 1.2; K.rope(t, [0, y, 0], [Math.cos(a) * L, y + 0.8 + rr() * 0.6, Math.sin(a) * L], 0.04 + (7 - i) * 0.006, bm); } };
  bare(-17.5, -18, 1.1); bare(18.5, 6, 1.0); bare(-19, 12, 0.9);

  // ---------------- far shore: farmhouse with one warm window (the estate, unnamed) ----------------
  { const fh = new THREE.Group(); fh.position.set(-9, SHORE_Y, 26); fh.rotation.y = Math.PI + 0.2; fh.scale.setScalar(1.35); g.add(fh);
    const hs = K.gableHouse(fh, 0, 0, 0, { w: 7, d: 5, h: 4.2, roofH: 2.4, wall: (rx, ry) => { const t2 = T.clapboard([190, 180, 160]); t2.repeat.set(rx, ry); return std({ map: t2 }); }, roof: std({ map: T.shingles([70, 60, 55]) }), snow: true, trim: 0xe9e0c8 });
    const addWin = K.windowKit(hs, { panes: true, snowSill: true }); addWin(-1.8, 1.6, 2.56, 0, true); addWin(1.8, 1.6, 2.56, 0, true); addWin(0, 4.6, 2.56, 0, true); K.doorway(hs, 0, 2.52, 1.0, 2.0, { frame: 0x3a2a1c }); H.lamps.push(K.hangingLantern(hs, 0.85, 2.3, 2.85, { range: 6 }));
    hs.add(ink(box(0.7, 2.0, 0.7, std({ map: T.bricks() }), 2.0, 5.6, 0), 1.03)); K.snowSlab(0.8, 0.8, 0.1, 2.0, 6.6, 0, 0, hs);
    const pl = new THREE.PointLight(0xffb060, 5, 9, 1.4); pl.position.set(0, 1.8, 3.6); hs.add(pl);
    const smokeT = T.radial('rgba(200,210,230,.5)', 'rgba(200,210,230,0)'); for (let i = 0; i < 5; i++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: smokeT, transparent: true, depthWrite: false })); sp.position.set(2.0 + i * 0.25, 7.0 + i * 0.7, 0); sp.scale.setScalar(0.9 + i * 0.4); hs.add(sp); } }

  // ---------------- night sky dome, moon (only shown under dark presets) ----------------
  const dome = new THREE.Mesh(new THREE.SphereGeometry(95, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2 + 0.05), new THREE.MeshBasicMaterial({ map: T.nightSky(), side: THREE.BackSide, fog: false, depthWrite: false }));
  dome.renderOrder = -1; dome.position.y = -2; g.add(dome);
  const moonS = new THREE.Sprite(new THREE.SpriteMaterial({ map: T.moon(), fog: false, depthWrite: false, transparent: true })); moonS.scale.set(16, 16, 1); moonS.position.set(-55, 22, -60); g.add(moonS);

  H.tick = (t, L) => {
    H.sawTick(t);
    const c = new THREE.Color(L.bg); const night = (0.3 * c.r + 0.59 * c.g + 0.11 * c.b) < 0.15;
    dome.visible = night; moonS.visible = night;
  };
  return H;
}
