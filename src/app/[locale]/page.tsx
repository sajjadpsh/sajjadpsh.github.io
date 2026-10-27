import { notFound } from 'next/navigation';
import { getContent, isLocale, localeInfo } from '@/lib/i18n';
import { SITE_URL } from '@/lib/site';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Section from '@/components/Sections';
import Footer from '@/components/Footer';
import ResumeDownload from '@/components/ResumeDownload';
import SmoothScroll from '@/components/SmoothScroll';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
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
    jobTitle: profile.headline,
    email: `mailto:${profile.email}`,
    url: `${SITE_URL}/${locale}/`,
    address: { '@type': 'PostalAddress', addressLocality: profile.location },
    sameAs: profile.links.map((l) => l.url),
  };

  return (
    <>
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
    </>
  );
}
