import { SidebarInset, SidebarProvider } from "@kokatsuna/ui";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";

import { ClientAnimate } from "@/components/utils/ClientAnimate";
import { auth } from "@/lib/next-auth/auth";
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
    <SidebarProvider>
      <AdminSideMenu />
      <SidebarInset id="content" className="overflow-auto">
        <div className="mx-auto w-full max-w-7xl px-4 py-8">
          <ClientAnimate>{children}</ClientAnimate>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;
