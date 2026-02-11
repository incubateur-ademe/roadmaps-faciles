import { type Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { Container } from "@/dsfr";

import { sharedMetadata } from "../../shared-metadata";

const title = "Statistiques d'utilisation";
const description = "Statistiques d'utilisation de la plateforme";
const url = "/stats";

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

const Stats = async () => {
  const t = await getTranslations("stats");

  return (
    <Container py="6w">
      <h1>{t("title")}</h1>
      {/* <StatsContent /> */}
    </Container>
  );
};

export default Stats;
