"use server";

import { revalidatePath } from "next/cache";

import { userOnTenantRepo } from "@/lib/repo";
import { type UserRole, type UserStatus } from "@/prisma/enums";
import { RemoveMember } from "@/useCases/user_on_tenant/RemoveMember";
import { UpdateMemberRole } from "@/useCases/user_on_tenant/UpdateMemberRole";
import { UpdateMemberStatus } from "@/useCases/user_on_tenant/UpdateMemberStatus";
import { assertAdmin } from "@/utils/auth";
import { type ServerActionResponse } from "@/utils/next";

export const updateMemberRole = async (data: {
  role: UserRole;
  tenantId: number;
  userId: string;
}): Promise<ServerActionResponse> => {
  const session = await assertAdmin();

  if (data.userId === session.user.uuid) {
    return { ok: false, error: "Vous ne pouvez pas modifier votre propre rôle." };
  }

  try {
    const useCase = new UpdateMemberRole(userOnTenantRepo);
    await useCase.execute({ userId: data.userId, tenantId: data.tenantId, role: data.role });
    revalidatePath(`/admin/tenants/${data.tenantId}`);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
};

export const updateMemberStatus = async (data: {
  status: UserStatus;
  tenantId: number;
  userId: string;
}): Promise<ServerActionResponse> => {
  const session = await assertAdmin();

  if (data.userId === session.user.uuid) {
    return { ok: false, error: "Vous ne pouvez pas modifier votre propre statut." };
  }

  try {
    const useCase = new UpdateMemberStatus(userOnTenantRepo);
    await useCase.execute({ userId: data.userId, tenantId: data.tenantId, status: data.status });
    revalidatePath(`/admin/tenants/${data.tenantId}`);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
};

export const removeMember = async (data: { tenantId: number; userId: string }): Promise<ServerActionResponse> => {
  const session = await assertAdmin();

  if (data.userId === session.user.uuid) {
    return { ok: false, error: "Vous ne pouvez pas vous retirer vous-même." };
  }

  try {
    const useCase = new RemoveMember(userOnTenantRepo);
    await useCase.execute({ userId: data.userId, tenantId: data.tenantId });
    revalidatePath(`/admin/tenants/${data.tenantId}`);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
};
