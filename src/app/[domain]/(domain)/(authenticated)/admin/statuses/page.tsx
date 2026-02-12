import { getTranslations } from "next-intl/server";

import { postStatusRepo } from "@/lib/repo";
import { ListPostStatuses } from "@/useCases/post_statuses/ListPostStatuses";

import { DomainPageHOP } from "../../../DomainPage";
import { StatusesList } from "./StatusesList";

const StatusesAdminPage = DomainPageHOP()(async props => {
  const { tenant } = props._data;
  const useCase = new ListPostStatuses(postStatusRepo);
  const [statuses, t] = await Promise.all([
    useCase.execute({ tenantId: tenant.id }),
    getTranslations("domainAdmin.statuses"),
  ]);

  return (
    <div>
      <h1>{t("title")}</h1>
      <StatusesList statuses={statuses} />
    </div>
  );
});

export default StatusesAdminPage;
