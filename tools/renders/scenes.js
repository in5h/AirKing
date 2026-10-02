import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

// ---------- materials ----------
const M = {
  ral7035: new THREE.MeshStandardMaterial({ color: 0xd9dbd6, roughness: 0.5, metalness: 0.05 }),
  white: new THREE.MeshStandardMaterial({ color: 0xf3f4f5, roughness: 0.45, metalness: 0.0 }),
  galv: new THREE.MeshStandardMaterial({ color: 0xc3cad1, roughness: 0.32, metalness: 0.85 }),
  galvDark: new THREE.MeshStandardMaterial({ color: 0x8e979f, roughness: 0.4, metalness: 0.8 }),
  alu: new THREE.MeshStandardMaterial({ color: 0xdfe3e7, roughness: 0.25, metalness: 0.9 }),
  blue: new THREE.MeshStandardMaterial({ color: 0x3d7ab8, roughness: 0.38, metalness: 0.25 }),
  navy: new THREE.MeshStandardMaterial({ color: 0x1d3a5c, roughness: 0.45, metalness: 0.3 }),
  dark: new THREE.MeshStandardMaterial({ color: 0x2a3038, roughness: 0.55, metalness: 0.2 }),
  black: new THREE.MeshStandardMaterial({ color: 0x15181c, roughness: 0.35, metalness: 0.1 }),
  grey: new THREE.MeshStandardMaterial({ color: 0x9aa1a8, roughness: 0.5, metalness: 0.2 }),
  orange: new THREE.MeshStandardMaterial({ color: 0xe8742a, roughness: 0.45, metalness: 0.05 }),
  brass: new THREE.MeshStandardMaterial({ color: 0xc9a24a, roughness: 0.3, metalness: 0.9 }),
  plate: new THREE.MeshStandardMaterial({ color: 0xcdd2d6, roughness: 0.35, metalness: 0.7 }),
  green: new THREE.MeshStandardMaterial({ color: 0x2ecc71, emissive: 0x2ecc71, emissiveIntensity: 1.2 }),
  red: new THREE.MeshStandardMaterial({ color: 0xe74c3c, emissive: 0xe74c3c, emissiveIntensity: 1.0 }),
  amber: new THREE.MeshStandardMaterial({ color: 0xf5b041, emissive: 0xf5b041, emissiveIntensity: 1.0 }),
  screen: new THREE.MeshStandardMaterial({ color: 0x0b2a4a, emissive: 0x2f7fd1, emissiveIntensity: 0.55, roughness: 0.2 }),
  water: new THREE.MeshStandardMaterial({ color: 0x6fb3e6, roughness: 0.1, metalness: 0.1, transparent: true, opacity: 0.55 }),
  spray: new THREE.MeshStandardMaterial({ color: 0xdff0ff, roughness: 0.2, transparent: true, opacity: 0.22, depthWrite: false, side: THREE.DoubleSide }),
  bale: new THREE.MeshStandardMaterial({ color: 0xece3cf, roughness: 0.95 }),
  pvc: new THREE.MeshStandardMaterial({ color: 0x4f6d8a, roughness: 0.4, metalness: 0.1 }),
};

// ---------- helpers ----------
const ds = m => { const c = m.clone(); c.side = THREE.DoubleSide; return c; };
function add(parent, mesh, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) {
  mesh.position.set(x, y, z); mesh.rotation.set(rx, ry, rz);
  mesh.castShadow = true; mesh.receiveShadow = true;
  parent.add(mesh); return mesh;
}
const box = (p, w, h, d, m, x, y, z, rx, ry, rz) => add(p, new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m), x, y, z, rx, ry, rz);
const rbox = (p, w, h, d, r, m, x, y, z) => add(p, new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 4, r), m), x, y, z);
const cyl = (p, rt, rb, h, m, x, y, z, rx, ry, rz, seg = 48, open = false) =>
  add(p, new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg, 1, open), open ? ds(m) : m), x, y, z, rx, ry, rz);
const torus = (p, r, t, m, x, y, z, rx, ry, rz) => add(p, new THREE.Mesh(new THREE.TorusGeometry(r, t, 12, 64), m), x, y, z, rx, ry, rz);
const grp = (p, x = 0, y = 0, z = 0, ry = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = ry; p.add(g); return g; };

function canvasTex(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}

// pipe along an arbitrary path of points
function pipe(p, pts, r, m) {
  for (let i = 0; i < pts.length - 1; i++) {
    const a = new THREE.Vector3(...pts[i]), b = new THREE.Vector3(...pts[i + 1]);
    const len = a.distanceTo(b);
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 32), m);
    mesh.position.copy(a).add(b).multiplyScalar(0.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
    mesh.castShadow = mesh.receiveShadow = true; p.add(mesh);
    if (i > 0) add(p, new THREE.Mesh(new THREE.SphereGeometry(r, 24, 16), m), a.x, a.y, a.z);
  }
}
// rectangular duct along points (axis-aligned segments)
function duct(p, pts, w, h, m) {
  for (let i = 0; i < pts.length - 1; i++) {
    const a = new THREE.Vector3(...pts[i]), b = new THREE.Vector3(...pts[i + 1]);
    const d = b.clone().sub(a), len = d.length() + Math.min(w, h);
    const c = a.clone().add(b).multiplyScalar(0.5);
    const ax = Math.abs(d.x) > 1e-6 ? 'x' : Math.abs(d.y) > 1e-6 ? 'y' : 'z';
    const s = ax === 'x' ? [len, h, w] : ax === 'y' ? [w, len, h] : [w, h, len];
    box(p, ...s, m, c.x, c.y, c.z);
  }
}

