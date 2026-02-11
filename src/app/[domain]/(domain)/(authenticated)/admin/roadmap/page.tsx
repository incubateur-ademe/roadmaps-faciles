import { getTranslations } from "next-intl/server";

import { boardRepo } from "@/lib/repo";
import { ListBoardsForTenant } from "@/useCases/boards/ListBoardsForTenant";

import { DomainPageHOP } from "../../../DomainPage";
import { RoadmapForm } from "./RoadmapForm";

const RoadmapAdminPage = DomainPageHOP()(async props => {
  const { tenant, settings } = props._data;

  const useCase = new ListBoardsForTenant(boardRepo);
  const [boards, t] = await Promise.all([
    useCase.execute({ tenantId: tenant.id }),
    getTranslations("domainAdmin.roadmap"),
  ]);

  return (
    <div>
      <h1>{t("title")}</h1>
      <RoadmapForm boards={boards} currentRootBoardId={settings.rootBoardId} />
    </div>
  );
});

export default RoadmapAdminPage;
