"""Sound mix for a Short: narration + SFX cued on exact frames + ducked music bed + room tone.
Every sound is synthesised here (or voiced locally), so nothing needs a licence.
Usage: python3 src/mix.py <timeline.json> <events.json> <out.wav> [beats]
"""
import json, sys, os, re
import numpy as np
import soundfile as sf
from scipy.signal import butter, sosfilt, fftconvolve, resample_poly

SR = 48000
rng = np.random.default_rng(1904)
TL = json.load(open(sys.argv[1]))
EV = json.load(open(sys.argv[2]))
OUT = sys.argv[3]
BEATS = sys.argv[4] if len(sys.argv) > 4 else None
DUR = TL["duration"] + 0.3
N = int(DUR * SR)
voice = np.zeros((N, 2)); sfx = np.zeros((N, 2)); music = np.zeros((N, 2)); amb = np.zeros((N, 2))

def t2i(t): return int(round(t * SR))
def env(n, a=0.005, d=0.1):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d)
def bp(x, lo, hi, order=2): return sosfilt(butter(order, [lo, hi], btype="band", fs=SR, output="sos"), x)
def lp(x, f, order=2): return sosfilt(butter(order, f, btype="low", fs=SR, output="sos"), x)
def hp(x, f, order=2): return sosfilt(butter(order, f, btype="high", fs=SR, output="sos"), x)
def noise(n): return rng.standard_normal(n)
def place(buf, x, t, gain=1.0, pan=0.0):
    if x.ndim == 1:
        l, r = np.sqrt(0.5 * (1 - pan)), np.sqrt(0.5 * (1 + pan))
        x = np.stack([x * l * 1.414, x * r * 1.414], 1)
    i = t2i(t)
    if i < 0: x = x[-i:]; i = 0
    n = min(len(x), N - i)
    if n > 0: buf[i:i + n] += x[:n] * gain

def load(path):
    x, sr = sf.read(path, dtype="float64")
    if x.ndim > 1: x = x.mean(1)
    if sr != SR:
        from math import gcd
        g = gcd(SR, sr); x = resample_poly(x, SR // g, sr // g)
    return x

# ---------------- synthesised sounds ----------------
def clop(k=0):
    n = int(0.16 * SR); t = np.arange(n) / SR
    p = 1 + (k % 3) * 0.03
    knock = (np.sin(2 * np.pi * 620 * p * t) * 0.6 + np.sin(2 * np.pi * 1180 * p * t) * 0.35) * env(n, 0.001, 0.025)
    thump = np.sin(2 * np.pi * 110 * t * (1 - t * 2)) * env(n, 0.002, 0.045)
    grit = bp(noise(n), 1500, 6000) * env(n, 0.0005, 0.012) * 0.6
    # stone "clack" second transient
    x = knock + thump * 0.9 + grit
    x[int(0.012 * SR):] += 0.35 * knock[: n - int(0.012 * SR)]
    return x / np.abs(x).max()

def whoosh(dur=0.35, lo=300, hi=3000, rev=False):
    n = int(dur * SR); x = noise(n); out = np.zeros(n); seg = 512
    for s in range(0, n, seg):
        f = lo + (hi - lo) * np.sin(np.pi * s / n)
        out[s:s + seg] = bp(x[max(0, s - 2048):s + seg], f * 0.6, min(f * 1.6, 20000))[-len(x[s:s + seg]):]
    e = np.sin(np.pi * np.arange(n) / n) ** 2
    if rev: e = (np.arange(n) / n) ** 2
    y = out * e
    return y / (np.abs(y).max() + 1e-9)

def ding():
    n = int(1.3 * SR); t = np.arange(n) / SR
    x = sum(a * np.sin(2 * np.pi * f * t) * np.exp(-t / d) for f, a, d in [(1568, 1, .5), (3136, .4, .25), (4704, .2, .12), (2349, .25, .3)])
    return x * np.minimum(1, t / 0.002)

def ping():
    n = int(0.5 * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * 2600 * t) + 0.4 * np.sin(2 * np.pi * 5200 * t)) * np.exp(-t / 0.12)

def pop():
    n = int(0.12 * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * (900 - 4000 * t) * t) * env(n, 0.001, 0.03)

