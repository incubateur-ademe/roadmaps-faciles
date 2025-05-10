import Header from "@codegouvfr/react-dsfr/Header";
import MainNavigation from "@codegouvfr/react-dsfr/MainNavigation";
import { notFound } from "next/navigation";
import { type PropsWithChildren } from "react";

import { Brand } from "@/components/Brand";
import { ClientAnimate } from "@/components/utils/ClientAnimate";

import { LoginLogoutHeaderItem, UserHeaderItem } from "../AuthHeaderItems";
import styles from "../root.module.scss";
import { type DomainProps, getTenantFromDomainProps } from "./getTenantFromDomainParam";

const DashboardLayout = async ({ children, params }: PropsWithChildren<DomainProps>) => {
  const tenant = await getTenantFromDomainProps({ params });

  if (!tenant) {
    notFound();
  }

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
        navigation={<MainNavigation items={[{ text: "Roadmap", linkProps: { href: "/roadmap" }, isActive: true }]} />}
        brandTop={<Brand />}
        homeLinkProps={{
          href: "/",
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
    </>
  );
};

export default DashboardLayout;
