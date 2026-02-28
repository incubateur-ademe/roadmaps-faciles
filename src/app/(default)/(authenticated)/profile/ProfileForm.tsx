"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import z from "zod";

import { ClientAnimate } from "@/components/utils/ClientAnimate";
import { Alert, AlertDescription, AlertTitle } from "@/ui/shadcn/alert";
import { Button } from "@/ui/shadcn/button";
import { Input } from "@/ui/shadcn/input";
import { Label } from "@/ui/shadcn/label";
import { Switch } from "@/ui/shadcn/switch";

import { deleteAccount, switchToEmEmail, updateProfile } from "./actions";
import { DeleteAccountSection } from "./DeleteAccountSection";
import { EspaceMembreSection } from "./EspaceMembreSection";

const emptyToNull = z
  .string()
  .transform(v => (v.trim() === "" ? null : v))
  .nullable();

interface FormType {
  email?: string;
  name: null | string;
  notificationsEnabled: boolean;
}

export interface ProfileFormUser {
  email: string;
  emEmail: null | string;
  isBetaGouvMember: boolean;
  name: null | string;
  notificationsEnabled: boolean;
  username: null | string;
}

interface ProfileFormProps {
  user: ProfileFormUser;
  variant: "root" | "tenant";
}

export const ProfileForm = ({ user, variant }: ProfileFormProps) => {
  const t = useTranslations("profile");
  const tc = useTranslations("common");
  const te = useTranslations("errors");
  const tv = useTranslations("validation");
  const [saveError, setSaveError] = useState<null | string>(null);
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [switchPending, setSwitchPending] = useState(false);

  const formSchema = z.object({
    email: z.string().email(tv("invalidEmail")).optional(),
    name: emptyToNull,
    notificationsEnabled: z.boolean(),
  });

  const {
    register,
    control,
    setValue,
    handleSubmit,
    reset,
    formState: { isDirty, errors },
  } = useForm<FormType>({
    mode: "onChange",
    resolver: standardSchemaResolver(formSchema),
    defaultValues: {
      email: user.email,
      name: user.name,
      notificationsEnabled: user.notificationsEnabled,
    },
  });

  const notificationsEnabled = useWatch({ control, name: "notificationsEnabled" });

  const onSubmit = async (data: FormType) => {
    setSaveError(null);
    setPending(true);
    setSuccess(false);

    const result = await updateProfile(
      variant === "tenant" ? data : { name: data.name, notificationsEnabled: data.notificationsEnabled },
    );
    if (!result.ok) {
      setSaveError(result.error);
    } else {
      reset(data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    }
    setPending(false);
  };

  const handleSwitchToEmEmail = async () => {
    setSwitchPending(true);
    const result = await switchToEmEmail();
    if (!result.ok) {
      setSaveError(result.error);
    }
    setSwitchPending(false);
  };

  const emailsAreSame = user.emEmail != null && user.email === user.emEmail;
  const showEmEmailHint = variant === "tenant" && user.isBetaGouvMember && user.emEmail != null;

  const getEmailHintText = () => {
    if (variant === "root") return t("managedByEm");
    if (!showEmEmailHint) return undefined;
    if (emailsAreSame) return t("sameAsEmEmail");
    return undefined;
  };

  return (
    <form noValidate onSubmit={e => void handleSubmit(onSubmit)(e)}>
      <fieldset className="mb-8 space-y-6 border-0 p-0">
        <legend className="mb-4">
          <h3 className="text-lg font-semibold">{t("identity")}</h3>
        </legend>

        {variant === "tenant" && (
          <div className="space-y-2">
            <Label htmlFor="name">{t("fullName")}</Label>
            <Input id="name" aria-invalid={!!errors.name} {...register("name")} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">{t("emailAddress")}</Label>
          {variant === "tenant" ? (
            <>
              <Input id="email" type="email" aria-invalid={!!errors.email} {...register("email")} />
              {getEmailHintText() && <p className="text-sm text-muted-foreground">{getEmailHintText()}</p>}
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              {showEmEmailHint && !emailsAreSame && (
                <p className="text-xs text-muted-foreground">
                  {t("emEmailPrefix")} <strong>{user.emEmail}</strong>{" "}
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="h-auto p-0"
                    disabled={switchPending}
                    onClick={() => void handleSwitchToEmEmail()}
                  >
                    {t("useThisEmail")}
                  </Button>
                </p>
              )}
            </>
          ) : (
            <>
              <Input id="email" type="email" disabled value={user.email} />
              <p className="text-sm text-muted-foreground">{t("managedByEm")}</p>
            </>
          )}
        </div>
      </fieldset>

      <fieldset className="mb-8 space-y-4 border-0 p-0">
        <legend className="mb-4">
          <h3 className="text-lg font-semibold">{t("notifications")}</h3>
        </legend>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">{t("emailNotifications")}</p>
            <p className="text-sm text-muted-foreground">{t("emailNotificationsHelper")}</p>
          </div>
          <Switch
            checked={notificationsEnabled}
            onCheckedChange={checked => setValue("notificationsEnabled", checked, { shouldDirty: true })}
          />
        </div>
      </fieldset>

      {variant === "tenant" && (
        <fieldset className="mb-8 space-y-4 border-0 p-0">
          <legend className="mb-4">
            <h3 className="text-lg font-semibold">{t("espaceMembre")}</h3>
          </legend>
          <EspaceMembreSection isBetaGouvMember={user.isBetaGouvMember} username={user.username} />
        </fieldset>
      )}

      <ClientAnimate>
        {saveError && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>{te("saveError")}</AlertTitle>
            <AlertDescription>{saveError}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="mb-4">
            <AlertTitle>{tc("success")}</AlertTitle>
          </Alert>
        )}
      </ClientAnimate>

      <Button type="submit" disabled={pending || !isDirty}>
        {t("saveChanges")}
      </Button>

      <hr className="my-8" />

      <fieldset className="space-y-4 border-0 p-0">
        <legend className="mb-4">
          <h3 className="text-lg font-semibold">{t("dangerZone")}</h3>
        </legend>
        <DeleteAccountSection deleteAccount={deleteAccount} />
      </fieldset>
    </form>
  );
};
