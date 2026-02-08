import Link from "next/link";

import { config } from "@/config";
import { Container } from "@/dsfr";
import { DsfrPage } from "@/dsfr/layout/DsfrPage";
import { auth } from "@/lib/next-auth/auth";
import { tenantRepo } from "@/lib/repo";
import { ListTenantsForUser } from "@/useCases/tenant/ListTenantsForUser";

const TenantPage = async () => {
  const session = (await auth())!;

  const useCasse = new ListTenantsForUser(tenantRepo);
  const tenants = await useCasse.execute({
    userId: session?.user.id,
  });

  if (!tenants) {
    return (
      <DsfrPage>
        <Container>
          <h1>Mes espaces de travail</h1>
          <p>Vous n'avez pas d'espaces de travail</p>
        </Container>
      </DsfrPage>
    );
  }

  return (
    <DsfrPage>
      <Container>
        <h1>Mes espaces de travail</h1>
        <p>Voici la liste de mes espaces de travail</p>
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
                Voir le dashboard
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
