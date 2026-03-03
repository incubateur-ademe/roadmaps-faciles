"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import Badge from "@codegouvfr/react-dsfr/Badge";
import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import { Select } from "@codegouvfr/react-dsfr/SelectNext";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { TableCustom } from "@/dsfr/base/TableCustom";
import { type Webhook } from "@/prisma/client";

import { createWebhook, deleteWebhook } from "./actions";

interface WebhooksListProps {
  webhooks: Webhook[];
}

export const WebhooksList = ({ webhooks: initialWebhooks }: WebhooksListProps) => {
  const t = useTranslations("domainAdmin.webhooks");
  const tc = useTranslations("common");
  const locale = useLocale();
  const dateFormatter = useMemo(() => new Intl.DateTimeFormat(locale, { dateStyle: "medium" }), [locale]);

  const events = [
    { label: t("eventPostCreated"), value: "post.created" },
    { label: t("eventPostStatusChanged"), value: "post.status_changed" },
    { label: t("eventCommentCreated"), value: "comment.created" },
    { label: t("eventLikeAdded"), value: "like.added" },
    { label: t("eventInvitationAccepted"), value: "invitation.accepted" },
  ];

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
    if (!confirm(tc("areYouSure"))) return;
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
            { children: t("url") },
            { children: t("event") },
            { children: t("createdAt") },
            { children: tc("actions") },
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
                  {tc("delete")}
                </Button>
              ),
            },
          ])}
        />
      ) : (
        <Alert
          className={fr.cx("fr-mb-3w")}
          severity="info"
          title={t("noWebhooks")}
          description={t("noWebhooksDescription")}
          small
        />
      )}

      <h2>{t("addWebhook")}</h2>
      <Input
        label={t("url")}
        nativeInputProps={{
          type: "url",
          value: newUrl,
          onChange: e => setNewUrl(e.target.value),
          autoComplete: "off",
          name: "url",
        }}
      />
      <Select
        label={t("event")}
        nativeSelectProps={{ value: newEvent, onChange: e => setNewEvent(e.target.value) }}
        options={events}
      />
      <Button onClick={() => void handleCreate()} disabled={!newUrl}>
        {tc("create")}
      </Button>
    </div>
  );
};
