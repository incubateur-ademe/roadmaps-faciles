"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { useTranslations } from "next-intl";
import { useCallback, useEffect } from "react";

import { fetchNotionDatabases, fetchNotionDatabaseSchema } from "../../actions";
import { useNotionWizardStore } from "../useNotionWizardStore";

export const DatabaseStep = () => {
  const t = useTranslations("domainAdmin.integrations.wizard");
  const {
    apiKey,
    databases,
    selectedDatabaseId,
    loadingDatabases,
    loadingSchema,
    setLoadingDatabases,
    setDatabases,
    setSelectedDatabaseId,
    setLoadingSchema,
    setSchema,
  } = useNotionWizardStore();

  useEffect(() => {
    if (databases.length > 0) return;
    const loadDatabases = async () => {
      setLoadingDatabases(true);
      const result = await fetchNotionDatabases({ apiKey });
      if (result.ok) {
        setDatabases(result.data);
      }
    };
    void loadDatabases();
  }, [apiKey, databases.length, setLoadingDatabases, setDatabases]);

  const handleSelect = useCallback(
    async (databaseId: string) => {
      setSelectedDatabaseId(databaseId);
      setLoadingSchema(true);
      const result = await fetchNotionDatabaseSchema({ apiKey, databaseId });
      if (result.ok) {
        setSchema(result.data);
      }
    },
    [apiKey, setSelectedDatabaseId, setLoadingSchema, setSchema],
  );

  if (loadingDatabases) {
    return <p>{t("loadingDatabases")}</p>;
  }

  if (databases.length === 0) {
    return <Alert severity="warning" small description={t("noDatabases")} />;
  }

  return (
    <div>
      <p>{t("databaseDescription")}</p>

      <div className="flex flex-col gap-2">
        {databases.map(db => (
          <button
            key={db.id}
            type="button"
            onClick={() => void handleSelect(db.id)}
            className={cx(
              fr.cx("fr-card", "fr-card--sm"),
              selectedDatabaseId === db.id && "outline outline-2 outline-blue-france-sun-113",
              "cursor-pointer text-left",
            )}
          >
            <div className="fr-card__body">
              <div className="fr-card__content">
                <h4 className="fr-card__title">{db.name}</h4>
              </div>
            </div>
          </button>
        ))}
      </div>

      {loadingSchema && <p className="fr-mt-2w">{t("loadingSchema")}</p>}
    </div>
  );
};
