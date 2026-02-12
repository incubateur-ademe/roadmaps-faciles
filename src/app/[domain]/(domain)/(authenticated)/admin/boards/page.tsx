import { getTranslations } from "next-intl/server";

import { boardRepo } from "@/lib/repo";
import { ListBoardsForTenant } from "@/useCases/boards/ListBoardsForTenant";

import { DomainPageHOP } from "../../../DomainPage";
import { BoardsList } from "./BoardsList";

const BoardsAdminPage = DomainPageHOP()(async props => {
  const { tenant } = props._data;
  const useCase = new ListBoardsForTenant(boardRepo);
  const [boards, t] = await Promise.all([
    useCase.execute({ tenantId: tenant.id }),
    getTranslations("domainAdmin.boards"),
  ]);

  return (
    <div>
      <h1>{t("title")}</h1>
      <BoardsList boards={boards} />
    </div>
  );
});

export default BoardsAdminPage;
