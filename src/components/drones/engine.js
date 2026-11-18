import * as THREE from 'three';
import { gsap } from '@/lib/gsap';

/*
 * DroneEngine — renders N drones flying between formations.
 *
 * Everything is in CSS-pixel space: the camera sits so that 1 world unit = 1
 * px on the z = 0 plane, so a drone placed at (x, y) in a design lands on
 * that exact screen pixel (and DOM hit-areas line up with what is drawn).
 *
 * A formation is supplied on demand by `provider(index)` →
 *   { pos: Float32Array(3N), col: (3N), size: (N), delay: (N), spin: (N), pivot: [x,y,z] }
 */

const VERT = /* glsl */ `
  uniform float uMix;
  uniform float uTime;
  uniform float uAngle;
  uniform float uPixelRatio;
  uniform float uCamZ;
  uniform vec2  uView;
  uniform vec2  uMouse;
  uniform float uRepel;
  uniform vec4  uHover;
  uniform vec3  uPivotFrom;
  uniform vec3  uPivotTo;
  uniform float uEnergy;

  attribute vec3 aFrom;
  attribute vec3 aTo;
  attribute vec3 aColFrom;
  attribute vec3 aColTo;
  attribute vec2 aSize;
  attribute vec2 aSpin;
  attribute float aDelay;
  attribute float aRand;

  varying vec3 vColor;
  varying float vAlpha;

  vec3 rotY(vec3 p, float a) {
    float c = cos(a), s = sin(a);
    return vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z);
  }
  float smoother(float k) { return k * k * k * (k * (k * 6.0 - 15.0) + 10.0); }

  void main() {
    float r = aRand;
    // Choreography: each drone departs at its element's cue (+ a little jitter)
    // and flies for 45% of the transition.
    float start = aDelay * 0.4 + r * 0.15;
    float k = smoother(clamp((uMix - start) / 0.45, 0.0, 1.0));

    vec3 a = aSpin.x > 0.5 ? rotY(aFrom - uPivotFrom, uAngle) + uPivotFrom : aFrom;
    vec3 b = aSpin.y > 0.5 ? rotY(aTo - uPivotTo, uAngle) + uPivotTo : aTo;
    vec3 p = mix(a, b, k);

    // Flight arc toward the camera, scaled by how far the drone travels, so
    // drones that keep their place stay perfectly still.
    float travel = clamp(distance(a, b) / 120.0, 0.0, 1.0);
    float arc = sin(3.14159 * k) * travel;
    vec3 dir = normalize(vec3(sin(r * 91.7), cos(r * 47.3), sin(r * 13.1 + 1.0)) + 0.0001);
    p += dir * arc * (50.0 + uEnergy * 90.0);
    p.z += arc * (140.0 + r * 260.0);

    // Hover-in-place shimmer (sub-pixel for crisp type).
    p.xy += 0.12 * vec2(sin(uTime * 1.3 + r * 50.0), cos(uTime * 1.1 + r * 40.0));

    // Hovered button: its drones lift toward you.
    float inH = step(uHover.x, p.x) * step(p.x, uHover.z) * step(uHover.y, p.y) * step(p.y, uHover.w);
    p.z += inH * 26.0;

    // Cursor ripple.
    vec2 d = p.xy - uMouse;
    float f = smoothstep(95.0, 0.0, length(d)) * uRepel;
    p.xy += normalize(d + 0.0001) * f * 16.0;
    p.z += f * 60.0;

    vec3 world = vec3(p.x - uView.x * 0.5, uView.y * 0.5 - p.y, p.z);
    vec4 mv = modelViewMatrix * vec4(world, 1.0);
    gl_Position = projectionMatrix * mv;

    float size = mix(aSize.x, aSize.y, k) * (1.0 + arc * 0.8) * (1.0 + inH * 0.2 + f * 0.4);
    gl_PointSize = size * uPixelRatio * uCamZ / -mv.z;

    vColor = mix(aColFrom, aColTo, k) * (1.0 + inH * 0.55 + f * 0.5) + arc * 0.12;
    vAlpha = 1.0;
  }
`;

