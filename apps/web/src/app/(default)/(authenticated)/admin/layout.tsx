import { SidebarInset, SidebarProvider } from "@kokatsuna/ui";
import { connection } from "next/server";

import { ClientAnimate } from "@/components/utils/ClientAnimate";
import { assertAdmin } from "@/utils/auth";

import { AdminSideMenu } from "./AdminSideMenu";

const AdminLayout = async ({ children }: LayoutProps<"/admin">) => {
  await connection();
  await assertAdmin();

  return (
    <SidebarProvider>
      <AdminSideMenu />
      <SidebarInset>
        <div className="mx-auto max-w-7xl px-4 py-8">
          <ClientAnimate>{children}</ClientAnimate>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;
