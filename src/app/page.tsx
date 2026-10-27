import LocalePage, { localeMetadata } from '@/components/LocalePage';
import { defaultLocale } from '@/lib/i18n';

export const metadata = localeMetadata(defaultLocale);

export default function Home() {
  return <LocalePage locale={defaultLocale} />;
}
