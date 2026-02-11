"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { TableCustom } from "@/dsfr/base/TableCustom";
import { type ApiKey } from "@/prisma/client";

import { createApiKey, deleteApiKey } from "./actions";

interface ApiKeysListProps {
  apiKeys: ApiKey[];
}

export const ApiKeysList = ({ apiKeys: initialApiKeys }: ApiKeysListProps) => {
  const t = useTranslations("domainAdmin.api");
  const tc = useTranslations("common");
  const locale = useLocale();
  const dateFormatter = useMemo(() => new Intl.DateTimeFormat(locale, { dateStyle: "medium" }), [locale]);
  const [apiKeys, setApiKeys] = useState(initialApiKeys);
  const [newToken, setNewToken] = useState<null | string>(null);

  const handleCreate = async () => {
    const result = await createApiKey();
    if (result.ok && result.data) {
      setApiKeys([result.data.apiKey, ...apiKeys]);
      setNewToken(result.data.token);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(tc("areYouSure"))) return;
    const result = await deleteApiKey({ id });
    if (result.ok) {
      setApiKeys(apiKeys.filter(k => k.id !== id));
    }
  };

  return (
    <div>
      {newToken && (
        <Alert
          className={fr.cx("fr-mb-3w")}
          severity="info"
          title={t("newKeyCreated")}
          description={t("newKeyMessage", { token: newToken })}
          closable
          onClose={() => setNewToken(null)}
        />
      )}

      {apiKeys.length > 0 ? (
        <TableCustom
          className={fr.cx("fr-mb-3w")}
          header={[{ children: t("prefix") }, { children: t("createdAt") }, { children: tc("actions") }]}
          body={apiKeys.map(apiKey => [
            {
              children: (
                <code className={fr.cx("fr-text--sm")}>
                  {apiKey.commonTokenPrefix}…{apiKey.randomTokenPrefix}
                </code>
              ),
            },
            { children: dateFormatter.format(new Date(apiKey.createdAt)) },
            {
              children: (
                <Button size="small" priority="secondary" onClick={() => void handleDelete(apiKey.id)}>
                  {tc("revoke")}
                </Button>
              ),
            },
          ])}
        />
      ) : (
        <Alert
          className={fr.cx("fr-mb-3w")}
          severity="info"
          title={t("noKeys")}
          description={t("noKeysDescription")}
          small
        />
      )}

      <Button onClick={() => void handleCreate()}>{t("createKey")}</Button>
    </div>
  );
};
