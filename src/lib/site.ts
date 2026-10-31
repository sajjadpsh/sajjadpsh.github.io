// Both are injected by the Pages workflow; defaults match the production user site.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://sajjadpsh.github.io').replace(/\/$/, '');
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

// Google Search Console ownership (URL-prefix property https://sajjadpsh.github.io/). Keep it: removing it un-verifies.
export const GOOGLE_SITE_VERIFICATION = '672QNEasPHdwO6BcmgqkqQ3pipJXNzFsn9QRdfqthg0';

// Repository the CMS edits; push access to it is what makes a visitor "authorized".
export const REPO = 'sajjadpsh/sajjadpsh.github.io';
