"use server";

import { revalidatePath } from "next/cache";

import { boardRepo, tenantSettingsRepo } from "@/lib/repo";
import { assertTenantAdmin } from "@/utils/auth";
import { type ServerActionResponse } from "@/utils/next";
import { getDomainFromHost, getTenantFromDomain } from "@/utils/tenant";

export const saveRoadmapSettings = async (data: { rootBoardId: null | number }): Promise<ServerActionResponse> => {
  const domain = await getDomainFromHost();
  await assertTenantAdmin(domain);
  const tenant = await getTenantFromDomain(domain);

  try {
    const settings = await tenantSettingsRepo.findByTenantId(tenant.id);
    if (!settings) throw new Error("Settings not found");

    if (data.rootBoardId !== null) {
      const board = await boardRepo.findById(data.rootBoardId);
      if (!board || board.tenantId !== tenant.id) throw new Error("Board not found");
    }

    await tenantSettingsRepo.update(settings.id, data);
    revalidatePath("/admin/roadmap");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
};
