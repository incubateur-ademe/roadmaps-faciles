"use client";

import { useTranslations } from "next-intl";
import { type FormEvent, useState, useTransition } from "react";

import { Alert, AlertDescription } from "@/ui/shadcn/alert";
import { Button } from "@/ui/shadcn/button";
import { Input } from "@/ui/shadcn/input";
import { Label } from "@/ui/shadcn/label";

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
      <form onSubmit={handleOtpSubmit} className="space-y-4">
        <h2 className="text-lg font-semibold">{t("preLoginOtp.title")}</h2>
        <p className="text-sm text-muted-foreground">{t("preLoginOtp.description")}</p>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="space-y-2">
          <Label htmlFor="otp">{t("twoFactor.otpLabel")}</Label>
          <Input
            id="otp"
            type="text"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            autoComplete="one-time-code"
            required
            value={otpCode}
            onChange={e => setOtpCode(e.target.value)}
            autoFocus
            aria-invalid={!!error}
          />
        </div>
        <div className="flex gap-3">
          <Button type="submit" disabled={isPending}>
            {t("twoFactor.verify")}
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={isPending}
            onClick={() => {
              setStep("identifier");
              setOtpCode("");
              setError(undefined);
            }}
          >
            {t("twoFactor.back")}
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleIdentifierSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold">{loginWithEmail ? t("loginWithEmail") : t("loginWithUsername")}</h2>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-2">
        {loginWithEmail ? (
          <>
            <Label htmlFor="email">{t("emailLabel")}</Label>
            <Input
              id="email"
              type="email"
              required
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              aria-invalid={!!error}
            />
          </>
        ) : (
          <>
            <Label htmlFor="username">{t("usernameLabel")}</Label>
            <Input
              id="username"
              type="text"
              required
              pattern="^[A-Za-z.]+$"
              title={t("usernameValidation")}
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              aria-invalid={!!error}
            />
          </>
        )}
      </div>
      <Button type="submit" disabled={isPending}>
        {t("login")}
      </Button>
    </form>
  );
};
