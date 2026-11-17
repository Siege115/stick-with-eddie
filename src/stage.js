// 3D stage renderer: builds the set, cast and camera from a beats file + timeline,
// and renders any moment t (seconds) to a 1080x1920 frame. Deterministic: frame = f(t).
import * as THREE from '/node_modules/three/build/three.module.js';
import { drawPerson, DEFAULT_POSE, drawHorse, drawTapLeg, drawHansPortrait, drawHansEye, outlined, drawLogCameo } from './draw.js';
import * as TX from './textures.js';
import { buildCourtyard } from './world.js';
import { resolver, compile } from './timeline.js';

const W = 1080, H = 1920;
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, t) => a + (b - a) * t;
const lerp3 = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
const ease = { linear: (x) => x, inout: (x) => x * x * (3 - 2 * x), out: (x) => 1 - (1 - x) ** 3, in: (x) => x * x * x };
const backOut = (x) => { const c = 1.9; return 1 + (c + 1) * (x - 1) ** 3 + c * (x - 1) ** 2; };
function hash(...a) { let h = 2166136261; for (const v of a) { const s = String(v); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } } return ((h >>> 0) % 100000) / 100000; }

// ---------------- poses (all authored facing right) ----------------
const P = {
  idle: {}, watch: { armL: { a: 0.1, b: 0.1 }, armR: { a: 0.15, b: 0.25 }, brow: 0.15 },
  akimbo: { armL: { a: 0.45, b: -1.1 }, armR: { a: 0.45, b: -1.1 }, brow: 0.2 },
  lean: { lean: 0.08, headTilt: 0.06, armL: { a: 0.2, b: 0.3 }, armR: { a: 0.3, b: 0.6 }, brow: 0.3 },
  point: { armR: { a: 1.45, b: 0.05 }, brow: 0.5, mouth: 'o' },
  pointUp: { armR: { a: 2.5, b: 0.15 }, brow: 0.7, mouth: 'grin' },
  whisper: { armR: { a: 0.75, b: 2.3 }, headTilt: -0.12, mouth: 'smug', lookX: -1 },
  handChin: { armR: { a: 0.6, b: 2.45 }, brow: -0.2, mouth: 'flat', squint: 0.4 },
  clap: { armL: { a: 0.75, b: 1.25 }, armR: { a: 0.75, b: 1.25 }, mouth: 'smile', brow: 0.5, clap: 1 },
  gasp: { armL: { a: 0.75, b: 2.55 }, armR: { a: 0.75, b: 2.55 }, mouth: 'gasp', brow: 1, lean: -0.06 },
  handsCheeks: { armL: { a: 0.62, b: 2.65 }, armR: { a: 0.62, b: 2.65 }, mouth: 'o', brow: 1 },
  recoil: { lean: -0.14, armL: { a: 0.9, b: 0.6 }, armR: { a: 1.0, b: 0.5 }, mouth: 'gasp', brow: 1, icon: '!' },
  cheer: { armL: { a: 2.7, b: 0.1 }, armR: { a: 2.7, b: 0.1 }, mouth: 'grin', brow: 0.8, hop: 1 },
  cheerOne: { armL: { a: 0.2, b: 0.2 }, armR: { a: 2.8, b: 0 }, mouth: 'grin', brow: 0.6, hop: 0.5 },
  laughBelly: { armL: { a: 0.35, b: 2.0 }, armR: { a: 0.35, b: 2.0 }, mouth: 'laugh', brow: 1, lean: -0.12, shake: 1, eyes: 0.1 },
  laughPoint: { armL: { a: 0.35, b: 2.0 }, armR: { a: 1.4, b: 0 }, mouth: 'laugh', brow: 0.8, lean: -0.08, shake: 1, eyes: 0.1 },
  laughBack: { armL: { a: 0.5, b: 0.4 }, armR: { a: 0.5, b: 0.4 }, mouth: 'laugh', lean: -0.2, headTilt: -0.15, shake: 1, eyes: 0.1 },
  slapTable: { armR: { a: 1.1, b: 0.4 }, armL: { a: 0.3, b: 1.9 }, mouth: 'laugh', shake: 1, lean: 0.1, eyes: 0.1 },
  skeptic: { armL: { a: 0.45, b: 1.9 }, armR: { a: 0.6, b: 2.42 }, brow: -0.7, squint: 0.7, mouth: 'flat' },
  pointSneer: { armR: { a: 1.4, b: 0.05 }, armL: { a: 0.35, b: 2.0 }, brow: -0.6, mouth: 'smug', headTilt: -0.1 },
  notes: { armL: { a: 0.8, b: 1.3 }, armR: { a: 0.75, b: 1.75 }, brow: -0.3, lookY: 1, write: 1 },
  stern: { armL: { a: 0.45, b: -1.1 }, armR: { a: 0.45, b: -1.1 }, brow: -0.8, mouth: 'frown' },
  chalkUp: { armR: { a: 1.25, b: 0.55 }, armL: { a: 0.2, b: 0.2 }, brow: 0.5, mouth: 'smile', lookY: 1 },
  ask: { armR: { a: 1.0, b: -0.6 }, armL: { a: 0.2, b: 0.1 }, brow: 0.6, mouth: 'smile' },
  askLean: { armR: { a: 1.25, b: -0.5 }, lean: 0.1, headTilt: 0.08, brow: 0.8, mouth: 'smile', lookY: 1 },
  askB: { armR: { a: 1.5, b: -0.2 }, armL: { a: 0.3, b: 0.2 }, brow: 0.4, mouth: 'flat' },
  proud: { armL: { a: 0.45, b: -1.1 }, armR: { a: 1.2, b: 0.2 }, brow: 0.7, mouth: 'grin', lean: -0.05 },
  present: { armL: { a: 0.9, b: 0.2 }, armR: { a: 1.1, b: 0.15 }, brow: 0.6, mouth: 'smile' },
  presentL: { armL: { a: 1.0, b: 0.2 }, armR: { a: 0.2, b: 0.2 }, brow: 0.5, mouth: 'smile', lookX: -1 },
  pointBoard: { armR: { a: 1.5, b: 0 }, armL: { a: 0.2, b: 0.2 }, brow: 0.6, mouth: 'smile' },
  swear: { armR: { a: 2.45, b: 0.5 }, armL: { a: 0.6, b: 2.0 }, brow: 0.9, mouth: 'grin' },
  write: { armR: { a: 1.95, b: 0.75 }, brow: 0.2, mouth: 'smile', lookX: 1, write: 1 },
  writeB: { armR: { a: 1.65, b: 1.0 }, brow: 0.3, mouth: 'smile', lookX: 1, write: 1 },
  handsStill: { armL: { a: 0.06, b: 0 }, armR: { a: 0.06, b: 0 }, brow: 0.1, mouth: 'flat' },
  handsStillShrug: { armL: { a: 0.06, b: 0 }, armR: { a: 0.06, b: 0 }, brow: 1, mouth: 'smile', headTilt: 0.12 },
  holdKid: { armL: { a: 2.6, b: -0.5 }, armR: { a: 2.6, b: -0.5 }, mouth: 'smile', brow: 0.4 },
  pushGlasses: { armR: { a: 0.8, b: 2.6 }, armL: { a: 0.8, b: 1.3 }, brow: 0.4, mouth: 'smug' },
  pointUpOne: { armR: { a: 2.75, b: 0 }, armL: { a: 0.8, b: 1.3 }, brow: 0.9, mouth: 'smile', icon: '!' },
  pointRight: { armR: { a: 1.55, b: 0 }, armL: { a: 0.8, b: 1.3 }, brow: 0.5, mouth: 'smile' },
  worried: { armL: { a: 0.6, b: 2.2 }, armR: { a: 0.3, b: 0.2 }, brow: 1, mouth: 'wobbly', sweat: 0.6 },
  sweat: { armR: { a: 0.85, b: 2.6 }, armL: { a: 0.2, b: 0.2 }, brow: 1, mouth: 'wobbly', sweat: 1, lean: -0.05 },
  tense: { lean: 0.07, armL: { a: 0.25, b: 0.5 }, armR: { a: 0.25, b: 0.5 }, brow: -0.5, squint: 0.5, mouth: 'flat' },
  relaxed: { lean: -0.02, brow: 0.5, mouth: 'smile', armL: { a: 0.12, b: 0.05 }, armR: { a: 0.12, b: 0.05 }, headTilt: 0.06 },
  march: { brow: -0.5, mouth: 'flat' },
  ride: { legL: { a: -0.5, b: 0.5 }, legR: { a: 0.5, b: -0.5 } },
};
const MOODS = {
  watch: ['watch', 'akimbo', 'lean', 'point', 'whisper', 'handChin', 'clap', 'watch'],
  amazed: ['gasp', 'point', 'cheer', 'clap', 'pointUp', 'handsCheeks', 'point'],
  cheer: ['cheer', 'clap', 'cheerOne', 'cheer', 'clap'],
  gasp: ['gasp', 'handsCheeks', 'recoil', 'point', 'gasp'],
  laugh: ['laughBelly', 'laughPoint', 'laughBack', 'slapTable'],
  experts: ['skeptic', 'notes', 'stern', 'handChin', 'akimbo'],
};
function mergePose(base, part) {
  const p = { ...base, ...part };
  for (const k of ['armL', 'armR', 'legL', 'legR']) p[k] = { ...base[k], ...(part[k] || {}) };
  return p;
}
function blendPose(a, b, u) {
  const o = { ...b };
  for (const k of ['lean', 'bob', 'headTilt', 'turn', 'brow', 'eyes', 'lookX', 'lookY', 'sweat', 'squint', 'clap', 'write', 'shake', 'hop'])
    o[k] = lerp(a[k] ?? DEFAULT_POSE[k] ?? 0, b[k] ?? DEFAULT_POSE[k] ?? 0, u);
  for (const k of ['armL', 'armR', 'legL', 'legR']) o[k] = { a: lerp(a[k].a, b[k].a, u), b: lerp(a[k].b, b[k].b, u) };
  if (u < 0.5) { o.mouth = a.mouth; }
  return o;
}

