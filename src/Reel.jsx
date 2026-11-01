import React from 'react';
import { ART, ART_SFX, Host } from './Art.jsx';
import {
  AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring,
  staticFile, delayRender, continueRender, Easing, Audio,
} from 'remotion';

export const FPS = 30;
const INK = '#0D0D0D', CREAM = '#F1EFEA', RED = '#FF3B1F', GREY = '#3A3A37', SOFT = '#D6D4CE';
const FONT = "'Archivo', 'Arial Narrow', sans-serif";

// Fuente de la marca (Archivo con eje de anchura), cargada antes de renderizar
const handle = delayRender('Cargando Archivo');
const face = new FontFace('Archivo', `url(${staticFile('archivo.woff2')}) format('woff2')`, { weight: '100 900', stretch: '62% 125%' });
face.load().then((f) => { document.fonts.add(f); continueRender(handle); }).catch(() => continueRender(handle));

// ---------- duración de cada escena según su texto ----------
const len = (s) => (Array.isArray(s) ? s.join(' ') : String(s || '')).replace(/<\/?r>/g, '').length;
export const VOZ_DELAY = 8; // la voz entra tras la cortinilla
// Ritmo "rapido" (pedido de Martín: sin silencios y más dinámico): la escena dura lo que su voz
// más un respiro mínimo, la voz entra casi a la vez que la cortinilla y cada escena entra con un golpe de zoom.
export const VOZ_DELAY_RAPIDO = 2;
export function sceneFrames(sc, ritmo) {
  const base = sceneFramesTexto(sc);
  if (ritmo === 'rapido' && sc.audioSec) return Math.max(Math.round(2 * FPS), Math.ceil(sc.audioSec * FPS) + VOZ_DELAY_RAPIDO + 2);
  return sc.audioSec ? Math.max(base, Math.ceil(sc.audioSec * FPS) + VOZ_DELAY + 14) : base;
}
function sceneFramesTexto(sc) {
  const read = (chars) => Math.round(Math.min(7.5, Math.max(2.6, 1.2 + chars / 15)) * FPS);
  switch (sc.type) {
    case 'hook': return read(len(sc.text) + len(sc.sub) * 0.6) + (sc.art ? 15 : 0);
    case 'point': return read(len(sc.title) + len(sc.body) + len(sc.action)) + (sc.art ? 20 : 0);
    case 'list': return read(len(sc.title) + len(sc.items) * 1.1) + 10;
    case 'quote': return read(len(sc.text) + len(sc.by));
    case 'cta': return Math.round(4.2 * FPS);
    default: return 3 * FPS;
  }
}
export const totalFrames = (p) => (p.scenes || []).reduce((a, s) => a + sceneFrames(s, p.ritmo), 0) || 90;

