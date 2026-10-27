import type { MetadataRoute } from 'next';
import { localePath, locales } from '@/lib/i18n';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (l: (typeof locales)[number]) => `${SITE_URL}${localePath(l)}`;
  const languages = Object.fromEntries(locales.map((l) => [l, url(l)]));
  return locales.map((l) => ({ url: url(l), lastModified: new Date(), alternates: { languages } }));
}
