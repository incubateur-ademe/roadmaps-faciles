import { z } from "zod";

import { type TenantWithSettings } from "@/lib/model/Tenant";
import { type ITenantRepo } from "@/lib/repo/ITenantRepo";
import { type ITenantSettingsRepo } from "@/lib/repo/ITenantSettingsRepo";
import { type IUserOnTenantRepo } from "@/lib/repo/IUserOnTenantRepo";
import { UserRole, UserStatus } from "@/prisma/client";
import { CreateWelcomeEntitiesWorkflow } from "@/workflows/CreateWelcomeEntitiesWorkflow";

import { type UseCase } from "../types";

export const CreateNewTenantInput = z.object({
  name: z.string().min(1),
  subdomain: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/),
  userId: z.string(),
});

export type CreateNewTenantInput = z.infer<typeof CreateNewTenantInput>;
export type CreateNewTenantOutput = TenantWithSettings;

export class CreateNewTenant implements UseCase<CreateNewTenantInput, CreateNewTenantOutput> {
  constructor(
    private readonly tenantRepo: ITenantRepo,
    private readonly tenantSettingsRepo: ITenantSettingsRepo,
    private readonly userOnTenantRepo: IUserOnTenantRepo,
  ) {}

  public async execute(input: CreateNewTenantInput): Promise<CreateNewTenantOutput> {
    const tenant = await this.tenantRepo.create({});

    const settings = await this.tenantSettingsRepo.create({
      tenantId: tenant.id,
      name: input.name,
      subdomain: input.subdomain,
    });

    await this.userOnTenantRepo.create({
      userId: input.userId,
      tenantId: tenant.id,
      role: UserRole.OWNER,
      status: UserStatus.ACTIVE,
    });

    const workflow = new CreateWelcomeEntitiesWorkflow(tenant.id);
    await workflow.run();

    return { ...tenant, settings };
  }
}
