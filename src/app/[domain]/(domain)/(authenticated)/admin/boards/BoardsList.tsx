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
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editingId, setEditingId] = useState<null | number>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [error, setError] = useState<null | string>(null);

  const handleCreate = async () => {
    const result = await createBoard({ name: newName, description: newDescription });
    if (result.ok && result.data) {
      setBoards([...boards, result.data]);
      setNewName("");
      setNewDescription("");
    }
  };

  const handleUpdate = async (id: number) => {
    const result = await updateBoard({ id, name: editName, description: editDescription });
    if (result.ok && result.data) {
      setBoards(boards.map(b => (b.id === id ? result.data : b)));
      setEditingId(null);
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
            {editingId === board.id ? (
              <>
                <Input
                  label="Nom"
                  nativeInputProps={{
                    value: editName,
                    onChange: e => setEditName(e.target.value),
                    autoComplete: "off",
                    name: "name",
                  }}
                />
                <Input
                  label="Description"
                  textArea
                  nativeTextAreaProps={{
                    value: editDescription,
                    onChange: e => setEditDescription(e.target.value),
                    autoComplete: "off",
                    name: "description",
                  }}
                />
                <Button onClick={() => void handleUpdate(board.id)}>Sauvegarder</Button>
                <Button priority="secondary" onClick={() => setEditingId(null)}>
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
                      setEditingId(board.id);
                      setEditName(board.name);
                      setEditDescription(board.description ?? "");
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
          value: newName,
          onChange: e => setNewName(e.target.value),
          autoComplete: "off",
          name: "new-name",
        }}
      />
      <Input
        label="Description"
        textArea
        nativeTextAreaProps={{
          value: newDescription,
          onChange: e => setNewDescription(e.target.value),
          autoComplete: "off",
          name: "new-description",
        }}
      />
      <Button onClick={() => void handleCreate()} disabled={!newName}>
        Créer
      </Button>
    </div>
  );
};
