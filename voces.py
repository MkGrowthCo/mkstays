# Genera la voz en off de cada escena con Kokoro (TTS local y gratuito, sin API ni tokens).
# Uso: python3 voces.py guion.json carpeta_salida
# Lee "voz" de cada escena (texto a locutar) y "narrador" del guion (ef_dora, em_alex o em_santa).
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

def main(guion_path, out_dir):
    from kokoro_onnx import Kokoro
    g = json.load(open(guion_path, encoding='utf8'))
    voz = g.get('narrador', 'em_alex')
    vel = float(g.get('velocidad', 1.1))
    k = Kokoro(*modelos())
    os.makedirs(out_dir, exist_ok=True)
    res = []
    for i, sc in enumerate(g.get('scenes', [])):
        t = (sc.get('voz') or '').strip()
        if not t:
            res.append(None); continue
        a, sr = k.create(t, voice=voz, speed=vel, lang='es')
        # recorta silencios al principio y al final
        idx = np.where(np.abs(a) > 0.01)[0]
        if len(idx): a = a[max(0, idx[0] - 1200): idx[-1] + 2400]
        a = a * (0.9 / max(1e-6, float(np.abs(a).max())))  # normaliza volumen
        name = f'voz-{i}.wav'
        sf.write(os.path.join(out_dir, name), a, sr)
        res.append({'file': name, 'sec': round(len(a) / sr, 3)})
    json.dump(res, open(os.path.join(out_dir, 'voces.json'), 'w'))
    print(json.dumps(res))

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
