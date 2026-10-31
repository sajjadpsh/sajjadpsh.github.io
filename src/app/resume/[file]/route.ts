import { getContent, isLocale, localeInfo, locales } from '@/lib/i18n';
import { toBlocks } from '@/lib/resume/blocks';
import { renderPdf } from '@/lib/resume/pdf';

// Static, linkable PDF résumés (/resume/en.pdf …) built at deploy time, so people, ATS tools and agents
// can fetch them by URL. Only Latin-script locales: the PDF's built-in fonts can't draw Persian/Arabic.
export const dynamic = 'force-static';
export const dynamicParams = false;
export const generateStaticParams = () => locales.filter((l) => localeInfo[l].latin).map((l) => ({ file: `${l}.pdf` }));

export async function GET(_: Request, { params }: { params: Promise<{ file: string }> }) {
  const locale = (await params).file.replace(/\.pdf$/, '');
  if (!isLocale(locale) || !localeInfo[locale].latin) return new Response('Not found', { status: 404 });
  const pdf = renderPdf(toBlocks(getContent(locale), localeInfo[locale].intl));
  return new Response(pdf, { headers: { 'content-type': 'application/pdf' } });
}
