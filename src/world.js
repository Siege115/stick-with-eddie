// Set library. Each builder adds one THREE.Group to the scene and returns a set handle (kit.setHandle).
// stage.js builds every set a beats file names, once, and shows only the current shot's set.
// Builders: (scene, opts) => handle. Register new sets in SETS at the bottom.
import * as THREE from '/node_modules/three/build/three.module.js';
import * as T from './textures.js';
import * as K from './kit.js';
import { buildWaterSet } from './ship.js';
import { buildWharf } from './wharf.js';
import { buildPond } from './pond.js';
import { buildHarbour } from './harbour.js';
import { buildHold, buildCutaway } from './hold.js';
import { buildKitchen, buildWorkshop, buildSawmill } from './rooms.js';
const { std, box, cyl, ink } = K;

// ===================== Berlin courtyard ~1904 (S01) =====================
// opts (all off unless the beats file asks, in meta.sets.courtyard):
//   chalkboard, screen (folding screen), calendar (1904 wall calendar), table (experts' table + report), rope (rope line + sign)
// The stable doorway is architecture and always there; the doors open only when a beat has `doors` keys.
export function buildCourtyard(scene, opts = {}) {
  const g = new THREE.Group(); scene.add(g);
  const H = K.setHandle(g, { spotCenter: [0.5, -1.8], spotR: 2.4, shade: (x, z) => (z < -8.3 ? 0.55 : 1) }); // inside the dark stable

  // ground
  K.ground(g, 44, 44, std({ map: T.cobbles(), roughness: 0.95 }));

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
    g.add(box(0.5, 0.4, 0.04, std({ color: 0x6b3f22 }), -1.1, 5.0, 13.56));
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
  const addWin = K.windowKit(g);
  for (const x of [-7.5, -1.5, 1.5, 4.5, 7.5]) { addWin(x, 4.7, -7.95, 0, x === 4.5); }
  for (const x of [-7.5, -4.5, -1.5, 1.5, 4.5, 7.5]) { addWin(x, 4.7, 10.95, Math.PI, x === -1.5, x === -1.5); addWin(x, 1.6, 10.95, Math.PI, false); }
  for (const z of [-5, -1, 3, 7]) { addWin(-9.95, 4.7, z, Math.PI / 2, z === 3); addWin(9.95, 4.7, z, -Math.PI / 2, false); addWin(9.95, 1.6, z + 1, -Math.PI / 2, false); }
  addWin(-9.95, 1.6, 6.5, Math.PI / 2, false);

  // skyline beyond the walls (the same seeded generator continues into the dust motes below)
  const r = K.rng(4);
  K.skyline(g, r);

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
  // dark stable interior behind the doors
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

  // street lamps (gas heads in 1904; pass opts.lampHead = 'oil' for earlier periods)
  const lampMat = std({ color: 0x23352c, roughness: 0.5, metalness: 0.4 });
  const glass = new THREE.MeshBasicMaterial({ color: 0xffe2a0 });
  for (const [x, z] of [[-7.6, -6.2], [7.6, -6.2], [-7.6, 8.4], [7.6, 8.4]]) H.lamps.push(K.lampPost(g, x, z, { mat: lampMat, glass, head: opts.lampHead || 'gas' }));

  // chalkboard on easel
  let board = null;
  if (opts.chalkboard) {
    board = new THREE.Group(); board.position.set(3.45, 0, -3.5); board.rotation.y = -0.35; g.add(board);
    const bc = T.chalkboardCanvas(); const bt = new THREE.CanvasTexture(bc); bt.colorSpace = THREE.SRGBColorSpace;
    const frame = std({ map: T.wood([130, 80, 45], 3, false) });
    board.add(ink(box(1.72, 1.22, 0.08, frame, 0, 1.75, 0)));
    const face = new THREE.Mesh(new THREE.PlaneGeometry(1.56, 1.07), std({ map: bt, roughness: 1 }));
    face.position.set(0, 1.75, 0.045); board.add(face);
    for (const [x, rz] of [[-0.6, -0.08], [0.6, 0.08]]) { const leg = box(0.08, 2.6, 0.08, frame, x, 1.25, -0.12); leg.rotation.z = rz; board.add(leg); }
    const back = box(0.08, 2.6, 0.08, frame, 0, 1.2, -0.7); back.rotation.x = -0.35; board.add(back);
    board.add(box(1.6, 0.06, 0.18, frame, 0, 1.12, 0.08));
    H.board = { canvas: bc, tex: bt, group: board, last: '' };
  }

  // calendar on back wall
  if (opts.calendar) {
    const cal = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 1.14), std({ map: T.calendar(), roughness: 1 }));
    cal.position.set(1.0, 1.82, -7.97); g.add(cal);
    g.add(box(0.05, 0.05, 0.12, std({ color: 0x333333, metalness: 0.6 }), 1.0, 2.52, -7.95));
    const str = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.006, 4, 24, Math.PI), std({ color: 0x6b4a2a }));
    str.position.set(1.0, 2.38, -7.975); g.add(str);
    H.calendar = cal; H.calendarPos = new THREE.Vector3(1.0, 2.2, -7.95);
  }

  const brass = std({ color: 0xc9a227, metalness: 0.8, roughness: 0.3 });
  if (opts.rope) {
    // free admission sign, hanging from the rope, facing the horse side
    const signT = T.sign();
    const sg = new THREE.Group(); sg.position.set(-1.12, 0, 2.56); sg.rotation.y = Math.PI; g.add(sg);
    const sb = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.55), std({ map: signT }));
    sb.position.set(0, 0.36, 0.025); sg.add(sb);
    sg.add(ink(box(1.12, 0.57, 0.04, std({ color: 0x3a2414 }), 0, 0.36, 0), 1.02));
    for (const x of [-0.4, 0.4]) sg.add(box(0.012, 0.22, 0.012, std({ color: 0x222222 }), x, 0.74, 0));
    // rope line (brass posts, red velvet rope)
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
  }

  // props: barrels, hay bales, crates, trough, cart wheel
  const barrelMat = std({ map: T.wood([140, 85, 45], 8) });
  const hoop = std({ color: 0x333333, metalness: 0.6, roughness: 0.4 });
  for (const [x, z] of [[-8.6, -6.6], [-7.9, -7.1], [8.8, 4.5]]) K.barrel(g, x, z, barrelMat, hoop);
  const hayMat = std({ map: T.hay() });
  for (const [x, z, ry, y] of [[-2.2, -7.3, 0.1, 0.4], [-0.9, -7.4, -0.05, 0.4], [-1.6, -7.3, 0.05, 1.2], [8.5, -3, 0.3, 0.4], [8.6, -1.6, 0.2, 0.4]]) K.hayBale(g, x, z, ry, y, hayMat);
  const crateMat = std({ map: T.wood([150, 110, 70], 4, false) });
  for (const [x, z, s, y] of [[6.5, -7.3, 0.8, 0.4], [7.3, -7.2, 0.7, 0.35], [6.9, -7.25, 0.6, 1.1]]) K.crate(g, x, z, s, y, 0.2, crateMat);
  K.trough(g, -8.5, -2.5);
  K.cartWheel(g, 9.9, 0.75, 6.5);

  // experts' table (left side), papers and ink pots
  let table = null;
  if (opts.table) {
    const tableWood = std({ map: T.wood([95, 58, 32], 5, false) });
    table = new THREE.Group(); table.position.set(-6.4, 0, 0.6); g.add(table);
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
  }

  // test screen: three-panel folding screen (moved in by `screen` keys)
  if (opts.screen) {
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
    screen.position.set(40, 0, -1.65); screen.rotation.y = -0.5; // parked off-stage until a key moves it
    H.screen = screen; H.screenRest = [40, -1.65, -0.5];
  }

  // spotlight (test scene) + dust motes in the air (sunbeams)
  Object.assign(H, K.spotRig(g));
  H.motes = K.dustMotes(g, r);

  // ===================== extra set dressing =====================
  const iron = std({ color: 0x2b2f33, metalness: 0.6, roughness: 0.45 });
  const zinc = std({ color: 0x7d8a8f, metalness: 0.7, roughness: 0.35 });
  const woodL = std({ map: T.wood([150, 100, 60], 4) });
  const woodD = std({ map: T.wood([95, 60, 35], 4) });
  K.dressWindows(g); // shutters + curtains on every window
  // drainpipes + gutters
  for (const [x, z] of [[-9.9, -7.9], [9.9, -7.9], [3.0, -7.95], [-9.95, 9.5], [9.95, 2.0]]) K.drainpipe(g, x, z, zinc, iron);
  g.add(box(28, 0.12, 0.18, zinc, 0, 7.2, -7.88));
  // posters on the walls
  K.poster(g, 'circus', -6.6, 1.7, -7.97, 0); K.poster(g, 'lost', -2.5, 1.55, -7.97, 0, 0.8);
  K.poster(g, 'coffee', 9.97, 1.7, -4.2, -Math.PI / 2); K.poster(g, 'concert', -9.97, 1.7, 1.0, Math.PI / 2);
  K.poster(g, 'circus', -9.97, 1.6, 4.4, Math.PI / 2, 0.9); K.poster(g, 'coffee', 4.0, 1.65, 10.97, Math.PI);
  // ivy on walls
  for (const [x, z, ry, s2] of [[-8.9, -7.96, 0, 1.6], [9.96, -6.5, -Math.PI / 2, 1.9], [-9.96, 8.6, Math.PI / 2, 1.5], [7.2, 10.96, Math.PI, 1.7]]) K.ivy(g, x, z, ry, s2);
  // horseshoe + "STABLE" sign over the stable
  const shoe = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.035, 8, 20, Math.PI * 1.3), iron);
  shoe.position.set(-4.5, 3.8, -7.9); shoe.rotation.z = -Math.PI * 0.15 - Math.PI / 2 + Math.PI; g.add(shoe);
  K.signBoard(g, 'STABLE', -4.5, 4.25, -7.93);
  // cast-iron water pump by the trough
  K.pump(g, -8.8, -3.9, iron);
  // wheelbarrow, bucket, broom and pitchfork near the hay
  K.wheelbarrow(g, -1.6, -7.1, 0.3, woodL, woodD, iron);
  K.bucket(g, -2.4, -6.6, zinc);
  K.broom(g, -0.2, -7.85, 0.2, woodL);
  K.pitchfork(g, -2.95, -7.85, -0.18, woodL, iron);
  K.appleCrate(g, 5.8, -7.3);
  // bench against the right wall and a watering can
  K.bench(g, 9.6, 0.5, -Math.PI / 2, woodL, iron);
  K.wateringCan(g, 9.3, 2.1);
  // flower pots by the doorway
  for (const [x, z, c] of [[-6.3, -7.6, 0xe63946], [-2.7, -7.5, 0xffd166], [6.3, 10.6, 0xf4a1c1], [-8.0, 10.6, 0xffd166]]) K.flowerPot(g, x, z, c);
  // laundry line across the right corner
  K.laundryLine(g, new THREE.Vector3(9.9, 4.0, 6.0), new THREE.Vector3(5.5, 4.0, 10.9), [[0.2, 0xffffff, 0.5, 0.7], [0.38, 0x5d7ea8, 0.45, 0.55], [0.55, 0xe9d8a6, 0.6, 0.45], [0.72, 0xb23a48, 0.35, 0.5]]);
  // a hand cart parked by the front wall
  K.handCart(g, -7.6, 7.4, 0.4, woodL, woodD);
  // scattered straw near the stable + a puddle
  K.strawPatches(g, -5.8, -7.1);
  K.puddle(g, 5.2, 6.0);
  if (table) { // experts' table: books, candlestick, brass scale, magnifying glass
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
  }
  // chalk box and sponge on the chalkboard tray
  if (board) { board.add(box(0.18, 0.06, 0.1, std({ color: 0xf2f2ea }), -0.5, 1.18, 0.1)); board.add(box(0.16, 0.06, 0.09, std({ color: 0xd4a017 }), 0.45, 1.18, 0.1)); }
  return H;
}

