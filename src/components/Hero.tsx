import type { Content } from '@/lib/content';
import { HeroBackground, HeroName, Headline } from './Effects';
import ContactLinks from './ContactLinks';
import { BASE_PATH } from '@/lib/site';

export default function Hero({ profile, children }: { profile: Content['profile']; children: React.ReactNode }) {
  return (
    <section id="hero" className="relative isolate overflow-hidden">
      <HeroBackground />
      {/* Column-reverse puts the photo above the text on phones; on lg it sits beside it (mirrored in RTL). */}
      <div data-parallax className="mx-auto flex min-h-[80vh] max-w-6xl flex-col-reverse justify-center gap-8 px-4 py-24 sm:px-6 lg:flex-row lg:items-center lg:gap-16">
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <p data-hero className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{profile.location}</p>
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
          <img
            src={`${BASE_PATH}${profile.photo}`}
            alt={profile.name}
            width={640}
            height={640}
            fetchPriority="high"
            className="size-24 shrink-0 rounded-3xl object-cover shadow-xl ring-1 ring-black/10 lg:size-72 lg:rounded-[2.5rem] xl:size-80 dark:ring-white/15"
          />
        )}
      </div>
    </section>
  );
}
