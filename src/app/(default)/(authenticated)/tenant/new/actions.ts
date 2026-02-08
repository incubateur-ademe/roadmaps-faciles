"use server";

import { redirect } from "next/navigation";

import { tenantRepo, tenantSettingsRepo, userOnTenantRepo } from "@/lib/repo";
import { CreateNewTenant } from "@/useCases/tenant/CreateNewTenant";
import { assertSession } from "@/utils/auth";
import { type ServerActionResponse } from "@/utils/next";

export const createTenant = async (data: {
  name: string;
  subdomain: string;
}): Promise<ServerActionResponse<{ id: number }>> => {
  const session = await assertSession();

  try {
    const useCase = new CreateNewTenant(tenantRepo, tenantSettingsRepo, userOnTenantRepo);
    const tenant = await useCase.execute({ name: data.name, subdomain: data.subdomain, userId: session.user.uuid });

    redirect(`/tenant/${tenant.id}`);
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
};