// ---------- reusable equipment builders ----------
function cabinet(p, x, w = 0.8, h = 2.0, d = 0.6, opts = {}) {
  const g = grp(p, x, 0, 0);
  box(g, w, 0.1, d - 0.04, M.dark, 0, 0.05, 0);
  box(g, w, h, d, M.ral7035, 0, 0.1 + h / 2, 0);
  // door seam + handle
  box(g, w - 0.04, h - 0.04, 0.004, M.ral7035, 0, 0.1 + h / 2, d / 2 + 0.003);
  box(g, 0.025, 0.22, 0.03, M.dark, w / 2 - 0.08, 0.1 + h * 0.55, d / 2 + 0.02);
  // vent grille
  for (let i = 0; i < 6; i++) box(g, w * 0.5, 0.012, 0.01, M.dark, 0, 0.3 + i * 0.035, d / 2 + 0.008);
  if (opts.hmi) {
    box(g, w * 0.55, 0.32, 0.03, M.black, 0, 0.1 + h * 0.72, d / 2 + 0.015);
    box(g, w * 0.48, 0.25, 0.005, M.screen, 0, 0.1 + h * 0.72, d / 2 + 0.032);
  }
  if (opts.lights) {
    [M.green, M.amber, M.red].forEach((mm, i) =>
      cyl(g, 0.022, 0.022, 0.03, mm, -0.12 + i * 0.12, 0.1 + h * 0.52, d / 2 + 0.02, Math.PI / 2, 0, 0, 24));
    cyl(g, 0.045, 0.045, 0.04, M.red, 0.0, 0.1 + h * 0.44, d / 2 + 0.025, Math.PI / 2, 0, 0, 32);
    cyl(g, 0.06, 0.06, 0.01, M.amber, 0.0, 0.1 + h * 0.44, d / 2 + 0.006, Math.PI / 2, 0, 0, 32);
  }
  return g;
}

function vfd(p, x, y, z, w, h) {
  const g = grp(p, x, y, z);
  rbox(g, w, h, 0.22, 0.015, M.white, 0, 0, 0);
  box(g, w * 0.92, h * 0.28, 0.01, M.dark, 0, h * 0.28, 0.111);
  rbox(g, w * 0.42, h * 0.16, 0.03, 0.006, M.black, 0, h * 0.28, 0.12);
  box(g, w * 0.32, h * 0.07, 0.005, M.screen, 0, h * 0.31, 0.137);
  for (let i = 0; i < 7; i++) box(g, w * 0.7, 0.008, 0.01, M.grey, 0, -h * 0.3 + i * 0.022, 0.111);
  return g;
}

function plcRail(p, x, y, z, n) {
  const g = grp(p, x, y, z);
  box(g, n * 0.026 + 0.12, 0.035, 0.012, M.alu, 0, 0, -0.03);
  box(g, 0.1, 0.2, 0.1, M.grey, -n * 0.013 - 0.02, 0, 0.02); // coupler/CPU
  box(g, 0.06, 0.05, 0.005, M.screen, -n * 0.013 - 0.02, 0.05, 0.072);
  for (let i = 0; i < n; i++) {
    const mx = -n * 0.013 + 0.05 + i * 0.026;
    box(g, 0.024, 0.2, 0.09, M.grey, mx, 0, 0.015);
    box(g, 0.022, 0.05, 0.004, M.orange, mx, 0.06, 0.062);
    box(g, 0.022, 0.05, 0.004, M.orange, mx, -0.06, 0.062);
    if (i % 2 === 0) box(g, 0.006, 0.006, 0.004, M.green, mx, 0.09, 0.062);
  }
  return g;
}

function cableDuct(p, x, y, z, len, vertical = false) {
  const g = grp(p, x, y, z);
  const [w, h] = vertical ? [0.06, len] : [len, 0.06];
  box(g, w, h, 0.06, M.grey, 0, 0, 0);
  const n = Math.floor(len / 0.04);
  for (let i = 0; i < n; i++) {
    const o = -len / 2 + 0.02 + i * 0.04;
    vertical ? box(g, 0.062, 0.012, 0.05, M.dark, 0, o, 0.006) : box(g, 0.012, 0.062, 0.05, M.dark, o, 0, 0.006);
  }
  return g;
}

function mcb(p, x, y, z, poles = 1) {
  const g = grp(p, x, y, z);
  const w = 0.018 * poles;
  box(g, w, 0.09, 0.07, M.white, 0, 0, 0);
  box(g, w, 0.05, 0.03, M.white, 0, 0, 0.045);
  box(g, w * 0.7, 0.012, 0.03, M.dark, 0, 0.004, 0.065);
  box(g, w * 0.8, 0.01, 0.002, M.blue, 0, -0.03, 0.061);
  return g;
}

function contactor(p, x, y, z) {
  const g = grp(p, x, y, z);
  box(g, 0.045, 0.085, 0.09, M.grey, 0, 0, 0);
  box(g, 0.03, 0.03, 0.02, M.dark, 0, 0, 0.055);
  for (let i = 0; i < 3; i++) { box(g, 0.01, 0.01, 0.01, M.alu, -0.013 + i * 0.013, 0.047, 0.03); box(g, 0.01, 0.01, 0.01, M.alu, -0.013 + i * 0.013, -0.047, 0.03); }
  return g;
}

function bladeGeom(r0, r1, chord) {
  const s = new THREE.Shape();
  s.moveTo(r0, -chord * 0.35); s.quadraticCurveTo((r0 + r1) / 2, -chord * 0.6, r1, -chord * 0.45);
  s.quadraticCurveTo(r1 + chord * 0.12, 0, r1, chord * 0.45); s.quadraticCurveTo((r0 + r1) / 2, chord * 0.55, r0, chord * 0.35);
  s.closePath();
  return new THREE.ExtrudeGeometry(s, { depth: 0.012, bevelEnabled: true, bevelThickness: 0.004, bevelSize: 0.004, bevelSegments: 2 });
}

