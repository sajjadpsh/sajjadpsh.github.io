'use client';
// Theme-aware wrappers around the React Bits components (which take concrete colors, not CSS vars).
import type { ReactNode } from 'react';
import Aurora from './reactbits/Aurora';
import ShinyText from './reactbits/ShinyText';
import SplitText from './reactbits/SplitText';
import SpotlightCard from './reactbits/SpotlightCard';
import { useIsDark } from '@/lib/useIsDark';

export function HeroBackground() {
  const dark = useIsDark();
  return (
    <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
      <Aurora
        key={String(dark)}
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
