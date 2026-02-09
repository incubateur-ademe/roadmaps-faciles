"use server";

import { revalidatePath } from "next/cache";

import { config } from "@/config";
import { invitationRepo, userRepo } from "@/lib/repo";
import { type UserEmailSearchResult } from "@/lib/repo/IUserRepo";
import { type Invitation } from "@/prisma/client";
import { type UserRole } from "@/prisma/enums";
import { RevokeInvitation } from "@/useCases/invitations/RevokeInvitation";
import { SendInvitation } from "@/useCases/invitations/SendInvitation";
import { assertTenantAdmin, assertTenantOwner } from "@/utils/auth";
import { type ServerActionResponse } from "@/utils/next";
import { getDomainFromHost, getTenantFromDomain } from "@/utils/tenant";

export const sendInvitation = async (data: {
  email: string;
  role?: UserRole;
}): Promise<ServerActionResponse<Invitation>> => {
  const domain = await getDomainFromHost();

  if (data.role === "OWNER") {
    await assertTenantOwner(domain);
  } else {
    await assertTenantAdmin(domain);
  }

  const tenant = await getTenantFromDomain(domain);

  try {
    const useCase = new SendInvitation(invitationRepo);
    const settings = await import("@/lib/repo").then(m => m.tenantSettingsRepo.findByTenantId(tenant.id));
    if (!settings) throw new Error("Settings not found");

    const tenantUrl = `${config.host.split("//")[0]}//${settings.subdomain}.${config.rootDomain}`;
    const invitation = await useCase.execute({
      tenantId: tenant.id,
      email: data.email,
      tenantUrl,
      role: data.role,
    });
    revalidatePath("/admin/users/invitations");
    return { ok: true, data: invitation };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
};

export const searchUsersForInvitation = async (query: string): Promise<UserEmailSearchResult[]> => {
  const domain = await getDomainFromHost();
  await assertTenantAdmin(domain);
  const trimmed = query.trim();
  if (trimmed.length < 1 || trimmed.length > 100) return [];
  return userRepo.searchByEmail(trimmed);
};

export const revokeInvitation = async (data: { id: number }): Promise<ServerActionResponse> => {
  const domain = await getDomainFromHost();
  await assertTenantAdmin(domain);

  try {
    const useCase = new RevokeInvitation(invitationRepo);
    await useCase.execute(data);
    revalidatePath("/admin/users/invitations");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
};
