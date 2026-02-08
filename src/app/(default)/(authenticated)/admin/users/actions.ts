"use server";

import { revalidatePath } from "next/cache";

import { userRepo } from "@/lib/repo";
import { UserRole, UserStatus } from "@/prisma/enums";
import { UpdateUser } from "@/useCases/users/UpdateUser";
import { assertAdmin } from "@/utils/auth";
import { type ServerActionResponse } from "@/utils/next";

export const updateUserRole = async (data: { role: UserRole; userId: string }): Promise<ServerActionResponse> => {
  const session = await assertAdmin();

  if (data.userId === session.user.uuid) {
    return { ok: false, error: "Vous ne pouvez pas modifier votre propre rôle." };
  }

  if (data.role === UserRole.OWNER || data.role === UserRole.INHERITED) {
    return { ok: false, error: "Rôle cible non autorisé." };
  }

  try {
    const useCase = new UpdateUser(userRepo);
    await useCase.execute({ id: data.userId, data: { role: data.role } });
    revalidatePath("/admin/users");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
};

export const updateUserStatus = async (data: { status: UserStatus; userId: string }): Promise<ServerActionResponse> => {
  const session = await assertAdmin();

  if (data.userId === session.user.uuid) {
    return { ok: false, error: "Vous ne pouvez pas modifier votre propre statut." };
  }

  if (data.status === UserStatus.DELETED) {
    return { ok: false, error: "Statut cible non autorisé." };
  }

  try {
    const useCase = new UpdateUser(userRepo);
    await useCase.execute({ id: data.userId, data: { status: data.status } });
    revalidatePath("/admin/users");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
};
