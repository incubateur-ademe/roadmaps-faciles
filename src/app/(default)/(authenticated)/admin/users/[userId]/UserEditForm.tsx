"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import { Select } from "@codegouvfr/react-dsfr/SelectNext";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

import { ClientAnimate } from "@/components/utils/ClientAnimate";
import { FormFieldset } from "@/dsfr/base/FormFieldset";
import { type User } from "@/prisma/client";
import { UserRole, UserStatus } from "@/prisma/enums";

import { updateUser } from "./actions";

const ASSIGNABLE_ROLES = [UserRole.USER, UserRole.MODERATOR, UserRole.ADMIN] as const;
const ASSIGNABLE_STATUSES = [UserStatus.ACTIVE, UserStatus.BLOCKED] as const;

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Administrateur",
  MODERATOR: "Modérateur",
  USER: "Utilisateur",
};

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Actif",
  BLOCKED: "Bloqué",
};

const emptyToNull = z
  .string()
  .transform(v => (v.trim() === "" ? null : v))
  .nullable();

const formSchema = z.object({
  name: emptyToNull,
  email: z.email(),
  username: emptyToNull,
  role: z.enum(ASSIGNABLE_ROLES),
  status: z.enum(ASSIGNABLE_STATUSES),
});

type FormType = z.infer<typeof formSchema>;

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" });

interface UserEditFormProps {
  user: User;
}

export const UserEditForm = ({ user }: UserEditFormProps) => {
  const [saveError, setSaveError] = useState<null | string>(null);
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty, errors },
  } = useForm<FormType>({
    mode: "onChange",
    resolver: standardSchemaResolver(formSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role as FormType["role"],
      status: user.status as FormType["status"],
    },
  });

  const onSubmit = async (data: FormType) => {
    setSaveError(null);
    setPending(true);
    setSuccess(false);

    const result = await updateUser({ userId: user.id, data });
    if (!result.ok) {
      setSaveError(result.error);
    } else {
      reset(data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    }
    setPending(false);
  };

  return (
    <>
      <div className={fr.cx("fr-mb-4w")}>
        <h2>Informations</h2>
        <dl>
          <div className={fr.cx("fr-mb-1v")}>
            <dt className="font-bold inline">ID :</dt> <dd className="inline">{user.id}</dd>
          </div>
          <div className={fr.cx("fr-mb-1v")}>
            <dt className="font-bold inline">Inscrit le :</dt>{" "}
            <dd className="inline">{dateFormatter.format(new Date(user.createdAt))}</dd>
          </div>
          <div className={fr.cx("fr-mb-1v")}>
            <dt className="font-bold inline">Dernière connexion :</dt>{" "}
            <dd className="inline">{user.lastSignInAt ? dateFormatter.format(new Date(user.lastSignInAt)) : "—"}</dd>
          </div>
          <div className={fr.cx("fr-mb-1v")}>
            <dt className="font-bold inline">Nombre de connexions :</dt> <dd className="inline">{user.signInCount}</dd>
          </div>
        </dl>
      </div>

      <form noValidate onSubmit={e => void handleSubmit(onSubmit)(e)}>
        <h2>Édition</h2>
        <FormFieldset
          legend="Identité"
          elements={[
            <Input
              key="name"
              label="Nom"
              nativeInputProps={{ ...register("name") }}
              state={errors.name ? "error" : "default"}
              stateRelatedMessage={errors.name?.message}
            />,
            <Input
              key="email"
              label="Email"
              nativeInputProps={{ type: "email", ...register("email") }}
              state={errors.email ? "error" : "default"}
              stateRelatedMessage={errors.email?.message}
            />,
            <Input
              key="username"
              label="Nom d'utilisateur"
              nativeInputProps={{ ...register("username") }}
              state={errors.username ? "error" : "default"}
              stateRelatedMessage={errors.username?.message}
            />,
          ]}
        />
        <FormFieldset
          legend="Rôle et statut"
          elements={[
            <Select
              key="role"
              label="Rôle"
              options={ASSIGNABLE_ROLES.map(role => ({ value: role, label: ROLE_LABELS[role] }))}
              nativeSelectProps={{ ...register("role") }}
            />,
            <Select
              key="status"
              label="Statut"
              options={ASSIGNABLE_STATUSES.map(status => ({ value: status, label: STATUS_LABELS[status] }))}
              nativeSelectProps={{ ...register("status") }}
            />,
          ]}
        />

        <ClientAnimate>
          {saveError && (
            <Alert
              className={fr.cx("fr-mb-2w")}
              severity="error"
              title="Erreur de sauvegarde"
              description={saveError}
            />
          )}
          {success && <Alert closable className={fr.cx("fr-mb-2w")} severity="success" title="Sauvegarde réussie" />}
        </ClientAnimate>

        <Button type="submit" disabled={pending || !isDirty}>
          Sauvegarder
        </Button>
      </form>
    </>
  );
};
