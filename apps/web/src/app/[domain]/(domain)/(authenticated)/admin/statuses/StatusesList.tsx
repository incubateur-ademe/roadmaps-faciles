"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import Badge from "@codegouvfr/react-dsfr/Badge";
import Button from "@codegouvfr/react-dsfr/Button";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import Input from "@codegouvfr/react-dsfr/Input";
import { ToggleSwitch } from "@codegouvfr/react-dsfr/ToggleSwitch";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { POST_STATUS_COLOR_MAP, type POST_STATUS_COLOR } from "@/lib/model/PostStatus";
import { type PostStatus } from "@/prisma/client";

import { createPostStatus, deletePostStatus, reorderPostStatuses, updatePostStatus } from "./actions";
import { ColorSelect } from "./ColorSelect";

interface StatusesListProps {
  statuses: PostStatus[];
}

export const StatusesList = ({ statuses: initialStatuses }: StatusesListProps) => {
  const t = useTranslations("domainAdmin.statuses");
  const tc = useTranslations("common");
  const [statuses, setStatuses] = useState(initialStatuses);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState<keyof typeof POST_STATUS_COLOR>("blueCumulus");
  const [newShowInRoadmap, setNewShowInRoadmap] = useState(true);
  const [editingId, setEditingId] = useState<null | number>(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState<keyof typeof POST_STATUS_COLOR>("blueCumulus");
  const [editShowInRoadmap, setEditShowInRoadmap] = useState(true);
  const [error, setError] = useState<null | string>(null);

  const handleCreate = async () => {
    const result = await createPostStatus({ name: newName, color: newColor, showInRoadmap: newShowInRoadmap });
    if (result.ok && result.data) {
      setStatuses([...statuses, result.data]);
      setNewName("");
      setNewColor("blueCumulus");
      setNewShowInRoadmap(true);
    }
  };

  const handleUpdate = async (id: number) => {
    const result = await updatePostStatus({ id, name: editName, color: editColor, showInRoadmap: editShowInRoadmap });
    if (result.ok && result.data) {
      setStatuses(statuses.map(s => (s.id === id ? result.data : s)));
      setEditingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(tc("areYouSure"))) return;
    const result = await deletePostStatus({ id });
    if (result.ok) {
      setStatuses(statuses.filter(s => s.id !== id));
      setError(null);
    } else if (!result.ok) {
      setError(result.error);
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    const newStatuses = [...statuses];
    [newStatuses[index - 1], newStatuses[index]] = [newStatuses[index], newStatuses[index - 1]];
    const items = newStatuses.map((s, i) => ({ id: s.id, order: i }));
    await reorderPostStatuses({ items });
    setStatuses(newStatuses);
  };

  const handleMoveDown = async (index: number) => {
    if (index === statuses.length - 1) return;
    const newStatuses = [...statuses];
    [newStatuses[index], newStatuses[index + 1]] = [newStatuses[index + 1], newStatuses[index]];
    const items = newStatuses.map((s, i) => ({ id: s.id, order: i }));
    await reorderPostStatuses({ items });
    setStatuses(newStatuses);
  };

  return (
    <div>
      {error && (
        <Alert
          className={fr.cx("fr-mb-2w")}
          severity="error"
          title={tc("error")}
          description={error}
          closable
          onClose={() => setError(null)}
        />
      )}

      <div className={fr.cx("fr-mb-4w")}>
        {statuses.map((status, index) => (
          <div
            key={status.id}
            className={fr.cx("fr-p-3w", "fr-mb-2w")}
            style={{ border: "1px solid var(--border-default-grey)", borderRadius: "0.25rem" }}
          >
            {editingId === status.id ? (
              <div>
                <Input
                  label={t("name")}
                  nativeInputProps={{
                    value: editName,
                    onChange: e => setEditName(e.target.value),
                    autoComplete: "off",
                    name: "name",
                  }}
                />
                <ColorSelect label={t("color")} value={editColor} onChange={setEditColor} />
                <ToggleSwitch label={t("showInRoadmap")} checked={editShowInRoadmap} onChange={setEditShowInRoadmap} />
                <ButtonsGroup
                  className={fr.cx("fr-mt-2w")}
                  inlineLayoutWhen="always"
                  buttons={[
                    {
                      children: tc("save"),
                      onClick: () => void handleUpdate(status.id),
                    },
                    {
                      children: tc("cancel"),
                      priority: "secondary",
                      onClick: () => setEditingId(null),
                    },
                  ]}
                />
              </div>
            ) : (
              <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
                <div className={fr.cx("fr-col")}>
                  <div className={fr.cx("fr-mb-1w")}>
                    <span className={`fr-badge fr-badge--lg fr-badge--${POST_STATUS_COLOR_MAP[status.color]}`}>
                      {status.name}
                    </span>
                  </div>
                  <div>
                    {status.showInRoadmap ? (
                      <Badge as="span" small noIcon severity="success">
                        {t("shownInRoadmap")}
                      </Badge>
                    ) : (
                      <Badge as="span" small noIcon severity="info">
                        {t("notShownInRoadmap")}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="fr-col-auto">
                  <ButtonsGroup
                    inlineLayoutWhen="always"
                    buttons={[
                      {
                        children: "↑",
                        title: t("moveUp"),
                        size: "small",
                        onClick: () => void handleMoveUp(index),
                        disabled: index === 0,
                        priority: "tertiary no outline",
                      },
                      {
                        children: "↓",
                        title: t("moveDown"),
                        size: "small",
                        onClick: () => void handleMoveDown(index),
                        disabled: index === statuses.length - 1,
                        priority: "tertiary no outline",
                      },
                      {
                        children: t("modify"),
                        size: "small",
                        onClick: () => {
                          setEditingId(status.id);
                          setEditName(status.name);
                          setEditColor(status.color);
                          setEditShowInRoadmap(status.showInRoadmap);
                        },
                      },
                      {
                        children: tc("delete"),
                        size: "small",
                        priority: "secondary",
                        onClick: () => void handleDelete(status.id),
                      },
                    ]}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <h2>{t("addStatus")}</h2>
      <Input
        label={t("name")}
        nativeInputProps={{
          value: newName,
          onChange: e => setNewName(e.target.value),
          autoComplete: "off",
          name: "new-name",
        }}
      />
      <ColorSelect label={t("color")} value={newColor} onChange={setNewColor} />
      <ToggleSwitch label={t("showInRoadmap")} checked={newShowInRoadmap} onChange={setNewShowInRoadmap} />
      <Button onClick={() => void handleCreate()} disabled={!newName}>
        {tc("create")}
      </Button>
    </div>
  );
};
