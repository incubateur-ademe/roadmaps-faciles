"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import { Select } from "@codegouvfr/react-dsfr/SelectNext";
import { ToggleSwitch } from "@codegouvfr/react-dsfr/ToggleSwitch";
import { useState } from "react";

import { POST_STATUS_COLOR, POST_STATUS_COLOR_MAP } from "@/lib/model/PostStatus";
import { type PostStatus } from "@/prisma/client";

import { createPostStatus, deletePostStatus, reorderPostStatuses, updatePostStatus } from "./actions";

interface StatusesListProps {
  statuses: PostStatus[];
}

const colors = Object.keys(POST_STATUS_COLOR) as Array<keyof typeof POST_STATUS_COLOR>;

export const StatusesList = ({ statuses: initialStatuses }: StatusesListProps) => {
  const [statuses, setStatuses] = useState(initialStatuses);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState<keyof typeof POST_STATUS_COLOR>("blueCumulus");
  const [newShowInRoadmap, setNewShowInRoadmap] = useState(true);
  const [editingId, setEditingId] = useState<null | number>(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState<keyof typeof POST_STATUS_COLOR>("blueCumulus");
  const [editShowInRoadmap, setEditShowInRoadmap] = useState(true);

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
    } else if (!result.ok) {
      alert(result.error);
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
      <ul>
        {statuses.map((status, index) => (
          <li key={status.id} className={fr.cx("fr-mb-2w")}>
            {editingId === status.id ? (
              <>
                <Input label="Nom" nativeInputProps={{ value: editName, onChange: e => setEditName(e.target.value) }} />
                <Select
                  label="Couleur"
                  nativeSelectProps={{
                    value: editColor,
                    onChange: e => setEditColor(e.target.value),
                  }}
                  options={colors.map(c => ({ label: c, value: c }))}
                />
                <ToggleSwitch
                  label="Afficher dans la roadmap"
                  checked={editShowInRoadmap}
                  onChange={setEditShowInRoadmap}
                />
                <Button onClick={() => void handleUpdate(status.id)}>Sauvegarder</Button>
                <Button priority="secondary" onClick={() => setEditingId(null)}>
                  Annuler
                </Button>
              </>
            ) : (
              <>
                <span className={`${fr.cx("fr-badge")} fr-badge--${POST_STATUS_COLOR_MAP[status.color]}`}>
                  {status.name}
                </span>
                {status.showInRoadmap && " (roadmap)"}
                <div>
                  <Button size="small" onClick={() => void handleMoveUp(index)} disabled={index === 0}>
                    ↑
                  </Button>
                  <Button
                    size="small"
                    onClick={() => void handleMoveDown(index)}
                    disabled={index === statuses.length - 1}
                  >
                    ↓
                  </Button>
                  <Button
                    size="small"
                    onClick={() => {
                      setEditingId(status.id);
                      setEditName(status.name);
                      setEditColor(status.color);
                      setEditShowInRoadmap(status.showInRoadmap);
                    }}
                  >
                    Modifier
                  </Button>
                  <Button size="small" priority="secondary" onClick={() => void handleDelete(status.id)}>
                    Supprimer
                  </Button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      <h2>Ajouter un statut</h2>
      <Input label="Nom" nativeInputProps={{ value: newName, onChange: e => setNewName(e.target.value) }} />
      <Select
        label="Couleur"
        nativeSelectProps={{ value: newColor, onChange: e => setNewColor(e.target.value) }}
        options={colors.map(c => ({ label: c, value: c }))}
      />
      <ToggleSwitch label="Afficher dans la roadmap" checked={newShowInRoadmap} onChange={setNewShowInRoadmap} />
      <Button onClick={() => void handleCreate()} disabled={!newName}>
        Créer
      </Button>
    </div>
  );
};
