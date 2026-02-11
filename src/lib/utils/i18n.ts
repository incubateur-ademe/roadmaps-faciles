export const AVAILABLE_LOCALES = {
  fr: "fr",
  en: "en",
} as const;
export const DEFAULT_LOCALE = AVAILABLE_LOCALES.fr;
export const LOCALES = Object.values(AVAILABLE_LOCALES);
export const LOCALE_COOKIE = "NEXT_LOCALE";
export const LOCALE_LABELS = {
  [AVAILABLE_LOCALES.fr]: "Français",
  [AVAILABLE_LOCALES.en]: "English",
};
export type Locale = keyof typeof AVAILABLE_LOCALES;

const NON_DEFAULT_LOCALES = LOCALES.filter(l => l !== DEFAULT_LOCALE);
const localePrefixPattern = new RegExp(`^\\/(${NON_DEFAULT_LOCALES.join("|")})(\\/.*)?$`);

export function stripLocalePrefix(pathname: string): string {
  const match = pathname.match(localePrefixPattern);
  return match ? match[2] || "/" : pathname;
}
