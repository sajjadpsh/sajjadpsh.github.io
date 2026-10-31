// Per-language sitemaps: /sitemap.xml is an index of /sitemaps/<locale>.xml, and each of those lists its
// language's page with every alternate (incl. x-default). No <lastmod>: a build timestamp would be a false signal.

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

export function sitemapIndex(siteUrl: string, locales: readonly string[]) {
  const items = locales.map((l) => `<sitemap><loc>${esc(`${siteUrl}/sitemaps/${l}.xml`)}</loc></sitemap>`).join('');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items}</sitemapindex>\n`;
}

/** `urls` maps each locale to its absolute page URL; `xDefault` is the default locale's URL. */
export function localeSitemap(locale: string, urls: Record<string, string>, xDefault: string) {
  const links = [...Object.entries(urls), ['x-default', xDefault]]
    .map(([lang, href]) => `<xhtml:link rel="alternate" hreflang="${lang}" href="${esc(href)}"/>`)
    .join('');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml"><url><loc>${esc(urls[locale])}</loc>${links}</url></urlset>\n`;
}

export const xmlResponse = (body: string) => new Response(body, { headers: { 'content-type': 'application/xml; charset=utf-8' } });
