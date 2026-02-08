import { postStatusRepo } from "@/lib/repo";
import { ListPostStatuses } from "@/useCases/post_statuses/ListPostStatuses";

import { DomainPageHOP } from "../../../DomainPage";
import { StatusesList } from "./StatusesList";

const StatusesAdminPage = DomainPageHOP()(async props => {
  const { tenant } = props._data;
  const useCase = new ListPostStatuses(postStatusRepo);
  const statuses = await useCase.execute({ tenantId: tenant.id });

  return (
    <div>
      <h1>Gestion des statuts</h1>
      <StatusesList statuses={statuses} />
    </div>
  );
});

export default StatusesAdminPage;
