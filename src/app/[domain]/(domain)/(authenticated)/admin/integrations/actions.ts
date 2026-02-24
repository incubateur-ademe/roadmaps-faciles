"use server";

import { revalidatePath } from "next/cache";

import { type IntegrationConfig } from "@/lib/integration-provider/types";
import { boardRepo, integrationMappingRepo, integrationRepo, integrationSyncLogRepo, postRepo } from "@/lib/repo";
import { type TenantIntegration } from "@/prisma/client";
import { CreateIntegration } from "@/useCases/integrations/CreateIntegration";
import { DeleteIntegration } from "@/useCases/integrations/DeleteIntegration";
import { GetIntegrationSyncLogs } from "@/useCases/integrations/GetIntegrationSyncLogs";
import { GetNotionDatabases } from "@/useCases/integrations/GetNotionDatabases";
import { GetNotionDatabaseSchema } from "@/useCases/integrations/GetNotionDatabaseSchema";
import { ResolveSyncConflict } from "@/useCases/integrations/ResolveSyncConflict";
import { SyncIntegration } from "@/useCases/integrations/SyncIntegration";
import { TestIntegrationConnection } from "@/useCases/integrations/TestIntegrationConnection";
import { UpdateIntegration } from "@/useCases/integrations/UpdateIntegration";
import { audit, AuditAction, getRequestContext } from "@/utils/audit";
import { assertTenantAdmin, assertTenantModerator } from "@/utils/auth";
import { type ServerActionResponse } from "@/utils/next";
import { getDomainFromHost, getTenantFromDomain } from "@/utils/tenant";

