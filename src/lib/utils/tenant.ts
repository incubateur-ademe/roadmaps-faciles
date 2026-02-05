import { config } from "@/config";

export const getTenantSubdomain = (domain: string): null | string =>
  domain.endsWith(`.${config.rootDomain}`) ? domain.replace(`.${config.rootDomain}`, "") : null;
