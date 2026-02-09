import { z } from "zod";

import { type ITenantRepo } from "@/lib/repo/ITenantRepo";
import { type IUserOnTenantRepo } from "@/lib/repo/IUserOnTenantRepo";
import { UserRole } from "@/prisma/enums";

import { type UseCase } from "../types";

export const DeleteTenantInput = z.object({
  tenantId: z.number(),
  userId: z.string(),
});

export type DeleteTenantInput = z.infer<typeof DeleteTenantInput>;
export type DeleteTenantOutput = void;

export class DeleteTenant implements UseCase<DeleteTenantInput, DeleteTenantOutput> {
  constructor(
    private readonly tenantRepo: ITenantRepo,
    private readonly userOnTenantRepo: IUserOnTenantRepo,
  ) {}

  public async execute(input: DeleteTenantInput): Promise<DeleteTenantOutput> {
    const tenant = await this.tenantRepo.findById(input.tenantId);
    if (!tenant) {
      throw new Error("Tenant introuvable.");
    }

    const membership = await this.userOnTenantRepo.findMembership(input.userId, input.tenantId);
    if (!membership || membership.role !== UserRole.OWNER) {
      throw new Error("Seul un propriétaire peut supprimer le tenant.");
    }

    await this.tenantRepo.update(input.tenantId, { deletedAt: new Date() });
  }
}