// ---------------- light presets ----------------
const LIGHTS = {
  warm: { bg: '#f2b47c', fog: '#e9ad78', near: 16, far: 46, sun: '#ffd09a', sunI: 2.8, sunPos: [-10, 6.2, 7], hemiS: '#ffe6c4', hemiG: '#6b4a32', hemiI: 0.95, lamp: 0.7, spot: 0, beam: 0, rim: '#ffc27a', tint: '#fff1e2', exp: 1.0, mote: 0.6 },
  cool: { bg: '#a7b2c1', fog: '#9da9b8', near: 14, far: 40, sun: '#e3eaf7', sunI: 1.6, sunPos: [7, 10, 6], hemiS: '#c9d3e1', hemiG: '#3f3f48', hemiI: 1.05, lamp: 0.25, spot: 0, beam: 0, rim: '#bcd2ff', tint: '#eef2f8', exp: 1.0, mote: 0.25 },
  spot: { bg: '#0b0e16', fog: '#0b0e16', near: 7, far: 24, sun: '#5a6a9a', sunI: 0.22, sunPos: [6, 10, 6], hemiS: '#2e3650', hemiG: '#0e0a0a', hemiI: 0.22, lamp: 0.08, spot: 90, beam: 0.55, rim: '#fff1cc', tint: '#ffffff', exp: 1.05, mote: 0.9 },
};
const col = (c) => new THREE.Color(c);

