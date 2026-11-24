// S02 hero prop: the brig *Favorite* (2 masts) and the ship *Tuscany* (3 masts) from one hull builder,
// plus stylised water (harbour / sea / river / tropic tints) with ripples, a foam ring and a wake.
// Local frame: origin at the waterline amidships, bow toward +x, port side +z. Everything is seeded/deterministic.
import * as THREE from '/node_modules/three/build/three.module.js';
import * as T from './textures.js';
import * as K from './kit.js';
const { std, box, cyl, ink, inkOffset, rope } = K;
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, t) => a + (b - a) * t;

export const SHIPS = {
  // brig: fore + main square-rigged, spanker on the main
  favorite: { name: 'FAVORITE', port: 'BOSTON', L: 20, B: 6, masts: [{ x: 5.0, s: 1 }, { x: -1.9, s: 1.04, spanker: true }] },
  // ship: fore, main, mizzen square-rigged, spanker on the mizzen
  tuscany: { name: 'TUSCANY', port: 'BOSTON', L: 23, B: 6.6, masts: [{ x: 6.6, s: 1 }, { x: 0.6, s: 1.06 }, { x: -5.6, s: 0.8, spanker: true }] },
};

// ---------------------------------------------------------------------------------------------
// buildShip(kind) → { group, flat, sails(v), hatch(v), lamps, deckY, L, B, hatchAt, tick(t) }
//   group: the mover (stage sets position/heading/bob); flat: foam ring + wake at the waterline (follows group, no roll)
//   sails(v): 0 furled … 1 set (staggered drop); hatch(v): 0 closed … 1 open
export function buildShip(kind = 'favorite', o = {}) {
  const S = { ...SHIPS[kind] || SHIPS.favorite, ...o };
  const { L, B } = S; const DECK = 1.4, RAIL = 2.4, KEEL = -2.5;
  const group = new THREE.Group(); group.name = 'ship:' + kind; group.rotation.order = 'YXZ'; group.userData.bob = o.bob ?? 0.6;
  const flat = new THREE.Group(); flat.name = 'shipFlat:' + kind;

  const U = (x) => (x + L / 2) / L;
  const bw = (x) => { const u = U(x); if (u < 0.12) return B / 2 * (0.8 + 0.2 * Math.sin(u / 0.12 * Math.PI / 2)); if (u < 0.58) return B / 2; return B / 2 * Math.sqrt(Math.max(0, 1 - ((u - 0.58) / 0.42) ** 2)) + 0.02; };
  const top = (x) => RAIL + 0.5 * (2 * U(x) - 1) ** 2 * (U(x) > 0.5 ? 1.1 : 0.8);
  const keel = (x) => { const u = U(x); return u < 0.82 ? KEEL : lerp(KEEL, top(x) - 0.3, ((u - 0.82) / 0.18) ** 1.6); };
  const shape = (q) => Math.sqrt(Math.max(0, 1 - q ** 2.4));
  const halfAt = (x, y) => { const t = top(x), k = keel(x); return bw(x) * shape(clamp((t - y) / Math.max(0.01, t - k))); };

  // ---------------- hull: lofted stations, one smooth shell ----------------
  const NS = 48, KQ = 12;
  const pos = [], uv = [], idx = [];
  const ring = 2 * KQ + 1;
  for (let i = 0; i <= NS; i++) {
    const x = -L / 2 + L * i / NS, t = top(x), k = keel(x), w = bw(x);
    for (let j = 0; j < ring; j++) {
      const side = j <= KQ ? 1 : -1, q = j <= KQ ? j / KQ : (2 * KQ - j) / KQ;
      const y = t - (t - k) * q, z = side * w * shape(q);
      pos.push(x, y, z); uv.push(x / 5, 1 - (t - y) / 5);
    }
  }
  for (let i = 0; i < NS; i++) for (let j = 0; j < ring - 1; j++) {
    const a = i * ring + j, b = (i + 1) * ring + j, c = (i + 1) * ring + j + 1, d = i * ring + j + 1;
    idx.push(a, c, b, a, d, c);
  }
  // transom cap (flat stern face) fanned from its centroid
  const c0 = pos.length / 3; { const x = -L / 2; pos.push(x, (top(x) + keel(x)) / 2 + 0.6, 0); uv.push(0.5, 0.5); }
  for (let j = 0; j < ring - 1; j++) idx.push(c0, j + 1, j); idx.push(c0, 0, ring - 1);
  const hg = new THREE.BufferGeometry(); hg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); hg.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); hg.setIndex(idx); hg.computeVertexNormals();
  const hullTex = T.hull(o.hullColors || {}); const hullMesh = new THREE.Mesh(hg, std({ map: hullTex, roughness: 0.7 })); hullMesh.castShadow = true; hullMesh.receiveShadow = true;
  group.add(inkOffset(hullMesh, 0.06));

  // ---------------- deck (with the main hatch opening), inner bulwarks, cap rail ----------------
  const masts = S.masts; const hatchX = masts.length === 2 ? (masts[0].x + masts[1].x) / 2 + 0.1 : (masts[0].x + masts[1].x) / 2 - 0.2;
  const HW = 1.0, HD = 0.85; // hatch half-length (x), half-width (z)
  const inner = (x) => Math.max(0.02, bw(x) * shape((top(x) - DECK) / (top(x) - keel(x))) - 0.14);
  const deckShape = new THREE.Shape();
  const xs = []; for (let i = 0; i <= NS; i++) xs.push(-L / 2 + 0.12 + (L - 0.4) * i / NS);
  xs.forEach((x, i) => (i ? deckShape.lineTo(x, -inner(x)) : deckShape.moveTo(x, -inner(x))));
  for (let i = xs.length - 1; i >= 0; i--) deckShape.lineTo(xs[i], inner(xs[i]));
  const hole = new THREE.Path(); hole.moveTo(hatchX - HW, -HD); hole.lineTo(hatchX - HW, HD); hole.lineTo(hatchX + HW, HD); hole.lineTo(hatchX + HW, -HD); hole.closePath(); deckShape.holes.push(hole);
  const dg = new THREE.ShapeGeometry(deckShape); dg.rotateX(-Math.PI / 2);
  { const p = dg.attributes.position, u2 = dg.attributes.uv; for (let i = 0; i < p.count; i++) u2.setXY(i, p.getX(i) / 3, p.getZ(i) / 3); }
  const deckTex = T.wood([176, 140, 96], 8, false); const deck = new THREE.Mesh(dg, std({ map: deckTex })); deck.position.y = DECK; deck.receiveShadow = true; group.add(deck);
  // inner bulwark + cap rail strips along both sides and across the stern
  const bwPos = [], bwIdx = [], capPos = [], capIdx = [];
  const path = []; for (let i = 0; i <= NS; i++) path.push([xs[i], 1]); for (let i = NS; i >= 0; i--) path.push([xs[i], -1]);
  path.push([xs[0], 1]);
  path.forEach(([x, s], i) => {
    const zi = s * inner(x), t = top(x) - 0.02, zo = s * bw(x);
    bwPos.push(x, DECK, zi, x, t, zi); capPos.push(x, t, zi, x === xs[0] ? -L / 2 : x, top(x), zo);
    if (i) { const a = (i - 1) * 2; bwIdx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); capIdx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
  });
  const bwg = new THREE.BufferGeometry(); bwg.setAttribute('position', new THREE.Float32BufferAttribute(bwPos, 3)); bwg.setIndex(bwIdx); bwg.computeVertexNormals();
  group.add(new THREE.Mesh(bwg, std({ color: 0xc9a46a, side: THREE.DoubleSide })));
  const cpg = new THREE.BufferGeometry(); cpg.setAttribute('position', new THREE.Float32BufferAttribute(capPos, 3)); cpg.setIndex(capIdx); cpg.computeVertexNormals();
  group.add(new THREE.Mesh(cpg, std({ color: 0x5a3a20, side: THREE.DoubleSide })));
  // stanchions along the inside of the bulwark (detail at deck level)
  const stanM = std({ color: 0xa8854f });
  for (let x = -L / 2 + 1.2; x < L / 2 - 2.5; x += 1.3) for (const s of [1, -1]) group.add(box(0.1, top(x) - DECK, 0.1, stanM, x, (DECK + top(x)) / 2, s * (inner(x) + 0.03)));

  // ---------------- stern: transom board, windows, rudder, taffrail lantern ----------------
  const xT = -L / 2 - 0.03, tT = top(-L / 2);
  const board = new THREE.Mesh(new THREE.PlaneGeometry(B * 0.62, B * 0.62 * 300 / 1024), std({ map: T.sternBoard(S.name, S.port), roughness: 0.6 }));
  board.position.set(xT - 0.02, tT - 0.62, 0); board.rotation.y = -Math.PI / 2; group.add(board);
  group.add(box(0.08, 0.1, B * 0.66, std({ color: 0xd9a53a, metalness: 0.4 }), xT, tT - 0.12, 0)); // gilded taffrail moulding
  const winM = std({ color: 0x1a2430, roughness: 0.2, metalness: 0.3 }), winF = std({ color: 0xe8dcc0 });
  for (let k = -1.5; k <= 1.5; k++) { const z = k * 0.62; group.add(box(0.06, 0.42, 0.46, winF, xT + 0.01, tT - 1.4, z, 0, false)); group.add(box(0.07, 0.32, 0.36, winM, xT - 0.005, tT - 1.4, z, 0, false)); group.add(box(0.08, 0.32, 0.03, winF, xT - 0.01, tT - 1.4, z, 0, false)); }
  { const rTop = tT - 1.75, rBot = KEEL + 0.3; group.add(ink(box(0.35, rTop - rBot, 0.22, std({ map: T.wood([60, 50, 40], 3) }), xT - 0.2, (rTop + rBot) / 2, 0), 1.02)); } // rudder (its head stays below the stern windows and the name)
  // ---------------- bow: stem post, bowsprit + jibboom, catheads with anchors, windlass ----------------
  const spar = std({ map: T.wood([150, 110, 66], 3) });
  const bx0 = L / 2 - 1.4, by0 = top(L / 2 - 1.4) - 0.05, ang = 0.26, dir = [Math.cos(ang), Math.sin(ang)];
  const BS = 4.6, JB = 3.6; // bowsprit, jibboom lengths
  const at = (d) => [bx0 + dir[0] * d, by0 + dir[1] * d, 0];
  { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.2, BS, 10), spar); m.position.set(...at(BS / 2)); m.rotation.z = -(Math.PI / 2 - ang); m.castShadow = true; group.add(inkOffset(m, 0.035)); }
  { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.1, JB + 1.2, 8), spar); m.position.set(...at(BS + JB / 2 - 0.6)); m.rotation.z = -(Math.PI / 2 - ang); m.castShadow = true; group.add(inkOffset(m, 0.03)); }
  group.add(ink(box(0.3, 0.3, 0.3, std({ color: 0x3a2a1c }), ...at(BS - 0.1)), 1.05)); // bowsprit cap
  const iron = std({ color: 0x2a2c30, metalness: 0.5, roughness: 0.5 });
  for (const s of [1, -1]) {
    const cx = L / 2 - 3.2, cz = s * (bw(cx) + 0.25);
    const cat = box(0.25, 0.25, 1.0, spar, cx, top(cx) - 0.2, s * (bw(cx) - 0.1)); group.add(ink(cat, 1.04));
    const an = new THREE.Group(); an.position.set(cx - 0.2, top(cx) - 1.2, cz); an.rotation.x = s * 0.15; group.add(an); // anchor hanging at the cathead
    an.add(ink(box(0.1, 1.5, 0.1, iron, 0, 0, 0), 1.06)); an.add(ink(box(1.1, 0.1, 0.1, std({ map: T.wood([100, 70, 45], 3) }), 0, 0.68, 0), 1.06));
    const arm = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.055, 6, 14, Math.PI), iron); arm.rotation.z = Math.PI; arm.position.y = -0.3; an.add(arm);
    for (const ax of [-0.45, 0.45]) { const fl = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.24, 3), iron); fl.position.set(ax, -0.18, 0); an.add(fl); }
    rope(group, [cx - 0.2, top(cx) - 0.25, s * (bw(cx) + 0.1)], [cx - 0.2, top(cx) - 0.45, cz], 0.03);
  }
  { const wx = L / 2 - 2.6; const wl = cyl(0.22, 0.22, 2.0, spar, wx, DECK + 0.45, 0, 12); wl.rotation.x = Math.PI / 2; group.add(ink(wl, 1.04)); for (const s of [1, -1]) group.add(ink(box(0.28, 0.9, 0.28, spar, wx, DECK + 0.45, s * 1.15), 1.04)); }

  // ---------------- masts, yards, sails ----------------
  const sailTex = T.sailcloth(), sailM = new THREE.MeshStandardMaterial({ map: sailTex, side: THREE.DoubleSide, roughness: 0.9 });
  const furlM = std({ map: sailTex, color: 0xe8dcc0 });
  const SAILS = []; // { mesh, roll, stagger, kind }
  const mastInfo = [];
  const mastSeg = (x, y0, y1, r0, r1) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(r1, r0, y1 - y0, 12), spar); m.position.set(x, (y0 + y1) / 2, 0); m.castShadow = true; group.add(inkOffset(m, 0.035)); };
  // a square sail hanging from a yard: top width wt, bottom width wb, height h, billow forward (+x). Pivot at the yard.
  const sailGeo = (wt, wb, h, bil) => {
    const nu = 10, nv = 8, p = [], u2 = [], ix = [];
    for (let j = 0; j <= nv; j++) for (let i = 0; i <= nu; i++) {
      const u = i / nu - 0.5, v = j / nv; const w = lerp(wt, wb, v); const curve = Math.cos(u * Math.PI) * Math.sin(Math.min(1, v * 1.15) * Math.PI * 0.85 + 0.25);
      p.push(bil * curve, -v * h, u * w); u2.push(i / nu, 1 - v);
    }
    for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) { const a = j * (nu + 1) + i; ix.push(a, a + nu + 1, a + 1, a + 1, a + nu + 1, a + nu + 2); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(u2, 2)); g.setIndex(ix); g.computeVertexNormals(); return g;
  };
  const yardGroups = [], braceRopes = [];
  const yard = (parent, x, y, len, r) => { for (const s of [1, -1]) { const m = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.45, r, len / 2, 8), spar); m.rotation.x = s * Math.PI / 2; m.position.set(x, y, s * len / 4); m.castShadow = true; parent.add(inkOffset(m, 0.025)); } };
  masts.forEach((M, mi) => {
    const s = M.s, x = M.x, Hl = 8 * s, Ht = 5.4 * s, Hg = 4.0 * s;
    const yTop = DECK + Hl, yTm = yTop + Ht - 0.9, yTg = yTm + Hg - 0.6;
    mastSeg(x, DECK - 0.1, yTop + 0.2, 0.25 * s, 0.2 * s); // lower mast
    mastSeg(x + 0.05, yTop - 0.9, yTm + 0.2, 0.15 * s, 0.12 * s); // topmast
    mastSeg(x + 0.08, yTm - 0.6, yTg + 0.4, 0.09 * s, 0.06 * s); // topgallant mast
    group.add(ink(box(1.3 * s, 0.12, 1.9 * s, spar, x - 0.15, yTop - 0.35, 0), 1.03)); // the top (platform)
    group.add(ink(box(0.5 * s, 0.1, 1.4 * s, spar, x, yTm - 0.4, 0), 1.04)); // crosstrees
    group.add(ink(cyl(0.12 * s, 0.12 * s, 0.14, spar, x + 0.08, yTg + 0.62, 0, 10), 1.1)); // truck
    // yards: course, topsail, topgallant
    const Y = [{ y: yTop - 0.95, len: B * 1.55 * s }, { y: yTm - 0.7, len: B * 1.2 * s }, { y: yTg - 0.35, len: B * 0.85 * s }];
    const yg = new THREE.Group(); yg.position.x = x; group.add(yg); yardGroups.push(yg); // yards + square sails swing together (braced when sailing)
    Y.forEach((q, k) => yard(yg, 0.25, q.y, q.len, (0.16 - k * 0.035) * s));
    // sails hang from each yard down to the yard below (the course to just above the bulwark)
    Y.forEach((q, k) => {
      const yb = k === 0 ? top(x) + 0.9 : Y[k - 1].y + 0.25, h = q.y - yb - 0.12;
      const wt = q.len * 0.9, wb = k === 0 ? q.len * 0.98 : Y[k - 1].len * 0.9;
      const m = new THREE.Mesh(sailGeo(wt, wb, h, Math.min(1.1, h * 0.2)), sailM); m.position.set(0.4, q.y - 0.12, 0); m.castShadow = true; yg.add(m);
      const roll = new THREE.Mesh(new THREE.CapsuleGeometry(0.15 * s, wt * 0.92, 4, 10), furlM); roll.rotation.x = Math.PI / 2; roll.position.set(0.42, q.y + 0.05, 0); roll.castShadow = true; yg.add(ink(roll, 1.05));
      SAILS.push({ mesh: m, roll, stagger: [0.3, 0, 0.15][k] + mi * 0.06, kind: 'square' });
    });
    mastInfo.push({ x, yTop, yTm, yTg, s, Y, yg });
    // pin rail with belaying pins + a coil at the mast foot
    group.add(ink(box(0.12, 0.08, 1.4, spar, x + 0.7, DECK + 0.7, 0), 1.05)); for (const zz of [-0.5, -0.17, 0.17, 0.5]) group.add(cyl(0.025, 0.025, 0.3, spar, x + 0.7, DECK + 0.78, zz, 6));
    for (const zz of [-0.7, 0.7]) group.add(box(0.1, 0.7, 0.1, spar, x + 0.7, DECK + 0.35, zz));
    K.ropeCoil(group, x - 0.55, DECK, 0.55, 0.3, 4);
  });
  // spanker: gaff + boom on the aftmost mast, sail between them (furled along the boom)
  { const mI = mastInfo[masts.findIndex((m) => m.spanker)]; const x = mI.x, s = mI.s;
    const yB = DECK + 2.3, yG = mI.yTop - 1.4, lenB = Math.min(6.8 * s, x + L / 2 + 1.2), lenG = 4.6 * s;
    const boom = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.13, lenB, 8), spar); boom.rotation.z = Math.PI / 2; boom.position.set(x - lenB / 2, yB, 0); boom.castShadow = true; group.add(inkOffset(boom, 0.025));
    const gA = 0.5; const gaff = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.11, lenG, 8), spar); gaff.rotation.z = Math.PI / 2 + gA; gaff.position.set(x - Math.cos(gA) * lenG / 2, yG + Math.sin(gA) * lenG / 2, 0); gaff.castShadow = true; group.add(inkOffset(gaff, 0.025));
    const pk = [x - Math.cos(gA) * lenG, yG + Math.sin(gA) * lenG];
    const sp = new THREE.BufferGeometry(); const P = [0, yG, 0, 0, yB + 0.1, 0, -(x - pk[0]), pk[1], 0, -(lenB - 0.2), yB + 0.1, 0].map((v, i) => (i % 3 === 0 ? v : v));
    sp.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); sp.setAttribute('uv', new THREE.Float32BufferAttribute([1, 1, 1, 0, 0, 1, 0, 0], 2)); sp.setIndex([0, 1, 2, 2, 1, 3]); sp.computeVertexNormals();
    const spanker = new THREE.Mesh(sp, sailM); spanker.position.set(x - 0.2, 0, 0.0); spanker.castShadow = true; group.add(spanker);
    const roll = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, lenB * 0.8, 4, 10), furlM); roll.rotation.z = Math.PI / 2; roll.position.set(x - lenB * 0.48, yB + 0.2, 0); group.add(ink(roll, 1.05));
    SAILS.push({ mesh: spanker, roll, stagger: 0.2, kind: 'fore-aft' });
    rope(group, [pk[0], pk[1], 0], [x - lenB + 0.3, yB, 0], 0.02); // leech line
  }
  // jibs: triangles on the fore topmast stay and the jib stay (stowed on the bowsprit when furled)
  const F = mastInfo[0];
  const stays = [[[F.x, F.yTm - 0.2, 0], at(BS - 0.2)], [[F.x + 0.05, F.yTg - 0.2, 0], at(BS + JB - 0.4)]];
  stays.forEach(([hd, tk], k) => {
    const clew = [lerp(tk[0], F.x, 0.62), Math.max(top(F.x) + 1.0, lerp(tk[1], hd[1], 0.18)), 0];
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, hd[0] - tk[0], hd[1] - tk[1], 0, clew[0] - tk[0], clew[1] - tk[1], 0], 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 1, 1, 1, 0], 2)); g.setIndex([0, 1, 2]); g.computeVertexNormals();
    const jib = new THREE.Mesh(g, sailM); jib.position.set(...tk); jib.castShadow = true; group.add(jib);
    const roll = new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 1.6, 4, 8), furlM); roll.position.set(...at(BS - 1.2 + k * 2.2)); roll.position.y += 0.18; roll.rotation.z = -(Math.PI / 2 - ang); group.add(ink(roll, 1.06));
    SAILS.push({ mesh: jib, roll, stagger: 0.1 + k * 0.1, kind: 'jib' });
  });

  // ---------------- rigging: ratline shrouds, stays, backstays, a few braces ----------------
  const ratTex = T.ratlines(5, 18), ratTex2 = T.ratlines(3, 12);
  const ratM = new THREE.MeshBasicMaterial({ map: ratTex, transparent: true, alphaTest: 0.4, side: THREE.DoubleSide, color: 0x6e6a62 });
  const ratM2 = new THREE.MeshBasicMaterial({ map: ratTex2, transparent: true, alphaTest: 0.4, side: THREE.DoubleSide, color: 0x6e6a62 });
  const quad = (a, b, c, d, m) => { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute([...a, ...b, ...c, ...d], 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 1, 0, 0, 1, 1, 1], 2)); g.setIndex([0, 1, 2, 2, 1, 3]); const q = new THREE.Mesh(g, m); group.add(q); return q; };
  mastInfo.forEach(({ x, yTop, yTm, yTg, s }) => {
    for (const sd of [1, -1]) {
      const zc = sd * (bw(x) + 0.12), yr = top(x);
      quad([x - 1.6 * s, yr, zc], [x + 0.5 * s, yr, zc], [x - 0.25, yTop - 0.4, sd * 0.32], [x + 0.15, yTop - 0.4, sd * 0.32], ratM); // lower shrouds
      quad([x - 0.65 * s, yTop - 0.3, sd * 0.92 * s], [x + 0.25 * s, yTop - 0.3, sd * 0.92 * s], [x - 0.02, yTm - 0.5, sd * 0.14], [x + 0.12, yTm - 0.5, sd * 0.14], ratM2); // topmast shrouds
      group.add(box(1.9 * s, 0.12, 0.22, spar, x - 0.5 * s, yr - 0.3, sd * (bw(x) + 0.08))); // channel (chain wale)
      rope(group, [x + 0.05, yTm, sd * 0.1], [x - 3.2 * s, top(x - 3.2 * s), sd * (bw(x - 3.2 * s) + 0.05)], 0.022); // topmast backstay
      rope(group, [x + 0.08, yTg, sd * 0.06], [x - 4.2 * s, top(x - 4.2 * s), sd * (bw(x - 4.2 * s) + 0.05)], 0.018); // topgallant backstay
    }
  });
  // stays: each mast to the one forward (fore mast to the bowsprit)
  rope(group, [F.x, F.yTop - 0.3, 0], at(1.6), 0.04); rope(group, [F.x, F.yTm - 0.2, 0], at(BS - 0.2), 0.03); rope(group, [F.x + 0.05, F.yTg - 0.2, 0], at(BS + JB - 0.4), 0.025);
  for (let i = 1; i < mastInfo.length; i++) { const A = mastInfo[i], P = mastInfo[i - 1]; rope(group, [A.x, A.yTop - 0.3, 0], [P.x - 0.4, DECK + 0.6, 0], 0.04); rope(group, [A.x, A.yTm - 0.2, 0], [P.x, P.yTop - 0.2, 0], 0.03); rope(group, [A.x, A.yTg - 0.2, 0], [P.x, P.yTm - 0.3, 0], 0.022); }
  // braces from the main course and topsail yard arms to the rail aft (a handful, not hundreds)
  { const M = mastInfo[1]; for (const sd of [1, -1]) for (const q of M.Y.slice(0, 2)) { const xa = Math.max(-L / 2 + 1, M.x - 5); const arm = [0.25, q.y, sd * q.len / 2 * 0.97], rail = [xa, top(xa), sd * bw(xa)]; braceRopes.push({ m: rope(group, [M.x + 0.25, q.y, arm[2]], rail, 0.016), yg: M.yg, arm, rail }); } }
  // bowsprit gear: martingale and bobstay
  rope(group, at(BS + JB - 0.4), [at(BS)[0] - 0.2, at(BS)[1] - 1.5, 0], 0.02); rope(group, [at(BS)[0] - 0.2, at(BS)[1] - 1.5, 0], at(BS - 0.1), 0.02); rope(group, at(1.8), [L / 2 - 0.3, 0.3, 0], 0.03);

  // ---------------- deck dressing ----------------
  const plank = std({ map: T.wood([140, 100, 62], 5, false) }), plankD = std({ map: T.wood([96, 64, 40], 4) });
  // main hatch: coaming, hinged cover (hinge on the port edge), dark hold below
  const hatchG = new THREE.Group(); hatchG.position.set(hatchX, DECK, 0); group.add(hatchG);
  for (const [w, d, xx, zz] of [[HW * 2 + 0.3, 0.15, 0, HD + 0.075], [HW * 2 + 0.3, 0.15, 0, -HD - 0.075], [0.15, HD * 2, HW + 0.075, 0], [0.15, HD * 2, -HW - 0.075, 0]]) hatchG.add(ink(box(w, 0.35, d, plankD, xx, 0.175, zz), 1.03));
  const holdBox = new THREE.Mesh(new THREE.BoxGeometry(HW * 2 + 1.2, 2.4, HD * 2 + 1.2), new THREE.MeshStandardMaterial({ color: 0x140e09, side: THREE.BackSide, roughness: 1 })); holdBox.position.y = -1.2; hatchG.add(holdBox);
  for (let i = 0; i < 5; i++) { const ib = box(0.5, 0.4, 0.5, std({ map: T.ice(i + 2), color: 0x9ab8cc }), -0.6 + i * 0.32, -2.2 + (i % 2) * 0.4, -0.3 + (i % 3) * 0.25, i * 0.3, false); hatchG.add(ib); } // ice in the hold, barely lit
  const hinge = new THREE.Group(); hinge.position.set(0, 0.36, HD + 0.15); hatchG.add(hinge);
  const cover = new THREE.Group(); cover.position.set(0, 0, -(HD + 0.15)); hinge.add(cover);
  cover.add(ink(box(HW * 2 + 0.3, 0.1, HD * 2 + 0.3, plank, 0, 0.05, 0), 1.02));
  for (const xx of [-HW * 0.6, 0, HW * 0.6]) cover.add(box(0.12, 0.06, HD * 2 + 0.2, plankD, xx, 0.13, 0));
  const ringH = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.02, 6, 12), iron); ringH.rotation.x = Math.PI / 2; ringH.position.set(0, 0.12, -HD + 0.1); cover.add(ringH);
  const hatch = (v) => { hinge.rotation.x = clamp(v) * 1.95; };
  // stay tackle over the hatch (for lowering blocks): a block hanging from the main stay
  { const hx = hatchX + 0.2; const yS = DECK + 7.0; rope(group, [hx, yS, 0], [hx, DECK + 2.3, 0], 0.02); const blk = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 6), plankD); blk.scale.set(0.7, 1.2, 0.5); blk.position.set(hx, DECK + 2.3, 0); group.add(ink(blk, 1.1)); const hk = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.018, 6, 10, 4.5), iron); hk.position.set(hx, DECK + 2.08, 0); group.add(hk); }
  // galley caboose with a stove pipe, forward of the hatch
  { const gx = masts.length === 2 ? masts[0].x - 1.6 : masts[0].x - 1.6; const cab = new THREE.Group(); cab.position.set(gx, DECK, 0.6); group.add(cab);
    cab.add(ink(box(1.4, 1.3, 1.2, std({ map: T.wood([150, 60, 45], 5) }), 0, 0.65, 0), 1.03)); cab.add(ink(box(1.6, 0.12, 1.4, plankD, 0, 1.36, 0), 1.03));
    cab.add(box(0.05, 0.8, 0.5, plankD, -0.71, 0.5, 0)); cab.add(ink(cyl(0.08, 0.08, 0.9, iron, 0.4, 1.8, 0.3, 10), 1.1)); cab.add(cyl(0.12, 0.08, 0.12, iron, 0.4, 2.28, 0.3, 10)); }
  // ship's bell on a little belfry
  { const bx = masts[0].x - 0.6; for (const s of [-0.35, 0.35]) group.add(ink(box(0.1, 1.2, 0.1, spar, bx, DECK + 0.6, s - 0.9), 1.05)); group.add(ink(box(0.12, 0.12, 0.9, spar, bx, DECK + 1.2, -0.9), 1.05));
    const pts = [new THREE.Vector2(0.001, 0.32), new THREE.Vector2(0.1, 0.3), new THREE.Vector2(0.13, 0.15), new THREE.Vector2(0.2, 0.02), new THREE.Vector2(0.22, 0)];
    const bell = new THREE.Mesh(new THREE.LatheGeometry(pts, 16), std({ color: 0xc9962e, metalness: 0.7, roughness: 0.3 })); bell.position.set(bx, DECK + 0.82, -0.9); bell.castShadow = true; group.add(ink(bell, 1.08)); }
  // wheel + binnacle at the stern
  { const wx = -L / 2 + 2.0; const wg = new THREE.Group(); wg.position.set(wx, DECK, 0); group.add(wg);
    wg.add(ink(box(0.3, 1.0, 0.3, plankD, 0, 0.5, 0), 1.05));
    const wheel = new THREE.Group(); wheel.position.set(0.22, 1.05, 0); wheel.rotation.y = Math.PI / 2; wg.add(wheel);
    wheel.add(ink(new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.045, 8, 28), spar), 1.06));
    for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; const sp2 = box(0.04, 1.3, 0.04, spar, 0, 0, 0); sp2.rotation.z = a; wheel.add(sp2); const hnd = cyl(0.03, 0.03, 0.14, spar, Math.sin(-a) * 0.72, Math.cos(a) * 0.72, 0, 6); hnd.rotation.z = a; wheel.add(hnd); }
    wheel.add(cyl(0.1, 0.1, 0.12, std({ color: 0xc9962e, metalness: 0.6 }), 0, 0, 0)); wheel.children[wheel.children.length - 1].rotation.x = Math.PI / 2;
    wg.add(ink(box(0.45, 0.7, 0.45, plankD, 1.1, 0.35, 0), 1.05)); const dome = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 8, 0, 6.3, 0, 1.6), std({ color: 0xc9962e, metalness: 0.7, roughness: 0.3 })); dome.position.set(1.1, 0.7, 0); wg.add(dome); }
  // cargo on deck: water cask, lashed barrels and crates along the rails (clear of the hatch and gangway)
  const barrelM = std({ map: T.wood([140, 85, 45], 8) });
  const deckBarrel = (x, z) => { const g = new THREE.Group(); g.position.set(x, DECK, z); group.add(g); K.barrel(g, 0, 0, barrelM); return g; };
  deckBarrel(masts[1].x + 1.0, -1.6); deckBarrel(masts[1].x + 1.0, -2.25); deckBarrel(masts[1].x - 1.3, 1.9);
  for (const [x, z, s2] of [[masts[0].x + 1.4, -1.5, 0.7], [masts[0].x + 1.4, -1.5, 0.5], [masts[1].x - 2.4, -1.9, 0.75]]) K.crate(group, x, z, s2, DECK + s2 / 2 + (s2 === 0.5 ? 0.7 : 0), 0.1);
  rope(group, [masts[1].x + 1.0, DECK + 0.9, -1.15], [masts[1].x + 1.0, DECK + 0.9, -2.75], 0.02, undefined, 0.05); // lashing
  // lanterns: big taffrail lantern at the stern + one hanging at the main mast over the hatch (lit at night)
  const lamps = [];
  { const tl = new THREE.Group(); tl.position.set(-L / 2 + 0.2, tT, 0); group.add(tl); tl.add(ink(box(0.08, 0.6, 0.08, iron, 0, 0.3, 0), 1.1)); const arm = box(0.5, 0.06, 0.06, iron, -0.2, 0.6, 0); tl.add(arm);
    const L1 = K.hangingLantern(tl, -0.42, 0.62, 0, { range: 9 }); L1.group.scale.setScalar(1.5); lamps.push(L1); }
  lamps.push(K.hangingLantern(group, masts[1].x + 0.35, DECK + 2.9, 0.35, { range: 8 }));
  // boarding steps inside the port rail by the gangway (x = gangwayX), so people step down to the deck
  const gangwayX = hatchX - 2.2;
  for (let i = 0; i < 2; i++) group.add(ink(box(0.9, 0.3 + i * 0.3, 0.45, plank, gangwayX, DECK + (0.3 + i * 0.3) / 2, inner(gangwayX) - 0.25 - (1 - i) * 0.45), 1.03)); // port side (the side that lies against a wharf)

  // ---------------- flat waterline group: dark band, foam ring, bow waves, wake ----------------
  const waterOutline = []; for (let i = 0; i <= NS; i++) { const x = -L / 2 + L * i / NS; waterOutline.push([x, halfAt(x, 0)]); }
  const ringMesh = (inR, outR, mat, along = 1) => { // strip around the waterline outline offset outward from inR to outR
    const P = [], UV = [], I = []; const loop = [...waterOutline.map(([x, w]) => [x, w, 1]), ...waterOutline.slice().reverse().map(([x, w]) => [x, -w, -1])]; loop.push(loop[0]);
    let acc = 0;
    loop.forEach(([x, z], i) => {
      const [x2, z2] = loop[Math.min(loop.length - 1, i + 1)], [x0, z0] = loop[Math.max(0, i - 1)];
      let nx = -(z2 - z0), nz = x2 - x0; const l = Math.hypot(nx, nz) || 1; nx /= l; nz /= l; // outward normal (loop runs port bow-ward then stb stern-ward)
      if (i) acc += Math.hypot(x - loop[i - 1][0], z - loop[i - 1][1]);
      P.push(x + nx * inR, 0, z + nz * inR, x + nx * outR, 0, z + nz * outR); UV.push(acc / 6 * along, 1, acc / 6 * along, 0);
      if (i) { const a = (i - 1) * 2; I.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
    });
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(UV, 2)); g.setIndex(I);
    const m = new THREE.Mesh(g, mat); m.renderOrder = 2; return m;
  };
  const fmat = (tx, op) => new THREE.MeshBasicMaterial({ map: tx, transparent: true, opacity: op, depthWrite: false, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -4 });
  const band = ringMesh(0.0, 1.4, new THREE.MeshBasicMaterial({ color: 0x0c1418, transparent: true, opacity: 0.28, depthWrite: false, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -2 })); flat.add(band);
  const foamTex = T.foam(5); const foamRing = ringMesh(-0.05, 0.45, fmat(foamTex, 0.85)); flat.add(foamRing);
  // wake + bow waves: ribbons (foam texture), opacity by speed
  const ribbon = (pts, w0, w1, op) => {
    const P = [], UV = [], I = [];
    pts.forEach((p, i) => { const q = pts[Math.min(pts.length - 1, i + 1)], r = pts[Math.max(0, i - 1)]; let nx = -(q[1] - r[1]), nz = q[0] - r[0]; const l = Math.hypot(nx, nz) || 1; nx /= l; nz /= l; const w = lerp(w0, w1, i / (pts.length - 1)); P.push(p[0] + nx * w, 0, p[1] + nz * w, p[0] - nx * w, 0, p[1] - nz * w); UV.push(i / 3, 1, i / 3, 0); if (i) { const a = (i - 1) * 2; I.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); } });
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(UV, 2)); g.setIndex(I);
    const m = new THREE.Mesh(g, fmat(foamTex.clone(), op)); m.material.map.needsUpdate = true; m.renderOrder = 3; flat.add(m); return m;
  };
  const wake = [];
  for (const s of [1, -1]) { const pts = []; for (let i = 0; i <= 14; i++) { const d = i * 1.3; pts.push([-L / 2 - d * Math.cos(0.33), s * (B * 0.4 + d * Math.sin(0.33))]); } wake.push(ribbon(pts, 0.25, 1.1, 0.8)); }
  { const pts = []; for (let i = 0; i <= 16; i++) pts.push([-L / 2 - i * 1.4, Math.sin(i * 0.9) * 0.15]); wake.push(ribbon(pts, B * 0.32, B * 0.6, 0.55)); }
  for (const s of [1, -1]) { const pts = []; for (let i = 0; i <= 6; i++) { const d = i * 0.8; pts.push([L / 2 - 1.5 - d * Math.cos(0.5), s * (0.4 + d * Math.sin(0.5) + i * i * 0.04)]); } wake.push(ribbon(pts, 0.2, 0.7, 0.9)); }
  flat.position.y = 0.03;

  // ---------------- state ----------------
  const sails = (v) => {
    for (const s of SAILS) {
      const u = clamp((v - s.stagger * 0.6) / 0.6); const e = u * u * (3 - 2 * u);
      s.mesh.visible = e > 0.02;
      if (s.kind === 'square') { s.mesh.scale.set(lerp(0.3, 1, e), Math.max(0.02, e), 1); }
      else if (s.kind === 'fore-aft') s.mesh.scale.set(Math.max(0.02, e), 1, 1);
      else s.mesh.scale.setScalar(Math.max(0.02, e));
      s.roll.scale.set(lerp(1, 0.35, e), 1, lerp(1, 0.35, e));
    }
    // brace the yards round as the sails set (square sails then read from abeam), braces follow the yard arms
    const br = clamp(v) * 0.38; for (const yg of yardGroups) yg.rotation.y = br;
    for (const b of braceRopes) { const c = Math.cos(br), sn = Math.sin(br); const a = new THREE.Vector3(b.yg.position.x + b.arm[0] * c + b.arm[2] * sn, b.arm[1], -b.arm[0] * sn + b.arm[2] * c), r2 = new THREE.Vector3(...b.rail); const len = a.distanceTo(r2); b.m.geometry.dispose(); b.m.geometry = new THREE.CylinderGeometry(0.016, 0.016, len, 6); b.m.position.copy(a).lerp(r2, 0.5); b.m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), r2.clone().sub(a).normalize()); }
  };
  sails(0); hatch(0);
  // per-frame: foam crawl, wake by speed (group.userData.speed set by the stage), flat follows position/heading
  const tick = (t) => {
    const sp = group.userData.speed ?? 0;
    flat.position.set(group.position.x, (group.userData.baseY ?? 0) + 0.03, group.position.z); flat.rotation.y = group.rotation.y;
    foamTex.offset.x = t * 0.05 * (1 + sp * 4); foamRing.scale.setScalar(1 + Math.sin(t * 1.7) * 0.004); foamRing.material.opacity = 0.65 + 0.25 * sp;
    wake.forEach((m, i) => { m.visible = sp > 0.02; m.material.opacity = (i === 2 ? 0.5 : 0.85) * clamp(sp * 1.4); m.material.map.offset.x = -t * 0.9 - i * 0.3; });
  };
  return { group, flat, sails, hatch, lamps, tick, deckY: DECK, railY: RAIL, L, B, hatchAt: [hatchX, 0], gangwayX, inner, bw, top };
}

