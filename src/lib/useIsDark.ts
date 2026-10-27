'use client';
import { useSyncExternalStore } from 'react';

const subscribe = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => observer.disconnect();
};

/** Tracks the `dark` class that ThemeToggle (and the pre-paint script in the layout) sets on <html>. */
export const useIsDark = () =>
  useSyncExternalStore(subscribe, () => document.documentElement.classList.contains('dark'), () => false);
