"""S02 music bed: an original rollicking sea shanty in 6/8, D Dorian, about 105 dotted-quarter bpm,
plus an ocean layer (wave wash, ship timbers, rope stretch). Used only by src/mix.py for S02.

Every instrument is additive synthesis of smooth sine partials with raised-cosine attack and release
fades, so nothing is square, pulse or bit-crushed, and nothing clicks:
  fiddle     bowed: harmonic stack, slow attack, delayed vibrato, rosin noise, body resonances
  squeezebox two detuned reeds, bellows tremolo and swell, breath noise
  tin whistle near-sine with a breathy chiff, light vibrato (bright tropical moments)
  upright bass plucked: decaying partials and a soft finger thump
  guitar     nylon pluck for warm arpeggios
  bodhran    frame drum (pitched membrane + skin), soft foot stomps on the boards
The tune and the chords are written for this Short (no traditional or known shanty melody).
"""
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve

SR = 48000
R = np.random.default_rng(1806)
PH = np.random.default_rng(33).uniform(0, 2 * np.pi, 40)  # fixed, dispersed partial phases (no buzzy pulse-like peaks)


def lp(x, f, o=2): return sosfilt(butter(o, f, btype="low", fs=SR, output="sos"), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, btype="high", fs=SR, output="sos"), x)
def bp(x, lo, hi, o=2): return sosfilt(butter(o, [lo, hi], btype="band", fs=SR, output="sos"), x)
def noise(n): return R.standard_normal(n)
def note(m): return 440.0 * 2 ** ((m - 69) / 12)


