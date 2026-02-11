import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import { getLocale, getTranslations } from "next-intl/server";
import { connection } from "next/server";

import { CopyButton } from "@/components/CopyButton";
import { config } from "@/config";
import { TableCustom } from "@/dsfr/base/TableCustom";
import { Link } from "@/i18n/navigation";
import { tenantRepo } from "@/lib/repo";
import { ListAllTenants } from "@/useCases/tenant/ListAllTenants";

const TenantsPage = async () => {
  await connection();

  const [useCase, t, tc, locale] = await Promise.all([
    Promise.resolve(new ListAllTenants(tenantRepo)),
    getTranslations("adminTenants"),
    getTranslations("common"),
    getLocale(),
  ]);
  const tenants = await useCase.execute();
  const dateFormatter = new Intl.DateTimeFormat(locale, { dateStyle: "medium" });

  return (
    <div>
      <h1>{t("title")}</h1>
      <div className="flex items-center justify-between fr-mb-2w">
        <p className="fr-mb-0">{t("tenantCount", { count: tenants.length })}</p>
        <ButtonsGroup
          inlineLayoutWhen="always"
          buttonsSize="small"
          buttons={[
            {
              children: t("create"),
              linkProps: { href: "/admin/tenants/new" },
            },
          ]}
        />
      </div>

      <TableCustom
        header={[
          { children: t("name") },
          { children: t("url") },
          { children: t("owners") },
          { children: t("members") },
          { children: t("createdAt") },
          { children: tc("actions") },
        ]}
        body={tenants.map(tenant => {
          const tenantUrl = `${config.host.replace("://", `://${tenant.settings.subdomain}.`)}`;

          return [
            {
              children: tenant.settings.name ?? `Tenant #${tenant.id}`,
            },
            {
              children: (
                <div>
                  <Link href={tenantUrl} target="_blank">
                    {tenantUrl}
                  </Link>
                  {tenant.settings.customDomain && (
                    <div className="fr-mt-1v fr-text--xs fr-text-mention--grey">{tenant.settings.customDomain}</div>
                  )}
                </div>
              ),
            },
            {
              children: (
                <ul className="fr-raw-list">
                  {tenant.members.map(m => (
                    <li key={m.user.email}>
                      <CopyButton className="fr-link fr-text--sm" value={m.user.email}>
                        {m.user.name ?? m.user.email}
                      </CopyButton>
                    </li>
                  ))}
                </ul>
              ),
            },
            {
              children: tenant._count.members,
            },
            {
              children: dateFormatter.format(new Date(tenant.createdAt)),
            },
            {
              children: (
                <ButtonsGroup
                  inlineLayoutWhen="always"
                  buttonsSize="small"
                  buttons={[
                    {
                      children: tc("detail"),
                      priority: "secondary",
                      linkProps: { href: `/admin/tenants/${tenant.id}` },
                    },
                  ]}
                />
              ),
            },
          ];
        })}
      />
    </div>
  );
};

export default TenantsPage;
