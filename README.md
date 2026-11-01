# Reels animados de MK Stays

Rama usada por la tarea automática "Dani · reels animados". No es la web.

- `npm ci` y luego `node render.mjs reels/<id>/guion.json reels/<id>/reel.mp4` renderiza un reel 1080x1920 con Remotion y la marca MK Stays (también crea `reel-portada.jpg`). Usa Chrome en /usr/bin/google-chrome (o la variable CHROME_PATH).
- Escenas disponibles en `guion.json` (`scenes`): `hook` {text:[3 líneas, la roja entre <r></r>], sub}, `point` {title, body, action}, `list` {title, items:[3]}, `quote` {text, by}, `cta` {word, text}.
- Estilo historia (pedido por Martín): `hook` y `point` aceptan `art` para mostrar una escena animada con personajes (Laura la anfitriona, un huésped con maleta) en lugar de solo texto. Escenas en `src/Art.jsx`: `noche` y `doble` (hook), `calendario`, `bloqueo`, `solucion`, `multa`, `ranking`, `sync`, `portada` (hook), `mirada`, `orden`, `flash`, `retirada` (hook), `decreto`, `contador`, `elegir`. Añade nuevas escenas allí para cada tema.
- Voz en off gratis y local (sin API ni tokens): cada escena puede llevar `voz` (texto que se locuta) y el guion `narrador` y `velocidad`. Por defecto Supertonic 3, voz `st-h2` (velocidad 1.1), elegida por Martín por sonar más humana. Otras: `st-h1`, `st-h3`, `st-m1`, `st-m2`, Piper `davefx`, Kokoro `em_alex`. `render.mjs` llama a `voces.py` (`pip install sherpa-onnx piper-tts kokoro-onnx soundfile --break-system-packages`; los modelos se descargan solos de GitHub a `.tts/`). La escena dura lo que dure su voz. Escribe en `voz` las palabras como se pronuncian ("Érbiembí", "chánel mánayer", números en letra).
- `reels/<id>/` guarda guion, vídeo y portada. Instagram y Metricool leen el vídeo desde la URL raw de GitHub.
- `historial.md` evita repetir temas y guarda lo que Martín pidió cambiar.
- Ritmo rápido (pedido de Martín: sin silencios y más dinámico): pon `"ritmo": "rapido"` en el guion. Cada escena dura lo que su voz más 8 fotogramas, la voz entra a la vez que la cortinilla y cada escena entra con un golpe de zoom.
- Sonido (pedido de Martín: "añade sonidos y efectos, más dopamínico"): pon `"sfx": true` en el guion. Añade base musical a 124 bpm y efectos (whoosh en cada cortinilla, pop en titulares y "Haz esto", impact, ding, cash, riser) desde `public/sfx/`, generados con `python3 sfx.py` (sintetizados, sin licencias). Efectos propios de cada ilustración en `ART_SFX` (`src/Art.jsx`). `"musica": false` quita solo la música. Úsalo junto a `"ritmo": "rapido"`.
- La portada se saca en el fotograma 66 (2,2 s), con las tres líneas del gancho ya en pantalla.
