import crypto from "node:crypto";

import style from "@/app/(default)/login/login.module.scss";
import { LoginForm } from "@/app/(default)/login/LoginForm";
import { Box, Container, Grid, GridCol } from "@/dsfr";
import { DsfrPage } from "@/dsfr/layout/DsfrPage";
import { prisma } from "@/lib/db/prisma";

import { DomainPageHOP } from "../DomainPage";

const TenantLoginPage = DomainPageHOP()(async props => {
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

  return (
    <DsfrPage>
      <Container ptmd="14v" mbmd="14v" fluid>
        <Grid haveGutters align="center">
          <GridCol md={8} lg={6}>
            <Container pxmd="0" py="10v" mymd="14v" className={style.login}>
              <Grid haveGutters align="center">
                <GridCol md={9} lg={8}>
                  <h1>Connexion espace : {props._data.settings.name}</h1>
                  <Box>
                    <LoginForm loginWithEmail defaultEmail={invitationEmail} />
                  </Box>
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