def tick():
    n = int(0.06 * SR); return bp(noise(n), 2500, 7000) * env(n, 0.0005, 0.008)

def stamp():
    n = int(0.5 * SR); t = np.arange(n) / SR
    thud = np.sin(2 * np.pi * 70 * t) * env(n, 0.001, 0.09)
    slap = bp(noise(n), 400, 3500) * env(n, 0.0005, 0.03)
    return thud * 1.2 + slap

def chalk(dur):
    n = int(dur * SR); x = bp(noise(n), 2500, 9000)
    gate = np.zeros(n); i = 0
    while i < n:
        L = int(rng.uniform(0.05, 0.18) * SR); gate[i:i + L] = np.sin(np.pi * np.arange(min(L, n - i)) / L) ; i += L + int(rng.uniform(0.02, 0.08) * SR)
    return x * gate * 0.5

def paper():
    n = int(0.7 * SR); x = np.zeros(n)
    for k in range(9):
        s = int(rng.uniform(0, 0.55) * SR); L = int(rng.uniform(0.03, 0.09) * SR)
        x[s:s + L] += bp(noise(L), 1200, 8000) * np.hanning(L) * rng.uniform(0.4, 1)
    return x + whoosh(0.7, 400, 2500) * 0.4

def creak():
    n = int(1.0 * SR); t = np.arange(n) / SR
    f = 95 + 40 * np.sin(2 * np.pi * 1.3 * t) + 15 * rng.standard_normal(n).cumsum() / np.sqrt(n)
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sign(np.sin(ph)) * 0.5 + np.sin(ph * 3) * 0.3
    return bp(x, 300, 2400) * np.sin(np.pi * t / t[-1]) * 0.6

def step(k=0):
    n = int(0.12 * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * (90 + 10 * (k % 3)) * t) * env(n, 0.002, 0.035) + bp(noise(n), 300, 2500) * env(n, 0.001, 0.02) * 0.6)

def snare_march(dur):
    x = np.zeros(int(dur * SR)); bt = 60 / 132
    i = 0; t = 0
    while t < dur - 0.1:
        for sub, acc in [(0, 1), (bt / 2, 0.5)]:
            n = int(0.15 * SR); s = t2i(t + sub)
            hit = (bp(noise(n), 1500, 8000) * env(n, 0.001, 0.05) + np.sin(2 * np.pi * 190 * np.arange(n) / SR) * env(n, 0.001, 0.03)) * acc
            if s + n < len(x): x[s:s + n] += hit
        st = step(i)
        s = t2i(t);
        if s + len(st) < len(x): x[s:s + len(st)] += st * 1.4
        t += bt; i += 1
    return x * 0.6

def clunk():
    n = int(0.8 * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * 55 * t) * env(n, 0.002, 0.15) * 1.3 + bp(noise(n), 800, 4000) * env(n, 0.001, 0.04) + np.sin(2 * np.pi * 1300 * t) * env(n, 0.002, 0.2) * 0.15

def drone(dur):
    n = int(dur * SR); t = np.arange(n) / SR
    x = sum(np.sin(2 * np.pi * f * t + p) for f, p in [(55, 0), (55.4, 1), (82.4, 2), (110.3, .5)]) / 4
    x += lp(noise(n), 200) * 0.3
    e = np.minimum(1, t / 1.2) * np.minimum(1, (t[-1] - t) / 0.8)
    return x * e

def applause(dur):
    n = int(dur * SR); x = np.zeros(n)
    for k in range(int(dur * 70)):
        s = rng.integers(0, n - 2000); L = rng.integers(300, 900)
        x[s:s + L] += bp(noise(L), 800, 6000) * np.exp(-np.arange(L) / (L / 5)) * rng.uniform(0.3, 1)
    return x * np.minimum(1, np.arange(n) / (0.15 * SR)) * np.minimum(1, (n - np.arange(n)) / (0.6 * SR))

