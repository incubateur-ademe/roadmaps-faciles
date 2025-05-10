import { z } from "zod";

import { type Tenant } from "@/lib/model/Tenant";
import { type ITenantRepo } from "@/lib/repo/ITenantRepo";
import { localeSchema } from "@/utils/zod-schema";

import { type UseCase } from "../types";

export const SaveTenantInput = z.object({
  id: z.number(),
  name: z.string(),
  subdomain: z.string(),
  customDomain: z.string().nullable(),
  locale: localeSchema,
});
export type SaveTenantInput = z.infer<typeof SaveTenantInput>;
export type SaveTenantOutput = Tenant;

export class SaveTenant implements UseCase<SaveTenantInput, SaveTenantOutput> {
  constructor(private readonly tenantRepo: ITenantRepo) {}

  public async execute(tenant: SaveTenantInput): Promise<SaveTenantOutput> {
    const updatedTenant = await this.tenantRepo.update(tenant.id, {
      name: tenant.name,
      subdomain: tenant.subdomain,
      customDomain: tenant.customDomain,
      locale: tenant.locale,
    });

    return updatedTenant;
  }
}
