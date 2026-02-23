import { PrivacyPolicy } from "@incubateur-ademe/legal-pages-react/PrivacyPolicy";
import { type Metadata } from "next";

import { config } from "@/config";
import { FooterConsentManagementItem } from "@/consentManagement";

import { sharedMetadata } from "../../shared-metadata";

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
        cookieConsentButton={
          <span className="consent-btn-wrapper">
            <FooterConsentManagementItem />
          </span>
        }
        cookies={[
          {
            category: "Session utilisateur",
            name: "authjs.session-token",
            expiration: "Session",
            finalities: "Authentification et maintien de la session utilisateur",
            editor: config.brand.name,
            destination: "France",
          },
          {
            category: "Préférence de langue",
            name: "NEXT_LOCALE",
            expiration: "1 an",
            finalities: "Mémoriser la langue choisie par l'utilisateur",
            editor: config.brand.name,
            destination: "France",
          },
          {
            category: "Identification anonyme",
            name: "anon_id",
            expiration: "1 an",
            finalities: "Identifier les contributions anonymes sans compte utilisateur",
            editor: config.brand.name,
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
