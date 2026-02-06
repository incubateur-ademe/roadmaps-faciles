import SideMenu from "@codegouvfr/react-dsfr/SideMenu";
import { Suspense } from "react";

import { ClientAnimate } from "@/components/utils/ClientAnimate";
import { Container, Grid, GridCol } from "@/dsfr";
import { assertTenantAdmin } from "@/utils/auth";

const TenantAdminLayout = async ({ children }: LayoutProps<"/[domain]/admin">) => {
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
                items: [
                  {
                    linkProps: { href: `/admin/general#privacy` },
                    text: "Confidentialité",
                    isActive: true,
                  },
                  {
                    linkProps: { href: `/admin/general#moderation` },
                    text: "Modération",
                  },
                  {
                    linkProps: { href: `/admin/general#header` },
                    text: "En-tête",
                  },
                  {
                    linkProps: { href: `/admin/general#visibility` },
                    text: "Visibilité",
                  },
                ],
                isActive: true,
                expandedByDefault: true,
              },
              {
                text: "Authentification",
                linkProps: { href: `/admin/authentication` },
                //
              },
              {
                text: "Boards",
                linkProps: { href: `/admin/boards` },
              },
              {
                text: "Statuts",
                linkProps: { href: `/admin/statuses` },
              },
              {
                text: "Feuille de route",
                linkProps: { href: `/admin/roadmap` },
              },
              {
                text: "Webhooks",
                linkProps: { href: `/admin/webhooks` },
              },
              {
                text: "Invitations",
                linkProps: { href: `/admin/invitations` },
              },
              {
                text: "API",
                linkProps: { href: `/admin/api` },
              },
            ]}
          />
        </GridCol>
        <GridCol md={8}>
          <Suspense fallback={<div>Chargement…</div>}>
            <ClientAnimate>{children}</ClientAnimate>
          </Suspense>
        </GridCol>
      </Grid>
    </Container>
  );
};

export default TenantAdminLayout;
