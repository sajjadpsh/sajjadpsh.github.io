import type { Section as SectionData, Ui } from '@/lib/content';
import { formatPeriod } from '@/lib/period';
import { GlowCard } from './Effects';

type Ctx = { intl: string; ui: Ui };

// One renderer per section `type`. To add a type: extend Section in lib/content.ts,
// add a case here and a matching entry in the CMS config.
function Body({ section, intl, ui }: { section: SectionData } & Ctx) {
  switch (section.type) {
    case 'timeline':
      return (
        <div className="relative ps-6">
          <span aria-hidden="true" className="absolute inset-y-0 start-0 w-px bg-zinc-200 dark:bg-zinc-800" />
          <span aria-hidden="true" data-line className="absolute inset-y-0 start-0 w-px origin-top bg-gradient-to-b from-indigo-500 via-cyan-500 to-purple-500" />
          <ol className="space-y-10">
          {section.items.map((item, i) => (
            <li key={i} data-reveal className="relative">
              <span data-dot className="absolute -start-[30px] top-1.5 size-3 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 ring-4 ring-white dark:ring-zinc-950" />
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <span className="text-sm text-zinc-500 tabular-nums">{formatPeriod(item.start, item.end, intl, ui.present)}</span>
              </div>
              <p className="text-sm text-indigo-600 dark:text-indigo-400">{[item.org, item.location].filter(Boolean).join(' · ')}</p>
              {item.bullets?.length ? (
                <ul className="mt-3 list-disc space-y-1 ps-5 text-zinc-600 dark:text-zinc-300">
                  {item.bullets.map((b, j) => (
                    <li key={j}>{b}</li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
          </ol>
        </div>
      );
    case 'projects':
      return (
        <div data-stagger className="grid gap-6 sm:grid-cols-2">
          {section.items.map((p) => (
            <div key={p.url}>
              <GlowCard className="h-full">
                <h3 className="text-xl font-semibold">
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="after:absolute after:inset-0">
                    {p.name}
                  </a>
                </h3>
                <p className="mt-1 text-sm text-indigo-600 dark:text-indigo-400" dir="ltr">
                  {new URL(p.url).host}
                </p>
                {(p.role || p.start) && (
                  <p className="mt-2 text-sm font-medium">
                    {[p.role, p.start && formatPeriod(p.start, p.end, intl, ui.present)].filter(Boolean).join(' · ')}
                  </p>
                )}
                <p className="mt-3 text-zinc-600 dark:text-zinc-300">{p.description}</p>
                {p.outcome && (
                  <p className="mt-3 flex gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-400">
                    <span aria-hidden="true">✓</span>
                    {p.outcome}
                  </p>
                )}
                {p.stack?.length ? (
                  <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
                    <span className="sr-only">{ui.stack}: </span>
                    {p.stack.join(' · ')}
                  </p>
                ) : null}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {p.tags?.map((t) => (
                    <span key={t} className="chip">
                      {t}
                    </span>
                  ))}
                  <span className="ms-auto text-sm font-medium">{ui.visit} <span className="inline-block rtl:-scale-x-100">↗</span></span>
                </div>
              </GlowCard>
            </div>
          ))}
        </div>
      );
    case 'skills':
      return (
        <div className="grid gap-8 md:grid-cols-2">
          {section.groups.map((g) => (
            <div key={g.label} data-reveal>
              <h3 className="mb-3 font-semibold">{g.label}</h3>
              <ul data-stagger className="flex flex-wrap gap-2">
                {g.items.map((s) => (
                  <li key={s} className="chip">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );
    case 'text':
      return (
        <p data-reveal className="max-w-3xl whitespace-pre-line leading-relaxed text-zinc-600 dark:text-zinc-300">
          {section.body}
        </p>
      );
  }
}

export default function Section({ section, ...ctx }: { section: SectionData } & Ctx) {
  return (
    <section id={section.id} className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
      <h2 data-reveal className="mb-10 text-3xl font-bold tracking-tight sm:text-4xl">
        <span className="me-3 inline-block h-1 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 align-middle" />
        {section.title}
      </h2>
      <Body section={section} {...ctx} />
    </section>
  );
}
