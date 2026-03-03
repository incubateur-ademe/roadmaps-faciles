import { ClientAnimate } from "@/components/utils/ClientAnimate";
import { Container, Grid, GridCol } from "@/dsfr";
import { DsfrPage } from "@/dsfr/layout/DsfrPage";
import { assertTenantModerator } from "@/utils/auth";

import { ModerationSideMenu } from "./ModerationSideMenu";

const ModerationLayout = async ({ children, params }: LayoutProps<"/[domain]/moderation">) => {
  await assertTenantModerator((await params).domain);

  return (
    <DsfrPage>
      <Container m="4w" fluid className="!overflow-visible">
        <Grid align="center" haveGutters>
          <GridCol md={2}>
            <ModerationSideMenu />
          </GridCol>
          <GridCol md={10}>
            <ClientAnimate>{children}</ClientAnimate>
          </GridCol>
        </Grid>
      </Container>
    </DsfrPage>
  );
};

export default ModerationLayout;
