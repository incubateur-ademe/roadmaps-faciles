import { Container, Grid, GridCol } from "@/dsfr";
import { DsfrPage } from "@/dsfr/layout/DsfrPage";
import { espaceMembreClient, getEmUserEmail } from "@/lib/espaceMembre";
import { auth } from "@/lib/next-auth/auth";
import { userRepo } from "@/lib/repo";

import { ProfileForm } from "../../../../(default)/(authenticated)/profile/ProfileForm";
import { DomainPageHOP } from "../../DomainPage";

const TenantProfilePage = DomainPageHOP()(async () => {
  const session = await auth();
  const user = await userRepo.findById(session!.user.uuid);

  if (!user) return <></>;

  let emEmail: null | string = null;
  if (user.isBetaGouvMember && user.username) {
    try {
      const member = await espaceMembreClient.member.getByUsername(user.username);
      emEmail = getEmUserEmail(member);
    } catch {
      // EM API indisponible — on continue sans emEmail
    }
  }

  return (
    <DsfrPage>
      <Container my="4w">
        <h1>Mon profil</h1>
        <Grid haveGutters>
          <GridCol md={6}>
            <ProfileForm
              variant="tenant"
              user={{
                name: user.name,
                email: user.email,
                notificationsEnabled: user.notificationsEnabled,
                isBetaGouvMember: user.isBetaGouvMember,
                username: user.username,
                emEmail,
              }}
            />
          </GridCol>
        </Grid>
      </Container>
    </DsfrPage>
  );
});

export default TenantProfilePage;
