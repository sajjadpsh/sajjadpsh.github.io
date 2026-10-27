import type { Content } from '@/lib/content';
import Logo from './Logo';
import ContactLinks from './ContactLinks';

export default function Footer({ profile, ui }: { profile: Content['profile']; ui: Content['ui'] }) {
  return (
    <footer id="contact" className="border-t border-black/5 dark:border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 sm:px-6">
        <h2 className="text-2xl font-bold">{ui.contact}</h2>
        <ContactLinks profile={profile} />
        <p className="flex items-center gap-2 text-sm text-zinc-500">
          <Logo className="size-5" id="logo-footer" />
          © {new Date().getFullYear()} {profile.name}. {ui.rights}
        </p>
      </div>
    </footer>
  );
}
