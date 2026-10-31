'use client';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Page choreography, driven by data attributes in the server-rendered markup:
 * data-hero (intro cascade), data-reveal (rise on scroll), data-stagger (children cascade),
 * data-line / data-dot (timeline rail drawn by scroll), data-parallax, data-progress.
 * Reduced-motion visitors get opacity-only fades: same polish, no movement.
 * Only opacity is animated (never autoAlpha/visibility), so content not yet scrolled to stays
 * readable for assistive tech, AI agents and link previews.
 */
export default function Animations() {
  useGSAP(() => {
    gsap.fromTo('[data-progress]', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });

    gsap.matchMedia().add({ full: '(prefers-reduced-motion: no-preference)', reduced: '(prefers-reduced-motion: reduce)' }, (ctx) => {
      const { full } = ctx.conditions as { full: boolean };
      const once = (trigger: Element, start = 'top 88%') => ({ trigger, start, once: true });

      gsap.from('[data-hero]', { opacity: 0, y: full ? 32 : 0, duration: 1, ease: 'power3.out', stagger: 0.12, delay: 0.35 });

      for (const el of gsap.utils.toArray<HTMLElement>('[data-reveal]')) {
        gsap.from(el, { opacity: 0, y: full ? 40 : 0, duration: 0.9, ease: 'power3.out', scrollTrigger: once(el) });
      }
      for (const el of gsap.utils.toArray<HTMLElement>('[data-stagger]')) {
        gsap.from(el.children, {
          opacity: 0,
          y: full ? 28 : 0,
          scale: full ? 0.96 : 1,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.06,
          scrollTrigger: once(el),
        });
      }
      if (!full) return;

      for (const line of gsap.utils.toArray<HTMLElement>('[data-line]')) {
        gsap.fromTo(line, { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: line.parentElement, start: 'top 75%', end: 'bottom 55%', scrub: 0.5 } });
      }
      for (const dot of gsap.utils.toArray<HTMLElement>('[data-dot]')) {
        gsap.from(dot, { scale: 0, duration: 0.6, ease: 'back.out(3)', scrollTrigger: once(dot, 'top 75%') });
      }
      gsap.to('[data-parallax]', { yPercent: -12, opacity: 0.15, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });

      // Header slides away while reading down and returns on the way back up.
      ScrollTrigger.create({
        start: 160,
        end: 'max',
        onUpdate: (self) => gsap.to('header', { yPercent: self.direction === 1 ? -100 : 0, duration: 0.35, ease: 'power2.out', overwrite: true }),
        onLeaveBack: () => gsap.to('header', { yPercent: 0, duration: 0.35, overwrite: true }),
      });
    });
  });
  return null;
}
