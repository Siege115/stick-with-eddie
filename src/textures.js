// Canvas-painted textures for the Berlin courtyard set (no external images).
import * as THREE from '/node_modules/three/build/three.module.js';

function rnd(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
function canvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function tex(c, rep = [1, 1]) {
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...rep);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}

export function cobbles() {
  const c = canvas(1024, 1024), k = c.getContext('2d'), r = rnd(7);
  k.fillStyle = '#3e3328'; k.fillRect(0, 0, 1024, 1024);
  const rows = 16, h = 1024 / rows;
  for (let y = 0; y < rows; y++) {
    let x = (y % 2) * -30 - r() * 20;
    while (x < 1024) {
      const w = 48 + r() * 34;
      const v = 0.75 + r() * 0.35;
      const base = [150 * v, 132 * v, 112 * v].map(Math.round);
      k.fillStyle = `rgb(${base})`;
      k.beginPath(); k.roundRect(x + 4, y * h + 4, w - 8, h - 8, 14); k.fill();
      k.fillStyle = 'rgba(255,240,210,.18)'; k.beginPath(); k.roundRect(x + 8, y * h + 7, w - 18, (h - 8) * 0.45, 10); k.fill();
      k.fillStyle = 'rgba(0,0,0,.18)'; k.beginPath(); k.roundRect(x + 8, y * h + h * 0.62, w - 16, h * 0.28, 8); k.fill();
      // wrap horizontally
      if (x + w > 1024) { k.fillStyle = `rgb(${base})`; k.beginPath(); k.roundRect(x + 4 - 1024, y * h + 4, w - 8, h - 8, 14); k.fill(); }
      x += w;
    }
  }
  for (let i = 0; i < 2500; i++) { k.fillStyle = `rgba(0,0,0,${r() * 0.12})`; k.fillRect(r() * 1024, r() * 1024, 2, 2); }
  return tex(c, [7, 7]);
}

export function bricks(tint = [168, 84, 58]) {
  const c = canvas(1024, 1024), k = c.getContext('2d'), r = rnd(11);
  k.fillStyle = '#b9a58c'; k.fillRect(0, 0, 1024, 1024);
  const bh = 1024 / 24, bw = 1024 / 8;
  for (let y = 0; y < 24; y++) for (let x = -1; x < 9; x++) {
    const ox = (y % 2) * bw / 2; const v = 0.78 + r() * 0.3;
    k.fillStyle = `rgb(${tint.map((q) => Math.round(q * v))})`;
    k.fillRect(x * bw + ox + 3, y * bh + 3, bw - 6, bh - 6);
    k.fillStyle = 'rgba(255,255,255,.07)'; k.fillRect(x * bw + ox + 3, y * bh + 3, bw - 6, 5);
  }
  for (let i = 0; i < 40; i++) { // grime streaks
    const g = k.createLinearGradient(0, 0, 0, 1024); g.addColorStop(0, 'rgba(40,30,20,0)'); g.addColorStop(1, 'rgba(40,30,20,.25)');
    k.fillStyle = g; k.fillRect(r() * 1024, 0, 6 + r() * 30, 1024);
  }
  return tex(c);
}

export function plaster(col = '#d8c7a3') {
  const c = canvas(512, 512), k = c.getContext('2d'), r = rnd(3);
  k.fillStyle = col; k.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 300; i++) { k.fillStyle = `rgba(${r() > .5 ? '255,255,255' : '60,40,20'},${r() * 0.07})`; k.beginPath(); k.arc(r() * 512, r() * 512, 4 + r() * 30, 0, 7); k.fill(); }
  return tex(c);
}

