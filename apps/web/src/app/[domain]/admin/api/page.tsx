import { getTranslations } from "next-intl/server";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DomainPageHOP } from "@/lib/DomainPage";
import { apiKeyRepo } from "@/lib/repo";
import { ListApiKeysForTenant } from "@/useCases/api_keys/ListApiKeysForTenant";

import { ApiKeysList } from "./ApiKeysList";

const ApiAdminPage = DomainPageHOP()(async props => {
  const { tenant } = props._data;
  const useCase = new ListApiKeysForTenant(apiKeyRepo);
  const [apiKeys, t] = await Promise.all([
    useCase.execute({ tenantId: tenant.id }),
    getTranslations("domainAdmin.api"),
  ]);

  return (
    <>
      <AdminPageHeader title={t("title")} description={t("description")} />
      <ApiKeysList apiKeys={apiKeys} />
    </>
  );
});

export default ApiAdminPage;
