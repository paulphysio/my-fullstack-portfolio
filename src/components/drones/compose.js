/*
 * Drone "print" toolkit.
 *
 * Scenes are designed like slides, in CSS pixels of the viewport. Every
 * element knows how to draw itself onto a canvas; `sampleElement` then lays a
 * hexagonal drone lattice over the drawing and keeps the lattice points that
 * land on ink, taking the ink's colour. Result: a list of drones (x, y, z in
 * px, r, g, b, size) that reproduce the design exactly where it was laid out.
 */

export const FONTS = {
  display: (weight, px) => `${weight} ${px}px "Space Grotesk", "Segoe UI", sans-serif`,
  mono: (weight, px) => `${weight} ${px}px "JetBrains Mono", Consolas, monospace`,
};

export const C = {
  white: '#f4fbff',
  text: '#e6edf3',
  dim: '#a7b4c4',
  faint: '#4a5568',
  cyan: '#00f0ff',
  green: '#00ff9f',
  violet: '#b185ff',
  pink: '#ff4fd8',
  red: '#ff5f56',
  yellow: '#ffbd2e',
  okgreen: '#27c93f',
  ink: '#05081a',
};

const SCALE = 2; // supersample drawings for crisp small text
let measureCtx;
export function measure(font, text, letterSpacing = 0) {
  if (!measureCtx) measureCtx = document.createElement('canvas').getContext('2d');
  measureCtx.font = font;
  return measureCtx.measureText(text).width + letterSpacing * Math.max(0, text.length - 1);
}

/**
 * Largest font size (≤ cap) at which every line fits in maxWidth.
 * `lines` are strings or run arrays [{ t }]; `fontAt(px)` builds the font.
 */
export function fitSize(lines, fontAt, maxWidth, cap) {
  const widest = Math.max(
    ...lines.map((l) => (Array.isArray(l) ? l.reduce((s, r) => s + measure(fontAt(100), r.t), 0) : measure(fontAt(100), l)))
  );
  return Math.min(cap, (maxWidth / widest) * 100);
}

export function wrap(text, font, maxWidth, letterSpacing = 0) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  words.forEach((w) => {
    const test = line ? `${line} ${w}` : w;
    if (line && measure(font, test, letterSpacing) > maxWidth) {
      lines.push(line);
      line = w;
    } else line = test;
  });
  if (line) lines.push(line);
  return lines;
}

/* ------------------------------------------------------------------------ */
/* Element factories. Each returns { id, slot, bbox, draw(ctx), spacing, ... }*/
/* ------------------------------------------------------------------------ */

/**
 * Text. `runs` lets one line mix colours: [{ t: 'Solana', c: C.green }].
 * Multi-line text wraps at maxWidth. Returns the element plus its height.
 */
export function text({
  id,
  slot,
  x,
  y,
  str,
  runs,
  font,
  color = C.text,
  align = 'left',
  maxWidth = 10000,
  lineHeight,
  letterSpacing = 0,
  spacing = 1.6,
  size,
  order = 0.5,
  gradient,
  stroke = 0,
  maxLines = 99,
  brightness = 1,
}) {
  const px = parseFloat(font.match(/(\d+(\.\d+)?)px/)[1]);
  // Small type needs a finer lattice to stay legible.
  spacing = Math.min(spacing, Math.max(0.82, px / 13.5));
  const lh = lineHeight || px * 1.3;
  const lines = runs ? [runs] : wrap(str, font, maxWidth, letterSpacing).slice(0, maxLines);
  const widths = lines.map((l) =>
    Array.isArray(l) ? l.reduce((s, r) => s + measure(font, r.t, letterSpacing), 0) : measure(font, l, letterSpacing)
  );
  const w = Math.max(...widths, 1);
  const h = lh * lines.length;
  const left = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x;
  const pad = Math.ceil(px * 0.3 + stroke);
  return {
    id,
    slot,
    order,
    spacing,
    size,
    brightness,
    height: h,
    width: w,
    bbox: { x: left - pad, y: y - pad, w: w + pad * 2, h: h + pad * 2 },
    draw(ctx) {
      ctx.font = font;
      ctx.textBaseline = 'top';
      if ('letterSpacing' in ctx) ctx.letterSpacing = `${letterSpacing}px`;
      lines.forEach((l, i) => {
        const lw = widths[i];
        let cx = align === 'center' ? x - lw / 2 : align === 'right' ? x - lw : x;
        const cy = y + i * lh + (lh - px) / 2;
        const segs = Array.isArray(l) ? l : [{ t: l, c: color }];
        segs.forEach((r) => {
          let fill = r.c || color;
          if (gradient) {
            const g = ctx.createLinearGradient(0, cy, 0, cy + px);
            g.addColorStop(0, gradient[0]);
            g.addColorStop(1, gradient[1]);
            fill = g;
          }
          if (stroke) {
            ctx.lineWidth = stroke;
            ctx.lineJoin = 'round';
            ctx.strokeStyle = fill;
            ctx.strokeText(r.t, cx, cy);
          } else {
            ctx.fillStyle = fill;
            ctx.fillText(r.t, cx, cy);
          }
          cx += measure(font, r.t, letterSpacing);
        });
      });
    },
  };
}