export function wood(col = [120, 72, 40], planks = 6, vertical = true) {
  const c = canvas(512, 512), k = c.getContext('2d'), r = rnd(5);
  const pw = 512 / planks;
  for (let i = 0; i < planks; i++) {
    const v = 0.8 + r() * 0.35;
    k.fillStyle = `rgb(${col.map((q) => Math.round(q * v))})`;
    if (vertical) k.fillRect(i * pw, 0, pw, 512); else k.fillRect(0, i * pw, 512, pw);
    k.strokeStyle = 'rgba(0,0,0,.18)'; k.lineWidth = 2;
    for (let j = 0; j < 8; j++) {
      k.beginPath();
      if (vertical) { const x = i * pw + r() * pw; k.moveTo(x, 0); k.bezierCurveTo(x + 6, 170, x - 6, 340, x + 3, 512); }
      else { const y = i * pw + r() * pw; k.moveTo(0, y); k.bezierCurveTo(170, y + 6, 340, y - 6, 512, y + 3); }
      k.stroke();
    }
    k.fillStyle = 'rgba(0,0,0,.55)';
    if (vertical) k.fillRect(i * pw, 0, 4, 512); else k.fillRect(0, i * pw, 512, 4);
  }
  return tex(c);
}

export function hay() {
  const c = canvas(256, 256), k = c.getContext('2d'), r = rnd(9);
  k.fillStyle = '#d8b44a'; k.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 900; i++) { k.strokeStyle = `rgba(${r() > .5 ? '120,90,20' : '255,235,150'},.5)`; k.lineWidth = 1.5; const x = r() * 256, y = r() * 256; k.beginPath(); k.moveTo(x, y); k.lineTo(x + (r() - .5) * 30, y + (r() - .5) * 8); k.stroke(); }
  return tex(c);
}

export function radial(inner = 'rgba(0,0,0,.55)', outer = 'rgba(0,0,0,0)') {
  const c = canvas(128, 128), k = c.getContext('2d');
  const g = k.createRadialGradient(64, 64, 2, 64, 64, 64); g.addColorStop(0, inner); g.addColorStop(1, outer);
  k.fillStyle = g; k.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c); return t;
}

function agedPaper(k, w, h, seed, base = '#f3ead6') {
  const r = rnd(seed);
  k.fillStyle = base; k.fillRect(0, 0, w, h);
  for (let i = 0; i < 260; i++) { k.fillStyle = `rgba(140,100,40,${r() * 0.05})`; k.beginPath(); k.arc(r() * w, r() * h, 4 + r() * 40, 0, 7); k.fill(); }
  const g = k.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.3, w / 2, h / 2, Math.max(w, h) * 0.75);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(120,80,30,.28)'); k.fillStyle = g; k.fillRect(0, 0, w, h);
}

export function sign() {
  const w = 1024, h = 512; const c = canvas(w, h), k = c.getContext('2d');
  const r = rnd(5);
  // painted wooden board
  for (let i = 0; i < 4; i++) { k.fillStyle = ['#2f5a43', '#2b543f', '#31604a', '#2d5843'][i]; k.fillRect(0, i * h / 4, w, h / 4); }
  k.strokeStyle = 'rgba(0,0,0,.35)'; k.lineWidth = 3; for (let i = 1; i < 4; i++) { k.beginPath(); k.moveTo(0, i * h / 4); k.lineTo(w, i * h / 4); k.stroke(); }
  for (let i = 0; i < 80; i++) { k.fillStyle = `rgba(255,255,255,${r() * 0.04})`; k.fillRect(r() * w, r() * h, 40 + r() * 120, 2); }
  k.strokeStyle = '#e8c55a'; k.lineWidth = 12; k.strokeRect(22, 22, w - 44, h - 44);
  k.lineWidth = 3; k.strokeRect(40, 40, w - 80, h - 80);
  k.fillStyle = '#f6e7bf'; k.textAlign = 'center'; k.textBaseline = 'middle';
  k.font = 'bold 120px serif'; k.fillText('FREE', w / 2, 150);
  k.font = 'bold 92px serif'; k.fillText('ADMISSION', w / 2, 270);
  k.font = 'italic 46px serif'; k.fillStyle = '#e8c55a'; k.fillText('~ all welcome, no charge ~', w / 2, 385);
  for (const x of [80, w - 80]) { k.fillStyle = '#8a8a8a'; k.beginPath(); k.arc(x, 80, 12, 0, 7); k.fill(); }
  return tex(c);
}