export const testNotionConnection = async (data: {
  apiKey: string;
}): Promise<ServerActionResponse<{ botName?: string; success: boolean }>> => {
  const domain = await getDomainFromHost();
  await assertTenantAdmin(domain);

  try {
    const useCase = new TestIntegrationConnection();
    const result = await useCase.execute({ type: "NOTION", apiKey: data.apiKey });
    return { ok: true, data: { success: result.success, botName: result.botName } };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
};

export const fetchNotionDatabases = async (data: {
  apiKey: string;
}): Promise<ServerActionResponse<Array<{ id: string; name: string; url: string }>>> => {
  const domain = await getDomainFromHost();
  await assertTenantAdmin(domain);

  try {
    const useCase = new GetNotionDatabases();
    const databases = await useCase.execute({ apiKey: data.apiKey });
    return { ok: true, data: databases };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
};

export const fetchNotionDatabaseSchema = async (data: {
  apiKey: string;
  databaseId: string;
}): Promise<ServerActionResponse<Awaited<ReturnType<GetNotionDatabaseSchema["execute"]>>>> => {
  const domain = await getDomainFromHost();
  await assertTenantAdmin(domain);

  try {
    const useCase = new GetNotionDatabaseSchema();
    const schema = await useCase.execute(data);
    return { ok: true, data: schema };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
};

export const createIntegration = async (data: {
  config: IntegrationConfig;
  name: string;
  syncIntervalMinutes?: number;
}): Promise<ServerActionResponse<TenantIntegration>> => {
  const domain = await getDomainFromHost();
  const session = await assertTenantAdmin(domain);
  const tenant = await getTenantFromDomain(domain);
  const reqCtx = await getRequestContext();

  try {
    const useCase = new CreateIntegration(integrationRepo);
    const integration = await useCase.execute({
      tenantId: tenant.id,
      type: "NOTION",
      name: data.name,
      config: data.config,
      syncIntervalMinutes: data.syncIntervalMinutes,
    });
    audit(
      {
        action: AuditAction.INTEGRATION_CREATE,
        userId: session.user.uuid,
        tenantId: tenant.id,
        targetType: "TenantIntegration",
        targetId: String(integration.id),
        metadata: { ...data, config: { ...data.config, apiKey: "[REDACTED]" } },
      },
      reqCtx,
    );
    revalidatePath("/admin/integrations");
    return { ok: true, data: integration };
  } catch (error) {
    audit(
      {
        action: AuditAction.INTEGRATION_CREATE,
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

export const updateIntegration = async (data: {
  enabled?: boolean;
  id: number;
  name?: string;
  syncIntervalMinutes?: null | number;
}): Promise<ServerActionResponse<TenantIntegration>> => {
  const domain = await getDomainFromHost();
  const session = await assertTenantAdmin(domain);
  const tenant = await getTenantFromDomain(domain);
  const reqCtx = await getRequestContext();

  try {
    const useCase = new UpdateIntegration(integrationRepo);
    const integration = await useCase.execute({ ...data, tenantId: tenant.id });
    audit(
      {
        action: AuditAction.INTEGRATION_UPDATE,
        userId: session.user.uuid,
        tenantId: tenant.id,
        targetType: "TenantIntegration",
        targetId: String(data.id),
        metadata: { ...data },
      },
      reqCtx,
    );
    revalidatePath("/admin/integrations");
    return { ok: true, data: integration };
  } catch (error) {
    audit(
      {
        action: AuditAction.INTEGRATION_UPDATE,
        success: false,
        error: (error as Error).message,
        userId: session.user.uuid,
        tenantId: tenant.id,
        targetType: "TenantIntegration",
        targetId: String(data.id),
      },
      reqCtx,
    );
    return { ok: false, error: (error as Error).message };
  }
};

export const deleteIntegration = async (data: {
  cleanupInboundPosts: boolean;
  id: number;
}): Promise<ServerActionResponse<{ deletedPostCount: number }>> => {
  const domain = await getDomainFromHost();
  const session = await assertTenantAdmin(domain);
  const tenant = await getTenantFromDomain(domain);
  const reqCtx = await getRequestContext();

  try {
    const useCase = new DeleteIntegration(integrationRepo, integrationMappingRepo, postRepo);
    const result = await useCase.execute({ ...data, tenantId: tenant.id });
    audit(
      {
        action: AuditAction.INTEGRATION_DELETE,
        userId: session.user.uuid,
        tenantId: tenant.id,
        targetType: "TenantIntegration",
        targetId: String(data.id),
        metadata: { ...data, deletedPostCount: result.deletedPostCount },
      },
      reqCtx,
    );
    revalidatePath("/admin/integrations");
    return { ok: true, data: result };
  } catch (error) {
    audit(
      {
        action: AuditAction.INTEGRATION_DELETE,
        success: false,
        error: (error as Error).message,
        userId: session.user.uuid,
        tenantId: tenant.id,
        targetType: "TenantIntegration",
        targetId: String(data.id),
      },
      reqCtx,
    );
    return { ok: false, error: (error as Error).message };
  }
};

export const syncIntegration = async (data: {
  integrationId: number;
}): Promise<ServerActionResponse<{ conflicts: number; errors: number; synced: number }>> => {
  const domain = await getDomainFromHost();
  const session = await assertTenantAdmin(domain);
  const tenant = await getTenantFromDomain(domain);
  const reqCtx = await getRequestContext();

  try {
    const useCase = new SyncIntegration(
      integrationRepo,
      integrationMappingRepo,
      integrationSyncLogRepo,
      postRepo,
      boardRepo,
    );
    const result = await useCase.execute({
      integrationId: data.integrationId,
      tenantId: tenant.id,
      tenantUrl: `https://${domain}`,
    });
    audit(
      {
        action: AuditAction.INTEGRATION_SYNC,
        userId: session.user.uuid,
        tenantId: tenant.id,
        targetType: "TenantIntegration",
        targetId: String(data.integrationId),
        metadata: { ...result },
      },
      reqCtx,
    );
    revalidatePath(`/admin/integrations/${data.integrationId}`);
    return { ok: true, data: result };
  } catch (error) {
    audit(
      {
        action: AuditAction.INTEGRATION_SYNC,
        success: false,
        error: (error as Error).message,
        userId: session.user.uuid,
        tenantId: tenant.id,
        targetType: "TenantIntegration",
        targetId: String(data.integrationId),
      },
      reqCtx,
    );
    return { ok: false, error: (error as Error).message };
  }
};

export const resolveSyncConflict = async (data: {
  mappingId: number;
  resolution: "local" | "remote";
}): Promise<ServerActionResponse> => {
  const domain = await getDomainFromHost();
  const session = await assertTenantModerator(domain);
  const tenant = await getTenantFromDomain(domain);
  const reqCtx = await getRequestContext();

  try {
    const useCase = new ResolveSyncConflict(integrationRepo, integrationMappingRepo, integrationSyncLogRepo, postRepo);
    await useCase.execute({
      mappingId: data.mappingId,
      resolution: data.resolution,
      tenantId: tenant.id,
      tenantUrl: `https://${domain}`,
    });
    audit(
      {
        action: AuditAction.INTEGRATION_SYNC,
        userId: session.user.uuid,
        tenantId: tenant.id,
        targetType: "IntegrationMapping",
        targetId: String(data.mappingId),
        metadata: { resolution: data.resolution },
      },
      reqCtx,
    );
    revalidatePath("/admin/integrations");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
};

export const fetchSyncLogs = async (data: {
  integrationId: number;
  limit?: number;
}): Promise<ServerActionResponse<Awaited<ReturnType<GetIntegrationSyncLogs["execute"]>>>> => {
  const domain = await getDomainFromHost();
  await assertTenantModerator(domain);
  const tenant = await getTenantFromDomain(domain);

  try {
    const useCase = new GetIntegrationSyncLogs(integrationRepo, integrationSyncLogRepo);
    const logs = await useCase.execute({ ...data, tenantId: tenant.id });
    return { ok: true, data: logs };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
};
