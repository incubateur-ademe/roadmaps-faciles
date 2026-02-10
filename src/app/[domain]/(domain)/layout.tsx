import Header from "@codegouvfr/react-dsfr/Header";
import { notFound } from "next/navigation";

import { Brand } from "@/components/Brand";
import { ClientAnimate } from "@/components/utils/ClientAnimate";
import { ClientBodyPortal } from "@/components/utils/ClientBodyPortal";
import { ClientOnly } from "@/components/utils/ClientOnly";
import { prisma } from "@/lib/db/prisma";
import { type Tenant } from "@/lib/model/Tenant";
import { type TenantSettings } from "@/prisma/client";
import { getDirtyDomain } from "@/utils/dirtyDomain/getDirtyDomain";
import { dirtySafePathname } from "@/utils/dirtyDomain/pathnameDirtyCheck";
import { getTenantFromDomain } from "@/utils/tenant";
import { type EmptyObject } from "@/utils/types";

import { UserHeaderItem } from "../../AuthHeaderItems";
import styles from "../../root.module.scss";
import { DomainNavigation } from "./DomainNavigation";

export interface DomainParams {
  domain: string;
}

export interface DomainProps<Params extends object = EmptyObject> {
  params: Promise<DomainParams & Params>;
}

const Navigation = async ({ tenant, tenantSettings }: { tenant: Tenant; tenantSettings: TenantSettings }) => {
  const boards = await prisma.board.findMany({
    where: {
      tenantId: tenant.id,
    },
    orderBy: {
      order: "asc",
    },
  });

  return <DomainNavigation boards={boards} tenantSettings={tenantSettings} />;
};

const DashboardLayout = async ({ children, modal, params }: LayoutProps<"/[domain]">) => {
  const [dirtyDomain, tenant] = await Promise.all([getDirtyDomain(), getTenantFromDomain((await params).domain)]);

  const dirtyDomainFixer = dirtyDomain ? dirtySafePathname(dirtyDomain) : (pathname: string) => pathname;

  const tenantSettings = await prisma.tenantSettings.findFirst({
    where: {
      tenantId: tenant.id,
    },
  });

  if (!tenantSettings) {
    notFound();
  }

  return (
    <>
      <Header
        navigation={<Navigation tenant={tenant} tenantSettings={tenantSettings} />}
        brandTop={<Brand />}
        homeLinkProps={{
          href: dirtyDomainFixer("/"),
          title: tenantSettings.name,
        }}
        serviceTitle={tenantSettings.name}
        quickAccessItems={[<UserHeaderItem key="hqai-user" />]}
      />
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
};

export default DashboardLayout;
