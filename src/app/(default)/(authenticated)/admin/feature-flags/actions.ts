"use server";

import { revalidatePath } from "next/cache";

import { type FeatureFlagsMap } from "@/lib/feature-flags";
import { appSettingsRepo } from "@/lib/repo";
import { audit, AuditAction, getRequestContext } from "@/utils/audit";
import { assertAdmin } from "@/utils/auth";
import { type ServerActionResponse } from "@/utils/next";

export const saveFeatureFlags = async (flags: FeatureFlagsMap): Promise<ServerActionResponse> => {
  const session = await assertAdmin();
  const reqCtx = await getRequestContext();

  try {
    await appSettingsRepo.update({ featureFlags: { ...flags } });

    audit(
      {
        action: AuditAction.ROOT_FEATURE_FLAGS_UPDATE,
        userId: session.user.uuid,
        metadata: { ...flags },
      },
      reqCtx,
    );

    revalidatePath("/admin/feature-flags");
    return { ok: true };
  } catch (error) {
    audit(
      {
        action: AuditAction.ROOT_FEATURE_FLAGS_UPDATE,
        success: false,
        error: (error as Error).message,
        userId: session.user.uuid,
      },
      reqCtx,
    );
    return { ok: false, error: (error as Error).message };
  }
};
