# Genera los efectos de sonido y la base musical de los reels (sintetizados, sin licencias ni API).
# Uso: python3 sfx.py  -> escribe public/sfx/*.wav
import os
import numpy as np
import soundfile as sf

SR = 44100
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'public', 'sfx')
rng = np.random.default_rng(7)

def t(sec): return np.arange(int(SR * sec)) / SR

def env(n, a=0.005, d=0.2, curve=4):
    x = np.arange(n) / SR
    e = np.minimum(1, x / max(a, 1e-4)) * np.exp(-curve * np.maximum(0, x - a) / d)
    return e

def lowpass(x, k):
    k = max(1, int(k)); return np.convolve(x, np.ones(k) / k, mode='same')

def norm(x, p=0.9): return x * (p / max(1e-6, np.abs(x).max()))

def whoosh():
    n = int(SR * 0.42); x = rng.standard_normal(n)
    # barrido: el ruido se va filtrando menos (sube de tono) y luego se apaga
    out = np.zeros(n); seg = 512
    for i in range(0, n, seg):
        p = i / n; k = int(40 - 34 * p)
        out[i:i + seg] = lowpass(x[i:i + seg + 64], k)[:len(out[i:i + seg])]
    e = np.sin(np.pi * np.linspace(0, 1, n)) ** 2
    return norm(out * e, 0.55)

def pop():
    tt = t(0.12); f = 900 * np.exp(-tt * 30) + 380
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(tt), 0.002, 0.04)
    return norm(s, 0.6)

def click():
    tt = t(0.05); s = rng.standard_normal(len(tt)) * env(len(tt), 0.0005, 0.008)
    s += np.sin(2 * np.pi * 2200 * tt) * env(len(tt), 0.0005, 0.015)
    return norm(s, 0.5)

def impact():
    tt = t(0.7); f = 120 * np.exp(-tt * 6) + 45
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(tt), 0.002, 0.25)
    noise = lowpass(rng.standard_normal(len(tt)), 6) * env(len(tt), 0.001, 0.06)
    return norm(np.tanh(2.5 * (body + 0.6 * noise)), 0.85)

def ding():
    tt = t(1.2); s = np.zeros(len(tt))
    for fr, a in ((1318.5, 1), (1975.5, 0.5), (2637, 0.25)):
        s += a * np.sin(2 * np.pi * fr * tt)
    return norm(s * env(len(tt), 0.002, 0.45, 3), 0.55)

def riser():
    tt = t(0.9); f = 200 + 900 * (tt / tt[-1]) ** 2
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.4 + lowpass(rng.standard_normal(len(tt)), 3) * 0.3
    return norm(s * (tt / tt[-1]) ** 2, 0.45)

def cash():
    a = ding()[: int(SR * 0.5)]
    c = np.zeros(int(SR * 0.6)); c[: len(click())] += click(); c[int(SR * 0.06): int(SR * 0.06) + len(a)] += a[: len(c) - int(SR * 0.06)]
    return norm(c, 0.6)

def musica():
    # base de 124 bpm, 8 compases: bombo, charles, bajo y acordes cortos
    bpm = 124; beat = 60 / bpm; bars = 8; n = int(SR * beat * 4 * bars)
    m = np.zeros(n)
    def put(sig, at):
        i = int(at * SR); j = min(n, i + len(sig)); m[i:j] += sig[: j - i]
    kt = t(0.35); kick = np.sin(2 * np.pi * np.cumsum(55 + 90 * np.exp(-kt * 25)) / SR) * env(len(kt), 0.001, 0.12)
    ht = t(0.05); hat = np.diff(rng.standard_normal(len(ht) + 1)) * env(len(ht), 0.0005, 0.012) * 0.25
    roots = [55.0, 55.0, 43.65, 49.0]  # La, La, Fa, Sol
    for b in range(bars * 4):
        at = b * beat
        put(kick * 0.9, at)
        put(hat, at + beat / 2); put(hat * 0.6, at + beat * 0.75)
        r = roots[(b // 4) % 4]
        bt = t(beat * 0.45); bass = np.sign(np.sin(2 * np.pi * r * 2 * bt)) * 0.18 * env(len(bt), 0.003, 0.12)
        put(lowpass(bass, 18), at + beat / 2)
        if b % 2 == 1:
            ct = t(0.18); ch = sum(np.sin(2 * np.pi * r * 8 * k * ct) for k in (1, 1.26, 1.5)) * env(len(ct), 0.002, 0.06) * 0.06
            put(ch, at + beat * 0.5)
    # sidechain suave para que "bombee"
    ph = (np.arange(n) / SR) % beat
    m *= 0.55 + 0.45 * np.minimum(1, ph / 0.12)
    return norm(np.tanh(1.4 * m), 0.8)

if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    for name, fn in [('whoosh', whoosh), ('pop', pop), ('click', click), ('impact', impact), ('ding', ding), ('riser', riser), ('cash', cash), ('musica', musica)]:
        sf.write(os.path.join(OUT, name + '.wav'), fn().astype(np.float32), SR)
    print('ok', sorted(os.listdir(OUT)))
