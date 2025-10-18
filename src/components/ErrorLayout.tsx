import Badge from "@codegouvfr/react-dsfr/Badge";
import Header from "@codegouvfr/react-dsfr/Header";
import { type PropsWithChildren } from "react";

import { config } from "@/config";

import styles from "../app/root.module.scss";
import { Brand } from "./Brand";
import { ClientAnimate } from "./utils/ClientAnimate";

export const ErrorLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Header
        brandTop={<Brand />}
        homeLinkProps={{
          href: "/",
          title: `Accueil - ${config.brand.name}`,
        }}
        serviceTitle={
          <>
            {config.brand.name}
            &nbsp;
            <Badge as="span" noIcon severity="warning">
              Alpha
            </Badge>
            {config.maintenance && (
              <Badge as="span" noIcon severity="warning">
                Maintenance
              </Badge>
            )}
          </>
        }
        serviceTagline={config.brand.tagline}
        operatorLogo={config.brand.operator.enable ? config.brand.operator.logo : undefined}
        classes={{
          operator: "shimmer",
        }}
      />
      <ClientAnimate as="main" id="content" className={styles.content}>
        {children}
      </ClientAnimate>
    </>
  );
};
