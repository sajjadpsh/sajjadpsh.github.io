'use client';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Page choreography, driven by data attributes in the server-rendered markup:
 * data-hero (intro slide), data-reveal (rise on scroll), data-stagger (children cascade),
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

      // Hero text is already painted (it's the LCP element): slide it, never re-hide it.
      if (full) gsap.from('[data-hero]', { y: 24, duration: 0.9, ease: 'power3.out', stagger: 0.08 });
      // One-off reveals use a single IntersectionObserver rather than a ScrollTrigger per element (dozens of
      // layout measurements in one long task). Animations load after hydration, so anything already on screen
      // stays as painted instead of blinking out; all layout reads happen before any style writes.
      const below = (el: Element) => el.getBoundingClientRect().top > innerHeight;
      const [revealEls, staggerEls, dotEls] = ['[data-reveal]', '[data-stagger]', '[data-dot]'].map((s) => gsap.utils.toArray<HTMLElement>(s).filter(below));
      const reveals = new Map<Element, () => void>();
      const add = (el: Element, hide: gsap.TweenVars, show: gsap.TweenVars, targets: gsap.TweenTarget = el) => {
        gsap.set(targets, hide);
        reveals.set(el, () => gsap.to(targets, show));
      };
      for (const el of revealEls) add(el, { opacity: 0, y: full ? 40 : 0 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' });
      for (const el of staggerEls) {
        add(el, { opacity: 0, y: full ? 28 : 0, scale: full ? 0.96 : 1 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power3.out', stagger: 0.06 }, el.children);
      }
      if (full) for (const dot of dotEls) add(dot, { scale: 0 }, { scale: 1, duration: 0.6, ease: 'back.out(3)' });
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            io.unobserve(e.target);
            reveals.get(e.target)?.();
          }
        },
        { rootMargin: '0px 0px -12% 0px' },
      );
      reveals.forEach((_, el) => io.observe(el));
      if (!full) return () => io.disconnect();

      for (const line of gsap.utils.toArray<HTMLElement>('[data-line]')) {
        gsap.fromTo(line, { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: line.parentElement, start: 'top 75%', end: 'bottom 55%', scrub: 0.5 } });
      }
      gsap.to('[data-parallax]', { yPercent: -12, opacity: 0.15, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });

      // Header slides away while reading down and returns on the way back up.
      ScrollTrigger.create({
        start: 160,
        end: 'max',
        onUpdate: (self) => gsap.to('header', { yPercent: self.direction === 1 ? -100 : 0, duration: 0.35, ease: 'power2.out', overwrite: true }),
        onLeaveBack: () => gsap.to('header', { yPercent: 0, duration: 0.35, overwrite: true }),
      });
      return () => io.disconnect();
    });
  });
  return null;
}
