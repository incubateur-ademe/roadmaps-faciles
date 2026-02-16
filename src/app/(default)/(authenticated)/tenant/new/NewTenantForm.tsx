"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { config } from "@/config";
import { Grid, GridCol } from "@/dsfr";

import { createTenantForUser } from "./actions";

export const NewTenantForm = () => {
  const t = useTranslations("tenant");
  const tv = useTranslations("validation");
  const [error, setError] = useState<null | string>(null);
  const [pending, setPending] = useState(false);

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

  const onSubmit = async (data: FormType) => {
    setPending(true);
    setError(null);

    const result = await createTenantForUser(data);
    if (!result.ok) {
      setError(result.error);
      setPending(false);
    }
  };

  return (
    <form noValidate onSubmit={e => void handleSubmit(onSubmit)(e)}>
      {error && (
        <Alert
          className={fr.cx("fr-mb-2w")}
          severity="error"
          title={t("createError")}
          description={error}
          closable
          onClose={() => setError(null)}
        />
      )}

      <Grid haveGutters>
        <GridCol md={6}>
          <Input
            label={t("nameLabel2")}
            hintText={t("nameHint2")}
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
            label={t("subdomain")}
            hintText={
              subdomain ? (
                <span>{t("subdomainPreview", { url: `${subdomain}.${config.rootDomain}` })}</span>
              ) : (
                t("subdomainHint")
              )
            }
            nativeInputProps={{
              ...register("subdomain"),
              placeholder: t("subdomainPlaceholder"),
            }}
            state={errors.subdomain ? "error" : "default"}
            stateRelatedMessage={errors.subdomain?.message}
          />
        </GridCol>
      </Grid>

      <Button type="submit" disabled={pending}>
        {pending ? t("creating") : t("createTenant")}
      </Button>
    </form>
  );
};
