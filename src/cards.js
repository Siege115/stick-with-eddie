// S02 HUD cards (art brief 1.9): year tag, woodcut newspaper, wordless letter, route map, thermometer.
// Each painter draws into a 2D context at the card's native size (CARDS[name].size) and takes an optional state:
//   map: { route: 0..1 } how far the dotted route (and the ship icon) has run · thermo: { level: 0..1 } red column height
// Rules: numbers green; no tonnage, no prices, no dates beyond the year; only "slippery speculation" is readable in the
// newspaper body; the letter has no words; the thermometer has no numbers; the map goes round Africa (no Suez).
import { woodcutShip, agedPaper } from './textures.js';
import { LAND } from './data/land-110m.js';

const INK = '#1b1b1b';
function rnd(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
// grey squiggle "text" lines that read as print without being words
function squiggles(k, x, y, w, h, lineH, seed, col = 'rgba(40,40,40,.55)') {
  const r = rnd(seed); k.strokeStyle = col; k.lineCap = 'round';
  for (let yy = y; yy < y + h; yy += lineH) {
    let xx = x + (r() < 0.15 ? lineH : 0); const end = x + w * (r() < 0.12 ? 0.4 + r() * 0.4 : 1);
    while (xx < end) { const ww = 10 + r() * 46; k.lineWidth = lineH * 0.34; k.beginPath(); k.moveTo(xx, yy); for (let q = 0; q <= ww; q += 6) k.lineTo(xx + q, yy + Math.sin(q * 0.9 + xx) * lineH * 0.08); k.stroke(); xx += ww + 9; }
  }
}

// ---------------- year card: aged paper tag pinned at the top, the year big and green ----------------
function year(k, s = {}) {
  const W = 640, H = 380; const text = s.text || '1806';
  k.save(); agedPaper(k, W, H, 61, '#f2e6c8');
  k.strokeStyle = '#7a5a30'; k.lineWidth = 6; k.strokeRect(18, 18, W - 36, H - 36);
  k.fillStyle = '#c0392b'; k.beginPath(); k.arc(W / 2, 46, 16, 0, 7); k.fill(); k.strokeStyle = INK; k.lineWidth = 4; k.stroke(); // pin
  k.font = 'bold 230px "DejaVu Serif", serif'; k.textAlign = 'center'; k.textBaseline = 'middle'; k.lineJoin = 'round';
  k.lineWidth = 22; k.strokeStyle = INK; k.strokeText(text, W / 2, H / 2 + 28); k.fillStyle = '#6dff7a'; k.fillText(text, W / 2, H / 2 + 28);
  k.restore();
}

// ---------------- newspaper: generic masthead, woodcut ship, squiggle columns, one readable phrase ----------------
function news(k) {
  const W = 1350, H = 1800; agedPaper(k, W, H, 23, '#efe6cf');
  k.fillStyle = INK; k.textAlign = 'center'; k.textBaseline = 'alphabetic';
  k.font = 'bold 150px "DejaVu Serif", serif'; k.fillText('BOSTON NEWS', W / 2, 190);
  k.fillRect(60, 220, W - 120, 8); k.fillRect(60, 236, W - 120, 3);
  k.font = 'italic 46px "DejaVu Serif", serif'; k.fillText('1806', W / 2, 296); k.fillRect(60, 320, W - 120, 3);
  // three columns; the middle one carries the woodcut ship and the readable line
  const cx = [60, 470, 900], cw = 390;
  squiggles(k, cx[0], 380, cw, 1340, 30, 3);
  squiggles(k, cx[2], 380, cw, 1340, 30, 5);
  k.strokeStyle = INK; k.lineWidth = 3; for (const x of [450, 880]) { k.beginPath(); k.moveTo(x, 360); k.lineTo(x, 1730); k.stroke(); }
  squiggles(k, cx[1], 380, cw, 110, 30, 7);
  k.lineWidth = 4; k.strokeRect(cx[1] + 5, 520, cw - 10, 420); woodcutShip(k, cx[1] + cw / 2, 790, 1.0);
  squiggles(k, cx[1], 980, cw, 150, 30, 9);
  k.fillStyle = '#7a1414'; k.font = 'bold 50px "DejaVu Serif", serif'; k.fillText('slippery', cx[1] + cw / 2, 1205); k.fillText('speculation', cx[1] + cw / 2, 1265);
  squiggles(k, cx[1], 1320, cw, 400, 30, 11);
}

// ---------------- letter: folded sheet, a drawn puddle and a sad melted ice cube, no words ----------------
function letter(k) {
  const W = 1100, H = 1400; agedPaper(k, W, H, 41, '#f6eedb');
  k.strokeStyle = 'rgba(120,90,50,.35)'; k.lineWidth = 6; for (const y of [H / 3, 2 * H / 3]) { k.beginPath(); k.moveTo(0, y); k.lineTo(W, y); k.stroke(); } // fold creases
  k.lineJoin = 'round'; k.lineCap = 'round';
  // puddle
  k.fillStyle = '#9fd0ee'; k.strokeStyle = '#1f3a56'; k.lineWidth = 12;
  k.beginPath(); k.moveTo(170, 930); k.bezierCurveTo(200, 810, 420, 840, 560, 800); k.bezierCurveTo(760, 750, 960, 820, 930, 930); k.bezierCurveTo(910, 1050, 640, 1060, 520, 1040); k.bezierCurveTo(330, 1080, 140, 1050, 170, 930); k.closePath(); k.fill(); k.stroke();
  k.strokeStyle = 'rgba(255,255,255,.8)'; k.lineWidth = 8; k.beginPath(); k.arc(380, 900, 60, 3.6, 4.6); k.stroke(); k.beginPath(); k.arc(760, 880, 40, 3.6, 4.6); k.stroke();
  // the small, sad ice cube sitting in it
  k.fillStyle = '#e3f4ff'; k.strokeStyle = '#1f3a56'; k.lineWidth = 12;
  k.beginPath(); k.moveTo(470, 870); k.lineTo(470, 700); k.lineTo(640, 690); k.lineTo(650, 860); k.closePath(); k.fill(); k.stroke();
  k.beginPath(); k.moveTo(470, 700); k.lineTo(520, 650); k.lineTo(690, 645); k.lineTo(640, 690); k.closePath(); k.fillStyle = '#ffffff'; k.fill(); k.stroke();
  k.beginPath(); k.moveTo(640, 690); k.lineTo(690, 645); k.lineTo(700, 810); k.lineTo(650, 860); k.closePath(); k.fillStyle = '#b8dcf2'; k.fill(); k.stroke();
  k.fillStyle = '#1f3a56'; k.beginPath(); k.arc(525, 770, 11, 0, 7); k.arc(595, 768, 11, 0, 7); k.fill(); // eyes
  k.lineWidth = 9; k.beginPath(); k.arc(560, 830, 34, 3.6, 5.8); k.stroke(); // frown
  k.lineWidth = 7; k.beginPath(); k.moveTo(505, 735); k.lineTo(545, 748); k.moveTo(615, 746); k.lineTo(650, 732); k.stroke(); // sad brows
  // drips and a tear
  k.fillStyle = '#9fd0ee'; for (const [x, y] of [[480, 880], [655, 875], [540, 300 + 520]]) { k.beginPath(); k.moveTo(x, y - 26); k.quadraticCurveTo(x + 16, y, x, y + 10); k.quadraticCurveTo(x - 16, y, x, y - 26); k.fill(); k.lineWidth = 5; k.stroke(); }
  // a little drawn sun up in the corner (hot) and wavy heat lines
  k.fillStyle = '#ffcf4a'; k.lineWidth = 10; k.beginPath(); k.arc(860, 300, 90, 0, 7); k.fill(); k.stroke();
  for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; k.beginPath(); k.moveTo(860 + Math.cos(a) * 115, 300 + Math.sin(a) * 115); k.lineTo(860 + Math.cos(a) * 160, 300 + Math.sin(a) * 160); k.stroke(); }
  k.strokeStyle = 'rgba(200,80,40,.7)'; k.lineWidth = 7; for (let i = 0; i < 3; i++) { k.beginPath(); for (let y = 0; y < 220; y += 10) k.lineTo(380 + i * 90 + Math.sin(y / 18) * 14, 560 - y); k.stroke(); }
}

