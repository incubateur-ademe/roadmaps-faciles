import { getLocale } from "next-intl/server";
import { Suspense } from "react";

import { auditLogRepo } from "@/lib/repo";
import { type AuditAction } from "@/prisma/enums";

import { DomainPageHOP } from "../../../DomainPage";
import { AuditLogView } from "./AuditLogView";

const PAGE_SIZE = 25;

const AuditLogPage = DomainPageHOP()(async props => {
  const { tenant } = props._data;
  const searchParams = await (props as unknown as { searchParams: Promise<Record<string, string | undefined>> })
    .searchParams;
  const locale = await getLocale();

  const page = Math.max(1, Number(searchParams.page) || 1);
  const action = searchParams.action as AuditAction | undefined;
  const dateFrom = searchParams.dateFrom ? new Date(searchParams.dateFrom) : undefined;
  const dateTo = searchParams.dateTo ? new Date(`${searchParams.dateTo}T23:59:59`) : undefined;

  const [result, actions] = await Promise.all([
    auditLogRepo.findPaginated({ tenantId: tenant.id, action, dateFrom, dateTo }, page, PAGE_SIZE),
    auditLogRepo.getDistinctActions(tenant.id),
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
      />
    </Suspense>
  );
});

export default AuditLogPage;
