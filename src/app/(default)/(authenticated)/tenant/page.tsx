import { getTranslations } from "next-intl/server";

import { config } from "@/config";
import { Container } from "@/dsfr";
import { DsfrPage } from "@/dsfr/layout/DsfrPage";
import { Link } from "@/i18n/navigation";
import { auth } from "@/lib/next-auth/auth";
import { tenantRepo } from "@/lib/repo";
import { ListTenantsForUser } from "@/useCases/tenant/ListTenantsForUser";

const TenantPage = async () => {
  const session = (await auth())!;
  const t = await getTranslations("tenant");

  const useCasse = new ListTenantsForUser(tenantRepo);
  const tenants = await useCasse.execute({
    userId: session?.user.id,
  });

  if (!tenants) {
    return (
      <DsfrPage>
        <Container>
          <h1>{t("myWorkspaces")}</h1>
          <p>{t("noWorkspaces")}</p>
        </Container>
      </DsfrPage>
    );
  }

  return (
    <DsfrPage>
      <Container>
        <h1>{t("myWorkspaces")}</h1>
        <p>{t("workspacesList")}</p>
        <ul>
          {tenants.map(tenant => (
            <li key={tenant.id}>
              <Link href={`/tenant/${tenant.id}`}>{tenant.settings.name}</Link> (
              <Link
                href={
                  tenant.settings.customDomain ??
                  `${new URL(config.host).protocol}//${tenant.settings.subdomain}.${new URL(config.host).host}`
                }
              >
                {t("viewDashboard")}
              </Link>
              )
            </li>
          ))}
        </ul>
      </Container>
    </DsfrPage>
  );
};
export default TenantPage;
