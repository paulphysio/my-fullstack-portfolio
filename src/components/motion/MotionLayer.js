import {
  gsap,
  ScrollTrigger,
  SplitText,
  scramble,
  restoreScrambles,
  useIsoLayoutEffect,
  prefersReducedMotion,
  isTouch,
} from '@/lib/gsap';

/*
 * Declarative scroll motion. Pages opt in with data attributes:
 *
 *   data-reveal="up|left|right|scale|clip|blur"  single element entrance
 *   data-delay="0.2"                              extra delay for data-reveal
 *   data-stagger[=".selector"]                    children cascade in (3D)
 *   data-lines                                    paragraph rises line by line
 *   data-parallax="0.3"                           scrubbed vertical drift
 *   data-count="42" [data-decimals="2"]           number counts up
 *   data-draw                                     scaleY 0→1 with scroll (lines)
 *   data-tilt                                     3D tilt + spotlight on hover
 *   data-magnetic                                 pulled toward the cursor
 *   data-skew                                     skews with scroll velocity
 *
 * Every .page-title / .section-title / [data-scramble] decrypts on enter.
 */

const FROM = {
  up: { y: 80, opacity: 0 },
  left: { x: -120, opacity: 0 },
  right: { x: 120, opacity: 0 },
  scale: { scale: 0.82, opacity: 0, y: 40 },
  clip: { clipPath: 'inset(0% 0% 100% 0%)', y: 40 },
  blur: { filter: 'blur(18px)', opacity: 0, scale: 1.06 },
};

// Elements with `transition: all` in CSS fight GSAP; pause them while animating.
const freeze = (els) => gsap.utils.toArray(els).forEach((el) => (el.style.transition = 'none'));
const thaw = (els) => gsap.utils.toArray(els).forEach((el) => (el.style.transition = ''));

