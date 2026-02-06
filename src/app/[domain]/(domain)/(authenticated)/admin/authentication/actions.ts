"use server";

import { revalidatePath } from "next/cache";

import { tenantSettingsRepo } from "@/lib/repo";
import { getServerService } from "@/lib/services";
import { type EmailRegistrationPolicy } from "@/prisma/enums";
import { assertTenantAdmin } from "@/utils/auth";
import { type ServerActionResponse } from "@/utils/next";

export const saveAuthenticationSettings = async (data: {
  allowedEmailDomains: string[];
  emailRegistrationPolicy: EmailRegistrationPolicy;
}): Promise<ServerActionResponse> => {
  await assertTenantAdmin();
  const { tenant } = await getServerService("current");

  try {
    const settings = await tenantSettingsRepo.findByTenantId(tenant.id);
    if (!settings) throw new Error("Settings not found");

    await tenantSettingsRepo.update(settings.id, data);
    revalidatePath("/admin/authentication");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
};
