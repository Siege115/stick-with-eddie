// 2D cut-out drawing for people and Hans the horse.
// Characters are flat: thick black outline, white heads, pill bodies, stick limbs.
// All geometry is in "units" (1u = 1px on a 512x768 card, feet at (0,0), y up = negative).

export const O = 7; // outline width (units)
const TAU = Math.PI * 2;
const lerp = (a, b, t) => a + (b - a) * t;

// ---------- small helpers ----------
function outlined(ctx, pathFn, fill, ow = O, stroke = '#111') {
  ctx.beginPath(); pathFn(ctx);
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  ctx.lineWidth = ow * 2; ctx.strokeStyle = stroke; ctx.stroke();
  ctx.fillStyle = fill; ctx.fill();
}
function pill(ctx, x, y, w, h) { // x,y = top-left
  const r = Math.min(w, h) / 2;
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y); ctx.arc(x + w - r, y + r, r, -Math.PI / 2, 0);
  ctx.lineTo(x + w, y + h - r); ctx.arc(x + w - r, y + h - r, r, 0, Math.PI / 2);
  ctx.lineTo(x + r, y + h); ctx.arc(x + r, y + h - r, r, Math.PI / 2, Math.PI);
  ctx.lineTo(x, y + r); ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5);
  ctx.closePath();
}
function rrect(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
function limb(ctx, x0, y0, a, b, l1, l2, w = 9) {
  // a: angle from straight down (positive = toward +x), b: extra bend at joint
  const x1 = x0 + Math.sin(a) * l1, y1 = y0 + Math.cos(a) * l1;
  const x2 = x1 + Math.sin(a + b) * l2, y2 = y1 + Math.cos(a + b) * l2;
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.lineTo(x2, y2);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#111'; ctx.lineWidth = w; ctx.stroke();
  return [x1, y1, x2, y2];
}

// ---------- person ----------
export const DEFAULT_POSE = {
  lean: 0, bob: 0, headTilt: 0, turn: 0,
  armL: { a: -0.12, b: 0.05 }, armR: { a: 0.12, b: -0.05 },
  legL: { a: -0.06, b: 0 }, legR: { a: 0.06, b: 0 },
  brow: 0, browL: null, browR: null, eyes: 1, lookX: 0, lookY: 0,
  mouth: 'neutral', talk: 0, sweat: 0, icon: null, iconT: 0, squint: 0,
};

export function drawPerson(ctx, c, p, rim) {
  // c = costume, p = pose (all fields present)
  const s = c.scale || 1;
  ctx.save();
  ctx.scale(s, s);
  ctx.translate(0, p.bob);
  const hipY = -200, shY = -385;
  // legs (stick)
  const legW = 10;
  const lx = -26, rx = 26;
  const lL = limb(ctx, lx, hipY, p.legL.a, p.legL.b, 98, 96, legW);
  const lR = limb(ctx, rx, hipY, p.legR.a, p.legR.b, 98, 96, legW);
  shoe(ctx, lL[2], lL[3], c, -1, p);
  shoe(ctx, lR[2], lR[3], c, 1, p);
  if (c.stockings || c.breeches) legWear(ctx, c, lL, lR);

  // body group (lean around hips)
  ctx.save();
  ctx.translate(0, hipY); ctx.rotate(p.lean); ctx.translate(0, -hipY);

  // long coat skirt
  if (c.coat && c.coat.long) {
    outlined(ctx, (k) => {
      k.moveTo(-70, -260); k.lineTo(70, -260); k.lineTo(88, -105); k.quadraticCurveTo(0, -92, -88, -105); k.closePath();
    }, c.coat.color);
    ctx.beginPath(); ctx.moveTo(0, -215); ctx.lineTo(0, -100); ctx.strokeStyle = 'rgba(0,0,0,.45)'; ctx.lineWidth = 4; ctx.stroke();
  }
  if (c.dhoti) dhoti(ctx, c.dhoti, lL, lR);
  if (c.kurta || c.chapkan) longTunic(ctx, c);
  // pill torso
  const bodyCol = c.coat ? c.coat.color : c.body;
  outlined(ctx, (k) => pill(k, -76, -425, 152, 238), bodyCol);
  if (c.stripes) stripes(ctx, c.stripes);
  if (c.vest) vest(ctx, c.vest);
  if (c.empire) empireDress(ctx, c.empire);
  if (c.spencer) spencer(ctx, c.spencer);
  // shirt / waistcoat details
  if (c.waistcoat) { // tailored suit: jacket (body colour) open over a waistcoat, shirt and tie
    ctx.save(); ctx.beginPath(); pill(ctx, -76, -425, 152, 238); ctx.clip();
    if (c.tweed) { // fine tweed weave on the jacket
      ctx.strokeStyle = c.tweed; ctx.lineWidth = 1.6;
      for (let y = -430; y < -180; y += 9) { ctx.beginPath(); ctx.moveTo(-80, y); ctx.lineTo(80, y + 4); ctx.stroke(); }
      for (let x = -80; x < 80; x += 11) { ctx.globalAlpha = 0.5; ctx.beginPath(); ctx.moveTo(x, -430); ctx.lineTo(x + 3, -180); ctx.stroke(); }
      ctx.globalAlpha = 1;
    }
    // waistcoat panel (V-neck) seen between the jacket fronts
    ctx.fillStyle = c.waistcoat;
    ctx.beginPath(); ctx.moveTo(-42, -414); ctx.lineTo(42, -414); ctx.lineTo(40, -205); ctx.lineTo(0, -192); ctx.lineTo(-40, -205); ctx.closePath(); ctx.fill();
    ctx.fillStyle = c.shirt || '#f4f1e8';
    ctx.beginPath(); ctx.moveTo(-26, -425); ctx.lineTo(26, -425); ctx.lineTo(0, -338); ctx.closePath(); ctx.fill();
    // collar points
    ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#111'; ctx.lineWidth = 2.5;
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(0, -414); ctx.lineTo(s * 24, -425); ctx.lineTo(s * 14, -396); ctx.closePath(); ctx.fill(); ctx.stroke(); }
    // waistcoat buttons + pocket watch chain
    ctx.fillStyle = '#e8c55a';
    for (const by of [-322, -290, -258, -226]) { ctx.beginPath(); ctx.arc(0, by, 4.5, 0, TAU); ctx.fill(); }
    ctx.strokeStyle = '#e8c55a'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(0, -290); ctx.quadraticCurveTo(-18, -272, -32, -282); ctx.stroke();
    // jacket fronts with lapels
    ctx.fillStyle = c.jacketShade || 'rgba(0,0,0,.12)';
    for (const s of [-1, 1]) {
      ctx.beginPath(); ctx.moveTo(s * 26, -425); ctx.lineTo(s * 36, -360); ctx.lineTo(s * 18, -338); ctx.lineTo(s * 40, -300); ctx.lineTo(s * 40, -180); ctx.lineTo(s * 90, -180); ctx.lineTo(s * 90, -430); ctx.closePath();
      ctx.save(); ctx.clip(); ctx.restore();
    }
    ctx.strokeStyle = '#111'; ctx.lineWidth = 3.5;
    for (const s of [-1, 1]) {
      ctx.beginPath(); ctx.moveTo(s * 26, -425); ctx.lineTo(s * 38, -360); ctx.lineTo(s * 22, -340); ctx.lineTo(s * 40, -300); ctx.lineTo(s * 42, -190); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(s * 38, -360); ctx.lineTo(s * 46, -350); ctx.stroke(); // lapel notch
    }
    // breast pocket with handkerchief, side pockets, jacket button
    ctx.strokeStyle = 'rgba(0,0,0,.55)'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-68, -330); ctx.lineTo(-50, -330); ctx.stroke();
    ctx.fillStyle = '#f2e6c8'; ctx.beginPath(); ctx.moveTo(-66, -330); ctx.lineTo(-61, -342); ctx.lineTo(-56, -333); ctx.lineTo(-52, -341); ctx.lineTo(-50, -330); ctx.closePath(); ctx.fill();
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(s * 50, -238); ctx.lineTo(s * 72, -238); ctx.stroke(); }
    ctx.fillStyle = '#2a1d14'; ctx.beginPath(); ctx.arc(46, -262, 5, 0, TAU); ctx.fill();
    ctx.restore();
    outlined(ctx, (k) => pill(k, -76, -425, 152, 238), 'rgba(0,0,0,0)');
  }
  if (c.coat) { // lapels + buttons
    ctx.save(); ctx.beginPath(); pill(ctx, -76, -425, 152, 238); ctx.clip();
    ctx.fillStyle = c.shirt || '#e9e4d6';
    ctx.beginPath(); ctx.moveTo(-22, -425); ctx.lineTo(22, -425); ctx.lineTo(0, -350); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,.5)'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-22, -425); ctx.lineTo(0, -350); ctx.lineTo(22, -425); ctx.stroke();
    ctx.fillStyle = 'rgba(0,0,0,.55)';
    for (const by of [-320, -280, -240]) { ctx.beginPath(); ctx.arc(-8, by, 5, 0, TAU); ctx.fill(); }
    ctx.restore();
  }
  if (c.tie) { ctx.fillStyle = c.tie; ctx.beginPath(); ctx.moveTo(-14, -418); ctx.lineTo(14, -418); ctx.lineTo(0, -395); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.moveTo(-14,-372); ctx.lineTo(0,-395); ctx.lineTo(14,-372); ctx.closePath(); ctx.fill(); }
  if (c.apron) { ctx.save(); ctx.beginPath(); pill(ctx, -76, -425, 152, 238); ctx.clip(); ctx.fillStyle = c.apron; ctx.fillRect(-50, -360, 100, 180); ctx.restore(); }
  if (c.apronLong) apronLong(ctx, c.apronLong);
  if (c.capelet) capelet(ctx, c.capelet);
  if (c.cravat) cravat(ctx, c.cravat);
  if (c.neckerchief) neckerchief(ctx, c.neckerchief, c.dir || 1);
  if (c.shawl) shawl(ctx, c.shawl);
  if (c.scarf) scarf(ctx, c.scarf, c.dir || 1);
  // rim light on body edge
  if (rim) {
    ctx.save(); ctx.beginPath(); pill(ctx, -76, -425, 152, 238); ctx.clip();
    ctx.strokeStyle = rim; ctx.lineWidth = 10; ctx.globalAlpha = 0.55;
    ctx.beginPath(); pill(ctx, -70, -419, 152, 238); ctx.stroke(); ctx.restore();
  }
  // arms
  const armW = 9.5;
  const aL = limb(ctx, -62, shY, -p.armL.a, -p.armL.b, 80, 76, armW);
  const aR = limb(ctx, 62, shY, p.armR.a, p.armR.b, 80, 76, armW);
  hand(ctx, aL[2], aL[3], c.gloves);
  hand(ctx, aR[2], aR[3], c.gloves);
  if (c.puffSleeves) for (const [sx, a] of [[-62, -p.armL.a], [62, p.armR.a]]) { ctx.save(); ctx.translate(sx + Math.sin(a) * 26, shY + Math.cos(a) * 26); ctx.rotate(-a); outlined(ctx, (k) => k.ellipse(0, 0, 24, 36, 0, 0, TAU), c.puffSleeves, 5); ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = 2.5; for (const dx of [-9, 0, 9]) { ctx.beginPath(); ctx.moveTo(dx, -28); ctx.quadraticCurveTo(dx * 1.4, 0, dx, 28); ctx.stroke(); } ctx.restore(); }
  if (c.sleeves) for (const [sx, a, b] of [[-62, -p.armL.a, -p.armL.b], [62, p.armR.a, p.armR.b]]) sleeve(ctx, sx, shY, a, b, c.sleeves);
  if (c.item) item(ctx, c.item, aR[2], aR[3], p.armR.a + p.armR.b, c);
  if (c.itemL) item(ctx, c.itemL, aL[2], aL[3], -(p.armL.a + p.armL.b), c);

  // head
  ctx.save();
  const hx = 0, hy = c.egg ? -520 : -505;
  ctx.translate(hx, hy + 60); ctx.rotate(p.headTilt); ctx.translate(-hx, -(hy + 60));
  drawHead(ctx, c, p, hx, hy, rim);
  ctx.restore();

  ctx.restore(); // body lean
  // icons above head
  if (p.icon) drawIcon(ctx, p.icon, 95, -650, p.iconT);
  if (p.sweat > 0) {
    ctx.save(); ctx.globalAlpha = Math.min(1, p.sweat);
    const sy = -560 + (1 - p.sweat) * 30;
    for (const [dx, ss] of [[100, 1], [-108, 0.8]]) {
      ctx.save(); ctx.translate(dx, sy); ctx.scale(ss, ss);
      outlined(ctx, (k) => { k.moveTo(0, -26); k.bezierCurveTo(14, -6, 16, 12, 0, 14); k.bezierCurveTo(-16, 12, -14, -6, 0, -26); }, '#8fd3ff', 4);
      ctx.restore();
    }
    ctx.restore();
  }
  ctx.restore();
}

