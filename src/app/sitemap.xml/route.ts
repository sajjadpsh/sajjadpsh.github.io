import { locales } from '@/lib/i18n';
import { SITE_URL } from '@/lib/site';
import { sitemapIndex, xmlResponse } from '@/lib/sitemap';

export const dynamic = 'force-static';

export const GET = () => xmlResponse(sitemapIndex(SITE_URL, locales));
