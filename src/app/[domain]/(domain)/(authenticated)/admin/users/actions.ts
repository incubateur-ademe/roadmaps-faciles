"use server";

import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";

import { userOnTenantRepo } from "@/lib/repo";
import { UserRole, type UserStatus } from "@/prisma/enums";
import { RemoveMember } from "@/useCases/user_on_tenant/RemoveMember";
import { UpdateMemberRole } from "@/useCases/user_on_tenant/UpdateMemberRole";
import { UpdateMemberStatus } from "@/useCases/user_on_tenant/UpdateMemberStatus";
import { assertTenantAdmin, assertTenantOwner } from "@/utils/auth";
import { type ServerActionResponse } from "@/utils/next";
import { getDomainFromHost, getTenantFromDomain } from "@/utils/tenant";

export const updateMemberRole = async (data: { role: UserRole; userId: string }): Promise<ServerActionResponse> => {
  const t = await getTranslations("serverErrors");
  const domain = await getDomainFromHost();
  // Promouvoir en OWNER nécessite d'être owner soi-même
  const session = data.role === UserRole.OWNER ? await assertTenantOwner(domain) : await assertTenantAdmin(domain);
  const tenant = await getTenantFromDomain(domain);

  if (data.userId === session.user.uuid) {
    return { ok: false, error: t("cannotEditOwnRole") };
  }

  try {
    const useCase = new UpdateMemberRole(userOnTenantRepo);
    await useCase.execute({ userId: data.userId, tenantId: tenant.id, role: data.role });
    revalidatePath("/admin/users");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
};

export const updateMemberStatus = async (data: {
  status: UserStatus;
  userId: string;
}): Promise<ServerActionResponse> => {
  const t = await getTranslations("serverErrors");
  const domain = await getDomainFromHost();
  const session = await assertTenantAdmin(domain);
  const tenant = await getTenantFromDomain(domain);

  if (data.userId === session.user.uuid) {
    return { ok: false, error: t("cannotEditOwnStatus") };
  }

  try {
    const useCase = new UpdateMemberStatus(userOnTenantRepo);
    await useCase.execute({ userId: data.userId, tenantId: tenant.id, status: data.status });
    revalidatePath("/admin/users");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
};

export const removeMember = async (data: { userId: string }): Promise<ServerActionResponse> => {
  const t = await getTranslations("serverErrors");
  const domain = await getDomainFromHost();
  const session = await assertTenantAdmin(domain);
  const tenant = await getTenantFromDomain(domain);

  if (data.userId === session.user.uuid) {
    return { ok: false, error: t("cannotRemoveSelf") };
  }

  try {
    const useCase = new RemoveMember(userOnTenantRepo);
    await useCase.execute({ userId: data.userId, tenantId: tenant.id });
    revalidatePath("/admin/users");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
};
