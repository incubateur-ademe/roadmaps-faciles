import { apiKeyRepo } from "@/lib/repo";
import { ListApiKeysForTenant } from "@/useCases/api_keys/ListApiKeysForTenant";

import { DomainPageHOP } from "../../../DomainPage";
import { ApiKeysList } from "./ApiKeysList";

const ApiAdminPage = DomainPageHOP()(async props => {
  const { tenant } = props._data;
  const useCase = new ListApiKeysForTenant(apiKeyRepo);
  const apiKeys = await useCase.execute({ tenantId: tenant.id });

  return (
    <div>
      <h1>Clés API</h1>
      <ApiKeysList apiKeys={apiKeys} />
    </div>
  );
});

export default ApiAdminPage;
