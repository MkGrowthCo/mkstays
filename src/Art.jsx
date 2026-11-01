// Ilustraciones animadas (estilo historia) para las escenas con campo "art".
// Todas dibujan en un SVG de 888x700 y se animan con el frame de la escena.
import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from 'remotion';

const INK = '#0D0D0D', CREAM = '#F1EFEA', RED = '#FF3B1F', SOFT = '#D6D4CE', MID = '#8C8A84', SKIN = '#E9B48A', BLUE = '#2F4A8A';
const FONT = "'Archivo', 'Arial Narrow', sans-serif";
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' };
const useSp = (d, cfg = { damping: 13, stiffness: 140 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  return spring({ frame: f - d, fps, config: cfg });
};

// ---------- personajes ----------
// Anfitriona (Laura): pelo oscuro, jersey rojo
export const Host = ({ x, y, s = 1, mood = 'ok', look = 0 }) => {
  const f = useCurrentFrame();
  const breathe = Math.sin(f / 9) * 3;
  const blink = f % 70 < 4 ? 0.15 : 1;
  return (
    <g transform={`translate(${x},${y + breathe}) scale(${s})`}>
      <rect x={-62} y={40} width={124} height={170} rx={50} fill={RED} />
      <rect x={-30} y={190} width={22} height={60} rx={10} fill={INK} />
      <rect x={8} y={190} width={22} height={60} rx={10} fill={INK} />
      <circle cx={0} cy={-10} r={58} fill={SKIN} />
      <path d="M-62,-10 C-66,-80 66,-80 62,-10 C50,-40 -20,-52 -62,-10 Z" fill={INK} />
      <ellipse cx={-20 + look} cy={-6} rx={7} ry={9 * blink} fill={INK} />
      <ellipse cx={20 + look} cy={-6} rx={7} ry={9 * blink} fill={INK} />
      {mood === 'sad'
        ? <path d="M-16,30 Q0,18 16,30" stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" />
        : mood === 'wow'
          ? <ellipse cx={0} cy={26} rx={10} ry={13} fill={INK} />
          : <path d="M-18,22 Q0,40 18,22" stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" />}
    </g>
  );
};

// Huésped con maleta que camina
export const Guest = ({ x, y, s = 1, walking = true, color = BLUE }) => {
  const f = useCurrentFrame();
  const sw = walking ? Math.sin(f / 3) * 14 : 0;
  const bob = walking ? Math.abs(Math.sin(f / 3)) * -6 : 0;
  return (
    <g transform={`translate(${x},${y + bob}) scale(${s})`}>
      <g transform={`rotate(${sw},-10,190)`}><rect x={-22} y={180} width={22} height={70} rx={10} fill={INK} /></g>
      <g transform={`rotate(${-sw},10,190)`}><rect x={2} y={180} width={22} height={70} rx={10} fill={INK} /></g>
      <rect x={-55} y={40} width={110} height={160} rx={44} fill={color} />
      <circle cx={0} cy={-8} r={52} fill={SKIN} />
      <path d="M-52,-14 C-50,-66 50,-66 52,-14 C30,-40 -30,-40 -52,-14 Z" fill="#6B3E26" />
      <circle cx={-16} cy={-4} r={7} fill={INK} /><circle cx={16} cy={-4} r={7} fill={INK} />
      <path d="M-14,22 Q0,32 14,22" stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" />
      <rect x={-130} y={110} width={74} height={104} rx={14} fill={INK} />
      <rect x={-110} y={92} width={34} height={22} rx={8} fill="none" stroke={INK} strokeWidth={8} />
      <rect x={-118} y={140} width={50} height={8} rx={4} fill={RED} />
    </g>
  );
};

const Coin = ({ x, y, s = 1, o = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} opacity={o}>
    <circle r={34} fill="#F2B632" stroke={INK} strokeWidth={6} />
    <text x={0} y={14} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={INK}>€</text>
  </g>
);

// ---------- calendario semanal ----------
const DAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const CW = 112, CX0 = 52, CY0 = 70;
const Calendar = ({ y = 0, children, gapState = 'empty' }) => (
  <g transform={`translate(0,${y})`}>
    <rect x={30} y={0} width={828} height={300} rx={28} fill="#FFFFFF" stroke={INK} strokeWidth={6} />
    <rect x={30} y={0} width={828} height={56} rx={28} fill={INK} />
    <rect x={30} y={30} width={828} height={26} fill={INK} />
    {DAYS.map((d, k) => (
      <text key={d} x={CX0 + k * CW + CW / 2} y={40} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={CREAM}>{d}</text>
    ))}
    {DAYS.map((d, k) => (
      <rect key={k} x={CX0 + k * CW + 6} y={CY0 + 6} width={CW - 12} height={200} rx={14} fill={k === 2 && gapState === 'empty' ? '#FFF1EE' : '#F6F5F2'} />
    ))}
    {children}
  </g>
);
// Barra de reserva que crece de izquierda a derecha
const Booking = ({ from, to, p, label, color = INK }) => {
  const w = (to - from) * CW - 12;
  return (
    <g>
      <rect x={CX0 + from * CW + 6} y={CY0 + 60} width={Math.max(0, w * p)} height={90} rx={18} fill={color} />
      <text x={CX0 + from * CW + 30} y={CY0 + 118} fontFamily={FONT} fontWeight={800} fontSize={30} fill={CREAM} opacity={p > 0.8 ? 1 : 0}>{label}</text>
    </g>
  );
};

// ---------- escenas ilustradas ----------
// 1) Calendario casi lleno con una noche vacía que parpadea
const ArtCalendario = () => {
  const f = useCurrentFrame();
  const b1 = interpolate(f, [6, 26], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const b2 = interpolate(f, [22, 44], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const gap = useSp(48, { damping: 9, stiffness: 160 });
  const pulse = 0.55 + 0.45 * Math.abs(Math.sin(f / 7));
  const host = useSp(0);
  return (
    <svg viewBox="0 0 888 700" width="100%" height="100%">
      <Calendar y={30}>
        <Booking from={0} to={2} p={b1} label="Reserva 1" />
        <Booking from={3} to={7} p={b2} label="Reserva 2" />
        <rect x={CX0 + 2 * CW + 6} y={CY0 + 6} width={CW - 12} height={200} rx={14} fill="none" stroke={RED} strokeWidth={8} strokeDasharray="18 12" opacity={gap * pulse} />
        <g transform={`translate(${CX0 + 2.5 * CW},${CY0 + 108}) scale(${gap})`}>
          <text textAnchor="middle" y={22} fontFamily={FONT} fontWeight={900} fontSize={64} fill={RED}>?</text>
        </g>
      </Calendar>
      <g transform={`translate(0,${(1 - host) * 300})`}>
        <Host x={250} y={440} s={0.8} mood={f > 60 ? 'wow' : 'ok'} look={f > 50 ? -6 : 0} />
      </g>
      {/* Bocadillo */}
      <g opacity={gap} transform={`translate(${380 + (1 - gap) * 40},430)`}>
        <rect x={0} y={0} width={440} height={150} rx={30} fill={INK} />
        <path d="M0,90 L-40,120 L10,120 Z" fill={INK} />
        <text x={220} y={66} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill={CREAM}>¿Y el miércoles?</text>
        <text x={220} y={118} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={32} fill={SOFT}>Una noche libre suelta</text>
      </g>
    </svg>
  );
};

// 2) Huésped intenta reservar 1 noche y la regla de "mín. 2 noches" lo bloquea
const ArtBloqueo = () => {
  const f = useCurrentFrame();
  // camina hacia la puerta, choca y se va
  const walkIn = interpolate(f, [0, 34], [980, 600], { ...clamp, easing: Easing.out(Easing.quad) });
  const back = interpolate(f, [62, 100], [0, 520], { ...clamp, easing: Easing.in(Easing.quad) });
  const x = walkIn + back;
  const lock = useSp(30, { damping: 8, stiffness: 200 });
  const shake = f > 34 && f < 50 ? Math.sin(f * 2.2) * 10 : 0;
  const cross = useSp(46, { damping: 9, stiffness: 180 });
  const walking = f < 34 || f > 62;
  return (
    <svg viewBox="0 0 888 700" width="100%" height="100%">
      {/* casa */}
      <g transform="translate(70,150)">
        <path d="M0,170 L190,20 L380,170 Z" fill={INK} />
        <rect x={30} y={160} width={320} height={300} fill="#FFFFFF" stroke={INK} strokeWidth={8} />
        <rect x={150} y={290} width={90} height={170} fill={MID} />
        <rect x={60} y={210} width={70} height={60} fill="#3A3A37" />
        <rect x={260} y={210} width={70} height={60} fill="#3A3A37" />
        <text x={190} y={258} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill={RED}>0 €</text>
      </g>
      {/* candado con la regla */}
      <g transform={`translate(${470 + shake},250) scale(${lock})`}>
        <rect x={-10} y={-90} width={20} height={40} fill="none" />
        <path d="M-50,-20 L-50,-60 A50,50 0 0 1 50,-60 L50,-20" fill="none" stroke={INK} strokeWidth={16} />
        <rect x={-110} y={-24} width={220} height={130} rx={20} fill={RED} />
        <text x={0} y={30} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill={INK}>MÍN.</text>
        <text x={0} y={72} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill={INK}>2 NOCHES</text>
      </g>
      <Guest x={x} y={350} s={0.85} walking={walking} />
      {/* bocadillo del huésped */}
      <g opacity={interpolate(f, [12, 20, 52, 58], [0, 1, 1, 0], clamp)} transform="translate(560,90)">
        <rect x={0} y={0} width={300} height={110} rx={28} fill="#FFFFFF" stroke={INK} strokeWidth={6} />
        <text x={150} y={68} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={36} fill={INK}>¿1 noche?</text>
      </g>
      <g transform={`translate(700,600) scale(${cross})`} opacity={f > 46 ? 1 : 0}>
        <circle r={56} fill={INK} />
        <path d="M-24,-24 L24,24 M24,-24 L-24,24" stroke={RED} strokeWidth={14} strokeLinecap="round" />
      </g>
    </svg>
  );
};

// 3) La solución: estancia mínima 2 -> 1 + descuento, el hueco se llena y entra dinero
const ArtSolucion = () => {
  const f = useCurrentFrame();
  const knob = interpolate(f, [10, 26], [1, 0], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const tag = useSp(30, { damping: 9, stiffness: 180 });
  const fill = interpolate(f, [42, 58], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const host = useSp(54);
  return (
    <svg viewBox="0 0 888 700" width="100%" height="100%">
      {/* ajuste de estancia mínima */}
      <g transform="translate(30,10)">
        <rect x={0} y={0} width={828} height={150} rx={28} fill={INK} />
        <text x={40} y={62} fontFamily={FONT} fontWeight={700} fontSize={30} fill={SOFT}>ESTANCIA MÍNIMA · SOLO ESE HUECO</text>
        <rect x={40} y={86} width={400} height={36} rx={18} fill="#3A3A37" />
        <rect x={40} y={86} width={40 + 360 * knob} height={36} rx={18} fill={RED} />
        <circle cx={60 + 360 * knob} cy={104} r={30} fill={CREAM} />
        <text x={540} y={124} fontFamily={FONT} fontWeight={900} fontSize={84} fill={CREAM}>{knob > 0.5 ? '2' : '1'}</text>
        <text x={600} y={118} fontFamily={FONT} fontWeight={700} fontSize={36} fill={SOFT}>{knob > 0.5 ? 'noches' : 'noche'}</text>
      </g>
      <Calendar y={190} gapState="full">
        <Booking from={0} to={2} p={1} label="Reserva 1" />
        <Booking from={3} to={7} p={1} label="Reserva 2" />
        <Booking from={2} to={3} p={fill} label="" color={RED} />
        {fill > 0.9 ? <path d={`M${CX0 + 2.5 * CW - 22},${CY0 + 104} l16,18 l30,-36`} stroke={CREAM} strokeWidth={10} fill="none" strokeLinecap="round" /> : null}
        <g transform={`translate(${CX0 + 2.5 * CW},${CY0 + 180}) scale(${tag}) rotate(-6)`}>
          <rect x={-90} y={-36} width={180} height={64} rx={14} fill="#F2B632" stroke={INK} strokeWidth={5} />
          <text x={0} y={10} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill={INK}>-10/20%</text>
        </g>
      </Calendar>
      {[0, 1, 2].map((k) => {
        const p = interpolate(f, [60 + k * 6, 80 + k * 6], [0, 1], clamp);
        return <Coin key={k} x={560 + k * 90} y={640 - p * 120} s={0.6 + 0.4 * p} o={p > 0 ? 1 - Math.max(0, p - 0.85) * 4 : 0} />;
      })}
      <g transform={`translate(0,${(1 - host) * 260})`}>
        <Host x={220} y={560} s={0.6} mood="ok" />
      </g>
    </svg>
  );
};

// Gancho: casa de noche con una ventana apagada y el contador de euros a 0
const ArtNoche = () => {
  const f = useCurrentFrame();
  const house = useSp(0, { damping: 14, stiffness: 120 });
  const moon = useSp(8);
  const off = f > 26;
  const flick = f > 18 && f < 26 && f % 4 < 2;
  return (
    <svg viewBox="0 0 888 700" width="100%" height="100%">
      {[[90, 80], [220, 40], [700, 60], [800, 160], [600, 20]].map(([x, y], k) => (
        <circle key={k} cx={x} cy={y} r={5} fill={CREAM} opacity={0.4 + 0.6 * Math.abs(Math.sin(f / 10 + k))} />
      ))}
      <g transform={`translate(720,130) scale(${moon})`}>
        <circle r={70} fill={CREAM} /><circle cx={30} cy={-20} r={62} fill={INK} />
      </g>
      <g transform={`translate(204,${200 + (1 - house) * 400})`}>
        <path d="M-20,180 L240,10 L500,180 Z" fill={RED} />
        <rect x={20} y={170} width={440} height={320} fill="#2A2A28" stroke={CREAM} strokeWidth={6} />
        <rect x={70} y={230} width={110} height={100} fill="#F2B632" />
        <rect x={300} y={230} width={110} height={100} fill={off || flick ? '#111' : '#F2B632'} stroke={off ? RED : 'none'} strokeWidth={6} />
        <rect x={190} y={350} width={100} height={140} fill="#55534E" />
        <g opacity={off ? 1 : 0} transform={`translate(355,${280 - Math.min(40, (f - 26) * 2)})`}>
          <text textAnchor="middle" y={-60} fontFamily={FONT} fontWeight={900} fontSize={54} fill={CREAM}>0 €</text>
        </g>
      </g>
      <g transform={`translate(${(1 - useSp(14)) * 300},0)`}>
        <Host x={790} y={530} s={0.55} mood={off ? 'sad' : 'ok'} look={-8} />
      </g>
    </svg>
  );
};

export const ART = { calendario: ArtCalendario, bloqueo: ArtBloqueo, solucion: ArtSolucion, noche: ArtNoche };
