"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Badge from "@codegouvfr/react-dsfr/Badge";
import Button from "@codegouvfr/react-dsfr/Button";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import { TableCustom } from "@/dsfr/base/TableCustom";
import { type SyncRunSummary } from "@/lib/repo/IIntegrationSyncLogRepo";
import { formatDateHour } from "@/utils/date";

interface SyncRunTableProps {
  runs: SyncRunSummary[];
}

export const SyncRunTable = ({ runs }: SyncRunTableProps) => {
  const t = useTranslations("domainAdmin.integrations.detail");
  const locale = useLocale();
  const [expandedRunId, setExpandedRunId] = useState<null | string>(null);

  if (runs.length === 0) {
    return <p>{t("noLogs")}</p>;
  }

  const expandedRun = expandedRunId ? runs.find(r => r.syncRunId === expandedRunId) : null;

  return (
    <>
      <TableCustom
        header={[
          { children: t("logDate") },
          { children: t("logDirection") },
          { children: t("runResult") },
          { children: "" },
        ]}
        body={runs.map(run => {
          const hasErrors = run.errors > 0 || run.conflicts > 0;
          const severity = run.errors > 0 ? "error" : run.conflicts > 0 ? "warning" : "success";

          return [
            { children: formatDateHour(run.startedAt, locale) },
            {
              children: (
                <Badge severity="info" small noIcon>
                  {t(`runDirection_${run.direction}` as never)}
                </Badge>
              ),
            },
            {
              children: (
                <span className="flex flex-wrap items-center gap-2">
                  <Badge severity={severity} small noIcon>
                    {t("runSynced", { count: run.success })}
                  </Badge>
                  {run.errors > 0 && (
                    <Badge severity="error" small noIcon>
                      {t("runErrors", { count: run.errors })}
                    </Badge>
                  )}
                  {run.conflicts > 0 && (
                    <Badge severity="warning" small noIcon>
                      {t("runConflicts", { count: run.conflicts })}
                    </Badge>
                  )}
                  {run.skipped > 0 && (
                    <Badge severity="info" small noIcon>
                      {t("runSkipped", { count: run.skipped })}
                    </Badge>
                  )}
                </span>
              ),
            },
            {
              children: hasErrors ? (
                <Button
                  priority="tertiary no outline"
                  size="small"
                  iconId={expandedRunId === run.syncRunId ? "fr-icon-arrow-up-s-line" : "fr-icon-arrow-down-s-line"}
                  onClick={() => setExpandedRunId(expandedRunId === run.syncRunId ? null : run.syncRunId)}
                >
                  {t("runDetails", { count: run.errorDetails.length })}
                </Button>
              ) : null,
            },
          ];
        })}
      />

      {/* Expanded error details — rendered outside the table for clean layout */}
      {expandedRun && expandedRun.errorDetails.length > 0 && (
        <div className={cx(fr.cx("fr-mb-3w", "fr-p-2w"), "bg-[var(--background-alt-grey)]")}>
          <p className={fr.cx("fr-text--bold", "fr-text--sm", "fr-mb-1w")}>{t("runErrorsTitle")}</p>
          <ul className={fr.cx("fr-text--sm")}>
            {expandedRun.errorDetails.map((detail, i) => (
              <li key={i} className={fr.cx("fr-mb-1v")}>
                {detail.message ?? t("runUnknownError")}
                {detail.postId && <span className={fr.cx("fr-text--light")}> (post #{detail.postId})</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};
