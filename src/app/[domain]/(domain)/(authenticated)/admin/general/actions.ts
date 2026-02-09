"use server";

import { revalidatePath } from "next/cache";
import z from "zod";

import { tenantRepo, tenantSettingsRepo, userOnTenantRepo } from "@/lib/repo";
import { DeleteTenant } from "@/useCases/tenant/DeleteTenant";
import { SaveTenantWithSettings, SaveTenantWithSettingsInput } from "@/useCases/tenant/SaveTenantWithSettings";
import { UpdateTenantDomain, UpdateTenantDomainInput } from "@/useCases/tenant/UpdateTenantDomain";
import { assertTenantAdmin, assertTenantOwner } from "@/utils/auth";
import { type ServerActionResponse } from "@/utils/next";
import { getDomainFromHost, getTenantFromDomain } from "@/utils/tenant";

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

export const deleteTenant = async (): Promise<ServerActionResponse> => {
  const domain = await getDomainFromHost();
  const session = await assertTenantOwner(domain);
  const tenant = await getTenantFromDomain(domain);

  try {
    const useCase = new DeleteTenant(tenantRepo, userOnTenantRepo);
    await useCase.execute({ tenantId: tenant.id, userId: session.user.uuid });
    return { ok: true };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
};

export const updateTenantDomain = async (data: unknown): Promise<ServerActionResponse> => {
  const domain = await getDomainFromHost();
  await assertTenantOwner(domain);

  const validated = UpdateTenantDomainInput.safeParse(data);
  if (!validated.success) {
    return { ok: false, error: z.prettifyError(validated.error) };
  }

  try {
    const useCase = new UpdateTenantDomain(tenantSettingsRepo);
    await useCase.execute(validated.data);
    revalidatePath("/admin/general");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
};
