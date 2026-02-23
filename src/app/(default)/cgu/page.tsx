import { fr } from "@codegouvfr/react-dsfr";
import { type Metadata } from "next";

import { Container } from "@/dsfr";

import { sharedMetadata } from "../../shared-metadata";

const title = "Conditions générales d'utilisation";
const description = "Conditions générales d'utilisation du site";
const url = "/cgu";

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

const CguPage = () => {
  return (
    <Container py="6w">
      <h1>{title}</h1>
      <p className={fr.cx("fr-text--lead")}>
        Les conditions générales d'utilisation sont en cours de rédaction et seront publiées prochainement.
      </p>
    </Container>
  );
};

export default CguPage;
