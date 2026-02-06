import dynamic from "next/dynamic";
import { connection } from "next/server";

import { invitationRepo } from "@/lib/repo";
import { getServerService } from "@/lib/services";
import { ListInvitationsForTenant } from "@/useCases/invitations/ListInvitationsForTenant";

// Lazy load admin list to reduce bundle size
const InvitationsList = dynamic(() => import("./InvitationsList").then(m => ({ default: m.InvitationsList })), {
  ssr: false,
});

const InvitationsAdminPage = async () => {
  await connection();
  const { tenant } = await getServerService("current");
  const useCase = new ListInvitationsForTenant(invitationRepo);
  const invitations = await useCase.execute({ tenantId: tenant.id });

  return (
    <div>
      <h1>Invitations</h1>
      <InvitationsList invitations={invitations} />
    </div>
  );
};

export default InvitationsAdminPage;