def fades(n, a, r):
    """Raised-cosine fade in over a seconds and fade out (to zero) over the last r seconds."""
    e = np.ones(n); na = min(max(2, int(a * SR)), n // 2); nr = min(max(2, int(r * SR)), n - na)
    e[:na] = 0.5 - 0.5 * np.cos(np.pi * np.arange(na) / na)
    e[n - nr:] *= 0.5 + 0.5 * np.cos(np.pi * (np.arange(nr) + 1) / nr)
    return e


# ---------------- instruments ----------------
def fiddle(m, dur, vel=1.0, a=0.05, r=0.1, trem=0.0, cresc=None, fcurve=None):
    n = int((dur + r) * SR); t = np.arange(n) / SR
    f0 = fcurve(t) if fcurve is not None else np.full(n, note(m))
    vd = np.clip((t - 0.12) / 0.25, 0, 1)
    f = f0 * (1 + 0.0045 * vd * np.sin(2 * np.pi * 5.6 * t + R.uniform(0, 6)))
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.zeros(n); fmax = f.max(); norm = 0
    for k in range(1, 30):
        if fmax * k > 7000: break
        amp = k ** -1.25 * (1.2 if 2 <= k <= 4 else 1.0); x += amp * np.sin(k * ph + PH[k]); norm += amp
    x /= norm
    bow = 0.9 + 0.1 * np.sin(np.pi * np.clip(t / max(dur, 0.05), 0, 1))
    if trem: bow = bow * (1 - trem * (0.5 + 0.5 * np.sin(2 * np.pi * 7.5 * t)))
    if cresc is not None: bow = bow * (cresc[0] + (cresc[1] - cresc[0]) * np.clip(t / max(dur, 0.05), 0, 1))
    rosin = bp(noise(n), 2500, 7500) * 0.05 * (0.5 + 0.5 * np.exp(-t / 0.05))
    return (x * bow + rosin * bow) * fades(n, a, r) * vel


_reed_cache = {}
def reed(m, dur, vel=1.0, a=0.035, r=0.1, swell=None):
    key = (m, round(dur, 3), a, r)
    if key not in _reed_cache:
        n = int((dur + r) * SR); t = np.arange(n) / SR; x = np.zeros(n); norm = 0
        for det in (-3.0, 3.0):  # two reeds a few cents apart (gentle musette)
            f = note(m) * 2 ** (det / 1200)
            for k in range(1, 18):
                if f * k > 7000: break
                amp = k ** -1.0 * (1.3 if 3 <= k <= 6 else 1.0)
                x += amp * np.sin(2 * np.pi * f * k * t + PH[k] + det); norm += amp
        x /= norm
        trem = 1 + 0.035 * np.sin(2 * np.pi * 5.0 * t)  # bellows
        bell = 0.82 + 0.18 * np.sin(np.pi * np.clip(t / max(dur, 1e-3), 0, 1))  # bellows swell
        breath = bp(noise(n), 1500, 4000) * 0.012
        _reed_cache[key] = (x * trem * bell + breath) * fades(n, a, r)
    y = _reed_cache[key] * vel
    if swell is not None:
        n = len(y); y = y * (swell[0] + (swell[1] - swell[0]) * np.clip(np.arange(n) / (dur * SR), 0, 1))
    return y


def whistle(m, dur, vel=1.0, a=0.03, r=0.08):
    n = int((dur + r) * SR); t = np.arange(n) / SR
    f = note(m) * (1 + 0.003 * np.clip((t - 0.15) / 0.2, 0, 1) * np.sin(2 * np.pi * 6.0 * t))
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(ph) + 0.12 * np.sin(2 * ph + 0.5) + 0.035 * np.sin(3 * ph + 1)
    breath = bp(noise(n), 2000, 8000) * 0.035
    chiff = bp(noise(n), 1500, 6000) * np.exp(-t / 0.015) * 0.2
    return (x + breath + chiff) * fades(n, a, r) * vel


_bass_cache = {}
def ubass(m, vel=1.0, dur=0.55):
    key = (m, round(dur, 3))
    if key not in _bass_cache:
        n = int((dur + 0.12) * SR); t = np.arange(n) / SR; f = note(m)
        x = sum(a * np.sin(2 * np.pi * f * k * t + k) * np.exp(-t / d)
                for k, a, d in [(1, 1, .6), (2, .55, .32), (3, .28, .18), (4, .14, .1), (5, .07, .07), (6, .035, .05)])
        thump = lp(noise(n), 250) * np.exp(-t / 0.012) * 0.3
        _bass_cache[key] = (x + thump) * fades(n, 0.006, 0.12)
    return _bass_cache[key] * vel


_pluck_cache = {}
def pluck(m, vel=1.0):
    if m not in _pluck_cache:
        n = int(1.1 * SR); t = np.arange(n) / SR; f = note(m); x = np.zeros(n)
        for k in range(1, 11):
            if f * k > 9000: break
            x += k ** -1.3 * np.sin(2 * np.pi * f * k * t + PH[k]) * np.exp(-t / (0.7 / k ** 0.7))
        _pluck_cache[m] = x * fades(n, 0.003, 0.2) / 1.6
    return _pluck_cache[m] * vel


def bodhran(kind="low", vel=1.0):
    f0, f1, d, nz = {"low": (88, 62, 0.20, 0.25), "mid": (115, 92, 0.11, 0.3), "tip": (190, 170, 0.05, 0.45)}[kind]
    n = int(0.45 * SR); t = np.arange(n) / SR
    f = f1 + (f0 - f1) * np.exp(-t / 0.03); ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t / d) + 0.3 * np.sin(1.59 * ph) * np.exp(-t / (d * 0.6))
    skin = bp(noise(n), 300, 2500) * np.exp(-t / 0.02) * nz
    return (body + skin) * fades(n, 0.0015, 0.05) * vel


def stomp(vel=1.0):
    n = int(0.35 * SR); t = np.arange(n) / SR
    f = 55 + 35 * np.exp(-t / 0.01); body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.07)
    boards = bp(noise(n), 150, 900) * np.exp(-t / 0.035) * 0.6
    return (body + boards) * fades(n, 0.002, 0.05) * vel


def air_swell(dur):  # soft rising air into a reveal (band of noise sweeping up, no tone)
    n = int(dur * SR); x = noise(n); out = np.zeros(n); seg = 1024
    for k in range(0, n, seg):
        f = 600 + 2600 * (k / n) ** 1.5
        out[k:k + seg] = bp(x[max(0, k - 2048):k + seg], f * 0.7, min(f * 1.4, 18000))[-len(x[k:k + seg]):]
    t = np.arange(n) / n
    return out / (np.abs(out).max() + 1e-9) * t ** 2 * fades(n, 0.05, 0.12)


# ---------------- ocean ----------------
def waves_st(dur):
    n = int(dur * SR); t = np.arange(n) / SR; out = np.zeros((n, 2))
    for c, p0 in ((0, 0.0), (1, 1.7)):
        swell = (0.5 - 0.5 * np.cos(2 * np.pi * t / 5.6 + p0)) ** 1.5
        swell2 = (0.5 - 0.5 * np.cos(2 * np.pi * t / 3.7 + 2 * p0)) ** 2
        out[:, c] = lp(noise(n), 500) * (0.35 + 0.65 * swell) + bp(noise(n), 1200, 5000) * 0.22 * swell * swell2
    return out


