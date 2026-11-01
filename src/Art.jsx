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
        return <Coin key={k} x={560 + k * 90} y={640 - p * 120} s={0.6 + 0.4 * p} o={p > 0 ? Math.max(0, 1 - Math.max(0, p - 0.85) * 7) : 0} />;
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


// ===== Reel 01 · doble reserva =====
// Gancho: dos huéspedes llegan a la vez a la misma puerta
const ArtDoble = () => {
  const f = useCurrentFrame();
  const house = useSp(0, { damping: 14, stiffness: 120 });
  const l = interpolate(f, [4, 34], [-120, 210], { ...clamp, easing: Easing.out(Easing.quad) });
  const r = interpolate(f, [4, 34], [1010, 690], { ...clamp, easing: Easing.out(Easing.quad) });
  const bang = useSp(36, { damping: 7, stiffness: 220 });
  const walking = f < 34;
  return (
    <svg viewBox="0 0 888 700" width="100%" height="100%">
      <g transform={`translate(254,${120 + (1 - house) * 500})`}>
        <path d="M-20,170 L190,20 L400,170 Z" fill={RED} />
        <rect x={10} y={160} width={360} height={330} fill="#2A2A28" stroke={CREAM} strokeWidth={6} />
        <rect x={140} y={320} width={100} height={170} fill="#F2B632" />
        <rect x={50} y={210} width={80} height={70} fill="#F2B632" />
        <rect x={250} y={210} width={80} height={70} fill="#F2B632" />
      </g>
      <Guest x={l} y={380} s={0.8} walking={walking} color={BLUE} />
      <g transform={`translate(${r},380) scale(-1,1)`}><Guest x={0} y={0} s={0.8} walking={walking} color="#2E7D5B" /></g>
      <g transform={`translate(444,300) scale(${bang})`} opacity={f > 36 ? 1 : 0}>
        <path d="M0,-90 L22,-30 L84,-44 L40,4 L80,56 L18,36 L0,96 L-18,36 L-80,56 L-40,4 L-84,-44 L-22,-30 Z" fill={CREAM} stroke={RED} strokeWidth={8} />
        <text y={26} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={84} fill={RED}>!!</text>
      </g>
    </svg>
  );
};

// Capítulo: la penalización. Un recibo cae y el dinero se va de la hucha de Laura
const ArtMulta = () => {
  const f = useCurrentFrame();
  const host = useSp(0);
  const ticket = useSp(14, { damping: 10, stiffness: 120 });
  const stamp = useSp(40, { damping: 7, stiffness: 220 });
  return (
    <svg viewBox="0 0 888 700" width="100%" height="100%">
      <g transform={`translate(560,${-420 + ticket * 440}) rotate(${(1 - ticket) * 12 + 4})`}>
        <path d="M-170,0 L170,0 L170,440 L145,420 L120,440 L95,420 L70,440 L45,420 L20,440 L-5,420 L-30,440 L-55,420 L-80,440 L-105,420 L-130,440 L-150,420 L-170,440 Z" fill="#FFFFFF" stroke={INK} strokeWidth={6} />
        <text x={0} y={70} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill={INK}>PENALIZACIÓN</text>
        <rect x={-130} y={100} width={260} height={10} fill={SOFT} /><rect x={-130} y={130} width={190} height={10} fill={SOFT} />
        <text x={0} y={250} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={76} fill={RED}>10–50%</text>
        <text x={0} y={310} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={30} fill={MID}>DE LA RESERVA</text>
        <g transform={`translate(60,370) rotate(-14) scale(${stamp})`} opacity={f > 40 ? 1 : 0}>
          <rect x={-120} y={-40} width={240} height={74} rx={10} fill="none" stroke={RED} strokeWidth={8} />
          <text y={18} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={42} fill={RED}>A PAGAR</text>
        </g>
      </g>
      {[0, 1, 2, 3].map((k) => {
        const p = interpolate(f, [30 + k * 8, 56 + k * 8], [0, 1], clamp);
        return <Coin key={k} x={200 + p * (330 + k * 20)} y={420 - Math.sin(p * Math.PI) * 220 - p * 40} s={0.7} o={p > 0 && p < 0.97 ? 1 : 0} />;
      })}
      <g transform={`translate(0,${(1 - host) * 300})`}>
        <Host x={170} y={430} s={0.85} mood={f > 30 ? 'sad' : 'wow'} look={8} />
      </g>
    </svg>
  );
};

