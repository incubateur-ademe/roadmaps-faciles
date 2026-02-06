"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import { useState } from "react";

import { type Board } from "@/prisma/client";

import { createBoard, deleteBoard, reorderBoards, updateBoard } from "./actions";

interface BoardsListProps {
  boards: Board[];
}

export const BoardsList = ({ boards: initialBoards }: BoardsListProps) => {
  const [boards, setBoards] = useState(initialBoards);
  const [formState, setFormState] = useState({
    new: { name: "", description: "" },
    edit: { id: null as null | number, name: "", description: "" },
  });
  const [error, setError] = useState<null | string>(null);

  const handleCreate = async () => {
    const result = await createBoard({ name: formState.new.name, description: formState.new.description });
    if (result.ok && result.data) {
      setBoards([...boards, result.data]);
      setFormState(prev => ({ ...prev, new: { name: "", description: "" } }));
    }
  };

  const handleUpdate = async (id: number) => {
    const result = await updateBoard({ id, name: formState.edit.name, description: formState.edit.description });
    if (result.ok && result.data) {
      setBoards(boards.map(b => (b.id === id ? result.data : b)));
      setFormState(prev => ({ ...prev, edit: { id: null, name: "", description: "" } }));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr ?")) return;
    const result = await deleteBoard({ id });
    if (result.ok) {
      setBoards(boards.filter(b => b.id !== id));
      setError(null);
    } else if (!result.ok) {
      setError(result.error);
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    const newBoards = [...boards];
    [newBoards[index - 1], newBoards[index]] = [newBoards[index], newBoards[index - 1]];
    const items = newBoards.map((b, i) => ({ id: b.id, order: i }));
    await reorderBoards({ items });
    setBoards(newBoards);
  };

  const handleMoveDown = async (index: number) => {
    if (index === boards.length - 1) return;
    const newBoards = [...boards];
    [newBoards[index], newBoards[index + 1]] = [newBoards[index + 1], newBoards[index]];
    const items = newBoards.map((b, i) => ({ id: b.id, order: i }));
    await reorderBoards({ items });
    setBoards(newBoards);
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

      <ul>
        {boards.map((board, index) => (
          <li key={board.id} className={fr.cx("fr-mb-2w")}>
            {formState.edit.id === board.id ? (
              <>
                <Input
                  label="Nom"
                  nativeInputProps={{
                    value: formState.edit.name,
                    onChange: e => setFormState(prev => ({ ...prev, edit: { ...prev.edit, name: e.target.value } })),
                    autoComplete: "off",
                    name: "name",
                  }}
                />
                <Input
                  label="Description"
                  textArea
                  nativeTextAreaProps={{
                    value: formState.edit.description,
                    onChange: e =>
                      setFormState(prev => ({ ...prev, edit: { ...prev.edit, description: e.target.value } })),
                    autoComplete: "off",
                    name: "description",
                  }}
                />
                <Button onClick={() => void handleUpdate(board.id)}>Sauvegarder</Button>
                <Button
                  priority="secondary"
                  onClick={() => setFormState(prev => ({ ...prev, edit: { id: null, name: "", description: "" } }))}
                >
                  Annuler
                </Button>
              </>
            ) : (
              <>
                <strong>{board.name}</strong> - {board.description}
                <div>
                  <Button
                    size="small"
                    title="Déplacer vers le haut"
                    onClick={() => void handleMoveUp(index)}
                    disabled={index === 0}
                  >
                    ↑
                  </Button>
                  <Button
                    size="small"
                    title="Déplacer vers le bas"
                    onClick={() => void handleMoveDown(index)}
                    disabled={index === boards.length - 1}
                  >
                    ↓
                  </Button>
                  <Button
                    size="small"
                    onClick={() => {
                      setFormState(prev => ({
                        ...prev,
                        edit: { id: board.id, name: board.name, description: board.description ?? "" },
                      }));
                    }}
                  >
                    Modifier
                  </Button>
                  <Button size="small" priority="secondary" onClick={() => void handleDelete(board.id)}>
                    Supprimer
                  </Button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      <h2>Ajouter un board</h2>
      <Input
        label="Nom"
        nativeInputProps={{
          value: formState.new.name,
          onChange: e => setFormState(prev => ({ ...prev, new: { ...prev.new, name: e.target.value } })),
          autoComplete: "off",
          name: "new-name",
        }}
      />
      <Input
        label="Description"
        textArea
        nativeTextAreaProps={{
          value: formState.new.description,
          onChange: e => setFormState(prev => ({ ...prev, new: { ...prev.new, description: e.target.value } })),
          autoComplete: "off",
          name: "new-description",
        }}
      />
      <Button onClick={() => void handleCreate()} disabled={!formState.new.name}>
        Créer
      </Button>
    </div>
  );
};
