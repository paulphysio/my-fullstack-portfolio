import { FONTS, C, text, frame, button, tags, picture, points, group, shape, measure, fitSize, sampleElement, rgb } from './compose';

/*
 * THE SHOW — every scene of the home page, designed in viewport pixels and
 * compiled into drone formations.
 *
 * A scene has steps. Each step lists elements; each element occupies a
 * "slot". A slot reserves a fixed range of drones for the whole scene, so
 * elements that persist between steps keep their exact drones (they stay
 * perfectly still), and elements that change in the same slot morph
 * (screenshot → screenshot, line → line). Drones without a job rest in the
 * night sky.
 */

export const SCENES = [
  { key: 'hero', name: 'Intro' },
  { key: 'whoami', name: 'Whoami' },
  { key: 'manifesto', name: 'Manifesto' },
  { key: 'numbers', name: 'Numbers' },
  { key: 'work', name: 'Work' },
  { key: 'stack', name: 'Stack' },
  { key: 'explore', name: 'Explore' },
  { key: 'contact', name: 'Contact' },
];

const ICONS = {
  projects: 'M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z',
  about: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M8 7a4 4 0 1 0 8 0a4 4 0 1 0 -8 0',
  blog: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
  contact: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6',
};

const lerp3 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const pad2 = (n) => String(n).padStart(2, '0');

/* ---------------- procedural 3D shapes (px space) ---------------- */

function helix(cx, cy, height, count, bright) {
  const out = new Float32Array(count * 7);
  const R = height * 0.16;
  const cyan = rgb(C.cyan);
  const green = rgb(C.green);
  for (let i = 0; i < count; i++) {
    const kind = i % 6;
    let x;
    let z;
    let t;
    if (kind < 5) {
      t = Math.random() * 2 - 1;
      const ang = t * Math.PI * 3.2 + (kind % 2 ? Math.PI : 0);
      x = Math.cos(ang) * R + (Math.random() - 0.5) * R * 0.1;
      z = Math.sin(ang) * R + (Math.random() - 0.5) * R * 0.1;
    } else {
      t = (Math.floor(Math.random() * 26) / 25) * 2 - 1;
      const ang = t * Math.PI * 3.2;
      const m = Math.random() * 2 - 1;
      x = Math.cos(ang) * R * m;
      z = Math.sin(ang) * R * m;
    }
    const c = lerp3(cyan, green, (t + 1) / 2).map((v) => v * bright * (0.7 + Math.random() * 0.3));
    out.set([cx + x, cy - (t * height) / 2, z, c[0], c[1], c[2], 2.3], i * 7);
  }
  return out;
}

function galaxy(cx, cy, R, count, bright) {
  const out = new Float32Array(count * 7);
  const tilt = -1.12;
  const cs = Math.cos(tilt);
  const sn = Math.sin(tilt);
  const violet = rgb(C.violet);
  const cyan = rgb(C.cyan);
  const pink = rgb(C.pink);
  for (let i = 0; i < count; i++) {
    const gr = Math.pow(Math.random(), 1.6) * R;
    const ang = (i % 3) * ((Math.PI * 2) / 3) + (gr / R) * 4.2;
    const sc = Math.pow(Math.random(), 3) * R * 0.2;
    const px = Math.cos(ang) * gr + (Math.random() - 0.5) * sc;
    const pz = Math.sin(ang) * gr + (Math.random() - 0.5) * sc;
    const py = (Math.random() - 0.5) * R * 0.07 * (1 - gr / R);
    const y = py * cs - pz * sn;
    const z = py * sn + pz * cs;
    let c = gr < R * 0.12 ? [1, 0.92, 1] : Math.random() < 0.1 ? pink : lerp3(violet, cyan, Math.random());
    c = c.map((v) => v * bright * (0.6 + Math.random() * 0.4));
    out.set([cx + px, cy - y, z - 220, c[0], c[1], c[2], 2.6], i * 7);
  }
  return out;
}

function makeSky(N, W, H) {
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
  return { pos, col, size, delay, spin, pivot: [W / 2, H / 2, 0] };
}

/* ------------------------------------------------------------------ */

