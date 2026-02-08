"use server";

import { revalidatePath } from "next/cache";

import { userRepo } from "@/lib/repo";
import { UserRole, UserStatus } from "@/prisma/enums";
import { UpdateUser } from "@/useCases/users/UpdateUser";
import { assertAdmin } from "@/utils/auth";
import { type ServerActionResponse } from "@/utils/next";

interface UpdateUserData {
  email?: string;
  name?: null | string;
  role?: UserRole;
  status?: UserStatus;
  username?: null | string;
}

export const updateUser = async (data: { data: UpdateUserData; userId: string }): Promise<ServerActionResponse> => {
  const session = await assertAdmin();

  if (data.userId === session.user.uuid) {
    return { ok: false, error: "Vous ne pouvez pas modifier votre propre compte." };
  }

  if (data.data.role && (data.data.role === UserRole.OWNER || data.data.role === UserRole.INHERITED)) {
    return { ok: false, error: "Rôle cible non autorisé." };
  }

  if (data.data.status && data.data.status === UserStatus.DELETED) {
    return { ok: false, error: "Statut cible non autorisé." };
  }

  try {
    const useCase = new UpdateUser(userRepo);
    await useCase.execute({ id: data.userId, data: data.data });
    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${data.userId}`);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
};
