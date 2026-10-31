import { defaultLocale, isLocale, localePath, locales } from '@/lib/i18n';
import { SITE_URL } from '@/lib/site';
import { localeSitemap, xmlResponse } from '@/lib/sitemap';

export const dynamic = 'force-static';
export const dynamicParams = false;
export const generateStaticParams = () => locales.map((l) => ({ file: `${l}.xml` }));

export async function GET(_: Request, { params }: { params: Promise<{ file: string }> }) {
  const locale = (await params).file.replace(/\.xml$/, '');
  if (!isLocale(locale)) return new Response('Not found', { status: 404 });
  const urls = Object.fromEntries(locales.map((l) => [l, `${SITE_URL}${localePath(l)}`]));
  return xmlResponse(localeSitemap(locale, urls, urls[defaultLocale]));
}
