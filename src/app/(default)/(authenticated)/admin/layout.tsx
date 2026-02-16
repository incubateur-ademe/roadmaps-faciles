import { connection } from "next/server";

import { ClientAnimate } from "@/components/utils/ClientAnimate";
import { Container, Grid, GridCol } from "@/dsfr";
import { DsfrPage } from "@/dsfr/layout/DsfrPage";
import { assertAdmin } from "@/utils/auth";

import { AdminSideMenu } from "./AdminSideMenu";

const AdminLayout = async ({ children }: LayoutProps<"/admin">) => {
  await connection();
  await assertAdmin();

  return (
    <DsfrPage>
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
    </DsfrPage>
  );
};

export default AdminLayout;
