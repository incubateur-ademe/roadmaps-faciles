"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import Badge from "@codegouvfr/react-dsfr/Badge";
import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import { type ToggleSwitchProps } from "@codegouvfr/react-dsfr/ToggleSwitch";
import { type ToggleSwitchGroupProps } from "@codegouvfr/react-dsfr/ToggleSwitchGroup";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import z from "zod";

import { ClientAnimate } from "@/components/utils/ClientAnimate";
import { config } from "@/config";
import { ToggleSwitchGroup } from "@/dsfr/client";
import { type DNSStatus } from "@/lib/domain-provider/dns";
import { type TenantSettings } from "@/prisma/client";
import { WELCOME_DATA_PREVIEW } from "@/workflows/welcomeDataPreview";

import {
  checkDNS,
  deleteTenant,
  purgeTenantData,
  saveTenantSettings,
  seedDefaultData,
  updateTenantDomain,
} from "./actions";

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
  customDomain: z
    .string()
    .transform(v => (v === "" ? null : v))
    .nullable(),
});

type DomainFormType = z.infer<typeof domainSchema>;

interface GeneralFormProps {
  hasData: boolean;
  isOwner: boolean;
  tenantSettings: TenantSettings;
}

export const GeneralForm = ({ tenantSettings, isOwner, hasData }: GeneralFormProps) => {
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
      <SeedSection hasData={hasData} />
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

const SeedSection = ({ hasData }: { hasData: boolean }) => {
  const [seeding, setSeeding] = useState(false);
  const [seedError, setSeedError] = useState<null | string>(null);
  const [seedSuccess, setSeedSuccess] = useState(false);

  const handleSeed = async () => {
    setSeeding(true);
    setSeedError(null);
    const result = await seedDefaultData();
    if (result.ok) {
      setSeedSuccess(true);
      window.location.reload();
    } else if (!result.ok) {
      setSeedError(result.error);
      setSeeding(false);
    }
  };

  if (hasData && !seedSuccess) {
    return null;
  }

  return (
    <section id="seed" className={fr.cx("fr-mb-6w")}>
      <h3 className={fr.cx("fr-h3")}>Données initiales</h3>
      {seedSuccess ? (
        <Alert severity="success" title="Données initialisées avec succès" className={fr.cx("fr-mb-2w")} />
      ) : (
        <>
          <p className={fr.cx("fr-mb-2w")}>
            Votre espace est vide. Vous pouvez initialiser des données par défaut pour démarrer rapidement.
          </p>
          <div className={fr.cx("fr-mb-2w")}>
            <p className={fr.cx("fr-text--bold", "fr-mb-1w")}>Ce qui sera créé :</p>
            <ul className={fr.cx("fr-mb-1w")}>
              {WELCOME_DATA_PREVIEW.boards.map(board => (
                <li key={board.name}>
                  Tableau <strong>{board.name}</strong> — {board.description}
                </li>
              ))}
            </ul>
            <ul className={fr.cx("fr-mb-1w")}>
              {WELCOME_DATA_PREVIEW.statuses.map(status => (
                <li key={status.name}>
                  Statut <strong>{status.name}</strong>
                </li>
              ))}
            </ul>
            <p className={fr.cx("fr-text--sm")}>{WELCOME_DATA_PREVIEW.extras}</p>
          </div>
          <ClientAnimate>
            {seedError && (
              <Alert className={fr.cx("fr-mb-2w")} severity="error" title="Erreur" description={seedError} />
            )}
          </ClientAnimate>
          <Button disabled={seeding} onClick={() => void handleSeed()}>
            {seeding ? "Initialisation…" : "Initialiser les données par défaut"}
          </Button>
        </>
      )}
    </section>
  );
};

const DNS_STATUS_CONFIG: Record<DNSStatus, { label: string; severity: "error" | "info" | "success" | "warning" }> = {
  valid: { severity: "success", label: "DNS valide" },
  invalid: { severity: "warning", label: "DNS non configuré" },
  error: { severity: "error", label: "Erreur de vérification DNS" },
};

const DNS_POLL_INTERVAL = 30_000;

const DomainSection = ({ tenantSettings }: { tenantSettings: TenantSettings }) => {
  const [error, setError] = useState<null | string>(null);
  const [domainPending, setDomainPending] = useState(false);
  const [domainSuccess, setDomainSuccess] = useState(false);

  const [dnsStatus, setDnsStatus] = useState<DNSStatus | null>(null);
  const [dnsExpected, setDnsExpected] = useState<null | string>(null);
  const [dnsChecking, setDnsChecking] = useState(false);
  const dnsStatusRef = useRef(dnsStatus);
  useEffect(() => {
    dnsStatusRef.current = dnsStatus;
  }, [dnsStatus]);

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

  const [savedCustomDomain, setSavedCustomDomain] = useState(tenantSettings.customDomain);

  const runDNSCheck = useCallback(async () => {
    if (!savedCustomDomain) return;
    setDnsChecking(true);
    const result = await checkDNS(savedCustomDomain);
    if (result.ok) {
      setDnsStatus(result.data.status);
      setDnsExpected(result.data.expected);
    } else {
      setDnsStatus("error");
    }
    setDnsChecking(false);
  }, [savedCustomDomain]);

  // Check initial + polling auto tant que le DNS n'est pas "valid"
  useEffect(() => {
    if (!savedCustomDomain) return;

    let cancelled = false;

    const doCheck = async () => {
      if (cancelled) return;
      setDnsChecking(true);
      const result = await checkDNS(savedCustomDomain);
      if (cancelled) return;
      if (result.ok) {
        setDnsStatus(result.data.status);
        setDnsExpected(result.data.expected);
      } else {
        setDnsStatus("error");
      }
      setDnsChecking(false);
    };

    // Check immédiat
    const initialTimeout = setTimeout(() => void doCheck(), 0);

    // Polling — s'arrête quand le DNS est valid
    const interval = setInterval(() => {
      if (dnsStatusRef.current === "valid") return;
      void doCheck();
    }, DNS_POLL_INTERVAL);

    return () => {
      cancelled = true;
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [savedCustomDomain]);

  const onDomainSubmit = async (data: DomainFormType) => {
    setError(null);
    setDomainPending(true);
    const result = await updateTenantDomain(data);
    if (result.ok) {
      reset(data);
      setSavedCustomDomain(data.customDomain);
      setDnsStatus(null);
      setDomainSuccess(true);
      setTimeout(() => setDomainSuccess(false), 5000);
    } else if (!result.ok) {
      setError(result.error);
    }
    setDomainPending(false);
  };

  const showDnsStatus = savedCustomDomain && !isDomainDirty && dnsStatus;

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

        {showDnsStatus && (
          <div className={fr.cx("fr-mb-2w")}>
            <div className={cx("flex items-center gap-2")}>
              <Badge severity={DNS_STATUS_CONFIG[dnsStatus].severity}>{DNS_STATUS_CONFIG[dnsStatus].label}</Badge>
              <Button
                type="button"
                priority="tertiary no outline"
                size="small"
                disabled={dnsChecking}
                iconId="ri-refresh-line"
                onClick={() => void runDNSCheck()}
              >
                {dnsChecking ? "Vérification…" : "Vérifier DNS"}
              </Button>
            </div>
            {dnsStatus === "invalid" && dnsExpected && (
              <div className={fr.cx("fr-hint-text", "fr-mt-1v")}>
                <p>
                  Le domaine <code>{savedCustomDomain}</code> existe mais ne pointe pas vers notre serveur. Modifiez
                  votre enregistrement DNS :
                </p>
                <p className={fr.cx("fr-mt-1v")}>
                  <code>
                    {savedCustomDomain} CNAME {dnsExpected}
                  </code>
                </p>
              </div>
            )}
            {dnsStatus === "error" && dnsExpected && (
              <div className={fr.cx("fr-hint-text", "fr-mt-1v")}>
                <p>
                  Impossible de résoudre le domaine <code>{savedCustomDomain}</code>. Ajoutez l'enregistrement suivant
                  dans votre zone DNS :
                </p>
                <p className={fr.cx("fr-mt-1v")}>
                  <code>
                    {savedCustomDomain} CNAME {dnsExpected}
                  </code>
                </p>
                <p className={fr.cx("fr-mt-1v")}>
                  Ou, si votre fournisseur DNS ne supporte pas les CNAME, un enregistrement <strong>A</strong> pointant
                  vers l'IP de <code>{dnsExpected}</code>.
                </p>
              </div>
            )}
            {dnsStatus === "valid" && (
              <p className={fr.cx("fr-hint-text", "fr-mt-1v")}>
                Le domaine <code>{savedCustomDomain}</code> pointe correctement vers <code>{dnsExpected}</code>.
              </p>
            )}
          </div>
        )}

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
  const [purging, setPurging] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handlePurge = async () => {
    if (
      !confirm(
        "Êtes-vous sûr de vouloir supprimer toutes les données de ce tenant (tableaux, posts, statuts, commentaires…) ? Cette action est irréversible.",
      )
    )
      return;
    setPurging(true);
    setError(null);
    const result = await purgeTenantData();
    if (result.ok) {
      window.location.reload();
    } else if (!result.ok) {
      setError(result.error);
      setPurging(false);
    }
  };

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
      <div className={cx("flex gap-4")}>
        <Button priority="tertiary" disabled={purging || deleting} onClick={() => void handlePurge()}>
          {purging ? "Purge en cours…" : "Réinitialiser les données"}
        </Button>
        <Button priority="tertiary" disabled={purging || deleting} onClick={() => void handleDelete()}>
          {deleting ? "Suppression…" : "Supprimer le tenant"}
        </Button>
      </div>
    </section>
  );
};
