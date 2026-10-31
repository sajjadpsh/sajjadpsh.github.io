import type { Content } from './content';
import en from '@content/en/site.json';
import fa from '@content/fa/site.json';
import ar from '@content/ar/site.json';
import de from '@content/de/site.json';
import fr from '@content/fr/site.json';

// To add a language: add content/<code>/site.json, an entry below, and the code in the CMS config.
// og: Open Graph locale (language_TERRITORY, as Facebook/LinkedIn expect).
export const localeInfo = {
  en: { label: 'English', dir: 'ltr', intl: 'en', latin: true, og: 'en_US' },
  fa: { label: 'فارسی', dir: 'rtl', intl: 'fa-u-ca-gregory', latin: false, og: 'fa_IR' },
  ar: { label: 'العربية', dir: 'rtl', intl: 'ar-u-ca-gregory', latin: false, og: 'ar_AR' },
  de: { label: 'Deutsch', dir: 'ltr', intl: 'de', latin: true, og: 'de_DE' },
  fr: { label: 'Français', dir: 'ltr', intl: 'fr', latin: true, og: 'fr_FR' },
} as const;

export type Locale = keyof typeof localeInfo;
export const locales = Object.keys(localeInfo) as Locale[];
export const defaultLocale: Locale = 'en';

const contents = { en, fa, ar, de, fr } as Record<Locale, Content>;
export const getContent = (locale: Locale) => contents[locale];
export const isLocale = (value: string): value is Locale => value in localeInfo;

/** URL path of a locale's page: the default locale lives at the site root, others at "/<code>". */
export const localePath = (locale: Locale) => (locale === defaultLocale ? '/' : `/${locale}`);
