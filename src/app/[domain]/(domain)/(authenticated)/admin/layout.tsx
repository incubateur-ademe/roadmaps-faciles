import { ClientAnimate } from "@/components/utils/ClientAnimate";
import { Container, Grid, GridCol } from "@/dsfr";
import { assertTenantAdmin } from "@/utils/auth";

import { AdminSideMenu } from "./AdminSideMenu";

const TenantAdminLayout = async ({ children, params }: LayoutProps<"/[domain]/admin">) => {
  await assertTenantAdmin((await params).domain);

  return (
    <Container my="4w">
      <Grid align="center" haveGutters>
        <GridCol md={4}>
          <AdminSideMenu />
        </GridCol>
        <GridCol md={8}>
          <ClientAnimate>{children}</ClientAnimate>
        </GridCol>
      </Grid>
    </Container>
  );
};

export default TenantAdminLayout;
