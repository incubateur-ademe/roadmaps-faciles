"use client";

import Button from "@codegouvfr/react-dsfr/Button";
import { Select } from "@codegouvfr/react-dsfr/SelectNext";
import ToggleSwitch from "@codegouvfr/react-dsfr/ToggleSwitch";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { saveSecuritySettings } from "./actions";

interface SecurityFormProps {
  force2FA: boolean;
  force2FAGraceDays: number;
}

export const SecurityForm = ({ force2FA, force2FAGraceDays }: SecurityFormProps) => {
  const t = useTranslations("rootAdmin.security");
  const tc = useTranslations("common");
  const router = useRouter();
  const [enabled, setEnabled] = useState(force2FA);
  const [graceDays, setGraceDays] = useState(force2FAGraceDays);

  const graceOptions = Array.from({ length: 6 }, (_, i) => ({
    label: i === 0 ? t("immediate") : t("days", { count: i }),
    value: String(i),
  }));

  const handleSave = async () => {
    await saveSecuritySettings({ force2FA: enabled, force2FAGraceDays: graceDays });
    router.refresh();
  };

  return (
    <div>
      <ToggleSwitch label={t("force2FAToggle")} checked={enabled} onChange={setEnabled} />

      {enabled && (
        <Select
          label={t("gracePeriod")}
          nativeSelectProps={{
            value: String(graceDays),
            onChange: e => setGraceDays(Number(e.target.value)),
          }}
          options={graceOptions}
        />
      )}

      <Button onClick={() => void handleSave()} className="fr-mt-2w">
        {tc("save")}
      </Button>
    </div>
  );
};
