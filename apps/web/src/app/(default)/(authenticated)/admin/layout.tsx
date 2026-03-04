import { connection } from "next/server";

import { ClientAnimate } from "@/components/utils/ClientAnimate";
import { assertAdmin } from "@/utils/auth";

import { AdminSideMenu } from "./AdminSideMenu";

const AdminLayout = async ({ children }: LayoutProps<"/admin">) => {
  await connection();
  await assertAdmin();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex gap-8">
        <div className="sticky top-4 hidden w-56 shrink-0 self-start md:block">
          <AdminSideMenu />
        </div>
        <div className="min-w-0 flex-1">
          <ClientAnimate>{children}</ClientAnimate>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
