"use client";

import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import { startAuthentication } from "@simplewebauthn/browser";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Container, Grid, GridCol } from "@/dsfr";

interface TwoFactorVerifyProps {
  hasEmail: boolean;
  hasOtp: boolean;
  hasPasskey: boolean;
  redirectUrl?: string;
}

export const TwoFactorVerify = ({ hasPasskey, hasOtp, hasEmail, redirectUrl = "/" }: TwoFactorVerifyProps) => {
  const t = useTranslations("auth.twoFactor");
  const router = useRouter();
  const { update } = useSession();
  const [method, setMethod] = useState<"email" | "otp" | "passkey" | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSuccess = async () => {
    await update({ twoFactorVerified: true });
    router.push(redirectUrl);
    router.refresh();
  };

  const handlePasskey = async () => {
    setLoading(true);
    setError(null);
    try {
      const optionsRes = await fetch("/api/webauthn/authenticate/options", { method: "POST" });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const options = await optionsRes.json();

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const assertion = await startAuthentication({ optionsJSON: options });

      const verifyRes = await fetch("/api/webauthn/authenticate/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assertion),
      });

      if (verifyRes.ok) {
        await handleSuccess();
      } else {
        setError(t("error"));
      }
    } catch {
      setError(t("error"));
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/2fa/email/send", { method: "POST" });
      if (res.ok) {
        setEmailSent(true);
        setMethod("email");
      } else {
        setError(t("error"));
      }
    } catch {
      setError(t("error"));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (endpoint: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      if (res.ok) {
        await handleSuccess();
      } else {
        setError(t("invalidCode"));
      }
    } catch {
      setError(t("error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container my="4w">
      <Grid haveGutters align="center">
        <GridCol md={6}>
          <h1>{t("title")}</h1>
          <p>{t("description")}</p>

          {error && <Alert severity="error" small description={error} className="fr-mb-2w" />}

          {!method && (
            <div className="flex flex-col gap-4">
              {hasPasskey && (
                <Button onClick={() => void handlePasskey()} disabled={loading}>
                  {t("usePasskey")}
                </Button>
              )}
              {hasOtp && (
                <Button priority="secondary" onClick={() => setMethod("otp")} disabled={loading}>
                  {t("useOtp")}
                </Button>
              )}
              {hasEmail && (
                <Button priority="secondary" onClick={() => void handleSendEmail()} disabled={loading}>
                  {t("useEmail")}
                </Button>
              )}
            </div>
          )}

          {method === "otp" && (
            <div>
              <Input
                label={t("otpLabel")}
                nativeInputProps={{
                  value: code,
                  onChange: e => setCode(e.target.value),
                  maxLength: 6,
                  inputMode: "numeric",
                  autoComplete: "one-time-code",
                  name: "otp-code",
                }}
              />
              <div className="flex gap-2">
                <Button
                  onClick={() => void handleVerifyCode("/api/otp/verify")}
                  disabled={loading || code.length !== 6}
                >
                  {t("verify")}
                </Button>
                <Button priority="tertiary" onClick={() => setMethod(null)}>
                  {t("back")}
                </Button>
              </div>
            </div>
          )}

          {method === "email" && emailSent && (
            <div>
              <Alert severity="info" small description={t("emailSent")} className="fr-mb-2w" />
              <Input
                label={t("emailLabel")}
                nativeInputProps={{
                  value: code,
                  onChange: e => setCode(e.target.value),
                  maxLength: 6,
                  inputMode: "numeric",
                  autoComplete: "one-time-code",
                  name: "email-code",
                }}
              />
              <div className="flex gap-2">
                <Button
                  onClick={() => void handleVerifyCode("/api/2fa/email/verify")}
                  disabled={loading || code.length !== 6}
                >
                  {t("verify")}
                </Button>
                <Button priority="tertiary" onClick={() => setMethod(null)}>
                  {t("back")}
                </Button>
              </div>
            </div>
          )}
        </GridCol>
      </Grid>
    </Container>
  );
};
