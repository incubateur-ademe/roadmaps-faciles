"use server";

import { redirect } from "next/navigation";

import { invitationRepo, tenantRepo, tenantSettingsRepo } from "@/lib/repo";
import { CreateNewTenant } from "@/useCases/tenant/CreateNewTenant";
import { assertSession } from "@/utils/auth";
import { type ServerActionResponse } from "@/utils/next";

export const createTenant = async (data: {
  name: string;
  subdomain: string;
}): Promise<ServerActionResponse<{ id: number }>> => {
  const session = await assertSession();

  try {
    const useCase = new CreateNewTenant(tenantRepo, tenantSettingsRepo, invitationRepo);
    const result = await useCase.execute({
      name: data.name,
      subdomain: data.subdomain,
      ownerEmails: [session.user.email],
    });

    redirect(`/tenant/${result.tenant.id}`);
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
};
