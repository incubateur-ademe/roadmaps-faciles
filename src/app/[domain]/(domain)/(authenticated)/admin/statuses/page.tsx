import { connection } from "next/server";

import { postStatusRepo } from "@/lib/repo";
import { getServerService } from "@/lib/services";
import { ListPostStatuses } from "@/useCases/post_statuses/ListPostStatuses";

import { StatusesList } from "./StatusesList";

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
