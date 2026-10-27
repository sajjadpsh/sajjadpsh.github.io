import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import '@fontsource-variable/inter';
import '@fontsource-variable/vazirmatn';
import '../globals.css';
import { getContent, isLocale, localeInfo, locales, defaultLocale } from '@/lib/i18n';
import { SITE_URL } from '@/lib/site';
import { themeScript } from '@/components/ThemeToggle';

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => locales.map((locale) => ({ locale }));

const pageUrl = (locale: string) => `${SITE_URL}/${locale}/`;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { meta, profile } = getContent(locale);
  return {
    metadataBase: new URL(SITE_URL),
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    authors: [{ name: profile.name }],
    alternates: {
      canonical: pageUrl(locale),
      languages: { ...Object.fromEntries(locales.map((l) => [l, pageUrl(l)])), 'x-default': pageUrl(defaultLocale) },
    },
    openGraph: {
      type: 'profile',
      url: pageUrl(locale),
      title: meta.title,
      description: meta.description,
      siteName: profile.name,
      locale,
      alternateLocale: locales.filter((l) => l !== locale),
    },
    twitter: { card: 'summary', title: meta.title, description: meta.description },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <html lang={locale} dir={localeInfo[locale].dir} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="bg-white text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-100">{children}</body>
    </html>
  );
}
