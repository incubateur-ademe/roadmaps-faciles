import { z } from "zod";

import { type TenantSettings } from "@/lib/model/TenantSettings";
import { type ITenantSettingsRepo } from "@/lib/repo/ITenantSettingsRepo";

import { type UseCase } from "../types";

export const SaveTenantWithSettingsInput = z.object({
  id: z.number(),
  isPrivate: z.boolean(),
  allowAnonymousFeedback: z.boolean(),
  allowPostEdits: z.boolean(),
  showRoadmapInHeader: z.boolean(),
  collapsedBoards: z.boolean(),
  showVoteCount: z.boolean(),
  showVoteButton: z.boolean(),
  allowVoting: z.boolean(),
  allowComments: z.boolean(),
  allowAnonymousVoting: z.boolean(),
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
      showRoadmapInHeader: tenantSettings.showRoadmapInHeader,
      collapsedBoards: tenantSettings.collapsedBoards,
      showVoteCount: tenantSettings.showVoteCount,
      showVoteButton: tenantSettings.showVoteButton,
      allowVoting: tenantSettings.allowVoting,
      allowComments: tenantSettings.allowComments,
      allowAnonymousVoting: tenantSettings.allowAnonymousVoting,
    });

    return updatedTenantSetting;
  }
}
