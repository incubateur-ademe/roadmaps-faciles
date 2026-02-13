import { prisma } from "@/lib/db/prisma";
import { type AuditLog, type Prisma } from "@/prisma/client";

import { type AuditLogFilter, type AuditLogWithUser, type IAuditLogRepo } from "../IAuditLogRepo";

export class AuditLogRepoPrisma implements IAuditLogRepo {
  public create(data: Prisma.AuditLogCreateInput): Promise<AuditLog> {
    return prisma.auditLog.create({ data });
  }

  public async findPaginated(
    filter: AuditLogFilter,
    page: number,
    pageSize: number,
  ): Promise<{ items: AuditLogWithUser[]; total: number }> {
    const where: Prisma.AuditLogWhereInput = {};

    if (filter.tenantId !== undefined) {
      where.tenantId = filter.tenantId;
    }
    if (filter.userId) {
      where.userId = filter.userId;
    }
    if (filter.action) {
      where.action = filter.action;
    }
    if (filter.dateFrom || filter.dateTo) {
      where.createdAt = {
        ...(filter.dateFrom && { gte: filter.dateFrom }),
        ...(filter.dateTo && { lte: filter.dateTo }),
      };
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.auditLog.count({ where }),
    ]);

    // Batch lookup users
    const userIds = [...new Set(logs.map(l => l.userId).filter(Boolean))] as string[];
    const users =
      userIds.length > 0
        ? await prisma.user.findMany({
            where: { id: { in: userIds } },
            select: { id: true, name: true, email: true },
          })
        : [];
    const userMap = new Map(users.map(u => [u.id, { name: u.name, email: u.email }]));

    const items: AuditLogWithUser[] = logs.map(log => ({
      ...log,
      user: log.userId ? (userMap.get(log.userId) ?? null) : null,
    }));

    return { items, total };
  }

  public async getDistinctActions(tenantId?: number) {
    const where: Prisma.AuditLogWhereInput = {};
    if (tenantId !== undefined) {
      where.tenantId = tenantId;
    }

    const results = await prisma.auditLog.findMany({
      where,
      select: { action: true },
      distinct: ["action"],
      orderBy: { action: "asc" },
    });

    return results.map(r => r.action);
  }
}
