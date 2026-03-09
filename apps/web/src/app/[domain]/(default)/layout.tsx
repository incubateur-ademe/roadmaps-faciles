import MuiDsfrThemeProvider from "@codegouvfr/react-dsfr/mui";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { getLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { ClientAnimate } from "@/components/utils/ClientAnimate";
import { ClientBodyPortal } from "@/components/utils/ClientBodyPortal";
import { ClientOnly } from "@/components/utils/ClientOnly";
import { ConsentBannerAndConsentManagement } from "@/consentManagement";
import { DsfrProvider } from "@/dsfr-bootstrap";
import { prisma } from "@/lib/db/prisma";
import { type DomainParams, type DomainProps } from "@/lib/DomainPage";
import { POST_APPROVAL_STATUS } from "@/lib/model/Post";
import { UIProvider } from "@/ui";
import { DsfrCssLoaderClient } from "@/ui/DsfrCssLoaderClient";
import { Footer as ShadcnFooter } from "@/ui/Footer";
import { Header as ShadcnHeader } from "@/ui/Header";
import { getTheme } from "@/ui/server";
import { ThemeInjector } from "@/ui/ThemeInjector";
import { UIThemeDevToggle } from "@/ui/UIThemeDevToggle";
import { getDirtyDomain } from "@/utils/dirtyDomain/getDirtyDomain";
import { dirtySafePathname } from "@/utils/dirtyDomain/pathnameDirtyCheck";
import { getTenantFromDomain } from "@/utils/tenant";

import { ShadcnUserHeaderItem } from "../../(default)/ShadcnUserHeaderItem";
import styles from "../../root.module.scss";
import { DsfrHeader } from "./DsfrHeader";
import { PublicFooter } from "./PublicFooter";
import { ShadcnDomainNavigation } from "./ShadcnDomainNavigation";

export type { DomainParams, DomainProps };

const getBoards = (tenantId: number) =>
  prisma.board.findMany({
    where: { tenantId },
    orderBy: { order: "asc" },
  });

const DashboardLayout = async ({ children, modal, params }: LayoutProps<"/[domain]">) => {
  const [dirtyDomain, tenant, lang] = await Promise.all([
    getDirtyDomain(),
    getTenantFromDomain((await params).domain),
    getLocale(),
  ]);

  const dirtyDomainFixer = dirtyDomain ? dirtySafePathname(dirtyDomain) : (pathname: string) => pathname;

  const tenantSettings = await prisma.tenantSettings.findFirst({
    where: {
      tenantId: tenant.id,
    },
  });

  if (!tenantSettings) {
    notFound();
  }

  const [boards, pendingModerationCount] = await Promise.all([
    getBoards(tenant.id),
    prisma.post.count({ where: { tenantId: tenant.id, approvalStatus: POST_APPROVAL_STATUS.PENDING } }),
  ]);

  const theme = await getTheme(tenantSettings);
  const homeHref = dirtyDomainFixer("/");

  const mainContent = (
    <>
      <ClientAnimate as="main" id="content" className={styles.content}>
        {children}
      </ClientAnimate>

      <ClientOnly>
        <ClientBodyPortal>
          <ClientAnimate animateOptions={{ duration: 300 }}>{modal}</ClientAnimate>
        </ClientBodyPortal>
      </ClientOnly>
    </>
  );

  // DsfrProvider + MuiDsfrThemeProvider always wrap content because tenant page
  // components (BoardPost, PostList, etc.) still use DSFR hooks (useIsDark) and
  // components (Card, Badge, Tag). Only Header/Footer switch based on theme.
  return (
    <UIProvider value={theme}>
      <ThemeInjector theme={theme} />
      <DsfrProvider lang={lang}>
        {theme === "Dsfr" && <DsfrCssLoaderClient />}
        {theme === "Dsfr" && <ConsentBannerAndConsentManagement />}
        <AppRouterCacheProvider>
          <MuiDsfrThemeProvider>
            {theme === "Dsfr" ? (
              <DsfrHeader
                boards={boards}
                homeHref={homeHref}
                pendingModerationCount={pendingModerationCount}
                tenantSettings={tenantSettings}
              />
            ) : (
              <ShadcnHeader
                homeLinkProps={{ href: homeHref, title: tenantSettings.name }}
                serviceName={tenantSettings.name}
                navigation={<ShadcnDomainNavigation boards={boards} tenantSettings={tenantSettings} />}
                quickAccessItems={
                  <>
                    <UIThemeDevToggle />
                    <ShadcnUserHeaderItem variant="tenant" pendingModerationCount={pendingModerationCount} />
                  </>
                }
              />
            )}

            {mainContent}

            {theme === "Dsfr" ? (
              <PublicFooter id="footer" />
            ) : (
              <ShadcnFooter id="footer" serviceName={tenantSettings.name} />
            )}
          </MuiDsfrThemeProvider>
        </AppRouterCacheProvider>
      </DsfrProvider>
    </UIProvider>
  );
};

export default DashboardLayout;
