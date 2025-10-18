"use client";

import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import { useEffect, useRef, useState } from "react";

export interface PasswordCheckProps {
  name?: string;
}

export const PasswordCheck = ({ name }: PasswordCheckProps) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const hasPassword = password.length > 0;
  const passwordsMatch = password === confirmPassword && hasPassword;

  const confirmRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (confirmRef.current && hasPassword) {
      confirmRef.current.setCustomValidity(passwordsMatch ? "" : "Les mots de passe ne correspondent pas.");
    }
  }, [passwordsMatch, hasPassword]);

  return (
    <>
      <Input
        key="password"
        label="Nouveau mot de passe"
        nativeInputProps={{
          name,
          type: showPassword ? "text" : "password",
          value: password,
          onChange: e => setPassword(e.target.value),
          autoComplete: "new-password",
        }}
        addon={
          <Button
            type="button"
            iconId={showPassword ? "fr-icon-eye-fill" : "fr-icon-eye-off-fill"}
            title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            onClick={() => setShowPassword(v => !v)}
            priority="tertiary"
          />
        }
      />
      <Input
        key="confirmPassword"
        label="Confirmer le mot de passe"
        nativeInputProps={{
          ref: confirmRef,
          type: showPassword ? "text" : "password",
          value: confirmPassword,
          onChange: e => setConfirmPassword(e.target.value),
          autoComplete: "new-password",
          required: hasPassword,
        }}
        disabled={!hasPassword}
        addon={
          <Button
            type="button"
            iconId={showPassword ? "fr-icon-eye-fill" : "fr-icon-eye-off-fill"}
            title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            onClick={() => setShowPassword(v => !v)}
            priority="tertiary"
          />
        }
        state={passwordsMatch ? "default" : confirmPassword.length > 0 ? "error" : "default"}
        stateRelatedMessage={
          confirmPassword.length > 0 && !passwordsMatch ? "Les mots de passe ne correspondent pas." : undefined
        }
      />
    </>
  );
};
