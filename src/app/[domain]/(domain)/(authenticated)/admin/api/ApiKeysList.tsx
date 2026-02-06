"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";
import { useState } from "react";

import { type ApiKey } from "@/prisma/client";

import { createApiKey, deleteApiKey } from "./actions";

interface ApiKeysListProps {
  apiKeys: ApiKey[];
}

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
          severity="info"
          title="Nouvelle clé API créée"
          description={`Votre clé API : ${newToken}. Copiez-la maintenant, elle ne sera plus affichée.`}
          closable
          onClose={() => setNewToken(null)}
        />
      )}

      <table className={fr.cx("fr-table")}>
        <thead>
          <tr>
            <th>Préfixe</th>
            <th>Date de création</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {apiKeys.map(apiKey => (
            <tr key={apiKey.id}>
              <td>
                {apiKey.commonTokenPrefix}...{apiKey.randomTokenPrefix}
              </td>
              <td>{new Date(apiKey.createdAt).toLocaleDateString()}</td>
              <td>
                <Button size="small" priority="secondary" onClick={() => void handleDelete(apiKey.id)}>
                  Révoquer
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Button onClick={() => void handleCreate()}>Créer une clé API</Button>
    </div>
  );
};
