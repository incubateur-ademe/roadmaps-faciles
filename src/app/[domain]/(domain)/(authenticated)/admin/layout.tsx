import { Suspense } from "react";

import { Container, Grid, GridCol } from "@/dsfr";
import { assertTenantAdmin } from "@/utils/auth";

import { AdminSideMenu } from "./AdminSideMenu";

const TenantAdminLayout = async ({ children }: LayoutProps<"/[domain]/admin">) => {
  await assertTenantAdmin();

  return (
    <Container my="4w">
      <Grid align="center" haveGutters>
        <GridCol md={4}>
          <AdminSideMenu />
        </GridCol>
        <GridCol md={8}>
          <Suspense fallback={<div>Chargement…</div>}>{children}</Suspense>
        </GridCol>
      </Grid>
    </Container>
  );
};

export default TenantAdminLayout;
