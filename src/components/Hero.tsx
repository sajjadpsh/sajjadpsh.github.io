import type { Content } from '@/lib/content';
import { HeroBackground, HeroName, Headline } from './Effects';
import ContactLinks from './ContactLinks';
import { BASE_PATH } from '@/lib/site';

// WebP copies written by scripts/responsive-images.mjs before each build (keep WIDTHS in sync).
const WIDTHS = [192, 384, 640];
const variant = (photo: string, w: number) => `${BASE_PATH}${photo.replace(/\.[a-z0-9]+$/i, `-${w}w.webp`)}`;

export default function Hero({ profile, children }: { profile: Content['profile']; children: React.ReactNode }) {
  return (
    <section id="hero" className="relative isolate overflow-hidden">
      <HeroBackground />
      {/* Column-reverse puts the photo above the text on phones; from md it sits beside it (mirrored in RTL). */}
      <div data-parallax className="mx-auto flex min-h-[80vh] max-w-6xl flex-col-reverse justify-center gap-8 px-4 py-24 sm:px-6 md:flex-row md:items-center md:gap-12 lg:gap-16">
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          {/* Pill backdrop keeps the label readable (>= 4.5:1) over any part of the aurora. */}
          <p data-hero className="w-fit rounded-full bg-white/75 px-3 py-1 text-sm font-semibold text-indigo-700 backdrop-blur dark:bg-zinc-900/70 dark:text-indigo-300">
            {profile.location}
          </p>
          <HeroName text={profile.name} />
          <div data-hero>
            <Headline text={profile.headline} />
          </div>
          <p data-hero className="max-w-2xl text-base leading-relaxed text-zinc-600 sm:text-lg dark:text-zinc-300">{profile.summary}</p>
          <div data-hero>{children}</div>
          <div data-hero>
            <ContactLinks profile={profile} />
          </div>
        </div>
        {profile.photo && (
          <picture className="shrink-0">
            <source
              type="image/webp"
              srcSet={WIDTHS.map((w) => `${variant(profile.photo!, w)} ${w}w`).join(', ')}
              sizes="(min-width: 1280px) 320px, (min-width: 1024px) 288px, (min-width: 768px) 224px, 96px"
            />
            <img
              src={`${BASE_PATH}${profile.photo}`}
              alt={profile.name}
              width={640}
              height={640}
              fetchPriority="high"
              className="size-24 rounded-3xl object-cover shadow-xl ring-1 ring-black/10 md:size-56 md:rounded-[2.5rem] lg:size-72 xl:size-80 dark:ring-white/15"
            />
          </picture>
        )}
      </div>
    </section>
  );
}