// ===================== test yard (engine test set, not for broadcast) =====================
// A small plank stage on snow-grey ground: a raised platform (1.2 m) with steps, crates, a lantern post,
// a ship-shaped placeholder on a track (movers.ship), a backdrop wall. Proves set switching and height.
export function buildTestYard(scene, opts = {}) {
  const g = new THREE.Group(); scene.add(g);
  const H = K.setHandle(g, { center: [0, 0, 0], shadowSize: 12 });
  const groundCol = opts.ground ?? 0xc9d3dc;
  K.ground(g, 40, 40, std({ color: groundCol, roughness: 1 }));
  const plank = std({ map: T.wood([150, 105, 62], 6, false) });
  const plankD = std({ map: T.wood([105, 66, 38], 4) });
  // raised platform 4 x 3 m, 1.2 m high, at x 2.5, z -1.5
  const PH = 1.2;
  g.add(ink(box(4, PH, 3, plankD, 2.5, PH / 2, -1.5), 1.01));
  g.add(box(4.1, 0.08, 3.1, plank, 2.5, PH + 0.04, -1.5));
  for (let i = 0; i < 4; i++) g.add(ink(box(0.9, (i + 1) * PH / 4, 0.35, plank, 0.05, (i + 1) * PH / 8, -0.45 - i * 0.35), 1.02)); // steps
  // back wall with painted sign
  const wall = std({ map: T.plaster('#9fb3c4') });
  g.add(box(14, 4, 0.4, wall, 0, 2, -6));
  K.signBoard(g, 'TEST YARD', 0, 3.2, -5.78, 0, 2.4, 0.6, '#1d3557', '#f1faee');
  // crates + barrels on the ground
  K.crate(g, -2.6, -3.5, 0.8); K.crate(g, -1.8, -3.7, 0.6); K.barrel(g, -3.4, -4.2);
  // lantern post (oil head)
  H.lamps.push(K.lampPost(g, -1.2, -1.0, { head: 'oil' }));
  // a ship-shaped placeholder that moves on `ship` track keys
  const ship = new THREE.Group(); g.add(ship);
  const hullM = std({ color: 0x1e1e24 });
  const hull = ink(box(3.2, 0.7, 1.1, hullM, 0, 0.35, 0), 1.03); ship.add(hull);
  const bow = new THREE.Mesh(new THREE.ConeGeometry(0.62, 1.0, 4), hullM); bow.rotation.z = -Math.PI / 2; bow.rotation.x = Math.PI / 4; bow.scale.set(1, 1, 0.9); bow.position.set(2.05, 0.35, 0); ship.add(ink(bow, 1.03));
  ship.add(box(3.25, 0.1, 1.15, std({ color: 0xc8962e }), 0, 0.68, 0));
  ship.add(ink(cyl(0.06, 0.08, 3.2, plankD, 0.3, 2.2, 0)));
  const sail = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.8), std({ color: 0xf2ead8, side: THREE.DoubleSide })); sail.position.set(0.3, 2.4, 0.06); ship.add(sail);
  ship.position.set(-6, 0, 3);
  H.movers.ship = ship;
  // a cool spot for `hold`-style tests
  Object.assign(H, K.spotRig(g, { pos: [2.5, 7, 0], target: [2.5, 1.2, -1.5], beamPos: [2.5, 4.2, -1.2] }));
  H.spotCenter = [2.5, -1.5]; H.spotR = 2.0;
  return H;
}

// a bare floor and a sky: the default for any name with no builder yet
export function buildEmpty(scene, opts = {}) {
  const g = new THREE.Group(); scene.add(g);
  K.ground(g, 60, 60, std({ color: opts.ground ?? 0x8a8a8a, roughness: 1 }));
  return K.setHandle(g);
}

export const SETS = { courtyard: buildCourtyard, testyard: buildTestYard, empty: buildEmpty, water: buildWaterSet, wharf: buildWharf, pond: buildPond, harbour: buildHarbour, hold: buildHold, cutaway: buildCutaway, kitchen: buildKitchen, workshop: buildWorkshop, sawmill: buildSawmill };