// ---------------- route map: parchment, Natural Earth coastline, labels, compass, dotted route round Africa ----------------
const MAP = { lon0: -82, lon1: 102, lat0: -50, lat1: 56 };
// sailing route Boston → across the Atlantic → south past Brazil's longitude → round the Cape of Good Hope → up the Indian Ocean → Bay of Bengal → Calcutta
export const ROUTE = [[-70.9, 42.3], [-62, 37], [-45, 28], [-30, 15], [-26, 2], [-28, -12], [-22, -26], [-5, -37], [18, -40], [35, -37], [52, -29], [63, -15], [74, -2], [84, 8], [88.2, 17], [88.2, 21.6], [88.4, 22.6]];
// S02 v2: the Caribbean leg (beat 2): Boston → Martinique (Saint-Pierre, about 14.7 N 61.2 W), on a zoomed view of the same map
export const ROUTE_MQ = [[-70.9, 42.3], [-67.5, 38.5], [-63.5, 32], [-61.5, 24], [-60.6, 18], [-61.1, 14.7]];
const MAP_MQ = { lon0: -92, lon1: -38, lat0: 4, lat1: 52 };
function map(k, s = {}) {
  const mq = s.dest === 'mq'; const W = mq ? 1200 : 1600, H = mq ? 1200 : 1060, pad = 70; const p = s.route ?? 1; const M = mq ? MAP_MQ : MAP;
  agedPaper(k, W, H, 53, '#ead9b0');
  const X = (lon) => pad + (lon - M.lon0) / (M.lon1 - M.lon0) * (W - 2 * pad), Y = (lat) => pad + (M.lat1 - lat) / (M.lat1 - M.lat0) * (H - 2 * pad);
  k.save(); k.beginPath(); k.rect(pad, pad, W - 2 * pad, H - 2 * pad); k.clip();
  // sea hatching near the coasts (engraved look), then land
  k.lineJoin = 'round';
  for (const ring of LAND) { k.beginPath(); ring.forEach(([lo, la], i) => (i ? k.lineTo(X(lo), Y(la)) : k.moveTo(X(lo), Y(la)))); k.closePath(); k.strokeStyle = 'rgba(80,110,130,.25)'; k.lineWidth = 26; k.stroke(); }
  for (const ring of LAND) { k.beginPath(); ring.forEach(([lo, la], i) => (i ? k.lineTo(X(lo), Y(la)) : k.moveTo(X(lo), Y(la)))); k.closePath(); k.fillStyle = '#d2b47a'; k.fill(); k.strokeStyle = '#4a3418'; k.lineWidth = 4; k.stroke(); }
  // equator, faint
  k.setLineDash([10, 12]); k.strokeStyle = 'rgba(90,60,30,.35)'; k.lineWidth = 2; k.beginPath(); k.moveTo(pad, Y(0)); k.lineTo(W - pad, Y(0)); k.stroke(); k.setLineDash([]);
  // labels
  k.textAlign = 'center'; k.textBaseline = 'middle'; k.fillStyle = '#3a2410';
  const lab = (t, lo, la, size, it) => { k.font = `${it ? 'italic ' : 'bold '}${size}px "DejaVu Serif", serif`; k.fillText(t, X(lo), Y(la)); };
  if (mq) { lab('ATLANTIC', -50, 34, 40, true); lab('OCEAN', -50, 30.5, 40, true); lab('CARIBBEAN SEA', -74, 14.2, 32, true); } /* v3: west of Martinique, clear of its label and the compass */
  else { lab('AFRICA', 20, 5, 44); lab('ATLANTIC', -35, -2, 34, true); lab('OCEAN', -35, -8, 34, true); lab('INDIAN OCEAN', 72, -26, 34, true); }
  // route: dotted, drawn up to p
  const pts = (mq ? ROUTE_MQ : ROUTE).map(([lo, la]) => [X(lo), Y(la)]); const seg = []; let tot = 0; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); tot += d; }
  let left = tot * p, tip = pts[0], ang = 0; k.setLineDash([2, 18]); k.lineCap = 'round'; k.strokeStyle = '#a3171b'; k.lineWidth = 11; k.beginPath(); k.moveTo(...pts[0]);
  for (let i = 1; i < pts.length && left > 0; i++) { const u = Math.min(1, left / seg[i - 1]); tip = [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * u, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * u]; ang = Math.atan2(pts[i][1] - pts[i - 1][1], pts[i][0] - pts[i - 1][0]); k.lineTo(...tip); left -= seg[i - 1]; }
  k.stroke(); k.setLineDash([]);
  // the two ports
  for (const [t, lo, la, dx, dy] of (mq ? [['BOSTON', -70.9, 42.3, 90, -38], ['MARTINIQUE', -61.1, 14.7, 168, 4] /* v3: to the east of the dot, out in the Atlantic */] : [['BOSTON', -70.9, 42.3, 78, -40] /* nudged right so the map border never clips it */, ['CALCUTTA', 88.4, 22.6, -10, -42]])) { k.fillStyle = '#a3171b'; k.beginPath(); k.arc(X(lo), Y(la), 12, 0, 7); k.fill(); k.strokeStyle = INK; k.lineWidth = 4; k.stroke(); k.fillStyle = '#1b1b1b'; k.font = 'bold 40px "DejaVu Serif", serif'; k.lineWidth = 8; k.strokeStyle = 'rgba(234,217,176,.9)'; k.strokeText(t, X(lo) + dx, Y(la) + dy); k.fillText(t, X(lo) + dx, Y(la) + dy); }
  if (!mq) { k.fillStyle = '#3a2410'; k.font = 'italic 28px "DejaVu Serif", serif'; k.textAlign = 'center'; k.lineWidth = 6; k.strokeStyle = 'rgba(234,217,176,.9)'; k.strokeText('(now Kolkata)', X(88.4) - 10, Y(22.6) + 44); k.fillText('(now Kolkata)', X(88.4) - 10, Y(22.6) + 44); }
  // tiny ship riding the route tip
  if (p > 0.01 && (mq || p < 0.999)) { k.save(); k.translate(...tip); k.scale(Math.cos(ang) < 0 ? -1 : 1, 1); k.fillStyle = INK; k.beginPath(); k.moveTo(-26, 0); k.lineTo(26, 0); k.lineTo(18, 12); k.lineTo(-20, 12); k.closePath(); k.fill(); k.fillRect(-2, -34, 4, 34); k.fillStyle = '#f6eedb'; k.strokeStyle = INK; k.lineWidth = 3; k.beginPath(); k.moveTo(2, -32); k.quadraticCurveTo(22, -18, 2, -4); k.closePath(); k.fill(); k.stroke(); k.restore(); }
  k.restore();
  // compass rose (south-east corner of the ocean) and border
  k.save(); k.translate(mq ? X(-84) : X(-58), mq ? Y(10) : Y(-38)); k.strokeStyle = INK; k.lineWidth = 3; k.beginPath(); k.arc(0, 0, 60, 0, 7); k.stroke();
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, L = i % 2 ? 40 : 78; k.fillStyle = i % 2 ? '#7a5a30' : '#3a2410'; k.beginPath(); k.moveTo(Math.sin(a) * L, -Math.cos(a) * L); k.lineTo(Math.sin(a + 0.35) * 14, -Math.cos(a + 0.35) * 14); k.lineTo(Math.sin(a - 0.35) * 14, -Math.cos(a - 0.35) * 14); k.closePath(); k.fill(); }
  k.fillStyle = '#3a2410'; k.font = 'bold 34px "DejaVu Serif", serif'; k.textAlign = 'center'; k.fillText('N', 0, -96); k.restore();
  k.strokeStyle = '#4a3418'; k.lineWidth = 8; k.strokeRect(pad - 14, pad - 14, W - 2 * pad + 28, H - 2 * pad + 28); k.lineWidth = 3; k.strokeRect(pad - 4, pad - 4, W - 2 * pad + 8, H - 2 * pad + 8);
}