function shoe(ctx, x, y, c, side, p) {
  const dir = c.dir || 1;
  ctx.save(); ctx.translate(x, y + 2);
  if (c.shoes === 'sneaker') {
    outlined(ctx, (k) => rrect(k, -16 + dir * 8 - 14, -16, 54, 26, 13), '#ffffff', 5);
    ctx.fillStyle = c.sneakerStripe || '#e63946'; ctx.fillRect(-20 + dir * 8, -2, 46, 5);
  } else if (c.shoes === 'small') {
    outlined(ctx, (k) => rrect(k, -12 + dir * 6 - 10, -12, 38, 20, 10), '#3b2a20', 4);
  } else {
    outlined(ctx, (k) => rrect(k, -16 + dir * 8 - 14, -16, 52, 24, 12), c.boot || '#2b2018', 5);
    ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.fillRect(-26 + dir * 8, -12, 18, 4); // polish shine
    ctx.strokeStyle = '#8a7a6a'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-28 + dir * 8, 3); ctx.lineTo(24 + dir * 8, 3); ctx.stroke(); // sole
  }
  ctx.restore();
}
function hand(ctx, x, y, gloves) {
  ctx.beginPath(); ctx.arc(x, y, 11, 0, TAU);
  ctx.fillStyle = '#111'; ctx.fill();
  ctx.beginPath(); ctx.arc(x, y, 8, 0, TAU); ctx.fillStyle = gloves || '#fff'; ctx.fill();
}
function item(ctx, kind, x, y, ang, c) {
  ctx.save(); ctx.translate(x, y);
  if (kind === 'chalk') {
    ctx.rotate(-ang + 0.9);
    outlined(ctx, (k) => rrect(k, -5, -30, 12, 34, 4), '#fbfbf2', 3);
  } else if (kind === 'notebook') {
    ctx.rotate(-0.15);
    outlined(ctx, (k) => rrect(k, -6, -48, 44, 58, 4), c.bookColor || '#7a4b2a', 4);
    ctx.fillStyle = '#f3ecd8'; ctx.fillRect(2, -42, 32, 46);
    ctx.strokeStyle = '#9aa'; ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(6, -34 + i * 8); ctx.lineTo(30, -34 + i * 8); ctx.stroke(); }
    ctx.fillStyle = '#c1121f'; ctx.fillRect(24, 2, 5, 16); // ribbon bookmark
    ctx.fillStyle = '#222'; ctx.fillRect(32, -48, 4, 58); // elastic band
  } else if (kind === 'pencil') {
    ctx.rotate(-ang + 1.2);
    outlined(ctx, (k) => rrect(k, -3, -34, 8, 34, 2), '#f2c14e', 3);
  } else if (kind === 'cane') {
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(4, 150); ctx.strokeStyle = '#111'; ctx.lineWidth = 12; ctx.stroke();
    ctx.strokeStyle = '#6b3f22'; ctx.lineWidth = 6; ctx.stroke();
  } else if (kind === 'paper') {
    ctx.rotate(-0.1);
    outlined(ctx, (k) => k.rect(-8, -50, 46, 60), '#f7f2e2', 3);
    ctx.strokeStyle = '#555'; ctx.lineWidth = 2;
    for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(-2, -42 + i * 8); ctx.lineTo(30, -42 + i * 8); ctx.stroke(); }
  } else if (S02_ITEMS[kind]) {
    S02_ITEMS[kind](ctx, ang, c);
  } else if (kind === 'hanky') {
    outlined(ctx, (k) => { k.moveTo(-6, -4); k.lineTo(26, -14); k.lineTo(20, 22); k.closePath(); }, '#ffffff', 3);
  }
  ctx.restore();
}


