import { notFound } from "next/navigation";
import { type EmptyObject } from "react-hook-form";

import { type Tenant } from "@/lib/model/Tenant";
import { tenantRepo } from "@/lib/repo";
import { GetTenantForDomain, GetTenantForDomainNotFoundError } from "@/useCases/tenant/GetTenantForDomain";

export interface DomainParams {
  domain: string;
}

export interface DomainProps<Params extends object = EmptyObject> {
  params: Promise<DomainParams & Params>;
}

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
