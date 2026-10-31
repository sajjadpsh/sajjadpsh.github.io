// Runs before every build/dev: writes WebP copies of the profile photo at the widths the hero's srcset uses
// (public/uploads/me.jpg -> me-192w.webp, me-384w.webp, me-640w.webp), so a photo changed in the CMS gets
// phone-sized versions without anyone running anything. Outputs are git-ignored.
import sharp from 'sharp';
import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

export const WIDTHS = [192, 384, 640]; // keep in sync with src/components/Hero.tsx
const root = resolve(import.meta.dirname, '..');
const photos = new Set(
  readdirSync(join(root, 'content')).map((l) => JSON.parse(readFileSync(join(root, 'content', l, 'site.json'), 'utf8')).profile.photo).filter(Boolean),
);
for (const photo of photos) {
  for (const w of WIDTHS) {
    const out = join(root, 'public', photo.replace(/\.[a-z0-9]+$/i, `-${w}w.webp`));
    await sharp(join(root, 'public', photo)).resize(w, w, { fit: 'cover' }).webp({ quality: 80 }).toFile(out);
  }
  console.log(`responsive images: ${photo} -> ${WIDTHS.map((w) => `${w}w`).join(', ')}`);
}
