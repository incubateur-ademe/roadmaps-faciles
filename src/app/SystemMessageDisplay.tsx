import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import artworkOvoidSvgUrl from "@codegouvfr/react-dsfr/dsfr/artwork/background/ovoid.svg";
import artworkCalendarSvgUrl from "@codegouvfr/react-dsfr/dsfr/artwork/pictograms/digital/calendar.svg";
import artworkSearchSvgUrl from "@codegouvfr/react-dsfr/dsfr/artwork/pictograms/digital/search.svg";
import artworkPadlockSvgUrl from "@codegouvfr/react-dsfr/dsfr/artwork/pictograms/system/padlock.svg";
import artworkTechnicalErrorSvgUrl from "@codegouvfr/react-dsfr/dsfr/artwork/pictograms/system/technical-error.svg";
import { getTranslations } from "next-intl/server";
import { type LinkProps } from "next/link";
import { type ReactNode } from "react";

import { Box, Container, Grid, GridCol } from "@/dsfr";
import artworkInProgressSvgUrl from "@/dsfr/artwork/pictograms/digital/in-progress.svg";

type SimpleSrcImage = { src: string };
export const normalizeArtwork = (pictogram: SimpleSrcImage | string): SimpleSrcImage => {
  if (typeof pictogram === "string") {
    return { src: pictogram };
  }
  return pictogram;
};

const artworkMap = {
  calendar: normalizeArtwork(artworkCalendarSvgUrl),
  inProgress: normalizeArtwork(artworkInProgressSvgUrl),
  padlock: normalizeArtwork(artworkPadlockSvgUrl),
  technicalError: normalizeArtwork(artworkTechnicalErrorSvgUrl),
  search: normalizeArtwork(artworkSearchSvgUrl),
};

const SYSTEM_CODE_PICTOGRAMS: Record<string, SimpleSrcImage> = {
  "401": artworkMap.padlock,
  "403": artworkMap.padlock,
  "404": artworkMap.search,
  "500": artworkMap.technicalError,
  construction: artworkMap.inProgress,
  maintenance: artworkMap.inProgress,
};

const SYSTEM_CODE_ALIASES: Record<string, string> = {
  unauthorized: "401",
  forbidden: "403",
  "not-found": "404",
  "login-AuthorizedCallbackError": "401",
  "login-AccessDenied": "401",
};

export type SystemCode = keyof typeof SYSTEM_CODE_ALIASES;

export const VALID_SYSTEM_CODES = new Set([
  ...Object.keys(SYSTEM_CODE_PICTOGRAMS),
  ...Object.keys(SYSTEM_CODE_ALIASES),
]);

export type SystemMessageDisplayProps = SystemMessageDisplayProps.WithCode & SystemMessageDisplayProps.WithRedirect;

namespace SystemMessageDisplayProps {
  export type WithRedirect =
    | {
        noRedirect: true;
        redirectLink?: never;
        redirectText?: never;
      }
    | {
        noRedirect?: never;
        redirectLink?: LinkProps<string>["href"];
        redirectText?: string;
      };

  export type WithCode =
    | {
        body: ReactNode;
        code: "custom";
        headline: string;
        pictogram?: keyof typeof artworkMap | SimpleSrcImage;
        title: string;
      }
    | {
        body?: never;
        code: SystemCode;
        headline?: never;
        pictogram?: never;
        title?: never;
      };
}

export const SystemMessageDisplay = async ({
  code,
  noRedirect,
  body,
  headline,
  title,
  pictogram = artworkMap.technicalError,
  redirectLink = "/",
  redirectText,
}: SystemMessageDisplayProps) => {
  const t = await getTranslations("errors");

  if (code !== "custom") {
    const resolvedCode = SYSTEM_CODE_ALIASES[code] ?? code;
    body = t(`${resolvedCode}.body` as "401.body");
    headline = t(`${resolvedCode}.headline` as "401.headline");
    title = t(`${resolvedCode}.title` as "401.title");
    pictogram = SYSTEM_CODE_PICTOGRAMS[resolvedCode] ?? artworkMap.technicalError;
    code = resolvedCode;
  }

  if (!redirectText) redirectText = t("homepage");

  if (typeof pictogram === "string") pictogram = artworkMap[pictogram];
  const normalizedPictogram = normalizeArtwork(pictogram);

  return (
    <Container>
      <Grid haveGutters valign="middle" align="center" my="7w" mtmd="12w" mbmd="10w">
        <GridCol md={6} py="0">
          <h1>{title}</h1>
          {!isNaN(+code) && (
            <Box as="p" className="fr-text--sm" mb="3w">
              {t("errorCode", { code })}
            </Box>
          )}
          <Box as="p" className="fr-text--lead" mb="3w">
            {headline}
          </Box>
          <Box className="fr-text--sm" mb="5w">
            {body}
          </Box>
          {!noRedirect && (
            <ButtonsGroup
              inlineLayoutWhen="md and up"
              buttons={[
                {
                  children: redirectText,
                  linkProps: {
                    href: redirectLink,
                  },
                },
              ]}
            />
          )}
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
            <use className="fr-artwork-motif" href={`${normalizeArtwork(artworkOvoidSvgUrl).src}#artwork-motif`}></use>
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
  );
};