export function verdictDoc() {
  const W = 700, H = 950; const c = canvas(W, H), k = c.getContext('2d'), r = rnd(77);
  agedPaper(k, W, H, 77, '#f6f0de');
  k.fillStyle = '#1d1d1d'; k.textAlign = 'center';
  k.font = 'bold 40px serif'; k.fillText('REPORT OF THE COMMISSION', W / 2, 80);
  k.font = 'italic 26px serif'; k.fillText('on the horse "Hans" of Herr Wilhelm von Osten', W / 2, 120);
  k.font = '22px serif'; k.fillText('Berlin, 12 September 1904', W / 2, 156);
  k.fillRect(70, 176, W - 140, 3);
  k.textAlign = 'left'; k.font = '19px serif';
  const body = ['The undersigned thirteen members of the commission', 'observed the horse on several days, in the presence', 'and in the absence of its owner. Questions were', 'put by members themselves. No signals, tricks or', 'intentional aids of any kind were detected.', '', 'The commission therefore finds that no trick', 'is involved in the performances of the horse,', 'and recommends further scientific study.'];
  body.forEach((ln, i) => k.fillText(ln, 80, 222 + i * 32));
  // 13 signatures
  k.font = 'bold 20px serif'; k.fillText('Signed:', 80, 540);
  k.strokeStyle = '#1e2f5a'; k.lineWidth = 2.2;
  for (let i = 0; i < 13; i++) {
    const x = 90 + (i % 3) * 185, y = 590 + Math.floor(i / 3) * 62;
    k.beginPath(); k.moveTo(x, y);
    for (let j = 1; j < 14; j++) k.lineTo(x + j * 10, y - 10 + r() * 20 - (j % 3 === 0 ? 10 : 0));
    k.stroke();
    k.strokeStyle = '#999'; k.lineWidth = 1; k.beginPath(); k.moveTo(x, y + 12); k.lineTo(x + 150, y + 12); k.stroke();
    k.strokeStyle = '#1e2f5a'; k.lineWidth = 2.2;
  }
  // wax seal
  k.fillStyle = '#8f1d22'; k.beginPath(); for (let i = 0; i < 18; i++) { const a = i / 18 * Math.PI * 2, rr = i % 2 ? 46 : 52; k.lineTo(W - 110 + Math.cos(a) * rr, 870 + Math.sin(a) * rr); } k.fill();
  k.fillStyle = '#b8323a'; k.beginPath(); k.arc(W - 110, 870, 32, 0, 7); k.fill();
  k.fillStyle = '#f0c0a0'; k.font = 'bold 30px serif'; k.textAlign = 'center'; k.fillText('B', W - 110, 881);
  return tex(c);
}

export function smallDoc(seed) {
  const W = 360, H = 480; const c = canvas(W, H), k = c.getContext('2d'), r = rnd(seed);
  agedPaper(k, W, H, seed, '#f4eedc');
  k.fillStyle = '#222'; k.fillRect(30, 40, 200, 12);
  for (let i = 0; i < 22; i++) { k.fillStyle = 'rgba(40,40,40,.75)'; k.fillRect(30, 80 + i * 16, (W - 60) * (0.6 + r() * 0.4), 4); }
  if (seed % 2) { k.strokeStyle = '#333'; k.lineWidth = 2; k.strokeRect(220, 360, 100, 80); k.beginPath(); k.moveTo(230, 430); k.lineTo(255, 380); k.lineTo(280, 410); k.lineTo(310, 370); k.stroke(); }
  return tex(c);
}