// ---------- S02 costume pieces (all opt-in costume keys; S01 drawing is unchanged) ----------
function legWear(ctx, c, lL, lR) { // knee breeches over the thigh, stockings on the shin
  for (const L of [lL, lR]) {
    const [x1, y1, x2, y2] = L; const x0 = L === lL ? -26 : 26, y0 = -200;
    if (c.stockings) { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2 - 10); ctx.lineCap = 'round'; ctx.strokeStyle = '#111'; ctx.lineWidth = 17; ctx.stroke(); ctx.strokeStyle = c.stockings; ctx.lineWidth = 8; ctx.stroke(); }
    if (c.breeches) { ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1 + 6); ctx.lineCap = 'round'; ctx.strokeStyle = '#111'; ctx.lineWidth = 30; ctx.stroke(); ctx.strokeStyle = c.breeches; ctx.lineWidth = 20; ctx.stroke();
      ctx.fillStyle = '#e8c55a'; ctx.beginPath(); ctx.arc(x1 + (x0 < 0 ? -6 : 6), y1 + 2, 3.5, 0, TAU); ctx.fill(); }
  }
}
function dhoti(ctx, col, lL, lR) { // draped white dhoti: one smooth shape over both legs to mid-shin, centre fold, hem line
  outlined(ctx, (k) => { k.moveTo(-70, -215); k.lineTo(70, -215); k.quadraticCurveTo(lR[0] + 34, lR[1] - 20, lR[2] + 22, lR[3] - 46); k.quadraticCurveTo((lL[2] + lR[2]) / 2, lR[3] - 30, lL[2] - 22, lL[3] - 46); k.quadraticCurveTo(lL[0] - 34, lL[1] - 20, -70, -215); k.closePath(); }, col, 6);
  ctx.strokeStyle = 'rgba(0,0,0,.22)'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(4, -190); ctx.quadraticCurveTo(10, -120, (lL[2] + lR[2]) / 2, lR[3] - 40); ctx.stroke();
  for (const dx of [-30, -14, 22, 40]) { ctx.beginPath(); ctx.moveTo(dx, -200); ctx.quadraticCurveTo(dx * 1.3, -140, dx * 1.5, -90); ctx.stroke(); }
  ctx.strokeStyle = c_border(col); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(lL[2] - 20, lL[3] - 50); ctx.quadraticCurveTo((lL[2] + lR[2]) / 2, lR[3] - 36, lR[2] + 20, lR[3] - 50); ctx.stroke();
}
const c_border = () => 'rgba(120,90,40,.55)';
function longTunic(ctx, c) { // kurta (to the knee, side slits) or chapkan (fitted long coat, side-fastened)
  const col = c.chapkan || c.kurta, low = c.chapkan ? -70 : -105;
  outlined(ctx, (k) => { k.moveTo(-72, -260); k.lineTo(72, -260); k.lineTo(84, low); k.quadraticCurveTo(0, low + 12, -84, low); k.closePath(); }, col, 6);
  ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = 3;
  if (c.kurta) for (const sx of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sx * 80, low); ctx.lineTo(sx * 74, low - 50); ctx.stroke(); }
  else { ctx.beginPath(); ctx.moveTo(0, -250); ctx.lineTo(0, low + 6); ctx.stroke(); for (let y = -240; y > low; y -= 34) { ctx.beginPath(); ctx.moveTo(-40, y + 6); ctx.quadraticCurveTo(0, y + 16, 40, y + 6); ctx.stroke(); } }
}
function stripes(ctx, col) { ctx.save(); ctx.beginPath(); pill(ctx, -76, -425, 152, 238); ctx.clip(); ctx.fillStyle = col; for (let y = -420; y < -186; y += 26) ctx.fillRect(-80, y, 160, 11); ctx.restore(); outlined(ctx, (k) => pill(k, -76, -425, 152, 238), 'rgba(0,0,0,0)'); }
function empireDress(ctx, e) { // gown: 1806 high (empire) waist by default; e.waist = 'natural' for the 1830s, fuller skirt
  const col = e.color || e, W0 = e.waist === 'natural' ? -290 : -352, w0 = e.waist === 'natural' ? 66 : 70, hemW = e.waist === 'natural' ? 112 : 98;
  outlined(ctx, (k) => { k.moveTo(-w0, W0); k.lineTo(w0, W0); k.quadraticCurveTo(84, -200, hemW, -24); k.quadraticCurveTo(0, -8, -hemW, -24); k.quadraticCurveTo(-84, -200, -w0, W0); k.closePath(); }, col, 6);
  if (e.bodice) { ctx.save(); ctx.beginPath(); pill(ctx, -76, -425, 152, 238); ctx.clip(); ctx.fillStyle = e.bodice; ctx.fillRect(-80, -430, 160, W0 + 430); ctx.restore(); outlined(ctx, (k) => pill(k, -76, -425, 152, 238), 'rgba(0,0,0,0)'); ctx.strokeStyle = '#111'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-w0, W0); ctx.lineTo(w0, W0); ctx.stroke(); }
  ctx.strokeStyle = 'rgba(0,0,0,.18)'; ctx.lineWidth = 3; for (const dx of [-50, -20, 12, 44]) { ctx.beginPath(); ctx.moveTo(dx * 0.8, -340); ctx.quadraticCurveTo(dx * 1.05, -180, dx * 1.35, -22); ctx.stroke(); }
  if (e.hem) { ctx.strokeStyle = e.hem; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-94, -40); ctx.quadraticCurveTo(0, -24, 94, -40); ctx.stroke(); }
  if (e.sash && e.waist === 'natural') outlined(ctx, (k) => rrect(k, -70, W0 - 12, 140, 18, 8), e.sash, 4);
  else if (e.sash) { outlined(ctx, (k) => rrect(k, -74, -366, 148, 20, 8), e.sash, 4); outlined(ctx, (k) => { k.moveTo(40, -356); k.lineTo(62, -330); k.lineTo(50, -326); k.closePath(); k.moveTo(46, -356); k.lineTo(34, -326); k.lineTo(24, -332); k.closePath(); }, e.sash, 3); }
}
function vest(ctx, col) { // waistcoat over shirtsleeves (no jacket): front panels, V at the neck, buttons, pocket welts
  ctx.save(); ctx.beginPath(); pill(ctx, -76, -425, 152, 238); ctx.clip(); ctx.fillStyle = col;
  ctx.beginPath(); ctx.moveTo(-80, -430); ctx.lineTo(-24, -430); ctx.lineTo(0, -350); ctx.lineTo(24, -430); ctx.lineTo(80, -430); ctx.lineTo(80, -180); ctx.lineTo(-80, -180); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,.4)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, -350); ctx.lineTo(0, -190); ctx.stroke();
  ctx.fillStyle = '#e8c55a'; for (const by of [-330, -298, -266, -234]) { ctx.beginPath(); ctx.arc(-7, by, 4, 0, TAU); ctx.fill(); }
  ctx.strokeStyle = 'rgba(0,0,0,.45)'; for (const s2 of [-1, 1]) { ctx.beginPath(); ctx.moveTo(s2 * 22, -256); ctx.lineTo(s2 * 48, -256); ctx.stroke(); }
  ctx.restore(); outlined(ctx, (k) => pill(k, -76, -425, 152, 238), 'rgba(0,0,0,0)');
}
function spencer(ctx, col) { // short fitted jacket ending at the high waist, with a collar
  ctx.save(); ctx.beginPath(); pill(ctx, -76, -425, 152, 238); ctx.clip(); ctx.fillStyle = col; ctx.fillRect(-80, -430, 160, 66);
  ctx.fillStyle = 'rgba(0,0,0,.15)'; ctx.fillRect(-2, -430, 4, 66); ctx.restore();
  ctx.strokeStyle = '#111'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-74, -364); ctx.lineTo(74, -364); ctx.stroke();
  outlined(ctx, (k) => { k.moveTo(-30, -425); k.lineTo(0, -400); k.lineTo(30, -425); k.lineTo(18, -432); k.lineTo(0, -416); k.lineTo(-18, -432); k.closePath(); }, col, 3);
}
function apronLong(ctx, col) { // kitchen apron to below the knee, with ties
  outlined(ctx, (k) => { k.moveTo(-58, -300); k.lineTo(58, -300); k.lineTo(70, -90); k.quadraticCurveTo(0, -82, -70, -90); k.closePath(); }, col, 5);
  ctx.strokeStyle = 'rgba(0,0,0,.15)'; ctx.lineWidth = 3; for (const dx of [-30, 0, 30]) { ctx.beginPath(); ctx.moveTo(dx, -290); ctx.lineTo(dx * 1.15, -96); ctx.stroke(); }
  ctx.strokeStyle = col; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-58, -298); ctx.lineTo(-80, -296); ctx.moveTo(58, -298); ctx.lineTo(80, -296); ctx.stroke();
}
function cravat(ctx, col) { // white neckcloth: high collar points, a soft knot and two short folds
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#111'; ctx.lineWidth = 3;
  for (const s2 of [-1, 1]) { ctx.beginPath(); ctx.moveTo(s2 * 6, -430); ctx.lineTo(s2 * 36, -446); ctx.lineTo(s2 * 30, -416); ctx.closePath(); ctx.fill(); ctx.stroke(); }
  outlined(ctx, (k) => { k.moveTo(-30, -428); k.quadraticCurveTo(0, -414, 30, -428); k.lineTo(26, -410); k.quadraticCurveTo(0, -398, -26, -410); k.closePath(); }, col, 3);
  outlined(ctx, (k) => k.ellipse(0, -404, 13, 10, 0, 0, TAU), col, 3);
  outlined(ctx, (k) => { k.moveTo(-8, -396); k.quadraticCurveTo(-18, -370, -12, -352); k.lineTo(2, -356); k.quadraticCurveTo(-2, -376, 4, -396); k.closePath(); k.moveTo(6, -396); k.quadraticCurveTo(18, -372, 16, -356); k.lineTo(4, -354); k.closePath(); }, col, 3);
}
function neckerchief(ctx, col, d) { // sailor's knotted kerchief, ends flying to one side
  outlined(ctx, (k) => { k.moveTo(-36, -426); k.quadraticCurveTo(0, -408, 36, -426); k.lineTo(30, -410); k.quadraticCurveTo(0, -394, -30, -410); k.closePath(); }, col, 3);
  outlined(ctx, (k) => k.arc(d * 6, -398, 10, 0, TAU), col, 3);
  outlined(ctx, (k) => { k.moveTo(d * 8, -392); k.lineTo(d * 30, -350); k.lineTo(d * 18, -346); k.closePath(); k.moveTo(d * 2, -392); k.lineTo(d * -6, -352); k.lineTo(d * 6, -350); k.closePath(); }, col, 3);
}
function shawl(ctx, s) { // shawl round the shoulders, point at the back, fringe on the front edge
  const col = s.color || s;
  ctx.save(); ctx.beginPath(); ctx.rect(-130, -460, 260, 200); ctx.clip();
  outlined(ctx, (k) => { k.moveTo(-84, -420); k.quadraticCurveTo(0, -446, 84, -420); k.quadraticCurveTo(80, -360, 46, -318); k.quadraticCurveTo(0, -350, -46, -318); k.quadraticCurveTo(-80, -360, -84, -420); k.closePath(); }, col, 5);
  ctx.restore();
  if (s.pattern) { ctx.strokeStyle = s.pattern; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-74, -404); ctx.quadraticCurveTo(-64, -356, -42, -326); ctx.moveTo(74, -404); ctx.quadraticCurveTo(64, -356, 42, -326); ctx.stroke(); }
  ctx.strokeStyle = col; ctx.lineWidth = 2.5; for (let i = 0; i < 8; i++) { const t = i / 7; const x = -46 + t * 92, y = -320 - Math.sin(t * Math.PI) * 30; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 14); ctx.stroke(); }
}
function capelet(ctx, col) { // the caped collar of a greatcoat (carrick): one smooth shoulder cape with a stitched edge
  outlined(ctx, (k) => { k.moveTo(-36, -432); k.quadraticCurveTo(-100, -428, -104, -376); k.quadraticCurveTo(-96, -330, -60, -326); k.quadraticCurveTo(0, -344, 60, -326); k.quadraticCurveTo(96, -330, 104, -376); k.quadraticCurveTo(100, -428, 36, -432); k.quadraticCurveTo(0, -420, -36, -432); k.closePath(); }, col, 6);
  ctx.setLineDash([6, 6]); ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-96, -372); ctx.quadraticCurveTo(-90, -340, -58, -336); ctx.quadraticCurveTo(0, -352, 58, -336); ctx.quadraticCurveTo(90, -340, 96, -372); ctx.stroke(); ctx.setLineDash([]);
  ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.beginPath(); ctx.ellipse(-62, -396, 26, 10, -0.3, 0, TAU); ctx.fill();
}
function scarf(ctx, col, d) { // knitted winter scarf: wrap at the neck, one long tail with fringe
  outlined(ctx, (k) => rrect(k, -44, -440, 88, 30, 14), col, 4);
  outlined(ctx, (k) => { k.moveTo(d * 18, -418); k.quadraticCurveTo(d * 36, -370, d * 30, -316); k.lineTo(d * 6, -318); k.quadraticCurveTo(d * 10, -370, d * -2, -416); k.closePath(); }, col, 4);
  ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = 3; for (const y of [-400, -380, -360, -340]) { ctx.beginPath(); ctx.moveTo(d * 6, y); ctx.lineTo(d * 32, y + 2); ctx.stroke(); } for (let x = -36; x <= 36; x += 9) { ctx.beginPath(); ctx.moveTo(x, -436); ctx.lineTo(x, -414); ctx.stroke(); }
  ctx.strokeStyle = col; ctx.lineWidth = 3; for (let i = 0; i < 5; i++) { const x = d * (8 + i * 5); ctx.beginPath(); ctx.moveTo(x, -318); ctx.lineTo(x, -302); ctx.stroke(); }
}
function sleeve(ctx, x0, y0, a, b, col) { // coloured upper sleeve over the stick arm (long coats, kurtas)
  const x1 = x0 + Math.sin(a) * 80, y1 = y0 + Math.cos(a) * 80, x2 = x1 + Math.sin(a + b) * 50, y2 = y1 + Math.cos(a + b) * 50;
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#111'; ctx.lineWidth = 24; ctx.stroke(); ctx.strokeStyle = col; ctx.lineWidth = 14; ctx.stroke();
}
// hand-held props for S02
const S02_ITEMS = {
  ice: (k) => { outlined(k, (q) => { q.moveTo(-6, -38); q.lineTo(30, -46); q.lineTo(40, -10); q.lineTo(4, 0); q.closePath(); }, '#d6f0ff', 4); k.fillStyle = '#ffffff'; k.beginPath(); k.moveTo(-6, -38); k.lineTo(30, -46); k.lineTo(26, -36); k.lineTo(0, -30); k.closePath(); k.fill(); k.strokeStyle = 'rgba(255,255,255,.9)'; k.lineWidth = 2; k.beginPath(); k.moveTo(10, -28); k.lineTo(22, -18); k.stroke(); },
  iceBlock: (k) => { outlined(k, (q) => rrect(q, -40, -52, 84, 58, 6), '#cfeaff', 4); k.fillStyle = 'rgba(255,255,255,.7)'; k.fillRect(-34, -46, 72, 8); k.strokeStyle = 'rgba(255,255,255,.9)'; k.lineWidth = 2; k.beginPath(); k.moveTo(-20, -30); k.lineTo(0, -16); k.lineTo(14, -24); k.stroke(); k.fillStyle = '#8fd3ff'; for (const x of [-30, -6, 20]) { k.beginPath(); k.moveTo(x, 8); k.quadraticCurveTo(x + 5, 16, x, 20); k.quadraticCurveTo(x - 5, 16, x, 8); k.fill(); } },
  saw: (k, ang) => { k.rotate(-ang * 0.15 - 0.25); /* the long blade hangs down into the cut */ outlined(k, (q) => { q.moveTo(-6, -20); q.lineTo(6, -20); q.lineTo(10, 230); q.lineTo(-10, 230); q.closePath(); }, '#b8c0c8', 3); k.fillStyle = '#6b6f75'; for (let y = 10; y < 228; y += 12) { k.beginPath(); k.moveTo(-10, y); k.lineTo(-17, y + 6); k.lineTo(-10, y + 12); k.fill(); } outlined(k, (q) => rrect(q, -34, -30, 68, 14, 6), '#8a5a32', 3); },
  tongs: (k, ang) => { k.rotate(-ang * 0.5); k.strokeStyle = '#111'; k.lineWidth = 11; k.lineCap = 'round'; for (const s2 of [-1, 1]) { k.beginPath(); k.moveTo(0, 0); k.quadraticCurveTo(s2 * 46, 40, s2 * 16, 92); k.stroke(); } k.strokeStyle = '#4a4e55'; k.lineWidth = 5; for (const s2 of [-1, 1]) { k.beginPath(); k.moveTo(0, 0); k.quadraticCurveTo(s2 * 46, 40, s2 * 16, 92); k.stroke(); } outlined(k, (q) => rrect(q, -26, -12, 52, 12, 5), '#8a5a32', 3); },
  pike: (k, ang) => { k.rotate(-ang + 0.35); k.beginPath(); k.moveTo(0, 70); k.lineTo(0, -230); k.strokeStyle = '#111'; k.lineWidth = 13; k.stroke(); k.strokeStyle = '#9a7048'; k.lineWidth = 7; k.stroke(); outlined(k, (q) => { q.moveTo(-6, -228); q.lineTo(0, -258); q.lineTo(6, -228); q.closePath(); }, '#4a4e55', 3); k.strokeStyle = '#111'; k.lineWidth = 5; k.beginPath(); k.arc(12, -222, 12, Math.PI, Math.PI * 2.4); k.stroke(); },
  fan: (k) => { k.rotate(-0.4); outlined(k, (q) => { q.moveTo(0, 0); q.arc(0, -10, 54, -Math.PI * 0.85, -Math.PI * 0.15); q.closePath(); }, '#c9a85a', 4); k.strokeStyle = 'rgba(90,60,20,.6)'; k.lineWidth = 2; for (let i = 0; i < 7; i++) { const a = -Math.PI * (0.83 - i * 0.11); k.beginPath(); k.moveTo(0, -4); k.lineTo(Math.cos(a) * 52, -10 + Math.sin(a) * 52); k.stroke(); } outlined(k, (q) => rrect(q, -4, -4, 8, 30, 3), '#8a5a32', 3); },
  letter: (k) => { k.rotate(-0.08); outlined(k, (q) => q.rect(-10, -66, 66, 80), '#f6eedb', 3); k.strokeStyle = 'rgba(120,90,50,.4)'; k.lineWidth = 2; k.beginPath(); k.moveTo(-10, -40); k.lineTo(56, -40); k.moveTo(-10, -12); k.lineTo(56, -12); k.stroke(); k.fillStyle = '#9fd0ee'; k.beginPath(); k.ellipse(24, -18, 22, 7, 0, 0, TAU); k.fill(); k.fillStyle = '#e3f4ff'; k.strokeStyle = '#1f3a56'; k.lineWidth = 2; k.fillRect(18, -32, 12, 12); k.strokeRect(18, -32, 12, 12); },
  umbrella: (k, ang) => { k.rotate(-ang + 0.05); k.beginPath(); k.moveTo(0, 20); k.lineTo(0, -150); k.strokeStyle = '#111'; k.lineWidth = 8; k.stroke(); outlined(k, (q) => { q.moveTo(-90, -130); q.quadraticCurveTo(0, -240, 90, -130); q.quadraticCurveTo(60, -140, 45, -126); q.quadraticCurveTo(22, -140, 0, -126); q.quadraticCurveTo(-22, -140, -45, -126); q.quadraticCurveTo(-60, -140, -90, -130); q.closePath(); }, '#2a3a5a', 5); k.strokeStyle = 'rgba(255,255,255,.2)'; k.lineWidth = 2; for (const x of [-45, 0, 45]) { k.beginPath(); k.moveTo(0, -186); k.lineTo(x, -128); k.stroke(); } k.strokeStyle = '#111'; k.lineWidth = 6; k.beginPath(); k.arc(-8, 20, 8, 0, Math.PI); k.stroke(); },
  parasol: (k, ang) => { k.rotate(-ang + 0.2); k.beginPath(); k.moveTo(0, 20); k.lineTo(0, -140); k.strokeStyle = '#111'; k.lineWidth = 7; k.stroke(); outlined(k, (q) => { q.moveTo(-80, -126); q.quadraticCurveTo(0, -214, 80, -126); q.quadraticCurveTo(0, -150, -80, -126); q.closePath(); }, '#f2ead6', 5); k.strokeStyle = '#c0392b'; k.lineWidth = 4; k.beginPath(); k.moveTo(-78, -128); k.quadraticCurveTo(0, -152, 78, -128); k.stroke(); },
  ledger: (k) => { k.rotate(-0.1); outlined(k, (q) => rrect(q, -6, -60, 56, 70, 4), '#5a2a1e', 4); k.fillStyle = '#e8c55a'; k.fillRect(4, -50, 36, 6); k.fillRect(4, -2, 36, 4); k.fillStyle = '#f3ecd8'; k.fillRect(50, -56, 4, 62); },
  lantern: (k) => { k.strokeStyle = '#111'; k.lineWidth = 4; k.beginPath(); k.arc(0, 4, 10, Math.PI, 0); k.stroke(); outlined(k, (q) => rrect(q, -18, 14, 36, 46, 4), '#ffe2a0', 4); k.fillStyle = '#2b2b2b'; k.fillRect(-20, 10, 40, 8); k.fillRect(-20, 58, 40, 8); k.fillStyle = '#ff9a2a'; k.beginPath(); k.ellipse(0, 38, 5, 10, 0, 0, TAU); k.fill(); },
  shovel: (k, ang) => { k.rotate(-ang + 0.6); k.beginPath(); k.moveTo(0, -60); k.lineTo(0, 150); k.strokeStyle = '#111'; k.lineWidth = 12; k.stroke(); k.strokeStyle = '#9a7048'; k.lineWidth = 6; k.stroke(); outlined(k, (q) => { q.moveTo(-26, 150); q.lineTo(26, 150); q.lineTo(22, 206); q.quadraticCurveTo(0, 218, -22, 206); q.closePath(); }, '#6b6f75', 4); },
  rope: (k) => { for (let i = 0; i < 3; i++) outlined(k, (q) => q.ellipse(10, 6 + i * 4, 30 - i * 3, 34 - i * 4, 0, 0, TAU), 'rgba(0,0,0,0)', 3, '#111'); k.strokeStyle = '#c9a46a'; k.lineWidth = 5; for (let i = 0; i < 3; i++) { k.beginPath(); k.ellipse(10, 6 + i * 4, 30 - i * 3, 34 - i * 4, 0, 0, TAU); k.stroke(); } },
  cup: (k) => { outlined(k, (q) => { q.moveTo(-12, -30); q.lineTo(14, -30); q.lineTo(10, 0); q.lineTo(-8, 0); q.closePath(); }, '#f2f2ea', 3); k.fillStyle = '#9fd0ee'; k.fillRect(-10, -26, 22, 6); },
};

