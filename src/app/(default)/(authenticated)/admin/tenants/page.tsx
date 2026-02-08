import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import Link from "next/link";
import { connection } from "next/server";

import { config } from "@/config";
import { TableCustom } from "@/dsfr/base/TableCustom";
import { tenantRepo } from "@/lib/repo";
import { ListAllTenants } from "@/useCases/tenant/ListAllTenants";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" });

const TenantsPage = async () => {
  await connection();

  const useCase = new ListAllTenants(tenantRepo);
  const tenants = await useCase.execute();

  return (
    <div>
      <h1>Tenants</h1>
      <p className="fr-mb-2w">{tenants.length} tenant(s)</p>

      <TableCustom
        header={[
          { children: "Nom" },
          { children: "URL" },
          { children: "Membres" },
          { children: "Créé le" },
          { children: "Actions" },
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
                      children: "Détail",
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
