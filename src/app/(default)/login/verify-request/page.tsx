import artworkMailSendSvgUrl from "@codegouvfr/react-dsfr/dsfr/artwork/pictograms/digital/mail-send.svg";
import { getTranslations } from "next-intl/server";

import { normalizeArtwork, SystemMessageDisplay } from "@/app/SystemMessageDisplay";
import { config } from "@/config";

const VerifyRequestPage = async () => {
  const t = await getTranslations("auth");

  return (
    <SystemMessageDisplay
      code="custom"
      title={t("emailSentTitle", { brandName: config.brand.name })}
      headline={t("emailSentHeadline")}
      body={
        <>
          <p>{t("emailSentBody")}</p>
          <p>{t("emailSentSpam")}</p>
        </>
      }
      noRedirect
      pictogram={normalizeArtwork(artworkMailSendSvgUrl)}
    />
  );
};

export default VerifyRequestPage;
