// Shared timing logic (Node + browser). Turns beats + measured narration into absolute times.

const clean = (w) => w.toLowerCase().replace(/[^a-z0-9']/g, '');

// Estimate word timings inside a spoken span by syllable weight + punctuation pauses.
function syllables(w) {
  const s = clean(w).replace(/'/g, '');
  if (/^\d+$/.test(s)) return 2;
  const m = s.replace(/e$/, '').match(/[aeiouy]+/g);
  return Math.max(1, m ? m.length : 1);
}
export function wordTimes(text, on, off) {
  const words = text.split(/\s+/).filter(Boolean);
  const weights = words.map((w) => syllables(w) + 0.6);
  const pauses = words.map((w) => (/[.?!]$/.test(w) ? 0.32 : /[,:;]$/.test(w) ? 0.16 : 0));
  pauses[pauses.length - 1] = 0;
  const pauseTot = pauses.reduce((a, b) => a + b, 0);
  const span = Math.max(0.2, off - on - pauseTot);
  const wt = weights.reduce((a, b) => a + b, 0);
  let t = on; const out = [];
  words.forEach((w, i) => { const d = (weights[i] / wt) * span; out.push({ w, t0: t, t1: t + d }); t += d + pauses[i]; });
  return out;
}

export function buildTimeline(meta, beats, audio) {
  const LEAD = 0.1, TAIL = 0.2, PART_GAP = 0.1;
  let t = 0; const B = [];
  beats.forEach((b, i) => {
    const a = audio[i]; const parts = []; let pt = t + LEAD;
    a.parts.forEach((p) => {
      const start = pt;
      parts.push({ file: p.file, start, end: start + p.dur, words: wordTimes(p.text, start + p.on, start + p.off), voice: p.voice });
      pt = start + p.dur + PART_GAP;
    });
    const speechEnd = parts[parts.length - 1].end;
    const dur = Math.max(b.min || 0, speechEnd - t + TAIL);
    B.push({ i, start: t, end: t + dur, parts, amb: b.amb });
    t += dur + (i < beats.length - 1 ? meta.gap : 0);
  });
  // close the gaps: each beat ends where the next starts
  for (let i = 0; i < B.length - 1; i++) B[i].end = B[i + 1].start;
  return { duration: t, beats: B, mix: meta.mix };
}

export function resolver(tl) {
  return (spec, bi) => {
    const bt = tl.beats[bi];
    if (typeof spec === 'number') return bt.start + spec;
    if (spec === 'end') return bt.parts[bt.parts.length - 1].end;
    const m = /^w(\d?):([A-Za-z0-9']+)([+-][\d.]+)?$/.exec(spec);
    if (!m) throw new Error('bad time spec ' + spec);
    const parts = m[1] ? [bt.parts[+m[1] - 1]] : bt.parts;
    for (const p of parts) for (const w of p.words) if (clean(w.w) === clean(m[2])) return w.t0 + (m[3] ? parseFloat(m[3]) : 0);
    throw new Error(`word "${m[2]}" not in beat ${bi + 1}`);
  };
}

const NUMBER_WORDS = new Set(['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'thirteen', 'hundred']);

export function compile(meta, beats, tl) {
  const R = resolver(tl);
  const taps = [], poise = [], sfx = [], trans = [], captions = [];
  beats.forEach((b, bi) => {
    const bt = tl.beats[bi];
    if (b.taps) {
      const s = R(b.taps.start, bi);
      for (let k = 0; k < b.taps.n; k++) taps.push({ t: s + k * b.taps.gap, k: k + 1, n: b.taps.n, style: b.taps.count, beat: bi });
    }
    if (b.hans && b.hans.poise) for (const [a, z] of b.hans.poise) poise.push([R(a, bi), Math.min(bt.end, bt.start + z)]);
    (b.sfx || []).forEach(([at, name, arg]) => sfx.push([R(at, bi), name, arg]));
    b.shots.forEach((s, si) => {
      const t0 = R(s.at, bi);
      if (si === 0 && bi === 0) return;
      trans.push([t0, s.trans || 'cut', bi]);
    });
    // captions: 1–2 words per chunk; break after punctuation
    for (const p of bt.parts) {
      const ws = p.words; let i = 0;
      while (i < ws.length) {
        const a = ws[i], b2 = ws[i + 1];
        const take2 = b2 && !/[.,?!:;]$/.test(a.w) && (clean(a.w).length + clean(b2.w).length <= 11);
        const chunk = take2 ? [a, b2] : [a];
        captions.push({ t0: chunk[0].t0 - 0.03, t1: chunk[chunk.length - 1].t1, words: chunk.map((w) => ({ w: w.w.replace(/"/g, '').replace(/,(?!\d)/g, '').replace(/[.:;]$/, ''), /* keep commas inside numbers (15,000) */ num: NUMBER_WORDS.has(clean(w.w)) || /\d/.test(w.w) })) });
        i += chunk.length;
      }
    }
  });
  for (let i = 0; i < captions.length - 1; i++) captions[i].t1 = Math.min(Math.max(captions[i].t1 + 0.15, captions[i].t1), captions[i + 1].t0);
  return { taps, poise, sfx, trans, captions };
}
