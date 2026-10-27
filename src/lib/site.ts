// Both are injected by the Pages workflow; defaults match the production user site.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://sajjadpsh.github.io').replace(/\/$/, '');
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

// Repository the CMS edits; push access to it is what makes a visitor "authorized".
export const REPO = 'sajjadpsh/spectre-m4';
