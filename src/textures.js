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

// S02 handbills (Boston 1806 / 1833): plain letterpress, a woodcut-style picture, no dates or prices
function woodcutShip(k, cx, cy, s, masts = 2) {
  k.save(); k.translate(cx, cy); k.scale(s, s); k.fillStyle = '#1b1b1b'; k.strokeStyle = '#1b1b1b'; k.lineCap = 'round';
  k.beginPath(); k.moveTo(-150, 20); k.lineTo(150, 15); k.quadraticCurveTo(140, 55, 115, 60); k.lineTo(-120, 60); k.quadraticCurveTo(-145, 50, -150, 20); k.fill();
  k.lineWidth = 4; k.beginPath(); k.moveTo(145, 18); k.lineTo(190, -15); k.stroke();
  const xs = masts === 3 ? [-80, 10, 95] : [-55, 65];
  for (const x of xs) { k.lineWidth = 5; k.beginPath(); k.moveTo(x, 18); k.lineTo(x, -150); k.stroke(); for (const [y, w] of [[-130, 30], [-85, 45], [-35, 60]]) { k.lineWidth = 2; k.beginPath(); k.moveTo(x - w, y + 30); k.quadraticCurveTo(x, y + 44, x + w, y + 30); k.lineTo(x + w * 0.9, y); k.lineTo(x - w * 0.9, y); k.closePath(); k.stroke(); for (let h = 4; h < 30; h += 7) { k.beginPath(); k.moveTo(x - w * 0.8, y + h); k.lineTo(x + w * 0.8, y + h); k.stroke(); } } }
  k.lineWidth = 2; for (let y = 75; y < 110; y += 9) { k.beginPath(); for (let x = -190; x < 190; x += 20) { k.moveTo(x, y); k.quadraticCurveTo(x + 5, y - 5, x + 10, y); } k.stroke(); }
  k.restore();
}
const POSTERS_1806 = {
  cod: (k, W) => {
    k.font = 'bold 86px serif'; k.fillText('FRESH COD', W / 2, 120); k.font = 'bold 74px serif'; k.fillText('DAILY', W / 2, 205);
    k.save(); k.translate(W / 2, 360); k.fillStyle = '#1b1b1b'; k.beginPath(); k.ellipse(0, 0, 150, 52, 0, 0, 7); k.fill(); k.beginPath(); k.moveTo(140, 0); k.lineTo(210, -55); k.lineTo(200, 55); k.closePath(); k.fill();
    k.fillStyle = '#efe7d2'; k.beginPath(); k.arc(-105, -12, 9, 0, 7); k.fill(); k.strokeStyle = '#efe7d2'; k.lineWidth = 3; for (let x = -60; x < 120; x += 22) { k.beginPath(); k.arc(x, 0, 20, -0.9, 0.9); k.stroke(); } k.restore();
    k.font = 'italic 40px serif'; k.fillText('at the end of the wharf', W / 2, 520); k.font = 'bold 46px serif'; k.fillText('ASK FOR THE FISHMONGER', W / 2, 610);
  },
  passage: (k, W) => {
    k.font = 'bold 74px serif'; k.fillText('PASSAGE', W / 2, 105); k.font = 'bold 50px serif'; k.fillText('TO NEW YORK', W / 2, 170);
    woodcutShip(k, W / 2, 330, 1.05);
    k.font = 'italic 40px serif'; k.fillText('a fast sailing packet', W / 2, 515); k.font = 'bold 50px serif'; k.fillText('ENQUIRE WITHIN', W / 2, 615);
  },
  auction: (k, W) => {
    k.fillStyle = '#7a1414'; k.font = 'bold 92px serif'; k.fillText('AUCTION', W / 2, 125); k.fillStyle = '#1b1b1b'; k.font = 'bold 78px serif'; k.fillText('TODAY', W / 2, 215);
    k.fillRect(70, 245, W - 140, 6);
    k.font = 'bold 44px serif'; ['SAILCLOTH · ROPE', 'BARRELS · CASKS', 'ONE SHIP\'S BELL'].forEach((ln, i) => k.fillText(ln, W / 2, 330 + i * 70));
    k.fillRect(70, 520, W - 140, 6); k.font = 'italic 42px serif'; k.fillText('at the Coffee House', W / 2, 600);
  },
  calcutta: (k, W) => {
    k.font = 'bold 60px serif'; k.fillText('BOUND FOR', W / 2, 100); k.fillStyle = '#7a1414'; k.font = 'bold 84px serif'; k.fillText('CALCUTTA', W / 2, 185); k.fillStyle = '#1b1b1b';
    woodcutShip(k, W / 2, 350, 1.05, 3);
    k.font = 'italic 40px serif'; k.fillText('the fine ship now loading', W / 2, 530); k.font = 'bold 48px serif'; k.fillText('ENQUIRE ON BOARD', W / 2, 620);
  },
  teas: (k, W) => {
    k.font = 'bold 86px serif'; k.fillText('FINE TEAS', W / 2, 120); k.font = 'italic 44px serif'; k.fillText('just landed', W / 2, 180);
    k.save(); k.translate(W / 2, 360); k.fillStyle = '#1b1b1b'; k.fillRect(-110, -110, 220, 200); k.fillStyle = '#e8dcc0'; k.fillRect(-92, -92, 184, 164); k.fillStyle = '#1b1b1b'; k.font = 'bold 54px serif'; k.fillText('TEA', 0, -10); k.font = 'bold 30px serif'; k.fillText('CHEST', 0, 40); k.restore();
    k.font = 'bold 46px serif'; k.fillText('GREEN · BLACK', W / 2, 540); k.font = 'italic 40px serif'; k.fillText('sold by the pound', W / 2, 610);
  },
};
export function poster(kind) {
  const W = 512, H = 720; const c = canvas(W, H), k = c.getContext('2d'); const r = rnd(kind.length * 7);
  const bg = { circus: '#e9c46a', coffee: '#f1e3c6', lost: '#f6f1e3', concert: '#c9d8c5', cod: '#efe7d2', passage: '#f2ead4', auction: '#e9dcbc', calcutta: '#f1e6cc', teas: '#e8dcc0' }[kind];
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
  } else if (POSTERS_1806[kind]) {
    POSTERS_1806[kind](k, W, H);
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

// =====================================================================
// S02 textures: signs that fit their board, water, hull planks, sails, rigging, snow, ice, night sky, gull
// =====================================================================

// painted sign that always fits: lines = 'TEXT' or ['BIG', 'small line'].
// o: { w, h (px), bg, fg, border (colour or null), font, grain (wood grain on bg), shadow (carved look) }
export function signText(lines, o = {}) {
  lines = [].concat(lines);
  const Wd = o.w ?? 1024, Ht = o.h ?? 256; const c = canvas(Wd, Ht), k = c.getContext('2d'); const r = rnd(lines.join('').length * 31 + 7);
  k.fillStyle = o.bg ?? '#2c3e2f'; k.fillRect(0, 0, Wd, Ht);
  if (o.grain !== false) { k.strokeStyle = 'rgba(0,0,0,.16)'; k.lineWidth = 2; for (let i = 0; i < 18; i++) { const y = r() * Ht; k.beginPath(); k.moveTo(0, y); k.bezierCurveTo(Wd * 0.3, y + 5, Wd * 0.6, y - 5, Wd, y + 2); k.stroke(); } }
  const fg = o.fg ?? '#f1e2b8', pad = Ht * 0.09;
  if (o.border !== null) { k.strokeStyle = o.border ?? fg; k.lineWidth = Math.max(4, Ht * 0.035); k.strokeRect(pad * 0.6, pad * 0.6, Wd - pad * 1.2, Ht - pad * 1.2); }
  const fam = o.font ?? 'serif'; const sizes = lines.length === 1 ? [0.56] : [0.46, 0.24];
  const total = sizes.reduce((a, b) => a + b, 0) + (lines.length - 1) * 0.06; let y = Ht / 2 - (total * Ht) / 2;
  k.textAlign = 'center'; k.textBaseline = 'middle';
  lines.forEach((ln, i) => {
    let px = Ht * sizes[i]; const weight = i === 0 ? 'bold ' : 'italic ';
    k.font = `${weight}${px}px ${fam}`; while (k.measureText(ln).width > Wd - pad * 3.2 && px > 8) { px *= 0.94; k.font = `${weight}${px}px ${fam}`; }
    const cy = y + (Ht * sizes[i]) / 2;
    if (o.shadow !== false) { k.fillStyle = 'rgba(0,0,0,.45)'; k.fillText(ln, Wd / 2 + px * 0.04, cy + px * 0.05); }
    k.fillStyle = fg; k.fillText(ln, Wd / 2, cy);
    y += Ht * (sizes[i] + 0.06);
  });
  const t = tex(c); t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping; return t;
}

// stern board: ship name big, home port below, carved gold scrolls at the ends
export function sternBoard(name, port = 'BOSTON') {
  const Wd = 1024, Ht = 300; const c = canvas(Wd, Ht), k = c.getContext('2d');
  const g = k.createLinearGradient(0, 0, 0, Ht); g.addColorStop(0, '#1f3328'); g.addColorStop(1, '#13221a'); k.fillStyle = g; k.fillRect(0, 0, Wd, Ht);
  k.strokeStyle = '#d9a53a'; k.lineWidth = 10; k.strokeRect(14, 14, Wd - 28, Ht - 28); k.lineWidth = 3; k.strokeRect(30, 30, Wd - 60, Ht - 60);
  for (const sx of [1, -1]) { // scrolls
    k.save(); k.translate(sx > 0 ? 95 : Wd - 95, Ht / 2); k.scale(sx, 1); k.strokeStyle = '#e0b04a'; k.lineWidth = 9; k.lineCap = 'round';
    k.beginPath(); k.arc(0, 0, 34, 0.3, Math.PI * 1.9); k.stroke(); k.beginPath(); k.arc(-6, -4, 16, Math.PI, Math.PI * 2.6); k.stroke();
    k.beginPath(); k.moveTo(30, 18); k.quadraticCurveTo(60, 40, 40, 70); k.stroke(); k.beginPath(); k.moveTo(30, -18); k.quadraticCurveTo(60, -40, 40, -70); k.stroke(); k.restore();
  }
  k.textAlign = 'center'; k.textBaseline = 'middle';
  let px = 150; k.font = `bold ${px}px serif`; while (k.measureText(name).width > Wd - 300) { px *= 0.95; k.font = `bold ${px}px serif`; }
  k.fillStyle = 'rgba(0,0,0,.6)'; k.fillText(name, Wd / 2 + 5, 118 + 6); k.fillStyle = '#f3c75a'; k.fillText(name, Wd / 2, 118);
  k.font = 'bold 64px serif'; k.fillStyle = 'rgba(0,0,0,.6)'; k.fillText(port, Wd / 2 + 3, 232 + 4); k.fillStyle = '#efe2bd'; k.fillText(port, Wd / 2, 232);
  const t = tex(c); t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping; return t;
}

// hull side: black strakes with seams, butt joints and nails; an ochre band near the top (v = 1 is the rail top)
export function hull(o = {}) {
  const Wd = 1024, Ht = 512; const c = canvas(Wd, Ht), k = c.getContext('2d'); const r = rnd(41);
  const base = o.base ?? [30, 30, 34], band = o.band ?? '#c8962e', bandTop = o.bandTop ?? 0.06, bandBot = o.bandBot ?? 0.2;
  const rows = 20, h = Ht / rows;
  for (let y = 0; y < rows; y++) {
    const v = 0.85 + r() * 0.3; k.fillStyle = `rgb(${base.map((q) => Math.round(q * v))})`; k.fillRect(0, y * h, Wd, h);
    k.fillStyle = 'rgba(255,255,255,.06)'; k.fillRect(0, y * h + 2, Wd, 3);
    k.fillStyle = 'rgba(0,0,0,.6)'; k.fillRect(0, y * h, Wd, 2);
    let x = -r() * 300; while (x < Wd) { x += 260 + r() * 200; k.fillRect(x, y * h, 3, h); for (const yy of [0.3, 0.7]) { k.fillStyle = 'rgba(140,140,150,.5)'; k.fillRect(x - 9, y * h + h * yy, 3, 3); k.fillRect(x + 7, y * h + h * yy, 3, 3); k.fillStyle = 'rgba(0,0,0,.6)'; } }
  }
  // ochre band (planks still show through) with thin black mouldings
  k.fillStyle = band; k.globalAlpha = 0.92; k.fillRect(0, Ht * bandTop, Wd, Ht * (bandBot - bandTop)); k.globalAlpha = 1;
  k.fillStyle = 'rgba(0,0,0,.35)'; for (let y = Ht * bandTop; y < Ht * bandBot; y += h) k.fillRect(0, y, Wd, 2);
  k.fillStyle = '#111'; k.fillRect(0, Ht * bandTop - 6, Wd, 6); k.fillRect(0, Ht * bandBot, Wd, 6);
  k.fillStyle = '#5a3a20'; k.fillRect(0, 0, Wd, Ht * bandTop - 6); // cap rail edge
  return tex(c);
}

// sailcloth: off-white canvas with vertical panel seams, reef points band near the top
export function sailcloth(tint = '#efe6cf') {
  const c = canvas(512, 512), k = c.getContext('2d'); const r = rnd(17);
  k.fillStyle = tint; k.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 300; i++) { k.fillStyle = `rgba(120,100,60,${r() * 0.05})`; k.beginPath(); k.arc(r() * 512, r() * 512, 6 + r() * 30, 0, 7); k.fill(); }
  k.strokeStyle = 'rgba(110,90,60,.45)'; k.lineWidth = 3; for (let x = 0; x <= 512; x += 64) { k.beginPath(); k.moveTo(x, 0); k.lineTo(x, 512); k.stroke(); }
  k.fillStyle = 'rgba(90,70,40,.6)'; for (let x = 20; x < 512; x += 40) k.fillRect(x, 70, 4, 18);
  k.strokeStyle = 'rgba(90,70,40,.7)'; k.lineWidth = 8; k.strokeRect(0, 0, 512, 512);
  return tex(c);
}

