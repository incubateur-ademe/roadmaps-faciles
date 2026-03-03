"use client";

import Badge from "@codegouvfr/react-dsfr/Badge";
import Button from "@codegouvfr/react-dsfr/Button";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { useTranslations } from "next-intl";
import Link from "next/link";

import { type TenantIntegration } from "@/prisma/client";

interface IntegrationsListProps {
  integrations: TenantIntegration[];
}

export const IntegrationsList = ({ integrations }: IntegrationsListProps) => {
  const t = useTranslations("domainAdmin.integrations");

  return (
    <div>
      <div className="fr-mb-3w">
        <Button linkProps={{ href: "/admin/integrations/new" }} priority="primary">
          {t("addNotion")}
        </Button>
      </div>

      {integrations.length === 0 ? (
        <div className={cx("fr-callout")}>
          <p>{t("empty")}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {integrations.map(integration => (
            <Link
              key={integration.id}
              href={`/admin/integrations/${integration.id}`}
              className={cx("fr-card", "fr-card--horizontal", "fr-enlarge-link")}
            >
              <div className="fr-card__body">
                <div className="fr-card__content">
                  <h3 className="fr-card__title">{integration.name}</h3>
                  <p className="fr-card__desc">
                    <Badge severity={integration.enabled ? "success" : "warning"} small>
                      {integration.enabled ? t("enabled") : t("disabled")}
                    </Badge>{" "}
                    <Badge severity="info" small noIcon>
                      {integration.type}
                    </Badge>
                    {integration.lastSyncAt && (
                      <>
                        {" — "}
                        {t("lastSync", { date: new Date(integration.lastSyncAt).toLocaleString() })}
                      </>
                    )}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
