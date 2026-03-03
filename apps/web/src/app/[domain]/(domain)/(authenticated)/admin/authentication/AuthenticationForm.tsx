"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import Checkbox from "@codegouvfr/react-dsfr/Checkbox";
import Input from "@codegouvfr/react-dsfr/Input";
import { Select } from "@codegouvfr/react-dsfr/SelectNext";
import ToggleSwitch from "@codegouvfr/react-dsfr/ToggleSwitch";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { type TenantSettings } from "@/prisma/client";

import { saveAuthenticationSettings, saveForce2FASettings, saveOAuthProviders } from "./actions";

const OAUTH_PROVIDERS = ["github", "google", "proconnect"] as const;

interface AuthenticationFormProps {
  availableProviders: string[];
  enabledProviders: string[];
  tenantSettings: TenantSettings;
}

export const AuthenticationForm = ({
  tenantSettings,
  enabledProviders: initialEnabledProviders,
  availableProviders,
}: AuthenticationFormProps) => {
  const t = useTranslations("domainAdmin.authentication");
  const tc = useTranslations("common");
  const router = useRouter();
  const [policy, setPolicy] = useState(tenantSettings.emailRegistrationPolicy);
  const [domains, setDomains] = useState(tenantSettings.allowedEmailDomains);
  const [newDomain, setNewDomain] = useState("");
  const [force2FA, setForce2FA] = useState(tenantSettings.force2FA);
  const [graceDays, setGraceDays] = useState(tenantSettings.force2FAGraceDays);
  const [enabledProviders, setEnabledProviders] = useState<string[]>(initialEnabledProviders);

  const policies = [
    { label: t("policyAnyone"), value: "ANYONE" },
    { label: t("policyNoone"), value: "NOONE" },
    { label: t("policyDomains"), value: "DOMAINS" },
  ];

  const graceOptions = Array.from({ length: 6 }, (_, i) => ({
    label: i === 0 ? t("immediate") : t("days", { count: i }),
    value: String(i),
  }));

  const handleSave = async () => {
    await saveAuthenticationSettings({ emailRegistrationPolicy: policy, allowedEmailDomains: domains });
    router.refresh();
  };

  const handleSaveForce2FA = async () => {
    await saveForce2FASettings({ force2FA, force2FAGraceDays: graceDays });
    router.refresh();
  };

  const handleSaveOAuth = async () => {
    await saveOAuthProviders({ providers: enabledProviders });
    router.refresh();
  };

  const addDomain = () => {
    if (newDomain && !domains.includes(newDomain)) {
      setDomains([...domains, newDomain]);
      setNewDomain("");
    }
  };

  const removeDomain = (domain: string) => {
    setDomains(domains.filter(d => d !== domain));
  };

  const toggleProvider = (provider: string) => {
    setEnabledProviders(prev => (prev.includes(provider) ? prev.filter(p => p !== provider) : [...prev, provider]));
  };

  return (
    <div>
      {/* Email Registration Policy */}
      <Select
        label={t("registrationPolicy")}
        nativeSelectProps={{ value: policy, onChange: e => setPolicy(e.target.value as typeof policy) }}
        options={policies}
      />

      {policy === "DOMAINS" && (
        <>
          <h3>{t("allowedDomains")}</h3>
          <ul>
            {domains.map(domain => (
              <li key={domain} className={fr.cx("fr-mb-1w")}>
                {domain}
                <Button
                  size="small"
                  priority="secondary"
                  title={t("removeDomain")}
                  onClick={() => removeDomain(domain)}
                >
                  ×
                </Button>
              </li>
            ))}
          </ul>
          <Input
            label={t("addDomain")}
            nativeInputProps={{
              value: newDomain,
              onChange: e => setNewDomain(e.target.value),
              autoComplete: "off",
              name: "new-domain",
            }}
          />
          <Button onClick={addDomain}>{tc("add")}</Button>
        </>
      )}

      <Button onClick={() => void handleSave()}>{tc("save")}</Button>

      {/* Force 2FA */}
      <hr className="fr-mt-4w fr-pb-2w" />
      <h2>{t("force2FATitle")}</h2>
      <ToggleSwitch label={t("force2FAToggle")} checked={force2FA} onChange={setForce2FA} />

      {force2FA && (
        <Select
          label={t("gracePeriod")}
          nativeSelectProps={{
            value: String(graceDays),
            onChange: e => setGraceDays(Number(e.target.value)),
          }}
          options={graceOptions}
        />
      )}

      <Button onClick={() => void handleSaveForce2FA()} className="fr-mt-2w">
        {tc("save")}
      </Button>

      {/* OAuth Providers */}
      {availableProviders.length > 0 && (
        <>
          <hr className="fr-mt-4w fr-pb-2w" />
          <h2>{t("oauthTitle")}</h2>
          <p className="fr-text--sm">{t("oauthDescription")}</p>
          <Checkbox
            options={OAUTH_PROVIDERS.filter(p => availableProviders.includes(p)).map(provider => ({
              label: t(`provider.${provider}`),
              nativeInputProps: {
                checked: enabledProviders.includes(provider),
                onChange: () => toggleProvider(provider),
                name: `oauth-${provider}`,
              },
            }))}
          />
          <Button onClick={() => void handleSaveOAuth()} className="fr-mt-2w">
            {tc("save")}
          </Button>
        </>
      )}
    </div>
  );
};
