import { z } from "zod";

import { userRoleEnum } from "@/lib/model/User";
import { type IUserOnTenantRepo } from "@/lib/repo/IUserOnTenantRepo";
import { UserRole } from "@/prisma/enums";

import { type UseCase } from "../types";

export const UpdateMemberRoleInput = z.object({
  userId: z.string(),
  tenantId: z.number(),
  role: userRoleEnum,
});
export type UpdateMemberRoleInput = z.infer<typeof UpdateMemberRoleInput>;
export type UpdateMemberRoleOutput = void;

export class UpdateMemberRole implements UseCase<UpdateMemberRoleInput, UpdateMemberRoleOutput> {
  constructor(private readonly repo: IUserOnTenantRepo) {}

  public async execute(input: UpdateMemberRoleInput): Promise<UpdateMemberRoleOutput> {
    const membership = await this.repo.findMembership(input.userId, input.tenantId);
    if (!membership) {
      throw new Error("Membre introuvable.");
    }

    if (membership.role === UserRole.OWNER) {
      throw new Error("Impossible de modifier le rôle d'un propriétaire.");
    }

    if (input.role === UserRole.OWNER || input.role === UserRole.INHERITED) {
      throw new Error("Rôle cible non autorisé.");
    }

    await this.repo.update(input.userId, input.tenantId, { role: input.role });
  }
}
