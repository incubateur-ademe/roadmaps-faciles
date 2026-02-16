"use server";

import { redirect } from "next/navigation";

import { invitationRepo, tenantRepo, tenantSettingsRepo } from "@/lib/repo";
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
    const useCase = new CreateNewTenant(tenantRepo, tenantSettingsRepo, invitationRepo);
    const result = await useCase.execute({
      name: data.name,
      subdomain: data.subdomain,
      ownerEmails: [session.user.email],
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
