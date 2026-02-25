"use client";

import Badge from "@codegouvfr/react-dsfr/Badge";
import { useTranslations } from "next-intl";

import { type IntegrationSyncLog } from "@/prisma/client";

interface SyncLogTableProps {
  logs: IntegrationSyncLog[];
}

const statusSeverity = {
  SUCCESS: "success",
  ERROR: "error",
  SKIPPED: "info",
  CONFLICT: "warning",
} as const;

export const SyncLogTable = ({ logs }: SyncLogTableProps) => {
  const t = useTranslations("domainAdmin.integrations.detail");

  if (logs.length === 0) {
    return <p>{t("noLogs")}</p>;
  }

  return (
    <div className="fr-table">
      <table>
        <thead>
          <tr>
            <th>{t("logDate")}</th>
            <th>{t("logDirection")}</th>
            <th>{t("logStatus")}</th>
            <th>{t("logMessage")}</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.id}>
              <td>{new Date(log.createdAt).toLocaleString()}</td>
              <td>{log.direction}</td>
              <td>
                <Badge severity={statusSeverity[log.status as keyof typeof statusSeverity] ?? "info"} small noIcon>
                  {log.status}
                </Badge>
              </td>
              <td>{log.message ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