export function createShow({ W, H, N, mobile, data }) {
  const M = mobile ? 22 : Math.max(72, (W - 1180) / 2);
  const CW = W - 2 * M;
  const TOP = mobile ? 92 : 112;
  const sky = makeSky(N, W, H);
  const formations = [];
  let used = 0; // drones reserved so far (global slots)

  const label = (n, title) =>
    text({ id: 'label', slot: 'label', x: M, y: TOP, str: `${n} — ${title.toUpperCase()}`, font: FONTS.mono(600, mobile ? 11 : 12), color: C.green, letterSpacing: 3, order: 0, spacing: 1.2 });

  /* ---------- global: navigation rail (desktop) ---------- */
  const rail = { cap: 0, start: 0, base: null, active: [] };
  const railX = W - 34;
  const railY = (i) => H / 2 + (i - (SCENES.length - 1) / 2) * 26;
  if (!mobile) {
    rail.base = sampleElement(
      shape({
        id: 'rail',
        bbox: { x: railX - 4, y: railY(0) - 4, w: 8, h: railY(SCENES.length - 1) - railY(0) + 8 },
        spacing: 1.1,
        paint(ctx) {
          ctx.fillStyle = '#3c5a73';
          SCENES.forEach((_, i) => {
            ctx.beginPath();
            ctx.arc(railX, railY(i), 2.3, 0, Math.PI * 2);
            ctx.fill();
          });
        },
      })
    );
    rail.active = SCENES.map((s, i) =>
      sampleElement(
        group({
          id: `rail-${i}`,
          children: [
            shape({
              id: 'ring',
              bbox: { x: railX - 9, y: railY(i) - 9, w: 18, h: 18 },
              spacing: 1.05,
              paint(ctx) {
                ctx.beginPath();
                ctx.arc(railX, railY(i), 7, 0, Math.PI * 2);
                ctx.lineWidth = 1.4;
                ctx.strokeStyle = C.cyan;
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(railX, railY(i), 2.6, 0, Math.PI * 2);
                ctx.fillStyle = C.cyan;
                ctx.fill();
              },
            }),
            text({ id: 'rl', x: railX - 20, y: railY(i) - 7, str: s.name.toUpperCase(), font: FONTS.mono(600, 10), color: C.cyan, align: 'right', letterSpacing: 2, spacing: 1.05 }),
          ],
        })
      )
    );
    rail.cap = Math.max(...rail.active.map((a) => a.length / 7));
    rail.baseCount = rail.base.length / 7;
    used = rail.baseCount + rail.cap;
  }
  const railHotspots = mobile
    ? []
    : SCENES.map((s, i) => ({ x: railX - 12, y: railY(i) - 12, w: 24, h: 24, label: `Go to ${s.name}`, scene: s.key }));

  /* ---------- compile a scene: sample, size slots, register formations ---------- */
  function compile(sceneIndex, steps) {
    const avail = N - used;
    let scale = 1;
    let sampled;
    let caps;
    for (let attempt = 0; attempt < 4; attempt++) {
      const cache = new Map();
      caps = new Map();
      sampled = steps.map((st) =>
        st.elements.map((el) => {
          const key = el.id;
          if (!cache.has(key)) cache.set(key, sampleElement(el, scale));
          const d = cache.get(key);
          caps.set(el.slot, Math.max(caps.get(el.slot) || 0, d.length / 7));
          return { el, d };
        })
      );
      const total = [...caps.values()].reduce((s, v) => s + v, 0);
      if (total <= avail) break;
      scale *= Math.sqrt(total / avail) * 1.03;
    }
    const starts = new Map();
    let cursor = used;
    caps.forEach((cap, slot) => {
      starts.set(slot, cursor);
      cursor += cap;
    });
    steps.forEach((st, s) => {
      const pivotEl = st.elements.find((e) => e.spin);
      formations.push({
        scene: sceneIndex,
        step: s,
        weight: st.weight ?? 1,
        hotspots: [...(st.hotspots || []), ...railHotspots],
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
  }

  /* ---------- assemble formation i into GPU-ready arrays ---------- */
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
    if (rail.base) {
      put(0, rail.baseCount, rail.base, 0.1, 0);
      put(rail.baseCount, rail.cap, rail.active[f.scene], 0.9, 0);
    }
    f.parts.forEach((p) => put(p.start, p.cap, p.d, p.order, p.spin));
    return { pos, col, size, delay, spin, pivot: f.pivot };
  }

  /* ================================================================== */
  /* SCENES                                                             */
  /* ================================================================== */
  const builders = [];

  /* ---------- 1 · HERO ---------- */
  builders.push(() => {
    const nameSize = mobile ? Math.min(CW * 0.3, 128) : Math.min(CW * 0.2, (H - TOP) * 0.25, 236);
    const roleRuns = [
      { t: 'Web3 & Full-Stack Engineer ', c: C.white },
      { t: '— shipping on ', c: C.dim },
      { t: 'Solana', c: C.green },
    ];
    const roleSize = fitSize([roleRuns], (p) => FONTS.display(500, p), CW, mobile ? 15 : 24);
    const btnH = mobile ? 46 : 54;
    const btnFont = FONTS.mono(600, mobile ? 12.5 : 14.5);
    const l1 = 'See the work  ↓';
    const l2 = 'Download CV  ↗';
    const w1 = measure(btnFont, l1, 0.5) + 60;
    const w2 = measure(btnFont, l2, 0.5) + 60;
    // Narrow phones: stack the buttons instead of letting them touch the edges.
    const stackBtns = w1 + 14 + w2 > CW;
    const btnBlock = stackBtns ? btnH * 2 + 12 : btnH;
    const gaps = mobile ? [24, 26, 30] : [30, 34, 40];
    const total = 14 + gaps[0] + nameSize * 1.84 + gaps[1] + roleSize * 1.3 + gaps[2] + btnBlock;
    let y = TOP - 20 + (H - TOP - total) / 2;
    const els = [];
    els.push(text({ id: 'eyebrow', slot: 'eyebrow', x: W / 2, y, runs: [{ t: '● ', c: C.green }, { t: 'AVAILABLE FOR WEB3 PROJECTS', c: C.green }], font: FONTS.mono(600, mobile ? 11 : 13), letterSpacing: 4, align: 'center', order: 0.85, spacing: 1.2 }));
    y += 14 + gaps[0];
    els.push(text({ id: 'paul', slot: 'paul', x: W / 2, y, str: 'PAUL', font: FONTS.display(700, nameSize), lineHeight: nameSize * 0.92, align: 'center', gradient: ['#ffffff', '#8ff6ff'], order: 0, spacing: mobile ? 1.7 : 2.2 }));
    y += nameSize * 0.92;
    els.push(text({ id: 'madu', slot: 'madu', x: W / 2, y, str: 'MADU', font: FONTS.display(700, nameSize), lineHeight: nameSize * 0.92, align: 'center', color: C.cyan, stroke: Math.max(2, nameSize * 0.03), order: 0.25, spacing: mobile ? 1.3 : 1.5 }));
    y += nameSize * 0.92 + gaps[1];
    els.push(
      text({
        id: 'role',
        slot: 'role',
        x: W / 2,
        y,
        runs: roleRuns,
        font: FONTS.display(500, roleSize),
        align: 'center',
        order: 0.55,
        spacing: mobile ? 1.15 : 1.35,
      })
    );
    y += roleSize * 1.3 + gaps[2];
    const bx = W / 2 - (w1 + 14 + w2) / 2;
    const b1 = stackBtns
      ? button({ id: 'b1', slot: 'b1', x: W / 2, y, label: l1, filled: true, height: btnH, font: btnFont, order: 0.7, align: 'center' })
      : button({ id: 'b1', slot: 'b1', x: bx, y, label: l1, filled: true, height: btnH, font: btnFont, order: 0.7 });
    const b2 = stackBtns
      ? button({ id: 'b2', slot: 'b2', x: W / 2, y: y + btnH + 12, label: l2, height: btnH, font: btnFont, order: 0.78, align: 'center' })
      : button({ id: 'b2', slot: 'b2', x: bx + w1 + 14, y, label: l2, height: btnH, font: btnFont, order: 0.78 });
    els.push(b1, b2);
    els.push(
      group({
        id: 'hint',
        slot: 'hint',
        order: 1,
        children: [
          text({ id: 'h1', x: W / 2, y: H - 64, str: 'SCROLL', font: FONTS.mono(500, 10), color: C.dim, letterSpacing: 5, align: 'center', spacing: 1.1 }),
          shape({
            id: 'h2',
            bbox: { x: W / 2 - 2, y: H - 44, w: 4, h: 30 },
            spacing: 1.2,
            paint(ctx) {
              const g = ctx.createLinearGradient(0, H - 44, 0, H - 14);
              g.addColorStop(0, C.cyan);
              g.addColorStop(1, 'rgba(0,240,255,0)');
              ctx.fillStyle = g;
              ctx.fillRect(W / 2 - 0.75, H - 44, 1.5, 30);
            },
          }),
        ],
      })
    );
    compile(0, [
      {
        elements: els,
        weight: 1,
        hotspots: [
          { ...b1.rect, label: 'See the work', scene: 'work' },
          { ...b2.rect, label: 'Download CV', href: '/cv.pdf', external: true },
        ],
      },
    ]);
  });

  /* ---------- 2 · WHOAMI terminal (types as you scroll) ---------- */
  builders.push(() => {
    const w = mobile ? CW : Math.min(CW, 980);
    const x = (W - w) / 2;
    const fs = mobile ? 12.5 : 17;
    const lh = mobile ? 19 : 31;
    const rows = [
      [{ t: '$ ', c: C.green }, { t: 'whoami --verbose', c: C.white }],
      ['name', 'Paul Madu'],
      ['role', 'Web3 Developer · Full-Stack Engineer · Blockchain Architect'],
      ['stack', 'Solana · Rust · Web3.js · React · Next.js · Python · Django'],
      ['focus', 'Decentralized applications on Solana'],
      ['study', 'B.Eng Petroleum Engineering, FUTO 2024 · 3.74 CGPA'],
      ['now', 'Leading Web3 development at SempaiHQ'],
    ];
    // Lay the rows out first (mobile wraps values under their key).
    const keyW = measure(FONTS.mono(500, fs), 'study   ');
    let cy = 0;
    const laid = rows.map((r, i) => {
      if (i === 0) {
        const out = {
          y: 0,
          h: lh,
          w: measure(FONTS.mono(500, fs), r.map((s) => s.t).join('')),
          make: (ox, oy) => text({ id: 'r0', slot: 'r0', x: ox, y: oy, runs: r, font: FONTS.mono(500, fs), lineHeight: lh, spacing: 1.15, order: 0.3 }),
        };
        cy += lh * 1.4;
        return out;
      }
      const [k, v] = r;
      const valueX = mobile ? 14 : keyW + 18;
      const valueW = w - 56 - valueX;
      const vLines = mobile ? Math.ceil(measure(FONTS.mono(400, fs), v) / valueW + 0.01) : 1;
      const startY = cy;
      const h = mobile ? lh * (1 + vLines) : lh;
      cy += h + (mobile ? 4 : 2);
      return {
        y: startY,
        h,
        make: (ox, oy) =>
          group({
            id: `r${i}`,
            slot: `r${i}`,
            order: 0.3,
            children: [
              text({ id: 'k', x: ox, y: oy + startY, runs: [{ t: '> ', c: C.green }, { t: k, c: C.cyan }], font: FONTS.mono(500, fs), lineHeight: lh, spacing: 1.15 }),
              text({ id: 'v', x: ox + valueX, y: oy + startY + (mobile ? lh : 0), str: v, font: FONTS.mono(400, fs), color: C.text, maxWidth: valueW, lineHeight: lh, spacing: 1.15 }),
            ],
          }),
        lastW: mobile ? 0 : valueX + measure(FONTS.mono(400, fs), v),
      };
    });
    const bodyH = cy + 10;
    const h = Math.min(H - TOP - 70, bodyH + 120);
    const y = TOP + 40 + (H - TOP - 40 - h) / 2;
    const ox = x + 28;
    const oy = y + 76;
    const chrome = group({
      id: 'chrome',
      slot: 'chrome',
      order: 0,
      children: [
        frame({ id: 'f', x, y, w, h, r: 14, color: C.cyan, lineWidth: 1.4, spacing: 1.3 }),
        shape({
          id: 'bar',
          bbox: { x, y, w, h: 48 },
          spacing: 1.2,
          paint(ctx) {
            ctx.strokeStyle = 'rgba(0,240,255,0.45)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x, y + 46);
            ctx.lineTo(x + w, y + 46);
            ctx.stroke();
            [C.red, C.yellow, C.okgreen].forEach((c, i) => {
              ctx.fillStyle = c;
              ctx.beginPath();
              ctx.arc(x + 26 + i * 20, y + 23, 5.5, 0, Math.PI * 2);
              ctx.fill();
            });
          },
        }),
        text({ id: 'title', x: x + w / 2, y: y + 16, str: 'paulmadu@portfolio:~$', font: FONTS.mono(500, 12), color: C.dim, align: 'center', spacing: 1.1 }),
      ],
    });
    const label01 = label('01', 'whoami');
    const steps = laid.map((_, k) => {
      const els = [label01, chrome];
      for (let i = 0; i <= k; i++) els.push(laid[i].make(ox, oy));
      // Block cursor after the newest line.
      const r = laid[k];
      const cxp = k === 0 ? ox + r.w + 8 : mobile ? ox : ox + r.lastW + 10;
      const cyp = oy + r.y + (mobile && k > 0 ? r.h : 0) + (lh - fs) / 2 - 2;
      els.push(
        shape({
          id: `cur${k}`,
          slot: 'cursor',
          order: 0.95,
          bbox: { x: cxp, y: cyp, w: fs * 0.62, h: fs * 1.15 },
          spacing: 1.3,
          paint(ctx) {
            ctx.fillStyle = C.green;
            ctx.fillRect(cxp, cyp, fs * 0.62, fs * 1.15);
          },
        })
      );
      return { elements: els, weight: k === 0 ? 0.9 : 0.42 };
    });
    compile(1, steps);
  });

  /* ---------- 3 · MANIFESTO (helix + lines that light up) ---------- */
  builders.push(() => {
    const lines = [
      [['I turn ideas into', C.white]],
      [['decentralized', C.cyan], [' products —', C.white]],
      [['Solana', C.green], [' programs in ', C.white], ['Rust,', C.green]],
      [['wallets in the browser, and', C.white]],
      [['interfaces people actually ', C.white], ['enjoy.', C.violet]],
      [['Petroleum engineer by degree.', C.white]],
      [['Software engineer by ', C.white], ['obsession.', C.cyan]],
    ];
    // Size the type so the widest line fits its column on any screen.
    const fs = fitSize(lines.map((ln) => ln.map(([t]) => ({ t }))), (p) => FONTS.display(600, p), mobile ? CW : CW * 0.56, mobile ? 30 : 50);
    const lh = fs * 1.14;
    const blockH = lh * lines.length;
    const y0 = TOP + 40 + (H - TOP - 40 - blockH) / 2;
    const hx = mobile ? W / 2 : M + CW * 0.82;
    const hh = (H - TOP) * (mobile ? 0.7 : 0.82);
    const hy = TOP + (H - TOP) / 2 + 10;
    const dna = points({ id: 'helix', slot: 'helix', drones: helix(hx, hy, hh, mobile ? 5000 : 11000, mobile ? 0.3 : 1), spin: true, order: 0.1 });
    dna.pivot = [hx, hy, 0];
    const lit = [2, 4, 6, 7];
    const steps = lit.map((n) => {
      const els = [label('02', 'manifesto'), dna];
      lines.forEach((ln, i) => {
        const on = i < n;
        els.push(
          text({
            id: `m${i}-${on ? 1 : 0}`,
            slot: `m${i}`,
            x: M,
            y: y0 + i * lh,
            runs: ln.map(([t, c]) => ({ t, c })),
            font: FONTS.display(600, fs),
            lineHeight: lh,
            order: 0.2 + i * 0.08,
            spacing: mobile ? 1.15 : 1.45,
            brightness: on ? 1 : 0.13,
          })
        );
      });
      return { elements: els, weight: 0.62 };
    });
    compile(2, steps);
  });

  /* ---------- 4 · BY THE NUMBERS ---------- */
  builders.push(() => {
    const cols = mobile ? 2 : 4;
    const colW = CW / cols;
    const numSize = mobile ? 58 : Math.min(112, colW * 0.5);
    const rowH = numSize * 1.05 + 52;
    const rowsN = Math.ceil(data.stats.length / cols);
    const headSize = mobile ? 26 : 44;
    const blockH = headSize * 1.2 + 50 + rowH * rowsN;
    const y0 = TOP + 30 + (H - TOP - 30 - blockH) / 2;
    const els = [label('03', 'by the numbers')];
    els.push(text({ id: 'nhead', slot: 'nhead', x: M, y: y0, str: `${data.years} years of shipping, in four numbers.`, font: FONTS.display(600, headSize), color: C.white, maxWidth: CW, order: 0.05, spacing: mobile ? 1.15 : 1.4 }));
    const gy = y0 + headSize * 1.2 + 50;
    els.push(
      shape({
        id: 'grid',
        slot: 'grid',
        order: 0.15,
        bbox: { x: M, y: gy - 20, w: CW, h: rowH * rowsN + 40 },
        spacing: 1.3,
        paint(ctx) {
          ctx.strokeStyle = 'rgba(0,240,255,0.35)';
          ctx.lineWidth = 1;
          for (let r = 0; r <= rowsN; r++) {
            ctx.beginPath();
            ctx.moveTo(M, gy - 20 + r * rowH);
            ctx.lineTo(M + CW, gy - 20 + r * rowH);
            ctx.stroke();
          }
          for (let c = 1; c < cols; c++) {
            ctx.beginPath();
            ctx.moveTo(M + c * colW, gy - 20);
            ctx.lineTo(M + c * colW, gy - 20 + rowH * rowsN);
            ctx.stroke();
          }
        },
      })
    );
    data.stats.forEach((s, i) => {
      const cx = M + (i % cols) * colW + (mobile ? 14 : 26);
      const cy = gy + Math.floor(i / cols) * rowH;
      els.push(
        group({
          id: `stat${i}`,
          slot: `stat${i}`,
          order: 0.3 + i * 0.12,
          children: [
            text({ id: 'n', x: cx, y: cy, str: s.value, font: FONTS.display(700, numSize), lineHeight: numSize, gradient: ['#ffffff', C.cyan], spacing: mobile ? 1.4 : 1.8 }),
            text({ id: 'l', x: cx, y: cy + numSize * 1.05 + 4, str: s.label.toUpperCase(), font: FONTS.mono(500, mobile ? 9.5 : 11.5), color: C.dim, letterSpacing: 2, maxWidth: colW - 30, spacing: 1.1 }),
          ],
        })
      );
    });
    compile(3, [{ elements: els, weight: 1 }]);
  });

  /* ---------- 5 · SELECTED WORK (drones paint each site) ---------- */
  builders.push(() => {
    const P = data.projects.length;
    const leftW = mobile ? CW : CW * 0.37;
    const bx = mobile ? M : M + CW * 0.42;
    const bw = mobile ? CW : CW * 0.58;
    const bh = mobile ? Math.min(CW * 0.6, (H - TOP) * 0.32) : Math.min(H - TOP - 110, bw * 0.66);
    const by = mobile ? TOP + 28 : TOP + 24 + (H - TOP - 24 - bh) / 2;
    const imgBudget = mobile ? 11000 : 26000;
    const imgSpacing = Math.max(mobile ? 2 : 2.4, Math.sqrt((bw * (bh - 38)) / imgBudget));
    const browser = group({
      id: 'browser',
      slot: 'browser',
      order: 0.05,
      children: [
        frame({ id: 'bf', x: bx, y: by, w: bw, h: bh, r: 14, color: C.cyan, lineWidth: 1.3, spacing: 1.3 }),
        shape({
          id: 'bb',
          bbox: { x: bx, y: by, w: 80, h: 38 },
          spacing: 1.15,
          paint(ctx) {
            [C.red, C.yellow, C.okgreen].forEach((c, i) => {
              ctx.fillStyle = c;
              ctx.beginPath();
              ctx.arc(bx + 22 + i * 17, by + 19, 4.5, 0, Math.PI * 2);
              ctx.fill();
            });
          },
        }),
      ],
    });
    const steps = data.projects.map((p, i) => {
      const els = [label('04', 'selected work'), browser];
      const host = (p.live || '').replace(/^https?:\/\//, '').replace(/\/$/, '') || p.slug;
      els.push(text({ id: `url${i}`, slot: 'url', x: bx + bw / 2, y: by + 11, str: host, font: FONTS.mono(500, 12), color: C.dim, align: 'center', spacing: 1.1, order: 0.3 }));
      if (data.images[p.image]) {
        els.push(
          picture({
            id: `shot${i}`,
            slot: 'shot',
            img: data.images[p.image],
            x: bx + 2,
            y: by + 38,
            w: bw - 4,
            h: bh - 40,
            fit: 'cover',
            alignTop: true,
            radius: 10,
            spacing: imgSpacing,
            order: 0.25,
          })
        );
      }
      // Left column copy.
      const titleSize = mobile ? 24 : Math.min(42, leftW * 0.095);
      const descSize = mobile ? 13.5 : 16.5;
      let y = mobile ? by + bh + 24 : 0;
      const parts = [];
      parts.push(text({ id: `idx${i}`, slot: 'idx', x: M, y, str: `${pad2(i + 1)} / ${pad2(P)}  ·  ${p.year}`, font: FONTS.mono(600, 12), color: C.green, letterSpacing: 2, order: 0.35, spacing: 1.15 }));
      y += 30;
      const title = text({ id: `t${i}`, slot: 'title', x: M, y, str: p.title.replace(/ - .*/, ''), font: FONTS.display(700, titleSize), color: C.white, maxWidth: leftW, lineHeight: titleSize * 1.08, maxLines: 2, order: 0.4, spacing: mobile ? 1.2 : 1.4 });
      parts.push(title);
      y += title.height + 16;
      const desc = text({ id: `d${i}`, slot: 'desc', x: M, y, str: p.description, font: FONTS.display(400, descSize), color: C.dim, maxWidth: leftW, lineHeight: descSize * 1.55, maxLines: mobile ? 3 : 4, order: 0.5, spacing: 1.1 });
      parts.push(desc);
      y += desc.height + 18;
      const tg = tags({ id: `tg${i}`, slot: 'tags', x: M, y, items: p.tech.slice(0, 5), maxWidth: leftW, order: 0.6 });
      parts.push(tg);
      y += tg.height + 24;
      const bFont = FONTS.mono(600, mobile ? 12 : 13.5);
      const cs = button({ id: `cs${i}`, slot: 'cs', x: M, y, label: 'Case study  →', filled: true, height: mobile ? 42 : 48, font: bFont, order: 0.75 });
      parts.push(cs);
      const hotspots = [{ ...cs.rect, label: `${p.title} case study`, href: `/projects/${p.slug}` }];
      if (p.live) {
        const lv = button({ id: `lv${i}`, slot: 'lv', x: M + cs.rect.w + 12, y, label: 'Live  ↗', height: mobile ? 42 : 48, font: bFont, order: 0.8 });
        parts.push(lv);
        hotspots.push({ ...lv.rect, label: `${p.title} live site`, href: p.live, external: true });
      }
      y += mobile ? 42 : 48;
      // Desktop: centre the copy block against the browser.
      if (!mobile) {
        const shift = by + bh / 2 - y / 2;
        parts.forEach((el) => shiftEl(el, shift));
        hotspots.forEach((h) => (h.y += shift));
      }
      // Progress dots.
      // Fixed position for every step: the static row is shared across steps.
      const dy = mobile ? H - 30 : by + bh + 26 > H - 20 ? H - 28 : by + bh + 26;
      const dx = mobile ? M : bx;
      els.push(...progressDots(dx, dy, P, i));
      return { elements: [...els, ...parts], hotspots, weight: 1.05 };
    });
    compile(4, steps);
  });

  /* ---------- 6 · STACK (drones draw each logo) ---------- */
  builders.push(() => {
    const L = data.logos.length;
    const total = L + 1;
    const leftW = mobile ? CW : CW * 0.44;
    const vx = mobile ? M : M + CW * 0.5;
    const vw = mobile ? CW : CW * 0.5;
    const vh = mobile ? (H - TOP) * 0.36 : H - TOP - 120;
    const vy = mobile ? TOP + 30 : TOP + 40 + (H - TOP - 40 - vh) / 2;
    const dots = (i) => progressDots(M, mobile ? H - 30 : vy + vh - 4, total, i);
    const copy = (i, name, desc, items) => {
      const nameSize = mobile ? 40 : Math.min(88, leftW * 0.17);
      let y = mobile ? vy + vh + 20 : 0;
      const parts = [];
      parts.push(text({ id: `si${i}`, slot: 'idx', x: M, y, str: `${pad2(i + 1)} / ${pad2(total)}`, font: FONTS.mono(600, 12), color: C.green, letterSpacing: 2, order: 0.3, spacing: 1.15 }));
      y += 28;
      const nm = text({ id: `sn${i}`, slot: 'name', x: M, y, str: name, font: FONTS.display(700, nameSize), color: C.white, maxWidth: leftW, lineHeight: nameSize * 1.02, order: 0.35, spacing: mobile ? 1.3 : 1.6 });
      parts.push(nm);
      y += nm.height + 14;
      const ds = text({ id: `sdsc${i}`, slot: 'desc', x: M, y, str: desc, font: FONTS.display(400, mobile ? 13.5 : 17), color: C.dim, maxWidth: leftW, lineHeight: (mobile ? 13.5 : 17) * 1.55, maxLines: mobile ? 3 : 4, order: 0.5, spacing: 1.1 });
      parts.push(ds);
      y += ds.height + 18;
      if (items?.length) {
        const tg = tags({ id: `stg${i}`, slot: 'tags', x: M, y, items, maxWidth: leftW, order: 0.65 });
        parts.push(tg);
        y += tg.height;
      }
      if (!mobile) {
        const shift = vy + vh / 2 - y / 2 - 10;
        parts.forEach((el) => shiftEl(el, shift));
      }
      return parts;
    };
    const steps = data.logos.map((l, i) => {
      const els = [label('05', 'stack'), ...dots(i)];
      if (data.images[l.image]) {
        els.push(picture({ id: `logo${i}`, slot: 'visual', img: data.images[l.image], x: vx, y: vy, w: vw, h: vh, mask: 'lum', spacing: mobile ? 1.8 : 2.15, order: 0.15 }));
      }
      return { elements: [...els, ...copy(i, l.name, l.description, (l.uses || []).slice(0, 3))], weight: 0.85 };
    });
    // Final step: the rest of the toolkit as a constellation of pills.
    const restFont = FONTS.mono(600, mobile ? 12 : 15);
    const pillH = mobile ? 32 : 40;
    const restEl = shape({
      id: 'rest',
      slot: 'visual2',
      order: 0.2,
      bbox: { x: vx, y: vy, w: vw, h: vh },
      spacing: 1.3,
      paint(ctx) {
        ctx.font = restFont;
        ctx.textBaseline = 'middle';
        const rowsArr = [];
        let row = [];
        let rw = 0;
        data.rest.forEach((t) => {
          const w = measure(restFont, t) + 34;
          if (rw + w > vw && row.length) {
            rowsArr.push({ row, rw });
            row = [];
            rw = 0;
          }
          row.push({ t, w });
          rw += w + 12;
        });
        if (row.length) rowsArr.push({ row, rw });
        const totalH = rowsArr.length * (pillH + 14);
        let yy = vy + (vh - totalH) / 2;
        rowsArr.forEach(({ row: r, rw: w }, ri) => {
          let xx = vx + (vw - (w - 12)) / 2;
          r.forEach((p, pi) => {
            const hue = [C.cyan, C.green, C.violet][(ri + pi) % 3];
            const rr = pillH / 2;
            ctx.beginPath();
            ctx.moveTo(xx + rr, yy);
            ctx.arcTo(xx + p.w, yy, xx + p.w, yy + pillH, rr);
            ctx.arcTo(xx + p.w, yy + pillH, xx, yy + pillH, rr);
            ctx.arcTo(xx, yy + pillH, xx, yy, rr);
            ctx.arcTo(xx, yy, xx + p.w, yy, rr);
            ctx.lineWidth = 1.3;
            ctx.strokeStyle = hue;
            ctx.stroke();
            ctx.fillStyle = C.white;
            ctx.fillText(p.t, xx + 17, yy + pillH / 2 + 1);
            xx += p.w + 12;
          });
          yy += pillH + 14;
        });
      },
    });
    steps.push({
      elements: [label('05', 'stack'), ...dots(L), restEl, ...copy(L, `+${data.rest.length} more`, 'The everyday toolkit behind every build — typed frontends, solid APIs, databases and cloud deploys.', [])],
      weight: 1,
    });
    compile(5, steps);
  });

  /* ---------- 7 · EXPLORE (navigation cards) ---------- */
  builders.push(() => {
    const cards = [
      { key: 'projects', title: 'Projects', href: '/projects', desc: 'Decentralized apps, Web3 platforms and full-stack products.', cmd: 'cd ./projects' },
      { key: 'about', title: 'About', href: '/about', desc: 'Petroleum engineer turned full-stack & Web3 engineer.', cmd: 'cat ./about.md' },
      { key: 'blog', title: 'Blog', href: '/blog', desc: 'Notes on Solana, Web3 and building for the web.', cmd: 'ls ./blog/*.md' },
      { key: 'contact', title: 'Contact', href: '/contact', desc: "Let's collaborate on your next Web3 build.", cmd: './contact.sh' },
    ];
    const cols = mobile ? 2 : 4;
    const gap = mobile ? 12 : 20;
    const cw = (CW - gap * (cols - 1)) / cols;
    const ch = mobile ? 178 : 250;
    const headSize = mobile ? 30 : 56;
    const blockH = headSize * 1.1 + 22 + 40 + ch * (mobile ? 2 : 1) + (mobile ? gap : 0);
    const y0 = TOP + 30 + (H - TOP - 30 - blockH) / 2;
    const els = [label('06', 'explore')];
    els.push(text({ id: 'eh', slot: 'eh', x: M, y: y0, str: 'Where to next?', font: FONTS.display(700, headSize), color: C.white, order: 0.05, spacing: mobile ? 1.3 : 1.6 }));
    els.push(text({ id: 'es', slot: 'es', x: M, y: y0 + headSize * 1.1 + 10, str: '$ ls -la ./navigation', font: FONTS.mono(500, mobile ? 12 : 14), color: C.dim, order: 0.15, spacing: 1.15 }));
    const hotspots = [];
    const top = y0 + headSize * 1.1 + 62;
    cards.forEach((c, i) => {
      const x = M + (i % cols) * (cw + gap);
      const y = top + Math.floor(i / cols) * (ch + gap);
      const pad = mobile ? 14 : 22;
      const iconS = mobile ? 1.05 : 1.35;
      els.push(
        group({
          id: `card${i}`,
          slot: `card${i}`,
          order: 0.3 + i * 0.12,
          children: [
            frame({ id: 'cf', x, y, w: cw, h: ch, r: 14, color: C.cyan, lineWidth: 1.2, spacing: 1.3 }),
            shape({
              id: 'ci',
              bbox: { x: x + pad, y: y + pad, w: 24 * iconS, h: 24 * iconS },
              spacing: 1.1,
              paint(ctx) {
                ctx.save();
                ctx.translate(x + pad, y + pad);
                ctx.scale(iconS, iconS);
                ctx.lineWidth = 1.8 / iconS;
                ctx.lineJoin = 'round';
                ctx.lineCap = 'round';
                ctx.strokeStyle = C.cyan;
                ctx.stroke(new Path2D(ICONS[c.key]));
                ctx.restore();
              },
            }),
            text({ id: 'ct', x: x + pad, y: y + pad + 24 * iconS + (mobile ? 12 : 18), runs: [{ t: '[ ', c: C.cyan }, { t: c.title, c: C.white }, { t: ' ]', c: C.cyan }], font: FONTS.mono(600, mobile ? 14 : 19), spacing: 1.15 }),
            text({ id: 'cd', x: x + pad, y: y + pad + 24 * iconS + (mobile ? 36 : 54), str: c.desc, font: FONTS.display(400, mobile ? 11.5 : 14.5), color: C.dim, maxWidth: cw - pad * 2, lineHeight: (mobile ? 11.5 : 14.5) * 1.5, maxLines: mobile ? 3 : 3, spacing: 1.05 }),
            ...(mobile
              ? []
              : [
                  shape({
                    id: 'cl',
                    bbox: { x: x + pad, y: y + ch - 52, w: cw - pad * 2, h: 2 },
                    spacing: 1.2,
                    paint(ctx) {
                      ctx.fillStyle = 'rgba(0,240,255,0.3)';
                      ctx.fillRect(x + pad, y + ch - 52, cw - pad * 2, 1);
                    },
                  }),
                  text({ id: 'cc', x: x + pad, y: y + ch - 36, runs: [{ t: c.cmd, c: C.green }], font: FONTS.mono(500, 12.5), spacing: 1.1 }),
                  text({ id: 'ca', x: x + cw - pad, y: y + ch - 38, str: '→', font: FONTS.mono(600, 16), color: C.cyan, align: 'right', spacing: 1.1 }),
                ]),
          ],
        })
      );
      hotspots.push({ x, y, w: cw, h: ch, label: c.title, href: c.href });
    });
    compile(6, [{ elements: els, hotspots, weight: 1 }]);
  });

  /* ---------- 8 · CONTACT (galaxy finale) ---------- */
  builders.push(() => {
    const R = Math.min(W, H) * (mobile ? 0.55 : 0.62);
    const gx = points({ id: 'galaxy', slot: 'galaxy', drones: galaxy(W / 2, H * 0.5, R, mobile ? 6000 : 15000, mobile ? 0.45 : 0.6), spin: true, order: 0.05 });
    gx.pivot = [W / 2, H * 0.5, -220];
    const ts = mobile ? Math.min(46, CW / 6.6) : Math.min(118, CW * 0.1);
    const ts2 = Math.min(ts, fitSize([[{ t: 'something legendary.' }]], (p) => FONTS.display(700, p), CW * 0.94, 999));
    const els = [label('07', 'contact'), gx];
    let y = H * 0.5 - ts * 1.05 - (mobile ? 40 : 60);
    els.push(text({ id: 'c1', slot: 'c1', x: W / 2, y, str: "Let's build", font: FONTS.display(700, ts), color: C.white, align: 'center', lineHeight: ts * 1.02, order: 0.15, spacing: mobile ? 1.4 : 1.8 }));
    y += ts * 1.02;
    els.push(text({ id: 'c2', slot: 'c2', x: W / 2, y, runs: [{ t: 'something ', c: C.cyan }, { t: 'legendary.', c: C.white }], font: FONTS.display(700, ts2), align: 'center', lineHeight: ts * 1.02, order: 0.3, spacing: mobile ? 1.4 : 1.8 }));
    y += ts * 1.02 + (mobile ? 32 : 48);
    const bFont = FONTS.mono(600, mobile ? 13 : 16);
    const lbl = 'Start a conversation  →';
    const bw = measure(bFont, lbl, 0.5) + 60;
    const cta = button({ id: 'cta', slot: 'cta', x: W / 2 - bw / 2, y, label: lbl, filled: true, height: mobile ? 50 : 60, font: bFont, order: 0.6 });
    els.push(cta);
    const hotspots = [{ ...cta.rect, label: 'Start a conversation', href: '/contact' }];
    // Social row.
    const links = [
      ['GitHub', 'https://github.com/paulphysio'],
      ['LinkedIn', 'https://www.linkedin.com/in/paul-madu-a69235222'],
      ['X', 'https://x.com/physiodev_1'],
      ['Email', 'mailto:madupaul.20181131453@futo.edu.ng'],
    ];
    const lf = FONTS.mono(600, mobile ? 12 : 13.5);
    const sep = mobile ? 22 : 36;
    const widths = links.map(([t]) => measure(lf, t, 1));
    const rowW = widths.reduce((s, w) => s + w, 0) + sep * (links.length - 1);
    let lx = W / 2 - rowW / 2;
    const ly = H - (mobile ? 74 : 92);
    const linkEls = links.map(([t, href], i) => {
      const el = text({ id: `s${i}`, x: lx, y: ly, str: t.toUpperCase(), font: lf, color: C.text, letterSpacing: 1, spacing: 1.1 });
      hotspots.push({ x: lx - 8, y: ly - 8, w: widths[i] + 16, h: 32, label: t, href, external: !href.startsWith('/') });
      lx += widths[i] + sep;
      return el;
    });
    els.push(group({ id: 'social', slot: 'social', order: 0.8, children: linkEls }));
    els.push(text({ id: 'copy', slot: 'copy', x: W / 2, y: H - (mobile ? 40 : 52), str: `© ${new Date().getFullYear()} Paul Madu · drawn live by ${N.toLocaleString()} drones`, font: FONTS.mono(500, mobile ? 9.5 : 11), color: C.faint, align: 'center', letterSpacing: 1, order: 0.95, spacing: 1.05, brightness: 1.6 }));
    compile(7, [{ elements: els, hotspots, weight: 1.2 }]);
  });

  return { builders, formations, assemble, sky, W, H };
}

/** Move an element (and its children) vertically. */
function shiftEl(el, dy) {
  if (!dy) return;
  const targets = el.children ? [el, ...el.children] : [el];
  targets.forEach((t) => {
    t.bbox.y += dy;
    if (t.rect) t.rect.y += dy;
    const draw = t.draw;
    if (draw) {
      t.draw = (ctx) => {
        ctx.save();
        ctx.translate(0, dy);
        draw(ctx);
        ctx.restore();
      };
    }
  });
}

/** Progress dots: a static row plus an active marker that glides between steps. */
function progressDots(dx, dy, count, active) {
  return [
    shape({
      id: 'dots-base',
      slot: 'dots-base',
      order: 0.85,
      bbox: { x: dx, y: dy - 4, w: count * 22, h: 8 },
      spacing: 1.05,
      paint(ctx) {
        ctx.fillStyle = '#3c5a73';
        for (let k = 0; k < count; k++) {
          ctx.beginPath();
          ctx.arc(dx + 6 + k * 22, dy, 2.4, 0, Math.PI * 2);
          ctx.fill();
        }
      },
    }),
    shape({
      id: `dot-${active}`,
      slot: 'dot-active',
      order: 0.95,
      bbox: { x: dx + active * 22 - 2, y: dy - 8, w: 16, h: 16 },
      spacing: 1.05,
      paint(ctx) {
        ctx.beginPath();
        ctx.arc(dx + 6 + active * 22, dy, 5.5, 0, Math.PI * 2);
        ctx.fillStyle = C.cyan;
        ctx.fill();
      },
    }),
  ];
}

/**
 * Scroll length of every formation (in viewport heights), known before the
 * scenes are built so the page height never jumps while images load.
 * Must mirror the step order produced by the builders above.
 */
export function plannedWeights(P, L) {
  return [
    1, // hero
    0.9, ...Array(6).fill(0.42), // whoami: header + 6 typed lines
    ...Array(4).fill(0.62), // manifesto
    1, // numbers
    ...Array(P).fill(1.05), // work
    ...Array(L).fill(0.85), 1, // stack + "the rest"
    1, // explore
    1.2, // contact
  ];
}

/** First formation index of each scene, in the same order. */
export function sceneStarts(P, L) {
  const counts = [1, 7, 4, 1, P, L + 1, 1, 1];
  const out = {};
  let acc = 0;
  SCENES.forEach((s, i) => {
    out[s.key] = acc;
    acc += counts[i];
  });
  return out;
}
