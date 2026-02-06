"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import { useState } from "react";

import { createTenant } from "./actions";

export const NewTenantForm = () => {
  const [name, setName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [error, setError] = useState<null | string>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPending(true);

    const result = await createTenant({ name, subdomain });
    if (!result.ok) {
      setError(result.error);
      setPending(false);
    }
    // Si succès, redirect() est appelé dans l'action
  };

  return (
    <form onSubmit={e => void handleSubmit(e)}>
      {error && <Alert severity="error" title="Erreur" description={error} className={fr.cx("fr-mb-2w")} />}

      <Input
        label="Nom du tenant"
        nativeInputProps={{
          value: name,
          onChange: e => setName(e.target.value),
          required: true,
        }}
      />

      <Input
        label="Sous-domaine"
        hintText="Caractères autorisés : a-z, 0-9, -"
        nativeInputProps={{
          value: subdomain,
          onChange: e => setSubdomain(e.target.value.toLowerCase()),
          pattern: "[a-z0-9-]+",
          required: true,
        }}
      />

      <Button type="submit" disabled={!name || !subdomain || pending}>
        {pending ? "Création..." : "Créer le tenant"}
      </Button>
    </form>
  );
};
