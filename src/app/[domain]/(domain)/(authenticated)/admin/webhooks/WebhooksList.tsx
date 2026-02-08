"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import Badge from "@codegouvfr/react-dsfr/Badge";
import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import { Select } from "@codegouvfr/react-dsfr/SelectNext";
import { useState } from "react";

import { TableCustom } from "@/dsfr/base/TableCustom";
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

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" });

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
      {webhooks.length > 0 ? (
        <TableCustom
          className={fr.cx("fr-mb-3w")}
          header={[
            { children: "URL" },
            { children: "Événement" },
            { children: "Date de création" },
            { children: "Actions" },
          ]}
          body={webhooks.map(webhook => [
            {
              children: <code className={fr.cx("fr-text--sm")}>{webhook.url}</code>,
            },
            {
              children: (
                <Badge as="span" small noIcon>
                  {webhook.event}
                </Badge>
              ),
            },
            { children: dateFormatter.format(new Date(webhook.createdAt)) },
            {
              children: (
                <Button size="small" priority="secondary" onClick={() => void handleDelete(webhook.id)}>
                  Supprimer
                </Button>
              ),
            },
          ])}
        />
      ) : (
        <Alert
          className={fr.cx("fr-mb-3w")}
          severity="info"
          title="Aucun webhook"
          description="Aucun webhook n'a été configuré pour ce tenant."
          small
        />
      )}

      <h2>Ajouter un webhook</h2>
      <Input
        label="URL"
        nativeInputProps={{
          type: "url",
          value: newUrl,
          onChange: e => setNewUrl(e.target.value),
          autoComplete: "off",
          name: "url",
        }}
      />
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
