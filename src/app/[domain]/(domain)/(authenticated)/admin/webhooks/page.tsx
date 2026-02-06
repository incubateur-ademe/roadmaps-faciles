import { webhookRepo } from "@/lib/repo";
import { ListWebhooksForTenant } from "@/useCases/webhooks/ListWebhooksForTenant";

import { DomainPageHOP } from "../../../DomainPage";
import { WebhooksList } from "./WebhooksList";

const WebhooksAdminPage = DomainPageHOP()(async props => {
  const { tenant } = props._data;
  const useCase = new ListWebhooksForTenant(webhookRepo);
  const webhooks = await useCase.execute({ tenantId: tenant.id });

  return (
    <div>
      <h1>Webhooks</h1>
      <WebhooksList webhooks={webhooks} />
    </div>
  );
});

export default WebhooksAdminPage;
