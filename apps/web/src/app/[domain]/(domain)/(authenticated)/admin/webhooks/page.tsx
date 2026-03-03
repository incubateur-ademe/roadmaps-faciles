import { getTranslations } from "next-intl/server";

import { webhookRepo } from "@/lib/repo";
import { ListWebhooksForTenant } from "@/useCases/webhooks/ListWebhooksForTenant";

import { DomainPageHOP } from "../../../DomainPage";
import { WebhooksList } from "./WebhooksList";

const WebhooksAdminPage = DomainPageHOP()(async props => {
  const { tenant } = props._data;
  const useCase = new ListWebhooksForTenant(webhookRepo);
  const [webhooks, t] = await Promise.all([
    useCase.execute({ tenantId: tenant.id }),
    getTranslations("domainAdmin.webhooks"),
  ]);

  return (
    <div>
      <h1>{t("title")}</h1>
      <WebhooksList webhooks={webhooks} />
    </div>
  );
});

export default WebhooksAdminPage;
