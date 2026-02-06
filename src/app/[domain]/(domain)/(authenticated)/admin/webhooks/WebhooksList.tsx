"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import { Select } from "@codegouvfr/react-dsfr/SelectNext";
import { useState } from "react";

import { type Webhook } from "@/prisma/client";

import { createWebhook, deleteWebhook } from "./actions";

const events = [
  { label: "Post créé", value: "post.created" },
  { label: "Statut du post changé", value: "post.status_changed" },
  { label: "Commentaire créé", value: "comment.created" },
  { label: "Like ajouté", value: "like.added" },
  { label: "Invitation acceptée", value: "invitation.accepted" },
];

interface WebhooksListProps {
  webhooks: Webhook[];
}

export const WebhooksList = ({ webhooks: initialWebhooks }: WebhooksListProps) => {
  const [webhooks, setWebhooks] = useState(initialWebhooks);
  const [newUrl, setNewUrl] = useState("");
  const [newEvent, setNewEvent] = useState(events[0].value);

  const handleCreate = async () => {
    const result = await createWebhook({ url: newUrl, event: newEvent });
    if (result.ok && result.data) {
      setWebhooks([...webhooks, result.data]);
      setNewUrl("");
      setNewEvent(events[0].value);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr ?")) return;
    const result = await deleteWebhook({ id });
    if (result.ok) {
      setWebhooks(webhooks.filter(w => w.id !== id));
    }
  };

  return (
    <div>
      <table className={fr.cx("fr-table")}>
        <thead>
          <tr>
            <th>URL</th>
            <th>Événement</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {webhooks.map(webhook => (
            <tr key={webhook.id}>
              <td>{webhook.url}</td>
              <td>{webhook.event}</td>
              <td>{new Date(webhook.createdAt).toLocaleDateString()}</td>
              <td>
                <Button size="small" priority="secondary" onClick={() => void handleDelete(webhook.id)}>
                  Supprimer
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Ajouter un webhook</h2>
      <Input label="URL" nativeInputProps={{ value: newUrl, onChange: e => setNewUrl(e.target.value) }} />
      <Select
        label="Événement"
        nativeSelectProps={{ value: newEvent, onChange: e => setNewEvent(e.target.value) }}
        options={events}
      />
      <Button onClick={() => void handleCreate()} disabled={!newUrl}>
        Créer
      </Button>
    </div>
  );
};
