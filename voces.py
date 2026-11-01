# Genera la voz en off de cada escena con TTS local y gratuito (sin API ni tokens).
# Por defecto Piper con la voz castellana "davefx" (elegida por Martín). También: "sharvard-h", "sharvard-m" (Piper) y las de Kokoro (em_alex, ef_dora, em_santa).
# Uso: python3 voces.py guion.json carpeta_salida
# Lee "voz" de cada escena (texto a locutar), "narrador" y "velocidad" del guion.
# Escribe voz-<n>.wav y voces.json con la duración de cada audio.
import json, os, sys, urllib.request
import soundfile as sf
import numpy as np

AQUI = os.path.dirname(os.path.abspath(__file__))
MODELOS = os.path.join(AQUI, '.tts')
BASE = 'https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/'

def modelos():
    os.makedirs(MODELOS, exist_ok=True)
    for f in ('kokoro-v1.0.onnx', 'voices-v1.0.bin'):
        p = os.path.join(MODELOS, f)
        if not os.path.exists(p) or os.path.getsize(p) < 1_000_000:
            print('Descargando', f, file=sys.stderr)
            urllib.request.urlretrieve(BASE + f, p)
    return os.path.join(MODELOS, 'kokoro-v1.0.onnx'), os.path.join(MODELOS, 'voices-v1.0.bin')

PIPER = {  # narrador -> (modelo, speaker)
    'davefx': ('es_ES-davefx-medium', None),
    'sharvard-h': ('es_ES-sharvard-medium', 0),
    'sharvard-m': ('es_ES-sharvard-medium', 1),
}
PIPER_URL = {
    'es_ES-davefx-medium': 'https://raw.githubusercontent.com/aalonsopuig/Inmoov_ROS2/main/piper/es_ES-davefx-medium.onnx',
    'es_ES-sharvard-medium': 'https://raw.githubusercontent.com/SourisCG/SourisTTSPlayer/main/piper/es_ES-sharvard-medium.onnx',
}
CFG_URL = 'https://raw.githubusercontent.com/rhasspy/piper-samples/master/configs/'

def piper_voz(nombre):
    from piper import PiperVoice
    d = os.path.join(MODELOS, 'piper'); os.makedirs(d, exist_ok=True)
    onnx = os.path.join(d, nombre + '.onnx')
    if not os.path.exists(onnx) or os.path.getsize(onnx) < 1_000_000:
        print('Descargando', nombre, file=sys.stderr); urllib.request.urlretrieve(PIPER_URL[nombre], onnx)
    if not os.path.exists(onnx + '.json'):
        urllib.request.urlretrieve(CFG_URL + nombre + '.onnx.json', onnx + '.json')
    return PiperVoice.load(onnx)

def sintetizador(voz, vel):
    if voz in PIPER:
        from piper import SynthesisConfig
        modelo, spk = PIPER[voz]
        pv = piper_voz(modelo)
        cfg = SynthesisConfig(speaker_id=spk, length_scale=1 / vel, noise_scale=0.667, noise_w_scale=0.8)
        def f(t):
            ch = list(pv.synthesize(t, syn_config=cfg))
            a = np.concatenate([c.audio_float_array for c in ch])
            return a, ch[0].sample_rate
        return f
    from kokoro_onnx import Kokoro
    k = Kokoro(*modelos())
    return lambda t: k.create(t, voice=voz, speed=vel, lang='es')

def main(guion_path, out_dir):
    g = json.load(open(guion_path, encoding='utf8'))
    voz = g.get('narrador', 'davefx')
    vel = float(g.get('velocidad', 1.05))
    synth = sintetizador(voz, vel)
    os.makedirs(out_dir, exist_ok=True)
    res = []
    for i, sc in enumerate(g.get('scenes', [])):
        t = (sc.get('voz') or '').strip()
        if not t:
            res.append(None); continue
        a, sr = synth(t)
        # recorta silencios al principio y al final
        idx = np.where(np.abs(a) > 0.01)[0]
        if len(idx): a = a[max(0, idx[0] - sr // 20): idx[-1] + sr // 10]
        a = a * (0.9 / max(1e-6, float(np.abs(a).max())))  # normaliza volumen
        name = f'voz-{i}.wav'
        sf.write(os.path.join(out_dir, name), a, sr)
        res.append({'file': name, 'sec': round(len(a) / sr, 3)})
    json.dump(res, open(os.path.join(out_dir, 'voces.json'), 'w'))
    print(json.dumps(res))

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
