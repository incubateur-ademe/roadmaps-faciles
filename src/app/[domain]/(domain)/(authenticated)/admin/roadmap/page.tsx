import { boardRepo } from "@/lib/repo";
import { ListBoardsForTenant } from "@/useCases/boards/ListBoardsForTenant";

import { DomainPageHOP } from "../../../DomainPage";
import { RoadmapForm } from "./RoadmapForm";

const RoadmapAdminPage = DomainPageHOP()(async props => {
  const { tenant, settings } = props._data;

  const useCase = new ListBoardsForTenant(boardRepo);
  const boards = await useCase.execute({ tenantId: tenant.id });

  return (
    <div>
      <h1>Page principale (Roadmap)</h1>
      <RoadmapForm boards={boards} currentRootBoardId={settings.rootBoardId} />
    </div>
  );
});

export default RoadmapAdminPage;
