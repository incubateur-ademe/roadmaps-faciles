"use client";

import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import { useTranslations } from "next-intl";
import { useCallback } from "react";

import { testNotionConnection } from "../../actions";
import { useNotionWizardStore } from "../useNotionWizardStore";

export const ConnectionStep = () => {
  const t = useTranslations("domainAdmin.integrations.wizard");
  const {
    apiKey,
    connectionStatus,
    botName,
    errorMessage,
    updateApiKey,
    setConnectionTesting,
    setConnectionSuccess,
    setConnectionError,
  } = useNotionWizardStore();

  const handleTest = useCallback(async () => {
    if (!apiKey.trim()) return;
    setConnectionTesting();

    const result = await testNotionConnection({ apiKey });
    if (!result.ok) {
      setConnectionError(result.error);
      return;
    }

    if (result.data.success) {
      setConnectionSuccess(result.data.botName ?? "");
    } else {
      setConnectionError(t("connectionFailed"));
    }
  }, [apiKey, setConnectionTesting, setConnectionSuccess, setConnectionError, t]);

  return (
    <div>
      <p>{t("connectionDescription")}</p>

      <Input
        label={t("apiKeyLabel")}
        hintText={t("apiKeyHint")}
        nativeInputProps={{
          type: "password",
          value: apiKey,
          onChange: e => updateApiKey(e.target.value),
          placeholder: "ntn_...",
        }}
      />

      <Button
        onClick={() => void handleTest()}
        disabled={!apiKey.trim() || connectionStatus === "testing"}
        priority="secondary"
        className="fr-mt-2w"
      >
        {connectionStatus === "testing" ? t("testing") : t("testConnection")}
      </Button>

      {connectionStatus === "success" && (
        <Alert severity="success" small description={t("connectionSuccess", { botName })} className="fr-mt-2w" />
      )}
      {connectionStatus === "error" && (
        <Alert severity="error" small description={errorMessage || t("connectionFailed")} className="fr-mt-2w" />
      )}
    </div>
  );
};
