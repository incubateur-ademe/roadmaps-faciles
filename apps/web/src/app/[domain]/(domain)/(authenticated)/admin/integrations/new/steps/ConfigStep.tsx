"use client";

import Input from "@codegouvfr/react-dsfr/Input";
import Select from "@codegouvfr/react-dsfr/Select";
import { useTranslations } from "next-intl";

import { SYNC_INTERVAL_OPTIONS, useNotionWizardStore } from "../useNotionWizardStore";

export const ConfigStep = () => {
  const t = useTranslations("domainAdmin.integrations.wizard");
  const { integrationName, syncIntervalMinutes, setIntegrationName, setSyncIntervalMinutes } = useNotionWizardStore();

  return (
    <div>
      <p>{t("configDescription")}</p>

      <Input
        label={t("integrationName")}
        hintText={t("integrationNameHint")}
        nativeInputProps={{
          value: integrationName,
          onChange: e => setIntegrationName(e.target.value),
        }}
      />

      <Select
        label={t("syncFrequency")}
        hint={t("syncFrequencyHint")}
        nativeSelectProps={{
          value: syncIntervalMinutes ?? "",
          onChange: e => {
            const val = e.target.value;
            setSyncIntervalMinutes(val ? Number(val) : null);
          },
        }}
      >
        {SYNC_INTERVAL_OPTIONS.map(opt => (
          <option key={opt ?? "manual"} value={opt ?? ""}>
            {opt === null
              ? t("manualOnly")
              : opt < 60
                ? t("everyMinutes", { count: opt })
                : opt === 60
                  ? t("everyHour")
                  : opt < 1440
                    ? t("everyHours", { count: opt / 60 })
                    : t("everyDay")}
          </option>
        ))}
      </Select>
    </div>
  );
};
