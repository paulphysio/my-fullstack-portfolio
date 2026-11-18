import { useEffect, useRef } from 'react';
import { createStage } from './stage';
import { useDrones, fontsReady } from './DroneProvider';
import { FONTS, C, text, shape, fitSize, wrap } from './compose';

/*
 * Drones on content pages.
 *
 * Every page opens with a drone-drawn title in its header area. Scrolling
 * past it releases the drones into the night sky behind the (real, readable)
 * content. Pages can add named moments — `api.show('shot:sempaihq')` — and
 * return to the scroll-driven state with `api.clear()`.
 */

export const loadImage = (src) =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });

/** Layout metrics that match the DOM content box of <Layout>. */
function metrics() {
  const W = window.innerWidth;
  const H = window.innerHeight;
  const mobile = W < 760;
  const head = document.querySelector('.drone-header');
  const r = head?.getBoundingClientRect();
  // Align with the page's real content column (it differs between pages).
  const M = r ? r.left : Math.max(16, (W - 1200) / 2 + 16);
  const CW = r ? r.width : Math.min(1200, W) - 32;
  const region = r
    ? { top: r.top + window.scrollY, bottom: r.bottom + window.scrollY }
    : { top: mobile ? 100 : 110, bottom: H * 0.62 };
  return { W, H, mobile, M, CW, region };
}

/**
 * @param build  async (ctx) => [{ key, elements }]  — first entry is the title.
 * @param extras optional async (ctx) => [{ key, elements }] — added when ready
 *               (e.g. screenshots that need to download first).
 */
