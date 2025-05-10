import { z } from "zod";

import { TenantSetting } from "@/lib/model/TenantSetting";
import { type ITenantSettingRepo } from "@/lib/repo/ITenantSettingRepo";

import { type UseCase } from "../types";

export const GetTenantSettingsInput = z.object({
  tenantId: z.number(),
});
export type GetTenantSettingsInput = z.infer<typeof GetTenantSettingsInput>;

export const GetTenantSettingsOutput = TenantSetting;
export type GetTenantSettingsOutput = z.infer<typeof GetTenantSettingsOutput>;

export class GetTenantSettings implements UseCase<GetTenantSettingsInput, GetTenantSettingsOutput> {
  constructor(private readonly tenantSettingRepo: ITenantSettingRepo) {}

  public async execute(input: GetTenantSettingsInput): Promise<GetTenantSettingsOutput> {
    const tenantSettings = await this.tenantSettingRepo.findByTenantId(input.tenantId);
    if (!tenantSettings) {
      throw new Error(`Tenant settings from associated tenant (${input.tenantId}) not found`);
    }

    return TenantSetting.parse(tenantSettings);
  }
}
