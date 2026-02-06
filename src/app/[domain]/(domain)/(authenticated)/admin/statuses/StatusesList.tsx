"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import Input from "@codegouvfr/react-dsfr/Input";
import { ToggleSwitch } from "@codegouvfr/react-dsfr/ToggleSwitch";
import { useState } from "react";

import { POST_STATUS_COLOR_MAP, type POST_STATUS_COLOR } from "@/lib/model/PostStatus";
import { type PostStatus } from "@/prisma/client";

import { createPostStatus, deletePostStatus, reorderPostStatuses, updatePostStatus } from "./actions";
import { ColorSelect } from "./ColorSelect";

interface StatusesListProps {
  statuses: PostStatus[];
}

export const StatusesList = ({ statuses: initialStatuses }: StatusesListProps) => {
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
    if (!confirm("Êtes-vous sûr ?")) return;
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
          title="Erreur"
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
                  label="Nom"
                  nativeInputProps={{
                    value: editName,
                    onChange: e => setEditName(e.target.value),
                    autoComplete: "off",
                    name: "name",
                  }}
                />
                <ColorSelect label="Couleur" value={editColor} onChange={setEditColor} />
                <ToggleSwitch
                  label="Afficher dans la roadmap"
                  checked={editShowInRoadmap}
                  onChange={setEditShowInRoadmap}
                />
                <ButtonsGroup
                  className={fr.cx("fr-mt-2w")}
                  inlineLayoutWhen="always"
                  buttons={[
                    {
                      children: "Sauvegarder",
                      onClick: () => void handleUpdate(status.id),
                    },
                    {
                      children: "Annuler",
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
                      <span className={fr.cx("fr-badge", "fr-badge--sm", "fr-badge--success")}>Affiché en roadmap</span>
                    ) : (
                      <span className={fr.cx("fr-badge", "fr-badge--sm", "fr-badge--info")}>
                        Non affiché en roadmap
                      </span>
                    )}
                  </div>
                </div>
                <div className="fr-col-auto">
                  <ButtonsGroup
                    inlineLayoutWhen="always"
                    buttons={[
                      {
                        children: "↑",
                        title: "Déplacer vers le haut",
                        size: "small",
                        onClick: () => void handleMoveUp(index),
                        disabled: index === 0,
                        priority: "tertiary no outline",
                      },
                      {
                        children: "↓",
                        title: "Déplacer vers le bas",
                        size: "small",
                        onClick: () => void handleMoveDown(index),
                        disabled: index === statuses.length - 1,
                        priority: "tertiary no outline",
                      },
                      {
                        children: "Modifier",
                        size: "small",
                        onClick: () => {
                          setEditingId(status.id);
                          setEditName(status.name);
                          setEditColor(status.color);
                          setEditShowInRoadmap(status.showInRoadmap);
                        },
                      },
                      {
                        children: "Supprimer",
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

      <h2>Ajouter un statut</h2>
      <Input
        label="Nom"
        nativeInputProps={{
          value: newName,
          onChange: e => setNewName(e.target.value),
          autoComplete: "off",
          name: "new-name",
        }}
      />
      <ColorSelect label="Couleur" value={newColor} onChange={setNewColor} />
      <ToggleSwitch label="Afficher dans la roadmap" checked={newShowInRoadmap} onChange={setNewShowInRoadmap} />
      <Button onClick={() => void handleCreate()} disabled={!newName}>
        Créer
      </Button>
    </div>
  );
};
