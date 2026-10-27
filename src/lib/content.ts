// Shape of content/<locale>/site.json. Keep in sync with public/studio-7f3qk9/config.yml.

export type Link = { label: string; url: string };

export type Profile = {
  name: string;
  headline: string;
  summary: string;
  location: string;
  email: string;
  phone?: string;
  links: Link[];
};

export type TimelineItem = {
  title: string;
  org: string;
  location?: string;
  start: string; // YYYY-MM
  end?: string; // YYYY-MM, empty = present
  bullets?: string[];
};

export type Project = { name: string; url: string; description: string; tags?: string[] };
export type SkillGroup = { label: string; items: string[] };

type SectionBase = { id: string; title: string; hidden?: boolean };
export type Section =
  | (SectionBase & { type: 'timeline'; items: TimelineItem[] })
  | (SectionBase & { type: 'projects'; items: Project[] })
  | (SectionBase & { type: 'skills'; groups: SkillGroup[] })
  | (SectionBase & { type: 'text'; body: string });

export type Ui = {
  summary: string;
  present: string;
  downloadResume: string;
  pdf: string;
  docx: string;
  generating: string;
  toggleTheme: string;
  language: string;
  menu: string;
  contact: string;
  visit: string;
  rights: string;
  skip: string;
};

export type Content = {
  meta: { title: string; description: string; keywords?: string[] };
  ui: Ui;
  profile: Profile;
  sections: Section[];
};