export function calendar() {
  const W = 640, H = 860; const c = canvas(W, H), k = c.getContext('2d');
  agedPaper(k, W, H, 41);
  // torn-off stubs of earlier pages + perforation
  k.fillStyle = '#e4d8bd'; k.fillRect(0, 0, W, 40);
  for (let x = 0; x < W; x += 14) { k.fillStyle = '#cdbf9e'; k.beginPath(); k.arc(x + 7, 40, 3, 0, 7); k.fill(); }
  // header band
  k.fillStyle = '#8f1d22'; k.fillRect(0, 48, W, 150);
  k.strokeStyle = '#e8c55a'; k.lineWidth = 4; k.strokeRect(14, 60, W - 28, 126);
  k.fillStyle = '#fff6e0'; k.textAlign = 'center';
  k.font = 'bold 72px serif'; k.fillText('SEPTEMBER', W / 2, 136);
  k.font = 'bold 34px serif'; k.fillText('— 1904 —', W / 2, 176);
  // day name ribbon
  k.fillStyle = '#1f3a5f'; k.fillRect(110, 214, W - 220, 62);
  k.beginPath(); k.moveTo(110, 214); k.lineTo(80, 245); k.lineTo(110, 276); k.fill();
  k.beginPath(); k.moveTo(W - 110, 214); k.lineTo(W - 80, 245); k.lineTo(W - 110, 276); k.fill();
  k.fillStyle = '#fff'; k.font = 'bold 46px serif'; k.fillText('MONDAY', W / 2, 262);
  // big date
  k.fillStyle = '#1b1b1b'; k.font = 'bold 250px serif'; k.fillText('12', W / 2, 500);
  k.strokeStyle = '#8f1d22'; k.lineWidth = 3; k.beginPath(); k.moveTo(90, 528); k.lineTo(W - 90, 528); k.stroke();
  k.font = 'italic 26px serif'; k.fillStyle = '#5a4630'; k.fillText('Sunrise 5:31   ·   Sunset 6:22', W / 2, 562);
  // month grid (1 September 1904 was a Thursday)
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S']; const gx = 70, gy = 600, cw = (W - 140) / 7, ch = 38;
  k.font = 'bold 24px serif';
  days.forEach((d, i) => { k.fillStyle = i === 0 ? '#8f1d22' : '#333'; k.fillText(d, gx + cw * i + cw / 2, gy); });
  k.font = '24px serif';
  for (let d = 1; d <= 30; d++) {
    const idx = d + 3; const col = idx % 7, row = Math.floor(idx / 7);
    const x = gx + cw * col + cw / 2, y = gy + 36 + row * ch;
    if (d === 12) { k.strokeStyle = '#c1121f'; k.lineWidth = 3; k.beginPath(); k.arc(x, y - 8, 17, 0, 7); k.stroke(); }
    k.fillStyle = col === 0 ? '#8f1d22' : '#333'; k.fillText(String(d), x, y);
  }
  // printer's line
  k.font = 'italic 18px serif'; k.fillStyle = '#7a6a50'; k.fillText('Druckerei Schmidt · Berlin', W / 2, H - 22);
  // curled bottom-right corner
  k.fillStyle = 'rgba(0,0,0,.18)'; k.beginPath(); k.moveTo(W, H - 70); k.lineTo(W - 70, H); k.lineTo(W, H); k.fill();
  k.fillStyle = '#e6dcc4'; k.beginPath(); k.moveTo(W, H - 70); k.quadraticCurveTo(W - 50, H - 50, W - 70, H); k.lineTo(W, H - 70); k.fill();
  return tex(c);
}

export function chalkboardCanvas() { return canvas(1024, 704); }
export function paintBoard(c, lines, reveal = 1) {
  const k = c.getContext('2d');
  k.fillStyle = '#20302a'; k.fillRect(0, 0, 1024, 704);
  // smudges
  const r = rnd(21);
  for (let i = 0; i < 60; i++) { k.fillStyle = `rgba(255,255,255,${0.015 + r() * 0.03})`; k.beginPath(); k.ellipse(r() * 1024, r() * 704, 40 + r() * 140, 14 + r() * 40, r() * 3, 0, 7); k.fill(); }
  k.fillStyle = '#f2f2ea'; k.textAlign = 'center'; k.textBaseline = 'middle';
  k.font = 'bold 170px "DejaVu Sans", sans-serif';
  const total = lines.join('').length; let shown = Math.floor(total * reveal);
  lines.forEach((ln, i) => {
    const part = ln.slice(0, Math.max(0, Math.min(ln.length, shown))); shown -= ln.length;
    const y = 704 * (i + 1) / (lines.length + 1);
    k.save(); k.globalAlpha = 0.92; k.fillText(part, 512 - (k.measureText(ln).width - k.measureText(part).width) / 2, y); k.restore();
  });
}

