import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap';

/**
 * Inertia smooth-scrolling (Lenis) driven by GSAP's ticker so every
 * ScrollTrigger animation stays perfectly in sync with the scroll position.
 */
export default function SmoothScroll() {
  const router = useRouter();

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
      smoothWheel: true,
    });
    window.__lenis = lenis;

    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Anchor links (#id) glide instead of jumping.
    const onClick = (e) => {
      const a = e.target.closest?.('a[href^="#"]');
      if (!a) return;
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: -80 });
      }
    };
    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
      gsap.ticker.remove(tick);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);

  // New page → start at the top and let triggers re-measure.
  useEffect(() => {
    const onDone = () => {
      window.__lenis?.scrollTo(0, { immediate: true, force: true });
      requestAnimationFrame(() => ScrollTrigger.refresh());
    };
    router.events.on('routeChangeComplete', onDone);
    return () => router.events.off('routeChangeComplete', onDone);
  }, [router]);

  return null;
}
