"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";
import { type ToggleSwitchProps } from "@codegouvfr/react-dsfr/ToggleSwitch";
import { type ToggleSwitchGroupProps } from "@codegouvfr/react-dsfr/ToggleSwitchGroup";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import z from "zod";

import { ClientAnimate } from "@/components/utils/ClientAnimate";
import { ToggleSwitchGroup } from "@/dsfr/client";
import { type TenantSettings } from "@/prisma/client";

import { saveTenantSettings } from "./actions";

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

interface GeneralFormProps {
  tenantSettings: TenantSettings;
}

export const GeneralForm = ({ tenantSettings }: GeneralFormProps) => {
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
          <Alert className={fr.cx("fr-mb-2w")} severity="error" title="Erreur de sauvegarde" description={saveError} />
        )}
        {success && <Alert closable className={fr.cx("fr-mb-2w")} severity="success" title="Sauvegarde réussie" />}
      </ClientAnimate>

      <Button type="submit" disabled={pending || !isDirty}>
        Sauvegarder
      </Button>
    </form>
  );
};
