import { z } from "zod";

import { config } from "@/config";
import { type TenantWithSettings } from "@/lib/model/Tenant";
import { type IInvitationRepo } from "@/lib/repo/IInvitationRepo";
import { type ITenantRepo } from "@/lib/repo/ITenantRepo";
import { type ITenantSettingsRepo } from "@/lib/repo/ITenantSettingsRepo";
import { SendInvitation } from "@/useCases/invitations/SendInvitation";

import { type UseCase } from "../types";

export const CreateNewTenantInput = z.object({
  name: z.string().min(1),
  subdomain: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/),
  ownerEmails: z.array(z.string().email()).min(1),
});

export type CreateNewTenantInput = z.infer<typeof CreateNewTenantInput>;
export type CreateNewTenantOutput = TenantWithSettings;

export class CreateNewTenant implements UseCase<CreateNewTenantInput, CreateNewTenantOutput> {
  constructor(
    private readonly tenantRepo: ITenantRepo,
    private readonly tenantSettingsRepo: ITenantSettingsRepo,
    private readonly invitationRepo: IInvitationRepo,
  ) {}

  public async execute(input: CreateNewTenantInput): Promise<CreateNewTenantOutput> {
    const tenant = await this.tenantRepo.create({});

    const settings = await this.tenantSettingsRepo.create({
      tenantId: tenant.id,
      name: input.name,
      subdomain: input.subdomain,
    });

    const tenantUrl = `${config.host.split("//")[0]}//${input.subdomain}.${config.rootDomain}`;
    const sendInvitation = new SendInvitation(this.invitationRepo);

    for (const email of input.ownerEmails) {
      await sendInvitation.execute({
        tenantId: tenant.id,
        email,
        tenantUrl,
        role: "OWNER",
      });
    }

    return { ...tenant, settings };
  }
}
