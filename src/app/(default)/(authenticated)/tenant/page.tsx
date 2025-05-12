import Link from "next/link";

import { config } from "@/config";
import { Container } from "@/dsfr";
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
      <Container>
        <h1>Mes espaces de travail</h1>
        <p>Vous n'avez pas d'espaces de travail</p>
      </Container>
    );
  }

  return (
    <Container>
      <h1>Mes espaces de travail</h1>
      <p>Voici la liste de mes espaces de travail</p>
      <ul>
        {tenants.map(tenant => (
          <li key={tenant.id}>
            <Link href={`/tenant/${tenant.id}`}>{tenant.name}</Link> (
            <Link
              href={
                tenant.customDomain ??
                `${config.mainHostURL.protocol}//${tenant.subdomain}.${new URL(config.mainHostURL).host}`
              }
            >
              Voir le dashboard
            </Link>
            )
          </li>
        ))}
      </ul>
    </Container>
  );
};
export default TenantPage;
