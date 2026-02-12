import { fr } from "@codegouvfr/react-dsfr";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import { getLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";

import { config } from "@/config";
import { Grid, GridCol } from "@/dsfr";
import { auth } from "@/lib/next-auth/auth";
import { tenantRepo, userOnTenantRepo } from "@/lib/repo";
import { ListUsersForTenant } from "@/useCases/user_on_tenant/ListUsersForTenant";
import { type NextServerPageProps } from "@/utils/next";

import { RootMembersList } from "./RootMembersList";

const TenantDetailPage = async ({ params }: NextServerPageProps<{ tenantId: string }>) => {
  await connection();

  const { tenantId: tenantIdParam } = await params;
  const tenantId = Number(tenantIdParam);
  if (isNaN(tenantId)) notFound();

  const tenant = await tenantRepo.findByIdWithSettings(tenantId);
  if (!tenant?.settings) notFound();

  const [session, t, tc, locale] = await Promise.all([
    auth(),
    getTranslations("rootAdmin"),
    getTranslations("common"),
    getLocale(),
  ]);

  const useCase = new ListUsersForTenant(userOnTenantRepo);
  const members = await useCase.execute({ tenantId: tenant.id });

  const superAdminIds = members
    .filter(m => m.user.username && config.admins.includes(m.user.username))
    .map(m => m.userId);

  const tenantUrl = `${config.host.replace("://", `://${tenant.settings.subdomain}.`)}`;

  const dateFormatter = new Intl.DateTimeFormat(locale, { dateStyle: "medium" });

  return (
    <div>
      <Grid haveGutters valign="middle" mb="4w">
        <GridCol>
          <h1 className={fr.cx("fr-mb-0")}>{tenant.settings.name ?? `Tenant #${tenant.id}`}</h1>
          <h2 className={fr.cx("fr-h3", "fr-mb-0")}>
            <Link href={tenantUrl} target="_blank">
              {tenantUrl}
            </Link>
          </h2>
        </GridCol>
        <GridCol base={false} className="fr-col-auto">
          <ButtonsGroup
            inlineLayoutWhen="always"
            buttonsSize="small"
            buttons={[
              {
                children: t("tenantAdmin"),
                priority: "tertiary",
                linkProps: { href: `${tenantUrl}/admin`, target: "_blank" },
              },
              {
                children: t("back"),
                priority: "secondary",
                linkProps: { href: "/admin/tenants" },
              },
            ]}
          />
        </GridCol>
      </Grid>

      <div className={fr.cx("fr-mb-4w")}>
        <h2>{t("information")}</h2>
        <dl>
          <div className={fr.cx("fr-mb-1v")}>
            <dt className="font-bold inline">{t("id")} :</dt> <dd className="inline">{tenant.id}</dd>
          </div>
          <div className={fr.cx("fr-mb-1v")}>
            <dt className="font-bold inline">{t("subdomain")} :</dt>{" "}
            <dd className="inline">{tenant.settings.subdomain}</dd>
          </div>
          <div className={fr.cx("fr-mb-1v")}>
            <dt className="font-bold inline">{t("customDomain")} :</dt>{" "}
            <dd className="inline">{tenant.settings.customDomain ?? "—"}</dd>
          </div>
          <div className={fr.cx("fr-mb-1v")}>
            <dt className="font-bold inline">{t("private")} :</dt>{" "}
            <dd className="inline">{tenant.settings.isPrivate ? tc("yes") : tc("no")}</dd>
          </div>
          <div className={fr.cx("fr-mb-1v")}>
            <dt className="font-bold inline">{t("createdAt")} :</dt>{" "}
            <dd className="inline">{dateFormatter.format(new Date(tenant.createdAt))}</dd>
          </div>
        </dl>
      </div>

      <h2>{t("members")}</h2>
      <RootMembersList
        currentUserId={session?.user.uuid ?? ""}
        members={members}
        superAdminIds={superAdminIds}
        tenantId={tenant.id}
      />
    </div>
  );
};

export default TenantDetailPage;
