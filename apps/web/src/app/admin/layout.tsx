import { SidebarInset, SidebarProvider } from "@kokatsuna/ui";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";

import { auth } from "@/lib/next-auth/auth";
import { UIProvider } from "@/ui/UIContext";
import { assertAdmin } from "@/utils/auth";

import { AdminSideMenu } from "./AdminSideMenu";

const AdminLayout = async ({ children }: LayoutProps<"/admin">) => {
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

  await assertAdmin();

  return (
    <UIProvider value="Default">
      <SidebarProvider>
        <AdminSideMenu />
        <SidebarInset id="content" className="max-h-svh overflow-x-hidden overflow-y-auto">
          <div className="px-6 py-8 lg:px-8">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </UIProvider>
  );
};

export default AdminLayout;
