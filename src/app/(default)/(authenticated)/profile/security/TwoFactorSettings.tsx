"use client";

import Alert from "@codegouvfr/react-dsfr/Alert";
import Badge from "@codegouvfr/react-dsfr/Badge";
import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import ToggleSwitch from "@codegouvfr/react-dsfr/ToggleSwitch";
import { startRegistration } from "@simplewebauthn/browser";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { removeOtp, removePasskey, toggleEmailTwoFactor } from "./actions";

interface Passkey {
  credentialBackedUp: boolean;
  credentialDeviceType: string;
  credentialID: string;
}

interface TwoFactorSettingsProps {
  emailEnabled: boolean;
  otpConfigured: boolean;
  passkeys: Passkey[];
}

export const TwoFactorSettings = ({ emailEnabled, otpConfigured, passkeys }: TwoFactorSettingsProps) => {
  const t = useTranslations("profile.security");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [otpSetup, setOtpSetup] = useState<{ qrCode: string; secret: string } | null>(null);
  const [otpCode, setOtpCode] = useState("");

  const handleToggleEmail = async () => {
    setLoading(true);
    const result = await toggleEmailTwoFactor();
    if (!result.ok) {
      setError(result.error);
    }
    setLoading(false);
    router.refresh();
  };

  const handleSetupOtp = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/otp/setup", { method: "POST" });
      const data = (await res.json()) as { qrCode: string; secret: string };
      setOtpSetup(data);
    } catch {
      setError(t("otpSetupError"));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtpSetup = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/otp/verify-setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: otpCode }),
      });
      if (res.ok) {
        setOtpSetup(null);
        setOtpCode("");
        router.refresh();
      } else {
        setError(t("otpInvalidCode"));
      }
    } catch {
      setError(t("otpSetupError"));
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveOtp = async () => {
    setLoading(true);
    const result = await removeOtp();
    if (!result.ok) {
      setError(result.error);
    }
    setLoading(false);
    router.refresh();
  };

  const handleAddPasskey = async () => {
    setLoading(true);
    setError(null);
    try {
      const optionsRes = await fetch("/api/webauthn/register/options", { method: "POST" });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const options = await optionsRes.json();

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const registration = await startRegistration({ optionsJSON: options });

      const verifyRes = await fetch("/api/webauthn/register/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registration),
      });

      if (verifyRes.ok) {
        router.refresh();
      } else {
        setError(t("passkeyError"));
      }
    } catch {
      setError(t("passkeyError"));
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePasskey = async (credentialId: string) => {
    setLoading(true);
    const result = await removePasskey(credentialId);
    if (!result.ok) {
      setError(result.error);
    }
    setLoading(false);
    router.refresh();
  };

  return (
    <div>
      {error && <Alert severity="error" small description={error} className="fr-mb-2w" />}

      {/* Email 2FA */}
      <h3>{t("emailTitle")}</h3>
      <p className="fr-text--sm">{t("emailDescription")}</p>
      <ToggleSwitch
        label={t("emailToggle")}
        checked={emailEnabled}
        onChange={() => void handleToggleEmail()}
        disabled={loading}
      />

      <hr className="fr-mt-3w fr-pb-2w" />

      {/* OTP (TOTP) */}
      <h3>{t("otpTitle")}</h3>
      <p className="fr-text--sm">{t("otpDescription")}</p>
      {otpConfigured && !otpSetup ? (
        <div className="flex items-center gap-2">
          <Badge severity="success">{t("active")}</Badge>
          <Button priority="tertiary" size="small" onClick={() => void handleRemoveOtp()} disabled={loading}>
            {t("remove")}
          </Button>
        </div>
      ) : otpSetup ? (
        <div>
          <p className="fr-text--sm">{t("otpScanQr")}</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={otpSetup.qrCode} alt="QR Code OTP" className="fr-mb-2w" />
          <p className="fr-text--xs">
            {t("otpManualKey")}: <code>{otpSetup.secret}</code>
          </p>
          <Input
            label={t("otpVerifyLabel")}
            nativeInputProps={{
              value: otpCode,
              onChange: e => setOtpCode(e.target.value),
              maxLength: 6,
              inputMode: "numeric",
              autoComplete: "one-time-code",
              name: "otp-setup-code",
            }}
          />
          <div className="flex gap-2">
            <Button onClick={() => void handleVerifyOtpSetup()} disabled={loading || otpCode.length !== 6}>
              {t("verify")}
            </Button>
            <Button priority="tertiary" onClick={() => setOtpSetup(null)}>
              {t("cancel")}
            </Button>
          </div>
        </div>
      ) : (
        <Button priority="secondary" onClick={() => void handleSetupOtp()} disabled={loading}>
          {t("otpSetup")}
        </Button>
      )}

      <hr className="fr-mt-3w fr-pb-2w" />

      {/* Passkeys */}
      <h3>{t("passkeyTitle")}</h3>
      <p className="fr-text--sm">{t("passkeyDescription")}</p>
      {passkeys.length > 0 && (
        <ul className="fr-mb-2w">
          {passkeys.map(pk => (
            <li key={pk.credentialID} className="flex items-center gap-2 fr-mb-1w">
              <Badge severity="info">{pk.credentialDeviceType === "multiDevice" ? t("synced") : t("device")}</Badge>
              <code className="fr-text--xs">{pk.credentialID.slice(0, 16)}...</code>
              <Button
                priority="tertiary no outline"
                size="small"
                onClick={() => void handleRemovePasskey(pk.credentialID)}
                disabled={loading}
              >
                {t("remove")}
              </Button>
            </li>
          ))}
        </ul>
      )}
      <Button priority="secondary" onClick={() => void handleAddPasskey()} disabled={loading}>
        {t("passkeyAdd")}
      </Button>
    </div>
  );
};