// =====================================================================
export async function setup(beatsUrl, tlUrl) {
  const mod = await import(beatsUrl);
  const TL = await (await fetch(tlUrl)).json();
  const { meta, cast, beats, crowdIds, expertIds } = mod;
  const R = resolver(TL);
  const EV = compile(meta, beats, TL);
  const beatAt = (t) => { let i = 0; while (i < TL.beats.length - 1 && t >= TL.beats[i + 1].start) i++; return i; };

  // ---------- renderer ----------
  const glCanvas = document.createElement('canvas'); glCanvas.width = W; glCanvas.height = H;
  const renderer = new THREE.WebGLRenderer({ canvas: glCanvas, antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1); renderer.setSize(W, H, false);
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xe9ad78, 16, 46);
  const camera = new THREE.PerspectiveCamera(50, W / H, 0.05, 120);
  const sun = new THREE.DirectionalLight(0xffd09a, 2.8);
  sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -15, right: 15, top: 15, bottom: -15, near: 1, far: 50 });
  sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.02;
  scene.add(sun, sun.target);
  const hemi = new THREE.HemisphereLight(0xffe6c4, 0x6b4a32, 0.95); scene.add(hemi);
  const set = buildCourtyard(scene);

  // ---------- cards ----------
  const shadowTex = TX.radial('rgba(0,0,0,.55)', 'rgba(0,0,0,0)');
  const longShadowTex = TX.radial('rgba(30,15,5,.35)', 'rgba(30,15,5,0)');
  function makeCard(cw, ch, ww, wh, groundFrac) {
    const canvas = document.createElement('canvas'); canvas.width = cw; canvas.height = ch;
    const tex = new THREE.CanvasTexture(canvas); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
    const geo = new THREE.PlaneGeometry(ww, wh); geo.translate(0, wh / 2 - wh * groundFrac, 0);
    const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: false, alphaTest: 0.5, alphaToCoverage: true, side: THREE.DoubleSide, fog: false });
    const mesh = new THREE.Mesh(geo, mat);
    return { canvas, ctx: canvas.getContext('2d'), tex, mesh, mat };
  }
  function contact(w, d, op = 1) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity: op }));
    m.rotation.x = -Math.PI / 2; m.position.y = 0.012; return m;
  }
  function longShadow(len, w) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, len), new THREE.MeshBasicMaterial({ map: longShadowTex, transparent: true, depthWrite: false }));
    m.geometry.translate(0, -len / 2 + 0.2, 0); m.rotation.x = -Math.PI / 2; m.position.y = 0.011; return m;
  }
  const RES = { hero: [1024, 1536, 2], mid: [512, 768, 1], extra: [384, 576, 0.75] };
  const PERSON_W = 1.44, PERSON_H = 2.16, PERSON_GROUND = (768 - 745) / 768;
  const chars = {};
  for (const [id, def] of Object.entries(cast)) {
    const [cw, ch, s] = RES[def.card];
    const card = makeCard(cw, ch, PERSON_W, PERSON_H, PERSON_GROUND);
    const g = new THREE.Group(); g.add(card.mesh);
    const sc = def.c.scale || 1;
    const sh = contact(0.95 * sc, 0.5 * sc); const ls = longShadow(2.4 * sc, 0.55 * sc);
    scene.add(g, sh, ls);
    chars[id] = { id, def, card, g, sh, ls, res: s, acts: [], pos: [], visibleFrom: def.hidden ? Infinity : -1, lastKey: '' };
  }
  // horse
  const HW = 3.36, HPX = 1024 / HW;
  const horse = makeCard(1024, 768, HW, 768 / HPX, 2 / 768);
  const LEG = { x0: 548, y0: 380, w: 256, h: 388, s: 3 };
  const leg = makeCard(LEG.w * LEG.s, LEG.h * LEG.s, LEG.w / HPX, LEG.h / HPX, 0);
  leg.mesh.position.set((LEG.x0 + LEG.w / 2 - 512) / HPX, (766 - (LEG.y0 + LEG.h)) / HPX, 0.012);
  const hansG = new THREE.Group(); hansG.add(horse.mesh, leg.mesh); hansG.position.set(0, 0, -2);
  const hansSh = contact(3.0, 0.9); hansSh.position.set(-0.1, 0.012, -2);
  const hansLs = longShadow(4, 1.4); hansLs.position.set(-0.1, 0.011, -2);
  scene.add(hansG, hansSh, hansLs);
  const HOOF = new THREE.Vector3((648 - 512) / HPX, 0.03, -1.98);

  // one-frame easter egg in a window (meta.cameo = { t, pos:[x,y,z] })
  let cameo = null;
  if (meta.cameo) {
    const cc = makeCard(512, 768, 0.84, 1.26, 0);
    cc.ctx.setTransform(1, 0, 0, 1, 256, 768); drawLogCameo(cc.ctx); cc.tex.needsUpdate = true;
    cc.mesh.position.set(...meta.cameo.pos); cc.mesh.visible = false; scene.add(cc.mesh); cameo = cc.mesh;
  }
  // dust puffs
  const dustTex = TX.radial('rgba(205,180,140,.85)', 'rgba(205,180,140,0)');
  const dust = []; for (let i = 0; i < 48; i++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: dustTex, transparent: true, depthWrite: false })); sp.visible = false; scene.add(sp); dust.push(sp); }

  // ---------- per-beat compiled tracks ----------
  beats.forEach((b, bi) => {
    const bt = TL.beats[bi];
    for (const [id, keys] of Object.entries(b.acts || {})) for (const [at, name, opts] of keys) {
      const o = { ...(opts || {}) };
      if (o.talk) o.talk = [R(o.talk[0], bi), R(o.talk[1], bi)];
      if (o.monoPop) o.monoPop = R(o.monoPop, bi);
      chars[id].acts.push({ t: R(at, bi), name, pose: P[name] || {}, opts: o, beat: bi });
    }
    for (const [id, keys] of Object.entries(b.pos || {})) for (const [at, p, how] of keys) chars[id].pos.push({ t: R(at, bi), p, walk: how === 'walk', beat: bi });
    for (const id of b.show || []) chars[id].visibleFrom = Math.min(chars[id].visibleFrom, bt.start);
    if (b.march) {
      const m = b.march; const s = R(m.start, bi);
      m.ids.forEach((id, i) => {
        const a = m.from(i), z = m.to(i); const d = Math.hypot(z[0] - a[0], z[1] - a[1]);
        const st = s + (m.delay ? m.delay(i) : (i % 7) * 0.06 + Math.floor(i / 7) * 0.35);
        chars[id].pos.push({ t: bt.start, p: a, beat: bi }, { t: st, p: a, beat: bi }, { t: st + d / m.speed, p: z, walk: true, march: true, beat: bi });
        chars[id].visibleFrom = Math.min(chars[id].visibleFrom, bt.start);
        chars[id].marchHome = z;
      });
    }
  });
  for (const c of Object.values(chars)) { c.acts.sort((a, b) => a.t - b.t); c.pos.sort((a, b) => a.t - b.t); }
  const hansExpr = [], sparkles = [];
  beats.forEach((b, bi) => {
    if (b.hans && b.hans.expr) for (const [at, e] of b.hans.expr) hansExpr.push({ t: R(at, bi), e });
    if (b.hans && b.hans.sparkle != null) sparkles.push(R(b.hans.sparkle, bi));
  });
  hansExpr.sort((a, b) => a.t - b.t);
  const boardKeys = []; beats.forEach((b, bi) => (b.board || []).forEach(([at, lines, rv]) => boardKeys.push({ t: R(at, bi), lines, rv: rv[0] < 0 ? null : [R(rv[0], bi), R(rv[1], bi)] })));
  const screenKeys = []; beats.forEach((b, bi) => (b.screen || []).forEach(([at, x]) => screenKeys.push({ t: R(at, bi), x })));
  const doorKeys = []; beats.forEach((b, bi) => (b.doors || []).forEach(([at, v]) => doorKeys.push({ t: R(at, bi), v })));
  // shots
  const SHOTS = [];
  beats.forEach((b, bi) => b.shots.forEach((s, si) => SHOTS.push({ ...s, t0: R(s.at, bi), beat: bi, si })));
  SHOTS.forEach((s, i) => { s.t1 = i < SHOTS.length - 1 ? SHOTS[i + 1].t0 : TL.duration; s.prev = SHOTS[i - 1]; s.next = SHOTS[i + 1]; });

  // ---------- helpers ----------
  function track(keys, t, field, easeFn = ease.inout) {
    if (!keys.length || t < keys[0].t) return null;
    let i = 0; while (i < keys.length - 1 && t >= keys[i + 1].t) i++;
    const k = keys[i], n = keys[i + 1];
    if (!n) return k[field];
    return k[field];
  }
  function stepLerp(keys, t, field, beatEnd) {
    if (!keys.length) return null;
    if (t < keys[0].t) return null;
    let i = 0; while (i < keys.length - 1 && t >= keys[i + 1].t) i++;
    const k = keys[i], n = keys[i + 1];
    if (n && n.t <= beatEnd) { const u = ease.inout(clamp((t - k.t) / (n.t - k.t))); return lerp(k[field], n[field], u); }
    return k[field];
  }

  function charPos(c, t) {
    const ks = c.pos; let p = c.def.home, moving = 0, march = false;
    if (c.marchHome && t >= TL.beats[7].start) p = c.marchHome;
    let i = -1; for (let j = 0; j < ks.length; j++) if (ks[j].t <= t) i = j;
    if (i >= 0) {
      p = ks[i].p;
      const n = ks[i + 1];
      if (n && n.walk && n.beat === ks[i].beat) {
        const u = clamp((t - ks[i].t) / (n.t - ks[i].t));
        p = [lerp(ks[i].p[0], n.p[0], u), lerp(ks[i].p[1], n.p[1], u)];
        const d = Math.hypot(n.p[0] - ks[i].p[0], n.p[1] - ks[i].p[1]);
        moving = u > 0 && u < 1 ? d * u : 0; march = !!n.march;
        if (u >= 1) moving = 0;
      }
    }
    return { p, moving, march };
  }
  function lookTarget(id, bi) {
    const b = beats[bi]; const l = (b.look || {})[id];
    if (l === 'hoof') return new THREE.Vector3(0.45, 0.3, -2);
    if (l === 'camera') return null;
    if (l && chars[l]) { const q = chars[l].g.position; return new THREE.Vector3(q.x, 1.4, q.z); }
    return new THREE.Vector3(0.9, 1.8, -2); // Hans's head
  }

  function poseFor(c, t, bi, worldPos, scr) {
    const acts = c.acts; let k = -1;
    for (let j = 0; j < acts.length; j++) if (acts[j].t <= t && acts[j].beat === bi) k = j;
    let target, since, prevPose, opts = {};
    const b = beats[bi]; const bt = TL.beats[bi];
    if (k >= 0) {
      target = mergePose(DEFAULT_POSE, acts[k].pose); since = t - acts[k].t; opts = acts[k].opts;
      const pk = k > 0 && acts[k - 1].beat === bi ? acts[k - 1] : null;
      prevPose = pk ? mergePose(DEFAULT_POSE, pk.pose) : mergePose(DEFAULT_POSE, P.watch);
      if (!pk && acts[k].t <= bt.start + 0.01) prevPose = target;
    } else {
      // mood-driven background acting
      let mood = 'watch';
      const isCrowd = crowdIds.includes(c.id), isExpert = expertIds.includes(c.id);
      if (b.mood && isCrowd && b.mood.crowd) mood = b.mood.crowd;
      if (isExpert) mood = (b.mood && b.mood.table && c.def.home[0] < -6) ? 'laugh' : 'experts';
      if (c.id === 'eddie') mood = 'eddie';
      const list = mood === 'eddie' ? ['watch', 'proud', 'akimbo', 'present'] : MOODS[mood];
      const per = 1.15 + hash(c.id, 'per') * 0.7; const off = hash(c.id, 'off') * per;
      const local = t - bt.start + off; const slot = Math.floor(local / per);
      const pick = (s) => list[Math.floor(hash(c.id, bi, s) * list.length)];
      target = mergePose(DEFAULT_POSE, P[pick(slot)]); prevPose = mergePose(DEFAULT_POSE, P[pick(slot - 1)]);
      since = local - slot * per;
      if (slot === 0) prevPose = target;
    }
    const u = clamp(since / 0.26); let p = blendPose(prevPose, target, backOut(u));
    // no held poses: subtle alternate every 1.6 s
    const hold = Math.floor(since / 1.6);
    if (hold > 0) { const alt = hold % 2; const v = hash(c.id, k, hold); const w = clamp((since - hold * 1.6) / 0.25);
      const amt = alt ? w : 1 - w;
      p.headTilt += amt * (v - 0.5) * 0.18; p.brow = clamp(p.brow + amt * (v > 0.5 ? 0.25 : -0.15), -1, 1);
      p.armL.b += amt * 0.12; p.armR.a += amt * (v - 0.5) * 0.2; p.lookX += amt * (v > 0.5 ? 1 : -1); }
    // procedural layers
    const seed = hash(c.id) * 10;
    p.bob += Math.sin(t * 2.2 + seed) * 2;
    const bper = 2.8 + hash(c.id, 'blink') * 1.6; const bph = (t + seed) % bper;
    if (bph < 0.11) p.eyes = Math.min(p.eyes, 0.05);
    if (p.clap) { const s = Math.sin(t * 17 + seed); p.armL.b += s * 0.3 * p.clap; p.armR.b += s * 0.3 * p.clap; }
    if (p.write) p.armR.b += Math.sin(t * 21 + seed) * 0.13 * p.write;
    if (p.shake) { p.bob += Math.sin(t * 20 + seed) * 5 * p.shake; p.talk = (0.35 + 0.35 * Math.sin(t * 19 + seed)) * p.shake; }
    if (opts.talk && t >= opts.talk[0] && t <= opts.talk[1]) { const s = Math.abs(Math.sin(t * 13 + seed)) * (0.55 + 0.45 * Math.sin(t * 5.3)); p.talk = 0.2 + 0.8 * s; }
    if (opts.icon) { p.icon = opts.icon; p.iconT = since; } else if (p.icon) p.iconT = since;
    if (opts.monoPop && t >= opts.monoPop) { p.monocleOut = true; }
    p.hopY = (p.hop || 0) * 0.13 * Math.abs(Math.sin(t * 7.5 + seed));
    // walking
    if (worldPos.moving > 0) {
      const ph = worldPos.moving / 0.62 * Math.PI;
      p.legL = { a: 0.42 * Math.sin(ph), b: -0.35 * Math.max(0, -Math.cos(ph)) };
      p.legR = { a: -0.42 * Math.sin(ph), b: -0.35 * Math.max(0, Math.cos(ph)) };
      p.armL = { a: 0.15 - 0.4 * Math.sin(ph), b: 0.2 }; p.armR = { a: 0.15 + 0.4 * Math.sin(ph), b: 0.2 };
      p.bob -= 7 * Math.abs(Math.sin(ph));
      if (worldPos.march) { p.brow = -0.6; p.mouth = 'frown'; }
    }
    if (c.def.ride) { p.legL = { a: 0.5, b: -0.3 }; p.legR = { a: -0.5, b: 0.3 }; }
    // gaze → turn & facing
    p.dir = scr.dir; p.turn = scr.turn;
    p.lookX = clamp(p.lookX + scr.turn * 1.5, -1.2, 1.2);
    return p;
  }

  function horsePose(t) {
    // expression
    let e0 = {}, e1 = {}, u = 1;
    let i = -1; for (let j = 0; j < hansExpr.length; j++) if (hansExpr[j].t <= t) i = j;
    if (i >= 0) { e1 = hansExpr[i].e; e0 = i > 0 ? hansExpr[i - 1].e : e1; u = backOut(clamp((t - hansExpr[i].t) / 0.3)); }
    const num = (k, d = 0) => lerp(e0[k] ?? d, e1[k] ?? d, u);
    const p = { head: num('head'), brow: num('brow'), pupil: num('pupil', 0.5), sweat: num('sweat'), blink: 1, mouth: u > 0.5 ? (e1.mouth || 'smile') : (e0.mouth || 'smile'), camLook: num('camLook') };
    if (e1.blink != null) p.blink = num('blink', 1);
    const bph = t % 3.3; if (bph < 0.12) p.blink = 0.05;
    const eph = t % 2.4; p.earFlick = eph < 0.3 ? Math.sin(eph / 0.3 * Math.PI) : 0;
    p.tail = Math.sin(t * 2.1) * 0.12 + Math.sin(t * 5.3) * 0.04;
    p.breathe = t * 0.35;
    p.head += Math.sin(t * 1.7) * 0.015;
    // tap leg
    const lift = { a: 0.55, b: -1.3 };
    let leg = { a: 0, b: 0 };
    for (const [a, z] of EV.poise) if (t >= a - 0.2 && t <= z) { const k = clamp((t - (a - 0.2)) / 0.2); leg = { a: lift.a * ease.out(k) + Math.sin(t * 9) * 0.02, b: lift.b * ease.out(k) }; }
    for (let j = 0; j < EV.taps.length; j++) {
      const tp = EV.taps[j]; const prev = EV.taps[j - 1]; const gap = prev && prev.beat === tp.beat ? tp.t - prev.t : 0.5;
      const win = Math.min(0.24, gap * 0.9);
      if (t >= tp.t - win && t < tp.t) {
        const k = (t - (tp.t - win)) / win; const s = Math.sin(Math.PI * Math.min(1, k * 1.15));
        const inPoise = EV.poise.some(([a, z]) => tp.t - win >= a - 0.25 && tp.t - win <= z + 0.01);
        leg = inPoise ? { a: lift.a * (1 - ease.in(k)), b: lift.b * (1 - ease.in(k)) } : { a: lift.a * s, b: lift.b * s };
      } else if (t >= tp.t && t < tp.t + 0.08) { const k = (t - tp.t) / 0.08; leg = { a: -0.04 * Math.sin(k * Math.PI), b: 0.05 * Math.sin(k * Math.PI) }; }
    }
    p.tap = leg;
    return p;
  }

  // ---------- draw a person card ----------
  function paintPerson(c, pose, rim) {
    const { ctx, canvas } = c.card; const s = c.res;
    let cost = c.def.c, pp = pose;
    if (pose.dir < 0) { // mirror authored pose so the acting arm leads
      pp = { ...pose, armL: pose.armR, armR: pose.armL, legL: pose.legR, legR: pose.legL };
      cost = { ...cost, item: cost.itemL, itemL: cost.item };
    }
    cost = { ...cost, dir: pose.dir };
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(s, 0, 0, s, 256 * s, 745 * s);
    drawPerson(ctx, cost, pp, rim);
    if (pose.monocleOut && c.def.c.monocle) { // falling monocle
      const k = clamp((pose.monoT || 0.3) / 0.5);
      ctx.save(); ctx.translate(40 + k * 20, -505 + k * 300); ctx.rotate(k * 5);
      ctx.strokeStyle = '#c9a227'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(0, 0, 20, 0, 7); ctx.stroke(); ctx.restore();
    }
    c.card.tex.needsUpdate = true;
  }

  // ---------- HUD canvases ----------
  const out = document.createElement('canvas'); out.width = W; out.height = H; const O = out.getContext('2d');
  const tmp = document.createElement('canvas'); tmp.width = W; tmp.height = H; const TM = tmp.getContext('2d');
  const paper = TX.newspaper((k) => {
    drawHorse(k, { head: 0.12, mouth: 'smile', brow: 0.3, blink: 1, tap: { a: 0.5, b: -1.2 }, tail: 0.1 }, { blanket: '#555' });
    k.save(); k.translate(1010, 745); k.scale(0.9, 0.9); drawPerson(k, { ...cast.eddie.c, dir: -1 }, { ...DEFAULT_POSE, armL: { a: 1.2, b: 0.5 }, mouth: 'smile', brow: 0.5, turn: -0.5, dir: -1 }, null); k.restore();
  });
  const frustum = new THREE.Frustum(), pm = new THREE.Matrix4();

  function project(v) { const q = v.clone().project(camera); return [(q.x + 1) / 2 * W, (1 - q.y) / 2 * H, q.z]; }

  // ---------- camera from shot ----------
  function shotAt(t) { let s = SHOTS[0]; for (const q of SHOTS) if (q.t0 <= t) s = q; return s; }
  function camFor(s, t) {
    const len = s.t1 - s.t0; const e = ease[s.ease || 'inout'];
    let pos, look, fov;
    if (s.then) {
      const d = s.dur;
      if (t - s.t0 < d) { const u = e(clamp((t - s.t0) / d)); pos = lerp3(s.cam[0], s.cam[1], u); look = lerp3(s.look[0], s.look[1], u); }
      else { const u = ease.inout(clamp((t - s.t0 - d) / Math.max(0.01, len - d))); pos = lerp3(s.then.cam, s.then.cam2, u); look = lerp3(s.then.look, s.then.look2, u); }
      fov = lerp(s.fov[0], s.fov[1], e(clamp((t - s.t0) / d)));
    } else {
      const u = e(clamp((t - s.t0) / len));
      pos = lerp3(s.cam[0], s.cam[1], u); look = lerp3(s.look[0], s.look[1], u); fov = lerp(s.fov[0], s.fov[1], u);
    }
    return { pos, look, fov };
  }

  // ---------- lights ----------
  function applyLights(t, bi) {
    const cur = LIGHTS[beats[bi].light || 'warm'];
    const prev = bi > 0 ? LIGHTS[beats[bi - 1].light || 'warm'] : cur;
    const u = ease.inout(clamp((t - TL.beats[bi].start) / 0.35));
    const L = {};
    for (const k of Object.keys(cur)) {
      const a = prev[k], b = cur[k];
      if (typeof b === 'number') L[k] = lerp(a, b, u);
      else if (Array.isArray(b)) L[k] = lerp3(a, b, u);
      else L[k] = '#' + col(a).lerp(col(b), u).getHexString();
    }
    scene.background = col(L.bg); scene.fog.color = col(L.fog); scene.fog.near = L.near; scene.fog.far = L.far;
    sun.color = col(L.sun); sun.intensity = L.sunI; sun.position.set(...L.sunPos); sun.target.position.set(0, 0, 0);
    hemi.color = col(L.hemiS); hemi.groundColor = col(L.hemiG); hemi.intensity = L.hemiI;
    for (const l of set.lamps) { l.pl.intensity = 6 * L.lamp; l.glow.material.opacity = 0.3 + L.lamp * 0.9; }
    set.spot.intensity = L.spot; set.beam.material.opacity = L.beam * 0.5;
    set.motes.material.opacity = L.mote * 0.6;
    renderer.toneMappingExposure = L.exp;
    return L;
  }

  // ======================= RENDER ONE FRAME =======================
  function renderAt(t) {
    const bi = beatAt(t); const bt = TL.beats[bi]; const b = beats[bi];
    const L = applyLights(t, bi);
    const shot = shotAt(t);
    let cam = camFor(shot, t);
    let yaw = 0, fovMul = 1, blurX = 0, zoomBlur = 0, dark = 0, flash = 0, wipe = null, dolly = 0;
    // outgoing transition into next shot
    const nx = shot.next;
    if (nx) {
      const k = t - nx.t0;
      if (nx.trans === 'whip' && k > -0.16) { const q = (k + 0.16) / 0.16; yaw += 0.75 * q * q; blurX = q; }
      if (nx.trans === 'zoom' && k > -0.3) { const q = (k + 0.3) / 0.3; fovMul *= 1 - 0.55 * q * q; zoomBlur = q; }
      if (nx.trans === 'push' && k > -0.3) { const q = (k + 0.3) / 0.3; dolly = 2.2 * q * q; dark = q; }
      if (nx.trans === 'wipe' && k > -0.22) wipe = (k + 0.22) / 0.44;
    }
    { // incoming transition
      const k = t - shot.t0;
      if (shot.trans === 'whip' && k < 0.18) { const q = 1 - k / 0.18; yaw -= 0.75 * q * q; blurX = Math.max(blurX, q); }
      if (shot.trans === 'zoomout' && k < 0.4) { const q = 1 - k / 0.4; fovMul *= 1 - 0.6 * q * q; zoomBlur = Math.max(zoomBlur, q * 0.8); if (k < 0.07) flash = 1 - k / 0.07; }
      if (shot.trans === 'zoom' && k < 0.3) { const q = 1 - k / 0.3; zoomBlur = Math.max(zoomBlur, q); if (k < 0.06) flash = 0.7; }
      if (shot.trans === 'push' && k < 0.25) dark = Math.max(dark, 1 - k / 0.25);
      if (shot.trans === 'wipe' && k < 0.22) wipe = 0.5 + k / 0.44;
    }
    // camera
    const pos = new THREE.Vector3(...cam.pos), look = new THREE.Vector3(...cam.look);
    if (dolly) { const d = look.clone().sub(pos).normalize(); pos.addScaledVector(d, dolly); look.addScaledVector(d, dolly); }
    camera.position.copy(pos); camera.fov = cam.fov * fovMul; camera.updateProjectionMatrix();
    camera.lookAt(look);
    if (yaw) camera.rotateY(yaw);
    let shake = shot.shake || 0;
    // stamp shake
    if (shot.hud && shot.hud.kind === 'stamp') { const st = R(shot.hud.at, shot.beat); if (t >= st && t < st + 0.25) shake = 0.03 * (1 - (t - st) / 0.25); }
    if (shake) { camera.position.x += (hash(t.toFixed(3), 'sx') - 0.5) * shake * 2; camera.position.y += (hash(t.toFixed(3), 'sy') - 0.5) * shake * 2; }
    camera.updateMatrixWorld();
    pm.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse); frustum.setFromProjectionMatrix(pm);

    // set dressing state
    if (set.board) {
      let k = null; for (const q of boardKeys) if (q.t <= t) k = q;
      const lines = k ? k.lines : ['3 + 2 = ?'];
      const rv = k && k.rv ? clamp((t - k.rv[0]) / Math.max(0.01, k.rv[1] - k.rv[0])) : 1;
      const key = lines.join('|') + Math.round(rv * 24);
      if (key !== set.board.last) { TX.paintBoard(set.board.canvas, lines, rv); set.board.tex.needsUpdate = true; set.board.last = key; }
    }
    const scrX = (bi >= 11 && bi <= 14) ? 2.1 : 40; // the screen already stands in the yard; the questioner walks behind it
    set.screen.position.set(scrX, 0, -1.65); set.screen.rotation.y = -0.5;
    const dv = stepLerp(doorKeys, t, 'v', TL.beats[7].end); set.doors(dv == null ? 0 : (t > TL.beats[7].end ? 1 : dv));
    set.motes.rotation.y = t * 0.01; set.motes.position.y = Math.sin(t * 0.3) * 0.1;

    // sun-shadow direction for long shadows
    const sunDir = Math.atan2(-L.sunPos[0], -L.sunPos[2]);
    const longOp = beats[bi].light === 'warm' ? 1 : beats[bi].light === 'cool' ? 0.45 : 0;

    // people
    const scrCache = {};
    const tint = col(L.tint);
    for (const c of Object.values(chars)) {
      let visible = t >= c.visibleFrom;
      if (c.def.hidden && expertIds.includes(c.id) && t < TL.beats[7].start) visible = false;
      if (['e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7'].includes(c.id) && bi === 7 && t < c.pos.find((q) => q.beat === 7)?.t) visible = false;
      const wp = charPos(c, t);
      let [x, z] = wp.p;
      let y = 0;
      if (c.def.ride) { const r = charPos(chars[c.def.ride], t).p; x = r[0]; z = r[1] - 0.04; y = 1.3; }
      c.g.position.set(x, y, z); c.g.rotation.y = Math.atan2(camera.position.x - x, camera.position.z - z);
      c.sh.position.set(x, 0.012, z); c.ls.position.set(x, 0.011, z); c.ls.rotation.z = sunDir; c.ls.material.opacity = longOp;
      c.sh.visible = c.ls.visible = visible && !c.def.ride;
      c.g.visible = visible;
      if (!visible) continue;
      const inView = frustum.intersectsSphere(new THREE.Sphere(new THREE.Vector3(x, y + 1.0, z), 1.3));
      // gaze in screen space
      const tgt = lookTarget(c.id, bi);
      let dir = 1, turn = 0;
      if (tgt) {
        const a = new THREE.Vector3(x, 1.45, z).project(camera), q = tgt.clone().project(camera);
        const dx = q.x - a.x; turn = clamp(dx * 2.2, -0.6, 0.6); dir = dx < 0 ? -1 : 1;
        if (wp.march) { turn = 0; dir = 1; }
      }
      const pose = poseFor(c, t, bi, wp, { dir, turn });
      if (pose.monocleOut) { const pk = c.acts.find((a) => a.opts.monoPop); pose.monoT = pk ? t - pk.opts.monoPop : 0.5; }
      c.g.position.y = y + (pose.hopY || 0);
      // spot scene: characters outside the light dim (faces stay pale)
      let f = 1;
      if (L.spot > 1) { const d = Math.hypot(x - 0.5, z + 1.8); f = lerp(1, d < 2.4 ? 1 : 0.55, clamp(L.spot / 90)); }
      if (z < -8.3) f *= 0.55; // inside the dark stable
      c.card.mat.color.copy(tint).multiplyScalar(f);
      c.pose = pose;
      if (inView) paintPerson(c, pose, L.rim);
    }
    // Hans
    const hp = horsePose(t);
    hansG.rotation.y = Math.atan2(camera.position.x - hansG.position.x, camera.position.z - hansG.position.z);
    hansLs.rotation.z = sunDir; hansLs.material.opacity = longOp;
    if (frustum.intersectsSphere(new THREE.Sphere(new THREE.Vector3(0, 1.2, -2), 2.4))) {
      const k = horse.ctx; k.setTransform(1, 0, 0, 1, 0, 0); k.clearRect(0, 0, 1024, 768);
      drawHorse(k, hp, { withTapLeg: false, blanket: '#7a1f2a' }); horse.tex.needsUpdate = true;
      const lk = leg.ctx; lk.setTransform(1, 0, 0, 1, 0, 0); lk.clearRect(0, 0, leg.canvas.width, leg.canvas.height);
      lk.setTransform(LEG.s, 0, 0, LEG.s, -LEG.x0 * LEG.s, -LEG.y0 * LEG.s); drawTapLeg(lk, hp); leg.tex.needsUpdate = true;
    }
    horse.mat.color.copy(tint); leg.mat.color.copy(tint);
    // dust puffs at strikes
    let di = 0;
    for (const tp of EV.taps) {
      const age = t - tp.t; if (age < 0 || age > 0.75) continue;
      for (let j = 0; j < 6 && di < dust.length; j++, di++) {
        const sp = dust[di]; const a = hash(tp.t, j) * Math.PI * 2; const r = 0.08 + age * (0.35 + hash(tp.t, j, 'r') * 0.3);
        sp.visible = true; sp.position.set(HOOF.x + Math.cos(a) * r, 0.04 + age * 0.25 * hash(j, 'y'), HOOF.z + Math.sin(a) * r * 0.6);
        const s = 0.12 + age * 0.5; sp.scale.set(s, s, 1); sp.material.opacity = 0.9 * (1 - age / 0.75);
      }
    }
    for (; di < dust.length; di++) dust[di].visible = false;

    if (cameo) { // visible for exactly one frame
      const f0 = Math.round(meta.cameo.t * meta.fps); cameo.visible = Math.round(t * meta.fps) === f0;
      cameo.rotation.y = Math.atan2(camera.position.x - cameo.position.x, camera.position.z - cameo.position.z);
    }
    renderer.render(scene, camera);

    // ================= 2D composite =================
    O.setTransform(1, 0, 0, 1, 0, 0); O.filter = 'none'; O.globalAlpha = 1;
    O.drawImage(glCanvas, 0, 0);
    const hud = shot.hud;
    if (hud && hud.kind !== 'stamp') drawHud(hud, shot, t, hp);
    // sparkle on Hans (proud)
    for (const sT of sparkles) { const a = t - sT; if (a >= 0 && a < 0.7) sparkleAt(W * 0.74, H * 0.24, a); }
    const calT = b.calendarSparkle ? R(b.calendarSparkle, bi) : null;
    if (calT != null && t >= calT && t < calT + 0.8 && (!hud)) { const q = project(new THREE.Vector3(1.0, 2.2, -7.95)); sparkleAt(q[0] + 230, q[1] + 40, t - calT); }
    // tap counters
    if (!hud || hud.kind === 'stamp') for (const tp of EV.taps) {
      const age = t - tp.t; const last = tp.k === tp.n;
      if (age < 0 || age > (last ? 0.9 : 0.45)) continue;
      const q = project(HOOF.clone().add(new THREE.Vector3(0.1, 0.55, 0.3)));
      const pop = backOut(clamp(age / 0.15)); const fade = last ? clamp((0.9 - age) / 0.25) : clamp((0.45 - age) / 0.15);
      const txt = tp.style === 'red' ? (tp.k > 3 ? tp.k + '?' : String(tp.k)) : String(tp.k);
      O.save(); O.globalAlpha = fade; O.translate(clamp(q[0] + 90, 120, W - 120), Math.min(q[1] - 60, H * 0.58) - age * 80); O.scale(pop, pop);
      O.font = 'bold 120px "DejaVu Sans", sans-serif'; O.textAlign = 'center'; O.textBaseline = 'middle'; O.lineJoin = 'round';
      O.lineWidth = 18; O.strokeStyle = '#111'; O.strokeText(txt, 0, 0); O.fillStyle = tp.style === 'red' ? '#ff5a4e' : '#6dff7a'; O.fillText(txt, 0, 0); O.restore();
    }
    // speech bubble
    if (b.bubble) {
      const bb = b.bubble; const t0 = R(bb.from, bi), t1 = R(bb.to, bi);
      if (t >= t0 && t <= t1) { const c = chars[bb.who]; const q = project(new THREE.Vector3(c.g.position.x, 1.95, c.g.position.z)); bubble(bb.text, q[0], q[1], t - t0); }
    }
    if (hud && hud.kind === 'stamp') stampHud(hud, shot, t);
    // transitions on the whole frame
    if (blurX > 0.02 || zoomBlur > 0.02) {
      TM.setTransform(1, 0, 0, 1, 0, 0); TM.clearRect(0, 0, W, H); TM.drawImage(out, 0, 0);
      const n = 7; O.save();
      for (let i = 1; i <= n; i++) {
        O.globalAlpha = 0.22;
        if (blurX > 0.02) O.drawImage(tmp, (i - n / 2) * blurX * 26, 0);
        if (zoomBlur > 0.02) { const s = 1 + i * 0.022 * zoomBlur; O.drawImage(tmp, W / 2 - W * s / 2, H / 2 - H * s / 2, W * s, H * s); }
      }
      O.restore();
    }
    if (wipe != null) wipePanel(wipe);
    if (dark > 0) { O.fillStyle = `rgba(0,0,0,${dark})`; O.fillRect(0, 0, W, H); }
    if (flash > 0) { O.fillStyle = `rgba(255,255,255,${flash * 0.85})`; O.fillRect(0, 0, W, H); }
    // vignette
    const vg = O.createRadialGradient(W / 2, H * 0.48, H * 0.32, W / 2, H * 0.5, H * 0.72);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, beats[bi].light === 'spot' ? 'rgba(0,0,0,.6)' : 'rgba(30,15,0,.38)');
    O.fillStyle = vg; O.fillRect(0, 0, W, H);
    captions(t, shot);
    return out;
  }

  // ---------------- HUD pieces ----------------
  function blurredBackdrop(px = 16, darken = 0.25) {
    TM.setTransform(1, 0, 0, 1, 0, 0); TM.filter = `blur(${px}px)`; TM.drawImage(glCanvas, -40, -40, W + 80, H + 80); TM.filter = 'none';
    O.drawImage(tmp, 0, 0); O.fillStyle = `rgba(0,0,0,${darken})`; O.fillRect(0, 0, W, H);
  }
  function drawHud(h, shot, t, hp) {
    const u = clamp((t - shot.t0) / (shot.t1 - shot.t0)); const sc = h.s ? lerp(h.s[0], h.s[1], ease.inout(u)) : 1;
    if (h.kind === 'hansPortrait') {
      blurredBackdrop(14, 0.12);
      O.save(); O.translate(W * h.x, H * h.y); O.scale(sc * 1.55, sc * 1.55);
      const pp = { ...hp, pupil: lerp(hp.pupil, 0, hp.camLook || 0), pupilY: 0 };
      drawHansPortrait(O, pp); O.restore();
    } else if (h.kind === 'face') {
      blurredBackdrop(18, 0.2);
      const c = chars[h.who]; const pose = { ...c.pose, dir: -1, turn: -0.35, bob: 0 };
      const f = sc; O.save(); O.translate(W * h.x, H * h.y + 505 * f); O.scale(f, f);
      let cost = { ...c.def.c, dir: -1 }; const pp = { ...pose, armL: pose.armR, armR: pose.armL };
      drawPerson(O, cost, pp, LIGHTS.spot.rim); O.restore();
    } else if (h.kind === 'eyes') {
      blurredBackdrop(20, 0.3);
      h.ids.forEach((id, i) => {
        const c = chars[id]; const y0 = H * 0.05 + i * H * 0.215, hh = H * 0.205;
        O.save(); O.beginPath(); O.rect(0, y0, W, hh); O.clip();
        O.fillStyle = ['#e9dcc4', '#d9e2ea', '#efe3d0'][i]; O.fillRect(0, y0, W, hh);
        const f = 5.2; O.translate(W / 2 + (i - 1) * 40, y0 + hh / 2 + 8 * f + 505 * f); O.scale(f, f);
        const look = Math.sin((t - shot.t0) * 4.2 + i * 0.4);
        const pose = { ...DEFAULT_POSE, ...c.pose, lookX: look * 1.6, lookY: 0.8, squint: 0.75, brow: -0.8, mouth: 'flat', talk: 0, icon: null, sweat: 0, turn: look * 0.05, dir: 1, headTilt: 0, bob: 0, lean: 0 };
        drawPerson(O, { ...c.def.c, dir: 1 }, pose, null);
        O.restore();
        O.lineWidth = 12; O.strokeStyle = '#111'; O.strokeRect(-10, y0, W + 20, hh);
      });
    } else if (h.kind === 'eye') {
      O.save(); O.translate(W / 2, H / 2); O.scale(sc, sc); O.translate(-W / 2, -H / 2);
      const relaxT = R(beats[shot.beat].reflect.relax, shot.beat);
      const r = ease.inout(clamp((t - relaxT) / 0.5));
      drawHansEye(O, W, H, { blink: hp.blink }, (k, Rr) => {
        k.fillStyle = '#c9b48a'; k.fillRect(-Rr, -Rr, Rr * 2, Rr * 2);
        k.save(); k.scale(-1, 1); const fs = Rr / 150; k.translate(0, 505 * fs + Rr * 0.1); k.scale(fs, fs);
        drawPerson(k, { ...chars.e1.def.c, dir: 1 }, { ...DEFAULT_POSE, brow: lerp(-0.6, 0.6, r), squint: lerp(0.6, 0, r), mouth: r > 0.5 ? 'smile' : 'flat', lean: lerp(0.06, -0.02, r) }, null);
        k.restore();
      });
      O.restore();
      // ripple to show the relax moment
      if (t >= relaxT && t < relaxT + 0.6) { const a = (t - relaxT) / 0.6; O.strokeStyle = `rgba(255,255,255,${0.6 * (1 - a)})`; O.lineWidth = 10; O.beginPath(); O.arc(W / 2 + 40, H * 0.47, 120 + a * 300, 0, 7); O.stroke(); }
    } else if (h.kind === 'newspaper') {
      blurredBackdrop(10, 0.35);
      const k = t - shot.t0, len = shot.t1 - shot.t0;
      const sp = ease.out(clamp(k / 0.65)); const ang = (1 - sp) * Math.PI * 5 - 0.07; let s = lerp(0.04, 1, sp);
      const zoomOut = clamp((k - (len - 0.3)) / 0.3); s *= 1 + ease.in(zoomOut) * 4;
      O.save(); O.translate(W / 2, H * 0.46); O.rotate(ang + zoomOut * 0.05); O.scale(s, s);
      const pw = W * 0.8, ph = pw * 1800 / 1350;
      O.shadowColor = 'rgba(0,0,0,.5)'; O.shadowBlur = 40; O.shadowOffsetY = 20;
      O.drawImage(paper, -pw / 2, -ph / 2, pw, ph); O.restore();
    }
  }
  function sparkleAt(x, y, a) {
    for (let i = 0; i < 3; i++) {
      const s = backOut(clamp((a - i * 0.08) / 0.2)) * (1 - clamp((a - 0.45) / 0.25));
      if (s <= 0) continue;
      O.save(); O.translate(x + [0, 70, -60][i], y + [0, 60, 50][i]); O.scale(s * [1.6, 1, 0.8][i], s * [1.6, 1, 0.8][i]); O.rotate(a * 2);
      outlined(O, (k) => { for (let j = 0; j < 8; j++) { const r = j % 2 ? 12 : 38; const an = j * Math.PI / 4; j ? k.lineTo(Math.sin(an) * r, -Math.cos(an) * r) : k.moveTo(Math.sin(an) * r, -Math.cos(an) * r); } k.closePath(); }, '#ffe066', 5);
      O.restore();
    }
  }
  function bubble(text, x, y, age) {
    const s = backOut(clamp(age / 0.18));
    O.save(); O.font = 'bold 72px "DejaVu Sans", sans-serif';
    const tw = O.measureText(text).width + 70, th = 120;
    let bx = clamp(x - tw / 2 - 60, 30, W - tw - 30), by = clamp(y - th - 150, 140, H - 600);
    O.translate(bx + tw / 2, by + th / 2); O.scale(s, s); O.translate(-(bx + tw / 2), -(by + th / 2));
    outlined(O, (k) => { k.roundRect(bx, by, tw, th, 50); k.moveTo(bx + tw * 0.55, by + th - 4); k.lineTo(x, y - 40); k.lineTo(bx + tw * 0.75, by + th - 4); }, '#fff', 7);
    O.fillStyle = '#fff'; O.fillRect(bx + tw * 0.55, by + th - 14, tw * 0.2, 12);
    O.fillStyle = '#111'; O.textAlign = 'center'; O.textBaseline = 'middle';
    // numbers green
    const parts = text.split(' '); let cx = bx + 35; O.textAlign = 'left';
    for (const p of parts) { O.fillStyle = /\d/.test(p) ? '#1f9d36' : '#111'; O.fillText(p, cx, by + th / 2 + 4); cx += O.measureText(p + ' ').width; }
    O.restore();
  }
  function stampHud(h, shot, t) {
    const st = R(h.at, shot.beat); if (t < st) return;
    const a = t - st; const s = a < 0.1 ? lerp(2.6, 1, ease.in(a / 0.1)) : 1 + Math.max(0, 0.06 - (a - 0.1) * 0.3);
    const q = project(set.verdictPaper);
    O.save(); O.translate(q[0], q[1] - 40); O.rotate(-0.16); O.scale(s, s);
    O.globalAlpha = a < 0.1 ? 0.5 + a * 5 : 1;
    O.strokeStyle = '#c1121f'; O.lineWidth = 16; O.strokeRect(-330, -110, 660, 220);
    O.lineWidth = 6; O.strokeRect(-310, -92, 620, 184);
    O.fillStyle = '#c1121f'; O.font = 'bold 132px "DejaVu Sans", sans-serif'; O.textAlign = 'center'; O.textBaseline = 'middle';
    O.fillText(h.text, 0, 6);
    // ink speckle (deterministic)
    O.globalCompositeOperation = 'destination-out';
    for (let i = 0; i < 70; i++) { O.beginPath(); O.arc((hash(i, 'x') - 0.5) * 640, (hash(i, 'y') - 0.5) * 200, 2 + hash(i, 'r') * 7, 0, 7); O.fill(); }
    O.restore();
    if (a < 0.12) { O.fillStyle = `rgba(255,255,255,${0.4 * (1 - a / 0.12)})`; O.fillRect(0, 0, W, H); }
  }
  function wipePanel(w) {
    // a dark folding-screen panel sweeps right→left across the frame
    const x = lerp(W * 1.05, -W * 1.05 - 200, w);
    O.save(); O.fillStyle = '#4a1422'; O.fillRect(x, 0, W + 200, H);
    O.fillStyle = '#2e1a0e'; O.fillRect(x, 0, 46, H); O.fillRect(x + W + 154, 0, 46, H);
    O.fillStyle = 'rgba(255,255,255,.05)'; for (let i = 0; i < 12; i++) O.fillRect(x + 80 + i * 95, 0, 30, H);
    O.restore();
  }
  function captions(t, shot) {
    const c = EV.captions.find((q) => t >= q.t0 && t < q.t1);
    if (!c) return;
    const age = t - c.t0; const s = age < 0.08 ? lerp(1.18, 1, age / 0.08) : 1;
    const y = (shot.captionY || 0.71) * H;
    O.save(); O.font = 'bold 78px "DejaVu Sans", sans-serif'; O.textBaseline = 'middle'; O.lineJoin = 'round';
    const text = c.words.map((w) => w.w); const widths = text.map((w) => O.measureText(w).width); const sp = O.measureText(' ').width;
    const total = widths.reduce((a, b) => a + b, 0) + sp * (text.length - 1);
    O.translate(W / 2, y); O.scale(s, s);
    let x = -total / 2;
    c.words.forEach((w, i) => {
      O.lineWidth = 14; O.strokeStyle = '#111'; O.strokeText(w.w, x, 0);
      O.fillStyle = w.num ? '#6dff7a' : '#ffffff'; O.fillText(w.w, x, 0); x += widths[i] + sp;
    });
    O.restore();
  }

  // pre-render pass to warm textures
  return { renderAt, duration: TL.duration, EV, TL, shots: SHOTS.map((s) => [s.t0, s.trans, s.beat]) };
}
