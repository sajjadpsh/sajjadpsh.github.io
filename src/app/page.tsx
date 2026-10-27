import { defaultLocale } from '@/lib/i18n';
import { BASE_PATH, SITE_URL } from '@/lib/site';

// "/" has no content of its own: send visitors (and crawlers, via canonical) to the default locale.
export default function Root() {
  const target = `${BASE_PATH}/${defaultLocale}/`;
  return (
    <html lang={defaultLocale}>
      <head>
        <meta httpEquiv="refresh" content={`0; url=${target}`} />
        <link rel="canonical" href={`${SITE_URL}/${defaultLocale}/`} />
      </head>
      <body>
        <a href={target}>Continue</a>
      </body>
    </html>
  );
}
