// 3D hero: an AirKing axial fan with an airflow particle stream.
// Source file — bundled into js/hero.js (see README "Building the 3D hero").
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const canvas = document.getElementById('heroCanvas');
const hero = document.getElementById('home');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
} catch (e) {
  hero.classList.add('no-webgl');
}

if (renderer) init();

function init() {
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.9;

  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 10);

  // ---------- lights ----------
  scene.add(new THREE.HemisphereLight(0xbfdcff, 0x0f2742, 0.6));
  const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(4, 5, 6); scene.add(key);
  const rim = new THREE.DirectionalLight(0x6fb6ff, 2.5); rim.position.set(-6, 2, -4); scene.add(rim);
  const core = new THREE.PointLight(0x5ec8ff, 6, 6, 1.5); core.position.set(0, 0, 0.6);

  // ---------- materials ----------
  const chrome = new THREE.MeshPhysicalMaterial({ color: 0xdfe7ef, metalness: 1, roughness: 0.18, side: THREE.DoubleSide });
  const steel = new THREE.MeshPhysicalMaterial({ color: 0x93a1b0, metalness: 1, roughness: 0.32 });
  const bladeMat = new THREE.MeshPhysicalMaterial({ color: 0x3d7ab8, metalness: 0.35, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.08 });
  const navy = new THREE.MeshPhysicalMaterial({ color: 0x163a63, metalness: 0.5, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.1 });

  // ---------- fan model (axis along +z, facing the viewer) ----------
  const R = 1.6, L = 1.2;
  const rig = new THREE.Group();          // positioned/scaled for layout
  const fan = new THREE.Group();          // tilted by pointer / drag
  rig.add(fan); scene.add(rig);
  fan.add(core);

  const shroud = new THREE.Mesh(new THREE.CylinderGeometry(R, R, L, 128, 1, true), chrome);
  shroud.rotation.x = Math.PI / 2; fan.add(shroud);
  const bellPts = [];
  for (let i = 0; i <= 24; i++) { const t = i / 24; bellPts.push(new THREE.Vector2(R + 0.42 * t * t, t * 0.42)); }
  const bell = new THREE.Mesh(new THREE.LatheGeometry(bellPts, 128), chrome);
  bell.rotation.x = Math.PI / 2; bell.position.z = L / 2; fan.add(bell);
  const ringGeo = new THREE.TorusGeometry(R + 0.03, 0.05, 16, 128);
  const backRing = new THREE.Mesh(ringGeo, steel); backRing.position.z = -L / 2; fan.add(backRing);
  const frontRing = new THREE.Mesh(new THREE.TorusGeometry(R + 0.42, 0.05, 16, 128), steel); frontRing.position.z = L / 2 + 0.42; fan.add(frontRing);

  // guard grille
  const wire = new THREE.MeshStandardMaterial({ color: 0x9fb0c2, metalness: 1, roughness: 0.3 });
  for (let i = 1; i <= 5; i++) {
    const g = new THREE.Mesh(new THREE.TorusGeometry(R * i / 5.2, 0.012, 8, 96), wire);
    g.position.z = L / 2 + 0.06; fan.add(g);
  }
  for (let i = 0; i < 16; i++) {
    const s = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, R * 0.98, 6), wire);
    const a = i / 16 * Math.PI * 2;
    s.position.set(Math.cos(a) * R * 0.49, Math.sin(a) * R * 0.49, L / 2 + 0.06);
    s.rotation.z = a - Math.PI / 2; fan.add(s);
  }

  // rotor
  const rotor = new THREE.Group(); rotor.position.z = 0.12; fan.add(rotor);
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.42, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2), navy);
  nose.rotation.x = Math.PI / 2; nose.position.z = 0.12; rotor.add(nose);
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.3, 48), navy);
  hub.rotation.x = Math.PI / 2; hub.position.z = -0.03; rotor.add(hub);
  const blade = makeBladeGeometry(0.36, R * 0.94, 0.95);
  const N = 7;
  for (let i = 0; i < N; i++) {
    const holder = new THREE.Group(); holder.rotation.z = i / N * Math.PI * 2;
    const b = new THREE.Mesh(blade, bladeMat); b.rotation.x = 0.6; holder.add(b); rotor.add(holder);
  }

  // motor + struts behind the rotor
  const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.9, 48), navy);
  motor.rotation.x = Math.PI / 2; motor.position.z = -0.45; fan.add(motor);
  for (let i = 0; i < 18; i++) {
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.1, 0.8), steel);
    const a = i / 18 * Math.PI * 2;
    fin.position.set(Math.cos(a) * 0.52, Math.sin(a) * 0.52, -0.45); fin.rotation.z = a + Math.PI / 2; fan.add(fin);
  }
  for (let i = 0; i < 4; i++) {
    const st = new THREE.Mesh(new THREE.BoxGeometry(0.06, R - 0.5, 0.1), steel);
    const a = i / 4 * Math.PI * 2 + Math.PI / 4;
    st.position.set(Math.cos(a) * (R + 0.5) / 2, Math.sin(a) * (R + 0.5) / 2, -0.45); st.rotation.z = a - Math.PI / 2; fan.add(st);
  }

  // soft halo behind the fan
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({
    map: radialTexture('rgba(94,200,255,0.55)', 'rgba(61,122,184,0)'), transparent: true,
    depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  halo.scale.set(7.5, 7.5, 1); halo.position.z = -1.2; fan.add(halo);

  // ---------- airflow particles (in fan space, flowing along +z) ----------
  const COUNT = window.innerWidth < 760 ? 900 : 1800;
  const pos = new Float32Array(COUNT * 3), alpha = new Float32Array(COUNT), seeds = [];
  for (let i = 0; i < COUNT; i++) seeds.push({ r: Math.sqrt(Math.random()) * R * 0.95, a: Math.random() * Math.PI * 2, z: -7 + Math.random() * 13, v: 0.6 + Math.random() * 0.8 });
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  pGeo.setAttribute('aAlpha', new THREE.BufferAttribute(alpha, 1));
  const pMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uSize: { value: 70 * renderer.getPixelRatio() }, uColor: { value: new THREE.Color(0x8fd8ff) } },
    vertexShader: `attribute float aAlpha; varying float vA; uniform float uSize;
      void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); vA = aAlpha; gl_PointSize = uSize / -mv.z; gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `varying float vA; uniform vec3 uColor;
      void main(){ float d = length(gl_PointCoord - 0.5); float a = smoothstep(0.5, 0.0, d); gl_FragColor = vec4(mix(uColor, vec3(1.0), a*0.6), a * vA); }`,
  });
  fan.add(new THREE.Points(pGeo, pMat));

  // ---------- layout ----------
  function layout() {
    const w = hero.clientWidth, h = hero.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    const visH = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
    const visW = visH * camera.aspect;
    if (w >= 900) {
      rig.position.set(visW * 0.26, -visH * 0.02, 0);
      rig.scale.setScalar(Math.min(visH * 0.135, visW * 0.085));
    } else {
      rig.position.set(0, visH * 0.26, 0);
      rig.scale.setScalar(Math.min(visW * 0.16, visH * 0.1));
    }
    base.ry = w >= 900 ? -0.5 : -0.3;
  }

  // ---------- interaction ----------
  const base = { ry: -0.5, rx: 0.12 };
  const pointer = { x: 0, y: 0 };
  const drag = { active: false, lastX: 0, lastY: 0, vy: 0, vx: 0, offY: 0, offX: 0 };
  let boost = 0;         // extra blade speed from clicks / hovering the fan
  let spin = reduceMotion ? 0.6 : 3.2;

  hero.addEventListener('pointermove', e => {
    const r = hero.getBoundingClientRect();
    pointer.x = (e.clientX - r.left) / r.width * 2 - 1;
    pointer.y = (e.clientY - r.top) / r.height * 2 - 1;
    if (drag.active) {
      drag.vy = (e.clientX - drag.lastX) * 0.008; drag.vx = (e.clientY - drag.lastY) * 0.006;
      drag.offY += drag.vy; drag.offX += drag.vx;
      drag.lastX = e.clientX; drag.lastY = e.clientY;
    }
  });
  canvas.addEventListener('pointerdown', e => {
    drag.active = true; drag.lastX = e.clientX; drag.lastY = e.clientY; drag.moved = false;
    canvas.setPointerCapture(e.pointerId); hero.classList.add('dragging');
  });
  const endDrag = () => { drag.active = false; hero.classList.remove('dragging'); };
  canvas.addEventListener('pointerup', e => {
    if (Math.abs(drag.vy) + Math.abs(drag.vx) < 0.01) boost = Math.min(boost + 6, 14); // click = speed burst
    endDrag();
  });
  canvas.addEventListener('pointercancel', endDrag);

  // ---------- loop ----------
  const clock = new THREE.Clock();
  let running = true, t = 0, intro = 0;
  new IntersectionObserver(([e]) => { running = e.isIntersecting; if (running) clock.getDelta(); }).observe(hero);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) clock.getDelta(); });

  function frame() {
    requestAnimationFrame(frame);
    if (!running || document.hidden) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    t += dt; intro = Math.min(intro + dt / 2.2, 1);
    const ease = 1 - Math.pow(1 - intro, 3);

    // drag momentum decays and springs back
    if (!drag.active) { drag.offY += drag.vy; drag.offX += drag.vx; drag.vy *= 0.92; drag.vx *= 0.92; drag.offY *= 0.96; drag.offX *= 0.96; }
    boost *= 0.97;

    const scrollK = Math.min(window.scrollY / hero.clientHeight, 1);
    const targetRY = base.ry + pointer.x * 0.28 + drag.offY;
    const targetRX = base.rx + pointer.y * 0.18 + drag.offX + scrollK * 0.5;
    fan.rotation.y += (targetRY - fan.rotation.y) * 0.08;
    fan.rotation.x += (targetRX - fan.rotation.x) * 0.08;
    fan.position.y = Math.sin(t * 0.9) * 0.06 - scrollK * 0.6;
    fan.scale.setScalar(0.82 + 0.18 * ease);

    const speed = (spin + boost) * ease;
    rotor.rotation.z -= speed * dt;
    core.intensity = 4 + boost * 0.6 + Math.sin(t * 2) * 0.6;
    halo.material.opacity = 0.75 + boost * 0.02;

    // advance particles: converge into the inlet, swirl through the rotor, spread out of the outlet
    const flow = (0.8 + speed * 0.35) * dt;
    for (let i = 0; i < COUNT; i++) {
      const s = seeds[i];
      s.z += s.v * flow * 1.6;
      if (s.z > 6) { s.z = -7; s.a = Math.random() * Math.PI * 2; }
      const inside = s.z > -L / 2 && s.z < L / 2 + 0.4;
      s.a += (inside ? speed * 0.9 : s.z > 0 ? speed * 0.12 : 0.02) * dt;
      const spread = s.z < -L / 2 ? 1 + Math.pow((-L / 2 - s.z) / 6, 1.2) * 1.4 : s.z > L / 2 ? 1 + (s.z - L / 2) * 0.12 : 1;
      const rr = s.r * spread;
      pos[i * 3] = Math.cos(s.a) * rr; pos[i * 3 + 1] = Math.sin(s.a) * rr; pos[i * 3 + 2] = s.z;
      const fadeIn = THREE.MathUtils.smoothstep(s.z, -7, -4.5), fadeOut = 1 - THREE.MathUtils.smoothstep(s.z, 3, 6);
      alpha[i] = fadeIn * fadeOut * (inside ? 0.9 : 0.55) * ease;
    }
    pGeo.attributes.position.needsUpdate = true; pGeo.attributes.aAlpha.needsUpdate = true;

    renderer.render(scene, camera);
  }

  layout();
  window.addEventListener('resize', layout);
  hero.classList.add('webgl-ready');
  frame();
}

function makeBladeGeometry(r0, r1, chord) {
  const s = new THREE.Shape();
  s.moveTo(r0, -chord * 0.3);
  s.bezierCurveTo(r0 + (r1 - r0) * 0.35, -chord * 0.62, r1 - 0.15, -chord * 0.55, r1, -chord * 0.28);
  s.quadraticCurveTo(r1 + 0.1, chord * 0.1, r1 - 0.05, chord * 0.42);
  s.bezierCurveTo(r1 - (r1 - r0) * 0.3, chord * 0.5, r0 + 0.1, chord * 0.42, r0, chord * 0.3);
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.03, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015, bevelSegments: 3, curveSegments: 24 });
  g.translate(0, 0, -0.015);
  return g;
}

function radialTexture(inner, outer) {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const x = c.getContext('2d'), g = x.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, inner); g.addColorStop(1, outer); x.fillStyle = g; x.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
