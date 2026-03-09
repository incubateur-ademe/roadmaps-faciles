import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DomainPageHOP } from "@/lib/DomainPage";
import { assertFeature } from "@/lib/feature-flags";
import { auth } from "@/lib/next-auth/auth";
import { integrationMappingRepo, integrationRepo, integrationSyncLogRepo } from "@/lib/repo";
import { GetSyncRuns } from "@/useCases/integrations/GetSyncRuns";

import { IntegrationDetail } from "./IntegrationDetail";

const IntegrationDetailPage = DomainPageHOP<{ integrationId: string }>()(async props => {
  const { tenant } = props._data;
  await assertFeature("integrations", await auth());

  const integrationId = Number((await props.params).integrationId);

  if (isNaN(integrationId)) notFound();

  const integration = await integrationRepo.findById(integrationId);
  if (!integration || integration.tenantId !== tenant.id) notFound();

  const [mappings, syncRuns] = await Promise.all([
    integrationMappingRepo.findAllForIntegration(integrationId),
    new GetSyncRuns(integrationRepo, integrationSyncLogRepo).execute({
      integrationId,
      tenantId: tenant.id,
      limit: 20,
    }),
  ]);

  return (
    <>
      <AdminPageHeader title={integration.name} />
      <IntegrationDetail integration={integration} mappings={mappings} syncRuns={syncRuns} />
    </>
  );
});

export default IntegrationDetailPage;
