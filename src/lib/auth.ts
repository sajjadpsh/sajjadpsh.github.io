import { REPO } from './site';

// Sveltia CMS (the hidden editor) keeps the signed-in GitHub token here; same origin, so we reuse it.
const CMS_USER_KEY = 'sveltia-cms.user';

/** True when the visitor is signed in to the CMS with a token that can push to the site repo. */
export async function hasEditAccess(): Promise<boolean> {
  try {
    const token = JSON.parse(localStorage.getItem(CMS_USER_KEY) ?? 'null')?.token;
    if (!token) return false;
    const res = await fetch(`https://api.github.com/repos/${REPO}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' },
      cache: 'no-store',
    });
    return res.ok && (await res.json()).permissions?.push === true;
  } catch {
    return false;
  }
}