// axial fan, axis along +z
function axialFan(p, R = 0.6, len = 0.7, opts = {}) {
  const g = new THREE.Group(); p.add(g);
  cyl(g, R, R, len, M.galv, 0, 0, 0, Math.PI / 2, 0, 0, 64, true);
  torus(g, R + 0.02, 0.025, M.galv, 0, 0, len / 2);
  torus(g, R + 0.02, 0.025, M.galv, 0, 0, -len / 2);
  if (opts.bell) {
    const pts = []; for (let i = 0; i <= 16; i++) { const t = i / 16; pts.push(new THREE.Vector2(R + 0.28 * Math.pow(t, 2), t * 0.28)); }
    add(g, new THREE.Mesh(new THREE.LatheGeometry(pts, 64), ds(M.galv)), 0, 0, len / 2, Math.PI / 2, 0, 0);
  }
  cyl(g, R * 0.24, R * 0.24, 0.16, M.navy, 0, 0, len * 0.1, Math.PI / 2, 0, 0);
  add(g, new THREE.Mesh(new THREE.SphereGeometry(R * 0.24, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), M.navy), 0, 0, len * 0.1 + 0.08, Math.PI / 2, 0, 0);
  const nb = opts.blades || 7;
  for (let i = 0; i < nb; i++) {
    const hold = new THREE.Group(); hold.rotation.z = (i / nb) * Math.PI * 2; hold.position.z = len * 0.1; g.add(hold);
    const b = new THREE.Mesh(bladeGeom(R * 0.22, R * 0.95, R * 0.42), M.blue);
    b.rotation.x = 0.55; b.castShadow = true; hold.add(b);
  }
  // motor and struts
  cyl(g, R * 0.3, R * 0.3, len * 0.55, M.blue, 0, 0, -len * 0.18, Math.PI / 2, 0, 0);
  for (let i = 0; i < 10; i++) box(g, 0.012, R * 0.06, len * 0.5, M.navy, Math.cos(i / 10 * 6.283) * R * 0.31, Math.sin(i / 10 * 6.283) * R * 0.31, -len * 0.18, 0, 0, i / 10 * 6.283 + Math.PI / 2);
  for (let i = 0; i < 4; i++) { const a = i / 4 * 6.283 + 0.78; box(g, 0.03, R * 0.68, 0.05, M.galvDark, Math.cos(a) * R * 0.64, Math.sin(a) * R * 0.64, -len * 0.3, 0, 0, a - Math.PI / 2); }
  return g;
}

function nozzle(p, x, y, z, s = 1, mat = M.white) {
  const pts = [[0, 0], [0.02, 0], [0.022, 0.03], [0.03, 0.035], [0.03, 0.06], [0.018, 0.075], [0.008, 0.085], [0, 0.086]].map(([a, b]) => new THREE.Vector2(a * s, b * s));
  return add(p, new THREE.Mesh(new THREE.LatheGeometry(pts, 48), mat), x, y, z);
}

function sprayCone(p, x, y, z, len, rad, rx = 0, rz = 0, nDrops = 160) {
  const g = grp(p, x, y, z); g.rotation.set(rx, 0, rz);
  const cone = new THREE.Mesh(new THREE.ConeGeometry(rad, len, 48, 1, true), M.spray);
  cone.position.y = len / 2; cone.rotation.x = Math.PI; g.add(cone);
  const pos = [];
  for (let i = 0; i < nDrops; i++) {
    const t = Math.pow(Math.random(), 0.7), a = Math.random() * 6.283, r = rad * t * Math.sqrt(Math.random());
    pos.push(Math.cos(a) * r, t * len, Math.sin(a) * r);
  }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.add(new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xbfe1ff, size: rad * 0.05, transparent: true, opacity: 0.85, depthWrite: false })));
  return g;
}

function eliminatorPack(p, x, y, z, w = 1.2, h = 1.2, n = 9, frame = true) {
  const g = grp(p, x, y, z);
  const depth = 0.32, seg = 4, sl = depth / seg;
  for (let i = 0; i < n; i++) {
    const px = -w / 2 + 0.06 + i * ((w - 0.12) / (n - 1));
    for (let k = 0; k < seg; k++) {
      const ang = (k % 2 ? -1 : 1) * 0.6;
      box(g, 0.006, h, sl / Math.cos(ang) + 0.01, M.white, px + (k % 2 ? 0 : 0.0), h / 2, -depth / 2 + sl * (k + 0.5), 0, ang, 0);
    }
    // little hooks
    box(g, 0.03, h, 0.006, M.white, px + 0.012, h / 2, depth / 2 - 0.01);
  }
  if (frame) {
    box(g, w + 0.06, 0.05, depth + 0.04, M.galv, 0, h + 0.025, 0);
    box(g, w + 0.06, 0.05, depth + 0.04, M.galv, 0, 0.025, 0);
    box(g, 0.05, h, depth + 0.04, M.galv, -w / 2 - 0.005, h / 2, 0);
    box(g, 0.05, h, depth + 0.04, M.galv, w / 2 + 0.005, h / 2, 0);
  }
  return g;
}

function damper(p, x, y, z, w = 1.4, h = 1.1, n = 6, angle = 0.6, louvre = false) {
  const g = grp(p, x, y, z);
  const fd = louvre ? 0.22 : 0.16;
  const fm = louvre ? M.alu : M.galv;
  box(g, w + 0.1, 0.06, fd, fm, 0, h + 0.03, 0);
  box(g, w + 0.1, 0.06, fd, fm, 0, -0.03, 0);
  box(g, 0.06, h + 0.12, fd, fm, -w / 2 - 0.02, h / 2, 0);
  box(g, 0.06, h + 0.12, fd, fm, w / 2 + 0.02, h / 2, 0);
  for (let i = 0; i < n; i++) {
    const by = h * (i + 0.5) / n;
    if (louvre) {
      // chevron-ish weather blade
      box(g, w, 0.008, 0.2, M.alu, 0, by, 0.0, angle, 0, 0);
      box(g, w, 0.03, 0.008, M.alu, 0, by - 0.07, 0.085, 0, 0, 0);
    } else {
      box(g, w - 0.02, 0.01, h / n * 1.05, M.galv, 0, by, 0, angle, 0, 0);
      box(g, w - 0.02, 0.024, 0.024, M.galvDark, 0, by, 0, angle, 0, 0);
      cyl(g, 0.01, 0.01, w + 0.16, M.alu, 0, by, 0, 0, 0, Math.PI / 2, 16);
      // linkage cranks on side
      box(g, 0.012, 0.08, 0.016, M.dark, w / 2 + 0.07, by + 0.025, 0, angle, 0, 0);
    }
  }
  if (!louvre) {
    box(g, 0.012, h * 0.85, 0.02, M.dark, w / 2 + 0.08, h / 2 + 0.04, 0.03);
    // actuator
    const a = grp(g, w / 2 + 0.17, h * 0.55, 0.05);
    rbox(a, 0.12, 0.24, 0.1, 0.015, M.orange, 0, 0, 0);
    box(a, 0.08, 0.06, 0.01, M.dark, 0, 0.05, 0.051);
    cyl(a, 0.015, 0.015, 0.06, M.dark, 0, -0.14, 0, 0, 0, 0, 16);
  } else {
    // bird mesh behind
    const meshTex = canvasTex(256, 256, (c, w2, h2) => { c.clearRect(0, 0, w2, h2); c.strokeStyle = '#2a3038'; c.lineWidth = 3; for (let i = 0; i <= w2; i += 16) { c.beginPath(); c.moveTo(i, 0); c.lineTo(i, h2); c.stroke(); c.beginPath(); c.moveTo(0, i); c.lineTo(w2, i); c.stroke(); } });
    meshTex.wrapS = meshTex.wrapT = THREE.RepeatWrapping; meshTex.repeat.set(6, 5);
    const mm = new THREE.MeshStandardMaterial({ map: meshTex, transparent: true, alphaTest: 0.3, side: THREE.DoubleSide });
    add(g, new THREE.Mesh(new THREE.PlaneGeometry(w, h), mm), 0, h / 2, -fd / 2 + 0.01);
  }
  return g;
}