export function drawHead(ctx, c, p, hx, hy, rim) {
  const R = 92;
  const rx = c.egg ? 84 : R, ry = c.egg ? 102 : R;
  const fx = hx + p.turn * 30 * (c.dir || 1);
  // hair behind head
  if (c.hair === 'bun') { outlined(ctx, (k) => k.arc(hx, hy - ry - 6, 34, 0, TAU), c.hairColor || '#4a3020'); }
  if (c.hat === 'bonnet') { // back hood
    outlined(ctx, (k) => k.ellipse(hx, hy - 6, rx + 22, ry + 20, 0, 0, TAU), c.hatColor || '#c9a7d8');
  }
  // head
  outlined(ctx, (k) => k.ellipse(hx, hy, rx, ry, 0, 0, TAU), '#ffffff');
  if (rim) {
    ctx.save(); ctx.beginPath(); ctx.ellipse(hx, hy, rx, ry, 0, 0, TAU); ctx.clip();
    ctx.strokeStyle = rim; ctx.lineWidth = 12; ctx.globalAlpha = 0.45;
    ctx.beginPath(); ctx.ellipse(hx + 8, hy - 4, rx, ry, 0, 0, TAU); ctx.stroke(); ctx.restore();
  }
  if (c.hair === 'pigtails') {
    for (const s of [-1, 1]) outlined(ctx, (k) => k.ellipse(hx + s * (rx + 14), hy + 10, 18, 30, s * 0.3, 0, TAU), c.hairColor || '#6b3b1f', 5);
  }
  if (c.hair === 'side') { // side-parted hair: a cap of hair over the top of the head
    const R1 = rx + 9, R2 = ry + 9, d = (c.dir || 1);
    outlined(ctx, (k) => {
      k.moveTo(hx - R1 * 0.97, hy - R2 * 0.26);
      k.ellipse(hx, hy, R1, R2, 0, Math.PI + 0.26, TAU - 0.16);
      k.quadraticCurveTo(hx + rx * 0.9, hy - ry * 0.32, hx + rx * 0.62, hy - ry * 0.42);
      k.quadraticCurveTo(hx + d * 18, hy - ry * 0.38, hx - d * 18, hy - ry * 0.72);
      k.quadraticCurveTo(hx - rx * 0.55, hy - ry * 0.52, hx - rx * 0.86, hy - ry * 0.12);
      k.closePath();
    }, c.hairColor || '#5a3a22', 5);
    ctx.strokeStyle = 'rgba(255,255,255,.22)'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(hx - d * 22, hy - ry * 0.92); ctx.quadraticCurveTo(hx + d * 30, hy - ry * 0.98, hx + d * 62, hy - ry * 0.7); ctx.stroke();
  }
  // beard (under face features)
  if (c.beard) { const beardFx = fx;
    outlined(ctx, (k) => {
      k.moveTo(fx - 78, hy + 4); k.quadraticCurveTo(fx - 70, hy + 110, fx, hy + 132);
      k.quadraticCurveTo(fx + 70, hy + 110, fx + 78, hy + 4); k.quadraticCurveTo(fx, hy + 50, fx - 78, hy + 4);
    }, c.beard, 5);
    ctx.strokeStyle = 'rgba(0,0,0,.18)'; ctx.lineWidth = 3;
    for (const dx of [-50, -28, -8, 12, 32, 52]) { ctx.beginPath(); ctx.moveTo(beardFx + dx, hy + 40); ctx.quadraticCurveTo(beardFx + dx * 0.8, hy + 80, beardFx + dx * 0.5, hy + 112); ctx.stroke(); }
  }
  if (c.sideburns) for (const s2 of [-1, 1]) { // grey side-whiskers: narrow, following the cheek, with hair strokes
    const x0 = hx + s2 * (rx - 3);
    outlined(ctx, (k) => { k.moveTo(x0, hy - 30); k.quadraticCurveTo(x0 + s2 * 4, hy + 20, x0 - s2 * 10, hy + 58); k.quadraticCurveTo(x0 - s2 * 22, hy + 50, x0 - s2 * 16, hy + 14); k.quadraticCurveTo(x0 - s2 * 12, hy - 14, x0, hy - 30); }, c.sideburns, 3);
    ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = 2; for (const t of [0.25, 0.5, 0.75]) { ctx.beginPath(); ctx.moveTo(x0 - s2 * 4, hy - 20 + t * 60); ctx.lineTo(x0 - s2 * 12, hy - 10 + t * 64); ctx.stroke(); }
  }
  // face features
  const eyeY = hy - 8 + p.lookY * 3;
  const ex = 30;
  for (const s of [-1, 1]) {
    const x = fx + s * ex + p.lookX * 4;
    const open = Math.max(0, Math.min(1, p.eyes * (1 - p.squint * 0.6)));
    if (open < 0.25) {
      ctx.beginPath(); ctx.moveTo(x - 11, eyeY); ctx.quadraticCurveTo(x, eyeY + 5, x + 11, eyeY);
      ctx.strokeStyle = '#111'; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.stroke();
    } else {
      ctx.beginPath(); ctx.ellipse(x, eyeY, 9.5, 11 * open, 0, 0, TAU); ctx.fillStyle = '#111'; ctx.fill();
      ctx.beginPath(); ctx.arc(x + 3, eyeY - 4 * open, 2.6, 0, TAU); ctx.fillStyle = '#fff'; ctx.fill();
    }
    // brows
    const bv = s < 0 ? (p.browL ?? p.brow) : (p.browR ?? p.brow);
    const by = eyeY - 30 - Math.max(0, bv) * 10;
    const ang = -bv * 0.35 * -s; // angry (bv<0): inner end down
    ctx.save(); ctx.translate(x, by); ctx.rotate(bv < 0 ? s * 0.45 * -bv : -s * 0.18 * bv);
    ctx.beginPath(); ctx.moveTo(-15, 0); ctx.lineTo(15, 0);
    ctx.strokeStyle = c.browColor || '#111'; ctx.lineWidth = c.bushy ? 10 : 7; ctx.lineCap = 'round'; ctx.stroke(); ctx.restore();
    void ang;
  }
  // glasses / monocle
  if (c.glasses) {
    ctx.strokeStyle = '#111'; ctx.lineWidth = 5;
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.arc(fx + s * ex + p.lookX * 2, eyeY, 21, 0, TAU); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(fx - ex + 21, eyeY); ctx.lineTo(fx + ex - 21, eyeY); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.lineWidth = 3;
    for (const sx of [-1, 1]) { ctx.beginPath(); ctx.arc(fx + sx * ex, eyeY, 15, Math.PI * 1.15, Math.PI * 1.4); ctx.stroke(); }
    ctx.strokeStyle = '#111'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(fx - ex - 21, eyeY - 2); ctx.lineTo(fx - ex - 40, eyeY - 8); ctx.moveTo(fx + ex + 21, eyeY - 2); ctx.lineTo(fx + ex + 40, eyeY - 8); ctx.stroke(); // temples
    ctx.globalAlpha = 0.25; ctx.fillStyle = '#bfe6ff';
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.arc(fx + s * ex, eyeY, 18, 0, TAU); ctx.fill(); }
    ctx.globalAlpha = 1;
  }
  if (c.monocle && !p.monocleOut) {
    ctx.strokeStyle = '#c9a227'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(fx + ex, eyeY, 22, 0, TAU); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(fx + ex + 18, eyeY + 14); ctx.quadraticCurveTo(fx + ex + 40, eyeY + 80, fx + ex + 10, hy + 150);
    ctx.lineWidth = 2.5; ctx.stroke();
  }
  // mouth
  const my = hy + 44;
  ctx.save(); ctx.translate(fx, my);
  drawMouth(ctx, p.mouth, p.talk);
  ctx.restore();
  // moustache
  if (c.moustache) {
    ctx.save(); ctx.translate(fx, my - 16);
    outlined(ctx, (k) => {
      k.moveTo(0, -4); k.bezierCurveTo(-18, -16, -44, -8, -50, 8); k.bezierCurveTo(-36, 0, -16, 6, 0, 4);
      k.bezierCurveTo(16, 6, 36, 0, 50, 8); k.bezierCurveTo(44, -8, 18, -16, 0, -4);
    }, c.moustache, 3);
    ctx.restore();
  }
  // hats
  if (c.hat) {
    if (p.hatLift || p.hatDroop) { // hat raised in greeting / crown sagging in defeat
      ctx.save(); const L = p.hatLift || 0, D = p.hatDroop || 0;
      ctx.translate(hx + L * 150, hy - ry + L * 80); ctx.rotate(L * 0.45 + D * 0.12); /* lifted: held out in the raised right hand, tipped */ ctx.scale(1 + D * 0.06, 1 - D * 0.28); ctx.translate(-hx, -(hy - ry));
      drawHat(ctx, c, hx, hy - ry, rx); ctx.restore();
    } else drawHat(ctx, c, hx, hy - ry, rx);
  }
}

