import { getLocale } from "next-intl/server";
import { connection } from "next/server";

import { auditLogRepo } from "@/lib/repo";
import { type AuditAction } from "@/prisma/enums";
import { assertAdmin } from "@/utils/auth";

import { AuditLogView } from "./AuditLogView";

const PAGE_SIZE = 25;

const RootAuditLogPage = async (props: { searchParams: Promise<Record<string, string | undefined>> }) => {
  await connection();
  await assertAdmin();

  const searchParams = await props.searchParams;
  const locale = await getLocale();

  const page = Math.max(1, Number(searchParams.page) || 1);
  const action = searchParams.action as AuditAction | undefined;
  const dateFrom = searchParams.dateFrom ? new Date(searchParams.dateFrom) : undefined;
  const dateTo = searchParams.dateTo ? new Date(`${searchParams.dateTo}T23:59:59`) : undefined;

  const [result, actions] = await Promise.all([
    auditLogRepo.findPaginated({ action, dateFrom, dateTo }, page, PAGE_SIZE),
    auditLogRepo.getDistinctActions(),
  ]);

  return (
    <AuditLogView
      items={result.items}
      total={result.total}
      page={page}
      pageSize={PAGE_SIZE}
      actions={actions}
      locale={locale}
    />
  );
};

export default RootAuditLogPage;
