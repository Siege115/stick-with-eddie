"""Narration: one WAV per beat part, plus timing info (duration, speech on/off).
Local Kokoro voice is the fallback for ElevenLabs "Mark". If a file named
b<NN>_<part>.mark.wav exists (e.g. dropped in from ElevenLabs), it is used instead.
Usage: python3 src/tts.py <lines.json> <outdir>
"""
import json, sys, os, hashlib
import numpy as np
import soundfile as sf

VOICES = {"narrator": ("am_michael", 1.0, "en-us"), "expert": ("bm_lewis", 0.85, "en-gb"), "merchant": ("am_adam", 0.95, "en-us"), "narratorBrisk": ("am_michael", 1.16, "en-us")}  # merchant: neutral, polite, no accent

def speech_bounds(x, sr):
    win = int(sr * 0.01)
    n = len(x) // win
    e = np.sqrt(np.mean(x[: n * win].reshape(n, win) ** 2, axis=1))
    thr = max(e.max() * 0.06, 1e-4)
    idx = np.where(e > thr)[0]
    if len(idx) == 0:
        return 0.0, len(x) / sr
    return idx[0] * win / sr, (idx[-1] + 1) * win / sr

def main():
    lines = json.load(open(sys.argv[1]))
    out = sys.argv[2]
    os.makedirs(out, exist_ok=True)
    k = None
    info = []
    for i, ln in enumerate(lines):
        parts = []
        for j, part in enumerate(ln["parts"]):
            vname = part.get("voice", "narrator")
            voice, speed, lang = VOICES[vname]
            key = hashlib.md5(f"{voice}|{speed}|{part['text']}".encode()).hexdigest()[:10]
            path = f"{out}/b{i+1:02d}_{j}.{key}.wav"
            mark = f"{out}/b{i+1:02d}_{j}.mark.wav"
            if os.path.exists(mark) and vname == "narrator":
                path = mark
            elif not os.path.exists(path):
                if k is None:
                    from kokoro_onnx import Kokoro
                    k = Kokoro("models/kokoro.onnx", "models/voices.bin")
                samples, sr = k.create(part["text"], voice=voice, speed=speed, lang=lang)
                sf.write(path, samples, sr)
            x, sr = sf.read(path, dtype="float32")
            if x.ndim > 1:
                x = x.mean(axis=1)
            on, off = speech_bounds(x, sr)
            parts.append({"file": path, "dur": len(x) / sr, "on": on, "off": off, "text": part["text"], "voice": vname})
        info.append({"parts": parts})
    json.dump(info, open(f"{out}/info.json", "w"), indent=1)
    print("narration ok:", sum(p["dur"] for b in info for p in b["parts"]).__round__(2), "s of speech")

main()
