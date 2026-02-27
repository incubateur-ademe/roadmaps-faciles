"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import z from "zod";

import { ClientAnimate } from "@/components/utils/ClientAnimate";
import { config } from "@/config";
import { type TenantWithSettings } from "@/lib/model/Tenant";
import { Alert, AlertDescription, AlertTitle } from "@/ui/shadcn/alert";
import { Button } from "@/ui/shadcn/button";
import { Input } from "@/ui/shadcn/input";
import { Label } from "@/ui/shadcn/label";
import { LOCALE_LABELS } from "@/utils/i18n";
import { createSubdomainSchema, localeSchema } from "@/utils/zod-schema";

import { saveTenant } from "./actions";

interface FormProps {
  tenant: TenantWithSettings;
}

export const Form = ({ tenant }: FormProps) => {
  const t = useTranslations("tenant");
  const tc = useTranslations("common");
  const tv = useTranslations("validation");

  const formSchema = z.object({
    tenantId: z.number(),
    tenantName: z.string().min(1, tv("nameRequired")),
    tenantSubdomain: createSubdomainSchema(tv),
    tenantCustomDomain: z.string(),
    locale: localeSchema,
  });

  type FormType = z.infer<typeof formSchema>;

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
      <h1 className="mb-6 text-3xl font-bold">
        {t.rich("configTitle", { name: tenantName, code: chunks => <code>{chunks}</code> })}
      </h1>
      <form noValidate onSubmit={e => void handleSubmit(onSubmit)(e)}>
        <input type="hidden" {...register("tenantId")} />

        <fieldset className="mb-8 space-y-6 border-0 p-0">
          <legend className="mb-4">
            <h3 className="text-xl font-semibold">{t("identityLegend")}</h3>
          </legend>

          <div className="space-y-2">
            <Label htmlFor="tenantName">{t("nameLabel")}</Label>
            <Input id="tenantName" aria-invalid={!!errors.tenantName} {...register("tenantName")} />
            <p className="text-sm text-muted-foreground">{t("nameHint")}</p>
            {errors.tenantName && <p className="text-sm text-destructive">{errors.tenantName.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tenantSubdomain">{t("subdomainLabel")}</Label>
            <div className="flex">
              <Input
                id="tenantSubdomain"
                className="rounded-r-none"
                aria-invalid={!!errors.tenantSubdomain}
                {...register("tenantSubdomain")}
              />
              <span className="flex items-center rounded-r-md border border-l-0 bg-muted px-3 text-sm text-muted-foreground">
                .{config.rootDomain}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{t("subdomainUniqueHint")}</p>
            {errors.tenantSubdomain && <p className="text-sm text-destructive">{errors.tenantSubdomain.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tenantCustomDomain">{t("customDomain")}</Label>
            <Input
              id="tenantCustomDomain"
              aria-invalid={!!errors.tenantCustomDomain}
              {...register("tenantCustomDomain")}
            />
            <p className="text-sm text-muted-foreground">{t("customDomainHint")}</p>
            {errors.tenantCustomDomain && (
              <p className="text-sm text-destructive">{errors.tenantCustomDomain.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="locale">{t("localeLabel")}</Label>
            <select
              id="locale"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              aria-invalid={!!errors.locale}
              {...register("locale")}
            >
              <option value="" disabled>
                {t("selectLocale")}
              </option>
              {Object.entries(LOCALE_LABELS).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
            {errors.locale && <p className="text-sm text-destructive">{errors.locale.message}</p>}
          </div>
        </fieldset>

        <ClientAnimate>
          {saveError && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>{t("validationError")}</AlertTitle>
              <AlertDescription>{saveError}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="mb-4">
              <AlertTitle>{t("saveSuccess")}</AlertTitle>
            </Alert>
          )}
        </ClientAnimate>
        <Button type="submit" disabled={pending || !isValid || !isDirty}>
          {tc("save")}
        </Button>
      </form>
    </>
  );
};