def murmur(dur):
    n = int(dur * SR); out = np.zeros(n); t = np.arange(n) / SR
    for v in range(14):
        f1 = rng.uniform(350, 800); f2 = rng.uniform(1100, 2200)
        src = noise(n)
        s = bp(src, f1 * 0.8, f1 * 1.25) + 0.6 * bp(src, f2 * 0.85, f2 * 1.2)
        am = np.clip(np.sin(2 * np.pi * rng.uniform(3, 6) * t + rng.uniform(0, 6)) + rng.uniform(-0.3, 0.4), 0, 1) ** 2
        slow = np.clip(np.sin(2 * np.pi * rng.uniform(0.2, 0.5) * t + rng.uniform(0, 6)), 0.1, 1)
        out += s * am * slow
    out = lp(out, 2400)
    return out / (np.abs(out).max() + 1e-9) * np.minimum(1, t / 0.4) * np.minimum(1, (t[-1] - t) / 0.5)

# crowd voices via the local TTS (layered, offset, filtered)
_k = None
def crowd_voice(text, voices, spread=0.25, speed=1.1, key="x"):
    path = f"audio/crowd/{key}.wav"
    if os.path.exists(path): return load(path)
    global _k
    if _k is None:
        from kokoro_onnx import Kokoro
        _k = Kokoro("models/kokoro.onnx", "models/voices.bin")
    layers = []
    for i, v in enumerate(voices):
        s, sr = _k.create(text[i % len(text)], voice=v, speed=speed * rng.uniform(0.92, 1.1), lang="en-us")
        layers.append((load_arr(s, sr), rng.uniform(0, spread), rng.uniform(0.5, 1.0)))
    L = max(len(a) + int(o * SR) for a, o, _ in layers)
    mix = np.zeros(L)
    for a, o, g in layers: i = int(o * SR); mix[i:i + len(a)] += a * g
    mix = bp(mix, 180, 5000)
    os.makedirs("audio/crowd", exist_ok=True); sf.write(path, mix / (np.abs(mix).max() + 1e-9), SR)
    return mix / (np.abs(mix).max() + 1e-9)
