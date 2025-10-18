import SideMenu from "@codegouvfr/react-dsfr/SideMenu";

import { ClientAnimate } from "@/components/utils/ClientAnimate";
import { Container, Grid, GridCol } from "@/dsfr";
import { assertTenantAdmin } from "@/utils/auth";

const TenantAdminLayout = async ({ children }: LayoutProps<"/[domain]">) => {
  await assertTenantAdmin();

  return (
    <Container my="4w">
      <Grid align="center" haveGutters>
        <GridCol md={4}>
          <SideMenu
            burgerMenuButtonText="Administration"
            items={[
              {
                text: "Général",
                linkProps: { href: `/admin/general` },
              },
            ]}
          />
        </GridCol>
        <GridCol md={8}>
          <ClientAnimate>{children}</ClientAnimate>
        </GridCol>
      </Grid>
    </Container>
  );
};

export default TenantAdminLayout;
