// Uso: node render.mjs ruta/guion.json ruta/salida.mp4
// Renderiza el reel 1080x1920 con la marca MK Stays a partir del guion JSON.
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition, renderStill } from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const [, , jsonPath, outPath] = process.argv;
if (!jsonPath || !outPath) { console.error('Uso: node render.mjs guion.json salida.mp4'); process.exit(1); }
const inputProps = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
// Voz en off: si alguna escena trae "voz", se genera con Kokoro (local, gratis) en public/_voz/<id>/
if ((inputProps.scenes || []).some((s) => s.voz)) {
  const id = path.basename(path.dirname(path.resolve(jsonPath)));
  const dir = path.resolve('public/_voz', id);
  fs.rmSync(dir, { recursive: true, force: true });
  execFileSync('python3', ['voces.py', jsonPath, dir], { stdio: ['ignore', 'ignore', 'inherit'] });
  const voces = JSON.parse(fs.readFileSync(path.join(dir, 'voces.json'), 'utf8'));
  inputProps.scenes.forEach((s, i) => { if (voces[i]) { s.audio = `_voz/${id}/${voces[i].file}`; s.audioSec = voces[i].sec; } });
}
const browserExecutable = process.env.CHROME_PATH || (fs.existsSync('/usr/bin/google-chrome') ? '/usr/bin/google-chrome' : null);

const serveUrl = await bundle({ entryPoint: path.resolve('src/index.jsx'), publicDir: path.resolve('public') });
const composition = await selectComposition({ serveUrl, id: 'Reel', inputProps, browserExecutable });
await renderMedia({
  composition, serveUrl, codec: 'h264', outputLocation: outPath, inputProps, browserExecutable,
  crf: 20, x264Preset: 'veryfast', pixelFormat: 'yuv420p', concurrency: 2,
  chromiumOptions: { gl: 'swangle' },
});
// Portada: el gancho con las tres líneas ya en pantalla
const cover = outPath.replace(/\.mp4$/, '-portada.jpg');
await renderStill({ composition, serveUrl, output: cover, inputProps, frame: 66, imageFormat: 'jpeg', browserExecutable });
console.log(JSON.stringify({ video: outPath, portada: cover, segundos: composition.durationInFrames / composition.fps }));
