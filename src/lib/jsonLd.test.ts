import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildJsonLd } from './jsonLd.ts';
import type { Content } from './content.ts';

const base = (name: string, extra: object = {}) =>
  ({
    meta: { title: `${name} - Dev`, description: '' },
    ui: {},
    profile: { name, headline: 'Dev', photo: '/uploads/me.jpg', summary: 'Hi', location: 'Mashhad, Iran', city: 'Mashhad', countryCode: 'IR', email: 'a@b.io', languageCodes: ['fa', 'en'], links: [{ label: 'GH', url: 'https://github.com/x' }], ...extra },
    sections: [
      { type: 'projects', id: 'projects', title: 'P', items: [{ name: 'Trax Loop', url: 'https://t.io', description: 'd' }] },
      { type: 'timeline', id: 'education', title: 'E', items: [{ title: 'BSc', org: 'AUT', start: '2016-09' }] },
      { type: 'timeline', id: 'experience', title: 'X', items: [{ title: 'Dev', org: 'Acme', start: '2020-01' }] },
      { type: 'skills', id: 'skills', title: 'S', groups: [{ label: 'Tech', items: ['Vue.js'], knowsAbout: true }, { label: 'Soft', items: ['Teamwork'] }] },
    ],
  }) as unknown as Content;

test('buildJsonLd shares one Person across locales and pulls fields from content', () => {
  const en = base('Sajjad Pishvaeian', { resumeName: 'Seyedsajjad Pishvaeian' });
  const fa = base('سجاد پیشوائیان', { resumeName: 'سید سجاد پیشوائیان' });
  const args = { defaultContent: en, locales: ['en', 'fa'], siteUrl: 'https://x.io' };
  const g = (c: Content, locale: string, pageUrl: string) => buildJsonLd({ ...args, content: c, locale, intl: locale, pageUrl })['@graph'] as any[];
  const [, pageEn, personEn, project] = g(en, 'en', 'https://x.io/');
  const [, pageFa, personFa] = g(fa, 'fa', 'https://x.io/fa');

  assert.equal(personEn['@id'], 'https://x.io/#person');
  assert.equal(personFa['@id'], personEn['@id']);
  assert.equal(personFa.url, 'https://x.io/');
  assert.equal(pageFa['@id'], 'https://x.io/fa#profilepage');
  assert.deepEqual(pageEn.mainEntity, { '@id': 'https://x.io/#person' });
  assert.deepEqual(personEn.alternateName, ['Seyedsajjad Pishvaeian']);
  assert.deepEqual(personFa.alternateName, ['Sajjad Pishvaeian', 'Seyedsajjad Pishvaeian', 'سید سجاد پیشوائیان']);
  assert.equal(personEn.email, 'a@b.io');
  assert.equal(personEn.image, 'https://x.io/uploads/me.jpg');
  assert.deepEqual(personEn.address, { '@type': 'PostalAddress', addressLocality: 'Mashhad', addressCountry: 'IR' });
  assert.deepEqual(personEn.alumniOf, [{ '@type': 'EducationalOrganization', name: 'AUT' }]);
  assert.deepEqual(personEn.knowsAbout, ['Vue.js']);
  assert.deepEqual(personEn.knowsLanguage[1], { '@type': 'Language', name: 'English', alternateName: 'en' });
  assert.equal(project['@id'], 'https://x.io/#project-trax-loop');
  assert.deepEqual(project.contributor, { '@id': 'https://x.io/#person' });
});