// ---------------------------------------------------------------------------------------------
// water plane: painted stripes + a transparent highlight layer that drifts the other way.
// o: { kind: 'harbour'|'sea'|'river'|'tropic', w, d, x, z, y, rep, flow: [u, v] per s }
export function waterPlane(parent, o = {}) {
  const kind = o.kind || 'harbour', w = o.w ?? 220, d = o.d ?? 220, rep = o.rep ?? w / 9;
  const tb = T.water(kind, 'base'); tb.repeat.set(rep, rep * d / w);
  const tt = T.water(kind, 'top'); tt.repeat.set(rep * 0.7, rep * 0.7 * d / w);
  const base = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshStandardMaterial({ map: tb, roughness: 0.45, metalness: 0.1 }));
  base.rotation.x = -Math.PI / 2; base.position.set(o.x ?? 0, o.y ?? 0, o.z ?? 0); base.receiveShadow = true; parent.add(base);
  const hi = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshBasicMaterial({ map: tt, transparent: true, opacity: 0.22, depthWrite: false }));
  hi.rotation.x = -Math.PI / 2; hi.position.set(o.x ?? 0, (o.y ?? 0) + 0.01, o.z ?? 0); hi.renderOrder = 1; parent.add(hi);
  const flow = o.flow || [0.012, 0.004];
  return { base, hi, tick: (t) => { tb.offset.set(t * flow[0], t * flow[1]); tt.offset.set(-t * flow[0] * 1.6 + Math.sin(t * 0.4) * 0.01, t * flow[1] * 0.5); } };
}

