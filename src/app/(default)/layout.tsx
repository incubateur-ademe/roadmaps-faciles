import { type PropsWithChildren } from "react";

import { ClientAnimate } from "@/components/utils/ClientAnimate";
import { config } from "@/config";

import styles from "../root.module.scss";
import { SystemMessageDisplay } from "../SystemMessageDisplay";
import { DefaultFooter } from "./DefaultFooter";
import { DefaultHeader } from "./DefaultHeader";

const DefaultLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <DefaultHeader />
      <ClientAnimate as="main" id="content" className={styles.content}>
        {config.env === "prod" ? (
          <SystemMessageDisplay code="construction" noRedirect />
        ) : config.maintenance ? (
          <SystemMessageDisplay code="maintenance" noRedirect />
        ) : (
          children
        )}
      </ClientAnimate>
      <DefaultFooter id="footer" />
    </>
  );
};

export default DefaultLayout;
