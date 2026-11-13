// Modelos 3D procedurales de los productos del catálogo G Packing.
// Cada función recibe { color, accent, secondary, name } y la librería L (three + helpers).
const KRAFT = '#c49a64', FOAM = '#f1f1ec', ALU = '#c7ccd0', CLEAR = '#dfe9ee';

function isClear(c) { return c === CLEAR || c === '#e3ecf0' || c === '#e6eef2' || c === '#e8f0f3'; }

/** Material según el color "de material" del producto. */
function surface(L, color, opts = {}) {
  const { THREE, M, kraftTex, canvasTex, noise } = L;
  if (color === KRAFT) return M.paper(kraftTex());
  if (color === ALU) return M.metal('#d4d8db', 0.32);
  if (isClear(color)) return M.clearPlastic('#f2f7f9');
  if (color === FOAM || color === '#efe9da' || color === '#efe9d6') {
    return new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.95, map: canvasTex(256, 256, (x, w, h) => noise(x, w, h, color, 10)) });
  }
  return M.plastic(color, opts.rough ?? 0.4);
}

function group(L) { return new L.THREE.Group(); }
function place(m, x = 0, y = 0, z = 0) { m.position.set(x, y, z); return m; }
function box(L, w, h, d, mat, r = 0.04) { const m = new L.THREE.Mesh(new L.RoundedBoxGeometry(w, h, d, 4, Math.min(r, w / 2 - 0.001, h / 2 - 0.001, d / 2 - 0.001)), mat); return m; }
function rod(L, r, len, mat, from, to) {
  const { THREE } = L;
  const a = new THREE.Vector3(...from), b = new THREE.Vector3(...to);
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, a.distanceTo(b), 24), mat);
  m.position.copy(a.clone().add(b).multiplyScalar(0.5));
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
  return m;
}
const WOOD = '#d9b98a';

