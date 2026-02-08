import { boardRepo } from "@/lib/repo";
import { ListBoardsForTenant } from "@/useCases/boards/ListBoardsForTenant";

import { DomainPageHOP } from "../../../DomainPage";
import { BoardsList } from "./BoardsList";

const BoardsAdminPage = DomainPageHOP()(async props => {
  const { tenant } = props._data;
  const useCase = new ListBoardsForTenant(boardRepo);
  const boards = await useCase.execute({ tenantId: tenant.id });

  return (
    <div>
      <h1>Gestion des boards</h1>
      <BoardsList boards={boards} />
    </div>
  );
});

export default BoardsAdminPage;
