"use client";

import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";
import Card from "@codegouvfr/react-dsfr/Card";
import Input from "@codegouvfr/react-dsfr/Input";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";

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
    schema,
    goNext,
    goPrev,
    setLoadingDatabases,
    setDatabases,
    setSelectedDatabaseId,
    setLoadingSchema,
    setSchema,
  } = useNotionWizardStore();

  const [search, setSearch] = useState("");

  const filteredDatabases = useMemo(() => {
    if (!search.trim()) return databases;
    const q = search.trim().toLowerCase();
    return databases.filter(db => db.name.toLowerCase().includes(q) || db.parentName?.toLowerCase().includes(q));
  }, [databases, search]);

  const loadDatabases = useCallback(async () => {
    setLoadingDatabases(true);
    try {
      const result = await fetchNotionDatabases({ apiKey });
      if (result.ok) {
        setDatabases(result.data);
      }
    } finally {
      setLoadingDatabases(false);
    }
  }, [apiKey, setLoadingDatabases, setDatabases]);

  useEffect(() => {
    if (databases.length > 0) return;
    void loadDatabases();
  }, [databases.length, loadDatabases]);

  const handleSelect = useCallback(
    async (databaseId: string) => {
      if (databaseId === selectedDatabaseId && schema) return;
      setSelectedDatabaseId(databaseId);
      setLoadingSchema(true);
      try {
        const result = await fetchNotionDatabaseSchema({ apiKey, databaseId });
        if (result.ok) {
          setSchema(result.data);
        }
      } finally {
        setLoadingSchema(false);
      }
    },
    [apiKey, selectedDatabaseId, schema, setSelectedDatabaseId, setLoadingSchema, setSchema],
  );

  if (loadingDatabases) {
    return <p>{t("loadingDatabases")}</p>;
  }

  if (databases.length === 0) {
    return (
      <div className="flex flex-col items-start gap-4">
        <Alert severity="warning" small description={t("noDatabases")} />
        <Button priority="secondary" iconId="fr-icon-refresh-fill" onClick={() => void loadDatabases()}>
          {t("refreshDatabases")}
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <p>{t("databaseDescription")}</p>
        <div className="flex gap-2">
          <Button priority="tertiary" onClick={goPrev} size="small">
            {t("cancel")}
          </Button>
          <Button
            priority="tertiary no outline"
            iconId="fr-icon-refresh-fill"
            onClick={() => void loadDatabases()}
            size="small"
          >
            {t("refreshDatabases")}
          </Button>
        </div>
      </div>

      {databases.length >= 5 && (
        <Input
          label={t("searchDatabases")}
          hideLabel
          nativeInputProps={{
            placeholder: t("searchDatabases"),
            value: search,
            onChange: e => setSearch(e.target.value),
            type: "search",
          }}
          className="fr-mb-2w"
        />
      )}

      <div className="flex flex-col gap-2">
        {filteredDatabases.map(db => {
          const isSelected = selectedDatabaseId === db.id;
          return (
            <Card
              key={db.id}
              size="small"
              title={
                <>
                  {db.icon?.type === "emoji" && <span className="fr-mr-1w">{db.icon.emoji}</span>}
                  {db.icon?.type === "url" && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={db.icon.url} alt="" className="fr-mr-1w inline-block size-5" />
                  )}
                  {db.name}
                  {db.parentName && (
                    <span className="fr-text--sm fr-text--mention-grey fr-ml-1w">({db.parentName})</span>
                  )}
                </>
              }
              titleAs="h4"
              desc={db.description}
              detail={t("propertyCount", { count: db.propertyCount })}
              footer={
                isSelected ? (
                  loadingSchema ? (
                    <p className="fr-text--sm fr-mb-0">{t("loadingSchema")}</p>
                  ) : schema ? (
                    <Button
                      size="small"
                      iconId="fr-icon-arrow-right-line"
                      iconPosition="right"
                      onClick={e => {
                        e.stopPropagation();
                        goNext();
                      }}
                    >
                      {t("next")}
                    </Button>
                  ) : null
                ) : undefined
              }
              className={cx(isSelected && "outline outline-2 outline-blue-france-sun-113", "cursor-pointer")}
              nativeDivProps={{ onClick: () => void handleSelect(db.id) }}
            />
          );
        })}
      </div>
    </div>
  );
};
