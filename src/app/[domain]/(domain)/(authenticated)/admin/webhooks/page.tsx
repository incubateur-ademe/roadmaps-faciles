import dynamic from "next/dynamic";
import { connection } from "next/server";

import { webhookRepo } from "@/lib/repo";
import { getServerService } from "@/lib/services";
import { ListWebhooksForTenant } from "@/useCases/webhooks/ListWebhooksForTenant";

// Lazy load admin list to reduce bundle size
const WebhooksList = dynamic(() => import("./WebhooksList").then(m => ({ default: m.WebhooksList })), {
  ssr: false,
});

const WebhooksAdminPage = async () => {
  await connection();
  const { tenant } = await getServerService("current");
  const useCase = new ListWebhooksForTenant(webhookRepo);
  const webhooks = await useCase.execute({ tenantId: tenant.id });

  return (
    <div>
      <h1>Webhooks</h1>
      <WebhooksList webhooks={webhooks} />
    </div>
  );
};

export default WebhooksAdminPage;
