#!/usr/bin/env node
// render-episode.mjs <beats> <outDir> [--aspect 9:16] [--3d] [--preview t1,t2,...] [--workers N] [--from s --to s]
// Makes the narration, timing, captions, sound and video for one Short.
import { createRequire } from 'node:module';
import { spawn, spawnSync, execFileSync } from 'node:child_process';
import fs from 'node:fs'; import path from 'node:path'; import { pathToFileURL } from 'node:url';
import { serve } from './src/server.mjs';
import { buildTimeline, compile, partsOf } from './src/timeline.js';
const { chromium } = createRequire(import.meta.url)('playwright');

const args = process.argv.slice(2);
const flag = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const [beatsPath, outDir] = args;
if (!beatsPath || !outDir) { console.error('usage: render-episode.mjs <beats> <outDir> [--aspect 9:16] [--3d]'); process.exit(1); }
if (!args.includes('--3d')) console.warn('note: only the 3D renderer exists in this build; rendering 3D');
const ROOT = path.dirname(new URL(import.meta.url).pathname);
process.chdir(ROOT);
fs.mkdirSync(outDir, { recursive: true });
const mod = await import(pathToFileURL(path.resolve(beatsPath)).href);
const { meta, beats } = mod;

// 1. narration
const lines = beats.map((b) => ({ parts: partsOf(b, meta).map(({ text, voice }) => ({ text, ...(voice ? { voice } : {}) })) })); // meta.voice: per-Short narrator pacing; `breaks` split a line into parts
const audioDir = `audio/${meta.id}`; fs.mkdirSync(audioDir, { recursive: true });
fs.writeFileSync(`${audioDir}/lines.json`, JSON.stringify(lines, null, 1));
execFileSync('python3', ['src/tts.py', `${audioDir}/lines.json`, audioDir], { stdio: 'inherit' });
const audio = JSON.parse(fs.readFileSync(`${audioDir}/info.json`, 'utf8'));

// 2. timing
const TL = buildTimeline(meta, beats, audio);
const EV = compile(meta, beats, TL);
fs.writeFileSync(`${outDir}/timeline.json`, JSON.stringify(TL, null, 1));
fs.writeFileSync(`${outDir}/events.json`, JSON.stringify(EV, null, 1));
console.log(`duration ${TL.duration.toFixed(2)} s, ${EV.taps.length} taps, ${EV.captions.length} caption chunks`);

// 3. frames
const fps = meta.fps, N = Math.round(TL.duration * fps);
const server = await serve(ROOT); const port = server.address().port;
const url = `http://localhost:${port}/src/stage.html?beats=${encodeURIComponent(path.relative(ROOT, path.resolve(beatsPath)))}&tl=${encodeURIComponent(path.relative(ROOT, `${outDir}/timeline.json`))}`;
const launch = () => chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
let browser = await launch();
async function openPage() {
  if (!browser.isConnected()) browser = await launch();
  const p = await browser.newPage({ viewport: { width: 400, height: 400 } });
  p.on('pageerror', (e) => console.error('page error:', e.message));
  p.on('console', (m) => { if (m.type() === 'error') console.error('console:', m.text()); });
  await p.goto(url); await p.waitForFunction('window.ready === true', null, { timeout: 120000 });
  return p;
}
const grab = async (p, t) => Buffer.from((await p.evaluate((tt) => window.frameJpeg(tt), t)).split(',')[1], 'base64');

const preview = flag('--preview');
if (preview) {
  const p = await openPage();
  const ts = preview === 'all' ? Array.from({ length: Math.ceil(TL.duration) }, (_, i) => i + 0.5) : preview.split(',').map(Number);
  for (const t of ts) { const t0 = Date.now(); fs.writeFileSync(`${outDir}/still_${t.toFixed(2)}.jpg`, await grab(p, t)); console.log('still', t, Date.now() - t0, 'ms'); }
  await browser.close(); server.close(); process.exit(0);
}

const from = Math.round(parseFloat(flag('--from', '0')) * fps), to = Math.min(N, Math.round(parseFloat(flag('--to', String(TL.duration))) * fps));
const workers = parseInt(flag('--workers', '4'));
// resumable: 2-second pieces, finished pieces are skipped on a re-run
const PIECE = 60; const pieces = [];
for (let a = from; a < to; a += PIECE) pieces.push([a, Math.min(to, a + PIECE)]);
fs.mkdirSync(`${outDir}/pieces`, { recursive: true });
const pieceFile = ([a, z]) => `${outDir}/pieces/p${String(a).padStart(5, '0')}_${z}.mp4`;
const todo = pieces.filter((pc) => !fs.existsSync(pieceFile(pc)));
console.log(`${pieces.length - todo.length}/${pieces.length} pieces already done`);
const t0 = Date.now(); let done = 0; const total = todo.reduce((s, [a, z]) => s + z - a, 0);
await Promise.all(Array.from({ length: Math.min(workers, todo.length) }, async () => {
  let p = await openPage();
  while (todo.length) {
    const pc = todo.shift(); const [a, z] = pc; const tmpf = pieceFile(pc).replace('.mp4', '.part.mp4');
    try {
      const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', String(fps), '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '16', '-pix_fmt', 'yuv420p', '-r', String(fps), '-f', 'mp4', tmpf], { stdio: ['pipe', 'inherit', 'inherit'] });
      for (let f = a; f < z; f++) {
        const buf = await grab(p, f / fps);
        if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
      }
      ff.stdin.end(); await new Promise((r) => ff.on('close', r)); fs.renameSync(tmpf, pieceFile(pc));
      done += z - a;
      const el = (Date.now() - t0) / 1000; console.log(`frames ${done}/${total}  ${(done / el).toFixed(2)} fps  eta ${((total - done) / (done / el) / 60).toFixed(1)} min`);
    } catch (e) {
      console.error(`piece ${a} failed (${e.message.split('\n')[0]}); retrying`);
      todo.push(pc);
      try { await p.close(); } catch {}
      p = await openPage();
    }
  }
  await p.close();
}));
await browser.close(); server.close();
fs.writeFileSync(`${outDir}/segs.txt`, pieces.map((pc) => `file '${path.resolve(pieceFile(pc))}'`).join('\n'));
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', `${outDir}/segs.txt`, '-c', 'copy', `${outDir}/video.mp4`]);

// 4. sound mix + mux at -14 LUFS
execFileSync('python3', ['src/mix.py', `${outDir}/timeline.json`, `${outDir}/events.json`, `${outDir}/mix.wav`, beatsPath], { stdio: 'inherit' });
const ln = (() => { // two-pass loudness: measure, then apply linearly
  const r = spawnSync('ffmpeg', ['-hide_banner', '-i', `${outDir}/mix.wav`, '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'], { encoding: 'utf8' });
  const d = JSON.parse(r.stderr.slice(r.stderr.lastIndexOf('{'), r.stderr.lastIndexOf('}') + 1));
  return `loudnorm=I=-14:TP=-1.5:LRA=11:linear=true:measured_I=${d.input_i}:measured_TP=${d.input_tp}:measured_LRA=${d.input_lra}:measured_thresh=${d.input_thresh}:offset=${d.target_offset}`;
})();
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', `${outDir}/video.mp4`, '-i', `${outDir}/mix.wav`, '-map', '0:v', '-map', '1:a',
  '-c:v', 'copy', '-af', ln, '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-shortest', '-movflags', '+faststart', `${outDir}/${meta.id}.mp4`]);
console.log('done:', `${outDir}/${meta.id}.mp4`, ((Date.now() - t0) / 60000).toFixed(1), 'min');
