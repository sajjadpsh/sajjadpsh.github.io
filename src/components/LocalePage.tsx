import type { Metadata } from 'next';
import '@fontsource-variable/inter';
import '@fontsource-variable/vazirmatn';
import '@/app/globals.css';
import { getContent, localeInfo, localePath, locales, defaultLocale, type Locale } from '@/lib/i18n';
import { BASE_PATH, GOOGLE_SITE_VERIFICATION, SITE_URL } from '@/lib/site';
import { buildJsonLd } from '@/lib/jsonLd';
import { themeScript } from './ThemeToggle';
import Header from './Header';
import Hero from './Hero';
import Section from './Sections';
import Footer from './Footer';
import ResumeDownload from './ResumeDownload';
import SmoothScroll from './SmoothScroll';
import Animations from './Animations';

const pageUrl = (locale: Locale) => `${SITE_URL}${localePath(locale)}`;

export function localeMetadata(locale: Locale): Metadata {
  const { meta, profile } = getContent(locale);
  const image = { url: `${SITE_URL}/og/${locale}.png`, width: 1200, height: 630, alt: meta.title }; // npm run og
  return {
    metadataBase: new URL(SITE_URL),
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords && [...new Set(meta.keywords)],
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
      locale: localeInfo[locale].og,
      alternateLocale: locales.filter((l) => l !== locale).map((l) => localeInfo[l].og),
      images: [image],
    },
    verification: { google: GOOGLE_SITE_VERIFICATION },
    twitter: { card: 'summary_large_image', title: meta.title, description: meta.description, images: [image] },
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
  const pdf = getContent(pdfLocale).profile;

  const jsonLd = buildJsonLd({
    content,
    allContent: locales.map(getContent),
    locale,
    locales,
    intl: info.intl,
    siteUrl: SITE_URL,
    pageUrl: pageUrl(locale),
  });

  return (
    <html lang={locale} dir={info.dir} suppressHydrationWarning>
      <body className="bg-white text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-100">
        {/* First in <body>, not <head>: still runs before paint, without tripping hydration (React #418). */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <div
          data-progress
          aria-hidden="true"
          style={{ transform: 'scaleX(0)' }}
          className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-gradient-to-r from-indigo-500 via-cyan-400 to-purple-500 rtl:origin-right"
        />
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:start-2 focus:z-50 focus:rounded focus:bg-white focus:p-2 focus:text-black">
          {ui.skip}
        </a>
        <Header locale={locale} name={profile.name} ui={ui} nav={[...sections.map(({ id, title }) => ({ id, title })), { id: 'contact', title: ui.contact }]} />
        <main id="main" tabIndex={-1} className="outline-none">
          <Hero profile={profile}>
            <ResumeDownload
              ui={ui}
              locale={locale}
              intl={info.intl}
              rtl={info.dir === 'rtl'}
              pdfHref={`${BASE_PATH}/resume/${pdfLocale}.pdf`}
              fileName={`${(pdf.resumeName || pdf.name).replace(/\s+/g, '_')}_Resume`}
            />
          </Hero>
          {sections.map((s) => (
            <Section key={s.id} section={s} intl={info.intl} ui={ui} />
          ))}
        </main>
        <Footer profile={profile} ui={ui} />
        <SmoothScroll backToTop={ui.backToTop} />
        <Animations />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      </body>
    </html>
  );
}
