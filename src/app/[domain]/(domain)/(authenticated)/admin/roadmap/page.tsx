import dynamic from "next/dynamic";
import { connection } from "next/server";

import { boardRepo, tenantSettingsRepo } from "@/lib/repo";
import { getServerService } from "@/lib/services";
import { ListBoardsForTenant } from "@/useCases/boards/ListBoardsForTenant";

// Lazy load admin form to reduce bundle size
const RoadmapForm = dynamic(() => import("./RoadmapForm").then(m => ({ default: m.RoadmapForm })), {
  ssr: false,
});

const RoadmapAdminPage = async () => {
  await connection();
  const { tenant } = await getServerService("current");
  const useCase = new ListBoardsForTenant(boardRepo);
  const boards = await useCase.execute({ tenantId: tenant.id });
  const settings = await tenantSettingsRepo.findByTenantId(tenant.id);
  if (!settings) throw new Error("Settings not found");

  return (
    <div>
      <h1>Page principale (Roadmap)</h1>
      <RoadmapForm boards={boards} currentRootBoardId={settings.rootBoardId} />
    </div>
  );
};

export default RoadmapAdminPage;
