import { LegalNotice } from "@incubateur-ademe/legal-pages-react/LegalNotice";
import { type Metadata } from "next";

import { config } from "@/config";

import { sharedMetadata } from "../../shared-metadata";

const title = "Mentions légales";
const description = "Mentions légales du site";
const url = "/mentions-legales";

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

const MentionsLegalesPage = () => {
  return (
    <div className="fr-container fr-my-4w">
      <LegalNotice
        includeBetaGouv
        siteName={config.brand.name}
        siteUrl={config.host}
        siteHost={{
          name: "Scalingo SAS",
          address: "15 avenue du Rhin, 67100 Strasbourg, France",
          email: "support@scalingo.com",
          country: "France",
        }}
        contactEmail="accelerateurdelatransitionecologique@ademe.fr"
        licenceUrl={`${config.repositoryUrl}/blob/main/LICENSE`}
        privacyPolicyUrl="/politique-de-confidentialite"
      />
    </div>
  );
};

export default MentionsLegalesPage;
