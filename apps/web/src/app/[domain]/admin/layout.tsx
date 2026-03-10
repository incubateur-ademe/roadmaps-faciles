import { SidebarInset, SidebarProvider } from "@kokatsuna/ui";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";

import { prisma } from "@/lib/db/prisma";
import { POST_APPROVAL_STATUS } from "@/lib/model/Post";
import { auth } from "@/lib/next-auth/auth";
import { DefaultThemeForcer } from "@/ui/DefaultThemeForcer";
import { UIProvider } from "@/ui/UIContext";
import { assertTenantAdmin } from "@/utils/auth";
import { getTenantFromDomain } from "@/utils/tenant";

import { AdminSideMenu } from "./AdminSideMenu";

const TenantAdminLayout = async ({ children, params }: LayoutProps<"/[domain]/admin">) => {
  await connection();
  const session = await auth();
  if (!session) redirect("/login");

  const pathname = (await headers()).get("x-pathname") || "";
  if (session.twoFactorRequired && !session.user.twoFactorEnabled && !pathname.startsWith("/profile/security")) {
    redirect("/profile/security");
  }
  if (session.twoFactorRequired && !session.twoFactorVerified) {
    redirect("/2fa");
  }

  const { domain } = await params;
  await assertTenantAdmin(domain);

  const tenant = await getTenantFromDomain(domain);
  const [pendingModerationCount, tenantSettings] = await Promise.all([
    prisma.post.count({
      where: { tenantId: tenant.id, approvalStatus: POST_APPROVAL_STATUS.PENDING },
    }),
    prisma.tenantSettings.findUniqueOrThrow({
      where: { tenantId: tenant.id },
      select: { name: true },
    }),
  ]);

  return (
    <UIProvider value="Default">
      <DefaultThemeForcer />
      <SidebarProvider>
        <AdminSideMenu tenantName={tenantSettings.name} pendingModerationCount={pendingModerationCount} />
        <SidebarInset id="content" className="max-h-svh overflow-x-hidden overflow-y-auto">
          <div className="px-6 py-8 lg:px-8">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </UIProvider>
  );
};

export default TenantAdminLayout;
