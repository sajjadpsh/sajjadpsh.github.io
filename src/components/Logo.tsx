// "<S>": a code tag wrapped around the S of Sajjad — a developer's portfolio in one mark.
// Keep in sync with src/app/icon.svg (the favicon). Decorative: it always sits next to the name text.
export default function Logo({ className = 'size-9', id = 'logo' }: { className?: string; id?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366f1" />
          <stop offset="1" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill={`url(#${id})`} />
      <g fill="none" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 22 9.5 32 19 42" />
        <path d="M45 22 54.5 32 45 42" />
        <path d="M38.5 24.5c-1.6-2-4-3.3-6.6-3.3-3.6 0-6.4 2.2-6.4 5.2 0 7 13 4.2 13 11.4 0 3.3-3 5.9-6.8 5.9-2.8 0-5.3-1.3-6.9-3.4" />
      </g>
    </svg>
  );
}
