import { type PropsWithChildren } from "react";

import { StartDsfrOnHydration } from "@/dsfr-bootstrap";

export const DsfrPage = ({ children }: PropsWithChildren) => (
  <>
    <StartDsfrOnHydration />
    {children}
  </>
);
