import { getTranslations } from "next-intl/server";
import { connection } from "next/server";

import { Container, Grid, GridCol } from "@/dsfr";
import { DsfrPage } from "@/dsfr/layout/DsfrPage";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/next-auth/auth";

import { TwoFactorSettings } from "./TwoFactorSettings";

const SecurityPage = async () => {
  await connection();
  const [session, t] = await Promise.all([auth(), getTranslations("profile.security")]);

  if (!session?.user) return null;

  const userId = session.user.uuid;

  const [user, authenticators] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { emailTwoFactorEnabled: true, otpVerifiedAt: true },
    }),
    prisma.authenticator.findMany({
      where: { userId },
      select: { credentialID: true, credentialDeviceType: true, credentialBackedUp: true },
    }),
  ]);

  if (!user) return null;

  return (
    <DsfrPage>
      <Container my="4w">
        <h1>{t("title")}</h1>
        <p>{t("description")}</p>
        <Grid haveGutters>
          <GridCol md={8}>
            <TwoFactorSettings
              emailEnabled={user.emailTwoFactorEnabled}
              otpConfigured={!!user.otpVerifiedAt}
              passkeys={authenticators}
            />
          </GridCol>
        </Grid>
      </Container>
    </DsfrPage>
  );
};

export default SecurityPage;
