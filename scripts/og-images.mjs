// Renders the 1200x630 social-preview cards (public/og/<locale>.png) from content + headshot.
// Rerun after changing the name, headline or photo: `npm run og` (needs Playwright with Chromium:
// `npx playwright install chromium`). The PNGs are committed, so CI never needs a browser.
import { createRequire } from 'node:module';
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

// require() (not import) so a globally installed Playwright is found too.
const { chromium } = createRequire(import.meta.url)('playwright');
const root = resolve(import.meta.dirname, '..');
const host = new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://sajjadpsh.github.io').host; // same default as src/lib/site.ts
const font = (pkg, file) => `file://${join(root, 'node_modules/@fontsource-variable', pkg, 'files', file)}`;
const logo = readFileSync(join(root, 'src/app/icon.svg'), 'utf8');
const esc = (s) => s.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
const rtl = new Set(['fa', 'ar']);

const card = ({ profile }, locale) => `<!doctype html><html dir="${rtl.has(locale) ? 'rtl' : 'ltr'}"><head><meta charset="utf-8"><style>
@font-face{font-family:Inter;src:url(${font('inter', 'inter-latin-wght-normal.woff2')}) format('woff2');font-weight:100 900}
@font-face{font-family:Vazirmatn;src:url(${font('vazirmatn', 'vazirmatn-arabic-wght-normal.woff2')}) format('woff2');font-weight:100 900}
*{margin:0;box-sizing:border-box}
html{overflow:hidden} /* RTL pages would otherwise scroll sideways */
body{width:1200px;height:630px;overflow:hidden;position:relative;display:flex;align-items:center;gap:64px;padding:0 84px;
  background:#09090b;color:#fafafa;font-family:${rtl.has(locale) ? 'Vazirmatn,Inter' : 'Inter,Vazirmatn'},sans-serif}
.glow{position:absolute;inset:0;filter:blur(40px);background:
  radial-gradient(38% 45% at 18% 8%,#6366f1b0,transparent 70%),radial-gradient(40% 45% at 58% 0%,#06b6d4a0,transparent 70%),
  radial-gradient(34% 42% at 96% 14%,#a855f7a8,transparent 70%)}
.photo{position:relative;width:360px;height:360px;flex:none;border-radius:56px;object-fit:cover;border:3px solid #ffffff2e;box-shadow:0 40px 80px -30px #000}
.text{position:relative;display:flex;flex-direction:column;gap:22px;min-width:0}
.logo svg{width:68px;height:68px;display:block}
h1{font-size:76px;line-height:1.05;font-weight:800;letter-spacing:-.02em}
p{font-size:36px;line-height:1.3;font-weight:600;color:#d4d4d8}
.url{font-size:28px;font-weight:500;color:#a5b4fc;direction:ltr;unicode-bidi:isolate}
</style></head><body><div class="glow"></div>
${profile.photo ? `<img class="photo" src="file://${join(root, 'public', profile.photo)}" alt="">` : ''}
<div class="text"><div class="logo">${logo}</div><h1>${esc(profile.name)}</h1><p>${esc(profile.headline)}</p><span class="url">${host}</span></div>
</body></html>`;

mkdirSync(join(root, 'public/og'), { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const locale of readdirSync(join(root, 'content'))) {
  const content = JSON.parse(readFileSync(join(root, 'content', locale, 'site.json'), 'utf8'));
  const html = join(tmpdir(), `og-${locale}.html`);
  writeFileSync(html, card(content, locale));
  await page.goto(`file://${html}`);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: join(root, 'public/og', `${locale}.png`) });
  console.log(`public/og/${locale}.png`);
}
await browser.close();
