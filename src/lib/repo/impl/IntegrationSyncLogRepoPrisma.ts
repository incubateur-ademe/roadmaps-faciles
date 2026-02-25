import { prisma } from "@/lib/db/prisma";
import { type IntegrationSyncLog, type Prisma } from "@/prisma/client";

import { type IIntegrationSyncLogRepo } from "../IIntegrationSyncLogRepo";

export class IntegrationSyncLogRepoPrisma implements IIntegrationSyncLogRepo {
  public create(data: Prisma.IntegrationSyncLogUncheckedCreateInput): Promise<IntegrationSyncLog> {
    return prisma.integrationSyncLog.create({ data });
  }

  public findRecentForIntegration(integrationId: number, limit = 50): Promise<IntegrationSyncLog[]> {
    return prisma.integrationSyncLog.findMany({
      where: { integrationId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }
}
