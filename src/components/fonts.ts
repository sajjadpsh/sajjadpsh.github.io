import localFont from 'next/font/local';

// Self-hosted variable fonts (files from @fontsource-variable), loaded through next/font so Inter is preloaded
// and gets a metric-matched fallback (no layout shift). unicode-range keeps each file from downloading unless
// its script is on the page: Vazirmatn only for Persian/Arabic text, Inter for Latin.
export const inter = localFont({
  src: '../../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2',
  variable: '--font-inter',
  weight: '100 900',
  display: 'swap',
  declarations: [
    {
      prop: 'unicode-range',
      value: 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD',
    },
  ],
});

export const vazirmatn = localFont({
  src: '../../node_modules/@fontsource-variable/vazirmatn/files/vazirmatn-arabic-wght-normal.woff2',
  variable: '--font-vazirmatn',
  weight: '100 900',
  display: 'swap',
  preload: false, // only fa/ar pages need it
  adjustFontFallback: false, // Arial metrics don't describe Arabic script
  declarations: [{ prop: 'unicode-range', value: 'U+0600-06FF,U+0750-077F,U+0870-08FF,U+200C-200E,U+2010-2011,U+204F,U+2E41,U+FB50-FDFF,U+FE70-FEFC' }],
});
