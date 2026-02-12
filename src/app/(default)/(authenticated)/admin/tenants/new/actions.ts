"use server";

import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";

import { invitationRepo, tenantRepo, tenantSettingsRepo } from "@/lib/repo";
import { CreateNewTenant, CreateNewTenantInput } from "@/useCases/tenant/CreateNewTenant";
import { assertAdmin } from "@/utils/auth";
import { type ServerActionResponse } from "@/utils/next";

export const createTenant = async (data: unknown): Promise<ServerActionResponse<{ tenantId: number }>> => {
  await assertAdmin();

  const validated = CreateNewTenantInput.safeParse(data);
  if (!validated.success) {
    const t = await getTranslations("serverErrors");
    return { ok: false, error: t("invalidData") };
  }

  try {
    const useCase = new CreateNewTenant(tenantRepo, tenantSettingsRepo, invitationRepo);
    const tenant = await useCase.execute(validated.data);
    revalidatePath("/admin/tenants");
    return { ok: true, data: { tenantId: tenant.id } };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
};