function drawMouth(ctx, kind, talk) {
  ctx.strokeStyle = '#111'; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.fillStyle = '#3a1010';
  const t = talk || 0;
  if (t > 0.05 && kind !== 'laugh') {
    ctx.beginPath(); ctx.ellipse(0, 4, 13 + t * 4, 4 + t * 14, 0, 0, TAU); ctx.fill(); ctx.stroke(); return;
  }
  switch (kind) {
    case 'smile': ctx.beginPath(); ctx.arc(0, -10, 22, 0.25 * Math.PI, 0.75 * Math.PI); ctx.stroke(); break;
    case 'grin':
      ctx.beginPath(); ctx.moveTo(-26, -2); ctx.quadraticCurveTo(0, 30, 26, -2); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.fillRect(-18, 0, 36, 6); break;
    case 'laugh':
      ctx.beginPath(); ctx.moveTo(-26, -6); ctx.quadraticCurveTo(0, 40 + t * 8, 26, -6); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#e66'; ctx.beginPath(); ctx.ellipse(0, 16, 10, 6, 0, 0, TAU); ctx.fill(); break;
    case 'o': ctx.beginPath(); ctx.ellipse(0, 6, 10, 14, 0, 0, TAU); ctx.fill(); ctx.stroke(); break;
    case 'gasp': ctx.beginPath(); ctx.ellipse(0, 10, 16, 22, 0, 0, TAU); ctx.fill(); ctx.stroke(); break;
    case 'frown': ctx.beginPath(); ctx.arc(0, 18, 18, 1.2 * Math.PI, 1.8 * Math.PI); ctx.stroke(); break;
    case 'wobbly':
      ctx.beginPath(); ctx.moveTo(-18, 4);
      for (let i = 1; i <= 6; i++) ctx.lineTo(-18 + i * 6, 4 + (i % 2 ? -4 : 4));
      ctx.stroke(); break;
    case 'smug': ctx.beginPath(); ctx.moveTo(-16, 4); ctx.quadraticCurveTo(6, 10, 20, -6); ctx.stroke(); break;
    default: ctx.beginPath(); ctx.moveTo(-13, 2); ctx.lineTo(13, 2); ctx.stroke();
  }
}

function drawHat(ctx, c, hx, top, rx) {
  const col = c.hatColor || '#222';
  const band = c.hatBand || '#7a1f1f';
  ctx.save(); ctx.translate(hx, top);
  switch (c.hat) {
    case 'wide':
      outlined(ctx, (k) => k.ellipse(0, 22, 150, 22, 0, 0, TAU), col, 6);
      outlined(ctx, (k) => { k.moveTo(-72, 22); k.bezierCurveTo(-74, -60, 74, -60, 72, 22); k.closePath(); }, col, 6);
      ctx.fillStyle = band; ctx.fillRect(-70, 2, 140, 14);
      ctx.strokeStyle = 'rgba(255,255,255,.18)'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-40, -22); ctx.quadraticCurveTo(-10, -36, 26, -30); ctx.stroke();
      ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.ellipse(0, 22, 136, 15, 0, Math.PI * 0.05, Math.PI * 0.95); ctx.stroke(); // brim stitch
      ctx.strokeStyle = '#e8c55a'; ctx.lineWidth = 3; ctx.strokeRect(52, 3, 10, 12); break; // buckle
    case 'top':
      outlined(ctx, (k) => k.ellipse(0, 26, 112, 18, 0, 0, TAU), col, 6);
      outlined(ctx, (k) => rrect(k, -64, -128, 128, 154, 10), col, 6);
      ctx.fillStyle = band; ctx.fillRect(-64, 0, 128, 18);
      ctx.fillStyle = 'rgba(255,255,255,.13)'; ctx.fillRect(-46, -120, 14, 116); ctx.fillRect(-26, -120, 5, 116); // silk sheen
      ctx.fillStyle = band; ctx.beginPath(); ctx.ellipse(48, 9, 9, 12, 0, 0, TAU); ctx.fill(); // band bow
      ctx.strokeStyle = 'rgba(0,0,0,.4)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-64, 0); ctx.lineTo(64, 0); ctx.stroke(); break;
    case 'bowler':
      outlined(ctx, (k) => k.ellipse(0, 26, 112, 16, 0, 0, TAU), col, 6);
      outlined(ctx, (k) => { k.moveTo(-76, 26); k.bezierCurveTo(-80, -86, 80, -86, 76, 26); k.closePath(); }, col, 6);
      ctx.fillStyle = band; ctx.fillRect(-74, 8, 148, 12);
      ctx.strokeStyle = 'rgba(255,255,255,.2)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(-6, 18, 58, Math.PI * 1.15, Math.PI * 1.45); ctx.stroke();
      ctx.fillStyle = band; ctx.beginPath(); ctx.ellipse(56, 14, 7, 10, 0.2, 0, TAU); ctx.fill(); break;
    case 'flat': {
      const d = c.dir || 1;
      outlined(ctx, (k) => { k.moveTo(-92, 30); k.bezierCurveTo(-96, -40, 92, -40, 92, 24); k.closePath(); }, col, 6);
      outlined(ctx, (k) => k.ellipse(d * 70, 28, 56, 13, d * 0.12, 0, TAU), col, 5);
      ctx.strokeStyle = 'rgba(0,0,0,.3)'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(-60, 10); ctx.quadraticCurveTo(0, -30, 60, 10); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-30, 20); ctx.quadraticCurveTo(0, -12, 34, 20); ctx.stroke();
      outlined(ctx, (k) => k.arc(0, -14, 7, 0, TAU), col, 3); // top button
      ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.ellipse(d * 70, 28, 46, 7, d * 0.12, 0, TAU); ctx.stroke(); ctx.setLineDash([]); // bill stitching
      break;
    }
    case 'bonnet':
      ctx.strokeStyle = '#111'; ctx.lineWidth = 6;
      outlined(ctx, (k) => { k.moveTo(-rx - 22, 120); k.bezierCurveTo(-rx - 30, -60, rx + 30, -60, rx + 22, 120); k.lineTo(rx - 4, 120); k.bezierCurveTo(rx - 10, 6, -rx + 10, 6, -rx + 4, 120); k.closePath(); }, col, 6);
      // lace scallops along the front edge
      ctx.fillStyle = '#fffaf0'; ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = 1.5;
      for (let i = 0; i <= 12; i++) { const a = Math.PI * (1.08 + i * 0.07); const lx = Math.cos(a) * (rx + 4), ly = 64 + Math.sin(a) * 62; ctx.beginPath(); ctx.arc(lx, ly, 7, 0, TAU); ctx.fill(); ctx.stroke(); }
      // ribbon bow under the chin
      ctx.fillStyle = band;
      for (const sx of [-1, 1]) { ctx.beginPath(); ctx.moveTo(rx + 8, 150); ctx.lineTo(rx + 8 + sx * 26, 136); ctx.lineTo(rx + 8 + sx * 26, 164); ctx.closePath(); ctx.fill(); }
      ctx.beginPath(); ctx.arc(rx + 8, 150, 8, 0, TAU); ctx.fill();
      ctx.fillRect(rx + 2, 156, 6, 34); ctx.fillRect(rx + 10, 156, 6, 28); break;
    case 'topTall': // 1806 tall top hat with a slight bell crown, curled brim, silk sheen, band and buckle
      outlined(ctx, (k) => { k.moveTo(-112, 28); k.quadraticCurveTo(-118, 8, -98, 14); k.lineTo(98, 14); k.quadraticCurveTo(118, 8, 112, 28); k.quadraticCurveTo(0, 46, -112, 28); k.closePath(); }, col, 6);
      outlined(ctx, (k) => { k.moveTo(-60, 20); k.lineTo(-66, -168); k.quadraticCurveTo(0, -182, 66, -168); k.lineTo(60, 20); k.closePath(); }, col, 6);
      ctx.fillStyle = band; ctx.beginPath(); ctx.moveTo(-60, 20); ctx.lineTo(-61, -6); ctx.lineTo(61, -6); ctx.lineTo(60, 20); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = '#e8c55a'; ctx.lineWidth = 3; ctx.strokeRect(-14, -5, 22, 22);
      ctx.fillStyle = 'rgba(255,255,255,.14)'; ctx.beginPath(); ctx.moveTo(-46, -6); ctx.lineTo(-50, -160); ctx.lineTo(-36, -162); ctx.lineTo(-33, -6); ctx.closePath(); ctx.fill(); ctx.fillRect(-26, -160, 5, 154);
      ctx.strokeStyle = 'rgba(0,0,0,.4)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(0, -168, 64, 8, 0, Math.PI, TAU); ctx.stroke(); break;
    case 'roundHat': // low straight crown, wide flat brim (never reads as a bowler: flat top, straight sides)
      outlined(ctx, (k) => k.ellipse(0, 24, 140, 20, 0, 0, TAU), col, 6);
      outlined(ctx, (k) => { k.moveTo(-66, 24); k.lineTo(-62, -58); k.quadraticCurveTo(0, -66, 62, -58); k.lineTo(66, 24); k.closePath(); }, col, 6);
      ctx.fillStyle = band; ctx.fillRect(-65, 2, 130, 14);
      ctx.fillStyle = 'rgba(255,255,255,.14)'; ctx.fillRect(-48, -54, 10, 54);
      ctx.strokeStyle = 'rgba(0,0,0,.3)'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.ellipse(0, 24, 128, 13, 0, Math.PI * 0.05, Math.PI * 0.95); ctx.stroke(); break;
    case 'bicorne': { // 1790s–1800s two-cornered hat, worn sideways by older gentlemen, with a cockade
      outlined(ctx, (k) => { k.moveTo(-150, 40); k.quadraticCurveTo(-120, -10, -60, -64); k.quadraticCurveTo(0, -100, 60, -64); k.quadraticCurveTo(120, -10, 150, 40); k.quadraticCurveTo(0, 6, -150, 40); k.closePath(); }, col, 6);
      ctx.strokeStyle = c.hatTrim || '#e8c55a'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-140, 34); ctx.quadraticCurveTo(-110, -6, -58, -56); ctx.quadraticCurveTo(0, -90, 58, -56); ctx.quadraticCurveTo(110, -6, 140, 34); ctx.stroke();
      outlined(ctx, (k) => k.arc(30, -38, 16, 0, TAU), c.cockade || '#1b1b1b', 4); ctx.fillStyle = '#e8c55a'; ctx.beginPath(); ctx.arc(30, -38, 5, 0, TAU); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.14)'; ctx.beginPath(); ctx.ellipse(-60, -30, 40, 8, -0.5, 0, TAU); ctx.fill(); break; }
    case 'knit': // knitted wool cap: ribbed turn-up, gathered crown, a pom
      outlined(ctx, (k) => { k.moveTo(-90, 34); k.bezierCurveTo(-96, -70, 96, -70, 90, 34); k.closePath(); }, col, 6);
      outlined(ctx, (k) => rrect(k, -94, 8, 188, 34, 14), c.hatBand || col, 5);
      ctx.strokeStyle = 'rgba(0,0,0,.3)'; ctx.lineWidth = 3; for (let x = -84; x <= 84; x += 12) { ctx.beginPath(); ctx.moveTo(x, 12); ctx.lineTo(x, 38); ctx.stroke(); }
      ctx.strokeStyle = 'rgba(255,255,255,.18)'; ctx.lineWidth = 2.5; for (let x = -60; x <= 60; x += 20) { ctx.beginPath(); ctx.moveTo(x, 4); ctx.quadraticCurveTo(x * 0.6, -26, x * 0.2, -44); ctx.stroke(); }
      if (c.pom !== false) outlined(ctx, (k) => k.arc(0, -52, 16, 0, TAU), c.pomColor || c.hatBand || col, 4); break;
    case 'straw': // wide woven straw hat with a ribbon band
      outlined(ctx, (k) => k.ellipse(0, 24, 156, 26, 0, 0, TAU), col, 6);
      outlined(ctx, (k) => { k.moveTo(-66, 24); k.bezierCurveTo(-70, -56, 70, -56, 66, 24); k.closePath(); }, col, 6);
      ctx.strokeStyle = 'rgba(110,80,20,.45)'; ctx.lineWidth = 2; for (let r = 80; r < 152; r += 12) { ctx.beginPath(); ctx.ellipse(0, 24, r, r * 0.16, 0, 0, TAU); ctx.stroke(); }
      for (let y = -30; y < 20; y += 9) { ctx.beginPath(); ctx.moveTo(-64, y); ctx.lineTo(64, y); ctx.stroke(); }
      ctx.fillStyle = band; ctx.fillRect(-67, 2, 134, 14); ctx.beginPath(); ctx.moveTo(52, 9); ctx.lineTo(80, 30); ctx.lineTo(66, 34); ctx.closePath(); ctx.fill(); break;
    case 'mobcap': // gathered linen cap with a frill and a ribbon
      outlined(ctx, (k) => { k.moveTo(-rx - 18, 70); k.bezierCurveTo(-rx - 40, -70, rx + 40, -70, rx + 18, 70); k.quadraticCurveTo(0, 30, -rx - 18, 70); k.closePath(); }, col || '#fbf8ef', 6);
      ctx.fillStyle = '#ffffff'; ctx.strokeStyle = 'rgba(0,0,0,.3)'; ctx.lineWidth = 1.5; for (let i = 0; i <= 14; i++) { const a = Math.PI * (1.05 + i * 0.064); ctx.beginPath(); ctx.arc(Math.cos(a) * (rx + 18), 60 + Math.sin(a) * 70, 9, 0, TAU); ctx.fill(); ctx.stroke(); }
      ctx.strokeStyle = 'rgba(0,0,0,.2)'; ctx.lineWidth = 2; for (let x = -60; x <= 60; x += 15) { ctx.beginPath(); ctx.moveTo(x, -30); ctx.lineTo(x * 1.2, 30); ctx.stroke(); }
      ctx.fillStyle = band; ctx.fillRect(-rx - 4, 34, 2 * rx + 8, 9); ctx.beginPath(); ctx.ellipse(rx - 2, 38, 10, 7, 0.4, 0, TAU); ctx.fill(); break;
    case 'turban': { // neat wrapped pagri: compact, layered folds, tidy end tucked at the side
      outlined(ctx, (k) => { k.moveTo(-rx - 8, 50); k.bezierCurveTo(-rx - 14, -60, rx + 14, -60, rx + 8, 50); k.quadraticCurveTo(0, 30, -rx - 8, 50); k.closePath(); }, col, 6);
      ctx.strokeStyle = 'rgba(0,0,0,.28)'; ctx.lineWidth = 3;
      for (let i = 0; i < 5; i++) { const y = 36 - i * 16; ctx.beginPath(); ctx.moveTo(-rx - 4 + i * 6, y + 6); ctx.quadraticCurveTo(0, y - 22, rx + 4 - i * 6, y - 6); ctx.stroke(); }
      ctx.strokeStyle = 'rgba(255,255,255,.3)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-50, -10); ctx.quadraticCurveTo(-10, -34, 30, -26); ctx.stroke();
      if (c.hatBand) { ctx.fillStyle = c.hatBand; ctx.beginPath(); ctx.moveTo(-rx - 6, 40); ctx.quadraticCurveTo(0, 18, rx + 6, 34); ctx.lineTo(rx + 6, 44); ctx.quadraticCurveTo(0, 28, -rx - 6, 50); ctx.closePath(); ctx.fill(); }
      outlined(ctx, (k) => { k.moveTo(rx - 10, 6); k.quadraticCurveTo(rx + 28, -6, rx + 22, 30); k.quadraticCurveTo(rx + 6, 24, rx - 10, 26); k.closePath(); }, col, 4); break; }
    case 'headwrap': // tied cloth head-wrap (madras check for Martinique, plain gamchha for Bengal), knot at the front-side
      outlined(ctx, (k) => { k.moveTo(-rx - 10, 56); k.bezierCurveTo(-rx - 16, -54, rx + 16, -54, rx + 10, 56); k.quadraticCurveTo(0, 34, -rx - 10, 56); k.closePath(); }, col, 6);
      if (c.check) { ctx.save(); ctx.beginPath(); ctx.moveTo(-rx - 10, 56); ctx.bezierCurveTo(-rx - 16, -54, rx + 16, -54, rx + 10, 56); ctx.closePath(); ctx.clip(); ctx.globalAlpha = 0.55; ctx.strokeStyle = c.check; ctx.lineWidth = 7; for (let x = -110; x < 110; x += 26) { ctx.beginPath(); ctx.moveTo(x, -60); ctx.lineTo(x, 60); ctx.stroke(); } for (let y = -50; y < 60; y += 26) { ctx.beginPath(); ctx.moveTo(-110, y); ctx.lineTo(110, y); ctx.stroke(); } ctx.restore(); }
      ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = 3; for (const y of [-10, 14]) { ctx.beginPath(); ctx.moveTo(-rx, y + 20); ctx.quadraticCurveTo(0, y - 16, rx, y + 10); ctx.stroke(); }
      outlined(ctx, (k) => { k.moveTo(28, -40); k.quadraticCurveTo(66, -82, 78, -40); k.quadraticCurveTo(56, -30, 28, -40); k.moveTo(28, -40); k.quadraticCurveTo(-4, -84, -20, -46); k.quadraticCurveTo(6, -32, 28, -40); }, col, 4);
      outlined(ctx, (k) => k.arc(28, -40, 11, 0, TAU), col, 4); break;
    case 'helmet':
      outlined(ctx, (k) => { k.moveTo(-90, 34); k.bezierCurveTo(-96, -70, 96, -70, 90, 34); k.closePath(); }, col, 6);
      outlined(ctx, (k) => rrect(k, -8, -74, 16, 22, 6), '#c9a227', 4); break;
  }
  ctx.restore();
}

