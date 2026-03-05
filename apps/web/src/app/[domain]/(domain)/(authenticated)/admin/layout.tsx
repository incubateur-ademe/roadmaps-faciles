import { SidebarInset, SidebarProvider } from "@kokatsuna/ui";

import { ClientAnimate } from "@/components/utils/ClientAnimate";
import { UIProvider } from "@/ui/UIContext";
import { assertTenantAdmin } from "@/utils/auth";

import { AdminSideMenu } from "./AdminSideMenu";

const TenantAdminLayout = async ({ children, params }: LayoutProps<"/[domain]/admin">) => {
  await assertTenantAdmin((await params).domain);

  return (
    <UIProvider value="Default">
      <SidebarProvider>
        <AdminSideMenu />
        <SidebarInset>
          <div className="mx-auto max-w-7xl px-4 py-8">
            <ClientAnimate>{children}</ClientAnimate>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </UIProvider>
  );
};

export default TenantAdminLayout;
