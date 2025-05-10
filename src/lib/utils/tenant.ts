import { config } from "@/config";

export const getTenantSubdomain = (domain: string): string | null =>
  domain.endsWith(`.${config.rootDomain}`) ? domain.replace(`.${config.rootDomain}`, "") : null;
