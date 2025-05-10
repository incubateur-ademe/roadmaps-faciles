import { z } from "zod";

import { type Tenant } from "@/lib/model/Tenant";
import { type TenantSetting } from "@/lib/model/TenantSetting";
import { type ITenantRepo } from "@/lib/repo/ITenantRepo";
import { type ITenantSettingRepo } from "@/lib/repo/ITenantSettingRepo";

import { type UseCase } from "../types";

export const SaveTenantWithSettingsInput = z.object({
  tenant: z.object({
    id: z.number(),
    name: z.string(),
    subdomain: z.string(),
    customDomain: z.string().nullable(),
  }),
  tenantSetting: z.object({
    id: z.number(),
    allowAnonymousVoting: z.boolean(),
    allowComments: z.boolean(),
    allowPostEdits: z.boolean(),
    allowVoting: z.boolean(),
    isPrivate: z.boolean(),
  }),
});
export type SaveTenantWithSettingsInput = z.infer<typeof SaveTenantWithSettingsInput>;
export type SaveTenantWithSettingsOutput = {
  tenant: Tenant;
  tenantSetting: TenantSetting;
};

export class SaveTenantWithSettings implements UseCase<SaveTenantWithSettingsInput, SaveTenantWithSettingsOutput> {
  constructor(
    private readonly tenantRepo: ITenantRepo,
    private readonly tenantSettingRepo: ITenantSettingRepo,
  ) {}

  public async execute({ tenant, tenantSetting }: SaveTenantWithSettingsInput): Promise<SaveTenantWithSettingsOutput> {
    const updatedTenant = await this.tenantRepo.update(tenant.id, {
      name: tenant.name,
      subdomain: tenant.subdomain,
      customDomain: tenant.customDomain,
    });

    const updatedTenantSetting = await this.tenantSettingRepo.update(tenantSetting.id, {
      allowAnonymousVoting: tenantSetting.allowAnonymousVoting,
      allowComments: tenantSetting.allowComments,
      allowPostEdits: tenantSetting.allowPostEdits,
      allowVoting: tenantSetting.allowVoting,
      isPrivate: tenantSetting.isPrivate,
    });

    return {
      tenant: updatedTenant,
      tenantSetting: updatedTenantSetting,
    };
  }
}
