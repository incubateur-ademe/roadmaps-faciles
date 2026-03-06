"use client";

import { Button } from "@kokatsuna/ui/components/button";
import { Label } from "@kokatsuna/ui/components/label";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { type Board } from "@/prisma/client";

import { saveRoadmapSettings } from "./actions";

interface RoadmapFormProps {
  boards: Board[];
  currentRootBoardId: null | number;
}

export const RoadmapForm = ({ boards, currentRootBoardId }: RoadmapFormProps) => {
  const t = useTranslations("domainAdmin.roadmap");
  const tc = useTranslations("common");
  const [rootBoardId, setRootBoardId] = useState<null | number>(currentRootBoardId);

  const handleSave = async () => {
    await saveRoadmapSettings({ rootBoardId });
  };

  return (
    <div className="space-y-4 max-w-sm">
      <div className="space-y-2">
        <Label htmlFor="root-board">{t("rootBoard")}</Label>
        <select
          id="root-board"
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          value={rootBoardId ? String(rootBoardId) : ""}
          onChange={e => setRootBoardId(e.target.value ? Number(e.target.value) : null)}
        >
          <option value="">{t("none")}</option>
          {boards.map(b => (
            <option key={b.id} value={String(b.id)}>
              {b.name}
            </option>
          ))}
        </select>
      </div>
      <Button onClick={() => void handleSave()}>{tc("save")}</Button>
    </div>
  );
};
