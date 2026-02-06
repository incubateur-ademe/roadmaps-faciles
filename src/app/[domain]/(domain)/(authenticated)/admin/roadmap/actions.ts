"use server";

import { revalidatePath } from "next/cache";

import { tenantSettingsRepo } from "@/lib/repo";
import { assertTenantAdmin } from "@/utils/auth";
import { type ServerActionResponse } from "@/utils/next";

import { getTenantFromDomain } from "../../../getTenantFromDomainParam";

export const saveRoadmapSettings = async (
  data: { rootBoardId: null | number },
  domain: string,
): Promise<ServerActionResponse> => {
  await assertTenantAdmin(domain);
  const tenant = await getTenantFromDomain(domain);

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
