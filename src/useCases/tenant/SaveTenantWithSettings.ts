import { z } from "zod";

import { type TenantSettings } from "@/lib/model/TenantSettings";
import { type ITenantSettingsRepo } from "@/lib/repo/ITenantSettingsRepo";

import { type UseCase } from "../types";

export const SaveTenantWithSettingsInput = z.object({
  id: z.number(),
  isPrivate: z.boolean(),
  allowAnonymousFeedback: z.boolean(),
  allowPostEdits: z.boolean(),
  allowPostDeletion: z.boolean(),
  showRoadmapInHeader: z.boolean(),
  allowVoting: z.boolean(),
  allowComments: z.boolean(),
  allowAnonymousVoting: z.boolean(),
  requirePostApproval: z.boolean(),
  allowEmbedding: z.boolean(),
});
export type SaveTenantWithSettingsInput = z.infer<typeof SaveTenantWithSettingsInput>;
export type SaveTenantWithSettingsOutput = TenantSettings;

export class SaveTenantWithSettings implements UseCase<SaveTenantWithSettingsInput, SaveTenantWithSettingsOutput> {
  constructor(private readonly tenantSettingsRepo: ITenantSettingsRepo) {}

  public async execute(tenantSettings: SaveTenantWithSettingsInput): Promise<SaveTenantWithSettingsOutput> {
    const updatedTenantSetting = await this.tenantSettingsRepo.update(tenantSettings.id, {
      isPrivate: tenantSettings.isPrivate,
      allowAnonymousFeedback: tenantSettings.allowAnonymousFeedback,
      allowPostEdits: tenantSettings.allowPostEdits,
      allowPostDeletion: tenantSettings.allowPostDeletion,
      showRoadmapInHeader: tenantSettings.showRoadmapInHeader,
      allowVoting: tenantSettings.allowVoting,
      allowComments: tenantSettings.allowComments,
      allowAnonymousVoting: tenantSettings.allowAnonymousVoting,
      requirePostApproval: tenantSettings.requirePostApproval,
      allowEmbedding: tenantSettings.allowEmbedding,
    });

    return updatedTenantSetting;
  }
}