function drawIcon(ctx, kind, x, y, t) {
  const pop = Math.min(1, t * 6); const sc = pop < 1 ? 1.25 * pop : 1 + 0.05 * Math.sin(t * 9);
  ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
  ctx.font = 'bold 84px "DejaVu Sans", sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.lineWidth = 12; ctx.strokeStyle = '#111'; ctx.lineJoin = 'round';
  const col = kind === '!' ? '#ffd23f' : kind === '?' ? '#7fd1ff' : '#fff';
  if (kind === 'sparkle') {
    outlined(ctx, (k) => { for (let i = 0; i < 8; i++) { const r = i % 2 ? 12 : 36; const a = i * Math.PI / 4; i ? k.lineTo(Math.sin(a) * r, -Math.cos(a) * r) : k.moveTo(Math.sin(a) * r, -Math.cos(a) * r); } k.closePath(); }, '#ffe066', 5);
  } else if (kind === 'anger') {
    ctx.strokeStyle = '#e63946'; ctx.lineWidth = 9;
    for (const [a, b] of [[[-20, -8], [-6, -8]], [[6, -8], [20, -8]], [[-20, 8], [-6, 8]], [[6, 8], [20, 8]]]) { ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.stroke(); }
  } else {
    ctx.strokeText(kind, 0, 0); ctx.fillStyle = col; ctx.fillText(kind, 0, 0);
  }
  ctx.restore();
}

// ---------- Hans the horse (side view) ----------
// Horse card space: 1024x768, ground y=730. Functions take a pose:
// { head: rad (+ = lift), earFlick: 0..1, blink: 0..1 (1=open), tail: rad, breathe: 0..1,
//   tap: {a, b} (front near leg), brow: -1..1, mouth: 'neutral'|'smile'|'open'|'wobbly', pupil: -1..1, sweat }
export const HORSE = { brown: '#a5653a', dark: '#4b2a18', far: '#8a5230', hoof: '#2a1d16', muzzle: '#c98a5c' };
export const HORSE_TAP_PIVOT = [648, 450];
export const HORSE_LEG = [150, 140];

