// Uso: node render.mjs ruta/guion.json ruta/salida.mp4
// Renderiza el reel 1080x1920 con la marca MK Stays a partir del guion JSON.
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition, renderStill } from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';

const [, , jsonPath, outPath] = process.argv;
if (!jsonPath || !outPath) { console.error('Uso: node render.mjs guion.json salida.mp4'); process.exit(1); }
const inputProps = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const browserExecutable = process.env.CHROME_PATH || (fs.existsSync('/usr/bin/google-chrome') ? '/usr/bin/google-chrome' : null);

const serveUrl = await bundle({ entryPoint: path.resolve('src/index.jsx'), publicDir: path.resolve('public') });
const composition = await selectComposition({ serveUrl, id: 'Reel', inputProps, browserExecutable });
await renderMedia({
  composition, serveUrl, codec: 'h264', outputLocation: outPath, inputProps, browserExecutable,
  crf: 20, x264Preset: 'veryfast', pixelFormat: 'yuv420p', concurrency: 2,
  chromiumOptions: { gl: 'swangle' },
});
// Portada: el gancho a mitad de su animación de entrada
const cover = outPath.replace(/\.mp4$/, '-portada.jpg');
await renderStill({ composition, serveUrl, output: cover, inputProps, frame: 40, imageFormat: 'jpeg', browserExecutable });
console.log(JSON.stringify({ video: outPath, portada: cover, segundos: composition.durationInFrames / composition.fps }));
