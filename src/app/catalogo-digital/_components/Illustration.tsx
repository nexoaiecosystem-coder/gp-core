// Ilustraciones de producto estilo "3D" (volumen con degradés y sombra), dibujadas en SVG.
// Cada producto se asocia a un dibujo base y un color en ../_illustrations.ts.
import type { ReactNode } from "react";
import type { IllustrationSpec } from "../_illustrations";

function hex(c: string) {
  const n = parseInt(c.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
/** amt > 0 aclara hacia blanco, amt < 0 oscurece hacia negro. */
function shade(c: string, amt: number) {
  const t = amt < 0 ? 0 : 255;
  const p = Math.abs(amt);
  const [r, g, b] = hex(c).map((v) => Math.round(v + (t - v) * p));
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}

type Ctx = { a: string; b: string; v: string; vb: string; c: string; k: string };

/** Sombra de apoyo en el piso. */
const floor = (cx = 60, rx = 34) => <ellipse cx={cx} cy={106} rx={rx} ry={5} fill="#000" opacity={0.12} />;

const DRAW: Record<IllustrationSpec["kind"], (g: Ctx) => ReactNode> = {
  jug: (g) => (
    <>
      {floor(58, 30)}
      <path d="M36 44 Q36 34 46 32 L52 30 L52 22 L66 22 L66 30 L74 32 Q84 34 84 44 L84 98 Q84 105 77 105 L43 105 Q36 105 36 98 Z" fill={`url(#${g.a})`} />
      <path d="M38 52 L82 52" stroke="#fff" strokeOpacity={0.35} />
      <path d="M38 76 L82 76" stroke="#000" strokeOpacity={0.08} />
      <rect x={42} y={58} width={36} height={24} rx={2} fill="#fff" opacity={0.92} />
      <rect x={46} y={64} width={28} height={3} rx={1.5} fill={g.c} opacity={0.6} />
      <rect x={46} y={70} width={20} height={2} rx={1} fill="#9aa0a3" />
      <path d="M66 26 Q90 20 82 44" fill="none" stroke="#f1f1ee" strokeWidth={5} strokeLinecap="round" />
      <rect x={51} y={16} width={16} height={9} rx={2} fill="#f4f4f2" stroke="#d6d6d2" />
      <path d="M44 38 Q42 70 46 98" stroke="#fff" strokeOpacity={0.45} strokeWidth={3} fill="none" strokeLinecap="round" />
    </>
  ),
  bottle: (g) => (
    <>
      {floor(60, 20)}
      <path d="M47 46 Q47 36 55 32 L55 22 L65 22 L65 32 Q73 36 73 46 L73 100 Q73 105 68 105 L52 105 Q47 105 47 100 Z" fill={`url(#${g.a})`} />
      <rect x={53} y={13} width={14} height={11} rx={2} fill={g.k} />
      <rect x={50} y={60} width={20} height={26} rx={2} fill="#fff" opacity={0.9} />
      <rect x={53} y={66} width={14} height={3} rx={1.5} fill={g.c} opacity={0.7} />
      <path d="M51 44 L51 98" stroke="#fff" strokeOpacity={0.5} strokeWidth={2.5} strokeLinecap="round" />
    </>
  ),
  trigger: (g) => (
    <>
      {floor(58, 20)}
      <path d="M46 52 Q46 44 53 41 L53 34 L65 34 L65 41 Q72 44 72 52 L72 100 Q72 105 67 105 L51 105 Q46 105 46 100 Z" fill={`url(#${g.a})`} />
      <path d="M50 22 L74 22 Q78 22 78 26 L78 30 L66 30 L64 36 L54 36 L52 30 Q50 28 50 24 Z" fill={g.k} />
      <path d="M58 30 L54 46 L60 46" fill="none" stroke={g.k} strokeWidth={4} strokeLinejoin="round" />
      <rect x={78} y={24} width={4} height={4} fill={shade(g.k, -0.2)} />
      <rect x={49} y={62} width={20} height={24} rx={2} fill="#fff" opacity={0.9} />
      <rect x={52} y={68} width={14} height={3} rx={1.5} fill={g.c} opacity={0.7} />
      <path d="M50 52 L50 98" stroke="#fff" strokeOpacity={0.5} strokeWidth={2.5} strokeLinecap="round" />
    </>
  ),
  aerosol: (g) => (
    <>
      {floor(60, 18)}
      <rect x={46} y={34} width={28} height={70} rx={4} fill={`url(#${g.a})`} />
      <path d="M48 34 Q60 26 72 34 Z" fill={`url(#${g.b})`} />
      <rect x={49} y={18} width={22} height={14} rx={4} fill={`url(#${g.b})`} />
      <rect x={46} y={58} width={28} height={20} fill="#fff" opacity={0.25} />
      <rect x={50} y={64} width={20} height={3} rx={1.5} fill="#fff" opacity={0.85} />
      <path d="M51 38 L51 100" stroke="#fff" strokeOpacity={0.45} strokeWidth={3} strokeLinecap="round" />
    </>
  ),
  bar: (g) => (
    <>
      {floor(60, 32)}
      <path d="M28 72 L60 60 L92 72 L60 84 Z" fill={shade(g.c, 0.35)} />
      <path d="M28 72 L60 84 L60 98 L28 86 Z" fill={shade(g.c, -0.05)} />
      <path d="M92 72 L60 84 L60 98 L92 86 Z" fill={shade(g.c, -0.2)} />
      <path d="M44 72 L60 66 L76 72 L60 78 Z" fill="#fff" opacity={0.35} />
    </>
  ),
  bucket: (g) => (
    <>
      {floor(60, 34)}
      <path d="M28 46 L92 46 L84 102 Q84 105 80 105 L40 105 Q36 105 36 102 Z" fill={`url(#${g.a})`} />
      <ellipse cx={60} cy={46} rx={32} ry={8} fill={shade(g.c, -0.35)} />
      <ellipse cx={60} cy={46} rx={32} ry={8} fill="none" stroke={shade(g.c, 0.2)} strokeWidth={2} />
      <path d="M30 48 Q60 8 90 48" fill="none" stroke="#9ea4a7" strokeWidth={2.5} />
      <path d="M38 52 L42 100" stroke="#fff" strokeOpacity={0.35} strokeWidth={3} strokeLinecap="round" />
    </>
  ),
  wringer: (g) => (
    <>
      {floor(60, 38)}
      <path d="M22 50 L98 50 L90 100 Q89 105 84 105 L36 105 Q31 105 30 100 Z" fill={`url(#${g.a})`} />
      <ellipse cx={60} cy={50} rx={38} ry={9} fill={shade(g.c, -0.35)} />
      <path d="M60 40 L92 44 L88 62 L62 60 Z" fill="#2d2f31" />
      <ellipse cx={74} cy={50} rx={9} ry={4} fill="#1a1b1c" />
      <path d="M30 54 L36 98" stroke="#fff" strokeOpacity={0.3} strokeWidth={3} strokeLinecap="round" />
    </>
  ),
  bin: (g) => (
    <>
      {floor(60, 26)}
      <path d="M38 40 L82 40 L78 102 Q78 105 74 105 L46 105 Q42 105 42 102 Z" fill={`url(#${g.a})`} />
      <path d="M36 40 Q36 22 60 20 Q84 22 84 40 Z" fill={`url(#${g.b})`} />
      <path d="M48 34 Q60 26 72 34 L72 38 L48 38 Z" fill="#000" opacity={0.15} />
      <path d="M45 46 L48 98" stroke="#fff" strokeOpacity={0.3} strokeWidth={3} strokeLinecap="round" />
    </>
  ),
  wheelie: (g) => (
    <>
      {floor(60, 32)}
      <path d="M32 34 L88 34 L84 98 L36 98 Z" fill={`url(#${g.a})`} />
      <path d="M28 26 L92 26 L92 36 L28 36 Z" fill={shade(g.c, -0.25)} />
      <circle cx={42} cy={101} r={5} fill="#222" />
      <circle cx={78} cy={101} r={5} fill="#222" />
      <circle cx={60} cy={64} r={13} fill="none" stroke="#fff" strokeOpacity={0.8} strokeWidth={2} />
      <path d="M40 40 L42 92" stroke="#fff" strokeOpacity={0.3} strokeWidth={3} strokeLinecap="round" />
    </>
  ),
  bagroll: (g) => (
    <>
      {floor(60, 22)}
      <rect x={40} y={26} width={40} height={78} rx={4} fill={`url(#${g.a})`} />
      <ellipse cx={60} cy={26} rx={20} ry={6} fill={shade(g.c, 0.15)} />
      <ellipse cx={60} cy={26} rx={6} ry={2} fill={shade(g.c, -0.4)} />
      <rect x={44} y={50} width={32} height={30} rx={2} fill={g.k} />
      <rect x={48} y={56} width={24} height={4} rx={1} fill="#fff" opacity={0.9} />
      <rect x={48} y={64} width={16} height={3} rx={1} fill="#fff" opacity={0.7} />
      <path d="M44 32 L44 100" stroke="#fff" strokeOpacity={0.3} strokeWidth={2.5} strokeLinecap="round" />
    </>
  ),
  trashbag: (g) => (
    <>
      {floor(60, 30)}
      <path d="M52 30 Q60 22 68 30 L70 40 Q92 54 88 84 Q84 104 60 104 Q36 104 32 84 Q28 54 50 40 Z" fill={`url(#${g.a})`} />
      <path d="M52 30 L48 22 M68 30 L72 22" stroke={shade(g.c, -0.2)} strokeWidth={3} strokeLinecap="round" />
      <path d="M44 56 Q40 74 46 92" stroke="#fff" strokeOpacity={0.35} strokeWidth={3} fill="none" strokeLinecap="round" />
      <path d="M60 44 Q66 70 62 96" stroke="#000" strokeOpacity={0.12} strokeWidth={2} fill="none" />
    </>
  ),
  broom: (g) => (
    <>
      {floor(60, 30)}
      <rect x={57} y={8} width={6} height={66} rx={3} fill={`url(#${g.b})`} />
      <path d="M38 72 L82 72 L84 80 L36 80 Z" fill={`url(#${g.a})`} />
      {Array.from({ length: 12 }, (_, i) => (
        <path key={i} d={`M${38 + i * 4} 80 L${35 + i * 4.5} 104`} stroke={shade(g.c, i % 2 ? 0.1 : -0.15)} strokeWidth={3.2} strokeLinecap="round" />
      ))}
    </>
  ),
  squeegee: (g) => (
    <>
      {floor(60, 32)}
      <rect x={57} y={8} width={6} height={80} rx={3} fill={`url(#${g.b})`} />
      <rect x={28} y={86} width={64} height={10} rx={2} fill={`url(#${g.a})`} />
      <rect x={28} y={96} width={64} height={5} rx={1} fill="#1f2022" />
    </>
  ),
  mop: (g) => (
    <>
      {floor(60, 26)}
      <rect x={57} y={8} width={6} height={70} rx={3} fill={`url(#${g.b})`} />
      <rect x={52} y={72} width={16} height={8} rx={2} fill={shade(g.c, -0.4)} />
      {Array.from({ length: 11 }, (_, i) => (
        <path key={i} d={`M${48 + i * 2.4} 80 Q${40 + i * 4} 92 ${36 + i * 5} 104`} stroke={shade(g.c, i % 2 ? 0.15 : -0.1)} strokeWidth={4} fill="none" strokeLinecap="round" />
      ))}
    </>
  ),
  dustpan: (g) => (
    <>
      {floor(60, 34)}
      <path d="M26 74 L86 64 L96 96 L30 104 Z" fill={`url(#${g.a})`} />
      <path d="M26 74 L30 104 L24 102 L20 76 Z" fill={shade(g.c, -0.3)} />
      <path d="M86 64 L104 34" stroke={shade(g.c, -0.15)} strokeWidth={7} strokeLinecap="round" />
    </>
  ),
  sponge: (g) => (
    <>
      {floor(60, 32)}
      <path d="M28 66 L62 54 L94 66 L60 78 Z" fill={shade(g.c, 0.25)} />
      <path d="M28 66 L60 78 L60 92 L28 80 Z" fill={g.c} />
      <path d="M94 66 L60 78 L60 92 L94 80 Z" fill={shade(g.c, -0.2)} />
      <path d="M28 80 L60 92 L60 100 L28 88 Z" fill={shade(g.k, 0)} />
      <path d="M94 80 L60 92 L60 100 L94 88 Z" fill={shade(g.k, -0.2)} />
      {Array.from({ length: 9 }, (_, i) => (
        <circle key={i} cx={36 + (i % 3) * 8 + i * 3} cy={64 + (i % 2) * 4} r={1.2} fill="#000" opacity={0.15} />
      ))}
    </>
  ),
  scrubber: (g) => (
    <>
      {floor(60, 26)}
      <circle cx={60} cy={76} r={26} fill={`url(#${g.a})`} />
      {Array.from({ length: 14 }, (_, i) => (
        <path key={i} d={`M${40 + (i % 5) * 9} ${58 + Math.floor(i / 5) * 12} q6 -6 10 2 q4 6 -4 8`} fill="none" stroke={shade(g.c, i % 2 ? 0.5 : -0.3)} strokeWidth={1.6} />
      ))}
    </>
  ),
  cloth: (g) => (
    <>
      {floor(60, 34)}
      <path d="M24 78 L62 64 L98 76 L60 92 Z" fill={shade(g.c, 0.15)} />
      <path d="M24 78 L60 92 L60 100 L24 86 Z" fill={shade(g.c, -0.1)} />
      <path d="M98 76 L60 92 L60 100 L98 84 Z" fill={shade(g.c, -0.25)} />
      <path d="M34 78 L62 68 L88 77" fill="none" stroke={g.k} strokeWidth={2} strokeDasharray="3 3" />
    </>
  ),
  glove: (g) => (
    <>
      {floor(60, 22)}
      <path d="M44 104 L44 70 L38 54 Q36 48 41 47 Q45 46 47 52 L50 60 L50 30 Q50 25 54 25 Q58 25 58 30 L58 56 L59 24 Q59 19 63 19 Q67 19 67 24 L67 56 L68 28 Q68 23 72 23 Q76 23 76 28 L76 60 L77 38 Q77 34 80 34 Q84 34 84 38 L84 78 Q84 92 76 104 Z" fill={`url(#${g.a})`} />
      <path d="M44 96 L76 96" stroke="#fff" strokeOpacity={0.35} strokeWidth={2} />
    </>
  ),
  rollbox: (g) => (
    <>
      {floor(60, 46)}
      <path d="M12 70 L84 52 L108 62 L36 80 Z" fill={shade(g.c, 0.35)} />
      <path d="M12 70 L36 80 L36 100 L12 90 Z" fill={shade(g.c, -0.25)} />
      <path d="M36 80 L108 62 L108 82 L36 100 Z" fill={`url(#${g.v})`} />
      <path d="M44 86 L100 72" stroke={g.k} strokeWidth={5} strokeLinecap="round" />
      <path d="M40 78 L106 61" stroke="#d6d9db" strokeWidth={2} />
    </>
  ),
  roll: (g) => (
    <>
      {floor(60, 40)}
      <rect x={22} y={56} width={72} height={36} rx={2} fill={`url(#${g.v})`} />
      <ellipse cx={94} cy={74} rx={8} ry={18} fill={shade(g.c, 0.2)} />
      <ellipse cx={94} cy={74} rx={3} ry={6} fill="#a4825a" />
      <path d="M26 62 L90 62" stroke="#fff" strokeOpacity={0.6} strokeWidth={3} strokeLinecap="round" />
    </>
  ),
  tissue: (g) => (
    <>
      {floor(60, 34)}
      {[0, 1].map((r) =>
        [0, 1].map((c) => (
          <g key={`${r}${c}`} transform={`translate(${c * 30 + (1 - r) * 8} ${-r * 26})`}>
            <rect x={26} y={60} width={28} height={40} rx={3} fill={`url(#${g.a})`} />
            <ellipse cx={40} cy={60} rx={14} ry={5} fill={shade(g.c, 0.3)} />
            <ellipse cx={40} cy={60} rx={4} ry={1.6} fill="#b0916a" />
          </g>
        ))
      )}
    </>
  ),
  jumbo: (g) => (
    <>
      {floor(60, 34)}
      <rect x={26} y={50} width={68} height={50} rx={3} fill={`url(#${g.a})`} />
      <ellipse cx={60} cy={50} rx={34} ry={11} fill={shade(g.c, 0.3)} />
      <ellipse cx={60} cy={50} rx={10} ry={3.2} fill="#b0916a" />
      <ellipse cx={60} cy={50} rx={22} ry={7} fill="none" stroke="#000" strokeOpacity={0.05} />
    </>
  ),
  napkins: (g) => (
    <>
      {floor(60, 36)}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <path key={i} d={`M24 ${88 - i * 5} L60 ${76 - i * 5} L96 ${88 - i * 5} L60 ${100 - i * 5} Z`} fill={i === 5 ? shade(g.c, 0.4) : shade(g.c, -0.05 - (i % 2) * 0.05)} stroke="#000" strokeOpacity={0.06} />
      ))}
      <path d="M36 62 L60 54 L84 62" fill="none" stroke={g.k} strokeWidth={2} opacity={0.7} />
    </>
  ),
  dispenser: (g) => (
    <>
      {floor(60, 30)}
      <path d="M34 34 L86 34 L86 96 Q86 102 80 102 L40 102 Q34 102 34 96 Z" fill={`url(#${g.a})`} />
      <rect x={42} y={86} width={36} height={5} rx={2} fill="#555" />
      <path d="M48 91 L72 91 L70 100 L50 100 Z" fill="#fff" stroke="#ddd" />
      <rect x={44} y={46} width={32} height={22} rx={3} fill={g.k} opacity={0.85} />
    </>
  ),
  tshirt: (g) => (
    <>
      {floor(60, 28)}
      <path d="M36 30 L46 30 L48 44 Q60 50 72 44 L74 30 L84 30 L86 52 Q88 54 88 58 L88 100 Q88 104 84 104 L36 104 Q32 104 32 100 L32 58 Q32 54 34 52 Z" fill={`url(#${g.a})`} opacity={0.95} />
      <path d="M40 60 Q38 80 42 98" stroke="#fff" strokeOpacity={0.4} strokeWidth={3} fill="none" strokeLinecap="round" />
    </>
  ),
  paperbag: (g) => (
    <>
      {floor(60, 28)}
      <path d="M38 36 L78 36 L78 104 L38 104 Z" fill={`url(#${g.v})`} />
      <path d="M78 36 L90 42 L90 100 L78 104 Z" fill={shade(g.c, -0.25)} />
      <path d="M50 36 Q50 20 58 20 Q66 20 66 36" fill="none" stroke={shade(g.c, -0.3)} strokeWidth={3} />
      <path d="M38 36 L44 30 L84 30 L90 42" fill="none" stroke={shade(g.c, -0.1)} strokeWidth={1} />
    </>
  ),
  tray: (g) => (
    <>
      {floor(60, 46)}
      <path d="M14 72 L60 56 L106 72 L60 90 Z" fill={shade(g.c, 0.25)} />
      <path d="M22 72 L60 59 L98 72 L60 86 Z" fill={shade(g.c, -0.08)} />
      <path d="M14 72 L60 90 L60 98 L16 80 Z" fill={g.c} />
      <path d="M106 72 L60 90 L60 98 L104 80 Z" fill={shade(g.c, -0.18)} />
    </>
  ),
  traylid: (g) => (
    <>
      {floor(60, 44)}
      <path d="M16 78 L60 62 L104 78 L60 96 Z" fill={g.c} />
      <path d="M16 78 L60 96 L60 102 L18 85 Z" fill={shade(g.c, -0.1)} />
      <path d="M104 78 L60 96 L60 102 L102 85 Z" fill={shade(g.c, -0.25)} />
      <path d="M18 66 L60 50 L102 66 L60 82 Z" fill={g.k} opacity={0.55} stroke="#9aa6ad" />
      <path d="M30 64 L60 53" stroke="#fff" strokeOpacity={0.8} strokeWidth={2} />
    </>
  ),
  disc: (g) => (
    <>
      {floor(60, 44)}
      <ellipse cx={60} cy={84} rx={44} ry={15} fill={shade(g.c, -0.18)} />
      <ellipse cx={60} cy={80} rx={44} ry={15} fill={shade(g.c, 0.2)} />
      <ellipse cx={60} cy={80} rx={34} ry={10} fill="none" stroke="#000" strokeOpacity={0.05} />
    </>
  ),
  clamshell: (g) => (
    <>
      {floor(60, 40)}
      <path d="M20 80 L60 66 L100 80 L60 96 Z" fill={shade(g.c, 0)} />
      <path d="M20 80 L60 96 L60 102 L22 87 Z" fill={shade(g.c, -0.1)} />
      <path d="M100 80 L60 96 L60 102 L98 87 Z" fill={shade(g.c, -0.2)} />
      <path d="M20 78 L60 64 L100 78 L60 40 Q40 46 20 78 Z" fill={shade(g.c, 0.2)} opacity={0.95} />
      <path d="M60 40 L100 78" stroke="#000" strokeOpacity={0.08} />
    </>
  ),
  flatbox: (g) => (
    <>
      {floor(60, 46)}
      <path d="M14 70 L60 54 L106 70 L60 88 Z" fill={shade(g.c, 0.2)} />
      <path d="M14 70 L60 88 L60 100 L14 82 Z" fill={g.c} />
      <path d="M106 70 L60 88 L60 100 L106 82 Z" fill={shade(g.c, -0.2)} />
      <path d="M32 70 L60 60 L88 70" fill="none" stroke={g.k} strokeWidth={2} opacity={0.6} />
    </>
  ),
  box: (g) => (
    <>
      {floor(60, 40)}
      <path d="M22 48 L60 34 L98 48 L60 62 Z" fill={shade(g.c, 0.3)} />
      <path d="M22 48 L60 62 L60 102 L22 88 Z" fill={g.c} />
      <path d="M98 48 L60 62 L60 102 L98 88 Z" fill={shade(g.c, -0.2)} />
      <path d="M66 70 L92 60 L92 74 L66 84 Z" fill={g.k} opacity={0.8} />
    </>
  ),
  cup: (g) => (
    <>
      {floor(60, 22)}
      <path d="M38 30 L82 30 L74 104 L46 104 Z" fill={`url(#${g.a})`} />
      <ellipse cx={60} cy={30} rx={22} ry={5} fill={shade(g.c, -0.25)} />
      <ellipse cx={60} cy={30} rx={22} ry={5} fill="none" stroke={shade(g.c, 0.4)} strokeWidth={2} />
      <path d="M41 60 L79 60 L77 78 L43 78 Z" fill={g.k} opacity={0.85} />
      <path d="M43 36 L49 100" stroke="#fff" strokeOpacity={0.45} strokeWidth={3} strokeLinecap="round" />
    </>
  ),
  lid: (g) => (
    <>
      {floor(60, 36)}
      <ellipse cx={60} cy={82} rx={36} ry={12} fill={shade(g.c, -0.15)} />
      <ellipse cx={60} cy={78} rx={36} ry={12} fill={g.c} />
      <path d="M36 76 Q60 44 84 76" fill={shade(g.c, 0.15)} opacity={0.9} />
      <ellipse cx={60} cy={58} rx={6} ry={2} fill={shade(g.c, -0.25)} />
    </>
  ),
  sticks: (g) => (
    <>
      {floor(60, 30)}
      {Array.from({ length: 9 }, (_, i) => (
        <path key={i} d={`M${30 + i * 6} 104 L${46 + i * 4} 20`} stroke={i % 2 ? g.c : shade(g.c, -0.15)} strokeWidth={3.5} strokeLinecap="round" />
      ))}
      <rect x={34} y={70} width={52} height={10} rx={2} fill={g.k} />
    </>
  ),
  bowl: (g) => (
    <>
      {floor(60, 40)}
      <path d="M22 56 L98 56 L90 96 Q88 104 80 104 L40 104 Q32 104 30 96 Z" fill={`url(#${g.a})`} />
      <ellipse cx={60} cy={56} rx={38} ry={11} fill={shade(g.c, -0.25)} />
      <path d="M20 54 Q60 30 100 54 Q60 70 20 54 Z" fill={g.k} opacity={0.5} stroke="#9fb0b8" />
      <path d="M30 62 L38 98" stroke="#fff" strokeOpacity={0.35} strokeWidth={3} strokeLinecap="round" />
    </>
  ),
  dip: (g) => (
    <>
      {floor(60, 28)}
      <path d="M32 62 L88 62 L82 100 Q81 104 76 104 L44 104 Q39 104 38 100 Z" fill={`url(#${g.a})`} />
      <ellipse cx={60} cy={62} rx={28} ry={8} fill={shade(g.c, 0.3)} opacity={0.9} />
      <ellipse cx={60} cy={58} rx={30} ry={8} fill={g.k} opacity={0.5} stroke="#9fb0b8" />
    </>
  ),
  paper: (g) => (
    <>
      {floor(60, 44)}
      <path d="M16 66 L66 50 L104 64 L54 82 Z" fill={shade(g.c, 0.3)} />
      <path d="M16 66 L54 82 L54 100 L16 84 Z" fill={g.c} />
      <path d="M104 64 L54 82 L54 100 L104 82 Z" fill={shade(g.c, -0.15)} />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M16 ${70 + i * 4} L54 ${86 + i * 4}`} stroke="#000" strokeOpacity={0.06} />
      ))}
      <path d="M40 64 L66 55 L80 60 L54 70 Z" fill={g.k} opacity={0.8} />
    </>
  ),
  pad: (g) => (
    <>
      {floor(60, 34)}
      <path d="M28 72 L64 58 L94 70 L58 86 Z" fill="#fbfbf8" />
      <path d="M28 72 L58 86 L58 96 L28 82 Z" fill="#e9e9e4" />
      <path d="M94 70 L58 86 L58 96 L94 80 Z" fill="#dcdcd6" />
      <path d="M28 72 L64 58 L72 61 L36 75 Z" fill={g.c} />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M${40 + i * 6} ${76 - i * 2.3} L${70 + i * 6} ${64 - i * 2.3}`} stroke={g.k} strokeOpacity={0.35} />
      ))}
    </>
  ),
  tape: (g) => (
    <>
      {floor(60, 34)}
      <ellipse cx={60} cy={82} rx={34} ry={14} fill={shade(g.c, -0.2)} />
      <rect x={26} y={66} width={68} height={16} fill={shade(g.c, -0.2)} />
      <ellipse cx={60} cy={66} rx={34} ry={14} fill={shade(g.c, 0.2)} />
      <ellipse cx={60} cy={66} rx={18} ry={7} fill="#c9a77a" />
      <ellipse cx={60} cy={66} rx={14} ry={5.4} fill="#fff" />
    </>
  ),
  pen: (g) => (
    <>
      {floor(60, 34)}
      <g transform="rotate(-30 60 66)">
        <rect x={22} y={60} width={64} height={12} rx={6} fill={`url(#${g.v})`} />
        <path d="M86 60 L100 66 L86 72 Z" fill="#e3e3df" />
        <path d="M96 64 L102 66 L96 68 Z" fill={g.c} />
        <rect x={22} y={60} width={18} height={12} rx={6} fill={shade(g.c, -0.3)} />
        <rect x={30} y={56} width={22} height={3} rx={1.5} fill={shade(g.c, -0.3)} />
      </g>
    </>
  ),
  stapler: (g) => (
    <>
      {floor(60, 44)}
      <path d="M16 94 L100 80 L104 88 L20 102 Z" fill="#2a2c2e" />
      <path d="M18 88 Q20 76 34 74 L98 64 Q104 64 102 72 L100 78 L20 92 Z" fill={`url(#${g.v})`} />
      <path d="M30 78 L96 67" stroke="#fff" strokeOpacity={0.35} strokeWidth={2} />
    </>
  ),
  calculator: (g) => (
    <>
      {floor(60, 34)}
      <rect x={34} y={20} width={52} height={84} rx={5} fill={`url(#${g.v})`} />
      <rect x={40} y={27} width={40} height={14} rx={2} fill="#bcc8b0" />
      {Array.from({ length: 16 }, (_, i) => (
        <rect key={i} x={41 + (i % 4) * 10} y={48 + Math.floor(i / 4) * 13} width={8} height={9} rx={1.5} fill={i % 4 === 3 ? "#2f3133" : "#f2f2ef"} />
      ))}
    </>
  ),
  scissors: (g) => (
    <>
      {floor(60, 30)}
      <path d="M60 64 L96 22" stroke="#c9ced1" strokeWidth={5} strokeLinecap="round" />
      <path d="M60 64 L100 34" stroke="#aeb4b7" strokeWidth={5} strokeLinecap="round" />
      <circle cx={46} cy={84} r={12} fill="none" stroke={g.c} strokeWidth={7} />
      <circle cx={72} cy={90} r={12} fill="none" stroke={shade(g.c, -0.2)} strokeWidth={7} />
    </>
  ),
  cutter: (g) => (
    <>
      {floor(60, 32)}
      <g transform="rotate(-25 60 70)">
        <rect x={20} y={62} width={70} height={14} rx={4} fill={`url(#${g.v})`} />
        <path d="M90 64 L106 64 L102 74 L90 74 Z" fill="#c9ced1" />
        <rect x={40} y={60} width={10} height={4} rx={1} fill="#333" />
      </g>
    </>
  ),
  clips: (g) => (
    <>
      {floor(60, 34)}
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} transform={`rotate(${i * 30 - 50} ${60} ${74})`} d="M50 60 L50 88 Q50 94 56 94 Q62 94 62 88 L62 64 Q62 60 58 60 Q54 60 54 64 L54 86" fill="none" stroke={["#e5484d", "#3e8ed0", "#f2b134", "#46a758", g.c][i]} strokeWidth={2.6} strokeLinecap="round" />
      ))}
    </>
  ),
  device: (g) => (
    <>
      {floor(60, 34)}
      <path d="M28 62 L78 50 Q90 48 92 60 L94 76 L40 90 Z" fill={`url(#${g.v})`} />
      <path d="M40 90 L52 104 L62 102 L54 86 Z" fill={shade(g.c, -0.3)} />
      <rect x={34} y={58} width={22} height={18} rx={3} fill="#fff" stroke="#ccc" />
      <path d="M70 72 L80 104" stroke="#2a2c2e" strokeWidth={8} strokeLinecap="round" />
    </>
  ),
  cartridge: (g) => (
    <>
      {floor(60, 40)}
      <path d="M20 66 L84 54 L100 62 L36 74 Z" fill={shade(g.c, 0.3)} />
      <path d="M20 66 L36 74 L36 96 L20 88 Z" fill={shade(g.c, -0.25)} />
      <path d="M36 74 L100 62 L100 84 L36 96 Z" fill={`url(#${g.v})`} />
      <rect x={60} y={70} width={30} height={8} transform="skewY(-10)" fill={g.k} opacity={0.8} />
    </>
  ),
};

export function Illustration({ spec, id }: { spec: IllustrationSpec; id: string }) {
  const c = spec.color;
  const k = spec.accent ?? shade(c, -0.35);
  const s = spec.secondary ?? shade(c, -0.15);
  const ids: Ctx = { a: `${id}-a`, b: `${id}-b`, v: `${id}-v`, vb: `${id}-vb`, c, k };
  const cyl = (gid: string, base: string) => (
    <linearGradient id={gid} x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stopColor={shade(base, -0.28)} />
      <stop offset="0.3" stopColor={shade(base, 0.22)} />
      <stop offset="0.6" stopColor={base} />
      <stop offset="1" stopColor={shade(base, -0.35)} />
    </linearGradient>
  );
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" role="img" aria-hidden>
      <defs>
        {cyl(ids.a, c)}
        {cyl(ids.b, s)}
        <linearGradient id={ids.v} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={shade(c, 0.25)} />
          <stop offset="1" stopColor={shade(c, -0.2)} />
        </linearGradient>
      </defs>
      {DRAW[spec.kind](ids)}
    </svg>
  );
}