export function drawHorse(ctx, p, opt = {}) {
  const H = HORSE;
  const br = 1 + Math.sin((p.breathe || 0) * TAU) * 0.012;
  // far legs
  for (const [x, y, a] of [[372, 445, 0.06], [600, 448, -0.04]]) horseLeg(ctx, x, y, a, 0.02, H.far);
  // tail
  ctx.save(); ctx.translate(272, 352); ctx.rotate(p.tail || 0);
  outlined(ctx, (k) => { k.moveTo(0, 0); k.bezierCurveTo(-70, 40, -70, 170, -30, 260); k.bezierCurveTo(-10, 200, -6, 120, 26, 30); k.closePath(); }, H.dark, 7);
  ctx.strokeStyle = 'rgba(255,255,255,.15)'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(-10, 30); ctx.bezierCurveTo(-50, 90, -46, 160, -30, 230); ctx.stroke();
  ctx.restore();
  // neck (behind body)
  ctx.save(); ctx.translate(640, 330); ctx.rotate(-(p.head || 0)); ctx.translate(-640, -330);
  outlined(ctx, (k) => { k.moveTo(548, 410); k.lineTo(574, 292); k.quadraticCurveTo(640, 180, 716, 128); k.lineTo(812, 232); k.quadraticCurveTo(740, 300, 676, 420); k.closePath(); }, H.brown, 8);
  ctx.restore();
  // near back leg
  horseLeg(ctx, 330, 440, -0.05, 0.03, H.brown);
  // body
  ctx.save(); ctx.translate(470, 400); ctx.scale(1, br);
  outlined(ctx, (k) => k.ellipse(0, 0, 222, 108, 0, 0, TAU), H.brown, 8);
  ctx.fillStyle = 'rgba(255,255,255,.10)'; ctx.beginPath(); ctx.ellipse(-20, 50, 150, 38, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,.08)'; ctx.beginPath(); ctx.ellipse(-10, -60, 170, 30, 0, 0, TAU); ctx.fill();
  ctx.restore();
  // harness / blanket detail
  if (opt.blanket) { ctx.save(); ctx.translate(-58, 4); drawSaddle(ctx, opt.blanket, br); ctx.restore(); } // sits mid-back, clear of the neck and mane
  // near front leg (tap leg) — drawn separately unless opt.withTapLeg
  if (opt.withTapLeg !== false) drawTapLeg(ctx, p);
  // neck + head group
  ctx.save();
  ctx.translate(640, 330); ctx.rotate(-(p.head || 0)); ctx.translate(-640, -330);
  // head
  const neckM = ctx.getTransform();
  ctx.save(); ctx.translate(766, 162); ctx.rotate(-0.5); ctx.scale(1.3, 1.3);
  // ears
  const ef = (p.earFlick || 0);
  for (const [ex, er] of [[-14, -0.45 - ef * 0.4], [10, -0.2]]) {
    ctx.save(); ctx.translate(ex, -44); ctx.rotate(er);
    outlined(ctx, (k) => { k.moveTo(-14, 6); k.lineTo(0, -44); k.lineTo(14, 6); k.closePath(); }, H.brown, 6);
    ctx.fillStyle = '#6e3c22'; ctx.beginPath(); ctx.moveTo(-6, 0); ctx.lineTo(0, -30); ctx.lineTo(6, 0); ctx.fill();
    ctx.restore();
  }
  const headPath = (k) => {
    k.moveTo(-42, -36);
    k.quadraticCurveTo(-18, -52, 10, -50);
    k.quadraticCurveTo(34, -48, 40, -28);
    k.lineTo(63, 116);
    k.quadraticCurveTo(68, 160, 32, 165);
    k.quadraticCurveTo(-2, 168, -10, 142);
    k.quadraticCurveTo(-22, 112, -46, 74);
    k.quadraticCurveTo(-66, 38, -60, 0);
    k.quadraticCurveTo(-56, -24, -40, -40);
    k.closePath();
  };
  outlined(ctx, headPath, H.brown, 8);
  // blend the head into the neck: paint the neck over the skull's inner outline (no crease/bump)
  ctx.save(); ctx.setTransform(neckM); ctx.fillStyle = H.brown;
  ctx.beginPath(); ctx.moveTo(560, 400); ctx.lineTo(584, 300); ctx.quadraticCurveTo(644, 196, 712, 146); ctx.lineTo(796, 236); ctx.quadraticCurveTo(744, 300, 690, 410); ctx.closePath(); ctx.fill();
  ctx.restore();
  ctx.fillStyle = H.brown; ctx.beginPath(); headPath(ctx); ctx.fill();
  ctx.save(); ctx.beginPath(); headPath(ctx); ctx.clip();
  ctx.fillStyle = H.muzzle; ctx.beginPath(); ctx.ellipse(24, 132, 46, 40, -0.05, 0, TAU); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-50, 40); ctx.quadraticCurveTo(-30, 70, -6, 70); ctx.stroke(); // cheek line
  ctx.restore();
  // blaze
  ctx.fillStyle = '#f3e6d4'; ctx.beginPath(); ctx.moveTo(30, -36); ctx.quadraticCurveTo(44, 30, 36, 96); ctx.lineTo(22, 96); ctx.quadraticCurveTo(28, 30, 18, -40); ctx.closePath(); ctx.fill();
  // forelock: lies flat over the top of the head and onto the forehead (inside the outline)
  outlined(ctx, (k) => {
    k.moveTo(-6, -46); k.quadraticCurveTo(14, -54, 30, -44);
    k.quadraticCurveTo(38, -30, 34, -12); k.quadraticCurveTo(28, -20, 24, -16);
    k.quadraticCurveTo(20, -26, 12, -24); k.quadraticCurveTo(4, -34, -6, -46); k.closePath();
  }, H.dark, 3);
  // nostril + mouth
  ctx.fillStyle = '#3a1a10'; ctx.beginPath(); ctx.ellipse(44, 136, 8, 11, 0.3, 0, TAU); ctx.fill();
  ctx.save(); ctx.translate(30, 152); ctx.rotate(0.5); drawMouth(ctx, p.mouth || 'smile', p.talk || 0); ctx.restore();
  // eye
  const bl = p.blink ?? 1;
  ctx.save(); ctx.translate(16, 10);
  if (bl < 0.25) { ctx.beginPath(); ctx.moveTo(-12, 0); ctx.quadraticCurveTo(0, 7, 12, 0); ctx.strokeStyle = '#111'; ctx.lineWidth = 6; ctx.stroke(); }
  else {
    ctx.beginPath(); ctx.ellipse(0, 0, 18, 18 * bl, 0, 0, TAU); ctx.fillStyle = '#fff'; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = '#111'; ctx.stroke();
    ctx.beginPath(); ctx.arc(4 + (p.pupil || 0) * 5, 0, 9 * Math.min(1, bl * 1.2), 0, TAU); ctx.fillStyle = '#111'; ctx.fill();
    ctx.beginPath(); ctx.arc(7 + (p.pupil || 0) * 5, -4, 3, 0, TAU); ctx.fillStyle = '#fff'; ctx.fill();
  }
  // brow
  const b = p.brow || 0;
  ctx.rotate(0.5); ctx.translate(-4, -30 - Math.max(0, b) * 10); ctx.rotate(b < 0 ? 0.35 * -b : -0.25 * b);
  ctx.beginPath(); ctx.moveTo(-18, 0); ctx.lineTo(18, 0); ctx.strokeStyle = '#111'; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.stroke();
  ctx.restore();
  ctx.restore(); // head
  // mane on top of neck
  outlined(ctx, (k) => {
    k.moveTo(572, 300); k.quadraticCurveTo(630, 186, 706, 120);
    k.lineTo(724, 118); k.lineTo(716, 150); k.lineTo(700, 156); k.lineTo(690, 186); k.lineTo(672, 190); k.lineTo(660, 226); k.lineTo(642, 228); k.lineTo(630, 262); k.lineTo(614, 262); k.lineTo(604, 300); k.closePath();
  }, H.dark, 6);
  if (p.sweat > 0) {
    ctx.save(); ctx.globalAlpha = Math.min(1, p.sweat); ctx.translate(700, 90 + (1 - p.sweat) * 20);
    outlined(ctx, (k) => { k.moveTo(0, -26); k.bezierCurveTo(14, -6, 16, 12, 0, 14); k.bezierCurveTo(-16, 12, -14, -6, 0, -26); }, '#8fd3ff', 4);
    ctx.restore();
  }
  ctx.restore(); // neck group
}

function drawSaddle(ctx, cloth, br) {
  const gold = '#e8c55a', leather = '#6b3a1e', dark = '#4a2612';
  // girth strap under the belly (behind the flap)
  outlined(ctx, (k) => rrect(k, 488, 360, 22, 152 * br, 6), dark, 4);
  ctx.fillStyle = '#c9c9c9'; ctx.strokeStyle = '#111'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.rect(484, 452, 30, 22); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(499, 452); ctx.lineTo(499, 474); ctx.stroke();
  // saddle cloth with trim, embroidery and fringe
  const cl = (k) => { k.moveTo(392, 304); k.quadraticCurveTo(490, 280, 590, 300); k.lineTo(596, 418); k.quadraticCurveTo(596, 436, 578, 436); k.lineTo(410, 436); k.quadraticCurveTo(390, 436, 390, 418); k.closePath(); };
  outlined(ctx, cl, cloth, 5);
  ctx.save(); ctx.beginPath(); cl(ctx); ctx.clip();
  ctx.strokeStyle = gold; ctx.lineWidth = 7;
  ctx.beginPath(); ctx.moveTo(404, 316); ctx.quadraticCurveTo(490, 294, 578, 312); ctx.lineTo(582, 420); ctx.lineTo(406, 420); ctx.closePath(); ctx.stroke();
  ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(414, 326); ctx.quadraticCurveTo(490, 306, 568, 322); ctx.lineTo(572, 410); ctx.lineTo(416, 410); ctx.closePath(); ctx.stroke();
  for (const [x, y] of [[432, 396], [556, 396]]) { // corner diamonds
    ctx.fillStyle = gold; ctx.beginPath(); ctx.moveTo(x, y - 14); ctx.lineTo(x + 10, y); ctx.lineTo(x, y + 14); ctx.lineTo(x - 10, y); ctx.closePath(); ctx.fill();
    ctx.fillStyle = cloth; ctx.beginPath(); ctx.arc(x, y, 3.5, 0, TAU); ctx.fill();
  }
  ctx.restore();
  ctx.strokeStyle = gold; ctx.lineWidth = 4; ctx.lineCap = 'round';
  for (let x = 400; x <= 588; x += 9) { ctx.beginPath(); ctx.moveTo(x, 437); ctx.lineTo(x + 1, 449); ctx.stroke(); }
  // leather flap
  const fl = (k) => { k.moveTo(440, 312); k.lineTo(560, 312); k.quadraticCurveTo(566, 380, 548, 392); k.lineTo(454, 392); k.quadraticCurveTo(434, 380, 440, 312); k.closePath(); };
  outlined(ctx, fl, leather, 5);
  ctx.setLineDash([6, 6]); ctx.strokeStyle = '#d9a46b'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(452, 322); ctx.lineTo(548, 322); ctx.quadraticCurveTo(552, 376, 540, 382); ctx.lineTo(462, 382); ctx.quadraticCurveTo(448, 376, 452, 322); ctx.stroke();
  ctx.setLineDash([]);
  // seat with cantle (back) and pommel (front)
  const seat = (k) => { k.moveTo(420, 312); k.quadraticCurveTo(414, 270, 436, 262); k.quadraticCurveTo(460, 292, 500, 294); k.quadraticCurveTo(544, 292, 566, 258); k.quadraticCurveTo(584, 266, 578, 312); k.closePath(); };
  outlined(ctx, seat, '#7e4524', 6);
  ctx.fillStyle = 'rgba(255,220,170,.25)'; ctx.beginPath(); ctx.moveTo(446, 286); ctx.quadraticCurveTo(500, 304, 556, 280); ctx.quadraticCurveTo(500, 296, 446, 286); ctx.fill();
  outlined(ctx, (k) => k.ellipse(568, 262, 12, 9, -0.4, 0, TAU), dark, 4);
  // stirrup leather + iron
  outlined(ctx, (k) => rrect(k, 492, 330, 14, 112, 3), dark, 3);
  ctx.fillStyle = '#e8c55a'; ctx.fillRect(492, 336, 14, 8);
  outlined(ctx, (k) => { k.moveTo(478, 442); k.lineTo(520, 442); k.lineTo(530, 478); k.lineTo(468, 478); k.closePath(); }, '#cfd3d6', 4);
  ctx.fillStyle = '#7e868c'; ctx.beginPath(); ctx.moveTo(484, 450); ctx.lineTo(514, 450); ctx.lineTo(520, 470); ctx.lineTo(478, 470); ctx.closePath(); ctx.fill();
}

function horseLeg(ctx, x, y, a, b, col) {
  const [l1, l2] = HORSE_LEG;
  const x1 = x + Math.sin(a) * l1, y1 = y + Math.cos(a) * l1;
  const x2 = x1 + Math.sin(a + b) * l2, y2 = y1 + Math.cos(a + b) * l2;
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x1, y1); ctx.lineTo(x2, y2);
  ctx.strokeStyle = '#111'; ctx.lineWidth = 38 + O * 2; ctx.stroke();
  ctx.strokeStyle = col; ctx.lineWidth = 38; ctx.stroke();
  // hoof
  ctx.save(); ctx.translate(x2, y2); ctx.rotate(-(a + b));
  outlined(ctx, (k) => rrect(k, -26, -4, 52, 30, 7), HORSE.hoof, 6);
  ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.fillRect(-18, 2, 30, 5);
  ctx.restore();
  return [x2, y2];
}
export function drawTapLeg(ctx, p) {
  const t = p.tap || { a: 0, b: 0 };
  return horseLeg(ctx, HORSE_TAP_PIVOT[0], HORSE_TAP_PIVOT[1], t.a, t.b, HORSE.brown);
}

