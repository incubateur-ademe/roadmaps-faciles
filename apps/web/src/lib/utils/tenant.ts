import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { config } from "@/config";
import { type Tenant } from "@/lib/model/Tenant";
import { tenantRepo } from "@/lib/repo";
import { GetTenantForDomain, GetTenantForDomainNotFoundError } from "@/useCases/tenant/GetTenantForDomain";

export const getDomainFromHost = async (): Promise<string> => {
  const headersList = await headers();
  const host = headersList.get("x-forwarded-host") || headersList.get("host");

  if (!host) {
    throw new Error("No host header found");
  }

  return host;
};

export const getTenantFromDomain = async (domainParam: string): Promise<Tenant> => {
  const domain = decodeURIComponent(domainParam);
  const useCase = new GetTenantForDomain(tenantRepo);

  try {
    const tenant = await useCase.execute({ domain });
    return tenant;
  } catch (error) {
    if (error instanceof GetTenantForDomainNotFoundError) {
      notFound();
    }

    throw error;
  }
};

export const getTenantSubdomain = (domain: string): null | string =>
  domain.endsWith(`.${config.rootDomain}`) ? domain.replace(`.${config.rootDomain}`, "") : null;
