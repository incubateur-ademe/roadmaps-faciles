import Header from "@codegouvfr/react-dsfr/Header";
import { notFound } from "next/navigation";

import { Brand } from "@/components/Brand";
import { ClientAnimate } from "@/components/utils/ClientAnimate";
import { ClientBodyPortal } from "@/components/utils/ClientBodyPortal";
import { ClientOnly } from "@/components/utils/ClientOnly";
import { prisma } from "@/lib/db/prisma";
import { type Tenant } from "@/lib/model/Tenant";
import { getServerService } from "@/lib/services";
import { type TenantSetting } from "@/prisma/client";
import { getDirtyDomain } from "@/utils/dirtyDomain/getDirtyDomain";
import { dirtySafePathname } from "@/utils/dirtyDomain/pathnameDirtyCheck";

import { LoginLogoutHeaderItem, UserHeaderItem } from "../../AuthHeaderItems";
import styles from "../../root.module.scss";
import { DomainNavigation } from "./DomainNavigation";
import { getTenantFromDomainProps } from "./getTenantFromDomainParam";

const Navigation = async ({ tenant, tenantSetting }: { tenant: Tenant; tenantSetting: TenantSetting }) => {
  const boards = await prisma.board.findMany({
    where: {
      tenantId: tenant.id,
    },
    orderBy: {
      order: "asc",
    },
  });

  return <DomainNavigation boards={boards} tenantSetting={tenantSetting} />;
};

const DashboardLayout = async ({ children, modal, params }: LayoutProps<"/[domain]">) => {
  const dirtyDomain = await getDirtyDomain();
  const dirtyDomainFixer = dirtyDomain ? dirtySafePathname(dirtyDomain) : (pathname: string) => pathname;
  const tenant = await getTenantFromDomainProps({ params });
  const tenantSetting = await prisma.tenantSetting.findFirst({
    where: {
      tenantId: tenant.id,
    },
  });
  if (!tenantSetting) {
    notFound();
  }

  const current = await getServerService("current");
  current.tenant = tenant;

  // Optional: Redirect to custom domain if it exists when on subdomain
  // if (
  //   domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) &&
  //   tenant.customDomain &&
  //   process.env.REDIRECT_TO_CUSTOM_DOMAIN_IF_EXISTS === "true"
  // ) {
  //   return redirect(`https://${tenant.customDomain}`);
  // }

  return (
    <>
      <Header
        navigation={<Navigation tenant={tenant} tenantSetting={tenantSetting} />}
        brandTop={<Brand />}
        homeLinkProps={{
          href: dirtyDomainFixer("/"),
          title: tenant.name,
        }}
        serviceTitle={tenant.name}
        quickAccessItems={[<UserHeaderItem key="hqai-user" />, <LoginLogoutHeaderItem key="hqai-loginlogout" />].filter(
          Boolean,
        )}
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