// ---------------- thermometer on a board: glass tube, bulb, red column, ticks, no numbers ----------------
function thermo(k, s = {}) {
  const W = 420, H = 1300; const lv = Math.max(0, Math.min(1, s.level ?? 0.5));
  k.fillStyle = '#7a5230'; k.beginPath(); k.roundRect(0, 0, W, H, 40); k.fill(); k.strokeStyle = INK; k.lineWidth = 12; k.stroke();
  k.fillStyle = '#efe4c8'; k.beginPath(); k.roundRect(50, 50, W - 100, H - 100, 26); k.fill(); k.lineWidth = 6; k.stroke();
  const x = W / 2, top = 130, bot = H - 250;
  k.strokeStyle = '#3a2410'; for (let y = top + 20; y <= bot; y += 34) { const big = ((y - top - 20) / 34) % 4 === 0; k.lineWidth = big ? 6 : 3; k.beginPath(); k.moveTo(x + 48, y); k.lineTo(x + (big ? 120 : 88), y); k.stroke(); k.beginPath(); k.moveTo(x - 48, y); k.lineTo(x - (big ? 120 : 88), y); k.stroke(); }
  k.fillStyle = 'rgba(220,240,255,.9)'; k.beginPath(); k.roundRect(x - 30, top - 20, 60, bot - top + 120, 30); k.fill(); k.strokeStyle = INK; k.lineWidth = 8; k.stroke();
  k.beginPath(); k.arc(x, bot + 120, 74, 0, 7); k.fillStyle = '#d62828'; k.fill(); k.stroke();
  const ytop = bot + 60 - lv * (bot + 60 - top); k.fillStyle = '#d62828'; k.fillRect(x - 15, ytop, 30, bot + 100 - ytop);
  k.fillStyle = 'rgba(255,255,255,.6)'; k.fillRect(x - 22, top, 8, bot - top + 60); k.beginPath(); k.arc(x - 26, bot + 96, 18, 0, 7); k.fill();
  // little sun at the top, so the meaning is clear without numbers
  k.fillStyle = '#ffcf4a'; k.strokeStyle = INK; k.lineWidth = 5; k.beginPath(); k.arc(x, 90, 26, 0, 7); k.fill(); k.stroke();
}

export const CARDS = { year: { size: [640, 380], draw: year }, news: { size: [1350, 1800], draw: news }, letter: { size: [1100, 1400], draw: letter }, map: { size: [1600, 1060], draw: map }, mapMq: { size: [1200, 1200], draw: (k, s) => map(k, { ...s, dest: 'mq' }) }, thermo: { size: [420, 1300], draw: thermo } };
