"use server";

import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";

import { invitationRepo, tenantRepo, tenantSettingsRepo, userOnTenantRepo, userRepo } from "@/lib/repo";
import { CreateNewTenant, CreateNewTenantInput } from "@/useCases/tenant/CreateNewTenant";
import { audit, AuditAction, getRequestContext } from "@/utils/audit";
import { assertAdmin } from "@/utils/auth";
import { type ServerActionResponse } from "@/utils/next";

export const createTenant = async (data: unknown): Promise<ServerActionResponse<{ tenantId: number }>> => {
  const session = await assertAdmin();
  const reqCtx = await getRequestContext();

  const validated = CreateNewTenantInput.safeParse(data);
  if (!validated.success) {
    const t = await getTranslations("serverErrors");
    audit(
      {
        action: AuditAction.ROOT_TENANT_CREATE,
        success: false,
        error: "validationFailed",
        userId: session.user.uuid,
      },
      reqCtx,
    );
    return { ok: false, error: t("invalidData") };
  }

  try {
    const useCase = new CreateNewTenant(tenantRepo, tenantSettingsRepo, invitationRepo, userOnTenantRepo, userRepo);
    const result = await useCase.execute({
      ...validated.data,
      creatorId: session.user.uuid,
    });
    audit(
      {
        action: AuditAction.ROOT_TENANT_CREATE,
        userId: session.user.uuid,
        targetType: "Tenant",
        targetId: String(result.tenant.id),
        metadata: { name: validated.data.name, subdomain: validated.data.subdomain },
      },
      reqCtx,
    );
    revalidatePath("/admin/tenants");
    return { ok: true, data: { tenantId: result.tenant.id } };
  } catch (error) {
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
