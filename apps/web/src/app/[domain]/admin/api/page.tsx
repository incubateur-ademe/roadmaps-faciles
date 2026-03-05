import { getTranslations } from "next-intl/server";

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
    <div>
      <h1>{t("title")}</h1>
      <ApiKeysList apiKeys={apiKeys} />
    </div>
  );
});

export default ApiAdminPage;