// ---------- utilidades de animación ----------
const useIn = (delay = 0, cfg = { damping: 14, stiffness: 140, mass: 0.7 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  return spring({ frame: f - delay, fps, config: cfg });
};
const Rich = ({ s }) => {
  const parts = String(s).split(/(<r>.*?<\/r>)/g).filter(Boolean);
  return parts.map((p, i) => p.startsWith('<r>') ? <span key={i} style={{ color: RED }}>{p.slice(3, -4)}</span> : <span key={i}>{p}</span>);
};
// Palabra a palabra, subiendo desde abajo
const Words = ({ text, start = 0, step = 3, style }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const words = String(text).split(' ');
  return (
    <span style={style}>
      {words.map((w, i) => {
        const p = spring({ frame: f - start - i * step, fps, config: { damping: 16, stiffness: 160 } });
        return (
          <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', marginRight: '0.24em', paddingTop: '0.16em', marginTop: '-0.16em' }}>
            <span style={{ display: 'inline-block', transform: `translateY(${(1 - p) * 110}%)`, opacity: p }}>{w}</span>
          </span>
        );
      })}
    </span>
  );
};

// ---------- marco común: barra de progreso, REC y usuario ----------
const Frame = ({ index, count, dark, label, children, hideBrand }) => {
  const f = useCurrentFrame();
  const fg = dark ? CREAM : INK;
  const blink = Math.floor(f / 15) % 2 === 0;
  return (
    <AbsoluteFill style={{ background: dark ? INK : CREAM, color: fg, fontFamily: FONT, padding: '150px 96px 170px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 34, fontWeight: 700, fontStretch: '80%', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ width: 24, height: 24, borderRadius: 12, background: RED, opacity: blink ? 1 : 0.25 }} />{label}
        </span>
        {hideBrand ? <span /> : <span style={{ color: dark ? '#A3A39D' : '#6b6458' }}>MK Stays</span>}
      </div>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>{children}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
        <div style={{ display: 'flex', gap: 10 }}>
          {Array.from({ length: count }).map((_, i) => (
            <span key={i} style={{ flex: 1, height: 10, background: i < index ? fg : i === index ? RED : (dark ? GREY : '#CFCCC4') }} />
          ))}
        </div>
        <div style={{ fontSize: 36, fontWeight: 800, fontStretch: '80%', letterSpacing: '0.06em', textTransform: 'uppercase' }}>@mkstays.agency</div>
      </div>
    </AbsoluteFill>
  );
};

// Cortinilla roja al entrar en cada escena
const Wipe = ({ fast }) => {
  const f = useCurrentFrame();
  const end = fast ? 6 : 9;
  const x = interpolate(f, [0, end], [0, 110], { extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });
  if (f > end + 1) return null;
  return <AbsoluteFill style={{ background: RED, transform: `translateX(${x}%)` }} />;
};

// Golpe de zoom al entrar en la escena (ritmo rápido). El temblor nunca deja ver el borde.
const Punch = ({ children }) => {
  const f = useCurrentFrame();
  const sc = interpolate(f, [0, 10], [1.09, 1], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const room = 500 * (sc - 1);
  const sh = f < 10 ? Math.max(-room, Math.min(room, Math.sin(f * 2.4) * (10 - f) * 1.6)) : 0;
  return <AbsoluteFill style={{ transform: `scale(${sc}) translate(${sh}px, ${-sh * 0.5}px)` }}>{children}</AbsoluteFill>;
};

// ---------- escenas ----------
const Hook = ({ sc, i, n }) => {
  if (sc.art && ART[sc.art]) return <HookArt sc={sc} i={i} n={n} />;
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const lines = sc.text || [];
  const corner = useIn(0);
  const sz = Math.min(230, Math.floor(1950 / Math.max(...lines.map((l) => len(l)), 6)));
  return (
    <Frame index={i} count={n} dark label="Rec">
      {[['left', 'top'], ['right', 'top'], ['left', 'bottom'], ['right', 'bottom']].map(([h, v], k) => (
        <div key={k} style={{ position: 'absolute', [h]: -40, [v]: -60, width: 90, height: 90, transform: `scale(${corner})`,
          [`border${v[0].toUpperCase() + v.slice(1)}`]: `8px solid ${RED}`, [`border${h[0].toUpperCase() + h.slice(1)}`]: `8px solid ${RED}` }} />
      ))}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {lines.map((l, k) => {
          const p = spring({ frame: f - 4 - k * 7, fps, config: { damping: 11, stiffness: 170, mass: 0.6 } });
          return (
            <div key={k} style={{ fontSize: sz, lineHeight: 0.9, fontWeight: 900, fontStretch: '62%', textTransform: 'uppercase', letterSpacing: '-0.01em',
              transform: `translateY(${(1 - p) * 60}px) scale(${1.25 - 0.25 * p})`, transformOrigin: 'left center', opacity: Math.min(1, p * 1.4) }}>
              <Rich s={l} />
            </div>
          );
        })}
        {sc.sub ? <Words text={sc.sub} start={8 + lines.length * 7} style={{ marginTop: 50, fontSize: 52, lineHeight: 1.3, color: SOFT, fontWeight: 500 }} /> : null}
      </div>
    </Frame>
  );
};

// Gancho ilustrado: escena animada arriba, titular abajo
const HookArt = ({ sc, i, n }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const lines = sc.text || [];
  const A = ART[sc.art];
  const sz = Math.min(170, Math.floor(1950 / Math.max(...lines.map((l) => len(l)), 6)));
  return (
    <Frame index={i} count={n} dark label={sc.label || 'Historia real'}>
      <div style={{ height: 640, marginTop: -40, marginBottom: 20 }}><A /></div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {lines.map((l, k) => {
          const p = spring({ frame: f - 4 - k * 7, fps, config: { damping: 11, stiffness: 170, mass: 0.6 } });
          return (
            <div key={k} style={{ fontSize: sz, lineHeight: 0.9, fontWeight: 900, fontStretch: '62%', textTransform: 'uppercase',
              transform: `translateY(${(1 - p) * 60}px)`, opacity: Math.min(1, p * 1.4) }}><Rich s={l} /></div>
          );
        })}
        {sc.sub ? <Words text={sc.sub} start={8 + lines.length * 7} style={{ marginTop: 36, fontSize: 46, lineHeight: 1.3, color: SOFT, fontWeight: 500 }} /> : null}
      </div>
    </Frame>
  );
};

// Capítulo ilustrado: escena con personajes arriba, texto corto abajo
const PointArt = ({ sc, i, n, num }) => {
  const A = ART[sc.art];
  const box = useIn(30 + len(sc.title) / 3 + len(sc.body) / 4);
  return (
    <Frame index={i} count={n} dark={false} hideBrand label={`Capítulo ${String(num).padStart(2, '0')}`}>
      <div style={{ height: 700, marginTop: -30 }}><A /></div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 26, marginTop: 10 }}>
        <Words text={sc.title} start={10} style={{ fontSize: 96, lineHeight: 0.92, fontWeight: 900, fontStretch: '62%', textTransform: 'uppercase' }} />
        {sc.body ? <Words text={sc.body} start={22} step={2} style={{ fontSize: 44, lineHeight: 1.3, color: '#2B2B29', fontWeight: 500 }} /> : null}
        {sc.action ? (
          <div style={{ background: INK, color: CREAM, padding: '22px 34px', display: 'flex', gap: 22, alignItems: 'center',
            transform: `translateY(${(1 - box) * 60}px)`, opacity: box }}>
            <span style={{ fontSize: 30, fontWeight: 800, fontStretch: '80%', letterSpacing: '0.08em', textTransform: 'uppercase', color: RED, flex: 'none' }}>Haz esto</span>
            <span style={{ fontSize: 42, lineHeight: 1.2, fontWeight: 700 }}>{sc.action}</span>
          </div>
        ) : null}
      </div>
    </Frame>
  );
};

const Point = ({ sc, i, n, num }) => {
  if (sc.art && ART[sc.art]) return <PointArt sc={sc} i={i} n={n} num={num} />;
  const f = useCurrentFrame();
  const big = useIn(0, { damping: 18, stiffness: 90 });
  const box = useIn(24 + len(sc.title) / 3 + len(sc.body) / 4);
  const line = interpolate(f, [10, 26], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const tSize = len(sc.title) > 26 ? 110 : 128;
  return (
    <Frame index={i} count={n} dark={false} hideBrand label={`Clave ${String(num).padStart(2, '0')}`}>
      <div style={{ position: 'absolute', right: -60, top: -120, fontSize: 640, lineHeight: 0.8, fontWeight: 900, fontStretch: '62%', color: RED,
        transform: `translateX(${(1 - big) * 300}px)`, opacity: big }}>{String(num).padStart(2, '0')}</div>
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 40 }}>
        <Words text={sc.title} start={4} style={{ fontSize: tSize, lineHeight: 0.92, fontWeight: 900, fontStretch: '62%', textTransform: 'uppercase' }} />
        <div style={{ height: 8, width: `${line}%`, background: INK }} />
        {sc.body ? <Words text={sc.body} start={18} step={2} style={{ fontSize: 50, lineHeight: 1.35, color: '#2B2B29', fontWeight: 500 }} /> : null}
        {sc.action ? (
          <div style={{ background: INK, color: CREAM, padding: '36px 44px', display: 'flex', flexDirection: 'column', gap: 14,
            transform: `translateY(${(1 - box) * 80}px)`, opacity: box }}>
            <span style={{ fontSize: 34, fontWeight: 800, fontStretch: '80%', letterSpacing: '0.08em', textTransform: 'uppercase', color: RED }}>Haz esto</span>
            <span style={{ fontSize: 52, lineHeight: 1.25, fontWeight: 700 }}>{sc.action}</span>
          </div>
        ) : null}
      </div>
    </Frame>
  );
};

const List = ({ sc, i, n }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const items = sc.items || [];
  return (
    <Frame index={i} count={n} dark label="Checklist">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 56 }}>
        <Words text={sc.title} start={2} style={{ fontSize: 120, lineHeight: 0.92, fontWeight: 900, fontStretch: '62%', textTransform: 'uppercase' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 34 }}>
          {items.map((it, k) => {
            const p = spring({ frame: f - 16 - k * 12, fps, config: { damping: 13, stiffness: 150 } });
            const tick = spring({ frame: f - 26 - k * 12, fps, config: { damping: 10, stiffness: 200 } });
            return (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 34, transform: `translateX(${(1 - p) * -120}px)`, opacity: p }}>
                <span style={{ flex: 'none', width: 74, height: 74, border: `6px solid ${RED}`, display: 'grid', placeItems: 'center' }}>
                  <span style={{ width: 40, height: 40, background: RED, transform: `scale(${tick})` }} />
                </span>
                <span style={{ fontSize: 60, lineHeight: 1.15, fontWeight: 700 }}>{it}</span>
              </div>
            );
          })}
        </div>
      </div>
    </Frame>
  );
};

