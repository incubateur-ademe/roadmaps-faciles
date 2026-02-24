import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { integrationMappingRepo, integrationRepo, integrationSyncLogRepo } from "@/lib/repo";
import { GetIntegrationSyncLogs } from "@/useCases/integrations/GetIntegrationSyncLogs";

import { DomainPageHOP } from "../../../../DomainPage";
import { IntegrationDetail } from "./IntegrationDetail";

const IntegrationDetailPage = DomainPageHOP<{ integrationId: string }>()(async props => {
  const { tenant } = props._data;
  const integrationId = Number((await props.params).integrationId);

  if (isNaN(integrationId)) notFound();

  const integration = await integrationRepo.findById(integrationId);
  if (!integration || integration.tenantId !== tenant.id) notFound();

  const [mappings, syncLogs] = await Promise.all([
    integrationMappingRepo.findAllForIntegration(integrationId),
    new GetIntegrationSyncLogs(integrationRepo, integrationSyncLogRepo).execute({
      integrationId,
      tenantId: tenant.id,
      limit: 50,
    }),
    getTranslations("domainAdmin.integrations"),
  ]);

  return (
    <div>
      <h1>{integration.name}</h1>
      <IntegrationDetail integration={integration} mappings={mappings} syncLogs={syncLogs} />
    </div>
  );
});

export default IntegrationDetailPage;
