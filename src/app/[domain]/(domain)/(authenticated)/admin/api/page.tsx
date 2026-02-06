import dynamic from "next/dynamic";
import { connection } from "next/server";

import { apiKeyRepo } from "@/lib/repo";
import { getServerService } from "@/lib/services";
import { ListApiKeysForTenant } from "@/useCases/api_keys/ListApiKeysForTenant";

// Lazy load admin list to reduce bundle size
const ApiKeysList = dynamic(() => import("./ApiKeysList").then(m => ({ default: m.ApiKeysList })), {
  ssr: false,
});

const ApiAdminPage = async () => {
  await connection();
  const { tenant } = await getServerService("current");
  const useCase = new ListApiKeysForTenant(apiKeyRepo);
  const apiKeys = await useCase.execute({ tenantId: tenant.id });

  return (
    <div>
      <h1>Clés API</h1>
      <ApiKeysList apiKeys={apiKeys} />
    </div>
  );
};

export default ApiAdminPage;
