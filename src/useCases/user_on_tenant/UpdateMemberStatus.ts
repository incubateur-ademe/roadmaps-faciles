import { z } from "zod";

import { userStatusEnum } from "@/lib/model/User";
import { type IUserOnTenantRepo } from "@/lib/repo/IUserOnTenantRepo";
import { UserRole, UserStatus } from "@/prisma/enums";

import { type UseCase } from "../types";

export const UpdateMemberStatusInput = z.object({
  userId: z.string(),
  tenantId: z.number(),
  status: userStatusEnum,
});
export type UpdateMemberStatusInput = z.infer<typeof UpdateMemberStatusInput>;
export type UpdateMemberStatusOutput = void;

export class UpdateMemberStatus implements UseCase<UpdateMemberStatusInput, UpdateMemberStatusOutput> {
  constructor(private readonly repo: IUserOnTenantRepo) {}

  public async execute(input: UpdateMemberStatusInput): Promise<UpdateMemberStatusOutput> {
    const membership = await this.repo.findMembership(input.userId, input.tenantId);
    if (!membership) {
      throw new Error("Membre introuvable.");
    }

    if (membership.role === UserRole.OWNER) {
      throw new Error("Impossible de modifier le statut d'un propriétaire.");
    }

    if (input.status === UserStatus.DELETED) {
      throw new Error("Statut cible non autorisé. Utilisez la suppression de membre.");
    }

    await this.repo.update(input.userId, input.tenantId, { status: input.status });
  }
}
