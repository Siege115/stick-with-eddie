#!/usr/bin/env node
// render-lineup.mjs <out.jpg> — draws src/lineup.html (every S02 costume, labelled) to a JPEG.
import { createRequire } from 'node:module'; import fs from 'node:fs'; import path from 'node:path';
import { serve } from './src/server.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
const out = process.argv[2] || 'deliver/s02-round0-costumes.jpg';
const ROOT = path.dirname(new URL(import.meta.url).pathname); process.chdir(ROOT);
const server = await serve(ROOT); const port = server.address().port;
const browser = await chromium.launch(); const p = await browser.newPage();
p.on('pageerror', (e) => console.error('page error:', e.message));
await p.goto(`http://localhost:${port}/src/lineup.html`); await p.waitForFunction('window.ready === true', null, { timeout: 60000 });
const data = await p.evaluate(() => document.getElementById('c').toDataURL('image/jpeg', 0.9));
fs.writeFileSync(out, Buffer.from(data.split(',')[1], 'base64')); console.log('wrote', out);
await browser.close(); server.close();