// Capítulo: pierdes visibilidad. El anuncio de Laura baja en la lista y pierde la estrella
const ArtRanking = () => {
  const f = useCurrentFrame();
  const drop = interpolate(f, [26, 58], [0, 3], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const starFall = interpolate(f, [20, 46], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const list = useSp(0);
  const H = 132, Y0 = 70;
  const others = [0, 1, 2];
  return (
    <svg viewBox="0 0 888 700" width="100%" height="100%">
      <rect x={60} y={10} width={768} height={44} rx={22} fill="#FFFFFF" stroke={INK} strokeWidth={5} />
      <circle cx={100} cy={32} r={12} fill="none" stroke={INK} strokeWidth={5} />
      <text x={130} y={44} fontFamily={FONT} fontWeight={700} fontSize={28} fill={MID}>Alojamientos en tu zona</text>
      {others.map((k) => {
        const slot = k + 1 - Math.min(1, Math.max(0, drop - k));
        return (
          <g key={k} transform={`translate(${60 + (1 - list) * 400},${Y0 + slot * H + 10})`} opacity={list}>
            <rect width={768} height={H - 20} rx={20} fill="#FFFFFF" stroke={INK} strokeWidth={4} />
            <rect x={16} y={14} width={120} height={H - 48} rx={12} fill={SOFT} />
            <rect x={160} y={30} width={300 - k * 40} height={18} rx={9} fill={INK} />
            <rect x={160} y={64} width={200} height={14} rx={7} fill={SOFT} />
          </g>
        );
      })}
      <g transform={`translate(60,${Y0 + drop * H + 10})`}>
        <rect width={768} height={H - 20} rx={20} fill={RED} stroke={INK} strokeWidth={4} />
        <g transform="translate(76,58)"><path d="M-40,0 L0,-34 L40,0 Z" fill={INK} /><rect x={-30} y={-2} width={60} height={40} fill={CREAM} /></g>
        <text x={160} y={52} fontFamily={FONT} fontWeight={900} fontSize={36} fill={INK}>El piso de Laura</text>
        <text x={160} y={88} fontFamily={FONT} fontWeight={700} fontSize={26} fill={INK}>1 cancelación</text>
        <g transform={`translate(${700},${56 + starFall * 520}) rotate(${starFall * 160})`} opacity={1 - Math.max(0, starFall - 0.8) * 5}>
          <path d="M0,-34 L10,-10 L34,-10 L14,6 L22,32 L0,16 L-22,32 L-14,6 L-34,-10 L-10,-10 Z" fill="#F2B632" stroke={INK} strokeWidth={4} />
        </g>
      </g>
      <g opacity={drop > 2.9 ? 1 : 0}>
        <path d={`M30,${Y0 + 50} L30,${Y0 + 3 * H + 40}`} stroke={RED} strokeWidth={8} />
        <path d={`M14,${Y0 + 3 * H + 20} L30,${Y0 + 3 * H + 46} L46,${Y0 + 3 * H + 20}`} stroke={RED} strokeWidth={8} fill="none" />
      </g>
    </svg>
  );
};

// Capítulo: la solución. Un channel manager conecta las plataformas y bloquea a la vez
const ArtSync = () => {
  const f = useCurrentFrame();
  const hub = useSp(4, { damping: 11, stiffness: 160 });
  const line = interpolate(f, [12, 30], [0, 1], clamp);
  const dot = interpolate(f, [30, 50], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const lockP = useSp(50, { damping: 9, stiffness: 200 });
  const host = useSp(56);
  const Plat = ({ x, name }) => (
    <g transform={`translate(${x},40)`}>
      <rect width={300} height={230} rx={24} fill="#FFFFFF" stroke={INK} strokeWidth={6} />
      <rect width={300} height={54} rx={24} fill={INK} /><rect y={30} width={300} height={24} fill={INK} />
      <text x={150} y={40} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} fill={CREAM}>{name}</text>
      {[0, 1, 2, 3].map((k) => <rect key={k} x={20 + k * 68} y={80} width={56} height={120} rx={10} fill="#F6F5F2" />)}
      <g transform={`translate(150,140) scale(${lockP})`}>
        <rect x={-110} y={-50} width={220} height={100} rx={14} fill={RED} />
        <text y={12} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill={CREAM}>OCUPADO</text>
      </g>
    </g>
  );
  return (
    <svg viewBox="0 0 888 700" width="100%" height="100%">
      <Plat x={40} name="Plataforma A" />
      <Plat x={548} name="Plataforma B" />
      <path d={`M190,270 L190,${270 + 130 * line}`} stroke={INK} strokeWidth={8} />
      <path d={`M698,270 L698,${270 + 130 * line}`} stroke={INK} strokeWidth={8} />
      <path d={`M190,400 L${190 + 254 * line},400 M698,400 L${698 - 254 * line},400`} stroke={INK} strokeWidth={8} />
      <g transform={`translate(444,400) scale(${hub})`}>
        <rect x={-150} y={-56} width={300} height={112} rx={56} fill={INK} />
        <text y={-6} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill={CREAM}>CHANNEL</text>
        <text y={32} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill={RED}>MANAGER</text>
      </g>
      {dot > 0 && dot < 1 ? <>
        <circle cx={444 - 254 * dot} cy={400} r={14} fill={RED} />
        <circle cx={444 + 254 * dot} cy={400} r={14} fill={RED} />
      </> : null}
      <g transform={`translate(0,${(1 - host) * 300})`}>
        <Host x={444} y={560} s={0.55} mood="ok" />
      </g>
    </svg>
  );
};


// ===== Reel 03 · foto de portada (marketing) =====
// Miniaturas de foto: salón con sol, dormitorio, baño oscuro, terraza con mar
const Foto = ({ x, y, w = 200, h = 150, kind = 'salon', dim = 0, stroke = INK }) => {
  const k = w / 200;
  const body = {
    salon: <g>
      <rect width={200} height={150} fill="#F4E3C8" />
      <rect x={120} y={18} width={60} height={64} fill="#BFE3F2" stroke={CREAM} strokeWidth={5} />
      <circle cx={150} cy={44} r={12} fill="#F2B632" />
      <rect x={18} y={84} width={100} height={40} rx={12} fill={RED} />
      <rect x={18} y={70} width={100} height={22} rx={10} fill="#D9442B" />
      <rect x={0} y={124} width={200} height={26} fill="#C99B6B" />
    </g>,
    dormitorio: <g>
      <rect width={200} height={150} fill="#E7E1D8" />
      <rect x={30} y={70} width={140} height={50} rx={8} fill="#FFFFFF" stroke={MID} strokeWidth={3} />
      <rect x={30} y={44} width={140} height={30} rx={8} fill={BLUE} />
      <rect x={44} y={56} width={40} height={20} rx={6} fill={CREAM} /><rect x={116} y={56} width={40} height={20} rx={6} fill={CREAM} />
      <rect x={0} y={120} width={200} height={30} fill="#B98B5E" />
    </g>,
    bano: <g>
      <rect width={200} height={150} fill="#5B5A55" />
      <rect x={70} y={60} width={56} height={60} rx={10} fill="#8C8A84" />
      <rect x={66} y={34} width={64} height={30} rx={6} fill="#8C8A84" />
      <rect x={150} y={20} width={30} height={40} fill="#45443F" />
      <rect x={0} y={120} width={200} height={30} fill="#3F3E3A" />
    </g>,
    terraza: <g>
      <rect width={200} height={150} fill="#9FD4EE" />
      <circle cx={150} cy={36} r={18} fill="#F2B632" />
      <rect x={0} y={80} width={200} height={34} fill="#2F7FB5" />
      <rect x={0} y={114} width={200} height={36} fill="#E9D3A8" />
      <path d="M30,114 L30,70 M18,78 Q30,60 46,74" stroke="#2E7D5B" strokeWidth={6} fill="none" />
    </g>,
  }[kind];
  return (
    <g transform={`translate(${x},${y}) scale(${k})`}>
      <clipPath id={`c-${kind}-${Math.round(x)}-${Math.round(y)}`}><rect width={200} height={150} rx={14} /></clipPath>
      <g clipPath={`url(#c-${kind}-${Math.round(x)}-${Math.round(y)})`}>
        {body}
        <rect width={200} height={150} fill="#000" opacity={dim} />
      </g>
      <rect width={200} height={150} rx={14} fill="none" stroke={stroke} strokeWidth={5 / k} />
    </g>
  );
};

// Gancho: el huésped hace scroll en el móvil y pasa de largo el anuncio con foto oscura
const ArtPortada = () => {
  const f = useCurrentFrame();
  const phone = useSp(0, { damping: 13, stiffness: 130 });
  const scroll = interpolate(f, [8, 30, 40, 64], [0, 300, 300, 640], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const thumbY = interpolate(f % 28, [0, 14, 28], [120, -60, 120], clamp);
  const x = useSp(30, { damping: 8, stiffness: 220 });
  const cards = [['terraza', 0], ['salon', 0], ['bano', 0.35], ['dormitorio', 0], ['terraza', 0], ['salon', 0]];
  return (
    <svg viewBox="0 0 888 700" width="100%" height="100%">
      <g transform={`translate(254,${30 + (1 - phone) * 600})`}>
        <rect x={0} y={0} width={380} height={660} rx={54} fill="#1E1E1C" stroke={CREAM} strokeWidth={8} />
        <clipPath id="pantalla"><rect x={20} y={40} width={340} height={600} rx={30} /></clipPath>
        <g clipPath="url(#pantalla)">
          <rect x={20} y={40} width={340} height={600} fill={CREAM} />
          {cards.map(([k, d], i) => {
            const y = 60 + i * 230 - scroll;
            const mine = k === 'bano';
            return (
              <g key={i}>
                <Foto x={40} y={y} w={300} h={225} kind={k} dim={d} stroke={mine ? RED : INK} />
                <rect x={40} y={y + 196} width={mine ? 210 : 160} height={22} rx={8} fill={mine ? RED : INK} opacity={0.9} />
                {mine ? <text x={50} y={y + 214} fontFamily={FONT} fontWeight={900} fontSize={20} fill={CREAM}>EL PISO DE LAURA</text> : null}
              </g>
            );
          })}
        </g>
      </g>
      {/* dedo que hace scroll */}
      <g transform={`translate(600,${380 + thumbY})`} opacity={f < 70 ? 1 : 0}>
        <rect x={-34} y={0} width={68} height={170} rx={34} fill={SKIN} stroke={INK} strokeWidth={6} />
        <rect x={-20} y={14} width={40} height={36} rx={14} fill="#F5D2B5" />
      </g>
      {/* aviso: pasan de largo */}
      <g transform={`translate(130,250) scale(${x}) rotate(-8)`} opacity={f > 30 ? 1 : 0}>
        <rect x={-110} y={-48} width={220} height={96} rx={20} fill={RED} />
        <text y={16} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill={CREAM}>¡SCROLL!</text>
      </g>
      <g transform={`translate(${(1 - useSp(16)) * -300},0)`}>
        <Host x={110} y={500} s={0.55} mood={f > 40 ? 'sad' : 'ok'} look={8} />
      </g>
    </svg>
  );
};

// Capítulo 1: la portada se lleva casi toda la atención del huésped
const ArtMirada = () => {
  const f = useCurrentFrame();
  const card = useSp(0);
  const big = useSp(10, { damping: 10, stiffness: 160 });
  const ray = interpolate(f, [24, 40], [0, 1], clamp);
  const guest = useSp(4);
  const pulse = 1 + Math.sin(f / 6) * 0.02;
  return (
    <svg viewBox="0 0 888 700" width="100%" height="100%">
      <g transform={`translate(${300 + (1 - card) * 600},20)`}>
        <rect x={0} y={0} width={560} height={620} rx={30} fill="#FFFFFF" stroke={INK} strokeWidth={6} />
        <g transform={`translate(280,217) scale(${big * pulse}) translate(-250,-187)`}>
          <Foto x={0} y={0} w={500} h={375} kind="salon" stroke={RED} />
        </g>
        <g opacity={big}><rect x={30} y={30} width={170} height={52} rx={10} fill={RED} />
        <text x={115} y={67} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill={CREAM}>PORTADA</text></g>
        {['dormitorio', 'bano', 'terraza'].map((k, i) => (
          <g key={k} opacity={0.35}><Foto x={30 + i * 172} y={430} w={156} h={117} kind={k} /></g>
        ))}
        <text x={30} y={598} fontFamily={FONT} fontWeight={700} fontSize={26} fill={MID}>el resto de fotos</text>
      </g>
      {/* mirada del huésped hacia la portada */}
      <path d={`M190,250 L${190 + 160 * ray},${250 - 40 * ray}`} stroke={RED} strokeWidth={10} strokeDasharray="20 14" strokeLinecap="round" />
      {ray > 0.95 ? <path d="M350,210 l-30,-6 l14,26 z" fill={RED} /> : null}
      <g transform={`translate(0,${(1 - guest) * 300})`}>
        <Guest x={150} y={330} s={0.8} walking={false} />
      </g>
    </svg>
  );
};

// Capítulo 2: Laura cambia el orden: la foto buena sube a la primera posición y suben las reservas
const ArtOrden = () => {
  const f = useCurrentFrame();
  const swap = interpolate(f, [22, 46], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const lift = Math.sin(swap * Math.PI) * 70;
  const badge = useSp(52, { damping: 8, stiffness: 200 });
  const host = useSp(0);
  const W = 190, X0 = 40, Y = 120;
  const pos = (i) => X0 + i * (W + 16);
  const bar = interpolate(f, [52, 76], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <svg viewBox="0 0 888 700" width="100%" height="100%">
      <text x={40} y={70} fontFamily={FONT} fontWeight={800} fontSize={34} fill={INK}>ORDEN DE FOTOS</text>
      {[0, 1, 2, 3].map((i) => <text key={i} x={pos(i) + W / 2} y={330} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={36} fill={i === 0 ? RED : MID}>{i + 1}</text>)}
      <Foto x={pos(1)} y={Y} w={W} h={W * 0.75} kind="dormitorio" />
      <Foto x={pos(2)} y={Y} w={W} h={W * 0.75} kind="terraza" />
      {/* baño: de 1 a 4 */}
      <g transform={`translate(${(pos(3) - pos(0)) * swap},${lift})`}><Foto x={pos(0)} y={Y} w={W} h={W * 0.75} kind="bano" /></g>
      {/* salón: de 4 a 1 */}
      <g transform={`translate(${(pos(0) - pos(3)) * swap},${-lift})`}><Foto x={pos(3)} y={Y} w={W} h={W * 0.75} kind="salon" stroke={swap > 0.5 ? RED : INK} /></g>
      {/* gráfico de reservas */}
      <g transform="translate(420,380)">
        <rect x={0} y={0} width={420} height={280} rx={24} fill="#FFFFFF" stroke={INK} strokeWidth={6} />
        <rect x={60} y={240 - 110} width={110} height={110} fill={SOFT} />
        <rect x={240} y={240 - 110 - 70 * bar} width={110} height={110 + 70 * bar} fill={RED} />
        <text x={115} y={268} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={22} fill={MID}>ANTES</text>
        <text x={295} y={268} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={22} fill={MID}>DESPUÉS</text>
        <g transform={`translate(295,${40}) scale(${badge})`}>
          <rect x={-80} y={-34} width={160} height={64} rx={14} fill="#F2B632" stroke={INK} strokeWidth={5} />
          <text y={12} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={INK}>+11%</text>
        </g>
      </g>
      <g transform={`translate(0,${(1 - host) * 300})`}>
        <Host x={200} y={470} s={0.7} mood={f > 50 ? 'wow' : 'ok'} look={8} />
      </g>
    </svg>
  );
};

// Capítulo 3: flash de cámara, la foto oscura se ilumina y sube la ocupación
const ArtFlash = () => {
  const f = useCurrentFrame();
  const cam = useSp(0, { damping: 12, stiffness: 150 });
  const flash = interpolate(f, [20, 23, 34], [0, 1, 0], clamp);
  const lit = interpolate(f, [22, 34], [0.55, 0], clamp);
  const meter = interpolate(f, [36, 62], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const badge = useSp(58, { damping: 8, stiffness: 200 });
  return (
    <svg viewBox="0 0 888 700" width="100%" height="100%">
      <g transform="translate(40,40)">
        <Foto x={0} y={0} w={480} h={360} kind={f < 22 ? 'bano' : 'salon'} dim={f < 22 ? 0.3 : lit} stroke={f > 30 ? RED : INK} />
      </g>
      {/* cámara */}
      <g transform={`translate(${700},${180 + (1 - cam) * 400}) rotate(-8)`}>
        <rect x={-130} y={-80} width={260} height={170} rx={26} fill={INK} />
        <rect x={-70} y={-110} width={90} height={40} rx={10} fill={INK} />
        <circle cx={0} cy={6} r={58} fill="#3A3A37" stroke={CREAM} strokeWidth={8} />
        <circle cx={0} cy={6} r={28} fill={BLUE} />
        <rect x={70} y={-60} width={40} height={24} rx={6} fill={CREAM} opacity={0.3 + flash * 0.7} />
      </g>
      {/* ocupación */}
      <g transform="translate(40,450)">
        <text x={0} y={0} fontFamily={FONT} fontWeight={800} fontSize={32} fill={INK}>OCUPACIÓN</text>
        <rect x={0} y={24} width={560} height={56} rx={28} fill={SOFT} />
        <rect x={0} y={24} width={330 + 120 * meter} height={56} rx={28} fill={RED} />
        <g transform={`translate(${690},52) scale(${badge})`}>
          <rect x={-100} y={-38} width={200} height={72} rx={16} fill="#F2B632" stroke={INK} strokeWidth={5} />
          <text y={14} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={INK}>+8,98%</text>
        </g>
      </g>
      <rect x={0} y={0} width={888} height={700} fill="#FFFFFF" opacity={flash * 0.85} />
    </svg>
  );
};

// ---------- normativa: alquiler de temporada (RDL 29/2026) ----------
// Gancho: el anuncio de Laura recibe el sello de RETIRADO
const ArtRetirada = () => {
  const f = useCurrentFrame();
  const phone = useSp(0, { damping: 14, stiffness: 160 });
  const st = useSp(24, { damping: 9, stiffness: 260, mass: 0.7 });
  const hit = f >= 24;
  const shake = f > 24 && f < 34 ? Math.sin(f * 3) * (34 - f) * 1.6 : 0;
  const host = useSp(8);
  return (
    <svg viewBox="0 0 888 700" width="100%" height="100%">
      <g transform={`translate(${480 + shake},${20 + (1 - phone) * 500})`}>
        <rect x={0} y={0} width={360} height={660} rx={48} fill={INK} stroke="#3A3A37" strokeWidth={6} />
        <rect x={20} y={40} width={320} height={580} rx={30} fill={CREAM} />
        <rect x={130} y={14} width={100} height={12} rx={6} fill="#3A3A37" />
        <g opacity={hit ? 0.45 : 1}>
          <rect x={40} y={64} width={280} height={200} rx={20} fill={SOFT} />
          <path d="M120,200 L180,140 L240,200 Z" fill={INK} /><rect x={140} y={196} width={80} height={50} fill={CREAM} />
          <text x={40} y={310} fontFamily={FONT} fontWeight={900} fontSize={34} fill={INK}>Piso de Laura</text>
          <text x={40} y={352} fontFamily={FONT} fontWeight={700} fontSize={26} fill={MID}>Alquiler de temporada</text>
          <rect x={40} y={378} width={170} height={48} rx={24} fill={INK} />
          <text x={125} y={411} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={24} fill={CREAM}>7 noches</text>
          <rect x={40} y={450} width={280} height={14} rx={7} fill={SOFT} />
          <rect x={40} y={478} width={200} height={14} rx={7} fill={SOFT} />
          <rect x={40} y={530} width={280} height={64} rx={18} fill={RED} />
          <text x={180} y={572} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={28} fill={CREAM}>Reservar</text>
        </g>
        <g transform={`translate(180,330) rotate(-14) scale(${hit ? 2.4 - 1.4 * st : 0})`} opacity={hit ? 1 : 0}>
          <rect x={-170} y={-58} width={340} height={116} rx={14} fill="none" stroke={RED} strokeWidth={12} />
          <text y={22} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={66} fill={RED} letterSpacing="2">RETIRADO</text>
        </g>
      </g>
      <g transform={`translate(${(1 - host) * -300},0)`}>
        <Host x={230} y={400} s={1} mood={hit ? 'wow' : 'ok'} look={hit ? 14 : 6} />
      </g>
      {hit ? [0, 1, 2].map((k) => (
        <path key={k} d={`M${330 + k * 10},${300 - k * 40} l${40 + k * 10},${-30 + k * 20}`} stroke={RED} strokeWidth={10} strokeLinecap="round"
          opacity={interpolate(f, [24, 30, 44], [0, 1, 0], clamp)} />
      )) : null}
    </svg>
  );
};

// Capítulo: la nueva regla. Documento oficial y cuenta hasta 31 días
const ArtDecreto = () => {
  const f = useCurrentFrame();
  const doc = useSp(0, { damping: 15, stiffness: 150 });
  const badge = useSp(20, { damping: 8, stiffness: 220 });
  const n = Math.round(interpolate(f, [28, 58], [0, 31], clamp));
  const ok = useSp(60, { damping: 9, stiffness: 220 });
  return (
    <svg viewBox="0 0 888 700" width="100%" height="100%">
      <g transform={`translate(40,${30 + (1 - doc) * 400}) rotate(${-3 * doc})`} opacity={doc}>
        <rect width={360} height={470} rx={18} fill="#FFFFFF" stroke={INK} strokeWidth={6} />
        <rect width={360} height={80} rx={18} fill={INK} /><rect y={50} width={360} height={30} fill={INK} />
        <text x={180} y={54} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill={CREAM}>BOE</text>
        <text x={30} y={130} fontFamily={FONT} fontWeight={900} fontSize={30} fill={INK}>Real Decreto-ley</text>
        <text x={30} y={172} fontFamily={FONT} fontWeight={900} fontSize={44} fill={RED}>29/2026</text>
        {[0, 1, 2, 3, 4, 5].map((k) => <rect key={k} x={30} y={210 + k * 38} width={300 - (k % 3) * 50} height={14} rx={7} fill={SOFT} />)}
        <text x={30} y={448} fontFamily={FONT} fontWeight={700} fontSize={24} fill={MID}>En vigor: 8 de octubre</text>
      </g>
      <g transform={`translate(640,150) scale(${badge}) rotate(6)`}>
        <circle r={130} fill={RED} />
        <text y={-10} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill={INK}>TEMPORADA</text>
        <text y={60} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={84} fill={CREAM}>+31</text>
        <text y={98} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={28} fill={INK}>DÍAS</text>
      </g>
      <g transform="translate(450,330)">
        {Array.from({ length: 31 }).map((_, k) => (
          <rect key={k} x={(k % 8) * 50} y={Math.floor(k / 8) * 50} width={40} height={40} rx={8} fill={k < n ? INK : '#E4E2DC'} />
        ))}
        <text x={0} y={262} fontFamily={FONT} fontWeight={900} fontSize={60} fill={INK}>{n} <tspan fill={RED}>días</tspan></text>
      </g>
      <g transform={`translate(800,560) scale(${ok})`}>
        <circle r={44} fill={INK} />
        <path d="M-20,0 l14,16 l26,-30" stroke={CREAM} strokeWidth={10} fill="none" strokeLinecap="round" />
      </g>
      <Host x={170} y={590} s={0.42} mood="wow" look={10} />
    </svg>
  );
};

// Capítulo: 8.318 anuncios se ponen en rojo
const ArtContador = () => {
  const f = useCurrentFrame();
  const v = Math.round(interpolate(f, [6, 46], [0, 8318], { ...clamp, easing: Easing.out(Easing.cubic) }));
  const tag = useSp(50, { damping: 9, stiffness: 220 });
  const COLS = 10, ROWS = 4;
  return (
    <svg viewBox="0 0 888 700" width="100%" height="100%">
      <text x={444} y={130} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={150} fill={RED}>{String(v).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</text>
      <text x={444} y={186} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill={INK}>ANUNCIOS A RETIRAR</text>
      {Array.from({ length: COLS * ROWS }).map((_, k) => {
        const on = interpolate(f, [8 + k * 0.8, 12 + k * 0.8], [0, 1], clamp);
        const x = 44 + (k % COLS) * 80, y = 220 + Math.floor(k / COLS) * 80;
        return (
          <g key={k} transform={`translate(${x},${y})`}>
            <rect width={66} height={66} rx={12} fill={on > 0.5 ? RED : '#FFFFFF'} stroke={INK} strokeWidth={4} />
            <path d="M14,40 L33,22 L52,40 Z" fill={INK} /><rect x={20} y={38} width={26} height={16} fill={on > 0.5 ? '#FFD9D1' : CREAM} />
          </g>
        );
      })}
      <g transform={`translate(250,600) scale(${tag}) rotate(-4)`}>
        <rect x={-200} y={-40} width={400} height={74} rx={16} fill={INK} />
        <text y={10} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={36} fill={CREAM}>Casi 8 de cada 10</text>
      </g>
      <g transform={`translate(620,600) scale(${tag}) rotate(3)`}>
        <rect x={-150} y={-40} width={300} height={74} rx={16} fill="#F2B632" stroke={INK} strokeWidth={4} />
        <text y={10} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={36} fill={INK}>en Madrid</text>
      </g>
    </svg>
  );
};

// Capítulo: las dos opciones legales
const ArtElegir = () => {
  const f = useCurrentFrame();
  const bad = useSp(2, { damping: 10, stiffness: 200 });
  const x = useSp(12, { damping: 8, stiffness: 240 });
  const a = useSp(20, { damping: 11, stiffness: 180 });
  const b = useSp(28, { damping: 11, stiffness: 180 });
  const ca = useSp(42, { damping: 8, stiffness: 240 });
  const cb = useSp(48, { damping: 8, stiffness: 240 });
  const look = interpolate(f, [20, 30, 36, 46], [0, -14, -14, 14], clamp);
  const Card = ({ tx, p, c, title, l1, l2 }) => (
    <g transform={`translate(${tx},170) scale(${p})`}>
      <rect x={-200} y={0} width={400} height={300} rx={26} fill="#FFFFFF" stroke={INK} strokeWidth={6} />
      <rect x={-200} y={0} width={400} height={76} rx={26} fill={INK} /><rect x={-200} y={46} width={400} height={30} fill={INK} />
      <text y={52} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={38} fill={CREAM}>{title}</text>
      <text y={150} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill={INK}>{l1}</text>
      <text y={200} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={28} fill={MID}>{l2}</text>
      <g transform={`translate(150,270) scale(${c})`}>
        <circle r={40} fill={RED} />
        <path d="M-18,0 l12,14 l24,-28" stroke={CREAM} strokeWidth={9} fill="none" strokeLinecap="round" />
      </g>
    </g>
  );
  return (
    <svg viewBox="0 0 888 700" width="100%" height="100%">
      <g transform={`translate(444,70) scale(${bad})`}>
        <rect x={-300} y={-50} width={600} height={100} rx={50} fill={SOFT} />
        <text y={14} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={38} fill={INK}>«Temporada» de 7 noches</text>
        <path d={`M-280,0 L${-280 + 560 * x},0`} stroke={RED} strokeWidth={7} strokeLinecap="round" />
      </g>
      <Card tx={224} p={a} c={ca} title="TURÍSTICO" l1="Licencia de" l2="tu comunidad" />
      <Card tx={664} p={b} c={cb} title="TEMPORADA" l1="+31 noches" l2="contrato y causa real" />
      <Host x={444} y={560} s={0.5} mood="ok" look={look} />
    </svg>
  );
};


// Gancho: el contrato dice 1 año pero el sello lo convierte en 5
const ArtContrato = () => {
  const f = useCurrentFrame();
  const doc = useSp(0, { damping: 14, stiffness: 160 });
  const st = useSp(26, { damping: 9, stiffness: 260, mass: 0.7 });
  const hit = f >= 26;
  const shake = f > 26 && f < 36 ? Math.sin(f * 3) * (36 - f) * 1.5 : 0;
  const host = useSp(8);
  const strike = interpolate(f, [16, 24], [0, 1], clamp);
  return (
    <svg viewBox="0 0 888 700" width="100%" height="100%">
      <g transform={`translate(${470 + shake},${30 + (1 - doc) * 500}) rotate(${3 * doc})`}>
        <rect x={0} y={0} width={380} height={620} rx={22} fill="#FFFFFF" stroke={SOFT} strokeWidth={6} />
        <text x={190} y={74} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={36} fill={INK}>CONTRATO</text>
        <text x={190} y={112} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={24} fill={MID}>de alquiler de vivienda</text>
        {[0, 1, 2, 3].map((k) => <rect key={k} x={36} y={150 + k * 34} width={308 - (k % 2) * 70} height={14} rx={7} fill={SOFT} />)}
        <text x={36} y={330} fontFamily={FONT} fontWeight={800} fontSize={30} fill={INK}>Duración:</text>
        <text x={190} y={330} fontFamily={FONT} fontWeight={900} fontSize={44} fill={INK}>1 año</text>
        <path d={`M186,316 L${186 + 120 * strike},316`} stroke={RED} strokeWidth={8} strokeLinecap="round" />
        {[0, 1].map((k) => <rect key={k} x={36} y={380 + k * 34} width={300 - k * 90} height={14} rx={7} fill={SOFT} />)}
        <path d="M60,540 q30,-40 60,0 t60,0 t60,-10" stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" />
        <g transform={`translate(190,460) rotate(-10) scale(${hit ? 2.4 - 1.4 * st : 0})`} opacity={hit ? 1 : 0}>
          <rect x={-130} y={-54} width={260} height={108} rx={16} fill="#FFFFFF" stroke={RED} strokeWidth={11} />
          <text y={23} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={66} fill={RED}>5 AÑOS</text>
        </g>
      </g>
      <g transform={`translate(${(1 - host) * -300},0)`}>
        <Host x={230} y={400} s={1} mood={hit ? 'wow' : 'ok'} look={hit ? 14 : 6} />
      </g>
      {hit ? [0, 1, 2].map((k) => (
        <path key={k} d={`M${330 + k * 10},${300 - k * 40} l${40 + k * 10},${-30 + k * 20}`} stroke={RED} strokeWidth={10} strokeLinecap="round"
          opacity={interpolate(f, [26, 32, 46], [0, 1, 0], clamp)} />
      )) : null}
    </svg>
  );
};

// Capítulo: la prórroga año a año hasta 5
const ArtProrroga = () => {
  const f = useCurrentFrame();
  const law = useSp(0, { damping: 14, stiffness: 160 });
  return (
    <svg viewBox="0 0 888 700" width="100%" height="100%">
      <g transform={`translate(444,${70 + (1 - law) * -200})`} opacity={law}>
        <rect x={-260} y={-50} width={520} height={96} rx={48} fill={INK} />
        <text y={14} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={38} fill={CREAM}>LAU · artículo 9</text>
      </g>
      {[0, 1, 2, 3, 4].map((k) => {
        const p = spring({ frame: f - 10 - k * 9, fps: 30, config: { damping: 9, stiffness: 220 } });
        const x = 64 + k * 156;
        return (
          <g key={k} transform={`translate(${x + 66},330) scale(${p})`}>
            <rect x={-66} y={-110} width={132} height={220} rx={20} fill={k === 0 ? INK : RED} stroke={INK} strokeWidth={5} />
            <text y={-40} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} fill={CREAM}>AÑO</text>
            <text y={50} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={96} fill={CREAM}>{k + 1}</text>
            {k > 0 ? <text y={150} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill={RED}>+1</text> : <text y={150} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={26} fill={INK}>firmado</text>}
          </g>
        );
      })}
      <Host x={150} y={560} s={0.42} mood="wow" look={12} />
      <g transform={`translate(560,600) scale(${spring({ frame: f - 56, fps: 30, config: { damping: 9, stiffness: 220 } })}) rotate(-3)`}>
        <rect x={-250} y={-42} width={500} height={78} rx={16} fill="#F2B632" stroke={INK} strokeWidth={4} />
        <text y={10} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill={INK}>Lo decide el inquilino</text>
      </g>
    </svg>
  );
};

// Capítulo: contador de desahucios por alquiler en 2025
const ArtImpago = () => {
  const f = useCurrentFrame();
  const v = Math.round(interpolate(f, [6, 46], [0, 18317], { ...clamp, easing: Easing.out(Easing.cubic) }));
  const tag = useSp(50, { damping: 9, stiffness: 220 });
  const MONTHS = ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
  return (
    <svg viewBox="0 0 888 700" width="100%" height="100%">
      <text x={444} y={140} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={150} fill={RED}>{String(v).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</text>
      <text x={444} y={196} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={32} fill={INK}>DESAHUCIOS POR ALQUILER EN 2025</text>
      {MONTHS.map((m, k) => {
        const on = interpolate(f, [10 + k * 3, 14 + k * 3], [0, 1], clamp);
        const x = 60 + (k % 6) * 130, y = 240 + Math.floor(k / 6) * 130;
        return (
          <g key={k} transform={`translate(${x},${y})`}>
            <rect width={112} height={112} rx={18} fill={on > 0.5 ? RED : '#FFFFFF'} stroke={INK} strokeWidth={4} />
            <text x={56} y={50} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={36} fill={on > 0.5 ? CREAM : INK}>{m}</text>
            <text x={56} y={92} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill={on > 0.5 ? CREAM : MID}>€</text>
          </g>
        );
      })}
      <g transform={`translate(260,610) scale(${tag}) rotate(-4)`}>
        <rect x={-200} y={-40} width={400} height={74} rx={16} fill={INK} />
        <text y={10} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={36} fill={CREAM}>Unos 50 al día</text>
      </g>
      <g transform={`translate(640,610) scale(${tag}) rotate(3)`}>
        <rect x={-130} y={-40} width={260} height={74} rx={16} fill="#F2B632" stroke={INK} strokeWidth={4} />
        <text y={10} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill={INK}>Fuente: CGPJ</text>
      </g>
    </svg>
  );
};

// Capítulo: Laura decide su calendario (reservas, familia) con licencia
const ArtLlaves = () => {
  const f = useCurrentFrame();
  const cal = useSp(0, { damping: 14, stiffness: 160 });
  const lic = useSp(44, { damping: 8, stiffness: 240 });
  const fam = [17, 18, 19, 20, 21, 22, 23];
  const res = [2, 3, 4, 7, 8, 9, 10, 11, 13, 14, 24, 25, 26, 27];
  return (
    <svg viewBox="0 0 888 700" width="100%" height="100%">
      <g transform={`translate(330,${40 + (1 - cal) * 400})`} opacity={cal}>
        <rect width={520} height={470} rx={24} fill="#FFFFFF" stroke={INK} strokeWidth={6} />
        <rect width={520} height={70} rx={24} fill={INK} /><rect y={40} width={520} height={30} fill={INK} />
        <text x={260} y={48} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={32} fill={CREAM}>AGOSTO</text>
        {Array.from({ length: 28 }).map((_, k) => {
          const d = k + 1;
          const isF = fam.includes(d), isR = res.includes(d);
          const on = interpolate(f, [8 + k * 1.1, 12 + k * 1.1], [0, 1], clamp);
          const fill = on < 0.5 ? '#EEEDE8' : isF ? BLUE : isR ? INK : '#EEEDE8';
          return <rect key={k} x={24 + (k % 7) * 70} y={92 + Math.floor(k / 7) * 70} width={58} height={58} rx={10} fill={fill} />;
        })}
        <rect x={24} y={392} width={28} height={28} rx={6} fill={INK} />
        <text x={62} y={416} fontFamily={FONT} fontWeight={800} fontSize={26} fill={INK}>Reservas</text>
        <rect x={250} y={392} width={28} height={28} rx={6} fill={BLUE} />
        <text x={288} y={416} fontFamily={FONT} fontWeight={800} fontSize={26} fill={INK}>Mi familia</text>
      </g>
      <Host x={160} y={360} s={0.9} mood="ok" look={12} />
      <g transform={`translate(590,600) scale(${lic}) rotate(-3)`}>
        <rect x={-230} y={-42} width={460} height={80} rx={16} fill={RED} />
        <text y={12} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={38} fill={CREAM}>Con licencia turística</text>
      </g>
    </svg>
  );
};

// ---------- por qué alquilar: el piso vacío también cuesta ----------
// Casita de playa reutilizable
const Casa = ({ x, y, s = 1, closed = true, lit = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-170} y={-10} width={340} height={230} rx={10} fill="#FFFFFF" stroke={INK} strokeWidth={6} />
    <path d="M-200,0 L0,-150 L200,0 Z" fill={RED} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <rect x={-130} y={40} width={90} height={80} rx={6} fill={closed ? SOFT : '#FFE29A'} stroke={INK} strokeWidth={5} />
    <rect x={40} y={40} width={90} height={80} rx={6} fill={closed ? SOFT : '#FFE29A'} stroke={INK} strokeWidth={5} />
    {closed ? [0, 1, 2, 3].map((k) => <line key={k} x1={-130} x2={-40} y1={54 + k * 18} y2={54 + k * 18} stroke={MID} strokeWidth={5} />) : null}
    {closed ? [0, 1, 2, 3].map((k) => <line key={k} x1={40} x2={130} y1={54 + k * 18} y2={54 + k * 18} stroke={MID} strokeWidth={5} />) : null}
    <rect x={-35} y={110} width={70} height={110} rx={6} fill={INK} />
    <rect x={-170} y={-10} width={340} height={230} rx={10} fill="#FFE29A" opacity={lit * 0.25} />
    {closed ? <g transform="translate(0,150)">
      <rect x={-22} y={0} width={44} height={36} rx={6} fill="#F2B632" stroke={INK} strokeWidth={4} />
      <path d="M-13,0 v-12 a13,13 0 0 1 26,0 v12" fill="none" stroke={INK} strokeWidth={5} />
    </g> : null}
  </g>
);

// Gancho: casa cerrada con candado y las monedas se le escapan por el tejado
const ArtFuga = () => {
  const f = useCurrentFrame();
  const casa = useSp(0, { damping: 14, stiffness: 160 });
  const host = useSp(10);
  return (
    <svg viewBox="0 0 888 700" width="100%" height="100%">
      <g transform={`translate(0,${(1 - casa) * 400})`}>
        <Casa x={560} y={400} s={1} closed />
        <text x={560} y={668} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={SOFT}>CERRADO 10 MESES</text>
      </g>
      {Array.from({ length: 9 }).map((_, k) => {
        const t0 = 14 + k * 5;
        const t = Math.max(0, f - t0);
        const o = interpolate(t, [0, 4, 34, 44], [0, 1, 1, 0], clamp);
        const x = 560 + Math.sin(k * 2.1) * 60 + t * (k % 2 ? 4.5 : -3.2);
        const y = 250 - t * 7 + t * t * 0.06;
        return <Coin key={k} x={x} y={y} s={0.9} o={o} />;
      })}
      <g transform={`translate(${(1 - host) * -300},0)`}>
        <Host x={160} y={360} s={0.9} mood={f > 30 ? 'wow' : 'ok'} look={f > 20 ? 14 : 0} />
      </g>
    </svg>
  );
};

// Capítulo: los recibos que llegan aunque no vaya nadie
const ArtRecibos = () => {
  const f = useCurrentFrame();
  const items = [['IBI', '#FFFFFF'], ['COMUNIDAD', '#FFFFFF'], ['SEGURO', '#FFFFFF'], ['LUZ Y AGUA', '#FFFFFF']];
  const sad = f > 46;
  return (
    <svg viewBox="0 0 888 700" width="100%" height="100%">
      <Casa x={230} y={330} s={0.72} closed />
      {items.map(([t], k) => {
        const p = spring({ frame: f - 6 - k * 9, fps: 30, config: { damping: 11, stiffness: 190 } });
        return (
          <g key={k} transform={`translate(${470 + (1 - p) * 500},${70 + k * 118}) rotate(${(k % 2 ? 3 : -3) * p})`} opacity={p}>
            <rect width={360} height={98} rx={16} fill="#FFFFFF" stroke={INK} strokeWidth={5} />
            <rect width={24} height={98} rx={10} fill={RED} />
            <text x={50} y={62} fontFamily={FONT} fontWeight={900} fontSize={34} fill={INK}>{t}</text>
            <text x={340} y={64} textAnchor="end" fontFamily={FONT} fontWeight={900} fontSize={44} fill={RED}>€</text>
          </g>
        );
      })}
      <Host x={170} y={560} s={0.45} mood={sad ? 'sad' : 'ok'} look={10} />
      <g transform={`translate(560,${600 + (1 - useSp(46, { damping: 9, stiffness: 220 })) * 200})`}>
        <rect x={-100} y={-44} width={330} height={80} rx={18} fill={INK} />
        <text x={65} y={10} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={36} fill={CREAM}>0 huéspedes</text>
      </g>
    </svg>
  );
};

// Capítulo: Hacienda suma un % del valor catastral como renta
const ArtCatastro = () => {
  const f = useCurrentFrame();
  const doc = useSp(0, { damping: 15, stiffness: 150 });
  const pct = interpolate(f, [22, 52], [0, 2], { ...clamp, easing: Easing.out(Easing.cubic) });
  const tag = useSp(54, { damping: 8, stiffness: 230 });
  return (
    <svg viewBox="0 0 888 700" width="100%" height="100%">
      <g transform={`translate(40,${40 + (1 - doc) * 400}) rotate(${-3 * doc})`} opacity={doc}>
        <rect width={380} height={440} rx={18} fill="#FFFFFF" stroke={INK} strokeWidth={6} />
        <rect width={380} height={80} rx={18} fill={INK} /><rect y={50} width={380} height={30} fill={INK} />
        <text x={190} y={54} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill={CREAM}>RECIBO IBI</text>
        <text x={30} y={140} fontFamily={FONT} fontWeight={700} fontSize={28} fill={MID}>Valor catastral</text>
        <text x={30} y={200} fontFamily={FONT} fontWeight={900} fontSize={58} fill={INK}>100.000 €</text>
        {[0, 1, 2, 3].map((k) => <rect key={k} x={30} y={250 + k * 40} width={320 - (k % 2) * 80} height={14} rx={7} fill={SOFT} />)}
      </g>
      <g transform="translate(650,230)">
        <circle r={150} fill={RED} />
        <text y={-40} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill={INK}>HASTA EL</text>
        <text y={50} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={84} fill={CREAM}>{pct.toFixed(1).replace('.', ',')}%</text>
        <text y={100} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={28} fill={INK}>COMO RENTA</text>
      </g>
      <path d="M430,240 C480,220 470,230 500,232" stroke={INK} strokeWidth={8} fill="none" strokeLinecap="round" />
      <path d="M492,214 L512,234 L488,250" stroke={INK} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <g transform={`translate(560,560) scale(${tag}) rotate(-3)`}>
        <rect x={-230} y={-50} width={460} height={96} rx={18} fill="#F2B632" stroke={INK} strokeWidth={5} />
        <text y={14} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={INK}>sin ganar ni 1 €</text>
      </g>
      <Host x={150} y={560} s={0.42} mood={f > 54 ? 'wow' : 'ok'} look={12} />
    </svg>
  );
};

// Capítulo: la casa se abre, el calendario se llena y entran monedas
const ArtLlenar = () => {
  const f = useCurrentFrame();
  const open = f > 14;
  const lit = interpolate(f, [14, 24], [0, 1], clamp);
  const g = useSp(6);
  const weeks = ['JUN', 'JUL', 'AGO', 'SEP'];
  return (
    <svg viewBox="0 0 888 700" width="100%" height="100%">
      <Casa x={230} y={300} s={0.72} closed={!open} lit={lit} />
      <g transform={`translate(${-200 + g * 560},430)`}><Guest x={0} y={0} s={0.5} walking={g < 0.98} /></g>
      <g transform="translate(470,60)">
        <rect width={380} height={400} rx={22} fill="#FFFFFF" stroke={INK} strokeWidth={6} />
        <text x={190} y={56} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill={INK}>TEMPORADA ALTA</text>
        {weeks.map((w, k) => {
          const p = interpolate(f, [18 + k * 8, 30 + k * 8], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
          return (
            <g key={k} transform={`translate(24,${90 + k * 76})`}>
              <text x={0} y={42} fontFamily={FONT} fontWeight={800} fontSize={30} fill={MID}>{w}</text>
              <rect x={86} y={8} width={246} height={50} rx={12} fill="#E4E2DC" />
              <rect x={86} y={8} width={246 * p} height={50} rx={12} fill={INK} />
              <text x={316} y={44} textAnchor="end" fontFamily={FONT} fontWeight={900} fontSize={28} fill={CREAM} opacity={p > 0.9 ? 1 : 0}>RESERVADO</text>
            </g>
          );
        })}
      </g>
      {Array.from({ length: 6 }).map((_, k) => {
        const t = f - (30 + k * 6);
        const o = interpolate(t, [0, 4, 16, 20], [0, 1, 1, 0], clamp);
        return <Coin key={k} x={660 - t * 10} y={520 + Math.sin(k) * 30 - Math.max(0, t) * 2} s={0.8} o={o} />;
      })}
      <g transform={`translate(660,610) scale(${useSp(56, { damping: 8, stiffness: 230 })})`}>
        <rect x={-200} y={-44} width={400} height={84} rx={18} fill={RED} />
        <text y={14} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={38} fill={CREAM}>Ahora suma</text>
      </g>
      <Host x={110} y={560} s={0.42} mood="ok" look={12} />
    </svg>
  );
};


// ---------- normativa: ¿tu piso turístico es legal? (checklist 2025-2026) ----------
// Gancho: Laura repasa una lista de 3 puntos; las casillas parpadean con "?"
const ArtChecklist = () => {
  const f = useCurrentFrame();
  const board = useSp(0, { damping: 14, stiffness: 160 });
  const host = useSp(8);
  const items = ['Registro', 'Vecinos', 'IVA'];
  return (
    <svg viewBox="0 0 888 700" width="100%" height="100%">
      <g transform={`translate(410,${40 + (1 - board) * 500}) rotate(${3 * board})`}>
        <rect x={0} y={0} width={400} height={540} rx={26} fill="#FFFFFF" stroke={SOFT} strokeWidth={4} />
        <rect x={130} y={-22} width={140} height={50} rx={14} fill={MID} />
        <text x={200} y={90} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={32} fill={INK}>MI PISO TURÍSTICO</text>
        {items.map((t, k) => {
          const p = spring({ frame: f - 10 - k * 8, fps: 30, config: { damping: 9, stiffness: 220 } });
          const blink = 0.5 + 0.5 * Math.abs(Math.sin((f - k * 5) / 5));
          return (
            <g key={k} transform={`translate(40,${150 + k * 120})`} opacity={p}>
              <rect width={80} height={80} rx={16} fill="none" stroke={INK} strokeWidth={6} />
              <text x={40} y={60} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={60} fill={RED} opacity={blink}>?</text>
              <text x={110} y={56} fontFamily={FONT} fontWeight={900} fontSize={46} fill={INK}>{t}</text>
            </g>
          );
        })}
      </g>
      <g transform={`translate(${(1 - host) * -300},0)`}>
        <Host x={200} y={360} s={0.9} mood={f > 30 ? 'wow' : 'ok'} look={14} />
      </g>
    </svg>
  );
};

// Capítulo: el Supremo anula el registro estatal; la licencia autonómica sigue
const ArtSupremo = () => {
  const f = useCurrentFrame();
  const card = useSp(0, { damping: 15, stiffness: 150 });
  const hammer = interpolate(f, [14, 22, 26], [-50, 8, 0], clamp);
  const hit = f >= 22;
  const st = useSp(22, { damping: 9, stiffness: 260, mass: 0.7 });
  const lic = useSp(44, { damping: 10, stiffness: 200 });
  const ok = useSp(56, { damping: 8, stiffness: 240 });
  return (
    <svg viewBox="0 0 888 700" width="100%" height="100%">
      <g transform={`translate(40,${40 + (1 - card) * 400})`} opacity={card}>
        <rect width={380} height={250} rx={20} fill="#FFFFFF" stroke={INK} strokeWidth={6} opacity={hit ? 0.55 : 1} />
        <text x={30} y={70} fontFamily={FONT} fontWeight={800} fontSize={30} fill={MID}>Registro estatal</text>
        <text x={30} y={140} fontFamily={FONT} fontWeight={900} fontSize={64} fill={INK} opacity={hit ? 0.55 : 1}>NRUA</text>
        <rect x={30} y={170} width={300} height={14} rx={7} fill={SOFT} />
        <g transform={`translate(190,150) rotate(-10) scale(${hit ? 2 - 1.15 * st : 0})`}>
          <rect x={-160} y={-50} width={320} height={100} rx={14} fill="none" stroke={RED} strokeWidth={10} />
          <text y={20} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={58} fill={RED}>ANULADO</text>
        </g>
      </g>
      <g transform={`translate(700,90) rotate(${-40 + hammer * 0.8 + 40 * interpolate(f, [14, 22], [0, 1], clamp)})`}>
        <rect x={-12} y={0} width={24} height={170} rx={10} fill="#8A5A34" />
        <rect x={-70} y={160} width={140} height={64} rx={16} fill={INK} />
      </g>
      <rect x={470} y={330} width={180} height={30} rx={10} fill={INK} />
      <text x={560} y={398} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill={INK}>SUPREMO</text>
      <text x={560} y={432} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={26} fill={MID}>19 de mayo de 2026</text>
      <g transform={`translate(${470 + (1 - lic) * 500},460)`} opacity={lic}>
        <rect width={380} height={130} rx={20} fill="#FFFFFF" stroke={INK} strokeWidth={6} />
        <rect width={24} height={130} rx={10} fill={RED} />
        <text x={50} y={58} fontFamily={FONT} fontWeight={800} fontSize={28} fill={MID}>Sigue valiendo</text>
        <text x={50} y={104} fontFamily={FONT} fontWeight={900} fontSize={38} fill={INK}>Tu licencia</text>
        <g transform={`translate(330,64) scale(${ok})`}>
          <circle r={36} fill={RED} />
          <path d="M-16,0 l11,13 l22,-26" stroke={CREAM} strokeWidth={8} fill="none" strokeLinecap="round" />
        </g>
      </g>
      <Host x={170} y={560} s={0.42} mood={hit ? 'wow' : 'ok'} look={12} />
    </svg>
  );
};

// Capítulo: junta de vecinos; 3 de cada 5 levantan la mano
const ArtVecinos = () => {
  const f = useCurrentFrame();
  const bld = useSp(0, { damping: 15, stiffness: 150 });
  const tag = useSp(52, { damping: 8, stiffness: 230 });
  const yes = [true, false, true, true, false];
  return (
    <svg viewBox="0 0 888 700" width="100%" height="100%">
      <g transform={`translate(40,${30 + (1 - bld) * 400})`}>
        <rect width={240} height={420} rx={10} fill="#FFFFFF" stroke={INK} strokeWidth={6} />
        {Array.from({ length: 8 }).map((_, k) => (
          <rect key={k} x={30 + (k % 2) * 100} y={30 + Math.floor(k / 2) * 90} width={80} height={60} rx={6}
            fill={k === 5 ? RED : SOFT} stroke={INK} strokeWidth={4} />
        ))}
        <rect x={90} y={370} width={60} height={50} fill={INK} />
        <text x={120} y={470} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} fill={MID}>Tu edificio</text>
      </g>
      {yes.map((y, k) => {
        const p = spring({ frame: f - 8 - k * 5, fps: 30, config: { damping: 12, stiffness: 180 } });
        const hand = y ? interpolate(f, [26 + k * 4, 32 + k * 4], [0, 1], clamp) : 0;
        const x = 360 + k * 100;
        return (
          <g key={k} transform={`translate(${x},${200 + (1 - p) * 300})`} opacity={p}>
            <rect x={-34} y={40} width={68} height={110} rx={28} fill={y ? INK : MID} />
            <circle cy={10} r={34} fill={SKIN} />
            <rect x={22} y={40 - 80 * hand} width={18} height={70} rx={9} fill={y ? INK : MID} opacity={hand > 0 ? 1 : 0} />
            <circle cx={31} cy={30 - 80 * hand} r={14} fill={SKIN} opacity={hand > 0 ? 1 : 0} />
          </g>
        );
      })}
      <text x={600} y={130} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={INK}>JUNTA DE VECINOS</text>
      <g transform={`translate(600,450) scale(${tag}) rotate(-3)`}>
        <rect x={-220} y={-60} width={440} height={116} rx={22} fill={RED} />
        <text y={14} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={66} fill={CREAM}>3 de cada 5</text>
      </g>
      <g transform={`translate(600,580) scale(${tag})`}>
        <rect x={-210} y={-40} width={420} height={74} rx={16} fill={INK} />
        <text y={10} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill={CREAM}>desde abril de 2025</text>
      </g>
    </svg>
  );
};

// Capítulo: el IVA pasa del 0% al 10% el 1 de diciembre (pendiente de convalidar)
const ArtIva = () => {
  const f = useCurrentFrame();
  const cal = useSp(0, { damping: 13, stiffness: 160 });
  const pct = Math.round(interpolate(f, [18, 42], [0, 10], { ...clamp, easing: Easing.out(Easing.cubic) }));
  const q = useSp(50, { damping: 8, stiffness: 230 });
  return (
    <svg viewBox="0 0 888 700" width="100%" height="100%">
      <g transform={`translate(60,${50 + (1 - cal) * 400}) rotate(${-4 * cal})`}>
        <rect width={300} height={320} rx={24} fill="#FFFFFF" stroke={INK} strokeWidth={6} />
        <rect width={300} height={90} rx={24} fill={RED} /><rect y={60} width={300} height={30} fill={RED} />
        <text x={150} y={64} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill={CREAM}>DICIEMBRE</text>
        <text x={150} y={260} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={170} fill={INK}>1</text>
      </g>
      <g transform="translate(460,60)">
        <rect width={380} height={420} rx={18} fill="#FFFFFF" stroke={INK} strokeWidth={6} />
        <text x={30} y={66} fontFamily={FONT} fontWeight={900} fontSize={30} fill={INK}>FACTURA</text>
        <rect x={30} y={96} width={320} height={14} rx={7} fill={SOFT} />
        <rect x={30} y={126} width={240} height={14} rx={7} fill={SOFT} />
        <text x={30} y={230} fontFamily={FONT} fontWeight={800} fontSize={40} fill={MID}>IVA</text>
        <text x={350} y={250} textAnchor="end" fontFamily={FONT} fontWeight={900} fontSize={100} fill={pct > 0 ? RED : INK}>{pct}%</text>
        <rect x={30} y={290} width={320} height={6} fill={INK} />
        <text x={30} y={360} fontFamily={FONT} fontWeight={700} fontSize={28} fill={MID}>Hasta 30 noches</text>
      </g>
      <g transform={`translate(420,590) scale(${q}) rotate(-2)`}>
        <rect x={-300} y={-48} width={600} height={92} rx={18} fill="#F2B632" stroke={INK} strokeWidth={5} />
        <text y={14} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={38} fill={INK}>si el decreto se convalida</text>
      </g>
      <Host x={130} y={420} s={0.42} mood={f > 42 ? 'wow' : 'ok'} look={14} />
    </svg>
  );
};

// ---------- precios: la comisión única del 15,5 % de Airbnb ----------
// Gancho: el pago de Laura baja de 100 € a 84,50 € y las monedas se van a "Airbnb"
const ArtPago = () => {
  const f = useCurrentFrame();
  const card = useSp(0, { damping: 14, stiffness: 160 });
  const host = useSp(8);
  const amt = interpolate(f, [16, 46], [100, 84.5], { ...clamp, easing: Easing.out(Easing.cubic) });
  const tag = useSp(46, { damping: 8, stiffness: 240 });
  const txt = amt.toFixed(2).replace('.', ',').replace(',00', '');
  return (
    <svg viewBox="0 0 888 700" width="100%" height="100%">
      <g transform={`translate(390,${60 + (1 - card) * 500}) rotate(${-2 * card})`}>
        <rect width={440} height={330} rx={26} fill="#FFFFFF" stroke={INK} strokeWidth={6} />
        <rect width={440} height={84} rx={26} fill={INK} /><rect y={54} width={440} height={30} fill={INK} />
        <text x={220} y={56} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill={CREAM}>TU PAGO</text>
        <text x={36} y={140} fontFamily={FONT} fontWeight={700} fontSize={28} fill={MID}>1 noche a 100 €</text>
        <text x={404} y={262} textAnchor="end" fontFamily={FONT} fontWeight={900} fontSize={110} fill={f > 20 ? RED : INK}>{txt} €</text>
      </g>
      {Array.from({ length: 7 }).map((_, k) => {
        const t = f - (18 + k * 4);
        const o = interpolate(t, [0, 3, 22, 28], [0, 1, 1, 0], clamp);
        const p = interpolate(t, [0, 26], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
        return <Coin key={k} x={610 + (k % 3 - 1) * 40 + p * 60} y={330 + p * 250} s={0.8} o={o} />;
      })}
      <g transform={`translate(680,610) scale(${tag}) rotate(-3)`}>
        <rect x={-190} y={-50} width={380} height={96} rx={18} fill={RED} />
        <text y={16} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={46} fill={CREAM}>-15,5 %</text>
      </g>
      <g transform={`translate(${(1 - host) * -300},0)`}>
        <Host x={180} y={380} s={0.85} mood={f > 34 ? 'wow' : 'ok'} look={14} />
      </g>
    </svg>
  );
};

// Capítulo: antes y ahora; la comisión pasa del huésped a la anfitriona
const ArtReparto = () => {
  const f = useCurrentFrame();
  const a = useSp(0, { damping: 15, stiffness: 150 });
  const b = useSp(22, { damping: 12, stiffness: 170 });
  const st = useSp(48, { damping: 9, stiffness: 240 });
  const Bar = ({ y, label, host, guest, p, hl }) => (
    <g transform={`translate(60,${y})`} opacity={p}>
      <text x={0} y={-16} fontFamily={FONT} fontWeight={900} fontSize={36} fill={INK}>{label}</text>
      <rect x={0} y={0} width={500 * p} height={90} rx={16} fill="#E4E2DC" />
      <rect x={0} y={0} width={Math.max(150, host * 500) * p} height={90} rx={16} fill={hl ? RED : INK} />
      <text x={20} y={58} fontFamily={FONT} fontWeight={900} fontSize={34} fill={CREAM}>Tú {host === 1 ? '15,5 %' : '3 %'}</text>
      {guest ? <text x={480} y={58} textAnchor="end" fontFamily={FONT} fontWeight={800} fontSize={30} fill={INK}>Huésped ~14 %</text> : null}
    </g>
  );
  return (
    <svg viewBox="0 0 888 700" width="100%" height="100%">
      <Bar y={110} label="ANTES" host={0.19} guest p={a} />
      <Bar y={330} label="AHORA" host={1} p={b} hl />
      <g transform={`translate(640,560) scale(${st}) rotate(-4)`}>
        <rect x={-200} y={-50} width={400} height={96} rx={18} fill="#F2B632" stroke={INK} strokeWidth={5} />
        <text y={14} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={36} fill={INK}>+ limpieza y extras</text>
      </g>
      <Guest x={720} y={170} s={0.42} walking={false} />
      <Host x={150} y={560} s={0.4} mood={f > 30 ? 'sad' : 'ok'} look={12} />
    </svg>
  );
};

// Capítulo: el IVA del 21 % sobre la comisión la lleva a casi el 19 %
const ArtIvaComision = () => {
  const f = useCurrentFrame();
  const doc = useSp(0, { damping: 15, stiffness: 150 });
  const pct = interpolate(f, [20, 50], [15.5, 18.76], { ...clamp, easing: Easing.out(Easing.cubic) });
  const tag = useSp(52, { damping: 8, stiffness: 230 });
  return (
    <svg viewBox="0 0 888 700" width="100%" height="100%">
      <g transform={`translate(40,${40 + (1 - doc) * 400}) rotate(${-3 * doc})`} opacity={doc}>
        <rect width={380} height={400} rx={18} fill="#FFFFFF" stroke={INK} strokeWidth={6} />
        <rect width={380} height={80} rx={18} fill={INK} /><rect y={50} width={380} height={30} fill={INK} />
        <text x={190} y={54} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill={CREAM}>FACTURA AIRBNB</text>
        <text x={30} y={150} fontFamily={FONT} fontWeight={800} fontSize={34} fill={MID}>Comisión</text>
        <text x={350} y={150} textAnchor="end" fontFamily={FONT} fontWeight={900} fontSize={40} fill={INK}>15,5 %</text>
        <text x={30} y={230} fontFamily={FONT} fontWeight={800} fontSize={34} fill={MID}>IVA</text>
        <text x={350} y={230} textAnchor="end" fontFamily={FONT} fontWeight={900} fontSize={40} fill={RED} opacity={interpolate(f, [12, 18], [0, 1], clamp)}>+21 %</text>
        <rect x={30} y={270} width={320} height={6} fill={INK} />
        <text x={30} y={350} fontFamily={FONT} fontWeight={700} fontSize={28} fill={MID}>Si eres particular</text>
      </g>
      <g transform="translate(650,250)">
        <circle r={160} fill={RED} />
        <text y={-50} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill={INK}>PAGAS</text>
        <text y={40} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={80} fill={CREAM}>{pct.toFixed(1).replace('.', ',')}%</text>
        <text y={96} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={28} fill={INK}>DE CADA RESERVA</text>
      </g>
      <g transform={`translate(600,580) scale(${tag}) rotate(-3)`}>
        <rect x={-230} y={-50} width={460} height={96} rx={18} fill="#F2B632" stroke={INK} strokeWidth={5} />
        <text y={14} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={INK}>casi 19 € de cada 100</text>
      </g>
      <Host x={150} y={560} s={0.42} mood={f > 50 ? 'wow' : 'ok'} look={12} />
    </svg>
  );
};

// Capítulo: Laura sube el precio solo en Airbnb; Booking y web se quedan igual
const ArtAjuste = () => {
  const f = useCurrentFrame();
  const g = useSp(0, { damping: 15, stiffness: 150 });
  const up = interpolate(f, [14, 40], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const ok = useSp(48, { damping: 8, stiffness: 240 });
  const rows = [['Airbnb', true], ['Booking', false], ['Tu web', false]];
  return (
    <svg viewBox="0 0 888 700" width="100%" height="100%">
      <g transform={`translate(330,${40 + (1 - g) * 400})`}>
        <rect width={500} height={420} rx={24} fill="#FFFFFF" stroke={INK} strokeWidth={6} />
        <text x={250} y={62} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill={INK}>PRECIO POR NOCHE</text>
        {rows.map(([n, a], k) => {
          const v = a ? Math.round(100 + 15 * up) : 100;
          return (
            <g key={k} transform={`translate(30,${100 + k * 100})`}>
              <rect width={440} height={80} rx={16} fill={a ? INK : '#E4E2DC'} />
              <text x={24} y={52} fontFamily={FONT} fontWeight={900} fontSize={36} fill={a ? CREAM : INK}>{n}</text>
              <text x={416} y={54} textAnchor="end" fontFamily={FONT} fontWeight={900} fontSize={44} fill={a ? '#F2B632' : INK}>{v} €</text>
              {a ? <path d={`M250,${58 - 20 * up} l18,-22 l18,22`} stroke="#F2B632" strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={up} /> : null}
            </g>
          );
        })}
      </g>
      <g transform={`translate(580,580) scale(${ok}) rotate(-2)`}>
        <rect x={-260} y={-50} width={520} height={96} rx={18} fill={RED} />
        <text y={14} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={CREAM}>vuelve a cobrar 97 €</text>
      </g>
      {Array.from({ length: 5 }).map((_, k) => {
        const t = f - (50 + k * 5);
        const o = interpolate(t, [0, 4, 14, 18], [0, 1, 1, 0], clamp);
        return <Coin key={k} x={200 + k * 18} y={300 - Math.max(0, t) * 6} s={0.7} o={o} />;
      })}
      <Host x={170} y={420} s={0.6} mood={f > 48 ? 'ok' : 'wow'} look={14} />
    </svg>
  );
};

export const ART = { pago: ArtPago, reparto: ArtReparto, ivacomision: ArtIvaComision, ajuste: ArtAjuste, calendario: ArtCalendario, bloqueo: ArtBloqueo, solucion: ArtSolucion, noche: ArtNoche, doble: ArtDoble, multa: ArtMulta, ranking: ArtRanking, sync: ArtSync, portada: ArtPortada, mirada: ArtMirada, orden: ArtOrden, flash: ArtFlash,
  retirada: ArtRetirada, decreto: ArtDecreto, contador: ArtContador, elegir: ArtElegir,
  contrato: ArtContrato, prorroga: ArtProrroga, impago: ArtImpago, llaves: ArtLlaves,
  fuga: ArtFuga, recibos: ArtRecibos, catastro: ArtCatastro, llenar: ArtLlenar,
  checklist: ArtChecklist, supremo: ArtSupremo, vecinos: ArtVecinos, iva: ArtIva };

// Efectos de sonido sincronizados con cada ilustración: [frame, efecto, volumen]
export const ART_SFX = {
  pago: [[4, 'whoosh', 0.3], ...Array.from({ length: 7 }, (_, k) => [18 + k * 4, 'cash', 0.2]), [46, 'impact', 0.7]],
  reparto: [[2, 'pop', 0.4], [22, 'whoosh', 0.35], [30, 'impact', 0.55], [48, 'pop', 0.45]],
  ivacomision: [[12, 'pop', 0.45], [20, 'riser', 0.3], [50, 'impact', 0.55], [52, 'pop', 0.4]],
  ajuste: [[14, 'riser', 0.3], [40, 'ding', 0.45], [48, 'pop', 0.45], [50, 'cash', 0.4]],
  checklist: [[0, 'whoosh', 0.3], [10, 'pop', 0.4], [18, 'pop', 0.4], [26, 'pop', 0.4]],
  supremo: [[22, 'impact', 0.9], [44, 'whoosh', 0.3], [56, 'ding', 0.45]],
  vecinos: [[26, 'pop', 0.35], [34, 'pop', 0.35], [38, 'pop', 0.35], [52, 'impact', 0.55]],
  iva: [[18, 'riser', 0.3], [42, 'cash', 0.5], [50, 'pop', 0.45]],
  fuga: [[6, 'impact', 0.6], ...Array.from({ length: 9 }, (_, k) => [14 + k * 5, 'cash', 0.18])],
  recibos: [[6, 'pop', 0.4], [15, 'pop', 0.4], [24, 'pop', 0.4], [33, 'pop', 0.4], [46, 'impact', 0.55]],
  catastro: [[20, 'riser', 0.3], [52, 'impact', 0.55], [56, 'pop', 0.4]],
  llenar: [[14, 'ding', 0.45], [30, 'cash', 0.4], [42, 'cash', 0.35], [56, 'pop', 0.45]],
  contrato: [[18, 'whoosh', 0.3], [26, 'impact', 0.9]],
  prorroga: [[10, 'pop', 0.4], [19, 'pop', 0.4], [28, 'pop', 0.4], [37, 'pop', 0.4], [46, 'pop', 0.4], [56, 'ding', 0.45]],
  impago: [[4, 'riser', 0.35], [46, 'impact', 0.6], [50, 'pop', 0.45]],
  llaves: [[8, 'whoosh', 0.3], [44, 'cash', 0.45]],
  retirada: [[24, 'impact', 0.9]],
  decreto: [[20, 'pop', 0.5], ...Array.from({ length: 8 }, (_, k) => [28 + k * 4, 'click', 0.2]), [60, 'ding', 0.45]],
  contador: [[4, 'riser', 0.35], [46, 'impact', 0.6], [50, 'pop', 0.45]],
  elegir: [[12, 'impact', 0.55], [20, 'pop', 0.4], [28, 'pop', 0.4], [42, 'cash', 0.45]],
  doble: [[36, 'impact', 0.85]],
  multa: [[14, 'pop', 0.4], [40, 'impact', 0.7], [44, 'cash', 0.4]],
  ranking: [[20, 'riser', 0.3], [46, 'impact', 0.5]],
  sync: [[4, 'pop', 0.4], [30, 'whoosh', 0.35], [50, 'impact', 0.55]],
  solucion: [[30, 'pop', 0.4], [42, 'cash', 0.4]], bloqueo: [[30, 'pop', 0.4], [46, 'impact', 0.5]],
  noche: [[26, 'impact', 0.5]], calendario: [[48, 'pop', 0.5]],
};
