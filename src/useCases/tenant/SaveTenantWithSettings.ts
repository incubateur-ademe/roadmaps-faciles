import { z } from "zod";

import { type TenantSettings } from "@/lib/model/TenantSettings";
import { type ITenantSettingsRepo } from "@/lib/repo/ITenantSettingsRepo";

import { type UseCase } from "../types";

export const SaveTenantWithSettingsInput = z.object({
  id: z.number(),
  name: z.string(),
  subdomain: z.string(),
  customDomain: z.string().nullable(),
  allowAnonymousVoting: z.boolean(),
  allowComments: z.boolean(),
  allowPostEdits: z.boolean(),
  allowVoting: z.boolean(),
  isPrivate: z.boolean(),
});
export type SaveTenantWithSettingsInput = z.infer<typeof SaveTenantWithSettingsInput>;
export type SaveTenantWithSettingsOutput = TenantSettings;

export class SaveTenantWithSettings implements UseCase<SaveTenantWithSettingsInput, SaveTenantWithSettingsOutput> {
  constructor(private readonly tenantSettingsRepo: ITenantSettingsRepo) {}

  public async execute(tenantSettings: SaveTenantWithSettingsInput): Promise<SaveTenantWithSettingsOutput> {
    const updatedTenantSetting = await this.tenantSettingsRepo.update(tenantSettings.id, {
      allowAnonymousVoting: tenantSettings.allowAnonymousVoting,
      allowComments: tenantSettings.allowComments,
      allowPostEdits: tenantSettings.allowPostEdits,
      allowVoting: tenantSettings.allowVoting,
      isPrivate: tenantSettings.isPrivate,
    });

    return updatedTenantSetting;
  }
}
