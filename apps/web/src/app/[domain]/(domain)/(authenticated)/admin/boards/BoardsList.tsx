"use client";

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Textarea,
} from "@kokatsuna/ui";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import Markdown from "react-markdown";

import { type Board } from "@/prisma/client";
import { reactMarkdownConfig } from "@/utils/react-markdown";

import { createBoard, deleteBoard, reorderBoards, updateBoard } from "./actions";

interface BoardsListProps {
  boards: Board[];
}

export const BoardsList = ({ boards: initialBoards }: BoardsListProps) => {
  const t = useTranslations("domainAdmin.boards");
  const tc = useTranslations("common");
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
    if (!confirm(tc("areYouSure"))) return;
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
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>{tc("error")}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <Button variant="ghost" size="icon" className="absolute right-2 top-2 size-6" onClick={() => setError(null)}>
            <X className="size-4" />
          </Button>
        </Alert>
      )}

      <div className="mb-8 space-y-4">
        {boards.map((board, index) => (
          <Card key={board.id}>
            {formState.edit.id === board.id ? (
              <>
                <CardHeader>
                  <div className="space-y-2">
                    <Label htmlFor={`edit-name-${board.id}`}>{t("name")}</Label>
                    <Input
                      id={`edit-name-${board.id}`}
                      value={formState.edit.name}
                      onChange={e => setFormState(prev => ({ ...prev, edit: { ...prev.edit, name: e.target.value } }))}
                      autoComplete="off"
                      name="name"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor={`edit-desc-${board.id}`}>{t("description")}</Label>
                    <Textarea
                      id={`edit-desc-${board.id}`}
                      value={formState.edit.description}
                      onChange={e =>
                        setFormState(prev => ({ ...prev, edit: { ...prev.edit, description: e.target.value } }))
                      }
                      autoComplete="off"
                      name="description"
                      rows={4}
                    />
                  </div>
                </CardContent>
                <CardFooter className="gap-2">
                  <Button size="sm" onClick={() => void handleUpdate(board.id)}>
                    {tc("save")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFormState(prev => ({ ...prev, edit: { id: null, name: "", description: "" } }))}
                  >
                    {tc("cancel")}
                  </Button>
                </CardFooter>
              </>
            ) : (
              <>
                <CardHeader>
                  <CardTitle>{board.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  {board.description ? (
                    <Markdown {...reactMarkdownConfig}>{board.description}</Markdown>
                  ) : (
                    <em className="text-xs text-muted-foreground">{t("noDescription")}</em>
                  )}
                </CardContent>
                <CardFooter className="gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    title={t("moveUp")}
                    onClick={() => void handleMoveUp(index)}
                    disabled={index === 0}
                  >
                    <ArrowUp className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    title={t("moveDown")}
                    onClick={() => void handleMoveDown(index)}
                    disabled={index === boards.length - 1}
                  >
                    <ArrowDown className="size-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormState(prev => ({
                        ...prev,
                        edit: { id: board.id, name: board.name, description: board.description ?? "" },
                      }));
                    }}
                  >
                    <Pencil className="mr-1 size-3" />
                    {t("modify")}
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => void handleDelete(board.id)}>
                    <Trash2 className="mr-1 size-3" />
                    {tc("delete")}
                  </Button>
                </CardFooter>
              </>
            )}
          </Card>
        ))}
      </div>

      <h2 className="mb-4 text-xl font-semibold">{t("addBoard")}</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="new-name">{t("name")}</Label>
          <Input
            id="new-name"
            value={formState.new.name}
            onChange={e => setFormState(prev => ({ ...prev, new: { ...prev.new, name: e.target.value } }))}
            autoComplete="off"
            name="new-name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="new-description">{t("descriptionMarkdown")}</Label>
          <Textarea
            id="new-description"
            value={formState.new.description}
            onChange={e => setFormState(prev => ({ ...prev, new: { ...prev.new, description: e.target.value } }))}
            autoComplete="off"
            name="new-description"
            rows={4}
          />
        </div>
        <Button onClick={() => void handleCreate()} disabled={!formState.new.name}>
          <Plus className="mr-1 size-4" />
          {tc("create")}
        </Button>
      </div>
    </div>
  );
};
