import { Container } from "@/dsfr";
import { auth } from "@/lib/next-auth/auth";
import { userOnTenantRepo } from "@/lib/repo";
import { UserRole } from "@/prisma/enums";

import { DomainPageHOP } from "../../../DomainPage";
import { GeneralForm } from "./GeneralForm";

const AdminGeneralPage = DomainPageHOP()(async props => {
  const { settings, tenant } = props._data;

  const session = await auth();
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
    <Container fluid className="!overflow-visible">
      <GeneralForm tenantSettings={settings} isOwner={isOwner} />
    </Container>
  );
});

export default AdminGeneralPage;
