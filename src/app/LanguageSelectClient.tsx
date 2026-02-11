"use client";

import { LanguageSelect } from "@codegouvfr/react-dsfr/LanguageSelect";
import { useLocale } from "next-intl";
import { usePathname as useNextPathname, useRouter as useNextRouter } from "next/navigation";

import { DEFAULT_LOCALE, LOCALE_LABELS, LOCALES, stripLocalePrefix } from "@/utils/i18n";

export const LanguageSelectClient = () => {
  const locale = useLocale();
  const pathname = useNextPathname();
  const router = useNextRouter();

  const strippedPathname = stripLocalePrefix(pathname);

  return (
    <LanguageSelect
      lang={locale}
      supportedLangs={LOCALES}
      fullNameByLang={LOCALE_LABELS}
      setLang={newLocale => {
        const prefix = newLocale === DEFAULT_LOCALE ? "" : `/${newLocale}`;
        router.push(`${prefix}${strippedPathname}`);
      }}
    />
  );
};
