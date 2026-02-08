"use client";

import Button from "@codegouvfr/react-dsfr/Button";
import { Select } from "@codegouvfr/react-dsfr/SelectNext";
import { useState } from "react";

import { type Board } from "@/prisma/client";

import { saveRoadmapSettings } from "./actions";

interface RoadmapFormProps {
  boards: Board[];
  currentRootBoardId: null | number;
}

export const RoadmapForm = ({ boards, currentRootBoardId }: RoadmapFormProps) => {
  const [rootBoardId, setRootBoardId] = useState<null | number>(currentRootBoardId);

  const handleSave = async () => {
    await saveRoadmapSettings({ rootBoardId });
  };

  const options = [{ label: "Aucun", value: "" }, ...boards.map(b => ({ label: b.name, value: String(b.id) }))];

  return (
    <div>
      <Select
        label="Board de la page principale"
        nativeSelectProps={{
          value: rootBoardId ? String(rootBoardId) : "",
          onChange: e => setRootBoardId(e.target.value ? Number(e.target.value) : null),
        }}
        options={options}
      />
      <Button onClick={() => void handleSave()}>Sauvegarder</Button>
    </div>
  );
};
