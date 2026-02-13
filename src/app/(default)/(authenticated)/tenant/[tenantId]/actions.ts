"use server";

import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import z from "zod";

import { logger } from "@/lib/logger";
import { Tenant } from "@/lib/model/Tenant";
import { TenantSettings } from "@/lib/model/TenantSettings";
import { tenantRepo, userOnTenantRepo } from "@/lib/repo";
import { SaveTenant, type SaveTenantOutput } from "@/useCases/tenant/SaveTenant";
import { assertSession } from "@/utils/auth";
import { type ServerActionResponse } from "@/utils/next";

const ROLE_WEIGHT: Record<string, number> = { INHERITED: 0, USER: 1, MODERATOR: 2, ADMIN: 3, OWNER: 4 };

type SaveTenantResponse = ServerActionResponse<SaveTenantOutput>;
type SaveTenantProps = { setting: Partial<TenantSettings>; tenant: Partial<Tenant> };

export const saveTenant = async ({ tenant, setting }: SaveTenantProps): Promise<SaveTenantResponse> => {
  const session = await assertSession();

  if (!session.user.isSuperAdmin) {
    const idParsed = Tenant.pick({ id: true }).safeParse(tenant);
    if (!idParsed.success) {
      const t = await getTranslations("serverErrors");
      return { ok: false, error: t("invalidTenantId") };
    }
    const membership = await userOnTenantRepo.findMembership(session.user.uuid, idParsed.data.id);
    const effectiveRole = membership?.role === "INHERITED" ? session.user.role : membership?.role;
    if (!effectiveRole || ROLE_WEIGHT[effectiveRole] < ROLE_WEIGHT.ADMIN) {
      const t = await getTranslations("serverErrors");
      return { ok: false, error: t("unauthorized") };
    }
  }

  const tenantValidated = Tenant.omit({
    updatedAt: true,
    createdAt: true,
    deletedAt: true,
  }).safeParse(tenant);

  if (!tenantValidated.success) {
    return {
      ok: false,
      error: z.prettifyError(tenantValidated.error),
    };
  }

  const settingValidated = TenantSettings.pick({
    name: true,
    subdomain: true,
    customDomain: true,
    locale: true,
  }).safeParse(setting);

  if (!settingValidated.success) {
    return {
      ok: false,
      error: z.prettifyError(settingValidated.error),
    };
  }

  try {
    const useCase = new SaveTenant(tenantRepo);
    const tenant = await useCase.execute({
      id: tenantValidated.data.id,
      setting: settingValidated.data,
    });

    revalidatePath(`/tenant/${tenant.id}`);
    return {
      ok: true,
      data: tenant,
    };
  } catch (error) {
    logger.error({ err: error }, "Error saving tenant");
    return {
      ok: false,
      error: (error as Error).message,
    };
  }
};
