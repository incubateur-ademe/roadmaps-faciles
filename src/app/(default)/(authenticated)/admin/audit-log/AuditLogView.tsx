"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Badge from "@codegouvfr/react-dsfr/Badge";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import Input from "@codegouvfr/react-dsfr/Input";
import Pagination from "@codegouvfr/react-dsfr/Pagination";
import SelectNext from "@codegouvfr/react-dsfr/SelectNext";
import MuiTooltip from "@mui/material/Tooltip";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Container, Grid, GridCol } from "@/dsfr";
import { TableCustom } from "@/dsfr/base/TableCustom";
import { type AuditLogWithUser } from "@/lib/repo/IAuditLogRepo";
import { type AuditAction } from "@/prisma/enums";
import { formatDateHour } from "@/utils/date";

import { exportAuditLogCSV } from "./actions";

interface AuditLogViewProps {
  actions: AuditAction[];
  items: AuditLogWithUser[];
  locale: string;
  page: number;
  pageSize: number;
  total: number;
}

const formatMetadata = (metadata: unknown): string => {
  if (!metadata || (typeof metadata === "object" && Object.keys(metadata).length === 0)) return "";
  try {
    return JSON.stringify(metadata, null, 2);
  } catch {
    return JSON.stringify(metadata);
  }
};

export const AuditLogView = ({ actions, items, locale, page, pageSize, total }: AuditLogViewProps) => {
  const t = useTranslations("domainAdmin.auditLog");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [exporting, setExporting] = useState(false);

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

  const handleExport = async () => {
    setExporting(true);
    try {
      const result = await exportAuditLogCSV({
        action: searchParams.get("action") || undefined,
        dateFrom: searchParams.get("dateFrom") || undefined,
        dateTo: searchParams.get("dateTo") || undefined,
      });
      if (!result.ok) return;

      const blob = new Blob([result.data], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `audit-log-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  return (
    <Container fluid>
      <h1>{t("title")}</h1>

      <Grid haveGutters valign="bottom" mb="2w">
        <GridCol md={3}>
          <SelectNext
            label={t("filterAction")}
            options={[
              { value: "", label: t("allActions") },
              ...actions.map(action => ({ value: action, label: action })),
            ]}
            nativeSelectProps={{
              value: searchParams.get("action") ?? "",
              onChange: e => updateFilter("action", e.target.value),
            }}
          />
        </GridCol>
        <GridCol md={3}>
          <Input
            label={t("filterDateFrom")}
            nativeInputProps={{
              type: "date",
              value: searchParams.get("dateFrom") ?? "",
              onChange: e => updateFilter("dateFrom", e.target.value),
            }}
          />
        </GridCol>
        <GridCol md={3}>
          <Input
            label={t("filterDateTo")}
            nativeInputProps={{
              type: "date",
              value: searchParams.get("dateTo") ?? "",
              onChange: e => updateFilter("dateTo", e.target.value),
            }}
          />
        </GridCol>
        <GridCol base={false} className="fr-col-auto">
          <ButtonsGroup
            inlineLayoutWhen="always"
            buttons={[
              {
                children: t("resetFilters"),
                priority: "secondary",
                size: "small",
                onClick: resetFilters,
                className: fr.cx("fr-mb-0"),
              },
              {
                children: exporting ? t("exporting") : t("export"),
                priority: "tertiary",
                size: "small",
                onClick: () => void handleExport(),
                disabled: exporting,
                iconId: "fr-icon-download-line",
                className: fr.cx("fr-mb-0"),
              },
            ]}
          />
        </GridCol>
      </Grid>

      <p className="fr-text--sm fr-mb-1w">
        {total} {t("results")}
      </p>

      <TableCustom
        header={[
          { children: t("date") },
          { children: t("action") },
          { children: t("user") },
          { children: t("tenant") },
          { children: t("target") },
          { children: t("details") },
          { children: t("status") },
          { children: t("ip") },
        ]}
        body={items.map(item => {
          const userName = item.user?.name ?? item.user?.email ?? null;
          const metadata = formatMetadata(item.metadata);

          return [
            { children: formatDateHour(new Date(item.createdAt), locale) },
            { children: <code className="fr-text--xs">{item.action}</code> },
            {
              children: item.userId ? (
                <MuiTooltip title={item.userId} arrow>
                  <span className="fr-text--xs" style={{ cursor: "help" }}>
                    {userName ?? `${item.userId.slice(0, 8)}…`}
                  </span>
                </MuiTooltip>
              ) : (
                <span className="fr-text--xs">—</span>
              ),
            },
            { children: item.tenantId ? `#${item.tenantId}` : "—" },
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
              children: metadata ? (
                <MuiTooltip
                  title={<pre style={{ margin: 0, whiteSpace: "pre-wrap", fontSize: "0.75rem" }}>{metadata}</pre>}
                  arrow
                  slotProps={{ tooltip: { sx: { maxWidth: 400 } } }}
                >
                  <span
                    className={fr.cx("fr-icon--sm", "fr-icon-information-line")}
                    style={{ cursor: "help" }}
                    role="img"
                    aria-label={t("details")}
                  />
                </MuiTooltip>
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
          ];
        })}
      />

      {totalPages > 1 && (
        <Pagination
          count={totalPages}
          defaultPage={page}
          getPageLinkProps={pageNum => ({ href: getPageUrl(pageNum) })}
        />
      )}
    </Container>
  );
};
