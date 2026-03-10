import { type Metadata } from "next";

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
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-4 text-3xl font-bold">{title}</h1>
      <p className="text-lg text-muted-foreground">
        Les conditions générales d'utilisation sont en cours de rédaction et seront publiées prochainement.
      </p>
    </div>
  );
};

export default CguPage;