const Quote = ({ sc, i, n }) => {
  const q = useIn(0);
  return (
    <Frame index={i} count={n} dark={false} label="Ojo">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
        <div style={{ fontSize: 260, lineHeight: 0.6, fontWeight: 900, color: RED, transform: `scale(${q})`, transformOrigin: 'left' }}>“</div>
        <Words text={sc.text} start={6} step={3} style={{ fontSize: 96, lineHeight: 1.02, fontWeight: 900, fontStretch: '70%', textTransform: 'uppercase' }} />
        {sc.by ? <Words text={sc.by} start={30} style={{ fontSize: 44, color: '#4a4a47', fontWeight: 600 }} /> : null}
      </div>
    </Frame>
  );
};

const Cta = ({ sc, i, n }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const a = useIn(2, { damping: 12, stiffness: 160 });
  const b = spring({ frame: f - 12, fps, config: { damping: 8, stiffness: 180, mass: 0.8 } });
  const pulse = 1 + Math.sin(f / 5) * 0.025 * Math.min(1, Math.max(0, (f - 30) / 10));
  const word = String(sc.word || 'AUDITORÍA');
  const ws = Math.min(280, Math.floor(1500 / Math.max(5, word.length)));
  return (
    <AbsoluteFill style={{ background: RED, color: INK, fontFamily: FONT, padding: '150px 96px 170px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ fontSize: 34, fontWeight: 700, fontStretch: '80%', letterSpacing: '0.08em', textTransform: 'uppercase' }}>¿Tienes un alojamiento turístico?</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 40, alignItems: 'flex-start' }}>
        <div style={{ fontSize: 210, lineHeight: 0.85, fontWeight: 900, fontStretch: '62%', textTransform: 'uppercase', transform: `translateY(${(1 - a) * 80}px)`, opacity: a }}>Comenta</div>
        <div style={{ background: INK, color: CREAM, padding: '30px 52px 10px', fontSize: ws, lineHeight: 0.86, fontWeight: 900, fontStretch: '62%', textTransform: 'uppercase',
          transform: `scale(${b * pulse})`, transformOrigin: 'left center' }}>{word}</div>
        <Words text={sc.text || ''} start={26} style={{ fontSize: 56, lineHeight: 1.3, fontWeight: 700, maxWidth: 860 }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
        <div style={{ display: 'flex', gap: 10 }}>{Array.from({ length: n }).map((_, k) => <span key={k} style={{ flex: 1, height: 10, background: INK }} />)}</div>
        <div style={{ fontSize: 44, fontWeight: 900, fontStretch: '80%', letterSpacing: '0.06em', textTransform: 'uppercase' }}>@mkstays.agency</div>
      </div>
    </AbsoluteFill>
  );
};

// Efectos de sonido de cada escena: [frame, efecto, volumen]
function sceneSfx(sc, i) {
  const out = [];
  if (i > 0) out.push([0, 'whoosh', 0.55]);
  if (sc.type === 'hook') { out.push([0, 'impact', 0.7]); (sc.text || []).forEach((_, k) => out.push([4 + k * 7, 'pop', 0.45])); }
  if (sc.type === 'point') {
    (String(sc.title || '').split(' ')).forEach((_, k) => { if (k % 2 === 0) out.push([10 + k * 3, 'click', 0.25]); });
    if (sc.action) out.push([Math.round((sc.art ? 30 : 24) + len(sc.title) / 3 + len(sc.body) / 4), 'pop', 0.5]);
  }
  if (sc.type === 'list') (sc.items || []).forEach((_, k) => out.push([26 + k * 12, 'pop', 0.45]));
  if (sc.type === 'cta') { out.push([2, 'riser', 0.4], [12, 'impact', 0.75], [16, 'ding', 0.5]); }
  if (sc.art && ART_SFX[sc.art]) ART_SFX[sc.art].forEach((x) => out.push(x));
  return out;
}

export const Reel = (props) => {
  const scenes = props.scenes || [];
  let from = 0, num = 0;
  return (
    <AbsoluteFill style={{ background: INK }}>
      {props.sfx && props.musica !== false ? <Audio src={staticFile('sfx/musica.wav')} loop volume={0.11} /> : null}
      {scenes.map((sc, i) => {
        const rapido = props.ritmo === 'rapido';
        const d = sceneFrames(sc, props.ritmo); const start = from; from += d;
        if (sc.type === 'point') num++;
        const C = { hook: Hook, point: Point, list: List, quote: Quote, cta: Cta }[sc.type] || Point;
        const k = num;
        return (
          <Sequence key={i} from={start} durationInFrames={d}>
            {rapido ? <Punch><C sc={sc} i={i} n={scenes.length} num={k} /></Punch> : <C sc={sc} i={i} n={scenes.length} num={k} />}
            {sc.audio ? <Sequence from={rapido ? (i > 0 ? VOZ_DELAY_RAPIDO : 2) : (i > 0 ? VOZ_DELAY : 4)}><Audio src={staticFile(sc.audio)} /></Sequence> : null}
            {props.sfx ? sceneSfx(sc, i).filter(([t]) => t < d).map(([t, name, vol], j) => (
              <Sequence key={'s' + j} from={t} durationInFrames={Math.max(1, d - t)}><Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} /></Sequence>
            )) : null}
            {i > 0 ? <Wipe fast={rapido} /> : null}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
