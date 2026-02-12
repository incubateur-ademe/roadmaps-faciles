import Button from "@codegouvfr/react-dsfr/Button";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { type Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { ImgHero } from "@/components/img/ImgHero";
import { config } from "@/config";
import { Box, Container, Grid, GridCol } from "@/dsfr";
import { DsfrPage } from "@/dsfr/layout/DsfrPage";

import { sharedMetadata } from "../shared-metadata";
import styles from "./index.module.scss";

const url = "/";

export const metadata: Metadata = {
  ...sharedMetadata,
  openGraph: {
    ...sharedMetadata.openGraph,
    url,
  },
  alternates: {
    canonical: url,
  },
};

const Home = async (_: PageProps<"/">) => {
  const t = await getTranslations("home");

  return (
    <DsfrPage>
      <Box as="section" pb="4w" pt="9w" className={cx(styles.hero)}>
        <Container>
          <Grid haveGutters>
            <GridCol lg={7} className="fr-my-auto">
              <h1>{t("title")}</h1>
              <p>
                {t.rich("description", {
                  brandName: config.brand.name,
                  strong: chunks => <strong>{chunks}</strong>,
                  u: chunks => <u>{chunks}</u>,
                })}
              </p>
              <Button iconId="fr-icon-arrow-right-line" iconPosition="right" linkProps={{ href: "/tenant" }}>
                {t("cta")}
              </Button>
            </GridCol>
            <GridCol md={6} lg={5} className="fr-mx-auto">
              <ImgHero />
            </GridCol>
          </Grid>
        </Container>
      </Box>
    </DsfrPage>
  );
};

export default Home;
