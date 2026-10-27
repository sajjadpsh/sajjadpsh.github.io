import type { Content } from '@/lib/content';

export default function ContactLinks({ profile }: { profile: Content['profile'] }) {
  const links = [
    { label: profile.email, url: `mailto:${profile.email}` },
    ...(profile.phone ? [{ label: profile.phone, url: `tel:${profile.phone.replace(/[^\d+]/g, '')}` }] : []),
    ...profile.links,
  ];
  return (
    <ul className="flex flex-wrap gap-2">
      {links.map((l) => (
        <li key={l.url}>
          <a href={l.url} className="chip" dir="ltr" target={l.url.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer me">
            {l.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
