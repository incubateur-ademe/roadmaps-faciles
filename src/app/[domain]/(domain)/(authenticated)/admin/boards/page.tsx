import { connection } from "next/server";

import { boardRepo } from "@/lib/repo";
import { getServerService } from "@/lib/services";
import { ListBoardsForTenant } from "@/useCases/boards/ListBoardsForTenant";

import { BoardsList } from "./BoardsList";

const BoardsAdminPage = async () => {
  await connection();
  const { tenant } = await getServerService("current");
  const useCase = new ListBoardsForTenant(boardRepo);
  const boards = await useCase.execute({ tenantId: tenant.id });

  return (
    <div>
      <h1>Gestion des boards</h1>
      <BoardsList boards={boards} />
    </div>
  );
};

export default BoardsAdminPage;
