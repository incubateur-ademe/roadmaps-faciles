"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import { Select } from "@codegouvfr/react-dsfr/SelectNext";
import { useState } from "react";

import { type TenantSettings } from "@/prisma/client";

import { saveAuthenticationSettings } from "./actions";

const policies = [
  { label: "Tout le monde", value: "ANYONE" },
  { label: "Personne", value: "NOONE" },
  { label: "Domaines autorisés", value: "DOMAINS" },
];

interface AuthenticationFormProps {
  tenantSettings: TenantSettings;
}

export const AuthenticationForm = ({ tenantSettings }: AuthenticationFormProps) => {
  const [policy, setPolicy] = useState(tenantSettings.emailRegistrationPolicy);
  const [domains, setDomains] = useState(tenantSettings.allowedEmailDomains);
  const [newDomain, setNewDomain] = useState("");

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
        label="Politique d'inscription"
        nativeSelectProps={{ value: policy, onChange: e => setPolicy(e.target.value as typeof policy) }}
        options={policies}
      />

      {policy === "DOMAINS" && (
        <>
          <h3>Domaines autorisés</h3>
          <ul>
            {domains.map(domain => (
              <li key={domain} className={fr.cx("fr-mb-1w")}>
                {domain}
                <Button
                  size="small"
                  priority="secondary"
                  title="Retirer ce domaine"
                  onClick={() => removeDomain(domain)}
                >
                  ×
                </Button>
              </li>
            ))}
          </ul>
          <Input
            label="Ajouter un domaine"
            nativeInputProps={{
              value: newDomain,
              onChange: e => setNewDomain(e.target.value),
              autoComplete: "off",
              name: "new-domain",
            }}
          />
          <Button onClick={addDomain}>Ajouter</Button>
        </>
      )}

      <Button onClick={() => void handleSave()}>Sauvegarder</Button>
    </div>
  );
};
