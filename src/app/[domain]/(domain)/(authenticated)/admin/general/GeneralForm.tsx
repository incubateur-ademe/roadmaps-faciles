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
import { useTranslations } from "next-intl";
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
  allowPostDeletion: z.boolean(),
  showRoadmapInHeader: z.boolean(),
  allowVoting: z.boolean(),
  allowComments: z.boolean(),
  allowAnonymousVoting: z.boolean(),
  requirePostApproval: z.boolean(),
  allowEmbedding: z.boolean(),
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

const getSections = (t: ReturnType<typeof useTranslations<"domainAdmin.general">>): Section[] => [
  {
    id: "privacy",
    title: t("privacy"),
    toggles: [
      { name: "isPrivate", label: t("isPrivate"), helperText: t("isPrivateHelper") },
      {
        name: "allowAnonymousFeedback",
        label: t("allowAnonymousFeedback"),
        helperText: t("allowAnonymousFeedbackHelper"),
      },
    ],
  },
  {
    id: "moderation",
    title: t("moderationTitle"),
    toggles: [
      {
        name: "allowPostEdits",
        label: t("allowPostEdits"),
        helperText: t("allowPostEditsHelper"),
      },
      {
        name: "allowPostDeletion",
        label: t("allowPostDeletion"),
        helperText: t("allowPostDeletionHelper"),
      },
      {
        name: "requirePostApproval",
        label: t("requirePostApproval"),
        helperText: t("requirePostApprovalHelper"),
      },
    ],
  },
  {
    id: "header",
    title: t("headerTitle"),
    toggles: [
      {
        name: "showRoadmapInHeader",
        label: t("showRoadmapInHeader"),
        helperText: t("showRoadmapInHeaderHelper"),
      },
    ],
  },
  {
    id: "visibility",
    title: t("visibilityTitle"),
    toggles: [
      { name: "allowVoting", label: t("allowVoting"), helperText: t("allowVotingHelper") },
      {
        name: "allowComments",
        label: t("allowComments"),
        helperText: t("allowCommentsHelper"),
      },
      {
        name: "allowAnonymousVoting",
        label: t("allowAnonymousVoting"),
        helperText: t("allowAnonymousVotingHelper"),
      },
    ],
  },
  {
    id: "embedding",
    title: t("embeddingTitle"),
    toggles: [
      {
        name: "allowEmbedding",
        label: t("allowEmbedding"),
        helperText: t("allowEmbeddingHelper"),
      },
    ],
  },
];

type DomainFormType = {
  customDomain: null | string;
  settingsId: number;
  subdomain: string;
};

interface GeneralFormProps {
  hasData: boolean;
  isOwner: boolean;
  tenantSettings: TenantSettings;
}

export const GeneralForm = ({ tenantSettings, isOwner, hasData }: GeneralFormProps) => {
  const t = useTranslations("domainAdmin.general");
  const tc = useTranslations("common");
  const te = useTranslations("errors");
  const SECTIONS = getSections(t);

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
      allowPostDeletion: tenantSettings.allowPostDeletion,
      showRoadmapInHeader: tenantSettings.showRoadmapInHeader,
      allowVoting: tenantSettings.allowVoting,
      allowComments: tenantSettings.allowComments,
      allowAnonymousVoting: tenantSettings.allowAnonymousVoting,
      requirePostApproval: tenantSettings.requirePostApproval,
      allowEmbedding: tenantSettings.allowEmbedding,
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

        {watchedValues.allowEmbedding && watchedValues.isPrivate && (
          <Alert
            className={fr.cx("fr-mb-2w")}
            severity="warning"
            small
            description={t("allowEmbeddingPrivateWarning")}
          />
        )}

        <ClientAnimate>
          {saveError && (
            <Alert className={fr.cx("fr-mb-2w")} severity="error" title={te("saveError")} description={saveError} />
          )}
          {success && <Alert closable className={fr.cx("fr-mb-2w")} severity="success" title={t("saveSuccess")} />}
        </ClientAnimate>

        <Button type="submit" disabled={pending || !isDirty}>
          {tc("save")}
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
  const t = useTranslations("domainAdmin.general");
  const tc = useTranslations("common");
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
      <h3 className={fr.cx("fr-h3")}>{t("seedTitle")}</h3>
      {seedSuccess ? (
        <Alert severity="success" title={t("seedSuccess")} className={fr.cx("fr-mb-2w")} />
      ) : (
        <>
          <p className={fr.cx("fr-mb-2w")}>{t("seedEmpty")}</p>
          <div className={fr.cx("fr-mb-2w")}>
            <p className={fr.cx("fr-text--bold", "fr-mb-1w")}>{t("seedPreview")}</p>
            <ul className={fr.cx("fr-mb-1w")}>
              {WELCOME_DATA_PREVIEW.boards.map(board => (
                <li key={board.name}>
                  {t.rich("seedBoard", {
                    name: board.name,
                    description: board.description,
                    strong: chunks => <strong>{chunks}</strong>,
                  })}
                </li>
              ))}
            </ul>
            <ul className={fr.cx("fr-mb-1w")}>
              {WELCOME_DATA_PREVIEW.statuses.map(status => (
                <li key={status.name}>
                  {t.rich("seedStatus", { name: status.name, strong: chunks => <strong>{chunks}</strong> })}
                </li>
              ))}
            </ul>
            <p className={fr.cx("fr-text--sm")}>{WELCOME_DATA_PREVIEW.extras}</p>
          </div>
          <ClientAnimate>
            {seedError && (
              <Alert className={fr.cx("fr-mb-2w")} severity="error" title={tc("error")} description={seedError} />
            )}
          </ClientAnimate>
          <Button disabled={seeding} onClick={() => void handleSeed()}>
            {seeding ? t("seeding") : t("seedButton")}
          </Button>
        </>
      )}
    </section>
  );
};

