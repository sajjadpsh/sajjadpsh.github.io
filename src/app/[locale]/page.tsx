import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LocalePage, { localeMetadata } from '@/components/LocalePage';
import { defaultLocale, isLocale, locales } from '@/lib/i18n';
import { BASE_PATH, SITE_URL } from '@/lib/site';

type Props = { params: Promise<{ locale: string }> };

export const dynamicParams = false;
// The default locale is generated too, only to redirect old "/en" links to "/".
export const generateStaticParams = () => locales.map((locale) => ({ locale }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return locale === defaultLocale ? { alternates: { canonical: `${SITE_URL}/` } } : localeMetadata(locale);
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  if (locale !== defaultLocale) return <LocalePage locale={locale} />;
  return (
    <html lang={defaultLocale}>
      <head>
        <meta httpEquiv="refresh" content={`0; url=${BASE_PATH}/`} />
      </head>
      <body>
        <a href={`${BASE_PATH}/`}>Continue</a>
      </body>
    </html>
  );
}
