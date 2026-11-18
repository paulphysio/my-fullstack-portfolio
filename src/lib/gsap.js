// Single place that registers GSAP plugins (client only) so every
// component shares the same ScrollTrigger instance.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { SplitText } from 'gsap/dist/SplitText';
import { useEffect, useLayoutEffect } from 'react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  gsap.defaults({ ease: 'power3.out', duration: 1 });
}

// useLayoutEffect on the client (so hidden "from" states are applied before
// first paint, no flash), useEffect on the server (no warning).
export const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const isTouch = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

const GLYPHS = '01<>/\\[]{}_-=+*#$%&!?;:ABCDEFabcdef';
const ORIGINALS = new WeakMap();
const touched = new Set();

/** Put every scrambled text node back to its real text (used on cleanup). */
export function restoreScrambles() {
  touched.forEach((node) => {
    if (ORIGINALS.has(node)) node.nodeValue = ORIGINALS.get(node);
  });
  touched.clear();
}

/**
 * Terminal "decrypt" effect. Only rewrites nodeValue of existing text nodes,
 * so it is safe on React-owned markup (no nodes are added or removed).
 */
export function scramble(el, { duration = 1.1, skip = '.prompt', delay = 0 } = {}) {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) =>
      n.nodeValue.trim() && !(skip && n.parentElement?.closest(skip))
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT,
  });
  const nodes = [];
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (!ORIGINALS.has(node)) ORIGINALS.set(node, node.nodeValue);
    touched.add(node);
    nodes.push({ node, text: ORIGINALS.get(node) });
  }
  if (!nodes.length) return null;

  const state = { p: 0 };
  const render = () => {
    nodes.forEach(({ node, text }) => {
      let out = '';
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        const reveal = state.p * (text.length + 6) - i;
        if (ch === ' ' || reveal >= 6) out += ch;
        else if (reveal > 0 || state.p > 0) out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
        else out += ' ';
      }
      node.nodeValue = out;
    });
  };
  render();
  return gsap.to(state, {
    p: 1,
    duration,
    delay,
    ease: 'none',
    onUpdate: render,
    onComplete: () => nodes.forEach(({ node, text }) => (node.nodeValue = text)),
    onInterrupt: () => nodes.forEach(({ node, text }) => (node.nodeValue = text)),
  });
}

export { gsap, ScrollTrigger, SplitText };
