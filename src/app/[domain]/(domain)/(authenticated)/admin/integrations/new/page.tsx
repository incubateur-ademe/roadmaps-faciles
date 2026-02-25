import { getTranslations } from "next-intl/server";

import { assertFeature } from "@/lib/feature-flags";
import { auth } from "@/lib/next-auth/auth";
import { boardRepo, postStatusRepo } from "@/lib/repo";

import { DomainPageHOP } from "../../../../DomainPage";
import { NotionWizard } from "./NotionWizard";

const NewIntegrationPage = DomainPageHOP()(async props => {
  const { tenant } = props._data;
  await assertFeature("integrations", await auth());
  const [boards, statuses, t] = await Promise.all([
    boardRepo.findAllForTenant(tenant.id),
    postStatusRepo.findAllForTenant(tenant.id),
    getTranslations("domainAdmin.integrations"),
  ]);

  return (
    <div>
      <h1>{t("newTitle")}</h1>
      <NotionWizard boards={boards} statuses={statuses} />
    </div>
  );
});

export default NewIntegrationPage;
