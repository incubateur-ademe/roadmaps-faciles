import { invitationRepo } from "@/lib/repo";
import { ListInvitationsForTenant } from "@/useCases/invitations/ListInvitationsForTenant";

import { DomainPageHOP } from "../../../DomainPage";
import { InvitationsList } from "./InvitationsList";

const InvitationsAdminPage = DomainPageHOP()(async props => {
  const { tenant } = props._data;
  const useCase = new ListInvitationsForTenant(invitationRepo);
  const invitations = await useCase.execute({ tenantId: tenant.id });

  return (
    <div>
      <h1>Invitations</h1>
      <InvitationsList invitations={invitations} />
    </div>
  );
});

export default InvitationsAdminPage;