export function newspaper(drawHorse) {
  const W = 1350, H = 1800; const c = canvas(W, H), k = c.getContext('2d'), r = rnd(31);
  agedPaper(k, W, H, 31, '#efe6cf');
  // fold crease
  const g = k.createLinearGradient(0, H / 2 - 30, 0, H / 2 + 30); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(0.5, 'rgba(90,60,20,.18)'); g.addColorStop(1, 'rgba(0,0,0,0)');
  k.fillStyle = g; k.fillRect(0, H / 2 - 30, W, 60);
  k.fillStyle = '#1b1b1b'; k.textAlign = 'center';
  // nameplate (invented, no real logo)
  k.font = 'italic 30px serif'; k.fillText('“All the News of Two Continents”', W / 2, 62);
  k.font = 'bold 78px serif'; k.fillText('NEW YORK · SUNDAY EDITION', W / 2, 165);
  k.fillRect(50, 192, W - 100, 6); k.fillRect(50, 206, W - 100, 2);
  k.font = 'bold 26px serif'; k.textAlign = 'left'; k.fillText('VOL. LIII ... No. 17,034', 60, 240);
  k.textAlign = 'center'; k.fillText('NEW YORK, SUNDAY, SEPTEMBER 4, 1904', W / 2, 240);
  k.textAlign = 'right'; k.fillText('ONE CENT', W - 60, 240);
  k.fillRect(50, 256, W - 100, 2);
  // banner headline
  k.textAlign = 'center'; k.font = 'bold 140px serif';
  k.fillText('BERLIN HORSE', W / 2, 410); k.font = 'bold 118px serif'; k.fillText('DOES ARITHMETIC', W / 2, 555);
  k.font = 'italic 36px serif'; k.fillText('“Clever Hans” Adds, Subtracts and Tells the Date by Tapping His Hoof', W / 2, 635);
  k.fillRect(50, 664, W - 100, 3);
  // engraving-style picture box
  const px = 60, py = 690, pw = 700, ph = 520;
  k.fillStyle = '#ddd2b6'; k.fillRect(px, py, pw, ph);
  k.save(); k.beginPath(); k.rect(px, py, pw, ph); k.clip();
  k.fillStyle = '#c9bc9c'; k.fillRect(px, py + ph * 0.72, pw, ph * 0.28);
  for (let i = 0; i < 60; i++) { k.strokeStyle = 'rgba(60,40,20,.25)'; k.lineWidth = 1.5; k.beginPath(); k.moveTo(px + i * 14, py); k.lineTo(px + i * 14 - 120, py + ph); k.stroke(); }
  if (drawHorse) { k.save(); k.translate(px + 40, py + 70); k.scale(0.6, 0.6); k.filter = 'grayscale(1) sepia(0.6) contrast(1.2)'; drawHorse(k); k.restore(); }
  k.restore(); k.strokeStyle = '#1b1b1b'; k.lineWidth = 5; k.strokeRect(px, py, pw, ph);
  k.font = 'italic 24px serif'; k.fillStyle = '#1b1b1b'; k.fillText('Hans and his master in a Berlin courtyard.', px + pw / 2, py + ph + 36);
  // columns of text with sub-heads
  const col = (x, y, w, head, lines) => {
    k.textAlign = 'center'; k.font = 'bold 30px serif'; k.fillStyle = '#1b1b1b'; k.fillText(head, x + w / 2, y);
    k.fillRect(x + w * 0.3, y + 12, w * 0.4, 2);
    k.textAlign = 'left'; k.font = '21px serif';
    let yy = y + 46;
    for (const ln of lines) { k.fillText(ln, x, yy); yy += 27; }
    return yy;
  };
  col(800, 712, 490, 'CROWDS FILL THE YARD', ['BERLIN, Sept. 3. — A stallion named', 'Hans, owned by Herr Wilhelm von Osten,', 'a retired teacher of mathematics, is', 'the talk of the German capital. Asked', 'how much is three and two, the horse', 'strikes the ground five times with his', 'right fore-foot. He gives the date,', 'reads the clock and counts the hats', 'of his visitors. Herr von Osten asks', 'no money of the crowds who come.']);
  col(800, 1060, 490, 'PROFESSORS PUZZLED', ['Learned men have watched the horse', 'for hours and declare they can find', 'no signal passing from the master.', 'A commission is to be formed.']);
  // lower columns of fine print
  k.fillStyle = 'rgba(30,30,30,.82)';
  for (let cx = 0; cx < 3; cx++) for (let i = 0; i < 16; i++) k.fillRect(60 + cx * 420, 1290 + i * 22, 380 * (0.72 + r() * 0.28), 6);
  // small ads
  k.strokeStyle = '#1b1b1b'; k.lineWidth = 3; k.textAlign = 'center';
  [['PEARL SOAP', 'Pure as Snow · 5¢'], ['DR. KLEIN\'S TONIC', 'For Weary Nerves'], ['STEAMER TO HAMBURG', 'Sails Every Thursday']].forEach(([a, b], i) => {
    const x = 60 + i * 420; k.strokeRect(x, 1660, 380, 100); k.font = 'bold 30px serif'; k.fillText(a, x + 190, 1703); k.font = 'italic 22px serif'; k.fillText(b, x + 190, 1738);
  });
  return c;
}

