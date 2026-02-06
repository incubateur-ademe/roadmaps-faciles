"use server";

import { revalidatePath } from "next/cache";
import z from "zod";

import { tenantSettingsRepo } from "@/lib/repo";
import { SaveTenantWithSettings, SaveTenantWithSettingsInput } from "@/useCases/tenant/SaveTenantWithSettings";
import { assertTenantAdmin } from "@/utils/auth";
import { type ServerActionResponse } from "@/utils/next";
import { getDomainFromHost } from "@/utils/tenant";

export const saveTenantSettings = async (data: unknown): Promise<ServerActionResponse> => {
  const domain = await getDomainFromHost();
  await assertTenantAdmin(domain);

  const validated = SaveTenantWithSettingsInput.safeParse(data);
  if (!validated.success) {
    return { ok: false, error: z.prettifyError(validated.error) };
  }

  try {
    const useCase = new SaveTenantWithSettings(tenantSettingsRepo);
    await useCase.execute(validated.data);
    revalidatePath("/admin/general");
    return { ok: true };
  } catch (error) {
    console.error("Error saving tenant settings", error);
    return { ok: false, error: (error as Error).message };
  }
};
