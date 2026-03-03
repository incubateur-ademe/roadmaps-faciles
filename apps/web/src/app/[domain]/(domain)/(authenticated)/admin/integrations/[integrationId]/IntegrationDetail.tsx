"use client";

import Alert from "@codegouvfr/react-dsfr/Alert";
import Badge from "@codegouvfr/react-dsfr/Badge";
import Button from "@codegouvfr/react-dsfr/Button";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import ToggleSwitch from "@codegouvfr/react-dsfr/ToggleSwitch";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { type SyncProgress } from "@/lib/integration-provider/sync-types";
import { type SyncRunSummary } from "@/lib/repo/IIntegrationSyncLogRepo";
import { type IntegrationMapping, type TenantIntegration } from "@/prisma/client";

import { deleteIntegration, updateIntegration } from "../actions";
import { SyncRunTable } from "./SyncRunTable";

const deleteModal = createModal({ id: "delete-integration-modal", isOpenedByDefault: false });

const formatDuration = (ms: number): string => {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return min > 0 ? `${min}min ${String(sec).padStart(2, "0")}s` : `${sec}s`;
};

interface IntegrationDetailProps {
  integration: TenantIntegration;
  mappings: IntegrationMapping[];
  syncRuns: SyncRunSummary[];
}

export const IntegrationDetail = ({ integration, mappings, syncRuns }: IntegrationDetailProps) => {
  const t = useTranslations("domainAdmin.integrations.detail");
  const router = useRouter();
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{ conflicts: number; errors: number; synced: number } | null>(null);
  const [syncError, setSyncError] = useState<null | string>(null);
  const [syncProgress, setSyncProgress] = useState<null | SyncProgress>(null);
  const [cleanupPosts, setCleanupPosts] = useState(false);
  const [syncStartedAt, setSyncStartedAt] = useState<null | number>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [remoteSyncing, setRemoteSyncing] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const processStartedAtRef = useRef<null | number>(null);
  const lastPhaseRef = useRef<null | string>(null);
  const remoteSyncingRef = useRef(false);

  const inboundPostCount = mappings.filter(
    m => m.localType === "post" && m.metadata && (m.metadata as Record<string, unknown>).direction === "inbound",
  ).length;
  const conflictCount = mappings.filter(m => m.syncStatus === "CONFLICT").length;
  const errorCount = mappings.filter(m => m.syncStatus === "ERROR").length;

  // Check if a sync is already running server-side (e.g. user navigated away and came back)
  useEffect(() => {
    if (syncing) return; // Already tracking locally, no need to poll

    let cancelled = false;
    const checkSyncStatus = async () => {
      try {
        const res = await fetch(`/api/integrations/${integration.id}/sync`);
        if (!res.ok || cancelled) return;
        const data = (await res.json()) as { startedAt: null | number; syncing: boolean };
        if (cancelled) return;
        if (data.syncing) {
          if (!remoteSyncingRef.current) {
            remoteSyncingRef.current = true;
            setRemoteSyncing(true);
          }
          if (data.startedAt) setSyncStartedAt(data.startedAt);
        } else if (remoteSyncingRef.current) {
          // Sync just finished — refresh data
          remoteSyncingRef.current = false;
          setRemoteSyncing(false);
          setSyncStartedAt(null);
          router.refresh();
        }
      } catch {
        // Network error — ignore
      }
    };

    void checkSyncStatus();
    const interval = setInterval(() => void checkSyncStatus(), 5000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [integration.id, syncing, router]);

  // Elapsed timer
  useEffect(() => {
    if (!syncStartedAt) {
      setElapsedMs(0);
      return;
    }
    const interval = setInterval(() => {
      setElapsedMs(Date.now() - syncStartedAt);
    }, 1000);
    return () => clearInterval(interval);
  }, [syncStartedAt]);

  const handleToggleEnabled = useCallback(async () => {
    await updateIntegration({ id: integration.id, enabled: !integration.enabled });
    router.refresh();
  }, [integration.id, integration.enabled, router]);

  const handleCancelMonitoring = useCallback(() => {
    abortControllerRef.current?.abort();
    setSyncing(false);
    setSyncProgress(null);
    setSyncStartedAt(null);
    processStartedAtRef.current = null;
    lastPhaseRef.current = null;
  }, []);

  const handleSync = useCallback(async () => {
    setSyncing(true);
    setSyncResult(null);
    setSyncError(null);
    setSyncProgress(null);
    setSyncStartedAt(Date.now());
    processStartedAtRef.current = null;
    lastPhaseRef.current = null;

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch(`/api/integrations/${integration.id}/sync`, {
        method: "POST",
        signal: controller.signal,
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => ({ error: response.statusText }))) as { error?: string };
        setSyncError(body.error || response.statusText);
        setSyncing(false);
        setSyncStartedAt(null);
        return;
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      for (;;) {
        const { done, value } = await reader.read();
        if (done) {
          buffer += decoder.decode();
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const event of events) {
          if (!event.trim()) continue;
          const lines = event.split("\n");
          let eventType = "";
          let eventData = "";

          for (const line of lines) {
            if (line.startsWith("event: ")) eventType = line.slice(7);
            if (line.startsWith("data: ")) eventData = line.slice(6);
          }

          if (eventType === "progress") {
            const progress = JSON.parse(eventData) as SyncProgress;
            setSyncProgress(progress);

            // Reset ETA tracking on phase/total change
            const phaseKey = `${progress.phase}:${progress.total}`;
            if (lastPhaseRef.current !== phaseKey) {
              lastPhaseRef.current = phaseKey;
              processStartedAtRef.current = progress.total !== null && progress.current > 0 ? Date.now() : null;
            }
            // Start ETA tracking when first determinate progress arrives
            if (progress.total !== null && progress.current > 0 && !processStartedAtRef.current) {
              processStartedAtRef.current = Date.now();
            }
          } else if (eventType === "done") {
            // TODO: envoyer une notification (toast/push) quand la sync se termine en arrière-plan
            setSyncResult(JSON.parse(eventData) as { conflicts: number; errors: number; synced: number });
            setSyncing(false);
            setSyncProgress(null);
            setSyncStartedAt(null);
            processStartedAtRef.current = null;
            router.refresh();
          } else if (eventType === "error") {
            setSyncError((JSON.parse(eventData) as { message: string }).message);
            setSyncing(false);
            setSyncProgress(null);
            setSyncStartedAt(null);
            processStartedAtRef.current = null;
          }
        }
      }

      // Safety: if stream ended without done/error event
      setSyncing(false);
      setSyncStartedAt(null);
    } catch (error) {
      if ((error as Error).name === "AbortError") return;
      setSyncError((error as Error).message);
      setSyncing(false);
      setSyncProgress(null);
      setSyncStartedAt(null);
      processStartedAtRef.current = null;
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

        <Button
          onClick={() => void handleSync()}
          disabled={syncing || remoteSyncing || !integration.enabled}
          priority="primary"
        >
          {syncing || remoteSyncing ? t("syncing") : t("syncNow")}
        </Button>

        <Button onClick={() => deleteModal.open()} priority="tertiary" className="fr-text--error">
          {t("delete")}
        </Button>
      </div>

      {/* Remote sync detected (navigated away and came back) */}
      {remoteSyncing && !syncing && (
        <div className="fr-mb-3w">
          <Alert severity="info" small description={t("syncRemoteInProgress")} />
          <progress className="fr-mt-1w w-full" />
          <div className="fr-mt-1w fr-text--xs text-[var(--text-mention-grey)]">
            <span>{t("syncElapsed", { time: formatDuration(elapsedMs) })}</span>
          </div>
        </div>
      )}

      {/* Sync feedback */}
      {syncing && syncProgress && syncProgress.total === null && syncProgress.current === 0 && (
        <div className="fr-mb-3w">
          <Alert
            severity="info"
            small
            description={syncProgress.phase === "outbound" ? t("syncFetchingOutbound") : t("syncFetchingInbound")}
          />
          <progress className="fr-mt-1w w-full" />
        </div>
      )}
      {syncing && syncProgress && syncProgress.total === null && syncProgress.current > 0 && (
        <div className="fr-mb-3w">
          <Alert severity="info" small description={t("syncStreamingProgress", { count: syncProgress.current })} />
          <progress className="fr-mt-1w w-full" />
        </div>
      )}
      {syncing && syncProgress && syncProgress.total !== null && syncProgress.total > 0 && (
        <div className="fr-mb-3w">
          <Alert
            severity="info"
            small
            description={
              syncProgress.phase === "outbound"
                ? t("syncProgressOutbound", { current: syncProgress.current, total: syncProgress.total })
                : t("syncProgressInbound", { current: syncProgress.current, total: syncProgress.total })
            }
          />
          <progress value={syncProgress.current} max={syncProgress.total} className="fr-mt-1w w-full" />
          {/* Timer + ETA */}
          <div className="fr-mt-1w fr-text--xs flex gap-4 text-[var(--text-mention-grey)]">
            <span>{t("syncElapsed", { time: formatDuration(elapsedMs) })}</span>
            {(() => {
              if (!processStartedAtRef.current || syncProgress.current < 3) return null;
              const processElapsed = Date.now() - processStartedAtRef.current;
              if (processElapsed < 3000) return null;
              const remaining = (processElapsed * syncProgress.total) / syncProgress.current - processElapsed;
              return <span>{t("syncEta", { time: formatDuration(remaining) })}</span>;
            })()}
          </div>
        </div>
      )}
      {syncing && !syncProgress && (
        <Alert severity="info" small description={t("syncInProgress")} className="fr-mb-3w" />
      )}
      {/* Leave message + cancel button */}
      {(syncing || remoteSyncing) && (
        <div className="fr-mb-3w flex items-center gap-4">
          <Alert severity="info" small description={t("syncCanLeave")} className="flex-1" />
          <Button
            priority="tertiary"
            size="small"
            onClick={() => {
              handleCancelMonitoring();
              remoteSyncingRef.current = false;
              setRemoteSyncing(false);
            }}
          >
            {t("syncCancelMonitoring")}
          </Button>
        </div>
      )}
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
      {syncError && <Alert severity="error" small description={syncError} className="fr-mb-3w" />}

      {/* Sync logs */}
      <h2 className="fr-mt-4w">{t("syncHistory")}</h2>
      <SyncRunTable runs={syncRuns} />

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