function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Generic vector drawing (frames, rules, dots, icons) in absolute px. */
export function shape({ id, slot, bbox, paint, spacing = 1.7, size, order = 0.5, brightness = 1 }) {
  const pad = 6;
  return {
    id,
    slot,
    order,
    spacing,
    size,
    brightness,
    bbox: { x: bbox.x - pad, y: bbox.y - pad, w: bbox.w + pad * 2, h: bbox.h + pad * 2 },
    draw: paint,
  };
}

export function frame({ id, slot, x, y, w, h, r = 12, color = C.cyan, lineWidth = 1.5, fill, order, spacing = 1.6, brightness }) {
  return shape({
    id,
    slot,
    order,
    spacing,
    brightness,
    bbox: { x, y, w, h },
    paint(ctx) {
      roundRectPath(ctx, x, y, w, h, r);
      if (fill) {
        ctx.fillStyle = fill;
        ctx.fill();
      }
      if (lineWidth) {
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;
        ctx.stroke();
      }
    },
  });
}

/** Pill button. Filled buttons punch the label out of the fill (negative space). */
export function button({ id, slot, x, y, label, filled = false, height = 54, font, order = 0.8, color = C.cyan, align = 'left' }) {
  const f = font || FONTS.mono(600, 15);
  const padX = 30;
  const w = measure(f, label, 0.5) + padX * 2;
  const left = align === 'center' ? x - w / 2 : x;
  const el = shape({
    id,
    slot,
    order,
    // Filled pills read their label as negative space: needs a fine lattice.
    spacing: filled ? 1.15 : 1.25,
    bbox: { x: left, y, w, h: height },
    paint(ctx) {
      roundRectPath(ctx, left + 1, y + 1, w - 2, height - 2, height / 2);
      ctx.font = f;
      ctx.textBaseline = 'middle';
      if ('letterSpacing' in ctx) ctx.letterSpacing = '0.5px';
      if (filled) {
        ctx.fillStyle = color;
        ctx.fill();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = '#000';
        ctx.fillText(label, left + padX, y + height / 2 + 1);
        ctx.globalCompositeOperation = 'source-over';
      } else {
        ctx.lineWidth = 1.6;
        ctx.strokeStyle = color;
        ctx.stroke();
        ctx.fillStyle = color;
        ctx.fillText(label, left + padX, y + height / 2 + 1);
      }
    },
  });
  el.rect = { x: left, y, w, h: height };
  return el;
}

/** Row of outline tag pills; returns element and total height. */
export function tags({ id, slot, x, y, items, maxWidth, order = 0.7, color = C.cyan }) {
  const f = FONTS.mono(500, 12.5);
  const h = 28;
  const gap = 8;
  const placed = [];
  let cx = x;
  let cy = y;
  items.forEach((raw) => {
    // A pill never outgrows the column: long labels end in an ellipsis.
    let t = raw;
    while (measure(f, t) + 24 > maxWidth && t.length > 4) t = `${t.slice(0, -2).trimEnd()}…`;
    const w = measure(f, t) + 24;
    if (cx + w > x + maxWidth && cx > x) {
      cx = x;
      cy += h + gap;
    }
    placed.push({ t, x: cx, y: cy, w });
    cx += w + gap;
  });
  const total = cy - y + h;
  const el = shape({
    id,
    slot,
    order,
    spacing: 1.35,
    bbox: { x, y, w: maxWidth, h: total },
    paint(ctx) {
      ctx.font = f;
      ctx.textBaseline = 'middle';
      placed.forEach((p) => {
        roundRectPath(ctx, p.x, p.y, p.w, h, h / 2);
        ctx.lineWidth = 1.1;
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.65;
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.fillStyle = color;
        ctx.fillText(p.t, p.x + 12, p.y + h / 2 + 1);
      });
    },
  });
  el.height = total;
  return el;
}

/** Image fitted into a box. mask: 'none' keeps every pixel, 'lum' keeps bright ones. */
export function picture({ id, slot, img, x, y, w, h, fit = 'contain', mask = 'none', spacing = 2.6, order = 0.4, radius = 0, alignTop = false, brightness = 1 }) {
  const ar = img.naturalWidth / img.naturalHeight;
  let dw = w;
  let dh = w / ar;
  if ((fit === 'contain' && dh > h) || (fit === 'cover' && dh < h)) {
    dh = h;
    dw = h * ar;
  }
  const dx = x + (w - dw) / 2;
  const dy = alignTop ? y : y + (h - dh) / 2;
  const el = shape({
    id,
    slot,
    order,
    spacing,
    brightness,
    bbox: fit === 'cover' ? { x, y, w, h } : { x: dx, y: dy, w: dw, h: dh },
    paint(ctx) {
      ctx.save();
      if (fit === 'cover' || radius) {
        roundRectPath(ctx, x, y, w, h, radius);
        ctx.clip();
      }
      ctx.drawImage(img, dx, dy, dw, dh);
      ctx.restore();
    },
  });
  el.mask = mask;
  el.drawn = { x: dx, y: dy, w: dw, h: dh };
  if (mask === 'none') {
    el.exposure = autoExposure(img);
    el.relief = 10;
  }
  return el;
}

