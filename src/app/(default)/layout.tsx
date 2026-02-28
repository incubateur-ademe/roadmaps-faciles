import { ClientAnimate } from "@/components/utils/ClientAnimate";
import { config } from "@/config";

import styles from "../root.module.scss";
import { DefaultFooter } from "./DefaultFooter";
import { DefaultHeader } from "./DefaultHeader";
import { RootSystemMessage } from "./RootSystemMessage";

const DefaultLayout = ({ children }: LayoutProps<"/">) => {
  return (
    <>
      <DefaultHeader />
      <ClientAnimate as="main" id="content" className={styles.content}>
        {config.maintenance ? <RootSystemMessage code="maintenance" noRedirect /> : children}
      </ClientAnimate>
      <DefaultFooter id="footer" />
    </>
  );
};

export default DefaultLayout;
