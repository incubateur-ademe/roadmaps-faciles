import { getTranslations } from "next-intl/server";

import { integrationRepo } from "@/lib/repo";
import { ListIntegrationsForTenant } from "@/useCases/integrations/ListIntegrationsForTenant";

import { DomainPageHOP } from "../../../DomainPage";
import { IntegrationsList } from "./IntegrationsList";

const IntegrationsAdminPage = DomainPageHOP()(async props => {
  const { tenant } = props._data;
  const useCase = new ListIntegrationsForTenant(integrationRepo);
  const [integrations, t] = await Promise.all([
    useCase.execute({ tenantId: tenant.id }),
    getTranslations("domainAdmin.integrations"),
  ]);

  return (
    <div>
      <h1>{t("title")}</h1>
      <p className="fr-text--lead">{t("description")}</p>
      <IntegrationsList integrations={integrations} />
    </div>
  );
});

export default IntegrationsAdminPage;
