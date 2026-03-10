import { getTranslations } from "next-intl/server";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DomainPageHOP } from "@/lib/DomainPage";
import { assertFeature } from "@/lib/feature-flags";
import { auth } from "@/lib/next-auth/auth";
import { integrationRepo } from "@/lib/repo";
import { ListIntegrationsForTenant } from "@/useCases/integrations/ListIntegrationsForTenant";

import { IntegrationsList } from "./IntegrationsList";

const IntegrationsAdminPage = DomainPageHOP()(async props => {
  const { tenant } = props._data;
  await assertFeature("integrations", await auth());

  const useCase = new ListIntegrationsForTenant(integrationRepo);
  const [integrations, t] = await Promise.all([
    useCase.execute({ tenantId: tenant.id }),
    getTranslations("domainAdmin.integrations"),
  ]);

  return (
    <>
      <AdminPageHeader title={t("title")} description={t("description")} />
      <IntegrationsList integrations={integrations} />
    </>
  );
});

export default IntegrationsAdminPage;
