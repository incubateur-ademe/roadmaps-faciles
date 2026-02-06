"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
  collapsedBoards: z.boolean(),
  showVoteCount: z.boolean(),
  showVoteButton: z.boolean(),
  allowVoting: z.boolean(),
  allowComments: z.boolean(),
  allowAnonymousVoting: z.boolean(),
  useBrowserLocale: z.boolean(),
});

type FormType = z.infer<typeof formSchema>;

const SECTIONS = [
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
        helperText: "La langue est automatiquement détectée selon les préférences du navigateur",
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
      {
        name: "collapsedBoards",
        label: "Boards réduits par défaut",
        helperText: "Les boards sont affichés sous forme de liste compacte sur la page d'accueil",
      },
    ],
  },
  {
    id: "visibility",
    title: "Visibilité",
    toggles: [
      { name: "allowVoting", label: "Vote autorisé", helperText: "Les utilisateurs peuvent voter sur les posts" },
      {
        name: "showVoteButton",
        label: "Bouton vote affiché",
        helperText: "Le bouton vote est visible sur chaque post",
      },
      {
        name: "showVoteCount",
        label: "Nombre de votes affiché",
        helperText: "Le compteur de votes est visible sur chaque post",
      },
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
] as const;

type _ToggleName = (typeof SECTIONS)[number]["toggles"][number]["name"];

interface GeneralFormProps {
  tenantSettings: TenantSettings;
}

export const GeneralForm = ({ tenantSettings }: GeneralFormProps) => {
  const [saveError, setSaveError] = useState<null | string>(null);
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    watch,
    setValue,
    handleSubmit,
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
      collapsedBoards: tenantSettings.collapsedBoards,
      showVoteCount: tenantSettings.showVoteCount,
      showVoteButton: tenantSettings.showVoteButton,
      allowVoting: tenantSettings.allowVoting,
      allowComments: tenantSettings.allowComments,
      allowAnonymousVoting: tenantSettings.allowAnonymousVoting,
      useBrowserLocale: tenantSettings.useBrowserLocale,
    },
  });

  async function onSubmit(data: FormType) {
    setSaveError(null);
    setPending(true);
    const response = await saveTenantSettings(data);
    if (!response.ok) {
      setSaveError(response.error);
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    }
    setPending(false);
  }

  return (
    <form noValidate onSubmit={e => void handleSubmit(onSubmit)(e)}>
      {SECTIONS.map(section => {
        const toggles = section.toggles.map(item => ({
          id: item.name,
          label: item.label,
          helperText: item.helperText,
          checked: watch(item.name),
          onChange: (checked: boolean) => setValue(item.name, checked, { shouldDirty: true }),
        }));

        return (
          <section id={section.id} key={section.id} className={fr.cx("fr-mb-4w")}>
            <h3 className={fr.cx("fr-h3")}>{section.title}</h3>
            <ToggleSwitchGroup toggles={toggles as [(typeof toggles)[0], ...typeof toggles]} />
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
