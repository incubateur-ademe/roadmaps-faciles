"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import { Select } from "@codegouvfr/react-dsfr/SelectNext";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { type TenantSettings } from "@/prisma/client";

import { saveAuthenticationSettings } from "./actions";

interface AuthenticationFormProps {
  tenantSettings: TenantSettings;
}

export const AuthenticationForm = ({ tenantSettings }: AuthenticationFormProps) => {
  const t = useTranslations("domainAdmin.authentication");
  const tc = useTranslations("common");
  const [policy, setPolicy] = useState(tenantSettings.emailRegistrationPolicy);
  const [domains, setDomains] = useState(tenantSettings.allowedEmailDomains);
  const [newDomain, setNewDomain] = useState("");

  const policies = [
    { label: t("policyAnyone"), value: "ANYONE" },
    { label: t("policyNoone"), value: "NOONE" },
    { label: t("policyDomains"), value: "DOMAINS" },
  ];

  const handleSave = async () => {
    await saveAuthenticationSettings({ emailRegistrationPolicy: policy, allowedEmailDomains: domains });
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

  return (
    <div>
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
    </div>
  );
};
