"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import Select from "@codegouvfr/react-dsfr/Select";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import z from "zod";

import { ClientAnimate } from "@/components/utils/ClientAnimate";
import { config } from "@/config";
import { FormFieldset } from "@/dsfr";
import { type TenantWithSettings } from "@/lib/model/Tenant";
import { LOCALE_LABELS } from "@/utils/i18n";
import { localeSchema, subdomainSchema } from "@/utils/zod-schema";

import { saveTenant } from "./actions";
import style from "./TenantMain.module.scss";

interface FormProps {
  tenant: TenantWithSettings;
}

const formSchema = z.object({
  tenantId: z.number(),
  tenantName: z.string().nonempty("Le nom est requis"),
  tenantSubdomain: subdomainSchema.nonempty("Le sous-domaine est requis"),
  tenantCustomDomain: z.string(),
  locale: localeSchema,
});

type FormType = z.infer<typeof formSchema>;

export const Form = ({ tenant }: FormProps) => {
  const [saveError, setSaveError] = useState<null | string>(null);
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    control,
    formState: { errors, isValid, isDirty },
    handleSubmit,
    register,
    reset,
  } = useForm({
    mode: "onChange",
    resolver: standardSchemaResolver(formSchema),
    defaultValues: {
      tenantId: tenant.id,
      tenantName: tenant.settings.name,
      tenantSubdomain: tenant.settings.subdomain,
      tenantCustomDomain: tenant.settings.customDomain ?? "",
      locale: tenant.settings.locale,
    },
  });

  async function onSubmit(data: FormType) {
    setSaveError(null);
    setPending(true);
    const response = await saveTenant({
      tenant: {
        id: data.tenantId,
      },
      setting: {
        name: data.tenantName,
        subdomain: data.tenantSubdomain,
        customDomain: data.tenantCustomDomain,
        locale: data.locale,
      },
    });

    if (!response.ok) {
      setSaveError(response.error);
    } else {
      setSuccess(true);
      reset({
        tenantId: response.data.id,
        tenantName: response.data.settings.name,
        tenantSubdomain: response.data.settings.subdomain,
        tenantCustomDomain: response.data.settings.customDomain ?? "",
        locale: response.data.settings.locale,
      });
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    }
    setPending(false);
  }

  const tenantName = useWatch({ control, name: "tenantName" });

  return (
    <>
      <h1>
        Configuration <code>{tenantName}</code>
      </h1>
      <form noValidate onSubmit={e => void handleSubmit(onSubmit)(e)}>
        <input type="hidden" {...register("tenantId")} />
        <FormFieldset
          legend={<h3>Identité</h3>}
          elements={[
            <Input
              key="tenantName"
              label="Nom"
              hintText="Nom de l'organisation"
              state={errors.tenantName ? "error" : "default"}
              stateRelatedMessage={errors.tenantName?.message}
              nativeInputProps={{
                ...register("tenantName"),
              }}
            />,
            {
              key: "tenantSubdomain",
              children: (
                <Input
                  key="tenantSubdomain"
                  label="Sous-domaine"
                  hintText={"Le sous-domaine doit être unique et ne pas contenir d'espace"}
                  state={errors?.tenantSubdomain ? "error" : "default"}
                  stateRelatedMessage={errors?.tenantSubdomain?.message}
                  nativeInputProps={{
                    ...register("tenantSubdomain"),
                  }}
                  addon={
                    <Input
                      classes={{
                        nativeInputOrTextArea: style.rootDomainInput,
                      }}
                      disabled
                      hideLabel
                      label=""
                      nativeInputProps={{
                        placeholder: `.${config.rootDomain}`,
                        readOnly: true,
                      }}
                    />
                  }
                />
              ),
              inline: true,
            },
            {
              key: "tenantCustomDomain",
              children: (
                <Input
                  key="tenantCustomDomain"
                  label="Domaine personnalisé"
                  hintText="Ex: roadmap.mon-organisation.fr"
                  nativeInputProps={{
                    ...register("tenantCustomDomain"),
                  }}
                  state={errors?.tenantCustomDomain ? "error" : "default"}
                  stateRelatedMessage={errors?.tenantCustomDomain?.message}
                />
              ),
              inline: "grow",
            },
            {
              key: "locale",
              children: (
                <Select
                  label="Langue"
                  state={errors?.locale ? "error" : "default"}
                  stateRelatedMessage={errors?.locale?.message}
                  nativeSelectProps={{
                    ...register("locale"),
                  }}
                >
                  <option value="" disabled>
                    Sélectionner une langue
                  </option>
                  {Object.entries(LOCALE_LABELS).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </Select>
              ),
            },
          ]}
        />

        <ClientAnimate>
          {saveError && (
            <Alert
              className={fr.cx("fr-mb-2w")}
              severity="error"
              title="Erreur de validation"
              description={saveError}
            />
          )}
          {success && <Alert closable className={fr.cx("fr-mb-2w")} severity="success" title="Sauvegarde réussie" />}
        </ClientAnimate>
        <Button type="submit" disabled={pending || !isValid || !isDirty}>
          Sauvegarder
        </Button>
      </form>
    </>
  );
};