export function usePageDrones(build, extras, deps = []) {
  const { engine, claim } = useDrones();
  const api = useRef({ show: () => {}, clear: () => {} });

  useEffect(() => {
    if (!engine) return undefined;
    claim();
    let disposed = false;
    let page = null;
    let overrideKey = null;
    let threshold = 200;
    let lastW = window.innerWidth;

    const desired = () => {
      if (!page) return null;
      if (overrideKey && page.keys[overrideKey] !== undefined) return page.keys[overrideKey];
      return window.scrollY > threshold ? 1 : 0; // 0 = title, 1 = night sky
    };
    const sync = () => {
      const i = desired();
      if (i !== null) engine.goTo(i);
    };

    const make = async () => {
      await fontsReady();
      if (disposed) return;
      const ctx = metrics();
      threshold = Math.max(120, (ctx.region.bottom - ctx.region.top) * 0.32);
      const stage = createStage({ W: ctx.W, H: ctx.H, N: engine.N });
      const keys = {};
      const add = (list) =>
        list.forEach((sc) => {
          keys[sc.key] = stage.compile(Object.keys(keys).length, [{ elements: sc.elements, key: sc.key }]);
        });
      const first = await build(ctx);
      if (disposed) return;
      add([first[0], { key: 'sky', elements: [] }, ...first.slice(1)]);
      page = { stage, keys };
      engine.onSettle = null;
      engine.setHover(null);
      engine.setShow({ provider: stage.assemble, count: stage.formations.length, sky: stage.sky, start: desired() });
      if (extras) {
        const more = await extras(ctx);
        if (disposed || page.stage !== stage) return;
        add(more);
        engine.setAvailable(stage.formations.length);
        sync();
      }
    };
    make();

    api.current = {
      show: (key) => {
        overrideKey = key;
        sync();
      },
      clear: () => {
        overrideKey = null;
        sync();
      },
    };

    const onScroll = () => sync();
    let rt;
    const onResize = () => {
      clearTimeout(rt);
      rt = setTimeout(() => {
        if (Math.abs(window.innerWidth - lastW) > 40) {
          lastW = window.innerWidth;
          make();
        }
      }, 300);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      disposed = true;
      clearTimeout(rt);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      api.current = { show: () => {}, clear: () => {} };
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engine, ...deps]);

  return api;
}

/**
 * The house style for page titles: command eyebrow, big gradient title,
 * supporting line and a meta row — left-aligned to the content column and
 * vertically centred in the header area.
 */
export function titleScene(ctx, { eyebrow, title, sub, meta, longTitle = false, maxWidth }) {
  const { M, CW, mobile, region } = ctx;
  const colW = maxWidth ? Math.min(CW, maxWidth) : CW;
  const ebSize = mobile ? 11 : 13;
  let titleLines;
  let ts;
  if (longTitle) {
    // Shrink until the whole title fits in three lines.
    ts = mobile ? 32 : Math.min(64, colW * 0.065);
    titleLines = wrap(title, FONTS.display(700, ts), colW);
    while (titleLines.length > 3 && ts > 18) {
      ts -= 2;
      titleLines = wrap(title, FONTS.display(700, ts), colW);
    }
  } else {
    ts = fitSize([title], (p) => FONTS.display(700, p), colW, mobile ? 76 : 168);
    titleLines = [title];
  }
  const lh = ts * (longTitle ? 1.08 : 0.98);
  const subSize = mobile ? 15 : 20;
  const subLines = sub ? wrap(sub, FONTS.display(400, subSize), Math.min(colW, 760)).slice(0, 3) : [];
  const gap1 = mobile ? 16 : 22;
  const gap2 = mobile ? 18 : 26;
  const total =
    ebSize + gap1 + lh * titleLines.length + (subLines.length ? gap2 + subLines.length * subSize * 1.5 : 0) + (meta ? gap2 + 14 : 0);
  let y = region.top + Math.max(0, (region.bottom - region.top - total) / 2);
  const els = [];
  const ruleY = y + ebSize / 2 - 1; // captured now: `y` keeps moving below
  els.push(
    shape({
      id: 'rule',
      slot: 'rule',
      order: 0,
      bbox: { x: M, y: ruleY, w: 28, h: 2 },
      spacing: 1,
      paint(c) {
        c.fillStyle = C.green;
        c.fillRect(M, ruleY, 28, 2);
      },
    })
  );
  els.push(text({ id: 'eb', slot: 'eb', x: M + 40, y, str: eyebrow, font: FONTS.mono(600, ebSize), color: C.green, letterSpacing: 3, order: 0.05 }));
  y += ebSize + gap1;
  els.push(
    text({
      id: 'title',
      slot: 'title',
      x: M,
      y,
      str: titleLines.join(' '),
      font: FONTS.display(700, ts),
      lineHeight: lh,
      maxWidth: colW,
      maxLines: 3,
      gradient: ['#ffffff', '#8ff6ff'],
      order: 0.15,
      spacing: mobile ? 1.3 : longTitle ? 1.35 : 1.8,
    })
  );
  y += lh * titleLines.length;
  if (subLines.length) {
    y += gap2;
    els.push(text({ id: 'sub', slot: 'sub', x: M, y, str: sub, font: FONTS.display(400, subSize), color: C.dim, maxWidth: Math.min(colW, 760), lineHeight: subSize * 1.5, maxLines: 3, order: 0.45 }));
    y += subLines.length * subSize * 1.5;
  }
  if (meta) {
    y += gap2;
    els.push(text({ id: 'meta', slot: 'meta', x: M, y, str: meta.toUpperCase(), font: FONTS.mono(500, mobile ? 10.5 : 12), color: C.cyan, letterSpacing: 2.5, maxWidth: colW, order: 0.7 }));
  }
  return els;
}

/** DOM side: reserves the header area and holds the real (accessible) title. */
export function DroneHeader({ eyebrow, title, sub, meta, tall = false, decorativeTitle = false }) {
  return (
    <header className={`drone-header${tall ? ' drone-header--tall' : ''}`}>
      <div className="drone-header-fallback">
        <p className="drone-header-eyebrow">{eyebrow}</p>
        {decorativeTitle ? (
          <p className={`drone-header-title${title.length > 32 ? ' is-long' : ''}`}>{title}</p>
        ) : (
          <h1 className={`drone-header-title${title.length > 32 ? ' is-long' : ''}`}>{title}</h1>
        )}
        {sub && <p className="drone-header-sub">{sub}</p>}
        {meta && <p className="drone-header-meta">{meta}</p>}
      </div>
    </header>
  );
}
