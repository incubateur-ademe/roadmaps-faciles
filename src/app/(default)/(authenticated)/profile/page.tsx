import Button from "@codegouvfr/react-dsfr/Button";
import { getTranslations } from "next-intl/server";
import { connection } from "next/server";

import { Container, Grid, GridCol } from "@/dsfr";
import { DsfrPage } from "@/dsfr/layout/DsfrPage";
import { auth } from "@/lib/next-auth/auth";
import { userRepo } from "@/lib/repo";

import { ProfileForm } from "./ProfileForm";

const ProfilePage = async () => {
  await connection();
  const [session, t] = await Promise.all([auth(), getTranslations("profile")]);
  const user = await userRepo.findById(session!.user.uuid);

  if (!user) return null;

  return (
    <DsfrPage>
      <Container my="4w">
        <h1>{t("title")}</h1>
        <Grid haveGutters>
          <GridCol md={6}>
            <ProfileForm
              variant="root"
              user={{
                name: user.name,
                email: user.email,
                notificationsEnabled: user.notificationsEnabled,
                isBetaGouvMember: user.isBetaGouvMember,
                username: user.username,
                emEmail: null,
              }}
            />
          </GridCol>
        </Grid>
        <hr className="fr-mt-4w fr-pb-2w" />
        <h2>{t("securityTitle")}</h2>
        <p>{t("securityDescription")}</p>
        <Button linkProps={{ href: "/profile/security" }} priority="secondary">
          {t("securityLink")}
        </Button>
      </Container>
    </DsfrPage>
  );
};

export default ProfilePage;
