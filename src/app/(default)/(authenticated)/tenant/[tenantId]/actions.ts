"use server";

import { revalidatePath } from "next/cache";
import z from "zod";

import { Tenant } from "@/lib/model/Tenant";
import { TenantSettings } from "@/lib/model/TenantSettings";
import { tenantRepo } from "@/lib/repo";
import { SaveTenant, type SaveTenantOutput } from "@/useCases/tenant/SaveTenant";
import { type ServerActionResponse } from "@/utils/next";

type SaveTenantResponse = ServerActionResponse<SaveTenantOutput>;
type SaveTenantProps = { setting: Partial<TenantSettings>; tenant: Partial<Tenant> };

export const saveTenant = async ({ tenant, setting }: SaveTenantProps): Promise<SaveTenantResponse> => {
  // TODO check if the user is allowed to update the tenant

  const tenantValidated = Tenant.omit({
    updatedAt: true,
    createdAt: true,
    deletedAt: true,
  }).safeParse(tenant);

  if (!tenantValidated.success) {
    return {
      ok: false,
      error: z.prettifyError(tenantValidated.error),
    };
  }

  const settingValidated = TenantSettings.pick({
    name: true,
    subdomain: true,
    customDomain: true,
    locale: true,
  }).safeParse(setting);

  if (!settingValidated.success) {
    return {
      ok: false,
      error: z.prettifyError(settingValidated.error),
    };
  }

  try {
    const useCase = new SaveTenant(tenantRepo);
    const tenant = await useCase.execute({
      id: tenantValidated.data.id,
      setting: settingValidated.data,
    });

    revalidatePath(`/tenant/${tenant.id}`);
    return {
      ok: true,
      data: tenant,
    };
  } catch (error) {
    console.error("Error saving tenant", error);
    return {
      ok: false,
      error: (error as Error).message,
    };
  }
};
