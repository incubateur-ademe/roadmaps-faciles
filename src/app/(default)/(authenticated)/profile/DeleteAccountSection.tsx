"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import { signOut } from "next-auth/react";
import { useState } from "react";

import { type ServerActionResponse } from "@/utils/next";

const CONFIRMATION_TEXT = "SUPPRIMER";

interface DeleteAccountSectionProps {
  deleteAccount: () => Promise<ServerActionResponse>;
}

export const DeleteAccountSection = ({ deleteAccount }: DeleteAccountSectionProps) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmInput, setConfirmInput] = useState("");
  const [pending, setPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<null | string>(null);

  const handleDelete = async () => {
    setPending(true);
    setErrorMessage(null);

    const result = await deleteAccount();
    if (!result.ok) {
      setErrorMessage(result.error);
      setPending(false);
    } else {
      void signOut({ redirectTo: "/" });
    }
  };

  if (!showConfirm) {
    return (
      <div>
        <Alert
          severity="warning"
          small
          description="La suppression de votre compte est irréversible. Vos contributions (posts, commentaires) seront conservées de manière anonyme."
          className={fr.cx("fr-mb-2w")}
        />
        <Button priority="tertiary" size="small" onClick={() => setShowConfirm(true)}>
          Supprimer mon compte
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Alert
        severity="error"
        small
        description={`Pour confirmer la suppression, tapez "${CONFIRMATION_TEXT}" ci-dessous.`}
        className={fr.cx("fr-mb-2w")}
      />
      <Input
        label="Confirmation"
        nativeInputProps={{
          value: confirmInput,
          onChange: e => setConfirmInput(e.target.value),
          placeholder: CONFIRMATION_TEXT,
          autoComplete: "off",
        }}
        disabled={pending}
      />
      {errorMessage && <Alert severity="error" small description={errorMessage} className={fr.cx("fr-mb-2w")} />}
      <div className="flex gap-4">
        <Button
          priority="primary"
          size="small"
          disabled={pending || confirmInput !== CONFIRMATION_TEXT}
          onClick={() => void handleDelete()}
        >
          Confirmer la suppression
        </Button>
        <Button
          priority="tertiary"
          size="small"
          disabled={pending}
          onClick={() => {
            setShowConfirm(false);
            setConfirmInput("");
            setErrorMessage(null);
          }}
        >
          Annuler
        </Button>
      </div>
    </div>
  );
};
