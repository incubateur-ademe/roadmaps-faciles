"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import { type ToggleSwitchProps } from "@codegouvfr/react-dsfr/ToggleSwitch";
import { type ToggleSwitchGroupProps } from "@codegouvfr/react-dsfr/ToggleSwitchGroup";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import z from "zod";

import { ClientAnimate } from "@/components/utils/ClientAnimate";
import { config } from "@/config";
import { ToggleSwitchGroup } from "@/dsfr/client";
import { type TenantSettings } from "@/prisma/client";

import { deleteTenant, saveTenantSettings, updateTenantDomain } from "./actions";

const formSchema = z.object({
  id: z.number(),
  isPrivate: z.boolean(),
  allowAnonymousFeedback: z.boolean(),
  allowPostEdits: z.boolean(),
  showRoadmapInHeader: z.boolean(),
  allowVoting: z.boolean(),
  allowComments: z.boolean(),
  allowAnonymousVoting: z.boolean(),
  useBrowserLocale: z.boolean(),
});

type FormType = z.infer<typeof formSchema>;

type BooleanFormKeys = { [K in keyof FormType]: FormType[K] extends boolean ? K : never }[keyof FormType];

interface SectionToggle {
  disabled?: boolean;
  helperText: string;
  label: string;
  name: BooleanFormKeys;
}

interface Section {
  id: string;
  title: string;
  toggles: SectionToggle[];
}

const SECTIONS: Section[] = [
  {
    id: "privacy",
    title: "Confidentialité",
    toggles: [
      { name: "isPrivate", label: "Site privé", helperText: "Seuls les membres du tenant peuvent accéder au contenu" },
      {
        name: "allowAnonymousFeedback",
        label: "Feedback anonyme autorisé",
        helperText: "Les visiteurs non connectés peuvent soumettre du feedback",
      },
    ],
  },
  {
    id: "localization",
    title: "Localisation",
    toggles: [
      {
        name: "useBrowserLocale",
        label: "Utiliser la locale du navigateur",
        helperText: "Fonctionnalité à venir",
        disabled: true,
      },
    ],
  },
  {
    id: "moderation",
    title: "Modération",
    toggles: [
      {
        name: "allowPostEdits",
        label: "Modification des posts autorisée",
        helperText: "Les auteurs peuvent modifier leurs posts après publication",
      },
    ],
  },
  {
    id: "header",
    title: "En-tête",
    toggles: [
      {
        name: "showRoadmapInHeader",
        label: "Feuille de route dans l'en-tête",
        helperText: "Un lien vers la roadmap apparaît dans la navigation principale",
      },
    ],
  },
  {
    id: "visibility",
    title: "Visibilité",
    toggles: [
      { name: "allowVoting", label: "Vote autorisé", helperText: "Les utilisateurs peuvent voter sur les posts" },
      {
        name: "allowComments",
        label: "Commentaires autorisés",
        helperText: "Les utilisateurs peuvent commenter les posts",
      },
      {
        name: "allowAnonymousVoting",
        label: "Vote anonyme autorisé",
        helperText: "Les visiteurs non connectés peuvent voter sur les posts",
      },
    ],
  },
];

const domainSchema = z.object({
  settingsId: z.number(),
  subdomain: z
    .string()
    .min(1, "Le sous-domaine est requis.")
    .regex(/^[a-z0-9-]+$/, "Seuls les caractères minuscules, chiffres et tirets sont autorisés."),
  customDomain: z.string().nullable(),
});

type DomainFormType = z.infer<typeof domainSchema>;

interface GeneralFormProps {
  isOwner: boolean;
  tenantSettings: TenantSettings;
}

