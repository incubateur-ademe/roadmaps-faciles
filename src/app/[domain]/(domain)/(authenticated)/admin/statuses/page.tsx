import dynamic from "next/dynamic";
import { connection } from "next/server";

import { postStatusRepo } from "@/lib/repo";
import { getServerService } from "@/lib/services";
import { ListPostStatuses } from "@/useCases/post_statuses/ListPostStatuses";

// Lazy load admin list to reduce bundle size
const StatusesList = dynamic(() => import("./StatusesList").then(m => ({ default: m.StatusesList })), {
  ssr: false,
});

const StatusesAdminPage = async () => {
  await connection();
  const { tenant } = await getServerService("current");
  const useCase = new ListPostStatuses(postStatusRepo);
  const statuses = await useCase.execute({ tenantId: tenant.id });

  return (
    <div>
      <h1>Gestion des statuts</h1>
      <StatusesList statuses={statuses} />
    </div>
  );
};

export default StatusesAdminPage;