// ---------------------------------------------------------------------------------------------
// gulls: `n` cut-outs circling over (cx, cy, cz), plus `sitters` perched at given points. Returns tick(t, camera).
export function gulls(parent, cx, cy, cz, n = 3, sitters = [], rad = 6) {
  const texU = T.gull('up'), texD = T.gull('down'), texS = T.gull('sit');
  const mk = (tx) => new THREE.MeshBasicMaterial({ map: tx, transparent: true, alphaTest: 0.4, side: THREE.DoubleSide, fog: true });
  const mU = mk(texU), mD = mk(texD), mS = mk(texS);
  const fly = []; for (let i = 0; i < n; i++) { const m = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.6), mU); parent.add(m); fly.push(m); }
  const sit = sitters.map(([x, y, z]) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.4), mS); m.geometry.translate(0, 0.125, 0); /* feet on the perch point */ m.position.set(x, y, z); parent.add(m); return m; });
  return (t, camera) => {
    fly.forEach((m, i) => {
      // wide passes across the sky on their own paths (never circling near one spot, so no gull seems to track a character)
      const u = (t * (0.045 + i * 0.011) + i * 0.37) % 1, sd = i % 2 ? 1 : -1, arc = Math.sin(u * Math.PI);
      m.position.set(cx + sd * (-28 + 56 * u), cy + arc * 1.5 + i * 0.8 + Math.sin(t * 0.9 + i) * 0.25, cz + (i - 1) * 4 + arc * rad);
      const vx = sd * 56, vz = Math.cos(u * Math.PI) * Math.PI * rad; // travel direction
      m.lookAt(camera.position); m.scale.x = Math.sign(screenDir(m, vx, vz, camera)) || 1; // face the way it travels on screen
      m.material = Math.sin(t * 7 + i * 1.3) > -0.2 ? mU : mD; // longer up-stroke, quick down-beat
    });
    sit.forEach((m) => { m.lookAt(camera.position.x, m.position.y, camera.position.z); });
  };
}
const _a = new THREE.Vector3(), _b = new THREE.Vector3();
function screenDir(m, vx, vz, camera) { _a.copy(m.position).project(camera); _b.set(m.position.x + vx, m.position.y, m.position.z + vz).project(camera); return _b.x - _a.x; }

