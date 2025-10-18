"use client";

import Button from "@codegouvfr/react-dsfr/Button";

import { ErrorLayout } from "@/components/ErrorLayout";
import { clientParseError } from "@/utils/error";

import { SystemMessageDisplay } from "./SystemMessageDisplay";

export default function Error({ error: _error, reset }: { error: Error; reset: () => void }) {
  const error = clientParseError(_error);
  return (
    <ErrorLayout>
      <SystemMessageDisplay
        code="custom"
        body={
          <div>
            <p>{error.message}</p>
            <Button priority="tertiary" onClick={() => reset()}>
              Réessayer
            </Button>
          </div>
        }
        headline={error.name}
        pictogram="technicalError"
        title={`Erreur technique`}
      />
    </ErrorLayout>
  );
}
