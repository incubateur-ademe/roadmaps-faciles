export const AVAILABLE_LOCALES = {
  fr: "fr",
  en: "en",
} as const;
export const DEFAULT_LOCALE = AVAILABLE_LOCALES.fr;
export const LOCALE_LABELS = {
  [AVAILABLE_LOCALES.fr]: "Français",
  [AVAILABLE_LOCALES.en]: "English",
};
export type Locale = keyof typeof AVAILABLE_LOCALES;
