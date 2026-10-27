'use client';
import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/** Lenis smooth scrolling (driven by GSAP's ticker), hash-free in-page links and the back-to-top button. */
export default function SmoothScroll({ backToTop }: { backToTop: string }) {
  const lenisRef = useRef<Lenis | null>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    // Smooth wheel scrolling is part of the site's feel, so keep it on even with prefers-reduced-motion;
    // the big movement effects in Animations.tsx still honor that setting.
    const lenis = new Lenis({ respectReducedMotion: false });
    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    lenis.on('scroll', ({ scroll, progress }: Lenis) => {
      setVisible(scroll > 600);
      ringRef.current?.style.setProperty('stroke-dashoffset', String(1 - progress));
    });
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // In-page links glide via Lenis and leave the address bar alone (no "#top", "#projects", …).
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element).closest('a');
      if (!link || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      if (link.hasAttribute('data-scroll-top')) {
        e.preventDefault();
        lenis.scrollTo(0);
        return;
      }
      const hash = link.getAttribute('href');
      const target = hash?.startsWith('#') ? document.getElementById(hash.slice(1)) : null;
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target); // sections' scroll-margin-top clears the sticky header
      target.focus({ preventScroll: true }); // keeps keyboard focus in step (skip link → <main>)
    };
    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <button
      type="button"
      onClick={() => lenisRef.current?.scrollTo(0)}
      aria-label={backToTop}
      title={backToTop}
      inert={!visible}
      className={`fixed end-5 bottom-5 z-40 grid size-12 cursor-pointer place-items-center rounded-full border border-black/10 bg-white/80 text-zinc-900 shadow-lg backdrop-blur transition duration-300 hover:-translate-y-1 sm:end-8 sm:bottom-8 dark:border-white/15 dark:bg-zinc-900/80 dark:text-white ${
        visible ? 'opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      {/* Ring fills with scroll progress, clockwise in LTR and mirrored in RTL. */}
      <svg viewBox="0 0 48 48" className="absolute inset-0 -rotate-90 rtl:-scale-x-100" aria-hidden="true">
        <circle cx="24" cy="24" r="22" pathLength={1} fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="2" />
        <circle ref={ringRef} cx="24" cy="24" r="22" pathLength={1} fill="none" strokeWidth="2" strokeLinecap="round" strokeDasharray="1" strokeDashoffset="1" className="stroke-indigo-500" />
      </svg>
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 19V5m0 0-6 6m6-6 6 6" />
      </svg>
    </button>
  );
}