// ---------------------------------------------------------------------------------------------
// open-water set: a water plane to the horizon and one ship (movers.ship). Base for the Open Sea set and the
// ship turnarounds. opts: { tint: 'harbour'|'sea'|'river'|'tropic', ship: 'favorite'|'tuscany'|null, sails: 0..1 }
export function buildWaterSet(scene, opts = {}) {
  const g = new THREE.Group(); scene.add(g);
  const H = K.setHandle(g, { center: [0, 0, 0], shadowSize: 18 });
  const w = waterPlane(g, { kind: opts.tint || 'sea', w: 260, d: 260 });
  let ship = null;
  if (opts.ship !== null) {
    ship = buildShip(opts.ship || 'favorite', { bob: 1 }); g.add(ship.group, ship.flat);
    H.movers.ship = ship.group; H.lamps.push(...ship.lamps);
    H.open.sails = ship.sails; H.open.hatch = ship.hatch; H.openRest.sails = opts.sails ?? 1;
  }
  H.ship = ship;
  if (ship && opts.wake) { // S02 v3 (open sea): a warm fill on the sunny side so the hull shows its planks and band, and a bow wave
    for (const x of [ship.L * 0.25, -ship.L * 0.25]) { const f = new THREE.PointLight(0xffd6a0, 40, 16, 1.2); f.position.set(x, 1.2, 7.0); ship.group.add(f); }
    const fT = T.radial('rgba(255,255,255,1)', 'rgba(255,255,255,0)'); const bx = ship.L / 2 - 0.8; const spr = [];
    const add = (x, y, z, sc) => { const m = new THREE.Sprite(new THREE.SpriteMaterial({ map: fT, transparent: true, depthWrite: false, opacity: 0.9, fog: false, toneMapped: false })); m.position.set(x, y, z); m.scale.set(sc * 1.6, sc, 1); m.userData = { y, sc, ph: spr.length * 1.3 }; ship.group.add(m); spr.push(m); };
    for (const sd of [-1, 1]) { add(bx + 0.3, 0.35, sd * 0.9, 1.4); add(bx - 0.4, 0.25, sd * 1.8, 1.1); for (let i = 1; i < 8; i++) { const x = bx - i * 1.4, w = ship.bw ? ship.bw(x) : 3; add(x, 0.12, sd * (w + 0.15), 0.8 - i * 0.05); } } /* bow spray and the white water running down both sides */
    H.wakeTick = (t) => { for (const m of spr) { const k = Math.sin(t * 6 + m.userData.ph); m.position.y = m.userData.y + 0.08 * k; m.material.opacity = 0.7 + 0.25 * k; } };
  }
  // the sun: a big soft disc low over the sea (shown in bright looks; it grows hotter with `blaze`)
  const sunTex = T.radial('rgba(255,250,220,1)', 'rgba(255,200,120,0)');
  const sun = new THREE.Sprite(new THREE.SpriteMaterial({ map: sunTex, transparent: true, depthWrite: false, fog: false, blending: THREE.AdditiveBlending })); sun.position.set(0, 16, -110); sun.scale.set(60, 60, 1); g.add(sun);
  const core = new THREE.Mesh(new THREE.CircleGeometry(7, 40), new THREE.MeshBasicMaterial({ color: 0xfff6d8, fog: false })); core.position.set(0, 16, -112); g.add(core);
  H.tick = (t, L) => { w.tick(t); if (ship) ship.tick(t); if (H.wakeTick) H.wakeTick(t); const hot = L && L.sunI > 3.3 ? 1 : 0.55; sun.scale.setScalar(60 * hot + 20); core.scale.setScalar(0.6 + hot * 0.6); };
  return H;
}
