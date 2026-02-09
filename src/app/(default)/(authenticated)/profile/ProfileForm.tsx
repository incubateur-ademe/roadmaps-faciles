"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import ToggleSwitch from "@codegouvfr/react-dsfr/ToggleSwitch";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import z from "zod";

import { ClientAnimate } from "@/components/utils/ClientAnimate";
import { FormFieldset } from "@/dsfr";

import { deleteAccount, switchToEmEmail, updateProfile } from "./actions";
import { DeleteAccountSection } from "./DeleteAccountSection";
import { EspaceMembreSection } from "./EspaceMembreSection";

const emptyToNull = z
  .string()
  .transform(v => (v.trim() === "" ? null : v))
  .nullable();

const formSchema = z.object({
  email: z.string().email("Adresse e-mail invalide").optional(),
  name: emptyToNull,
  notificationsEnabled: z.boolean(),
});

type FormType = z.infer<typeof formSchema>;

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
  const [saveError, setSaveError] = useState<null | string>(null);
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [switchPending, setSwitchPending] = useState(false);

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
    if (variant === "root") return "Géré par l'Espace Membre";
    if (!showEmEmailHint) return undefined;
    if (emailsAreSame) return "Identique à l'e-mail Espace Membre";
    return undefined;
  };

  return (
    <form noValidate onSubmit={e => void handleSubmit(onSubmit)(e)}>
      <FormFieldset
        legend="Identité"
        elements={[
          ...(variant === "tenant"
            ? [
                <Input
                  key="name"
                  label="Nom complet"
                  nativeInputProps={{ ...register("name") }}
                  state={errors.name ? "error" : "default"}
                  stateRelatedMessage={errors.name?.message}
                />,
              ]
            : []),
          variant === "tenant" ? (
            <div key="email">
              <Input
                label="Adresse e-mail"
                nativeInputProps={{ type: "email", ...register("email") }}
                state={errors.email ? "error" : "default"}
                stateRelatedMessage={errors.email?.message}
                hintText={getEmailHintText()}
              />
              {showEmEmailHint && !emailsAreSame && (
                <p className={fr.cx("fr-text--xs", "fr-mt-n2w", "fr-mb-2w")}>
                  E-mail Espace Membre : <strong>{user.emEmail}</strong>{" "}
                  <Button
                    type="button"
                    priority="tertiary no outline"
                    size="small"
                    disabled={switchPending}
                    onClick={() => void handleSwitchToEmEmail()}
                  >
                    Utiliser cet e-mail
                  </Button>
                </p>
              )}
            </div>
          ) : (
            <Input
              key="email"
              label="Adresse e-mail"
              disabled
              nativeInputProps={{ type: "email", value: user.email }}
              hintText="Géré par l'Espace Membre"
            />
          ),
        ]}
      />

      <FormFieldset
        legend="Notifications"
        elements={[
          <ToggleSwitch
            key="notificationsEnabled"
            label="Notifications par e-mail"
            helperText="Recevoir des notifications par e-mail pour les mises à jour"
            checked={notificationsEnabled}
            onChange={checked => setValue("notificationsEnabled", checked, { shouldDirty: true })}
          />,
        ]}
      />

      {variant === "tenant" && (
        <FormFieldset
          legend="Espace Membre"
          elements={[
            <EspaceMembreSection key="em-section" isBetaGouvMember={user.isBetaGouvMember} username={user.username} />,
          ]}
        />
      )}

      <ClientAnimate>
        {saveError && (
          <Alert className={fr.cx("fr-mb-2w")} severity="error" title="Erreur de sauvegarde" description={saveError} />
        )}
        {success && <Alert closable className={fr.cx("fr-mb-2w")} severity="success" title="Sauvegarde réussie" />}
      </ClientAnimate>

      <Button type="submit" disabled={pending || !isDirty}>
        Enregistrer les modifications
      </Button>

      <hr className={fr.cx("fr-hr", "fr-mt-4w")} />

      <FormFieldset
        legend="Zone de danger"
        elements={[<DeleteAccountSection key="delete-account" deleteAccount={deleteAccount} />]}
      />
    </form>
  );
};
