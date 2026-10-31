import type { Content, Project, SkillGroup, TimelineItem } from './content.ts';

type Args = {
  content: Content;
  /** Default-locale content: supplies Latin name variants for non-Latin pages. */
  defaultContent: Content;
  locale: string;
  locales: readonly string[];
  intl: string;
  siteUrl: string;
  pageUrl: string;
};

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/**
 * One schema.org @graph per page. Every locale shares the same Person/WebSite @ids, so search engines
 * see one person in five languages; only the ProfilePage (and translated strings) differ per page.
 */
export function buildJsonLd({ content, defaultContent, locale, locales, intl, siteUrl, pageUrl }: Args) {
  const { profile, meta, sections } = content;
  const home = `${siteUrl}/`;
  const person = { '@id': `${home}#person` };
  const website = { '@id': `${home}#website` };

  const ofType = <T extends Content['sections'][number]['type']>(type: T) =>
    sections.filter((s): s is Extract<Content['sections'][number], { type: T }> => s.type === type && !s.hidden);
  const projects: Project[] = ofType('projects').flatMap((s) => s.items);
  const skills: SkillGroup[] = ofType('skills').flatMap((s) => s.groups);
  // The timeline whose anchor id is "education" lists schools (see content/<locale>/site.json).
  const education: TimelineItem[] = ofType('timeline').filter((s) => s.id === 'education').flatMap((s) => s.items);

  const names = [defaultContent.profile.name, defaultContent.profile.resumeName, profile.resumeName];
  const alternateName = [...new Set(names.filter((n): n is string => !!n && n !== profile.name))];
  const languageName = new Intl.DisplayNames([intl], { type: 'language' });

  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', ...website, url: home, name: profile.name, inLanguage: locales, publisher: person },
      {
        '@type': 'ProfilePage',
        '@id': `${pageUrl}#profilepage`,
        url: pageUrl,
        name: meta.title,
        inLanguage: locale,
        isPartOf: website,
        mainEntity: person,
      },
      {
        '@type': 'Person',
        ...person,
        url: home,
        name: profile.name,
        alternateName,
        jobTitle: profile.headline,
        hasOccupation: { '@type': 'Occupation', name: profile.headline },
        description: profile.summary,
        image: profile.photo ? `${siteUrl}${profile.photo}` : undefined,
        email: profile.email,
        address: {
          '@type': 'PostalAddress',
          addressLocality: profile.city ?? profile.location,
          addressCountry: profile.countryCode,
        },
        alumniOf: education.map((e) => ({ '@type': 'EducationalOrganization', name: e.org })),
        knowsAbout: skills.filter((g) => g.knowsAbout).flatMap((g) => g.items),
        knowsLanguage: (profile.languageCodes ?? []).map((code) => ({
          '@type': 'Language',
          name: languageName.of(code),
          alternateName: code,
        })),
        sameAs: profile.links.map((l) => l.url),
      },
      ...projects.map((p) => ({
        '@type': 'WebApplication',
        '@id': `${home}#project-${slug(p.name)}`,
        name: p.name,
        url: p.url,
        description: p.description,
        // contributor, not creator: these were built for employers/clients.
        contributor: person,
      })),
    ],
  };
}
