'use client';
import dynamic from 'next/dynamic';

// Smooth scrolling and scroll animations load after hydration, keeping GSAP/Lenis setup off the start-up path.
const SmoothScroll = dynamic(() => import('./SmoothScroll'), { ssr: false });
const Animations = dynamic(() => import('./Animations'), { ssr: false });

export default function Motion({ backToTop }: { backToTop: string }) {
  return (
    <>
      <SmoothScroll backToTop={backToTop} />
      <Animations />
    </>
  );
}
