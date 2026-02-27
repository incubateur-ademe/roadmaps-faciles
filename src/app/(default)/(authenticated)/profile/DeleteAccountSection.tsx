"use client";

import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Alert, AlertDescription } from "@/ui/shadcn/alert";
import { Button } from "@/ui/shadcn/button";
import { Input } from "@/ui/shadcn/input";
import { Label } from "@/ui/shadcn/label";
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
        <Alert className="mb-4">
          <AlertDescription>{t("deleteWarning")}</AlertDescription>
        </Alert>
        <Button variant="ghost" size="sm" onClick={() => setShowConfirm(true)}>
          {t("deleteAccount")}
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Alert variant="destructive" className="mb-4">
        <AlertDescription>{t("deleteConfirmPrompt", { text: confirmationWord })}</AlertDescription>
      </Alert>
      <div className="mb-4 space-y-2">
        <Label htmlFor="confirm-delete">{t("confirmation")}</Label>
        <Input
          id="confirm-delete"
          value={confirmInput}
          onChange={e => setConfirmInput(e.target.value)}
          placeholder={confirmationWord}
          autoComplete="off"
          disabled={pending}
        />
      </div>
      {errorMessage && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      <div className="flex gap-4">
        <Button size="sm" disabled={pending || confirmInput !== confirmationWord} onClick={() => void handleDelete()}>
          {t("confirmDelete")}
        </Button>
        <Button
          variant="ghost"
          size="sm"
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
