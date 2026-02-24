"use client";

import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";
import Stepper from "@codegouvfr/react-dsfr/Stepper";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { type Board, type PostStatus } from "@/prisma/client";

import { createIntegration } from "../actions";
import { ConfigStep } from "./steps/ConfigStep";
import { ConnectionStep } from "./steps/ConnectionStep";
import { DatabaseStep } from "./steps/DatabaseStep";
import { MappingStep } from "./steps/MappingStep";
import { useNotionWizardStore } from "./useNotionWizardStore";

interface NotionWizardProps {
  boards: Board[];
  statuses: PostStatus[];
}

const STEP_COUNT = 4;

export const NotionWizard = ({ boards, statuses }: NotionWizardProps) => {
  const t = useTranslations("domainAdmin.integrations.wizard");
  const router = useRouter();
  const { step, canGoNext, goNext, goPrev, buildConfig, integrationName, syncIntervalMinutes, reset } =
    useNotionWizardStore();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<null | string>(null);

  const stepTitles = [t("step1Title"), t("step2Title"), t("step3Title"), t("step4Title")];

  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    setError(null);

    const config = buildConfig();
    const result = await createIntegration({
      name: integrationName,
      config,
      syncIntervalMinutes: syncIntervalMinutes ?? undefined,
    });

    setSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    reset();
    router.push(`/admin/integrations/${result.data.id}`);
  }, [buildConfig, integrationName, syncIntervalMinutes, reset, router]);

  return (
    <div>
      <Stepper
        currentStep={step}
        stepCount={STEP_COUNT}
        title={stepTitles[step - 1]}
        nextTitle={step < STEP_COUNT ? stepTitles[step] : undefined}
      />

      <div className="fr-mt-4w">
        {step === 1 && <ConnectionStep />}
        {step === 2 && <DatabaseStep />}
        {step === 3 && <MappingStep boards={boards} statuses={statuses} />}
        {step === 4 && <ConfigStep />}
      </div>

      {error && <Alert severity="error" small description={error} className="fr-mt-2w" />}

      <div className="fr-mt-4w flex gap-4">
        {step > 1 && (
          <Button onClick={goPrev} priority="secondary">
            {t("previous")}
          </Button>
        )}
        {step < STEP_COUNT ? (
          <Button onClick={goNext} disabled={!canGoNext()}>
            {t("next")}
          </Button>
        ) : (
          <Button onClick={() => void handleSubmit()} disabled={!canGoNext() || submitting}>
            {submitting ? t("creating") : t("create")}
          </Button>
        )}
      </div>
    </div>
  );
};
