"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { cn } from "@kokatsuna/ui";
import { Alert, AlertDescription, AlertTitle } from "@kokatsuna/ui/components/alert";
import { Badge } from "@kokatsuna/ui/components/badge";
import { Button } from "@kokatsuna/ui/components/button";
import { Input } from "@kokatsuna/ui/components/input";
import { Label } from "@kokatsuna/ui/components/label";
import { Separator } from "@kokatsuna/ui/components/separator";
import { Switch } from "@kokatsuna/ui/components/switch";
import { RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import z from "zod";

import { ClientAnimate } from "@/components/utils/ClientAnimate";
import { config } from "@/config";
import { type DNSStatus } from "@/lib/domain-provider/dns";
import { useFeatureFlag } from "@/lib/feature-flags/client";
import { UI_THEME } from "@/lib/model/TenantSettings";
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
  uiTheme: z.enum(UI_THEME),
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
  const themeSwitchingEnabled = useFeatureFlag("themeSwitching");
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
      uiTheme: tenantSettings.uiTheme,
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
        {SECTIONS.map(section => (
          <section id={section.id} key={section.id} className="mb-8">
            <h3 className="text-xl font-bold mb-4">{section.title}</h3>
            <div className="space-y-4">
              {section.toggles.map(toggle => (
                <div key={toggle.name} className="flex items-start gap-3">
                  <Switch
                    id={toggle.name}
                    checked={!!watchedValues[toggle.name as keyof typeof watchedValues]}
                    disabled={toggle.disabled ?? false}
                    onCheckedChange={(checked: boolean) => setValue(toggle.name, checked, { shouldDirty: true })}
                    className="mt-0.5"
                  />
                  <div>
                    <Label htmlFor={toggle.name} className="cursor-pointer">
                      {toggle.label}
                    </Label>
                    <p className="text-sm text-muted-foreground">{toggle.helperText}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {watchedValues.allowEmbedding && watchedValues.isPrivate && (
          <Alert className="mb-4">
            <AlertDescription>{t("allowEmbeddingPrivateWarning")}</AlertDescription>
          </Alert>
        )}

        {themeSwitchingEnabled &&
          (() => {
            const hasGouvDomain = !!tenantSettings.customDomain?.endsWith(".gouv.fr");
            return (
              <section id="ui-theme" className="mb-8">
                <h3 className="text-xl font-bold mb-4">{t("uiTheme.label")}</h3>
                <p className="text-sm text-muted-foreground mb-4">{t("uiTheme.description")}</p>
                <div className="space-y-2 max-w-xs">
                  <Label htmlFor="ui-theme-select">{t("uiTheme.label")}</Label>
                  <select
                    id="ui-theme-select"
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={watchedValues.uiTheme ?? "Default"}
                    onChange={e => setValue("uiTheme", e.target.value as "Default" | "Dsfr", { shouldDirty: true })}
                  >
                    <option value="Default">{t("uiTheme.options.Default")}</option>
                    <option value="Dsfr" disabled={!hasGouvDomain}>
                      {t("uiTheme.options.Dsfr")}
                    </option>
                  </select>
                  {!hasGouvDomain && <p className="text-sm text-muted-foreground mt-1">{t("uiTheme.gouvRequired")}</p>}
                </div>
              </section>
            );
          })()}

        <ClientAnimate>
          {saveError && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>{te("saveError")}</AlertTitle>
              <AlertDescription>{saveError}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="mb-4">
              <AlertTitle>{t("saveSuccess")}</AlertTitle>
            </Alert>
          )}
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
    <section id="seed" className="mb-12">
      <h3 className="text-xl font-bold mb-4">{t("seedTitle")}</h3>
      {seedSuccess ? (
        <Alert className="mb-4">
          <AlertTitle>{t("seedSuccess")}</AlertTitle>
        </Alert>
      ) : (
        <>
          <p className="mb-4">{t("seedEmpty")}</p>
          <div className="mb-4">
            <p className="font-bold mb-2">{t("seedPreview")}</p>
            <ul className="mb-2 list-disc pl-5">
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
            <ul className="mb-2 list-disc pl-5">
              {WELCOME_DATA_PREVIEW.statuses.map(status => (
                <li key={status.name}>
                  {t.rich("seedStatus", { name: status.name, strong: chunks => <strong>{chunks}</strong> })}
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground">{WELCOME_DATA_PREVIEW.extras}</p>
          </div>
          <ClientAnimate>
            {seedError && (
              <Alert variant="destructive" className="mb-4">
                <AlertTitle>{tc("error")}</AlertTitle>
                <AlertDescription>{seedError}</AlertDescription>
              </Alert>
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

const DNS_STATUS_VARIANT: Record<DNSStatus, "default" | "destructive" | "outline" | "secondary"> = {
  valid: "default",
  invalid: "secondary",
  error: "destructive",
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
    <section id="domain" className="mt-12">
      <Separator className="mb-8" />
      <h3 className="text-xl font-bold mb-4">{t("domains")}</h3>
      <form noValidate onSubmit={e => void handleSubmit(onDomainSubmit)(e)} className="space-y-4 max-w-lg">
        <div className="space-y-2">
          <Label htmlFor="subdomain">{t("subdomainLabel")}</Label>
          <Input id="subdomain" {...register("subdomain")} />
          {subdomain && (
            <p className="text-sm text-muted-foreground">
              URL : <strong>{`${subdomain}.${config.rootDomain}`}</strong>
            </p>
          )}
          {domainErrors.subdomain && <p className="text-sm text-destructive">{domainErrors.subdomain.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="custom-domain">{t("customDomain")}</Label>
          <Input id="custom-domain" {...register("customDomain")} placeholder="feedback.example.com" />
          <p className="text-sm text-muted-foreground">{t("customDomainHint")}</p>
          {domainErrors.customDomain && <p className="text-sm text-destructive">{domainErrors.customDomain.message}</p>}
        </div>

        {showDnsStatus && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant={DNS_STATUS_VARIANT[dnsStatus]}>{t(DNS_STATUS_KEY[dnsStatus])}</Badge>
              <Button type="button" variant="ghost" size="sm" disabled={dnsChecking} onClick={() => void runDNSCheck()}>
                <RefreshCw className={cn("mr-1 size-4", dnsChecking && "animate-spin")} />
                {dnsChecking ? t("dnsChecking") : t("checkDns")}
              </Button>
            </div>
            {dnsStatus === "invalid" && dnsExpected && (
              <div className="text-sm text-muted-foreground space-y-1">
                <p>{t.rich("dnsInvalidHint", { domain: savedCustomDomain, code: chunks => <code>{chunks}</code> })}</p>
                <p>
                  <code>
                    {savedCustomDomain} CNAME {dnsExpected}
                  </code>
                </p>
              </div>
            )}
            {dnsStatus === "error" && dnsExpected && (
              <div className="text-sm text-muted-foreground space-y-1">
                <p>{t.rich("dnsErrorHint", { domain: savedCustomDomain, code: chunks => <code>{chunks}</code> })}</p>
                <p>
                  <code>
                    {savedCustomDomain} CNAME {dnsExpected}
                  </code>
                </p>
                <p>
                  {t.rich("dnsErrorAlternative", {
                    expected: dnsExpected ?? "",
                    strong: chunks => <strong>{chunks}</strong>,
                    code: chunks => <code>{chunks}</code>,
                  })}
                </p>
              </div>
            )}
            {dnsStatus === "valid" && (
              <p className="text-sm text-muted-foreground">
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
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>{tc("error")}</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {domainSuccess && (
            <Alert className="mb-4">
              <AlertTitle>{t("domainsUpdated")}</AlertTitle>
            </Alert>
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
    <section id="danger" className="mt-12">
      <Separator className="mb-8" />
      <h3 className="text-xl font-bold mb-4">{t("dangerZone")}</h3>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>{tc("error")}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="flex gap-4">
        <Button variant="outline" disabled={purging || deleting} onClick={() => void handlePurge()}>
          {purging ? t("purging") : t("purgeData")}
        </Button>
        <Button variant="outline" disabled={purging || deleting} onClick={() => void handleDelete()}>
          {deleting ? t("deleting") : t("deleteTenant")}
        </Button>
      </div>
    </section>
  );
};
