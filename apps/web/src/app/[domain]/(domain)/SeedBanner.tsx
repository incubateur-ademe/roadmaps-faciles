"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";
import { useTranslations } from "next-intl";
import { useCallback, useSyncExternalStore } from "react";

import { WELCOME_DATA_PREVIEW } from "@/workflows/welcomeDataPreview";

const STORAGE_KEY_PREFIX = "seed-banner-dismissed-";

interface SeedBannerProps {
  tenantId: number;
}

export const SeedBanner = ({ tenantId }: SeedBannerProps) => {
  const t = useTranslations("domainAdmin.general");
  const storageKey = `${STORAGE_KEY_PREFIX}${tenantId}`;

  const subscribe = useCallback(
    (callback: () => void) => {
      const handler = (e: StorageEvent) => {
        if (e.key === storageKey) callback();
      };
      window.addEventListener("storage", handler);
      return () => window.removeEventListener("storage", handler);
    },
    [storageKey],
  );

  const getSnapshot = useCallback(() => localStorage.getItem(storageKey) === "true", [storageKey]);
  const getServerSnapshot = useCallback(() => true, []);

  const dismissed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (dismissed) return null;

  const handleClose = () => {
    localStorage.setItem(storageKey, "true");
    window.dispatchEvent(new StorageEvent("storage", { key: storageKey }));
  };

  return (
    <Alert
      className={fr.cx("fr-mb-4w")}
      severity="info"
      closable
      onClose={handleClose}
      title={t("seedBannerTitle")}
      description={
        <>
          <p className={fr.cx("fr-mb-1w")}>
            {t("seedBannerDescription", {
              boards: WELCOME_DATA_PREVIEW.boards.length,
              statuses: WELCOME_DATA_PREVIEW.statuses.length,
              extras: WELCOME_DATA_PREVIEW.extras,
            })}
          </p>
          <Button priority="secondary" size="small" linkProps={{ href: "/admin/general#seed" }}>
            {t("seedBannerCta")}
          </Button>
        </>
      }
    />
  );
};
