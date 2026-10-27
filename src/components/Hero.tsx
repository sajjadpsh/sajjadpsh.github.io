import type { Content } from '@/lib/content';
import { HeroBackground, HeroName, Headline } from './Effects';
import ContactLinks from './ContactLinks';

export default function Hero({ profile, children }: { profile: Content['profile']; children: React.ReactNode }) {
  return (
    <section id="top" className="relative isolate overflow-hidden">
      <HeroBackground />
      <div className="mx-auto flex min-h-[80vh] max-w-6xl flex-col justify-center gap-6 px-4 py-24 sm:px-6">
        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{profile.location}</p>
        <HeroName text={profile.name} />
        <Headline text={profile.headline} />
        <p className="max-w-2xl text-base leading-relaxed text-zinc-600 sm:text-lg dark:text-zinc-300">{profile.summary}</p>
        {children}
        <ContactLinks profile={profile} />
      </div>
    </section>
  );
}