export default function MotionLayer({ scope }) {
  useIsoLayoutEffect(() => {
    const root = scope.current;
    if (!root || prefersReducedMotion()) return undefined;

    const cleanups = [];
    const on = (el, type, fn, opts) => {
      el.addEventListener(type, fn, opts);
      cleanups.push(() => el.removeEventListener(type, fn, opts));
    };

    const ctx = gsap.context(() => {
      /* ---------- global chrome: progress beam + smart header ---------- */
      const bar = document.querySelector('.scroll-progress-bar');
      if (bar) {
        gsap.fromTo(
          bar,
          { scaleX: 0 },
          { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } }
        );
      }
      const header = document.querySelector('.main-header');
      if (header) {
        let hidden = false;
        ScrollTrigger.create({
          start: 0,
          end: 'max',
          onUpdate: (self) => {
            const hide = self.direction === 1 && self.scroll() > 240;
            if (hide === hidden) return;
            hidden = hide;
            gsap.to(header, { yPercent: hide ? -110 : 0, duration: 0.5, ease: 'expo.out', overwrite: true });
          },
        });
        header.classList.toggle('is-scrolled', window.scrollY > 10);
        ScrollTrigger.create({
          start: 10,
          end: 'max',
          onToggle: (self) => header.classList.toggle('is-scrolled', self.isActive),
        });
      }

      /* ---------- titles decrypt ---------- */
      gsap.utils.toArray('.page-title, .section-title, [data-scramble]', root).forEach((el) => {
        if (el.closest('[data-no-scramble]')) return;
        ScrollTrigger.create({
          trigger: el,
          start: 'top 92%',
          once: true,
          onEnter: () => scramble(el, { duration: 0.9 + Math.min(el.textContent.length, 40) * 0.012 }),
        });
        const prompt = el.querySelector('.prompt');
        if (prompt) {
          gsap.from(prompt, {
            scale: 0,
            rotate: -90,
            duration: 0.8,
            ease: 'back.out(3)',
            scrollTrigger: { trigger: el, start: 'top 92%', once: true },
          });
        }
      });

      /* ---------- single reveals ---------- */
      gsap.utils.toArray('[data-reveal]', root).forEach((el) => {
        const from = FROM[el.dataset.reveal] || FROM.up;
        gsap.from(el, {
          ...from,
          duration: 1.3,
          ease: 'expo.out',
          delay: parseFloat(el.dataset.delay) || 0,
          clearProps: 'transform,filter,clipPath',
          onStart: () => freeze(el),
          onComplete: () => thaw(el),
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      });

      /* ---------- cascading groups ---------- */
      gsap.utils.toArray('[data-stagger]', root).forEach((group) => {
        const sel = group.dataset.stagger;
        const items = sel ? group.querySelectorAll(sel) : group.children;
        if (!items.length) return;
        gsap.from(items, {
          y: 90,
          opacity: 0,
          rotateX: -28,
          transformPerspective: 1000,
          transformOrigin: '50% 0%',
          duration: 1.2,
          ease: 'expo.out',
          stagger: { each: 0.08, from: 'start' },
          clearProps: 'transform,opacity',
          onStart: () => freeze(items),
          onComplete: () => thaw(items),
          scrollTrigger: { trigger: group, start: 'top 86%', once: true },
        });
      });

      /* ---------- paragraphs line by line ---------- */
      gsap.utils.toArray('[data-lines]', root).forEach((el) => {
        const split = SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'split-line' });
        gsap.from(split.lines, {
          yPercent: 110,
          duration: 1.1,
          ease: 'expo.out',
          stagger: 0.06,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      });

      /* ---------- parallax ---------- */
      gsap.utils.toArray('[data-parallax]', root).forEach((el) => {
        const speed = parseFloat(el.dataset.parallax) || 0.2;
        gsap.fromTo(
          el,
          { y: () => speed * 160 },
          {
            y: () => -speed * 160,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
          }
        );
      });

      /* ---------- counters ---------- */
      gsap.utils.toArray('[data-count]', root).forEach((el) => {
        const end = parseFloat(el.dataset.count);
        const decimals = parseInt(el.dataset.decimals || '0', 10);
        const suffix = el.dataset.suffix || '';
        const obj = { v: 0 };
        el.textContent = (0).toFixed(decimals) + suffix;
        gsap.to(obj, {
          v: end,
          duration: 2.2,
          ease: 'expo.out',
          onUpdate: () => (el.textContent = obj.v.toFixed(decimals) + suffix),
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        });
      });

      /* ---------- drawn lines ---------- */
      gsap.utils.toArray('[data-draw]', root).forEach((el) => {
        gsap.fromTo(
          el,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            transformOrigin: '50% 0%',
            scrollTrigger: { trigger: el.parentElement, start: 'top 70%', end: 'bottom 60%', scrub: 0.6 },
          }
        );
      });

      /* ---------- velocity skew ---------- */
      const skewEls = gsap.utils.toArray('[data-skew]', root);
      if (skewEls.length) {
        const proxy = { skew: 0 };
        const setSkew = gsap.quickSetter(skewEls, 'skewY', 'deg');
        const clamp = gsap.utils.clamp(-6, 6);
        ScrollTrigger.create({
          onUpdate: (self) => {
            const skew = clamp(self.getVelocity() / -400);
            if (Math.abs(skew) > Math.abs(proxy.skew)) {
              proxy.skew = skew;
              gsap.to(proxy, {
                skew: 0,
                duration: 0.8,
                ease: 'power3',
                overwrite: true,
                onUpdate: () => setSkew(proxy.skew),
              });
            }
          },
        });
      }

      /* ---------- pointer toys (desktop only) ---------- */
      if (!isTouch()) {
        gsap.utils.toArray('[data-tilt]', root).forEach((el) => {
          el.classList.add('is-tilt');
          const rx = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power3' });
          const ry = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power3' });
          gsap.set(el, { transformPerspective: 900 });
          on(el, 'pointermove', (e) => {
            const r = el.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width;
            const py = (e.clientY - r.top) / r.height;
            ry((px - 0.5) * 14);
            rx((0.5 - py) * 14);
            el.style.setProperty('--mx', `${px * 100}%`);
            el.style.setProperty('--my', `${py * 100}%`);
          });
          on(el, 'pointerleave', () => {
            rx(0);
            ry(0);
            el.style.removeProperty('--mx');
            el.style.removeProperty('--my');
          });
        });

        gsap.utils.toArray('[data-magnetic]', root.ownerDocument).forEach((el) => {
          const strength = parseFloat(el.dataset.magnetic) || 0.35;
          const mx = gsap.quickTo(el, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.4)' });
          const my = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.4)' });
          on(el, 'pointermove', (e) => {
            const r = el.getBoundingClientRect();
            mx((e.clientX - (r.left + r.width / 2)) * strength);
            my((e.clientY - (r.top + r.height / 2)) * strength);
          });
          on(el, 'pointerleave', () => {
            mx(0);
            my(0);
          });
        });
      }
    }, root);

    // Images/fonts loading late shift layout; re-measure once settled.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    const t = setTimeout(refresh, 600);

    return () => {
      clearTimeout(t);
      window.removeEventListener('load', refresh);
      cleanups.forEach((fn) => fn());
      ctx.revert();
      restoreScrambles();
    };
  }, [scope]);

  return null;
}
