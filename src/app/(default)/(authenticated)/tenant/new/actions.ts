"use server";

import { redirect } from "next/navigation";

import { invitationRepo, tenantRepo, tenantSettingsRepo, userOnTenantRepo, userRepo } from "@/lib/repo";
import { trackServerEvent } from "@/lib/tracking-provider/serverTracking";
import { tenantCreated } from "@/lib/tracking-provider/trackingPlan";
import { CreateNewTenant } from "@/useCases/tenant/CreateNewTenant";
import { audit, AuditAction, getRequestContext } from "@/utils/audit";
import { assertSession } from "@/utils/auth";
import { isRedirectError, type NextError, type ServerActionResponse } from "@/utils/next";

export const createTenantForUser = async (data: {
  name: string;
  subdomain: string;
}): Promise<ServerActionResponse<{ id: number }>> => {
  const session = await assertSession();
  const reqCtx = await getRequestContext();

  try {
    const useCase = new CreateNewTenant(tenantRepo, tenantSettingsRepo, invitationRepo, userOnTenantRepo, userRepo);
    const result = await useCase.execute({
      name: data.name,
      subdomain: data.subdomain,
      creatorId: session.user.uuid,
      ownerEmails: [],
    });

    audit(
      {
        action: AuditAction.ROOT_TENANT_CREATE,
        userId: session.user.uuid,
        targetType: "Tenant",
        targetId: String(result.tenant.id),
        metadata: { ...data },
      },
      reqCtx,
    );

    void trackServerEvent(
      session.user.uuid,
      tenantCreated({ tenantId: String(result.tenant.id), subdomain: data.subdomain }),
    );

    redirect(`/tenant/${result.tenant.id}`);
  } catch (error) {
    if (isRedirectError(error as NextError)) {
      throw error;
    }
    audit(
      {
        action: AuditAction.ROOT_TENANT_CREATE,
        success: false,
        error: (error as Error).message,
        userId: session.user.uuid,
      },
      reqCtx,
    );
    return { ok: false, error: (error as Error).message };
  }
};