function drumFilter(p, x, y, z, R = 0.55, L = 1.6, housing = true) {
  const g = grp(p, x, y, z);
  const meshTex = canvasTex(512, 512, (c, w, h) => {
    c.fillStyle = 'rgba(240,244,248,0.55)'; c.fillRect(0, 0, w, h);
    c.strokeStyle = '#7d8790'; c.lineWidth = 2;
    for (let i = 0; i <= w; i += 8) { c.beginPath(); c.moveTo(i, 0); c.lineTo(i, h); c.stroke(); c.beginPath(); c.moveTo(0, i); c.lineTo(w, i); c.stroke(); }
  });
  meshTex.wrapS = meshTex.wrapT = THREE.RepeatWrapping; meshTex.repeat.set(10, 4);
  const mm = new THREE.MeshStandardMaterial({ map: meshTex, transparent: true, side: THREE.DoubleSide, roughness: 0.6, metalness: 0.2, depthWrite: false });
  const drum = add(g, new THREE.Mesh(new THREE.CylinderGeometry(R, R, L, 64, 1, true), mm), 0, R + 0.25, 0, 0, 0, Math.PI / 2);
  drum.castShadow = false;
  for (let k = -2; k <= 2; k++) torus(g, R, 0.018, M.galv, (k / 2) * (L / 2), R + 0.25, 0, 0, Math.PI / 2, 0);
  for (let i = 0; i < 6; i++) { const a = i / 6 * 6.283; box(g, L, 0.02, 0.02, M.galvDark, 0, R + 0.25 + Math.sin(a) * R, Math.cos(a) * R); }
  cyl(g, 0.06, 0.06, L + 0.3, M.dark, 0, R + 0.25, 0, 0, 0, Math.PI / 2, 24);
  // supports
  [-1, 1].forEach(s => { box(g, 0.08, R + 0.3, 0.5, M.blue, s * (L / 2 + 0.12), (R + 0.3) / 2, 0); cyl(g, 0.12, 0.12, 0.1, M.navy, s * (L / 2 + 0.12), R + 0.25, 0, 0, 0, Math.PI / 2); });
  // suction nozzle arm along drum, with outlet pipe
  box(g, L * 0.95, 0.08, 0.1, M.blue, 0, R + 0.25 + R + 0.06, 0.0);
  pipe(g, [[L / 2 + 0.05, 2 * R + 0.31, 0], [L / 2 + 0.35, 2 * R + 0.31, 0], [L / 2 + 0.35, 2 * R + 0.8, 0]], 0.06, M.galv);
  // motor drive
  rbox(g, 0.22, 0.2, 0.2, 0.03, M.blue, -L / 2 - 0.35, 0.35, 0);
  cyl(g, 0.11, 0.11, 0.25, M.navy, -L / 2 - 0.35, 0.35, 0.22, Math.PI / 2, 0, 0);
  if (housing) {
    box(g, L + 1.2, 0.04, 1.6, M.galvDark, 0, 0.02, 0);
    box(g, L + 1.2, 2 * R + 1.2, 0.04, ds(M.galv), 0, (2 * R + 1.2) / 2, -0.8);
  }
  return g;
}

function cyclone(p, x, y, z, R = 0.4) {
  const g = grp(p, x, y, z);
  // legs
  for (let i = 0; i < 4; i++) { const a = i / 4 * 6.283 + 0.78; box(g, 0.05, 2.0, 0.05, M.blue, Math.cos(a) * R * 1.05, 1.0, Math.sin(a) * R * 1.05); }
  cyl(g, R, R, 0.9, M.galv, 0, 2.3, 0);
  cyl(g, R, 0.08, 0.95, M.galv, 0, 1.38, 0);
  cyl(g, R * 1.04, R * 1.04, 0.05, M.galvDark, 0, 2.75, 0);
  cyl(g, 0.14, 0.14, 0.4, M.galv, 0, 2.95, 0);
  box(g, 0.3, 0.25, 0.5, M.galv, R + 0.05, 2.5, 0.15);
  // collection bin
  cyl(g, 0.3, 0.3, 0.6, M.blue, 0, 0.32, 0);
  cyl(g, 0.31, 0.31, 0.04, M.navy, 0, 0.62, 0);
  cyl(g, 0.06, 0.08, 0.3, M.galvDark, 0, 0.8, 0);
  return g;
}

function baler(p, x, y, z) {
  const g = grp(p, x, y, z);
  box(g, 1.0, 0.1, 0.9, M.navy, 0, 0.05, 0);
  // frame posts
  [[-0.45, -0.4], [0.45, -0.4], [-0.45, 0.4], [0.45, 0.4]].forEach(([a, b]) => box(g, 0.08, 1.9, 0.08, M.blue, a, 1.0, b));
  box(g, 1.0, 0.18, 0.9, M.blue, 0, 1.95, 0);
  cyl(g, 0.09, 0.09, 0.7, M.alu, 0, 1.55, 0, 0, 0, 0, 24);
  cyl(g, 0.14, 0.14, 0.5, M.navy, 0, 2.25, 0, 0, 0, 0, 32);
  box(g, 0.82, 0.08, 0.72, M.galvDark, 0, 1.18, 0);
  box(g, 0.8, 0.9, 0.7, M.bale, 0, 0.6, 0);
  [-0.2, 0.2].forEach(s => box(g, 0.02, 0.92, 0.72, M.dark, s, 0.6, 0));
  box(g, 0.02, 0.9, 0.7, ds(M.galv), 0.0, 0.6, 0.0, 0, 0, 0).visible = false;
  return g;
}