export function poster(kind) {
  const W = 512, H = 720; const c = canvas(W, H), k = c.getContext('2d'); const r = rnd(kind.length * 7);
  const bg = { circus: '#e9c46a', coffee: '#f1e3c6', lost: '#f6f1e3', concert: '#c9d8c5' }[kind];
  agedPaper(k, W, H, kind.length * 13, bg);
  k.textAlign = 'center'; k.fillStyle = '#1b1b1b';
  if (kind === 'circus') {
    k.fillStyle = '#9b2226'; k.font = 'bold 84px serif'; k.fillText('GRAND', W / 2, 110); k.fillText('CIRCUS', W / 2, 200);
    k.fillStyle = '#1d3557'; k.beginPath(); k.moveTo(W / 2, 250); k.lineTo(W / 2 + 150, 470); k.lineTo(W / 2 - 150, 470); k.closePath(); k.fill();
    k.fillStyle = '#e63946'; for (let i = 0; i < 5; i++) { k.beginPath(); k.moveTo(W / 2, 250); k.lineTo(W / 2 - 150 + i * 60, 470); k.lineTo(W / 2 - 120 + i * 60, 470); k.closePath(); k.fill(); }
    k.fillStyle = '#1b1b1b'; k.font = 'bold 44px serif'; k.fillText('ACROBATS · CLOWNS', W / 2, 545); k.font = 'italic 38px serif'; k.fillText('Tonight at 8 o\'clock', W / 2, 610);
  } else if (kind === 'coffee') {
    k.font = 'bold 76px serif'; k.fillText('COFFEE', W / 2, 110); k.font = 'italic 40px serif'; k.fillText('fresh roasted daily', W / 2, 165);
    k.fillStyle = '#5a3a22'; k.beginPath(); k.ellipse(W / 2, 360, 130, 150, 0, 0, 7); k.fill(); k.strokeStyle = '#f1e3c6'; k.lineWidth = 12; k.beginPath(); k.moveTo(W / 2, 220); k.quadraticCurveTo(W / 2 - 50, 360, W / 2, 500); k.stroke();
    k.fillStyle = '#9b2226'; k.font = 'bold 60px serif'; k.fillText('10 Pfennig', W / 2, 600); k.fillStyle = '#1b1b1b'; k.font = '30px serif'; k.fillText('Café Lindner · Hof 3', W / 2, 660);
  } else if (kind === 'lost') {
    k.font = 'bold 80px serif'; k.fillText('LOST', W / 2, 110); k.font = 'bold 54px serif'; k.fillText('small brown dog', W / 2, 180);
    k.fillStyle = '#7a5230'; k.beginPath(); k.ellipse(W / 2, 360, 120, 70, 0, 0, 7); k.fill(); k.beginPath(); k.arc(W / 2 + 110, 300, 50, 0, 7); k.fill();
    for (const x of [-70, -30, 40, 80]) k.fillRect(W / 2 + x, 410, 18, 70);
    k.fillStyle = '#1b1b1b'; k.font = 'italic 40px serif'; k.fillText('answers to "Fritz"', W / 2, 560); k.font = 'bold 44px serif'; k.fillText('REWARD', W / 2, 630);
  } else {
    k.font = 'bold 66px serif'; k.fillText('BRASS BAND', W / 2, 110); k.font = 'italic 40px serif'; k.fillText('in the park on Sunday', W / 2, 165);
    k.strokeStyle = '#b8860b'; k.lineWidth = 22; k.beginPath(); k.arc(W / 2, 380, 120, 0.3, 5.5); k.stroke(); k.fillStyle = '#b8860b'; k.beginPath(); k.moveTo(W / 2 + 110, 330); k.lineTo(W / 2 + 200, 270); k.lineTo(W / 2 + 200, 420); k.closePath(); k.fill();
    k.fillStyle = '#1b1b1b'; k.font = 'bold 44px serif'; k.fillText('Free for all', W / 2, 600);
  }
  // torn corner + paste marks
  k.fillStyle = 'rgba(0,0,0,0)'; k.globalCompositeOperation = 'destination-out';
  k.beginPath(); k.moveTo(W, H - 90); k.lineTo(W - 40, H - 40); k.lineTo(W - 90, H); k.lineTo(W, H); k.fill();
  k.globalCompositeOperation = 'source-over';
  return tex(c);
}

