"use client";

import Button from "@codegouvfr/react-dsfr/Button";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import { useTranslations } from "next-intl";

import { ErrorLayout } from "@/components/ErrorLayout";
import { Container, Grid, GridCol } from "@/dsfr";
import { clientParseError } from "@/utils/error";

import { artworkMap, normalizeArtwork, artworkOvoidSvgUrl } from "./SystemMessageDisplay";

export default function Error({ error: _error, reset }: { error: Error; reset: () => void }) {
  const error = clientParseError(_error);
  const t = useTranslations("errors");
  const normalizedPictogram = artworkMap.technicalError;

  return (
    <ErrorLayout>
      <Container>
        <Grid haveGutters valign="middle" align="center" my="7w" mtmd="12w" mbmd="10w">
          <GridCol md={6} py="0">
            <h1>{t("technicalError")}</h1>
            <p className="fr-text--lead fr-mb-3w">{error.name}</p>
            <div className="fr-text--sm fr-mb-5w">
              <p>{error.message}</p>
              <Button priority="tertiary" onClick={() => reset()}>
                {t("retry")}
              </Button>
            </div>
            <ButtonsGroup
              inlineLayoutWhen="md and up"
              buttons={[
                {
                  children: t("homepage"),
                  linkProps: {
                    href: "/",
                  },
                },
              ]}
            />
          </GridCol>
          <GridCol md={3} offsetMd={1} px="6w" pxmd="0" py="0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="fr-responsive-img fr-artwork"
              aria-hidden="true"
              width="160"
              height="200"
              viewBox="0 0 160 200"
            >
              <use
                className="fr-artwork-motif"
                href={`${normalizeArtwork(artworkOvoidSvgUrl).src}#artwork-motif`}
              ></use>
              <use
                className="fr-artwork-background"
                href={`${normalizeArtwork(artworkOvoidSvgUrl).src}#artwork-background`}
              ></use>
              <g transform="translate(40, 60)">
                <use className="fr-artwork-decorative" href={`${normalizedPictogram.src}#artwork-decorative`}></use>
                <use className="fr-artwork-minor" href={`${normalizedPictogram.src}#artwork-minor`}></use>
                <use className="fr-artwork-major" href={`${normalizedPictogram.src}#artwork-major`}></use>
              </g>
            </svg>
          </GridCol>
        </Grid>
      </Container>
    </ErrorLayout>
  );
}
