'use client';
// Theme-aware wrappers around the React Bits components (which take concrete colors, not CSS vars).
import { useEffect, useState, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import ShinyText from './reactbits/ShinyText';
import SplitText from './reactbits/SplitText';
import SpotlightCard from './reactbits/SpotlightCard';
import { useIsDark } from '@/lib/useIsDark';

// Code-split: the WebGL background isn't needed for first paint.
const Aurora = dynamic(() => import('./reactbits/Aurora'), { ssr: false });

export function HeroBackground() {
  const dark = useIsDark();
  // Mount WebGL (context + shader compile) only once the browser is idle, keeping it off the hydration path.
  const [idle, setIdle] = useState(false);
  useEffect(() => {
    if (!('requestIdleCallback' in window)) {
      const t = setTimeout(() => setIdle(true), 300); // Safari
      return () => clearTimeout(t);
    }
    const id = requestIdleCallback(() => setIdle(true), { timeout: 2000 });
    return () => cancelIdleCallback(id);
  }, []);
  if (!idle) return null;
  return (
    <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
      {/* No remount key: Aurora applies theme props live; dpr 1 because the soft gradient looks identical. */}
      <Aurora
        dpr={1}
        colorStops={['#6366f1', '#06b6d4', '#a855f7']}
        lightMode={!dark}
        opacity={dark ? 0.8 : 0.9}
        amplitude={1}
        speed={0.6}
      />
    </div>
  );
}

export function HeroName({ text }: { text: string }) {
  // Word split keeps Persian/Arabic letters joined.
  return (
    <SplitText
      text={text}
      tag="h1"
      splitType="words"
      textAlign="start"
      trigger="load"
      className="text-4xl font-extrabold tracking-tight sm:text-6xl"
    />
  );
}

export function Headline({ text }: { text: string }) {
  const dark = useIsDark();
  return (
    <ShinyText
      text={text}
      color={dark ? '#a1a1aa' : '#52525b'}
      shineColor={dark ? '#ffffff' : '#6366f1'}
      speed={3}
      delay={2.5} // pause between sweeps instead of a non-stop repaint loop
      className="text-lg font-semibold sm:text-2xl"
    />
  );
}

export function GlowCard({ children, className }: { children: ReactNode; className?: string }) {
  const dark = useIsDark();
  return (
    <SpotlightCard theme={dark ? 'dark' : 'light'} spotlightColor={dark ? '#818cf8' : '#6366f1'} className={className}>
      {children}
    </SpotlightCard>
  );
}
