"use client";

import Button from "@codegouvfr/react-dsfr/Button";

import { useConsent } from "@/consentManagement";

export const CookieConsentButton = () => {
  const { assumeConsent } = useConsent();

  return (
    <Button priority="secondary" size="small" onClick={() => assumeConsent("matomo")}>
      Gérer mes cookies
    </Button>
  );
};
