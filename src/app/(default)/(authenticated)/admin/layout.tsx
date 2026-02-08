import SideMenu from "@codegouvfr/react-dsfr/SideMenu";

import { ClientAnimate } from "@/components/utils/ClientAnimate";
import { Container, Grid, GridCol } from "@/dsfr";
import { assertAdmin } from "@/utils/auth";

const AdminLayout = async ({ children }: LayoutProps<"/admin">) => {
  await assertAdmin();

  return (
    <Container my="4w">
      <Grid align="center" haveGutters>
        <GridCol md={2}>
          <SideMenu
            burgerMenuButtonText="Administration"
            items={[
              {
                text: "Prisma Studio",
                linkProps: { href: `/admin/prisma` },
                isActive: true,
              },
            ]}
          />
        </GridCol>
        <GridCol md={10}>
          <ClientAnimate>{children}</ClientAnimate>
        </GridCol>
      </Grid>
    </Container>
  );
};

export default AdminLayout;
