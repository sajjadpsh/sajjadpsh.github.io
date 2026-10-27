import type { Metadata } from 'next';
import '@fontsource-variable/inter';
import '@fontsource-variable/vazirmatn';
import '@/app/globals.css';
import { getContent, localeInfo, localePath, locales, defaultLocale, type Locale } from '@/lib/i18n';
import { SITE_URL } from '@/lib/site';
import { themeScript } from './ThemeToggle';
import Header from './Header';
import Hero from './Hero';
import Section from './Sections';
import Footer from './Footer';
import ResumeDownload from './ResumeDownload';
import SmoothScroll from './SmoothScroll';

const pageUrl = (locale: Locale) => `${SITE_URL}${localePath(locale)}`;

export function localeMetadata(locale: Locale): Metadata {
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

/** A whole localized document (<html> included): rendered at "/" for the default locale and at "/<code>" for the rest. */
export default function LocalePage({ locale }: { locale: Locale }) {
  const content = getContent(locale);
  const { profile, ui } = content;
  const sections = content.sections.filter((s) => !s.hidden);
  const info = localeInfo[locale];
  // The PDF uses built-in Latin fonts, so non-Latin pages get the English résumé.
  const pdfLocale = info.latin ? locale : 'en';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    alternateName: profile.resumeName,
    jobTitle: profile.headline,
    email: `mailto:${profile.email}`,
    url: pageUrl(locale),
    address: { '@type': 'PostalAddress', addressLocality: profile.location },
    sameAs: profile.links.map((l) => l.url),
  };

  return (
    <html lang={locale} dir={info.dir} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="bg-white text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-100">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:start-2 focus:z-50 focus:rounded focus:bg-white focus:p-2 focus:text-black">
          {ui.skip}
        </a>
        <Header locale={locale} name={profile.name} ui={ui} nav={[...sections.map(({ id, title }) => ({ id, title })), { id: 'contact', title: ui.contact }]} />
        <main id="main">
          <Hero profile={profile}>
            <ResumeDownload
              ui={ui}
              content={content}
              pdfContent={getContent(pdfLocale)}
              intl={info.intl}
              pdfIntl={localeInfo[pdfLocale].intl}
              rtl={info.dir === 'rtl'}
            />
          </Hero>
          {sections.map((s) => (
            <Section key={s.id} section={s} intl={info.intl} ui={ui} />
          ))}
        </main>
        <Footer profile={profile} ui={ui} />
        <SmoothScroll />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      </body>
    </html>
  );
}
