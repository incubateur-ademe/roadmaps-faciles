"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { config } from "@/config";
import { Alert, AlertDescription, AlertTitle } from "@/ui/shadcn/alert";
import { Button } from "@/ui/shadcn/button";
import { Input } from "@/ui/shadcn/input";
import { Label } from "@/ui/shadcn/label";

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
    <form noValidate onSubmit={e => void handleSubmit(onSubmit)(e)} className="mb-4">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>{t("createError")}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">{t("nameLabel2")}</Label>
          <Input id="name" placeholder="Mon espace" aria-invalid={!!errors.name} {...register("name")} />
          <p className="text-sm text-muted-foreground">{t("nameHint2")}</p>
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="subdomain">{t("subdomain")}</Label>
          <Input
            id="subdomain"
            placeholder={t("subdomainPlaceholder")}
            aria-invalid={!!errors.subdomain}
            {...register("subdomain")}
          />
          <p className="text-sm text-muted-foreground">
            {subdomain ? t("subdomainPreview", { url: `${subdomain}.${config.rootDomain}` }) : t("subdomainHint")}
          </p>
          {errors.subdomain && <p className="text-sm text-destructive">{errors.subdomain.message}</p>}
        </div>
      </div>

      <Button type="submit" disabled={pending} className="mt-6">
        {pending ? t("creating") : t("createTenant")}
      </Button>
    </form>
  );
};
