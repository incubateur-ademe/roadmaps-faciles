import { NextResponse } from "next/server";

import { config } from "@/config";
import { createIntegrationProvider } from "@/lib/integration-provider";
import { decrypt } from "@/lib/integration-provider/encryption";
import { type IntegrationConfig } from "@/lib/integration-provider/types";
import { logger } from "@/lib/logger";
import { integrationMappingRepo, integrationRepo, integrationSyncLogRepo, postRepo } from "@/lib/repo";
import { SyncIntegration } from "@/useCases/integrations/SyncIntegration";

export async function POST(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  const expectedSecret = config.integrations.cronSecret;

  if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dueIntegrations = await integrationRepo.findDueForSync();

  const report = { processed: 0, skipped: 0, errors: [] as Array<{ error: string; integrationId: number }> };

  for (const integration of dueIntegrations) {
    try {
      // Quick connection check
      const rawConfig = integration.config as unknown as IntegrationConfig;
      const decryptedConfig = { ...rawConfig, apiKey: decrypt(rawConfig.apiKey) };
      const provider = createIntegrationProvider(integration.type, decryptedConfig);
      const connectionTest = await provider.testConnection();

      if (!connectionTest.success) {
        report.errors.push({ integrationId: integration.id, error: `Connection test failed: ${connectionTest.error}` });
        continue;
      }

      // Run sync
      const useCase = new SyncIntegration(integrationRepo, integrationMappingRepo, integrationSyncLogRepo, postRepo);

      await useCase.execute({
        integrationId: integration.id,
        tenantId: integration.tenantId,
        tenantUrl: `https://${config.rootDomain}`,
      });

      report.processed++;
    } catch (error) {
      logger.error({ err: error, integrationId: integration.id }, "Cron sync failed");
      report.errors.push({ integrationId: integration.id, error: (error as Error).message });
    }
  }

  logger.info({ report }, "Cron integrations sync completed");

  return NextResponse.json(report, {
    headers: { "Cache-Control": "no-store" },
  });
}