const FRAG = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.34, d);
    gl_FragColor = vec4(vColor, a * vAlpha);
  }
`;

export class DroneEngine {
  constructor(mount, { N, reduce, instant = false, provider, sky, onSettle }) {
    this.instant = instant; // jump straight to formations (automated visual checks)
    this.N = N;
    this.reduce = reduce;
    this.provider = provider;
    this.sky = sky;
    this.onSettle = onSettle;
    this.target = 0;
    this.shown = 0;
    this.available = 0; // formations ready
    this.intro = { v: reduce || instant ? 1 : 0 };
    this.seg = null;
    this.settled = null;
    this.cache = new Map();

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(dpr);
    this.renderer.setClearColor(0x000000, 0);
    mount.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, 1, 1, 20000);
    this.group = new THREE.Group();
    this.scene.add(this.group);

    const geo = new THREE.BufferGeometry();
    const attr = (n) => new THREE.BufferAttribute(new Float32Array(N * n), n).setUsage(THREE.DynamicDrawUsage);
    this.a = {
      aFrom: attr(3),
      aTo: attr(3),
      aColFrom: attr(3),
      aColTo: attr(3),
      aSize: attr(2),
      aSpin: attr(2),
      aDelay: attr(1),
    };
    Object.entries(this.a).forEach(([k, v]) => geo.setAttribute(k, v));
    geo.setAttribute('position', this.a.aTo);
    const rand = new Float32Array(N);
    for (let i = 0; i < N; i++) rand[i] = Math.random();
    geo.setAttribute('aRand', new THREE.BufferAttribute(rand, 1));
    this.geo = geo;

    this.u = {
      uMix: { value: 0 },
      uTime: { value: 0 },
      uAngle: { value: 0 },
      uPixelRatio: { value: dpr },
      uCamZ: { value: 1 },
      uView: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(-9999, -9999) },
      uRepel: { value: 1 },
      uHover: { value: new THREE.Vector4(1, 1, 0, 0) },
      uPivotFrom: { value: new THREE.Vector3() },
      uPivotTo: { value: new THREE.Vector3() },
      uEnergy: { value: 0 },
    };
    this.mat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms: this.u,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });
    const pts = new THREE.Points(geo, this.mat);
    pts.frustumCulled = false;
    this.group.add(pts);

    this.mouse = { x: 0, y: 0, tx: 0, ty: 0, px: -9999, py: -9999 };
    this.onMove = (e) => {
      this.mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
      this.mouse.px = e.clientX;
      this.mouse.py = e.clientY;
    };
    this.onLeave = () => {
      this.mouse.px = -9999;
      this.mouse.py = -9999;
    };
    window.addEventListener('pointermove', this.onMove);
    document.addEventListener('mouseleave', this.onLeave);

    this.resize();
    this.tick = this.tick.bind(this);
  }

  resize() {
    const W = window.innerWidth;
    const H = window.innerHeight;
    this.renderer.setSize(W, H);
    this.camera.aspect = W / H;
    const camZ = H / 2 / Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2));
    this.camera.position.set(0, 0, camZ);
    this.camera.updateProjectionMatrix();
    this.u.uCamZ.value = camZ;
    this.u.uView.value.set(W, H);
  }

  /** Formations [0, n) can now be requested from the provider. */
  setAvailable(n) {
    this.available = n;
  }

  /** Throw away assembled formations (after a re-layout). */
  invalidate() {
    this.cache.clear();
    this.seg = null;
  }

  get(i) {
    if (i < 0) return this.sky;
    if (!this.cache.has(i)) {
      if (this.cache.size > 5) this.cache.delete(this.cache.keys().next().value);
      this.cache.set(i, this.provider(i));
    }
    return this.cache.get(i);
  }

  load(from, to) {
    const A = this.get(from);
    const B = this.get(to);
    const { a, N } = this;
    a.aFrom.array.set(A.pos);
    a.aColFrom.array.set(A.col);
    a.aTo.array.set(B.pos);
    a.aColTo.array.set(B.col);
    a.aDelay.array.set(B.delay);
    const size = a.aSize.array;
    const spin = a.aSpin.array;
    for (let i = 0; i < N; i++) {
      size[i * 2] = A.size[i];
      size[i * 2 + 1] = B.size[i];
      spin[i * 2] = A.spin[i];
      spin[i * 2 + 1] = B.spin[i];
    }
    Object.values(a).forEach((v) => (v.needsUpdate = true));
    this.u.uPivotFrom.value.set(...A.pivot);
    this.u.uPivotTo.value.set(...B.pivot);
    this.seg = `${from}>${to}`;
  }

  setHover(rect) {
    if (!rect) this.u.uHover.value.set(1, 1, 0, 0);
    else this.u.uHover.value.set(rect.x - 6, rect.y - 6, rect.x + rect.w + 6, rect.y + rect.h + 6);
  }

  start() {
    gsap.ticker.add(this.tick);
    if (!this.reduce) {
      gsap.to(this.intro, { v: 1, duration: 3.2, ease: 'power2.inOut', delay: 0.15 });
    }
  }

  tick(time, deltaMs) {
    const dt = Math.min(deltaMs / 1000, 0.05);
    const lerp = (x, y, k) => x + (y - x) * (1 - Math.pow(1 - k, dt * 60));
    const maxIdx = Math.max(0, this.available - 1);
    const target = Math.min(this.target, maxIdx);

    if (this.instant) this.shown = target;
    else if (this.reduce) this.shown = Math.round(target);
    else {
      // Eased follow with a speed limit: a hard flick still plays as a graceful flight.
      const step = (target - this.shown) * (1 - Math.pow(1 - 0.045, dt * 60));
      const cap = 1.1 * dt;
      this.shown += Math.max(-cap, Math.min(cap, step));
    }

    let from;
    let to;
    let mix;
    if (this.intro.v < 1) {
      from = -1;
      to = 0;
      mix = this.intro.v;
    } else {
      from = Math.min(Math.floor(this.shown), Math.max(0, maxIdx - 1));
      to = Math.min(from + 1, maxIdx);
      mix = to === from ? 0 : this.shown - from;
      if (to === from) from = to;
    }
    if (this.seg !== `${from}>${to}`) this.load(from, to);
    this.u.uMix.value = Math.min(1, Math.max(0, mix));

    const vel = Math.abs(window.__lenis?.velocity || 0);
    this.u.uTime.value = time;
    this.u.uAngle.value += dt * 0.3;
    this.u.uEnergy.value = lerp(this.u.uEnergy.value, Math.min(vel / 40, 1), 0.08);
    this.u.uMouse.value.set(lerp(this.u.uMouse.value.x, this.mouse.px, 0.25), lerp(this.u.uMouse.value.y, this.mouse.py, 0.25));
    this.mouse.x = lerp(this.mouse.x, this.mouse.tx, 0.04);
    this.mouse.y = lerp(this.mouse.y, this.mouse.ty, 0.04);
    this.group.rotation.y = this.mouse.x * 0.035;
    this.group.rotation.x = this.mouse.y * 0.025;

    // Report the formation the viewer is resting on (for hit-areas).
    const near = Math.round(this.shown);
    const settled = this.intro.v >= 0.95 && Math.abs(this.shown - near) < 0.04 && Math.abs(target - near) < 0.2 ? near : -1;
    if (settled !== this.settled) {
      this.settled = settled;
      this.onSettle?.(settled);
    }

    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    gsap.ticker.remove(this.tick);
    gsap.killTweensOf(this.intro);
    window.removeEventListener('pointermove', this.onMove);
    document.removeEventListener('mouseleave', this.onLeave);
    this.geo.dispose();
    this.mat.dispose();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
