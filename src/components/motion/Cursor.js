import { useEffect, useRef } from 'react';
import { gsap, isTouch, prefersReducedMotion } from '@/lib/gsap';

/**
 * Two-part cursor: a precise dot plus a lagging ring that inverts whatever it
 * passes over. It swells on interactive elements and shows a label for
 * anything carrying data-cursor="Label".
 */
export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    if (isTouch() || prefersReducedMotion()) return undefined;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    document.documentElement.classList.add('has-custom-cursor');

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, x: -100, y: -100 });
    const dotX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power2.out' });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power2.out' });
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' });
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' });

    let state = '';
    const setState = (next, text = '') => {
      if (next === state && label.textContent === text) return;
      state = next;
      label.textContent = text;
      ring.dataset.state = next;
      const size = next === 'label' ? 104 : next === 'hover' ? 64 : 34;
      gsap.to(ring, { width: size, height: size, scale: 1, duration: 0.5, ease: 'expo.out' });
      gsap.to(dot, { scale: next ? 0 : 1, duration: 0.3 });
    };

    const onMove = (e) => {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
      const labelled = e.target.closest?.('[data-cursor]');
      if (labelled) setState('label', labelled.dataset.cursor);
      else if (e.target.closest?.('a, button, input, textarea, select, [role="button"], .stack-badge-wrapper'))
        setState('hover');
      else setState('');
    };
    const onDown = () => gsap.to(ring, { scale: 0.8, duration: 0.15 });
    const onUp = () => setState(state, label.textContent);
    const onLeave = () => gsap.to([dot, ring], { opacity: 0, duration: 0.3 });
    const onEnter = () => gsap.to([dot, ring], { opacity: 1, duration: 0.3 });

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    return () => {
      document.documentElement.classList.remove('has-custom-cursor');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
    };
  }, []);

  return (
    <div className="cursor-layer" aria-hidden="true">
      <div ref={ringRef} className="cursor-ring">
        <span ref={labelRef} className="cursor-label" />
      </div>
      <div ref={dotRef} className="cursor-dot" />
    </div>
  );
}
