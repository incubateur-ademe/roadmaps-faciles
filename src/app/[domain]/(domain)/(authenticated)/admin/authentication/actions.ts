"use server";

import { revalidatePath } from "next/cache";

import { tenantSettingsRepo } from "@/lib/repo";
import { type EmailRegistrationPolicy } from "@/prisma/enums";
import { assertTenantAdmin } from "@/utils/auth";
import { type ServerActionResponse } from "@/utils/next";

import { getTenantFromDomain } from "../../../getTenantFromDomainParam";

export const saveAuthenticationSettings = async (
  data: {
    allowedEmailDomains: string[];
    emailRegistrationPolicy: EmailRegistrationPolicy;
  },
  domain: string,
): Promise<ServerActionResponse> => {
  await assertTenantAdmin(domain);
  const tenant = await getTenantFromDomain(domain);

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
