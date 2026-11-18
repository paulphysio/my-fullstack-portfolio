import { C, rgb, sampleElement } from './compose';

/*
 * Stage: turns designed scenes into drone formations.
 *
 * A scene has steps; each step lists elements; each element occupies a
 * "slot" — a fixed range of drones reserved for the whole scene. Elements
 * that persist between steps keep their exact drones (perfectly still),
 * elements that change in the same slot morph. Drones without a job rest in
 * the night sky, which is shared by every page so resting drones never move
 * when you navigate.
 */

const skies = new Map();

/** The shared night sky for a given drone count and viewport. */
export function getSky(N, W, H) {
  const key = `${N}:${W}x${H}`;
  if (skies.has(key)) return skies.get(key);
  const pos = new Float32Array(N * 3);
  const col = new Float32Array(N * 3);
  const size = new Float32Array(N);
  const delay = new Float32Array(N);
  const spin = new Float32Array(N);
  const tints = [rgb('#9fb4d8'), rgb(C.cyan), rgb(C.violet), rgb(C.green)];
  for (let i = 0; i < N; i++) {
    pos[i * 3] = (Math.random() * 1.3 - 0.15) * W;
    pos[i * 3 + 1] = (Math.random() * 1.3 - 0.15) * H;
    pos[i * 3 + 2] = -250 - Math.random() * 1600;
    const t = Math.random();
    const tint = tints[t < 0.72 ? 0 : t < 0.86 ? 1 : t < 0.95 ? 2 : 3];
    // Most resting drones fade into the dark; a few become stars.
    const star = Math.random() < 0.12;
    const b = star ? 0.18 + Math.pow(Math.random(), 2) * 0.45 : 0.012 + Math.random() * 0.03;
    col.set(tint.map((v) => v * b), i * 3);
    size[i] = 2.4 + Math.random() * 2.6;
    delay[i] = Math.random();
  }
  const sky = { pos, col, size, delay, spin, pivot: [W / 2, H / 2, 0] };
  skies.clear(); // only the current viewport matters
  skies.set(key, sky);
  return sky;
}

export function createStage({ W, H, N }) {
  const sky = getSky(N, W, H);
  const formations = [];
  // `used`: drones reserved for global elements (e.g. the home rail);
  // `globalPut(f, put)`: writes those global drones into every formation.
  const st = { used: 0, globalPut: null, extraHotspots: [] };

  /** Sample a scene, size its slots to fit the fleet, register its formations. */
  function compile(sceneIndex, steps) {
    const avail = N - st.used;
    let scale = 1;
    let sampled;
    let caps;
    for (let attempt = 0; attempt < 4; attempt++) {
      const cache = new Map();
      caps = new Map();
      sampled = steps.map((step) =>
        step.elements.map((el) => {
          if (!cache.has(el.id)) cache.set(el.id, sampleElement(el, scale));
          const d = cache.get(el.id);
          caps.set(el.slot, Math.max(caps.get(el.slot) || 0, d.length / 7));
          return { el, d };
        })
      );
      const total = [...caps.values()].reduce((s, v) => s + v, 0);
      if (total <= avail) break;
      scale *= Math.sqrt(total / avail) * 1.03;
    }
    const starts = new Map();
    let cursor = st.used;
    caps.forEach((cap, slot) => {
      starts.set(slot, cursor);
      cursor += cap;
    });
    const first = formations.length;
    steps.forEach((step, s) => {
      const pivotEl = step.elements.find((e) => e.spin);
      formations.push({
        scene: sceneIndex,
        step: s,
        key: step.key,
        weight: step.weight ?? 1,
        hotspots: [...(step.hotspots || []), ...st.extraHotspots],
        pivot: pivotEl ? pivotEl.pivot : [W / 2, H / 2, 0],
        parts: sampled[s].map(({ el, d }) => ({
          start: starts.get(el.slot),
          cap: caps.get(el.slot),
          d,
          order: el.order ?? 0.5,
          spin: el.spin ? 1 : 0,
        })),
      });
    });
    return first;
  }

  /** Formation i → GPU-ready arrays. */
  function assemble(i) {
    const f = formations[i];
    const pos = sky.pos.slice();
    const col = sky.col.slice();
    const size = sky.size.slice();
    const delay = sky.delay.slice();
    const spin = new Float32Array(N);
    const put = (start, cap, d, order, sp) => {
      const n = Math.min(cap, d.length / 7);
      for (let k = 0; k < n; k++) {
        const o = k * 7;
        const j = start + k;
        pos[j * 3] = d[o];
        pos[j * 3 + 1] = d[o + 1];
        pos[j * 3 + 2] = d[o + 2];
        col[j * 3] = d[o + 3];
        col[j * 3 + 1] = d[o + 4];
        col[j * 3 + 2] = d[o + 5];
        size[j] = d[o + 6];
        // Cue: element order, then a left→right sweep inside the element.
        delay[j] = Math.min(1, order * 0.72 + (d[o] / W) * 0.28);
        spin[j] = sp;
      }
    };
    if (st.globalPut) st.globalPut(f, put);
    f.parts.forEach((p) => put(p.start, p.cap, p.d, p.order, p.spin));
    return { pos, col, size, delay, spin, pivot: f.pivot };
  }

  return { sky, formations, compile, assemble, st };
}
