import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useRouter } from 'next/router';
import { getSky } from './stage';
import { prefersReducedMotion, isTouch } from '@/lib/gsap';

/*
 * One drone fleet for the whole site. The canvas lives here (in _app), so it
 * survives navigation: each page "claims" the fleet with its own show and
 * the drones fly from the previous page's formation into the new one.
 * Pages that don't claim it get the calm night sky.
 */

const DroneContext = createContext({ engine: null, failed: false, claim: () => {} });
export const useDrones = () => useContext(DroneContext);

export async function fontsReady() {
  if (typeof document === 'undefined' || !document.fonts?.load) return;
  const faces = [
    '700 100px "Space Grotesk"',
    '600 100px "Space Grotesk"',
    '500 40px "Space Grotesk"',
    '400 20px "Space Grotesk"',
    '400 16px "JetBrains Mono"',
    '500 16px "JetBrains Mono"',
    '600 16px "JetBrains Mono"',
  ];
  await Promise.race([
    Promise.all(faces.map((f) => document.fonts.load(f))),
    new Promise((r) => setTimeout(r, 2500)),
  ]);
}

export default function DroneProvider({ children }) {
  const stageRef = useRef(null);
  const claimed = useRef(false);
  const [engine, setEngine] = useState(null);
  const [failed, setFailed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let e;
    let cancelled = false;
    let cleanup = () => {};
    // WebGL + three.js load lazily, after the page itself is interactive.
    import('./engine').then(({ DroneEngine }) => {
      if (cancelled) return;
      try {
        e = new DroneEngine(stageRef.current, {
          N: window.innerWidth < 760 ? 30000 : 76000,
          reduce: prefersReducedMotion(),
          instant: new URLSearchParams(window.location.search).has('instant'),
        });
      } catch {
        document.documentElement.classList.remove('drones-on');
        setFailed(true);
        return;
      }
      if (isTouch()) e.u.uRepel.value = 0;
      document.documentElement.classList.add('drones-on');
      const onResize = () => e.resize();
      window.addEventListener('resize', onResize);
      window.__droneEngine = e; // debugging / automated checks
      setEngine(e);
      cleanup = () => {
        window.removeEventListener('resize', onResize);
        document.documentElement.classList.remove('drones-on');
        e.destroy();
      };
    }).catch(() => {
      // Engine chunk failed to load: show the plain-text headers instead.
      document.documentElement.classList.remove('drones-on');
      setFailed(true);
    });
    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  const toSky = useCallback(() => {
    if (!engine || claimed.current) return;
    engine.onSettle = null;
    engine.setHover(null);
    engine.setShow({
      provider: null,
      count: 0,
      sky: getSky(engine.N, window.innerWidth, window.innerHeight),
    });
  }, [engine]);

  // Unclaimed pages (404, etc.): drift back into the night sky.
  useEffect(() => {
    if (!engine) return undefined;
    const t = setTimeout(toSky, 1200);
    const onStart = () => {
      claimed.current = false;
    };
    let t2;
    const onDone = () => {
      clearTimeout(t2);
      t2 = setTimeout(toSky, 500);
    };
    router.events.on('routeChangeStart', onStart);
    router.events.on('routeChangeComplete', onDone);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
      router.events.off('routeChangeStart', onStart);
      router.events.off('routeChangeComplete', onDone);
    };
  }, [engine, router, toSky]);

  const claim = useCallback(() => {
    claimed.current = true;
  }, []);
  const value = useMemo(() => ({ engine, failed, claim }), [engine, failed, claim]);

  return (
    <DroneContext.Provider value={value}>
      <div ref={stageRef} className="drone-stage" aria-hidden="true" />
      {children}
    </DroneContext.Provider>
  );
}
