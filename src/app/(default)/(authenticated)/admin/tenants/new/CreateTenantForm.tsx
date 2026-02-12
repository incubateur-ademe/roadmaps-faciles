"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import Tag from "@codegouvfr/react-dsfr/Tag";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { config } from "@/config";
import { Grid, GridCol } from "@/dsfr";
import { EmailAutocomplete } from "@/dsfr/base/EmailAutocomplete";
import { FormFieldset } from "@/dsfr/base/FormFieldset";

import { searchUsers } from "../../actions";
import { createTenant } from "./actions";

export const CreateTenantForm = () => {
  const router = useRouter();
  const tv = useTranslations("validation");
  const [error, setError] = useState<null | string>(null);
  const [pending, setPending] = useState(false);
  const [ownerEmails, setOwnerEmails] = useState<string[]>([]);
  const [emailError, setEmailError] = useState<null | string>(null);

  const formSchema = z.object({
    name: z.string().min(1, tv("nameRequired")),
    subdomain: z
      .string()
      .min(1, tv("subdomainRequired"))
      .regex(/^[a-z0-9-]+$/, tv("subdomainRegex")),
  });

  type FormType = z.infer<typeof formSchema>;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormType>({
    resolver: standardSchemaResolver(formSchema),
    defaultValues: {
      name: "",
      subdomain: "",
    },
  });

  const subdomain = useWatch({ control, name: "subdomain" });

  const handleAddEmail = (email: string) => {
    setEmailError(null);
    if (ownerEmails.includes(email)) {
      setEmailError("Cet email est déjà ajouté.");
      return;
    }
    setOwnerEmails(prev => [...prev, email]);
  };

  const handleRemoveEmail = (email: string) => {
    setOwnerEmails(prev => prev.filter(e => e !== email));
  };

  const onSubmit = async (data: FormType) => {
    if (ownerEmails.length === 0) {
      setEmailError("Au moins un email de propriétaire est requis.");
      return;
    }

    setPending(true);
    setError(null);

    const result = await createTenant({
      name: data.name,
      subdomain: data.subdomain,
      ownerEmails,
    });

    if (result.ok) {
      router.push("/admin/tenants");
    } else if (!result.ok) {
      setError(result.error);
    }

    setPending(false);
  };

  return (
    <form noValidate onSubmit={e => void handleSubmit(onSubmit)(e)}>
      {error && (
        <Alert
          className={fr.cx("fr-mb-2w")}
          severity="error"
          title="Erreur"
          description={error}
          closable
          onClose={() => setError(null)}
        />
      )}

      <Grid haveGutters>
        <GridCol md={6}>
          <Input
            label="Nom du tenant"
            hintText="Le nom de votre espace. Il peut être modifié ultérieurement."
            nativeInputProps={{
              ...register("name"),
              placeholder: "Mon espace",
            }}
            state={errors.name ? "error" : "default"}
            stateRelatedMessage={errors.name?.message}
          />
        </GridCol>
        <GridCol md={6}>
          <Input
            label="Sous-domaine"
            hintText={
              subdomain ? (
                <span>
                  URL : <strong>{`${subdomain}.${config.rootDomain}`}</strong>
                </span>
              ) : (
                "Choisissez un sous-domaine pour votre espace"
              )
            }
            nativeInputProps={{
              ...register("subdomain"),
              placeholder: "mon-espace",
            }}
            state={errors.subdomain ? "error" : "default"}
            stateRelatedMessage={errors.subdomain?.message}
          />
        </GridCol>
      </Grid>

      <FormFieldset
        className={fr.cx("fr-my-2w")}
        legend="Emails des propriétaires"
        error={emailError}
        elements={[
          {
            children: (
              <EmailAutocomplete
                label="Ajouter un propriétaire"
                searchAction={searchUsers}
                onSelectAction={handleAddEmail}
              />
            ),
          },
          ...(ownerEmails.length > 0
            ? [
                {
                  children: (
                    <ul className="fr-tags-group">
                      {ownerEmails.map(email => (
                        <li key={email}>
                          <Tag
                            dismissible
                            as="button"
                            nativeButtonProps={{ type: "button" }}
                            onClick={() => handleRemoveEmail(email)}
                          >
                            {email}
                          </Tag>
                        </li>
                      ))}
                    </ul>
                  ),
                },
              ]
            : []),
        ]}
      />

      <Button type="submit" disabled={pending}>
        {pending ? "Création…" : "Créer le tenant"}
      </Button>
    </form>
  );
};