function sensorBox(p, x, y, z) {
  const g = grp(p, x, y, z);
  rbox(g, 0.32, 0.42, 0.11, 0.035, M.white, 0, 0, 0);
  for (let i = 0; i < 6; i++) box(g, 0.2, 0.012, 0.01, M.grey, 0, -0.12 + i * 0.03, 0.055);
  box(g, 0.14, 0.05, 0.006, M.screen, 0, 0.12, 0.057);
  cyl(g, 0.007, 0.007, 0.006, M.green, 0.1, 0.12, 0.058, Math.PI / 2, 0, 0, 16);
  cyl(g, 0.035, 0.035, 0.06, M.dark, 0, -0.24, 0, 0, 0, 0, 24);
  pipe(g, [[0, -0.27, 0], [0, -0.45, 0], [0, -0.55, -0.12]], 0.012, M.dark);
  return g;
}

function ductProbe(p, x, y, z) {
  const g = grp(p, x, y, z);
  rbox(g, 0.24, 0.2, 0.11, 0.03, M.white, 0, 0, 0);
  box(g, 0.1, 0.035, 0.006, M.screen, 0, 0.04, 0.056);
  cyl(g, 0.02, 0.02, 0.6, M.alu, 0, -0.4, 0, 0, 0, 0, 32);
  cyl(g, 0.026, 0.026, 0.16, M.grey, 0, -0.75, 0, 0, 0, 0, 32);
  for (let i = 0; i < 5; i++) torus(g, 0.027, 0.003, M.dark, 0, -0.69 - i * 0.03, 0, Math.PI / 2, 0, 0);
  cyl(g, 0.05, 0.05, 0.04, M.dark, 0, -0.12, 0, 0, 0, 0, 24);
  return g;
}

function hmiStand(p, x, y, z, tex) {
  const g = grp(p, x, y, z);
  cyl(g, 0.25, 0.3, 0.06, M.dark, 0, 0.03, 0);
  cyl(g, 0.04, 0.04, 1.1, M.alu, 0, 0.6, 0, 0, 0, 0, 24);
  const scr = grp(g, 0, 1.4, 0); scr.rotation.x = -0.15;
  rbox(scr, 1.0, 0.65, 0.06, 0.02, M.black, 0, 0, 0);
  const sm = new THREE.MeshStandardMaterial({ map: tex, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: 0.9, roughness: 0.25 });
  add(scr, new THREE.Mesh(new THREE.PlaneGeometry(0.92, 0.57), sm), 0, 0, 0.031);
  return g;
}

function chartTex() {
  return canvasTex(1024, 640, (c, w, h) => {
    c.fillStyle = '#0d2238'; c.fillRect(0, 0, w, h);
    c.fillStyle = '#16324f'; c.fillRect(0, 0, w, 70);
    c.fillStyle = '#ffffff'; c.font = 'bold 34px sans-serif'; c.fillText('Temperature & Humidity', 30, 47);
    c.fillStyle = '#2ecc71'; c.beginPath(); c.arc(w - 50, 35, 14, 0, 7); c.fill();
    const plot = (col, base, amp, band) => {
      c.fillStyle = col + '22'; c.fillRect(60, base - band, w - 100, band * 2);
      c.strokeStyle = col; c.lineWidth = 5; c.beginPath();
      for (let x = 60; x < w - 40; x += 6) {
        const t = (x - 60) / (w - 100);
        const settle = Math.exp(-t * 6);
        c.lineTo(x, base + Math.sin(t * 40) * amp * settle * 4 + Math.sin(t * 90) * amp * 0.25);
      }
      c.stroke();
    };
    c.strokeStyle = '#26476b'; c.lineWidth = 1;
    for (let y = 110; y < h - 40; y += 60) { c.beginPath(); c.moveTo(60, y); c.lineTo(w - 40, y); c.stroke(); }
    plot('#4fb3ff', 230, 10, 22);
    plot('#ffb347', 440, 10, 22);
    c.font = 'bold 28px sans-serif'; c.fillStyle = '#4fb3ff'; c.fillText('RH 55%', 70, 190);
    c.fillStyle = '#ffb347'; c.fillText('T 28.5°C', 70, 400);
  });
}

function airWasherPlant(p, x, y, z, opts = {}) {
  const g = grp(p, x, y, z);
  const L = 4.2, W = 1.6, H = 1.9;
  const wall = opts.mat || M.galv;
  // housing
  box(g, L, 0.25, W, M.galvDark, 0, 0.125, 0); // sump
  box(g, L, H, 0.03, wall, 0, 0.25 + H / 2, -W / 2);
  box(g, L, 0.03, W, wall, 0, 0.25 + H, 0);
  box(g, L, H, 0.03, wall, 0, 0.25 + H / 2, W / 2);
  for (let i = 0; i <= 6; i++) box(g, 0.04, H, 0.05, M.galvDark, -L / 2 + i * (L / 6), 0.25 + H / 2, W / 2 + 0.02);
  // access door with window
  box(g, 0.6, 1.2, 0.04, M.blue, -0.5, 0.25 + 0.7, W / 2 + 0.04);
  cyl(g, 0.12, 0.12, 0.02, M.water, -0.5, 0.25 + 1.0, W / 2 + 0.06, Math.PI / 2, 0, 0);
  box(g, 0.04, 0.15, 0.04, M.dark, -0.27, 0.9, W / 2 + 0.08);
  // pump
  cyl(g, 0.15, 0.15, 0.3, M.blue, -1.2, 0.3, W / 2 + 0.35, Math.PI / 2, 0, 0);
  rbox(g, 0.25, 0.25, 0.35, 0.03, M.navy, -1.2, 0.3, W / 2 + 0.65);
  pipe(g, [[-1.2, 0.3, W / 2 + 0.2], [-1.2, 0.3, W / 2 + 0.05]], 0.06, M.pvc);
  pipe(g, [[-1.2, 0.45, W / 2 + 0.35], [-1.2, 1.7, W / 2 + 0.35], [-1.2, 1.7, W / 2 + 0.03]], 0.05, M.pvc);
  // fresh-air louvre at inlet end
  damper(g, -L / 2 - 0.05, 0.4, 0, 1.4, 1.5, 9, 0.75, true).rotation.y = Math.PI / 2;
  // supply fan housing at outlet end + duct up
  const f = grp(g, L / 2 + 0.45, 1.15, 0); f.rotation.y = Math.PI / 2;
  axialFan(f, 0.65, 0.8);
  box(g, 0.1, 1.4, 1.4, M.galv, L / 2 + 0.03, 1.15, 0);
  duct(g, [[L / 2 + 0.95, 1.15, 0], [L / 2 + 1.4, 1.15, 0], [L / 2 + 1.4, 3.3, 0]], 1.0, 1.0, M.galv);
  return g;
}

