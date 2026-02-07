import { ClientAnimate } from "@/components/utils/ClientAnimate";
import { Container, Grid, GridCol } from "@/dsfr";
import { assertTenantAdmin } from "@/utils/auth";

import { AdminSideMenu } from "./AdminSideMenu";

const TenantAdminLayout = async ({ children, params }: LayoutProps<"/[domain]/admin">) => {
  await assertTenantAdmin((await params).domain);

  return (
    <Container m="4w" fluid className="!overflow-visible">
      <Grid align="center" haveGutters>
        <GridCol md={2}>
          <AdminSideMenu />
        </GridCol>
        <GridCol md={10}>
          <ClientAnimate>{children}</ClientAnimate>
        </GridCol>
      </Grid>
    </Container>
  );
};

export default TenantAdminLayout;
