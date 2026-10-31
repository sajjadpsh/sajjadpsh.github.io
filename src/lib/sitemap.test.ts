import { test } from 'node:test';
import assert from 'node:assert/strict';
import { localeSitemap, sitemapIndex } from './sitemap.ts';

test('sitemap index lists one sitemap per locale', () => {
  const xml = sitemapIndex('https://x.io', ['en', 'fa']);
  assert.match(xml, /<sitemapindex [^>]+><sitemap><loc>https:\/\/x\.io\/sitemaps\/en\.xml<\/loc><\/sitemap><sitemap><loc>https:\/\/x\.io\/sitemaps\/fa\.xml<\/loc><\/sitemap><\/sitemapindex>/);
});

test('locale sitemap has its own URL, every alternate and x-default, no lastmod', () => {
  const xml = localeSitemap('fa', { en: 'https://x.io/', fa: 'https://x.io/fa' }, 'https://x.io/');
  assert.match(xml, /<loc>https:\/\/x\.io\/fa<\/loc>/);
  assert.equal((xml.match(/<xhtml:link /g) ?? []).length, 3);
  assert.match(xml, /hreflang="x-default" href="https:\/\/x\.io\/"/);
  assert.doesNotMatch(xml, /lastmod/);
});
