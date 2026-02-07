import { auth } from "@/lib/next-auth/auth";
import { userOnTenantRepo } from "@/lib/repo";
import { ListUsersForTenant } from "@/useCases/user_on_tenant/ListUsersForTenant";

import { DomainPageHOP } from "../../../DomainPage";
import { MembersList } from "./MembersList";

const MembersAdminPage = DomainPageHOP()(async props => {
  const { tenant } = props._data;
  const session = await auth();

  const useCase = new ListUsersForTenant(userOnTenantRepo);
  const members = await useCase.execute({ tenantId: tenant.id });

  return (
    <div>
      <h1>Membres</h1>
      <MembersList members={members} currentUserId={session?.user.uuid ?? ""} />
    </div>
  );
});

export default MembersAdminPage;
