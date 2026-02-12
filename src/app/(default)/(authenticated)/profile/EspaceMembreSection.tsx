"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { ClientAnimate } from "@/components/utils/ClientAnimate";

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
        <Alert severity="success" small description={t("emLinked", { username })} className={fr.cx("fr-mb-2w")} />
        <ClientAnimate>
          {successMessage && (
            <Alert severity="success" small description={successMessage} className={fr.cx("fr-mb-2w")} />
          )}
          {errorMessage && <Alert severity="error" small description={errorMessage} className={fr.cx("fr-mb-2w")} />}
        </ClientAnimate>
        <Button priority="tertiary" size="small" disabled={pending} onClick={() => void handleUnlink()}>
          {t("emUnlink")}
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Alert severity="info" small description={t("emLinkDescription")} className={fr.cx("fr-mb-2w")} />
      <div className="flex items-end gap-4">
        <Input
          label={t("emLoginLabel")}
          hintText={t("emLoginHint")}
          nativeInputProps={{
            value: emLogin,
            onChange: e => setEmLogin(e.target.value),
            placeholder: "prenom.nom",
          }}
          disabled={pending}
          className="!mb-0 flex-1"
        />
        <Button
          className="mb-[1.5rem]"
          priority="secondary"
          size="small"
          disabled={pending || !emLogin.trim()}
          onClick={() => void handleRequestLink()}
        >
          {t("emLink")}
        </Button>
      </div>
      <ClientAnimate>
        {successMessage && (
          <Alert severity="success" small description={successMessage} className={fr.cx("fr-mt-2w")} />
        )}
        {errorMessage && <Alert severity="error" small description={errorMessage} className={fr.cx("fr-mt-2w")} />}
      </ClientAnimate>
    </div>
  );
};
