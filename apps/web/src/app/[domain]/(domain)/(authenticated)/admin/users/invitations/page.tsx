import { getTranslations } from "next-intl/server";

import { auth } from "@/lib/next-auth/auth";
import { invitationRepo, userOnTenantRepo } from "@/lib/repo";
import { UserRole } from "@/prisma/enums";
import { ListInvitationsForTenant } from "@/useCases/invitations/ListInvitationsForTenant";

import { DomainPageHOP } from "../../../../DomainPage";
import { InvitationsList } from "./InvitationsList";

const InvitationsAdminPage = DomainPageHOP()(async props => {
  const { tenant } = props._data;
  const useCase = new ListInvitationsForTenant(invitationRepo);
  const [invitations, session, t] = await Promise.all([
    useCase.execute({ tenantId: tenant.id }),
    auth(),
    getTranslations("domainAdmin.invitations"),
  ]);

  let isOwner = false;
  if (session?.user) {
    if (session.user.isSuperAdmin) {
      isOwner = true;
    } else {
      const membership = await userOnTenantRepo.findMembership(session.user.uuid, tenant.id);
      isOwner = membership?.role === UserRole.OWNER;
    }
  }

  return (
    <div>
      <h1>{t("title")}</h1>
      <InvitationsList invitations={invitations} isOwner={isOwner} />
    </div>
  );
});

export default InvitationsAdminPage;