// ---------- Hans, three-quarter portrait (for close-ups) ----------
export function drawHansPortrait(ctx, p) {
  // origin = centre of skull; head ~ 600u tall
  const H = HORSE;
  ctx.save();
  ctx.rotate(-(p.head || 0) * 0.6);
  // neck/chest
  outlined(ctx, (k) => { k.moveTo(-170, 120); k.quadraticCurveTo(-240, 600, -380, 2200); k.lineTo(380, 2200); k.quadraticCurveTo(170, 600, 150, 120); k.closePath(); }, H.brown, 10);
  // mane (behind)
  outlined(ctx, (k) => { k.moveTo(-150, -60); k.quadraticCurveTo(-290, 400, -330, 2000); k.lineTo(-250, 2000); k.quadraticCurveTo(-210, 400, -100, 40); k.closePath(); }, H.dark, 9);
  // ears
  const ef = p.earFlick || 0;
  for (const [x, r] of [[-110, -0.35 - ef * 0.5], [80, 0.3]]) {
    ctx.save(); ctx.translate(x, -170); ctx.rotate(r);
    outlined(ctx, (k) => { k.moveTo(-40, 30); k.lineTo(0, -120); k.lineTo(40, 30); k.closePath(); }, H.brown, 9);
    ctx.fillStyle = '#6e3c22'; ctx.beginPath(); ctx.moveTo(-18, 18); ctx.lineTo(0, -80); ctx.lineTo(18, 18); ctx.fill();
    ctx.restore();
  }
  // one smooth head silhouette (no lumps between skull and muzzle)
  const hp = (k) => {
    k.moveTo(-150, -120);
    k.bezierCurveTo(-110, -205, 110, -210, 160, -112);
    k.bezierCurveTo(192, -40, 202, 120, 192, 262);
    k.bezierCurveTo(186, 402, 122, 462, 40, 456);
    k.bezierCurveTo(-58, 450, -92, 382, -96, 300);
    k.bezierCurveTo(-110, 182, -176, 100, -176, 0);
    k.bezierCurveTo(-176, -60, -168, -96, -150, -120);
    k.closePath();
  };
  outlined(ctx, hp, H.brown, 10);
  ctx.save(); ctx.beginPath(); hp(ctx); ctx.clip();
  ctx.fillStyle = H.muzzle; ctx.beginPath(); ctx.ellipse(62, 352, 128, 104, -0.2, 0, TAU); ctx.fill();
  ctx.fillStyle = '#f3e6d4'; ctx.beginPath(); ctx.moveTo(4, -150); ctx.quadraticCurveTo(64, 60, 56, 250); ctx.lineTo(22, 250); ctx.quadraticCurveTo(26, 40, -26, -150); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-160, 80); ctx.quadraticCurveTo(-120, 190, -60, 230); ctx.stroke();
  ctx.restore();
  // nostrils
  ctx.fillStyle = '#3a1a10';
  ctx.beginPath(); ctx.ellipse(10, 380, 18, 26, 0.4, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.ellipse(130, 350, 18, 26, -0.3, 0, TAU); ctx.fill();
  ctx.save(); ctx.translate(80, 430); ctx.scale(2.2, 2.2); drawMouth(ctx, p.mouth || 'smile', p.talk || 0); ctx.restore();
  // forelock
  outlined(ctx, (k) => {
    k.moveTo(-70, -178); k.bezierCurveTo(-30, -214, 52, -214, 86, -176);
    k.quadraticCurveTo(80, -130, 48, -104); k.quadraticCurveTo(36, -126, 18, -110);
    k.quadraticCurveTo(4, -132, -16, -112); k.quadraticCurveTo(-34, -136, -50, -122);
    k.quadraticCurveTo(-66, -146, -70, -178); k.closePath();
  }, H.dark, 6);
  ctx.strokeStyle = 'rgba(255,255,255,.18)'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-36, -186); ctx.quadraticCurveTo(10, -170, 30, -128); ctx.stroke();
  // eyes
  const bl = p.blink ?? 1;
  for (const [x, y, s] of [[-92, -10, 0.85], [96, -20, 1]]) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    if (bl < 0.25) { ctx.beginPath(); ctx.moveTo(-34, 0); ctx.quadraticCurveTo(0, 18, 34, 0); ctx.strokeStyle = '#111'; ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.stroke(); }
    else {
      ctx.beginPath(); ctx.ellipse(0, 0, 40, 44 * bl, 0, 0, TAU); ctx.fillStyle = '#fff'; ctx.fill(); ctx.lineWidth = 12; ctx.strokeStyle = '#111'; ctx.stroke();
      ctx.beginPath(); ctx.arc((p.pupil || 0) * 12, (p.pupilY || 0) * 10, 22 * Math.min(1, bl * 1.2), 0, TAU); ctx.fillStyle = '#111'; ctx.fill();
      ctx.beginPath(); ctx.arc((p.pupil || 0) * 12 + 8, -9, 7, 0, TAU); ctx.fillStyle = '#fff'; ctx.fill();
    }
    const b = p.brow || 0;
    ctx.translate(0, -70 - Math.max(0, b) * 22); ctx.rotate((x < 0 ? -1 : 1) * (b < 0 ? -0.4 * b : 0.25 * b) * -1);
    ctx.beginPath(); ctx.moveTo(-36, 0); ctx.lineTo(36, 0); ctx.strokeStyle = '#111'; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.stroke();
    ctx.restore();
  }
  if (p.sweat > 0) {
    ctx.save(); ctx.globalAlpha = Math.min(1, p.sweat); ctx.translate(200, -170 + (1 - p.sweat) * 40); ctx.scale(2.2, 2.2);
    outlined(ctx, (k) => { k.moveTo(0, -26); k.bezierCurveTo(14, -6, 16, 12, 0, 14); k.bezierCurveTo(-16, 12, -14, -6, 0, -26); }, '#8fd3ff', 4);
    ctx.restore();
  }
  ctx.restore();
}

// ---------- Hans's eye, extreme close-up, with a reflection ----------
export function drawHansEye(ctx, w, h, p, reflectFn) {
  // fills the screen with the eye; reflectFn(ctx) draws the reflected face inside
  ctx.save();
  ctx.fillStyle = HORSE.brown; ctx.fillRect(0, 0, w, h);
  // fur texture strokes
  ctx.strokeStyle = 'rgba(0,0,0,.08)'; ctx.lineWidth = 6;
  for (let i = 0; i < 90; i++) {
    const x = (i * 197) % w, y = (i * 331) % h;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 30, y + 50); ctx.stroke();
  }
  const cx = w / 2, cy = h * 0.48, R = w * 0.40;
  const bl = p.blink ?? 1;
  // lid outline
  ctx.beginPath(); ctx.ellipse(cx, cy, R * 1.12, R * 1.0 * bl + 4, 0, 0, TAU);
  ctx.fillStyle = '#111'; ctx.fill();
  ctx.beginPath(); ctx.ellipse(cx, cy, R, R * 0.9 * bl, 0, 0, TAU);
  ctx.save(); ctx.clip();
  const g = ctx.createRadialGradient(cx - R * 0.2, cy - R * 0.25, R * 0.1, cx, cy, R);
  g.addColorStop(0, '#3a2a22'); g.addColorStop(1, '#0c0807');
  ctx.fillStyle = g; ctx.fillRect(cx - R, cy - R, R * 2, R * 2);
  // reflection: a curved little window with the face
  ctx.save(); ctx.translate(cx + R * 0.1, cy - R * 0.05);
  ctx.beginPath(); ctx.ellipse(0, 0, R * 0.5, R * 0.55, 0, 0, TAU); ctx.clip();
  ctx.globalAlpha = 0.85;
  reflectFn && reflectFn(ctx, R);
  ctx.restore();
  // glossy highlight
  ctx.globalAlpha = 0.9; ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.ellipse(cx - R * 0.45, cy - R * 0.45, R * 0.13, R * 0.09, -0.6, 0, TAU); ctx.fill();
  ctx.globalAlpha = 0.25;
  ctx.beginPath(); ctx.ellipse(cx + R * 0.35, cy + R * 0.5, R * 0.3, R * 0.08, -0.4, 0, TAU); ctx.fill();
  ctx.restore();
  // lashes
  ctx.strokeStyle = '#111'; ctx.lineWidth = 16; ctx.lineCap = 'round';
  for (let i = 0; i < 7; i++) {
    const a = Math.PI * (1.12 + i * 0.12);
    const x = cx + Math.cos(a) * R * 1.08, y = cy + Math.sin(a) * R * 0.95 * bl;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * 70, y + Math.sin(a) * 70 - 20); ctx.stroke();
  }
  ctx.restore();
}

export { lerp, outlined, rrect, pill };

// ---------- one-frame easter egg: a wooden log character with a bat ----------
export function drawLogCameo(ctx) {
  // origin = bottom centre of the card (512 x 768 units)
  const wood = '#c8935a', dark = '#8a5a2e';
  // bat (behind the right arm)
  ctx.save(); ctx.translate(120, -330); ctx.rotate(0.35);
  outlined(ctx, (k) => { k.moveTo(-14, 0); k.lineTo(14, 0); k.lineTo(30, -300); k.quadraticCurveTo(0, -330, -30, -300); k.closePath(); }, '#a0662f', 7);
  ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, -20); ctx.lineTo(4, -290); ctx.stroke();
  ctx.restore();
  // log body: a tall rounded cylinder
  outlined(ctx, (k) => { k.moveTo(-120, 0); k.lineTo(-120, -560); k.quadraticCurveTo(0, -640, 120, -560); k.lineTo(120, 0); k.closePath(); }, wood, 8);
  // bark grain
  ctx.strokeStyle = dark; ctx.lineWidth = 5; ctx.lineCap = 'round';
  for (const [x, y0, y1] of [[-90, -520, -380], [-70, -300, -120], [80, -500, -330], [95, -260, -60], [-20, -200, -40]]) {
    ctx.beginPath(); ctx.moveTo(x, y0); ctx.bezierCurveTo(x + 12, (y0 * 2 + y1) / 3, x - 12, (y0 + y1 * 2) / 3, x, y1); ctx.stroke();
  }
  // top cut face with rings
  ctx.fillStyle = '#e8c48e'; ctx.beginPath(); ctx.ellipse(0, -572, 104, 34, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = dark; ctx.lineWidth = 3;
  for (const r of [80, 55, 30]) { ctx.beginPath(); ctx.ellipse(0, -572, r, r * 0.33, 0, 0, Math.PI * 2); ctx.stroke(); }
  // face: big round staring eyes, little brows, wide grin
  for (const s of [-1, 1]) {
    outlined(ctx, (k) => k.ellipse(s * 48, -430, 34, 40, 0, 0, Math.PI * 2), '#ffffff', 6);
    ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(s * 48 + 4, -424, 15, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(s * 48 + 9, -430, 5, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#111'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(s * 70, -492); ctx.lineTo(s * 26, -482); ctx.stroke();
  }
  ctx.fillStyle = '#3a1010'; ctx.strokeStyle = '#111'; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.moveTo(-50, -350); ctx.quadraticCurveTo(0, -300, 50, -350); ctx.closePath(); ctx.fill(); ctx.stroke();
  // stick arms: one holds the bat, one waves
  ctx.strokeStyle = '#111'; ctx.lineWidth = 10;
  ctx.beginPath(); ctx.moveTo(110, -260); ctx.lineTo(160, -300); ctx.lineTo(128, -335); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-110, -260); ctx.lineTo(-175, -330); ctx.lineTo(-170, -410); ctx.stroke();
  for (const [x, y] of [[128, -335], [-170, -410]]) { ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(x, y, 13, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y, 9, 0, Math.PI * 2); ctx.fill(); }
}