function autoExposure(img) {
  const c = document.createElement('canvas');
  c.width = 48;
  c.height = Math.max(1, Math.round((48 * img.naturalHeight) / img.naturalWidth));
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, c.width, c.height);
  const d = ctx.getImageData(0, 0, c.width, c.height).data;
  let s = 0;
  for (let i = 0; i < d.length; i += 4) s += (0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]) / 255;
  const mean = s / (d.length / 4);
  return Math.min(2.2, Math.max(0.95, 0.42 / Math.max(mean, 0.05)));
}

/** Several elements that always move together (a card: frame + icon + text). */
export function group({ id, slot, children, order = 0.5 }) {
  return { id, slot, order, children };
}

/** Procedural 3D element: provide drones directly (px space, z toward viewer). */
export function points({ id, slot, drones, spin = false, pivot, order = 0.3 }) {
  return { id, slot, order, drones, spin, pivot, procedural: true };
}

/* ------------------------------------------------------------------------ */
/* Sampling                                                                 */
/* ------------------------------------------------------------------------ */

const hexToRgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};
export const rgb = hexToRgb;

/**
 * Lattice-sample one element → Float32Array of drones
 * [x, y, z, r, g, b, size] × count (px units).
 */
export function sampleElement(el, spacingScale = 1) {
  if (el.procedural) return el.drones;
  if (el.children) {
    const parts = el.children.map((c) => sampleElement(c, spacingScale));
    const out = new Float32Array(parts.reduce((s, p) => s + p.length, 0));
    let o = 0;
    parts.forEach((p) => {
      out.set(p, o);
      o += p.length;
    });
    return out;
  }
  const { bbox } = el;
  const cw = Math.max(1, Math.ceil(bbox.w * SCALE));
  const ch = Math.max(1, Math.ceil(bbox.h * SCALE));
  const cvs = document.createElement('canvas');
  cvs.width = cw;
  cvs.height = ch;
  const ctx = cvs.getContext('2d', { willReadFrequently: true });
  ctx.scale(SCALE, SCALE);
  ctx.translate(-bbox.x, -bbox.y);
  el.draw(ctx);
  const data = ctx.getImageData(0, 0, cw, ch).data;

  const s = el.spacing * spacingScale;
  const size = (el.size || s * 1.32) * Math.sqrt(spacingScale);
  const rowH = s * 0.866; // hexagonal packing
  const out = [];
  const gain = el.exposure || 1;
  const bright = el.brightness ?? 1;
  let row = 0;
  for (let py = bbox.y + rowH / 2; py < bbox.y + bbox.h; py += rowH, row++) {
    const shift = row % 2 ? s / 2 : 0;
    for (let px = bbox.x + s / 2 + shift; px < bbox.x + bbox.w; px += s) {
      const ix = Math.min(cw - 1, Math.floor((px - bbox.x) * SCALE));
      const iy = Math.min(ch - 1, Math.floor((py - bbox.y) * SCALE));
      const o = (iy * cw + ix) * 4;
      const a = data[o + 3];
      let r = data[o] / 255;
      let g = data[o + 1] / 255;
      let b = data[o + 2] / 255;
      if (el.mask === 'none') {
        if (a < 20) continue;
        r = Math.min(1, Math.pow(r, 0.9) * gain * 0.85 + 0.03);
        g = Math.min(1, Math.pow(g, 0.9) * gain * 0.85 + 0.03);
        b = Math.min(1, Math.pow(b, 0.9) * gain * 0.85 + 0.03);
      } else if (el.mask === 'lum') {
        const l = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        const inWatermark =
          px > el.drawn.x + el.drawn.w * 0.83 && py > el.drawn.y + el.drawn.h * 0.84; // generator mark
        if (l < 0.16 || a < 100 || inWatermark) continue;
        r = Math.min(1, r * 1.35);
        g = Math.min(1, g * 1.35);
        b = Math.min(1, b * 1.35);
      } else {
        // Keep anti-aliased edges and translucent strokes, dimmed by their coverage.
        if (a < 45) continue;
        const cov = Math.min(1, a / 210);
        r *= cov;
        g *= cov;
        b *= cov;
      }
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      out.push(px, py, (el.relief || 0) * lum, r * bright, g * bright, b * bright, size);
    }
  }
  return new Float32Array(out);
}