export const GeneralForm = ({ tenantSettings, isOwner }: GeneralFormProps) => {
  const [saveError, setSaveError] = useState<null | string>(null);
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    control,
    setValue,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<FormType>({
    mode: "onChange",
    resolver: standardSchemaResolver(formSchema),
    defaultValues: {
      id: tenantSettings.id,
      isPrivate: tenantSettings.isPrivate,
      allowAnonymousFeedback: tenantSettings.allowAnonymousFeedback,
      allowPostEdits: tenantSettings.allowPostEdits,
      showRoadmapInHeader: tenantSettings.showRoadmapInHeader,
      allowVoting: tenantSettings.allowVoting,
      allowComments: tenantSettings.allowComments,
      allowAnonymousVoting: tenantSettings.allowAnonymousVoting,
      useBrowserLocale: tenantSettings.useBrowserLocale,
    },
  });

  const watchedValues = useWatch({ control });

  async function onSubmit(data: FormType) {
    setSaveError(null);
    setPending(true);
    const response = await saveTenantSettings(data);
    if (!response.ok) {
      setSaveError(response.error);
    } else {
      reset(data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    }
    setPending(false);
  }

  return (
    <>
      <form noValidate onSubmit={e => void handleSubmit(onSubmit)(e)}>
        {SECTIONS.map(section => {
          const toggles = section.toggles.map<ToggleSwitchProps.Controlled>(item => ({
            id: item.name,
            label: item.label,
            helperText: item.helperText,
            checked: !!watchedValues[item.name],
            disabled: item.disabled ?? false,
            onChange: (checked: boolean) => setValue(item.name, checked, { shouldDirty: true }),
          }));

          return (
            <section id={section.id} key={section.id} className={fr.cx("fr-mb-4w")}>
              <h3 className={fr.cx("fr-h3")}>{section.title}</h3>
              <ToggleSwitchGroup toggles={toggles as ToggleSwitchGroupProps["toggles"]} />
            </section>
          );
        })}

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

      {isOwner && (
        <>
          <DomainSection tenantSettings={tenantSettings} />
          <DangerZone />
        </>
      )}
    </>
  );
};

const DomainSection = ({ tenantSettings }: { tenantSettings: TenantSettings }) => {
  const [error, setError] = useState<null | string>(null);
  const [domainPending, setDomainPending] = useState(false);
  const [domainSuccess, setDomainSuccess] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors: domainErrors, isDirty: isDomainDirty },
  } = useForm<DomainFormType>({
    resolver: standardSchemaResolver(domainSchema),
    defaultValues: {
      settingsId: tenantSettings.id,
      subdomain: tenantSettings.subdomain,
      customDomain: tenantSettings.customDomain ?? null,
    },
  });

  const subdomain = useWatch({ control, name: "subdomain" });

  const onDomainSubmit = async (data: DomainFormType) => {
    setError(null);
    setDomainPending(true);
    const result = await updateTenantDomain(data);
    if (result.ok) {
      reset(data);
      setDomainSuccess(true);
      setTimeout(() => setDomainSuccess(false), 5000);
    } else if (!result.ok) {
      setError(result.error);
    }
    setDomainPending(false);
  };

  return (
    <section id="domain" className={fr.cx("fr-mt-6w")}>
      <h3 className={fr.cx("fr-h3")}>Domaines</h3>
      <form noValidate onSubmit={e => void handleSubmit(onDomainSubmit)(e)}>
        <Input
          label="Sous-domaine"
          hintText={
            subdomain ? (
              <span>
                URL : <strong>{`${subdomain}.${config.rootDomain}`}</strong>
              </span>
            ) : undefined
          }
          nativeInputProps={{
            ...register("subdomain"),
          }}
          state={domainErrors.subdomain ? "error" : "default"}
          stateRelatedMessage={domainErrors.subdomain?.message}
        />

        <Input
          label="Domaine personnalisé"
          hintText="Laissez vide si vous n'utilisez pas de domaine personnalisé"
          nativeInputProps={{
            ...register("customDomain"),
            placeholder: "feedback.example.com",
          }}
          state={domainErrors.customDomain ? "error" : "default"}
          stateRelatedMessage={domainErrors.customDomain?.message}
        />

        <ClientAnimate>
          {error && <Alert className={fr.cx("fr-mb-2w")} severity="error" title="Erreur" description={error} />}
          {domainSuccess && (
            <Alert closable className={fr.cx("fr-mb-2w")} severity="success" title="Domaines mis à jour" />
          )}
        </ClientAnimate>

        <Button type="submit" disabled={domainPending || !isDomainDirty}>
          Mettre à jour les domaines
        </Button>
      </form>
    </section>
  );
};

const DangerZone = () => {
  const [error, setError] = useState<null | string>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce tenant ? Cette action est irréversible.")) return;
    setDeleting(true);
    setError(null);
    const result = await deleteTenant();
    if (result.ok) {
      window.location.href = config.host;
    } else if (!result.ok) {
      setError(result.error);
      setDeleting(false);
    }
  };

  return (
    <section id="danger" className={fr.cx("fr-mt-6w")}>
      <h3 className={fr.cx("fr-h3")}>Zone de danger</h3>
      {error && <Alert className={fr.cx("fr-mb-2w")} severity="error" title="Erreur" description={error} />}
      <Button priority="tertiary" disabled={deleting} onClick={() => void handleDelete()}>
        {deleting ? "Suppression…" : "Supprimer le tenant"}
      </Button>
    </section>
  );
};
