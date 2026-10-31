import type { Content, Project, SkillGroup, TimelineItem } from './content.ts';

type Args = {
  content: Content;
  /** Every locale's content: their names become alternateName (Latin, Persian, Arabic spellings). */
  allContent: Content[];
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
export function buildJsonLd({ content, allContent, locale, locales, intl, siteUrl, pageUrl }: Args) {
  const { profile, meta, sections } = content;
  const home = `${siteUrl}/`;
  const person = { '@id': `${home}#person` };
  const website = { '@id': `${home}#website` };

  const ofType = <T extends Content['sections'][number]['type']>(type: T) =>
    sections.filter((s): s is Extract<Content['sections'][number], { type: T }> => s.type === type && !s.hidden);
  const projects: Project[] = ofType('projects').flatMap((s) => s.items);
  const skills: SkillGroup[] = ofType('skills').flatMap((s) => s.groups);
  // The timeline whose anchor id is "education" lists schools, newest first (see content/<locale>/site.json).
  // shortcut: only the newest entry (the degree) becomes alumniOf; flag items explicitly if a second degree is added.
  const degree: TimelineItem | undefined = ofType('timeline').find((s) => s.id === 'education')?.items[0];

  const names = allContent.flatMap((c) => [c.profile.name, c.profile.resumeName]);
  const alternateName = [...new Set(names.filter((n): n is string => !!n && n !== profile.name))];
  const sameAs = profile.links.map((l) => l.url).filter((url) => !url.startsWith(siteUrl)); // not the site itself
  const knowsAbout = skills.filter((g) => g.knowsAbout).flatMap((g) => g.items);
  const nonEmpty = <T,>(list: T[]) => (list.length ? list : undefined); // JSON.stringify drops undefined
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
        alternateName: nonEmpty(alternateName),
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
        alumniOf: degree && { '@type': 'EducationalOrganization', name: degree.org },
        knowsAbout: nonEmpty(knowsAbout),
        knowsLanguage: nonEmpty(
          (profile.languageCodes ?? []).map((code) => ({
          '@type': 'Language',
            name: languageName.of(code),
            alternateName: code,
          })),
        ),
        sameAs: nonEmpty(sameAs),
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