// ---------- scenes ----------
export const scenes = {
  'electric-panels': (s) => {
    cabinet(s, -0.82, 0.8, 2.0, 0.6, { lights: true });
    cabinet(s, 0, 0.8, 2.0, 0.6, { hmi: true, lights: true });
    cabinet(s, 0.82, 0.8, 2.0, 0.6, {});
    return { dir: [0.75, 0.38, 1.4] };
  },
  'inverters': (s) => {
    const g = grp(s, 0, 0, 0);
    box(g, 1.6, 1.3, 0.03, M.plate, 0, 0.65, 0);
    cableDuct(g, 0, 1.22, 0.05, 1.5);
    cableDuct(g, 0, 0.62, 0.05, 1.5);
    cableDuct(g, 0, 0.08, 0.05, 1.5);
    vfd(g, -0.5, 0.92, 0.13, 0.32, 0.5);
    vfd(g, -0.08, 0.92, 0.13, 0.28, 0.44);
    vfd(g, 0.28, 0.92, 0.13, 0.24, 0.38);
    plcRail(g, 0.05, 0.35, 0.07, 18);
    g.rotation.x = -Math.PI / 2 * 0.0;
    return { dir: [0.45, 0.25, 1.4], floor: false };
  },
  'components': (s) => {
    const g = grp(s, 0, 0, 0);
    box(g, 1.3, 0.9, 0.03, M.plate, 0, 0.45, 0);
    cableDuct(g, 0, 0.84, 0.05, 1.2);
    cableDuct(g, 0, 0.06, 0.05, 1.2);
    [0.6, 0.3].forEach(ry => box(g, 1.1, 0.035, 0.012, M.alu, 0, ry, 0.02));
    let x = -0.5; [3, 3, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1].forEach(pn => { mcb(g, x + 0.009 * pn, 0.6, 0.06, pn); x += 0.018 * pn + 0.004; });
    for (let i = 0; i < 6; i++) contactor(g, -0.42 + i * 0.07, 0.3, 0.07);
    for (let i = 0; i < 16; i++) { box(g, 0.012, 0.06, 0.05, i % 4 === 3 ? M.blue : M.grey, 0.05 + i * 0.014, 0.3, 0.045); box(g, 0.008, 0.008, 0.01, M.orange, 0.05 + i * 0.014, 0.32, 0.073); }
    return { dir: [0.35, 0.25, 1.4], floor: false, margin: 0.85 };
  },
  'sensors': (s) => {
    box(s, 1.4, 1.2, 0.04, M.ral7035, 0, 0.6, -0.08);
    sensorBox(s, -0.3, 0.75, 0);
    ductProbe(s, 0.3, 1.0, 0);
    return { dir: [0.5, 0.2, 1.4], floor: false, margin: 0.9 };
  },
  'showering-area': (s) => {
    const L = 2.6, W = 1.8, H = 1.8;
    box(s, L, 0.2, W, M.galvDark, 0, 0.1, 0);
    box(s, L - 0.08, 0.02, W - 0.08, M.water, 0, 0.19, 0);
    box(s, L, H, 0.03, M.galv, 0, 0.2 + H / 2, -W / 2);
    box(s, 0.03, H, W, M.galv, -L / 2, 0.2 + H / 2, 0);
    for (let i = 0; i <= 5; i++) box(s, 0.04, H, 0.04, M.galvDark, -L / 2 + i * (L / 5), 0.2 + H / 2, -W / 2 + 0.03);
    // two banks of vertical risers with nozzles spraying along +x
    [-0.6, 0.4].forEach((bx, bi) => {
      pipe(s, [[bx, 0.25, -W / 2 + 0.1], [bx, 0.25, W / 2 - 0.1]], 0.045, M.pvc);
      for (let k = 0; k < 4; k++) {
        const zz = -W / 2 + 0.3 + k * ((W - 0.6) / 3);
        pipe(s, [[bx, 0.25, zz], [bx, 1.8, zz]], 0.025, M.pvc);
        for (let j = 0; j < 4; j++) {
          const yy = 0.5 + j * 0.38;
          const n = nozzle(s, bx + 0.02, yy, zz, 0.8, M.white); n.rotation.z = -Math.PI / 2 * (bi ? -1 : 1);
          sprayCone(s, bx + (bi ? -0.06 : 0.06), yy, zz, 0.45, 0.17, 0, (bi ? 1 : -1) * Math.PI / 2, 90);
        }
      }
    });
    eliminatorPack(s, L / 2 - 0.2, 0.2, 0, 1.6, 1.6, 9, true).rotation.y = Math.PI / 2;
    return { dir: [0.9, 0.75, 1.3], margin: 0.85 };
  },
  'spray-nozzle': (s) => {
    pipe(s, [[-0.6, 0.3, 0], [0.6, 0.3, 0]], 0.07, M.pvc);
    const n = nozzle(s, 0, 0.37, 0, 2.2, M.white); n.rotation.set(0, 0, 0);
    cyl(s, 0.075, 0.075, 0.06, M.white, 0, 0.36, 0);
    sprayCone(s, 0, 0.55, 0, 0.75, 0.45, 0, 0, 900);
    box(s, 0.03, 0.2, 0.08, M.dark, -0.45, 0.15, 0);
    box(s, 0.03, 0.2, 0.08, M.dark, 0.45, 0.15, 0);
    return { dir: [0.6, 0.35, 1.4], margin: 0.85 };
  },
  'eliminator-plates': (s) => {
    eliminatorPack(s, 0, 0, 0, 1.4, 1.4, 11, true);
    return { dir: [0.95, 0.55, 1.1], margin: 0.9 };
  },
  'supply-return-fan': (s) => {
    const g = grp(s, 0, 0.85, 0, -0.5);
    axialFan(g, 0.7, 0.9, { blades: 7 });
    // saddle supports
    [-0.25, 0.25].forEach(zz => { box(g, 1.3, 0.08, 0.1, M.blue, 0, -0.78, zz); box(g, 0.1, 0.12, 0.1, M.blue, -0.5, -0.68, zz); box(g, 0.1, 0.12, 0.1, M.blue, 0.5, -0.68, zz); });
    return { dir: [0.35, 0.3, 1.4] };
  },
  'return-air-fan': (s) => {
    box(s, 3.0, 1.7, 0.06, M.galv, 0, 0.95, -0.1);
    for (let i = 0; i <= 4; i++) box(s, 0.05, 1.7, 0.1, M.galvDark, -1.5 + i * 0.75, 0.95, -0.06);
    [-0.75, 0.75].forEach(x => { const g = grp(s, x, 0.95, 0.3); axialFan(g, 0.55, 0.7, { bell: true, blades: 6 }); });
    box(s, 3.0, 0.1, 1.2, M.galvDark, 0, 0.05, 0.2);
    return { dir: [0.5, 0.3, 1.4], margin: 0.9 };
  },
  'dampers': (s) => {
    damper(s, 0, 0.1, 0, 1.4, 1.1, 6, 0.65, false);
    return { dir: [0.95, 0.35, 1.25], margin: 0.92 };
  },
  'weather-louvre': (s) => {
    box(s, 2.4, 1.9, 0.08, M.ral7035, 0, 0.95, -0.2);
    damper(s, 0, 0.25, 0, 1.6, 1.4, 9, 0.75, true);
    return { dir: [0.75, 0.15, 1.4], floor: false, margin: 0.9 };
  },
  'rotary-filter': (s) => {
    drumFilter(s, 0, 0, 0, 0.6, 1.8, true);
    return { dir: [0.75, 0.45, 1.4], margin: 0.88 };
  },
  'dust-collection': (s) => {
    cyclone(s, -0.6, 0, 0, 0.42);
    baler(s, 0.9, 0, 0.1);
    pipe(s, [[-0.6, 3.15, 0], [-0.6, 3.35, 0], [0.9, 3.35, 0], [0.9, 2.35, 0.1]], 0.1, M.galv);
    pipe(s, [[-0.18, 2.5, 0.15], [-0.05, 2.5, 0.15], [-0.05, 2.5, 1.0]], 0.12, M.galv);
    return { dir: [0.65, 0.35, 1.4], margin: 0.92 };
  },

  // ---------- services ----------
  'svc-design': (s) => {
    const tex = canvasTex(1024, 1024, (c, w, h) => {
      c.fillStyle = '#1f5f9e'; c.fillRect(0, 0, w, h);
      c.strokeStyle = 'rgba(255,255,255,0.12)'; c.lineWidth = 1;
      for (let i = 0; i <= w; i += 32) { c.beginPath(); c.moveTo(i, 0); c.lineTo(i, h); c.stroke(); c.beginPath(); c.moveTo(0, i); c.lineTo(w, i); c.stroke(); }
      c.strokeStyle = 'rgba(255,255,255,0.3)'; c.lineWidth = 2;
      for (let i = 0; i <= w; i += 128) { c.beginPath(); c.moveTo(i, 0); c.lineTo(i, h); c.stroke(); c.beginPath(); c.moveTo(0, i); c.lineTo(w, i); c.stroke(); }
    });
    add(s, new THREE.Mesh(new THREE.PlaneGeometry(9, 9), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.8 })), 0.4, 0.001, 0, -Math.PI / 2);
    const tmp = new THREE.Group(); airWasherPlant(tmp, 0, 0, 0);
    tmp.updateMatrixWorld(true);
    const lm = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95 });
    tmp.traverse(o => { if (o.isMesh) { const e = new THREE.LineSegments(new THREE.EdgesGeometry(o.geometry, 25), lm); o.matrixWorld.decompose(e.position, e.quaternion, e.scale); s.add(e); } });
    return { dir: [0.8, 1.0, 1.2], floor: false, margin: 0.5, bg: ['#2a6fb0', '#174a7c'] };
  },
  'svc-installation': (s) => {
    airWasherPlant(s, 0, 0, 0);
    // scaffold
    const sc = grp(s, -0.3, 0, 1.35);
    for (let i = 0; i < 3; i++) for (let k = 0; k < 2; k++) cyl(sc, 0.025, 0.025, 2.6, M.amber.clone(), -1.2 + i * 1.2, 1.3, k * 0.6, 0, 0, 0, 12);
    sc.children.forEach(c => { c.material = new THREE.MeshStandardMaterial({ color: 0xf2b134, roughness: 0.5 }); });
    for (let j = 0; j < 3; j++) for (let k = 0; k < 2; k++) cyl(sc, 0.02, 0.02, 2.4, M.galv, 0, 0.6 + j * 0.9, k * 0.6, 0, 0, Math.PI / 2, 12);
    box(sc, 2.4, 0.04, 0.6, new THREE.MeshStandardMaterial({ color: 0x9c7a4f, roughness: 0.9 }), 0, 1.5, 0.3);
    return { dir: [0.9, 0.6, 1.3], margin: 0.9 };
  },
  'svc-commissioning': (s) => {
    hmiStand(s, -0.15, 0, 0.2, chartTex());
    cabinet(s, 1.05, 0.8, 2.0, 0.6, { lights: true });
    return { dir: [0.35, 0.3, 1.4], margin: 0.9 };
  },
  'svc-control': (s) => {
    const g = cabinet(s, 0, 1.2, 2.0, 0.55, {});
    // open door: hide closed door parts and show internals
    g.children.slice(1).forEach(c => (c.visible = false));
    box(g, 1.2, 2.0, 0.03, M.ral7035, 0, 1.1, -0.26);
    box(g, 0.03, 2.0, 0.55, M.ral7035, -0.585, 1.1, 0);
    box(g, 0.03, 2.0, 0.55, M.ral7035, 0.585, 1.1, 0);
    box(g, 1.2, 0.03, 0.55, M.ral7035, 0, 2.085, 0);
    box(g, 1.2, 0.03, 0.55, M.ral7035, 0, 0.115, 0);
    box(g, 1.1, 1.85, 0.02, M.plate, 0, 1.1, -0.2);
    cableDuct(g, 0, 1.8, -0.16, 1.0);
    cableDuct(g, 0, 1.1, -0.16, 1.0);
    cableDuct(g, 0, 0.35, -0.16, 1.0);
    vfd(g, -0.3, 1.45, -0.07, 0.28, 0.45);
    vfd(g, 0.05, 1.45, -0.07, 0.24, 0.4);
    vfd(g, 0.35, 1.45, -0.07, 0.22, 0.36);
    plcRail(g, 0.05, 0.75, -0.15, 16);
    // door swung open
    const hinge = grp(g, -0.6, 0, 0.28, -1.9);
    box(hinge, 1.2, 1.96, 0.03, M.ral7035, 0.6, 1.1, 0);
    box(hinge, 0.6, 0.35, 0.03, M.black, 0.6, 1.5, -0.03);
    return { dir: [0.55, 0.3, 1.4], margin: 0.92 };
  },
  'svc-dust': (s) => {
    drumFilter(s, -0.6, 0, 0, 0.5, 1.4, false);
    cyclone(s, 1.7, 0, 0, 0.36);
    duct(s, [[-2.4, 1.0, 0], [-1.65, 1.0, 0]], 0.7, 0.9, M.galv);
    pipe(s, [[0.45, 1.81, 0], [1.0, 1.81, 0], [1.0, 2.45, 0], [1.4, 2.45, 0.15]], 0.07, M.galv);
    return { dir: [0.7, 0.5, 1.4], margin: 0.92 };
  },
  'svc-upgrade': (s) => {
    const base = box(s, 2.4, 0.12, 1.2, M.navy, 0, 0.06, 0);
    const h1 = 153.5 / 60, h2 = 61.43 / 60;
    box(s, 0.6, h1, 0.6, M.grey, -0.55, 0.12 + h1 / 2, 0);
    box(s, 0.6, h2, 0.6, M.blue, 0.55, 0.12 + h2 / 2, 0);
    const label = (txt, col, x, y, sz = 0.9, w = 512) => {
      const t = canvasTex(w, 160, (c, W, H) => { c.clearRect(0, 0, W, H); c.fillStyle = col; c.font = 'bold 110px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt, W / 2, H / 2); });
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true })); sp.scale.set(sz, sz * 160 / w, 1); sp.position.set(x, y, 0.35); s.add(sp);
    };
    label('Before', '#5d6b7c', -0.55, 0.12 + h1 + 0.2, 0.7);
    label('AirKing', '#255b91', 0.55, 0.12 + h2 + 0.2, 0.7);
    label('-60%', '#1f8a4c', 0.75, 2.35, 1.2);
    // arrow
    const arrowShape = new THREE.Shape();
    arrowShape.moveTo(-0.07, 0.4); arrowShape.lineTo(0.07, 0.4); arrowShape.lineTo(0.07, 0); arrowShape.lineTo(0.18, 0); arrowShape.lineTo(0, -0.25); arrowShape.lineTo(-0.18, 0); arrowShape.lineTo(-0.07, 0); arrowShape.closePath();
    const ar = add(s, new THREE.Mesh(new THREE.ExtrudeGeometry(arrowShape, { depth: 0.08, bevelEnabled: true, bevelSize: 0.01, bevelThickness: 0.01 }), new THREE.MeshStandardMaterial({ color: 0x2ecc71, roughness: 0.4 })), 0.05, 1.75, 0.2);
    ar.rotation.z = 0.5;
    return { dir: [0.35, 0.3, 1.4], margin: 0.85 };
  },
};

