import { PrivacyPolicy } from "@incubateur-ademe/legal-pages-react/PrivacyPolicy";
import { type Metadata } from "next";

import { config } from "@/config";

import { sharedMetadata } from "../../shared-metadata";
import { CookieConsentButton } from "../CookieConsentButton";

const title = "Politique de confidentialité";
const description = "Politique de confidentialité et gestion des cookies";
const url = "/politique-de-confidentialite";

export const metadata: Metadata = {
  ...sharedMetadata,
  title,
  description,
  openGraph: {
    ...sharedMetadata.openGraph,
    title,
    description,
    url,
  },
  alternates: {
    canonical: url,
  },
};

const PolitiqueDeConfidentialitePage = () => {
  return (
    <div className="fr-container fr-my-4w">
      <PrivacyPolicy
        includeBetaGouv
        siteName={config.brand.name}
        cookieConsentButton={<CookieConsentButton />}
        cookies={[
          {
            category: "Mesure d'audience anonymisée",
            name: "Matomo",
            expiration: "13 mois",
            finalities: "Mesure d'audience",
            editor: "Matomo & ADEME",
            destination: "France",
          },
        ]}
        thirdParties={[
          {
            name: "Scalingo",
            country: "France",
            hostingCountry: "France",
            serviceType: "Hébergement",
            policyUrl: "https://scalingo.com/fr/contrat-gestion-traitements-donnees-personnelles",
          },
        ]}
      />
    </div>
  );
};

export default PolitiqueDeConfidentialitePage;
