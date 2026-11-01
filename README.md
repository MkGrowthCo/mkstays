# Reels animados de MK Stays

Rama usada por la tarea automática "Dani · reels animados". No es la web.

- `npm ci` y luego `node render.mjs reels/<id>/guion.json reels/<id>/reel.mp4` renderiza un reel 1080x1920 con Remotion y la marca MK Stays (también crea `reel-portada.jpg`). Usa Chrome en /usr/bin/google-chrome (o la variable CHROME_PATH).
- Escenas disponibles en `guion.json` (`scenes`): `hook` {text:[3 líneas, la roja entre <r></r>], sub}, `point` {title, body, action}, `list` {title, items:[3]}, `quote` {text, by}, `cta` {word, text}.
- Estilo historia (pedido por Martín): `hook` y `point` aceptan `art` para mostrar una escena animada con personajes (Laura la anfitriona, un huésped con maleta) en lugar de solo texto. Escenas en `src/Art.jsx`: `noche` y `doble` (hook), `calendario`, `bloqueo`, `solucion`, `multa`, `ranking`, `sync`. Añade nuevas escenas allí para cada tema.
- Voz en off gratis y local (sin API ni tokens): cada escena puede llevar `voz` (texto que se locuta) y el guion `narrador` (`em_alex` por defecto, `ef_dora`, `em_santa`) y `velocidad` (1.15). `render.mjs` llama a `voces.py`, que usa Kokoro TTS (`pip install kokoro-onnx soundfile --break-system-packages`; los modelos se descargan solos de GitHub a `.tts/`). La escena dura lo que dure su voz. Escribe en `voz` las palabras como se pronuncian ("Érbiembí", "chánel mánayer", números en letra).
- `reels/<id>/` guarda guion, vídeo y portada. Instagram y Metricool leen el vídeo desde la URL raw de GitHub.
- `historial.md` evita repetir temas y guarda lo que Martín pidió cambiar.
