'use client';
import { useEffect, useRef, type ReactNode } from 'react';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import { localeInfo, localePath, locales, type Locale } from '@/lib/i18n';
import type { Ui } from '@/lib/content';
import { BASE_PATH } from '@/lib/site';

type NavItem = { id: string; title: string };

/** <details> dropdown that closes on outside clicks and after picking a link. */
function Menu({ label, icon, children }: { label: string; icon: ReactNode; children: ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) ref.current?.removeAttribute('open');
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);
  return (
    <details
      ref={ref}
      className="relative"
      onClick={(e) => (e.target as HTMLElement).closest('a') && ref.current?.removeAttribute('open')}
    >
      <summary aria-label={label} title={label} className="icon-btn list-none [&::-webkit-details-marker]:hidden">
        {icon}
      </summary>
      <div className="card absolute end-0 z-50 mt-2 flex min-w-44 flex-col p-2 shadow-xl">{children}</div>
    </details>
  );
}

const itemClass = 'rounded-lg px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10';

export default function Header({ locale, name, nav, ui }: { locale: Locale; name: string; nav: NavItem[]; ui: Ui }) {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/70 backdrop-blur-lg dark:border-white/10 dark:bg-zinc-950/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <a href="#top" className="flex items-center gap-2 font-semibold">
          <Logo className="size-8" id="logo-header" />
          <span className="hidden sm:inline">{name}</span>
        </a>
        <nav className="ms-auto hidden items-center gap-1 md:flex">
          {nav.map((s) => (
            <a key={s.id} href={`#${s.id}`} className={itemClass}>
              {s.title}
            </a>
          ))}
        </nav>
        <div className="ms-auto flex items-center gap-1 md:ms-2">
          <Menu label={ui.language} icon={<span className="text-xs font-bold uppercase">{locale}</span>}>
            {locales.map((l) => (
              // Plain <a>: a language switch replaces the whole <html lang dir> document anyway.
              <a key={l} href={`${BASE_PATH}${localePath(l)}`} hrefLang={l} lang={l} aria-current={l === locale ? 'page' : undefined} className={`${itemClass} aria-[current]:font-bold`}>
                {localeInfo[l].label}
              </a>
            ))}
          </Menu>
          <ThemeToggle label={ui.toggleTheme} />
          <div className="md:hidden">
            <Menu
              label={ui.menu}
              icon={
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              }
            >
              {nav.map((s) => (
                <a key={s.id} href={`#${s.id}`} className={itemClass}>
                  {s.title}
                </a>
              ))}
            </Menu>
          </div>
        </div>
      </div>
    </header>
  );
}