def timber_creak(dur=1.1, lo=22, hi=48, res=(380, 720), dec=0.008):
    """Stick-slip wood creak: a slowly speeding/slowing train of soft grains through wooden resonances."""
    n = int(dur * SR); t = np.arange(n) / SR
    wob = np.cumsum(noise(n)); wob = lp(wob - np.linspace(wob[0], wob[-1], n), 3); wob /= np.abs(wob).max() + 1e-9
    rate = (lo + (hi - lo) * np.sin(np.pi * t / dur)) * (1 + 0.15 * wob)
    pos = np.cumsum(rate) / SR
    imp = np.zeros(n); idx = np.nonzero(np.diff(np.floor(pos)) > 0)[0]; imp[idx] = R.uniform(0.6, 1.0, len(idx))
    ks = int(0.04 * SR); tk = np.arange(ks) / SR
    kern = sum(np.sin(2 * np.pi * f * tk) * np.exp(-tk / dec) for f in res) * (1 - np.exp(-tk / 0.0006))
    y = bp(fftconvolve(imp, kern)[:n], 180, 3000) * np.sin(np.pi * t / dur) ** 0.7
    return y / (np.abs(y).max() + 1e-9) * fades(n, 0.02, 0.05)


def rope_creak(dur=0.6): return timber_creak(dur, 70, 130, (1150, 1900), 0.004)


# ---------------- the tune (original) ----------------
CH = {  # chord: (bass root, bass fifth, squeezebox voicing)
    "Dm": (38, 45, [57, 62, 65]), "C": (36, 43, [55, 60, 64]), "A": (33, 40, [57, 61, 64]),
    "F": (41, 48, [57, 60, 65]), "Bb": (34, 41, [58, 62, 65]), "Gm": (43, 50, [55, 58, 62]),
    "D": (38, 45, [57, 62, 66]), "Asus": (33, 40, [57, 62, 64]),
}
A = [("Dm", [(69, 2), (74, 1), (74, 2), (76, 1)]), ("C", [(72, 2), (69, 1), (67, 2), (64, 1)]),
     ("Dm", [(65, 2), (69, 1), (74, 2), (69, 1)]), ("A", [(64, 2), (67, 1), (69, 3)]),
     ("Dm", [(69, 2), (74, 1), (74, 2), (77, 1)]), ("C", [(76, 2), (72, 1), (67, 2), (72, 1)]),
     ("A", [(69, 2), (65, 1), (64, 2), (61, 1)]), ("Dm", [(62, 3), (62, 2), (None, 1)])]
B = [("F", [(77, 2), (76, 1), (74, 2), (72, 1)]), ("C", [(76, 2), (72, 1), (67, 2), (72, 1)]),
     ("Dm", [(74, 2), (69, 1), (65, 2), (69, 1)]), ("A", [(76, 3), (73, 2), (69, 1)]),
     ("F", [(77, 2), (76, 1), (74, 2), (72, 1)]), ("C", [(79, 2), (76, 1), (72, 2), (76, 1)]),
     ("Bb", [(74, 2), (70, 1), (67, 2), (70, 1)]), ("A", [(69, 3), (69, 2), (None, 1)])]
TUNE = A + B
KING = ("D", [(74, 2), (78, 1), (81, 3)])
RESOLVE = [("Dm", [(69, 3), (74, 3)]), ("Bb", [(77, 3), (74, 3)]), ("Gm", [(70, 3), (74, 2), (72, 1)]),
           ("A", [(73, 3), (76, 3)]), ("D", [(74, 6)])]


def _word(beats, bi, w):
    for p in beats[bi]["parts"]:
        for x in p.get("words", []):
            if x["w"].strip(",.?!\"'").lower() == w.lower(): return x["t0"]
    return None


