"use client";

import { Button } from "@kokatsuna/ui/components/button";
import { Checkbox } from "@kokatsuna/ui/components/checkbox";
import { Input } from "@kokatsuna/ui/components/input";
import { Label } from "@kokatsuna/ui/components/label";
import { Separator } from "@kokatsuna/ui/components/separator";
import { Switch } from "@kokatsuna/ui/components/switch";
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
    <div className="space-y-8">
      {/* Email Registration Policy */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="registration-policy">{t("registrationPolicy")}</Label>
          <select
            id="registration-policy"
            className="flex h-9 w-full max-w-xs rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={policy}
            onChange={e => setPolicy(e.target.value as typeof policy)}
          >
            {policies.map(p => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {policy === "DOMAINS" && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium">{t("allowedDomains")}</h3>
            <ul className="space-y-1">
              {domains.map(domain => (
                <li key={domain} className="flex items-center gap-2">
                  <span className="text-sm">{domain}</span>
                  <Button variant="ghost" size="sm" title={t("removeDomain")} onClick={() => removeDomain(domain)}>
                    ×
                  </Button>
                </li>
              ))}
            </ul>
            <div className="flex items-end gap-2 max-w-sm">
              <div className="flex-1 space-y-2">
                <Label htmlFor="new-domain">{t("addDomain")}</Label>
                <Input
                  id="new-domain"
                  value={newDomain}
                  onChange={e => setNewDomain(e.target.value)}
                  autoComplete="off"
                  name="new-domain"
                />
              </div>
              <Button onClick={addDomain}>{tc("add")}</Button>
            </div>
          </div>
        )}

        <Button onClick={() => void handleSave()}>{tc("save")}</Button>
      </div>

      {/* Force 2FA */}
      <Separator />
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">{t("force2FATitle")}</h2>
        <div className="flex items-center gap-3">
          <Switch id="force-2fa" checked={force2FA} onCheckedChange={setForce2FA} />
          <Label htmlFor="force-2fa">{t("force2FAToggle")}</Label>
        </div>

        {force2FA && (
          <div className="space-y-2 max-w-xs">
            <Label htmlFor="grace-period">{t("gracePeriod")}</Label>
            <select
              id="grace-period"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={String(graceDays)}
              onChange={e => setGraceDays(Number(e.target.value))}
            >
              {graceOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <Button onClick={() => void handleSaveForce2FA()}>{tc("save")}</Button>
      </div>

      {/* OAuth Providers */}
      {availableProviders.length > 0 && (
        <>
          <Separator />
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">{t("oauthTitle")}</h2>
            <p className="text-sm text-muted-foreground">{t("oauthDescription")}</p>
            <div className="space-y-3">
              {OAUTH_PROVIDERS.filter(p => availableProviders.includes(p)).map(provider => (
                <div key={provider} className="flex items-center gap-2">
                  <Checkbox
                    id={`oauth-${provider}`}
                    checked={enabledProviders.includes(provider)}
                    onCheckedChange={() => toggleProvider(provider)}
                  />
                  <Label htmlFor={`oauth-${provider}`}>{t(`provider.${provider}`)}</Label>
                </div>
              ))}
            </div>
            <Button onClick={() => void handleSaveOAuth()}>{tc("save")}</Button>
          </div>
        </>
      )}
    </div>
  );
};
