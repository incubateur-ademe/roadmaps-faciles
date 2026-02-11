import { fr } from "@codegouvfr/react-dsfr";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
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

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" });

const TenantDetailPage = async ({ params }: NextServerPageProps<{ tenantId: string }>) => {
  await connection();

  const { tenantId: tenantIdParam } = await params;
  const tenantId = Number(tenantIdParam);
  if (isNaN(tenantId)) notFound();

  const tenant = await tenantRepo.findByIdWithSettings(tenantId);
  if (!tenant?.settings) notFound();

  const session = await auth();

  const useCase = new ListUsersForTenant(userOnTenantRepo);
  const members = await useCase.execute({ tenantId: tenant.id });

  const superAdminIds = members
    .filter(m => m.user.username && config.admins.includes(m.user.username))
    .map(m => m.userId);

  const tenantUrl = `${config.host.replace("://", `://${tenant.settings.subdomain}.`)}`;

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
                children: "Admin du tenant",
                priority: "tertiary",
                linkProps: { href: `${tenantUrl}/admin`, target: "_blank" },
              },
              {
                children: "Retour",
                priority: "secondary",
                linkProps: { href: "/admin/tenants" },
              },
            ]}
          />
        </GridCol>
      </Grid>

      <div className={fr.cx("fr-mb-4w")}>
        <h2>Informations</h2>
        <dl>
          <div className={fr.cx("fr-mb-1v")}>
            <dt className="font-bold inline">ID :</dt> <dd className="inline">{tenant.id}</dd>
          </div>
          <div className={fr.cx("fr-mb-1v")}>
            <dt className="font-bold inline">Sous-domaine :</dt> <dd className="inline">{tenant.settings.subdomain}</dd>
          </div>
          <div className={fr.cx("fr-mb-1v")}>
            <dt className="font-bold inline">Domaine custom :</dt>{" "}
            <dd className="inline">{tenant.settings.customDomain ?? "—"}</dd>
          </div>
          <div className={fr.cx("fr-mb-1v")}>
            <dt className="font-bold inline">Privé :</dt>{" "}
            <dd className="inline">{tenant.settings.isPrivate ? "Oui" : "Non"}</dd>
          </div>
          <div className={fr.cx("fr-mb-1v")}>
            <dt className="font-bold inline">Créé le :</dt>{" "}
            <dd className="inline">{dateFormatter.format(new Date(tenant.createdAt))}</dd>
          </div>
        </dl>
      </div>

      <h2>Membres</h2>
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
