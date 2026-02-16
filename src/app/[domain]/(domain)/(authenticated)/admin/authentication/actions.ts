"use server";

import { revalidatePath } from "next/cache";

import { tenantDefaultOAuthRepo, tenantSettingsRepo } from "@/lib/repo";
import { type EmailRegistrationPolicy } from "@/prisma/enums";
import { audit, AuditAction, getRequestContext } from "@/utils/audit";
import { assertTenantAdmin } from "@/utils/auth";
import { type ServerActionResponse } from "@/utils/next";
import { getDomainFromHost, getTenantFromDomain } from "@/utils/tenant";

export const saveAuthenticationSettings = async (data: {
  allowedEmailDomains: string[];
  emailRegistrationPolicy: EmailRegistrationPolicy;
}): Promise<ServerActionResponse> => {
  const domain = await getDomainFromHost();
  const session = await assertTenantAdmin(domain);
  const tenant = await getTenantFromDomain(domain);
  const reqCtx = await getRequestContext();

  try {
    const settings = await tenantSettingsRepo.findByTenantId(tenant.id);
    if (!settings) throw new Error("Settings not found");

    await tenantSettingsRepo.update(settings.id, data);
    audit(
      {
        action: AuditAction.AUTHENTICATION_SETTINGS_UPDATE,
        userId: session.user.uuid,
        tenantId: tenant.id,
        targetType: "TenantSettings",
        targetId: String(settings.id),
        metadata: { policy: data.emailRegistrationPolicy },
      },
      reqCtx,
    );
    revalidatePath("/admin/authentication");
    return { ok: true };
  } catch (error) {
    audit(
      {
        action: AuditAction.AUTHENTICATION_SETTINGS_UPDATE,
        success: false,
        error: (error as Error).message,
        userId: session.user.uuid,
        tenantId: tenant.id,
      },
      reqCtx,
    );
    return { ok: false, error: (error as Error).message };
  }
};

export const saveForce2FASettings = async (data: {
  force2FA: boolean;
  force2FAGraceDays: number;
}): Promise<ServerActionResponse> => {
  const domain = await getDomainFromHost();
  const session = await assertTenantAdmin(domain);
  const tenant = await getTenantFromDomain(domain);
  const reqCtx = await getRequestContext();

  try {
    const settings = await tenantSettingsRepo.findByTenantId(tenant.id);
    if (!settings) throw new Error("Settings not found");

    await tenantSettingsRepo.update(settings.id, {
      force2FA: data.force2FA,
      force2FAGraceDays: Math.min(Math.max(data.force2FAGraceDays, 0), 5),
    });

    audit(
      {
        action: AuditAction.SECURITY_SETTINGS_UPDATE,
        userId: session.user.uuid,
        tenantId: tenant.id,
        targetType: "TenantSettings",
        targetId: String(settings.id),
        metadata: { ...data },
      },
      reqCtx,
    );
    revalidatePath("/admin/authentication");
    return { ok: true };
  } catch (error) {
    audit(
      {
        action: AuditAction.SECURITY_SETTINGS_UPDATE,
        success: false,
        error: (error as Error).message,
        userId: session.user.uuid,
        tenantId: tenant.id,
      },
      reqCtx,
    );
    return { ok: false, error: (error as Error).message };
  }
};

export const saveOAuthProviders = async (data: { providers: string[] }): Promise<ServerActionResponse> => {
  const domain = await getDomainFromHost();
  const session = await assertTenantAdmin(domain);
  const tenant = await getTenantFromDomain(domain);
  const reqCtx = await getRequestContext();

  try {
    const currentProviders = await tenantDefaultOAuthRepo.findByTenantId(tenant.id);
    const currentProviderNames = currentProviders.map(p => p.provider);

    // Add new providers
    const toAdd = data.providers.filter(p => !currentProviderNames.includes(p));
    for (const provider of toAdd) {
      await tenantDefaultOAuthRepo.upsertByTenantIdAndProvider(tenant.id, provider);
    }

    // Remove deselected providers
    const toRemove = currentProviderNames.filter(p => !data.providers.includes(p));
    for (const provider of toRemove) {
      await tenantDefaultOAuthRepo.deleteByTenantIdAndProvider(tenant.id, provider);
    }

    audit(
      {
        action: AuditAction.AUTHENTICATION_SETTINGS_UPDATE,
        userId: session.user.uuid,
        tenantId: tenant.id,
        targetType: "TenantDefaultOAuth",
        metadata: { providers: data.providers },
      },
      reqCtx,
    );
    revalidatePath("/admin/authentication");
    return { ok: true };
  } catch (error) {
    audit(
      {
        action: AuditAction.AUTHENTICATION_SETTINGS_UPDATE,
        success: false,
        error: (error as Error).message,
        userId: session.user.uuid,
        tenantId: tenant.id,
      },
      reqCtx,
    );
    return { ok: false, error: (error as Error).message };
  }
};
