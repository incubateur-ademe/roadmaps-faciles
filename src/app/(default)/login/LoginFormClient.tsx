"use client";

import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import Input from "@codegouvfr/react-dsfr/Input";
import { useTranslations } from "next-intl";
import { type FormEvent, useState, useTransition } from "react";

import { FormFieldset } from "@/dsfr";

import { loginAction } from "./actions";

export interface LoginFormClientProps {
  defaultEmail?: string;
  loginWithEmail?: boolean;
}

export const LoginFormClient = ({ loginWithEmail, defaultEmail }: LoginFormClientProps) => {
  const t = useTranslations("auth");

  const [step, setStep] = useState<"identifier" | "otp">("identifier");
  const [identifier, setIdentifier] = useState(defaultEmail ?? "");
  const [otpCode, setOtpCode] = useState("");
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();

  const handleIdentifierSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;

    setError(undefined);
    startTransition(async () => {
      try {
        const res = await fetch("/api/otp/pre-login-check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier: identifier.trim(), isUsername: !loginWithEmail }),
        });

        if (!res.ok) {
          setError(t("twoFactor.error"));
          return;
        }

        const data = (await res.json()) as { requiresOtp: boolean };
        if (data.requiresOtp) {
          setStep("otp");
        } else {
          await loginAction(identifier.trim(), !!loginWithEmail);
        }
      } catch {
        setError(t("twoFactor.error"));
      }
    });
  };

  const handleOtpSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) return;

    setError(undefined);
    startTransition(async () => {
      try {
        const res = await fetch("/api/otp/pre-login-verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier: identifier.trim(), code: otpCode.trim(), isUsername: !loginWithEmail }),
        });

        if (!res.ok) {
          setError(t("twoFactor.invalidCode"));
          return;
        }

        const data = (await res.json()) as { verified: boolean };
        if (data.verified) {
          await loginAction(identifier.trim(), !!loginWithEmail);
        } else {
          setError(t("twoFactor.invalidCode"));
        }
      } catch {
        setError(t("twoFactor.error"));
      }
    });
  };

  if (step === "otp") {
    return (
      <form onSubmit={handleOtpSubmit}>
        <FormFieldset
          legend={<h2>{t("preLoginOtp.title")}</h2>}
          elements={[
            <p key="desc" className="fr-text--sm fr-mb-2w">
              {t("preLoginOtp.description")}
            </p>,
            <Input
              key="otp"
              label={t("twoFactor.otpLabel")}
              state={error ? "error" : "default"}
              stateRelatedMessage={error}
              nativeInputProps={{
                type: "text",
                inputMode: "numeric",
                pattern: "[0-9]{6}",
                maxLength: 6,
                autoComplete: "one-time-code",
                required: true,
                value: otpCode,
                onChange: e => setOtpCode(e.target.value),
                autoFocus: true,
              }}
            />,
            <FormFieldset
              key="buttons"
              legend={null}
              elements={[
                <ButtonsGroup
                  key="buttons-group"
                  buttons={[
                    {
                      children: t("twoFactor.verify"),
                      type: "submit",
                      disabled: isPending,
                    },
                    {
                      children: t("twoFactor.back"),
                      priority: "secondary",
                      type: "button",
                      disabled: isPending,
                      onClick: () => {
                        setStep("identifier");
                        setOtpCode("");
                        setError(undefined);
                      },
                    },
                  ]}
                />,
              ]}
            />,
          ]}
        />
      </form>
    );
  }

  return (
    <form onSubmit={handleIdentifierSubmit}>
      <FormFieldset
        legend={<h2>{loginWithEmail ? t("loginWithEmail") : t("loginWithUsername")}</h2>}
        elements={[
          loginWithEmail ? (
            <Input
              key="email"
              label={t("emailLabel")}
              state={error ? "error" : "default"}
              stateRelatedMessage={error}
              nativeInputProps={{
                type: "email",
                required: true,
                value: identifier,
                onChange: e => setIdentifier(e.target.value),
              }}
            />
          ) : (
            <Input
              key="username"
              label={t("usernameLabel")}
              state={error ? "error" : "default"}
              stateRelatedMessage={error}
              nativeInputProps={{
                type: "text",
                required: true,
                pattern: "^[A-Za-z.]+$",
                title: t("usernameValidation"),
                value: identifier,
                onChange: e => setIdentifier(e.target.value),
              }}
            />
          ),
          <FormFieldset
            key="submit"
            legend={null}
            elements={[
              <ButtonsGroup
                key="buttons-group"
                buttons={[
                  {
                    children: t("login"),
                    type: "submit",
                    disabled: isPending,
                  },
                ]}
              />,
            ]}
          />,
        ]}
      />
    </form>
  );
};
