"use client";

import Badge from "@codegouvfr/react-dsfr/Badge";
import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import Pagination from "@codegouvfr/react-dsfr/Pagination";
import Select from "@codegouvfr/react-dsfr/Select";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { TableCustom } from "@/dsfr/base/TableCustom";
import { type AuditLogWithUser } from "@/lib/repo/IAuditLogRepo";
import { type AuditAction } from "@/prisma/enums";
import { formatDateHour } from "@/utils/date";

interface AuditLogViewProps {
  actions: AuditAction[];
  items: AuditLogWithUser[];
  locale: string;
  page: number;
  pageSize: number;
  total: number;
}

export const AuditLogView = ({ actions, items, locale, page, pageSize, total }: AuditLogViewProps) => {
  const t = useTranslations("domainAdmin.auditLog");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const totalPages = Math.ceil(total / pageSize);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  const resetFilters = () => {
    router.push(pathname);
  };

  const getPageUrl = (pageNum: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (pageNum > 1) {
      params.set("page", String(pageNum));
    } else {
      params.delete("page");
    }
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div>
      <h1>{t("title")}</h1>

      <div className="flex flex-wrap items-end gap-4 fr-mb-2w">
        <Select
          label={t("filterAction")}
          nativeSelectProps={{
            value: searchParams.get("action") ?? "",
            onChange: e => updateFilter("action", e.target.value),
          }}
        >
          <option value="">{t("allActions")}</option>
          {actions.map(action => (
            <option key={action} value={action}>
              {action}
            </option>
          ))}
        </Select>

        <Input
          label={t("filterDateFrom")}
          nativeInputProps={{
            type: "date",
            value: searchParams.get("dateFrom") ?? "",
            onChange: e => updateFilter("dateFrom", e.target.value),
          }}
        />

        <Input
          label={t("filterDateTo")}
          nativeInputProps={{
            type: "date",
            value: searchParams.get("dateTo") ?? "",
            onChange: e => updateFilter("dateTo", e.target.value),
          }}
        />

        <Button priority="secondary" size="small" onClick={resetFilters}>
          {t("resetFilters")}
        </Button>
      </div>

      <p className="fr-text--sm fr-mb-1w">
        {total} {t("results")}
      </p>

      <TableCustom
        header={[
          { children: t("date") },
          { children: t("action") },
          { children: t("user") },
          { children: t("target") },
          { children: t("status") },
          { children: t("ip") },
        ]}
        body={items.map(item => [
          { children: formatDateHour(new Date(item.createdAt), locale) },
          { children: <code className="fr-text--xs">{item.action}</code> },
          { children: item.user?.name ?? item.user?.email ?? item.userId ?? "—" },
          {
            children: item.targetType ? (
              <span className="fr-text--xs">
                {item.targetType}
                {item.targetId ? ` #${item.targetId}` : ""}
              </span>
            ) : (
              "—"
            ),
          },
          {
            children: item.success ? (
              <Badge severity="success" small>
                {t("successLabel")}
              </Badge>
            ) : (
              <Badge severity="error" small>
                {t("errorLabel")}
              </Badge>
            ),
          },
          { children: <span className="fr-text--xs">{item.ipAddress ?? "—"}</span> },
        ])}
      />

      {totalPages > 1 && (
        <Pagination
          count={totalPages}
          defaultPage={page}
          getPageLinkProps={pageNum => ({ href: getPageUrl(pageNum) })}
        />
      )}
    </div>
  );
};
