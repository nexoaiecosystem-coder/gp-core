// Ilustraciones de producto en perspectiva isométrica (vistas desde arriba y de costado),
// dibujadas en SVG con caras sombreadas, brillos y sombra al piso.
// Cada producto se asocia a un dibujo base y un color en ../_illustrations.ts.
import type { ReactNode } from "react";
import type { IllustrationKind, IllustrationSpec } from "../_illustrations";

function rgb(c: string) {
  const n = parseInt(c.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
/** amt > 0 aclara hacia blanco, amt < 0 oscurece hacia negro. */
function shade(c: string, amt: number) {
  const t = amt < 0 ? 0 : 255;
  const p = Math.abs(amt);
  return "#" + rgb(c).map((v) => Math.round(v + (t - v) * p).toString(16).padStart(2, "0")).join("");
}

// ── Proyección isométrica ────────────────────────────────────────────
// x hacia abajo-derecha, y hacia abajo-izquierda, z hacia arriba. Origen = centro del piso.
const OX = 60;
const OY = 84;
type P3 = [number, number, number];
function iso([x, y, z]: P3): [number, number] {
  return [OX + (x - y) * 0.866, OY + (x + y) * 0.5 - z];
}
function poly(pts: P3[]) {
  return "M" + pts.map((p) => iso(p).map((v) => v.toFixed(1)).join(" ")).join(" L") + " Z";
}

type BoxOpts = { x?: number; y?: number; z?: number; top?: string; left?: string; right?: string; stroke?: boolean };
/** Caja: cara superior + las dos caras visibles. */
function Box({ w, d, h, c, x = 0, y = 0, z = 0, top, left, right, stroke }: { w: number; d: number; h: number; c: string } & BoxOpts) {
  const x0 = x - w / 2, x1 = x + w / 2, y0 = y - d / 2, y1 = y + d / 2, zt = z + h;
  const line = stroke ? { stroke: shade(c, -0.35), strokeWidth: 0.6, strokeLinejoin: "round" as const } : {};
  return (
    <g {...line}>
      <path d={poly([[x0, y1, z], [x1, y1, z], [x1, y1, zt], [x0, y1, zt]])} fill={left ?? shade(c, -0.08)} />
      <path d={poly([[x1, y0, z], [x1, y1, z], [x1, y1, zt], [x1, y0, zt]])} fill={right ?? shade(c, -0.3)} />
      <path d={poly([[x0, y0, zt], [x1, y0, zt], [x1, y1, zt], [x0, y1, zt]])} fill={top ?? shade(c, 0.22)} />
    </g>
  );
}

/** Cilindro vertical apoyado en el punto iso (x, y, z). */
function Cyl({ r, h, grad, top, x = 0, y = 0, z = 0 }: { r: number; h: number; grad: string; top: string; x?: number; y?: number; z?: number }) {
  const [cx, by] = iso([x, y, z]);
  const ry = r * 0.5;
  return (
    <g>
      <path d={`M${cx - r} ${by - h} L${cx - r} ${by} A${r} ${ry} 0 0 0 ${cx + r} ${by} L${cx + r} ${by - h} Z`} fill={`url(#${grad})`} />
      <ellipse cx={cx} cy={by - h} rx={r} ry={ry} fill={top} />
    </g>
  );
}

/** Banda (etiqueta) sobre un cilindro, entre las alturas z1 y z2. */
function Band({ r, z1, z2, fill, x = 0, y = 0, z = 0, opacity = 1 }: { r: number; z1: number; z2: number; fill: string; x?: number; y?: number; z?: number; opacity?: number }) {
  const [cx, by] = iso([x, y, z]);
  const ry = r * 0.5;
  return (
    <path
      d={`M${cx - r} ${by - z2} L${cx - r} ${by - z1} A${r} ${ry} 0 0 0 ${cx + r} ${by - z1} L${cx + r} ${by - z2} A${r} ${ry} 0 0 1 ${cx - r} ${by - z2} Z`}
      fill={fill}
      opacity={opacity}
    />
  );
}

/** Recipiente abierto (vaso, balde, bowl): cono truncado con el interior a la vista. */
function Taper({ r0, r1, h, grad, rim, inside, x = 0, y = 0, z = 0 }: { r0: number; r1: number; h: number; grad: string; rim: string; inside: string; x?: number; y?: number; z?: number }) {
  const [cx, by] = iso([x, y, z]);
  return (
    <g>
      <path d={`M${cx - r1} ${by - h} L${cx - r0} ${by} A${r0} ${r0 * 0.5} 0 0 0 ${cx + r0} ${by} L${cx + r1} ${by - h} Z`} fill={`url(#${grad})`} />
      <ellipse cx={cx} cy={by - h} rx={r1} ry={r1 * 0.5} fill={inside} />
      <ellipse cx={cx} cy={by - h} rx={r1} ry={r1 * 0.5} fill="none" stroke={rim} strokeWidth={1.6} />
    </g>
  );
}

/** Sombra de apoyo en el piso. */
function Floor({ r = 34, x = 0, y = 0 }: { r?: number; x?: number; y?: number }) {
  const [cx, cy] = iso([x, y, 0]);
  return <ellipse cx={cx} cy={cy + 3} rx={r} ry={r * 0.42} fill="#000" opacity={0.1} />;
}

/** Brillo vertical sobre un cilindro. */
function Gloss({ x, y1, y2 }: { x: number; y1: number; y2: number }) {
  return <path d={`M${x} ${y1} L${x} ${y2}`} stroke="#fff" strokeOpacity={0.5} strokeWidth={2.4} strokeLinecap="round" />;
}

type G = { a: string; b: string; c: string; s: string; k: string };

const DRAW: Record<IllustrationKind, (g: G) => ReactNode> = {
  jug: (g) => (
    <>
      <Floor r={34} />
      <Box w={32} d={26} h={56} c={g.c} />
      <path d={poly([[-12, 13, 14], [10, 13, 14], [10, 13, 40], [-12, 13, 40]])} fill="#fff" opacity={0.93} />
      <path d={poly([[-9, 13, 33], [6, 13, 33], [6, 13, 36], [-9, 13, 36]])} fill={g.k} opacity={0.6} />
      <path d={poly([[-9, 13, 24], [3, 13, 24], [3, 13, 26], [-9, 13, 26]])} fill="#9aa0a3" />
      <Cyl r={6} h={8} x={-6} y={-4} z={56} grad={`${g.a}w`} top="#ffffff" />
      <path d={(() => { const [a1, b1] = iso([-1, -9, 60]); const [a2, b2] = iso([12, -9, 56]); return `M${a1} ${b1} Q${(a1 + a2) / 2 + 4} ${b1 - 18} ${a2} ${b2}`; })()} fill="none" stroke="#f1f1ee" strokeWidth={4.5} strokeLinecap="round" />
      <path d={poly([[-15, 13, 4], [-14, 13, 4], [-14, 13, 52], [-15, 13, 52]])} fill="#fff" opacity={0.35} />
    </>
  ),
  bottle: (g) => (
    <>
      <Floor r={20} />
      <Cyl r={14} h={46} grad={g.a} top={shade(g.c, 0.2)} />
      <Cyl r={6} h={12} z={46} grad={g.a} top={shade(g.c, 0.2)} />
      <Cyl r={6.5} h={9} z={58} grad={g.b} top={shade(g.k, 0.25)} />
      <Band r={14} z1={12} z2={34} fill="#fff" opacity={0.92} />
      <Band r={14} z1={26} z2={29} fill={g.k} opacity={0.65} />
      <Gloss x={52} y1={44} y2={84} />
    </>
  ),
  trigger: (g) => (
    <>
      <Floor r={20} />
      <Cyl r={13} h={44} grad={g.a} top={shade(g.c, 0.2)} />
      <Cyl r={6} h={8} z={44} grad={g.b} top={shade(g.k, 0.2)} />
      <Box w={10} d={22} h={10} z={52} y={4} c={g.k} />
      <path d={poly([[0, 15, 54], [0, 21, 54], [0, 21, 58], [0, 15, 58]])} fill={shade(g.k, -0.3)} />
      <path d={(() => { const [a, b] = iso([0, 6, 52]); return `M${a} ${b} l-3 12 l5 0`; })()} fill="none" stroke={g.k} strokeWidth={3.5} strokeLinejoin="round" />
      <Band r={13} z1={10} z2={30} fill="#fff" opacity={0.92} />
      <Band r={13} z1={22} z2={25} fill={g.k} opacity={0.6} />
      <Gloss x={53} y1={46} y2={84} />
    </>
  ),
  aerosol: (g) => (
    <>
      <Floor r={18} />
      <Cyl r={12} h={52} grad={g.a} top={shade(g.c, 0.15)} />
      <Cyl r={11} h={14} z={52} grad={g.b} top={shade(g.s, 0.25)} />
      <Band r={12} z1={18} z2={34} fill="#fff" opacity={0.28} />
      <Band r={12} z1={25} z2={28} fill="#fff" opacity={0.85} />
      <Gloss x={54} y1={36} y2={84} />
    </>
  ),
  bar: (g) => (
    <>
      <Floor r={30} />
      <Box w={40} d={26} h={13} c={g.c} />
      <path d={poly([[-12, -6, 13], [12, -6, 13], [12, 6, 13], [-12, 6, 13]])} fill="#fff" opacity={0.35} />
    </>
  ),
  bucket: (g) => (
    <>
      <Floor r={30} />
      <Taper r0={22} r1={30} h={40} grad={g.a} rim={shade(g.c, 0.3)} inside={shade(g.c, -0.45)} />
      <path d="M30 44 Q60 6 90 44" fill="none" stroke="#9ea4a7" strokeWidth={2.5} />
      <Gloss x={40} y1={50} y2={84} />
    </>
  ),
  wringer: (g) => (
    <>
      <Floor r={36} />
      <Taper r0={26} r1={34} h={38} grad={g.a} rim={shade(g.c, 0.3)} inside={shade(g.c, -0.45)} />
      <Box w={22} d={18} h={12} x={10} y={-10} z={34} c="#2d2f31" />
      <ellipse cx={iso([10, -10, 46])[0]} cy={iso([10, -10, 46])[1]} rx={8} ry={4} fill="#151617" />
    </>
  ),
  bin: (g) => (
    <>
      <Floor r={30} />
      <Box w={28} d={24} h={58} c={g.c} />
      <Box w={31} d={27} h={6} z={58} c={g.s} />
      <path d={poly([[-8, -13.5, 64], [8, -13.5, 64], [8, 4, 64], [-8, 4, 64]])} fill={shade(g.s, -0.35)} />
      <path d={poly([[-13, 12, 6], [-12, 12, 6], [-12, 12, 54], [-13, 12, 54]])} fill="#fff" opacity={0.25} />
    </>
  ),
  wheelie: (g) => (
    <>
      <Floor r={36} />
      <Box w={36} d={30} h={52} c={g.c} />
      <Box w={40} d={34} h={6} z={52} c={shade(g.c, -0.15)} />
      {([[-14, 15], [14, 15]] as const).map(([x, y]) => {
        const [cx, cy] = iso([x, y, 4]);
        return <ellipse key={x} cx={cx} cy={cy} rx={4.5} ry={5.5} fill="#1d1e1f" />;
      })}
      {(() => { const [cx, cy] = iso([0, 15, 28]); return <ellipse cx={cx} cy={cy} rx={9} ry={11} fill="none" stroke="#fff" strokeOpacity={0.8} strokeWidth={1.8} transform={`rotate(-30 ${cx} ${cy})`} />; })()}
    </>
  ),
  bagroll: (g) => (
    <>
      <Floor r={20} />
      <Cyl r={15} h={56} grad={g.a} top={shade(g.c, 0.12)} />
      <ellipse cx={60} cy={28} rx={5} ry={2.5} fill={shade(g.c, -0.5)} />
      <Band r={15} z1={14} z2={40} fill={g.k} />
      <Band r={15} z1={31} z2={35} fill="#fff" opacity={0.9} />
      <Band r={15} z1={24} z2={27} fill="#fff" opacity={0.6} />
      <Gloss x={50} y1={32} y2={84} />
    </>
  ),
  trashbag: (g) => (
    <>
      <Floor r={30} />
      <path d="M52 24 Q60 16 68 24 L70 34 Q92 48 88 76 Q84 96 60 96 Q36 96 32 76 Q28 48 50 34 Z" fill={`url(#${g.a})`} />
      <ellipse cx={60} cy={34} rx={11} ry={4} fill={shade(g.c, -0.3)} />
      <path d="M52 24 L47 15 M68 24 L73 15" stroke={shade(g.c, -0.2)} strokeWidth={3} strokeLinecap="round" />
      <path d="M44 50 Q40 68 46 86" stroke="#fff" strokeOpacity={0.35} strokeWidth={3} fill="none" strokeLinecap="round" />
    </>
  ),
  broom: (g) => (
    <>
      <Floor r={34} />
      {Array.from({ length: 14 }, (_, i) => {
        const x = -22 + i * 3.4;
        const [a1, b1] = iso([x, 2, 14]);
        const [a2, b2] = iso([x, 10, 0]);
        return <path key={i} d={`M${a1} ${b1} L${a2} ${b2}`} stroke={shade(g.c, i % 2 ? 0.1 : -0.15)} strokeWidth={3} strokeLinecap="round" />;
      })}
      <Box w={48} d={9} h={9} z={14} c={g.c} />
      {(() => { const [a, b] = iso([0, 0, 23]); return <path d={`M${a} ${b} L${a - 34} ${b - 62}`} stroke={g.s} strokeWidth={5} strokeLinecap="round" />; })()}
    </>
  ),
  squeegee: (g) => (
    <>
      <Floor r={34} />
      <Box w={56} d={5} h={4} c="#1f2022" />
      <Box w={56} d={9} h={8} z={4} c={g.c} />
      {(() => { const [a, b] = iso([0, 0, 12]); return <path d={`M${a} ${b} L${a - 34} ${b - 64}`} stroke={g.s} strokeWidth={5} strokeLinecap="round" />; })()}
    </>
  ),
  mop: (g) => (
    <>
      <Floor r={32} />
      {Array.from({ length: 16 }, (_, i) => {
        const ang = (i / 16) * Math.PI * 2;
        const [a1, b1] = iso([0, 0, 10]);
        const [a2, b2] = iso([Math.cos(ang) * 24, Math.sin(ang) * 24, 0]);
        return <path key={i} d={`M${a1} ${b1} Q${(a1 + a2) / 2} ${b1} ${a2} ${b2}`} stroke={shade(g.c, i % 2 ? 0.1 : -0.12)} strokeWidth={4} fill="none" strokeLinecap="round" />;
      })}
      <Cyl r={7} h={6} z={8} grad={g.b} top={shade(g.s, 0.2)} />
      {(() => { const [a, b] = iso([0, 0, 14]); return <path d={`M${a} ${b} L${a - 30} ${b - 64}`} stroke={g.s} strokeWidth={5} strokeLinecap="round" />; })()}
    </>
  ),
  dustpan: (g) => (
    <>
      <Floor r={34} />
      <path d={poly([[-20, -16, 12], [20, -16, 12], [20, 18, 0], [-20, 18, 0]])} fill={shade(g.c, 0.1)} />
      <path d={poly([[20, -16, 12], [20, 18, 0], [20, 18, 4], [20, -16, 16]])} fill={shade(g.c, -0.3)} />
      <path d={poly([[-20, -16, 12], [20, -16, 12], [20, -16, 16], [-20, -16, 16]])} fill={shade(g.c, -0.15)} />
      {(() => { const [a, b] = iso([0, -16, 16]); return <path d={`M${a} ${b} L${a + 22} ${b - 40}`} stroke={shade(g.c, -0.2)} strokeWidth={7} strokeLinecap="round" />; })()}
    </>
  ),
  sponge: (g) => (
    <>
      <Floor r={30} />
      <Box w={38} d={26} h={12} c={g.c} />
      <Box w={38} d={26} h={5} z={12} c={g.k} />
    </>
  ),
  scrubber: (g) => (
    <>
      <Floor r={28} />
      <path d="M32 80 Q32 50 60 48 Q88 50 88 80 Q60 96 32 80 Z" fill={`url(#${g.a})`} />
      {Array.from({ length: 16 }, (_, i) => (
        <path key={i} d={`M${38 + (i % 5) * 9} ${56 + Math.floor(i / 5) * 8} q5 -5 9 2 q3 5 -4 7`} fill="none" stroke={shade(g.c, i % 2 ? 0.55 : -0.35)} strokeWidth={1.4} />
      ))}
    </>
  ),
  cloth: (g) => (
    <>
      <Floor r={34} />
      <Box w={42} d={34} h={8} c={g.c} />
      <path d={poly([[-17, -13, 8], [17, -13, 8], [17, 13, 8], [-17, 13, 8]])} fill="none" stroke={g.k} strokeWidth={1.5} strokeDasharray="3 3" />
    </>
  ),
  glove: (g) => (
    <>
      <Floor r={30} />
      <g transform="translate(60 70) skewY(-24) scale(0.86 0.62) translate(-60 -64)">
        <path d="M44 104 L44 70 L38 54 Q36 48 41 47 Q45 46 47 52 L50 60 L50 30 Q50 25 54 25 Q58 25 58 30 L58 56 L59 24 Q59 19 63 19 Q67 19 67 24 L67 56 L68 28 Q68 23 72 23 Q76 23 76 28 L76 60 L77 38 Q77 34 80 34 Q84 34 84 38 L84 78 Q84 92 76 104 Z" fill={shade(g.c, -0.25)} transform="translate(3 5)" />
        <path d="M44 104 L44 70 L38 54 Q36 48 41 47 Q45 46 47 52 L50 60 L50 30 Q50 25 54 25 Q58 25 58 30 L58 56 L59 24 Q59 19 63 19 Q67 19 67 24 L67 56 L68 28 Q68 23 72 23 Q76 23 76 28 L76 60 L77 38 Q77 34 80 34 Q84 34 84 38 L84 78 Q84 92 76 104 Z" fill={`url(#${g.a})`} />
        <path d="M44 96 L76 96" stroke="#fff" strokeOpacity={0.4} strokeWidth={2} />
      </g>
    </>
  ),
  rollbox: (g) => (
    <>
      <Floor r={40} />
      <Box w={70} d={16} h={14} c={g.c} />
      <path d={poly([[-30, 8, 4], [30, 8, 4], [30, 8, 9], [-30, 8, 9]])} fill={g.k} />
      <path d={poly([[-35, -8, 14], [35, -8, 14], [35, -6, 14], [-35, -6, 14]])} fill="#c9ced1" />
    </>
  ),
  roll: (g) => (
    <>
      <Floor r={36} />
      {(() => {
        const [ax, ay] = iso([-30, 0, 12]);
        const [bx, by] = iso([30, 0, 12]);
        const r = 13;
        return (
          <g>
            <path d={`M${ax} ${ay - r} L${bx} ${by - r} L${bx} ${by + r} L${ax} ${ay + r} Z`} fill={`url(#${g.a}v)`} />
            <ellipse cx={bx} cy={by} rx={7.5} ry={r} fill={shade(g.c, 0.2)} transform={`rotate(-30 ${bx} ${by})`} />
            <ellipse cx={bx} cy={by} rx={2.6} ry={4.5} fill="#a4825a" transform={`rotate(-30 ${bx} ${by})`} />
          </g>
        );
      })()}
    </>
  ),
  tissue: (g) => (
    <>
      <Floor r={36} />
      {([[-11, -11], [11, -11], [-11, 11], [11, 11]] as const).map(([x, y]) => (
        <g key={`${x}${y}`}>
          <Cyl r={11} h={30} x={x} y={y} grad={g.a} top={shade(g.c, 0.3)} />
          {(() => { const [cx, cy] = iso([x, y, 30]); return <ellipse cx={cx} cy={cy} rx={3.2} ry={1.6} fill="#b0916a" />; })()}
        </g>
      ))}
    </>
  ),
  jumbo: (g) => (
    <>
      <Floor r={34} />
      <Cyl r={30} h={36} grad={g.a} top={shade(g.c, 0.3)} />
      <ellipse cx={60} cy={48} rx={20} ry={10} fill="none" stroke="#000" strokeOpacity={0.05} />
      <ellipse cx={60} cy={48} rx={9} ry={4.5} fill="#b0916a" />
      <ellipse cx={60} cy={48} rx={5} ry={2.5} fill="#7b5f3c" />
    </>
  ),
  napkins: (g) => (
    <>
      <Floor r={34} />
      <Box w={40} d={40} h={22} c={g.c} left={shade(g.c, -0.06)} right={shade(g.c, -0.16)} />
      {[5, 10, 15].map((z) => (
        <g key={z}>
          <path d={poly([[-20, 20, z], [20, 20, z]])} stroke="#000" strokeOpacity={0.08} />
          <path d={poly([[20, -20, z], [20, 20, z]])} stroke="#000" strokeOpacity={0.08} />
        </g>
      ))}
      <path d={poly([[-12, -12, 22], [12, -12, 22], [12, 12, 22], [-12, 12, 22]])} fill="none" stroke={g.k} strokeWidth={1.2} opacity={0.7} />
    </>
  ),
  dispenser: (g) => (
    <>
      <Floor r={30} />
      <Box w={34} d={22} h={56} c={g.c} />
      <path d={poly([[-12, 11, 24], [10, 11, 24], [10, 11, 46], [-12, 11, 46]])} fill={g.k} opacity={0.85} />
      <path d={poly([[-10, 11, 8], [8, 11, 8], [8, 11, 12], [-10, 11, 12]])} fill="#444" />
    </>
  ),
  tshirt: (g) => (
    <>
      <Floor r={28} />
      <g transform="translate(60 64) skewY(-14) translate(-60 -64)">
        <path d="M36 30 L46 30 L48 44 Q60 50 72 44 L74 30 L84 30 L86 52 Q88 54 88 58 L88 100 Q88 104 84 104 L36 104 Q32 104 32 100 L32 58 Q32 54 34 52 Z" fill={shade(g.c, -0.15)} transform="translate(5 -3)" />
        <path d="M36 30 L46 30 L48 44 Q60 50 72 44 L74 30 L84 30 L86 52 Q88 54 88 58 L88 100 Q88 104 84 104 L36 104 Q32 104 32 100 L32 58 Q32 54 34 52 Z" fill={`url(#${g.a})`} />
        <path d="M40 60 Q38 80 42 98" stroke="#fff" strokeOpacity={0.45} strokeWidth={3} fill="none" strokeLinecap="round" />
      </g>
    </>
  ),
  paperbag: (g) => (
    <>
      <Floor r={30} />
      <Box w={34} d={20} h={50} c={g.c} />
      <path d={poly([[-17, -10, 50], [17, -10, 50], [17, 10, 50], [-17, 10, 50]])} fill={shade(g.c, -0.45)} />
      {(() => { const [a1, b1] = iso([-8, 0, 50]); const [a2, b2] = iso([8, 0, 50]); return <path d={`M${a1} ${b1} Q${(a1 + a2) / 2} ${b1 - 26} ${a2} ${b2}`} fill="none" stroke={shade(g.c, -0.3)} strokeWidth={3} />; })()}
      <path d={poly([[-17, 10, 44], [17, 10, 44]])} stroke={shade(g.c, -0.2)} strokeWidth={0.8} />
    </>
  ),
  tray: (g) => (
    <>
      <Floor r={42} />
      <Box w={56} d={44} h={10} c={g.c} />
      <path d={poly([[-23, -17, 10], [23, -17, 10], [23, 17, 10], [-23, 17, 10]])} fill={shade(g.c, -0.12)} />
      <path d={poly([[-23, -17, 10], [23, -17, 10], [23, -17, 4], [-23, -17, 4]])} fill={shade(g.c, -0.28)} opacity={0.6} />
      <path d={poly([[-23, -17, 10], [-23, 17, 10], [-23, 17, 4], [-23, -17, 4]])} fill={shade(g.c, -0.2)} opacity={0.6} />
    </>
  ),
  traylid: (g) => (
    <>
      <Floor r={42} />
      <Box w={56} d={44} h={10} c={g.c} />
      <Box w={58} d={46} h={9} z={10} c={g.k} top={shade(g.k, 0.35)} left={shade(g.k, 0.05)} right={shade(g.k, -0.12)} stroke />
      <path d={poly([[-20, -14, 19], [10, -14, 19]])} stroke="#fff" strokeOpacity={0.9} strokeWidth={2} />
    </>
  ),
  disc: (g) => (
    <>
      <Floor r={40} />
      <Cyl r={40} h={5} grad={g.a} top={shade(g.c, 0.25)} />
      <ellipse cx={60} cy={79} rx={28} ry={14} fill="none" stroke="#000" strokeOpacity={0.05} />
    </>
  ),
  clamshell: (g) => (
    <>
      <Floor r={40} />
      <path d={poly([[-22, -22, 14], [22, -22, 14], [22, -30, 52], [-22, -30, 52]])} fill={shade(g.c, 0.1)} />
      <path d={poly([[-22, -22, 14], [22, -22, 14], [22, -30, 52], [-22, -30, 52]])} fill="none" stroke="#000" strokeOpacity={0.08} />
      <Box w={44} d={44} h={14} c={g.c} />
      <path d={poly([[-18, -18, 14], [18, -18, 14], [18, 18, 14], [-18, 18, 14]])} fill={shade(g.c, -0.1)} />
    </>
  ),
  flatbox: (g) => (
    <>
      <Floor r={44} />
      <Box w={58} d={58} h={11} c={g.c} />
      <path d={poly([[-22, -22, 11], [22, -22, 11], [22, 22, 11], [-22, 22, 11]])} fill="none" stroke={g.k} strokeWidth={1.4} opacity={0.6} />
    </>
  ),
  box: (g) => (
    <>
      <Floor r={38} />
      <Box w={42} d={42} h={40} c={g.c} />
      <path d={poly([[21, -10, 12], [21, 10, 12], [21, 10, 28], [21, -10, 28]])} fill={g.k} opacity={0.85} />
    </>
  ),
  cup: (g) => (
    <>
      <Floor r={20} />
      <Taper r0={13} r1={19} h={54} grad={g.a} rim={shade(g.c, 0.45)} inside={shade(g.c, -0.4)} />
      <Band r={16} z1={18} z2={34} fill={g.k} opacity={0.85} />
      <Gloss x={47} y1={36} y2={82} />
    </>
  ),
  lid: (g) => (
    <>
      <Floor r={34} />
      <Cyl r={32} h={5} grad={g.a} top={shade(g.c, 0.1)} />
      <ellipse cx={60} cy={74} rx={24} ry={12} fill={shade(g.c, 0.3)} />
      <ellipse cx={60} cy={71} rx={18} ry={8} fill="#fff" opacity={0.5} />
      <ellipse cx={60} cy={70} rx={4} ry={2} fill={shade(g.c, -0.3)} />
    </>
  ),
  sticks: (g) => (
    <>
      <Floor r={36} />
      {Array.from({ length: 10 }, (_, i) => {
        const y = -9 + i * 2;
        const z = 2 + (i % 3) * 2.5;
        return <path key={i} d={poly([[-34, y, z], [34, y, z]])} stroke={i % 2 ? g.c : shade(g.c, -0.18)} strokeWidth={3.2} strokeLinecap="round" />;
      })}
      <Box w={8} d={22} h={10} c={g.k} />
    </>
  ),
  bowl: (g) => (
    <>
      <Floor r={36} />
      <Taper r0={24} r1={32} h={30} grad={g.a} rim={shade(g.c, 0.35)} inside={shade(g.c, -0.35)} />
      <ellipse cx={60} cy={54} rx={33} ry={16.5} fill={g.k} opacity={0.45} stroke="#9fb0b8" />
      <ellipse cx={52} cy={50} rx={12} ry={4} fill="#fff" opacity={0.5} />
    </>
  ),
  dip: (g) => (
    <>
      <Floor r={26} />
      <Taper r0={16} r1={22} h={22} grad={g.a} rim={shade(g.c, 0.35)} inside={shade(g.c, -0.3)} />
      <ellipse cx={60} cy={61} rx={23} ry={11.5} fill={g.k} opacity={0.5} stroke="#9fb0b8" />
    </>
  ),
  paper: (g) => (
    <>
      <Floor r={40} />
      <Box w={52} d={36} h={22} c={g.c} />
      {[5, 10, 15].map((z) => (
        <path key={z} d={poly([[-26, 18, z], [26, 18, z]])} stroke="#000" strokeOpacity={0.07} />
      ))}
      <path d={poly([[-26, -6, 22], [26, -6, 22], [26, 6, 22], [-26, 6, 22]])} fill={g.k} opacity={0.85} />
      <path d={poly([[26, -6, 22], [26, 6, 22], [26, 6, 0], [26, -6, 0]])} fill={shade(g.k, -0.25)} opacity={0.85} />
    </>
  ),
  pad: (g) => (
    <>
      <Floor r={32} />
      <Box w={40} d={30} h={10} c="#f6f6f2" />
      <Box w={40} d={30} h={2} z={10} c={g.c} />
    </>
  ),
  tape: (g) => (
    <>
      <Floor r={30} />
      <Cyl r={28} h={14} grad={g.a} top={shade(g.c, 0.2)} />
      <ellipse cx={60} cy={70} rx={16} ry={8} fill="#c9a77a" />
      <ellipse cx={60} cy={70} rx={12.5} ry={6.2} fill="#f6f6f2" />
    </>
  ),
  pen: (g) => (
    <>
      <Floor r={30} />
      {(() => {
        const [ax, ay] = iso([-30, 0, 6]);
        const [bx, by] = iso([22, 0, 6]);
        const [tx, ty] = iso([32, 0, 6]);
        return (
          <g>
            <path d={`M${ax} ${ay} L${bx} ${by}`} stroke={`url(#${g.a}v)`} strokeWidth={10} strokeLinecap="round" />
            <path d={`M${ax} ${ay} L${ax + 14} ${ay + 8}`} stroke={shade(g.c, -0.3)} strokeWidth={10} strokeLinecap="round" />
            <path d={`M${bx} ${by - 4} L${tx} ${ty} L${bx} ${by + 4} Z`} fill="#e3e3df" />
            <path d={`M${ax + 4} ${ay - 7} L${ax + 22} ${ay + 3}`} stroke={shade(g.c, -0.3)} strokeWidth={2.4} strokeLinecap="round" />
          </g>
        );
      })()}
    </>
  ),
  stapler: (g) => (
    <>
      <Floor r={36} />
      <Box w={64} d={14} h={5} c="#2a2c2e" />
      <path d={poly([[-30, -6, 5], [30, -6, 9], [30, 6, 9], [-30, 6, 5]])} fill={shade(g.c, 0.25)} />
      <Box w={56} d={12} h={8} x={-2} z={9} c={g.c} />
    </>
  ),
  calculator: (g) => (
    <>
      <Floor r={34} />
      <Box w={36} d={50} h={6} c={g.c} />
      <path d={poly([[-14, -22, 6], [14, -22, 6], [14, -12, 6], [-14, -12, 6]])} fill="#bcc8b0" />
      {Array.from({ length: 16 }, (_, i) => {
        const x = -13 + (i % 4) * 7;
        const y = -8 + Math.floor(i / 4) * 7.5;
        return <path key={i} d={poly([[x, y, 6], [x + 5, y, 6], [x + 5, y + 5, 6], [x, y + 5, 6]])} fill={i % 4 === 3 ? "#2f3133" : "#fafaf7"} />;
      })}
    </>
  ),
  scissors: (g) => (
    <>
      <Floor r={30} />
      <g transform="translate(60 72) scale(1 0.62) rotate(-30) translate(-60 -72)">
        <path d="M60 64 L96 22" stroke="#c9ced1" strokeWidth={5} strokeLinecap="round" />
        <path d="M60 64 L100 34" stroke="#aeb4b7" strokeWidth={5} strokeLinecap="round" />
        <circle cx={46} cy={84} r={12} fill="none" stroke={g.c} strokeWidth={7} />
        <circle cx={72} cy={90} r={12} fill="none" stroke={shade(g.c, -0.2)} strokeWidth={7} />
      </g>
    </>
  ),
  cutter: (g) => (
    <>
      <Floor r={32} />
      <Box w={60} d={12} h={8} c={g.c} />
      <path d={poly([[30, -4, 4], [42, -4, 4], [38, 4, 4], [30, 4, 4]])} fill="#c9ced1" />
      <Box w={8} d={5} h={2} x={-8} z={8} c="#333" />
    </>
  ),
  clips: (g) => (
    <>
      <Floor r={32} />
      <g transform="translate(60 76) scale(1 0.55) translate(-60 -76)">
        {[0, 1, 2, 3, 4].map((i) => (
          <path key={i} transform={`rotate(${i * 30 - 50} 60 74)`} d="M50 60 L50 88 Q50 94 56 94 Q62 94 62 88 L62 64 Q62 60 58 60 Q54 60 54 64 L54 86" fill="none" stroke={["#e5484d", "#3e8ed0", "#f2b134", "#46a758", g.c][i]} strokeWidth={3} strokeLinecap="round" />
        ))}
      </g>
    </>
  ),
  device: (g) => (
    <>
      <Floor r={34} />
      <Box w={44} d={16} h={22} z={18} c={g.c} />
      <Box w={10} d={12} h={20} x={12} c="#2a2c2e" />
      <path d={poly([[-16, 8, 26], [4, 8, 26], [4, 8, 36], [-16, 8, 36]])} fill="#fff" />
    </>
  ),
  cartridge: (g) => (
    <>
      <Floor r={40} />
      <Box w={60} d={22} h={20} c={g.c} />
      <path d={poly([[-24, 11, 5], [10, 11, 5], [10, 11, 15], [-24, 11, 15]])} fill={g.k} opacity={0.85} />
    </>
  ),
};

export function Illustration({ spec, id }: { spec: IllustrationSpec; id: string }) {
  const c = spec.color;
  const k = spec.accent ?? shade(c, -0.35);
  const s = spec.secondary ?? shade(c, -0.15);
  const g: G = { a: `${id}-a`, b: `${id}-b`, c, s, k };
  const cyl = (gid: string, base: string) => (
    <linearGradient id={gid} x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stopColor={shade(base, 0.05)} />
      <stop offset="0.28" stopColor={shade(base, 0.32)} />
      <stop offset="0.6" stopColor={base} />
      <stop offset="1" stopColor={shade(base, -0.38)} />
    </linearGradient>
  );
  return (
    <svg viewBox="0 6 120 104" className="h-full w-full" role="img" aria-hidden>
      <defs>
        {cyl(g.a, c)}
        {cyl(g.b, s)}
        {cyl(`${g.a}w`, "#f4f4f2")}
        <linearGradient id={`${g.a}v`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={shade(c, 0.3)} />
          <stop offset="0.45" stopColor={c} />
          <stop offset="1" stopColor={shade(c, -0.3)} />
        </linearGradient>
      </defs>
      {DRAW[spec.kind](g)}
    </svg>
  );
}
