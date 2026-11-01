import { getContent, isLocale, localeInfo, locales } from '@/lib/i18n';
import { toBlocks } from '@/lib/resume/blocks';
import { renderPdf } from '@/lib/resume/pdf';
import { SITE_URL } from '@/lib/site';

// Static, linkable PDF résumés (/resume/en.pdf …) built at deploy time, so people, ATS tools and agents
// can fetch them by URL. Only Latin-script locales: the PDF's built-in fonts can't draw Persian/Arabic.
export const dynamic = 'force-static';
export const dynamicParams = false;
export const generateStaticParams = () => locales.filter((l) => localeInfo[l].latin).map((l) => ({ file: `${l}.pdf` }));

export async function GET(_: Request, { params }: { params: Promise<{ file: string }> }) {
  const locale = (await params).file.replace(/\.pdf$/, '');
  if (!isLocale(locale) || !localeInfo[locale].latin) return new Response('Not found', { status: 404 });
  const { profile, meta } = getContent(locale);
  const author = profile.resumeName || profile.name;
  const pdf = renderPdf(toBlocks(getContent(locale), localeInfo[locale].intl, `${SITE_URL}/`), {
    title: `${author} – ${profile.headline}`,
    author,
    subject: meta.description,
    lang: localeInfo[locale].og.replace('_', '-'), // en_US -> en-US
  });
  return new Response(pdf, { headers: { 'content-type': 'application/pdf' } });
}
