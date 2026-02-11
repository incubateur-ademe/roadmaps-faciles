import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import crypto from "node:crypto";

import style from "@/app/(default)/login/login.module.scss";
import { LoginForm } from "@/app/(default)/login/LoginForm";
import { config } from "@/config";
import { Box, Container, Grid, GridCol } from "@/dsfr";
import { DsfrPage } from "@/dsfr/layout/DsfrPage";
import { prisma } from "@/lib/db/prisma";

import { DomainPageHOP } from "../DomainPage";
import { BridgeAutoLogin } from "./BridgeAutoLogin";

const TenantLoginPage = DomainPageHOP()(async props => {
  const t = await getTranslations("auth");
  // Validate invitation token if present in URL
  const searchParams = await (props as unknown as { searchParams: Promise<Record<string, string | undefined>> })
    .searchParams;
  let invitationEmail: string | undefined;

  const invitationToken = searchParams?.invitation;
  if (invitationToken) {
    const tokenDigest = crypto.createHash("sha256").update(invitationToken).digest("hex");
    const invitation = await prisma.invitation.findFirst({
      where: { tokenDigest, tenantId: props._data.tenant.id, acceptedAt: null },
      select: { email: true },
    });
    if (invitation) {
      invitationEmail = invitation.email;
    }
  }

  // Handle bridge token — auto sign-in from root session via client component
  const bridgeToken = searchParams?.bridge_token;
  if (bridgeToken) {
    return (
      <DsfrPage>
        <Container ptmd="14v" mbmd="14v" fluid>
          <Grid haveGutters align="center">
            <GridCol md={8} lg={6}>
              <Container pxmd="0" py="10v" mymd="14v" className={style.login}>
                <Grid haveGutters align="center">
                  <GridCol md={9} lg={8}>
                    <BridgeAutoLogin token={bridgeToken} />
                  </GridCol>
                </Grid>
              </Container>
            </GridCol>
          </Grid>
        </Container>
      </DsfrPage>
    );
  }

  // Build bridge link URL
  const headersList = await headers();
  const protocol = headersList.get("x-forwarded-proto") || "http";
  const host = headersList.get("host") || "localhost";
  const currentLoginUrl = `${protocol}://${host}/login`;
  const bridgeUrl = `${config.host}/api/auth-bridge?redirect=${encodeURIComponent(currentLoginUrl)}`;

  return (
    <DsfrPage>
      <Container ptmd="14v" mbmd="14v" fluid>
        <Grid haveGutters align="center">
          <GridCol md={8} lg={6}>
            <Container pxmd="0" py="10v" mymd="14v" className={style.login}>
              <Grid haveGutters align="center">
                <GridCol md={9} lg={8}>
                  <h1>{t("tenantLogin", { name: props._data.settings.name })}</h1>
                  <Box>
                    <LoginForm loginWithEmail defaultEmail={invitationEmail} />
                  </Box>
                  <hr className="fr-mt-4w fr-pb-2w" />
                  <p className="fr-text--sm">
                    {t("bridgePrompt", { brand: config.brand.name })}{" "}
                    <a href={bridgeUrl}>{t("bridgeLink", { brand: config.brand.name })}</a>
                  </p>
                </GridCol>
              </Grid>
            </Container>
          </GridCol>
        </Grid>
      </Container>
    </DsfrPage>
  );
});

export default TenantLoginPage;
