import { notFound } from "next/navigation";
import { connection } from "next/server";

import { Container } from "@/dsfr";
import { tenantSettingsRepo } from "@/lib/repo";
import { getServerService } from "@/lib/services";

import { GeneralForm } from "./GeneralForm";

const AdminGeneralPage = async () => {
  await connection();
  const current = await getServerService("current");
  const tenantSettings = await tenantSettingsRepo.findByTenantId(current.tenant.id);

  if (!tenantSettings) notFound();

  return (
    <Container fluid>
      <GeneralForm tenantSettings={tenantSettings} />
    </Container>
  );
};

export default AdminGeneralPage;
