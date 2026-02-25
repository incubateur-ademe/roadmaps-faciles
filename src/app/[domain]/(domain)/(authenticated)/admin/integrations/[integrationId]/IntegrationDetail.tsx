"use client";

import Alert from "@codegouvfr/react-dsfr/Alert";
import Badge from "@codegouvfr/react-dsfr/Badge";
import Button from "@codegouvfr/react-dsfr/Button";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import ToggleSwitch from "@codegouvfr/react-dsfr/ToggleSwitch";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { type IntegrationMapping, type IntegrationSyncLog, type TenantIntegration } from "@/prisma/client";

import { deleteIntegration, syncIntegration, updateIntegration } from "../actions";
import { SyncLogTable } from "./SyncLogTable";

const deleteModal = createModal({ id: "delete-integration-modal", isOpenedByDefault: false });

interface IntegrationDetailProps {
  integration: TenantIntegration;
  mappings: IntegrationMapping[];
  syncLogs: IntegrationSyncLog[];
}

export const IntegrationDetail = ({ integration, mappings, syncLogs }: IntegrationDetailProps) => {
  const t = useTranslations("domainAdmin.integrations.detail");
  const router = useRouter();
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{ conflicts: number; errors: number; synced: number } | null>(null);
  const [cleanupPosts, setCleanupPosts] = useState(false);

  const inboundPostCount = mappings.filter(
    m => m.localType === "post" && m.metadata && (m.metadata as Record<string, unknown>).direction === "inbound",
  ).length;
  const conflictCount = mappings.filter(m => m.syncStatus === "CONFLICT").length;
  const errorCount = mappings.filter(m => m.syncStatus === "ERROR").length;

  const handleToggleEnabled = useCallback(async () => {
    await updateIntegration({ id: integration.id, enabled: !integration.enabled });
    router.refresh();
  }, [integration.id, integration.enabled, router]);

  const handleSync = useCallback(async () => {
    setSyncing(true);
    setSyncResult(null);
    const result = await syncIntegration({ integrationId: integration.id });
    setSyncing(false);
    if (result.ok) {
      setSyncResult(result.data);
      router.refresh();
    }
  }, [integration.id, router]);

  const handleDelete = useCallback(async () => {
    const result = await deleteIntegration({ id: integration.id, cleanupInboundPosts: cleanupPosts });
    if (result.ok) {
      router.push("/admin/integrations");
    }
  }, [integration.id, cleanupPosts, router]);

  return (
    <div>
      {/* Status badges */}
      <div className="fr-mb-3w flex gap-2">
        <Badge severity={integration.enabled ? "success" : "warning"}>
          {integration.enabled ? t("enabled") : t("disabled")}
        </Badge>
        <Badge severity="info" noIcon>
          {integration.type}
        </Badge>
        {conflictCount > 0 && <Badge severity="warning">{t("conflicts", { count: conflictCount })}</Badge>}
        {errorCount > 0 && <Badge severity="error">{t("errors", { count: errorCount })}</Badge>}
      </div>

      {/* Info */}
      <div className="fr-mb-3w">
        <p>
          {integration.lastSyncAt
            ? t("lastSyncAt", { date: new Date(integration.lastSyncAt).toLocaleString() })
            : t("neverSynced")}
        </p>
        <p>{t("mappedPosts", { count: mappings.filter(m => m.localType === "post").length })}</p>
        {integration.syncIntervalMinutes && <p>{t("autoSync", { minutes: integration.syncIntervalMinutes })}</p>}
      </div>

      {/* Actions */}
      <div className="fr-mb-4w flex gap-4">
        <ToggleSwitch
          label={t("enabledToggle")}
          checked={integration.enabled}
          onChange={() => void handleToggleEnabled()}
        />

        <Button onClick={() => void handleSync()} disabled={syncing || !integration.enabled} priority="primary">
          {syncing ? t("syncing") : t("syncNow")}
        </Button>

        <Button onClick={() => deleteModal.open()} priority="tertiary" className="fr-text--error">
          {t("delete")}
        </Button>
      </div>

      {/* Sync result */}
      {syncResult && (
        <Alert
          severity={syncResult.errors > 0 ? "warning" : "success"}
          small
          description={t("syncResultMessage", {
            synced: syncResult.synced,
            errors: syncResult.errors,
            conflicts: syncResult.conflicts,
          })}
          className="fr-mb-3w"
        />
      )}

      {/* Sync logs */}
      <h2 className="fr-mt-4w">{t("syncLogs")}</h2>
      <SyncLogTable logs={syncLogs} />

      {/* Delete modal */}
      <deleteModal.Component title={t("deleteTitle")}>
        <p>{t("deleteWarning")}</p>
        {inboundPostCount > 0 && (
          <ToggleSwitch
            label={t("cleanupInboundPosts", { count: inboundPostCount })}
            checked={cleanupPosts}
            onChange={setCleanupPosts}
          />
        )}
        <div className="fr-mt-3w flex gap-4">
          <Button onClick={() => void handleDelete()} priority="primary" className="fr-btn--error">
            {t("confirmDelete")}
          </Button>
        </div>
      </deleteModal.Component>
    </div>
  );
};
