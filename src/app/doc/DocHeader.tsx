import Header from "@codegouvfr/react-dsfr/Header";
import { getTranslations } from "next-intl/server";

import { Brand } from "@/components/Brand";
import { config } from "@/config";

import { LanguageSelectClient } from "../LanguageSelectClient";

export const DocHeader = async () => {
  const t = await getTranslations("navigation");

  return (
    <Header
      brandTop={<Brand />}
      homeLinkProps={{
        href: "/",
        title: `${t("home")} - ${config.brand.name}`,
      }}
      serviceTitle={<>{config.brand.name} — Documentation</>}
      serviceTagline="Guide utilisateur et documentation technique"
      operatorLogo={config.brand.operator.enable ? config.brand.operator.logo : undefined}
      quickAccessItems={[
        {
          iconId: "fr-icon-arrow-left-line",
          linkProps: { href: "/" },
          text: t("home"),
        },
        <LanguageSelectClient key="hqai-lang" />,
      ]}
    />
  );
};
