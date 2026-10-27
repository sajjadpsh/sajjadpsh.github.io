import type { Content } from './content';
import en from '@content/en/site.json';
import fa from '@content/fa/site.json';
import ar from '@content/ar/site.json';
import de from '@content/de/site.json';
import fr from '@content/fr/site.json';

// To add a language: add content/<code>/site.json, an entry below, and the code in the CMS config.
export const localeInfo = {
  en: { label: 'English', dir: 'ltr', intl: 'en', latin: true },
  fa: { label: 'فارسی', dir: 'rtl', intl: 'fa-u-ca-gregory', latin: false },
  ar: { label: 'العربية', dir: 'rtl', intl: 'ar-u-ca-gregory', latin: false },
  de: { label: 'Deutsch', dir: 'ltr', intl: 'de', latin: true },
  fr: { label: 'Français', dir: 'ltr', intl: 'fr', latin: true },
} as const;

export type Locale = keyof typeof localeInfo;
export const locales = Object.keys(localeInfo) as Locale[];
export const defaultLocale: Locale = 'en';

const contents = { en, fa, ar, de, fr } as Record<Locale, Content>;
export const getContent = (locale: Locale) => contents[locale];
export const isLocale = (value: string): value is Locale => value in localeInfo;