def load_arr(s, sr):
    from math import gcd
    g = gcd(SR, sr); return resample_poly(np.asarray(s, dtype="float64"), SR // g, sr // g)

MEN = ["am_adam", "am_eric", "am_liam", "am_onyx", "bm_george", "bm_daniel", "am_puck", "bm_fable"]
WOMEN = ["af_bella", "af_sarah", "af_nicole", "bf_emma", "af_sky", "bf_isabella", "af_kore", "af_jessica"]
def crowd_gasp(): return crowd_voice(["Ooooh!", "Whoa!", "Oh!", "Wow!"], WOMEN[:4] + MEN[:4], 0.18, 1.0, "gasp")
def crowd_cheer(): return crowd_voice(["Hooray!", "Bravo!", "Yay!", "Wunderbar!"], MEN[:5] + WOMEN[:5], 0.3, 1.0, "cheer")
def laugh(): return crowd_voice(["Ha ha ha ha!", "Ho ho ho!", "Hah hah hah!", "Ha ha ha!"], ["bm_george", "bm_lewis", "am_onyx", "bm_daniel", "am_adam", "bm_fable"], 0.35, 1.05, "laugh")

# ---------------- reverb ----------------
def reverb(x, secs=0.7, wet=0.18):
    n = int(secs * SR); ir = noise(n) * np.exp(-np.arange(n) / (secs * SR / 5)); ir = lp(ir, 5000); ir /= np.abs(ir).sum() / 8
    w = np.stack([fftconvolve(x[:, c], ir)[:len(x)] for c in range(2)], 1)
    return x * (1 - wet) + w * wet

# ================= build =================
# narration
for b in TL["beats"]:
    for p in b["parts"]:
        x = load(p["file"]); x = hp(x, 70)
        g = 1.0 if p.get("voice", "narrator") == "narrator" else 1.1
        place(voice, x, p["start"], g)

# clops: one per tap, exact time
for tp in EV["taps"]:
    place(sfx, clop(tp["k"]), tp["t"] - 0.004, 0.75, 0.15)

# transition whooshes
for t, kind, bi in EV["trans"]:
    if kind == "whip": place(sfx, whoosh(0.36, 400, 3500), t - 0.18, 0.32, rng.uniform(-0.4, 0.4))
    elif kind == "zoom": place(sfx, whoosh(0.45, 300, 5000, rev=True), t - 0.38, 0.3)
    elif kind == "zoomout": place(sfx, whoosh(0.45, 2500, 600), t - 0.05, 0.3)
    elif kind == "push": place(sfx, whoosh(0.6, 150, 1200), t - 0.4, 0.4)
    elif kind == "wipe": place(sfx, whoosh(0.5, 250, 1800), t - 0.25, 0.35)
    elif kind == "pull": place(sfx, whoosh(0.9, 200, 2500), t, 0.3)

# ---- S02 sounds (synthesised; soft and natural, nothing 8-bit) ----
def _fade(x, a=0.004, r=0.06):
    n = len(x); e = np.ones(n); na, nr = max(1, int(a * SR)), max(1, int(r * SR))
    e[:na] = np.linspace(0, 1, na); e[-nr:] *= np.linspace(1, 0, nr) ** 2
    return x * e
def ice_saw(dur=1.2):  # long hand saw in ice: rhythmic rasp strokes
    n = int(dur * SR); t = np.arange(n) / SR; x = bp(noise(n), 1800, 7000)
    stroke = np.abs(np.sin(np.pi * t * 3.2)) ** 1.5
    y = x * stroke * (0.6 + 0.4 * np.sin(2 * np.pi * 37 * t))
    return _fade(y / (np.abs(y).max() + 1e-9), 0.02, 0.15)
def drip():
    n = int(0.25 * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * (1300 + 2200 * t) * t) * np.exp(-t / 0.03)
def splash():
    n = int(0.6 * SR); t = np.arange(n) / SR
    return bp(noise(n), 500, 5000) * np.exp(-t / 0.12) * np.minimum(1, t / 0.005)
def gull_cry():
    n = int(0.42 * SR); t = np.arange(n) / SR
    f = 1500 + 900 * np.sin(np.pi * t / 0.42) - 500 * t
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.35 * np.sin(4 * np.pi * np.cumsum(f) / SR)
    return x * np.sin(np.pi * t / 0.42) ** 0.6 * (0.7 + 0.3 * np.sin(2 * np.pi * 28 * t))
def gulls(dur=2.0):
    n = int(dur * SR); x = np.zeros(n)
    for k in range(int(dur * 1.5) + 1):
        c = gull_cry(); o = int(rng.uniform(0, max(1, n - len(c))))
        x[o:o + len(c)] += c * rng.uniform(0.5, 1.0)
    return x / (np.abs(x).max() + 1e-9)
def waves(dur=4.0):
    n = int(dur * SR); t = np.arange(n) / SR
    return lp(noise(n), 700) * (0.55 + 0.45 * np.sin(2 * np.pi * t / 2.6) ** 2) * np.minimum(1, t / 0.4) * np.minimum(1, (dur - t) / 0.4)
def wind(dur=4.0):
    n = int(dur * SR); t = np.arange(n) / SR
    return bp(noise(n), 200, 900) * (0.6 + 0.4 * np.sin(2 * np.pi * t / 3.1 + 1)) * np.minimum(1, t / 0.5) * np.minimum(1, (dur - t) / 0.5)
def sawmill(dur=3.0):  # up-and-down sash saw strokes over running water
    n = int(dur * SR); t = np.arange(n) / SR
    strokes = bp(noise(n), 900, 5000) * np.abs(np.sin(np.pi * t * 1.45)) ** 2
    water = lp(noise(n), 1200) * 0.5
    y = strokes + water
    return _fade(y / (np.abs(y).max() + 1e-9), 0.1, 0.3)

NAMED = {
    "ding": lambda a: (ding(), 0.25), "ping": lambda a: (ping(), 0.3), "pop": lambda a: (pop(), 0.35), "tick": lambda a: (tick(), 0.35),
    "stamp": lambda a: (stamp(), 0.8), "chalk": lambda a: (chalk(a or 1.0), 0.25), "paper": lambda a: (paper(), 0.45),
    "creak": lambda a: (creak(), 0.35), "drumroll": lambda a: (snare_march(a or 3), 0.5), "spotClunk": lambda a: (clunk(), 0.6),
    "drone": lambda a: (drone(a or 6), 0.22), "whoosh": lambda a: (whoosh(0.5, 250, 1800), 0.3), "whooshLong": lambda a: (whoosh(1.0, 200, 2500), 0.3),
    "crowdGasp": lambda a: (crowd_gasp(), 0.42), "cheer": lambda a: (crowd_cheer() + 0.0, 0.4), "laugh": lambda a: (laugh(), 0.4),
    "crowdMurmur": lambda a: (murmur(a or 4), 0.12),
    "iceSaw": lambda a: (ice_saw(a or 1.2), 0.35), "drip": lambda a: (drip(), 0.3), "splash": lambda a: (splash(), 0.35),
    "gulls": lambda a: (gulls(a or 2.0), 0.18), "waves": lambda a: (waves(a or 4.0), 0.3), "wind": lambda a: (wind(a or 4.0), 0.3),
    "sawmill": lambda a: (sawmill(a or 3.0), 0.3), "steps2": lambda a: (np.concatenate([step(0), np.zeros(int(.3 * SR)), step(1)]), 0.6),
}
for t, name, arg in EV["sfx"]:
    x, g = NAMED[name](arg)
    place(sfx, x, t, g, rng.uniform(-0.25, 0.25))
    if name == "cheer": place(sfx, applause(2.2), t, 0.25)

# ---------------- music: soft "curious detective" bed ----------------
# Acoustic-style instruments built from smooth sine partials with real attack and
# release fades (no square waves, no truncated notes -> nothing 8-bit or clicky).
def fade(x, a=0.004, r=0.06):
    n = len(x); e = np.ones(n)
    na, nr = max(1, int(a * SR)), max(1, int(r * SR))
    e[:na] = np.linspace(0, 1, na); e[-nr:] *= np.linspace(1, 0, nr) ** 2
    return x * e
def partials(f, dur, parts, a=0.004, r=0.08):
    n = int(dur * SR); t = np.arange(n) / SR; x = np.zeros(n)
    for k, amp, dec in parts:
        if f * k < 16000: x += amp * np.sin(2 * np.pi * f * k * t + k) * np.exp(-t / dec)
    return fade(x, a, r)
def note(m): return 440 * 2 ** ((m - 69) / 12)
def pizz(m):  return partials(note(m), 0.55, [(1, 1, .22), (2, .35, .12), (3, .12, .07), (4, .05, .05)], 0.003, 0.08)
def piano(m): return partials(note(m), 1.6, [(1, 1, .9), (2, .45, .5), (3, .22, .3), (4, .12, .2), (5, .06, .12)], 0.003, 0.25)
def bass(m):  return partials(note(m), 0.75, [(1, 1, .45), (2, .3, .25), (3, .08, .15)], 0.006, 0.12)
def pad(m, dur):
    n = int(dur * SR); t = np.arange(n) / SR
    x = sum(np.sin(2 * np.pi * note(m) * dt * t) for dt in (0.997, 1.0, 1.003)) / 3
    return x * np.minimum(1, t / 0.6) * np.minimum(1, (t[-1] - t) / 0.6)
def shaker():
    n = int(0.09 * SR); return fade(bp(noise(n), 4000, 9000) * np.exp(-np.arange(n) / (0.025 * SR)), 0.002, 0.03)
bpm = 100; beat = 60 / bpm
mel = [62, None, 65, 69, 67, None, 65, 64, 62, None, 69, 72, 71, 69, 67, 65,
       62, None, 65, 69, 70, None, 69, 67, 65, 64, 62, 64, 65, None, 57, None]
roots = [38, 38, 43, 45]                                   # D, D, G, A (one per bar)
chords = [[62, 65, 69], [62, 65, 69], [62, 67, 70], [61, 64, 67]]
cache = {}
def C(fn, m):
    k = (fn.__name__, m)
    if k not in cache: cache[k] = fn(m)
    return cache[k]
MIX = TL.get("mix") or {}
if "tense" in MIX: spot_from = TL["beats"][MIX["tense"][0]]["start"]; spot_to = TL["beats"][MIX["tense"][1]]["start"]
elif MIX: spot_from = spot_to = DUR + 1  # no tense section
else: spot_from = TL["beats"][12]["start"]; spot_to = TL["beats"][15]["start"]
t = 0.0; i = 0
while t < DUR:
    tense = spot_from <= t < spot_to
    bar = (i // 8) % 4
    if not tense:
        m = mel[i % len(mel)]
        if m is not None: place(music, C(pizz, m), t, 0.55, 0.25)
        if i % 8 in (0, 4):
            for k2, cm in enumerate(chords[bar]): place(music, C(piano, cm), t + k2 * 0.012, 0.16, -0.15)
        if i % 2 == 0: place(music, C(bass, roots[bar] + (7 if i % 4 == 2 else 0)), t, 0.6, -0.1)
        place(music, shaker(), t + 0.01, 0.07 if i % 2 else 0.04, 0.35)
    elif i % 4 == 0:  # soft low heartbeat under the test scene
        place(music, partials(48, 0.35, [(1, 1, .09), (2, .3, .05)], 0.004, 0.08), t, 0.8)
    t += beat / 2; i += 1
# sustained low pad through the tense test
if spot_to > spot_from and spot_from < DUR: place(music, pad(38, spot_to - spot_from) * 0.5 + pad(45, spot_to - spot_from) * 0.3, spot_from, 0.5)
music = lp(music.T, 5500).T
music = reverb(music, 1.2, 0.22)

# duck music under the voice
venv = np.abs(voice).mean(1)
k = int(0.15 * SR); venv = np.convolve(venv, np.ones(k) / k, mode="same")
venv /= venv.max() + 1e-9
duck = 1 - 0.55 * np.clip(venv * 4, 0, 1)
music *= duck[:, None]

# ---------------- room tone ----------------
def birds(dur):
    n = int(dur * SR); x = np.zeros(n)
    for _ in range(int(dur * 0.9)):
        s = rng.integers(0, max(1, n - SR)); L = int(rng.uniform(0.05, 0.12) * SR); f0 = rng.uniform(3000, 5000)
        for r in range(rng.integers(2, 5)):
            tt = np.arange(L) / SR
            ch = np.sin(2 * np.pi * (f0 + 1500 * np.sin(2 * np.pi * 18 * tt)) * tt) * np.hanning(L)
            o = s + r * int(L * 1.3)
            if o + L < n: x[o:o + L] += ch * 0.3
    return x
AMB = {  # S02 room tones by name (beat `amb`)
    "night": lambda d: wind(d) * 0.5 + lp(noise(int(d * SR)), 250) * 0.15,
    "harbour": lambda d: waves(d) * 0.5 + gulls(d) * 0.12 + murmur(d) * 0.15,
    "tropic": lambda d: waves(d) * 0.45 + birds(d) * 0.8 + murmur(d) * 0.15,
    "river": lambda d: lp(noise(int(d * SR)), 900) * 0.25 + birds(d) * 0.6 + murmur(d) * 0.2,
    "sea": lambda d: waves(d) * 0.8 + wind(d) * 0.4,
    "room": lambda d: lp(noise(int(d * SR)), 600) * 0.12 + birds(d) * 0.3,
    "hold": lambda d: lp(noise(int(d * SR)), 200) * 0.3,
    "mill": lambda d: lp(noise(int(d * SR)), 1200) * 0.3 + birds(d) * 0.4,
    "none": lambda d: np.zeros(int(d * SR)),
}
for bi, b in enumerate(TL["beats"]):
    d = b["end"] - b["start"]
    if MIX:
        place(amb, AMB.get(b.get("amb") or "room", AMB["room"])(d), b["start"], 0.22)
        continue
    if 12 <= bi <= 14:
        place(amb, lp(noise(int(d * SR)), 300) * 0.25, b["start"], 0.3)
    else:
        place(amb, murmur(d) * 0.35 + lp(noise(int(d * SR)), 900) * 0.15 + birds(d), b["start"], 0.22)

# ---------------- final ----------------
sfx = reverb(sfx, 0.6, 0.16)
mix = voice * 1.0 + sfx * 0.9 + music * 0.18 + amb * 0.5
mix = mix / (np.abs(mix).max() + 1e-9) * 0.89
sf.write(OUT, mix.astype(np.float32), SR, subtype="FLOAT")
print("mix ok", OUT, f"{DUR:.2f}s")
