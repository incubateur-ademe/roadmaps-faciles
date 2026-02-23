import { fr } from "@codegouvfr/react-dsfr";
import { type Metadata } from "next";

import { Container } from "@/dsfr";

import { sharedMetadata } from "../../shared-metadata";

const title = "Déclaration d'accessibilité";
const description = "Déclaration d'accessibilité du site";
const url = "/accessibilite";

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

const AccessibilitePage = () => {
  return (
    <Container py="6w">
      <h1>{title}</h1>
      <p className={fr.cx("fr-text--lead")}>
        Cette page sera complétée prochainement avec la déclaration d'accessibilité conforme au RGAA.
      </p>
      <p>
        État de conformité : <strong>non conforme</strong>. Un audit d'accessibilité est prévu.
      </p>
    </Container>
  );
};

export default AccessibilitePage;
