import { z } from "zod";

import { type IUserOnTenantRepo } from "@/lib/repo/IUserOnTenantRepo";
import { UserRole } from "@/prisma/enums";

import { type UseCase } from "../types";

export const RemoveMemberInput = z.object({
  userId: z.string(),
  tenantId: z.number(),
});
export type RemoveMemberInput = z.infer<typeof RemoveMemberInput>;
export type RemoveMemberOutput = void;

export class RemoveMember implements UseCase<RemoveMemberInput, RemoveMemberOutput> {
  constructor(private readonly repo: IUserOnTenantRepo) {}

  public async execute(input: RemoveMemberInput): Promise<RemoveMemberOutput> {
    const membership = await this.repo.findMembership(input.userId, input.tenantId);
    if (!membership) {
      throw new Error("Membre introuvable.");
    }

    if (membership.role === UserRole.OWNER) {
      throw new Error("Impossible de retirer un propriétaire.");
    }

    await this.repo.delete(input.userId, input.tenantId);
  }
}
