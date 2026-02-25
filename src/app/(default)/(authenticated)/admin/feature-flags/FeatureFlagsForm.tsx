"use client";

import Button from "@codegouvfr/react-dsfr/Button";
import ToggleSwitch from "@codegouvfr/react-dsfr/ToggleSwitch";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { FEATURE_FLAGS, type FeatureFlagKey, type FeatureFlagsMap } from "@/lib/feature-flags/flags";

import { saveFeatureFlags } from "./actions";

interface FeatureFlagsFormProps {
  flags: FeatureFlagsMap;
}

const flagKeys = Object.keys(FEATURE_FLAGS) as FeatureFlagKey[];

export const FeatureFlagsForm = ({ flags }: FeatureFlagsFormProps) => {
  const t = useTranslations("rootAdmin.featureFlags");
  const tc = useTranslations("common");
  const router = useRouter();
  const [localFlags, setLocalFlags] = useState<FeatureFlagsMap>(flags);

  if (flagKeys.length === 0) {
    return <p>{t("noFlags")}</p>;
  }

  const handleToggle = (key: FeatureFlagKey, checked: boolean) => {
    setLocalFlags(prev => ({ ...prev, [key]: checked }));
  };

  const handleSave = async () => {
    const result = await saveFeatureFlags(localFlags);
    if (!result.ok) {
      console.error(result.error);
      return;
    }
    router.refresh();
  };

  return (
    <div>
      {flagKeys.map(key => {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions -- FeatureFlagKey is `never` when registry is empty; dead code (early return above)
        const label = t(`flags.${key}.label` as never);
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions -- same as above
        const description = t(`flags.${key}.description` as never);
        return (
          <ToggleSwitch
            key={key}
            label={label}
            helperText={description}
            checked={localFlags[key]}
            onChange={checked => handleToggle(key, checked)}
          />
        );
      })}

      <Button onClick={() => void handleSave()} className="fr-mt-2w">
        {tc("save")}
      </Button>
    </div>
  );
};