export const MODELS = {
  jug(o, L) {
    const { THREE, M, rbox, cyl, labelTex, RoundedBoxGeometry } = L;
    const g = group(L); const W = 2.2, H = 3.4, D = 1.7;
    g.add(rbox(W, H, D, 0.28, new THREE.MeshPhysicalMaterial({ color: '#f4f8fa', roughness: 0.1, clearcoat: 1, transparent: true, opacity: 0.28, depthWrite: false })));
    const liq = new THREE.Mesh(new RoundedBoxGeometry(W - 0.05, H * 0.84, D - 0.05, 6, 0.26), new THREE.MeshPhysicalMaterial({ color: o.color, roughness: 0.25, clearcoat: 0.6 })); liq.position.y = 0.03 + H * 0.42; g.add(liq);
    const neck = cyl(0.36, 0.3, M.clearPlastic(), H - 0.05); neck.position.x = -0.45; neck.position.z = -0.2; g.add(neck);
    const cap = cyl(0.42, 0.42, M.plastic('#f2f2ef', 0.5), H + 0.2); cap.position.x = -0.45; cap.position.z = -0.2; g.add(cap);
    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.11, 24, 64, Math.PI), M.plastic('#f6f6f4', 0.4)); handle.position.set(0.4, H - 0.05, -0.2); g.add(handle);
    const lab = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 1.25), new THREE.MeshStandardMaterial({ map: labelTex({ name: o.name, band: o.accent || o.color }), roughness: 0.6 }));
    lab.position.set(0, 1.55, D / 2 + 0.012); g.add(lab);
    return g;
  },
  bottle(o, L) {
    const { M, lathe, labelOnCyl, labelTex, cyl } = L;
    const g = group(L);
    g.add(lathe([[0, 0], [0.66, 0], [0.7, 0.06], [0.7, 2.3], [0.62, 2.55], [0.38, 2.75], [0.26, 2.85], [0.26, 3.05], [0, 3.05]], M.plastic(o.color, 0.3)));
    g.add(labelOnCyl(0.705, 0.45, 1.5, labelTex({ name: o.name, band: o.accent || '#2f8a52' })));
    g.add(cyl(0.3, 0.45, M.plastic(o.accent || '#3e8ed0', 0.35), 3.0));
    return g;
  },
  trigger(o, L) {
    const { THREE, M, lathe, labelOnCyl, labelTex, cyl } = L;
    const g = group(L); const k = o.accent || '#2f3133';
    g.add(lathe([[0, 0], [0.6, 0], [0.64, 0.06], [0.64, 2.2], [0.5, 2.45], [0.24, 2.6], [0.24, 2.75], [0, 2.75]], M.plastic(o.color, 0.3)));
    g.add(labelOnCyl(0.645, 0.4, 1.45, labelTex({ name: o.name, band: k })));
    g.add(cyl(0.3, 0.3, M.plastic(k, 0.4), 2.7));
    const head = box(L, 0.5, 0.55, 1.15, M.plastic(k, 0.35), 0.12); head.position.set(0, 3.25, 0.25); g.add(head);
    const noz = box(L, 0.22, 0.22, 0.3, M.plastic(k, 0.35), 0.06); noz.position.set(0, 3.32, 0.95); g.add(noz);
    const trig = box(L, 0.18, 0.75, 0.2, M.plastic(k, 0.35), 0.06); trig.position.set(0, 2.75, 0.62); trig.rotation.x = 0.35; g.add(trig);
    return g;
  },
  aerosol(o, L) {
    const { M, lathe, labelOnCyl, canvasTex } = L;
    const g = group(L); const color = o.color, cap = o.secondary || color;
    g.add(lathe([[0, 0], [0.62, 0], [0.66, 0.06], [0.66, 0.1], [0.68, 0.14], [0.68, 3.0], [0.62, 3.2], [0.45, 3.35], [0.2, 3.42], [0, 3.42]], M.metal('#d9dde0', 0.22)));
    g.add(labelOnCyl(0.69, 0.18, 2.78, canvasTex(1024, 512, (x, w, h) => {
      x.fillStyle = color; x.fillRect(0, 0, w, h);
      const gr = x.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, 'rgba(255,255,255,.12)'); gr.addColorStop(1, 'rgba(0,0,0,.18)'); x.fillStyle = gr; x.fillRect(0, 0, w, h);
      x.fillStyle = '#fff'; x.font = 'bold 70px Arial'; x.textAlign = 'center';
      o.name.toUpperCase().split(' ').filter((wd) => wd.length > 2).slice(0, 3).forEach((wd, i) => x.fillText(wd, w * 0.5, h * 0.34 + i * 78));
      x.fillStyle = 'rgba(0,0,0,.35)'; x.fillRect(w * 0.3, h * 0.84, w * 0.4, 22);
    }), Math.PI * 2));
    g.add(lathe([[0, 3.3], [0.6, 3.3], [0.6, 4.05], [0.5, 4.15], [0, 4.15]], M.plastic(cap, 0.3)));
    return g;
  },
  bar(o, L) {
    const { THREE, M } = L;
    const g = group(L);
    const b = box(L, 2.2, 0.7, 1.4, new THREE.MeshPhysicalMaterial({ color: o.color, roughness: 0.45, sheen: 0.4 }), 0.3); b.position.y = 0.35; g.add(b);
    const top = box(L, 1.3, 0.06, 0.7, new THREE.MeshPhysicalMaterial({ color: o.color, roughness: 0.3 }), 0.03); top.position.y = 0.71; g.add(top);
    return g;
  },
  bucket(o, L) {
    const { THREE, M, lathe } = L;
    const g = group(L);
    const prof = [[0, 0.05], [1.05, 0.05], [1.1, 0.1], [1.45, 2.2], [1.55, 2.24], [1.56, 2.32], [1.47, 2.3], [1.38, 2.2], [1.02, 0.15], [0, 0.15]];
    const mat = isClear(o.color) ? M.clearPlastic('#eef4f7') : M.plastic(o.color, 0.4); mat.side = THREE.DoubleSide; g.add(lathe(prof, mat));
    const h = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.035, 12, 96, Math.PI), M.metal('#bfc5c9', 0.3)); h.position.y = 2.25; h.rotation.y = Math.PI / 5; g.add(h);
    return g;
  },
  wringer(o, L) {
    const { THREE, M, lathe } = L;
    const g = group(L);
    const prof = [[0, 0.05], [1.05, 0.05], [1.1, 0.1], [1.4, 1.9], [1.5, 1.94], [1.51, 2.02], [1.42, 2.0], [1.33, 1.9], [1.02, 0.15], [0, 0.15]];
    const mat = M.plastic(o.color, 0.4); mat.side = THREE.DoubleSide; const b = lathe(prof, mat); b.scale.set(1.3, 1, 0.9); g.add(b);
    const w = box(L, 1.3, 0.7, 1.1, M.plastic('#2d2f31', 0.45), 0.12); w.position.set(0.95, 2.05, 0); g.add(w);
    const hole = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.3, 0.05, 48), M.matte('#111')); hole.position.set(0.95, 2.41, 0); g.add(hole);
    const hd = rod(L, 0.06, 0, M.plastic('#2d2f31', 0.4), [-1.6, 1.9, 0], [-2.0, 2.2, 0]); g.add(hd);
    return g;
  },
  bin(o, L) {
    const { M } = L;
    const g = group(L); const c = o.color, s = o.secondary || c;
    const b = box(L, 1.6, 3.2, 1.3, M.plastic(c, 0.3), 0.14); b.position.y = 1.6; b.scale.set(1, 1, 1); g.add(b);
    const lid = box(L, 1.72, 0.45, 1.42, M.plastic(s, 0.3), 0.18); lid.position.y = 3.35; g.add(lid);
    const flap = box(L, 1.0, 0.08, 0.95, M.plastic(s, 0.25), 0.03); flap.position.set(0, 3.6, 0.05); flap.rotation.z = 0.08; g.add(flap);
    return g;
  },
  wheelie(o, L) {
    const { THREE, M } = L;
    const g = group(L);
    const b = box(L, 2.0, 2.9, 1.8, M.plastic(o.color, 0.45), 0.12); b.position.y = 1.65; g.add(b);
    const lid = box(L, 2.2, 0.22, 2.0, M.plastic(o.color, 0.4), 0.08); lid.position.y = 3.2; g.add(lid);
    const hd = box(L, 2.0, 0.16, 0.16, M.plastic(o.color, 0.4), 0.06); hd.position.set(0, 3.15, -1.05); g.add(hd);
    for (const x of [-0.8, 0.8]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.18, 32), M.matte('#1d1e1f', 0.6)); w.rotation.z = Math.PI / 2; w.position.set(x, 0.28, -0.75); g.add(w); }
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.035, 12, 64), M.matte('#ffffff')); ring.position.set(0, 1.8, 0.91); g.add(ring);
    return g;
  },
  bagroll(o, L) {
    const { THREE, M, lathe, labelOnCyl, labelTex } = L;
    const g = group(L);
    g.add(lathe([[0.12, 0], [0.72, 0], [0.76, 0.05], [0.76, 2.55], [0.72, 2.6], [0.12, 2.6]], M.plastic(o.color, 0.25)));
    const core = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 2.62, 32, 1, true), M.matte('#2a2a2a')); core.material.side = THREE.DoubleSide; core.position.y = 1.3; g.add(core);
    g.add(labelOnCyl(0.765, 0.7, 1.2, labelTex({ name: o.name, band: o.accent || '#ef6c2f', title: 'G PACKING' })));
    return g;
  },
  trashbag(o, L) {
    const { THREE, M, lathe } = L;
    const g = group(L);
    const prof = [[0, 0], [0.9, 0.05], [1.35, 0.5], [1.5, 1.2], [1.35, 2.0], [0.9, 2.5], [0.3, 2.85], [0.12, 3.0], [0.2, 3.2], [0, 3.25]];
    const mat = isClear(o.color) ? M.clearPlastic('#eef4f7') : M.plastic(o.color, 0.25); mat.side = THREE.DoubleSide;
    const b = lathe(prof, mat, 64); b.scale.set(1, 1, 0.85); g.add(b);
    for (const s of [-1, 1]) { const ear = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.6, 16), mat); ear.position.set(0.25 * s, 3.35, 0); ear.rotation.z = -0.5 * s; g.add(ear); }
    return g;
  },
  broom(o, L) {
    const { THREE, M, canvasTex } = L;
    const g = group(L);
    const tex = canvasTex(512, 128, (x, w, h) => { x.fillStyle = o.color; x.fillRect(0, 0, w, h); for (let i = 0; i < w; i += 3) { x.fillStyle = `rgba(0,0,0,${Math.random() * 0.35})`; x.fillRect(i, 0, 1.5, h); } });
    const bristles = box(L, 2.6, 0.75, 0.45, new THREE.MeshStandardMaterial({ map: tex, roughness: 0.8 }), 0.03); bristles.position.y = 0.38; g.add(bristles);
    const head = box(L, 2.7, 0.35, 0.55, M.plastic(o.color, 0.35), 0.1); head.position.y = 0.9; g.add(head);
    g.add(rod(L, 0.07, 0, M.plastic(o.secondary || '#c7ccd0', 0.3), [0, 1.0, 0], [-0.9, 4.6, -1.0]));
    return g;
  },
  squeegee(o, L) {
    const { M } = L;
    const g = group(L);
    const rub = box(L, 3.0, 0.22, 0.12, M.matte('#1f2022', 0.6), 0.03); rub.position.y = 0.11; g.add(rub);
    const head = box(L, 3.0, 0.35, 0.4, M.plastic(o.color, 0.35), 0.08); head.position.y = 0.4; g.add(head);
    g.add(rod(L, 0.07, 0, M.metal('#c7ccd0', 0.3), [0, 0.55, 0], [-0.9, 4.6, -1.0]));
    return g;
  },
  mop(o, L) {
    const { THREE, M } = L;
    const g = group(L); const mat = new THREE.MeshStandardMaterial({ color: o.color, roughness: 0.95 });
    for (let i = 0; i < 26; i++) {
      const a = (i / 26) * Math.PI * 2 + Math.random() * 0.2, r = 1.2 + Math.random() * 0.35;
      const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0.75, 0), new THREE.Vector3(Math.cos(a) * r * 0.5, 0.45, Math.sin(a) * r * 0.5), new THREE.Vector3(Math.cos(a) * r, 0.08, Math.sin(a) * r)]);
      g.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 16, 0.07, 8), mat));
    }
    const holder = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 0.4, 24), M.plastic('#9aa0a6', 0.35)); holder.position.y = 0.85; g.add(holder);
    g.add(rod(L, 0.065, 0, M.metal('#c7ccd0', 0.3), [0, 1.0, 0], [-0.8, 4.4, -0.9]));
    return g;
  },
  dustpan(o, L) {
    const { THREE, M } = L;
    const g = group(L); const mat = M.plastic(o.color, 0.35);
    const base = box(L, 2.4, 0.08, 1.8, mat, 0.03); base.position.set(0, 0.2, 0); base.rotation.x = 0.12; g.add(base);
    const back = box(L, 2.4, 0.6, 0.08, mat, 0.03); back.position.set(0, 0.5, -0.88); g.add(back);
    for (const s of [-1, 1]) { const side = box(L, 0.08, 0.5, 1.8, mat, 0.03); side.position.set(1.2 * s, 0.38, 0); g.add(side); }
    g.add(rod(L, 0.09, 0, mat, [0, 0.6, -0.9], [0, 1.6, -2.1]));
    return g;
  },
  sponge(o, L) {
    const { THREE } = L;
    const g = group(L);
    const a = box(L, 2.0, 0.7, 1.3, new THREE.MeshStandardMaterial({ color: o.color, roughness: 0.95 }), 0.1); a.position.y = 0.35; g.add(a);
    const b = box(L, 2.0, 0.22, 1.3, new THREE.MeshStandardMaterial({ color: o.accent || '#2f7a45', roughness: 1 }), 0.05); b.position.y = 0.81; g.add(b);
    return g;
  },
  scrubber(o, L) {
    const { THREE, M } = L;
    const geo = new THREE.SphereGeometry(1, 96, 64); const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) { const v = new THREE.Vector3().fromBufferAttribute(p, i); const n = 1 + Math.sin(v.x * 23) * Math.cos(v.z * 19) * 0.06 + Math.sin(v.y * 31 + v.x * 7) * 0.05; v.multiplyScalar(n); p.setXYZ(i, v.x, v.y, v.z); }
    geo.computeVertexNormals();
    const m = new THREE.Mesh(geo, M.metal(o.color, 0.45)); m.scale.set(1.2, 0.6, 1.2); m.position.y = 0.55;
    const g = group(L); g.add(m); return g;
  },
  cloth(o, L) {
    const { THREE, canvasTex, noise } = L;
    const g = group(L);
    const tex = canvasTex(512, 512, (x, w, h) => { noise(x, w, h, o.color, 18); x.strokeStyle = o.accent || '#fff'; x.setLineDash([14, 10]); x.lineWidth = 6; x.strokeRect(28, 28, w - 56, h - 56); });
    const c = box(L, 2.4, 0.3, 2.0, new THREE.MeshPhysicalMaterial({ map: tex, roughness: 1, sheen: 1, sheenColor: new THREE.Color('#ffffff') }), 0.12); c.position.y = 0.15; g.add(c);
    const fold = box(L, 2.4, 0.18, 1.0, new THREE.MeshPhysicalMaterial({ map: tex, roughness: 1, sheen: 1 }), 0.09); fold.position.set(0, 0.38, -0.5); g.add(fold);
    return g;
  },
  glove(o, L) {
    const { THREE, M } = L;
    const g = group(L); const mat = M.plastic(o.color, 0.5);
    const hand = new THREE.Group();
    const palm = box(L, 1.5, 0.32, 1.7, mat, 0.15); palm.position.set(0, 0.16, 0); hand.add(palm);
    const cuff = box(L, 1.35, 0.3, 1.6, mat, 0.14); cuff.position.set(0, 0.15, 1.55); hand.add(cuff);
    const fingers = [[-0.54, 1.15], [-0.18, 1.35], [0.18, 1.3], [0.53, 1.05]];
    for (const [x, len] of fingers) { const f = new THREE.Mesh(new THREE.CapsuleGeometry(0.17, len, 8, 24), mat); f.rotation.x = Math.PI / 2; f.position.set(x, 0.17, -0.85 - len / 2); hand.add(f); }
    const th = new THREE.Mesh(new THREE.CapsuleGeometry(0.19, 0.9, 8, 24), mat); th.rotation.x = Math.PI / 2; th.rotation.y = -0.9; th.position.set(-1.05, 0.18, -0.15); hand.add(th);
    hand.rotation.y = 0.6; g.add(hand); return g;
  },
  rollbox(o, L) {
    const { THREE, canvasTex, noise } = L;
    const g = group(L);
    const tex = canvasTex(1024, 256, (x, w, h) => { noise(x, w, h, '#f6f6f3', 6); x.fillStyle = o.accent || '#2f8a52'; x.fillRect(0, h * 0.62, w, h * 0.18); x.fillStyle = '#2b2f31'; x.font = 'bold 60px Arial'; x.fillText('G PACKING', 40, h * 0.42); });
    const b = box(L, 4.2, 0.6, 0.7, new THREE.MeshStandardMaterial({ map: tex, roughness: 0.7 }), 0.03); b.position.y = 0.3; g.add(b);
    const blade = box(L, 4.0, 0.03, 0.06, L.M.metal('#c9ced1', 0.3), 0.01); blade.position.set(0, 0.6, 0.36); g.add(blade);
    return g;
  },
  roll(o, L) {
    const { THREE, M } = L;
    const g = group(L);
    const r = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 3.0, 64), M.plastic(o.color, 0.6)); r.rotation.z = Math.PI / 2; r.position.y = 0.7; g.add(r);
    const core = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 3.02, 32), M.matte('#a4825a')); core.rotation.z = Math.PI / 2; core.position.y = 0.7; g.add(core);
    return g;
  },
  tissue(o, L) {
    const { THREE, M, lathe, canvasTex, noise } = L;
    const g = group(L);
    const tex = canvasTex(256, 128, (x, w, h) => { noise(x, w, h, '#ffffff', 12); });
    const paper = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.95 });
    for (const [x, z] of [[-0.62, -0.62], [0.62, -0.62], [-0.62, 0.62], [0.62, 0.62]]) {
      const r = lathe([[0.18, 0], [0.58, 0], [0.6, 0.03], [0.6, 1.4], [0.58, 1.43], [0.18, 1.43]], paper); r.position.set(x, 0, z); g.add(r);
      const c = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 1.44, 32, 1, true), M.matte('#a9825a')); c.material.side = THREE.DoubleSide; c.position.set(x, 0.72, z); g.add(c);
    }
    return g;
  },
  jumbo(o, L) {
    const { THREE, M, lathe, canvasTex, noise } = L;
    const g = group(L); const color = '#f6f6f2';
    const tex = canvasTex(512, 256, (x, w, h) => { noise(x, w, h, color, 14); x.globalAlpha = .15; for (let i = 0; i < h; i += 6) { x.fillStyle = '#000'; x.fillRect(0, i, w, 1); } });
    g.add(lathe([[0.35, 0], [1.75, 0], [1.8, 0.05], [1.8, 2.05], [1.75, 2.1], [0.35, 2.1]], new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9, side: THREE.DoubleSide })));
    const core = lathe([[0.3, -0.01], [0.36, -0.01], [0.36, 2.12], [0.3, 2.12]], M.matte('#a9825a', 0.8)); core.material.side = THREE.DoubleSide; g.add(core);
    for (let r = 0.5; r < 1.75; r += 0.06) { const ring = new THREE.Mesh(new THREE.RingGeometry(r, r + 0.005, 96), M.matte('#e6e6e0')); ring.rotation.x = -Math.PI / 2; ring.position.y = 2.101; g.add(ring); }
    return g;
  },
  napkins(o, L) {
    const { THREE, canvasTex, noise } = L;
    const g = group(L);
    const side = canvasTex(512, 256, (x, w, h) => { noise(x, w, h, '#ffffff', 8); for (let i = 0; i < h; i += 5) { x.fillStyle = 'rgba(0,0,0,.07)'; x.fillRect(0, i, w, 1); } });
    const top = canvasTex(512, 512, (x, w, h) => { noise(x, w, h, '#ffffff', 8); x.strokeStyle = 'rgba(0,0,0,.06)'; for (let i = 20; i < w; i += 22) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, h); x.stroke(); x.beginPath(); x.moveTo(0, i); x.lineTo(w, i); x.stroke(); } });
    const mats = [side, side, top, side, side, side].map((t) => new THREE.MeshStandardMaterial({ map: t, roughness: 0.95 }));
    const n = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.0, 2.2), mats); n.position.y = 0.5; g.add(n);
    const band = box(L, 0.5, 1.02, 2.24, new THREE.MeshStandardMaterial({ color: o.accent || '#3e8ed0', roughness: 0.6 }), 0.01); band.position.y = 0.5; g.add(band);
    return g;
  },
  dispenser(o, L) {
    const { M } = L;
    const g = group(L);
    const b = box(L, 1.9, 2.9, 1.2, M.plastic(o.color, 0.3), 0.2); b.position.y = 1.45; g.add(b);
    const win = box(L, 1.2, 1.0, 0.06, M.plastic(o.accent || '#4f9a5e', 0.2), 0.04); win.position.set(0, 1.9, 0.6); g.add(win);
    const slot = box(L, 1.1, 0.12, 0.3, M.matte('#2a2c2e'), 0.04); slot.position.set(0, 0.45, 0.5); g.add(slot);
    const paper = box(L, 0.9, 0.5, 0.03, M.matte('#ffffff'), 0.01); paper.position.set(0, 0.2, 0.63); g.add(paper);
    return g;
  },
  tshirt(o, L) {
    const { THREE, M } = L;
    const s = new THREE.Shape();
    s.moveTo(-1.1, 0); s.lineTo(1.1, 0); s.lineTo(1.1, 2.0); s.lineTo(0.75, 2.25); s.lineTo(0.75, 3.0); s.lineTo(0.45, 3.0); s.lineTo(0.45, 2.45);
    s.quadraticCurveTo(0, 2.15, -0.45, 2.45); s.lineTo(-0.45, 3.0); s.lineTo(-0.75, 3.0); s.lineTo(-0.75, 2.25); s.lineTo(-1.1, 2.0); s.lineTo(-1.1, 0);
    const geo = new THREE.ExtrudeGeometry(s, { depth: 0.08, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.05, bevelSegments: 4 });
    const mat = new THREE.MeshPhysicalMaterial({ color: '#f4f7f8', roughness: 0.35, transmission: 0.35, thickness: 0.2, clearcoat: 0.4 });
    const m = new THREE.Mesh(geo, mat); m.rotation.y = -0.15; const g = group(L); g.add(m); return g;
  },
  paperbag(o, L) {
    const { THREE, M, kraftTex } = L;
    const g = group(L); const mat = M.paper(kraftTex());
    const W = 1.8, H = 2.6, D = 1.0;
    for (const [w, d, x, z] of [[W, 0.03, 0, D / 2], [W, 0.03, 0, -D / 2], [0.03, D, W / 2, 0], [0.03, D, -W / 2, 0]]) { const p = new THREE.Mesh(new THREE.BoxGeometry(w, H, d), mat); p.position.set(x, H / 2, z); g.add(p); }
    const bottom = new THREE.Mesh(new THREE.BoxGeometry(W, 0.03, D), mat); bottom.position.y = 0.02; g.add(bottom);
    const inside = new THREE.Mesh(new THREE.PlaneGeometry(W - 0.04, D - 0.04), M.matte('#6b4b2a')); inside.rotation.x = -Math.PI / 2; inside.position.y = H - 0.6; g.add(inside);
    const fold = new THREE.Mesh(new THREE.BoxGeometry(W + 0.02, 0.18, D + 0.02), M.paper(kraftTex())); fold.position.y = H - 0.09; g.add(fold);
    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.04, 12, 48, Math.PI), M.paper(kraftTex())); handle.position.set(0, H, 0); g.add(handle);
    return g;
  },
  tray(o, L) {
    const { THREE } = L;
    const g = group(L); const mat = surface(L, o.color); mat.side = THREE.DoubleSide;
    const W = 3.2, D = 2.4, H = 0.45, t = 0.05, tilt = 0.28;
    const base = new THREE.Mesh(new THREE.BoxGeometry(W - 0.2, t, D - 0.2), mat); base.position.y = t / 2; g.add(base);
    const wall = (len, x, z, ry) => {
      const w = new THREE.Mesh(new THREE.BoxGeometry(len, H, t), mat);
      const piv = new THREE.Group(); piv.position.set(x, 0, z); piv.rotation.y = ry;
      w.position.y = H / 2; w.rotation.x = tilt; w.position.z = Math.sin(tilt) * H / 2;
      piv.add(w); g.add(piv);
    };
    wall(W - 0.2, 0, (D - 0.2) / 2, 0); wall(W - 0.2, 0, -(D - 0.2) / 2, Math.PI);
    wall(D - 0.2, (W - 0.2) / 2, 0, Math.PI / 2); wall(D - 0.2, -(W - 0.2) / 2, 0, -Math.PI / 2);
    return g;
  },
  traylid(o, L) {
    const { M } = L;
    const g = MODELS.tray(o, L);
    const lid = box(L, 3.35, 0.35, 2.55, M.clearPlastic('#f2f7f9'), 0.08); lid.position.y = 0.62; g.add(lid);
    return g;
  },
  disc(o, L) {
    const { THREE } = L;
    const m = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.0, 0.12, 96), surface(L, o.color)); m.position.y = 0.06;
    const g = group(L); g.add(m); return g;
  },
  clamshell(o, L) {
    const { THREE } = L;
    const g = group(L); const mat = surface(L, o.color);
    const bot = box(L, 2.4, 0.6, 2.4, mat, 0.2); bot.position.y = 0.3; g.add(bot);
    const inner = box(L, 2.1, 0.05, 2.1, new THREE.MeshStandardMaterial({ color: '#e7e7e2', roughness: 1 }), 0.02); inner.position.y = 0.61; g.add(inner);
    const pivot = new THREE.Group(); pivot.position.set(0, 0.6, -1.2); pivot.rotation.x = -1.9;
    const lid = box(L, 2.4, 0.6, 2.4, mat, 0.2); lid.position.set(0, 0.3, 1.2); pivot.add(lid); g.add(pivot);
    return g;
  },
  flatbox(o, L) {
    const { THREE, M, kraftTex, canvasTex, noise } = L;
    const g = group(L);
    const white = o.color !== KRAFT;
    const tex = white ? canvasTex(512, 512, (x, w, h) => noise(x, w, h, '#f3f3ef', 8)) : kraftTex();
    const b = box(L, 3.6, 0.5, 3.6, M.paper(tex), 0.04); b.position.y = 0.25; g.add(b);
    const top = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 2.8), new THREE.MeshStandardMaterial({ map: canvasTex(512, 512, (x, w, h) => { x.clearRect(0, 0, w, h); x.strokeStyle = white ? (o.accent || '#c0392b') : 'rgba(80,50,20,.55)'; x.lineWidth = 10; x.strokeRect(20, 20, w - 40, h - 40); if (white) { x.fillStyle = o.accent || '#c0392b'; x.font = 'bold 64px Arial'; x.textAlign = 'center'; x.fillText('PIZZA', w / 2, h / 2 + 20); } }), transparent: true, roughness: 0.9 }));
    top.rotation.x = -Math.PI / 2; top.position.y = 0.505; g.add(top);
    return g;
  },
  box(o, L) {
    const { THREE, M, canvasTex, noise, kraftTex } = L;
    const g = group(L);
    const mat = o.color === KRAFT ? M.paper(kraftTex()) : (o.color === '#f3f3ef' || o.color === '#f4f4f2') ? M.paper(canvasTex(512, 512, (x, w, h) => noise(x, w, h, o.color, 6))) : M.plastic(o.color, 0.5);
    const b = box(L, 2.4, 2.0, 2.4, mat, 0.04); b.position.y = 1.0; g.add(b);
    const win = box(L, 1.2, 0.8, 0.03, new THREE.MeshStandardMaterial({ color: o.accent || '#e5b3c6', roughness: 0.4 }), 0.01); win.position.set(0, 1.1, 1.21); g.add(win);
    return g;
  },
  cup(o, L) {
    const { THREE, M, canvasTex, noise, FACE } = L;
    const g = group(L); const clear = isClear(o.color);
    const band = o.accent && o.accent !== o.color ? o.accent : null;
    const mat = clear ? M.clearPlastic('#f2f7f9') : new THREE.MeshStandardMaterial({ map: canvasTex(1024, 512, (x, w, h) => { noise(x, w, h, o.color, 8); if (band) { x.fillStyle = band; x.fillRect(0, h * 0.38, w, h * 0.22); } }), roughness: 0.6, side: THREE.DoubleSide });
    if (clear) mat.side = THREE.DoubleSide;
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.62, 2.95, 96, 1, true, FACE - Math.PI, Math.PI * 2), mat); body.position.y = 1.5; g.add(body);
    const bottom = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.04, 64), clear ? mat : M.matte(o.color)); bottom.position.y = 0.04; g.add(bottom);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.91, 0.035, 16, 96), clear ? mat : M.plastic('#fbfbf8', 0.4)); rim.rotation.x = Math.PI / 2; rim.position.y = 2.97; g.add(rim);
    return g;
  },
  lid(o, L) {
    const { THREE, M, lathe } = L;
    const mat = (o.color === '#f4f4f2' || o.color === '#efe9da') ? M.plastic(o.color, 0.35) : M.clearPlastic('#f2f7f9');
    mat.side = THREE.DoubleSide;
    const m = lathe([[0, 0.55], [0.35, 0.55], [0.6, 0.5], [1.2, 0.3], [1.5, 0.18], [1.62, 0.12], [1.66, 0.0], [1.6, 0.0]], mat);
    const g = group(L); g.add(m); return g;
  },
  sticks(o, L) {
    const { THREE, M } = L;
    const g = group(L); const mat = new THREE.MeshStandardMaterial({ color: o.color, roughness: 0.8 });
    for (let i = 0; i < 18; i++) { const r = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 3.6, 12), mat); r.rotation.z = Math.PI / 2; r.position.set((Math.random() - 0.5) * 0.2, 0.05 + (i % 3) * 0.09, -0.4 + Math.floor(i / 3) * 0.13); g.add(r); }
    const band = box(L, 0.4, 0.4, 0.95, M.plastic(o.accent || '#2f8a52', 0.5), 0.05); band.position.y = 0.15; g.add(band);
    return g;
  },
  bowl(o, L) {
    const { THREE, M, lathe } = L;
    const g = group(L); const mat = surface(L, o.color); mat.side = THREE.DoubleSide;
    g.add(lathe([[0, 0.02], [1.15, 0.02], [1.2, 0.06], [1.6, 1.5], [1.65, 1.55], [1.55, 1.52], [1.12, 0.1], [0, 0.1]], mat));
    const lid = lathe([[0, 1.95], [0.8, 1.9], [1.4, 1.7], [1.68, 1.58], [1.7, 1.52]], M.clearPlastic('#f2f7f9')); lid.material.side = THREE.DoubleSide; g.add(lid);
    return g;
  },
  dip(o, L) {
    const { THREE, M, lathe } = L;
    const g = group(L); const clear = isClear(o.color) || o.color === '#f3f3ef';
    const mat = clear && o.color !== '#f3f3ef' ? M.clearPlastic('#f2f7f9') : M.plastic(o.color, 0.35); mat.side = THREE.DoubleSide;
    g.add(lathe([[0, 0.02], [0.75, 0.02], [0.8, 0.06], [1.05, 1.1], [1.12, 1.14], [1.04, 1.12], [0.72, 0.1], [0, 0.1]], mat));
    if (o.color !== '#f3f3ef') { const lid = lathe([[0, 1.32], [0.9, 1.27], [1.13, 1.18], [1.15, 1.12]], M.clearPlastic('#f2f7f9')); lid.material.side = THREE.DoubleSide; g.add(lid); }
    return g;
  },
  paper(o, L) {
    const { THREE, canvasTex, noise } = L;
    const g = group(L);
    const wrap = canvasTex(1024, 512, (x, w, h) => { noise(x, w, h, '#e9dcc4', 10); x.fillStyle = o.accent || '#2f8a52'; x.fillRect(0, 0, w * 0.28, h); x.fillStyle = '#fff'; x.font = 'bold 90px Arial'; x.fillText('A4', 40, 140); x.fillStyle = '#26302a'; x.font = 'bold 120px Arial'; x.fillText('PAPEL', w * 0.36, h * 0.48); x.font = '60px Arial'; x.fillText('500 hojas · 75 g', w * 0.36, h * 0.66); });
    const edge = canvasTex(512, 128, (x, w, h) => { noise(x, w, h, '#e9dcc4', 8); });
    const mats = [edge, edge, wrap, edge, edge, edge].map((t) => new THREE.MeshStandardMaterial({ map: t, roughness: 0.75 }));
    const b = new THREE.Mesh(new THREE.BoxGeometry(2.97, 0.6, 2.1), mats); b.position.y = 0.3; g.add(b);
    return g;
  },
  pad(o, L) {
    const { THREE, canvasTex, noise } = L;
    const g = group(L);
    const side = canvasTex(256, 128, (x, w, h) => { noise(x, w, h, '#fafaf6', 6); for (let i = 0; i < h; i += 4) { x.fillStyle = 'rgba(0,0,0,.08)'; x.fillRect(0, i, w, 1); } });
    const m = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.5, 1.6), new THREE.MeshStandardMaterial({ map: side, roughness: 0.9 })); m.position.y = 0.25; g.add(m);
    const top = box(L, 2.2, 0.05, 1.6, new THREE.MeshStandardMaterial({ color: o.color, roughness: 0.7 }), 0.01); top.position.y = 0.52; g.add(top);
    return g;
  },
  tape(o, L) {
    const { THREE, M, lathe } = L;
    const g = group(L);
    const mat = new THREE.MeshPhysicalMaterial({ color: o.color, roughness: 0.35, clearcoat: 0.6, transmission: o.color === '#e9e2c8' ? 0.35 : 0, thickness: 0.8 });
    g.add(lathe([[0.75, 0], [1.4, 0], [1.42, 0.03], [1.42, 0.6], [1.4, 0.63], [0.75, 0.63]], mat));
    const core = lathe([[0.62, 0], [0.75, 0], [0.75, 0.63], [0.62, 0.63]], M.matte('#c9a77a', 0.8)); core.material.side = THREE.DoubleSide; g.add(core);
    return g;
  },
  pen(o, L) {
    const { THREE, M } = L;
    const g = group(L);
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 3.0, 32), M.plastic(o.color, 0.3)); body.rotation.z = Math.PI / 2; body.position.y = 0.16; g.add(body);
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.9, 32), M.plastic(o.color, 0.25)); cap.rotation.z = Math.PI / 2; cap.position.set(-1.1, 0.17, 0); cap.material = M.plastic(o.color === '#f2e24b' ? '#2f3133' : o.color, 0.25); g.add(cap);
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.4, 32), M.plastic('#e7e7e2', 0.3)); tip.rotation.z = -Math.PI / 2; tip.position.set(1.7, 0.16, 0); g.add(tip);
    const clip = box(L, 0.7, 0.05, 0.06, M.metal('#c9ced1', 0.3), 0.02); clip.position.set(-1.1, 0.34, 0); g.add(clip);
    g.rotation.y = 0.5; return g;
  },
  stapler(o, L) {
    const { M } = L;
    const g = group(L);
    const base = box(L, 3.2, 0.25, 0.75, M.plastic('#2a2c2e', 0.4), 0.1); base.position.y = 0.13; g.add(base);
    const arm = box(L, 3.0, 0.45, 0.68, M.plastic(o.color, 0.3), 0.18); arm.position.set(-0.05, 0.55, 0); arm.rotation.z = 0.05; g.add(arm);
    const met = box(L, 2.6, 0.12, 0.5, M.metal('#c9ced1', 0.3), 0.04); met.position.y = 0.33; g.add(met);
    return g;
  },
  calculator(o, L) {
    const { M } = L;
    const g = group(L);
    const b = box(L, 2.0, 0.28, 2.8, M.plastic(o.color, 0.45), 0.12); b.position.y = 0.14; g.add(b);
    const scr = box(L, 1.6, 0.04, 0.55, M.plastic('#bcc8b0', 0.2), 0.02); scr.position.set(0, 0.29, -0.95); g.add(scr);
    for (let i = 0; i < 20; i++) { const k = box(L, 0.3, 0.1, 0.26, M.plastic(i % 4 === 3 ? '#2f3133' : '#fafaf7', 0.35), 0.05); k.position.set(-0.6 + (i % 4) * 0.4, 0.31, -0.3 + Math.floor(i / 4) * 0.36); g.add(k); }
    return g;
  },
  scissors(o, L) {
    const { THREE, M } = L;
    const g = group(L);
    for (const s of [-1, 1]) {
      const blade = box(L, 2.0, 0.05, 0.22, M.metal('#cfd4d7', 0.2), 0.03); blade.position.set(0.9, 0.1, 0); blade.rotation.y = 0.12 * s; g.add(blade);
      const h = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.09, 16, 48), M.plastic(o.color, 0.35)); h.rotation.x = Math.PI / 2; h.position.set(-0.5, 0.1, 0.42 * s); g.add(h);
    }
    g.rotation.y = 0.4; return g;
  },
  cutter(o, L) {
    const { M } = L;
    const g = group(L);
    const b = box(L, 2.8, 0.3, 0.55, M.plastic(o.color, 0.35), 0.12); b.position.y = 0.15; g.add(b);
    const bl = box(L, 0.7, 0.04, 0.35, M.metal('#cfd4d7', 0.2), 0.01); bl.position.set(1.65, 0.15, 0); g.add(bl);
    const sl = box(L, 0.3, 0.1, 0.25, M.plastic('#2a2c2e', 0.4), 0.04); sl.position.set(-0.3, 0.33, 0); g.add(sl);
    g.rotation.y = 0.4; return g;
  },
  clips(o, L) {
    const { THREE, M } = L;
    const g = group(L); const cols = ['#e5484d', '#3e8ed0', '#f2b134', '#46a758', '#9aa0a6'];
    const path = new THREE.CurvePath();
    const pts = [[0, 0], [0, 1.0], [0.25, 1.15], [0.5, 1.0], [0.5, 0.2], [0.33, 0.08], [0.17, 0.2], [0.17, 0.85]];
    const curve = new THREE.CatmullRomCurve3(pts.map(([x, y]) => new THREE.Vector3(x, 0, -y)));
    for (let i = 0; i < 6; i++) { const m = new THREE.Mesh(new THREE.TubeGeometry(curve, 64, 0.035, 8), M.plastic(cols[i % 5], 0.35)); m.position.set((i % 3) * 0.7 - 0.7, 0.04 + i * 0.03, Math.floor(i / 3) * 0.6); m.rotation.y = i * 0.6; g.add(m); }
    return g;
  },
  device(o, L) {
    const { M } = L;
    const g = group(L);
    const b = box(L, 2.4, 0.9, 0.7, M.plastic(o.color, 0.35), 0.2); b.position.set(0, 1.4, 0); g.add(b);
    const hd = box(L, 0.45, 1.4, 0.55, M.plastic('#2a2c2e', 0.45), 0.15); hd.position.set(0.6, 0.7, 0); hd.rotation.z = -0.25; g.add(hd);
    const roll = box(L, 0.6, 0.6, 0.5, M.matte('#ffffff'), 0.25); roll.position.set(-0.7, 2.0, 0); g.add(roll);
    return g;
  },
  cartridge(o, L) {
    const { THREE, canvasTex, noise } = L;
    const g = group(L);
    const face = canvasTex(1024, 256, (x, w, h) => { noise(x, w, h, '#f6f6f3', 5); x.fillStyle = o.accent || '#8db33a'; x.fillRect(0, h * 0.75, w, h * 0.25); x.fillStyle = '#4a4f52'; x.font = 'bold 80px Arial'; x.fillText('TÓNER / TINTA', 50, h * 0.5); });
    const plain = canvasTex(64, 64, (x, w, h) => noise(x, w, h, '#f6f6f3', 5));
    const mats = [plain, plain, plain, plain, face, plain].map((t) => new THREE.MeshStandardMaterial({ map: t, roughness: 0.6 }));
    const b = new THREE.Mesh(new THREE.BoxGeometry(3.4, 1.0, 1.2), mats); b.position.y = 0.5; g.add(b);
    return g;
  },
};
