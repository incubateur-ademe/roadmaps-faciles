import { headerFooterDisplayItem } from "@codegouvfr/react-dsfr/Display";
import Footer, { type FooterProps } from "@codegouvfr/react-dsfr/Footer";
import { getTranslations } from "next-intl/server";

import { config } from "@/config";
import { FooterPersonalDataPolicyItem } from "@/consentManagement";

export interface DefaultFooterProps {
  id: FooterProps["id"];
}

export const DefaultFooter = async ({ id }: DefaultFooterProps) => {
  const t = await getTranslations("footer");

  return (
    <Footer
      id={id}
      accessibility="non compliant"
      accessibilityLinkProps={{ href: "/accessibilite" }}
      contentDescription={t("contentDescription", { brandName: config.brand.name })}
      operatorLogo={config.brand.operator.enable ? config.brand.operator.logo : undefined}
      bottomItems={[
        {
          text: t("cgu"),
          linkProps: { href: "/cgu" },
        },
        <FooterPersonalDataPolicyItem key="FooterPersonalDataPolicyItem" />,
        headerFooterDisplayItem,
        // <FooterConsentManagementItem key="FooterConsentManagementItem" />,
        {
          text: `Version ${config.appVersion}.${config.appVersionCommit.slice(0, 7)}`,
          linkProps: {
            href: `${config.repositoryUrl}/commit/${config.appVersionCommit}` as never,
          },
        },
      ]}
      termsLinkProps={{ href: "/mentions-legales" }}
      license={
        <>
          {t.rich("license", {
            a: chunks => (
              <a href={`${config.repositoryUrl}/main/LICENSE`} target="_blank" rel="noreferrer">
                {chunks}
              </a>
            ),
          })}
        </>
      }
    />
  );
};