export function ivy() {
  const W = 512, H = 768; const c = canvas(W, H), k = c.getContext('2d'); const r = rnd(99);
  for (let s = 0; s < 6; s++) {
    let x = 200 + r() * 120, y = H;
    k.strokeStyle = '#3b2a16'; k.lineWidth = 5;
    for (let i = 0; i < 40; i++) {
      const nx = x + (r() - 0.5) * 60, ny = y - 14 - r() * 18;
      k.beginPath(); k.moveTo(x, y); k.lineTo(nx, ny); k.stroke(); x = nx; y = ny;
      for (let j = 0; j < 2; j++) {
        const lx = x + (r() - 0.5) * 50, ly = y + (r() - 0.5) * 30, sz = 12 + r() * 14;
        k.fillStyle = ['#2f6b2f', '#3d8a3a', '#25562a', '#4f9a45'][Math.floor(r() * 4)];
        k.beginPath(); k.moveTo(lx, ly - sz); k.lineTo(lx + sz, ly); k.lineTo(lx + sz * 0.3, ly + sz * 0.4); k.lineTo(lx, ly + sz); k.lineTo(lx - sz * 0.3, ly + sz * 0.4); k.lineTo(lx - sz, ly); k.closePath(); k.fill();
        k.strokeStyle = 'rgba(0,0,0,.4)'; k.lineWidth = 2; k.stroke(); k.strokeStyle = '#3b2a16'; k.lineWidth = 5;
      }
    }
  }
  const t = tex(c); return t;
}

export function sign2(text, bg, fg) {
  const c = canvas(512, 145), k = c.getContext('2d');
  k.fillStyle = bg; k.fillRect(0, 0, 512, 145); k.strokeStyle = fg; k.lineWidth = 6; k.strokeRect(10, 10, 492, 125);
  k.fillStyle = fg; k.font = 'bold 84px serif'; k.textAlign = 'center'; k.textBaseline = 'middle'; k.fillText(text, 256, 78);
  return tex(c);
}
