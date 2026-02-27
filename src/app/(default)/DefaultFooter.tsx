import { getTranslations } from "next-intl/server";

import { config } from "@/config";
import { RootFooter } from "@/ui/shadcn/RootFooter";

export interface DefaultFooterProps {
  id: string;
}

export const DefaultFooter = async ({ id }: DefaultFooterProps) => {
  const t = await getTranslations("footer");

  return (
    <RootFooter
      id={id}
      brandName={config.brand.name}
      contentDescription={t("contentDescription", { brandName: config.brand.name })}
      bottomLinks={[
        { text: t("cgu"), href: "/cgu" },
        { text: t("legalNotice"), href: "/mentions-legales" },
      ]}
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
      version={`v${config.appVersion}.${config.appVersionCommit.slice(0, 7)}`}
    />
  );
};
