"use server";

import { revalidatePath } from "next/cache";

import { config } from "@/config";
import { invitationRepo } from "@/lib/repo";
import { getServerService } from "@/lib/services";
import { type Invitation } from "@/prisma/client";
import { RevokeInvitation } from "@/useCases/invitations/RevokeInvitation";
import { SendInvitation } from "@/useCases/invitations/SendInvitation";
import { assertTenantAdmin } from "@/utils/auth";
import { type ServerActionResponse } from "@/utils/next";

export const sendInvitation = async (data: { email: string }): Promise<ServerActionResponse<Invitation>> => {
  await assertTenantAdmin();
  const { tenant } = await getServerService("current");

  try {
    const useCase = new SendInvitation(invitationRepo);
    const settings = await import("@/lib/repo").then(m => m.tenantSettingsRepo.findByTenantId(tenant.id));
    if (!settings) throw new Error("Settings not found");

    const tenantUrl = `${config.host.split("//")[0]}//${settings.subdomain}.${config.rootDomain}`;
    const invitation = await useCase.execute({ tenantId: tenant.id, email: data.email, tenantUrl });
    revalidatePath("/admin/invitations");
    return { ok: true, data: invitation };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
};

export const revokeInvitation = async (data: { id: number }): Promise<ServerActionResponse> => {
  await assertTenantAdmin();

  try {
    const useCase = new RevokeInvitation(invitationRepo);
    await useCase.execute(data);
    revalidatePath("/admin/invitations");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
};
