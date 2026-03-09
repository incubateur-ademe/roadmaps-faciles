import { type ReactNode } from "react";

import style from "@/app/(default)/login/login.module.scss";
import { Box, Container, Grid, GridCol } from "@/dsfr";
import { DsfrPage } from "@/dsfr/layout/DsfrPage";

import { OAuthButtons } from "./OAuthButtons";

interface TenantLoginDsfrProps {
  bridgeLink: string;
  bridgePrompt: string;
  bridgeUrl: string;
  children: ReactNode;
  oauthPrompt: string;
  providerNames: string[];
  title: string;
}

export const TenantLoginDsfr = ({
  bridgeUrl,
  bridgePrompt,
  bridgeLink,
  children,
  oauthPrompt,
  providerNames,
  title,
}: TenantLoginDsfrProps) => (
  <DsfrPage>
    <Container ptmd="14v" mbmd="14v" fluid>
      <Grid haveGutters align="center">
        <GridCol md={8} lg={6}>
          <Container pxmd="0" py="10v" mymd="14v" className={style.login}>
            <Grid haveGutters align="center">
              <GridCol md={9} lg={8}>
                <h1>{title}</h1>
                <Box>{children}</Box>
                {providerNames.length > 0 && (
                  <>
                    <hr className="fr-mt-4w fr-pb-2w" />
                    <p className="fr-text--sm">{oauthPrompt}</p>
                    <OAuthButtons providers={providerNames} />
                  </>
                )}
                {bridgeUrl && (
                  <>
                    <hr className="fr-mt-4w fr-pb-2w" />
                    <p className="fr-text--sm">
                      {bridgePrompt} <a href={bridgeUrl}>{bridgeLink}</a>
                    </p>
                  </>
                )}
              </GridCol>
            </Grid>
          </Container>
        </GridCol>
      </Grid>
    </Container>
  </DsfrPage>
);
