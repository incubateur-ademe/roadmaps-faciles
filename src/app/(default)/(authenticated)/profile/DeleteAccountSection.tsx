"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { type ServerActionResponse } from "@/utils/next";

interface DeleteAccountSectionProps {
  deleteAccount: () => Promise<ServerActionResponse>;
}

export const DeleteAccountSection = ({ deleteAccount }: DeleteAccountSectionProps) => {
  const t = useTranslations("profile");
  const tc = useTranslations("common");
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmInput, setConfirmInput] = useState("");
  const [pending, setPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<null | string>(null);

  const confirmationWord = t("deleteConfirmationWord");

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
        <Alert severity="warning" small description={t("deleteWarning")} className={fr.cx("fr-mb-2w")} />
        <Button priority="tertiary" size="small" onClick={() => setShowConfirm(true)}>
          {t("deleteAccount")}
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Alert
        severity="error"
        small
        description={t("deleteConfirmPrompt", { text: confirmationWord })}
        className={fr.cx("fr-mb-2w")}
      />
      <Input
        label={t("confirmation")}
        nativeInputProps={{
          value: confirmInput,
          onChange: e => setConfirmInput(e.target.value),
          placeholder: confirmationWord,
          autoComplete: "off",
        }}
        disabled={pending}
      />
      {errorMessage && <Alert severity="error" small description={errorMessage} className={fr.cx("fr-mb-2w")} />}
      <div className="flex gap-4">
        <Button
          priority="primary"
          size="small"
          disabled={pending || confirmInput !== confirmationWord}
          onClick={() => void handleDelete()}
        >
          {t("confirmDelete")}
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
          {tc("cancel")}
        </Button>
      </div>
    </div>
  );
};
