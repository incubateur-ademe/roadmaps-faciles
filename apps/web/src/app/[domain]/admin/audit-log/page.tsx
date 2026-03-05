import { getLocale } from "next-intl/server";
import { Suspense } from "react";

import { prisma } from "@/lib/db/prisma";
import { DomainPageHOP } from "@/lib/DomainPage";
import { auditLogRepo } from "@/lib/repo";
import { type AuditAction } from "@/prisma/enums";

import { AuditLogView } from "./AuditLogView";

const PAGE_SIZE = 25;

const getAuditStats = async (tenantId: number) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [totalCount, todayCount, uniqueUsers, errorCount] = await Promise.all([
    prisma.auditLog.count({ where: { tenantId } }),
    prisma.auditLog.count({ where: { tenantId, createdAt: { gte: today } } }),
    prisma.auditLog
      .findMany({ where: { tenantId, userId: { not: null } }, select: { userId: true }, distinct: ["userId"] })
      .then(r => r.length),
    prisma.auditLog.count({ where: { tenantId, success: false } }),
  ]);

  return {
    totalCount,
    todayCount,
    uniqueUsers,
    errorRate: totalCount > 0 ? (errorCount / totalCount) * 100 : 0,
  };
};

const AuditLogPage = DomainPageHOP()(async props => {
  const { tenant } = props._data;
  const searchParams = await (props as unknown as { searchParams: Promise<Record<string, string | undefined>> })
    .searchParams;
  const locale = await getLocale();

  const page = Math.max(1, Number(searchParams.page) || 1);
  const action = searchParams.action as AuditAction | undefined;
  const dateFrom = searchParams.dateFrom ? new Date(searchParams.dateFrom) : undefined;
  const dateTo = searchParams.dateTo ? new Date(`${searchParams.dateTo}T23:59:59`) : undefined;

  const [result, actions, stats] = await Promise.all([
    auditLogRepo.findPaginated({ tenantId: tenant.id, action, dateFrom, dateTo }, page, PAGE_SIZE),
    auditLogRepo.getDistinctActions(tenant.id),
    getAuditStats(tenant.id),
  ]);

  return (
    <Suspense>
      <AuditLogView
        items={result.items}
        total={result.total}
        page={page}
        pageSize={PAGE_SIZE}
        actions={actions}
        locale={locale}
        stats={stats}
      />
    </Suspense>
  );
});

export default AuditLogPage;