// shroud ladder: `n` shrouds (vertical) with ratlines (horizontal) on a transparent card
export function ratlines(n = 5, rungs = 16) {
  const c = canvas(256, 1024), k = c.getContext('2d');
  k.strokeStyle = '#1b1610'; k.lineCap = 'round';
  k.lineWidth = 9; for (let i = 0; i < n; i++) { const x = 8 + i * (240 / (n - 1)); k.beginPath(); k.moveTo(x, 0); k.lineTo(x, 1024); k.stroke(); }
  k.lineWidth = 5; for (let j = 0; j < rungs; j++) { const y = 30 + j * (1000 / rungs); k.beginPath(); k.moveTo(8, y); k.lineTo(248, y + 4); k.stroke(); }
  const t = tex(c); t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping; return t;
}

// water: painted wave stripes. kind: 'harbour' | 'sea' | 'river' | 'tropic'. layer 'top' = transparent highlights only
export const WATER = { harbour: ['#3f5f5c', '#5f817b', '#2b4644'], sea: ['#1d4f7a', '#3f78a6', '#123656'], river: ['#5d5a3a', '#7d7a52', '#45412a'], tropic: ['#1fa3a8', '#56cfc8', '#127a86'] };
export function water(kind = 'harbour', layer = 'base') {
  const [b, l, d] = WATER[kind] || WATER.harbour; const c = canvas(512, 512), k = c.getContext('2d'); const r = rnd(layer === 'base' ? 61 : 67);
  if (layer === 'base') { k.fillStyle = b; k.fillRect(0, 0, 512, 512); }
  const strokes = layer === 'base' ? 140 : 70;
  for (let i = 0; i < strokes; i++) {
    const x = r() * 512, y = r() * 512, w = 30 + r() * 90, a = layer === 'base' ? 0.7 : 0.55;
    k.strokeStyle = layer === 'base' ? (r() > 0.45 ? l : d) : 'rgba(255,255,255,1)'; k.globalAlpha = a * (0.5 + r() * 0.5); k.lineWidth = layer === 'base' ? 4 + r() * 4 : 2 + r() * 2; k.lineCap = 'round';
    for (const dx of [0, -512, 512]) for (const dy of [0, -512, 512]) { k.beginPath(); k.moveTo(x + dx, y + dy); k.bezierCurveTo(x + dx + w * 0.3, y + dy - 6, x + dx + w * 0.6, y + dy + 6, x + dx + w, y + dy); k.stroke(); }
  }
  k.globalAlpha = 1; return tex(c);
}
// foam: broken white ring texture (u around, v across) on transparent
export function foam(seed = 3) {
  const c = canvas(1024, 64), k = c.getContext('2d'); const r = rnd(seed);
  for (let i = 0; i < 420; i++) { const x = r() * 1024, y = 8 + r() * 48, s = 3 + r() * 9; k.fillStyle = `rgba(255,255,255,${0.5 + r() * 0.5})`; k.beginPath(); k.ellipse(x, y, s * 1.8, s * 0.7, 0, 0, 7); k.fill(); }
  const t = tex(c); return t;
}

