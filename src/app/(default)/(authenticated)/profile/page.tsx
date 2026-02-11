import { connection } from "next/server";

import { Container, Grid, GridCol } from "@/dsfr";
import { DsfrPage } from "@/dsfr/layout/DsfrPage";
import { auth } from "@/lib/next-auth/auth";
import { userRepo } from "@/lib/repo";

import { ProfileForm } from "./ProfileForm";

const ProfilePage = async () => {
  await connection();
  const session = await auth();
  const user = await userRepo.findById(session!.user.uuid);

  if (!user) return null;

  return (
    <DsfrPage>
      <Container my="4w">
        <h1>Mon profil</h1>
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
      </Container>
    </DsfrPage>
  );
};

export default ProfilePage;
