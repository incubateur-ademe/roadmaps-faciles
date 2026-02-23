import { z } from "zod";

import { config } from "@/config";
import { getDnsProvider } from "@/lib/dns-provider";
import { type DnsProvisionResult } from "@/lib/dns-provider/IDnsProvider";
import { getDomainProvider } from "@/lib/domain-provider";
import { logger } from "@/lib/logger";
import { type TenantWithSettings } from "@/lib/model/Tenant";
import { type IInvitationRepo } from "@/lib/repo/IInvitationRepo";
import { type ITenantRepo } from "@/lib/repo/ITenantRepo";
import { type ITenantSettingsRepo } from "@/lib/repo/ITenantSettingsRepo";
import { type IUserOnTenantRepo } from "@/lib/repo/IUserOnTenantRepo";
import { type IUserRepo } from "@/lib/repo/IUserRepo";
import { UserRole, UserStatus } from "@/prisma/enums";
import { SendInvitation } from "@/useCases/invitations/SendInvitation";

import { type UseCase } from "../types";

export const CreateNewTenantInput = z.object({
  name: z.string().min(1),
  subdomain: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/),
  ownerEmails: z.array(z.string().email()),
});

export type CreateNewTenantInput = z.infer<typeof CreateNewTenantInput>;

interface CreateNewTenantExecuteInput extends CreateNewTenantInput {
  creatorId: string;
}

export interface FailedInvitation {
  email: string;
  reason: string;
}

export interface CreateNewTenantOutput {
  dns?: DnsProvisionResult;
  failedInvitations?: FailedInvitation[];
  tenant: TenantWithSettings;
}

export class CreateNewTenant implements UseCase<CreateNewTenantExecuteInput, CreateNewTenantOutput> {
  constructor(
    private readonly tenantRepo: ITenantRepo,
    private readonly tenantSettingsRepo: ITenantSettingsRepo,
    private readonly invitationRepo: IInvitationRepo,
    private readonly userOnTenantRepo: IUserOnTenantRepo,
    private readonly userRepo: IUserRepo,
  ) {}

  public async execute(input: CreateNewTenantExecuteInput): Promise<CreateNewTenantOutput> {
    const tenant = await this.tenantRepo.create({});

    const settings = await this.tenantSettingsRepo.create({
      tenantId: tenant.id,
      name: input.name,
      subdomain: input.subdomain,
    });

    const provider = getDomainProvider();
    await provider.addDomain(`${input.subdomain}.${config.rootDomain}`, "subdomain");

    let dnsResult: DnsProvisionResult | undefined;
    try {
      const dnsProvider = getDnsProvider();
      dnsResult = await dnsProvider.addRecord(input.subdomain);
    } catch (error) {
      logger.warn({ err: error }, "DNS provisioning failed");
    }

    await this.userOnTenantRepo.create({
      userId: input.creatorId,
      tenantId: tenant.id,
      role: UserRole.OWNER,
      status: UserStatus.ACTIVE,
    });

    const tenantUrl = `${config.host.split("//")[0]}//${input.subdomain}.${config.rootDomain}`;
    const sendInvitation = new SendInvitation(this.invitationRepo, this.userRepo, this.userOnTenantRepo);

    const failedInvitations: FailedInvitation[] = [];
    for (const email of input.ownerEmails) {
      try {
        await sendInvitation.execute({
          tenantId: tenant.id,
          email,
          tenantUrl,
          role: UserRole.OWNER,
        });
      } catch (error) {
        const reason = (error as Error).message;
        logger.warn({ err: error, email, tenantId: tenant.id }, "Owner invitation skipped");
        failedInvitations.push({ email, reason });
      }
    }

    return {
      tenant: { ...tenant, settings },
      dns: dnsResult,
      ...(failedInvitations.length > 0 && { failedInvitations }),
    };
  }
}
