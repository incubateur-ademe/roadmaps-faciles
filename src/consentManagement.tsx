"use client";

import { createConsentManagement } from "@codegouvfr/react-dsfr/consentManagement";

export const {
  ConsentBannerAndConsentManagement,
  FooterConsentManagementItem,
  FooterPersonalDataPolicyItem,
  useConsent,
} = createConsentManagement({
  finalityDescription: () => ({}),
  personalDataPolicyLinkProps: {
    href: "/politique-de-confidentialite#cookies",
  },
});
