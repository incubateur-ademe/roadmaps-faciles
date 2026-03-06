"use client";

import { Alert, AlertDescription, AlertTitle } from "@kokatsuna/ui/components/alert";
import { Badge } from "@kokatsuna/ui/components/badge";
import { Button } from "@kokatsuna/ui/components/button";
import { Input } from "@kokatsuna/ui/components/input";
import { Label } from "@kokatsuna/ui/components/label";
import { Switch } from "@kokatsuna/ui/components/switch";
import { ArrowDown, ArrowUp } from "lucide-react";
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
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>{tc("error")}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="mb-8 space-y-3">
        {statuses.map((status, index) => (
          <div key={status.id} className="rounded-md border border-border p-4">
            {editingId === status.id ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`edit-name-${status.id}`}>{t("name")}</Label>
                  <Input
                    id={`edit-name-${status.id}`}
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    autoComplete="off"
                    name="name"
                  />
                </div>
                <ColorSelect label={t("color")} value={editColor} onChange={setEditColor} />
                <div className="flex items-center gap-3">
                  <Switch
                    id={`edit-roadmap-${status.id}`}
                    checked={editShowInRoadmap}
                    onCheckedChange={setEditShowInRoadmap}
                  />
                  <Label htmlFor={`edit-roadmap-${status.id}`}>{t("showInRoadmap")}</Label>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => void handleUpdate(status.id)}>{tc("save")}</Button>
                  <Button variant="secondary" onClick={() => setEditingId(null)}>
                    {tc("cancel")}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div>
                    <span className={`fr-badge fr-badge--lg fr-badge--${POST_STATUS_COLOR_MAP[status.color]}`}>
                      {status.name}
                    </span>
                  </div>
                  <div>
                    {status.showInRoadmap ? (
                      <Badge variant="default">{t("shownInRoadmap")}</Badge>
                    ) : (
                      <Badge variant="secondary">{t("notShownInRoadmap")}</Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
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
                    disabled={index === statuses.length - 1}
                  >
                    <ArrowDown className="size-4" />
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                      setEditingId(status.id);
                      setEditName(status.name);
                      setEditColor(status.color);
                      setEditShowInRoadmap(status.showInRoadmap);
                    }}
                  >
                    {t("modify")}
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => void handleDelete(status.id)}>
                    {tc("delete")}
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold mb-4">{t("addStatus")}</h2>
      <div className="space-y-4 max-w-md">
        <div className="space-y-2">
          <Label htmlFor="new-status-name">{t("name")}</Label>
          <Input
            id="new-status-name"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            autoComplete="off"
            name="new-name"
          />
        </div>
        <ColorSelect label={t("color")} value={newColor} onChange={setNewColor} />
        <div className="flex items-center gap-3">
          <Switch id="new-roadmap" checked={newShowInRoadmap} onCheckedChange={setNewShowInRoadmap} />
          <Label htmlFor="new-roadmap">{t("showInRoadmap")}</Label>
        </div>
        <Button onClick={() => void handleCreate()} disabled={!newName}>
          {tc("create")}
        </Button>
      </div>
    </div>
  );
};