// ---------- render ----------
export function render(name, W = 960, H = 720) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  renderer.setSize(W, H); renderer.setPixelRatio(1);
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.75;

  const model = new THREE.Group(); scene.add(model);
  const cfg = Object.assign({ dir: [1, 0.6, 1.3], floor: true, margin: 1.0, bg: ['#f5f9fd', '#cfe0f1'] }, scenes[name](model) || {});
  scene.background = canvasTex(16, 512, (c, w, h) => { const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, cfg.bg[0]); gr.addColorStop(1, cfg.bg[1]); c.fillStyle = gr; c.fillRect(0, 0, w, h); });

  const bb = new THREE.Box3().setFromObject(model);
  const sph = bb.getBoundingSphere(new THREE.Sphere());
  const R = sph.radius;

  scene.add(new THREE.HemisphereLight(0xffffff, 0x9fb4c8, 0.6));
  const key = new THREE.DirectionalLight(0xffffff, 2.4);
  key.position.copy(sph.center).add(new THREE.Vector3(R * 1.2, R * 2.2, R * 1.6));
  key.target.position.copy(sph.center); scene.add(key.target);
  key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -R * 1.6, right: R * 1.6, top: R * 1.6, bottom: -R * 1.6, near: 0.1, far: R * 8 });
  key.shadow.bias = -0.0004; key.shadow.normalBias = 0.02; key.shadow.radius = 4;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xcfe3ff, 0.8); rim.position.copy(sph.center).add(new THREE.Vector3(-R * 2, R, -R * 2)); scene.add(rim);

  if (cfg.floor) {
    const fl = new THREE.Mesh(new THREE.PlaneGeometry(R * 20, R * 20), new THREE.ShadowMaterial({ opacity: 0.2 }));
    fl.rotation.x = -Math.PI / 2; fl.position.y = bb.min.y; fl.receiveShadow = true; scene.add(fl);
  }

  const cam = new THREE.PerspectiveCamera(30, W / H, R * 0.05, R * 20);
  const dir = new THREE.Vector3(...cfg.dir).normalize();
  const dist = (R * cfg.margin) / Math.sin(THREE.MathUtils.degToRad(cam.fov / 2));
  cam.position.copy(sph.center).addScaledVector(dir, dist);
  cam.lookAt(sph.center);

  renderer.render(scene, cam);
  return renderer.domElement.toDataURL('image/jpeg', 0.86);
}