const DNS_STATUS_SEVERITY: Record<DNSStatus, "error" | "info" | "success" | "warning"> = {
  valid: "success",
  invalid: "warning",
  error: "error",
};

const DNS_STATUS_KEY: Record<DNSStatus, "dnsError" | "dnsInvalid" | "dnsValid"> = {
  valid: "dnsValid",
  invalid: "dnsInvalid",
  error: "dnsError",
};

const DNS_POLL_INTERVAL = 30_000;

const DomainSection = ({ tenantSettings }: { tenantSettings: TenantSettings }) => {
  const t = useTranslations("domainAdmin.general");
  const tc = useTranslations("common");
  const tv = useTranslations("validation");
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

  const domainSchema = z.object({
    settingsId: z.number(),
    subdomain: z
      .string()
      .min(1, tv("subdomainRequired"))
      .regex(/^[a-z0-9-]+$/, tv("subdomainRegex")),
    customDomain: z
      .string()
      .transform(v => (v === "" ? null : v))
      .nullable(),
  });

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
      <h3 className={fr.cx("fr-h3")}>{t("domains")}</h3>
      <form noValidate onSubmit={e => void handleSubmit(onDomainSubmit)(e)}>
        <Input
          label={t("subdomainLabel")}
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
          label={t("customDomain")}
          hintText={t("customDomainHint")}
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
              <Badge severity={DNS_STATUS_SEVERITY[dnsStatus]}>{t(DNS_STATUS_KEY[dnsStatus])}</Badge>
              <Button
                type="button"
                priority="tertiary no outline"
                size="small"
                disabled={dnsChecking}
                iconId="ri-refresh-line"
                onClick={() => void runDNSCheck()}
              >
                {dnsChecking ? t("dnsChecking") : t("checkDns")}
              </Button>
            </div>
            {dnsStatus === "invalid" && dnsExpected && (
              <div className={fr.cx("fr-hint-text", "fr-mt-1v")}>
                <p>{t.rich("dnsInvalidHint", { domain: savedCustomDomain, code: chunks => <code>{chunks}</code> })}</p>
                <p className={fr.cx("fr-mt-1v")}>
                  <code>
                    {savedCustomDomain} CNAME {dnsExpected}
                  </code>
                </p>
              </div>
            )}
            {dnsStatus === "error" && dnsExpected && (
              <div className={fr.cx("fr-hint-text", "fr-mt-1v")}>
                <p>{t.rich("dnsErrorHint", { domain: savedCustomDomain, code: chunks => <code>{chunks}</code> })}</p>
                <p className={fr.cx("fr-mt-1v")}>
                  <code>
                    {savedCustomDomain} CNAME {dnsExpected}
                  </code>
                </p>
                <p className={fr.cx("fr-mt-1v")}>
                  {t.rich("dnsErrorAlternative", {
                    expected: dnsExpected ?? "",
                    strong: chunks => <strong>{chunks}</strong>,
                    code: chunks => <code>{chunks}</code>,
                  })}
                </p>
              </div>
            )}
            {dnsStatus === "valid" && (
              <p className={fr.cx("fr-hint-text", "fr-mt-1v")}>
                {t.rich("dnsValidHint", {
                  domain: savedCustomDomain,
                  expected: dnsExpected ?? "",
                  code: chunks => <code>{chunks}</code>,
                })}
              </p>
            )}
          </div>
        )}

        <ClientAnimate>
          {error && <Alert className={fr.cx("fr-mb-2w")} severity="error" title={tc("error")} description={error} />}
          {domainSuccess && (
            <Alert closable className={fr.cx("fr-mb-2w")} severity="success" title={t("domainsUpdated")} />
          )}
        </ClientAnimate>

        <Button type="submit" disabled={domainPending || !isDomainDirty}>
          {t("updateDomains")}
        </Button>
      </form>
    </section>
  );
};

const DangerZone = () => {
  const t = useTranslations("domainAdmin.general");
  const tc = useTranslations("common");
  const [error, setError] = useState<null | string>(null);
  const [purging, setPurging] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handlePurge = async () => {
    if (!confirm(t("purgeConfirm"))) return;
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
    if (!confirm(t("deleteConfirm"))) return;
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
      <h3 className={fr.cx("fr-h3")}>{t("dangerZone")}</h3>
      {error && <Alert className={fr.cx("fr-mb-2w")} severity="error" title={tc("error")} description={error} />}
      <div className={cx("flex gap-4")}>
        <Button priority="tertiary" disabled={purging || deleting} onClick={() => void handlePurge()}>
          {purging ? t("purging") : t("purgeData")}
        </Button>
        <Button priority="tertiary" disabled={purging || deleting} onClick={() => void handleDelete()}>
          {deleting ? t("deleting") : t("deleteTenant")}
        </Button>
      </div>
    </section>
  );
};
