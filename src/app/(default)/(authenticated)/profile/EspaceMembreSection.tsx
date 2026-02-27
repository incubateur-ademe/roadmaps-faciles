"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { ClientAnimate } from "@/components/utils/ClientAnimate";
import { Alert, AlertDescription } from "@/ui/shadcn/alert";
import { Button } from "@/ui/shadcn/button";
import { Input } from "@/ui/shadcn/input";
import { Label } from "@/ui/shadcn/label";

import { requestEmLink, unlinkEspaceMembre } from "./actions";

interface EspaceMembreSectionProps {
  isBetaGouvMember: boolean;
  username: null | string;
}

export const EspaceMembreSection = ({ isBetaGouvMember, username }: EspaceMembreSectionProps) => {
  const t = useTranslations("profile");
  const [emLogin, setEmLogin] = useState("");
  const [pending, setPending] = useState(false);
  const [successMessage, setSuccessMessage] = useState<null | string>(null);
  const [errorMessage, setErrorMessage] = useState<null | string>(null);

  const handleRequestLink = async () => {
    if (!emLogin.trim()) return;

    setPending(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    const result = await requestEmLink(emLogin.trim());
    if (!result.ok) {
      setErrorMessage(result.error);
    } else {
      setSuccessMessage(t("emVerificationSent", { email: result.data.emEmail }));
    }
    setPending(false);
  };

  const handleUnlink = async () => {
    if (!confirm(t("emUnlinkConfirm"))) return;

    setPending(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    const result = await unlinkEspaceMembre();
    if (!result.ok) {
      setErrorMessage(result.error);
    } else {
      setSuccessMessage(t("emUnlinked"));
    }
    setPending(false);
  };

  if (isBetaGouvMember && username) {
    return (
      <div>
        <Alert className="mb-4">
          <AlertDescription>{t("emLinked", { username })}</AlertDescription>
        </Alert>
        <ClientAnimate>
          {successMessage && (
            <Alert className="mb-4">
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}
          {errorMessage && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
        </ClientAnimate>
        <Button variant="ghost" size="sm" disabled={pending} onClick={() => void handleUnlink()}>
          {t("emUnlink")}
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Alert className="mb-4">
        <AlertDescription>{t("emLinkDescription")}</AlertDescription>
      </Alert>
      <div className="flex items-end gap-4">
        <div className="flex-1 space-y-2">
          <Label htmlFor="em-login">{t("emLoginLabel")}</Label>
          <Input
            id="em-login"
            value={emLogin}
            onChange={e => setEmLogin(e.target.value)}
            placeholder="prenom.nom"
            disabled={pending}
          />
          <p className="text-sm text-muted-foreground">{t("emLoginHint")}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="mb-[1.75rem]"
          disabled={pending || !emLogin.trim()}
          onClick={() => void handleRequestLink()}
        >
          {t("emLink")}
        </Button>
      </div>
      <ClientAnimate>
        {successMessage && (
          <Alert className="mt-4">
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}
        {errorMessage && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
      </ClientAnimate>
    </div>
  );
};
