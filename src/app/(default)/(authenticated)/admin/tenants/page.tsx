import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import Link from "next/link";
import { connection } from "next/server";

import { CopyButton } from "@/components/CopyButton";
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
      <div className="flex items-center justify-between fr-mb-2w">
        <p className="fr-mb-0">{tenants.length} tenant(s)</p>
        <ButtonsGroup
          inlineLayoutWhen="always"
          buttonsSize="small"
          buttons={[
            {
              children: "Créer un tenant",
              linkProps: { href: "/admin/tenants/new" },
            },
          ]}
        />
      </div>

      <TableCustom
        header={[
          { children: "Nom" },
          { children: "URL" },
          { children: "Owners" },
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