// snow: white with blue speckle and a few sparkles
export function snow(rep = [4, 4]) {
  const c = canvas(512, 512), k = c.getContext('2d'); const r = rnd(23);
  k.fillStyle = '#f3f6fb'; k.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 260; i++) { k.fillStyle = `rgba(150,170,205,${r() * 0.18})`; k.beginPath(); k.arc(r() * 512, r() * 512, 3 + r() * 24, 0, 7); k.fill(); }
  for (let i = 0; i < 120; i++) { k.fillStyle = '#ffffff'; k.fillRect(r() * 512, r() * 512, 2, 2); }
  return tex(c, rep);
}
// grey slush / wet patch decal (transparent edges)
export function slush() {
  const c = canvas(256, 256), k = c.getContext('2d'); const r = rnd(29);
  for (let i = 0; i < 40; i++) { const x = 60 + r() * 136, y = 60 + r() * 136, s = 20 + r() * 50; const g = k.createRadialGradient(x, y, 1, x, y, s); g.addColorStop(0, 'rgba(95,95,100,.55)'); g.addColorStop(1, 'rgba(95,95,100,0)'); k.fillStyle = g; k.fillRect(0, 0, 256, 256); }
  for (let i = 0; i < 25; i++) { k.fillStyle = 'rgba(235,240,248,.7)'; k.beginPath(); k.arc(70 + r() * 116, 70 + r() * 116, 2 + r() * 6, 0, 7); k.fill(); }
  const t = tex(c); t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping; return t;
}
// ice block face: blue-white, inner cracks and bubbles, bright edge
export function ice(seed = 5) {
  const c = canvas(512, 512), k = c.getContext('2d'); const r = rnd(seed * 13 + 1);
  const g = k.createLinearGradient(0, 0, 512, 512); g.addColorStop(0, '#d9f1ff'); g.addColorStop(0.5, '#a9d8f2'); g.addColorStop(1, '#86c0e6'); k.fillStyle = g; k.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 30; i++) { k.fillStyle = `rgba(255,255,255,${0.08 + r() * 0.14})`; k.beginPath(); k.arc(r() * 512, r() * 512, 20 + r() * 70, 0, 7); k.fill(); }
  k.strokeStyle = 'rgba(255,255,255,.75)'; k.lineWidth = 2.5;
  for (let i = 0; i < 9; i++) { let x = r() * 512, y = r() * 512; k.beginPath(); k.moveTo(x, y); for (let j = 0; j < 5; j++) { x += (r() - 0.5) * 120; y += (r() - 0.5) * 120; k.lineTo(x, y); } k.stroke(); }
  for (let i = 0; i < 70; i++) { const x = r() * 512, y = r() * 512, s = 2 + r() * 6; k.strokeStyle = 'rgba(255,255,255,.8)'; k.lineWidth = 1.5; k.beginPath(); k.arc(x, y, s, 0, 7); k.stroke(); }
  k.strokeStyle = 'rgba(255,255,255,.95)'; k.lineWidth = 16; k.strokeRect(0, 0, 512, 512);
  return tex(c);
}
// pond ice sheet: grey-blue with scribed grid lines (where the cutters marked blocks) and drifts of snow dust
export function iceSheet(grid = 8) {
  const c = canvas(1024, 1024), k = c.getContext('2d'); const r = rnd(83);
  k.fillStyle = '#9fc4dc'; k.fillRect(0, 0, 1024, 1024);
  for (let i = 0; i < 90; i++) { const x = r() * 1024, y = r() * 1024, s = 40 + r() * 160; const g = k.createRadialGradient(x, y, 1, x, y, s); g.addColorStop(0, `rgba(240,246,252,${0.25 + r() * 0.35})`); g.addColorStop(1, 'rgba(240,246,252,0)'); k.fillStyle = g; k.fillRect(0, 0, 1024, 1024); }
  for (let i = 0; i < 25; i++) { k.strokeStyle = 'rgba(255,255,255,.5)'; k.lineWidth = 1.5; let x = r() * 1024, y = r() * 1024; k.beginPath(); k.moveTo(x, y); for (let j = 0; j < 4; j++) { x += (r() - 0.5) * 200; y += (r() - 0.5) * 200; k.lineTo(x, y); } k.stroke(); }
  // scribed marks: faint, hand-cut (slightly wavy, broken), not a tile grid
  k.lineWidth = 2;
  for (let i = 0; i <= grid; i++) for (const vert of [0, 1]) { const p = i * 1024 / grid; let q = 0; while (q < 1024) { const seg = 60 + r() * 140, gap = r() < 0.25 ? 20 + r() * 40 : 0; k.strokeStyle = `rgba(50,80,110,${0.18 + r() * 0.17})`; k.beginPath(); const j = (r() - 0.5) * 4; if (vert) { k.moveTo(p + j, q); k.lineTo(p - j, q + seg); } else { k.moveTo(q, p + j); k.lineTo(q + seg, p - j); } k.stroke(); q += seg + gap; } }
  k.strokeStyle = 'rgba(255,255,255,.18)'; k.lineWidth = 1.2;
  for (let i = 0; i <= grid; i++) { const p = i * 1024 / grid + 3; k.beginPath(); k.moveTo(p, 0); k.lineTo(p, 1024); k.stroke(); k.beginPath(); k.moveTo(0, p); k.lineTo(1024, p); k.stroke(); }
  return tex(c);
}
// night sky for a dome: navy gradient (v = 0 bottom … 1 top), stars, a faint band of haze at the horizon
export function nightSky() {
  const c = canvas(2048, 1024), k = c.getContext('2d'); const r = rnd(97);
  const g = k.createLinearGradient(0, 0, 0, 1024); g.addColorStop(0, '#050b1e'); g.addColorStop(0.45, '#0b1a3c'); g.addColorStop(0.5, '#1a2c55'); g.addColorStop(1, '#1a2c55'); k.fillStyle = g; k.fillRect(0, 0, 2048, 1024);
  for (let i = 0; i < 900; i++) { const y = r() * 470, s = r() < 0.06 ? 2.6 : 1.2 + r(); k.fillStyle = `rgba(255,255,${220 + Math.round(r() * 35)},${0.4 + r() * 0.6})`; k.beginPath(); k.arc(r() * 2048, y, s, 0, 7); k.fill(); }
  const t = tex(c); t.wrapT = THREE.ClampToEdgeWrapping; return t;
}
// moon disc with craters and a soft glow
export function moon() {
  const c = canvas(256, 256), k = c.getContext('2d');
  const g = k.createRadialGradient(128, 128, 40, 128, 128, 128); g.addColorStop(0, 'rgba(220,230,255,.55)'); g.addColorStop(1, 'rgba(220,230,255,0)'); k.fillStyle = g; k.fillRect(0, 0, 256, 256);
  k.fillStyle = '#f4f1e4'; k.beginPath(); k.arc(128, 128, 44, 0, 7); k.fill();
  k.fillStyle = 'rgba(180,175,160,.6)'; for (const [x, y, s] of [[112, 116, 10], [142, 136, 7], [126, 150, 5], [146, 110, 5]]) { k.beginPath(); k.arc(x, y, s, 0, 7); k.fill(); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
// clapboard siding (horizontal painted boards)
export function clapboard(col = [200, 190, 165]) {
  const c = canvas(512, 512), k = c.getContext('2d'); const r = rnd(43);
  for (let y = 0; y < 512; y += 32) { const v = 0.9 + r() * 0.15; k.fillStyle = `rgb(${col.map((q) => Math.round(q * v))})`; k.fillRect(0, y, 512, 32); k.fillStyle = 'rgba(0,0,0,.28)'; k.fillRect(0, y + 28, 512, 4); k.fillStyle = 'rgba(255,255,255,.12)'; k.fillRect(0, y, 512, 4); }
  for (let i = 0; i < 160; i++) { k.fillStyle = `rgba(60,40,20,${r() * 0.07})`; k.beginPath(); k.arc(r() * 512, r() * 512, 4 + r() * 24, 0, 7); k.fill(); }
  return tex(c);
}
// wooden shingle roof
export function shingles(col = [92, 70, 58]) {
  const c = canvas(512, 512), k = c.getContext('2d'); const r = rnd(47);
  k.fillStyle = `rgb(${col.map((q) => Math.round(q * 0.6))})`; k.fillRect(0, 0, 512, 512);
  for (let y = 0; y < 16; y++) { let x = (y % 2) * -16 - r() * 10; while (x < 512) { const w = 24 + r() * 18, v = 0.8 + r() * 0.35; k.fillStyle = `rgb(${col.map((q) => Math.round(q * v))})`; k.fillRect(x + 1, y * 32 + 1, w - 2, 30); k.fillStyle = 'rgba(0,0,0,.3)'; k.fillRect(x + 1, y * 32 + 26, w - 2, 5); x += w; } }
  return tex(c);
}
// stone quay blocks
export function stoneBlocks(col = [128, 124, 116]) {
  const c = canvas(512, 512), k = c.getContext('2d'); const r = rnd(53);
  k.fillStyle = '#4a4740'; k.fillRect(0, 0, 512, 512);
  for (let y = 0; y < 8; y++) { let x = (y % 2) * -40 - r() * 20; while (x < 512) { const w = 70 + r() * 50, v = 0.8 + r() * 0.3; k.fillStyle = `rgb(${col.map((q) => Math.round(q * v))})`; k.fillRect(x + 3, y * 64 + 3, w - 6, 58); k.fillStyle = 'rgba(255,255,255,.08)'; k.fillRect(x + 3, y * 64 + 3, w - 6, 6); x += w; } }
  return tex(c);
}
// cut-out gull (side view): wings 'up' | 'down' | 'sit'. White body, grey wings, ink outline, yellow beak.
export function gull(pose = 'up') { // herring gull side view: white head and body, grey back and wings, black tips with white spots, yellow bill with a red spot, pink legs
  const c = canvas(512, 256), k = c.getContext('2d'); k.lineJoin = 'round'; k.lineCap = 'round';
  const INK2 = '#151515', GREY = '#aeb6c2', GREY2 = '#c8ced8';
  const wing = (up, far) => {
    k.save(); if (far) { k.translate(18, -6); k.globalAlpha = 0.9; }
    const tipY = up ? 22 : 222, midY = up ? 70 : 182;
    k.beginPath(); k.moveTo(250, 132); k.quadraticCurveTo(220, midY, 150, midY + (up ? 4 : -4)); k.quadraticCurveTo(110, tipY + (up ? 10 : -10), 70, tipY); k.quadraticCurveTo(150, up ? 92 : 168, 296, 140); k.closePath();
    k.fillStyle = far ? GREY : GREY2; k.fill(); k.lineWidth = 7; k.strokeStyle = INK2; k.stroke();
    k.save(); k.clip(); k.fillStyle = '#1e1e1e'; k.beginPath(); k.moveTo(60, tipY); k.lineTo(150, midY - 6); k.lineTo(150, up ? 140 : 120); k.lineTo(40, up ? 120 : 140); k.closePath(); k.fill();
    k.fillStyle = '#fff'; for (const [x, y] of [[96, up ? 50 : 196], [124, up ? 62 : 186]]) { k.beginPath(); k.arc(x, y, 5, 0, 7); k.fill(); }
    k.strokeStyle = 'rgba(80,90,100,.5)'; k.lineWidth = 2.5; for (let i = 0; i < 5; i++) { k.beginPath(); k.moveTo(170 + i * 22, up ? 104 + i * 5 : 152 - i * 5); k.lineTo(150 + i * 18, up ? 78 + i * 6 : 178 - i * 6); k.stroke(); }
    k.restore(); k.restore();
  };
  if (pose !== 'sit') wing(pose === 'up', true);
  // tail
  k.beginPath(); k.moveTo(200, 140); k.lineTo(150, 128); k.lineTo(156, 156); k.closePath(); k.fillStyle = '#f2f2f2'; k.fill(); k.lineWidth = 6; k.strokeStyle = INK2; k.stroke();
  // body (one smooth shape: body + neck + head)
  k.beginPath(); k.moveTo(190, 146); k.quadraticCurveTo(220, 104, 300, 112); k.quadraticCurveTo(350, 108, 372, 96); k.quadraticCurveTo(390, 70, 418, 76); k.quadraticCurveTo(446, 84, 440, 112); k.quadraticCurveTo(430, 132, 396, 136); k.quadraticCurveTo(352, 168, 280, 168); k.quadraticCurveTo(214, 170, 190, 146); k.closePath();
  k.fillStyle = '#ffffff'; k.fill(); k.lineWidth = 7; k.strokeStyle = INK2; k.stroke();
  k.fillStyle = GREY; k.beginPath(); k.moveTo(206, 136); k.quadraticCurveTo(240, 112, 306, 118); k.quadraticCurveTo(290, 136, 220, 146); k.closePath(); k.fill(); // grey back
  // bill with the red spot, eye with a yellow ring
  k.beginPath(); k.moveTo(436, 96); k.lineTo(478, 102); k.quadraticCurveTo(470, 112, 440, 110); k.closePath(); k.fillStyle = '#f2c230'; k.fill(); k.lineWidth = 4; k.stroke();
  k.fillStyle = '#d63a2a'; k.beginPath(); k.arc(468, 108, 3.5, 0, 7); k.fill();
  k.fillStyle = '#f2c230'; k.beginPath(); k.arc(418, 92, 7, 0, 7); k.fill(); k.fillStyle = INK2; k.beginPath(); k.arc(419, 92, 4, 0, 7); k.fill(); k.fillStyle = '#fff'; k.beginPath(); k.arc(420.5, 90.5, 1.4, 0, 7); k.fill();
  if (pose === 'sit') { k.beginPath(); k.moveTo(214, 140); k.quadraticCurveTo(260, 112, 330, 126); k.quadraticCurveTo(300, 150, 230, 154); k.closePath(); k.fillStyle = GREY; k.fill(); k.lineWidth = 5; k.stroke(); k.fillStyle = '#1e1e1e'; k.beginPath(); k.moveTo(214, 140); k.lineTo(180, 150); k.lineTo(222, 152); k.closePath(); k.fill();
    k.strokeStyle = '#e39a8a'; k.lineWidth = 6; for (const x of [276, 300]) { k.beginPath(); k.moveTo(x, 166); k.lineTo(x - 4, 206); k.lineTo(x + 10, 208); k.stroke(); } }
  else wing(pose === 'up', false);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
// flat ship silhouette for the far harbour (masts, yards, furled sails), on transparent
export function shipSilhouette(masts = 2, seed = 1, col = '#3b4048') {
  const c = canvas(512, 512), k = c.getContext('2d'); const r = rnd(seed * 7 + 3);
  k.fillStyle = col; k.strokeStyle = col; k.lineCap = 'round';
  k.beginPath(); k.moveTo(40, 430); k.lineTo(470, 420); k.quadraticCurveTo(455, 470, 420, 480); k.lineTo(90, 480); k.quadraticCurveTo(55, 470, 40, 430); k.fill();
  k.lineWidth = 6; k.beginPath(); k.moveTo(460, 425); k.lineTo(510, 380); k.stroke(); // bowsprit
  const xs = masts === 3 ? [130, 270, 390] : [180, 360];
  xs.forEach((x, i) => {
    const top = 60 + r() * 30 + (masts === 3 && i === 0 ? 50 : 0);
    k.lineWidth = 7; k.beginPath(); k.moveTo(x, 430); k.lineTo(x, top); k.stroke();
    for (const [y, w] of [[top + 40, 50], [top + 130, 80], [top + 230, 105]]) { k.lineWidth = 5; k.beginPath(); k.moveTo(x - w, y); k.lineTo(x + w, y); k.stroke(); k.lineWidth = 12; k.beginPath(); k.moveTo(x - w * 0.85, y + 6); k.lineTo(x + w * 0.85, y + 6); k.stroke(); }
    k.lineWidth = 2; k.beginPath(); k.moveTo(x, top); k.lineTo(x - 110, 428); k.moveTo(x, top); k.lineTo(x + 110, 426); k.stroke();
  });
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

// =====================================================================
// S02 textures, part 2: tropical ports, packing materials, interiors, backdrops
// =====================================================================
export function sawdust(rep = [2, 2], coarse = false) {
  const c = canvas(512, 512), k = c.getContext('2d'); const r = rnd(71);
  k.fillStyle = coarse ? '#e2b25a' : '#c8a26a'; k.fillRect(0, 0, 512, 512);
  if (coarse) { for (let i = 0; i < 1400; i++) { const v = r(); k.fillStyle = v < 0.4 ? '#b07a30' : v < 0.8 ? '#ffe0a0' : '#8a5a22'; k.beginPath(); k.ellipse(r() * 512, r() * 512, 3 + r() * 5, 1.5 + r() * 2, r() * 3.1, 0, 7); k.fill(); } }
  for (let i = 0; i < 9000; i++) { const v = r(); k.fillStyle = v < 0.4 ? 'rgba(150,110,60,.7)' : v < 0.8 ? 'rgba(230,200,150,.7)' : 'rgba(110,80,45,.6)'; k.fillRect(r() * 512, r() * 512, 1 + r() * 3, 1 + r() * 2); }
  return tex(c, rep);
}
export function riceHusks(rep = [2, 2]) {
  const c = canvas(512, 512), k = c.getContext('2d'); const r = rnd(73);
  k.fillStyle = '#b98a3e'; k.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 2600; i++) { const x = r() * 512, y = r() * 512, a = r() * 3.14; k.fillStyle = r() < 0.5 ? '#e0b860' : r() < 0.5 ? '#8a6428' : '#f0d27a'; k.beginPath(); k.ellipse(x, y, 5, 2, a, 0, 7); k.fill(); }
  return tex(c, rep);
}
export function straw(rep = [1, 1]) {
  const c = canvas(256, 256), k = c.getContext('2d'), r = rnd(19);
  k.fillStyle = '#ecd48a'; k.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 700; i++) { k.strokeStyle = `rgba(${r() > .5 ? '170,140,60' : '255,245,190'},.7)`; k.lineWidth = 2.2; const x = r() * 256, y = r() * 256; k.beginPath(); k.moveTo(x, y); k.lineTo(x + (r() - .5) * 8, y + 20 + r() * 30); k.stroke(); }
  return tex(c, rep);
}
// terracotta roof tiles (rows of half-round tiles)
export function terracotta(rep = [2, 2]) {
  const c = canvas(512, 512), k = c.getContext('2d'); const r = rnd(79);
  k.fillStyle = '#7a3420'; k.fillRect(0, 0, 512, 512);
  for (let y = 0; y < 512; y += 40) for (let x = (y / 40 % 2) * 16; x < 540; x += 32) { const v = 0.85 + r() * 0.3; const g = k.createLinearGradient(x, 0, x + 30, 0); g.addColorStop(0, `rgb(${[150, 64, 38].map((q) => q * v | 0)})`); g.addColorStop(0.5, `rgb(${[205, 100, 62].map((q) => Math.min(255, q * v) | 0)})`); g.addColorStop(1, `rgb(${[140, 58, 34].map((q) => q * v | 0)})`); k.fillStyle = g; k.beginPath(); k.roundRect(x, y, 30, 38, 12); k.fill(); k.fillStyle = 'rgba(0,0,0,.25)'; k.fillRect(x, y + 34, 30, 4); }
  return tex(c, rep);
}
// canvas awning: stripes (colours) with a scalloped edge band at the bottom; plain when one colour
export function awning(cols = ['#c0392b', '#f4efe2'], stripe = 64) {
  const c = canvas(512, 512), k = c.getContext('2d'); const r = rnd(cols.length * 13);
  for (let x = 0; x < 512; x += stripe) { k.fillStyle = cols[(x / stripe) % cols.length]; k.fillRect(x, 0, stripe, 512); }
  for (let i = 0; i < 160; i++) { k.fillStyle = `rgba(0,0,0,${r() * 0.05})`; k.beginPath(); k.arc(r() * 512, r() * 512, 10 + r() * 30, 0, 7); k.fill(); }
  k.fillStyle = 'rgba(0,0,0,.18)'; k.fillRect(0, 470, 512, 6);
  const t = tex(c); return t;
}
// palm frond on transparent (v along the frond, leaflets both sides)
export function palmLeaf(col = '#2f7a35') {
  const c = canvas(256, 1024), k = c.getContext('2d'); const r = rnd(83);
  k.strokeStyle = '#5a4a20'; k.lineWidth = 8; k.beginPath(); k.moveTo(128, 1024); k.lineTo(128, 20); k.stroke();
  for (let y = 980; y > 40; y -= 22) { const L = 110 * Math.sin((1024 - y) / 1024 * Math.PI) ** 0.6 + 10; for (const s of [-1, 1]) { k.fillStyle = r() < 0.5 ? col : '#3f9445'; k.beginPath(); k.moveTo(128, y); k.quadraticCurveTo(128 + s * L * 0.6, y - 20, 128 + s * L, y - 50 - r() * 10); k.quadraticCurveTo(128 + s * L * 0.5, y - 8, 128, y - 8); k.fill(); k.strokeStyle = 'rgba(20,40,20,.8)'; k.lineWidth = 2.5; k.stroke(); } }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
// painted backdrop card (transparent sky): kind 'pelee' (Martinique: volcano with cloud cap, green hills, church tower)
// or 'calcutta' (low neoclassical skyline, church spire, the Ochterlony column, haze)
export function backdrop(kind) {
  const Wd = 2048, Ht = 640; const c = canvas(Wd, Ht), k = c.getContext('2d'); const r = rnd(kind.length * 31);
  const ridge = (y0, amp, col, f) => { k.fillStyle = col; k.beginPath(); k.moveTo(0, Ht); for (let x = 0; x <= Wd; x += 16) k.lineTo(x, y0 + f(x) * amp); k.lineTo(Wd, Ht); k.closePath(); k.fill(); };
  if (kind === 'pelee') {
    // the volcano: broad cone with a cloud cap, then two ranges of green hills
    k.fillStyle = '#5f8a6a'; k.beginPath(); k.moveTo(300, Ht); k.quadraticCurveTo(820, 260, 980, 120); k.lineTo(1120, 118); k.quadraticCurveTo(1300, 250, 1800, Ht); k.closePath(); k.fill();
    k.strokeStyle = 'rgba(40,70,50,.5)'; k.lineWidth = 4; for (let i = 0; i < 9; i++) { k.beginPath(); k.moveTo(1000 + i * 15, 140); k.quadraticCurveTo(900 + i * 60, 380, 700 + i * 110, Ht); k.stroke(); }
    k.fillStyle = 'rgba(255,255,255,.95)'; for (const [x, y, s] of [[1000, 112, 70], [1070, 96, 80], [1140, 116, 62], [940, 124, 50], [1200, 128, 44]]) { k.beginPath(); k.ellipse(x, y, s * 1.4, s * 0.55, 0, 0, 7); k.fill(); }
    ridge(420, 40, '#4f8a4a', (x) => Math.sin(x / 140) * 0.8 + Math.sin(x / 61) * 0.3);
    ridge(500, 25, '#3f7a3c', (x) => Math.sin(x / 90 + 1) * 0.7 + Math.sin(x / 37) * 0.2);
    // church with a tower among the hills
    k.fillStyle = '#efe7d6'; k.fillRect(1380, 470, 120, 80); k.fillRect(1470, 400, 44, 150); k.fillStyle = '#9a4a30'; k.beginPath(); k.moveTo(1464, 400); k.lineTo(1492, 360); k.lineTo(1520, 400); k.fill(); k.beginPath(); k.moveTo(1374, 470); k.lineTo(1440, 440); k.lineTo(1506, 470); k.fill();
  } else {
    // haze sky band, then a low neoclassical skyline (flat roofs, balustrades, porticoes), a spire and a tall column
    ridge(520, 0, 'rgba(0,0,0,0)', () => 0);
    let x = 0; while (x < Wd) { const w = 90 + r() * 160, h = 70 + r() * 110; const y = Ht - 40 - h; k.fillStyle = r() < 0.5 ? '#e8d6a8' : '#efe4c8'; k.fillRect(x, y, w, h + 40); k.fillStyle = 'rgba(120,100,70,.35)'; for (let j = x + 12; j < x + w - 10; j += 22) k.fillRect(j, y + 22, 8, h - 30); k.fillStyle = '#d9c590'; k.fillRect(x - 4, y - 10, w + 8, 10); for (let j = x; j < x + w; j += 10) k.fillRect(j, y - 22, 4, 12); k.fillRect(x - 4, y - 24, w + 8, 4); x += w + 6; }
    // portico with a pediment
    k.fillStyle = '#f2ead2'; k.fillRect(560, 400, 260, 200); k.fillStyle = '#d9c590'; k.beginPath(); k.moveTo(548, 400); k.lineTo(690, 340); k.lineTo(832, 400); k.fill(); k.fillStyle = 'rgba(120,100,70,.4)'; for (let j = 578; j < 810; j += 34) k.fillRect(j, 410, 12, 190);
    // church spire
    k.fillStyle = '#efe4c8'; k.fillRect(1180, 330, 70, 270); k.beginPath(); k.moveTo(1176, 330); k.lineTo(1215, 170); k.lineTo(1254, 330); k.fill();
    // the Ochterlony Monument (1828): column on a plinth with a small cupola
    k.fillStyle = '#f0e6cc'; k.fillRect(1560, 520, 90, 80); k.fillRect(1585, 210, 40, 310); k.fillRect(1575, 196, 60, 16); k.fillRect(1590, 150, 30, 46); k.beginPath(); k.arc(1605, 150, 18, Math.PI, 0); k.fill();
    // trees between the buildings
    for (let i = 0; i < 16; i++) { const tx = r() * Wd; k.fillStyle = r() < 0.5 ? '#6f8a4a' : '#5a7a3e'; k.beginPath(); k.ellipse(tx, Ht - 60, 50 + r() * 40, 40 + r() * 20, 0, 0, 7); k.fill(); }
    const g = k.createLinearGradient(0, 0, 0, Ht); g.addColorStop(0, 'rgba(233,201,138,0)'); g.addColorStop(1, 'rgba(233,201,138,.45)'); k.fillStyle = g; k.fillRect(0, 0, Wd, Ht);
  }
  if (kind === 'pelee') { // soften: blur the painting a little and lay a pale aerial haze over the far shapes
    const c2 = canvas(Wd, Ht), k2 = c2.getContext('2d'); k2.filter = 'blur(6px)'; k2.drawImage(c, 0, 0); k2.filter = 'none';
    const hz = k2.createLinearGradient(0, 0, 0, Ht); hz.addColorStop(0, 'rgba(206,232,246,.28)'); hz.addColorStop(0.6, 'rgba(206,232,246,.38)'); hz.addColorStop(1, 'rgba(206,232,246,.5)');
    k2.globalCompositeOperation = 'source-atop'; k2.fillStyle = hz; k2.fillRect(0, 0, Wd, Ht); k2.globalCompositeOperation = 'source-over';
    const t2 = new THREE.CanvasTexture(c2); t2.colorSpace = THREE.SRGBColorSpace; return t2;
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
// sunny garden seen through the kitchen window (opaque): sky, hedge, fruit trees, flowers, a fence
export function garden() {
  const c = canvas(1024, 768), k = c.getContext('2d'); const r = rnd(89);
  const g = k.createLinearGradient(0, 0, 0, 768); g.addColorStop(0, '#9fd3f2'); g.addColorStop(0.55, '#d8efff'); g.addColorStop(0.56, '#7fb35a'); g.addColorStop(1, '#5f9a44'); k.fillStyle = g; k.fillRect(0, 0, 1024, 768);
  for (let i = 0; i < 4; i++) { const x = 120 + i * 260; k.fillStyle = '#6b4a2a'; k.fillRect(x - 10, 300, 20, 160); k.fillStyle = i % 2 ? '#4f8f3c' : '#5aa045'; k.beginPath(); k.ellipse(x, 270, 110, 90, 0, 0, 7); k.fill(); for (let j = 0; j < 8; j++) { k.fillStyle = '#d9473a'; k.beginPath(); k.arc(x - 80 + r() * 160, 220 + r() * 100, 9, 0, 7); k.fill(); } }
  k.fillStyle = '#efe6d0'; for (let x = 0; x < 1024; x += 40) k.fillRect(x, 470, 16, 120); k.fillRect(0, 500, 1024, 12); k.fillRect(0, 560, 1024, 12);
  for (let i = 0; i < 120; i++) { k.fillStyle = ['#f4d35e', '#ee6c4d', '#ffffff', '#c77dff'][i % 4]; k.beginPath(); k.arc(r() * 1024, 620 + r() * 140, 5 + r() * 5, 0, 7); k.fill(); }
  return tex(c);
}
// window view for the ice-house workshop: 'snow' | 'leaves' (summer)
export function season(kind) {
  const c = canvas(512, 512), k = c.getContext('2d'); const r = rnd(kind === 'snow' ? 91 : 93);
  if (kind === 'snow') { const g = k.createLinearGradient(0, 0, 0, 512); g.addColorStop(0, '#c9d6e4'); g.addColorStop(0.6, '#e8eef6'); g.addColorStop(0.61, '#f6f9fc'); g.addColorStop(1, '#ffffff'); k.fillStyle = g; k.fillRect(0, 0, 512, 512); for (let i = 0; i < 5; i++) { const x = 40 + i * 110; k.fillStyle = '#3a2a20'; k.fillRect(x - 6, 140, 12, 180); k.strokeStyle = '#3a2a20'; k.lineWidth = 4; for (let j = 0; j < 4; j++) { k.beginPath(); k.moveTo(x, 200 + j * 25); k.lineTo(x + (j % 2 ? 40 : -40), 160 + j * 25); k.stroke(); } } for (let i = 0; i < 200; i++) { k.fillStyle = '#fff'; k.beginPath(); k.arc(r() * 512, r() * 512, 2 + r() * 2, 0, 7); k.fill(); } }
  else { const g = k.createLinearGradient(0, 0, 0, 512); g.addColorStop(0, '#8fd0f5'); g.addColorStop(0.6, '#c9ecff'); g.addColorStop(0.61, '#79b552'); g.addColorStop(1, '#5d9a3e'); k.fillStyle = g; k.fillRect(0, 0, 512, 512); for (let i = 0; i < 5; i++) { const x = 40 + i * 110; k.fillStyle = '#5a3e26'; k.fillRect(x - 6, 160, 12, 160); k.fillStyle = i % 2 ? '#3f8a3a' : '#4fa045'; k.beginPath(); k.ellipse(x, 150, 60, 70, 0, 0, 7); k.fill(); } }
  return tex(c);
}
// log end: rings, bark edge
export function logEnd() {
  const c = canvas(256, 256), k = c.getContext('2d'); const r = rnd(97);
  k.fillStyle = '#4a3420'; k.beginPath(); k.arc(128, 128, 128, 0, 7); k.fill();
  k.fillStyle = '#d9b47a'; k.beginPath(); k.arc(128, 128, 112, 0, 7); k.fill();
  k.strokeStyle = 'rgba(140,96,50,.7)'; for (let rr = 8; rr < 110; rr += 7 + r() * 5) { k.lineWidth = 1.5 + r() * 2; k.beginPath(); k.arc(128 + (r() - .5) * 3, 128 + (r() - .5) * 3, rr, 0, 7); k.stroke(); }
  k.strokeStyle = 'rgba(90,60,30,.6)'; k.lineWidth = 2; for (let i = 0; i < 3; i++) { const a = r() * 6.3; k.beginPath(); k.moveTo(128, 128); k.lineTo(128 + Math.cos(a) * 100, 128 + Math.sin(a) * 100); k.stroke(); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
// bark (vertical streaks)
export function bark(col = [92, 70, 50]) {
  const c = canvas(256, 512), k = c.getContext('2d'); const r = rnd(101);
  k.fillStyle = `rgb(${col})`; k.fillRect(0, 0, 256, 512);
  for (let i = 0; i < 90; i++) { k.strokeStyle = `rgba(${r() > .5 ? '30,20,10' : '160,130,100'},${0.3 + r() * 0.4})`; k.lineWidth = 2 + r() * 4; const x = r() * 256; k.beginPath(); k.moveTo(x, 0); k.bezierCurveTo(x + 10, 170, x - 10, 340, x + 5, 512); k.stroke(); }
  return tex(c);
}
// slate board with chalk lettering (bins: "1 · HAY" …); the number is drawn green (numbers are green)
export function slate(num, word) { // one clean line: green number, a dot, the word in white chalk (e.g. "1 · HAY")
  const Wd = 900, Ht = 300; const c = canvas(Wd, Ht), k = c.getContext('2d');
  k.fillStyle = '#6b4a2a'; k.fillRect(0, 0, Wd, Ht); k.fillStyle = '#263034'; k.fillRect(22, 22, Wd - 44, Ht - 44);
  k.strokeStyle = 'rgba(255,255,255,.08)'; k.lineWidth = 30; k.beginPath(); k.moveTo(60, 230); k.quadraticCurveTo(300, 200, 520, 250); k.stroke(); // old chalk smudge
  const A = String(num), B = ' · ' + word; let px = 150; const font = (q) => `bold ${q}px "DejaVu Sans", sans-serif`;
  k.font = font(px); while (k.measureText(A + B).width > Wd - 120) { px *= 0.95; k.font = font(px); }
  const wA = k.measureText(A).width, wAll = k.measureText(A + B).width; const x0 = (Wd - wAll) / 2, y = Ht / 2 + px * 0.36;
  k.lineJoin = 'round'; k.lineWidth = px * 0.08; k.strokeStyle = '#111';
  k.strokeText(A, x0, y); k.fillStyle = '#7ef08a'; k.fillText(A, x0, y);
  k.strokeText(B, x0 + wA, y); k.fillStyle = '#f4f4ec'; k.fillText(B, x0 + wA, y);
  const t = tex(c); t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping; return t;
}
// dashed white outline of a modern fridge (graphic joke, transparent)
export function fridgeOutline() {
  const c = canvas(512, 1024), k = c.getContext('2d');
  k.setLineDash([38, 22]); k.lineCap = 'round'; k.strokeStyle = '#ffffff'; k.lineWidth = 16; k.shadowColor = 'rgba(0,0,0,.45)'; k.shadowBlur = 8;
  k.beginPath(); k.roundRect(40, 30, 432, 964, 40); k.stroke(); k.beginPath(); k.moveTo(40, 380); k.lineTo(472, 380); k.stroke();
  k.setLineDash([]); k.lineWidth = 18; k.beginPath(); k.moveTo(410, 180); k.lineTo(410, 300); k.moveTo(410, 460); k.lineTo(410, 640); k.stroke();
  // the words, so the joke reads even for small kids: NO FRIDGE YET! (big, outlined, a little tilted)
  k.save(); k.translate(256, 650); k.rotate(-0.08); k.textAlign = 'center'; k.textBaseline = 'middle'; k.lineJoin = 'round'; k.shadowBlur = 0;
  for (const [txt, y, px] of [['NO', -120, 120], ['FRIDGE', 0, 112], ['YET!', 120, 120]]) { k.font = `bold ${px}px "DejaVu Sans", sans-serif`; k.lineWidth = 22; k.strokeStyle = '#1b1b1b'; k.strokeText(txt, 0, y); k.fillStyle = '#ffe066'; k.fillText(txt, 0, y); }
  k.restore();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
export { woodcutShip, agedPaper };
