"use server";

import { revalidatePath } from "next/cache";

import { tenantSettingsRepo } from "@/lib/repo";
import { getServerService } from "@/lib/services";
import { assertTenantAdmin } from "@/utils/auth";
import { type ServerActionResponse } from "@/utils/next";

export const saveRoadmapSettings = async (data: { rootBoardId: null | number }): Promise<ServerActionResponse> => {
  await assertTenantAdmin();
  const { tenant } = await getServerService("current");

  try {
    const settings = await tenantSettingsRepo.findByTenantId(tenant.id);
    if (!settings) throw new Error("Settings not found");

    await tenantSettingsRepo.update(settings.id, data);
    revalidatePath("/admin/roadmap");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
};