def build(TL, dur_total):
    """Return the stereo music bed (instruments + ocean) for the whole Short, before ducking."""
    N = int(dur_total * SR); beats = TL["beats"]
    bus = {k: np.zeros(N) for k in ("fid", "reed", "whis", "bass", "pluck", "drum", "stomp", "air")}

    def put(name, x, t, g=1.0):
        i = int(round(t * SR))
        if i < 0: x = x[-i:]; i = 0
        n = min(len(x), N - i)
        if n > 0: bus[name][i:i + n] += x[:n] * g

    t_ship = beats[1]["start"]
    t_saw = _word(beats, 15, "Sawdust") or beats[15]["start"] + 1.1
    t_his = _word(beats, 15, "His") or beats[15]["start"]
    t_melt = _word(beats, 8, "melted") or beats[8]["start"] + 0.3
    nbars = max(1, round((t_saw - t_ship) / (2 * 60 / 105)))
    BAR = (t_saw - t_ship) / nbars; E = BAR / 6  # 6/8: six eighths per bar, two dotted-quarter beats
    bt = lambda k: t_ship + k * BAR
    kb = lambda t: int(round((t - t_ship) / BAR))
    k_kit0, k_kit1 = kb(beats[2]["start"]), kb(beats[3]["start"])
    k_light, k_melt = kb(beats[6]["start"]), int((t_melt - t_ship) // BAR)
    k_mid, k_build, k_sea = kb(beats[9]["start"]), kb(beats[11]["start"]), kb(beats[12]["start"])
    k_king, k_res = kb(beats[14]["start"]), nbars
    k_hold = k_res - 2; k_king = min(k_king, k_hold)

    def melody(k, notes, inst, vel, shift=0, cut=None):
        pos = 0
        for m, e in notes:
            t = bt(k) + pos * E; pos += e
            if m is None or (cut is not None and t >= cut): continue
            d = e * E - 0.012
            if inst == "fid": put("fid", fiddle(m + shift, d, vel, a=0.03 if e == 1 else 0.05, r=0.08), t)
            elif inst == "whis": put("whis", whistle(m + shift, d, vel), t)
            elif inst == "reed": put("reed", reed(m + shift, d, vel, 0.025, 0.07), t)

    def comp(k, chord, style, en=1.0, cut=None, stomps=0.0):
        root, fifth, voic = CH[chord]; b0 = bt(k)
        ok = lambda t: cut is None or t < cut
        if style in ("full", "mid"):
            for e, v in ((0, 0.9), (3, 0.75)):
                if ok(b0 + e * E): put("bass", ubass(root if e == 0 else fifth, v * en, 2.6 * E), b0 + e * E)
            for e, v in ((1, .5), (2, .38), (4, .5), (5, .38)):  # squeezebox "oom-pa-pa" stabs
                if ok(b0 + e * E):
                    for j, m in enumerate(voic): put("reed", reed(m, 0.13, v * en * (0.8 if style == "mid" else 1), 0.02, 0.07), b0 + e * E + j * 0.004)
            pat = [(0, "low", 1.0), (2, "tip", .4), (3, "mid", .75), (4, "tip", .3), (5, "tip", .45)]
            for e, kind, v in pat:
                if ok(b0 + e * E): put("drum", bodhran(kind, v * en * (0.7 if style == "mid" else 1)), b0 + e * E)
            if stomps:
                for e in (0, 3):
                    if ok(b0 + e * E): put("stomp", stomp(stomps * en), b0 + e * E)
        elif style in ("light", "sparse", "resolve"):
            pad_d = BAR + 0.05 if cut is None else max(0.2, cut - b0 - 0.1)
            for j, m in enumerate(voic):
                put("reed", reed(m, pad_d, (0.32 if style != "resolve" else 0.38) * en, 0.18, 0.25), b0 + j * 0.01)
            put("bass", ubass(root, 0.7 * en, 2.8 * E), b0)
            if ok(b0 + 3 * E) and style != "sparse": put("bass", ubass(fifth, 0.4 * en, 2.8 * E), b0 + 3 * E)
            arp = [voic[0] + 12, voic[1] + 12, voic[2] + 12] if style != "sparse" else [voic[0] + 12]
            for e, m in zip((0, 2, 4), arp):
                if ok(b0 + e * E): put("pluck", pluck(m, 0.4 * en), b0 + e * E)
            if style == "light":
                for e, kind, v in ((0, "low", .35), (3, "tip", .2)):
                    if ok(b0 + e * E): put("drum", bodhran(kind, v * en), b0 + e * E)

    # --- intro: night pond, low drone + tin whistle ---
    for m, v in ((38, 0.30), (45, 0.24), (50, 0.16)):
        put("reed", reed(m, t_ship - 0.25, v, 1.4, 0.45), 0.05)
    t = 0.9
    for m, d in ((81, 0.45), (79, 0.22), (77, 0.22), (76, 0.45), (74, 1.3)):
        put("whis", whistle(m, d, 0.45, 0.06, 0.18), t); t += d
    for j in range(8):  # soft bodhran pickup roll into the ship
        tt = t_ship - 0.62 + j * 0.62 / 8
        put("drum", bodhran("tip", 0.12 + 0.3 * j / 7), tt)
    put("fid", fiddle(64, E - 0.012, 0.5, 0.03, 0.08), t_ship - 2 * E)
    put("fid", fiddle(67, E - 0.012, 0.6, 0.03, 0.08), t_ship - E)

    # --- full shanty: the ship sails (Boston, kitchen, hot places, Tudor, Boston laughs) ---
    for k in range(0, k_light):
        tb = k % 16 if k < k_light - 2 else 14 + (k - (k_light - 2))
        chord, notes = TUNE[tb]
        en = 0.8 if k_kit0 <= k < k_kit1 else 0.95
        melody(k, notes, "fid", 0.8 * en)
        comp(k, chord, "full", en, stomps=0.45)
    # --- Martinique: lighter, warmer; tin whistle melody over guitar and squeezebox ---
    for k in range(k_light, k_melt + 1):
        chord, notes = A[(k - k_light) % 8]
        cut = t_melt - 0.2 if k == k_melt else None
        melody(k, notes, "whis", 0.5, 12, cut)
        comp(k, chord, "light", 1.0, cut)
    # --- the melt: a descending fiddle slide (comic sting), then a sparse sad-comic vamp ---
    sd = 1.0
    def sag(t, f0=note(81), f1=note(60)):
        u = np.clip(t / sd, 0, 1); return f0 * (f1 / f0) ** (u ** 1.4) * (1 + 0.012 * u * np.sin(2 * np.pi * 4.5 * t))
    put("fid", fiddle(81, sd, 0.7, a=0.03, r=0.25, cresc=(1.0, 0.45), fcurve=sag), t_melt - 0.02)
    put("bass", ubass(38, 0.6, 0.8), t_melt + sd - 0.05)
    for j, k in enumerate(range(k_melt + 1, k_mid)):
        comp(k, ["Dm", "Bb", "A"][min(j, 2) if k < k_mid - 1 else 2], "sparse", 0.9)
    # --- trying hay, straw, rice husks; the workshop: the shanty again, a bit lighter ---
    for k in range(k_mid, k_build):
        chord, notes = A[(k - k_mid) % 8]
        melody(k, notes, "fid", 0.65)
        comp(k, chord, "mid", 0.85)
    # --- the Calcutta voyage: B phrase then the A cadence, building to the arrival ---
    L = k_king - k_build
    for j, k in enumerate(range(k_build, k_king)):
        chord, notes = A[4 + j - (L - 4)] if j >= L - 4 else B[j % 8]
        en = 0.85 + 0.2 * j / max(1, L - 1)
        melody(k, notes, "fid", 0.82 * en)
        if k >= k_sea: melody(k, notes, "reed", 0.32 * en)  # squeezebox doubles the tune at sea
        comp(k, chord, "full", en, stomps=0.55)
    # --- "the Ice King": a bright D-major bar ---
    for k in range(k_king, k_hold):
        chord, notes = KING
        melody(k, notes, "fid", 0.95); melody(k, notes, "whis", 0.35)
        comp(k, chord, "full", 1.1, stomps=0.6)
    # --- held suspense into "His secret?": sustained Asus4, bowed tremolo swell, soft roll + air (no dead air) ---
    th = bt(k_hold); hd = t_saw - th + 0.06
    for j, m in enumerate(CH["Asus"][2]):
        put("reed", reed(m, hd, 0.42, 0.12, 0.2, swell=(0.6, 1.0)), th + j * 0.01)
    put("fid", fiddle(76, hd, 0.5, a=0.15, r=0.2, trem=0.25, cresc=(0.6, 1.0)), th)
    put("bass", ubass(33, 0.7, 1.0), th); put("bass", ubass(33, 0.45, 1.0), th + BAR)
    n_roll = 14
    for j in range(n_roll):
        u = j / (n_roll - 1); put("drum", bodhran("tip", 0.08 + 0.25 * u), t_saw - 0.85 + 0.85 * (u ** 0.8) - 0.03)
    put("air", air_swell(max(0.4, t_his - th + 0.1)), th)
    # --- payoff: a warm resolving phrase, ending on a held D major ---
    for j, (chord, notes) in enumerate(RESOLVE):
        k = k_res + j
        if bt(k) >= dur_total: break
        last = j == len(RESOLVE) - 1
        if last:
            hold_d = dur_total - bt(k) + 0.3
            for i2, m in enumerate(CH["D"][2]): put("reed", reed(m, hold_d, 0.36, 0.25, 0.3), bt(k) + i2 * 0.012)
            put("bass", ubass(38, 0.65, 1.2), bt(k))
            for i2, m in enumerate([62, 66, 69, 74]): put("pluck", pluck(m, 0.38), bt(k) + i2 * 0.07)
            put("fid", fiddle(74, hold_d, 0.55, a=0.1, r=0.3), bt(k))
        else:
            comp(k, chord, "resolve", 0.9)
            pos = 0
            for m, e in notes:
                put("fid", fiddle(m, e * E - 0.01, 0.55, a=0.08, r=0.12), bt(k) + pos * E); pos += e

    # --- instrument colour, stereo placement and a light hall ---
    bus["fid"] = bp(bus["fid"], 190, 7000) + 0.35 * bp(bus["fid"], 2400, 3600) + 0.25 * bp(bus["fid"], 260, 330)
    bus["reed"] = lp(bus["reed"], 5200)
    bus["whis"] = lp(bus["whis"], 9000)
    bus["drum"] = lp(bus["drum"], 4000); bus["stomp"] = lp(bus["stomp"], 2500)
    gains = {"fid": (0.55, 0.22), "reed": (0.55, -0.22), "whis": (0.5, 0.32), "bass": (0.75, 0.0),
             "pluck": (0.45, -0.38), "drum": (0.5, -0.08), "stomp": (0.35, 0.12), "air": (0.08, 0.0)}
    st = np.zeros((N, 2))
    for name, (g, pan) in gains.items():
        x = bus[name] * g
        st[:, 0] += x * np.sqrt(0.5 * (1 - pan)) * 1.414; st[:, 1] += x * np.sqrt(0.5 * (1 + pan)) * 1.414
    st = hall(st, 1.5, 0.24)
    active = st[int(t_ship * SR):]
    st *= 0.26 / (np.sqrt((active ** 2).mean()) + 1e-9)

    # --- ocean: wave wash, ship timbers and rope under the sea and ship scenes ---
    oc = np.zeros((N, 2))
    b = beats
    zones = [(b[1]["start"] - 0.2, b[1]["end"], 0.9, True, True), (b[6]["start"], b[9]["start"], 0.4, False, False),
             (b[11]["start"] - 0.2, b[12]["start"], 0.8, True, True), (b[12]["start"], b[13]["start"], 1.2, True, True),
             (b[13]["start"], b[14]["start"], 0.7, True, False), (b[15]["start"], dur_total, 0.25, True, False)]
    for t0, t1, g, creaks, ropes in zones:
        d = t1 - t0 + 0.4; w = waves_st(d) * fades(int(d * SR), 0.4, 0.4)[:, None]
        i = int(t0 * SR); n = min(len(w), N - i); oc[i:i + n] += w[:n] * g * 0.5
        tt = t0 + R.uniform(0.3, 1.0)
        while creaks and tt < t1 - 1.0:
            c = timber_creak(R.uniform(0.8, 1.4)); pan = R.uniform(-0.6, 0.6); i = int(tt * SR); n = min(len(c), N - i)
            oc[i:i + n, 0] += c[:n] * 0.11 * np.sqrt(0.5 * (1 - pan)) * 1.414; oc[i:i + n, 1] += c[:n] * 0.11 * np.sqrt(0.5 * (1 + pan)) * 1.414
            if ropes and tt + 1.3 < t1:
                rr = rope_creak(R.uniform(0.45, 0.7)); j = int((tt + 1.2) * SR); n = min(len(rr), N - j)
                oc[j:j + n] += rr[:n, None] * 0.05
            tt += R.uniform(2.2, 3.4)
    oc = hall(oc, 0.9, 0.15)
    return st + oc


def hall(x, secs=1.5, wet=0.24, pre=0.018):
    """Light room/hall reverb with a different tail per channel (gentle stereo spread)."""
    n = int(secs * SR); t = np.arange(n) / SR; out = np.empty_like(x)
    for c in range(2):
        ir = lp(noise(n) * np.exp(-6.9 * t / secs), 6000)
        ir = np.concatenate([np.zeros(int(pre * SR)), ir / np.sqrt((ir ** 2).sum())])
        out[:, c] = fftconvolve(x[:, c], ir)[:len(x)]
    return x * (1 - wet) + out * wet
