"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";
import { useState } from "react";

import { TableCustom } from "@/dsfr/base/TableCustom";
import { type ApiKey } from "@/prisma/client";

import { createApiKey, deleteApiKey } from "./actions";

interface ApiKeysListProps {
  apiKeys: ApiKey[];
}

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" });

export const ApiKeysList = ({ apiKeys: initialApiKeys }: ApiKeysListProps) => {
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
    if (!confirm("Êtes-vous sûr ?")) return;
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
          title="Nouvelle clé API créée"
          description={`Votre clé API : ${newToken}. Copiez-la maintenant, elle ne sera plus affichée.`}
          closable
          onClose={() => setNewToken(null)}
        />
      )}

      {apiKeys.length > 0 ? (
        <TableCustom
          className={fr.cx("fr-mb-3w")}
          header={[{ children: "Préfixe" }, { children: "Date de création" }, { children: "Actions" }]}
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
                  Révoquer
                </Button>
              ),
            },
          ])}
        />
      ) : (
        <Alert
          className={fr.cx("fr-mb-3w")}
          severity="info"
          title="Aucune clé API"
          description="Aucune clé API n'a été créée pour ce tenant."
          small
        />
      )}

      <Button onClick={() => void handleCreate()}>Créer une clé API</Button>
    </div>
  );
};
