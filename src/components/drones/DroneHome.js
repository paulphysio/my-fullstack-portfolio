import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Snap from 'lenis/snap';
import { DroneEngine } from './engine';
import { createShow, plannedWeights, sceneStarts } from './show';
import { prefersReducedMotion, isTouch } from '@/lib/gsap';

/*
 * The home page as a drone show. The canvas draws everything; this component
 *  - builds the show (fonts → hero → remaining scenes as images arrive),
 *  - maps scroll position → formation index (with resting plateaus + snap),
 *  - lays invisible, real links over drone-drawn buttons and cards,
 *  - keeps the full content in the DOM for screen readers & search engines.
 */

const smoothstep = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

const loadImage = (src) =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });

async function fontsReady() {
  if (!document.fonts?.load) return;
  const faces = [
    '700 100px "Space Grotesk"',
    '600 100px "Space Grotesk"',
    '500 40px "Space Grotesk"',
    '400 20px "Space Grotesk"',
    '400 16px "JetBrains Mono"',
    '500 16px "JetBrains Mono"',
    '600 16px "JetBrains Mono"',
  ];
  await Promise.race([Promise.all(faces.map((f) => document.fonts.load(f))), new Promise((r) => setTimeout(r, 2500))]);
}

export default function DroneHome({ data, children }) {
  const stageRef = useRef(null);
  const spacerRef = useRef(null);
  const engineRef = useRef(null);
  const showRef = useRef(null);
  const planRef = useRef({ starts: [], total: 0 });
  const [active, setActive] = useState(-1);
  const [failed, setFailed] = useState(false);
  const [layoutKey, setLayoutKey] = useState(0);
  const firstRun = useRef(true);

  const P = data.projects.length;
  const L = data.logos.length;

  /* ---------- scroll plan ---------- */
  const scrollToFormation = (idx) => {
    const { starts } = planRef.current;
    const y = (starts[idx] ?? 0) + 2;
    if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1.6 });
    else window.scrollTo({ top: y, behavior: 'smooth' });
  };
  const goScene = (key) => scrollToFormation(sceneStarts(P, L)[key] ?? 0);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;
    let disposed = false;
    const W = window.innerWidth;
    const H = window.innerHeight;
    const mobile = W < 760;
    const reduce = prefersReducedMotion();
    const instant = new URLSearchParams(window.location.search).has('instant');
    const N = mobile ? 30000 : 76000;

    /* plan the scroll before anything is built */
    const weights = plannedWeights(P, L);
    const unit = H * (mobile ? 1.15 : 1.3);
    const starts = [];
    let acc = 0;
    weights.forEach((w) => {
      starts.push(acc);
      acc += w * unit;
    });
    const last = starts[starts.length - 1];
    planRef.current = { starts, total: last };
    window.__dronePlan = starts; // handy for debugging / automated visual checks
    spacerRef.current.style.height = `${last + H}px`;

    let engine;
    try {
      engine = new DroneEngine(stage, { N, reduce, instant, provider: (i) => showRef.current.assemble(i), onSettle: setActive });
    } catch {
      setFailed(true);
      return undefined;
    }
    engineRef.current = engine;
    if (!firstRun.current) engine.intro.v = 1; // re-layout: no second intro
    firstRun.current = false;
    if (isTouch()) engine.u.uRepel.value = 0;

    const onScroll = () => {
      const y = window.scrollY;
      let i = 0;
      while (i < starts.length - 1 && starts[i + 1] <= y) i++;
      if (i >= starts.length - 1) {
        engine.target = starts.length - 1;
        return;
      }
      const f = (y - starts[i]) / (starts[i + 1] - starts[i]);
      engine.target = i + smoothstep(0.3, 1, f);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // Gentle snap onto each formation's resting plateau.
    let snap;
    if (window.__lenis && !reduce) {
      snap = new Snap(window.__lenis, { type: 'proximity', distanceThreshold: '30%', debounce: 320, duration: 1.4 });
      starts.forEach((s, i) => {
        const len = (starts[i + 1] ?? s + unit) - s;
        snap.add(s + len * 0.12);
      });
    }

    /* build: hero first, then the rest as their images arrive */
    (async () => {
      await fontsReady();
      if (disposed) return;
      const images = {};
      const want = [...data.projects.map((p) => p.image), ...data.logos.map((l) => l.image)];
      const loads = Object.fromEntries(want.map((src) => [src, loadImage(src).then((img) => (images[src] = img))]));
      const show = createShow({ W, H, N, mobile, data: { ...data, images } });
      showRef.current = show;
      engine.sky = show.sky;
      for (let b = 0; b < show.builders.length; b++) {
        if (b === 4) await Promise.all(data.projects.map((p) => loads[p.image]));
        if (b === 5) await Promise.all(data.logos.map((l) => loads[l.image]));
        if (disposed) return;
        show.builders[b]();
        engine.setAvailable(show.formations.length);
        if (b === 0) {
          engine.start();
          onScroll();
        }
        await new Promise((r) => setTimeout(r, 0)); // keep the main thread breathing
      }
    })();

    /* re-layout on meaningful resizes */
    let rt;
    const onResize = () => {
      clearTimeout(rt);
      rt = setTimeout(() => {
        const dw = Math.abs(window.innerWidth - W);
        const dh = Math.abs(window.innerHeight - H);
        if (dw > 40 || (!mobile && dh > 120)) setLayoutKey((k) => k + 1);
        else engine.resize();
      }, 300);
    };
    window.addEventListener('resize', onResize);

    return () => {
      disposed = true;
      clearTimeout(rt);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      snap?.destroy?.();
      engine.destroy();
      engineRef.current = null;
      setActive(-1);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layoutKey]);

  const hotspots = active >= 0 ? showRef.current?.formations[active]?.hotspots || [] : [];
  const hover = (h) => engineRef.current?.setHover(h);

  return (
    <>
      <div ref={stageRef} className="drone-stage" aria-hidden="true" />
      <div ref={spacerRef} className="drone-spacer" />

      <nav className="drone-hotspots" aria-label="Home page actions">
        {hotspots.map((h, i) => {
          const style = { left: h.x, top: h.y, width: h.w, height: h.h };
          const key = `${active}-${i}`;
          const common = {
            className: 'drone-hotspot',
            style,
            'aria-label': h.label,
            onMouseEnter: () => hover(h),
            onMouseLeave: () => hover(null),
            onFocus: () => hover(h),
            onBlur: () => hover(null),
            'data-cursor': h.scene ? 'Go' : h.external ? 'Visit' : 'Open',
          };
          if (h.scene) return <button key={key} type="button" {...common} onClick={() => goScene(h.scene)} />;
          if (h.external) return <a key={key} {...common} href={h.href} target="_blank" rel="noopener noreferrer" />;
          return <Link key={key} {...common} href={h.href} />;
        })}
      </nav>

      {/* Full content for assistive tech, search engines — and the no-WebGL fallback. */}
      <div className={failed ? 'drone-fallback' : 'sr-only'}>{children}</div>
    </>
  );
}
