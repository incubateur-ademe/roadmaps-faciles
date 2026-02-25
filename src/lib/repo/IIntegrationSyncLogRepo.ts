import { type IntegrationSyncLog, type Prisma } from "@/prisma/client";

export interface IIntegrationSyncLogRepo {
  create(data: Prisma.IntegrationSyncLogUncheckedCreateInput): Promise<IntegrationSyncLog>;
  findRecentForIntegration(integrationId: number, limit?: number): Promise<IntegrationSyncLog[]>;
}
