import Button from "@codegouvfr/react-dsfr/Button";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { type Metadata } from "next";

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

const Home = () => (
  <DsfrPage>
    <Box as="section" pb="4w" pt="9w" className={cx(styles.hero)}>
      <Container>
        <Grid haveGutters>
          <GridCol lg={7} className="fr-my-auto">
            <h1>Créer et exposer la Roadmap de sa Startup d'État n'a jamais été aussi facile</h1>
            <p>
              Grâce à <strong>{config.brand.name}</strong>, regroupez facilement les avis et retours des usagers pour
              orienter efficacement la feuille de route de votre produit et améliorer votre{" "}
              <strong>
                <u>impact</u>
              </strong>{" "}
              !
            </p>
            <Button iconId="fr-icon-arrow-right-line" iconPosition="right" linkProps={{ href: "/tenant" }}>
              Commencer
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

export default Home;
